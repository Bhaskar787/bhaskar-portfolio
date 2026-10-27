"use client";

import { useEffect } from "react";
import { getCached } from "@/utils/apiCache";

/**
 * Updates browser tab icon dynamically in the DOM with cache-busting and PNG data-URL conversion.
 */
export function setTabFavicon(url) {
  if (typeof document === "undefined" || !url) return;

  const applyFavicon = (href, type) => {
    // Safely mutate existing icon link hrefs without detaching nodes from DOM,
    // which prevents React "Cannot read properties of null (reading 'removeChild')" on navigation.
    const iconLinks = document.querySelectorAll("link[rel*='icon'], link[rel='shortcut icon'], link[rel='apple-touch-icon']");
    if (iconLinks.length > 0) {
      iconLinks.forEach((el) => {
        if (type) el.type = type;
        el.href = href;
      });
    } else {
      const link = document.createElement("link");
      link.rel = "icon";
      if (type) link.type = type;
      link.href = href;
      document.head.appendChild(link);
    }
  };

  // Detect mime type accurately from URL extension
  const clean = url.split("?")[0].toLowerCase();
  let mime = "";
  if (clean.endsWith(".png")) mime = "image/png";
  else if (clean.endsWith(".jpg") || clean.endsWith(".jpeg")) mime = "image/jpeg";
  else if (clean.endsWith(".svg")) mime = "image/svg+xml";
  else if (clean.endsWith(".webp")) mime = "image/webp";
  else if (clean.endsWith(".ico")) mime = "image/x-icon";

  const sep = url.includes("?") ? "&" : "?";
  const versionedUrl = `${url}${sep}v=${Date.now()}`;

  // Apply immediately with correct MIME type
  applyFavicon(versionedUrl, mime);

  // Convert to in-memory 32x32 PNG data URL to force Chrome/Safari to instantly repaint the tab icon
  try {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, 32, 32);
        ctx.drawImage(img, 0, 0, 32, 32);
        const dataUrl = canvas.toDataURL("image/png");
        applyFavicon(dataUrl, "image/png");
      } catch (e) {
        // CORS restriction fallback: versionedUrl is already applied
      }
    };
    img.src = versionedUrl;
  } catch (err) {}
}

export default function DynamicFavicon({ initialFavicon = "" }) {
  useEffect(() => {
    // 1. Initial check from cache or SSR prop
    const cached = getCached("/api/settings");
    const activeFavicon = cached?.favicon || cached?.logo || initialFavicon;
    if (activeFavicon) {
      setTabFavicon(activeFavicon);
    }

    // 2. Real-time event listener: updates tab immediately when settings are saved in Admin
    const handleSettingsUpdate = (e) => {
      const newSettings = e.detail;
      const newFavicon = newSettings?.favicon || newSettings?.logo;
      if (newFavicon) {
        setTabFavicon(newFavicon);
      }
    };

    window.addEventListener("site-settings-updated", handleSettingsUpdate);
    return () => {
      window.removeEventListener("site-settings-updated", handleSettingsUpdate);
    };
  }, [initialFavicon]);

  return null;
}
