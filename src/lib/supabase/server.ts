import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// Per-request Supabase client that reads (and, where allowed, refreshes)
// the auth session from cookies. Uses the anon key, so it acts as the
// signed-in user rather than bypassing Row Level Security.
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component, where cookies are read-only.
            // Safe to ignore: the proxy refreshes the session on every
            // request.
          }
        },
      },
    },
  );
}

// The signed-in user, verified with Supabase Auth, or null.
export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
