import Link from "next/link";

export default function NewTrip() {
  return (
    <main className="flex-1 bg-slate-50">
      <section className="mx-auto max-w-2xl px-6 py-12">
        <Link
          href="/"
          className="text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          ← Back to trips
        </Link>

        <h1 className="mt-4 text-3xl font-bold text-slate-900">
          Plan a new trip
        </h1>
        <p className="mt-2 text-slate-600">
          Trip creation is coming soon. Soon you&apos;ll be able to add a
          destination, dates, activities, and a budget right from here.
        </p>
      </section>
    </main>
  );
}
