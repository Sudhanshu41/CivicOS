"""
CivicOS — Global Exception Handlers

Registers structured, production-grade exception handlers on the
FastAPI application.  All error responses use the ``ErrorResponse``
schema so clients get a consistent envelope.
"""

from __future__ import annotations

import traceback
from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.config import settings
from app.core.logging import get_logger
from app.schemas.base import ErrorDetail, ErrorResponse

log = get_logger(__name__)


# ── Handler implementations ────────────────────────────────────────────────


async def http_exception_handler(request: Request, exc: StarletteHTTPException) -> JSONResponse:
    """Handle FastAPI / Starlette HTTP exceptions with structured output."""
    log.warning(
        "http_exception",
        status_code=exc.status_code,
        detail=exc.detail,
        path=str(request.url),
        method=request.method,
    )
    body = ErrorResponse(
        status=exc.status_code,
        errors=[ErrorDetail(code="http_error", message=str(exc.detail))],
    )
    return JSONResponse(status_code=exc.status_code, content=body.model_dump())


async def validation_exception_handler(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    """Handle Pydantic v2 request validation errors with per-field details."""
    errors: list[ErrorDetail] = []
    for error in exc.errors():
        field = ".".join(str(loc) for loc in error.get("loc", []))
        errors.append(
            ErrorDetail(
                code=error.get("type", "validation_error"),
                message=error.get("msg", "Invalid value"),
                field=field or None,
            )
        )

    log.warning(
        "validation_error",
        path=str(request.url),
        method=request.method,
        error_count=len(errors),
    )
    body = ErrorResponse(
        status=status.HTTP_422_UNPROCESSABLE_ENTITY,
        errors=errors,
    )
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=body.model_dump(),
    )


async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Catch-all for any unhandled exception — returns 500."""
    # Always print the traceback in the terminal for debugging
    traceback.print_exc()

    log.error(
        "unhandled_exception",
        path=str(request.url),
        method=request.method,
        error=str(exc),
        exc_info=True,
    )

    # Determine message based on environment
    message = str(exc) if settings.is_development else "An unexpected error occurred."

    body = ErrorResponse(
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        errors=[ErrorDetail(code="internal_error", message=message)],
    )
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=body.model_dump(),
    )


# ── Registration helper ────────────────────────────────────────────────────


def register_exception_handlers(app: FastAPI) -> None:
    """
    Attach all exception handlers to *app*.

    Call from the application factory in ``main.py``.
    """
    app.add_exception_handler(StarletteHTTPException, http_exception_handler)  # type: ignore[arg-type]
    app.add_exception_handler(RequestValidationError, validation_exception_handler)  # type: ignore[arg-type]
    app.add_exception_handler(Exception, unhandled_exception_handler)  # type: ignore[arg-type]
