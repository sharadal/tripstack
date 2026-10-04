"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { GoogleIcon } from "@/components/icons";

export default function GoogleSignInButton({ next = "/" }: { next?: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setLoading(true);
    setError(null);

    // Build the callback from the current origin so the same code works on
    // localhost and on the deployed Vercel site.
    const redirectTo = new URL("/auth/callback", window.location.origin);
    redirectTo.searchParams.set("next", next);

    const { error } = await createSupabaseBrowserClient().auth.signInWithOAuth(
      {
        provider: "google",
        options: { redirectTo: redirectTo.toString() },
      },
    );

    // On success the browser is already navigating to Google, so only an
    // error brings us back here.
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md active:translate-y-0 disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-orange-400"
      >
        <GoogleIcon className="h-5 w-5" />
        {loading ? "Redirecting to Google…" : "Continue with Google"}
      </button>
      {error && (
        <p role="alert" className="mt-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
