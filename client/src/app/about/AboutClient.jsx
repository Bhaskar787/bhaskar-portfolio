"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaGithub, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import {
  HiArrowNarrowRight, HiCode, HiBriefcase, HiAcademicCap,
  HiLocationMarker, HiStar, HiExternalLink, HiDownload,
} from "react-icons/hi";
import { BiSolidBadgeCheck } from "react-icons/bi";
import { RiSparklingFill } from "react-icons/ri";
import { MdWork, MdSchool } from "react-icons/md";

import { fetchWithCache, getCached } from "@/utils/apiCache";
import SkillLogo from "../components/SkillLogo";

gsap.registerPlugin(ScrollTrigger);

export default function AboutClient({ initialData = null }) {
  const [data, setData] = useState(
    initialData || {
      about: null,
      education: [],
      skills: [],
      experience: [],
    }
  );
  const [loading, setLoading] = useState(
    !(initialData?.about || initialData?.skills?.length)
  );

  useEffect(() => {
    // 1. If not provided by SSR, hydrate from cache
    if (!initialData?.about && !initialData?.skills?.length) {
      const a = getCached("/api/about");
      const e = getCached("/api/education");
      const s = getCached("/api/skills");
      const x = getCached("/api/experience");

      if (a || e || s || x) {
        setData({
          about: a && !Array.isArray(a) ? a : (Array.isArray(a) && a.length > 0 ? a[0] : null),
          education: Array.isArray(e) ? e : [],
          skills: Array.isArray(s) ? s : [],
          experience: Array.isArray(x) ? x : [],
        });
        if (a) setLoading(false);
      }
    }

    // 2. Fetch fresh data from network in background
    (async () => {
      try {
        const [freshA, freshE, freshS, freshX] = await Promise.all([
          fetchWithCache("/api/about"),
          fetchWithCache("/api/education"),
          fetchWithCache("/api/skills"),
          fetchWithCache("/api/experience"),
        ]);
        setData({
          about: freshA && !Array.isArray(freshA) ? freshA : (Array.isArray(freshA) && freshA.length > 0 ? freshA[0] : null),
          education: Array.isArray(freshE) ? freshE : [],
          skills: Array.isArray(freshS) ? freshS : [],
          experience: Array.isArray(freshX) ? freshX : [],
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [initialData]);

  // 1. Static & Hero reveals — run ONCE on initial mount, never reverted by loading state
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".about-hero-left", { x: -60, opacity: 0, duration: 1.1, ease: "power3.out" });
      gsap.from(".about-hero-right", { x: 60, opacity: 0, duration: 1.1, delay: .15, ease: "power3.out" });

      document.querySelectorAll(".abt-stat[data-target]").forEach((el) => {
        ScrollTrigger.create({
          trigger: el, start: "top 88%", once: true,
          onEnter: () => gsap.to({ val: 0 }, {
            val: +el.dataset.target, duration: 1.6, ease: "power2.out",
            onUpdate() { el.textContent = Math.round(this.targets()[0].val) + el.dataset.suffix; },
          }),
        });
      });

      gsap.utils.toArray(".reveal-up").forEach((el) => {
        gsap.from(el, { scrollTrigger: { trigger: el, start: "top 85%", once: true }, y: 48, opacity: 0, duration: .9, ease: "power3.out" });
      });

      // Stats: fade only, no y-offset, so cards can never appear "stepped" mid-animation
      gsap.utils.toArray(".stats-fade").forEach((wrap) => {
        gsap.from(wrap.children, { scrollTrigger: { trigger: wrap, start: "top 90%", once: true }, opacity: 0, duration: .5, stagger: .06, ease: "power1.out" });
      });
    });
    return () => ctx.revert();
  }, []);

  // 2. Dynamic content reveals — run when dynamic data loads, without touching hero animation
  useEffect(() => {
    if (loading) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray(".timeline-item").forEach((item, i) => {
        gsap.from(item, {
          scrollTrigger: { trigger: item, start: "top 85%", once: true },
          x: i % 2 === 0 ? -30 : 30, opacity: 0, duration: .75, ease: "power3.out",
        });
      });

      ScrollTrigger.refresh();
    });

    return () => ctx.revert();
  }, [loading, data.skills.length, data.education.length, data.experience.length]);

  const about = data.about || {};

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", overflowX: "hidden" }}>

      {/* ══ HERO ══ */}
      <section style={{ padding: "8rem 1.5rem 5rem", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "3rem", alignItems: "center" }} className="about-two-col">

          {/* Left — image */}
          <div className="about-hero-left" style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ position: "relative", width: 280, height: 280, flexShrink: 0 }}>
              <div className="profile-ring-outer">
                <div className="profile-dot profile-dot--top" />
                <div className="profile-dot profile-dot--right" style={{ background: "var(--accent2)" }} />
                <div className="profile-dot profile-dot--bot" style={{ background: "#f43f5e" }} />
              </div>
              <div className="profile-ring-inner" />
              {about?.image ? (
                <img
                  src={about.image}
                  alt="Bhaskar Budha"
                  fetchPriority="high"
                  style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%", border: "4px solid rgba(var(--accent-rgb),.45)", boxShadow: "0 0 0 10px rgba(var(--accent-rgb),.07), 0 30px 70px rgba(0,0,0,.55)", position: "relative", zIndex: 1 }}
                />
              ) : !loading ? (
                <img
                  src="/assets/images/logo.jpg"
                  alt="Bhaskar Budha"
                  style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%", border: "4px solid rgba(var(--accent-rgb),.45)", boxShadow: "0 0 0 10px rgba(var(--accent-rgb),.07), 0 30px 70px rgba(0,0,0,.55)", position: "relative", zIndex: 1 }}
                />
              ) : (
                <div
                  style={{ width: "100%", height: "100%", borderRadius: "50%", background: "var(--card)", border: "4px solid rgba(var(--accent-rgb),.2)", position: "relative", zIndex: 1 }}
                />
              )}
              <div style={{ position: "absolute", bottom: 12, right: -20, background: "var(--card)", border: "1px solid rgba(var(--accent-rgb),.3)", borderRadius: ".75rem", padding: ".6rem .9rem", display: "flex", alignItems: "center", gap: ".5rem", boxShadow: "0 8px 28px rgba(0,0,0,.4)", zIndex: 2 }}>
                <HiCode style={{ color: "var(--accent)", fontSize: "1.1rem" }} />
                <div><div style={{ fontSize: ".72rem", color: "var(--muted)", fontWeight: 600 }}>Coding since</div><div style={{ fontSize: ".9rem", fontWeight: 800, color: "var(--text-primary)" }}>2022</div></div>
              </div>
              <div style={{ position: "absolute", top: 20, left: -20, background: "var(--card)", border: "1px solid rgba(var(--accent2-rgb),.3)", borderRadius: ".75rem", padding: ".6rem .9rem", display: "flex", alignItems: "center", gap: ".5rem", boxShadow: "0 8px 28px rgba(0,0,0,.4)", zIndex: 2 }}>
                <HiStar style={{ color: "var(--accent2)", fontSize: "1.1rem" }} />
                <div><div style={{ fontSize: ".72rem", color: "var(--muted)", fontWeight: 600 }}>Experience</div><div style={{ fontSize: ".9rem", fontWeight: 800, color: "var(--text-primary)" }}>2+ Years</div></div>
              </div>
            </div>
          </div>

          {/* Right — info */}
          <div className="about-hero-right">
            <div style={{ marginBottom: ".75rem" }}>
              <span className="section-badge"><RiSparklingFill style={{ color: "var(--accent-tint)" }} /> About Me</span>
            </div>
            <h1 style={{ fontSize: "clamp(2rem,5vw,3.2rem)", fontWeight: 900, color: "var(--text-primary)", lineHeight: 1.1, marginBottom: ".5rem" }}>Bhaskar Budha</h1>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: ".75rem" }} className="grad-text">
              {about.title || "Full-Stack Developer & UI Engineer"}
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: ".75rem", marginBottom: "1.25rem" }}>
              <span style={{ display: "flex", alignItems: "center", gap: ".35rem", color: "var(--muted)", fontSize: ".85rem", fontWeight: 600 }}>
                <HiLocationMarker style={{ color: "var(--accent)" }} /> {about.location || "Kathmandu, Nepal"}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: ".35rem", background: "rgba(74,222,128,.1)", border: "1px solid rgba(74,222,128,.25)", borderRadius: 9999, padding: ".25rem .75rem", fontSize: ".78rem", fontWeight: 700, color: "#4ade80" }}>
                <span style={{ width: 7, height: 7, background: "#4ade80", borderRadius: "50%", boxShadow: "0 0 6px #4ade80" }} />
                Available for Work
              </span>
            </div>
            <p style={{ color: "rgba(var(--text-primary-rgb),.75)", fontSize: ".97rem", lineHeight: 1.75, marginBottom: "1.75rem", maxWidth: 480 }}>
              {about.bio || "I'm a passionate full-stack developer with a love for clean code and great UX. I specialise in building scalable web applications using modern JavaScript frameworks, cloud services, and thoughtful design."}
            </p>

            {/* Stats */}
            <div className="stats-fade about-stats" style={{ display: "grid", gap: ".75rem", marginBottom: "1.75rem", alignItems: "stretch" }}>
              {[{ target: 50, suffix: "+", label: "Projects" }, { target: 2, suffix: "+", label: "Years" }, { target: 99, suffix: "%", label: "Uptime" }, { target: 10, suffix: "+", label: "Stacks" }].map(({ target, suffix, label }) => (
                <div key={label} className="card" style={{ padding: ".9rem .5rem", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div className="abt-stat" data-target={target} data-suffix={suffix} style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--text-primary)", lineHeight: 1 }}>0{suffix}</div>
                  <div style={{ fontSize: ".72rem", color: "var(--muted)", fontWeight: 600, marginTop: ".25rem" }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Social row */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center", marginBottom: "1rem" }}>
              <a href="https://github.com/Bhaskar787" target="_blank" rel="noopener noreferrer" className="social-btn social-btn--gh" aria-label="GitHub"><FaGithub /></a>
              <a href="https://www.linkedin.com/in/bhaskar-budha-1a58b83b6" target="_blank" rel="noopener noreferrer" className="social-btn social-btn--li" aria-label="LinkedIn"><FaLinkedin /></a>
              <a href="mailto:budhabhaskar11@gmail.com" className="social-btn social-btn--gm" aria-label="Email"><SiGmail /></a>
              <a href="https://wa.me/9779825630086" target="_blank" rel="noopener noreferrer" className="social-btn social-btn--wa" aria-label="WhatsApp"><FaWhatsapp /></a>
            </div>

            {/* CTA row */}
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Link href="/contact" className="btn-primary">Hire Me <HiArrowNarrowRight /></Link>
              {about.resume && (
                <a href={about.resume} target="_blank" rel="noopener noreferrer" download className="btn-outline">
                  Download Resume <HiDownload />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ══ SKILLS ══ */}
      {(loading || data.skills.length > 0) && (
        <section style={{ padding: "4rem 1.5rem", maxWidth: 1100, margin: "0 auto" }}>
          <div className="reveal-up" style={{ marginBottom: "2rem" }}>
            <span className="section-badge" style={{ marginBottom: ".75rem", display: "inline-flex" }}><HiCode /> Tech Stack</span>
            <h2 style={{ fontSize: "clamp(1.6rem,3.5vw,2.4rem)", fontWeight: 900, color: "var(--text-primary)" }}>Skills &amp; Technologies</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(120px,1fr))", gap: "0.85rem" }}>
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="card" style={{ padding: "1.2rem 0.8rem", height: 110, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div className="skeleton" style={{ height: 38, width: 38, borderRadius: "0.6rem" }} />
                </div>
              ))
            ) : (
              data.skills.map((sk) => (
                <div
                  key={sk._id}
                  className="card reveal-up skill-card-v2"
                  style={{
                    padding: "1.2rem 0.75rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    gap: "0.65rem",
                    borderRadius: "1rem",
                    transition: "all 0.25s cubic-bezier(0.2, 0, 0, 1)",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.borderColor = "var(--accent)";
                    e.currentTarget.style.boxShadow = "0 8px 24px -4px rgba(var(--accent-rgb), 0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "0.75rem",
                      background: "var(--surface-2)",
                      border: "1px solid var(--border)",
                      padding: "6px",
                      flexShrink: 0,
                    }}
                  >
                    <SkillLogo image={sk.image} name={sk.name} size={30} />
                  </div>
                  <div style={{ minWidth: 0, width: "100%" }}>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: "0.84rem",
                        color: "var(--text-primary)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      title={sk.name}
                    >
                      {sk.name}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {/* ══ EDUCATION ══ */}
      {(loading || data.education.length > 0) && (
        <section style={{ padding: "4rem 1.5rem", maxWidth: 1100, margin: "0 auto" }}>
          <div className="reveal-up" style={{ marginBottom: "2.5rem" }}>
            <span className="section-badge" style={{ marginBottom: ".75rem", display: "inline-flex" }}><MdSchool /> Education</span>
            <h2 style={{ fontSize: "clamp(1.6rem,3.5vw,2.4rem)", fontWeight: 900, color: "var(--text-primary)" }}>Academic Background</h2>
          </div>
          <div className="timeline">
            {loading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="timeline-item">
                  <div className="timeline-dot timeline-dot--edu" />
                  <div className="card" style={{ padding: "1.5rem 1.75rem" }}>
                    <div className="skeleton" style={{ height: 22, width: 90, borderRadius: 9999, marginBottom: ".75rem" }} />
                    <div className="skeleton" style={{ height: 24, width: "65%", borderRadius: 6, marginBottom: ".5rem" }} />
                    <div className="skeleton" style={{ height: 16, width: "40%", borderRadius: 4 }} />
                  </div>
                </div>
              ))
            ) : (
              data.education.map((edu) => (
                <div key={edu._id} className="timeline-item">
                  <div className="timeline-dot timeline-dot--edu" />
                  <div className="card" style={{ padding: "1.5rem 1.75rem" }}>
                    <div style={{ display: "inline-block", padding: ".25rem .75rem", background: "rgba(var(--accent2-rgb),.12)", border: "1px solid rgba(var(--accent2-rgb),.25)", borderRadius: 9999, fontSize: ".75rem", fontWeight: 700, color: "var(--accent2)", marginBottom: ".75rem" }}>{edu.duration}</div>
                    <h3 style={{ fontWeight: 800, fontSize: "1.15rem", color: "var(--text-primary)", marginBottom: ".3rem" }}>{edu.degree}</h3>
                    <p style={{ color: "var(--accent)", fontWeight: 700, fontSize: ".9rem", marginBottom: ".5rem" }}>{edu.institution}</p>
                    {edu.description && <p style={{ color: "var(--muted)", fontSize: ".88rem", lineHeight: 1.65 }}>{edu.description}</p>}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {/* ══ EXPERIENCE ══ */}
      {(loading || data.experience.length > 0) && (
        <section style={{ padding: "4rem 1.5rem", maxWidth: 1100, margin: "0 auto" }}>
          <div className="reveal-up" style={{ marginBottom: "2.5rem" }}>
            <span className="section-badge" style={{ marginBottom: ".75rem", display: "inline-flex" }}><MdWork /> Experience</span>
            <h2 style={{ fontSize: "clamp(1.6rem,3.5vw,2.4rem)", fontWeight: 900, color: "var(--text-primary)" }}>Professional Journey</h2>
          </div>
          <div className="timeline">
            {loading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="timeline-item">
                  <div className="timeline-dot" />
                  <div className="card" style={{ padding: "1.5rem 1.75rem", display: "flex", gap: "1.2rem", alignItems: "flex-start" }}>
                    <div className="skeleton" style={{ width: 56, height: 56, borderRadius: ".75rem", flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div className="skeleton" style={{ height: 20, width: 80, borderRadius: 9999, marginBottom: ".6rem" }} />
                      <div className="skeleton" style={{ height: 22, width: "50%", borderRadius: 6, marginBottom: ".4rem" }} />
                      <div className="skeleton" style={{ height: 16, width: "80%", borderRadius: 4 }} />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              data.experience.map((exp) => (
                <div key={exp._id} className="timeline-item">
                  <div className="timeline-dot" />
                  <div className="card" style={{ padding: "1.5rem 1.75rem", display: "flex", gap: "1.2rem", alignItems: "flex-start" }}>
                    {exp.image && (
                      <div style={{ flexShrink: 0, width: 56, height: 56, borderRadius: ".75rem", overflow: "hidden", border: "1px solid var(--border)" }}>
                        <img src={exp.image} alt={exp.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "inline-block", padding: ".25rem .75rem", background: "rgba(var(--accent-rgb),.12)", border: "1px solid rgba(var(--accent-rgb),.25)", borderRadius: 9999, fontSize: ".75rem", fontWeight: 700, color: "var(--accent-tint)", marginBottom: ".6rem" }}>{exp.duration}</div>
                      <h3 style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--text-primary)", marginBottom: ".4rem" }}>{exp.title}</h3>
                      <p style={{ color: "var(--muted)", fontSize: ".88rem", lineHeight: 1.65 }}>{exp.description}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {/* ══ CTA ══ */}
      <section style={{ padding: "4rem 1.5rem 6rem" }}>
        <div className="reveal-up" style={{ maxWidth: 720, margin: "0 auto", background: "linear-gradient(135deg, rgba(var(--accent-rgb),.13) 0%, rgba(var(--accent2-rgb),.07) 100%)", border: "1px solid rgba(var(--accent-rgb),.2)", borderRadius: "1.75rem", padding: "clamp(2rem,5vw,3.5rem)", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, background: "radial-gradient(circle, rgba(var(--accent-rgb),.18) 0%, transparent 70%)", borderRadius: "50%" }} />
          <span className="section-badge" style={{ marginBottom: "1rem", display: "inline-flex" }}><BiSolidBadgeCheck style={{ color: "#4ade80" }} /> Open to Work</span>
          <h2 style={{ fontSize: "clamp(1.6rem,3.5vw,2.4rem)", fontWeight: 900, color: "var(--text-primary)", marginBottom: ".75rem" }}>
            Let's Build Something <span className="grad-text">Amazing</span>
          </h2>
          <p style={{ color: "var(--muted)", maxWidth: 440, margin: "0 auto 2rem", fontSize: ".95rem" }}>
            I'm always open to exciting opportunities, collaborations, and interesting projects.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/contact" className="btn-primary">Get In Touch <HiArrowNarrowRight /></Link>
            <Link href="/projects" className="btn-outline">See My Work</Link>
          </div>
        </div>
      </section>

      <style>{`
        @media (min-width: 768px) { .about-two-col { grid-template-columns: auto 1fr !important; } }
        .timeline-item .card { margin-bottom: 0; }

        /* Stats grid: 2 columns on mobile, 4 on larger screens */
        .about-stats { grid-template-columns: repeat(2, 1fr); }
        @media (min-width: 640px) { .about-stats { grid-template-columns: repeat(4, 1fr); } }
      `}</style>
    </div>
  );
}
