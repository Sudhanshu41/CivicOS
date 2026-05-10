"""
CivicOS — API v1 Router

Central aggregation point for all v1 API routers.
Add new domain routers here — never in main.py.
"""

from __future__ import annotations

from fastapi import APIRouter

from app.api.v1.routes.health import router as health_router
from app.api.v1.routes.civic_issue import router as civic_issue_router
from app.api.v1.websocket.endpoints import router as ws_router

api_router = APIRouter()

# ── Registered routers ─────────────────────────────────────────────────────
# fmt: off
api_router.include_router(health_router)          # GET /  /health  /version
api_router.include_router(ws_router)              # WS  /ws/{user_id}
api_router.include_router(civic_issue_router)      # POST /civic-issues/analyze
# fmt: on

# Future routers (uncomment when implemented):
# api_router.include_router(auth_router,   prefix="/auth",    tags=["Auth"])
# api_router.include_router(users_router,  prefix="/users",   tags=["Users"])
# api_router.include_router(agents_router, prefix="/agents",  tags=["Agents"])
