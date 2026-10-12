import type { ComponentType, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { type Trip, formatDate, getNights } from "@/lib/trips";
import CountdownBadge from "@/components/CountdownBadge";
import BudgetPanel from "@/components/BudgetPanel";
import { getTravelStyleMeta } from "@/lib/travelStyleMeta";
import {
  CalendarIcon,
  CompassIcon,
  SparkleIcon,
} from "@/components/icons";

const ACTIVITY_TINTS = [
  "bg-amber-50 text-amber-900 dark:bg-amber-500/15 dark:text-amber-300",
  "bg-orange-50 text-orange-900 dark:bg-orange-500/15 dark:text-orange-300",
  "bg-rose-50 text-rose-900 dark:bg-rose-500/15 dark:text-rose-300",
];

// Heading outside, content in a card -- the same shape BudgetPanel uses,
// so every section of the page reads the same way.
function Section({
  title,
  icon: Icon,
  iconClass,
  children,
}: {
  title: string;
  icon: ComponentType<{ className?: string }>;
  iconClass: string;
  children: ReactNode;
}) {
  return (
    <>
      <h2 className="mt-8 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-50">
        <Icon className={`h-5 w-5 ${iconClass}`} />
        {title}
      </h2>
      <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {children}
      </div>
    </>
  );
}

export default function TripDetailView({ trip }: { trip: Trip }) {
  const meta = getTravelStyleMeta(trip.travelStyle);
  const StyleIcon = meta.icon;

  return (
    <main className="flex-1 bg-stone-50 dark:bg-slate-950">
      <div className="relative h-80 w-full sm:h-[26rem]">
        {trip.image.startsWith("/") ? (
          <Image
            src={trip.image}
            alt={trip.destination}
            fill
            loading="eager"
            fetchPriority="high"
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
        <div className="absolute inset-0 bg-gradient-to-t from-teal-950/90 via-teal-950/30 to-teal-950/20" />
        <div
          className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${meta.barClass}`}
        />

        <div className="relative mx-auto flex h-full max-w-2xl flex-col justify-between px-6 pt-6 pb-8">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/#upcoming"
              className="inline-flex items-center gap-1 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white ring-1 ring-white/25 backdrop-blur transition hover:bg-white/25"
            >
              ← Back to trips
            </Link>
            <CountdownBadge startDate={trip.startDate} />
          </div>

          <div className="animate-fade-in-up">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold shadow-sm backdrop-blur ${meta.iconClass}`}
            >
              <StyleIcon className="h-3.5 w-3.5" />
              <span className="text-slate-800">{trip.travelStyle}</span>
            </span>
            <h1 className="mt-3 font-serif text-4xl font-bold text-white sm:text-5xl">
              {trip.destination}
            </h1>
            <p className="mt-2 flex items-center gap-1.5 text-stone-200">
              <CalendarIcon className="h-4 w-4 shrink-0 text-amber-300" />
              {formatDate(trip.startDate)} – {formatDate(trip.endDate)} ·{" "}
              {getNights(trip)} nights
            </p>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-2xl px-6 pt-10 pb-12">
        {trip.description && (
          <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-200">
            {trip.description}
          </p>
        )}

        {trip.activities.length > 0 && (
          <Section
            title="Activities"
            icon={CompassIcon}
            iconClass="text-orange-500"
          >
            <div className="flex flex-wrap gap-2">
              {trip.activities.map((activity, i) => (
                <span
                  key={activity}
                  className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
                    ACTIVITY_TINTS[i % ACTIVITY_TINTS.length]
                  }`}
                >
                  {activity}
                </span>
              ))}
            </div>
          </Section>
        )}

        {trip.packingList && trip.packingList.length > 0 && (
          <Section
            title="Packing list"
            icon={SparkleIcon}
            iconClass="text-amber-500"
          >
            <ul className="grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
              {trip.packingList.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2.5 text-slate-700 dark:text-slate-200"
                >
                  <span
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 rounded-md border-2 border-teal-700/40 dark:border-teal-400/50"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {trip.notes && (
          <Section
            title="Notes"
            icon={CalendarIcon}
            iconClass="text-teal-700 dark:text-teal-400"
          >
            <p className="whitespace-pre-line text-slate-700 dark:text-slate-200">
              {trip.notes}
            </p>
          </Section>
        )}

        <BudgetPanel trip={trip} />
      </section>
    </main>
  );
}
