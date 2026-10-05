"use client";

import { useId, useState } from "react";

const inputClass =
  "w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 transition focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50 dark:placeholder-slate-500";

// A text input that collects items as removable chips. Each item is also
// submitted as a hidden input named `name`, so FormData.getAll(name) reads
// the whole list.
export default function TagList({
  label,
  name,
  placeholder,
  items,
  onAdd,
  onRemove,
  maxLength,
}: {
  label: string;
  name: string;
  placeholder: string;
  items: string[];
  onAdd: (value: string) => void;
  onRemove: (index: number) => void;
  maxLength?: number;
}) {
  const [value, setValue] = useState("");
  // Unique per instance, so several lists can be open on one page.
  const inputId = useId();

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
          maxLength={maxLength}
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
