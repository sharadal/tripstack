import Image from "next/image";
import Link from "next/link";
import { trips, formatDate, formatCurrency } from "@/lib/trips";
import CountdownBadge from "@/components/CountdownBadge";

export default function Home() {
  const totalBudget = trips.reduce((sum, trip) => sum + trip.budget, 0);
  const totalSpent = trips.reduce((sum, trip) => sum + trip.spent, 0);
  const totalRemaining = totalBudget - totalSpent;

  return (
    <main className="flex-1 bg-slate-50">
      <section className="relative overflow-hidden px-6 py-16 text-center text-white">
        <Image
          src="/images/hero-travel.jpg"
          alt="Calm mountain lake, a scenic travel destination"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-teal-950/70 to-slate-900/85" />

        <div className="relative">
          <h1 className="text-3xl font-bold sm:text-4xl">
            Every trip, organised in one place
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-slate-200">
            Destinations, dates, and activities — all together, so you can
            plan with confidence.
          </p>
          <Link
            href="/trips/new"
            className="mt-8 inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Plan a new trip
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <h2 className="mb-6 text-2xl font-semibold text-slate-900">
          Upcoming
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => (
            <Link
              key={trip.id}
              href={`/trips/${trip.id}`}
              className="block rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-lg font-semibold text-slate-900">
                  {trip.destination}
                </h3>
                <CountdownBadge startDate={trip.startDate} />
              </div>
              <p className="mt-1 text-sm text-slate-500">
                {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-block rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700">
                  {trip.travelStyle}
                </span>
                <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  Budget: {formatCurrency(trip.budget)}
                </span>
              </div>

              <ul className="mt-4 space-y-1 text-sm text-slate-600">
                {trip.activities.map((activity) => (
                  <li key={activity} className="flex items-start gap-2">
                    <span aria-hidden="true">•</span>
                    <span>{activity}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 border-t border-slate-100 pt-3">
                <span className="inline-flex items-center gap-1 text-sm font-medium text-sky-700">
                  View trip
                  <span aria-hidden="true">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-12">
        <h2 className="mb-6 text-2xl font-semibold text-slate-900">
          Budget at a glance
        </h2>

        <div className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total budget</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">
              {formatCurrency(totalBudget)}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Committed so far</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">
              {formatCurrency(totalSpent)}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Remaining</p>
            <p className="mt-1 text-2xl font-semibold text-emerald-700">
              {formatCurrency(totalRemaining)}
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <ul className="divide-y divide-slate-100">
            {trips.map((trip) => {
              const percentSpent = Math.round(
                (trip.spent / trip.budget) * 100,
              );

              return (
                <li
                  key={trip.id}
                  className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {trip.destination}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatCurrency(trip.spent)} committed of{" "}
                      {formatCurrency(trip.budget)}
                    </p>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 sm:w-40">
                    <div
                      className="h-2 rounded-full bg-sky-600"
                      style={{ width: `${percentSpent}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </main>
  );
}
