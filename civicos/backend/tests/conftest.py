"""
CivicOS Tests — Conftest

Shared async fixtures, test database setup, and mock Redis.
All tests in this suite are async-first (asyncio_mode = "auto").
"""

from __future__ import annotations

import asyncio
from collections.abc import AsyncGenerator
from typing import Any

import pytest
from fastapi import FastAPI
from httpx import ASGITransport, AsyncClient


@pytest.fixture(scope="session")
def event_loop_policy() -> asyncio.DefaultEventLoopPolicy:
    """Use the default event loop policy for the test session."""
    return asyncio.DefaultEventLoopPolicy()


@pytest.fixture()
async def app() -> FastAPI:
    """Return the FastAPI application configured for testing."""
    import os
    os.environ.setdefault("ENVIRONMENT", "testing")
    os.environ.setdefault("DATABASE_URL", "postgresql+asyncpg://civicos:civicos@localhost:5432/civicos_test")
    os.environ.setdefault("REDIS_URL", "redis://localhost:6379/1")  # DB 1 for tests

    from app.main import create_application
    return create_application()


@pytest.fixture()
async def client(app: FastAPI) -> AsyncGenerator[AsyncClient, None]:
    """
    Async HTTP test client.

    Usage
    -----
        async def test_health(client):
            resp = await client.get("/api/v1/health")
            assert resp.status_code == 200
    """
    async with AsyncClient(
        transport=ASGITransport(app=app),  # type: ignore[arg-type]
        base_url="http://test",
    ) as ac:
        yield ac
