# Triggering reload for state reducer stability
"""
CivicOS — FastAPI Application Factory

Assembles the production-grade FastAPI application:
- async lifespan (startup/shutdown)
- CORS / trusted host middleware
- versioned API routing
- global exception handling
- structured logging initialisation
"""

from __future__ import annotations

import os
import sys
import importlib.util
from contextlib import asynccontextmanager
from typing import TYPE_CHECKING

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

from app.api.v1.router import api_router
from app.core.config import settings
from app.core.constants import EVENT_APP_SHUTDOWN, EVENT_APP_STARTUP
from app.core.exceptions import register_exception_handlers
from app.core.logging import configure_logging, get_logger
from app.core.middleware import RequestContextMiddleware
from app.db.redis import close_redis, init_redis
from app.db.verification import verify_database_schema

if TYPE_CHECKING:
    from collections.abc import AsyncGenerator

log = get_logger(__name__)


def _log_runtime_info() -> None:
    """Log environment diagnostics to catch interpreter/dependency mismatches."""
    log.info(
        "runtime_diagnostics",
        pid=os.getpid(),
        python_executable=sys.executable,
        python_version=sys.version,
        sys_path=sys.path,
    )

    langgraph_spec = importlib.util.find_spec("langgraph")
    if langgraph_spec:
        log.info("dependency_resolved", package="langgraph", location=langgraph_spec.origin)
    else:
        log.error("dependency_missing", package="langgraph", help="Ensure langgraph is installed.")

    jose_spec = importlib.util.find_spec("jose")
    if jose_spec:
        log.info("dependency_resolved", package="python-jose", location=jose_spec.origin)
    else:
        log.error("dependency_missing", package="python-jose", help="Ensure python-jose is installed.")


# ── Lifespan ───────────────────────────────────────────────────────────────


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """
    Manage application startup and shutdown.

    Startup  → configure logging, connect Redis
    Shutdown → gracefully close all connections
    """
    # ── Startup ────────────────────────────────────────────────────────────
    configure_logging()
    _log_runtime_info()

    log.info(EVENT_APP_STARTUP, app=settings.APP_NAME, version=settings.APP_VERSION)

    await init_redis()

    # Verify database schema before allowing traffic
    await verify_database_schema()

    log.info("app_ready", environment=settings.ENVIRONMENT.value)

    yield  # ← application is running

    # ── Shutdown ───────────────────────────────────────────────────────────
    log.info(EVENT_APP_SHUTDOWN, app=settings.APP_NAME)
    await close_redis()
    log.info("app_stopped")


# ── Application factory ────────────────────────────────────────────────────


def create_application() -> FastAPI:
    """
    Construct and configure the FastAPI application.

    Returns a fully-wired ``FastAPI`` instance ready for serving.
    """
    app = FastAPI(
        title=settings.APP_NAME,
        description=settings.APP_DESCRIPTION,
        version=settings.APP_VERSION,
        docs_url=settings.docs_url,
        redoc_url=settings.redoc_url,
        openapi_url="/openapi.json" if settings.ENABLE_DOCS else None,
        lifespan=lifespan,
    )

    # ── Middleware (order matters: outermost applied last) ─────────────────
    # Request ID injection + structured access logging (always on)
    app.add_middleware(RequestContextMiddleware)

    if not settings.is_production:
        # Relaxed CORS for local development
        app.add_middleware(
            CORSMiddleware,
            allow_origins=settings.ALLOWED_ORIGINS,
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
    else:
        # Strict CORS + trusted hosts in production
        app.add_middleware(
            CORSMiddleware,
            allow_origins=settings.ALLOWED_ORIGINS,
            allow_credentials=True,
            allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
            allow_headers=["Authorization", "Content-Type", "X-Request-ID"],
        )
        app.add_middleware(
            TrustedHostMiddleware,
            allowed_hosts=settings.ALLOWED_HOSTS,
        )

    # ── Exception handlers ─────────────────────────────────────────────────
    register_exception_handlers(app)

    # ── API routing ────────────────────────────────────────────────────────
    app.include_router(api_router, prefix=settings.API_V1_PREFIX)

    return app


# ── Module-level app instance (used by uvicorn) ────────────────────────────
app: FastAPI = create_application()
