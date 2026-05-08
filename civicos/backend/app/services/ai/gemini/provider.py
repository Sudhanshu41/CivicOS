"""
CivicOS — Gemini AI Provider
"""

from __future__ import annotations

import asyncio
import json
import time
from typing import Any, TypeVar

from google.genai import types
from pydantic import BaseModel, ValidationError
from tenacity import (
    RetryCallState,
    before_sleep_log,
    retry,
    retry_if_exception_type,
    stop_after_attempt,
    wait_exponential,
)

from app.core.config import settings
from app.core.logging import get_logger
from app.services.ai.base import AIProvider
from app.services.ai.exceptions.base import (
    AIExecutionError,
    AIParserError,
    AIRateLimitError,
    AIValidationError,
)
from app.services.ai.gemini.client import GeminiClient

log = get_logger(__name__)
T = TypeVar("T", bound=BaseModel)





class GeminiProvider(AIProvider):
    """
    Google Gemini implementation of the AIProvider interface.
    Handles structured JSON generation and error recovery using google.genai.
    """

    def __init__(self, client: GeminiClient | None = None) -> None:
        super().__init__()
        self.client = client or GeminiClient()

    def _on_retry(self, retry_state: RetryCallState) -> None:
        """Telemetry for AI retry attempts."""
        error = str(retry_state.outcome.exception()) if retry_state.outcome else "unknown"
        log.warning(
            "ai_retry_attempted",
            attempt=retry_state.attempt_number,
            error=error,
            next_wait=retry_state.next_action.sleep if retry_state.next_action else 0,
        )
        self._record_event(
            "ai_retry_attempted",
            attempt=retry_state.attempt_number,
            error=error,
        )

    @retry(
        retry=retry_if_exception_type((AIRateLimitError, AIExecutionError, asyncio.TimeoutError)),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        stop=stop_after_attempt(3),
        before_sleep=lambda retry_state: retry_state.args[0]._on_retry(retry_state),
        reraise=True,
    )
    async def _generate_with_retry(
        self,
        prompt: str,
        response_model: type[T],
        config: types.GenerateContentConfig,
    ) -> T:
        """Internal helper to perform the actual generation with retries."""
        model_name = settings.GEMINI_MODEL_ID

        try:
            # Add timeout protection
            response = await asyncio.wait_for(
                self.client.client.aio.models.generate_content(
                    model=model_name,
                    contents=prompt,
                    config=config,
                ),
                timeout=30.0,  # 30 second timeout for AI generation
            )

            if not response.text:
                raise AIExecutionError("Gemini returned an empty response.")

            # Parse JSON explicitly
            try:
                data = json.loads(response.text)
            except json.JSONDecodeError as e:
                log.error("ai_json_parse_failed", error=str(e), raw_text=response.text)
                raise AIParserError(
                    f"Failed to parse AI response as JSON: {e}", raw_response=response.text
                ) from e

            # Validate with Pydantic
            try:
                return response_model.model_validate(data)
            except ValidationError as e:
                log.error("ai_validation_failed", error=str(e), data=data)
                raise AIValidationError(
                    f"AI response failed schema validation: {e}", raw_response=response.text
                ) from e

        except asyncio.TimeoutError:
            log.error("ai_timeout", model=model_name)
            self._record_event("ai_timeout", model=model_name)
            raise

        except Exception as e:
            if "429" in str(e) or "quota" in str(e).lower() or getattr(e, "code", None) == 429:
                raise AIRateLimitError(f"Gemini rate limit exceeded: {e}") from e

            log.exception("ai_generation_failed_internal", error=str(e))
            raise AIExecutionError(f"Gemini execution failed: {e}") from e

    async def generate_structured(
        self,
        prompt: str,
        response_model: type[T],
        system_instruction: str | None = None,
        **kwargs: Any,  # noqa: ANN401
    ) -> T:
        """
        Generates a validated structured response using Gemini.
        Includes retries and graceful fallback on total failure.
        """
        config = types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=response_model,
            system_instruction=system_instruction,
            temperature=kwargs.get("temperature", 0.2),
            top_p=kwargs.get("top_p", 0.95),
            top_k=kwargs.get("top_k", 40),
            max_output_tokens=kwargs.get("max_tokens", 2048),
        )

        t0 = time.perf_counter()
        try:
            log.info("ai_generation_started", model=settings.GEMINI_MODEL_ID, prompt_len=len(prompt))

            result = await self._generate_with_retry(prompt, response_model, config)

            latency_ms = round((time.perf_counter() - t0) * 1000, 2)
            log.info("ai_generation_success", latency_ms=latency_ms)

            return result

        except Exception as e:
            log.error("ai_execution_failed", error=str(e), final_attempt=True)
            self._record_event("ai_execution_failed", error=str(e))

            # Check if fallback exists on the model
            if hasattr(response_model, "fallback_factory"):
                log.warning("ai_fallback_used", schema=response_model.__name__)
                self._record_event("ai_fallback_used", schema=response_model.__name__)
                return response_model.fallback_factory()

            raise
