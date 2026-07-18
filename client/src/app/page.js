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
      gsap.from(".hero-anim", { y: 48, opacity: 0, duration: .9, stagger: .12, ease: "power3.out" });
      gsap.from(".hero-img",  { scale: .85, opacity: 0, duration: 1.1, delay: .3, ease: "back.out(1.4)" });

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

      gsap.utils.toArray(".reveal-up").forEach((el) => {
        gsap.from(el, { scrollTrigger: { trigger: el, start: "top 85%", once: true }, y: 50, opacity: 0, duration: .85, ease: "power3.out" });
      });
      gsap.utils.toArray(".reveal-stagger").forEach((wrap) => {
        gsap.from(wrap.children, { scrollTrigger: { trigger: wrap, start: "top 82%", once: true }, y: 40, opacity: 0, duration: .75, stagger: .1, ease: "power3.out" });
      });

      document.querySelectorAll(".skill-bar-fill[data-pct]").forEach((bar) => {
        const pct = bar.dataset.pct;
        ScrollTrigger.create({
          trigger: bar, start: "top 88%", once: true,
          onEnter: () => gsap.to(bar, { width: pct + "%", duration: 1.3, ease: "power2.out" }),
        });
      });

      gsap.utils.toArray(".timeline-item").forEach((item, i) => {
        gsap.from(item, {
          scrollTrigger: { trigger: item, start: "top 85%", once: true },
          x: i % 2 === 0 ? -30 : 30, opacity: 0, duration: .75, ease: "power3.out",
        });
      });

      document.querySelectorAll(".proj-card").forEach((card) => {
        card.addEventListener("mouseenter", () => gsap.to(card, { y: -8, duration: .35, ease: "power2.out" }));
        card.addEventListener("mouseleave", () => gsap.to(card, { y: 0,  duration: .35, ease: "power2.out" }));
      });
      document.querySelectorAll(".exp-card").forEach((card) => {
        card.addEventListener("mouseenter", () => gsap.to(card, { y: -6, duration: .3, ease: "power2.out" }));
        card.addEventListener("mouseleave", () => gsap.to(card, { y: 0,  duration: .3, ease: "power2.out" }));
      });
    });
    return () => ctx.revert();
  }, [loading]);

  const Sk = ({ h = "h-40", extra = "" }) => (
    <div className="skeleton" style={{ height: h === "h-40" ? 160 : h === "h-80" ? 320 : h === "h-48" ? 192 : h === "h-20" ? 80 : 160, borderRadius: "var(--radius)" }} />
  );

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
            <div className="hero-anim" style={{ marginBottom: "1.25rem" }}>
              <span className="section-badge"><RiSparklingFill style={{ color: "var(--accent-tint)" }} /> Available for Work</span>
            </div>
            <h1 className="hero-anim" style={{ fontSize: "clamp(2.4rem, 6vw, 5rem)", fontWeight: 900, lineHeight: 1.08, marginBottom: "1.25rem", color: "var(--text-primary)" }}>
              Hi, I'm <span className="grad-text">Bhaskar Budha</span>
            </h1>
            <h2 className="hero-anim" style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.6rem)", fontWeight: 700, color: "rgba(var(--text-primary-rgb),.75)", marginBottom: "1.5rem" }}>
              Full-Stack Developer &amp; UI Engineer
            </h2>
            <p className="hero-anim" style={{ color: "var(--muted)", fontSize: "1.05rem", lineHeight: 1.75, maxWidth: 480, marginBottom: "2.25rem" }}>
              I craft performant, pixel-perfect web applications — from robust backend APIs to silky-smooth front-end interfaces. Let's build something exceptional together.
            </p>
            <div className="hero-anim" style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
              <Link href="/projects" className="btn-primary">View Projects <HiArrowNarrowRight /></Link>
              <Link href="/contact" className="btn-outline">Hire Me</Link>
              {!loading && about?.resume && (
                <a href={about.resume} target="_blank" rel="noopener noreferrer" download className="btn-outline">
                  Download PDF <HiExternalLink />
                </a>
              )}
            </div>
            <div className="hero-anim" style={{ display: "flex", gap: ".75rem", alignItems: "center" }}>
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
            <div key={label} className="card" style={{ padding: "1.75rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
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

          {/* Skills column */}
          <div>
            <div className="reveal-up" style={{ marginBottom: "2rem" }}>
              <span className="section-badge" style={{ display: "inline-flex" }}><HiCode /> Skills &amp; Expertise</span>
            </div>
            <div className="reveal-stagger" style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "1rem" }}>
              {loading
                ? Array.from({ length: 6 }).map((_, i) => <Sk key={i} h="h-20" />)
                : skills.length === 0
                ? <div className="card" style={{ padding: "2rem", textAlign: "center", gridColumn: "1/-1" }}>
                    <p style={{ color: "var(--muted)" }}>No skills added yet.</p>
                  </div>
                : skills.slice(0, 12).map((sk) => (
                  <div key={sk._id} className="card" style={{ padding: "1.3rem 1.2rem", position: "relative" }}>
                    {sk.level != null && (
                      <span style={{ position: "absolute", top: 10, right: 10, background: "linear-gradient(135deg, var(--accent), var(--accent3))", color: "#fff", borderRadius: 9999, padding: ".2rem .65rem", fontSize: ".72rem", fontWeight: 800 }}>
                        {sk.level}%
                      </span>
                    )}
                    <span style={{ fontWeight: 700, fontSize: ".95rem", color: "var(--text-primary)" }}>{sk.name}</span>
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
            <div key={label} className="card" style={{ padding: "1.4rem 1.2rem", display: "flex", flexDirection: "column", alignItems: "center", gap: ".6rem", textAlign: "center", cursor: "default" }}>
              <div style={{ fontSize: "1.6rem", color: "var(--accent)" }}>{icon}</div>
              <span style={{ fontWeight: 700, fontSize: ".88rem", color: "var(--fg)" }}>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══ FEATURED PROJECTS ══ */}
      <section ref={projRef} style={{ padding: "5rem 1.5rem", maxWidth: 1200, margin: "0 auto" }}>
        <div className="reveal-up" style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span className="section-badge" style={{ marginBottom: ".75rem", display: "inline-flex" }}>Portfolio</span>
          <h2 style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 900, color: "var(--text-primary)", marginBottom: ".75rem" }}>Featured Projects</h2>
          <p style={{ color: "var(--muted)", maxWidth: 480, margin: "0 auto", fontSize: ".97rem" }}>A selection of digital products I've engineered end-to-end.</p>
        </div>
        <div className="reveal-stagger" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: "1.5rem" }}>
          {loading
            ? Array.from({ length: 2 }).map((_, i) => <Sk key={i} h="h-80" />)
            : projects.length === 0
            ? <div className="card" style={{ padding: "3rem", textAlign: "center", gridColumn: "1/-1" }}>
                <p style={{ color: "var(--muted)" }}>No projects added yet. Add them from the admin panel.</p>
              </div>
            : projects.slice(0, 4).map((proj) => (
              <article key={proj._id} className="card proj-card" style={{ overflow: "hidden", cursor: "default" }}>
                <div style={{ position: "relative", height: 220, overflow: "hidden" }}>
                  <img src={proj.image} alt={proj.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .6s ease" }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.07)"}
                    onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                  />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(var(--bg-rgb),.9) 0%, transparent 60%)" }} />
                  {proj.githubLink && (
                    <a href={proj.githubLink} target="_blank" rel="noopener noreferrer" style={{ position: "absolute", top: 12, right: 12, width: 36, height: 36, background: "rgba(10,10,20,.7)", backdropFilter: "blur(6px)", borderRadius: ".5rem", border: "1px solid rgba(255,255,255,.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "1.1rem" }}>
                      <FaGithub />
                    </a>
                  )}
                </div>
                <div style={{ padding: "1.4rem" }}>
                  <h3 style={{ fontWeight: 800, fontSize: "1.15rem", color: "var(--text-primary)", marginBottom: ".5rem" }} className="line-clamp-2">{proj.title}</h3>
                  <p style={{ color: "var(--muted)", fontSize: ".88rem", lineHeight: 1.6, marginBottom: "1.1rem" }} className="line-clamp-3">{proj.description}</p>
                  {proj.skills?.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: ".375rem", marginBottom: "1.1rem" }}>
                      {proj.skills.map((tag) => (
                        <span key={tag} className="tag">{tag}</span>
                      ))}
                    </div>
                  )}
                  <div style={{ display: "flex", gap: ".75rem" }}>
                    {proj.githubLink && <a href={proj.githubLink} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ padding: ".5rem 1rem", fontSize: ".82rem" }}><FaGithub /> Code</a>}
                    {proj.liveLink   && <a href={proj.liveLink}   target="_blank" rel="noopener noreferrer" className="btn-primary"  style={{ padding: ".5rem 1rem", fontSize: ".82rem" }}><HiExternalLink /> Live</a>}
                  </div>
                </div>
              </article>
            ))
          }
        </div>
        <div className="reveal-up" style={{ textAlign: "center", marginTop: "2.5rem" }}>
          <Link href="/projects" className="btn-outline">View All Projects <HiArrowNarrowRight /></Link>
        </div>
      </section>

      {/* ══ EXPERIENCE ══ */}
      <section ref={expRef} style={{ padding: "5rem 1.5rem", maxWidth: 1200, margin: "0 auto" }}>
        <div className="reveal-up" style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span className="section-badge" style={{ marginBottom: ".75rem", display: "inline-flex" }}>Journey</span>
          <h2 style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 900, color: "var(--text-primary)" }}>Work Experience</h2>
        </div>
        <div className="reveal-stagger" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "1.25rem", alignItems: "stretch" }}>
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <Sk key={i} h="h-48" />)
            : experiences.length === 0
            ? <div className="card" style={{ padding: "3rem", textAlign: "center", gridColumn: "1/-1" }}>
                <p style={{ color: "var(--muted)" }}>No experience entries yet. Add them from the admin panel.</p>
              </div>
            : experiences.map((exp) => (
              <article key={exp._id} className="card exp-card" style={{ padding: "1.6rem", cursor: "default", display: "flex", flexDirection: "column", height: "100%" }}>
                {exp.image && (
                  <div style={{ width: "100%", height: 140, borderRadius: ".75rem", overflow: "hidden", marginBottom: "1rem" }}>
                    <img src={exp.image} alt={exp.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                )}
                <div style={{ display: "inline-block", alignSelf: "flex-start", padding: ".25rem .75rem", background: "rgba(var(--accent-rgb),.12)", border: "1px solid rgba(var(--accent-rgb),.25)", borderRadius: 9999, fontSize: ".75rem", fontWeight: 700, color: "var(--accent-tint)", marginBottom: ".75rem" }}>{exp.duration}</div>
                <h3 style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--text-primary)", marginBottom: ".5rem" }}>{exp.title}</h3>
                <p style={{ color: "var(--muted)", fontSize: ".88rem", lineHeight: 1.65, flex: 1 }} className="line-clamp-3">{exp.description}</p>
              </article>
            ))
          }
        </div>
      </section>

      {/* ══ SKILLS ══ */}
      <section ref={skillsRef} style={{ padding: "5rem 1.5rem", maxWidth: 1200, margin: "0 auto" }}>
        <div className="reveal-up" style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span className="section-badge" style={{ marginBottom: ".75rem", display: "inline-flex" }}>Expertise</span>
          <h2 style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 900, color: "var(--text-primary)" }}>Skills &amp; Proficiency</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "1rem" }}>
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <Sk key={i} h="h-20" />)
            : skills.length === 0
            ? <div className="card" style={{ padding: "2rem", textAlign: "center", gridColumn: "1/-1" }}>
                <p style={{ color: "var(--muted)" }}>No skills added yet.</p>
              </div>
            : skills.slice(0, 12).map((sk) => (
              <div key={sk._id} className="card reveal-up" style={{ padding: "1.2rem 1.4rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: ".6rem" }}>
                  <span style={{ fontWeight: 700, fontSize: ".9rem", color: "var(--text-primary)" }}>{sk.name}</span>
                  {sk.level && <span style={{ fontSize: ".78rem", fontWeight: 700, color: "var(--accent)" }}>{sk.level}%</span>}
                </div>
                {sk.level && <div className="skill-bar-bg"><div className="skill-bar-fill" data-pct={sk.level} /></div>}
              </div>
            ))
          }
        </div>
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
      `}</style>
    </div>
  );
}