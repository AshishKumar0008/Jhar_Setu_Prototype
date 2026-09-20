import { createAdminClient } from "../admin";
import { AuditEntry, WorkflowStatus } from "@/lib/store";

export async function fetchAuditTrail(reportId: string): Promise<AuditEntry[]> {
  const supabase = createAdminClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("audit_events")
    .select("*")
    .eq("report_id", reportId)
    .order("created_at", { ascending: true });

  if (error || !data) {
    console.error("fetchAuditTrail error:", error);
    return [];
  }

  return data.map((item) => ({
    from: item.from_status as WorkflowStatus,
    to: item.to_status as WorkflowStatus,
    actorRole: item.actor_role,
    actorName: item.actor_name,
    reason: item.reason,
    timestamp: item.created_at,
  }));
}

export async function recordAuditEvent(
  reportId: string,
  entry: AuditEntry
): Promise<boolean> {
  const supabase = createAdminClient();
  if (!supabase) return false;

  const { error } = await supabase.from("audit_events").insert({
    report_id: reportId,
    from_status: entry.from,
    to_status: entry.to,
    actor_role: entry.actorRole,
    actor_name: entry.actorName,
    reason: entry.reason,
    created_at: entry.timestamp || new Date().toISOString(),
  });

  if (error) {
    console.error("recordAuditEvent error:", error);
    return false;
  }

  return true;
}
