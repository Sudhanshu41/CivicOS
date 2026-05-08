"""
CivicOS — AI Testing Utilities
"""

from __future__ import annotations

from typing import Any, TypeVar

from pydantic import BaseModel

from app.services.ai.base import AIProvider

T = TypeVar("T", bound=BaseModel)


class MockAIProvider(AIProvider):
    """
    A mock AI provider for unit tests and local development without API calls.
    Returns pre-configured responses based on the response model.
    """

    def __init__(self, responses: dict[type[BaseModel], BaseModel] | None = None) -> None:
        self.responses = responses or {}

    async def generate_structured(
        self,
        prompt: str,
        response_model: type[T],
        system_instruction: str | None = None,
        **kwargs: Any,  # noqa: ANN401
    ) -> T:
        """Return a mock response for the given model."""
        if response_model in self.responses:
            return self.responses[response_model]  # type: ignore

        # Fallback: create a default instance if possible (not always possible with required fields)
        try:
            return response_model.model_construct()
        except Exception as e:
            raise ValueError(f"No mock response configured for {response_model}") from e
