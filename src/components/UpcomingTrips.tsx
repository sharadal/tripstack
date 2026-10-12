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
import EmptyState from "@/components/EmptyState";
import {
  CompassIcon,
  MapPinIcon,
  PlaneIcon,
  SearchIcon,
  SparkleIcon,
} from "@/components/icons";
import { getTravelStyleMeta } from "@/lib/travelStyleMeta";
import { useBudgetEntries } from "@/hooks/useBudgetEntries";
import { getTripSpent } from "@/lib/budget";

const ACTIVITY_TINTS = [
  "bg-amber-50 text-amber-900 dark:bg-amber-500/15 dark:text-amber-300",
  "bg-orange-50 text-orange-900 dark:bg-orange-500/15 dark:text-orange-300",
  "bg-rose-50 text-rose-900 dark:bg-rose-500/15 dark:text-rose-300",
];

// Cards show a few activities and a "+N" chip for the rest, so long
// lists don't make one card much taller than its neighbours.
const MAX_CARD_ACTIVITIES = 3;

function describeEmptyState(query: string, category: string) {
  const trimmed = query.trim();

  if (trimmed && category !== "All") {
    return `No trips match “${trimmed}” in ${category}.`;
  }
  if (trimmed) {
    return `No trips match “${trimmed}”.`;
  }
  if (category !== "All") {
    return `No trips in ${category} match your filters.`;
  }
  return "No trips to show yet.";
}

