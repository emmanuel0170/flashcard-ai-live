from pydantic import BaseModel, field_validator
from typing import List


class NotesRequest(BaseModel):
    """Request body for flashcard generation."""

    notes: str

    @field_validator("notes")
    @classmethod
    def notes_must_not_be_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Notes cannot be empty")
        if len(v.strip()) < 50:
            raise ValueError("Please provide at least 50 characters of notes")
        return v.strip()


class Flashcard(BaseModel):
    """Individual flashcard with question and answer."""

    question: str
    answer: str


class FlashcardsResponse(BaseModel):
    """Response body containing generated flashcards."""

    flashcards: List[Flashcard]
    count: int

    @classmethod
    def from_flashcards(cls, flashcards: List[Flashcard]) -> "FlashcardsResponse":
        return cls(flashcards=flashcards, count=len(flashcards))


class ErrorResponse(BaseModel):
    """Standard error response."""

    detail: str
    code: str = "UNKNOWN_ERROR"
