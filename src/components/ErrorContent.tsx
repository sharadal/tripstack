"use client";

import { useEffect, useLayoutEffect } from "react";
import { CompassIcon, PlaneIcon } from "@/components/icons";

// Same rule as the theme-init script in layout.tsx: a saved choice wins,
// otherwise follow the OS.
export function prefersDark() {
  try {
    const saved = localStorage.getItem("theme");
    return saved
      ? saved === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
  } catch {
    return false;
  }
}

// Shared body of error.tsx and global-error.tsx. The global one renders
// without the root layout, so the home link is a plain <a> that does a full
// page load instead of relying on the (broken) app shell.
export default function ErrorContent({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  // When a page fails during server rendering, React re-renders <html> on
  // the client and drops the `dark` class the theme-init script added.
  // Restore it before paint, and before ThemeToggle reads it in its effect.
  useLayoutEffect(() => {
    document.documentElement.classList.toggle("dark", prefersDark());
  }, []);

  return (
    <main className="flex-1 bg-stone-50 dark:bg-slate-950">
      <section className="mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-900 to-teal-950 text-white shadow-sm">
          <CompassIcon className="h-6 w-6" />
        </span>

        <p className="mt-6 text-xs font-semibold tracking-[0.2em] text-orange-700 uppercase dark:text-orange-400">
          Something went wrong
        </p>
        <h1 className="mt-3 font-serif text-3xl font-bold text-balance text-slate-900 sm:text-4xl dark:text-slate-50">
          We hit some turbulence
        </h1>
        <p className="mt-3 max-w-md text-slate-600 dark:text-slate-300">
          This page ran into an unexpected problem on our side. Your saved
          trips are safe — try again, or head back home and pick up where you
          left off.
        </p>
        {error.digest && (
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            Error reference: <code className="font-mono">{error.digest}</code>
          </p>
        )}

        <div className="mt-8 flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-4">
          <button
            type="button"
            onClick={() => retry()}
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-teal-950 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-900 hover:shadow-md"
          >
            <PlaneIcon className="h-3.5 w-3.5 -rotate-45" />
            Try again
          </button>
          {/* A full page load on purpose — see the comment at the top. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/"
            className="inline-flex min-h-11 items-center px-4 text-sm font-medium text-slate-500 transition hover:text-teal-900 dark:text-slate-400 dark:hover:text-amber-300"
          >
            Back to home
          </a>
        </div>
      </section>
    </main>
  );
}
