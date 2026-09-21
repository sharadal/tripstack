"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TRIP_TYPES } from "@/lib/trips";
import { getTravelStyleMeta } from "@/lib/travelStyleMeta";
import { addPersonalTrip } from "@/lib/personalTrips";
import { PlaneIcon } from "@/components/icons";

const inputClass =
  "w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 transition focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50 dark:placeholder-slate-500";

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
  const inputId = `tag-input-${name}`;

  const submitValue = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setValue("");
  };

  return (
    <div>
      <label
        htmlFor={inputId}
        className="text-xs font-semibold tracking-[0.15em] text-slate-500 uppercase dark:text-slate-400"
      >
        {label}
      </label>
      <div className="mt-2 flex gap-2">
        <input
          id={inputId}
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
          className="shrink-0 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-orange-300 hover:text-orange-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-orange-400 dark:hover:text-orange-300"
        >
          Add
        </button>
      </div>

      {items.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {items.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-900 dark:bg-amber-500/15 dark:text-amber-300"
            >
              {item}
              <button
                type="button"
                onClick={() => onRemove(index)}
                aria-label={`Remove ${item}`}
                className="inline-block text-amber-700 transition-transform duration-150 hover:scale-125 hover:text-amber-950 dark:text-amber-300 dark:hover:text-amber-100"
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

export default function NewTripForm() {
  const router = useRouter();
  const [travelStyle, setTravelStyle] = useState("City");
  const [activities, setActivities] = useState<string[]>([]);
  const [packingList, setPackingList] = useState<string[]>([]);
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);

    const formData = new FormData(e.currentTarget);
    const destination = String(formData.get("destination") ?? "").trim();
    const country = String(formData.get("country") ?? "").trim();
    const startDate = String(formData.get("startDate") ?? "");
    const endDate = String(formData.get("endDate") ?? "");
    const image = String(formData.get("image") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const notes = String(formData.get("notes") ?? "").trim();
    const budget = Number(formData.get("budget"));

    if (!destination || !country) {
      setError("Destination and country are required.");
      return;
    }
    if (!startDate || !endDate) {
      setError("Start and end dates are required.");
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      setError("End date can't be before the start date.");
      return;
    }
    if (!Number.isFinite(budget) || budget <= 0) {
      setError("Enter a valid budget.");
      return;
    }

    setPending(true);
    const trip = addPersonalTrip({
      destination,
      country,
      startDate,
      endDate,
      travelStyle,
      budget,
      image: image || undefined,
      description,
      activities,
      packingList,
      notes,
    });

    router.push(`/trips/${trip.id}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="destination"
            className="text-xs font-semibold tracking-[0.15em] text-slate-500 uppercase dark:text-slate-400"
          >
            Destination
          </label>
          <input
            id="destination"
            type="text"
            name="destination"
            placeholder="Lisbon"
            required
            className={`mt-2 ${inputClass}`}
          />
        </div>
        <div>
          <label
            htmlFor="country"
            className="text-xs font-semibold tracking-[0.15em] text-slate-500 uppercase dark:text-slate-400"
          >
            Country
          </label>
          <input
            id="country"
            type="text"
            name="country"
            placeholder="Portugal"
            required
            className={`mt-2 ${inputClass}`}
          />
        </div>

        <div>
          <label
            htmlFor="startDate"
            className="text-xs font-semibold tracking-[0.15em] text-slate-500 uppercase dark:text-slate-400"
          >
            Start date
          </label>
          <input
            id="startDate"
            type="date"
            name="startDate"
            required
            className={`mt-2 ${inputClass}`}
          />
        </div>
        <div>
          <label
            htmlFor="endDate"
            className="text-xs font-semibold tracking-[0.15em] text-slate-500 uppercase dark:text-slate-400"
          >
            End date
          </label>
          <input
            id="endDate"
            type="date"
            name="endDate"
            required
            className={`mt-2 ${inputClass}`}
          />
        </div>
      </div>

      <div className="mt-6">
        <label className="text-xs font-semibold tracking-[0.15em] text-slate-500 uppercase dark:text-slate-400">
          Trip type
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          {TRIP_TYPES.map((type) => {
            const meta = getTravelStyleMeta(type);
            const Icon = meta.icon;
            const isActive = travelStyle === type;

            return (
              <button
                key={type}
                type="button"
                onClick={() => setTravelStyle(type)}
                aria-pressed={isActive}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 ${
                  isActive
                    ? "bg-teal-950 text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-orange-300 hover:text-orange-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-orange-400 dark:hover:text-orange-300"
                }`}
              >
                <Icon
                  className={`h-3.5 w-3.5 ${isActive ? "text-orange-300" : ""}`}
                />
                {type}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="budget"
            className="text-xs font-semibold tracking-[0.15em] text-slate-500 uppercase dark:text-slate-400"
          >
            Budget (EUR)
          </label>
          <input
            id="budget"
            type="number"
            name="budget"
            min="1"
            placeholder="1400"
            required
            className={`mt-2 ${inputClass}`}
          />
        </div>
        <div>
          <label
            htmlFor="image"
            className="text-xs font-semibold tracking-[0.15em] text-slate-500 uppercase dark:text-slate-400"
          >
            Cover photo link (optional)
          </label>
          <input
            id="image"
            type="url"
            name="image"
            placeholder="https://..."
            className={`mt-2 ${inputClass}`}
          />
        </div>
      </div>

      <div className="mt-6">
        <label
          htmlFor="description"
          className="text-xs font-semibold tracking-[0.15em] text-slate-500 uppercase dark:text-slate-400"
        >
          Short summary
        </label>
        <textarea
          id="description"
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
        <label
          htmlFor="notes"
          className="text-xs font-semibold tracking-[0.15em] text-slate-500 uppercase dark:text-slate-400"
        >
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          placeholder="Book tickets two weeks ahead."
          className={`mt-2 ${inputClass} rounded-2xl`}
        />
      </div>

      {error && (
        <p className="mt-6 text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
      )}

      <div className="mt-8 flex items-center gap-4 border-t border-slate-100 pt-6 dark:border-slate-800">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-1.5 rounded-full bg-teal-950 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-900 hover:shadow-md disabled:pointer-events-none disabled:opacity-60"
        >
          <PlaneIcon className="h-3.5 w-3.5 -rotate-45" />
          {pending ? "Saving…" : "Save trip"}
        </button>
        <Link
          href="/#upcoming"
          className="text-sm font-medium text-slate-500 transition hover:text-teal-900 dark:text-slate-400 dark:hover:text-amber-300"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
