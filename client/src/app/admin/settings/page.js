"use client";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { compressImage } from "@/lib/compressImage";
import { clearCache } from "@/utils/apiCache";
import { setTabFavicon } from "@/app/components/DynamicFavicon";
import {
  RiGlobalLine, RiSaveLine, RiImageLine, RiRefreshLine, RiUploadCloud2Line,
  RiCloseLine, RiWindowLine,
} from "react-icons/ri";

async function safeFetch(url, opts) {
  try {
    const res = await fetch(url, opts);
    const text = await res.text();
    try { return { ok: res.ok, data: JSON.parse(text) }; }
    catch { return { ok: false, data: { error: "Server error" } }; }
  } catch (e) { return { ok: false, data: { error: e.message } }; }
}

export default function AdminSettings() {
  const [form,             setForm]             = useState({ siteName: "", logo: "", favicon: "" });
  const [loading,          setLoading]          = useState(true);
  const [saving,           setSaving]           = useState(false);
  const [uploadingLogo,    setUploadingLogo]    = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const [hasData,          setHasData]          = useState(false);
  const [savedId,          setSavedId]          = useState(null);
  const logoInputRef = useRef(null);
  const faviconInputRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { ok, data } = await safeFetch("/api/settings");
      if (ok && data && !Array.isArray(data)) {
        setForm({
          siteName: data.siteName || "",
          logo: data.logo || "",
          favicon: data.favicon || "",
        });
        setHasData(true);
        setSavedId(data._id || null);
        if (data.favicon) {
          setTabFavicon(data.favicon);
        }
      }
      setLoading(false);
    })();
  }, []);

  const handleLogoChange = async (e) => {
    const rawFile = e.target.files?.[0];
    if (!rawFile) return;

    setUploadingLogo(true);
    const file = await compressImage(rawFile);
    const fd = new FormData();
    fd.append("file", file);

    const { ok, data } = await safeFetch("/api/upload", { method: "POST", body: fd });
    if (ok && data?.url) {
      setForm((p) => ({ ...p, logo: data.url }));
      toast.success("Logo uploaded!");
    } else {
      toast.error(data.error || "Failed to upload logo.");
    }
    setUploadingLogo(false);
  };

  const handleFaviconChange = async (e) => {
    const rawFile = e.target.files?.[0];
    if (!rawFile) return;

    setUploadingFavicon(true);
    const file = await compressImage(rawFile);
    const fd = new FormData();
    fd.append("file", file);

    const { ok, data } = await safeFetch("/api/upload", { method: "POST", body: fd });
    if (ok && data?.url) {
      setForm((p) => ({ ...p, favicon: data.url }));
      setTabFavicon(data.url); // Real-time instant browser tab update!
      toast.success("Favicon uploaded and updated in real-time!");
    } else {
      toast.error(data.error || "Failed to upload favicon.");
    }
    setUploadingFavicon(false);
    if (faviconInputRef.current) faviconInputRef.current.value = "";
  };

  const handleRemoveFavicon = () => {
    setForm((p) => ({ ...p, favicon: "" }));
    setTabFavicon("/favicon.ico");
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    const method = hasData ? "PUT" : "POST";
    const url    = hasData && savedId ? `/api/settings/${savedId}` : "/api/settings";
    const { ok, data } = await safeFetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (ok) {
      clearCache("/api/settings");
      if (form.favicon) {
        setTabFavicon(form.favicon);
      }
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("site-settings-updated", { detail: form }));
      }
      toast.success("Site settings & favicon updated in real-time!");
      setHasData(true);
      if (data?._id) setSavedId(data._id);
    } else {
      toast.error(data.error || "Failed to save.");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div style={{ maxWidth: 700, margin: "0 auto", display: "flex", flexDirection: "column", gap: "1rem" }}>
        {Array.from({ length: 2 }).map((_, i) => <div key={i} className="skeleton" style={{ height: i === 0 ? 92 : 52, borderRadius: "0.875rem" }} />)}
      </div>
    );
  }

  const activeFaviconUrl = form.favicon || form.logo || "/favicon.ico";

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.75rem" }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(20,184,166,0.12)", border: "1px solid rgba(20,184,166,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#14b8a6", fontSize: "1.2rem" }}>
          <RiGlobalLine />
        </div>
        <div>
          <h1 style={{ fontWeight: 900, fontSize: "1.3rem", color: "var(--text-primary)", letterSpacing: "-0.03em", lineHeight: 1.1 }}>Site Settings</h1>
          <p style={{ color: "var(--muted)", fontSize: "0.8rem" }}>Controls your site title, navbar logo, and dynamic browser tab favicon</p>
        </div>
      </div>

      {/* Live Preview Card */}
      <div className="card" style={{ padding: "1.25rem", borderRadius: "1.25rem", marginBottom: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ display: "flex", gap: "0.875rem", alignItems: "center" }}>
          {form.logo ? (
            <img src={form.logo} alt="Logo preview" style={{ width: 44, height: 44, borderRadius: 10, objectFit: "cover" }} />
          ) : (
            <div style={{ width: 44, height: 44, background: "linear-gradient(135deg, var(--accent), var(--accent2))", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "0.8rem", color: "var(--on-accent)" }}>
              {(form.siteName || "Bhaskar Budha").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <div style={{ fontWeight: 800, fontSize: "1rem", color: "var(--text-primary)" }}>{form.siteName || "Bhaskar Budha"}</div>
            <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>Live navbar &amp; footer branding</div>
          </div>
        </div>

        {/* Browser Tab Mockup */}
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "0.875rem" }}>
          <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <RiWindowLine /> Real-time Browser Tab Preview:
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.45rem 1rem", background: "rgba(var(--text-primary-rgb), 0.05)", borderRadius: "8px", border: "1px solid var(--border)", fontSize: "0.82rem", color: "var(--text-primary)" }}>
            <img
              src={activeFaviconUrl}
              alt="Favicon"
              style={{ width: 18, height: 18, borderRadius: 3, objectFit: "contain", flexShrink: 0 }}
            />
            <span style={{ fontWeight: 600, maxWidth: 240, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {form.siteName || "Bhaskar Budha"} | Portfolio
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card" style={{ padding: "2rem", borderRadius: "1.25rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

          {/* Favicon Uploader */}
          <div>
            <label className="form-label">Browser Favicon (Real-time Tab Icon)</label>
            <input
              ref={faviconInputRef}
              type="file"
              accept="image/x-icon,image/png,image/svg+xml,image/jpeg,image/webp,.ico,.png,.svg"
              onChange={handleFaviconChange}
              style={{ display: "none" }}
            />
            <div
              onClick={() => !uploadingFavicon && faviconInputRef.current?.click()}
              style={{
                display: "flex", alignItems: "center", gap: "0.75rem",
                border: "1.5px dashed rgba(var(--accent-rgb),0.35)", borderRadius: "0.875rem",
                padding: "1rem 1.25rem", cursor: uploadingFavicon ? "not-allowed" : "pointer",
                opacity: uploadingFavicon ? 0.6 : 1, background: "rgba(var(--accent-rgb),0.04)",
              }}
            >
              {form.favicon ? (
                <img src={form.favicon} alt="Favicon" style={{ width: 36, height: 36, borderRadius: 6, objectFit: "contain" }} />
              ) : (
                <span style={{ fontSize: "1.3rem", color: "var(--muted)", display: "flex" }}><RiWindowLine /></span>
              )}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  {uploadingFavicon ? <><RiRefreshLine style={{ animation: "spin 1s linear infinite" }} /> Uploading…</> : <><RiUploadCloud2Line /> {form.favicon ? "Change Favicon" : "Upload Favicon"}</>}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
                  {form.favicon ? "Updates browser tab icon instantly across the site" : "Upload a .png, .ico, or .svg icon for your browser tab"}
                </div>
              </div>
              {form.favicon && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleRemoveFavicon(); }}
                  title="Remove favicon"
                  style={{ width: 30, height: 30, borderRadius: "50%", border: "1px solid rgba(244,63,94,0.3)", background: "rgba(244,63,94,0.1)", color: "#f43f5e", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                >
                  <RiCloseLine />
                </button>
              )}
            </div>
            <div style={{ marginTop: "0.5rem" }}>
              <input
                type="text"
                value={form.favicon}
                onChange={(e) => {
                  const url = e.target.value;
                  setForm(p => ({ ...p, favicon: url }));
                  if (url) setTabFavicon(url);
                }}
                placeholder="Or paste direct Favicon URL (e.g. https://.../favicon.png)"
                style={{ fontSize: "0.82rem" }}
              />
            </div>
          </div>

          {/* Site Logo */}
          <div>
            <label className="form-label">Site Logo (Navbar &amp; Footer)</label>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              style={{ display: "none" }}
            />
            <div
              onClick={() => !uploadingLogo && logoInputRef.current?.click()}
              style={{
                display: "flex", alignItems: "center", gap: "0.75rem",
                border: "1.5px dashed rgba(var(--accent-rgb),0.35)", borderRadius: "0.875rem",
                padding: "1rem 1.25rem", cursor: uploadingLogo ? "not-allowed" : "pointer",
                opacity: uploadingLogo ? 0.6 : 1, background: "rgba(var(--accent-rgb),0.04)",
              }}
            >
              {form.logo ? (
                <img src={form.logo} alt="Logo" style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover" }} />
              ) : (
                <span style={{ fontSize: "1.2rem", color: "var(--muted)", display: "flex" }}><RiImageLine /></span>
              )}
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  {uploadingLogo ? <><RiRefreshLine style={{ animation: "spin 1s linear infinite" }} /> Uploading…</> : <><RiUploadCloud2Line /> {form.logo ? "Change logo" : "Upload logo"}</>}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
                  {form.logo ? "Shown in navbar + footer instead of initials" : "If left empty, the initials badge is shown"}
                </div>
              </div>
            </div>
          </div>

          {/* Site Title */}
          <div>
            <label className="form-label">Site Title *</label>
            <input
              type="text"
              required
              value={form.siteName}
              onChange={(e) => setForm(p => ({ ...p, siteName: e.target.value }))}
              placeholder="e.g. Bhaskar Budha"
            />
            <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.35rem" }}>
              Shown next to the logo in the navbar and footer, and in your browser tab title.
            </p>
          </div>

          <button
            type="submit"
            disabled={saving || uploadingLogo || uploadingFavicon}
            className="btn-primary"
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "center", padding: "0.875rem", fontSize: "1rem", borderRadius: "0.875rem", opacity: (saving || uploadingLogo || uploadingFavicon) ? 0.65 : 1, cursor: (saving || uploadingLogo || uploadingFavicon) ? "not-allowed" : "pointer" }}
          >
            {saving ? <><RiRefreshLine style={{ animation: "spin 1s linear infinite" }} /> Saving…</> : <><RiSaveLine /> Save Site Settings</>}
          </button>
        </div>
      </form>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
