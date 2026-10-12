"use client";

import { useSyncExternalStore } from "react";
import { Toaster as SonnerToaster } from "sonner";

// The theme lives in the `dark` class on <html> (set by the theme-init
// script and ThemeToggle), so follow that class rather than the OS setting.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function getTheme() {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export default function Toaster() {
  const theme = useSyncExternalStore(subscribe, getTheme, () => "light" as const);

  return (
    <SonnerToaster
      theme={theme}
      position="bottom-right"
      richColors
      closeButton
      style={
        {
          "--border-radius": "1rem",
          fontFamily: "var(--font-geist-sans)",
        } as React.CSSProperties
      }
    />
  );
}
