import { promises as fs } from "fs";
import path from "path";
import * as reportsDal from "./supabase/dal/reports";
import * as notificationsDal from "./supabase/dal/notifications";

export type WorkflowStatus =
  | "SUBMITTED"
  | "AI_PROCESSED"
  | "NEEDS_HUMAN_REVIEW"
  | "PATH_A_RESOLVED"
  | "PATH_B_ROUTED"
  | "PATH_B_ACKNOWLEDGED"
  | "PATH_B_RESOLVED"
  | "PATH_C_CERTIFIED"
  | "PATH_C_PASSPORT_PUBLISHED"
  | "PATH_C_MATCHED"
  | "PATH_C_COMMITMENT_CONFIRMED"
  | "PILOT_READY"
  | "PILOT_ACTIVE"
  | "REJECTED";

export interface AuditEntry {
  from: WorkflowStatus;
  to: WorkflowStatus;
  actorRole: string;
  actorName: string;
  reason: string;
  timestamp: string;
}

export interface ReportItem {
  id: string;
  trackingId: string;
  recoveryPhrase?: string;
  title: string;
  description: string;
  category: string;
  district: string;
  block: string;
  village: string;
  exactLocation?: { lat: number; lng: number } | null;
  coarseLocation?: { district: string; block: string };
  status: WorkflowStatus;
  suggestedPath: "A" | "B" | "C";
  suggestedDepartment?: string;
  aiConfidence: number;
  aiReasoning: string;
  isLikelyDuplicate: boolean;
  duplicateOfReportId?: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
  auditTrail: AuditEntry[];
}

export interface NotificationItem {
  id: string;
  role: string;
  title: string;
  message: string;
  reportId?: string;
  timestamp: string;
  read: boolean;
}

export interface DatabaseSchema {
  reports: ReportItem[];
  notifications: NotificationItem[];
}

const DB_PATH = path.join(process.cwd(), "data", "db.json");

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
}

async function ensureDbExists(): Promise<void> {
  try {
    await fs.access(DB_PATH);
  } catch {
    const defaultData: DatabaseSchema = {
      reports: [],
      notifications: [],
    };
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify(defaultData, null, 2), "utf-8");
  }
}

export async function getDatabase(): Promise<DatabaseSchema> {
  await ensureDbExists();
  const raw = await fs.readFile(DB_PATH, "utf-8");
  try {
    return JSON.parse(raw) as DatabaseSchema;
  } catch (err) {
    console.error("Failed to parse db.json, returning empty structure:", err);
    return { reports: [], notifications: [] };
  }
}

export async function saveDatabase(data: DatabaseSchema): Promise<void> {
  await ensureDbExists();
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export async function getReports(): Promise<ReportItem[]> {
  if (isSupabaseConfigured()) {
    try {
      const reports = await reportsDal.fetchReports();
      if (reports && reports.length > 0) return reports;
    } catch (err) {
      console.warn("Supabase fetchReports failed, falling back to local store:", err);
    }
  }
  const db = await getDatabase();
  return db.reports;
}

export async function getReportById(id: string): Promise<ReportItem | null> {
  if (isSupabaseConfigured()) {
    try {
      const report = await reportsDal.fetchReportById(id);
      if (report) return report;
    } catch (err) {
      console.warn("Supabase fetchReportById failed, falling back to local store:", err);
    }
  }
  const db = await getDatabase();
  const item = db.reports.find((r) => r.id === id || r.trackingId === id);
  return item ?? null;
}

export async function createReport(report: ReportItem): Promise<ReportItem> {
  if (isSupabaseConfigured()) {
    try {
      const created = await reportsDal.insertReport(report);
      if (created) return created;
    } catch (err) {
      console.warn("Supabase insertReport failed, falling back to local store:", err);
    }
  }
  const db = await getDatabase();
  db.reports.unshift(report);
  await saveDatabase(db);
  return report;
}

export async function updateReport(
  id: string,
  patch: Partial<ReportItem>
): Promise<ReportItem | null> {
  if (isSupabaseConfigured()) {
    try {
      const updated = await reportsDal.updateReportWorkflow(id, patch);
      if (updated) return updated;
    } catch (err) {
      console.warn("Supabase updateReportWorkflow failed, falling back to local store:", err);
    }
  }
  const db = await getDatabase();
  const index = db.reports.findIndex((r) => r.id === id || r.trackingId === id);
  if (index === -1) return null;

  const existing = db.reports[index];
  const updated: ReportItem = {
    ...existing,
    ...patch,
    updatedAt: new Date().toISOString(),
  };

  db.reports[index] = updated;
  await saveDatabase(db);
  return updated;
}

export async function getNotifications(role?: string): Promise<NotificationItem[]> {
  if (isSupabaseConfigured()) {
    try {
      const notifs = await notificationsDal.fetchNotifications(role);
      if (notifs && notifs.length > 0) return notifs;
    } catch (err) {
      console.warn("Supabase fetchNotifications failed, falling back to local store:", err);
    }
  }
  const db = await getDatabase();
  if (!role) return db.notifications;
  return db.notifications.filter((n) => n.role === role);
}

export async function addNotification(
  notif: NotificationItem
): Promise<NotificationItem> {
  if (isSupabaseConfigured()) {
    try {
      const added = await notificationsDal.createNotification(notif);
      if (added) return added;
    } catch (err) {
      console.warn("Supabase createNotification failed, falling back to local store:", err);
    }
  }
  const db = await getDatabase();
  db.notifications.unshift(notif);
  await saveDatabase(db);
  return notif;
}
