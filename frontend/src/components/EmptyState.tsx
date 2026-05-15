import { BookOpen, FileText, List } from "lucide-react";

/** Feature pill used in the empty state */
function FeaturePill({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) {
  return (
    <div
      className="flex items-center gap-2 px-3.5 py-2 rounded-full border border-slate-200 bg-white shadow-sm text-xs text-slate-500"
    >
      <Icon className="w-3.5 h-3.5 text-indigo-400/70" />
      {label}
    </div>
  );
}

/** Empty / idle state — prompts the user to paste notes */
export function EmptyState() {
  return (
    <section
      className="mt-14 flex flex-col items-center text-center"
    >
      {/* Illustration */}
      <div className="relative mb-8">


        {/* Icon cluster */}
        <div className="relative flex items-end gap-3">
          <div
            className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center"
          >
            <FileText className="w-5 h-5 text-slate-400" />
          </div>

          <div
            className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center shadow-lg shadow-indigo-500/5"
          >
            <List className="w-7 h-7 text-indigo-500" />
          </div>

          <div
            className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center"
          >
            <BookOpen className="w-5 h-5 text-slate-400" />
          </div>
        </div>
      </div>

      <h2 className="font-display text-2xl font-semibold text-slate-800 mb-2">
        Ready to study smarter?
      </h2>
      <p className="text-sm text-slate-500 max-w-xs leading-relaxed mb-7">
        Paste your lecture notes above and click{" "}
        <span className="text-indigo-500 font-medium">Generate Flashcards</span> to create
        study cards in seconds.
      </p>

      {/* Feature pills */}
      <div className="flex flex-wrap justify-center gap-2">
        <FeaturePill icon={List} label="Generated questions" />
        <FeaturePill icon={BookOpen} label="Exam-focused answers" />
        <FeaturePill icon={FileText} label="TXT file upload" />
      </div>
    </section>
  );
}
