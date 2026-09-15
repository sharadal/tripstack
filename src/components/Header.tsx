import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-slate-800 bg-slate-900">
      <div className="mx-auto max-w-5xl px-6 py-4">
        <Link href="/" className="text-lg font-bold text-white">
          TripStack
        </Link>
      </div>
    </header>
  );
}
