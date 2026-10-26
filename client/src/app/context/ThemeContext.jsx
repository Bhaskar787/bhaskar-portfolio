"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { flushSync } from "react-dom";

const STORAGE_KEY = "site-theme";

const ThemeContext = createContext({
  theme: "dark",
  mounted: false,
  toggleTheme: () => {},
  setTheme: () => {},
});

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState("dark");
  const [mounted, setMounted] = useState(false);

  // Pick up whatever the blocking inline script (see layout.js) already
  // applied to <html data-theme="..."> so React state matches the DOM
  // and we don't get a flash / mismatch on first paint.
  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setThemeState(current === "light" ? "light" : "dark");
    setMounted(true);
  }, []);

  const applyTheme = useCallback((next, animate = false) => {
    if (animate && typeof document !== "undefined") {
      document.documentElement.classList.add("theme-transitioning");
    }
    setThemeState(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* localStorage unavailable — theme just won't persist */
    }
    if (animate && typeof window !== "undefined") {
      window.setTimeout(() => {
        document.documentElement.classList.remove("theme-transitioning");
      }, 350);
    }
  }, []);

  const toggleTheme = useCallback((event) => {
    const next = theme === "light" ? "dark" : "light";

    // 1. Check if browser supports View Transitions API and not reduced-motion
    const canUseViewTransition =
      typeof document !== "undefined" &&
      typeof document.startViewTransition === "function" &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (canUseViewTransition) {
      // Determine origin coordinates from the click/tap or default to the top-right corner
      const x = event?.clientX ?? (typeof window !== "undefined" ? window.innerWidth - 50 : 0);
      const y = event?.clientY ?? 40;

      // Calculate distance to the furthest corner of the viewport
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      const transition = document.startViewTransition(() => {
        flushSync(() => {
          applyTheme(next, false);
        });
      });

      transition.ready.then(() => {
        const clipPath = [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ];

        document.documentElement.animate(
          {
            clipPath: clipPath,
          },
          {
            duration: 950,
            easing: "cubic-bezier(0.4, 0, 0.2, 1)",
            pseudoElement: "::view-transition-new(root)",
          }
        );
      });
      return;
    }

    // 2. Fallback for browsers without View Transitions
    applyTheme(next, true);
  }, [theme, applyTheme]);

  return (
    <ThemeContext.Provider value={{ theme, mounted, toggleTheme, setTheme: applyTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
