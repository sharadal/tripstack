import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentProfile, profileDisplayName } from "@/lib/profile";
import SettingsForm from "./SettingsForm";

// Per-user page -- always rendered fresh for whoever is signed in.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Settings — TripStack",
};

export default async function SettingsPage() {
  const { user, profile, error } = await getCurrentProfile();
  if (!user) redirect("/login?next=/settings");

  return (
    <main className="flex-1 bg-stone-50 dark:bg-slate-950">
      <section className="mx-auto max-w-2xl px-6 py-16">
        <Link
          href="/profile"
          className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 transition hover:text-teal-900 dark:text-slate-400 dark:hover:text-amber-300"
        >
          ← Back to profile
        </Link>
        <p className="mt-6 text-xs font-semibold tracking-[0.2em] text-orange-700 uppercase dark:text-orange-400">
          Settings
        </p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-slate-900 sm:text-4xl dark:text-slate-50">
          Edit your profile
        </h1>
        <p className="mt-3 text-slate-600 dark:text-slate-300">
          This is how you&apos;ll appear on TripStack.
        </p>

        {error || !profile ? (
          <p
            role="alert"
            className="mt-8 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300"
          >
            {error
              ? "Couldn't load your profile — please refresh the page."
              : "We couldn't find your profile — please refresh the page."}
          </p>
        ) : (
          <SettingsForm
            profile={profile}
            email={user.email ?? ""}
            displayName={profileDisplayName(profile, user)}
          />
        )}
      </section>
    </main>
  );
}
