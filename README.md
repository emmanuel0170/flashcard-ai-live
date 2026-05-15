# FlashCard AI

> Transform lecture notes into interactive AI-powered study flashcards — instantly.

Built with **FastAPI** · **React + Vite** · **Tailwind CSS** · **Framer Motion** · **Google Gemini 2.5 Flash Lite**

---

## Features

| Feature                 | Detail                                                 |
| ----------------------- | ------------------------------------------------------ |
| **AI Generation**       | Gemini 1.5 Flash produces 5–10 exam-focused flashcards |
| **Copy to Clipboard**   | One-click copy of Q+A pair                             |
| **Skeleton Loading**    | Polished shimmer placeholders while generating         |
| **Toast Notifications** | Live success / error feedback via Sonner               |
| **Responsive**          | Works on mobile, tablet, and desktop                   |

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
git clone <your-repo-url>
cd flashcard-ai
```

---

### 2 — Backend Setup

```bash
# Enter backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate it
# macOS / Linux:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy and fill in environment variables
cp .env.example .env
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

# Copy environment variables
cp .env.example .env
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
