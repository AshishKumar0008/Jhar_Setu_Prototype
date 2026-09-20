import {
  AuditEntry,
  getReportById,
  ReportItem,
  updateReport,
  WorkflowStatus,
} from "./store";
import { notify } from "./notify";

// Allowed state transitions mapped by current state
export const ALLOWED_TRANSITIONS: Record<WorkflowStatus, WorkflowStatus[]> = {
  SUBMITTED: ["AI_PROCESSED", "NEEDS_HUMAN_REVIEW", "REJECTED"],
  AI_PROCESSED: ["NEEDS_HUMAN_REVIEW", "PATH_A_RESOLVED", "PATH_B_ROUTED", "PATH_C_CERTIFIED"],
  NEEDS_HUMAN_REVIEW: [
    "PATH_A_RESOLVED",
    "PATH_B_ROUTED",
    "PATH_C_CERTIFIED",
    "REJECTED",
  ],
  PATH_A_RESOLVED: ["NEEDS_HUMAN_REVIEW"],
  PATH_B_ROUTED: ["PATH_B_ACKNOWLEDGED", "PATH_B_RESOLVED", "NEEDS_HUMAN_REVIEW"],
  PATH_B_ACKNOWLEDGED: ["PATH_B_RESOLVED", "NEEDS_HUMAN_REVIEW"],
  PATH_B_RESOLVED: [],
  PATH_C_CERTIFIED: ["PATH_C_PASSPORT_PUBLISHED", "PATH_C_MATCHED"],
  PATH_C_PASSPORT_PUBLISHED: ["PATH_C_MATCHED"],
  PATH_C_MATCHED: ["PATH_C_COMMITMENT_CONFIRMED", "PILOT_READY"],
  PATH_C_COMMITMENT_CONFIRMED: ["PILOT_READY"],
  PILOT_READY: ["PILOT_ACTIVE"],
  PILOT_ACTIVE: [],
  REJECTED: ["NEEDS_HUMAN_REVIEW"],
};

// Permitted actor roles for each target state
export const ROLE_PERMISSIONS: Record<WorkflowStatus, string[]> = {
  SUBMITTED: ["citizen", "assisted_operator", "admin"],
  AI_PROCESSED: ["system", "admin"],
  NEEDS_HUMAN_REVIEW: ["system", "reviewer", "admin"],
  PATH_A_RESOLVED: ["reviewer", "admin"],
  PATH_B_ROUTED: ["reviewer", "admin"],
  PATH_B_ACKNOWLEDGED: ["department_officer", "admin"],
  PATH_B_RESOLVED: ["department_officer", "admin"],
  PATH_C_CERTIFIED: ["reviewer", "admin"],
  PATH_C_PASSPORT_PUBLISHED: ["reviewer", "government", "admin"],
  PATH_C_MATCHED: ["reviewer", "government", "admin"],
  PATH_C_COMMITMENT_CONFIRMED: ["industry_csr", "government", "admin"],
  PILOT_READY: ["government", "admin"],
  PILOT_ACTIVE: ["government", "admin"],
  REJECTED: ["reviewer", "department_officer", "admin"],
};

export interface TransitionRequest {
  reportId: string;
  targetState: WorkflowStatus;
  actorRole: string;
  actorName: string;
  reason: string;
}

export interface TransitionResult {
  success: boolean;
  error?: string;
  report?: ReportItem;
  auditEntry?: AuditEntry;
}

/**
 * Checks whether an actor can execute a transition from `from` to `to`.
 */
export function canTransition(
  from: WorkflowStatus,
  to: WorkflowStatus,
  actorRole: string
): { allowed: boolean; reason?: string } {
  const allowedNext = ALLOWED_TRANSITIONS[from] || [];
  if (!allowedNext.includes(to)) {
    return {
      allowed: false,
      reason: `Illegal state transition: Cannot move from '${from}' to '${to}'. Allowed transitions: ${allowedNext.join(", ") || "none"}`,
    };
  }

  const permittedRoles = ROLE_PERMISSIONS[to] || [];
  if (!permittedRoles.includes(actorRole) && actorRole !== "admin") {
    return {
      allowed: false,
      reason: `Unauthorized: Role '${actorRole}' is not permitted to transition status to '${to}'. Authorized roles: ${permittedRoles.join(", ")}`,
    };
  }

  return { allowed: true };
}

