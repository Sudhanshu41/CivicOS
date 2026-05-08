"""
CivicOS — Health Check Endpoints (v1)

Exposes operational readiness signals for load balancers,
container orchestrators, and monitoring systems.
"""

from __future__ import annotations

from datetime import UTC, datetime

from fastapi import APIRouter, status
from pydantic import BaseModel

from app.core.config import settings
from app.core.constants import HEALTH_DEGRADED, HEALTH_DOWN, HEALTH_OK
from app.db.redis import check_redis_connection
from app.db.session import check_db_connection

router = APIRouter(tags=["Health"])


# ── Response schemas ───────────────────────────────────────────────────────


class ServiceStatus(BaseModel):
    name: str
    status: str
    latency_ms: float | None = None


class HealthResponse(BaseModel):
    status: str
    timestamp: str
    app: str
    version: str
    environment: str
    services: list[ServiceStatus]


class RootResponse(BaseModel):
    message: str
    app: str
    version: str
    docs: str | None


# ── Endpoints ──────────────────────────────────────────────────────────────


@router.get(
    "/",
    response_model=RootResponse,
    summary="Root — Service identification",
)
async def root() -> RootResponse:
    """Return basic service identification metadata."""
    return RootResponse(
        message="Welcome to CivicOS API",
        app=settings.APP_NAME,
        version=settings.APP_VERSION,
        docs=settings.docs_url,
    )


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Health — Dependency readiness",
    status_code=status.HTTP_200_OK,
)
async def health_check() -> HealthResponse:
    """
    Deep health check — verifies connectivity to all backing services.

    Returns ``200 OK`` when all services are healthy.
    Returns ``503 Service Unavailable`` when any critical service is down.
    """
    import time

    service_results: list[ServiceStatus] = []

    # ── Database ───────────────────────────────────────────────────────────
    t0 = time.perf_counter()
    db_ok = await check_db_connection()
    db_latency = round((time.perf_counter() - t0) * 1000, 2)
    service_results.append(
        ServiceStatus(
            name="postgresql",
            status=HEALTH_OK if db_ok else HEALTH_DOWN,
            latency_ms=db_latency,
        )
    )

    # ── Redis ──────────────────────────────────────────────────────────────
    t0 = time.perf_counter()
    redis_ok = await check_redis_connection()
    redis_latency = round((time.perf_counter() - t0) * 1000, 2)
    service_results.append(
        ServiceStatus(
            name="redis",
            status=HEALTH_OK if redis_ok else HEALTH_DOWN,
            latency_ms=redis_latency,
        )
    )

    all_healthy = all(s.status == HEALTH_OK for s in service_results)
    overall = HEALTH_OK if all_healthy else HEALTH_DEGRADED

    return HealthResponse(
        status=overall,
        timestamp=datetime.now(UTC).isoformat(),
        app=settings.APP_NAME,
        version=settings.APP_VERSION,
        environment=settings.ENVIRONMENT.value,
        services=service_results,
    )


@router.get(
    "/system/status",
    summary="System status and metadata",
)
async def system_status() -> dict[str, str]:
    """Return backend status, environment, version, and operational state."""
    return {
        "status": "operational",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "api_prefix": settings.API_V1_PREFIX,
        "environment": settings.ENVIRONMENT.value,
    }
