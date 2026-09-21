import { notFound } from "next/navigation";
import { trips, getTripById } from "@/lib/trips";
import TripDetailView from "@/components/TripDetailView";
import PersonalTripDetail from "@/components/PersonalTripDetail";

export function generateStaticParams() {
  return trips.map((trip) => ({ id: String(trip.id) }));
}

export default async function TripDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);
  const trip = getTripById(numericId);

  if (trip) {
    return <TripDetailView trip={trip} />;
  }

  if (!Number.isFinite(numericId)) {
    notFound();
  }

  return <PersonalTripDetail id={numericId} />;
}
