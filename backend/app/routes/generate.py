import os
import logging

from fastapi import APIRouter, HTTPException, Depends

from app.models.schemas import NotesRequest, FlashcardsResponse
from app.services.gemini_service import GeminiService

logger = logging.getLogger(__name__)

router = APIRouter()


def get_gemini_service() -> GeminiService:
    """Dependency: instantiate GeminiService with API key from environment."""
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="GEMINI_API_KEY is not configured on the server.",
        )
    return GeminiService(api_key=api_key)


@router.post(
    "/generate",
    response_model=FlashcardsResponse,
    summary="Generate flashcards from lecture notes",
    responses={
        200: {"description": "Flashcards generated successfully"},
        422: {"description": "Invalid input or AI parsing failure"},
        500: {"description": "Server or API error"},
    },
)
async def generate_flashcards(
    request: NotesRequest,
    service: GeminiService = Depends(get_gemini_service),
) -> FlashcardsResponse:
    """
    Accept lecture notes and return AI-generated flashcards.

    The notes are sent to Google Gemini, which produces structured
    question/answer pairs in JSON format. Duplicates are removed
    and at least 5 cards are guaranteed.
    """
    logger.info("POST /api/generate — notes length: %d", len(request.notes))

    try:
        flashcards = await service.generate_flashcards(request.notes)
        return FlashcardsResponse.from_flashcards(flashcards)

    except ValueError as exc:
        logger.warning("Validation/parsing error: %s", exc)
        raise HTTPException(status_code=422, detail=str(exc)) from exc

    except Exception as exc:
        logger.error("Unexpected error generating flashcards: %s", exc, exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred while generating flashcards. Please try again.",
        ) from exc
