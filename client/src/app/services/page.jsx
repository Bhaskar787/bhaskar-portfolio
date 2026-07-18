"use client";
import Link from "next/link";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  HiCode,
  HiLightningBolt,
  HiStar,
  HiBriefcase,
  HiAcademicCap,
  HiArrowNarrowRight,
  HiCheckCircle,
  HiClock,
  HiShieldCheck,
  HiChat,
} from "react-icons/hi";
import {
  MdDesignServices,
  MdApi,
  MdStorage,
  MdSpeed,
  MdSecurity,
  MdCloudUpload,
} from "react-icons/md";
import { BiSolidBadgeCheck } from "react-icons/bi";
import { RiSparklingFill, RiCodeBoxLine } from "react-icons/ri";
import { FaReact, FaNodeJs, FaDocker, FaAws } from "react-icons/fa";
import {
  SiNextdotjs,
  SiMongodb,
  SiPostgresql,
  SiTypescript,
  SiTailwindcss,
  SiGraphql,
  SiPrisma,
  SiRedis,
} from "react-icons/si";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    Icon: HiCode,
    title: "Full-Stack Development",
    color: "var(--accent)",
    bg: "rgba(var(--accent-rgb),0.1)",
    border: "rgba(var(--accent-rgb),0.2)",
    desc: "End-to-end web application development using modern frameworks like React, Next.js, and Node.js. From concept to deployment with clean, maintainable code.",
    features: ["React & Next.js frontends", "Node.js / Express backends", "RESTful & GraphQL APIs", "Authentication & security", "Third-party integrations", "CI/CD pipelines"],
  },
  {
    Icon: MdDesignServices,
    title: "UI / UX Design",
    color: "#f43f5e",
    bg: "rgba(244,63,94,0.1)",
    border: "rgba(244,63,94,0.2)",
    desc: "Crafting intuitive, pixel-perfect interfaces that users love. From wireframes to polished designs with seamless micro-interactions and responsive layouts.",
    features: ["Responsive design systems", "Interactive prototypes", "GSAP animations", "Figma design files", "Accessibility compliance", "Mobile-first approach"],
  },
  {
    Icon: MdApi,
    title: "API Architecture",
    color: "var(--accent2)",
    bg: "rgba(var(--accent2-rgb),0.1)",
    border: "rgba(var(--accent2-rgb),0.2)",
    desc: "Designing scalable, secure, and well-documented APIs. From simple REST endpoints to complex GraphQL schemas optimised for performance.",
    features: ["REST & GraphQL APIs", "OpenAPI documentation", "Rate limiting & caching", "JWT / OAuth auth", "Webhook integration", "API versioning"],
  },
  {
    Icon: MdStorage,
    title: "Database Design",
    color: "#22c55e",
    bg: "rgba(34,197,94,0.1)",
    border: "rgba(34,197,94,0.2)",
    desc: "Architecting efficient database schemas for both SQL and NoSQL databases. Optimised queries, indexing strategies, and data migration planning.",
    features: ["MongoDB & PostgreSQL", "Schema design", "Query optimisation", "Data migrations", "Prisma / Drizzle ORM", "Redis caching"],
  },
  {
    Icon: HiLightningBolt,
    title: "Performance Optimisation",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.2)",
    desc: "Identifying and eliminating bottlenecks for blazing-fast load times. Core Web Vitals improvement, code splitting, image optimisation, and server-side rendering.",
    features: ["Core Web Vitals audit", "Code splitting & lazy loading", "Image & asset optimisation", "Server-side rendering", "CDN configuration", "Lighthouse score 90+"],
  },
  {
    Icon: HiShieldCheck,
    title: "Code Review & Consulting",
    color: "var(--accent-tint)",
    bg: "rgba(167,139,250,0.1)",
    border: "rgba(167,139,250,0.2)",
    desc: "Expert code reviews, architecture consulting, and technical guidance. Helping teams improve code quality, maintainability, and scalability.",
    features: ["Architecture review", "Security audit", "Code quality analysis", "Tech stack advising", "Best practice guidance", "Team mentoring"],
  },
];

const tech = [
  { Icon: FaReact, name: "React", color: "#61DAFB" },
  { Icon: SiNextdotjs, name: "Next.js", color: "var(--text-primary)" },
  { Icon: FaNodeJs, name: "Node.js", color: "#68A063" },
  { Icon: SiTypescript, name: "TypeScript", color: "#3178C6" },
  { Icon: SiMongodb, name: "MongoDB", color: "#4DB33D" },
  { Icon: SiPostgresql, name: "PostgreSQL", color: "#336791" },
  { Icon: SiTailwindcss, name: "Tailwind", color: "#06B6D4" },
  { Icon: SiGraphql, name: "GraphQL", color: "#E10098" },
  { Icon: SiPrisma, name: "Prisma", color: "#5a67d8" },
  { Icon: SiRedis, name: "Redis", color: "#DC382D" },
  { Icon: FaDocker, name: "Docker", color: "#2496ED" },
  { Icon: FaAws, name: "AWS", color: "#FF9900" },
];

