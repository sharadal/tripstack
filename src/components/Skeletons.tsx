// Placeholder shapes shown while a page loads. The skeleton mirrors the
// real layout, so content drops into place instead of jumping around.

// Shape and tone are props rather than extra classes, so they replace the
// defaults instead of competing with them.
export function Skeleton({
  className = "",
  shape = "rounded-full",
  tone = "bg-slate-200 dark:bg-slate-800",
}: {
  className?: string;
  shape?: string;
  tone?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse motion-reduce:animate-none ${shape} ${tone} ${className}`}
    />
  );
}

// Lighter shapes for on top of the grey cover-photo placeholder.
const onCover = "bg-slate-300 dark:bg-slate-600";

export function TripDetailSkeleton() {
  return (
    <main aria-busy="true" className="flex-1 bg-stone-50 dark:bg-slate-950">
      <span role="status" className="sr-only">
        Loading trip…
      </span>
      <div className="relative h-80 w-full animate-pulse bg-slate-200 motion-reduce:animate-none sm:h-[26rem] dark:bg-slate-800">
        <div className="mx-auto flex h-full max-w-2xl flex-col justify-end px-6 pb-8">
          <Skeleton className="h-6 w-24" tone={onCover} />
          <Skeleton className="mt-4 h-10 w-72 max-w-full" tone={onCover} />
          <Skeleton className="mt-3 h-4 w-56" tone={onCover} />
        </div>
      </div>
      <section className="mx-auto max-w-2xl px-6 pt-10 pb-12">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="mt-3 h-5 w-2/3" />
        {[0, 1].map((i) => (
          <div key={i}>
            <Skeleton className="mt-10 h-5 w-32" />
            <div className="mt-3 flex gap-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <Skeleton className="h-7 w-24" />
              <Skeleton className="h-7 w-28" />
              <Skeleton className="h-7 w-20" />
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
