"use client";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import {
  RiAddLine, RiDeleteBinLine, RiEditLine, RiCloseLine,
  RiSaveLine, RiImageLine, RiProjectorLine, RiCalendarLine,
  RiUploadCloud2Line, RiRefreshLine,
} from "react-icons/ri";
import ConfirmDialog from "@/app/components/ConfirmDialog";

const EMPTY = { title: "", duration: "", description: "", image: "" };

async function safeFetch(url, opts) {
  try {
    const res = await fetch(url, opts);
    const text = await res.text();
    try { return { ok: res.ok, data: JSON.parse(text) }; }
    catch { return { ok: false, data: { error: "Server error" } }; }
  } catch (e) { return { ok: false, data: { error: e.message } }; }
}

export default function AdminExperience() {
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
    const { ok, data } = await safeFetch("/api/experience");
    if (ok && Array.isArray(data)) setItems(data);
    setLoading(false);
  };
  useEffect(() => { fetchItems(); }, []);

  const openAdd  = () => { setForm(EMPTY); setEditId(null); setModal(true); };
  const openEdit = (item) => { setForm({ title: item.title||"", duration: item.duration||"", description: item.description||"", image: item.image||"" }); setEditId(item._id); setModal(true); };
  const closeModal = () => { setModal(false); setForm(EMPTY); setEditId(null); };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
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

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    const method = editId ? "PUT" : "POST";
    const url    = editId ? `/api/experience/${editId}` : "/api/experience";
    const { ok, data } = await safeFetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (ok) { toast.success(editId ? "Updated!" : "Added!"); closeModal(); fetchItems(); }
    else    { toast.error(data.error || "Failed to save."); }
    setSaving(false);
  };

  const handleDelete = (id) => setDeleteTarget(id);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const { ok, data } = await safeFetch(`/api/experience/${deleteTarget}`, { method: "DELETE" });
    if (ok) { toast.success("Deleted."); fetchItems(); }
    else    { toast.error(data.error || "Failed."); }
    setDeleting(false);
    setDeleteTarget(null);
  };

  const cardStyle = { padding: "1.25rem", borderRadius: "1rem", display: "flex", gap: "1rem", alignItems: "flex-start" };
  const iconBtnBase = { width: 34, height: 34, borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", border: "1px solid" };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.75rem", flexWrap: "wrap", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#f59e0b", fontSize: "1.2rem" }}>
            <RiProjectorLine />
          </div>
          <div>
            <h1 style={{ fontWeight: 900, fontSize: "1.3rem", color: "var(--text-primary)", letterSpacing: "-0.03em", lineHeight: 1.1 }}>Experience</h1>
            <p style={{ color: "var(--muted)", fontSize: "0.8rem" }}>{items.length} entries</p>
          </div>
        </div>
        <button onClick={openAdd} className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 1.25rem", fontSize: "0.9rem", borderRadius: "0.75rem" }}>
          <RiAddLine /> Add Experience
        </button>
      </div>

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton" style={{ height: 90, borderRadius: "1rem" }} />)}
        </div>
      ) : items.length === 0 ? (
        <div className="card" style={{ padding: "4rem 2rem", textAlign: "center", borderRadius: "1.25rem" }}>
          <RiProjectorLine style={{ fontSize: "2.5rem", color: "var(--muted)", marginBottom: "1rem" }} />
          <p style={{ color: "var(--muted)" }}>No experience entries yet.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {items.map((item) => (
            <div key={item._id} className="card" style={cardStyle}>
              {item.image && (
                <div style={{ width: 56, height: 56, borderRadius: "0.625rem", overflow: "hidden", flexShrink: 0, border: "1px solid var(--border)" }}>
                  <img src={item.image} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", padding: "0.15rem 0.6rem", background: "rgba(var(--accent-rgb),0.1)", border: "1px solid rgba(var(--accent-rgb),0.2)", borderRadius: 9999, fontSize: "0.72rem", fontWeight: 700, color: "var(--accent-tint)", marginBottom: "0.4rem" }}>
                  <RiCalendarLine style={{ fontSize: "0.8rem" }} /> {item.duration}
                </div>
                <h3 style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)", marginBottom: "0.25rem" }}>{item.title}</h3>
                <p className="line-clamp-2" style={{ color: "var(--muted)", fontSize: "0.825rem", lineHeight: 1.5 }}>{item.description}</p>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                <button onClick={() => openEdit(item)} style={{ ...iconBtnBase, background: "rgba(var(--accent-rgb),0.1)", borderColor: "rgba(var(--accent-rgb),0.2)", color: "var(--accent)" }}><RiEditLine /></button>
                <button onClick={() => handleDelete(item._id)} style={{ ...iconBtnBase, background: "rgba(239,68,68,0.1)", borderColor: "rgba(239,68,68,0.2)", color: "#f87171" }}><RiDeleteBinLine /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", backdropFilter: "blur(4px)" }} onClick={closeModal}>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "1.25rem", padding: "2rem", width: "100%", maxWidth: 500, maxHeight: "90vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h2 style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--text-primary)" }}>{editId ? "Edit Experience" : "Add Experience"}</h2>
              <button onClick={closeModal} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: "1.25rem", display: "flex" }}><RiCloseLine /></button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label className="form-label">Job Title *</label>
                <input type="text" required value={form.title} onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Full-Stack Developer" />
              </div>
              <div>
                <label className="form-label">Duration *</label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "var(--muted)", fontSize: "1rem", display: "flex", pointerEvents: "none" }}><RiCalendarLine /></span>
                  <input type="text" required value={form.duration} onChange={(e) => setForm(p => ({ ...p, duration: e.target.value }))} placeholder="Jan 2023 – Present" style={{ paddingLeft: "2.75rem" }} />
                </div>
              </div>
              <div>
                <label className="form-label">Company Image</label>
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
                    <img src={form.image} alt="Company" style={{ width: 44, height: 44, borderRadius: "0.5rem", objectFit: "cover" }} />
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
                <label className="form-label">Description *</label>
                <textarea required rows={4} value={form.description} onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Describe your responsibilities and achievements..." style={{ resize: "vertical" }} />
              </div>
              <button type="submit" disabled={saving || uploading} className="btn-primary" style={{ justifyContent: "center", padding: "0.8rem", borderRadius: "0.75rem", opacity: (saving || uploading) ? 0.65 : 1, cursor: (saving || uploading) ? "not-allowed" : "pointer" }}>
                {saving ? "Saving…" : <><RiSaveLine /> {editId ? "Update" : "Add Experience"}</>}
              </button>
            </form>
          </div>
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this experience?"
        message="This will permanently remove it from your portfolio. This action can't be undone."
        confirmLabel="Delete"
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
