import Link from "next/link";
import { PlaneIcon } from "@/components/icons";
import NewTripForm from "./NewTripForm";

export default function NewTrip() {
  return (
    <main className="flex-1 bg-stone-50">
      <section className="mx-auto max-w-2xl px-6 py-12">
        <Link
          href="/#upcoming"
          className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 transition hover:text-teal-900"
        >
          ← Back to trips
        </Link>

        <span className="mt-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-900 to-teal-950 text-white shadow-sm">
          <PlaneIcon className="h-5 w-5 -rotate-45" />
        </span>

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
