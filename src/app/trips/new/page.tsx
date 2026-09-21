import Link from "next/link";
import NewTripForm from "./NewTripForm";

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

        <h1 className="mt-4 font-serif text-3xl font-bold text-slate-900">
          Plan a new trip
        </h1>
        <p className="mt-2 text-slate-600">
          Fill in what you know — you can keep the rest loose for now.
        </p>

        <NewTripForm />
      </section>
    </main>
  );
}
