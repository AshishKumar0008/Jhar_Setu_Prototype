import { addNotification, NotificationItem } from "./store";

type Listener = (n: NotificationItem) => void;

// In-memory pub/sub registry keyed by role name
// Global object attachment protects against hot-reload listener loss in Next.js development
const globalForNotify = globalThis as unknown as {
  __notify_listeners?: Record<string, Listener[]>;
};

const listeners: Record<string, Listener[]> =
  globalForNotify.__notify_listeners ?? {};
if (!globalForNotify.__notify_listeners) {
  globalForNotify.__notify_listeners = listeners;
}

export function subscribeToNotifications(role: string, cb: Listener): () => void {
  (listeners[role] ??= []).push(cb);
  // Also subscribe to broadcast notifications
  (listeners["all"] ??= []).push(cb);

  return () => {
    if (listeners[role]) {
      listeners[role] = listeners[role].filter((l) => l !== cb);
    }
    if (listeners["all"]) {
      listeners["all"] = listeners["all"].filter((l) => l !== cb);
    }
  };
}

export async function notify(
  role: string,
  payload: {
    title: string;
    message: string;
    reportId?: string;
  }
): Promise<NotificationItem> {
  const item: NotificationItem = {
    id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    role,
    title: payload.title,
    message: payload.message,
    reportId: payload.reportId,
    timestamp: new Date().toISOString(),
    read: false,
  };

  // 1. Dispatch to active SSE connections
  listeners[role]?.forEach((cb) => {
    try {
      cb(item);
    } catch (e) {
      console.error(`Error notifying listener for role ${role}:`, e);
    }
  });

  // Also notify admins/all
  if (role !== "admin") {
    listeners["admin"]?.forEach((cb) => {
      try {
        cb(item);
      } catch (e) {
        console.error("Error notifying admin listener:", e);
      }
    });
  }

  // 2. Persist to store so reloads show history
  try {
    await addNotification(item);
  } catch (err) {
    console.error("Failed to persist notification:", err);
  }

  return item;
}
