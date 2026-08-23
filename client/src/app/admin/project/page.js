"use client";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { compressImage } from "@/lib/compressImage";
import {
  RiAddLine, RiDeleteBinLine, RiEditLine, RiCloseLine,
  RiFolderOpenLine, RiGithubLine, RiExternalLinkLine,
  RiImageLine, RiSaveLine, RiUploadCloud2Line, RiRefreshLine,
  RiCodeSSlashLine,
} from "react-icons/ri";
import ConfirmDialog from "@/app/components/ConfirmDialog";

const EMPTY = { title: "", description: "", image: "", githubLink: "", liveLink: "", skills: [] };

async function safeFetch(url, opts) {
  try {
    const res = await fetch(url, opts);
    const text = await res.text();
    try { return { ok: res.ok, data: JSON.parse(text), status: res.status }; }
    catch { return { ok: false, data: { error: text || "Server error" }, status: res.status }; }
  } catch (e) {
    return { ok: false, data: { error: e.message }, status: 0 };
  }
}

export default function AdminProjects() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [uploading, setUploading] = useState(false);
  const [modal, setModal]     = useState(false);
  const [form, setForm]       = useState(EMPTY);
  const [editId, setEditId]   = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const fileInputRef = useRef(null);

  const fetchItems = async () => {
    setLoading(true);
    const { ok, data } = await safeFetch("/api/project");
    if (ok && Array.isArray(data)) setItems(data);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const openAdd  = () => { setForm(EMPTY); setEditId(null); setSkillInput(""); setModal(true); };
  const openEdit = (item) => { setForm({ title: item.title || "", description: item.description || "", image: item.image || "", githubLink: item.githubLink || "", liveLink: item.liveLink || "", skills: item.skills || [] }); setEditId(item._id); setSkillInput(""); setModal(true); };
  const closeModal = () => { setModal(false); setForm(EMPTY); setEditId(null); setSkillInput(""); };

  const addSkill = () => {
    const val = skillInput.trim();
    if (!val) return;
    if (form.skills.some((s) => s.toLowerCase() === val.toLowerCase())) { setSkillInput(""); return; }
    setForm((p) => ({ ...p, skills: [...p.skills, val] }));
    setSkillInput("");
  };

  const removeSkill = (skill) => {
    setForm((p) => ({ ...p, skills: p.skills.filter((s) => s !== skill) }));
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill();
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const method = editId ? "PUT" : "POST";
    const url    = editId ? `/api/project/${editId}` : "/api/project";
    const { ok, data } = await safeFetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (ok) { toast.success(editId ? "Project updated!" : "Project added!"); closeModal(); fetchItems(); }
    else    { toast.error(data.error || "Failed to save."); }
    setSaving(false);
  };

  const handleDelete = (id) => setDeleteTarget(id);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const { ok, data } = await safeFetch(`/api/project/${deleteTarget}`, { method: "DELETE" });
    if (ok) { toast.success("Project deleted."); fetchItems(); }
    else    { toast.error(data.error || "Failed to delete."); }
    setDeleting(false);
    setDeleteTarget(null);
  };

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.75rem", flexWrap: "wrap", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(var(--accent-rgb),0.12)", border: "1px solid rgba(var(--accent-rgb),0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)", fontSize: "1.2rem" }}>
            <RiFolderOpenLine />
          </div>
          <div>
            <h1 style={{ fontWeight: 900, fontSize: "1.3rem", color: "var(--text-primary)", letterSpacing: "-0.03em", lineHeight: 1.1 }}>Projects</h1>
            <p style={{ color: "var(--muted)", fontSize: "0.8rem" }}>{items.length} total</p>
          </div>
        </div>
        <button onClick={openAdd} className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 1.25rem", fontSize: "0.9rem", borderRadius: "0.75rem" }}>
          <RiAddLine /> Add Project
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div style={{ display: "grid", gap: "1rem" }}>
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton" style={{ height: 100, borderRadius: "1rem" }} />)}
        </div>
      ) : items.length === 0 ? (
        <div className="card" style={{ padding: "4rem 2rem", textAlign: "center", borderRadius: "1.25rem" }}>
          <RiFolderOpenLine style={{ fontSize: "2.5rem", color: "var(--muted)", marginBottom: "1rem" }} />
          <p style={{ color: "var(--muted)", fontSize: "1rem" }}>No projects yet. Click "Add Project" to get started.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {items.map((item) => (
            <div key={item._id} className="card" style={{ padding: "1.25rem", borderRadius: "1rem", display: "flex", gap: "1rem", alignItems: "center" }}>
              {item.image && (
                <div style={{ width: 72, height: 52, borderRadius: "0.625rem", overflow: "hidden", flexShrink: 0 }}>
                  <img src={item.image} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)", marginBottom: "0.25rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</h3>
                <p className="line-clamp-2" style={{ color: "var(--muted)", fontSize: "0.825rem", lineHeight: 1.5 }}>{item.description}</p>
                {item.skills?.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginTop: "0.5rem" }}>
                    {item.skills.map((skill) => (
                      <span key={skill} className="tag" style={{ fontSize: "0.7rem", padding: "0.15rem 0.55rem" }}>{skill}</span>
                    ))}
                  </div>
                )}
                <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.4rem" }}>
                  {item.githubLink && <a href={item.githubLink} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.75rem", color: "var(--accent)", textDecoration: "none" }}><RiGithubLine /> GitHub</a>}
                  {item.liveLink   && <a href={item.liveLink}   target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.75rem", color: "var(--accent2)", textDecoration: "none" }}><RiExternalLinkLine /> Live</a>}
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                <button onClick={() => openEdit(item)} style={{ width: 34, height: 34, borderRadius: "8px", background: "rgba(var(--accent-rgb),0.1)", border: "1px solid rgba(var(--accent-rgb),0.2)", color: "var(--accent)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>
                  <RiEditLine />
                </button>
                <button onClick={() => handleDelete(item._id)} style={{ width: 34, height: 34, borderRadius: "8px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>
                  <RiDeleteBinLine />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", backdropFilter: "blur(4px)" }} onClick={closeModal}>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "1.25rem", padding: "2rem", width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h2 style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--text-primary)" }}>{editId ? "Edit Project" : "Add Project"}</h2>
              <button onClick={closeModal} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: "1.25rem", display: "flex" }}><RiCloseLine /></button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                { key: "title", label: "Title *", placeholder: "My Awesome Project", required: true },
                { key: "githubLink", label: "GitHub URL", placeholder: "https://github.com/...", Icon: RiGithubLine },
                { key: "liveLink",   label: "Live URL",   placeholder: "https://...", Icon: RiExternalLinkLine },
              ].map(({ key, label, placeholder, required, Icon }) => (
                <div key={key}>
                  <label className="form-label">{label}</label>
                  <div style={{ position: "relative" }}>
                    {Icon && <span style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "var(--muted)", fontSize: "1rem", display: "flex", pointerEvents: "none" }}><Icon /></span>}
                    <input type="text" required={required} value={form[key]} onChange={(e) => setForm(p => ({ ...p, [key]: e.target.value }))} placeholder={placeholder} style={Icon ? { paddingLeft: "2.75rem" } : {}} />
                  </div>
                </div>
              ))}
              <div>
                <label className="form-label">Project Image</label>
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
                    <img src={form.image} alt="Project" style={{ width: 44, height: 44, borderRadius: "0.5rem", objectFit: "cover" }} />
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
                <label className="form-label">Skills / Tech Stack</label>
                <div style={{ position: "relative", display: "flex", gap: "0.5rem" }}>
                  <div style={{ position: "relative", flex: 1 }}>
                    <span style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "var(--muted)", fontSize: "1rem", display: "flex", pointerEvents: "none" }}><RiCodeSSlashLine /></span>
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={handleSkillKeyDown}
                      placeholder="e.g. React, MongoDB — press Enter to add"
                      style={{ paddingLeft: "2.75rem" }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addSkill}
                    className="btn-outline"
                    style={{ padding: "0 1rem", borderRadius: "0.75rem", flexShrink: 0 }}
                  >
                    <RiAddLine /> Add
                  </button>
                </div>
                {form.skills.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.75rem" }}>
                    {form.skills.map((skill) => (
                      <span
                        key={skill}
                        className="tag"
                        style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          style={{ background: "none", border: "none", padding: 0, margin: 0, color: "inherit", cursor: "pointer", display: "flex", fontSize: "0.9rem", opacity: 0.7 }}
                        >
                          <RiCloseLine />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.5rem" }}>
                  Add the languages, frameworks, or tools used in this project.
                </p>
              </div>
              <div>
                <label className="form-label">Description *</label>
                <textarea required rows={4} value={form.description} onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Describe the project..." style={{ resize: "vertical" }} />
              </div>
              <button type="submit" disabled={saving || uploading} className="btn-primary" style={{ justifyContent: "center", padding: "0.8rem", fontSize: "0.95rem", borderRadius: "0.75rem", opacity: (saving || uploading) ? 0.65 : 1, cursor: (saving || uploading) ? "not-allowed" : "pointer" }}>
                {saving ? "Saving…" : <><RiSaveLine /> {editId ? "Update Project" : "Add Project"}</>}
              </button>
            </form>
          </div>
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this project?"
        message="This will permanently remove it from your portfolio. This action can't be undone."
        confirmLabel="Delete"
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
