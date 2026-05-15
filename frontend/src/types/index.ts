/** A single AI-generated flashcard */
export interface Flashcard {
  /** Unique client-side identifier */
  id: string;
  question: string;
  answer: string;
}

/** POST /api/generate — request */
export interface GenerateRequest {
  notes: string;
}

/** POST /api/generate — response */
export interface GenerateResponse {
  flashcards: Omit<Flashcard, "id">[];
  count: number;
}

/** Overall application state machine */
export type AppState = "idle" | "loading" | "success" | "error";
