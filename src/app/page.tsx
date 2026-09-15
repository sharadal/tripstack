import Link from "next/link";
import { trips, formatDate } from "@/lib/trips";
import CountdownBadge from "@/components/CountdownBadge";

export default function Home() {
  return (
    <main className="flex-1 bg-slate-50">
      <section className="bg-slate-900 px-6 py-16 text-center text-white">
        <h1 className="text-3xl font-bold sm:text-4xl">
          Every trip, organised in one place
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-slate-300">
          Destinations, dates, and activities — all together, so you can plan
          with confidence.
        </p>
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
                  Budget: {trip.budget}
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
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
