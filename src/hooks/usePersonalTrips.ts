"use client";

import { useSyncExternalStore } from "react";
import type { Trip } from "@/lib/trips";
import { getPersonalTrips, PERSONAL_TRIPS_EVENT } from "@/lib/personalTrips";

const SERVER_SNAPSHOT: Trip[] = [];

function subscribe(onStoreChange: () => void) {
  window.addEventListener(PERSONAL_TRIPS_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(PERSONAL_TRIPS_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function getServerSnapshot() {
  return SERVER_SNAPSHOT;
}

export function usePersonalTrips(): { trips: Trip[]; ready: boolean } {
  const trips = useSyncExternalStore(
    subscribe,
    getPersonalTrips,
    getServerSnapshot,
  );

  return { trips, ready: trips !== SERVER_SNAPSHOT };
}