/**
 * Core guarded state machine transition function.
 * Enforces:
 * 1. Legal state transition
 * 2. Authorized actor role
 * 3. Mandatory human rationale / reason
 * 4. In-record audit event write
 * 5. Downstream destination role notification
 */
export async function transition(
  req: TransitionRequest
): Promise<TransitionResult> {
  const { reportId, targetState, actorRole, actorName, reason } = req;

  // 1. Mandatory justification invariant
  if (!reason || reason.trim().length < 5) {
    return {
      success: false,
      error: "Mandatory rationale missing: Every state transition requires a clear reason (minimum 5 characters).",
    };
  }

  // 2. Fetch current record
  const report = await getReportById(reportId);
  if (!report) {
    return {
      success: false,
      error: `Report not found with ID '${reportId}'.`,
    };
  }

  // 3. Validate guard
  const validation = canTransition(report.status, targetState, actorRole);
  if (!validation.allowed) {
    return {
      success: false,
      error: validation.reason,
    };
  }

  // 4. Create immutable audit entry
  const now = new Date().toISOString();
  const auditEntry: AuditEntry = {
    from: report.status,
    to: targetState,
    actorRole,
    actorName: actorName || `${actorRole} (authorized)`,
    reason: reason.trim(),
    timestamp: now,
  };

  const updatedAuditTrail = [...(report.auditTrail || []), auditEntry];

  // 5. Update data store
  const updatedReport = await updateReport(report.id, {
    status: targetState,
    auditTrail: updatedAuditTrail,
  });

  if (!updatedReport) {
    return {
      success: false,
      error: "Failed to persist report update.",
    };
  }

  // 6. Route notifications to downstream stakeholder roles
  await dispatchStateNotifications(updatedReport, auditEntry);

  return {
    success: true,
    report: updatedReport,
    auditEntry,
  };
}

/**
 * Dispatches real-time SSE notifications based on workflow transitions.
 */
async function dispatchStateNotifications(
  report: ReportItem,
  audit: AuditEntry
) {
  const { to } = audit;

  switch (to) {
    case "PATH_B_ROUTED":
      await notify("department_officer", {
        title: "New Grievance Case Routed",
        message: `Report ${report.id} (${report.category}) routed to ${report.suggestedDepartment || "department"}.`,
        reportId: report.id,
      });
      break;

    case "PATH_C_CERTIFIED":
      await notify("government", {
        title: "Innovation Gap Certificate Issued",
        message: `Report ${report.id} in ${report.district} certified for university-industry pilot development.`,
        reportId: report.id,
      });
      await notify("university", {
        title: "New Challenge Passport Available",
        message: `Challenge verified: ${report.title.slice(0, 60)}... Review and submit capability proposals.`,
        reportId: report.id,
      });
      break;

    case "PATH_C_MATCHED":
      await notify("university", {
        title: "University Match Confirmed",
        message: `Proposal shortlisted for ${report.id}. Innovation Cell partner commitment pending.`,
        reportId: report.id,
      });
      await notify("industry_csr", {
        title: "CSR Co-Sponsorship Opportunity",
        message: `Validated Innovation Gap ${report.id} open for industry co-financing.`,
        reportId: report.id,
      });
      break;

    case "PILOT_READY":
      await notify("government", {
        title: "Pilot Readiness Review Required",
        message: `All capability and commitment criteria satisfied for ${report.id}. Final approval required.`,
        reportId: report.id,
      });
      break;

    case "PATH_B_RESOLVED":
    case "PATH_A_RESOLVED":
      await notify("reviewer", {
        title: `Case Marked Resolved: ${report.id}`,
        message: `Resolution recorded by ${audit.actorName}: ${audit.reason}`,
        reportId: report.id,
      });
      break;

    default:
      break;
  }
}
