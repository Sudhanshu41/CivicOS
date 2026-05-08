"""
CivicOS — AI Service Layer
"""

from app.services.ai.base import AIProvider, AITask
from app.services.ai.exceptions.base import (
    AIError,
    AIExecutionError,
    AIParserError,
    AIRateLimitError,
    AIValidationError,
)
from app.services.ai.gemini.client import GeminiClient
from app.services.ai.gemini.provider import GeminiProvider
from app.services.ai.schemas import (
    CivicIssueClassification,
    EmergencyAssessment,
    InfrastructureAnalysis,
)
from app.services.ai.tasks.core import (
    EmergencyTriageTask,
    InfrastructureAnalysisTask,
    IssueClassificationTask,
)

__all__ = [
    "AIProvider",
    "AITask",
    "AIError",
    "AIExecutionError",
    "AIParserError",
    "AIRateLimitError",
    "AIValidationError",
    "GeminiClient",
    "GeminiProvider",
    "CivicIssueClassification",
    "EmergencyAssessment",
    "InfrastructureAnalysis",
    "IssueClassificationTask",
    "InfrastructureAnalysisTask",
    "EmergencyTriageTask",
]
