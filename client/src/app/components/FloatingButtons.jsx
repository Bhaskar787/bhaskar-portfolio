"use client";
import { useState, useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { HiArrowUp } from "react-icons/hi2";

export default function FloatingButtons() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <>
      {/* ── WhatsApp FAB ── bottom-left ── */}
      <a
        href="https://wa.me/9779825630086"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="wa-fab"
      >
        <FaWhatsapp size={28} />
        <span className="wa-ring" />
        <span className="wa-ring wa-ring-2" />
      </a>

      {/* ── Scroll-to-top FAB ── bottom-right ── */}
      <button
        onClick={scrollTop}
        aria-label="Back to top"
        className={`scroll-fab${showTop ? " scroll-fab--visible" : ""}`}
      >
        <HiArrowUp size={22} />
      </button>
    </>
  );
}
