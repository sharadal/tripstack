import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// A row of public.essentials_lists (see supabase/essentials.sql).
export type EssentialsList = {
  id: string;
  user_id: string;
  title: string;
  items: string[];
  created_at: string;
  updated_at: string;
};

// The signed-in user's lists, newest first. Uses the cookie-based client, so
// RLS limits the query to the user's own rows -- never the service-role key.
export async function getMyEssentialsLists() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("essentials_lists")
    .select("*")
    .order("created_at", { ascending: false });

  return { lists: (data ?? []) as EssentialsList[], error };
}
