import { FileText, Loader2, RotateCcw, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotesInputProps {
  notes: string;
  setNotes: (value: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  onReset?: () => void;
}

const MAX_CHARS = 12_000;
const MIN_CHARS = 50;

export function NotesInput({
  notes,
  setNotes,
  onGenerate,
  isLoading,
  onReset,
}: NotesInputProps) {
  const charCount = notes.length;
  const charPercent = Math.min((charCount / MAX_CHARS) * 100, 100);
  const canGenerate = charCount >= MIN_CHARS && !isLoading;

  const clearNotes = () => {
    setNotes("");
  };

  return (
    <div className="space-y-3">
      {/* ── Textarea card ──────────────────────────────── */}
      <div
        className={cn(
          "relative rounded-2xl border transition-all duration-300",
          "border-slate-200 bg-white shadow-sm hover:border-slate-300",
        )}
      >
        {/* Toolbar */}
        <div className="relative z-10 flex items-center justify-between px-4 pt-3.5 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">
              {" "}
              Lecture Notes{" "}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {notes && (
              <button
                onClick={clearNotes}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                title="Clear notes"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Main textarea */}
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value.slice(0, MAX_CHARS))}
          placeholder={
            "Paste your lecture notes here…\n\nTip: the more detail you include, the better the flashcards will be."
          }
          rows={10}
          disabled={isLoading}
          className={cn(
            "relative z-10 w-full bg-transparent resize-none px-4 py-3 text-sm leading-relaxed",
            "text-slate-800 placeholder-slate-400 outline-none",
            "font-sans disabled:opacity-50 disabled:cursor-not-allowed",
            "transition-opacity duration-200",
          )}
        />

        {/* Character counter */}
        <div className="relative z-10 flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
          {/* Progress bar */}
          <div className="flex items-center gap-2 flex-1 mr-4">
            <div className="h-1.5 flex-1 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full",
                  charPercent > 85
                    ? "bg-amber-500"
                    : charPercent > 0
                      ? "bg-indigo-500"
                      : "bg-transparent",
                )}
                style={{ width: `${charPercent}%` }}
              />
            </div>
            <span
              className={cn(
                "text-xs tabular-nums shrink-0",
                charPercent > 85 ? "text-amber-600" : "text-slate-400",
              )}
            >
              {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()}
            </span>
          </div>
          {charCount < MIN_CHARS && charCount > 0 && (
            <span className="text-xs text-amber-600 font-medium">
              {MIN_CHARS - charCount} more chars needed
            </span>
          )}
        </div>
      </div>

      {/* ── Action buttons ─────────────────────────────── */}
      <div className="flex gap-3">
        {/* Generate */}
        <button
          onClick={onGenerate}
          disabled={!canGenerate}
          className={cn(
            "flex-1 flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl",
            "font-semibold text-sm tracking-wide",
            "transition-all duration-300 relative overflow-hidden",
            canGenerate
              ? [
                  "bg-indigo-600 hover:bg-indigo-700",
                  "text-white shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/40",
                  "hover:scale-[1.01] active:scale-[0.99]",
                ]
              : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200",
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Generating…
            </>
          ) : (
            <>
              <FileText className="w-4 h-4" /> Generate Flashcards
            </>
          )}
        </button>

        {/* Reset (only shown after cards are generated) */}
        {onReset && (
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-3.5 rounded-xl text-sm text-slate-600 font-medium border border-slate-200 hover:text-slate-900 hover:bg-slate-50 bg-white shadow-sm"
            title="Start over"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        )}
      </div>
    </div>
  );
}
