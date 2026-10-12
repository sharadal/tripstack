"use client"; // Error boundaries must be Client Components

import { useSyncExternalStore } from "react";
import { Geist, Playfair_Display } from "next/font/google";
import ErrorContent, { prefersDark } from "@/components/ErrorContent";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

// Same rule as the theme-init script in layout.tsx: a saved choice wins,
// otherwise follow the OS.
const THEME_SCRIPT = `(function(){try{var s=localStorage.getItem("theme");var d=s?s==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",d);}catch(e){}})();`;

const noopSubscribe = () => () => {};

// Replaces the root layout when it fails, so it has to bring its own
// <html>, <body>, styles, fonts and theme.
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  const isDark = useSyncExternalStore(noopSubscribe, prefersDark, () => false);

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${playfair.variable} h-full antialiased${isDark ? " dark" : ""}`}
    >
      <head>
        <title>Something went wrong — TripStack</title>
        {/* Sets the theme before paint when this page is server-rendered. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col bg-stone-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <ErrorContent error={error} retry={retry} />
      </body>
    </html>
  );
}
