"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  HiMail,
  HiPhone,
  HiArrowNarrowRight,
  HiLocationMarker,
  HiExternalLink,
} from "react-icons/hi";
import { FaGithub, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import { BiSolidBadgeCheck } from "react-icons/bi";
import { RiSparklingFill } from "react-icons/ri";
import { MdSend } from "react-icons/md";

gsap.registerPlugin(ScrollTrigger);

const contactItems = [
  {
    Icon: HiMail,
    label: "Email",
    value: "budhabhaskar11@gmail.com",
    href: "mailto:budhabhaskar11@gmail.com",
    color: "#EA4335",
    bg: "rgba(234,67,53,0.1)",
    border: "rgba(234,67,53,0.2)",
  },
  {
    Icon: HiPhone,
    label: "Phone",
    value: "+977 9825630086",
    href: "tel:+9779825630086",
    color: "var(--accent2)",
    bg: "rgba(var(--accent2-rgb),0.1)",
    border: "rgba(var(--accent2-rgb),0.2)",
  },
  {
    Icon: FaLinkedin,
    label: "LinkedIn",
    value: "bhaskar-budha",
    href: "https://www.linkedin.com/in/bhaskar-budha-1a58b83b6",
    color: "#0a66c2",
    bg: "rgba(10,102,194,0.1)",
    border: "rgba(10,102,194,0.2)",
  },
  {
    Icon: FaGithub,
    label: "GitHub",
    value: "Bhaskar787",
    href: "https://github.com/Bhaskar787",
    color: "var(--text-primary)",
    bg: "rgba(var(--text-primary-rgb),0.07)",
    border: "rgba(var(--text-primary-rgb),0.12)",
  },
];

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const pageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".contact-hero > *", {
        y: 30, opacity: 0, duration: 0.75, stagger: 0.13, ease: "power3.out", delay: 0.1,
      });
      gsap.from(".contact-info", {
        x: -36, opacity: 0, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: ".contact-layout", start: "top 88%", once: true },
      });
      gsap.from(".contact-form", {
        x: 36, opacity: 0, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: ".contact-layout", start: "top 88%", once: true },
      });
      gsap.utils.toArray(".contact-item").forEach((el, i) => {
        gsap.from(el, {
          y: 20, opacity: 0, duration: 0.6, delay: i * 0.08, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast.success("Message sent! I'll be in touch soon.");
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to send message.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main ref={pageRef} style={{ background: "var(--bg)", minHeight: "100vh", overflowX: "hidden" }}>
      <div className="container" style={{ paddingTop: "clamp(4rem, 8vw, 6rem)", paddingBottom: "clamp(4rem, 8vw, 7rem)" }}>

        {/* ── Hero ── */}
        <div className="contact-hero" style={{ marginBottom: "clamp(3.5rem, 7vw, 5rem)", maxWidth: 680 }}>
          <div style={{ marginBottom: "0.875rem" }}>
            <span className="section-badge">
              <RiSparklingFill style={{ color: "var(--accent-tint)" }} />
              Let's Connect
            </span>
          </div>
          <h1 className="text-display" style={{ marginBottom: "1.25rem" }}>
            Get in <span className="grad-text">Touch</span>
          </h1>
          <p className="text-body" style={{ maxWidth: 520 }}>
            Have a project in mind or just want to say hello? I'd love to hear from you.
            Fill out the form or reach out directly — I respond within 24 hours.
          </p>
        </div>

        {/* ── Main Layout ── */}
        <div
          className="contact-layout"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "2.5rem",
            alignItems: "start",
          }}
        >
          {/* ── Left: Info ── */}
          <div className="contact-info" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

            {/* Contact cards */}
            <div>
              <p
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  marginBottom: "1rem",
                }}
              >
                Direct Contact
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {contactItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="contact-item card"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      padding: "1rem 1.25rem",
                      textDecoration: "none",
                      transition: "border-color 0.2s, transform 0.2s",
                      borderRadius: "1rem",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = item.border.replace("0.2", "0.6");
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--border)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: "12px",
                        background: item.bg,
                        border: `1px solid ${item.border}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: item.color,
                        fontSize: "1.2rem",
                        flexShrink: 0,
                      }}
                    >
                      <item.Icon />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: "var(--muted)",
                          marginBottom: "0.2rem",
                        }}
                      >
                        {item.label}
                      </div>
                      <div
                        style={{
                          fontSize: "0.9375rem",
                          color: "var(--text-primary)",
                          fontWeight: 600,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.value}
                      </div>
                    </div>
                    <HiExternalLink style={{ color: "var(--muted)", flexShrink: 0 }} />
                  </a>
                ))}
              </div>
            </div>

            {/* Availability badge */}
            <div
              style={{
                padding: "1.25rem 1.5rem",
                background: "rgba(34,197,94,0.06)",
                border: "1px solid rgba(34,197,94,0.2)",
                borderRadius: "1rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.6rem" }}>
                <span
                  style={{
                    width: 9,
                    height: 9,
                    background: "#22c55e",
                    borderRadius: "50%",
                    animation: "pulse-dot 2s ease-in-out infinite",
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "#22c55e" }}>
                  Available for Work
                </span>
              </div>
              <p style={{ fontSize: "0.875rem", color: "var(--muted)", lineHeight: 1.6 }}>
                Currently accepting freelance projects and full-time opportunities.
                Response time: <strong style={{ color: "var(--text-secondary)" }}>within 24 hours</strong>.
              </p>
            </div>

            {/* Location */}
            <div
              className="card"
              style={{ padding: "1.25rem 1.5rem", borderRadius: "1rem" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.6rem" }}>
                <HiLocationMarker style={{ color: "var(--accent)", fontSize: "1.1rem" }} />
                <span style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.9375rem" }}>
                  Location
                </span>
              </div>
              <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
                Kathmandu, Nepal — Open to remote worldwide
              </p>
            </div>
          </div>

          {/* ── Right: Form ── */}
          <div className="contact-form card" style={{ padding: "clamp(1.5rem, 4vw, 2.5rem)", borderRadius: "1.25rem" }}>
            <div style={{ marginBottom: "1.75rem" }}>
              <h2 className="text-subheading" style={{ marginBottom: "0.4rem" }}>Send a Message</h2>
              <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
                I'll get back to you as soon as possible.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {/* two-col for name + email on larger screens */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: "1.25rem",
                }}
              >
                <div>
                  <label htmlFor="name" className="form-label">Full Name *</label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ram Chaudhary"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="form-label">Email Address *</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="ram@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="form-label">Phone Number</label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+977 9827635522"
                />
              </div>

              <div>
                <label htmlFor="message" className="form-label">Your Message *</label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project, timeline, and budget..."
                  style={{ resize: "vertical", minHeight: "130px" }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  padding: "0.9rem",
                  fontSize: "1rem",
                  opacity: loading ? 0.65 : 1,
                  cursor: loading ? "not-allowed" : "pointer",
                  borderRadius: "0.875rem",
                }}
              >
                {loading ? (
                  "Sending…"
                ) : (
                  <>
                    Send Message <MdSend style={{ fontSize: "1.05rem" }} />
                  </>
                )}
              </button>

              <p style={{ textAlign: "center", color: "var(--muted)", fontSize: "0.8rem" }}>
                <BiSolidBadgeCheck style={{ color: "#4ade80", verticalAlign: "middle", marginRight: 4 }} />
                Your information is kept private and never shared.
              </p>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .contact-layout {
            grid-template-columns: 1fr 1.15fr !important;
          }
        }
        @keyframes pulse-dot {
          0%,100% { opacity: 1; box-shadow: 0 0 0 0 rgba(34,197,94,0.4); }
          50%      { opacity: 0.7; box-shadow: 0 0 0 6px rgba(34,197,94,0); }
        }
      `}</style>
    </main>
  );
}
