function SkeletonCard({ delay }: { delay: number }) {
  return (
    <div className="h-60 rounded-2xl border border-slate-200 bg-white shadow-sm p-5 flex flex-col gap-4 overflow-hidden">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg skeleton" />
        <div className="h-2.5 w-16 rounded-full skeleton" />
      </div>

      <div className="flex-1 flex flex-col justify-center gap-2.5">
        <div className="h-3 rounded-full skeleton w-full" />
        <div className="h-3 rounded-full skeleton w-4/5" />
        <div className="h-3 rounded-full skeleton w-3/5" />
      </div>

      <div className="h-px w-full skeleton" />
    </div>
  );
}

export function LoadingSkeleton() {
  return (
    <section className="mt-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-24 rounded-full skeleton" />
          <div className="h-px w-4 bg-slate-200" />
          <div className="h-3 w-40 rounded-full skeleton" />
        </div>
        <div className="h-8 w-28 rounded-xl skeleton" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} delay={i * 0.06} />
        ))}
      </div>

      <div className="text-center mt-8">
        <p className="text-sm text-slate-500">
          ✨ AI is crafting your flashcards…
        </p>
      </div>
    </section>
  );
}
