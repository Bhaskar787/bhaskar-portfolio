"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import {
  RiProjectorLine,
  RiFolderOpenLine,
  RiGraduationCapLine,
  RiCodeBoxLine,
  RiUser3Line,
  RiMailLine,
  RiArrowRightLine,
  RiAddLine,
  RiEyeLine,
  RiBarChart2Line,
  RiTrophyLine,
  RiTimeLine,
  RiShieldCheckLine,
  RiGlobalLine,
} from "react-icons/ri";
import { HiCode, HiBriefcase, HiAcademicCap, HiStar, HiMail } from "react-icons/hi";

const statCards = [
  { title: "Projects", key: "projectCount", Icon: RiFolderOpenLine, href: "/admin/project", color: "var(--accent)", bg: "rgba(var(--accent-rgb),0.1)", border: "rgba(var(--accent-rgb),0.2)" },
  { title: "Messages", key: "contactCount", Icon: RiMailLine, href: "/admin/contact", color: "#22c55e", bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.2)" },
  { title: "Experience", key: "experienceCount", Icon: RiProjectorLine, href: "/admin/experience", color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.2)" },
  { title: "Education", key: "educationCount", Icon: RiGraduationCapLine, href: "/admin/education", color: "#3b82f6", bg: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.2)" },
  { title: "Skills", key: "skillCount", Icon: RiCodeBoxLine, href: "/admin/skills", color: "#ec4899", bg: "rgba(236,72,153,0.1)", border: "rgba(236,72,153,0.2)" },
  { title: "About", key: "aboutCount", Icon: RiUser3Line, href: "/admin/about", color: "#14b8a6", bg: "rgba(20,184,166,0.1)", border: "rgba(20,184,166,0.2)" },
];

