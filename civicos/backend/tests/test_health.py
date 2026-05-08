"""
Tests — Health endpoints

Verifies the root, health, and version endpoints are reachable
and return expected shapes.  These run against the real app but
stub out backing services so no DB/Redis is required.
"""

from __future__ import annotations

from unittest.mock import AsyncMock, patch

import pytest
from httpx import AsyncClient


@pytest.mark.unit
async def test_root_returns_200(client: AsyncClient) -> None:
    response = await client.get("/api/v1/")
    assert response.status_code == 200


@pytest.mark.unit
async def test_root_body(client: AsyncClient) -> None:
    response = await client.get("/api/v1/")
    data = response.json()
    assert "app" in data
    assert "version" in data


@pytest.mark.unit
async def test_version_endpoint(client: AsyncClient) -> None:
    response = await client.get("/api/v1/version")
    assert response.status_code == 200
    data = response.json()
    assert data["api_prefix"] == "/api/v1"


@pytest.mark.unit
async def test_health_endpoint_structure(client: AsyncClient) -> None:
    """Health endpoint must return status and services list."""
    with (
        patch("app.db.session.check_db_connection", new_callable=AsyncMock, return_value=True),
        patch("app.db.redis.check_redis_connection", new_callable=AsyncMock, return_value=True),
    ):
        response = await client.get("/api/v1/health")

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert isinstance(data["services"], list)
    assert len(data["services"]) >= 2


@pytest.mark.unit
async def test_health_endpoint_degraded(client: AsyncClient) -> None:
    """Health endpoint should report degraded when a service is down."""
    with (
        patch("app.db.session.check_db_connection", new_callable=AsyncMock, return_value=False),
        patch("app.db.redis.check_redis_connection", new_callable=AsyncMock, return_value=True),
    ):
        response = await client.get("/api/v1/health")

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "degraded"
