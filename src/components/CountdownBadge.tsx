import { daysUntil } from "@/lib/trips";

export default function CountdownBadge({ startDate }: { startDate: string }) {
  const days = daysUntil(startDate);

  if (days < 0) {
    return (
      <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
        Past trip
      </span>
    );
  }

  if (days === 0) {
    return (
      <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
        Starts today
      </span>
    );
  }

  return (
    <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
      In {days} day{days === 1 ? "" : "s"}
    </span>
  );
}
