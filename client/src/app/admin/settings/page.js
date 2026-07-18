"use client";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import {
  RiGlobalLine, RiSaveLine, RiImageLine, RiRefreshLine, RiUploadCloud2Line,
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
  const [form,      setForm]      = useState({ siteName: "", logo: "" });
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [uploading, setUploading] = useState(false);
  const [hasData,   setHasData]   = useState(false);
  const [savedId,   setSavedId]   = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { ok, data } = await safeFetch("/api/settings");
      if (ok && data && !Array.isArray(data)) {
        setForm({ siteName: data.siteName || "", logo: data.logo || "" });
        setHasData(true);
        setSavedId(data._id || null);
      }
      setLoading(false);
    })();
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);

    const { ok, data } = await safeFetch("/api/upload", { method: "POST", body: fd });
    if (ok && data?.url) {
      setForm((p) => ({ ...p, logo: data.url }));
      toast.success("Logo uploaded!");
    } else {
      toast.error(data.error || "Failed to upload logo.");
    }
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    const method = hasData ? "PUT" : "POST";
    const url    = hasData && savedId ? `/api/settings/${savedId}` : "/api/settings";
    const { ok, data } = await safeFetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (ok) {
      toast.success("Site settings updated! Refresh the site to see the change.");
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

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.75rem" }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(20,184,166,0.12)", border: "1px solid rgba(20,184,166,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#14b8a6", fontSize: "1.2rem" }}>
          <RiGlobalLine />
        </div>
        <div>
          <h1 style={{ fontWeight: 900, fontSize: "1.3rem", color: "var(--text-primary)", letterSpacing: "-0.03em", lineHeight: 1.1 }}>Site Settings</h1>
          <p style={{ color: "var(--muted)", fontSize: "0.8rem" }}>Controls the logo and title shown in the navbar and footer</p>
        </div>
      </div>

      {/* Preview */}
      <div className="card" style={{ padding: "1.25rem", borderRadius: "1.25rem", marginBottom: "1.5rem", display: "flex", gap: "0.875rem", alignItems: "center" }}>
        {form.logo ? (
          <img src={form.logo} alt="Logo preview" style={{ width: 44, height: 44, borderRadius: 10, objectFit: "cover" }} />
        ) : (
          <div style={{ width: 44, height: 44, background: "linear-gradient(135deg, var(--accent), var(--accent2))", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "0.8rem", color: "var(--on-accent)" }}>
            {(form.siteName || "Bhaskar Budha").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
          </div>
        )}
        <div>
          <div style={{ fontWeight: 800, fontSize: "1rem", color: "var(--text-primary)" }}>{form.siteName || "Bhaskar Budha"}</div>
          <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>Live preview — navbar &amp; footer</div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card" style={{ padding: "2rem", borderRadius: "1.25rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

          <div>
            <label className="form-label">Site Logo</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <div
              onClick={() => !uploading && fileInputRef.current?.click()}
              style={{
                display: "flex", alignItems: "center", gap: "0.75rem",
                border: "1.5px dashed rgba(var(--accent-rgb),0.35)", borderRadius: "0.875rem",
                padding: "1rem 1.25rem", cursor: uploading ? "not-allowed" : "pointer",
                opacity: uploading ? 0.6 : 1, background: "rgba(var(--accent-rgb),0.04)",
              }}
            >
              {form.logo ? (
                <img src={form.logo} alt="Logo" style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover" }} />
              ) : (
                <span style={{ fontSize: "1.2rem", color: "var(--muted)", display: "flex" }}><RiImageLine /></span>
              )}
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  {uploading ? <><RiRefreshLine style={{ animation: "spin 1s linear infinite" }} /> Uploading…</> : <><RiUploadCloud2Line /> {form.logo ? "Change logo" : "Upload logo"}</>}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
                  {form.logo ? "Shown in navbar + footer instead of initials" : "If left empty, the initials badge is shown"}
                </div>
              </div>
            </div>
          </div>

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
              Shown next to the logo in the navbar and footer, and used for the initials badge if no logo is uploaded.
            </p>
          </div>

          <button
            type="submit"
            disabled={saving || uploading}
            className="btn-primary"
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "center", padding: "0.875rem", fontSize: "1rem", borderRadius: "0.875rem", opacity: (saving || uploading) ? 0.65 : 1, cursor: (saving || uploading) ? "not-allowed" : "pointer" }}
          >
            {saving ? <><RiRefreshLine style={{ animation: "spin 1s linear infinite" }} /> Saving…</> : <><RiSaveLine /> Save Site Settings</>}
          </button>
        </div>
      </form>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