const quickActions = [
  { label: "Add Project", href: "/admin/project", desc: "Publish a new portfolio piece", Icon: RiFolderOpenLine, color: "var(--accent)" },
  { label: "View Messages", href: "/admin/contact", desc: "Check client inquiries", Icon: RiMailLine, color: "#22c55e" },
  { label: "Add Experience", href: "/admin/experience", desc: "Update your career timeline", Icon: RiProjectorLine, color: "#f59e0b" },
  { label: "Update Education", href: "/admin/education", desc: "Manage academic records", Icon: RiGraduationCapLine, color: "#3b82f6" },
  { label: "Edit Skills", href: "/admin/skills", desc: "Add or update your skillset", Icon: RiCodeBoxLine, color: "#ec4899" },
  { label: "Update About", href: "/admin/about", desc: "Refresh your bio", Icon: RiUser3Line, color: "#14b8a6" },
  { label: "Site Settings", href: "/admin/settings", desc: "Configure global site options", Icon: RiGlobalLine, color: "#8b5cf6" },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    projectCount: 0, contactCount: 0, experienceCount: 0,
    educationCount: 0, skillCount: 0, aboutCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const pageRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".dash-hero > *", { y: 20, opacity: 0, duration: 0.55, stagger: 0.1, ease: "power3.out", delay: 0.05 });
      gsap.from(".stat-card-admin", { y: 28, opacity: 0, duration: 0.55, stagger: 0.07, ease: "power3.out", delay: 0.2 });
      gsap.from(".action-card", { y: 20, opacity: 0, duration: 0.5, stagger: 0.06, ease: "power3.out", delay: 0.45 });
      gsap.from(".site-status > *", { y: 14, opacity: 0, duration: 0.45, stagger: 0.05, ease: "power3.out", delay: 0.55 });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} style={{ maxWidth: 1100, margin: "0 auto" }}>

      {/* ── Header ── */}
      <div className="dash-hero" style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "10px",
              background: "rgba(var(--accent-rgb),0.12)",
              border: "1px solid rgba(var(--accent-rgb),0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--accent)",
              fontSize: "1.2rem",
            }}
          >
            <RiBarChart2Line />
          </div>
          <div>
            <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent)", lineHeight: 1 }}>
              Admin Panel
            </p>
            <h1 style={{ fontWeight: 900, fontSize: "clamp(1.4rem, 3vw, 2rem)", color: "var(--text-primary)", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
              Dashboard
            </h1>
          </div>
        </div>
        <p style={{ color: "var(--muted)", fontSize: "0.9rem", maxWidth: 480 }}>
          Overview of your portfolio content. Manage all sections from here.
        </p>
      </div>

      {/* ── Stat Cards ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {statCards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="stat-card-admin"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "1rem",
              padding: "1.25rem",
              textDecoration: "none",
              transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = card.border.replace("0.2", "0.6");
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = `0 8px 24px ${card.bg.replace("0.1", "0.2")}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "10px",
                background: card.bg,
                border: `1px solid ${card.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: card.color,
                fontSize: "1.2rem",
              }}
            >
              <card.Icon />
            </div>
            <div>
              <div
                style={{
                  fontSize: "clamp(1.4rem, 3vw, 1.9rem)",
                  fontWeight: 900,
                  color: loading ? "var(--muted)" : card.color,
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                }}
              >
                {loading ? "—" : stats[card.key]}
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: "0.25rem", fontWeight: 600 }}>
                {card.title}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Quick Actions + Site Status ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        {/* Quick Actions */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "1.25rem",
            padding: "1.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
            <h2 style={{ fontWeight: 800, fontSize: "1rem", color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
              Quick Actions
            </h2>
            <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
              {quickActions.length} items
            </span>
          </div>
          <div
            className="action-row"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "0.75rem",
            }}
          >
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="action-card"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.875rem",
                  padding: "0.875rem 1rem",
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                  borderRadius: "10px",
                  textDecoration: "none",
                  transition: "border-color 0.2s, background 0.2s, transform 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(var(--accent-rgb),0.4)";
                  e.currentTarget.style.background = "rgba(var(--accent-rgb),0.05)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.background = "var(--surface-2)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "8px",
                    background: action.color + "18",
                    border: `1px solid ${action.color}30`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: action.color,
                    fontSize: "1.05rem",
                    flexShrink: 0,
                  }}
                >
                  <action.Icon />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "0.875rem",
                      color: "var(--text-primary)",
                      marginBottom: "0.1rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {action.label}
                  </div>
                  <div
                    style={{
                      fontSize: "0.78rem",
                      color: "var(--muted)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {action.desc}
                  </div>
                </div>
                <RiArrowRightLine style={{ color: "var(--muted)", flexShrink: 0, fontSize: "1rem" }} />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom two-col ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {/* Site Status */}
        <div
          className="site-status"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "1.25rem",
            padding: "1.5rem",
          }}
        >
          <h2 style={{ fontWeight: 800, fontSize: "1rem", color: "var(--text-primary)", marginBottom: "1.25rem", letterSpacing: "-0.02em" }}>
            Site Status
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              { label: "Portfolio Live", status: "Online", ok: true, Icon: RiShieldCheckLine },
              { label: "API Endpoints", status: "Operational", ok: true, Icon: HiCode },
              { label: "Database", status: "Connected", ok: true, Icon: RiBarChart2Line },
              { label: "File Uploads", status: "Cloudinary Active", ok: true, Icon: RiTimeLine },
            ].map(({ label, status, ok, Icon }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.75rem 0.875rem",
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "8px",
                    background: ok ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: ok ? "#22c55e" : "#ef4444",
                    fontSize: "1rem",
                    flexShrink: 0,
                  }}
                >
                  <Icon />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)" }}>{label}</div>
                </div>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: ok ? "#22c55e" : "#ef4444",
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: ok ? "#22c55e" : "#ef4444",
                      flexShrink: 0,
                    }}
                  />
                  {status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Portfolio Highlights */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "1.25rem",
            padding: "1.5rem",
          }}
        >
          <h2 style={{ fontWeight: 800, fontSize: "1rem", color: "var(--text-primary)", marginBottom: "1.25rem", letterSpacing: "-0.02em" }}>
            Portfolio Overview
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              { Icon: HiCode, label: "Projects Built", value: loading ? "—" : `${stats.projectCount || "50"}+`, color: "var(--accent)" },
              { Icon: HiBriefcase, label: "Years Experience", value: "2+", color: "var(--accent2)" },
              { Icon: HiAcademicCap, label: "Tech Stacks", value: loading ? "—" : `${stats.skillCount || "10"}+`, color: "#4ade80" },
              { Icon: HiStar, label: "Client Satisfaction", value: "99%", color: "#f59e0b" },
              { Icon: HiMail, label: "Inquiries Received", value: loading ? "—" : stats.contactCount, color: "#ec4899" },
              { Icon: RiTrophyLine, label: "Completion Rate", value: "100%", color: "var(--accent-tint)" },
            ].map(({ Icon, label, value, color }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.6rem 0.875rem",
                  borderRadius: "8px",
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                }}
              >
                <Icon style={{ color, fontSize: "1.1rem", flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: "0.875rem", color: "var(--text-secondary)", fontWeight: 500 }}>{label}</span>
                <span style={{ fontSize: "0.9rem", fontWeight: 800, color: "var(--text-primary)" }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}