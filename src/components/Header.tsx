import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-slate-200 bg-stone-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-950 text-sm font-bold text-white">
            T
          </span>
          <span className="text-lg font-bold text-slate-900">TripStack</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/#upcoming"
            className="hidden text-sm font-medium text-slate-600 hover:text-slate-900 sm:inline"
          >
            Trips
          </Link>
          <Link
            href="/#budget"
            className="hidden text-sm font-medium text-slate-600 hover:text-slate-900 sm:inline"
          >
            Budget
          </Link>
          <Link
            href="/trips/new"
            className="inline-flex items-center justify-center rounded-full bg-teal-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-900"
          >
            Plan a trip
          </Link>
        </nav>
      </div>
    </header>
  );
}
