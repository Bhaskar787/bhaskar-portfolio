"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";
import { HiMenuAlt3, HiX, HiArrowNarrowRight } from "react-icons/hi";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [settings, setSettings] = useState(null);
  const pathname = usePathname();
  const navRef = useRef(null);
  const mobileLinksRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/settings");
        if (!res.ok) return;
        const data = await res.json();
        if (data && !Array.isArray(data)) setSettings(data);
      } catch {}
    })();
  }, []);

  const siteName = settings?.siteName || "Bhaskar Budha";
  const logo = settings?.logo || "";
  const initials = siteName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (navRef.current) {
      gsap.fromTo(
        navRef.current,
        { y: -24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.1 }
      );
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (mobileLinksRef.current) {
        gsap.fromTo(
          mobileLinksRef.current.children,
          { y: -10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.35, stagger: 0.05, ease: "power2.out" }
        );
      }
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header
      ref={navRef}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: scrolled ? "rgba(var(--bg-rgb),0.85)" : "transparent",
        borderBottom: scrolled ? "1px solid rgba(var(--accent-rgb),0.14)" : "1px solid transparent",
        backdropFilter: scrolled ? "blur(18px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(18px)" : "none",
        boxShadow: scrolled ? "0 8px 32px rgba(0,0,0,0.28)" : "none",
        transition: "background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s, box-shadow 0.4s ease",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "72px",
        }}
      >
        {/* ── Logo ── */}
        <Link
          href="/"
          className="logo-link"
          style={{ display: "flex", alignItems: "center", gap: "0.7rem", textDecoration: "none", flexShrink: 0 }}
        >
          <div
            className="logo-badge"
            style={{
              width: 40,
              height: 40,
              background: logo ? "transparent" : "linear-gradient(135deg, var(--accent), var(--accent2))",
              borderRadius: 11,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              fontSize: "0.875rem",
              color: "var(--on-accent)",
              letterSpacing: "-0.02em",
              flexShrink: 0,
              overflow: "hidden",
              boxShadow: logo ? "0 2px 10px rgba(0,0,0,0.25)" : "0 4px 18px rgba(var(--accent-rgb),0.4)",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
            }}
          >
            {logo ? <img src={logo} alt={siteName} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : initials}
          </div>
          <span
            style={{
              fontWeight: 800,
              fontSize: "1.0625rem",
              color: "var(--text-primary)",
              letterSpacing: "-0.03em",
            }}
          >
            {siteName}
          </span>
        </Link>

        {/* ── Desktop Nav ── */}
        <nav
          className="desktop-nav"
          style={{
            alignItems: "center",
            gap: "2px",
            padding: "4px",
            borderRadius: 999,
            background: "rgba(var(--bg2-rgb),0.55)",
            border: "1px solid var(--border)",
          }}
        >
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  position: "relative",
                  padding: "0.5rem 1.1rem",
                  borderRadius: 999,
                  fontSize: "0.9rem",
                  fontWeight: active ? 700 : 500,
                  color: active ? "var(--on-accent)" : "rgba(var(--text-primary-rgb),0.68)",
                  background: active ? "linear-gradient(135deg, var(--accent), var(--accent2))" : "transparent",
                  boxShadow: active ? "0 4px 14px rgba(var(--accent-rgb),0.35)" : "none",
                  transition: "color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease",
                  textDecoration: "none",
                  letterSpacing: "-0.01em",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.color = "var(--text-primary)";
                    e.currentTarget.style.background = "rgba(var(--accent-rgb),0.1)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.color = "rgba(var(--text-primary-rgb),0.68)";
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* ── Right side ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* Desktop CTA */}
          <Link
            href="/contact"
            className="desktop-cta btn-primary"
            style={{ fontSize: "0.875rem", padding: "0.55rem 1.35rem", display: "none" }}
          >
            Hire Me <HiArrowNarrowRight />
          </Link>

          {/* Divider between CTA and utility icons */}
          <span className="nav-divider" style={{ width: 1, height: 24, background: "var(--border)", display: "none" }} />

          {/* Theme toggle */}
          <ThemeToggle size={40} />

          {/* Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="hamburger-btn"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            style={{
              background: "rgba(var(--accent-rgb),0.08)",
              border: "1px solid rgba(var(--accent-rgb),0.2)",
              borderRadius: "10px",
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "var(--text-primary)",
              fontSize: "1.25rem",
              transition: "background 0.2s, border-color 0.2s, transform 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(var(--accent-rgb),0.18)";
              e.currentTarget.style.borderColor = "rgba(var(--accent-rgb),0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(var(--accent-rgb),0.08)";
              e.currentTarget.style.borderColor = "rgba(var(--accent-rgb),0.2)";
            }}
          >
            {isOpen ? <HiX /> : <HiMenuAlt3 />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      <div
        className={`mobile-menu${isOpen ? " open" : ""}`}
        style={{
          background: "rgba(var(--bg-rgb),0.98)",
          borderTop: isOpen ? "1px solid rgba(var(--accent-rgb),0.15)" : "none",
        }}
      >
        <nav ref={mobileLinksRef} style={{ padding: "1rem 1.5rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                style={{
                  padding: "0.9rem 1.1rem",
                  borderRadius: "12px",
                  fontSize: "1rem",
                  fontWeight: active ? 700 : 500,
                  color: active ? "var(--accent-tint)" : "rgba(var(--text-primary-rgb),0.72)",
                  background: active ? "rgba(var(--accent-rgb),0.12)" : "transparent",
                  border: `1px solid ${active ? "rgba(var(--accent-rgb),0.25)" : "transparent"}`,
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  transition: "background 0.2s, color 0.2s",
                  letterSpacing: "-0.01em",
                }}
              >
                {link.label}
                {active && (
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", boxShadow: "0 0 6px rgba(var(--accent-rgb),0.7)" }} />
                )}
              </Link>
            );
          })}
          <Link
            href="/contact"
            onClick={() => setIsOpen(false)}
            className="btn-primary"
            style={{ marginTop: "0.85rem", justifyContent: "center", textAlign: "center" }}
          >
            Hire Me <HiArrowNarrowRight />
          </Link>
        </nav>
      </div>

      <style>{`
        .logo-link:hover .logo-badge {
          transform: translateY(-1px) scale(1.04);
        }
        .hamburger-btn:active { transform: scale(0.93); }
        @media (min-width: 900px) {
          .desktop-nav { display: flex !important; }
          .desktop-cta { display: inline-flex !important; }
          .nav-divider { display: block !important; }
          .hamburger-btn { display: none !important; }
        }
      `}</style>
    </header>
  );
}