"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

// The signed-in Supabase user (or null), kept in sync with sign-in and
// sign-out. `loading` is true until the stored session has been read.
export function useAuthUser(): { user: User | null; loading: boolean } {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    // Fires INITIAL_SESSION straight away, then on every auth change.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
}

export function displayName(user: User): string {
  const meta = user.user_metadata;
  return meta?.full_name ?? meta?.name ?? user.email ?? "Traveller";
}

export function avatarUrl(user: User): string | undefined {
  return user.user_metadata?.avatar_url ?? user.user_metadata?.picture;
}
