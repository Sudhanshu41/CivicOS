"""
CivicOS — Application-Wide Constants

Immutable values that do not belong in configuration (env-agnostic).
Group by domain for discoverability.
"""

from __future__ import annotations

# ── API ────────────────────────────────────────────────────────────────────
API_VERSION = "v1"
API_TITLE = "CivicOS API"

# ── Health ─────────────────────────────────────────────────────────────────
HEALTH_OK = "ok"
HEALTH_DEGRADED = "degraded"
HEALTH_DOWN = "down"

# ── WebSocket ──────────────────────────────────────────────────────────────
WS_MESSAGE_TYPE_PING = "ping"
WS_MESSAGE_TYPE_PONG = "pong"
WS_MESSAGE_TYPE_ERROR = "error"
WS_MESSAGE_TYPE_BROADCAST = "broadcast"
WS_MESSAGE_TYPE_DIRECT = "direct"

# ── Auth ───────────────────────────────────────────────────────────────────
TOKEN_TYPE_BEARER = "bearer"  # noqa: S105
TOKEN_TYPE_REFRESH = "refresh"  # noqa: S105

# ── Events ─────────────────────────────────────────────────────────────────
EVENT_APP_STARTUP = "app:startup"
EVENT_APP_SHUTDOWN = "app:shutdown"

# ── Pagination ─────────────────────────────────────────────────────────────
PAGINATION_CURSOR_FIELD = "created_at"

# ── Cache TTL (seconds) ────────────────────────────────────────────────────
CACHE_TTL_SHORT = 60  # 1 minute
CACHE_TTL_MEDIUM = 300  # 5 minutes
CACHE_TTL_LONG = 3_600  # 1 hour
CACHE_TTL_DAY = 86_400  # 24 hours

# ── Rate Limiting ──────────────────────────────────────────────────────────
RATE_LIMIT_DEFAULT_RPM = 60  # requests per minute
RATE_LIMIT_AI_ENDPOINT_RPM = 10  # AI-heavy endpoint budget

# ── Content Types ──────────────────────────────────────────────────────────
CONTENT_TYPE_JSON = "application/json"
CONTENT_TYPE_EVENT_STREAM = "text/event-stream"
