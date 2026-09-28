import { supabase } from "@/lib/supabaseClient";

export type Trip = {
  id: number;
  destination: string;
  startDate: string;
  endDate: string;
  description: string;
  activities: string[];
  packingList?: string[];
  notes?: string;
  budget: number;
  spent: number;
  travelStyle: string;
  image: string;
};

export const TRIP_TYPES = [
  "Beach",
  "City",
  "Mountains",
  "Road trip",
  "Culture",
] as const;

export type TripStyle = (typeof TRIP_TYPES)[number];

type TripRow = {
  id: number;
  destination: string;
  start_date: string;
  end_date: string;
  description: string;
  activities: string[] | null;
  packing_list: string[] | null;
  notes: string | null;
  budget: number;
  spent: number;
  travel_style: string;
  image: string;
};

function mapRow(row: TripRow): Trip {
  return {
    id: row.id,
    destination: row.destination,
    startDate: row.start_date,
    endDate: row.end_date,
    description: row.description,
    activities: row.activities ?? [],
    packingList: row.packing_list ?? undefined,
    notes: row.notes ?? undefined,
    budget: row.budget,
    spent: row.spent,
    travelStyle: row.travel_style,
    image: row.image,
  };
}

// Built-in showcase trips, shipped so there's always something to browse —
// now backed by the public.trips table in Supabase (order by id to match
// the original hardcoded order). User-created trips still live in
// localStorage — see src/lib/personalTrips.ts.
export async function getTrips(): Promise<Trip[]> {
  const { data, error } = await supabase
    .from("trips")
    .select("*")
    .order("id", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []).map(mapRow);
}

export async function getTripById(id: number): Promise<Trip | undefined> {
  const { data, error } = await supabase
    .from("trips")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? mapRow(data) : undefined;
}

export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function daysUntil(dateString: string) {
  const msPerDay = 1000 * 60 * 60 * 24;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateString);
  return Math.round((target.getTime() - today.getTime()) / msPerDay);
}

export function getNights(trip: Trip) {
  const msPerDay = 1000 * 60 * 60 * 24;
  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);
  return Math.round((end.getTime() - start.getTime()) / msPerDay);
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function nextDeparture(list: Trip[]) {
  return list
    .filter((trip) => daysUntil(trip.startDate) >= 0)
    .sort((a, b) => daysUntil(a.startDate) - daysUntil(b.startDate))[0];
}
