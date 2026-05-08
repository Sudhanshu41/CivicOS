"""
Tests — WebSocket Connection Manager

Unit tests for ConnectionManager — no live WebSocket server needed.
Uses AsyncMock to simulate WebSocket instances.
"""

from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from app.api.v1.websocket.manager import ConnectionManager
from app.core.constants import WS_MESSAGE_TYPE_BROADCAST, WS_MESSAGE_TYPE_DIRECT


def make_ws() -> AsyncMock:
    """Return a mock WebSocket with async send_json and accept."""
    ws = AsyncMock()
    ws.accept = AsyncMock()
    ws.send_json = AsyncMock()
    return ws


@pytest.mark.unit
async def test_connect_registers_user() -> None:
    manager = ConnectionManager()
    ws = make_ws()

    await manager.connect(ws, "user-1")

    assert "user-1" in manager.connected_users
    assert manager.user_connection_count("user-1") == 1
    ws.accept.assert_awaited_once()


@pytest.mark.unit
async def test_disconnect_removes_user() -> None:
    manager = ConnectionManager()
    ws = make_ws()

    await manager.connect(ws, "user-1")
    await manager.disconnect(ws, "user-1")

    assert "user-1" not in manager.connected_users
    assert manager.total_connections == 0


@pytest.mark.unit
async def test_multiple_connections_same_user() -> None:
    manager = ConnectionManager()
    ws1, ws2 = make_ws(), make_ws()

    await manager.connect(ws1, "user-1")
    await manager.connect(ws2, "user-1")

    assert manager.user_connection_count("user-1") == 2
    assert manager.total_connections == 2


@pytest.mark.unit
async def test_send_to_user_delivers_message() -> None:
    manager = ConnectionManager()
    ws = make_ws()

    await manager.connect(ws, "user-1")
    sent = await manager.send_to_user("user-1", {"data": "hello"})

    assert sent == 1
    ws.send_json.assert_awaited_once()
    call_payload = ws.send_json.call_args[0][0]
    assert call_payload["type"] == WS_MESSAGE_TYPE_DIRECT
    assert call_payload["data"] == "hello"


@pytest.mark.unit
async def test_send_to_nonexistent_user_returns_zero() -> None:
    manager = ConnectionManager()
    sent = await manager.send_to_user("ghost", {"data": "x"})
    assert sent == 0


@pytest.mark.unit
async def test_broadcast_to_channel() -> None:
    manager = ConnectionManager()
    ws1, ws2 = make_ws(), make_ws()

    await manager.connect(ws1, "user-1")
    await manager.connect(ws2, "user-2")
    await manager.subscribe("user-1", "news")
    await manager.subscribe("user-2", "news")

    sent = await manager.broadcast_to_channel("news", {"text": "update"})

    assert sent == 2


@pytest.mark.unit
async def test_broadcast_excludes_sender() -> None:
    manager = ConnectionManager()
    ws1, ws2 = make_ws(), make_ws()

    await manager.connect(ws1, "user-1")
    await manager.connect(ws2, "user-2")
    await manager.subscribe("user-1", "room")
    await manager.subscribe("user-2", "room")

    sent = await manager.broadcast_to_channel("room", {"text": "x"}, exclude_user="user-1")

    assert sent == 1
    ws1.send_json.assert_not_awaited()
    ws2.send_json.assert_awaited_once()


@pytest.mark.unit
async def test_broadcast_to_all() -> None:
    manager = ConnectionManager()
    ws1, ws2, ws3 = make_ws(), make_ws(), make_ws()

    for uid, ws in [("u1", ws1), ("u2", ws2), ("u3", ws3)]:
        await manager.connect(ws, uid)

    sent = await manager.broadcast_to_all({"msg": "system"})
    assert sent == 3


@pytest.mark.unit
async def test_pong_sends_correct_frame() -> None:
    manager = ConnectionManager()
    ws = make_ws()

    await manager.pong(ws)

    ws.send_json.assert_awaited_once_with({"type": "pong"})


@pytest.mark.unit
async def test_unsubscribe_removes_from_channel() -> None:
    manager = ConnectionManager()
    ws = make_ws()

    await manager.connect(ws, "user-1")
    await manager.subscribe("user-1", "alerts")
    await manager.unsubscribe("user-1", "alerts")

    sent = await manager.broadcast_to_channel("alerts", {"x": 1})
    assert sent == 0
