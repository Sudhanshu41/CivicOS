"""
CivicOS — Database Engine & Session Factory

Async SQLAlchemy engine configured for PostgreSQL via asyncpg.
All database interaction must go through the async session dependency.
"""

from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase

from app.core.config import settings
from app.core.logging import get_logger

if TYPE_CHECKING:
    from collections.abc import AsyncGenerator

log = get_logger(__name__)


# ── Engine ─────────────────────────────────────────────────────────────────


def _create_engine() -> AsyncEngine:
    return create_async_engine(
        settings.DATABASE_URL,
        echo=settings.DATABASE_ECHO,
        pool_size=settings.DATABASE_POOL_SIZE,
        max_overflow=settings.DATABASE_MAX_OVERFLOW,
        pool_timeout=settings.DATABASE_POOL_TIMEOUT,
        pool_pre_ping=True,  # verify connections before use
        pool_recycle=3_600,  # recycle connections hourly
        future=True,
    )


engine: AsyncEngine = _create_engine()

# ── Session factory ────────────────────────────────────────────────────────

AsyncSessionLocal: async_sessionmaker[AsyncSession] = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


# ── Declarative base ───────────────────────────────────────────────────────


class Base(DeclarativeBase):
    """
    Shared declarative base for all ORM models.

    All models must subclass this to participate in Alembic migrations
    and SQLAlchemy relationship resolution.
    """

    __abstract__ = True


# ── Session dependency ─────────────────────────────────────────────────────


async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    """
    FastAPI dependency that yields a transactional async DB session.

    The session is automatically committed on success and rolled back
    on any unhandled exception.

    Usage
    -----
        @router.get("/")
        async def endpoint(db: AsyncSession = Depends(get_db_session)):
            ...
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


# ── Lifecycle helpers ──────────────────────────────────────────────────────


async def check_db_connection() -> bool:
    """Return ``True`` if the database is reachable."""
    try:
        async with engine.connect() as conn:
            await conn.execute(__import__("sqlalchemy").text("SELECT 1"))
        return True
    except Exception as exc:
        log.warning("db_health_check_failed", error=str(exc))
        return False
