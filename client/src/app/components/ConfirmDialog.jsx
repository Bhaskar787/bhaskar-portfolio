"use client";
import { RiErrorWarningLine, RiCloseLine } from "react-icons/ri";

/**
 * A reusable, theme-aware confirmation modal — replaces the native
 * window.confirm()/alert() dialogs (which can't be styled and look
 * jarring/inconsistent across light & dark mode).
 *
 * Usage:
 *   const [pendingId, setPendingId] = useState(null);
 *   <ConfirmDialog
 *     open={!!pendingId}
 *     title="Delete this project?"
 *     message="This action can't be undone."
 *     confirmLabel="Delete"
 *     onCancel={() => setPendingId(null)}
 *     onConfirm={async () => { await doDelete(pendingId); setPendingId(null); }}
 *   />
 */
export default function ConfirmDialog({
  open,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  danger = true,
  loading = false,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        backdropFilter: "blur(4px)",
      }}
      onClick={onCancel}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "1.25rem",
          padding: "1.75rem",
          width: "100%",
          maxWidth: 400,
          boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "0.9rem", marginBottom: "1.5rem" }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: "0.75rem",
              background: danger ? "rgba(239,68,68,0.12)" : "rgba(var(--accent-rgb),0.12)",
              border: `1px solid ${danger ? "rgba(239,68,68,0.25)" : "rgba(var(--accent-rgb),0.25)"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: danger ? "var(--danger)" : "var(--accent)",
              fontSize: "1.3rem",
              flexShrink: 0,
            }}
          >
            <RiErrorWarningLine />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 id="confirm-dialog-title" style={{ fontWeight: 800, fontSize: "1.05rem", color: "var(--text-primary)", marginBottom: "0.35rem" }}>
              {title}
            </h3>
            <p style={{ color: "var(--muted)", fontSize: "0.875rem", lineHeight: 1.55 }}>{message}</p>
          </div>
          <button
            onClick={onCancel}
            aria-label="Close"
            style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: "1.15rem", display: "flex", flexShrink: 0 }}
          >
            <RiCloseLine />
          </button>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            type="button"
            onClick={onCancel}
            className="btn-outline"
            style={{ flex: 1, justifyContent: "center", padding: "0.7rem", fontSize: "0.9rem", borderRadius: "0.75rem" }}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.4rem",
              padding: "0.7rem",
              fontSize: "0.9rem",
              fontWeight: 700,
              borderRadius: "0.75rem",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              color: "#fff",
              background: danger
                ? "linear-gradient(135deg, var(--danger), #b91c1c)"
                : "linear-gradient(135deg, var(--accent), var(--accent2))",
            }}
          >
            {loading ? "Deleting…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
