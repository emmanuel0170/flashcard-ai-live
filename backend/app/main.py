import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import generate

load_dotenv()

app = FastAPI(
    title="FlashCard AI API",
    description=(
        "AI-powered flashcard generator that turns lecture notes into "
        "concise, exam-ready study cards using Google Gemini."
    ),
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
