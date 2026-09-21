import Image from "next/image";
import {
  trips,
  formatCurrency,
  formatDate,
  daysUntil,
  nextDeparture,
} from "@/lib/trips";
import UpcomingTrips from "@/components/UpcomingTrips";

export default function Home() {
  const totalBudget = trips.reduce((sum, trip) => sum + trip.budget, 0);
  const totalSpent = trips.reduce((sum, trip) => sum + trip.spent, 0);
  const totalRemaining = totalBudget - totalSpent;
  const upcoming = nextDeparture();

  return (
    <main className="flex-1 bg-stone-50">
      <section className="relative overflow-hidden px-6 py-20 text-white sm:py-28">
        <Image
          src="/images/hero-travel.jpg"
          alt="Calm mountain lake, a scenic travel destination"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-teal-950/85 via-teal-950/75 to-teal-950/90" />

        <div className="relative mx-auto max-w-6xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-stone-300 uppercase">
            {trips.length} trips planned · {formatCurrency(totalBudget)}{" "}
            budgeted
          </p>

          <h1 className="mt-6 max-w-2xl font-serif text-4xl leading-tight text-stone-50 sm:text-5xl lg:text-6xl">
            <span className="font-bold">Every trip you&apos;re dreaming about,</span>{" "}
            in one <span className="font-bold">calm place.</span>
          </h1>

          <p className="mt-6 max-w-xl text-stone-200">
            Dates, budgets, and activities — all tracked per trip, with a
            countdown to the next departure.
          </p>

          {upcoming && (
            <div className="mt-8 inline-flex max-w-md flex-wrap items-center gap-6 rounded-2xl bg-stone-50 px-6 py-5 text-slate-900 shadow-lg sm:flex-nowrap">
              <div>
                <p className="text-xs font-semibold tracking-[0.15em] text-slate-500 uppercase">
                  Next departure
                </p>
                <p className="mt-1 font-semibold text-slate-900">
                  {upcoming.destination}
                </p>
                <p className="text-sm text-slate-500">
                  {formatDate(upcoming.startDate)} –{" "}
                  {formatDate(upcoming.endDate)}
                </p>
              </div>
              <div className="border-l border-slate-200 pl-6">
                <p className="text-3xl font-bold text-orange-600">
                  {daysUntil(upcoming.startDate)}
                </p>
                <p className="text-xs font-semibold tracking-[0.15em] text-slate-500 uppercase">
                  Days to go
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section id="upcoming" className="mx-auto max-w-6xl px-6 py-16">
        <UpcomingTrips trips={trips} />
      </section>

      <section id="budget" className="mx-auto max-w-6xl px-6 pb-16">
        <h2 className="mb-6 font-serif text-3xl font-bold text-slate-900">
          Budget at a glance
        </h2>

        <div className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total budget</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">
              {formatCurrency(totalBudget)}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Committed so far</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">
              {formatCurrency(totalSpent)}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Remaining</p>
            <p className="mt-1 text-2xl font-semibold text-teal-800">
              {formatCurrency(totalRemaining)}
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
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
                      className="h-2 rounded-full bg-orange-600"
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
