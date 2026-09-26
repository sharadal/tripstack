"use client";

import { useActionState, useState } from "react";
import { deleteSubscriber, updateSubscriber, type ActionState } from "./actions";

type Subscriber = {
  id: string;
  first_name: string;
  email: string;
  created_at: string;
};

const inputClass =
  "w-full rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-900 transition focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50";

const initialState: ActionState = {};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-IE", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function SubscriberRow({
  subscriber,
}: {
  subscriber: Subscriber;
}) {
  const [editing, setEditing] = useState(false);
  const [state, formAction, pending] = useActionState(
    updateSubscriber,
    initialState,
  );

  // A successful save produces a new (though value-equal) state object.
  // Close the edit form in response, following React's guidance to adjust
  // state during render instead of in an effect.
  const [handledState, setHandledState] = useState(state);
  if (state !== handledState) {
    setHandledState(state);
    if (!state.error) setEditing(false);
  }

  if (editing) {
    return (
      <tr className="align-top">
        <td colSpan={4} className="px-6 py-4">
          <form action={formAction} className="flex flex-wrap items-center gap-3">
            <input type="hidden" name="id" value={subscriber.id} />
            <input
              name="firstName"
              defaultValue={subscriber.first_name}
              placeholder="First name"
              required
              className={`${inputClass} max-w-[10rem]`}
            />
            <input
              name="email"
              type="email"
              defaultValue={subscriber.email}
              placeholder="Email"
              required
              className={`${inputClass} max-w-[16rem]`}
            />
            <button
              type="submit"
              disabled={pending}
              className="rounded-full bg-teal-950 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-teal-900 disabled:opacity-60"
            >
              {pending ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="text-xs font-medium text-slate-500 hover:text-teal-900 dark:text-slate-400 dark:hover:text-amber-300"
            >
              Cancel
            </button>
          </form>
          {state.error && (
            <p className="mt-2 text-xs font-medium text-red-600 dark:text-red-400">
              {state.error}
            </p>
          )}
        </td>
      </tr>
    );
  }

  return (
    <tr>
      <td className="px-6 py-4 text-slate-900 dark:text-slate-50">
        {subscriber.first_name}
      </td>
      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
        {subscriber.email}
      </td>
      <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
        {formatDate(subscriber.created_at)}
      </td>
      <td className="px-6 py-4">
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="text-xs font-medium text-slate-500 hover:text-teal-900 dark:text-slate-400 dark:hover:text-amber-300"
          >
            Edit
          </button>
          <form
            action={deleteSubscriber}
            onSubmit={(e) => {
              if (
                !window.confirm(
                  `Remove ${subscriber.email} from the list? This can't be undone.`,
                )
              ) {
                e.preventDefault();
              }
            }}
          >
            <input type="hidden" name="id" value={subscriber.id} />
            <button
              type="submit"
              className="text-xs font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
            >
              Delete
            </button>
          </form>
        </div>
      </td>
    </tr>
  );
}
