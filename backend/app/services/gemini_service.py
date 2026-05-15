FLASHCARD_PROMPT = """
You are an expert educational AI assistant specializing in creating high-quality study materials.

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
{notes}
"""


class GeminiService:
    def __init__(self, api_key: str) -> None:
        pass

    async def generate_flashcards(self):
        pass

    def _parse_flashcards(self):
        pass
