"use client";

import { useRef } from "react";
import gsap from "gsap";
import { HiSun, HiMoon } from "react-icons/hi";
import { useTheme } from "../context/ThemeContext";

/**
 * Light / Dark ("Cream & Gold" / "Night") theme switch.
 * Features GSAP icon spin/scale animations and triggers the circular
 * view transition wave expanding from the button across the viewport.
 */
export default function ThemeToggle({ size = 40, style = {} }) {
  const { theme, mounted, toggleTheme } = useTheme();
  const isLight = theme === "light";
  const btnRef = useRef(null);
  const iconRef = useRef(null);
  const isTransitioningRef = useRef(false);

  // Reserve the space before we know the real theme, to avoid layout shift.
  if (!mounted) {
    return <div style={{ width: size, height: size, flexShrink: 0, ...style }} />;
  }

  const handleClick = (e) => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    window.setTimeout(() => {
      isTransitioningRef.current = false;
    }, 950);

    // 1. Calculate exact center coordinates of the toggle button
    const rect = btnRef.current?.getBoundingClientRect();
    const x = e.clientX || (rect ? rect.left + rect.width / 2 : window.innerWidth - 40);
    const y = e.clientY || (rect ? rect.top + rect.height / 2 : 40);

    // 2. GSAP button bounce animation
    if (btnRef.current) {
      gsap.fromTo(
        btnRef.current,
        { scale: 0.88 },
        { scale: 1, duration: 0.6, ease: "elastic.out(1.2, 0.4)" }
      );
    }

    // 3. GSAP icon rotation & scale pop animation
    if (iconRef.current) {
      gsap.fromTo(
        iconRef.current,
        { rotate: isLight ? -180 : 180, scale: 0.4, opacity: 0 },
        { rotate: 0, scale: 1, opacity: 1, duration: 0.65, ease: "back.out(1.8)" }
      );
    }

    // 4. Trigger circular view transition from the button center
    toggleTheme({ clientX: x, clientY: y });
  };

  return (
    <button
      ref={btnRef}
      type="button"
      onClick={handleClick}
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
        transition: "background 0.25s, border-color 0.25s, color 0.25s",
        flexShrink: 0,
        position: "relative",
        overflow: "hidden",
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
      <span
        ref={iconRef}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
        }}
      >
        {isLight ? <HiSun /> : <HiMoon />}
      </span>
    </button>
  );
}
