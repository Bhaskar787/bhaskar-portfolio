"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  RiAddLine, RiDeleteBinLine, RiEditLine, RiCloseLine,
  RiSaveLine, RiGraduationCapLine, RiCalendarLine, RiBuildingLine,
} from "react-icons/ri";
import ConfirmDialog from "@/app/components/ConfirmDialog";

const EMPTY = { degree: "", institution: "", duration: "", description: "" };

async function safeFetch(url, opts) {
  try {
    const res = await fetch(url, opts);
    const text = await res.text();
    try { return { ok: res.ok, data: JSON.parse(text) }; }
    catch { return { ok: false, data: { error: "Server error" } }; }
  } catch (e) { return { ok: false, data: { error: e.message } }; }
}

export default function AdminEducation() {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [modal,   setModal]   = useState(false);
  const [form,    setForm]    = useState(EMPTY);
  const [editId,  setEditId]  = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    const { ok, data } = await safeFetch("/api/education");
    if (ok && Array.isArray(data)) setItems(data);
    setLoading(false);
  };
  useEffect(() => { fetchItems(); }, []);

  const openAdd  = () => { setForm(EMPTY); setEditId(null); setModal(true); };
  const openEdit = (item) => { setForm({ degree: item.degree||"", institution: item.institution||"", duration: item.duration||"", description: item.description||"" }); setEditId(item._id); setModal(true); };
  const closeModal = () => { setModal(false); setForm(EMPTY); setEditId(null); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    const method = editId ? "PUT" : "POST";
    const url    = editId ? `/api/education/${editId}` : "/api/education";
    const { ok, data } = await safeFetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (ok) { toast.success(editId ? "Updated!" : "Added!"); closeModal(); fetchItems(); }
    else    { toast.error(data.error || "Failed to save."); }
    setSaving(false);
  };

  const handleDelete = (id) => setDeleteTarget(id);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const { ok, data } = await safeFetch(`/api/education/${deleteTarget}`, { method: "DELETE" });
    if (ok) { toast.success("Deleted."); fetchItems(); }
    else    { toast.error(data.error || "Failed."); }
    setDeleting(false);
    setDeleteTarget(null);
  };

  const iconBtnBase = { width: 34, height: 34, borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", border: "1px solid" };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.75rem", flexWrap: "wrap", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#3b82f6", fontSize: "1.2rem" }}>
            <RiGraduationCapLine />
          </div>
          <div>
            <h1 style={{ fontWeight: 900, fontSize: "1.3rem", color: "var(--text-primary)", letterSpacing: "-0.03em", lineHeight: 1.1 }}>Education</h1>
            <p style={{ color: "var(--muted)", fontSize: "0.8rem" }}>{items.length} entries</p>
          </div>
        </div>
        <button onClick={openAdd} className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 1.25rem", fontSize: "0.9rem", borderRadius: "0.75rem" }}>
          <RiAddLine /> Add Education
        </button>
      </div>

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {Array.from({ length: 2 }).map((_, i) => <div key={i} className="skeleton" style={{ height: 90, borderRadius: "1rem" }} />)}
        </div>
      ) : items.length === 0 ? (
        <div className="card" style={{ padding: "4rem 2rem", textAlign: "center", borderRadius: "1.25rem" }}>
          <RiGraduationCapLine style={{ fontSize: "2.5rem", color: "var(--muted)", marginBottom: "1rem" }} />
          <p style={{ color: "var(--muted)" }}>No education entries yet.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {items.map((item) => (
            <div key={item._id} className="card" style={{ padding: "1.25rem", borderRadius: "1rem", display: "flex", gap: "1rem", alignItems: "flex-start" }}>
              <div style={{ width: 44, height: 44, borderRadius: "10px", background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#3b82f6", fontSize: "1.2rem", flexShrink: 0 }}>
                <RiGraduationCapLine />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem", flexWrap: "wrap" }}>
                  <h3 style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)" }}>{item.degree}</h3>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", padding: "0.1rem 0.55rem", background: "rgba(var(--accent2-rgb),0.1)", border: "1px solid rgba(var(--accent2-rgb),0.2)", borderRadius: 9999, fontSize: "0.72rem", fontWeight: 700, color: "var(--accent2)" }}>
                    <RiCalendarLine style={{ fontSize: "0.75rem" }} />{item.duration}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: "var(--accent)", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.35rem" }}>
                  <RiBuildingLine style={{ fontSize: "0.85rem" }} />{item.institution}
                </div>
                {item.description && <p className="line-clamp-2" style={{ color: "var(--muted)", fontSize: "0.825rem", lineHeight: 1.5 }}>{item.description}</p>}
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
              <h2 style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--text-primary)" }}>{editId ? "Edit Education" : "Add Education"}</h2>
              <button onClick={closeModal} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: "1.25rem", display: "flex" }}><RiCloseLine /></button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label className="form-label">Degree / Qualification *</label>
                <input type="text" required value={form.degree} onChange={(e) => setForm(p => ({ ...p, degree: e.target.value }))} placeholder="Bachelor of Computer Science" />
              </div>
              <div>
                <label className="form-label">Institution *</label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "var(--muted)", fontSize: "1rem", display: "flex", pointerEvents: "none" }}><RiBuildingLine /></span>
                  <input type="text" required value={form.institution} onChange={(e) => setForm(p => ({ ...p, institution: e.target.value }))} placeholder="Tribhuvan University" style={{ paddingLeft: "2.75rem" }} />
                </div>
              </div>
              <div>
                <label className="form-label">Duration *</label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "var(--muted)", fontSize: "1rem", display: "flex", pointerEvents: "none" }}><RiCalendarLine /></span>
                  <input type="text" required value={form.duration} onChange={(e) => setForm(p => ({ ...p, duration: e.target.value }))} placeholder="2019 – 2023" style={{ paddingLeft: "2.75rem" }} />
                </div>
              </div>
              <div>
                <label className="form-label">Description</label>
                <textarea rows={3} value={form.description} onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Additional details about your studies..." style={{ resize: "vertical" }} />
              </div>
              <button type="submit" disabled={saving} className="btn-primary" style={{ justifyContent: "center", padding: "0.8rem", borderRadius: "0.75rem", opacity: saving ? 0.65 : 1, cursor: saving ? "not-allowed" : "pointer" }}>
                {saving ? "Saving…" : <><RiSaveLine /> {editId ? "Update" : "Add Education"}</>}
              </button>
            </form>
          </div>
        </div>
      )}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this education entry?"
        message="This will permanently remove it from your portfolio. This action can't be undone."
        confirmLabel="Delete"
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
