"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  RiMailLine, RiDeleteBinLine, RiPhoneLine, RiUserLine,
  RiCheckLine, RiTimeLine, RiInboxLine, RiSearchLine,
} from "react-icons/ri";
import { HiMail } from "react-icons/hi";
import ConfirmDialog from "@/app/components/ConfirmDialog";
import { useNotifications } from "@/app/context/NotificationContext";

async function safeFetch(url, opts) {
  try {
    const res = await fetch(url, opts);
    const text = await res.text();
    try { return { ok: res.ok, data: JSON.parse(text) }; }
    catch { return { ok: false, data: { error: "Server error" } }; }
  } catch (e) { return { ok: false, data: { error: e.message } }; }
}

function MessageDetailCard({ item, onClose, onDelete }) {
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <h2 style={{ fontWeight: 800, fontSize: "1rem", color: "var(--text-primary)" }}>Message Detail</h2>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: "1.1rem", display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: "6px", transition: "background 0.2s" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}>×</button>
      </div>

      {/* Sender info */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.75rem 1rem", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "0.75rem" }}>
          <RiUserLine style={{ color: "var(--accent)", fontSize: "1rem", flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: "0.7rem", color: "var(--muted)", fontWeight: 600 }}>Name</div>
            <div style={{ fontSize: "0.9rem", color: "var(--text-primary)", fontWeight: 700 }}>{item.name}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.75rem 1rem", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "0.75rem" }}>
          <HiMail style={{ color: "#EA4335", fontSize: "1rem", flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "0.7rem", color: "var(--muted)", fontWeight: 600 }}>Email</div>
            <a href={`mailto:${item.email}`} style={{ fontSize: "0.875rem", color: "var(--accent)", fontWeight: 600, textDecoration: "none", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.email}</a>
          </div>
        </div>
        {item.phone && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.75rem 1rem", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "0.75rem" }}>
            <RiPhoneLine style={{ color: "var(--accent2)", fontSize: "1rem", flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: "0.7rem", color: "var(--muted)", fontWeight: 600 }}>Phone</div>
              <a href={`tel:${item.phone}`} style={{ fontSize: "0.875rem", color: "var(--text-primary)", fontWeight: 600, textDecoration: "none" }}>{item.phone}</a>
            </div>
          </div>
        )}
      </div>

      {/* Message */}
      <div>
        <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.6rem" }}>Message</p>
        <div style={{ padding: "1rem 1.25rem", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "0.875rem", fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.75, whiteSpace: "pre-wrap" }}>
          {item.message}
        </div>
      </div>

      {/* Received time */}
      {item.createdAt && (
        <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "1rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
          <RiTimeLine /> Received {new Date(item.createdAt).toLocaleString()}
        </p>
      )}

      {/* Actions */}
      <div className="message-actions">
        <a href={`mailto:${item.email}?subject=Re: Your Message`} className="btn-primary" style={{ flex: 1, justifyContent: "center", padding: "0.65rem", fontSize: "0.875rem", borderRadius: "0.75rem" }}>
          <RiMailLine /> Reply
        </a>
        <button onClick={onDelete} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", padding: "0.65rem", fontSize: "0.875rem", borderRadius: "0.75rem", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171", cursor: "pointer", fontWeight: 700 }}>
          <RiDeleteBinLine /> Delete
        </button>
      </div>
    </>
  );
}

