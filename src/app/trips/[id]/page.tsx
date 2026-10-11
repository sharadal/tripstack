import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { getTripById } from "@/lib/trips";
import { SITE_NAME } from "@/lib/site";
import TripDetailView from "@/components/TripDetailView";
import PersonalTripDetail from "@/components/PersonalTripDetail";

// generateMetadata and the page both need the trip; cache() makes them
// share one Supabase lookup per request.
const getShowcaseTrip = cache(getTripById);

// Personal trips live in the visitor's browser (localStorage), so the server
// never knows their details -- and they shouldn't be indexed anyway. Invalid
// IDs and failed lookups get the same generic, noindex metadata.
const privateTripMetadata: Metadata = {
  title: "Your trip",
  robots: { index: false, follow: false },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) return privateTripMetadata;

  const trip = await getShowcaseTrip(numericId).catch(() => undefined);
  if (!trip) return privateTripMetadata;

  const title = trip.destination;
  const description = trip.description;
  const url = `/trips/${trip.id}`;

  // The share image comes from opengraph-image.tsx / twitter-image.tsx in
  // this folder: a generated 1200x630 card instead of the raw trip photo.
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      siteName: SITE_NAME,
      title: `${title} — ${SITE_NAME}`,
      description,
      url,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — ${SITE_NAME}`,
      description,
    },
  };
}

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

  const trip = await getShowcaseTrip(numericId);

  if (trip) {
    return <TripDetailView trip={trip} />;
  }

  return <PersonalTripDetail id={numericId} />;
}
