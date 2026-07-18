"use client";
import Link from "next/link";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaGithub } from "react-icons/fa";
import { HiExternalLink, HiArrowNarrowRight } from "react-icons/hi";
import { RiSparklingFill } from "react-icons/ri";
import { MdFolder } from "react-icons/md";
import { BiSolidBadgeCheck } from "react-icons/bi";

gsap.registerPlugin(ScrollTrigger);

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const pageRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/project");
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".proj-hero > *", {
        y: 30, opacity: 0, duration: 0.75, stagger: 0.13, ease: "power3.out", delay: 0.1,
      });
      gsap.utils.toArray(".project-card").forEach((card, i) => {
        gsap.from(card, {
          y: 40, opacity: 0, duration: 0.65, delay: i * 0.08, ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 90%", once: true },
        });
      });
    }, pageRef);
    return () => ctx.revert();
  }, [loading]);

  return (
    <main ref={pageRef} style={{ background: "var(--bg)", minHeight: "100vh", overflowX: "hidden" }}>
      <div
        className="container"
        style={{ paddingTop: "clamp(4rem, 8vw, 6rem)", paddingBottom: "clamp(4rem, 8vw, 7rem)" }}
      >
        {/* ── Hero ── */}
        <div className="proj-hero" style={{ marginBottom: "clamp(3rem, 6vw, 5rem)", maxWidth: 680 }}>
          <div style={{ marginBottom: "0.875rem" }}>
            <span className="section-badge">
              <RiSparklingFill style={{ color: "var(--accent-tint)" }} />
              Portfolio
            </span>
          </div>
          <h1 className="text-display" style={{ marginBottom: "1.25rem" }}>
            My <span className="grad-text">Projects</span>
          </h1>
          <p className="text-body" style={{ maxWidth: 520 }}>
            A curated collection of products I've designed and built end-to-end — from
            full-stack web apps to APIs and developer tooling.
          </p>
        </div>

        {/* ── Stat row ── */}
        <div
          className="proj-hero"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "3rem",
          }}
        >
          {[
            { value: "50+", label: "Projects Built" },
            { value: "2+", label: "Years Experience" },
            { value: "10+", label: "Tech Stacks" },
            { value: "99%", label: "Client Satisfaction" },
          ].map(({ value, label }) => (
            <div
              key={label}
              className="card"
              style={{
                padding: "0.9rem 1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                borderRadius: "1rem",
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: "1.35rem", fontWeight: 900, color: "var(--text-primary)", lineHeight: 1 }}>
                {value}
              </span>
              <span style={{ color: "var(--muted)", fontSize: "0.82rem", fontWeight: 600 }}>{label}</span>
            </div>
          ))}
        </div>

        {/* ── Grid ── */}
        {loading ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1.5rem",
          }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: "380px", borderRadius: "1.25rem" }} />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div
            className="card"
            style={{
              textAlign: "center",
              padding: "5rem 2rem",
              borderRadius: "1.5rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "1.25rem",
                background: "rgba(var(--accent-rgb),0.1)",
                border: "1px solid rgba(var(--accent-rgb),0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--accent)",
                fontSize: "2rem",
              }}
            >
              <MdFolder />
            </div>
            <h3 className="text-subheading" style={{ color: "var(--muted)" }}>No projects yet</h3>
            <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
              Projects will appear here once added from the admin dashboard.
            </p>
          </div>
        ) : (
          <div
            className="projects-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {projects.map((project) => (
              <article
                key={project._id}
                className="project-card card"
                style={{
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: "1.25rem",
                  transition: "border-color .3s, box-shadow .3s, transform .35s",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.borderColor = "rgba(var(--accent-rgb),0.5)";
                  e.currentTarget.style.boxShadow = "0 8px 40px rgba(var(--accent-rgb),0.18)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Image */}
                <div style={{ height: 220, overflow: "hidden", background: "var(--surface-2)", position: "relative" }}>
                  <img
                    src={project.image}
                    alt={project.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.5s ease",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.06)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                  />
                  {/* gradient overlay */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to top, rgba(var(--bg-rgb),0.85) 0%, transparent 55%)",
                    }}
                  />
                  {/* GitHub icon top-right */}
                  {project.githubLink && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        width: 36,
                        height: 36,
                        background: "rgba(var(--bg-rgb),0.75)",
                        backdropFilter: "blur(6px)",
                        borderRadius: "8px",
                        border: "1px solid rgba(255,255,255,0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontSize: "1.05rem",
                        transition: "background .2s",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(36,41,46,0.95)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(var(--bg-rgb),0.75)"; }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FaGithub />
                    </a>
                  )}
                </div>

                {/* Content */}
                <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.875rem", flex: 1 }}>
                  <h3
                    className="line-clamp-2"
                    style={{
                      fontWeight: 800,
                      fontSize: "1.1rem",
                      color: "var(--text-primary)",
                      lineHeight: 1.3,
                    }}
                  >
                    {project.title}
                  </h3>
                  <p
                    className="line-clamp-3"
                    style={{
                      fontSize: "0.9rem",
                      color: "var(--muted)",
                      lineHeight: 1.65,
                      flex: 1,
                    }}
                  >
                    {project.description}
                  </p>

                  {/* Tags */}
                  {project.skills?.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
                      {project.skills.map((tag) => (
                        <span key={tag} className="tag">{tag}</span>
                      ))}
                    </div>
                  )}

                  {/* Action buttons */}
                  <div style={{ display: "flex", gap: "0.75rem", paddingTop: "0.25rem" }}>
                    {project.githubLink && (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-outline"
                        style={{ flex: 1, justifyContent: "center", fontSize: "0.875rem", padding: "0.6rem" }}
                      >
                        <FaGithub /> Code
                      </a>
                    )}
                    {project.liveLink && (
                      <a
                        href={project.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary"
                        style={{ flex: 1, justifyContent: "center", fontSize: "0.875rem", padding: "0.6rem" }}
                      >
                        <HiExternalLink /> Live
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* ── CTA ── */}
        {!loading && projects.length > 0 && (
          <div
            className="card"
            style={{
              marginTop: "clamp(3rem, 6vw, 5rem)",
              background: "linear-gradient(135deg, rgba(var(--accent-rgb),0.12) 0%, rgba(var(--accent2-rgb),0.07) 100%)",
              border: "1px solid rgba(var(--accent-rgb),0.2)",
              borderRadius: "1.75rem",
              padding: "clamp(2rem, 5vw, 3.5rem)",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -60,
                right: -60,
                width: 200,
                height: 200,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(var(--accent-rgb),0.15) 0%, transparent 70%)",
              }}
            />
            <span className="section-badge" style={{ marginBottom: "1.25rem", display: "inline-flex" }}>
              <BiSolidBadgeCheck style={{ color: "#4ade80" }} />
              Open to Collaboration
            </span>
            <h2
              style={{
                fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)",
                fontWeight: 900,
                color: "var(--text-primary)",
                marginBottom: "0.75rem",
                letterSpacing: "-0.03em",
              }}
            >
              Want Something <span className="grad-text">Built?</span>
            </h2>
            <p style={{ color: "var(--muted)", maxWidth: 440, margin: "0 auto 2rem", fontSize: "0.95rem" }}>
              Let's create your next project together. I'm available for freelance and full-time opportunities.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/contact" className="btn-primary">
                Start a Conversation <HiArrowNarrowRight />
              </Link>
              <Link href="/services" className="btn-outline">
                View Services
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
