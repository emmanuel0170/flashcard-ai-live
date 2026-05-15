import { useState } from "react";
import { BookOpen, Check, Copy, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Flashcard } from "@/types";

interface FlashCardProps {
  card: Flashcard;
  /** Stagger index for entrance animation */
  index: number;
}

export function FlashCard({ card, index }: FlashCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [copied, setCopied] = useState(false);

  /* ── Copy Q+A to clipboard ──────────────────────────── */
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation(); // don't flip the card
    const text = `Q: ${card.question}\n\nA: ${card.answer}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      style={{ perspective: 1200 }}
      className="h-60 cursor-pointer group select-none"
      onClick={() => setIsFlipped((f) => !f)}
      role="button"
      tabIndex={0}
      aria-label={isFlipped ? "Show question" : "Reveal answer"}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") setIsFlipped((f) => !f);
      }}
    >
      <div
        style={{ transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
        className="relative w-full h-full preserve-3d transition-transform duration-500"
      >
        {/* ── Front face — Question ─────────────────────── */}
        <div
          className={cn(
            "backface-hidden absolute inset-0 rounded-2xl p-5 flex flex-col",
            "border transition-all duration-300 card-glow",
            "bg-white shadow-sm",
            isFlipped
              ? "border-slate-300 shadow-md"
              : "border-slate-200 group-hover:border-indigo-300",
          )}
        >
          {/* Header row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/15 flex items-center justify-center">
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <span className="text-[10px] font-semibold text-indigo-400/70 uppercase tracking-[0.15em]">
                Question
              </span>
            </div>

            <button
              onClick={handleCopy}
              className={cn(
                "p-1.5 rounded-lg transition-all duration-200",
                "text-slate-400 hover:text-slate-700 hover:bg-slate-100",
                "opacity-0 group-hover:opacity-100",
              )}
              title="Copy card"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* Question text */}
          <p className="flex-1 text-sm text-slate-800 font-medium leading-relaxed line-clamp-5">
            {card.question}
          </p>

          {/* Footer hint */}
          <div className="mt-4 flex items-center gap-2">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-[9px] text-slate-400 uppercase tracking-widest">
              tap to flip
            </span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>
        </div>

        {/* ── Back face — Answer ────────────────────────── */}
        <div
          className={cn(
            "backface-hidden rotate-y-180",
            "absolute inset-0 rounded-2xl p-6 flex flex-col",
            "border border-indigo-200",
            "bg-indigo-50 shadow-md",
          )}
        >
          {/* Header row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/15 flex items-center justify-center">
                <Lightbulb className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <span className="text-[10px] font-semibold text-cyan-400/70 uppercase tracking-[0.15em]">
                Answer
              </span>
            </div>

            <button
              onClick={handleCopy}
              className={cn(
                "p-1.5 rounded-lg transition-all duration-200",
                "text-slate-400 hover:text-slate-700 hover:bg-slate-100",
                "opacity-0 group-hover:opacity-100",
              )}
              title="Copy card"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* Answer text */}
          <p className="flex-1 text-sm text-slate-800 leading-relaxed line-clamp-5 overflow-y-auto">
            {card.answer}
          </p>

          {/* Footer hint */}
          <div className="mt-4 flex items-center gap-2">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-[9px] text-slate-400 uppercase tracking-widest">
              tap to flip back
            </span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>
        </div>
      </div>
    </div>
  );
}
