"""
CivicOS — System Event Repository
"""

from sqlalchemy import desc, select

from app.models.system_event import SystemEvent
from app.repositories.base import BaseRepository


class SystemEventRepository(BaseRepository[SystemEvent]):
    model = SystemEvent

    async def get_recent_events(self, *, limit: int = 100, offset: int = 0) -> list[SystemEvent]:
        """Fetch system events ordered by creation time descending."""
        stmt = select(self.model).order_by(desc(self.model.created_at)).limit(limit).offset(offset)
        result = await self._session.execute(stmt)
        return list(result.scalars().all())

    async def get_by_type(
        self, event_type: str, *, limit: int = 100, offset: int = 0
    ) -> list[SystemEvent]:
        """Fetch system events filtered by event type."""
        stmt = (
            select(self.model)
            .where(self.model.event_type == event_type)
            .order_by(desc(self.model.created_at))
            .limit(limit)
            .offset(offset)
        )
        result = await self._session.execute(stmt)
        return list(result.scalars().all())
