"use client";

import { useActionState } from "react";
import { createSubscriber, type ActionState } from "./actions";
import { PlaneIcon } from "@/components/icons";

const inputClass =
  "w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 transition focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50 dark:placeholder-slate-500";

const initialState: ActionState = {};

export default function AddSubscriberForm() {
  const [state, formAction, pending] = useActionState(
    createSubscriber,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <h2 className="text-xs font-semibold tracking-[0.15em] text-slate-500 uppercase dark:text-slate-400">
        Add subscriber
      </h2>
      <div className="mt-3 grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-start">
        <div>
          <label htmlFor="new-first-name" className="sr-only">
            First name
          </label>
          <input
            id="new-first-name"
            name="firstName"
            type="text"
            placeholder="First name"
            required
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="new-email" className="sr-only">
            Email
          </label>
          <input
            id="new-email"
            name="email"
            type="email"
            placeholder="Email"
            required
            className={inputClass}
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center gap-1.5 rounded-full bg-teal-950 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-900 hover:shadow-md disabled:pointer-events-none disabled:opacity-60"
        >
          <PlaneIcon className="h-3.5 w-3.5 -rotate-45" />
          {pending ? "Adding…" : "Add"}
        </button>
      </div>
      {state.error && (
        <p className="mt-3 text-sm font-medium text-red-600 dark:text-red-400">
          {state.error}
        </p>
      )}
    </form>
  );
}
