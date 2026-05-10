"""
CivicOS — Base Pydantic Schemas

All request/response schemas should inherit from the appropriate base here.
This enforces consistent serialisation behaviour across the entire API.
"""

from __future__ import annotations

import uuid  # noqa: TCH003
from datetime import datetime  # noqa: TCH003

from pydantic import BaseModel, ConfigDict


class CivicOSBase(BaseModel):
    """
    Root Pydantic model for all CivicOS schemas.

    - ORM mode enabled (model_validate accepts SQLAlchemy instances)
    - Alias generation: snake_case → camelCase for frontend compatibility
    - Strict type coercion disabled for ergonomic partial updates
    """

    model_config = ConfigDict(
        from_attributes=True,  # allow ORM model → schema conversion
        populate_by_name=True,  # accept both alias and field name
        str_strip_whitespace=True,  # strip leading/trailing whitespace
        validate_assignment=True,  # validate on attribute assignment
    )


class TimestampedSchema(CivicOSBase):
    """
    Extends ``CivicOSBase`` with standard timestamp fields.

    Use as the base for any response schema representing a DB entity.
    """

    id: uuid.UUID
    created_at: datetime
    updated_at: datetime


class PaginatedResponse(CivicOSBase):
    """
    Generic pagination envelope.

    Usage
    -----
        class UserListResponse(PaginatedResponse):
            items: list[UserResponse]
    """

    total: int
    page: int
    size: int
    pages: int
    has_next: bool
    has_previous: bool

    @classmethod
    def build(
        cls,
        *,
        items: list,  # type: ignore[type-arg]
        total: int,
        page: int,
        size: int,
    ) -> PaginatedResponse:
        pages = max(1, -(-total // size))  # ceiling division
        return cls(
            total=total,
            page=page,
            size=size,
            pages=pages,
            has_next=page < pages,
            has_previous=page > 1,
        )


class ErrorDetail(CivicOSBase):
    """Structured error detail for API error responses."""

    code: str
    message: str
    field: str | None = None


class ErrorResponse(CivicOSBase):
    """Standard API error envelope."""

    status: int
    errors: list[ErrorDetail]
