import axios, { AxiosError } from "axios";
import type { Flashcard, GenerateRequest, GenerateResponse } from "@/types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 60_000,
});

export async function generateFlashcards(notes: string): Promise<Flashcard[]> {
  try {
    const body: GenerateRequest = { notes };
    const { data } = await apiClient.post<GenerateResponse>(
      "/api/generate",
      body,
    );

    return data.flashcards.map((card, idx) => ({
      ...card,
      id: `card-${Date.now()}-${idx}`,
    }));
  } catch (err) {
    if (err instanceof AxiosError) {
      const detail: string =
        err.response?.data?.detail ??
        err.message ??
        "An unknown error occurred.";
      throw new Error(detail);
    }
    throw err;
  }
}
