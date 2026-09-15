import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-slate-800 bg-slate-900">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-bold text-white">
          TripStack
        </Link>
        <nav>
          <Link
            href="/"
            className="text-sm font-medium text-slate-300 hover:text-white"
          >
            Trips
          </Link>
        </nav>
      </div>
    </header>
  );
}
