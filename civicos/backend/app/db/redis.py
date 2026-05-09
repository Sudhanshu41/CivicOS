"""
CivicOS — Redis Client & Cache Utilities

Provides a connection-pool-backed Redis client and lightweight
async caching helpers.  All Redis access must go through the
``get_redis`` dependency or the ``redis_client`` singleton.
"""

from __future__ import annotations

from typing import TYPE_CHECKING

import redis.asyncio as aioredis

from app.core.config import settings
from app.core.logging import get_logger

if TYPE_CHECKING:
    from collections.abc import AsyncGenerator

    from redis.asyncio import Redis

log = get_logger(__name__)

# ── Global client singleton (initialised on startup) ───────────────────────

redis_client: Redis | None = None


async def init_redis() -> Redis | None:
    """
    Create and store the global Redis client.
    Does not raise exceptions on connection failure; instead logs a warning.
    """
    global redis_client
    try:
        redis_client = await aioredis.from_url(
            settings.REDIS_URL,
            max_connections=settings.REDIS_MAX_CONNECTIONS,
            decode_responses=True,
            encoding="utf-8",
        )
        # Test connection
        await redis_client.ping()
        log.info("redis_connected", url=settings.REDIS_URL)
    except Exception as exc:
        log.warning("redis_connection_failed", url=settings.REDIS_URL, error=str(exc))
        redis_client = None
        
    return redis_client


async def close_redis() -> None:
    """Gracefully close all Redis connections on application shutdown."""
    global redis_client
    if redis_client is not None:
        await redis_client.close()
        redis_client = None
        log.info("redis_closed")


# ── FastAPI dependency ─────────────────────────────────────────────────────


async def get_redis() -> AsyncGenerator[Redis, None]:
    """
    FastAPI dependency that yields the Redis client.

    Usage
    -----
        @router.get("/")
        async def endpoint(cache: Redis = Depends(get_redis)):
            ...
    """
    if redis_client is None:
        raise RuntimeError("Redis client is not initialised. Call init_redis() first.")
    yield redis_client


# ── Health helper ──────────────────────────────────────────────────────────


async def check_redis_connection() -> bool:
    """Return ``True`` if Redis is reachable."""
    try:
        if redis_client is None:
            return False
        await redis_client.ping()
        return True
    except Exception as exc:
        log.warning("redis_health_check_failed", error=str(exc))
        return False
