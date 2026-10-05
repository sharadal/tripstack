import type { EssentialsList } from "@/lib/essentials";
import { CompassIcon } from "@/components/icons";
import EssentialsListForm from "./EssentialsListForm";
import EssentialsListCard from "./EssentialsListCard";

const labelClass =
  "text-xs font-semibold tracking-[0.15em] text-slate-500 uppercase dark:text-slate-400";

export default function EssentialsSection({
  lists,
  loadError,
}: {
  lists: EssentialsList[];
  loadError: boolean;
}) {
  return (
    <section aria-labelledby="essentials-heading" className="mt-16">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-900 to-teal-950 text-white shadow-sm">
          <CompassIcon className="h-5 w-5" />
        </span>
        <h2
          id="essentials-heading"
          className="font-serif text-2xl font-bold text-slate-900 dark:text-slate-50"
        >
          My Travel Essentials
        </h2>
      </div>
      <p className="mt-3 text-slate-600 dark:text-slate-300">
        Packing lists you can reuse trip after trip. Only you can see them.
      </p>

      <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className={labelClass}>Add a list</h3>
        <div className="mt-4">
          <EssentialsListForm />
        </div>
      </div>

      {loadError ? (
        <p
          role="alert"
          className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300"
        >
          Couldn&apos;t load your lists — please try again.
        </p>
      ) : lists.length > 0 ? (
        <div className="mt-6 grid gap-4">
          {lists.map((list) => (
            <EssentialsListCard key={list.id} list={list} />
          ))}
        </div>
      ) : (
        <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
          No lists yet — add your first one above.
        </p>
      )}
    </section>
  );
}
