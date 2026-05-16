import json
import re
import logging
from typing import List

import google.generativeai as genai
from google.generativeai.types import GenerationConfig

from app.models.schemas import Flashcard

logger = logging.getLogger(__name__)

# ─────────────────────────────────────────────────────────
#  Prompt template — carefully engineered for quality output
# ─────────────────────────────────────────────────────────
FLASHCARD_PROMPT = """You are an expert educational AI assistant specializing in creating high-quality study materials.

Your task: Generate comprehensive flashcards from the provided lecture notes.

STRICT REQUIREMENTS:
- Generate between 5 and 10 flashcards (aim for 8 when notes are rich)
- Focus on the most important concepts, definitions, and principles
- Each answer must be concise (1-3 sentences maximum)
- Avoid redundant or duplicate questions
- Prioritize exam-relevant information
- Use clear, precise academic language
- Questions should be specific, not vague
- Cover different aspects: definitions, mechanisms, examples, comparisons

OUTPUT FORMAT — return ONLY a valid JSON array, nothing else. No markdown, no explanation, no preamble:

[
  {{
    "question": "Clear, specific question about a key concept",
    "answer": "Concise, accurate answer in 1-3 sentences."
  }}
]

LECTURE NOTES:
{notes}"""


class GeminiService:
    """Service for interacting with Google Gemini API to generate flashcards."""

    def __init__(self, api_key: str) -> None:
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            system_instruction=(
                "You are an educational AI assistant. "
                "Always respond with valid JSON only. Never include markdown formatting."
            ),
        )
        self._generation_config = GenerationConfig(
            temperature=0.4,  # slightly creative but mostly factual
            top_p=0.85,
            max_output_tokens=2048,
        )

    async def generate_flashcards(self, notes: str) -> List[Flashcard]:
        """
        Call Gemini API and parse the response into a list of Flashcard objects.

        Raises:
            ValueError: if the response cannot be parsed or is empty.
            Exception: for API or network failures.
        """
        prompt = FLASHCARD_PROMPT.format(notes=notes)

        logger.info(
            "Sending request to Gemini API (notes length: %d chars)", len(notes)
        )

        response = await self.model.generate_content_async(
            prompt,
            generation_config=self._generation_config,
        )

        raw_text = response.text.strip()
        logger.debug("Raw Gemini response: %s", raw_text[:500])

        return self._parse_flashcards(raw_text)

    # ──────────────────────────────────────────────────────
    #  Private helpers
    # ──────────────────────────────────────────────────────

    def _parse_flashcards(self, raw_text: str) -> List[Flashcard]:
        """Extract and validate flashcards from raw Gemini output."""

        # Strip markdown code fences if present (```json ... ```)
        clean = re.sub(r"```(?:json)?\s*", "", raw_text).strip()

        # Find the outermost JSON array
        array_match = re.search(r"\[.*\]", clean, re.DOTALL)
        if not array_match:
            raise ValueError(
                "The AI response did not contain a valid JSON array. "
                "Please try again with more detailed notes."
            )

        try:
            data = json.loads(array_match.group())
        except json.JSONDecodeError as exc:
            raise ValueError(f"Could not parse AI response as JSON: {exc}") from exc

        if not isinstance(data, list) or len(data) == 0:
            raise ValueError("AI returned an empty flashcard list.")

        flashcards: List[Flashcard] = []
        seen_questions: set[str] = set()

        for item in data:
            if not isinstance(item, dict):
                continue

            question = str(item.get("question", "")).strip()
            answer = str(item.get("answer", "")).strip()

            if not question or not answer:
                logger.warning("Skipping item missing question or answer: %s", item)
                continue

            # Deduplicate by normalised question text
            key = question.lower()
            if key in seen_questions:
                continue
            seen_questions.add(key)

            flashcards.append(Flashcard(question=question, answer=answer))

        if not flashcards:
            raise ValueError(
                "No valid flashcards could be extracted from the AI response."
            )

        logger.info("Successfully parsed %d flashcards", len(flashcards))
        return flashcards
