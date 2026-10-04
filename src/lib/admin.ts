import "server-only";
import { getCurrentUser } from "@/lib/supabase/server";

// Comma-separated list of Google account emails allowed into the admin
// area, e.g. ADMIN_EMAILS=me@gmail.com,friend@gmail.com. Server-only (no
// NEXT_PUBLIC_ prefix) so the list never ships to the browser. If it's
// unset, nobody is an admin.
function adminEmails(): Set<string> {
  return new Set(
    (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

// The signed-in user (or null) and whether they're on the admin allowlist.
export async function getAdminStatus() {
  const user = await getCurrentUser();
  const email = user?.email?.toLowerCase();
  return { user, isAdmin: !!email && adminEmails().has(email) };
}

export async function isCurrentUserAdmin(): Promise<boolean> {
  return (await getAdminStatus()).isAdmin;
}
