import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CompassIcon } from "@/components/icons";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { getCurrentUser } from "@/lib/supabase/server";
import { safeNextPath } from "@/lib/supabase/redirect";

export const metadata: Metadata = {
  title: "Sign in — TripStack",
};

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const params = await searchParams;
  const next = safeNextPath(
    typeof params.next === "string" ? params.next : undefined,
  );
  const error = typeof params.error === "string" ? params.error : undefined;

  // Already signed in — nothing to do here.
  if (await getCurrentUser()) redirect(next);

  return (
    <main className="flex-1 bg-stone-50 dark:bg-slate-950">
      <section className="mx-auto flex max-w-md flex-col items-center px-6 py-20 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-900 to-teal-950 text-white shadow-sm">
          <CompassIcon className="h-6 w-6" />
        </span>
        <p className="mt-6 text-xs font-semibold tracking-[0.2em] text-orange-700 uppercase dark:text-orange-400">
          Welcome back
        </p>
        <h1 className="mt-3 font-serif text-3xl font-bold text-slate-900 sm:text-4xl dark:text-slate-50">
          Sign in to TripStack
        </h1>
        <p className="mt-3 text-slate-600 dark:text-slate-300">
          Use your Google account — no new password to remember.
        </p>

        <div className="mt-8 w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {error && (
            <p
              role="alert"
              className="mb-5 rounded-2xl bg-red-50 px-4 py-3 text-left text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300"
            >
              Sign-in didn&apos;t work: {error}
            </p>
          )}
          <GoogleSignInButton next={next} />
        </div>

        <Link
          href="/"
          className="mt-6 text-sm font-medium text-slate-500 transition hover:text-teal-900 dark:text-slate-400 dark:hover:text-amber-300"
        >
          Back to home
        </Link>
      </section>
    </main>
  );
}
