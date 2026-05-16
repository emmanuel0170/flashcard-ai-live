import logging
import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import generate

# Load .env before anything else
load_dotenv()

# ─── Logging ─────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s — %(message)s",
)
logger = logging.getLogger(__name__)

# ─── App ─────────────────────────────────────────────────
app = FastAPI(
    title="FlashCard AI API",
    description=(
        "AI-powered flashcard generator that turns lecture notes into "
        "concise, exam-ready study cards using Google Gemini."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ─── CORS ────────────────────────────────────────────────
allowed_origins = [
    "http://localhost:5173",  # Vite dev server default
    "http://localhost:3000",
    os.getenv("FRONTEND_URL", "http://localhost:5173"),
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routes ──────────────────────────────────────────────
app.include_router(generate.router, prefix="/api", tags=["Flashcards"])


# ─── Health / Root ───────────────────────────────────────
@app.get("/", tags=["Health"])
async def root() -> dict:
    """API root — confirm the service is running."""
    return {
        "service": "FlashCard AI API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs",
    }


@app.get("/health", tags=["Health"])
async def health_check() -> dict:
    """Health check endpoint for uptime monitors."""
    gemini_key_set = bool(os.getenv("GEMINI_API_KEY"))
    return {
        "status": "healthy",
        "gemini_configured": gemini_key_set,
    }
