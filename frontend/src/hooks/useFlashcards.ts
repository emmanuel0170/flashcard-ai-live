import { useCallback, useState } from "react";
import type { AppState, Flashcard } from "@/types";
import { generateFlashcards } from "@/services/api";

interface UseFlashcardsReturn {
  flashcards: Flashcard[];
  state: AppState;
  error: string | null;
  isLoading: boolean;
  isSuccess: boolean;
  /** Generate cards from notes; returns the cards array. Throws on failure. */
  generate: (notes: string) => Promise<Flashcard[]>;
  /** Reset everything to idle. */
  reset: () => void;
}

export function useFlashcards(): UseFlashcardsReturn {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [state, setState] = useState<AppState>("idle");
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (notes: string): Promise<Flashcard[]> => {
    setState("loading");
    setError(null);

    try {
      const cards = await generateFlashcards(notes);
      setFlashcards(cards);
      setState("success");
      return cards;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Generation failed. Please try again.";
      setError(message);
      setState("error");
      throw new Error(message);
    }
  }, []);

  const reset = useCallback(() => {
    setFlashcards([]);
    setState("idle");
    setError(null);
  }, []);

  return {
    flashcards,
    state,
    error,
    isLoading: state === "loading",
    isSuccess: state === "success",
    generate,
    reset,
  };
}
