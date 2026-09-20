import { createAdminClient } from "../admin";
import { fetchAuditTrail, recordAuditEvent } from "./audit";
import { ReportItem, WorkflowStatus } from "@/lib/store";

interface ReportFilters {
  status?: WorkflowStatus;
  district?: string;
  category?: string;
  suggestedPath?: "A" | "B" | "C";
}

function mapRowToReport(row: any, auditTrail: any[] = []): ReportItem {
  return {
    id: row.id,
    trackingId: row.tracking_id,
    recoveryPhrase: row.recovery_phrase ?? undefined,
    title: row.title,
    description: row.description,
    category: row.category,
    district: row.district,
    block: row.block,
    village: row.village,
    status: row.status as WorkflowStatus,
    suggestedPath: row.suggested_path as "A" | "B" | "C",
    suggestedDepartment: row.suggested_department ?? undefined,
    aiConfidence: Number(row.ai_confidence ?? 0.85),
    aiReasoning: row.ai_reasoning ?? "",
    isLikelyDuplicate: Boolean(row.is_likely_duplicate),
    duplicateOfReportId: row.duplicate_of_report_id ?? undefined,
    attachments: Array.isArray(row.attachments) ? row.attachments : [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    auditTrail,
  };
}

export async function fetchReports(filters?: ReportFilters): Promise<ReportItem[]> {
  const supabase = createAdminClient();
  if (!supabase) return [];

  let query = supabase.from("reports").select("*").order("created_at", { ascending: false });

  if (filters?.status) {
    query = query.eq("status", filters.status);
  }
  if (filters?.district) {
    query = query.ilike("district", filters.district);
  }
  if (filters?.category) {
    query = query.ilike("category", filters.category);
  }
  if (filters?.suggestedPath) {
    query = query.eq("suggested_path", filters.suggestedPath);
  }

  const { data, error } = await query;
  if (error || !data) {
    console.error("fetchReports error:", error);
    return [];
  }

  // Populate audit trails for each report
  const reports = await Promise.all(
    data.map(async (row) => {
      const trail = await fetchAuditTrail(row.id);
      return mapRowToReport(row, trail);
    })
  );

  return reports;
}

export async function fetchReportById(id: string): Promise<ReportItem | null> {
  const supabase = createAdminClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .or(`id.eq.${id},tracking_id.eq.${id}`)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("fetchReportById error:", error);
    return null;
  }

  const auditTrail = await fetchAuditTrail(data.id);
  return mapRowToReport(data, auditTrail);
}

export async function insertReport(report: ReportItem): Promise<ReportItem | null> {
  const supabase = createAdminClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("reports")
    .insert({
      id: report.id,
      tracking_id: report.trackingId,
      recovery_phrase: report.recoveryPhrase ?? null,
      title: report.title,
      description: report.description,
      category: report.category,
      district: report.district,
      block: report.block,
      village: report.village,
      status: report.status,
      suggested_path: report.suggestedPath,
      suggested_department: report.suggestedDepartment ?? null,
      ai_confidence: report.aiConfidence,
      ai_reasoning: report.aiReasoning,
      is_likely_duplicate: report.isLikelyDuplicate,
      duplicate_of_report_id: report.duplicateOfReportId ?? null,
      attachments: report.attachments ?? [],
      created_at: report.createdAt || new Date().toISOString(),
      updated_at: report.updatedAt || new Date().toISOString(),
    })
    .select()
    .single();

  if (error || !data) {
    console.error("insertReport error:", error);
    return null;
  }

  // Insert initial audit trail if present
  if (report.auditTrail && report.auditTrail.length > 0) {
    for (const entry of report.auditTrail) {
      await recordAuditEvent(report.id, entry);
    }
  }

  return mapRowToReport(data, report.auditTrail || []);
}

export async function updateReportWorkflow(
  id: string,
  patch: Partial<ReportItem>
): Promise<ReportItem | null> {
  const supabase = createAdminClient();
  if (!supabase) return null;

  const dbPatch: any = {
    updated_at: new Date().toISOString(),
  };

  if (patch.status !== undefined) dbPatch.status = patch.status;
  if (patch.title !== undefined) dbPatch.title = patch.title;
  if (patch.description !== undefined) dbPatch.description = patch.description;
  if (patch.category !== undefined) dbPatch.category = patch.category;
  if (patch.district !== undefined) dbPatch.district = patch.district;
  if (patch.block !== undefined) dbPatch.block = patch.block;
  if (patch.village !== undefined) dbPatch.village = patch.village;
  if (patch.suggestedPath !== undefined) dbPatch.suggested_path = patch.suggestedPath;
  if (patch.suggestedDepartment !== undefined) dbPatch.suggested_department = patch.suggestedDepartment;
  if (patch.aiConfidence !== undefined) dbPatch.ai_confidence = patch.aiConfidence;
  if (patch.aiReasoning !== undefined) dbPatch.ai_reasoning = patch.aiReasoning;
  if (patch.isLikelyDuplicate !== undefined) dbPatch.is_likely_duplicate = patch.isLikelyDuplicate;
  if (patch.duplicateOfReportId !== undefined) dbPatch.duplicate_of_report_id = patch.duplicateOfReportId;
  if (patch.attachments !== undefined) dbPatch.attachments = patch.attachments;

  const { data, error } = await supabase
    .from("reports")
    .update(dbPatch)
    .or(`id.eq.${id},tracking_id.eq.${id}`)
    .select()
    .single();

  if (error || !data) {
    console.error("updateReportWorkflow error:", error);
    return null;
  }

  // If new audit entries were supplied in the patch, persist them
  if (patch.auditTrail && patch.auditTrail.length > 0) {
    const existingTrail = await fetchAuditTrail(data.id);
    const existingCount = existingTrail.length;
    if (patch.auditTrail.length > existingCount) {
      const newEntries = patch.auditTrail.slice(existingCount);
      for (const entry of newEntries) {
        await recordAuditEvent(data.id, entry);
      }
    }
  }

  const updatedAuditTrail = await fetchAuditTrail(data.id);
  return mapRowToReport(data, updatedAuditTrail);
}
