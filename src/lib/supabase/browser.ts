import { createBrowserClient } from "@supabase/ssr";

// Browser client for Supabase Auth. Unlike the plain anon client in
// `supabaseClient.ts`, this stores the session in cookies so the server
// (proxy, Server Components, Server Actions) can see who is signed in.
// `createBrowserClient` returns a singleton in the browser.
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
