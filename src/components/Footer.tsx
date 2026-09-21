"use client";

import Link from "next/link";
import { trips as demoTrips } from "@/lib/trips";
import { usePersonalTrips } from "@/hooks/usePersonalTrips";
import { PlaneIcon } from "@/components/icons";

const GET_STARTED_LINKS = [
  { label: "Plan a trip", href: "/trips/new" },
  { label: "Upcoming trips", href: "/#upcoming" },
  { label: "Budget at a glance", href: "/#budget" },
  { label: "Travel quiz", href: "/#quiz" },
  { label: "Newsletter", href: "#newsletter" },
];

export default function Footer() {
  const { trips: personalTrips } = usePersonalTrips();

  return (
    <footer className="relative overflow-hidden bg-teal-950 text-stone-200">
      <svg
        className="absolute inset-x-0 -top-1 h-10 w-full text-stone-50 sm:h-14 dark:text-slate-950"
        viewBox="0 0 1440 74"
        preserveAspectRatio="none"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M0,32 C240,74 480,0 720,20 C960,40 1200,74 1440,32 L1440,0 L0,0 Z" />
      </svg>

      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-50 text-teal-950">
                <PlaneIcon className="h-4.5 w-4.5" />
              </span>
              <span className="text-lg font-bold text-white">TripStack</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-stone-300">
              Every trip, organised in one place — dates, itineraries,
              packing lists and budgets.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-stone-400 uppercase">
              Get started
            </p>
            <ul className="mt-4 space-y-3">
              {GET_STARTED_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-stone-200 transition hover:text-amber-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-stone-400 uppercase">
              Your trips
            </p>
            <ul className="mt-4 space-y-3">
              {personalTrips.length === 0 ? (
                <li className="text-sm text-stone-400">
                  No trips yet —{" "}
                  <Link
                    href="/trips/new"
                    className="text-stone-200 underline decoration-stone-500 underline-offset-2 transition hover:text-amber-300"
                  >
                    plan your first one
                  </Link>
                  .
                </li>
              ) : (
                personalTrips.map((trip) => (
                  <li key={trip.id}>
                    <Link
                      href={`/trips/${trip.id}`}
                      className="text-sm text-stone-200 transition hover:text-amber-300"
                    >
                      {trip.destination}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-stone-400 uppercase">
              Get inspired
            </p>
            <ul className="mt-4 space-y-3">
              {demoTrips.map((trip) => (
                <li key={trip.id}>
                  <Link
                    href={`/trips/${trip.id}`}
                    className="text-sm text-stone-200 transition hover:text-amber-300"
                  >
                    {trip.destination}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-stone-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} TripStack · Planned with care,
            packed at the last minute.
          </p>
          <p>Your trips are saved in this browser.</p>
        </div>
      </div>
    </footer>
  );
}
