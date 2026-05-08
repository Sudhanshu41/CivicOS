"""
CivicOS — Pagination Utilities

Helpers for cursor-based and offset-based pagination that work with
the PaginatedResponse schema and FastAPI's PaginationParams dependency.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import TypeVar

from app.schemas.base import PaginatedResponse

T = TypeVar("T")


@dataclass(frozen=True, slots=True)
class PageMeta:
    """Computed metadata for a single page of results."""

    total: int
    page: int
    size: int

    @property
    def pages(self) -> int:
        return max(1, -(-self.total // self.size))  # ceiling division

    @property
    def offset(self) -> int:
        return (self.page - 1) * self.size

    @property
    def has_next(self) -> bool:
        return self.page < self.pages

    @property
    def has_previous(self) -> bool:
        return self.page > 1


def paginate(
    items: list[T],
    *,
    total: int,
    page: int,
    size: int,
) -> tuple[list[T], PaginatedResponse]:
    """
    Return *(items, pagination_envelope)*.

    Parameters
    ----------
    items:
        The current page of items (already sliced from the DB query).
    total:
        Total number of records matching the query (before pagination).
    page:
        Current 1-indexed page number.
    size:
        Items per page.
    """
    meta = PageMeta(total=total, page=page, size=size)
    envelope = PaginatedResponse(
        total=meta.total,
        page=meta.page,
        size=meta.size,
        pages=meta.pages,
        has_next=meta.has_next,
        has_previous=meta.has_previous,
    )
    return items, envelope
