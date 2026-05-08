"""
CivicOS — Database Utilities

Helpers for transactions, pagination, and generic query building.
"""

from __future__ import annotations

from typing import TYPE_CHECKING, Any, TypeVar

if TYPE_CHECKING:
    from sqlalchemy.ext.asyncio import AsyncSession
    from sqlalchemy.orm import DeclarativeBase
    from sqlalchemy.sql import Select

ModelT = TypeVar("ModelT", bound="DeclarativeBase")


def apply_pagination(
    stmt: Select[tuple[ModelT]], page: int = 1, size: int = 20
) -> Select[tuple[ModelT]]:
    """
    Apply limit and offset to a SQLAlchemy statement for pagination.

    Args:
        stmt: The SQLAlchemy select statement.
        page: 1-indexed page number.
        size: Number of items per page.
    """
    offset = (page - 1) * size
    return stmt.offset(offset).limit(size)


def apply_filters(
    stmt: Select[tuple[ModelT]], model: type[ModelT], filters: dict[str, Any]
) -> Select[tuple[ModelT]]:
    """
    Apply dynamic equality filters to a SQLAlchemy statement.

    Args:
        stmt: The SQLAlchemy select statement.
        model: The SQLAlchemy declarative model.
        filters: A dictionary of column names to filter values.
    """
    for key, value in filters.items():
        if hasattr(model, key) and value is not None:
            stmt = stmt.where(getattr(model, key) == value)
    return stmt


async def execute_with_transaction(session: AsyncSession, operation: Any) -> Any:  # noqa: ANN401
    """
    Execute a callable operation within a database transaction.
    Commits on success, rolls back on failure.

    Args:
        session: The async database session.
        operation: An async callable that takes the session as its argument.
    """
    try:
        result = await operation(session)
        await session.commit()
        return result
    except Exception:
        await session.rollback()
        raise
