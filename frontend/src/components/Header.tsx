import { Library } from "lucide-react";

export function Header() {
  return (
    <header className="relative z-20 flex items-center justify-between px-6 sm:px-10 py-5 border-b border-slate-200 bg-white/50 backdrop-blur-md">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
          <Library className="w-4 h-4 text-white" />
        </div>
        <span className="font-display font-bold text-lg tracking-tight text-slate-900">
          FlashCards
        </span>
      </div>
    </header>
  );
}
