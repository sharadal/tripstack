import Image from "next/image";
import Link from "next/link";
import { type Trip, formatDate, getNights } from "@/lib/trips";
import CountdownBadge from "@/components/CountdownBadge";
import BudgetPanel from "@/components/BudgetPanel";
import { getTravelStyleMeta } from "@/lib/travelStyleMeta";

export default function TripDetailView({ trip }: { trip: Trip }) {
  const meta = getTravelStyleMeta(trip.travelStyle);
  const StyleIcon = meta.icon;

  return (
    <main className="flex-1 bg-stone-50 dark:bg-slate-950">
      <div className="relative h-64 w-full sm:h-80">
        {trip.image.startsWith("/") ? (
          <Image
            src={trip.image}
            alt={trip.destination}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={trip.image}
            alt={trip.destination}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-teal-950/70 via-teal-950/10 to-transparent" />
        <div
          className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${meta.barClass}`}
        />
        <span className="absolute right-4 top-4">
          <CountdownBadge startDate={trip.startDate} />
        </span>
      </div>

      <section className="mx-auto max-w-2xl px-6 py-12">
        <Link
          href="/#upcoming"
          className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 transition hover:text-teal-900 dark:text-slate-400 dark:hover:text-amber-300"
        >
          ← Back to trips
        </Link>

        <h1 className="mt-4 font-serif text-3xl font-bold text-slate-900 dark:text-slate-50">
          {trip.destination}
        </h1>

        <p className="mt-2 text-slate-500 dark:text-slate-400">
          {formatDate(trip.startDate)} – {formatDate(trip.endDate)} ·{" "}
          {getNights(trip)} nights
        </p>

        {trip.description && (
          <p className="mt-4 text-slate-600 dark:text-slate-300">{trip.description}</p>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${meta.badgeClass}`}
          >
            <StyleIcon className="h-3.5 w-3.5" />
            {trip.travelStyle}
          </span>
        </div>

        {trip.activities.length > 0 && (
          <>
            <h2 className="mt-8 text-lg font-semibold text-slate-900 dark:text-slate-50">
              Activities
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {trip.activities.map((activity) => (
                <span
                  key={activity}
                  className="inline-block rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-900 dark:bg-amber-500/15 dark:text-amber-300"
                >
                  {activity}
                </span>
              ))}
            </div>
          </>
        )}

        {trip.packingList && trip.packingList.length > 0 && (
          <>
            <h2 className="mt-8 text-lg font-semibold text-slate-900 dark:text-slate-50">
              Packing list
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {trip.packingList.map((item) => (
                <span
                  key={item}
                  className="inline-block rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-900 shadow-sm dark:bg-slate-800 dark:text-slate-100"
                >
                  {item}
                </span>
              ))}
            </div>
          </>
        )}

        {trip.notes && (
          <>
            <h2 className="mt-8 text-lg font-semibold text-slate-900 dark:text-slate-50">
              Notes
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-300">{trip.notes}</p>
          </>
        )}

        <BudgetPanel trip={trip} />
      </section>
    </main>
  );
}
