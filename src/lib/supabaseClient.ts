import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Add them to .env.local.",
  );
}

// A single browser client for anonymous, public operations (e.g. the
// newsletter signup insert). The anon key is safe to ship to the client —
// access is governed by the table's Row Level Security policies.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
