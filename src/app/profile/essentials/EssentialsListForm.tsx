"use client";

import { startTransition, useActionState, useEffect, useState } from "react";
import type { EssentialsList } from "@/lib/essentials";
import TagList from "@/components/TagList";
import {
  createEssentialsList,
  updateEssentialsList,
  type EssentialsActionState,
} from "./actions";

const inputClass =
  "w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 transition focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50 dark:placeholder-slate-500";

const labelClass =
  "text-xs font-semibold tracking-[0.15em] text-slate-500 uppercase dark:text-slate-400";

const initialState: EssentialsActionState = {};

// Creates a new list, or edits `list` when one is passed. Calls onSaved
// after a successful save and shows Cancel when onCancel is given.
export default function EssentialsListForm({
  list,
  onSaved,
  onCancel,
}: {
  list?: EssentialsList;
  onSaved?: () => void;
  onCancel?: () => void;
}) {
  const [state, formAction, pending] = useActionState(
    list ? updateEssentialsList : createEssentialsList,
    initialState,
  );
  const [title, setTitle] = useState(list?.title ?? "");
  const [items, setItems] = useState<string[]>(list?.items ?? []);

  // After a successful create, empty the form for the next list. Adjusting
  // state during render, as in SubscriberRow, rather than in an effect.
  const [handledState, setHandledState] = useState(state);
  if (state !== handledState) {
    setHandledState(state);
    if (state.success && !list) {
      setTitle("");
      setItems([]);
    }
  }

  // Telling the parent (e.g. to close the edit form) has to wait for an
  // effect: a parent can't be updated while this component renders.
  useEffect(() => {
    if (state.success) onSaved?.();
  }, [state, onSaved]);

  // Submitting through the action ourselves (instead of <form action>)
  // stops React from resetting the fields, so a validation error doesn't
  // wipe what the user typed.
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  };

  const titleId = list ? `essentials-title-${list.id}` : "essentials-title-new";

  return (
    <form onSubmit={handleSubmit}>
      {list && <input type="hidden" name="id" value={list.id} />}
      <div>
        <label htmlFor={titleId} className={labelClass}>
          List name
        </label>
        <input
          id={titleId}
          name="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Japan trip"
          maxLength={80}
          required
          className={`mt-2 ${inputClass}`}
        />
      </div>

      <div className="mt-6">
        <TagList
          label="Items"
          name="items"
          placeholder="Passport"
          maxLength={60}
          items={items}
          onAdd={(value) => setItems((prev) => [...prev, value])}
          onRemove={(index) =>
            setItems((prev) => prev.filter((_, i) => i !== index))
          }
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center rounded-full bg-teal-950 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-900 hover:shadow-md disabled:pointer-events-none disabled:opacity-60"
        >
          {pending ? "Saving…" : list ? "Save changes" : "Add list"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-sm font-medium text-slate-500 hover:text-teal-900 dark:text-slate-400 dark:hover:text-amber-300"
          >
            Cancel
          </button>
        )}
        <div aria-live="polite">
          {!pending && state.success && !list && (
            <p className="rounded-full bg-teal-50 px-4 py-2 text-sm font-medium text-teal-800 dark:bg-teal-950/50 dark:text-teal-300">
              {state.success}
            </p>
          )}
          {!pending && state.error && (
            <p
              role="alert"
              className="rounded-full bg-red-50 px-4 py-2 text-sm font-medium text-red-700 dark:bg-red-950/40 dark:text-red-300"
            >
              {state.error}
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
