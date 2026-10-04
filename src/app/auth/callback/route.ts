import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { safeNextPath } from "@/lib/supabase/redirect";

// Google sends the user back to Supabase, which redirects here with a
// one-time `code`. Exchanging it sets the session cookies, then we send the
// user on to wherever they started signing in from.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = safeNextPath(searchParams.get("next"));

  const loginWithError = (message: string) => {
    const url = new URL("/login", origin);
    url.searchParams.set("error", message);
    if (next !== "/") url.searchParams.set("next", next);
    return NextResponse.redirect(url);
  };

  // e.g. the user cancelled on Google's consent screen.
  const providerError =
    searchParams.get("error_description") ?? searchParams.get("error");
  if (providerError) return loginWithError(providerError);

  if (!code) return loginWithError("Missing sign-in code. Please try again.");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return loginWithError(error.message);

  return NextResponse.redirect(new URL(next, origin));
}
