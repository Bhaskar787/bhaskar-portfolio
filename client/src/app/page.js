"use client";
import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
import gsap            from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaGithub, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { SiGmail }     from "react-icons/si";
import {
  HiArrowNarrowRight,
  HiExternalLink,
  HiCode,
  HiStar,
  HiBriefcase,
  HiAcademicCap,
  HiLightningBolt,
} from "react-icons/hi";
import { BiSolidBadgeCheck } from "react-icons/bi";
import { RiSparklingFill }   from "react-icons/ri";

gsap.registerPlugin(ScrollTrigger);

const SERVICES = [
  { icon: <HiCode />,         label: "Full-Stack Development" },
  { icon: <HiLightningBolt />,label: "Performance Optimisation" },
  { icon: <HiStar />,         label: "UI / UX Design" },
  { icon: <HiBriefcase />,    label: "API Architecture" },
  { icon: <HiAcademicCap />,  label: "Database Design" },
  { icon: <BiSolidBadgeCheck />,label: "Code Review" },
];

async function safeFetch(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const text = await res.text();
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/* ────────────────────────────────────────────────────────────
   useTilt — subtle 3D pointer-tilt for "Dribbble style" cards.
   Applies rotateX/rotateY + a moving radial highlight via CSS vars,
   so the glow tracks the cursor without extra DOM nodes.
──────────────────────────────────────────────────────────── */
function useTilt(max = 8) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = null;

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;   // 0 → 1
      const py = (e.clientY - rect.top) / rect.height;    // 0 → 1
      const rx = (py - 0.5) * -max;
      const ry = (px - 0.5) * max;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        gsap.to(el, { rotateX: rx, rotateY: ry, duration: 0.5, ease: "power2.out", transformPerspective: 800 });
        el.style.setProperty("--mx", `${px * 100}%`);
        el.style.setProperty("--my", `${py * 100}%`);
      });
    };
    const onLeave = () => {
      gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.7, ease: "elastic.out(1,0.6)" });
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [max]);
  return ref;
}

/* Magnetic button — nudges toward the cursor within its bounds. */
function useMagnetic(strength = 0.35) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * strength;
      const y = (e.clientY - rect.top - rect.height / 2) * strength;
      gsap.to(el, { x, y, duration: 0.4, ease: "power2.out" });
    };
    const onLeave = () => gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1,0.5)" });
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [strength]);
  return ref;
}

