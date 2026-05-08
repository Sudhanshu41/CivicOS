"""
CivicOS — Agent Execution Repository
"""

import uuid

from sqlalchemy import select

from app.models.agent import AgentExecution
from app.repositories.base import BaseRepository


class AgentExecutionRepository(BaseRepository[AgentExecution]):
    model = AgentExecution

    async def get_by_workflow(
        self, workflow_id: uuid.UUID, *, limit: int = 100, offset: int = 0
    ) -> list[AgentExecution]:
        """Fetch agent executions associated with a specific workflow."""
        stmt = (
            select(self.model)
            .where(self.model.workflow_id == workflow_id)
            .limit(limit)
            .offset(offset)
        )
        result = await self._session.execute(stmt)
        return list(result.scalars().all())
