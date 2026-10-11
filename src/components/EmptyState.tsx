import type { ComponentType, ReactNode } from "react";

// The one look for "nothing here yet": a dashed card with an icon, a short
// message and, optionally, the action that fixes it.
export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = "",
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col items-center rounded-3xl border-2 border-dashed border-slate-200 bg-white/50 px-6 py-10 text-center dark:border-slate-800 dark:bg-slate-900/30 ${className}`}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300">
        <Icon className="h-5 w-5" />
      </span>
      <p className="mt-4 font-serif text-lg font-bold text-slate-900 dark:text-slate-50">
        {title}
      </p>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-slate-600 dark:text-slate-300">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
