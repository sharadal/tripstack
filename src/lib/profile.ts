import "server-only";
import type { User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// A row of public.profiles (see supabase/profiles.sql).
export type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  bio: string | null;
  website: string | null;
  instagram: string | null;
  tiktok: string | null;
  twitter: string | null;
  youtube: string | null;
  place: string | null;
  country: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export const AVATAR_BUCKET = "avatars";

// "First Last" from the profile, falling back to the Google name, then email.
export function profileDisplayName(
  profile: Pick<Profile, "first_name" | "last_name"> | null,
  user: User,
): string {
  const name = [profile?.first_name, profile?.last_name]
    .filter(Boolean)
    .join(" ");
  const meta = user.user_metadata;
  return name || meta?.full_name || meta?.name || user.email || "Traveller";
}

// The signed-in user and their profile row (or nulls). Uses the cookie-based
// client, so RLS limits the query to the user's own row -- never the
// service-role key.
export async function getCurrentProfile() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { user: null, profile: null, error: null };

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle<Profile>();

  return { user, profile, error };
}
