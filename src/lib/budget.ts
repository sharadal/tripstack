import type { Trip } from "./trips";

const STORAGE_KEY = "tripstack:budget-entries";
export const BUDGET_EVENT = "tripstack:budget-changed";

export type Expense = {
  id: string;
  label: string;
  amount: number;
};

type EntriesMap = Record<string, Expense[]>;

const EMPTY_MAP: EntriesMap = {};

function notifyChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(BUDGET_EVENT));
  }
}

let cache: { raw: string; entries: EntriesMap } | null = null;

// Returns a stable object reference when the underlying storage hasn't
// changed, so this is safe to use as a useSyncExternalStore snapshot.
export function getBudgetEntries(): EntriesMap {
  if (typeof window === "undefined") return EMPTY_MAP;

  const raw = window.localStorage.getItem(STORAGE_KEY) ?? "";
  if (cache && cache.raw === raw) {
    return cache.entries;
  }

  let entries: EntriesMap = EMPTY_MAP;
  try {
    const parsed = raw ? JSON.parse(raw) : {};
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      entries = parsed;
    }
  } catch {
    entries = EMPTY_MAP;
  }

  cache = { raw, entries };
  return entries;
}

function saveEntries(entries: EntriesMap) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  notifyChanged();
}

// Trips ship with a single `spent` total instead of itemised expenses.
// Until a trip's expenses are edited, show that total as one starting
// line so totals match what shipped with the trip.
function baselineExpenses(trip: Trip): Expense[] {
  if (trip.spent <= 0) return [];
  return [{ id: "baseline", label: "Already committed", amount: trip.spent }];
}

export function getTripExpenses(
  trip: Trip,
  entries: EntriesMap = getBudgetEntries(),
): Expense[] {
  return entries[String(trip.id)] ?? baselineExpenses(trip);
}

export function getTripSpent(
  trip: Trip,
  entries: EntriesMap = getBudgetEntries(),
): number {
  return getTripExpenses(trip, entries).reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );
}

export function addExpense(trip: Trip, label: string, amount: number) {
  const entries = getBudgetEntries();
  const current = getTripExpenses(trip, entries);
  const expense: Expense = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    label: label || "Expense",
    amount,
  };

  saveEntries({ ...entries, [String(trip.id)]: [...current, expense] });
}

export function removeExpense(trip: Trip, expenseId: string) {
  const entries = getBudgetEntries();
  const current = getTripExpenses(trip, entries);

  saveEntries({
    ...entries,
    [String(trip.id)]: current.filter((expense) => expense.id !== expenseId),
  });
}
