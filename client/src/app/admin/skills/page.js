"use client";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { compressImage } from "@/lib/compressImage";
import {
  RiAddLine, RiDeleteBinLine, RiEditLine, RiCloseLine,
  RiSaveLine, RiCodeBoxLine, RiUploadCloud2Line, RiImageLine,
} from "react-icons/ri";
import ConfirmDialog from "@/app/components/ConfirmDialog";
import SkillLogo from "@/app/components/SkillLogo";

const EMPTY = { name: "", image: "" };

async function safeFetch(url, opts) {
  try {
    const res = await fetch(url, opts);
    const text = await res.text();
    try { return { ok: res.ok, data: JSON.parse(text) }; }
    catch { return { ok: false, data: { error: "Server error" } }; }
  } catch (e) { return { ok: false, data: { error: e.message } }; }
}

export default function AdminSkills() {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [uploading, setUploading] = useState(false);
  const [modal,   setModal]   = useState(false);
  const [form,    setForm]    = useState(EMPTY);
  const [editId,  setEditId]  = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef(null);

  const fetchItems = async () => {
    setLoading(true);
    const { ok, data } = await safeFetch("/api/skills");
    if (ok && Array.isArray(data)) setItems(data);
    setLoading(false);
  };
  useEffect(() => { fetchItems(); }, []);

  const openAdd  = () => { setForm(EMPTY); setEditId(null); setModal(true); };
  const openEdit = (item) => {
    setForm({
      name: item.name || "",
      image: item.image || "",
    });
    setEditId(item._id);
    setModal(true);
  };
  const closeModal = () => { setModal(false); setForm(EMPTY); setEditId(null); };

  const handleFileChange = async (e) => {
    const rawFile = e.target.files?.[0];
    if (!rawFile) return;
    setUploading(true);
    let file = rawFile;
    try {
      file = await compressImage(rawFile);
    } catch {
      file = rawFile;
    }
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok && data?.url) {
        setForm((p) => ({ ...p, image: data.url }));
        toast.success("Logo uploaded!");
      } else {
        toast.error(data?.error || "Failed to upload image.");
      }
    } catch (err) {
      toast.error("Upload error: " + (err.message || "Network error"));
    } finally {
      setUploading(false);
      if (e.target) e.target.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Skill name is required.");
      return;
    }
    setSaving(true);
    const method = editId ? "PUT" : "POST";
    const url    = editId ? `/api/skills/${editId}` : "/api/skills";
    const payload = {
      name: form.name.trim(),
      image: form.image ? form.image.trim() : "",
    };
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(editId ? "Skill updated!" : "Skill added!");
        closeModal();
        await fetchItems();
      } else {
        toast.error(data?.error || "Failed to save skill.");
      }
    } catch (err) {
      toast.error("Save error: " + (err.message || "Network error"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id) => setDeleteTarget(id);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const { ok, data } = await safeFetch(`/api/skills/${deleteTarget}`, { method: "DELETE" });
    if (ok) { toast.success("Skill deleted."); fetchItems(); }
    else    { toast.error(data.error || "Failed."); }
    setDeleting(false);
    setDeleteTarget(null);
  };

  return (
    <div style={{ maxWidth: 960, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.75rem", flexWrap: "wrap", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(236,72,153,0.12)", border: "1px solid rgba(236,72,153,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#ec4899", fontSize: "1.2rem" }}>
            <RiCodeBoxLine />
          </div>
          <div>
            <h1 style={{ fontWeight: 900, fontSize: "1.3rem", color: "var(--text-primary)", letterSpacing: "-0.03em", lineHeight: 1.1 }}>Skills & Technologies</h1>
            <p style={{ color: "var(--muted)", fontSize: "0.8rem" }}>{items.length} skills in your stack</p>
          </div>
        </div>
        <button onClick={openAdd} className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 1.25rem", fontSize: "0.9rem", borderRadius: "0.75rem" }}>
          <RiAddLine /> Add Skill
        </button>
      </div>

      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.85rem" }}>
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton" style={{ height: 90, borderRadius: "1rem" }} />)}
        </div>
      ) : items.length === 0 ? (
        <div className="card" style={{ padding: "4rem 2rem", textAlign: "center", borderRadius: "1.25rem" }}>
          <RiCodeBoxLine style={{ fontSize: "2.5rem", color: "var(--muted)", marginBottom: "1rem" }} />
          <p style={{ color: "var(--muted)" }}>No skills added yet.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: "0.85rem" }}>
          {items.map((item) => (
            <div
              key={item._id}
              className="card"
              style={{
                padding: "1rem 1.15rem",
                borderRadius: "1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "0.75rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0, flex: 1 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "0.6rem",
                    background: "var(--surface-2)",
                    border: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    padding: 5,
                    overflow: "hidden",
                  }}
                >
                  <SkillLogo image={item.image} name={item.name} size={28} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {item.name}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", flexShrink: 0 }}>
                <button
                  type="button"
                  onClick={() => openEdit(item)}
                  title="Edit skill"
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "6px",
                    background: "rgba(var(--accent-rgb),0.1)",
                    border: "1px solid rgba(var(--accent-rgb),0.2)",
                    color: "var(--accent)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.85rem",
                  }}
                >
                  <RiEditLine />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item._id)}
                  title="Delete skill"
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "6px",
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.2)",
                    color: "#f87171",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.85rem",
                  }}
                >
                  <RiDeleteBinLine />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", backdropFilter: "blur(4px)" }} onClick={closeModal}>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "1.25rem", padding: "2rem", width: "100%", maxWidth: 440, maxHeight: "90vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h2 style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--text-primary)" }}>{editId ? "Edit Skill" : "Add Skill"}</h2>
              <button onClick={closeModal} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: "1.25rem", display: "flex" }}><RiCloseLine /></button>
            </div>
            <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
              <div>
                <label className="form-label">Skill Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. React.js, TypeScript, Docker"
                />
              </div>

              {/* Logo / Image Section */}
              <div>
                <label className="form-label">Skill Logo / Icon</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />

                <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", marginBottom: "0.6rem" }}>
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: "0.75rem",
                      background: "var(--surface-2)",
                      border: "1px dashed var(--border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      padding: 6,
                    }}
                  >
                    <SkillLogo image={form.image} name={form.name} size={36} />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", flex: 1 }}>
                    <button
                      type="button"
                      disabled={uploading}
                      onClick={() => fileInputRef.current?.click()}
                      className="btn-secondary"
                      style={{
                        padding: "0.5rem 0.9rem",
                        fontSize: "0.82rem",
                        borderRadius: "0.6rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        justifyContent: "center",
                        cursor: uploading ? "not-allowed" : "pointer",
                      }}
                    >
                      <RiUploadCloud2Line /> {uploading ? "Uploading…" : "Upload Logo Image"}
                    </button>
                    {form.image && (
                      <button
                        type="button"
                        onClick={() => setForm(p => ({ ...p, image: "" }))}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#f87171",
                          fontSize: "0.75rem",
                          cursor: "pointer",
                          textAlign: "left",
                        }}
                      >
                        Remove custom image (use icon fallback)
                      </button>
                    )}
                  </div>
                </div>

                <input
                  type="text"
                  value={form.image}
                  onChange={(e) => setForm(p => ({ ...p, image: e.target.value }))}
                  placeholder="Or paste image URL (https://...)"
                  style={{ fontSize: "0.85rem" }}
                />
                <span style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: "0.3rem", display: "block" }}>
                  Leave empty to automatically use the official brand logo if recognized.
                </span>
              </div>

              <button
                type="submit"
                disabled={saving || uploading}
                className="btn-primary"
                style={{
                  justifyContent: "center",
                  padding: "0.8rem",
                  borderRadius: "0.75rem",
                  opacity: saving || uploading ? 0.65 : 1,
                  cursor: saving || uploading ? "not-allowed" : "pointer",
                  marginTop: "0.5rem",
                }}
              >
                {saving ? "Saving…" : <><RiSaveLine /> {editId ? "Update Skill" : "Add Skill"}</>}
              </button>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this skill?"
        message="This will permanently remove it from your portfolio. This action can't be undone."
        confirmLabel="Delete"
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