export default function UpcomingTrips({ trips }: { trips: Trip[] }) {
  const categories = ["All", ...new Set(trips.map((trip) => trip.travelStyle))];
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");
  const budgetEntries = useBudgetEntries();

  const trimmedQuery = query.trim().toLowerCase();

  const visibleTrips = trips.filter((trip) => {
    const matchesCategory =
      activeCategory === "All" || trip.travelStyle === activeCategory;
    const matchesQuery =
      trimmedQuery === "" ||
      trip.destination.toLowerCase().includes(trimmedQuery) ||
      trip.description.toLowerCase().includes(trimmedQuery);

    return matchesCategory && matchesQuery;
  });

  const hasActiveFilters = trimmedQuery !== "" || activeCategory !== "All";

  const handleClearFilters = () => {
    setQuery("");
    setActiveCategory("All");
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 font-serif text-3xl font-bold text-slate-900 dark:text-slate-50">
            <CompassIcon className="h-7 w-7 text-orange-500" />
            Upcoming trips
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Tap any trip for the full itinerary and budget breakdown.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:items-end">
          <div className="relative w-full sm:w-72">
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search destinations…"
              aria-label="Search trips by destination or description"
              className="w-full rounded-full border border-slate-200 bg-white py-2.5 pr-4 pl-10 text-sm text-slate-900 placeholder-slate-400 transition focus:border-orange-600 focus:outline-none focus:ring-1 focus:ring-orange-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50 dark:placeholder-slate-500"
            />
          </div>

          <div className="flex flex-wrap gap-2 sm:justify-end">
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
                  aria-pressed={isActive}
                  className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 ${
                    isActive
                      ? "bg-teal-950 text-white shadow-sm"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-orange-300 hover:text-orange-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-orange-400 dark:hover:text-orange-300"
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
      </div>

      {/* Lets screen-reader users know the list changed as they type. */}
      <p className="sr-only" aria-live="polite">
        {visibleTrips.length} {visibleTrips.length === 1 ? "trip" : "trips"}{" "}
        shown
      </p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* With no filters the "Build your next adventure" card below is
            already the call to action, so this only covers filtered views. */}
        {visibleTrips.length === 0 && hasActiveFilters && (
          <EmptyState
            icon={SearchIcon}
            title={describeEmptyState(query, activeCategory)}
            description="Try another destination or travel style, or clear the search to see every trip."
            className="sm:col-span-2 lg:col-span-3"
            action={
              <button
                type="button"
                onClick={handleClearFilters}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-orange-300 hover:text-orange-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-orange-400 dark:hover:text-orange-300"
              >
                Clear search &amp; filters
              </button>
            }
          />
        )}
        {visibleTrips.map((trip, index) => {
          const [city, ...rest] = trip.destination.split(",");
          const country = rest.join(",").trim();
          const spent = getTripSpent(trip, budgetEntries);
          const percentSpent = Math.round((spent / trip.budget) * 100);
          const overBudget = spent > trip.budget;
          const meta = getTravelStyleMeta(trip.travelStyle);
          const Icon = meta.icon;
          const shownActivities = trip.activities.slice(0, MAX_CARD_ACTIVITIES);
          const hiddenActivityCount =
            trip.activities.length - shownActivities.length;

          return (
            <Link
              key={trip.id}
              href={`/trips/${trip.id}`}
              style={{ animationDelay: `${index * 80}ms` }}
              className="group animate-fade-in-up flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:rotate-[-0.3deg] hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
            >
              <div className={`h-1.5 w-full bg-gradient-to-r ${meta.barClass}`} />

              <div className="relative h-48 w-full overflow-hidden">
                {trip.image.startsWith("/") ? (
                  <Image
                    src={trip.image}
                    alt={trip.destination}
                    fill
                    sizes="(min-width: 1152px) 352px, (min-width: 1024px) calc(33vw - 32px), (min-width: 640px) calc(50vw - 36px), calc(100vw - 48px)"
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

              <div className="flex flex-1 flex-col p-5">
                <h3 className="flex items-center gap-1 text-lg font-semibold text-slate-900 dark:text-slate-50">
                  <MapPinIcon className="h-4 w-4 shrink-0 text-orange-500" />
                  <span>
                    {city}
                    <span className="font-normal text-slate-500 dark:text-slate-400">
                      , {country}
                    </span>
                  </span>
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {formatDate(trip.startDate)} – {formatDate(trip.endDate)} ·{" "}
                  {getNights(trip)} nights
                </p>
                <p className="mt-3 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
                  {trip.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {shownActivities.map((activity, i) => (
                    <span
                      key={activity}
                      className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                        ACTIVITY_TINTS[i % ACTIVITY_TINTS.length]
                      }`}
                    >
                      {activity}
                    </span>
                  ))}
                  {hiddenActivityCount > 0 && (
                    <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      +{hiddenActivityCount} more
                    </span>
                  )}
                </div>

                {/* mt-auto pins the budget row to the bottom of the card, so
                    bars line up across a row whatever the text above. */}
                <div className="mt-auto pt-4">
                  <div className="border-t border-slate-100 pt-3 dark:border-slate-800">
                    <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                      <span>
                        {formatCurrency(spent)} of{" "}
                        {formatCurrency(trip.budget)}
                      </span>
                      <span
                        className={`font-semibold ${
                          overBudget
                            ? "text-red-600 dark:text-red-400"
                            : "text-orange-700 dark:text-orange-400"
                        }`}
                      >
                        {percentSpent}%
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className={`h-1.5 rounded-full bg-gradient-to-r ${
                          overBudget
                            ? "from-red-500 to-red-600"
                            : "from-orange-400 to-orange-600"
                        }`}
                        style={{ width: `${Math.min(percentSpent, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}

        <Link
          href="/trips/new"
          className="group flex min-h-[240px] flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-teal-200 bg-teal-50/40 p-8 text-center transition-all duration-300 hover:-translate-y-1.5 hover:border-orange-300 hover:bg-orange-50/60 dark:border-teal-800 dark:bg-teal-950/20 dark:hover:border-orange-500 dark:hover:bg-orange-950/20"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-950 text-white transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
            <PlaneIcon className="h-5 w-5 -rotate-45" />
          </span>
          <div>
            <p className="font-serif text-lg font-bold text-slate-900 dark:text-slate-50">
              Build your next adventure
            </p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Add the dates, the budget, the packing list — we&apos;ll keep
              it all in one place.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
