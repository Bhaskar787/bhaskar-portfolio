"use client";

import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";

const NotificationContext = createContext({
  unreadCount: 0,
  connected: false,
  lastMessage: null,
  markAsRead: async () => {},
  refreshUnreadCount: async () => {},
});

export function NotificationProvider({ children }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [connected, setConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const socketRef = useRef(null);
  const router = useRouter();

  const refreshUnreadCount = useCallback(async () => {
    try {
      const res = await fetch("/api/contact/unread-count");
      if (!res.ok) return;
      const data = await res.json();
      if (typeof data.count === "number") setUnreadCount(data.count);
    } catch {
      /* network hiccup — badge just keeps its last known value */
    }
  }, []);

  // Mark a message read locally + on the server, and step the badge down.
  // Safe to call even if the message was already read (server no-ops).
  const markAsRead = useCallback(async (id, { wasUnread = true } = {}) => {
    if (wasUnread) setUnreadCount((c) => Math.max(0, c - 1));
    try {
      await fetch(`/api/contact/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      });
    } catch {
      // If this fails, refresh from the server so the badge doesn't drift.
      refreshUnreadCount();
    }
  }, [refreshUnreadCount]);

  const decrementUnreadCount = useCallback(async (id, { wasUnread = true } = {}) => {
    if (wasUnread) setUnreadCount((c) => Math.max(0, c - 1));
    try {
      await fetch(`/api/contact/${id}`, {
        method: "DELETE",
      });
    } catch {
      refreshUnreadCount();
    }
  }, [refreshUnreadCount]);

  useEffect(() => {
    refreshUnreadCount();

    const socket = io({ path: "/socket.io" });
    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      socket.emit("join-admin");
    });
    socket.on("disconnect", () => setConnected(false));

    socket.on("new-message", (contact) => {
      setUnreadCount((c) => c + 1);
      setLastMessage(contact);

      toast.custom(
        () => (
          <div
            onClick={() => router.push("/admin/contact")}
            style={{
              display: "flex", alignItems: "flex-start", gap: "0.7rem",
              background: "var(--card)", border: "1px solid rgba(var(--accent-rgb),0.35)",
              borderRadius: "0.9rem", padding: "0.85rem 1rem", width: 340,
              boxShadow: "0 12px 30px rgba(0,0,0,0.35)", cursor: "pointer",
            }}
          >
            <div style={{
              width: 34, height: 34, borderRadius: "9px", flexShrink: 0,
              background: "rgba(var(--accent-rgb),0.14)", color: "var(--accent)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 800, fontSize: "0.9rem",
            }}>
              {(contact?.name || "?").charAt(0).toUpperCase()}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text-primary)" }}>
                New message from {contact?.name || "someone"}
              </div>
              <div style={{
                fontSize: "0.8rem", color: "var(--muted)", marginTop: 2,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {contact?.message}
              </div>
            </div>
          </div>
        ),
        { duration: 6000 }
      );
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [refreshUnreadCount, router]);

  return (
    <NotificationContext.Provider value={{ unreadCount, connected, lastMessage, markAsRead, decrementUnreadCount, refreshUnreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);