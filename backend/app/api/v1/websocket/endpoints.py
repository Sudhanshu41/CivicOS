"""
CivicOS — WebSocket Endpoints (v1)

Production-ready WebSocket endpoint wired to the connection manager.
Handles lifecycle, ping/pong keep-alives, and clean disconnects.
"""

from __future__ import annotations

from fastapi import APIRouter, Path, WebSocket, WebSocketDisconnect

from app.api.v1.websocket.manager import connection_manager
from app.core.constants import WS_MESSAGE_TYPE_PING
from app.core.logging import get_logger

log = get_logger(__name__)

router = APIRouter()


@router.websocket("/ws/{user_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    user_id: str = Path(..., description="Authenticated user identifier"),
) -> None:
    """
    Main WebSocket endpoint.

    Clients connect at: ``ws://host/api/v1/ws/{user_id}``

    Protocol
    --------
    * Client MUST send ``{"type": "ping"}`` to keep the connection alive.
    * Server responds with ``{"type": "pong"}``.
    * All other message routing is handled by the ConnectionManager.
    """
    await connection_manager.connect(websocket, user_id)
    try:
        while True:
            data = await websocket.receive_json()
            msg_type = data.get("type", "")

            if msg_type == WS_MESSAGE_TYPE_PING:
                await connection_manager.pong(websocket)

            # Future: dispatch data to domain-specific handlers

    except WebSocketDisconnect:
        log.info("ws_client_disconnected", user_id=user_id)
    except Exception as exc:
        log.error("ws_unexpected_error", user_id=user_id, error=str(exc))
        await connection_manager.send_error(websocket, "Internal server error", code=5000)
    finally:
        await connection_manager.disconnect(websocket, user_id)
