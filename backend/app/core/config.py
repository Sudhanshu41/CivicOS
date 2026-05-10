"""
CivicOS — Core Configuration
Centralised environment management via pydantic-settings.
All settings are strongly typed, env-file aware, and environment-isolated.
"""

from __future__ import annotations

from enum import Enum
from functools import lru_cache

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Environment(str, Enum):
    """Deployment environment discriminators."""

    DEVELOPMENT = "development"
    STAGING = "staging"
    PRODUCTION = "production"
    TESTING = "testing"


class Settings(BaseSettings):
    """
    Application settings loaded from the environment / .env file.

    Precedence (highest → lowest):
        1. Process environment variables
        2. .env file
        3. Field defaults
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ── Application ────────────────────────────────────────────────────────
    APP_NAME: str = "CivicOS"
    APP_VERSION: str = "0.1.0"
    APP_DESCRIPTION: str = "AI Operating System — Production-Grade Backend"

    ENVIRONMENT: Environment = Environment.DEVELOPMENT
    DEBUG: bool = False

    # ── API ────────────────────────────────────────────────────────────────
    API_V1_PREFIX: str = "/api/v1"

    ALLOWED_HOSTS: list[str] = ["*"]
    ALLOWED_ORIGINS: list[str] = ["*"]

    # ── Database ───────────────────────────────────────────────────────────
    DATABASE_URL: str = (
        "postgresql+asyncpg://civicos:civicos@localhost:5432/civicos"
    )

    DATABASE_POOL_SIZE: int = 10
    DATABASE_MAX_OVERFLOW: int = 20
    DATABASE_POOL_TIMEOUT: int = 30
    DATABASE_ECHO: bool = False

    # ── Redis ──────────────────────────────────────────────────────────────
    REDIS_URL: str = "redis://localhost:6379/0"
    REDIS_MAX_CONNECTIONS: int = 20

    # ── Security ───────────────────────────────────────────────────────────
    SECRET_KEY: str = (
        "CHANGE-ME-IN-PRODUCTION-USE-A-STRONG-RANDOM-KEY"
    )

    JWT_ALGORITHM: str = "HS256"

    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    # ── AI / Gemini ────────────────────────────────────────────────────────
    GEMINI_API_KEY: str = ""

    # Main production model
    GEMINI_MODEL_ID: str = "gemini-2.5-pro"

    # Optional lightweight/fallback model
    GEMINI_FAST_MODEL_ID: str = "gemini-2.5-flash"

    GEMINI_TEMPERATURE: float = 0.7
    GEMINI_MAX_TOKENS: int = 8192

    # AI Runtime Controls
    AI_REQUEST_TIMEOUT_SECONDS: int = 60
    AI_MAX_RETRIES: int = 3
    AI_RETRY_BACKOFF_SECONDS: float = 2.0

    # ── WebSocket ──────────────────────────────────────────────────────────
    WS_HEARTBEAT_INTERVAL: int = 30
    WS_MAX_CONNECTIONS_PER_USER: int = 5

    # ── Logging ────────────────────────────────────────────────────────────
    LOG_LEVEL: str = "INFO"

    # "json" | "console"
    LOG_FORMAT: str = "json"

    # ── Pagination ─────────────────────────────────────────────────────────
    DEFAULT_PAGE_SIZE: int = 20
    MAX_PAGE_SIZE: int = 100

    # ── Feature Flags ──────────────────────────────────────────────────────
    ENABLE_DOCS: bool = True

    # ── Observability ──────────────────────────────────────────────────────
    ENABLE_TELEMETRY: bool = True
    ENABLE_AI_TRACING: bool = True

    # ── Environment Helpers ────────────────────────────────────────────────
    @property
    def is_development(self) -> bool:
        return self.ENVIRONMENT == Environment.DEVELOPMENT

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT == Environment.PRODUCTION

    @property
    def is_staging(self) -> bool:
        return self.ENVIRONMENT == Environment.STAGING

    @field_validator("LOG_LEVEL")
    @classmethod
    def validate_log_level(cls, v: str) -> str:
        allowed = {"DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"}
        upper = v.upper()
        if upper not in allowed:
            raise ValueError(f"LOG_LEVEL must be one of {allowed}")
        return upper

    # ── Derived helpers ────────────────────────────────────────────────────
    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT == Environment.PRODUCTION

    @property
    def is_development(self) -> bool:
        return self.ENVIRONMENT == Environment.DEVELOPMENT

    @property
    def is_testing(self) -> bool:
        return self.ENVIRONMENT == Environment.TESTING

    @property
    def docs_url(self) -> str | None:
        return "/docs" if self.ENABLE_DOCS else None

    @property
    def redoc_url(self) -> str | None:
        return "/redoc" if self.ENABLE_DOCS else None


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """
    Return a cached Settings singleton.
    Use ``get_settings()`` everywhere; never instantiate Settings directly.
    """
    return Settings()


# Re-export for ergonomic imports: ``from app.core.config import settings``
settings: Settings = get_settings()
