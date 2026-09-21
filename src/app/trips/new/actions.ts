"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { addTrip } from "@/lib/trips";

export type CreateTripState = {
  error?: string;
};

export async function createTrip(
  _prevState: CreateTripState,
  formData: FormData,
): Promise<CreateTripState> {
  const destination = String(formData.get("destination") ?? "").trim();
  const country = String(formData.get("country") ?? "").trim();
  const startDate = String(formData.get("startDate") ?? "");
  const endDate = String(formData.get("endDate") ?? "");
  const travelStyle = String(formData.get("travelStyle") ?? "").trim();
  const budgetRaw = String(formData.get("budget") ?? "");
  const image = String(formData.get("image") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();
  const activities = formData
    .getAll("activities")
    .map(String)
    .filter(Boolean);
  const packingList = formData
    .getAll("packingList")
    .map(String)
    .filter(Boolean);
  const budget = Number(budgetRaw);

  if (!destination || !country) {
    return { error: "Destination and country are required." };
  }
  if (!startDate || !endDate) {
    return { error: "Start and end dates are required." };
  }
  if (new Date(endDate) < new Date(startDate)) {
    return { error: "End date can't be before the start date." };
  }
  if (!travelStyle) {
    return { error: "Pick a trip type." };
  }
  if (!Number.isFinite(budget) || budget <= 0) {
    return { error: "Enter a valid budget." };
  }

  const trip = addTrip({
    destination,
    country,
    startDate,
    endDate,
    travelStyle,
    budget,
    image: image || undefined,
    description,
    activities,
    packingList,
    notes,
  });

  revalidatePath("/");
  redirect(`/trips/${trip.id}`);
}
