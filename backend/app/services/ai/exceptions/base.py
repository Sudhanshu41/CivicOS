"""
CivicOS — AI Service Exceptions
"""

from __future__ import annotations


class AIError(Exception):
    """Base class for all AI service related errors."""

    pass


class AIConfigurationError(AIError):
    """Raised when AI provider or client is misconfigured."""

    pass


class AIExecutionError(AIError):
    """Raised when an AI request fails during execution."""

    pass


class AIRateLimitError(AIExecutionError):
    """Raised when the AI provider returns a rate limit error."""

    pass


class AITimeoutError(AIExecutionError):
    """Raised when the AI request times out."""

    pass


class AIValidationError(AIError):
    """Raised when AI response fails schema validation or parsing."""

    def __init__(self, message: str, raw_response: str | None = None) -> None:
        super().__init__(message)
        self.raw_response = raw_response


class AIParserError(AIValidationError):
    """Raised when AI response cannot be parsed into expected format."""

    pass
