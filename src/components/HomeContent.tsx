"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  type Trip,
  formatCurrency,
  formatDate,
  daysUntil,
  nextDeparture,
} from "@/lib/trips";
import { usePersonalTrips } from "@/hooks/usePersonalTrips";
import UpcomingTrips from "@/components/UpcomingTrips";
import TripQuiz from "@/components/TripQuiz";
import ScrollReveal from "@/components/ScrollReveal";
import { PlaneIcon, SparkleIcon, WalletIcon } from "@/components/icons";

export default function HomeContent({ demoTrips }: { demoTrips: Trip[] }) {
  const { trips: personalTrips } = usePersonalTrips();
  const trips = useMemo(
    () => [...demoTrips, ...personalTrips],
    [demoTrips, personalTrips],
  );

  const totalBudget = trips.reduce((sum, trip) => sum + trip.budget, 0);
  const totalSpent = trips.reduce((sum, trip) => sum + trip.spent, 0);
  const totalRemaining = totalBudget - totalSpent;
  const upcoming = nextDeparture(trips);

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
        <div className="absolute inset-0 bg-gradient-to-b from-teal-950/85 via-teal-950/70 to-teal-950/90" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-orange-400/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-amber-300/20 blur-3xl" />
        <PlaneIcon className="animate-float-y pointer-events-none absolute right-[12%] top-16 h-10 w-10 rotate-[35deg] text-white/20 sm:right-[18%]" />

        <div className="relative mx-auto max-w-6xl">
          <span className="animate-fade-in-up inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold tracking-[0.15em] text-stone-100 uppercase ring-1 ring-white/25 backdrop-blur">
            <SparkleIcon className="h-3.5 w-3.5 text-amber-300" />
            {trips.length} trips planned · {formatCurrency(totalBudget)}{" "}
            budgeted
          </span>

          <h1
            className="animate-fade-in-up mt-6 max-w-2xl font-serif text-4xl leading-tight text-stone-50 sm:text-5xl lg:text-6xl"
            style={{ animationDelay: "80ms" }}
          >
            <span className="font-bold">Every trip you&apos;re dreaming about,</span>{" "}
            in one{" "}
            <span className="relative inline-block font-bold text-amber-300">
              calm place.
              <svg
                viewBox="0 0 200 14"
                preserveAspectRatio="none"
                className="absolute -bottom-2 left-0 h-3 w-full text-orange-400"
                aria-hidden="true"
              >
                <path
                  d="M2 10 C 40 2, 80 2, 100 8 S 160 14, 198 4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p
            className="animate-fade-in-up mt-6 max-w-xl text-stone-200"
            style={{ animationDelay: "140ms" }}
          >
            Dates, budgets, and activities — all tracked per trip, with a
            countdown to the next departure.
          </p>

          <div
            className="animate-fade-in-up mt-8 flex flex-wrap items-center gap-4"
            style={{ animationDelay: "180ms" }}
          >
            <Link
              href="/trips/new"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-300 px-6 py-3 text-sm font-semibold text-teal-950 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-amber-200 hover:shadow-xl"
            >
              <PlaneIcon className="h-4 w-4 -rotate-45" />
              Start planning your trip
            </Link>
            <Link
              href="/#quiz"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20"
            >
              <SparkleIcon className="h-4 w-4 text-amber-300" />
              Find my travel style
            </Link>
          </div>

          {upcoming && (
            <div
              className="animate-fade-in-up group mt-8 inline-flex max-w-md flex-wrap items-center gap-6 rounded-2xl bg-stone-50 px-6 py-5 text-slate-900 shadow-lg transition-transform duration-300 hover:-translate-y-1 sm:flex-nowrap"
              style={{ animationDelay: "240ms" }}
            >
              <div>
                <p className="flex items-center gap-1.5 text-xs font-semibold tracking-[0.15em] text-slate-500 uppercase">
                  <PlaneIcon className="h-3.5 w-3.5 -rotate-45 text-orange-500" />
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
                <p className="text-3xl font-bold text-orange-600 transition-transform duration-300 group-hover:scale-110">
                  {daysUntil(upcoming.startDate)}
                </p>
                <p className="text-xs font-semibold tracking-[0.15em] text-slate-500 uppercase">
                  Days to go
                </p>
              </div>
            </div>
          )}
        </div>

        <svg
          className="absolute inset-x-0 -bottom-1 h-10 w-full text-stone-50 sm:h-14"
          viewBox="0 0 1440 74"
          preserveAspectRatio="none"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M0,32 C240,74 480,0 720,20 C960,40 1200,74 1440,32 L1440,74 L0,74 Z" />
        </svg>
      </section>

      <section id="upcoming" className="mx-auto max-w-6xl px-6 py-16">
        <UpcomingTrips trips={trips} />
      </section>

      <section id="budget" className="mx-auto max-w-6xl px-6 pb-16">
        <ScrollReveal>
          <h2 className="mb-6 flex items-center gap-2 font-serif text-3xl font-bold text-slate-900">
            <WalletIcon className="h-7 w-7 text-teal-700" />
            Budget at a glance
          </h2>

          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md">
              <p className="text-sm text-slate-500">Total budget</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">
                {formatCurrency(totalBudget)}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md">
              <p className="text-sm text-slate-500">Committed so far</p>
              <p className="mt-1 text-2xl font-semibold text-orange-600">
                {formatCurrency(totalSpent)}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md">
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
                        className="h-2 rounded-full bg-gradient-to-r from-orange-400 to-orange-600"
                        style={{ width: `${percentSpent}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </ScrollReveal>
      </section>

      <section id="quiz" className="mx-auto max-w-6xl px-6 pb-16">
        <TripQuiz trips={trips} />
      </section>
    </main>
  );
}
