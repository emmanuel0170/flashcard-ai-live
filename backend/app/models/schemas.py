from pydantic import BaseModel, field_validator
from typing import List


class NotesRequest(BaseModel):
    notes: str

class Flashcard(BaseModel):
    question: str
    answer: str


class FlashcardsResponse(BaseModel):
    flashcards: List[Flashcard]
    count: int

    @classmethod
    def from_flashcards(cls, flashcards: List[Flashcard]) -> "FlashcardsResponse":
        return cls(flashcards=flashcards, count=len(flashcards))


class ErrorResponse(BaseModel):
    """Standard error response."""
    detail: str
    code: str = "UNKNOWN_ERROR"
