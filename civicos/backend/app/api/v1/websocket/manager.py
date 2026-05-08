"""
CivicOS — WebSocket Connection Manager

Manages the lifecycle of WebSocket connections with per-user tracking,
broadcast support, direct messaging, and clean disconnect handling.

This is infrastructure-only — no business logic.
"""

from __future__ import annotations

import asyncio
import contextlib
from collections import defaultdict
from typing import Any

from fastapi import WebSocket  # noqa: TCH002

from app.core.constants import (
    WS_MESSAGE_TYPE_BROADCAST,
    WS_MESSAGE_TYPE_DIRECT,
    WS_MESSAGE_TYPE_ERROR,
    WS_MESSAGE_TYPE_PONG,
)
from app.core.logging import get_logger

log = get_logger(__name__)


class ConnectionManager:
    """
    Thread-safe WebSocket connection manager.

    Tracks connections per user and supports:
    - single-user direct messaging
    - room/channel broadcasting
    - system-wide broadcasting
    - graceful disconnection
    """

    def __init__(self) -> None:
        # user_id → list of active WebSocket connections
        self._user_connections: dict[str, list[WebSocket]] = defaultdict(list)
        # channel → set of user_ids subscribed
        self._channels: dict[str, set[str]] = defaultdict(set)
        self._lock = asyncio.Lock()

    # ── Connection lifecycle ───────────────────────────────────────────────

    async def connect(self, websocket: WebSocket, user_id: str) -> None:
        """Accept a new WebSocket connection and register it for *user_id*."""
        await websocket.accept()
        async with self._lock:
            self._user_connections[user_id].append(websocket)
        log.info(
            "ws_connected",
            user_id=user_id,
            total_connections=self.total_connections,
        )

    async def disconnect(self, websocket: WebSocket, user_id: str) -> None:
        """Remove *websocket* from the registry and clean up empty entries."""
        async with self._lock:
            conns = self._user_connections.get(user_id, [])
            if websocket in conns:
                conns.remove(websocket)
            if not conns:
                self._user_connections.pop(user_id, None)
                # Remove user from all channels
                for members in self._channels.values():
                    members.discard(user_id)
        log.info(
            "ws_disconnected",
            user_id=user_id,
            total_connections=self.total_connections,
        )

    # ── Channels ───────────────────────────────────────────────────────────

    async def subscribe(self, user_id: str, channel: str) -> None:
        async with self._lock:
            self._channels[channel].add(user_id)
        log.debug("ws_subscribed", user_id=user_id, channel=channel)

    async def unsubscribe(self, user_id: str, channel: str) -> None:
        async with self._lock:
            self._channels[channel].discard(user_id)
        log.debug("ws_unsubscribed", user_id=user_id, channel=channel)

    # ── Messaging ──────────────────────────────────────────────────────────

    async def send_to_user(self, user_id: str, payload: dict[str, Any]) -> int:
        """
        Send *payload* to all connections belonging to *user_id*.

        Returns the number of connections that were successfully notified.
        """
        connections = list(self._user_connections.get(user_id, []))
        sent = 0
        for ws in connections:
            try:
                await ws.send_json({**payload, "type": WS_MESSAGE_TYPE_DIRECT})
                sent += 1
            except Exception as exc:
                log.warning("ws_send_failed", user_id=user_id, error=str(exc))
        return sent

    async def broadcast_to_channel(
        self, channel: str, payload: dict[str, Any], exclude_user: str | None = None
    ) -> int:
        """
        Broadcast *payload* to all users subscribed to *channel*.

        Returns the number of users notified.
        """
        members = set(self._channels.get(channel, set()))
        if exclude_user:
            members.discard(exclude_user)
        sent = 0
        for user_id in members:
            sent += await self.send_to_user(user_id, {**payload, "type": WS_MESSAGE_TYPE_BROADCAST})
        return sent

    async def broadcast_to_all(self, payload: dict[str, Any]) -> int:
        """
        Broadcast *payload* to every connected user.

        Returns the number of users notified.
        """
        user_ids = list(self._user_connections.keys())
        sent = 0
        for user_id in user_ids:
            sent += await self.send_to_user(user_id, {**payload, "type": WS_MESSAGE_TYPE_BROADCAST})
        return sent

    async def broadcast(self, payload: dict[str, Any]) -> int:
        """Alias for broadcast_to_all."""
        return await self.broadcast_to_all(payload)

    async def send_error(self, websocket: WebSocket, message: str, code: int = 4000) -> None:
        """Send a structured error frame to a single connection."""
        with contextlib.suppress(Exception):
            await websocket.send_json(
                {"type": WS_MESSAGE_TYPE_ERROR, "code": code, "message": message}
            )

    async def pong(self, websocket: WebSocket) -> None:
        """Respond to a ping with a pong frame."""
        with contextlib.suppress(Exception):
            await websocket.send_json({"type": WS_MESSAGE_TYPE_PONG})

    # ── Introspection ──────────────────────────────────────────────────────

    @property
    def total_connections(self) -> int:
        return sum(len(conns) for conns in self._user_connections.values())

    @property
    def connected_users(self) -> list[str]:
        return list(self._user_connections.keys())

    def user_connection_count(self, user_id: str) -> int:
        return len(self._user_connections.get(user_id, []))


# ── Module-level singleton ─────────────────────────────────────────────────

manager = ConnectionManager()
connection_manager = manager