export default function AdminContact() {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");
  const [selected, setSelected] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { markAsRead, decrementUnreadCount, lastMessage } = useNotifications();

  const fetchItems = async () => {
    setLoading(true);
    const { ok, data } = await safeFetch("/api/contact");
    // API already returns newest-first (sort: createdAt -1) — keep that order
    // so the most recent message is always at the top of the inbox.
    if (ok && Array.isArray(data)) setItems(data);
    setLoading(false);
  };
  useEffect(() => { fetchItems(); }, []);

  // A socket push told us a brand-new message just arrived — drop it
  // straight into the top of the list instead of waiting for a refetch.
  useEffect(() => {
    if (!lastMessage) return;
    setItems((prev) => {
      if (prev.some((i) => i._id === lastMessage._id)) return prev;
      return [lastMessage, ...prev];
    });
  }, [lastMessage]);

  const handleSelect = (item) => {
    const next = selected?._id === item._id ? null : item;
    setSelected(next);
    if (next && !next.read) {
      setItems((prev) => prev.map((i) => (i._id === next._id ? { ...i, read: true } : i)));
      markAsRead(next._id, { wasUnread: true });
    }
  };

  const handleDelete = (id) => setDeleteTarget(id);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const targetItem = items.find((item) => item._id === deleteTarget);
    const wasUnread = Boolean(targetItem && !targetItem.read);

    setDeleting(true);
    const { ok, data } = await safeFetch(`/api/contact/${deleteTarget}`, { method: "DELETE" });
    if (ok) {
      toast.success("Message deleted.");
      setSelected(null);
      if (wasUnread) {
        decrementUnreadCount(deleteTarget, { wasUnread: true });
      }
      fetchItems();
    } else {
      toast.error(data.error || "Failed.");
    }
    setDeleting(false);
    setDeleteTarget(null);
  };

  const filtered = items.filter((item) => {
    const q = search.toLowerCase();
    return !q || item.name?.toLowerCase().includes(q) || item.email?.toLowerCase().includes(q) || item.message?.toLowerCase().includes(q);
  });

  const timeAgo = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const diff = Date.now() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return d.toLocaleDateString();
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      {/* Header */}
      <div className="messages-header">
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#22c55e", fontSize: "1.2rem", flexShrink: 0 }}>
            <RiMailLine />
          </div>
          <div>
            <h1 style={{ fontWeight: 900, fontSize: "1.3rem", color: "var(--text-primary)", letterSpacing: "-0.03em", lineHeight: 1.1 }}>Messages</h1>
            <p style={{ color: "var(--muted)", fontSize: "0.8rem" }}>{items.length} total inquiries</p>
          </div>
        </div>

        {/* Search */}
        <div className="messages-search">
          <span style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "var(--muted)", fontSize: "1rem", display: "flex", pointerEvents: "none" }}>
            <RiSearchLine />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search messages…"
            style={{ paddingLeft: "2.75rem", padding: "0.55rem 1rem 0.55rem 2.75rem", width: "100%" }}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton" style={{ height: 72, borderRadius: "1rem" }} />)}
        </div>
      ) : items.length === 0 ? (
        <div className="card" style={{ padding: "4rem 2rem", textAlign: "center", borderRadius: "1.25rem" }}>
          <RiInboxLine style={{ fontSize: "2.5rem", color: "var(--muted)", marginBottom: "1rem" }} />
          <p style={{ color: "var(--muted)" }}>No messages yet. They'll appear here when users submit the contact form.</p>
        </div>
      ) : (
        <div className={`messages-grid${selected ? " has-selected" : ""}`}>
          {/* List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {filtered.map((item) => (
              <div key={item._id}>
                <div
                  onClick={() => handleSelect(item)}
                  className="card message-row"
                  style={{
                    borderRadius: "1rem",
                    cursor: "pointer",
                    borderColor: selected?._id === item._id ? "rgba(var(--accent-rgb),0.5)" : (!item.read ? "rgba(var(--accent-rgb),0.35)" : undefined),
                    background: !item.read ? "rgba(var(--accent-rgb),0.05)" : undefined,
                    transition: "border-color 0.2s, transform 0.15s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  {/* Avatar */}
                  <div style={{ position: "relative", width: 40, height: 40, borderRadius: "10px", background: "rgba(var(--accent-rgb),0.1)", border: "1px solid rgba(var(--accent-rgb),0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1rem", color: "var(--accent)", flexShrink: 0 }}>
                    {(item.name||"?").charAt(0).toUpperCase()}
                    {!item.read && (
                      <span style={{ position: "absolute", top: -3, right: -3, width: 10, height: 10, borderRadius: "50%", background: "#ef4444", boxShadow: "0 0 0 2px var(--card)" }} />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.15rem" }}>
                      <span style={{ fontWeight: item.read ? 700 : 800, fontSize: "0.9rem", color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</span>
                      <span style={{ fontSize: "0.7rem", color: "var(--muted)", whiteSpace: "nowrap", marginLeft: "auto", flexShrink: 0, display: "flex", alignItems: "center", gap: "0.25rem" }}>
                        <RiTimeLine style={{ fontSize: "0.75rem" }} />{timeAgo(item.createdAt)}
                      </span>
                    </div>
                    <p className="line-clamp-2" style={{ color: !item.read ? "var(--text-secondary)" : "var(--muted)", fontSize: "0.8rem", lineHeight: 1.45, fontWeight: item.read ? 400 : 600 }}>{item.message}</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(item._id); }}
                    style={{ width: 30, height: 30, borderRadius: "7px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", flexShrink: 0 }}
                  >
                    <RiDeleteBinLine />
                  </button>
                </div>

                {/* Inline detail — appears directly under this message (mobile only, desktop uses side panel) */}
                {selected?._id === item._id && (
                  <div className="card message-detail-inline" style={{ borderRadius: "1rem", marginTop: "0.5rem" }}>
                    <MessageDetailCard
                      item={item}
                      onClose={() => setSelected(null)}
                      onDelete={() => handleDelete(item._id)}
                    />
                  </div>
                )}
              </div>
            ))}
            {filtered.length === 0 && search && (
              <div style={{ textAlign: "center", padding: "2rem", color: "var(--muted)" }}>No results for "{search}"</div>
            )}
          </div>

          {/* Detail side panel (desktop only) */}
          {selected && (
            <div className="card message-detail message-detail-panel" style={{ borderRadius: "1.25rem" }}>
              <MessageDetailCard
                item={selected}
                onClose={() => setSelected(null)}
                onDelete={() => handleDelete(selected._id)}
              />
            </div>
          )}
        </div>
      )}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this message?"
        message="This will permanently remove the message from your inbox. This action can't be undone."
        confirmLabel="Delete"
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}