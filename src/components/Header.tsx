"use client";

import { useState } from "react";
import Link from "next/link";
import { CloseIcon, MenuIcon, PlaneIcon } from "@/components/icons";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-teal-950/10 bg-stone-50/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="group flex items-center gap-2"
          onClick={() => setIsMenuOpen(false)}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-900 to-teal-950 text-white shadow-sm transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
            <PlaneIcon className="h-4.5 w-4.5" />
          </span>
          <span className="text-lg font-bold text-slate-900">TripStack</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/#upcoming"
            className="group relative hidden text-sm font-medium text-slate-600 transition hover:text-teal-900 sm:inline"
          >
            Trips
            <span className="absolute -bottom-1 left-0 h-0.5 w-0 rounded-full bg-orange-500 transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link
            href="/#budget"
            className="group relative hidden text-sm font-medium text-slate-600 transition hover:text-teal-900 sm:inline"
          >
            Budget
            <span className="absolute -bottom-1 left-0 h-0.5 w-0 rounded-full bg-orange-500 transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link
            href="/#quiz"
            className="group relative hidden text-sm font-medium text-slate-600 transition hover:text-teal-900 sm:inline"
          >
            Quiz
            <span className="absolute -bottom-1 left-0 h-0.5 w-0 rounded-full bg-orange-500 transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link
            href="#newsletter"
            className="group relative hidden text-sm font-medium text-slate-600 transition hover:text-teal-900 sm:inline"
          >
            Newsletter
            <span className="absolute -bottom-1 left-0 h-0.5 w-0 rounded-full bg-orange-500 transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link
            href="/trips/new"
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-teal-950 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-900 hover:shadow-md active:translate-y-0"
          >
            <PlaneIcon className="h-3.5 w-3.5 -rotate-45" />
            Plan a trip
          </Link>

          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-orange-300 hover:text-orange-700 sm:hidden"
          >
            {isMenuOpen ? (
              <CloseIcon className="h-4.5 w-4.5" />
            ) : (
              <MenuIcon className="h-4.5 w-4.5" />
            )}
          </button>
        </nav>
      </div>

      <div
        className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out sm:hidden ${
          isMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col gap-1 border-t border-teal-950/10 px-6 py-3">
          <Link
            href="/#upcoming"
            onClick={() => setIsMenuOpen(false)}
            className="rounded-lg px-2 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-orange-50 hover:text-orange-700"
          >
            Trips
          </Link>
          <Link
            href="/#budget"
            onClick={() => setIsMenuOpen(false)}
            className="rounded-lg px-2 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-orange-50 hover:text-orange-700"
          >
            Budget
          </Link>
          <Link
            href="/#quiz"
            onClick={() => setIsMenuOpen(false)}
            className="rounded-lg px-2 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-orange-50 hover:text-orange-700"
          >
            Quiz
          </Link>
          <Link
            href="#newsletter"
            onClick={() => setIsMenuOpen(false)}
            className="rounded-lg px-2 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-orange-50 hover:text-orange-700"
          >
            Newsletter
          </Link>
        </nav>
      </div>
    </header>
  );
}
