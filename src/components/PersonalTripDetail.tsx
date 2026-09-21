"use client";

import Link from "next/link";
import { usePersonalTrips } from "@/hooks/usePersonalTrips";
import TripDetailView from "@/components/TripDetailView";

export default function PersonalTripDetail({ id }: { id: number }) {
  const { trips, ready } = usePersonalTrips();

  if (!ready) {
    return (
      <main className="flex-1 bg-stone-50 dark:bg-slate-950">
        <div className="mx-auto max-w-2xl px-6 py-24 text-center text-slate-400 dark:text-slate-500">
          Loading trip…
        </div>
      </main>
    );
  }

  const trip = trips.find((candidate) => candidate.id === id);

  if (!trip) {
    return (
      <main className="flex-1 bg-stone-50 dark:bg-slate-950">
        <div className="mx-auto max-w-2xl px-6 py-24 text-center">
          <h1 className="font-serif text-2xl font-bold text-slate-900 dark:text-slate-50">
            We couldn&apos;t find that trip
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            It may have been planned in a different browser, or the link is
            out of date.
          </p>
          <Link
            href="/#upcoming"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-teal-950 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-900 hover:shadow-md"
          >
            ← Back to trips
          </Link>
        </div>
      </main>
    );
  }

  return <TripDetailView trip={trip} />;
}
