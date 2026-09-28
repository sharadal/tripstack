import { notFound } from "next/navigation";
import { getTripById } from "@/lib/trips";
import TripDetailView from "@/components/TripDetailView";
import PersonalTripDetail from "@/components/PersonalTripDetail";

// Trips are now editable data in Supabase, so this route is looked up
// per-request instead of pre-rendered at build time (no generateStaticParams).
export default async function TripDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);

  if (!Number.isFinite(numericId)) {
    notFound();
  }

  const trip = await getTripById(numericId);

  if (trip) {
    return <TripDetailView trip={trip} />;
  }

  return <PersonalTripDetail id={numericId} />;
}
