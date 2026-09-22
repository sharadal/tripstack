"use client";

import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "@/components/icons";

export default function ThemeToggle() {
  const [state, setState] = useState<{ mounted: boolean; isDark: boolean }>({
    mounted: false,
    isDark: false,
  });
  const { mounted, isDark } = state;

  useEffect(() => {
    // One-time read of client-only state (DOM class set by the inline
    // theme-init script) to avoid a server/client hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({
      mounted: true,
      isDark: document.documentElement.classList.contains("dark"),
    });
  }, []);

  const toggle = () => {
    const next = !isDark;
    setState({ mounted: true, isDark: next });
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // localStorage unavailable (private browsing, disabled storage) — theme just won't persist.
    }
  };

  if (!mounted) {
    return <span className="h-9 w-9 shrink-0 rounded-full" aria-hidden="true" />;
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-all duration-200 hover:scale-105 hover:border-orange-300 hover:text-orange-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-amber-400 dark:hover:text-amber-300"
    >
      {isDark ? (
        <SunIcon className="h-4.5 w-4.5" />
      ) : (
        <MoonIcon className="h-4.5 w-4.5" />
      )}
    </button>
  );
}