const process = [
  { step: "01", title: "Discovery", desc: "We start with a detailed conversation to understand your goals, target audience, and technical requirements.", Icon: HiChat },
  { step: "02", title: "Planning", desc: "I create a detailed project roadmap, tech stack recommendation, and timeline so you know exactly what to expect.", Icon: RiCodeBoxLine },
  { step: "03", title: "Development", desc: "Iterative development with regular updates and demos. You'll see progress at every stage.", Icon: HiCode },
  { step: "04", title: "Delivery", desc: "Thorough testing, performance optimisation, and a smooth handoff with documentation and support.", Icon: BiSolidBadgeCheck },
];

export default function Services() {
  const pageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".svc-hero > *", {
        y: 30, opacity: 0, duration: 0.75, stagger: 0.13, ease: "power3.out", delay: 0.1,
      });
      gsap.utils.toArray(".svc-card").forEach((card, i) => {
        gsap.from(card, {
          y: 44, opacity: 0, duration: 0.7, delay: i * 0.1, ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 90%", once: true },
        });
      });
      gsap.utils.toArray(".tech-chip").forEach((chip, i) => {
        gsap.from(chip, {
          scale: 0.85, opacity: 0, duration: 0.5, delay: i * 0.05, ease: "back.out(1.4)",
          scrollTrigger: { trigger: chip, start: "top 92%", once: true },
        });
      });
      gsap.utils.toArray(".process-step").forEach((el, i) => {
        gsap.from(el, {
          x: i % 2 === 0 ? -30 : 30, opacity: 0, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <main ref={pageRef} style={{ background: "var(--bg)", minHeight: "100vh", overflowX: "hidden" }}>
      <div className="container" style={{ paddingTop: "clamp(4rem, 8vw, 6rem)", paddingBottom: "clamp(4rem, 8vw, 7rem)" }}>

        {/* ── Hero ── */}
        <div className="svc-hero" style={{ marginBottom: "clamp(3.5rem, 7vw, 5.5rem)", maxWidth: 700 }}>
          <div style={{ marginBottom: "0.875rem" }}>
            <span className="section-badge">
              <RiSparklingFill style={{ color: "var(--accent-tint)" }} />
              What I Offer
            </span>
          </div>
          <h1 className="text-display" style={{ marginBottom: "1.25rem" }}>
            Services I <span className="grad-text">Offer</span>
          </h1>
          <p className="text-body" style={{ maxWidth: 520 }}>
            From concept to launch, I deliver high-quality digital solutions. Each engagement
            is tailored to your specific needs — whether that's a startup MVP, a redesign,
            or a complex platform.
          </p>

          {/* trust pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "2rem" }}>
            {[
              { Icon: HiClock, text: "Fast Turnaround" },
              { Icon: HiShieldCheck, text: "Clean & Secure Code" },
              { Icon: HiCheckCircle, text: "Post-Launch Support" },
              { Icon: HiStar, text: "5-Star Rated" },
            ].map(({ Icon, text }) => (
              <div
                key={text}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.4rem 0.9rem",
                  background: "rgba(var(--accent-rgb),0.08)",
                  border: "1px solid rgba(var(--accent-rgb),0.15)",
                  borderRadius: 9999,
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: "var(--accent-tint)",
                }}
              >
                <Icon style={{ fontSize: "0.9rem" }} />
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* ── Services Grid ── */}
        <section style={{ marginBottom: "clamp(4rem, 8vw, 6rem)" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {services.map(({ Icon, title, color, bg, border, desc, features }) => (
              <div
                key={title}
                className="svc-card card"
                style={{
                  padding: "2rem",
                  borderRadius: "1.25rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.25rem",
                  transition: "border-color .3s, box-shadow .3s, transform .35s",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = border.replace("0.2", "0.55");
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow = `0 12px 40px ${bg.replace("0.1", "0.25")}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* icon */}
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "14px",
                    background: bg,
                    border: `1px solid ${border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color,
                    fontSize: "1.6rem",
                  }}
                >
                  <Icon />
                </div>

                <div>
                  <h3
                    style={{
                      fontWeight: 800,
                      fontSize: "1.15rem",
                      color: "var(--text-primary)",
                      marginBottom: "0.6rem",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {title}
                  </h3>
                  <p style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.65 }}>
                    {desc}
                  </p>
                </div>

                {/* feature list */}
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {features.map((f) => (
                    <li
                      key={f}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        fontSize: "0.875rem",
                        color: "var(--text-secondary)",
                      }}
                    >
                      <HiCheckCircle style={{ color, fontSize: "1rem", flexShrink: 0 }} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ── Tech Stack ── */}
        <section style={{ marginBottom: "clamp(4rem, 8vw, 6rem)" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span className="section-badge" style={{ marginBottom: "0.875rem", display: "inline-flex" }}>
              <HiAcademicCap />
              Tech Stack
            </span>
            <h2
              style={{
                fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
                fontWeight: 900,
                color: "var(--text-primary)",
                letterSpacing: "-0.03em",
              }}
            >
              Tools &amp; Technologies
            </h2>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center" }}>
            {tech.map(({ Icon, name, color }) => (
              <div
                key={name}
                className="tech-chip card"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  padding: "0.75rem 1.25rem",
                  borderRadius: "0.875rem",
                  cursor: "default",
                  transition: "border-color .25s, transform .25s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${color}55`;
                  e.currentTarget.style.transform = "translateY(-3px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <Icon style={{ color, fontSize: "1.25rem", flexShrink: 0 }} />
                <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-primary)" }}>{name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Process ── */}
        <section style={{ marginBottom: "clamp(4rem, 8vw, 6rem)" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span className="section-badge" style={{ marginBottom: "0.875rem", display: "inline-flex" }}>
              <HiBriefcase />
              My Process
            </span>
            <h2
              style={{
                fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
                fontWeight: 900,
                color: "var(--text-primary)",
                letterSpacing: "-0.03em",
              }}
            >
              How We Work Together
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {process.map(({ step, title, desc, Icon }, i) => (
              <div
                key={step}
                className="process-step card"
                style={{
                  padding: "1.75rem",
                  borderRadius: "1.25rem",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Step number watermark */}
                <div
                  style={{
                    position: "absolute",
                    top: -12,
                    right: 16,
                    fontSize: "5rem",
                    fontWeight: 900,
                    color: "rgba(var(--accent-rgb),0.06)",
                    lineHeight: 1,
                    userSelect: "none",
                    letterSpacing: "-0.05em",
                  }}
                >
                  {step}
                </div>

                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "12px",
                    background: "rgba(var(--accent-rgb),0.1)",
                    border: "1px solid rgba(var(--accent-rgb),0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--accent)",
                    fontSize: "1.35rem",
                    marginBottom: "1rem",
                  }}
                >
                  <Icon />
                </div>
                <div
                  style={{
                    display: "inline-flex",
                    padding: "0.2rem 0.6rem",
                    background: "rgba(var(--accent-rgb),0.1)",
                    border: "1px solid rgba(var(--accent-rgb),0.2)",
                    borderRadius: 9999,
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: "var(--accent-tint)",
                    marginBottom: "0.75rem",
                    letterSpacing: "0.06em",
                  }}
                >
                  Step {step}
                </div>
                <h3 style={{ fontWeight: 800, fontSize: "1.05rem", color: "var(--text-primary)", marginBottom: "0.5rem" }}>
                  {title}
                </h3>
                <p style={{ color: "var(--muted)", fontSize: "0.875rem", lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section>
          <div
            className="card"
            style={{
              background: "linear-gradient(135deg, rgba(var(--accent-rgb),0.13) 0%, rgba(var(--accent2-rgb),0.08) 100%)",
              border: "1px solid rgba(var(--accent-rgb),0.22)",
              borderRadius: "1.75rem",
              padding: "clamp(2.5rem, 5vw, 4rem)",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -70,
                right: -70,
                width: 240,
                height: 240,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(var(--accent-rgb),0.18) 0%, transparent 70%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: -60,
                left: -60,
                width: 220,
                height: 220,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(var(--accent2-rgb),0.14) 0%, transparent 70%)",
              }}
            />

            <span className="section-badge" style={{ marginBottom: "1.25rem", display: "inline-flex" }}>
              <BiSolidBadgeCheck style={{ color: "#4ade80" }} />
              Available Now
            </span>
            <h2
              style={{
                fontSize: "clamp(1.8rem, 4vw, 3rem)",
                fontWeight: 900,
                color: "var(--text-primary)",
                marginBottom: "1rem",
                letterSpacing: "-0.03em",
              }}
            >
              Ready to Start Your{" "}
              <span className="grad-text">Project?</span>
            </h2>
            <p style={{ color: "var(--muted)", maxWidth: 480, margin: "0 auto 2rem", fontSize: "0.97rem", lineHeight: 1.7 }}>
              Let's discuss your requirements and craft a solution that perfectly fits your needs.
              Free consultation — no commitment required.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/contact" className="btn-primary">
                Get a Free Quote <HiArrowNarrowRight />
              </Link>
              <Link href="/projects" className="btn-outline">
                See My Work
              </Link>
            </div>

            <div style={{ display: "flex", gap: "2rem", justifyContent: "center", marginTop: "2.5rem", flexWrap: "wrap" }}>
              {["Fast Delivery", "Clean Code", "24/7 Support", "Pixel Perfect"].map((t) => (
                <span
                  key={t}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    fontSize: "0.82rem",
                    color: "var(--muted)",
                    fontWeight: 600,
                  }}
                >
                  <BiSolidBadgeCheck style={{ color: "#4ade80" }} /> {t}
                </span>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
