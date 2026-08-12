"use client";
import { createContext, useContext, useEffect, useSyncExternalStore, useCallback } from "react";

type Theme = "light" | "dark";
const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({
  theme: "light",
  toggle: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  try {
    const saved = localStorage.getItem("theme") as Theme;
    if (saved) return saved;
  } catch {}
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

let currentTheme: Theme = "light";
let onThemeChange: ((t: Theme) => void) | null = null;

function subscribeTheme(callback: (t: Theme) => void) {
  onThemeChange = callback;
  return () => { onThemeChange = null; };
}

function getSnapshot() {
  return currentTheme;
}

function getServerSnapshot() {
  return "light" as Theme;
}

function setThemeValue(t: Theme) {
  currentTheme = t;
  document.documentElement.classList.toggle("dark", t === "dark");
  try { localStorage.setItem("theme", t); } catch {}
  onThemeChange?.(t);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribeTheme, getSnapshot, getServerSnapshot);

  useEffect(() => {
    const initial = getInitialTheme();
    setThemeValue(initial);
  }, []);

  const toggle = useCallback(() => {
    setThemeValue(currentTheme === "dark" ? "light" : "dark");
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}
