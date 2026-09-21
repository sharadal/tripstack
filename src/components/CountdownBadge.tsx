import { daysUntil } from "@/lib/trips";

export default function CountdownBadge({ startDate }: { startDate: string }) {
  const days = daysUntil(startDate);

  if (days < 0) {
    return (
      <span className="inline-block rounded-full bg-slate-500/90 px-3 py-1 text-xs font-medium text-white">
        Past trip
      </span>
    );
  }

  if (days === 0) {
    return (
      <span className="inline-block rounded-full bg-orange-600/95 px-3 py-1 text-xs font-medium text-white">
        Starts today
      </span>
    );
  }

  return (
    <span className="inline-block rounded-full bg-teal-950/90 px-3 py-1 text-xs font-medium text-white">
      In {days} day{days === 1 ? "" : "s"}
    </span>
  );
}
