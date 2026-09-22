"use client";

import { useSyncExternalStore } from "react";
import { getBudgetEntries, BUDGET_EVENT } from "@/lib/budget";

const SERVER_SNAPSHOT = {};

function subscribe(onStoreChange: () => void) {
  window.addEventListener(BUDGET_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(BUDGET_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function getServerSnapshot() {
  return SERVER_SNAPSHOT;
}

export function useBudgetEntries() {
  return useSyncExternalStore(subscribe, getBudgetEntries, getServerSnapshot);
}
