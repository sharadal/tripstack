// Public base URL of the site, used for absolute URLs in metadata, the
// sitemap and robots.txt. Set NEXT_PUBLIC_SITE_URL to override it (e.g. for
// a custom domain); otherwise the production Vercel URL is used.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://tripstack-mauve.vercel.app"
).replace(/\/+$/, "");

export const SITE_NAME = "TripStack";

// Where visitors can write about their data (shown on /privacy). Optional:
// when NEXT_PUBLIC_CONTACT_EMAIL is unset the page omits the address.
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || undefined;
