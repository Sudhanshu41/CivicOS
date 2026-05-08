"""
CivicOS — AI Task Implementations
"""

from __future__ import annotations

from typing import Any

from app.services.ai.base import AITask
from app.services.ai.prompts.templates import (
    CIVICOS_SYSTEM_PROMPT,
    EMERGENCY_TRIAGE_TEMPLATE,
    INFRASTRUCTURE_ANALYSIS_TEMPLATE,
    ISSUE_CLASSIFICATION_TEMPLATE,
)
from app.services.ai.schemas import (
    CivicIssueClassification,
    EmergencyAssessment,
    InfrastructureAnalysis,
)


class IssueClassificationTask(AITask[CivicIssueClassification]):
    """Task for classifying user-reported civic issues."""

    @property
    def name(self) -> str:
        return "issue_classification"

    @property
    def response_model(self) -> type[CivicIssueClassification]:
        return CivicIssueClassification

    def build_system_instruction(self) -> str:
        return CIVICOS_SYSTEM_PROMPT

    def build_prompt(self, **kwargs: Any) -> str:  # noqa: ANN401
        return ISSUE_CLASSIFICATION_TEMPLATE.format(
            report_text=kwargs.get("report_text", ""),
            location=kwargs.get("location", "Unknown"),
            source=kwargs.get("source", "citizen_app"),
        )


class InfrastructureAnalysisTask(AITask[InfrastructureAnalysis]):
    """Task for analyzing infrastructure risk."""

    @property
    def name(self) -> str:
        return "infrastructure_analysis"

    @property
    def response_model(self) -> type[InfrastructureAnalysis]:
        return InfrastructureAnalysis

    def build_system_instruction(self) -> str:
        return CIVICOS_SYSTEM_PROMPT

    def build_prompt(self, **kwargs: Any) -> str:  # noqa: ANN401
        return INFRASTRUCTURE_ANALYSIS_TEMPLATE.format(
            component_name=kwargs.get("component_name", "Unknown"),
            data_payload=kwargs.get("data_payload", {}),
        )


class EmergencyTriageTask(AITask[EmergencyAssessment]):
    """Task for emergency assessment and triage."""

    @property
    def name(self) -> str:
        return "emergency_triage"

    @property
    def response_model(self) -> type[EmergencyAssessment]:
        return EmergencyAssessment

    def build_system_instruction(self) -> str:
        return "CRITICAL: You are an emergency triage officer. Be fast, accurate, and safety-first."

    def build_prompt(self, **kwargs: Any) -> str:  # noqa: ANN401
        return EMERGENCY_TRIAGE_TEMPLATE.format(
            situation_description=kwargs.get("situation_description", ""),
        )
