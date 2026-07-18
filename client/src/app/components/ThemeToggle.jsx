"use client";

import { HiSun, HiMoon } from "react-icons/hi";
import { useTheme } from "../context/ThemeContext";

/**
 * Light / Dark ("Cream & Gold" / "Night") theme switch.
 * Drop it anywhere — it reads/writes the shared ThemeContext,
 * so the whole site (including /admin) toggles together.
 */
export default function ThemeToggle({ size = 40, style = {} }) {
  const { theme, mounted, toggleTheme } = useTheme();
  const isLight = theme === "light";

  // Reserve the space before we know the real theme, to avoid layout shift.
  if (!mounted) {
    return <div style={{ width: size, height: size, flexShrink: 0, ...style }} />;
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isLight ? "Switch to night theme" : "Switch to light theme"}
      title={isLight ? "Switch to night theme" : "Switch to light theme"}
      style={{
        width: size,
        height: size,
        borderRadius: 10,
        border: "1px solid var(--border)",
        background: "var(--surface-2)",
        color: "var(--accent)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        fontSize: size * 0.45,
        transition: "background 0.25s, border-color 0.25s, transform 0.2s, color 0.25s",
        flexShrink: 0,
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--accent-subtle)";
        e.currentTarget.style.borderColor = "var(--accent)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "var(--surface-2)";
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {isLight ? <HiSun /> : <HiMoon />}
    </button>
  );
}
