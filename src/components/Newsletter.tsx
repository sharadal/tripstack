"use client";

import { useState } from "react";
import { PlaneIcon, SparkleIcon } from "@/components/icons";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputClass =
  "mt-2 w-full rounded-full border bg-white px-4 py-3 text-slate-900 placeholder-slate-400 transition focus:outline-none focus:ring-1";

type Errors = {
  firstName?: string;
  email?: string;
};

export default function Newsletter() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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

    if (Object.keys(nextErrors).length === 0) {
      setSubmitted(true);
      setFirstName("");
      setEmail("");
    }
  };

  if (submitted) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-950 text-white">
          <SparkleIcon className="h-5 w-5 text-amber-300" />
        </span>
        <h2 className="mt-4 font-serif text-2xl font-bold text-slate-900">
          You&apos;re on the list!
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-slate-600">
          Thanks for subscribing — keep an eye on your inbox for travel
          ideas and trip-planning tips.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-6 text-sm font-medium text-slate-500 transition hover:text-teal-900"
        >
          Subscribe another email
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
      <div className="mx-auto max-w-xl text-center">
        <p className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.2em] text-orange-600 uppercase">
          <SparkleIcon className="h-3.5 w-3.5" />
          Stay in the loop
        </p>
        <h2 className="mt-3 font-serif text-3xl font-bold text-slate-900">
          Travel ideas, straight to your inbox
        </h2>
        <p className="mt-3 text-slate-600">
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
              className="text-xs font-semibold tracking-[0.15em] text-slate-500 uppercase"
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
              className={`${inputClass} ${
                errors.firstName
                  ? "border-red-300 focus:border-red-400 focus:ring-red-400"
                  : "border-slate-200 focus:border-orange-400 focus:ring-orange-400"
              }`}
            />
            {errors.firstName && (
              <p className="mt-1.5 text-xs font-medium text-red-600">
                {errors.firstName}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="newsletter-email"
              className="text-xs font-semibold tracking-[0.15em] text-slate-500 uppercase"
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
              className={`${inputClass} ${
                errors.email
                  ? "border-red-300 focus:border-red-400 focus:ring-red-400"
                  : "border-slate-200 focus:border-orange-400 focus:ring-orange-400"
              }`}
            />
            {errors.email && (
              <p className="mt-1.5 text-xs font-medium text-red-600">
                {errors.email}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-teal-950 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-900 hover:shadow-md sm:w-auto"
        >
          <PlaneIcon className="h-3.5 w-3.5 -rotate-45" />
          Subscribe
        </button>
      </form>
    </div>
  );
}
