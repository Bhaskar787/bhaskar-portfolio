"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FaGithub, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import {
  HiCode,
  HiLocationMarker,
  HiMail,
  HiPhone,
} from "react-icons/hi";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

const services = [
  "Full-Stack Development",
  "API Architecture",
  "UI / UX Design",
  "Performance Optimisation",
  "Database Design",
  "Code Review",
];

export default function Footer() {
  const year = new Date().getFullYear();
  const [settings, setSettings] = useState(null);

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

  return (
    <footer
      style={{
        position: "relative",
        background: "var(--bg2)",
        borderTop: "1px solid var(--border)",
        overflow: "hidden",
      }}
    >
      {/* subtle glow top */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: 600,
          height: 1,
          background: "linear-gradient(90deg, transparent, rgba(var(--accent-rgb),0.6), transparent)",
        }}
      />
      {/* background radial blobs */}
      <div
        style={{
          position: "absolute",
          bottom: -100,
          left: -100,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(var(--accent-rgb),0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -80,
          right: -80,
          width: 350,
          height: 350,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(var(--accent2-rgb),0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        className="container"
        style={{ paddingTop: "4rem", paddingBottom: "2rem", position: "relative", zIndex: 1 }}
      >
        {/* ── Main Grid ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "3rem",
            marginBottom: "3rem",
          }}
        >
          {/* Brand */}
          <div style={{ gridColumn: "span 1" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1.25rem" }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  background: logo ? "transparent" : "linear-gradient(135deg, var(--accent), var(--accent2))",
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 900,
                  fontSize: "0.875rem",
                  color: "var(--on-accent)",
                  overflow: "hidden",
                  boxShadow: logo ? "none" : "0 4px 16px rgba(var(--accent-rgb),0.4)",
                }}
              >
                {logo ? <img src={logo} alt={siteName} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : initials}
              </div>
              <span style={{ fontWeight: 800, fontSize: "1.0625rem", color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                {siteName}
              </span>
            </div>
            <p
              style={{
                color: "var(--muted)",
                fontSize: "0.9rem",
                lineHeight: 1.75,
                maxWidth: 260,
                marginBottom: "1.25rem",
              }}
            >
              Full-stack developer crafting performant, pixel-perfect web applications. Based in Nepal.
            </p>

            {/* location */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                color: "var(--muted)",
                fontSize: "0.85rem",
                fontWeight: 600,
                marginBottom: "1.25rem",
              }}
            >
              <HiLocationMarker style={{ color: "var(--accent)", fontSize: "1rem" }} />
              Kathmandu, Nepal
            </div>

            {/* Social icons */}
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {[
                { href: "https://github.com/Bhaskar787", Icon: FaGithub, cls: "social-btn--gh", label: "GitHub" },
                { href: "https://www.linkedin.com/in/bhaskar-budha-1a58b83b6", Icon: FaLinkedin, cls: "social-btn--li", label: "LinkedIn" },
                { href: "mailto:budhabhaskar11@gmail.com", Icon: SiGmail, cls: "social-btn--gm", label: "Email" },
                { href: "https://wa.me/9779825630086", Icon: FaWhatsapp, cls: "social-btn--wa", label: "WhatsApp" },
              ].map(({ href, Icon, cls, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={label}
                  className={`social-btn ${cls}`}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--muted)",
                marginBottom: "1.25rem",
              }}
            >
              Navigation
            </p>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {navLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    style={{
                      color: "rgba(var(--text-primary-rgb),0.6)",
                      fontSize: "0.9375rem",
                      textDecoration: "none",
                      transition: "color 0.2s, padding-left 0.2s",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "var(--text-primary)";
                      e.currentTarget.style.paddingLeft = "0.25rem";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "rgba(var(--text-primary-rgb),0.6)";
                      e.currentTarget.style.paddingLeft = "0";
                    }}
                  >
                    <span
                      style={{
                        width: 4,
                        height: 4,
                        borderRadius: "50%",
                        background: "var(--accent)",
                        flexShrink: 0,
                        opacity: 0.5,
                      }}
                    />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <p
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--muted)",
                marginBottom: "1.25rem",
              }}
            >
              Services
            </p>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {services.map((s) => (
                <li key={s}>
                  <Link
                    href="/services"
                    style={{
                      color: "rgba(var(--text-primary-rgb),0.6)",
                      fontSize: "0.9rem",
                      textDecoration: "none",
                      transition: "color 0.2s",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-primary)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(var(--text-primary-rgb),0.6)"; }}
                  >
                    <HiCode style={{ color: "var(--accent)", fontSize: "0.8rem", flexShrink: 0 }} />
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--muted)",
                marginBottom: "1.25rem",
              }}
            >
              Get In Touch
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
              {[
                { Icon: HiMail, label: "Email", value: "budhabhaskar11@gmail.com", href: "mailto:budhabhaskar11@gmail.com" },
                { Icon: HiPhone, label: "Phone", value: "+977 9825630086", href: "tel:+9779825630086" },
                { Icon: FaGithub, label: "GitHub", value: "Bhaskar787", href: "https://github.com/Bhaskar787" },
              ].map(({ Icon, label, value, href }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.6rem",
                    textDecoration: "none",
                  }}
                >
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "8px",
                      background: "rgba(var(--accent-rgb),0.1)",
                      border: "1px solid rgba(var(--accent-rgb),0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--accent)",
                      fontSize: "0.85rem",
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    <Icon />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.72rem", color: "var(--muted)", fontWeight: 600, marginBottom: "0.1rem" }}>
                      {label}
                    </div>
                    <div
                      style={{
                        fontSize: "0.875rem",
                        color: "rgba(var(--text-primary-rgb),0.65)",
                        transition: "color 0.2s",
                        wordBreak: "break-all",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-primary)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(var(--text-primary-rgb),0.65)"; }}
                    >
                      {value}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div
          style={{
            borderTop: "1px solid var(--border)",
            paddingTop: "1.5rem",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
            © {year} {siteName}. All rights reserved.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ color: "var(--muted)", fontSize: "0.875rem" }}>Built with</span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem",
                padding: "0.2rem 0.6rem",
                background: "rgba(var(--accent-rgb),0.1)",
                border: "1px solid rgba(var(--accent-rgb),0.2)",
                borderRadius: 9999,
                fontSize: "0.78rem",
                fontWeight: 600,
                color: "var(--accent-tint)",
              }}
            >
              Next.js &amp; MongoDB
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}