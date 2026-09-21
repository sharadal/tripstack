import { daysUntil } from "@/lib/trips";
import { PlaneIcon, SparkleIcon } from "@/components/icons";

export default function CountdownBadge({ startDate }: { startDate: string }) {
  const days = daysUntil(startDate);

  if (days < 0) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-500/90 px-3 py-1 text-xs font-medium text-white shadow-sm backdrop-blur">
        Past trip
      </span>
    );
  }

  if (days === 0) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/95 px-3 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur">
        <SparkleIcon className="h-3 w-3" />
        Starts today
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-teal-950/90 px-3 py-1 text-xs font-medium text-white shadow-sm backdrop-blur">
      <PlaneIcon className="h-3 w-3 -rotate-45" />
      In {days} day{days === 1 ? "" : "s"}
    </span>
  );
}
