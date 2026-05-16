# FlashCard AI

> Transform lecture notes into interactive AI-powered study flashcards — instantly.

Built with **FastAPI** · **React + Vite** · **Tailwind CSS** · **Framer Motion** · **Google Gemini 2.5 Flash Lite**

---

## Features

| Feature                 | Detail                                                      |
| ----------------------- | ----------------------------------------------------------- |
| **AI Generation**       | Gemini 2.5 Flash Lite produces 5–10 exam-focused flashcards |
| **Copy to Clipboard**   | One-click copy of Q+A pair                                  |
| **Skeleton Loading**    | Polished shimmer placeholders while generating              |
| **Toast Notifications** | Live success / error feedback via Sonner                    |
| **Responsive**          | Works on mobile, tablet, and desktop                        |

---

## Project Structure

```
flashcard-ai/
├── backend/                 # FastAPI server
│   ├── app/
│   │   ├── main.py          # App entry-point & CORS config
│   │   ├── models/
│   │   │   └── schemas.py   # Pydantic request/response models
│   │   ├── routes/
│   │   │   └── generate.py  # POST /api/generate endpoint
│   │   └── services/
│   │       └── gemini_service.py  # Gemini API integration
│   ├── .env.example
│   └── requirements.txt
│
└── frontend/                # Vite + React app
    ├── src/
    │   ├── App.tsx           # Root component
    │   ├── components/
    │   │   ├── Header.tsx
    │   │   ├── NotesInput.tsx
    │   │   ├── FlashCard.tsx
    │   │   ├── FlashCardGrid.tsx
    │   │   ├── LoadingSkeleton.tsx
    │   │   └── EmptyState.tsx
    │   ├── hooks/
    │   │   └── useFlashcards.ts   # State management hook
    │   ├── services/
    │   │   └── api.ts             # Axios API client
    │   └── types/
    │       └── index.ts           # TypeScript interfaces
    ├── .env.example
    └── package.json
```

---

## Quick Start

### Prerequisites

