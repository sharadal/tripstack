"use client";

import { useState } from "react";
import Link from "next/link";
import { CloseIcon, MenuIcon, PlaneIcon } from "@/components/icons";
import ThemeToggle from "@/components/ThemeToggle";
import { AuthStatus, MobileAuthStatus } from "@/components/AuthStatus";

export default function Header({ isAdmin }: { isAdmin: boolean }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-teal-950/10 bg-stone-50/90 backdrop-blur dark:border-white/10 dark:bg-slate-950/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="group flex items-center gap-2"
          onClick={() => setIsMenuOpen(false)}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-900 to-teal-950 text-white shadow-sm transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
            <PlaneIcon className="h-4.5 w-4.5" />
          </span>
          <span className="text-lg font-bold text-slate-900 dark:text-white">TripStack</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/#upcoming"
            className="group relative hidden text-sm font-medium text-slate-600 transition hover:text-teal-900 sm:inline dark:text-slate-300 dark:hover:text-amber-300"
          >
            Trips
            <span className="absolute -bottom-1 left-0 h-0.5 w-0 rounded-full bg-orange-500 transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link
            href="/#budget"
            className="group relative hidden text-sm font-medium text-slate-600 transition hover:text-teal-900 sm:inline dark:text-slate-300 dark:hover:text-amber-300"
          >
            Budget
            <span className="absolute -bottom-1 left-0 h-0.5 w-0 rounded-full bg-orange-500 transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link
            href="/#quiz"
            className="group relative hidden text-sm font-medium text-slate-600 transition hover:text-teal-900 sm:inline dark:text-slate-300 dark:hover:text-amber-300"
          >
            Quiz
            <span className="absolute -bottom-1 left-0 h-0.5 w-0 rounded-full bg-orange-500 transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link
            href="#newsletter"
            className="group relative hidden text-sm font-medium text-slate-600 transition hover:text-teal-900 sm:inline dark:text-slate-300 dark:hover:text-amber-300"
          >
            Newsletter
            <span className="absolute -bottom-1 left-0 h-0.5 w-0 rounded-full bg-orange-500 transition-all duration-300 group-hover:w-full" />
          </Link>
          {isAdmin && (
            <Link
              href="/admin/subscribers"
              className="group relative hidden text-sm font-medium text-slate-600 transition hover:text-teal-900 sm:inline dark:text-slate-300 dark:hover:text-amber-300"
            >
              Admin
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 rounded-full bg-orange-500 transition-all duration-300 group-hover:w-full" />
            </Link>
          )}
          <Link
            href="/trips/new"
            className="hidden items-center justify-center gap-1.5 rounded-full bg-teal-950 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-900 hover:shadow-md active:translate-y-0 sm:inline-flex"
          >
            <PlaneIcon className="h-3.5 w-3.5 -rotate-45" />
            Plan a trip
          </Link>

          <AuthStatus isAdmin={isAdmin} />

          <ThemeToggle />

          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-all duration-200 hover:scale-105 hover:border-orange-300 hover:text-orange-700 sm:hidden dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-orange-400 dark:hover:text-orange-300"
          >
            {isMenuOpen ? (
              <CloseIcon className="h-4.5 w-4.5" />
            ) : (
              <MenuIcon className="h-4.5 w-4.5" />
            )}
          </button>
        </nav>
      </div>

      {/* Open height is capped to the space below the header bar (~4.5rem)
          and scrolls beyond that, so the signed-in account links can never
          be clipped off the bottom on short phones. */}
      <div
        className={`transition-[max-height,opacity] duration-300 ease-in-out sm:hidden ${
          isMenuOpen
            ? "max-h-[calc(100dvh-4.5rem)] overflow-y-auto opacity-100"
            : "max-h-0 overflow-hidden opacity-0"
        }`}
      >
        <nav className="flex flex-col gap-1 border-t border-teal-950/10 px-6 py-3 dark:border-white/10">
          <Link
            href="/trips/new"
            onClick={() => setIsMenuOpen(false)}
            className="mb-2 inline-flex items-center justify-center gap-1.5 rounded-full bg-teal-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-900"
          >
            <PlaneIcon className="h-3.5 w-3.5 -rotate-45" />
            Plan a trip
          </Link>
          <Link
            href="/#upcoming"
            onClick={() => setIsMenuOpen(false)}
            className="rounded-lg px-2 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-orange-50 hover:text-orange-700 dark:text-slate-300 dark:hover:bg-orange-950/40 dark:hover:text-orange-300"
          >
            Trips
          </Link>
          <Link
            href="/#budget"
            onClick={() => setIsMenuOpen(false)}
            className="rounded-lg px-2 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-orange-50 hover:text-orange-700 dark:text-slate-300 dark:hover:bg-orange-950/40 dark:hover:text-orange-300"
          >
            Budget
          </Link>
          <Link
            href="/#quiz"
            onClick={() => setIsMenuOpen(false)}
            className="rounded-lg px-2 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-orange-50 hover:text-orange-700 dark:text-slate-300 dark:hover:bg-orange-950/40 dark:hover:text-orange-300"
          >
            Quiz
          </Link>
          <Link
            href="#newsletter"
            onClick={() => setIsMenuOpen(false)}
            className="rounded-lg px-2 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-orange-50 hover:text-orange-700 dark:text-slate-300 dark:hover:bg-orange-950/40 dark:hover:text-orange-300"
          >
            Newsletter
          </Link>
          {isAdmin && (
            <Link
              href="/admin/subscribers"
              onClick={() => setIsMenuOpen(false)}
              className="rounded-lg px-2 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-orange-50 hover:text-orange-700 dark:text-slate-300 dark:hover:bg-orange-950/40 dark:hover:text-orange-300"
            >
              Admin
            </Link>
          )}
          <MobileAuthStatus
            isAdmin={isAdmin}
            onNavigate={() => setIsMenuOpen(false)}
          />
        </nav>
      </div>
    </header>
  );
}
