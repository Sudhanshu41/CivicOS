"""
CivicOS — Structured Logging

Uses structlog for structured, context-rich, JSON-capable logging.
All modules should obtain loggers via ``get_logger(__name__)``.

Usage
-----
    from app.core.logging import get_logger

    log = get_logger(__name__)
    log.info("event_name", key="value")
"""

from __future__ import annotations

import logging
import sys
from typing import TYPE_CHECKING, Any

import structlog

from app.core.config import settings

if TYPE_CHECKING:
    from structlog.types import EventDict, WrappedLogger

# ── Custom processors ──────────────────────────────────────────────────────


def _add_app_context(logger: WrappedLogger, method_name: str, event_dict: EventDict) -> EventDict:
    """Inject static application context into every log record."""
    event_dict.setdefault("app", settings.APP_NAME)
    event_dict.setdefault("version", settings.APP_VERSION)
    event_dict.setdefault("env", settings.ENVIRONMENT.value)
    return event_dict


def _drop_colour_message(
    logger: WrappedLogger, method_name: str, event_dict: EventDict
) -> EventDict:
    """Remove the ``_record`` key injected by stdlib when using structlog."""
    event_dict.pop("_record", None)
    event_dict.pop("_from_structlog", None)
    return event_dict


# ── Renderer selection ─────────────────────────────────────────────────────


def _build_renderer() -> Any:  # noqa: ANN401
    """Return JSON renderer for production, coloured console for dev."""
    if settings.LOG_FORMAT == "json" or settings.is_production:
        return structlog.processors.JSONRenderer()
    return structlog.dev.ConsoleRenderer(colors=True)


# ── Shared processor chain ─────────────────────────────────────────────────

SHARED_PROCESSORS: list[Any] = [
    structlog.contextvars.merge_contextvars,
    structlog.stdlib.add_logger_name,
    structlog.stdlib.add_log_level,
    structlog.processors.TimeStamper(fmt="iso", utc=True),
    structlog.processors.StackInfoRenderer(),
    _add_app_context,
    _drop_colour_message,
]


def configure_logging() -> None:
    """
    Bootstrap structlog and stdlib logging.

    Call once at application startup (in ``lifespan``).
    """
    # ── stdlib root logger ─────────────────────────────────────────────────
    log_level_int = getattr(logging, settings.LOG_LEVEL, logging.INFO)
    logging.basicConfig(
        format="%(message)s",
        stream=sys.stdout,
        level=log_level_int,
    )

    # Silence noisy third-party loggers in non-debug mode
    if not settings.DEBUG:
        for noisy in ("httpx", "httpcore"):
            logging.getLogger(noisy).setLevel(logging.WARNING)

    # ── structlog ──────────────────────────────────────────────────────────
    structlog.configure(
        processors=[
            *SHARED_PROCESSORS,
            structlog.stdlib.ProcessorFormatter.wrap_for_formatter,
        ],
        wrapper_class=structlog.make_filtering_bound_logger(log_level_int),
        context_class=dict,
        logger_factory=structlog.stdlib.LoggerFactory(),
        cache_logger_on_first_use=True,
    )

    formatter = structlog.stdlib.ProcessorFormatter(
        foreign_pre_chain=SHARED_PROCESSORS,
        processors=[
            structlog.stdlib.ProcessorFormatter.remove_processors_meta,
            _build_renderer(),
        ],
    )

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(formatter)

    root_logger = logging.getLogger()
    root_logger.handlers.clear()
    root_logger.addHandler(handler)
    root_logger.setLevel(log_level_int)


def get_logger(name: str | None = None) -> structlog.stdlib.BoundLogger:
    """
    Return a bound structlog logger.

    Parameters
    ----------
    name:
        Module name — pass ``__name__`` for automatic module attribution.
    """
    return structlog.get_logger(name)
