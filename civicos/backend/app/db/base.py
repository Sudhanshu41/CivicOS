"""
CivicOS — Database Model Aggregator

Imports the declarative Base and all models so that Alembic can easily
discover them by importing ``Base`` from this module.
"""

from app.db.session import Base
from app.models.agent import AgentExecution
from app.models.civic_issue import CivicIssue
from app.models.system_event import SystemEvent
from app.models.user import User
from app.models.workflow import WorkflowExecution

__all__ = [
    "Base",
    "AgentExecution",
    "CivicIssue",
    "SystemEvent",
    "User",
    "WorkflowExecution",
]
