"use client";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { compressImage } from "@/lib/compressImage";
import {
  RiUser3Line, RiSaveLine, RiImageLine, RiRefreshLine, RiUploadCloud2Line, RiFilePdf2Line, RiCloseLine,
} from "react-icons/ri";
import { HiCheckCircle } from "react-icons/hi";

async function safeFetch(url, opts) {
  try {
    const res = await fetch(url, opts);
    const text = await res.text();
    try { return { ok: res.ok, data: JSON.parse(text) }; }
    catch { return { ok: false, data: { error: "Server error" } }; }
  } catch (e) { return { ok: false, data: { error: e.message } }; }
}

export default function AdminAbout() {
  const [form,      setForm]      = useState({ bio: "", image: "", resume: "" });
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [hasData,   setHasData]   = useState(false);
  const [savedId,   setSavedId]   = useState(null);
  const fileInputRef = useRef(null);
  const resumeInputRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { ok, data } = await safeFetch("/api/about");
      if (ok && data && !Array.isArray(data)) {
        setForm({ bio: data.bio || "", image: data.image || "", resume: data.resume || "" });
        setHasData(true);
        setSavedId(data._id || null);
      } else if (ok && Array.isArray(data) && data.length > 0) {
        const d = data[0];
        setForm({ bio: d.bio || "", image: d.image || "", resume: d.resume || "" });
        setHasData(true);
        setSavedId(d._id || null);
      }
      setLoading(false);
    })();
  }, []);

  const handleFileChange = async (e) => {
    const rawFile = e.target.files?.[0];
    if (!rawFile) return;

    setUploading(true);
    const file = await compressImage(rawFile);
    const fd = new FormData();
    fd.append("file", file);

    const { ok, data } = await safeFetch("/api/upload", { method: "POST", body: fd });
    if (ok && data?.url) {
      setForm((p) => ({ ...p, image: data.url }));
      toast.success("Image uploaded!");
    } else {
      toast.error(data.error || "Failed to upload image.");
    }
    setUploading(false);
  };

  const handleResumeChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file.");
      if (resumeInputRef.current) resumeInputRef.current.value = "";
      return;
    }

    setUploadingResume(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("resourceType", "raw");

    const { ok, data } = await safeFetch("/api/upload", { method: "POST", body: fd });
    if (ok && data?.url) {
      // Saving immediately so the homepage always reflects the most recent PDF
      setForm((p) => ({ ...p, resume: data.url }));
      toast.success("Resume uploaded! Click Save to publish it.");
    } else {
      toast.error(data.error || "Failed to upload resume.");
    }
    setUploadingResume(false);
    if (resumeInputRef.current) resumeInputRef.current.value = "";
  };

  const handleRemoveResume = () => setForm((p) => ({ ...p, resume: "" }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    const method = hasData ? "PUT" : "POST";
    const url    = hasData && savedId ? `/api/about/${savedId}` : "/api/about";
    const { ok, data } = await safeFetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (ok) {
      toast.success("About section updated!");
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
        {Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton" style={{ height: i === 1 ? 140 : 52, borderRadius: "0.875rem" }} />)}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.75rem" }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(20,184,166,0.12)", border: "1px solid rgba(20,184,166,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#14b8a6", fontSize: "1.2rem" }}>
          <RiUser3Line />
        </div>
        <div>
          <h1 style={{ fontWeight: 900, fontSize: "1.3rem", color: "var(--text-primary)", letterSpacing: "-0.03em", lineHeight: 1.1 }}>About Section</h1>
          <p style={{ color: "var(--muted)", fontSize: "0.8rem" }}>Edit your profile image and biography</p>
        </div>
      </div>

      {/* Preview */}
      {form.image && (
        <div className="card" style={{ padding: "1.25rem", borderRadius: "1.25rem", marginBottom: "1.5rem", display: "flex", gap: "1rem", alignItems: "center" }}>
          <img src={form.image} alt="Profile" style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", border: "3px solid rgba(var(--accent-rgb),0.3)" }} />
          <div style={{ fontSize: "0.825rem", color: "var(--muted)" }}>Current profile image</div>
          <div style={{ marginLeft: "auto" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: "0.25rem 0.75rem", background: "rgba(20,184,166,0.1)", border: "1px solid rgba(20,184,166,0.2)", borderRadius: 9999, fontSize: "0.78rem", fontWeight: 700, color: "#14b8a6" }}>
              <HiCheckCircle /> Preview
            </span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="card" style={{ padding: "2rem", borderRadius: "1.25rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

          <div>
            <label className="form-label">Profile Image</label>
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
              {form.image ? (
                <img src={form.image} alt="Profile" style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover" }} />
              ) : (
                <span style={{ fontSize: "1.2rem", color: "var(--muted)", display: "flex" }}><RiImageLine /></span>
              )}
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  {uploading ? <><RiRefreshLine style={{ animation: "spin 1s linear infinite" }} /> Uploading…</> : <><RiUploadCloud2Line /> {form.image ? "Change image" : "Upload image"}</>}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>Click to choose a file from your device</div>
              </div>
            </div>
          </div>

          <div>
            <label className="form-label">Resume / CV (PDF)</label>
            <input
              ref={resumeInputRef}
              type="file"
              accept="application/pdf,.pdf"
              onChange={handleResumeChange}
              style={{ display: "none" }}
            />
            <div
              onClick={() => !uploadingResume && resumeInputRef.current?.click()}
              style={{
                display: "flex", alignItems: "center", gap: "0.75rem",
                border: "1.5px dashed rgba(var(--accent-rgb),0.35)", borderRadius: "0.875rem",
                padding: "1rem 1.25rem", cursor: uploadingResume ? "not-allowed" : "pointer",
                opacity: uploadingResume ? 0.6 : 1, background: "rgba(var(--accent-rgb),0.04)",
              }}
            >
              <span style={{ fontSize: "1.3rem", color: form.resume ? "#f43f5e" : "var(--muted)", display: "flex" }}>
                <RiFilePdf2Line />
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  {uploadingResume ? <><RiRefreshLine style={{ animation: "spin 1s linear infinite" }} /> Uploading…</> : <><RiUploadCloud2Line /> {form.resume ? "Replace PDF" : "Upload PDF"}</>}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
                  {form.resume ? "This is what visitors will download on the homepage" : "Only the most recently uploaded PDF is shown to visitors"}
                </div>
              </div>
              {form.resume && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleRemoveResume(); }}
                  title="Remove resume"
                  style={{ width: 30, height: 30, borderRadius: "50%", border: "1px solid rgba(244,63,94,0.3)", background: "rgba(244,63,94,0.1)", color: "#f43f5e", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                >
                  <RiCloseLine />
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="form-label">Bio *</label>
            <textarea
              required
              rows={6}
              value={form.bio}
              onChange={(e) => setForm(p => ({ ...p, bio: e.target.value }))}
              placeholder="Write a compelling bio about yourself — your passion, expertise, and what makes you unique as a developer..."
              style={{ resize: "vertical", minHeight: 150 }}
            />
            <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.35rem" }}>
              {form.bio.length} characters · Aim for 100–250 words for best results
            </p>
          </div>

          <button
            type="submit"
            disabled={saving || uploading}
            className="btn-primary"
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "center", padding: "0.875rem", fontSize: "1rem", borderRadius: "0.875rem", opacity: (saving || uploading) ? 0.65 : 1, cursor: (saving || uploading) ? "not-allowed" : "pointer" }}
          >
            {saving ? <><RiRefreshLine style={{ animation: "spin 1s linear infinite" }} /> Saving…</> : <><RiSaveLine /> Save About Section</>}
          </button>
        </div>
      </form>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}