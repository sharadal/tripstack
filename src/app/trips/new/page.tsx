import Link from "next/link";

export default function NewTrip() {
  return (
    <main className="flex-1 bg-stone-50">
      <section className="mx-auto max-w-2xl px-6 py-12">
        <Link
          href="/#upcoming"
          className="text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          ← Back to trips
        </Link>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-950 text-xl text-white">
            +
          </span>

          <h1 className="mt-4 font-serif text-3xl font-bold text-slate-900">
            Plan a new trip
          </h1>
          <p className="mx-auto mt-2 max-w-sm text-slate-600">
            Trip creation is coming soon. Soon you&apos;ll be able to add a
            new trip right from here.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {["Destination", "Dates", "Activities", "Budget"].map((field) => (
              <span
                key={field}
                className="inline-block rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-900"
              >
                {field}
              </span>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
