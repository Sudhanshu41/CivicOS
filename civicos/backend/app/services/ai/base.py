"""
CivicOS — AI Service Base Abstractions
"""

from __future__ import annotations

import abc
from datetime import UTC, datetime
from typing import Any, Generic, TypeVar

from pydantic import BaseModel

T = TypeVar("T", bound=BaseModel)


class AIProvider(abc.ABC):
    """
    Abstract interface for AI model providers.
    Supports future model swapping (Gemini, OpenAI, Anthropic, etc.).
    """

    def __init__(self) -> None:
        self.events: list[dict[str, Any]] = []

    def _record_event(self, event_type: str, **kwargs: Any) -> None:
        """Record an internal execution event for telemetry."""
        event = {
            "type": event_type,
            "timestamp": datetime.now(UTC).isoformat(),
            **kwargs,
        }
        self.events.append(event)

    @abc.abstractmethod
    async def generate_structured(
        self,
        prompt: str,
        response_model: type[T],
        system_instruction: str | None = None,
        **kwargs: Any,  # noqa: ANN401
    ) -> T:
        """Generate a structured response from the AI provider."""
        pass


class AITask(Generic[T], abc.ABC):
    """
    Represents a specific AI execution primitive.
    Tasks encapsulate the prompt logic and validation for a specific goal.
    """

    def __init__(self, provider: AIProvider) -> None:
        self.provider = provider

    @property
    @abc.abstractmethod
    def name(self) -> str:
        """The identifier for this task."""
        pass

    @property
    @abc.abstractmethod
    def response_model(self) -> type[T]:
        """The Pydantic model for the structured response."""
        pass

    @abc.abstractmethod
    def build_prompt(self, **kwargs: Any) -> str:  # noqa: ANN401
        """Construct the prompt for the task."""
        pass

    def build_system_instruction(self) -> str | None:
        """Optional system-level instructions for the model."""
        return None

    async def execute(self, **kwargs: Any) -> T:  # noqa: ANN401
        """Execute the AI task and return the validated structured response."""
        prompt = self.build_prompt(**kwargs)
        system_instruction = self.build_system_instruction()

        return await self.provider.generate_structured(
            prompt=prompt,
            response_model=self.response_model,
            system_instruction=system_instruction,
            **kwargs,
        )
