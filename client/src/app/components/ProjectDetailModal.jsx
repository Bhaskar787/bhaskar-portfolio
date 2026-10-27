"use client";

import { useEffect, useRef } from "react";
import { FaGithub } from "react-icons/fa";
import { HiExternalLink, HiX } from "react-icons/hi";
import { RiSparklingFill, RiCodeBoxLine } from "react-icons/ri";

export default function ProjectDetailModal({ project, onClose }) {
  const modalRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    if (!project) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [project, onClose]);

  // Lock body scroll when modal is active
  useEffect(() => {
    if (!project) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [project]);

  if (!project) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        animation: "projModalFadeIn 0.25s ease-out forwards",
      }}
      onClick={onClose}
    >
      <div
        ref={modalRef}
        style={{
          width: "100%",
          maxWidth: 640,
          maxHeight: "90vh",
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: "1.5rem",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow:
            "0 25px 60px -15px rgba(0, 0, 0, 0.6), 0 0 40px rgba(var(--accent-rgb), 0.15)",
          animation:
            "projModalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner Media */}
        {project.image && (
          <div
            style={{
              position: "relative",
              width: "100%",
              height: 230,
              background: "var(--surface-2)",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            <img
              src={project.image}
              alt={project.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            {/* Scrim */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, var(--card) 0%, rgba(var(--bg-rgb), 0.35) 60%, transparent 100%)",
              }}
            />
            {/* Close Button on image top-right */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              style={{
                position: "absolute",
                top: 14,
                right: 14,
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "rgba(0, 0, 0, 0.65)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: "1.15rem",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--accent)";
                e.currentTarget.style.transform = "scale(1.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(0, 0, 0, 0.65)";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <HiX />
            </button>
          </div>
        )}

        {/* Modal Header & Content (Scrollable) */}
        <div
          style={{
            padding: "1.5rem 1.75rem",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "1.1rem",
            flex: 1,
          }}
        >
          {/* Header if no image */}
          {!project.image && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <span
                className="section-badge"
                style={{ display: "inline-flex" }}
              >
                <RiSparklingFill style={{ color: "var(--accent-tint)" }} />{" "}
                Project Details
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--muted)",
                  fontSize: "1.4rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "4px",
                }}
              >
                <HiX />
              </button>
            </div>
          )}

          {/* Title */}
          <div>
            <h2
              id="project-modal-title"
              style={{
                fontSize: "1.45rem",
                fontWeight: 800,
                color: "var(--text-primary)",
                letterSpacing: "-0.02em",
                lineHeight: 1.25,
              }}
            >
              {project.title}
            </h2>
          </div>

          {/* Tech stack badges */}
          {project.skills && project.skills.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
              {project.skills.map((skill, index) => (
                <span
                  key={index}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.3rem",
                    padding: "0.25rem 0.65rem",
                    background: "rgba(var(--accent-rgb), 0.08)",
                    border: "1px solid rgba(var(--accent-rgb), 0.22)",
                    borderRadius: "8px",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    color: "var(--accent-tint)",
                  }}
                >
                  <RiCodeBoxLine size={13} />
                  {skill}
                </span>
              ))}
            </div>
          )}

          {/* Detailed Full Description Container */}
          <div
            style={{
              background: "rgba(var(--bg-rgb), 0.45)",
              border: "1px solid var(--border)",
              borderRadius: "1rem",
              padding: "1.25rem",
              maxHeight: "min(320px, 42vh)",
              overflowY: "auto",
            }}
          >
            <h4
              style={{
                fontSize: "0.76rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--muted)",
                marginBottom: "0.6rem",
              }}
            >
              Project Overview
            </h4>
            <div
              style={{
                color: "var(--text-primary)",
                fontSize: "0.92rem",
                lineHeight: 1.7,
                whiteSpace: "pre-line",
                opacity: 0.95,
              }}
            >
              {project.description}
            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div
          style={{
            padding: "1rem 1.75rem",
            background: "var(--surface)",
            borderTop: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "0.75rem",
            flexShrink: 0,
            flexWrap: "wrap",
          }}
        >
          {project.githubLink && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
              style={{
                fontSize: "0.875rem",
                padding: "0.55rem 1.25rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.45rem",
              }}
            >
              <FaGithub /> Source Code
            </a>
          )}
          {project.liveLink && (
            <a
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{
                fontSize: "0.875rem",
                padding: "0.55rem 1.35rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.45rem",
              }}
            >
              <HiExternalLink /> Live Demo
            </a>
          )}
          <button
            type="button"
            onClick={onClose}
            className="btn-outline"
            style={{
              fontSize: "0.875rem",
              padding: "0.55rem 1.15rem",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>

      <style>{`
        @keyframes projModalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes projModalSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
