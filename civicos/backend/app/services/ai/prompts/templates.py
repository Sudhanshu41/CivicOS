"""
CivicOS — AI Prompt Management
"""

from __future__ import annotations

from typing import Any


class PromptTemplate:
    """
    Handles prompt composition and variable injection.
    Prevents prompt duplication and hardcoded strings in logic.
    """

    def __init__(self, template: str, system_instruction: str | None = None) -> None:
        self.template = template
        self.system_instruction = system_instruction

    def format(self, **kwargs: Any) -> str:  # noqa: ANN401
        """Inject variables into the template."""
        return self.template.format(**kwargs)


# ── System Instructions ────────────────────────────────────────────────────

CIVICOS_SYSTEM_PROMPT = """
You are the CivicOS Intelligence Engine, a highly specialized AI responsible
for managing city infrastructure and citizen safety.
Your responses must be objective, analytical, and strictly formatted as JSON.
Prioritize public safety and infrastructure integrity above all else.
"""

# ── Task Templates ────────────────────────────────────────────────────────

ISSUE_CLASSIFICATION_TEMPLATE = """
Analyze the following civic issue report and classify it accurately.

REPORT:
{report_text}

CONTEXT:
Location: {location}
Source: {source}

Output the classification in structured JSON format.
"""

INFRASTRUCTURE_ANALYSIS_TEMPLATE = """
Perform a risk analysis on the specified infrastructure component based on the provided data.

COMPONENT: {component_name}
DATA: {data_payload}

Assess risk level and recommended actions.
"""

EMERGENCY_TRIAGE_TEMPLATE = """
URGENT: Triage the following situation for potential emergency escalation.

SITUATION: {situation_description}

Determine urgency and if immediate escalation is required.
"""
