"""
CivicOS — Base Repository (Generic)

Provides a type-safe async CRUD foundation that all domain repositories
must extend.  Business logic must NOT live here — only data access.

Usage
-----
    class UserRepository(BaseRepository[User]):
        model = User

        async def find_by_email(self, email: str) -> User | None:
            stmt = select(User).where(User.email == email)
            result = await self._session.execute(stmt)
            return result.scalar_one_or_none()
"""

from __future__ import annotations

from typing import TYPE_CHECKING, Any, Generic, TypeVar

from sqlalchemy import select

from app.db.session import Base

if TYPE_CHECKING:
    from uuid import UUID

    from sqlalchemy.ext.asyncio import AsyncSession

ModelT = TypeVar("ModelT", bound=Base)  # type: ignore[type-arg]


class BaseRepository(Generic[ModelT]):
    """
    Generic async repository providing standard CRUD operations.

    All concrete repositories inherit from this class and inject
    the session via FastAPI's dependency injection system.
    """

    model: type[ModelT]

    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    # ── Read ───────────────────────────────────────────────────────────────

    async def get_by_id(self, record_id: UUID | int) -> ModelT | None:
        """Fetch a single record by primary key."""
        return await self._session.get(self.model, record_id)

    async def get_all(self, *, limit: int = 100, offset: int = 0) -> list[ModelT]:
        """Fetch a paginated list of records ordered by creation time."""
        stmt = select(self.model).limit(limit).offset(offset)
        result = await self._session.execute(stmt)
        return list(result.scalars().all())

    async def count(self) -> int:
        """Return the total number of records."""
        from sqlalchemy import func

        stmt = select(func.count()).select_from(self.model)
        result = await self._session.execute(stmt)
        return result.scalar_one()

    # ── Write ──────────────────────────────────────────────────────────────

    async def create(self, **kwargs: Any) -> ModelT:  # noqa: ANN401
        """Create and persist a new record."""
        instance = self.model(**kwargs)
        self._session.add(instance)
        await self._session.flush()  # get DB-generated fields (e.g. id)
        await self._session.refresh(instance)
        return instance

    async def update(self, instance: ModelT, **kwargs: Any) -> ModelT:  # noqa: ANN401
        """Update fields on an existing instance and persist."""
        for field, value in kwargs.items():
            setattr(instance, field, value)
        self._session.add(instance)
        await self._session.flush()
        await self._session.refresh(instance)
        return instance

    async def delete(self, instance: ModelT) -> None:
        """Hard-delete a record from the database."""
        await self._session.delete(instance)
        await self._session.flush()

    # ── Helpers ────────────────────────────────────────────────────────────

    async def exists(self, record_id: UUID | int) -> bool:
        """Return True if a record with *record_id* exists."""
        return await self.get_by_id(record_id) is not None
