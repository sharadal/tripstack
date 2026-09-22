import type { Metadata } from "next";
import Link from "next/link";
import { CompassIcon, PlaneIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Page not found — TripStack",
};

export default function NotFound() {
  return (
    <main className="flex-1 bg-stone-50 dark:bg-slate-950">
      <section className="mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-900 to-teal-950 text-white shadow-sm">
          <CompassIcon className="h-6 w-6" />
        </span>

        <p className="mt-6 text-xs font-semibold tracking-[0.2em] text-orange-700 uppercase dark:text-orange-400">
          404
        </p>
        <h1 className="mt-3 font-serif text-3xl font-bold text-slate-900 sm:text-4xl dark:text-slate-50">
          This trip took a wrong turn
        </h1>
        <p className="mt-3 max-w-md text-slate-600 dark:text-slate-300">
          The page you&apos;re looking for doesn&apos;t exist — it may have
          been moved, or the link might be out of date.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-teal-950 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-900 hover:shadow-md"
          >
            <PlaneIcon className="h-3.5 w-3.5 -rotate-45" />
            Back to home
          </Link>
          <Link
            href="/trips/new"
            className="text-sm font-medium text-slate-500 transition hover:text-teal-900 dark:text-slate-400 dark:hover:text-amber-300"
          >
            Plan a new trip instead
          </Link>
        </div>
      </section>
    </main>
  );
}
