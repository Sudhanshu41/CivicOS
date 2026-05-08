"""
CivicOS — Workflow Execution Repository
"""

from sqlalchemy import select

from app.models.workflow import WorkflowExecution
from app.repositories.base import BaseRepository


class WorkflowExecutionRepository(BaseRepository[WorkflowExecution]):
    model = WorkflowExecution

    async def get_by_status(
        self, status: str, *, limit: int = 100, offset: int = 0
    ) -> list[WorkflowExecution]:
        """Fetch workflows by their execution status."""
        stmt = select(self.model).where(self.model.status == status).limit(limit).offset(offset)
        result = await self._session.execute(stmt)
        return list(result.scalars().all())
