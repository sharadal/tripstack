"use client";

import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { PlaneIcon, SparkleIcon } from "@/components/icons";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Postgres unique_violation — the email is already subscribed.
const UNIQUE_VIOLATION = "23505";

const inputClass =
  "mt-2 w-full rounded-full border bg-white px-4 py-3 text-slate-900 placeholder-slate-400 transition focus:outline-none focus:ring-1 dark:bg-slate-800 dark:text-slate-50 dark:placeholder-slate-500";

type Errors = {
  firstName?: string;
  email?: string;
};

export default function Newsletter() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedName = firstName.trim();
    const trimmedEmail = email.trim();
    const nextErrors: Errors = {};

    if (!trimmedName) {
      nextErrors.firstName = "Enter your first name.";
    }
    if (!trimmedEmail) {
      nextErrors.email = "Enter your email.";
    } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
      nextErrors.email = "Enter a valid email address.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    const { error } = await supabase
      .from("subscribers")
      .insert({ first_name: trimmedName, email: trimmedEmail });
    setSubmitting(false);

    if (error && error.code !== UNIQUE_VIOLATION) {
      toast.error("Couldn't subscribe you — please try again.");
      return;
    }

    toast.success("You're on the list!", {
      description: "Keep an eye on your inbox for travel ideas and trip-planning tips.",
    });
    setFirstName("");
    setEmail("");
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10 dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto max-w-xl text-center">
        <p className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.2em] text-orange-700 uppercase dark:text-orange-400">
          <SparkleIcon className="h-3.5 w-3.5" />
          Stay in the loop
        </p>
        <h2 className="mt-3 font-serif text-3xl font-bold text-slate-900 dark:text-slate-50">
          Travel ideas, straight to your inbox
        </h2>
        <p className="mt-3 text-slate-600 dark:text-slate-300">
          One email a month with destination ideas, packing tips and the
          occasional nudge to finally book that trip.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mx-auto mt-8 max-w-xl"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="newsletter-first-name"
              className="text-xs font-semibold tracking-[0.15em] text-slate-500 uppercase dark:text-slate-400"
            >
              First name
            </label>
            <input
              id="newsletter-first-name"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Jamie"
              aria-invalid={Boolean(errors.firstName)}
              aria-describedby={
                errors.firstName ? "newsletter-first-name-error" : undefined
              }
              className={`${inputClass} ${
                errors.firstName
                  ? "border-red-300 focus:border-red-400 focus:ring-red-400 dark:border-red-500/50"
                  : "border-slate-200 focus:border-orange-600 focus:ring-orange-600 dark:border-slate-700"
              }`}
            />
            {errors.firstName && (
              <p
                id="newsletter-first-name-error"
                role="alert"
                className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400"
              >
                {errors.firstName}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="newsletter-email"
              className="text-xs font-semibold tracking-[0.15em] text-slate-500 uppercase dark:text-slate-400"
            >
              Email
            </label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jamie@example.com"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={
                errors.email ? "newsletter-email-error" : undefined
              }
              className={`${inputClass} ${
                errors.email
                  ? "border-red-300 focus:border-red-400 focus:ring-red-400 dark:border-red-500/50"
                  : "border-slate-200 focus:border-orange-600 focus:ring-orange-600 dark:border-slate-700"
              }`}
            />
            {errors.email && (
              <p
                id="newsletter-email-error"
                role="alert"
                className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400"
              >
                {errors.email}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-teal-950 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-900 hover:shadow-md disabled:pointer-events-none disabled:opacity-60 sm:w-auto"
        >
          <PlaneIcon className="h-3.5 w-3.5 -rotate-45" />
          {submitting ? "Subscribing…" : "Subscribe"}
        </button>
      </form>
    </div>
  );
}
