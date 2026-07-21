"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { Toaster } from "sonner";
import {
  RiDashboardLine,
  RiProjectorLine,
  RiFolderOpenLine,
  RiGraduationCapLine,
  RiCodeBoxLine,
  RiUser3Line,
  RiMailLine,
  RiLogoutBoxRLine,
  RiMenuLine,
  RiCloseLine,
  RiExternalLinkLine,
  RiShieldUserLine,
  RiGlobalLine,
  RiNotification3Line,
} from "react-icons/ri";
import ThemeToggle from "../components/ThemeToggle";
import { NotificationProvider, useNotifications } from "../context/NotificationContext";

const navItems = [
  { href: "/admin", label: "Dashboard", Icon: RiDashboardLine, exact: true },
  { href: "/admin/project", label: "Projects", Icon: RiFolderOpenLine },
  { href: "/admin/experience", label: "Experience", Icon: RiProjectorLine },
  { href: "/admin/education", label: "Education", Icon: RiGraduationCapLine },
  { href: "/admin/skills", label: "Skills", Icon: RiCodeBoxLine },
  { href: "/admin/about", label: "About", Icon: RiUser3Line },
  { href: "/admin/contact", label: "Messages", Icon: RiMailLine },
  { href: "/admin/settings", label: "Site Settings", Icon: RiGlobalLine },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/admin/login";

  if (isAuthPage) {
    return (
      <>
        {children}
        <Toaster richColors position="top-right" />
      </>
    );
  }

  return (
    <NotificationProvider>
      <AdminShell>{children}</AdminShell>
    </NotificationProvider>
  );
}

function AdminShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminName, setAdminName] = useState("Admin");
  const { unreadCount } = useNotifications();

  useEffect(() => {
    const token = Cookies.get("admin_token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setAdminName(decoded.name || "Admin");
      } catch {}
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove("admin_token");
    toast.success("Signed out successfully");
    router.push("/admin/login");
    router.refresh();
  };

  const safePathname = pathname || "/";
  const pageName = (() => {
    const last = safePathname.split("/").filter(Boolean).pop();
    if (!last || last === "admin") return "Dashboard";
    return last.charAt(0).toUpperCase() + last.slice(1);
  })();

  const isActive = (item) => {
    if (item.exact) return safePathname === item.href;
    return safePathname.startsWith(item.href);
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "var(--bg)", overflow: "hidden" }}>
      <Toaster richColors position="top-right" />

      {/* Overlay */}
      {sidebarOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.65)",
            zIndex: 40,
            backdropFilter: "blur(2px)",
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`admin-sidebar${sidebarOpen ? " open-mobile" : ""}`}
        style={{
          width: 248,
          background: "rgba(var(--bg2-rgb),0.98)",
          borderRight: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          zIndex: 50,
          transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
          flexShrink: 0,
        }}
      >
        {/* Sidebar header */}
        <div
          style={{
            padding: "1.25rem 1rem",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            gap: "0.625rem",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              background: "linear-gradient(135deg, var(--accent), var(--accent2))",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              fontSize: "0.8125rem",
              color: "var(--on-accent)",
              flexShrink: 0,
              boxShadow: "0 4px 12px rgba(var(--accent-rgb),0.4)",
            }}
          >
            BB
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontWeight: 800,
                fontSize: "0.9375rem",
                color: "var(--text-primary)",
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
              }}
            >
              Portfolio Admin
            </div>
            <div
              style={{
                fontSize: "0.72rem",
                color: "var(--muted)",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
                marginTop: 1,
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: "#22c55e",
                  flexShrink: 0,
                }}
              />
              Management Panel
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="sidebar-close"
            style={{
              background: "none",
              border: "none",
              color: "var(--muted)",
              cursor: "pointer",
              fontSize: "1.25rem",
              display: "none",
              alignItems: "center",
              justifyContent: "center",
              width: 28,
              height: 28,
              borderRadius: 6,
              flexShrink: 0,
            }}
          >
            <RiCloseLine />
          </button>
        </div>

        {/* Nav */}
        <nav
          style={{
            flex: 1,
            padding: "0.875rem 0.75rem",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          }}
        >
          <p
            style={{
              fontSize: "0.68rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--muted)",
              padding: "0 0.5rem",
              marginBottom: "0.5rem",
            }}
          >
            Navigation
          </p>

          {navItems.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.625rem",
                  padding: "0.65rem 0.875rem",
                  borderRadius: "10px",
                  fontSize: "0.9rem",
                  fontWeight: active ? 700 : 500,
                  color: active ? "var(--accent-tint)" : "rgba(var(--text-primary-rgb),0.6)",
                  background: active ? "rgba(var(--accent-rgb),0.12)" : "transparent",
                  border: `1px solid ${active ? "rgba(var(--accent-rgb),0.2)" : "transparent"}`,
                  textDecoration: "none",
                  transition: "background 0.2s, color 0.2s, border-color 0.2s",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = "rgba(var(--accent-rgb),0.07)";
                    e.currentTarget.style.color = "var(--text-primary)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "rgba(var(--text-primary-rgb),0.6)";
                  }
                }}
              >
                {/* Active left bar */}
                {active && (
                  <span
                    style={{
                      position: "absolute",
                      left: 0,
                      top: "25%",
                      height: "50%",
                      width: 3,
                      background: "linear-gradient(to bottom, var(--accent), var(--accent2))",
                      borderRadius: "0 3px 3px 0",
                    }}
                  />
                )}
                <item.Icon
                  style={{
                    fontSize: "1.1rem",
                    color: active ? "var(--accent)" : "inherit",
                    flexShrink: 0,
                  }}
                />
                {item.label}
                {item.href === "/admin/contact" && unreadCount > 0 && (
                  <span
                    style={{
                      marginLeft: "auto",
                      minWidth: 18, height: 18, padding: "0 5px",
                      background: "#ef4444", color: "#fff",
                      borderRadius: 9999,
                      fontSize: "0.68rem", fontWeight: 800,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: "0 0 0 2px rgba(var(--bg2-rgb),1)",
                    }}
                  >
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
                {active && (
                  <span
                    style={{
                      marginLeft: "auto",
                      width: 7,
                      height: 7,
                      background: "var(--accent)",
                      borderRadius: "50%",
                      boxShadow: "0 0 6px rgba(var(--accent-rgb),0.7)",
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div
          style={{
            padding: "0.875rem 0.75rem",
            borderTop: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          {/* User card */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.625rem",
              padding: "0.75rem 0.875rem",
              background: "rgba(var(--accent-rgb),0.07)",
              borderRadius: "10px",
              border: "1px solid rgba(var(--accent-rgb),0.12)",
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                background: "linear-gradient(135deg, var(--accent), var(--accent2))",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: "0.9rem",
                color: "var(--on-accent)",
                flexShrink: 0,
              }}
            >
              {adminName.charAt(0).toUpperCase()}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {adminName}
              </div>
              <div
                style={{
                  fontSize: "0.7rem",
                  color: "var(--muted)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem",
                }}
              >
                <RiShieldUserLine style={{ fontSize: "0.75rem" }} />
                Administrator
              </div>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              width: "100%",
              padding: "0.65rem 0.875rem",
              background: "transparent",
              border: "1px solid rgba(239,68,68,0.18)",
              borderRadius: "10px",
              color: "#f87171",
              fontSize: "0.9rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "background 0.2s, border-color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(239,68,68,0.08)";
              e.currentTarget.style.borderColor = "rgba(239,68,68,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "rgba(239,68,68,0.18)";
            }}
          >
            <RiLogoutBoxRLine style={{ fontSize: "1.1rem" }} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }} className="admin-main">

        {/* Top header */}
        <header
          style={{
            height: 60,
            background: "rgba(var(--bg2-rgb),0.95)",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            padding: "0 1.5rem",
            position: "sticky",
            top: 0,
            zIndex: 30,
            flexShrink: 0,
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Hamburger (mobile only) */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="sidebar-toggle"
            style={{
              background: "rgba(var(--accent-rgb),0.08)",
              border: "1px solid rgba(var(--accent-rgb),0.15)",
              borderRadius: "8px",
              width: 36,
              height: 36,
              cursor: "pointer",
              fontSize: "1.15rem",
              color: "var(--text-secondary)",
              display: "none",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <RiMenuLine />
          </button>

          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ color: "var(--muted)", fontSize: "0.875rem" }}>Admin</span>
            <span style={{ color: "var(--muted)", fontSize: "0.875rem" }}>/</span>
            <h2
              style={{
                fontWeight: 700,
                fontSize: "1rem",
                color: "var(--text-primary)",
                letterSpacing: "-0.01em",
              }}
            >
              {pageName}
            </h2>
          </div>

          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button
              onClick={() => router.push("/admin/contact")}
              aria-label="Messages"
              title={unreadCount > 0 ? `${unreadCount} unread message${unreadCount === 1 ? "" : "s"}` : "Messages"}
              style={{
                position: "relative", width: 36, height: 36, borderRadius: 10,
                border: "1px solid var(--border)", background: "var(--surface-2)",
                color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", fontSize: "1.05rem", flexShrink: 0,
                transition: "background 0.2s, border-color 0.2s, transform 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--accent-subtle)"; e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "var(--surface-2)"; e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <RiNotification3Line />
              {unreadCount > 0 && (
                <span
                  style={{
                    position: "absolute", top: -4, right: -4,
                    minWidth: 17, height: 17, padding: "0 4px",
                    background: "#ef4444", color: "#fff", borderRadius: 9999,
                    fontSize: "0.62rem", fontWeight: 800,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 0 0 2px var(--bg2)",
                  }}
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>

            <ThemeToggle size={36} />

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                fontSize: "0.875rem",
                color: "var(--muted)",
                textDecoration: "none",
                padding: "0.375rem 0.875rem",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                transition: "color 0.2s, border-color 0.2s",
                fontWeight: 500,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--text-primary)";
                e.currentTarget.style.borderColor = "rgba(var(--accent-rgb),0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--muted)";
                e.currentTarget.style.borderColor = "var(--border)";
              }}
            >
              <RiExternalLinkLine style={{ fontSize: "0.9rem" }} />
              View Site
            </a>
          </div>
        </header>

        {/* Main content area */}
        <main style={{ flex: 1, overflowY: "auto", padding: "clamp(1.25rem, 3vw, 2rem)" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
