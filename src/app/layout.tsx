import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
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

export const metadata: Metadata = {
  title: "TripStack — Plan your next adventure",
  description:
    "Dates, budgets, packing lists and a two-minute travel-style quiz — everything for your next trip, all in one calm place.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem("theme");var d=s?s==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",d);}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-stone-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <Header />
        {children}
        <section
          id="newsletter"
          aria-label="Newsletter signup"
          className="mx-auto w-full max-w-6xl bg-stone-50 px-6 pb-16 dark:bg-slate-950"
        >
          <Newsletter />
        </section>
        <Footer />
      </body>
    </html>
  );
}
