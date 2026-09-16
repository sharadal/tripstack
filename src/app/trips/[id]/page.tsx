import Link from "next/link";
import { notFound } from "next/navigation";
import { trips, getTripById, formatDate, formatCurrency } from "@/lib/trips";
import CountdownBadge from "@/components/CountdownBadge";

export function generateStaticParams() {
  return trips.map((trip) => ({ id: String(trip.id) }));
}

export default async function TripDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const trip = getTripById(Number(id));

  if (!trip) {
    notFound();
  }

  return (
    <main className="flex-1 bg-slate-50">
      <section className="mx-auto max-w-2xl px-6 py-12">
        <Link
          href="/"
          className="text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          ← Back to trips
        </Link>

        <div className="mt-4 flex items-start justify-between gap-2">
          <h1 className="text-3xl font-bold text-slate-900">
            {trip.destination}
          </h1>
          <CountdownBadge startDate={trip.startDate} />
        </div>

        <p className="mt-2 text-slate-500">
          {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-block rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700">
            {trip.travelStyle}
          </span>
          <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            Budget: {formatCurrency(trip.budget)}
          </span>
        </div>

        <h2 className="mt-8 text-lg font-semibold text-slate-900">
          Activities
        </h2>
        <ul className="mt-3 space-y-2 text-slate-600">
          {trip.activities.map((activity) => (
            <li key={activity} className="flex items-start gap-2">
              <span aria-hidden="true">•</span>
              <span>{activity}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