| Tool                  | Version                                                |
| --------------------- | ------------------------------------------------------ |
| Node.js               | ≥ 18                                                   |
| Python                | ≥ 3.9                                                  |
| Google Gemini API Key | [Get one free](https://aistudio.google.com/app/apikey) |

---

### 1 — Clone & Navigate

```bash
git clone https://github.com/emmanuel0170/flashcard-ai-live
cd flashcard-ai-live
```

---

### 2 — Backend Setup

**1. Create and Activate Virtual Environment**

First, enter the backend directory and create a virtual environment:

```bash
cd backend
python -m venv venv
```

Then, activate the virtual environment depending on your operating system:

**macOS / Linux:**

```bash
source venv/bin/activate
```

**Windows (Command Prompt):**

```cmd
venv\Scripts\activate.bat
```

**Windows (PowerShell):**

```powershell
.\venv\Scripts\Activate.ps1
```

**2. Install Dependencies & Setup Environment Variables**

Once activated, install the required packages and copy the environment template.

**macOS / Linux:**

```bash
pip install -r requirements.txt
cp .env.example .env
```

**Windows:**

```powershell
pip install -r requirements.txt
copy .env.example .env
```

Edit `backend/.env`:

```env
GEMINI_API_KEY=your_actual_key_here
FRONTEND_URL=http://localhost:5173
```

**Start the server:**

```bash
uvicorn app.main:app --reload --port 8000
```

Backend runs at → `http://localhost:8000`
Interactive API docs → `http://localhost:8000/docs`

---

### 3 — Frontend Setup

Open a **new terminal**:

```bash
# Enter frontend directory
cd frontend

# Install Node dependencies
npm install
```

**Copy environment variables:**

**macOS / Linux:**

```bash
cp .env.example .env
```

**Windows:**

```powershell
copy .env.example .env
```

`frontend/.env` (defaults work out of the box):

```env
VITE_API_URL=http://localhost:8000
```

**Start the dev server:**

```bash
npm run dev
```

Frontend runs at → `http://localhost:5173`

---

## API Reference

### `POST /api/generate`

**Request body:**

```json
{
  "notes": "Your lecture notes text here (min 50 chars)"
}
```

**Success response `200`:**

```json
{
  "flashcards": [
    {
      "question": "What is overfitting?",
      "answer": "When a model memorises training data instead of learning generalisable patterns, leading to poor performance on unseen data."
    }
  ],
  "count": 7
}
```

**Error responses:**

| Code  | Reason                                       |
| ----- | -------------------------------------------- |
| `422` | Notes too short, empty, or AI parsing failed |
| `500` | Gemini API error or missing API key          |

---

## Backend Architecture & Functions

The backend is built with FastAPI and is structured into routing, services, and schemas. Here is a breakdown of the core functions:

### `app/main.py`

- `root()`: A simple `GET /` endpoint that confirms the API is up and running. Returns the service name and status.
- `health_check()`: A `GET /health` endpoint designed for uptime monitoring. It verifies if the `GEMINI_API_KEY` is configured in the environment.

### `app/routes/generate.py`

- `get_gemini_service()`: A FastAPI dependency that reads the `GEMINI_API_KEY` from the environment and instantiates the `GeminiService`. If the key is missing, it raises a `500 Internal Server Error`.
- `generate_flashcards(request: NotesRequest, service: GeminiService)`: The main `POST /api/generate` endpoint. It receives the lecture notes, calls the Gemini service to generate flashcards, and returns the structured list of flashcards. It handles both validation/parsing errors (`422`) and unexpected server errors (`500`).

### `app/services/gemini_service.py`

- `__init__(self, api_key: str)`: Configures the Google Gemini API client and sets up the model (`gemini-2.5-flash-lite`) with specific generation configuration (e.g., temperature, token limits) and system instructions to ensure JSON output.
- `generate_flashcards(self, notes: str)`: An asynchronous method that injects the user's notes into the `FLASHCARD_PROMPT` and sends the generation request to the Gemini API. It retrieves the raw text response and passes it to the parser.
- `_parse_flashcards(self, raw_text: str)`: A private helper method that cleans the raw response (stripping markdown backticks), extracts the JSON array, and parses it into Python dictionaries. It deduplicates identical questions and filters out invalid items before returning a validated list of `Flashcard` objects.

### `app/models/schemas.py`

- `NotesRequest.notes_must_not_be_empty(cls, v: str)`: A Pydantic field validator that ensures the provided lecture notes are not empty and contain at least 50 characters, ensuring meaningful context for AI generation.
- `FlashcardsResponse.from_flashcards(cls, flashcards: List[Flashcard])`: A class method that wraps the list of generated `Flashcard` objects into the final response format, automatically computing the total count.

---

## Tech Stack Details

### Frontend

- **Vite 5** — lightning-fast dev server & bundler
- **React 18** — UI framework
- **TypeScript** — type safety throughout
- **Tailwind CSS 3** — utility-first styling
- **Sonner** — toast notifications
- **Axios** — HTTP client with error handling
- **lucide-react** — icon library

### Backend

- **FastAPI** — async Python web framework
- **Pydantic v2** — request/response validation
- **google-generativeai** — official Gemini SDK
- **python-dotenv** — environment variable loading
- **uvicorn** — ASGI server

---

## Troubleshooting

**`GEMINI_API_KEY not configured`** — Make sure `backend/.env` exists and has a valid key.

**CORS error in browser** — Confirm the backend is running on port 8000 and `VITE_API_URL` in `frontend/.env` matches.

**Empty flashcards** — Your notes may be too short or too vague. Provide at least a paragraph of substantive content.

**`backface-visibility` flip glitch** — Ensure you're not using an older version of Safari without prefix support. The CSS includes `-webkit-backface-visibility` for compatibility.

---

## License

MIT — feel free to use this project for workshops, portfolios, or production apps.
