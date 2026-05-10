"""
Tests — Configuration System

Validates that pydantic-settings correctly loads, validates, and
exposes all required settings.  No I/O or live services needed.
"""

from __future__ import annotations

import pytest

from app.core.config import Environment, Settings, get_settings


@pytest.mark.unit
def test_settings_singleton() -> None:
    """get_settings() must always return the same instance."""
    s1 = get_settings()
    s2 = get_settings()
    assert s1 is s2


@pytest.mark.unit
def test_default_api_prefix() -> None:
    s = Settings(
        DATABASE_URL="postgresql+asyncpg://u:p@localhost/db",
        SECRET_KEY="test-key",
    )
    assert s.API_V1_PREFIX == "/api/v1"


@pytest.mark.unit
def test_is_development_flag() -> None:
    s = Settings(
        ENVIRONMENT=Environment.DEVELOPMENT,
        DATABASE_URL="postgresql+asyncpg://u:p@localhost/db",
        SECRET_KEY="test-key",
    )
    assert s.is_development is True
    assert s.is_production is False
    assert s.is_testing is False


@pytest.mark.unit
def test_is_production_flag() -> None:
    s = Settings(
        ENVIRONMENT=Environment.PRODUCTION,
        DATABASE_URL="postgresql+asyncpg://u:p@localhost/db",
        SECRET_KEY="test-key",
    )
    assert s.is_production is True


@pytest.mark.unit
def test_docs_disabled_in_production() -> None:
    s = Settings(
        ENVIRONMENT=Environment.PRODUCTION,
        ENABLE_DOCS=False,
        DATABASE_URL="postgresql+asyncpg://u:p@localhost/db",
        SECRET_KEY="test-key",
    )
    assert s.docs_url is None
    assert s.redoc_url is None


@pytest.mark.unit
def test_invalid_log_level_raises() -> None:
    with pytest.raises(Exception):
        Settings(
            LOG_LEVEL="VERBOSE",
            DATABASE_URL="postgresql+asyncpg://u:p@localhost/db",
            SECRET_KEY="test-key",
        )


@pytest.mark.unit
def test_log_level_normalised_to_uppercase() -> None:
    s = Settings(
        LOG_LEVEL="debug",
        DATABASE_URL="postgresql+asyncpg://u:p@localhost/db",
        SECRET_KEY="test-key",
    )
    assert s.LOG_LEVEL == "DEBUG"
