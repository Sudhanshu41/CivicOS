"""
CivicOS — Civic Issue Repository
"""

import uuid

from sqlalchemy import select

from app.models.civic_issue import CivicIssue
from app.repositories.base import BaseRepository


class CivicIssueRepository(BaseRepository[CivicIssue]):
    model = CivicIssue

    async def get_by_status(
        self, status: str, *, limit: int = 100, offset: int = 0
    ) -> list[CivicIssue]:
        """Fetch issues filtered by their status."""
        stmt = select(self.model).where(self.model.status == status).limit(limit).offset(offset)
        result = await self._session.execute(stmt)
        return list(result.scalars().all())

    async def get_by_reporter(
        self, reporter_id: uuid.UUID, *, limit: int = 100, offset: int = 0
    ) -> list[CivicIssue]:
        """Fetch issues reported by a specific user."""
        stmt = (
            select(self.model)
            .where(self.model.reporter_id == reporter_id)
            .limit(limit)
            .offset(offset)
        )
        result = await self._session.execute(stmt)
        return list(result.scalars().all())
