import { NextRequest, NextResponse } from "next/server";
import { transition } from "@/lib/workflow";
import { WorkflowStatus } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    const {
      targetState,
      actorRole = "reviewer",
      actorName,
      reason,
    } = body;

    if (!targetState) {
      return NextResponse.json(
        { success: false, error: "Target state is required." },
        { status: 400 }
      );
    }

    if (!reason || typeof reason !== "string" || reason.trim().length < 5) {
      return NextResponse.json(
        {
          success: false,
          error: "Mandatory rationale missing: A valid reason (min 5 characters) must accompany every workflow transition.",
        },
        { status: 400 }
      );
    }

    const result = await transition({
      reportId: id,
      targetState: targetState as WorkflowStatus,
      actorRole,
      actorName: actorName || `${actorRole} (authorized)`,
      reason,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 422 } // Unprocessable Entity / guard failure
      );
    }

    return NextResponse.json({
      success: true,
      message: `Status transitioned to '${targetState}'.`,
      data: result.report,
      auditEntry: result.auditEntry,
    });
  } catch (error) {
    console.error("POST /api/reports/[id]/transition error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process transition" },
      { status: 500 }
    );
  }
}
