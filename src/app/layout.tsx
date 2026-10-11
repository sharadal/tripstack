import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import { getTrips } from "@/lib/trips";
import { isCurrentUserAdmin } from "@/lib/admin";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const defaultTitle = "TripStack — Plan your next adventure";
const defaultDescription =
  "Dates, budgets, packing lists and a two-minute travel-style quiz — everything for your next trip, all in one calm place.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: defaultTitle,
    template: `%s — ${SITE_NAME}`,
  },
  description: defaultDescription,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: defaultTitle,
    description: defaultDescription,
    locale: "en_US",
    images: [
      {
        url: "/images/hero-travel.jpg",
        width: 1920,
        height: 1280,
        alt: "A calm mountain lake reflecting rocky peaks and pine forest",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: ["/images/hero-travel.jpg"],
  },
};

// Trips now live in Supabase and can be edited at any time, so every page
// reads them fresh per request instead of getting a build-time snapshot
// baked into static HTML.
export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // The footer's "Get inspired" list is the only reason every page fetches
  // trips. This layout wraps the whole site, so a Supabase hiccup here
  // should never 500 every route -- fall back to an empty list instead.
  // The admin check only decides whether to show the Admin nav link (the
  // admin page and actions enforce access themselves), so it fails closed.
  const [trips, isAdmin] = await Promise.all([
    getTrips().catch(() => []),
    isCurrentUserAdmin().catch(() => false),
  ]);

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-stone-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem("theme");var d=s?s==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",d);}catch(e){}})();`,
          }}
        />
        <Header isAdmin={isAdmin} />
        {children}
        <section
          id="newsletter"
          aria-label="Newsletter signup"
          className="mx-auto w-full max-w-6xl bg-stone-50 px-6 pb-16 dark:bg-slate-950"
        >
          <Newsletter />
        </section>
        <Footer demoTrips={trips} />
      </body>
    </html>
  );
}
