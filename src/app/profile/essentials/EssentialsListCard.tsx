"use client";

import { useState } from "react";
import type { EssentialsList } from "@/lib/essentials";
import { deleteEssentialsList } from "./actions";
import EssentialsListForm from "./EssentialsListForm";

const cardClass =
  "rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900";

export default function EssentialsListCard({ list }: { list: EssentialsList }) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <div className={cardClass}>
        <EssentialsListForm
          list={list}
          onSaved={() => setEditing(false)}
          onCancel={() => setEditing(false)}
        />
      </div>
    );
  }

  return (
    <article className={cardClass}>
      <div className="flex items-start justify-between gap-4">
        <h3 className="min-w-0 font-serif text-xl font-bold break-words text-slate-900 dark:text-slate-50">
          {list.title}
        </h3>
        <div className="flex shrink-0 gap-4 pt-1">
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="text-xs font-medium text-slate-500 hover:text-teal-900 dark:text-slate-400 dark:hover:text-amber-300"
          >
            Edit
          </button>
          <form
            action={deleteEssentialsList}
            onSubmit={(e) => {
              if (
                !window.confirm(
                  `Delete “${list.title}”? This can't be undone.`,
                )
              ) {
                e.preventDefault();
              }
            }}
          >
            <input type="hidden" name="id" value={list.id} />
            <button
              type="submit"
              className="text-xs font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
            >
              Delete
            </button>
          </form>
        </div>
      </div>

      {list.items.length > 0 ? (
        <ul className="mt-4 flex flex-wrap gap-2">
          {list.items.map((item, index) => (
            <li
              key={`${item}-${index}`}
              className="inline-block rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-900 dark:bg-amber-500/15 dark:text-amber-300"
            >
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-slate-400 dark:text-slate-500">
          No items yet.
        </p>
      )}
    </article>
  );
}
