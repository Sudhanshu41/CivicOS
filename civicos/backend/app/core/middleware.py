"""
CivicOS — Request/Response Middleware

Adds production-grade middleware:
- X-Request-ID injection (tracing)
- Structured access logging
- Response time measurement
"""

from __future__ import annotations

import time
import uuid

import structlog
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request  # noqa: TCH002
from starlette.responses import Response  # noqa: TCH002
from starlette.types import ASGIApp  # noqa: TCH002

from app.core.logging import get_logger

log = get_logger(__name__)


class RequestContextMiddleware(BaseHTTPMiddleware):
    """
    Injects a unique ``X-Request-ID`` into every request/response cycle
    and binds it to the structlog context so all log lines emitted
    during a request automatically carry the request ID.
    """

    def __init__(self, app: ASGIApp, *, header_name: str = "X-Request-ID") -> None:
        super().__init__(app)
        self._header_name = header_name

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        request_id = request.headers.get(self._header_name) or str(uuid.uuid4())

        # Bind to structlog context for this task
        structlog.contextvars.clear_contextvars()
        structlog.contextvars.bind_contextvars(request_id=request_id)

        start = time.perf_counter()
        response = await call_next(request)
        elapsed_ms = round((time.perf_counter() - start) * 1000, 2)

        log.info(
            "http_request",
            method=request.method,
            path=request.url.path,
            status_code=response.status_code,
            duration_ms=elapsed_ms,
        )

        response.headers[self._header_name] = request_id
        return response
