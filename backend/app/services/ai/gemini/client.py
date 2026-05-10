"""
CivicOS — Gemini Client Implementation
"""

from __future__ import annotations

from google import genai

from app.core.config import settings
from app.core.logging import get_logger

log = get_logger(__name__)


class GeminiClient:
    """
    Centralized Gemini API client management.
    Handles API key initialization and provider connection.
    """

    def __init__(self) -> None:
        if not settings.GEMINI_API_KEY:
            log.warning("gemini_api_key_missing", message="Gemini API Key is not configured.")

        # Initialize the modern google.genai SDK client
        self._client = genai.Client(api_key=settings.GEMINI_API_KEY)

    @property
    def client(self) -> genai.Client:
        """Access the underlying google.genai client."""
        return self._client

