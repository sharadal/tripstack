import type { MetadataRoute } from "next";
import { getTrips } from "@/lib/trips";
import { SITE_URL } from "@/lib/site";

// Showcase trips are editable in Supabase, so build the sitemap per request
// (like the rest of the site) instead of freezing it at build time.
export const dynamic = "force-dynamic";

// Only public pages belong here: the homepage and the showcase trips.
// Personal trips, profile, settings and admin pages are deliberately left out.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const home: MetadataRoute.Sitemap[number] = {
    url: SITE_URL,
    changeFrequency: "weekly",
    priority: 1,
  };

  try {
    const trips = await getTrips();
    return [
      home,
      ...trips.map((trip) => ({
        url: `${SITE_URL}/trips/${trip.id}`,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
    ];
  } catch {
    // A Supabase hiccup shouldn't break the sitemap -- fall back to home.
    return [home];
  }
}
