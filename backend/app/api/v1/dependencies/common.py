"""
CivicOS — Common FastAPI Dependencies

Reusable dependency providers for pagination, request IDs,
and future auth injection.  Extend this as the API grows.
"""

from __future__ import annotations

import uuid
from typing import Annotated

from fastapi import Depends, Header, Query

from app.core.config import settings

# ── Pagination ─────────────────────────────────────────────────────────────


class PaginationParams:
    """Common cursor-based pagination parameters."""

    def __init__(
        self,
        page: int = Query(1, ge=1, description="Page number (1-indexed)"),
        size: int = Query(
            settings.DEFAULT_PAGE_SIZE,
            ge=1,
            le=settings.MAX_PAGE_SIZE,
            description="Items per page",
        ),
    ) -> None:
        self.page = page
        self.size = size
        self.offset = (page - 1) * size


Pagination = Annotated[PaginationParams, Depends(PaginationParams)]


# ── Request ID ─────────────────────────────────────────────────────────────


async def get_request_id(
    x_request_id: str | None = Header(default=None, alias="X-Request-ID"),
) -> str:
    """Return the X-Request-ID header or generate a new UUID."""
    return x_request_id or str(uuid.uuid4())


RequestId = Annotated[str, Depends(get_request_id)]
