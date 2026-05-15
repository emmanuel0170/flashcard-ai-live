import { Loader2, RefreshCw, Layers } from "lucide-react";
import type { Flashcard } from "@/types";
import { FlashCard } from "./FlashCard";

interface FlashCardGridProps {
  cards: Flashcard[];
  onRegenerate: () => void;
  isRegenerating: boolean;
}

export function FlashCardGrid({
  cards,
  onRegenerate,
  isRegenerating,
}: FlashCardGridProps) {
  return (
    <section className="mt-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white shadow-sm border border-slate-200">
            <Layers className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-sm font-semibold text-slate-700">
              {cards.length}
            </span>
            <span className="text-xs text-slate-500">
              {cards.length === 1 ? "card" : "cards"}
            </span>
          </div>

          <div className="h-4 w-px bg-slate-200" />

          <p className="text-xs text-slate-500">
            Click any card to reveal its answer
          </p>
        </div>

        <button
          onClick={onRegenerate}
          disabled={isRegenerating}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isRegenerating ? (
            <Loader2 className="w-3.5 h-3.5" />
          ) : (
            <RefreshCw className="w-3.5 h-3.5" />
          )}
          Regenerate
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card, i) => (
          <FlashCard key={card.id} card={card} index={i} />
        ))}
      </div>

      <p className="text-center text-xs text-slate-400 mt-8">
        Pro tip — use keyboard ↵ to flip the focused card
      </p>
    </section>
  );
}
