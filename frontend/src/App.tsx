import { useCallback, useState } from "react";

import { Toaster, toast } from "sonner";

import { Header } from "@/components/Header";
import { NotesInput } from "@/components/NotesInput";
import { FlashCardGrid } from "@/components/FlashCardGrid";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { EmptyState } from "@/components/EmptyState";
import { useFlashcards } from "@/hooks/useFlashcards";

export default function App() {
  const [notes, setNotes] = useState("");
  const { flashcards, state, generate, reset } = useFlashcards();

  /* ── Generate handler ───────────────────────────────── */
  const handleGenerate = useCallback(async () => {
    if (!notes.trim()) {
      toast.error("Please add some notes first.");
      return;
    }
    if (notes.trim().length < 50) {
      toast.error("Notes are too short — add at least 50 characters.");
      return;
    }

    try {
      const cards = await generate(notes);
      toast.success(`${cards.length} flashcards generated!`, {
        description: "Click any card to reveal its answer.",
      });
    } catch (err) {
      toast.error("Generation failed", {
        description:
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.",
      });
    }
  }, [notes, generate]);

  /* ── Regenerate handler ─────────────────────────────── */
  const handleRegenerate = useCallback(async () => {
    try {
      const cards = await generate(notes);
      toast.success(`Regenerated ${cards.length} flashcards!`);
    } catch (err) {
      toast.error("Regeneration failed", {
        description: err instanceof Error ? err.message : undefined,
      });
    }
  }, [notes, generate]);

  /* ── Reset handler ──────────────────────────────────── */
  const handleReset = useCallback(() => {
    reset();
    setNotes("");
  }, [reset]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 relative overflow-x-hidden font-sans">


      {/* ── Header ──────────────────────────────────────── */}
      <Header />

      {/* ── Main ────────────────────────────────────────── */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pb-28">
        {/* Hero */}
        <section className="text-center pt-14 pb-11">


          {/* Headline */}
          <h1 className="font-display text-5xl sm:text-6xl md:text-[4.5rem] font-bold leading-[1.08] tracking-tight mb-4">
            Turn Notes into
            <span className="text-indigo-600">Knowledge</span>
          </h1>

          {/* Sub-headline */}
          <p className="text-slate-500 text-lg max-w-sm mx-auto leading-relaxed">
            Paste your lecture notes and get{" "}
            <span className="text-slate-700 font-medium">perfect study flashcards</span> in
            seconds.
          </p>
        </section>

        {/* Notes input */}
        <section>
          <NotesInput
            notes={notes}
            setNotes={setNotes}
            onGenerate={handleGenerate}
            isLoading={state === "loading"}
            onReset={state === "success" ? handleReset : undefined}
          />
        </section>

        {/* Dynamic content area */}
        <div className="mt-10">
          {state === "loading" && <LoadingSkeleton />}
          {state === "success" && flashcards.length > 0 && (
            <FlashCardGrid
              cards={flashcards}
              onRegenerate={handleRegenerate}
              isRegenerating={state === "loading"}
            />
          )}
          {(state === "idle" || state === "error") && <EmptyState />}
        </div>
      </main>

      {/* ── Toast notifications ──────────────────────────── */}
      <Toaster
        theme="light"
        position="bottom-right"
        richColors
        toastOptions={{
          style: {
            fontFamily: "'DM Sans', system-ui, sans-serif",
            background: "#ffffff",
            border: "1px solid rgba(0, 0, 0, 0.08)",
            color: "#0f172a",
          },
        }}
      />
    </div>
  );
}