/* ══ Dribbble-style Project Card ══ */
function ProjectCard({ proj, index }) {
  const tiltRef = useTilt(6);
  return (
    <article
      ref={tiltRef}
      className="proj-card-v2"
      style={{ transformStyle: "preserve-3d" }}
    >
      <span className="proj-card-v2__index">{String(index + 1).padStart(2, "0")}</span>

      <div className="proj-card-v2__media">
        <img src={proj.image} alt={proj.title} />
        <div className="proj-card-v2__scrim" />
        {proj.githubLink && (
          <a
            href={proj.githubLink}
            target="_blank"
            rel="noopener noreferrer"
            className="proj-card-v2__ghbadge"
            aria-label="View source on GitHub"
          >
            <FaGithub />
          </a>
        )}
      </div>

      <div className="proj-card-v2__body">
        <h3 className="line-clamp-2">{proj.title}</h3>
        <p className="line-clamp-3">{proj.description}</p>

        {proj.skills?.length > 0 && (
          <div className="proj-card-v2__tags">
            {proj.skills.map((tag) => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        )}

        <div className="proj-card-v2__actions">
          {proj.liveLink && (
            <a href={proj.liveLink} target="_blank" rel="noopener noreferrer" className="proj-card-v2__cta">
              View Project
              <span className="proj-card-v2__cta-circle"><HiArrowNarrowRight style={{ transform: "rotate(-45deg)" }} /></span>
            </a>
          )}
          {proj.githubLink && !proj.liveLink && (
            <a href={proj.githubLink} target="_blank" rel="noopener noreferrer" className="proj-card-v2__cta">
              View Code
              <span className="proj-card-v2__cta-circle"><HiArrowNarrowRight style={{ transform: "rotate(-45deg)" }} /></span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

/* ══ Timeline Experience Card — image + overlaid date badge + expandable copy ══ */
function ExperienceCard({ exp, side, index }) {
  const tiltRef = useTilt(4);
  const [open, setOpen] = useState(false);

  return (
    <div className={`exp-row exp-row--${side}`}>
      <div className="exp-row__dot-col">
        <span className="exp-row__dot" />
        <span className="exp-row__dot-pulse" />
      </div>

      <article ref={tiltRef} className="exp-card-v2" style={{ transformStyle: "preserve-3d" }}>
        {exp.image && (
          <div className="exp-card-v2__media">
            <img src={exp.image} alt={exp.title} />
            <span className="exp-card-v2__index">{String(index + 1).padStart(2, "0")}</span>
            <span className="exp-card-v2__duration exp-card-v2__duration--onmedia">{exp.duration}</span>
          </div>
        )}
        <div className="exp-card-v2__body">
          {!exp.image && <div className="exp-card-v2__duration">{exp.duration}</div>}
          <h3>{exp.title}</h3>
          <p className={open ? "" : "line-clamp-3"}>{exp.description}</p>
          {exp.description && exp.description.length > 140 && (
            <button type="button" className="exp-card-v2__more" onClick={() => setOpen((v) => !v)}>
              {open ? "Show Less" : "Read More"}
              <HiArrowNarrowRight style={{ transform: open ? "rotate(-90deg)" : "rotate(90deg)", transition: "transform .3s ease" }} />
            </button>
          )}
        </div>
      </article>
    </div>
  );
}

export default function Home() {
  const [projects,    setProjects]    = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [skills,      setSkills]      = useState([]);
  const [education,   setEducation]   = useState([]);
  const [about,       setAbout]       = useState(null);
  const [loading,     setLoading]     = useState(true);

  const blob1Ref   = useRef(null);
  const blob2Ref   = useRef(null);
  const heroRef    = useRef(null);
  const statsRef   = useRef(null);
  const projRef    = useRef(null);
  const expRef     = useRef(null);
  const skillsRef  = useRef(null);
  const ctaRef     = useRef(null);
  const timelineLineRef = useRef(null);

  const primaryBtnRef = useMagnetic(0.3);
  const outlineBtnRef = useMagnetic(0.3);

  const handleMouse = useCallback((e) => {
    blob1Ref.current?.animate({ left: e.clientX + "px", top: e.clientY + "px" }, { duration: 2200, fill: "forwards" });
    blob2Ref.current?.animate({ left: e.clientX + "px", top: e.clientY + "px" }, { duration: 3800, fill: "forwards" });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, [handleMouse]);

  useEffect(() => {
    (async () => {
      try {
        const [p, e, s, a, ed] = await Promise.all([
          safeFetch("/api/project"),
          safeFetch("/api/experience"),
          safeFetch("/api/skills"),
          safeFetch("/api/about"),
          safeFetch("/api/education"),
        ]);
        if (Array.isArray(p)) setProjects(p);
        if (Array.isArray(e)) setExperiences(e);
        if (Array.isArray(s)) setSkills(s);
        if (a && !Array.isArray(a)) setAbout(a);
        else if (Array.isArray(a) && a.length > 0) setAbout(a[0]);
        if (Array.isArray(ed)) setEducation(ed);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ── Hero: word-level headline reveal + orchestrated intro ── */
      const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
      heroTl
        .from(".hero-badge", { y: 24, opacity: 0, duration: 0.7 })
        .from(".hero-word", { yPercent: 130, opacity: 0, duration: 0.9, stagger: 0.05, ease: "expo.out" }, "-=.35")
        .from(".hero-sub", { y: 20, opacity: 0, duration: 0.7 }, "-=.5")
        .from(".hero-copy", { y: 20, opacity: 0, duration: 0.7 }, "-=.5")
        .from(".hero-anim-cta > *", { y: 18, opacity: 0, duration: 0.6, stagger: 0.08 }, "-=.45")
        .from(".hero-anim-social > *", { scale: 0, opacity: 0, duration: 0.5, stagger: 0.07, ease: "back.out(2.2)" }, "-=.35")
        .from(".hero-img", { scale: 0.8, opacity: 0, rotate: -6, duration: 1.1, ease: "back.out(1.5)" }, "-=.9");

      /* subtle continuous float on the profile portrait */
      gsap.to(".hero-img", { y: -14, duration: 3.2, ease: "sine.inOut", yoyo: true, repeat: -1 });
      gsap.to(".profile-ring-outer", { rotate: 360, duration: 22, ease: "none", repeat: -1 });

      /* ── Stat counters ── */
      document.querySelectorAll(".stat-num[data-target]").forEach((el) => {
        const target = +el.dataset.target;
        ScrollTrigger.create({
          trigger: el, start: "top 88%", once: true,
          onEnter: () => gsap.to({ val: 0 }, {
            val: target, duration: 1.8, ease: "power2.out",
            onUpdate() { el.textContent = Math.round(this.targets()[0].val) + el.dataset.suffix; },
          }),
        });
      });

      /* ── Generic reveals ── */
      gsap.utils.toArray(".reveal-up").forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          y: 50, opacity: 0, duration: .85, ease: "power3.out",
        });
      });
      gsap.utils.toArray(".reveal-stagger").forEach((wrap) => {
        gsap.from(wrap.children, {
          scrollTrigger: { trigger: wrap, start: "top 82%", once: true },
          y: 40, opacity: 0, duration: .75, stagger: .1, ease: "power3.out",
        });
      });

      /* ── Project cards: scale + fade + slight rotation in ── */
      gsap.utils.toArray(".proj-card-v2").forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: { trigger: card, start: "top 88%", once: true },
          y: 70, opacity: 0, scale: 0.94, rotateZ: i % 2 === 0 ? -1.5 : 1.5,
          duration: 0.9, ease: "power3.out", delay: (i % 2) * 0.08,
        });
      });

      /* ── Skill bars ── */
      document.querySelectorAll(".skill-bar-fill[data-pct]").forEach((bar) => {
        const pct = bar.dataset.pct;
        const rect = bar.getBoundingClientRect();
        const alreadyInView = rect.top < window.innerHeight * 0.88;
        if (alreadyInView) {
          gsap.to(bar, { width: pct + "%", duration: 1.3, ease: "power2.out" });
        } else {
          ScrollTrigger.create({
            trigger: bar, start: "top 88%", once: true,
            onEnter: () => gsap.to(bar, { width: pct + "%", duration: 1.3, ease: "power2.out" }),
          });
        }
      });

      /* ── Education timeline items ── */
      gsap.utils.toArray(".timeline-item").forEach((item, i) => {
        gsap.from(item, {
          scrollTrigger: { trigger: item, start: "top 85%", once: true },
          x: i % 2 === 0 ? -30 : 30, opacity: 0, duration: .75, ease: "power3.out",
        });
      });

      /* ── Experience timeline: alternating slide-in + animated drawn line ── */
      gsap.utils.toArray(".exp-row").forEach((row) => {
        const fromSide = row.classList.contains("exp-row--left") ? -60 : 60;
        gsap.from(row.querySelector(".exp-card-v2"), {
          scrollTrigger: { trigger: row, start: "top 85%", once: true },
          x: fromSide, opacity: 0, duration: 0.85, ease: "power3.out",
        });
        gsap.from(row.querySelector(".exp-row__dot"), {
          scrollTrigger: { trigger: row, start: "top 85%", once: true },
          scale: 0, duration: 0.5, ease: "back.out(3)",
        });
      });
      if (timelineLineRef.current && expRef.current) {
        gsap.fromTo(
          timelineLineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1, ease: "none", transformOrigin: "top center",
            scrollTrigger: { trigger: expRef.current, start: "top 75%", end: "bottom 85%", scrub: 0.6 },
          }
        );
      }
    });
    return () => ctx.revert();
  }, [loading]);

  const Sk = ({ h = "h-40", extra = "" }) => (
    <div className="skeleton" style={{ height: h === "h-40" ? 160 : h === "h-80" ? 320 : h === "h-48" ? 192 : h === "h-20" ? 80 : 160, borderRadius: "var(--radius)" }} />
  );

  const heroTitle = "Bhaskar Budha";

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", overflowX: "hidden", position: "relative" }}>
      <div ref={blob1Ref} className="blob blob-1" style={{ top: "30%", left: "60%" }} />
      <div ref={blob2Ref} className="blob blob-2" style={{ top: "60%", left: "40%" }} />

      {/* ══ HERO ══ */}
      <section ref={heroRef} style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", padding: "7rem 1.5rem 4rem" }}>
        <div className="hero-grid-bg" />
        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1fr", gap: "3rem", alignItems: "center" }} className="hero-grid-layout">
          {/* left */}
          <div style={{ order: 2 }}>
            <div className="hero-badge" style={{ marginBottom: "1.25rem" }}>
              <span className="section-badge"><RiSparklingFill style={{ color: "var(--accent-tint)" }} /> Available for Work</span>
            </div>
            <h1 style={{ fontSize: "clamp(2.4rem, 6vw, 5rem)", fontWeight: 900, lineHeight: 1.08, marginBottom: "1.25rem", color: "var(--text-primary)", overflow: "hidden" }}>
              <span style={{ display: "block", overflow: "hidden" }}><span className="hero-word" style={{ display: "inline-block" }}>Hi,</span> <span className="hero-word" style={{ display: "inline-block" }}>I'm</span></span>
              <span style={{ display: "block", overflow: "hidden" }}>
                {heroTitle.split(" ").map((w, i) => (
                  <span key={i} className="hero-word grad-text" style={{ display: "inline-block", marginRight: "0.35ch" }}>{w}</span>
                ))}
              </span>
            </h1>
            <h2 className="hero-sub" style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.6rem)", fontWeight: 700, color: "rgba(var(--text-primary-rgb),.75)", marginBottom: "1.5rem" }}>
              Full-Stack Developer &amp; UI Engineer
            </h2>
            <p className="hero-copy" style={{ color: "var(--muted)", fontSize: "1.05rem", lineHeight: 1.75, maxWidth: 480, marginBottom: "2.25rem" }}>
              I craft performant, pixel-perfect web applications — from robust backend APIs to silky-smooth front-end interfaces. Let's build something exceptional together.
            </p>
            <div className="hero-anim-cta" style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
              <Link ref={primaryBtnRef} href="/projects" className="btn-primary">View Projects <HiArrowNarrowRight /></Link>
              <Link ref={outlineBtnRef} href="/contact" className="btn-outline">Hire Me</Link>
              {!loading && about?.resume && (
                <a href={about.resume} target="_blank" rel="noopener noreferrer" download className="btn-outline">
                  Download Resume <HiExternalLink />
                </a>
              )}
            </div>
            <div className="hero-anim-social" style={{ display: "flex", gap: ".75rem", alignItems: "center" }}>
              <a href="https://github.com/Bhaskar787" target="_blank" rel="noopener noreferrer" className="social-btn social-btn--gh" aria-label="GitHub"><FaGithub /></a>
              <a href="https://www.linkedin.com/in/bhaskar-budha-1a58b83b6" target="_blank" rel="noopener noreferrer" className="social-btn social-btn--li" aria-label="LinkedIn"><FaLinkedin /></a>
              <a href="mailto:budhabhaskar11@gmail.com" className="social-btn social-btn--gm" aria-label="Email"><SiGmail /></a>
              <a href="https://wa.me/9779825630086" target="_blank" rel="noopener noreferrer" className="social-btn social-btn--wa" aria-label="WhatsApp"><FaWhatsapp /></a>
            </div>
          </div>
          {/* right */}
          <div className="hero-img" style={{ order: 1, display: "flex", justifyContent: "center" }}>
            <div style={{ position: "relative", width: 300, height: 300 }}>
              <div className="profile-ring-outer">
                <div className="profile-dot profile-dot--top" />
                <div className="profile-dot profile-dot--right" style={{ background: "var(--accent2)" }} />
              </div>
              <div className="profile-ring-inner" />
              {loading ? (
                <div className="skeleton" style={{ width: "100%", height: "100%", borderRadius: "50%", position: "relative", zIndex: 1 }} />
              ) : (
                <img src={about?.image || "/assets/images/logo.jpg"} alt="Bhaskar Budha" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%", border: "4px solid rgba(var(--accent-rgb),.4)", boxShadow: "0 0 0 8px rgba(var(--accent-rgb),.08), 0 24px 60px rgba(0,0,0,.5)", position: "relative", zIndex: 1 }} />
              )}
              <div style={{ position: "absolute", bottom: -16, left: "50%", transform: "translateX(-50%)", background: "var(--card)", border: "1px solid rgba(34,197,94,.3)", borderRadius: 9999, padding: ".35rem 1rem", display: "flex", alignItems: "center", gap: ".4rem", fontSize: ".78rem", fontWeight: 700, color: "#4ade80", whiteSpace: "nowrap", boxShadow: "0 4px 18px rgba(0,0,0,.35)", zIndex: 2 }}>
                <span style={{ width: 8, height: 8, background: "#4ade80", borderRadius: "50%", boxShadow: "0 0 6px #4ade80" }} />
                Open to Opportunities
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ STATS ══ */}
      <section ref={statsRef} style={{ padding: "4rem 1.5rem", maxWidth: 1200, margin: "0 auto" }}>
        <div className="reveal-stagger" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "1.25rem", alignItems: "stretch" }}>
          {[
            { icon: <HiCode size={24} style={{ color: "var(--accent-tint)" }} />,        suffix: "+", target: 50, label: "Projects Built" },
            { icon: <HiBriefcase size={24} style={{ color: "var(--accent2)" }} />,   suffix: "+", target: 2,  label: "Years Experience" },
            { icon: <HiAcademicCap size={24} style={{ color: "#4ade80" }} />, suffix: "",  target: 10, label: "Tech Stacks" },
            { icon: <HiStar size={24} style={{ color: "#f43f5e" }} />,        suffix: "%", target: 99, label: "Client Satisfaction" },
          ].map(({ icon, suffix, target, label }) => (
            <div key={label} className="card stat-card-v2" style={{ padding: "1.75rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: ".75rem" }}>{icon}</div>
              <div className="stat-num" data-target={target} data-suffix={suffix} style={{ fontSize: "2.2rem", fontWeight: 900, color: "var(--text-primary)", lineHeight: 1 }}>0{suffix}</div>
              <div style={{ color: "var(--muted)", fontSize: ".82rem", marginTop: ".4rem", fontWeight: 600 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ EDUCATION & SKILLS ══ */}
      <section style={{ padding: "5rem 1.5rem", maxWidth: 1200, margin: "0 auto" }}>
        <div className="edu-skills-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "3rem" }}>
          {/* Education column */}
          <div>
            <div className="reveal-up" style={{ marginBottom: "2rem" }}>
              <span className="section-badge" style={{ display: "inline-flex" }}><HiAcademicCap /> Education</span>
            </div>
            {loading
              ? <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  {Array.from({ length: 2 }).map((_, i) => <Sk key={i} h="h-48" />)}
                </div>
              : education.length === 0
              ? <div className="card" style={{ padding: "2rem", textAlign: "center" }}>
                  <p style={{ color: "var(--muted)" }}>No education entries yet.</p>
                </div>
              : <div className="timeline">
                  {education.map((edu) => (
                    <div key={edu._id} className="timeline-item">
                      <div className="timeline-dot timeline-dot--edu" />
                      <div className="card" style={{ padding: "1.5rem 1.75rem" }}>
                        <div style={{ display: "inline-block", padding: ".25rem .75rem", background: "rgba(var(--accent2-rgb),.12)", border: "1px solid rgba(var(--accent2-rgb),.25)", borderRadius: 9999, fontSize: ".75rem", fontWeight: 700, color: "var(--accent2)", marginBottom: ".75rem" }}>{edu.duration}</div>
                        <h3 style={{ fontWeight: 800, fontSize: "1.15rem", color: "var(--text-primary)", marginBottom: ".3rem" }}>{edu.degree}</h3>
                        <p style={{ color: "var(--accent)", fontWeight: 700, fontSize: ".9rem", marginBottom: edu.description ? ".5rem" : 0 }}>{edu.institution}</p>
                        {edu.description && <p style={{ color: "var(--muted)", fontSize: ".88rem", lineHeight: 1.65 }}>{edu.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
            }
          </div>

          {/* Skills column — bar-style with shimmer */}
          <div>
            <div className="reveal-up" style={{ marginBottom: "2rem" }}>
              <span className="section-badge" style={{ display: "inline-flex" }}><HiCode /> Skills &amp; Proficiency</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "1rem" }}>
              {loading
                ? Array.from({ length: 6 }).map((_, i) => <Sk key={i} h="h-20" />)
                : skills.length === 0
                ? <div className="card" style={{ padding: "2rem", textAlign: "center", gridColumn: "1/-1" }}>
                    <p style={{ color: "var(--muted)" }}>No skills added yet.</p>
                  </div>
                : skills.slice(0, 12).map((sk) => (
                  <div key={sk._id} className="card reveal-up skill-card-v2" style={{ padding: "1.2rem 1.4rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: ".6rem" }}>
                      <span style={{ fontWeight: 700, fontSize: ".9rem", color: "var(--text-primary)" }}>{sk.name}</span>
                      {sk.level && <span style={{ fontSize: ".78rem", fontWeight: 700, color: "var(--accent)" }}>{sk.level}%</span>}
                    </div>
                    {sk.level && <div className="skill-bar-bg"><div className="skill-bar-fill" data-pct={sk.level} /></div>}
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </section>

      {/* ══ SERVICES STRIP ══ */}
      <section className="reveal-up" style={{ padding: "4rem 1.5rem", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <span className="section-badge" style={{ marginBottom: ".75rem", display: "inline-flex" }}>What I Do</span>
          <h2 style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 900, color: "var(--text-primary)" }}>Services I Offer</h2>
        </div>
        <div className="reveal-stagger" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: "1rem" }}>
          {SERVICES.map(({ icon, label }) => (
            <div key={label} className="card service-card-v2" style={{ padding: "1.4rem 1.2rem", display: "flex", flexDirection: "column", alignItems: "center", gap: ".6rem", textAlign: "center" }}>
              <div className="service-card-v2__icon">{icon}</div>
              <span style={{ fontWeight: 700, fontSize: ".88rem", color: "var(--fg)" }}>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══ FEATURED PROJECTS — Dribbble-style cards ══ */}
      <section ref={projRef} style={{ padding: "5rem 1.5rem", maxWidth: 1200, margin: "0 auto" }}>
        <div className="reveal-up" style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span className="section-badge" style={{ marginBottom: ".75rem", display: "inline-flex" }}>Portfolio</span>
          <h2 style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 900, color: "var(--text-primary)", marginBottom: ".75rem" }}>Featured Projects</h2>
          <p style={{ color: "var(--muted)", maxWidth: 480, margin: "0 auto", fontSize: ".97rem" }}>A selection of digital products I've engineered end-to-end.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: "1.75rem" }}>
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <Sk key={i} h="h-80" />)
            : projects.length === 0
            ? <div className="card" style={{ padding: "3rem", textAlign: "center", gridColumn: "1/-1" }}>
                <p style={{ color: "var(--muted)" }}>No projects added yet. Add them from the admin panel.</p>
              </div>
            : projects.slice(0, 6).map((proj, i) => (
                <ProjectCard key={proj._id} proj={proj} index={i} />
              ))
          }
        </div>
        <div className="reveal-up" style={{ textAlign: "center", marginTop: "2.5rem" }}>
          <Link href="/projects" className="btn-outline">View All Projects <HiArrowNarrowRight /></Link>
        </div>
      </section>

      {/* ══ EXPERIENCE — animated vertical timeline ══ */}
      <section ref={expRef} style={{ padding: "5rem 1.5rem", maxWidth: 1000, margin: "0 auto" }}>
        <div className="reveal-up" style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <span className="section-badge" style={{ marginBottom: ".75rem", display: "inline-flex" }}>Journey</span>
          <h2 style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 900, color: "var(--text-primary)" }}>Work Experience</h2>
        </div>

        {loading
          ? <div style={{ display: "grid", gap: "1.25rem" }}>{Array.from({ length: 3 }).map((_, i) => <Sk key={i} h="h-48" />)}</div>
          : experiences.length === 0
          ? <div className="card" style={{ padding: "3rem", textAlign: "center" }}>
              <p style={{ color: "var(--muted)" }}>No experience entries yet. Add them from the admin panel.</p>
            </div>
          : (
            <div className="exp-timeline">
              <div className="exp-timeline__track">
                <div ref={timelineLineRef} className="exp-timeline__line" />
              </div>
              {experiences.map((exp, i) => (
                <ExperienceCard key={exp._id} exp={exp} index={i} side={i % 2 === 0 ? "left" : "right"} />
              ))}
            </div>
          )
        }
      </section>

      {/* ══ CTA BANNER ══ */}
      <section ref={ctaRef} style={{ padding: "5rem 1.5rem" }}>
        <div className="reveal-up" style={{ maxWidth: 860, margin: "0 auto", background: "linear-gradient(135deg, rgba(var(--accent-rgb),.14) 0%, rgba(var(--accent2-rgb),.08) 100%)", border: "1px solid rgba(var(--accent-rgb),.22)", borderRadius: "1.75rem", padding: "clamp(2.5rem,5vw,4rem)", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -60, right: -60, width: 220, height: 220, background: "radial-gradient(circle, rgba(var(--accent-rgb),.18) 0%, transparent 70%)", borderRadius: "50%" }} />
          <div style={{ position: "absolute", bottom: -60, left: -60, width: 220, height: 220, background: "radial-gradient(circle, rgba(var(--accent2-rgb),.14) 0%, transparent 70%)", borderRadius: "50%" }} />
          <span className="section-badge" style={{ marginBottom: "1.25rem", display: "inline-flex" }}><BiSolidBadgeCheck style={{ color: "#4ade80" }} /> Available Now</span>
          <h2 style={{ fontSize: "clamp(1.8rem,4vw,3rem)", fontWeight: 900, color: "var(--text-primary)", marginBottom: "1rem" }}>
            Ready to Build Something<br /><span className="grad-text">Extraordinary?</span>
          </h2>
          <p style={{ color: "var(--muted)", maxWidth: 480, margin: "0 auto 2rem", fontSize: ".97rem" }}>
            Whether it's a startup MVP, a redesign, or a complex platform — I'm here for it.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/contact" className="btn-primary">Start a Project <HiArrowNarrowRight /></Link>
            <Link href="/about" className="btn-outline">Learn About Me</Link>
          </div>
          <div style={{ display: "flex", gap: "2rem", justifyContent: "center", marginTop: "2.5rem", flexWrap: "wrap" }}>
            {["Fast Delivery", "Clean Code", "24/7 Support", "Pixel Perfect"].map((t) => (
              <span key={t} style={{ display: "flex", alignItems: "center", gap: ".4rem", fontSize: ".82rem", color: "var(--muted)", fontWeight: 600 }}>
                <BiSolidBadgeCheck style={{ color: "#4ade80" }} /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @media (min-width: 900px) {
          .hero-grid-layout { grid-template-columns: 1fr 420px !important; }
          .hero-grid-layout > div:first-child { order: 1 !important; }
          .hero-grid-layout > div:last-child  { order: 2 !important; }
          .edu-skills-grid { grid-template-columns: 1fr 1fr !important; }
        }
        .timeline-item .card { margin-bottom: 0; }

        /* ── shared tilt-card polish ── */
        .stat-card-v2, .service-card-v2, .skill-card-v2 {
          transition: transform .35s ease, box-shadow .35s ease, border-color .35s ease;
        }
        .stat-card-v2:hover, .service-card-v2:hover, .skill-card-v2:hover {
          transform: translateY(-6px);
          box-shadow: 0 18px 40px rgba(0,0,0,.35);
          border-color: rgba(var(--accent-rgb),.4);
        }
        .service-card-v2__icon {
          font-size: 1.6rem; color: var(--accent);
          transition: transform .4s cubic-bezier(.34,1.56,.64,1);
        }
        .service-card-v2:hover .service-card-v2__icon { transform: scale(1.25) rotate(-6deg); }

        /* ── skill bar shimmer ── */
        .skill-bar-fill {
          position: relative; overflow: hidden;
        }
        .skill-bar-fill::after {
          content: ""; position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.35), transparent);
          transform: translateX(-100%);
          animation: shimmer 2.2s ease-in-out infinite;
          animation-delay: 1.5s;
        }
        @keyframes shimmer { to { transform: translateX(100%); } }

        /* ── Dribbble-style project card ── */
        .proj-card-v2 {
          position: relative;
          background: var(--card);
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 1.25rem;
          overflow: hidden;
          transition: box-shadow .4s ease, border-color .4s ease;
          will-change: transform;
        }
        .proj-card-v2:hover {
          border-color: rgba(var(--accent-rgb),.5);
          box-shadow: 0 30px 60px rgba(0,0,0,.45), 0 0 0 1px rgba(var(--accent-rgb),.15);
        }
        .proj-card-v2__index {
          position: absolute; top: 14px; left: 16px; z-index: 2;
          font-size: .7rem; font-weight: 800; letter-spacing: .08em;
          color: rgba(255,255,255,.85);
          background: rgba(10,10,20,.55); backdrop-filter: blur(6px);
          border: 1px solid rgba(255,255,255,.15);
          padding: .3rem .55rem; border-radius: 9999px;
        }
        .proj-card-v2__media { position: relative; height: 230px; overflow: hidden; }
        .proj-card-v2__media img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform .7s cubic-bezier(.16,1,.3,1);
        }
        .proj-card-v2:hover .proj-card-v2__media img { transform: scale(1.1) rotate(0.5deg); }
        .proj-card-v2__scrim {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(var(--bg-rgb),.95) 0%, rgba(var(--bg-rgb),.15) 55%, transparent 100%);
        }
        .proj-card-v2__ghbadge {
          position: absolute; top: 12px; right: 12px; z-index: 2;
          width: 38px; height: 38px; border-radius: .6rem;
          background: rgba(10,10,20,.65); backdrop-filter: blur(6px);
          border: 1px solid rgba(255,255,255,.14);
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-size: 1.1rem;
          transition: transform .35s cubic-bezier(.34,1.56,.64,1), background .3s ease;
        }
        .proj-card-v2__ghbadge:hover { transform: translateY(-3px) rotate(-6deg); background: rgba(var(--accent-rgb),.85); }
        .proj-card-v2__body { padding: 1.5rem 1.5rem 1.6rem; position: relative; z-index: 1; }
        .proj-card-v2__body h3 { font-weight: 800; font-size: 1.18rem; color: var(--text-primary); margin-bottom: .5rem; }
        .proj-card-v2__body p { color: var(--muted); font-size: .88rem; line-height: 1.6; margin-bottom: 1.1rem; }
        .proj-card-v2__tags { display: flex; flex-wrap: wrap; gap: .4rem; margin-bottom: 1.25rem; }
        .proj-card-v2__actions { display: flex; }
        .proj-card-v2__cta {
          display: inline-flex; align-items: center; gap: .6rem;
          font-weight: 700; font-size: .88rem; color: var(--text-primary);
          padding-bottom: 2px; border-bottom: 1px solid transparent;
          transition: border-color .3s ease, gap .3s ease;
        }
        .proj-card-v2__cta:hover { border-color: var(--accent); gap: .85rem; }
        .proj-card-v2__cta-circle {
          width: 30px; height: 30px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          background: rgba(var(--accent-rgb),.14); color: var(--accent);
          border: 1px solid rgba(var(--accent-rgb),.3);
          transition: background .3s ease, transform .3s cubic-bezier(.34,1.56,.64,1);
        }
        .proj-card-v2__cta:hover .proj-card-v2__cta-circle { background: var(--accent); color: #fff; transform: rotate(45deg); }

        /* ── Experience: vertical animated timeline (image-card, alternating) ──
           Mobile-first: line + dots sit on the left, cards stack in one column.
           From 700px: line moves to center, cards alternate left/right. */
        .exp-timeline { position: relative; display: flex; flex-direction: column; gap: 2.25rem; }
        .exp-timeline__track {
          position: absolute; left: 15px; top: 6px; bottom: 6px; width: 2px;
          background: rgba(255,255,255,.08);
        }
        .exp-timeline__line {
          width: 100%; height: 100%;
          background: linear-gradient(to bottom, var(--accent), var(--accent2));
          transform-origin: top center; transform: scaleY(0);
        }
        .exp-row {
          position: relative; display: grid;
          grid-template-columns: 32px 1fr;
          align-items: start; gap: 1rem;
        }
        .exp-row__dot-col { display: flex; justify-content: center; position: relative; margin-top: 12px; }
        .exp-row__dot {
          width: 14px; height: 14px; border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 0 4px var(--bg), 0 0 0 6px rgba(var(--accent-rgb),.3);
          position: relative; z-index: 2;
        }
        .exp-row__dot-pulse {
          position: absolute; inset: 0; margin: auto; width: 14px; height: 14px;
          border-radius: 50%; background: rgba(var(--accent-rgb),.55);
          animation: expPulse 2.4s ease-out infinite;
        }
        @keyframes expPulse {
          0%   { transform: scale(1);   opacity: .7; }
          80%  { transform: scale(2.6); opacity: 0; }
          100% { transform: scale(2.6); opacity: 0; }
        }

        .exp-card-v2 {
          background: var(--card); border: 1px solid rgba(255,255,255,.08);
          border-radius: 1.25rem; overflow: hidden;
          transition: border-color .35s ease, box-shadow .35s ease, transform .35s ease;
          will-change: transform;
        }
        .exp-card-v2:hover {
          border-color: rgba(var(--accent-rgb),.45);
          box-shadow: 0 24px 50px rgba(0,0,0,.42);
        }
        .exp-card-v2__media { position: relative; width: 100%; height: 170px; overflow: hidden; }
        .exp-card-v2__media img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform .6s cubic-bezier(.16,1,.3,1);
        }
        .exp-card-v2:hover .exp-card-v2__media img { transform: scale(1.08); }
        .exp-card-v2__index {
          position: absolute; top: 12px; left: 12px; z-index: 2;
          font-size: .68rem; font-weight: 800; letter-spacing: .06em;
          color: #fff; background: rgba(10,10,20,.55); backdrop-filter: blur(6px);
          border: 1px solid rgba(255,255,255,.15);
          padding: .3rem .55rem; border-radius: 9999px;
        }
        .exp-card-v2__duration {
          display: inline-block; padding: .25rem .75rem;
          background: rgba(var(--accent-rgb),.12); border: 1px solid rgba(var(--accent-rgb),.25);
          border-radius: 9999px; font-size: .75rem; font-weight: 700; color: var(--accent-tint);
          margin-bottom: .75rem;
        }
        .exp-card-v2__duration--onmedia {
          position: absolute; top: 12px; right: 12px; z-index: 2; margin-bottom: 0;
          background: rgba(10,10,20,.55); backdrop-filter: blur(6px);
          border-color: rgba(255,255,255,.18); color: #fff;
        }
        .exp-card-v2__body { padding: 1.4rem 1.5rem 1.6rem; }
        .exp-card-v2 h3 { font-weight: 800; font-size: 1.12rem; color: var(--text-primary); margin-bottom: .5rem; }
        .exp-card-v2 p { color: var(--muted); font-size: .88rem; line-height: 1.65; }
        .exp-card-v2__more {
          display: inline-flex; align-items: center; gap: .4rem; margin-top: .9rem;
          background: none; border: none; padding: 0; cursor: pointer;
          font-size: .82rem; font-weight: 700; color: var(--accent);
        }

        @media (min-width: 700px) {
          .exp-timeline__track { left: 50%; transform: translateX(-50%); }
          .exp-row {
            grid-template-columns: 1fr 48px 1fr !important;
            align-items: start; gap: 1.75rem;
          }
          .exp-row__dot-col { justify-content: center; grid-column: 2; margin-top: 12px; }
          .exp-row--left  .exp-card-v2 { grid-column: 1; }
          .exp-row--right .exp-card-v2 { grid-column: 3; }
        }

        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
        }
      `}</style>
    </div>
  );
}