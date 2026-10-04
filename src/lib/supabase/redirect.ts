// Only allow same-site relative paths as post-login destinations, so a
// crafted `?next=https://evil.example` can't turn login into an open
// redirect.
export function safeNextPath(next: string | null | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return "/";
  return next;
}
