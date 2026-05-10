"""
CivicOS — AI Response Schemas
"""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


class CivicIssueClassification(BaseModel):
    """Schema for classifying civic issues reported by users."""

    issue_type: str = Field(
        ..., description="The category of the issue (e.g., pothole, streetlight, waste)."
    )
    severity: Literal["low", "medium", "high", "critical"] = Field(
        ..., description="Calculated severity level."
    )
    confidence_score: float = Field(
        ..., ge=0.0, le=1.0, description="Confidence in the classification."
    )
    reasoning: str = Field(..., description="Internal chain-of-thought for the classification.")

    @classmethod
    def fallback_factory(cls) -> CivicIssueClassification:
        """Return a safe fallback instance for this schema."""
        return cls(
            issue_type="general_issue",
            severity="medium",
            confidence_score=0.5,
            reasoning="AI classification failed; using operational fallback.",
        )


class InfrastructureAnalysis(BaseModel):
    """Schema for detailed analysis of infrastructure state."""

    infrastructure_type: str = Field(
        ..., description="Specific type of infrastructure (e.g., bridge, water pipe)."
    )
    risk_level: Literal["stable", "warning", "hazardous", "failed"] = Field(
        ..., description="Current risk level."
    )
    recommended_action: str = Field(..., description="Immediate action recommended for this item.")
    confidence_score: float = Field(..., ge=0.0, le=1.0)

    @classmethod
    def fallback_factory(cls) -> InfrastructureAnalysis:
        """Return a safe fallback instance for this schema."""
        return cls(
            infrastructure_type="unknown_infrastructure",
            risk_level="warning",
            recommended_action="Manual civic review required.",
            confidence_score=0.5,
        )


class EmergencyAssessment(BaseModel):
    """Schema for triaging potential emergencies."""

    emergency_type: str = Field(
        ..., description="Type of emergency (e.g., fire, flood, public safety)."
    )
    urgency_level: Literal["low", "moderate", "immediate", "life_threatening"] = Field(
        ..., description="Urgency of response."
    )
    escalation_required: bool = Field(
        ..., description="Whether this needs immediate human escalation."
    )
    reasoning: str = Field(..., description="Justification for the assessment.")

    @classmethod
    def fallback_factory(cls) -> EmergencyAssessment:
        """Return a safe fallback instance for this schema."""
        return cls(
            emergency_type="potential_emergency",
            urgency_level="moderate",
            escalation_required=True,
            reasoning="AI assessment failed; defaulting to safety-first escalation.",
        )
