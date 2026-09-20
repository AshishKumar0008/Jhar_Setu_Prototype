import { createAdminClient } from "../admin";
import { NotificationItem } from "@/lib/store";

export async function fetchNotifications(role?: string): Promise<NotificationItem[]> {
  const supabase = createAdminClient();
  if (!supabase) return [];

  let query = supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false });

  if (role) {
    query = query.eq("role", role);
  }

  const { data, error } = await query;
  if (error || !data) {
    console.error("fetchNotifications error:", error);
    return [];
  }

  return data.map((item) => ({
    id: item.id,
    role: item.role,
    title: item.title,
    message: item.message,
    reportId: item.report_id ?? undefined,
    timestamp: item.created_at,
    read: item.read,
  }));
}

export async function createNotification(
  notif: NotificationItem
): Promise<NotificationItem | null> {
  const supabase = createAdminClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("notifications")
    .insert({
      id: notif.id,
      role: notif.role,
      title: notif.title,
      message: notif.message,
      report_id: notif.reportId ?? null,
      read: notif.read ?? false,
      created_at: notif.timestamp || new Date().toISOString(),
    })
    .select()
    .single();

  if (error || !data) {
    console.error("createNotification error:", error);
    return null;
  }

  return {
    id: data.id,
    role: data.role,
    title: data.title,
    message: data.message,
    reportId: data.report_id ?? undefined,
    timestamp: data.created_at,
    read: data.read,
  };
}

export async function markNotificationRead(id: string): Promise<boolean> {
  const supabase = createAdminClient();
  if (!supabase) return false;

  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", id);

  if (error) {
    console.error("markNotificationRead error:", error);
    return false;
  }

  return true;
}
