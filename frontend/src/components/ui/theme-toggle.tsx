"use client";

import { useState } from "react";

type Theme = "dark" | "light" | "system";

function applyThemeClass(t: Theme) {
  const root = document.documentElement;

  if (t === "system") {
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersDark) root.classList.add("dark");
    else root.classList.remove("dark");
  } else if (t === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

export default function ThemeToggle() {
  // Avoid calling setState in effects per ESLint: initialize from localStorage
  // with a lazy initializer (runs only on client because this is a client
  // component). Default to dark which matches the server-side CSS default.
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const stored = localStorage.getItem("reclaim_theme") as Theme | null;
      if (stored) {
        // if system selected, coerce to system but evaluate class below
        return stored;
      }
    } catch {
      // ignore
    }

    return "dark";
  });

  // Apply theme class immediately (client-only) whenever theme changes.
  // This does not call setState inside an effect and satisfies ESLint.
  try {
    applyThemeClass(theme);
  } catch {}

  const onChange = (t: Theme) => {
    try {
      localStorage.setItem("reclaim_theme", t);
    } catch {}
    setTheme(t);
    try {
      applyThemeClass(t);
    } catch {}
  };

  // Render the selector. This component is client-only; server HTML remains
  // the dark default and we only mutate the DOM on the client.
  return (
    <div className="flex items-center gap-2">
      <select
        aria-label="Theme"
        value={theme}
        onChange={(e) => onChange(e.target.value as Theme)}
        className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-2 py-1 text-xs text-zinc-400"
      >
        <option value="dark">Dark</option>
        <option value="light">Light</option>
        <option value="system">System</option>
      </select>
    </div>
  );
}
