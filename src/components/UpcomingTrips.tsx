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
          <h2 className="font-serif text-3xl font-bold text-slate-900">
            Upcoming trips
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Tap any trip for the full itinerary and budget breakdown.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                activeCategory === category
                  ? "bg-teal-950 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visibleTrips.map((trip) => {
          const [city, ...rest] = trip.destination.split(",");
          const country = rest.join(",").trim();
          const percentSpent = Math.round((trip.spent / trip.budget) * 100);

          return (
            <Link
              key={trip.id}
              href={`/trips/${trip.id}`}
              className="block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={trip.image}
                  alt={trip.destination}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
                <span className="absolute left-3 top-3 inline-block rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-slate-900">
                  {trip.travelStyle}
                </span>
                <span className="absolute right-3 top-3">
                  <CountdownBadge startDate={trip.startDate} />
                </span>
              </div>

              <div className="p-5">
                <h3 className="text-lg font-semibold text-slate-900">
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
                  {trip.activities.map((activity) => (
                    <span
                      key={activity}
                      className="inline-block rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-900"
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
                    <span>{percentSpent}%</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100">
                    <div
                      className="h-1.5 rounded-full bg-orange-600"
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
