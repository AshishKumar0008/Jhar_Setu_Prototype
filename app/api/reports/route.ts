import { NextRequest, NextResponse } from "next/server";
import { createReport, getReports, ReportItem, WorkflowStatus } from "@/lib/store";
import { notify } from "@/lib/notify";

export const dynamic = "force-dynamic";

// Seed recovery words for anonymous tracking
const RECOVERY_WORDS = [
  "forest", "river", "sal", "coal", "granite", "amber", "tiger",
  "falcon", "valley", "spring", "lotus", "bridge", "cloud", "plateau"
];

function generateRecoveryPhrase(): string {
  const selected: string[] = [];
  for (let i = 0; i < 4; i++) {
    const idx = Math.floor(Math.random() * RECOVERY_WORDS.length);
    selected.push(RECOVERY_WORDS[idx]);
  }
  return selected.join("-");
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") as WorkflowStatus | null;
    const district = searchParams.get("district");
    const category = searchParams.get("category");

    let reports = await getReports();

    if (status) {
      reports = reports.filter((r) => r.status === status);
    }
    if (district) {
      reports = reports.filter((r) => r.district.toLowerCase() === district.toLowerCase());
    }
    if (category) {
      reports = reports.filter((r) => r.category.toLowerCase() === category.toLowerCase());
    }

    return NextResponse.json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    console.error("GET /api/reports error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      title,
      description,
      category = "other",
      district = "Ranchi",
      block = "Sadhar",
      village = "Town",
      attachments = [],
      exactLocation = null,
      coarseLocation = null,
      suggestedPath = "B",
      suggestedDepartment = undefined,
      aiConfidence = 0.85,
      aiReasoning = "Awaiting automated triage pipeline.",
    } = body;

    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: "Title and description are required." },
        { status: 400 }
      );
    }

    const year = new Date().getFullYear();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const id = `JH-${year}-${randomSuffix}`;
    const recoveryPhrase = generateRecoveryPhrase();
    const now = new Date().toISOString();

    const newReport: ReportItem = {
      id,
      trackingId: id,
      recoveryPhrase,
      title: title.trim(),
      description: description.trim(),
      category,
      district,
      block,
      village,
      exactLocation: exactLocation || null,
      coarseLocation: coarseLocation || { district, block },
      status: "SUBMITTED",
      suggestedPath: suggestedPath || "B",
      suggestedDepartment,
      aiConfidence: aiConfidence || 0.85,
      aiReasoning: aiReasoning || "Awaiting automated triage pipeline.",
      isLikelyDuplicate: false,
      attachments,
      createdAt: now,
      updatedAt: now,
      auditTrail: [
        {
          from: "SUBMITTED",
          to: "SUBMITTED",
          actorRole: "citizen",
          actorName: "Citizen Reporter",
          reason: "Citizen intake submitted via PWA portal.",
          timestamp: now,
        },
      ],
    };

    const saved = await createReport(newReport);

    // Notify reviewer queue of fresh intake
    await notify("reviewer", {
      title: "New Citizen Report Submitted",
      message: `Report ${id} filed in ${district} (${category}). Queued for AI triage.`,
      reportId: id,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Report successfully submitted and queued for review.",
        data: saved,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/reports error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create report" },
      { status: 500 }
    );
  }
}
