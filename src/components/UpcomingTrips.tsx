"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  type Trip,
  formatDate,
  formatCurrency,
  getNights,
} from "@/lib/trips";
import CountdownBadge from "@/components/CountdownBadge";
import { CompassIcon, MapPinIcon, SparkleIcon } from "@/components/icons";
import { getTravelStyleMeta } from "@/lib/travelStyleMeta";

const ACTIVITY_TINTS = [
  "bg-amber-50 text-amber-900",
  "bg-orange-50 text-orange-900",
  "bg-rose-50 text-rose-900",
];

export default function UpcomingTrips({ trips }: { trips: Trip[] }) {
  const categories = ["All", ...new Set(trips.map((trip) => trip.travelStyle))];
  const [activeCategory, setActiveCategory] = useState("All");

  const visibleTrips =
    activeCategory === "All"
      ? trips
      : trips.filter((trip) => trip.travelStyle === activeCategory);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 font-serif text-3xl font-bold text-slate-900">
            <CompassIcon className="h-7 w-7 text-orange-500" />
            Upcoming trips
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Tap any trip for the full itinerary and budget breakdown.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const meta =
              category === "All" ? null : getTravelStyleMeta(category);
            const Icon = meta?.icon ?? SparkleIcon;
            const isActive = activeCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 ${
                  isActive
                    ? "bg-teal-950 text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-orange-300 hover:text-orange-700"
                }`}
              >
                <Icon
                  className={`h-3.5 w-3.5 ${isActive ? "text-orange-300" : ""}`}
                />
                {category}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visibleTrips.map((trip, index) => {
          const [city, ...rest] = trip.destination.split(",");
          const country = rest.join(",").trim();
          const percentSpent = Math.round((trip.spent / trip.budget) * 100);
          const meta = getTravelStyleMeta(trip.travelStyle);
          const Icon = meta.icon;

          return (
            <Link
              key={trip.id}
              href={`/trips/${trip.id}`}
              style={{ animationDelay: `${index * 80}ms` }}
              className="group animate-fade-in-up block overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:rotate-[-0.3deg] hover:shadow-xl"
            >
              <div className={`h-1.5 w-full bg-gradient-to-r ${meta.barClass}`} />

              <div className="relative h-48 w-full overflow-hidden">
                {trip.image.startsWith("/") ? (
                  <Image
                    src={trip.image}
                    alt={trip.destination}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={trip.image}
                    alt={trip.destination}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
                <span
                  className={`absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold shadow-sm backdrop-blur ${meta.iconClass}`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="text-slate-800">{trip.travelStyle}</span>
                </span>
                <span className="absolute right-3 top-3">
                  <CountdownBadge startDate={trip.startDate} />
                </span>
              </div>

              <div className="p-5">
                <h3 className="flex items-center gap-1 text-lg font-semibold text-slate-900">
                  <MapPinIcon className="h-4 w-4 shrink-0 text-orange-500" />
                  {city}
                  <span className="font-normal text-slate-500">
                    ,{country}
                  </span>
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {formatDate(trip.startDate)} – {formatDate(trip.endDate)} ·{" "}
                  {getNights(trip)} nights
                </p>
                <p className="mt-3 text-sm text-slate-600">
                  {trip.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {trip.activities.map((activity, i) => (
                    <span
                      key={activity}
                      className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                        ACTIVITY_TINTS[i % ACTIVITY_TINTS.length]
                      }`}
                    >
                      {activity}
                    </span>
                  ))}
                </div>

                <div className="mt-4 border-t border-slate-100 pt-3">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>
                      {formatCurrency(trip.spent)} of{" "}
                      {formatCurrency(trip.budget)}
                    </span>
                    <span className="font-semibold text-orange-600">
                      {percentSpent}%
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100">
                    <div
                      className="h-1.5 rounded-full bg-gradient-to-r from-orange-400 to-orange-600"
                      style={{ width: `${percentSpent}%` }}
                    />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
