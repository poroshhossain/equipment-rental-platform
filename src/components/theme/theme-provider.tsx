"use client";

import { createContext, useCallback, useContext, useSyncExternalStore } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "equiprent-theme";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function getSnapshot(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

// The inline script in the root layout applies the class before hydration.
function getServerSnapshot(): Theme {
  return "light";
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const handleSystemChange = (event: MediaQueryListEvent) => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      // Storage may be unavailable — fall back to the system preference.
    }
    if (stored) return;

    applyTheme(event.matches ? "dark" : "light");
    emit();
  };

  media.addEventListener("change", handleSystemChange);
  return () => {
    listeners.delete(onChange);
    media.removeEventListener("change", handleSystemChange);
  };
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleTheme = useCallback(() => {
    const next: Theme = getSnapshot() === "dark" ? "light" : "dark";
    applyTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore storage errors — the theme still applies for this session.
    }
    emit();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside ThemeProvider");
  return context;
}
