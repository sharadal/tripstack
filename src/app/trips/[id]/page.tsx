import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  trips,
  getTripById,
  formatDate,
  formatCurrency,
  getNights,
} from "@/lib/trips";
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

  const percentSpent = Math.round((trip.spent / trip.budget) * 100);

  return (
    <main className="flex-1 bg-stone-50">
      <div className="relative h-64 w-full sm:h-80">
        <Image
          src={trip.image}
          alt={trip.destination}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-teal-950/70 via-teal-950/10 to-transparent" />
        <span className="absolute right-4 top-4">
          <CountdownBadge startDate={trip.startDate} />
        </span>
      </div>

      <section className="mx-auto max-w-2xl px-6 py-12">
        <Link
          href="/#upcoming"
          className="text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          ← Back to trips
        </Link>

        <h1 className="mt-4 font-serif text-3xl font-bold text-slate-900">
          {trip.destination}
        </h1>

        <p className="mt-2 text-slate-500">
          {formatDate(trip.startDate)} – {formatDate(trip.endDate)} ·{" "}
          {getNights(trip)} nights
        </p>

        <p className="mt-4 text-slate-600">{trip.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-block rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-900 shadow-sm">
            {trip.travelStyle}
          </span>
        </div>

        <h2 className="mt-8 text-lg font-semibold text-slate-900">
          Activities
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {trip.activities.map((activity) => (
            <span
              key={activity}
              className="inline-block rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-900"
            >
              {activity}
            </span>
          ))}
        </div>

        <h2 className="mt-8 text-lg font-semibold text-slate-900">Budget</h2>
        <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>
              {formatCurrency(trip.spent)} of {formatCurrency(trip.budget)}{" "}
              committed
            </span>
            <span>{percentSpent}%</span>
          </div>
          <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
            <div
              className="h-2 rounded-full bg-orange-600"
              style={{ width: `${percentSpent}%` }}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
