"use client";

import { useState } from "react";
import { type Trip, formatCurrency } from "@/lib/trips";
import {
  addExpense,
  getTripExpenses,
  getTripSpent,
  removeExpense,
} from "@/lib/budget";
import { useBudgetEntries } from "@/hooks/useBudgetEntries";
import { WalletIcon } from "@/components/icons";

export default function BudgetPanel({ trip }: { trip: Trip }) {
  const entries = useBudgetEntries();
  const expenses = getTripExpenses(trip, entries);
  const spent = getTripSpent(trip, entries);
  const remaining = trip.budget - spent;
  const percentSpent =
    trip.budget > 0 ? Math.round((spent / trip.budget) * 100) : 0;
  const overBudget = remaining < 0;

  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string>();

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = Number(amount);

    if (!Number.isFinite(value) || value <= 0) {
      setError("Enter an amount greater than 0.");
      return;
    }

    addExpense(trip, label.trim(), value);
    setLabel("");
    setAmount("");
    setError(undefined);
  };

  return (
    <>
      <h2 className="mt-8 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-50">
        <WalletIcon className="h-5 w-5 text-teal-700 dark:text-teal-400" />
        Budget
      </h2>

      <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
          <span>
            {formatCurrency(spent)} of {formatCurrency(trip.budget)} committed
          </span>
          <span
            className={`font-semibold ${
              overBudget
                ? "text-red-600 dark:text-red-400"
                : "text-orange-700 dark:text-orange-400"
            }`}
          >
            {percentSpent}%
          </span>
        </div>
        <div className="mt-2 h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className={`h-2 rounded-full bg-gradient-to-r ${
              overBudget
                ? "from-red-500 to-red-600"
                : "from-orange-400 to-orange-600"
            }`}
            style={{ width: `${Math.min(percentSpent, 100)}%` }}
          />
        </div>
        <p
          className={`mt-2 text-xs font-medium ${
            overBudget
              ? "text-red-600 dark:text-red-400"
              : "text-slate-500 dark:text-slate-400"
          }`}
        >
          {overBudget
            ? `${formatCurrency(Math.abs(remaining))} over budget`
            : `${formatCurrency(remaining)} remaining`}
        </p>

        {expenses.length > 0 && (
          <ul className="mt-4 divide-y divide-slate-100 border-t border-slate-100 dark:divide-slate-800 dark:border-slate-800">
            {expenses.map((expense) => (
              <li
                key={expense.id}
                className="flex items-center justify-between gap-3 py-2.5 text-sm"
              >
                <span className="text-slate-700 dark:text-slate-200">
                  {expense.label}
                </span>
                <div className="flex items-center gap-3">
                  <span className="font-medium text-slate-900 dark:text-slate-50">
                    {formatCurrency(expense.amount)}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeExpense(trip, expense.id)}
                    aria-label={`Remove ${expense.label}`}
                    className="text-lg leading-none text-slate-400 transition-transform duration-150 hover:scale-125 hover:text-red-600 dark:text-slate-500 dark:hover:text-red-400"
                  >
                    ×
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <form
          onSubmit={handleAdd}
          className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4 dark:border-slate-800"
        >
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="What for? (optional)"
            aria-label="Expense description"
            className="min-w-0 flex-1 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 placeholder-slate-400 transition focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50 dark:placeholder-slate-500"
          />
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount (€)"
            aria-label="Expense amount in euros"
            className="w-32 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 placeholder-slate-400 transition focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50 dark:placeholder-slate-500"
          />
          <button
            type="submit"
            className="shrink-0 rounded-full bg-teal-950 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-900 hover:shadow-md"
          >
            Add expense
          </button>
        </form>
        {error && (
          <p className="mt-2 text-xs font-medium text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
    </>
  );
}
