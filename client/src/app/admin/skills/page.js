"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  RiAddLine, RiDeleteBinLine, RiEditLine, RiCloseLine,
  RiSaveLine, RiCodeBoxLine,
} from "react-icons/ri";
import ConfirmDialog from "@/app/components/ConfirmDialog";

const EMPTY = { name: "", level: 80, category: "" };
const CATEGORIES = ["Frontend", "Backend", "Database", "Tools", "Other"];

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
  const [modal,   setModal]   = useState(false);
  const [form,    setForm]    = useState(EMPTY);
  const [editId,  setEditId]  = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    const { ok, data } = await safeFetch("/api/skills");
    if (ok && Array.isArray(data)) setItems(data);
    setLoading(false);
  };
  useEffect(() => { fetchItems(); }, []);

  const openAdd  = () => { setForm(EMPTY); setEditId(null); setModal(true); };
  const openEdit = (item) => { setForm({ name: item.name||"", level: item.level||80, category: item.category||"" }); setEditId(item._id); setModal(true); };
  const closeModal = () => { setModal(false); setForm(EMPTY); setEditId(null); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    const method = editId ? "PUT" : "POST";
    const url    = editId ? `/api/skills/${editId}` : "/api/skills";
    const payload = { ...form, level: Number(form.level) };
    const { ok, data } = await safeFetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (ok) { toast.success(editId ? "Updated!" : "Added!"); closeModal(); fetchItems(); }
    else    { toast.error(data.error || "Failed to save."); }
    setSaving(false);
  };

  const handleDelete = (id) => setDeleteTarget(id);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const { ok, data } = await safeFetch(`/api/skills/${deleteTarget}`, { method: "DELETE" });
    if (ok) { toast.success("Deleted."); fetchItems(); }
    else    { toast.error(data.error || "Failed."); }
    setDeleting(false);
    setDeleteTarget(null);
  };

  const getLevelColor = (level) => {
    if (level >= 85) return "#22c55e";
    if (level >= 65) return "rgb(var(--accent2-rgb))";
    if (level >= 45) return "#f59e0b";
    return "#f43f5e";
  };

  // Returns a semi-transparent version of the level color for the gradient's
  // starting stop. Plain hex colors can safely have an alpha suffix appended
  // (e.g. "#22c55ecc"), but `var(--accent2-rgb)cc` is NOT valid CSS — that
  // silently broke the whole background declaration (and made the bar
  // invisible) for any skill in the 65–84% "Advanced" range, which is also
  // the default level for every newly added skill.
  const getLevelSoftColor = (level) => {
    if (level >= 65 && level < 85) return "rgba(var(--accent2-rgb),0.8)";
    return `${getLevelColor(level)}cc`;
  };

  const getLevelLabel = (level) => {
    if (level >= 85) return "Expert";
    if (level >= 65) return "Advanced";
    if (level >= 45) return "Intermediate";
    return "Beginner";
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.75rem", flexWrap: "wrap", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(236,72,153,0.12)", border: "1px solid rgba(236,72,153,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#ec4899", fontSize: "1.2rem" }}>
            <RiCodeBoxLine />
          </div>
          <div>
            <h1 style={{ fontWeight: 900, fontSize: "1.3rem", color: "var(--text-primary)", letterSpacing: "-0.03em", lineHeight: 1.1 }}>Skills</h1>
            <p style={{ color: "var(--muted)", fontSize: "0.8rem" }}>{items.length} skills</p>
          </div>
        </div>
        <button onClick={openAdd} className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 1.25rem", fontSize: "0.9rem", borderRadius: "0.75rem" }}>
          <RiAddLine /> Add Skill
        </button>
      </div>

      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "0.75rem" }}>
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton" style={{ height: 70, borderRadius: "1rem" }} />)}
        </div>
      ) : items.length === 0 ? (
        <div className="card" style={{ padding: "4rem 2rem", textAlign: "center", borderRadius: "1.25rem" }}>
          <RiCodeBoxLine style={{ fontSize: "2.5rem", color: "var(--muted)", marginBottom: "1rem" }} />
          <p style={{ color: "var(--muted)" }}>No skills added yet.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "0.75rem" }}>
          {items.map((item) => {
            const color = getLevelColor(item.level);
            return (
              <div key={item._id} className="card" style={{ padding: "1.1rem 1.25rem", borderRadius: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.6rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flex: 1, minWidth: 0 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0, boxShadow: `0 0 6px ${color}` }} />
                    <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexShrink: 0 }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 800, color, minWidth: 36, textAlign: "right" }}>{item.level}%</span>
                    <button onClick={() => openEdit(item)} style={{ width: 28, height: 28, borderRadius: "6px", background: "rgba(var(--accent-rgb),0.1)", border: "1px solid rgba(var(--accent-rgb),0.2)", color: "var(--accent)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem" }}><RiEditLine /></button>
                    <button onClick={() => handleDelete(item._id)} style={{ width: 28, height: 28, borderRadius: "6px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem" }}><RiDeleteBinLine /></button>
                  </div>
                </div>
                {/* progress bar */}
                <div style={{ height: 5, background: "rgba(255,255,255,0.07)", borderRadius: 9999, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${item.level}%`, background: `linear-gradient(90deg, ${getLevelSoftColor(item.level)}, ${color})`, borderRadius: 9999, transition: "width 0.8s ease" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.3rem" }}>
                  {item.category && <span style={{ fontSize: "0.7rem", color: "var(--muted)", fontWeight: 600 }}>{item.category}</span>}
                  <span style={{ fontSize: "0.7rem", color, fontWeight: 700, marginLeft: "auto" }}>{getLevelLabel(item.level)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", backdropFilter: "blur(4px)" }} onClick={closeModal}>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "1.25rem", padding: "2rem", width: "100%", maxWidth: 440, maxHeight: "90vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h2 style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--text-primary)" }}>{editId ? "Edit Skill" : "Add Skill"}</h2>
              <button onClick={closeModal} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: "1.25rem", display: "flex" }}><RiCloseLine /></button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
              <div>
                <label className="form-label">Skill Name *</label>
                <input type="text" required value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} placeholder="React.js" />
              </div>
              <div>
                <label className="form-label">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm(p => ({ ...p, category: e.target.value }))}
                >
                  <option value="">Select category…</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                  <label className="form-label" style={{ margin: 0 }}>Proficiency Level</label>
                  <span style={{ fontSize: "0.85rem", fontWeight: 800, color: getLevelColor(form.level) }}>{form.level}% — {getLevelLabel(form.level)}</span>
                </div>
                <input
                  type="range"
                  min={10} max={100} step={5}
                  value={form.level}
                  onChange={(e) => setForm(p => ({ ...p, level: Number(e.target.value) }))}
                  style={{ width: "100%", accentColor: getLevelColor(form.level), cursor: "pointer", height: "6px" }}
                />
                {/* preview bar */}
                <div style={{ marginTop: "0.5rem", height: 5, background: "rgba(255,255,255,0.07)", borderRadius: 9999, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${form.level}%`, background: `linear-gradient(90deg, ${getLevelSoftColor(form.level)}, ${getLevelColor(form.level)})`, borderRadius: 9999, transition: "width 0.2s" }} />
                </div>
              </div>
              <button type="submit" disabled={saving} className="btn-primary" style={{ justifyContent: "center", padding: "0.8rem", borderRadius: "0.75rem", opacity: saving ? 0.65 : 1, cursor: saving ? "not-allowed" : "pointer" }}>
                {saving ? "Saving…" : <><RiSaveLine /> {editId ? "Update" : "Add Skill"}</>}
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
