"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { avatarUrl, displayName, useAuthUser } from "@/hooks/useAuthUser";

function Avatar({ user, size }: { user: User; size: string }) {
  const src = avatarUrl(user);
  const name = displayName(user);

  return src ? (
    // Google avatars are on an external host; a plain <img> avoids having to
    // configure next/image remote patterns for a 32px picture.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      referrerPolicy="no-referrer"
      className={`${size} rounded-full object-cover`}
    />
  ) : (
    <span
      className={`${size} flex items-center justify-center rounded-full bg-teal-950 text-sm font-semibold text-white`}
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
}

function useSignOut() {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signOut = async () => {
    setSigningOut(true);
    setError(null);
    const { error } = await createSupabaseBrowserClient().auth.signOut();
    setSigningOut(false);
    if (error) {
      setError("Couldn't sign out — please try again.");
      return;
    }
    // Re-render server components so protected pages notice the sign-out.
    router.refresh();
  };

  return { signOut, signingOut, error };
}

// Sign-in link or avatar menu for the desktop header.
export function AuthStatus() {
  const { user, loading } = useAuthUser();
  const pathname = usePathname();
  const { signOut, signingOut, error } = useSignOut();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  if (loading) {
    return (
      <span
        aria-hidden="true"
        className="hidden h-9 w-9 animate-pulse rounded-full bg-slate-200 sm:block dark:bg-slate-800"
      />
    );
  }

  if (!user) {
    return (
      <Link
        href={`/login?next=${encodeURIComponent(pathname)}`}
        className="group relative hidden text-sm font-medium text-slate-600 transition hover:text-teal-900 sm:inline dark:text-slate-300 dark:hover:text-amber-300"
      >
        Sign in
        <span className="absolute -bottom-1 left-0 h-0.5 w-0 rounded-full bg-orange-500 transition-all duration-300 group-hover:w-full" />
      </Link>
    );
  }

  return (
    <div ref={menuRef} className="relative hidden sm:block">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Account menu"
        aria-expanded={open}
        className="flex rounded-full ring-2 ring-transparent transition hover:ring-orange-300 dark:hover:ring-orange-400"
      >
        <Avatar user={user} size="h-9 w-9" />
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-64 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-semibold tracking-[0.15em] text-orange-700 uppercase dark:text-orange-400">
            Signed in
          </p>
          <p className="mt-2 truncate font-semibold text-slate-900 dark:text-slate-50">
            {displayName(user)}
          </p>
          <p className="truncate text-sm text-slate-500 dark:text-slate-400">
            {user.email}
          </p>
          <button
            type="button"
            onClick={signOut}
            disabled={signingOut}
            className="mt-4 w-full rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:text-orange-700 disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:border-orange-400 dark:hover:text-orange-300"
          >
            {signingOut ? "Signing out…" : "Sign out"}
          </button>
          {error && (
            <p role="alert" className="mt-2 text-xs text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// Account section at the bottom of the mobile menu.
export function MobileAuthStatus({ onNavigate }: { onNavigate: () => void }) {
  const { user, loading } = useAuthUser();
  const pathname = usePathname();
  const { signOut, signingOut, error } = useSignOut();

  if (loading) return null;

  if (!user) {
    return (
      <Link
        href={`/login?next=${encodeURIComponent(pathname)}`}
        onClick={onNavigate}
        className="rounded-lg px-2 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-orange-50 hover:text-orange-700 dark:text-slate-300 dark:hover:bg-orange-950/40 dark:hover:text-orange-300"
      >
        Sign in
      </Link>
    );
  }

  return (
    <div className="mt-2 border-t border-teal-950/10 px-2 pt-3 dark:border-white/10">
      <div className="flex items-center gap-3">
        <Avatar user={user} size="h-9 w-9 shrink-0" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-50">
            {displayName(user)}
          </p>
          <p className="truncate text-xs text-slate-500 dark:text-slate-400">
            {user.email}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={async () => {
          await signOut();
          onNavigate();
        }}
        disabled={signingOut}
        className="mt-3 w-full rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:text-orange-700 disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:border-orange-400 dark:hover:text-orange-300"
      >
        {signingOut ? "Signing out…" : "Sign out"}
      </button>
      {error && (
        <p role="alert" className="mt-2 text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
