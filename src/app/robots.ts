import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Private, per-user and admin routes are blocked from crawling (they also
// redirect anonymous visitors and are marked noindex). /login stays
// crawlable so search engines can see its noindex tag.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/profile", "/settings", "/admin", "/auth/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
