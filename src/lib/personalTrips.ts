import type { Trip } from "./trips";

const STORAGE_KEY = "tripstack:personal-trips";
export const PERSONAL_TRIPS_EVENT = "tripstack:personal-trips-changed";

function notifyChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(PERSONAL_TRIPS_EVENT));
  }
}

export type NewPersonalTripInput = {
  destination: string;
  country: string;
  startDate: string;
  endDate: string;
  travelStyle: string;
  budget: number;
  image?: string;
  description: string;
  activities: string[];
  packingList: string[];
  notes: string;
};

const EMPTY_TRIPS: Trip[] = [];
let cache: { raw: string; trips: Trip[] } | null = null;

// Returns a stable array reference when the underlying storage hasn't
// changed, so this is safe to use as a useSyncExternalStore snapshot.
export function getPersonalTrips(): Trip[] {
  if (typeof window === "undefined") return EMPTY_TRIPS;

  const raw = window.localStorage.getItem(STORAGE_KEY) ?? "";
  if (cache && cache.raw === raw) {
    return cache.trips;
  }

  let trips: Trip[] = EMPTY_TRIPS;
  try {
    const parsed = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) trips = parsed;
  } catch {
    trips = EMPTY_TRIPS;
  }

  cache = { raw, trips };
  return trips;
}

export function addPersonalTrip(input: NewPersonalTripInput): Trip {
  const trip: Trip = {
    id: Date.now(),
    destination: `${input.destination}, ${input.country}`,
    startDate: input.startDate,
    endDate: input.endDate,
    description: input.description,
    activities: input.activities,
    packingList: input.packingList,
    notes: input.notes,
    budget: input.budget,
    spent: 0,
    travelStyle: input.travelStyle,
    image: input.image || "/images/hero-travel.jpg",
  };

  const next = [...getPersonalTrips(), trip];

  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    notifyChanged();
  }

  return trip;
}
