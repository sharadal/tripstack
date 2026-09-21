"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { createTrip, type CreateTripState } from "./actions";

const TRIP_TYPES = ["Beach", "City", "Mountains", "Road trip", "Culture"];

const inputClass =
  "w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-teal-800 focus:outline-none focus:ring-1 focus:ring-teal-800";

function TagList({
  label,
  name,
  placeholder,
  items,
  onAdd,
  onRemove,
}: {
  label: string;
  name: string;
  placeholder: string;
  items: string[];
  onAdd: (value: string) => void;
  onRemove: (index: number) => void;
}) {
  const [value, setValue] = useState("");

  const submitValue = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setValue("");
  };

  return (
    <div>
      <label className="text-xs font-semibold tracking-[0.15em] text-slate-500 uppercase">
        {label}
      </label>
      <div className="mt-2 flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              submitValue();
            }
          }}
          placeholder={placeholder}
          className={inputClass}
        />
        <button
          type="button"
          onClick={submitValue}
          className="shrink-0 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 hover:border-slate-300"
        >
          Add
        </button>
      </div>

      {items.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {items.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-900"
            >
              {item}
              <button
                type="button"
                onClick={() => onRemove(index)}
                aria-label={`Remove ${item}`}
                className="text-amber-700 hover:text-amber-950"
              >
                ×
              </button>
              <input type="hidden" name={name} value={item} />
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

const initialState: CreateTripState = {};

export default function NewTripForm() {
  const [state, formAction, pending] = useActionState(
    createTrip,
    initialState,
  );
  const [travelStyle, setTravelStyle] = useState("City");
  const [activities, setActivities] = useState<string[]>([]);
  const [packingList, setPackingList] = useState<string[]>([]);

  return (
    <form
      action={formAction}
      className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
    >
      <input type="hidden" name="travelStyle" value={travelStyle} />

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="text-xs font-semibold tracking-[0.15em] text-slate-500 uppercase">
            Destination
          </label>
          <input
            type="text"
            name="destination"
            placeholder="Lisbon"
            required
            className={`mt-2 ${inputClass}`}
          />
        </div>
        <div>
          <label className="text-xs font-semibold tracking-[0.15em] text-slate-500 uppercase">
            Country
          </label>
          <input
            type="text"
            name="country"
            placeholder="Portugal"
            required
            className={`mt-2 ${inputClass}`}
          />
        </div>

        <div>
          <label className="text-xs font-semibold tracking-[0.15em] text-slate-500 uppercase">
            Start date
          </label>
          <input
            type="date"
            name="startDate"
            required
            className={`mt-2 ${inputClass}`}
          />
        </div>
        <div>
          <label className="text-xs font-semibold tracking-[0.15em] text-slate-500 uppercase">
            End date
          </label>
          <input
            type="date"
            name="endDate"
            required
            className={`mt-2 ${inputClass}`}
          />
        </div>
      </div>

      <div className="mt-6">
        <label className="text-xs font-semibold tracking-[0.15em] text-slate-500 uppercase">
          Trip type
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          {TRIP_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setTravelStyle(type)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                travelStyle === type
                  ? "bg-teal-950 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <label className="text-xs font-semibold tracking-[0.15em] text-slate-500 uppercase">
            Budget (EUR)
          </label>
          <input
            type="number"
            name="budget"
            min="1"
            placeholder="1400"
            required
            className={`mt-2 ${inputClass}`}
          />
        </div>
        <div>
          <label className="text-xs font-semibold tracking-[0.15em] text-slate-500 uppercase">
            Cover photo link (optional)
          </label>
          <input
            type="url"
            name="image"
            placeholder="https://..."
            className={`mt-2 ${inputClass}`}
          />
        </div>
      </div>

      <div className="mt-6">
        <label className="text-xs font-semibold tracking-[0.15em] text-slate-500 uppercase">
          Short summary
        </label>
        <textarea
          name="description"
          rows={2}
          placeholder="Tiles, trams and a slow week in the hills."
          className={`mt-2 ${inputClass} rounded-2xl`}
        />
      </div>

      <div className="mt-6">
        <TagList
          label="Activities"
          name="activities"
          placeholder="Tram 28"
          items={activities}
          onAdd={(value) => setActivities((prev) => [...prev, value])}
          onRemove={(index) =>
            setActivities((prev) => prev.filter((_, i) => i !== index))
          }
        />
      </div>

      <div className="mt-6">
        <TagList
          label="Packing list"
          name="packingList"
          placeholder="Walking shoes"
          items={packingList}
          onAdd={(value) => setPackingList((prev) => [...prev, value])}
          onRemove={(index) =>
            setPackingList((prev) => prev.filter((_, i) => i !== index))
          }
        />
      </div>

      <div className="mt-6">
        <label className="text-xs font-semibold tracking-[0.15em] text-slate-500 uppercase">
          Notes
        </label>
        <textarea
          name="notes"
          rows={3}
          placeholder="Book tickets two weeks ahead."
          className={`mt-2 ${inputClass} rounded-2xl`}
        />
      </div>

      {state?.error && (
        <p className="mt-6 text-sm font-medium text-red-600">{state.error}</p>
      )}

      <div className="mt-8 flex items-center gap-4 border-t border-slate-100 pt-6">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-teal-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-900 disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save trip"}
        </button>
        <Link
          href="/#upcoming"
          className="text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
