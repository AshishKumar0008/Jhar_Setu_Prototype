import { NextRequest, NextResponse } from "next/server";
import { fetchPublicChallenges } from "@/lib/supabase/dal/challenges";
import { isSupabaseConfigured } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const district = searchParams.get("district") || undefined;
    const category = searchParams.get("category") || undefined;

    if (isSupabaseConfigured()) {
      const challenges = await fetchPublicChallenges({ district, category });
      return NextResponse.json({
        success: true,
        source: "supabase",
        count: challenges.length,
        data: challenges,
      });
    }

    // Default seeded demo challenges
    return NextResponse.json({
      success: true,
      source: "local-demo",
      count: 4,
      data: [
        {
          id: "CH-2026-W01",
          challengeCode: "CH-2026-W01",
          title: "Low-Cost Continuous Water-Quality Monitoring & Basalt Aquifer Defluoridation",
          redactedProblemStatement:
            "Recurring elevated fluoride levels exceeding 4x permissible limits across 14 rural borewells in Simaria block.",
          district: "Chatra",
          block: "Simaria",
          status: "PATH_C_PASSPORT_PUBLISHED",
          governmentOwner: "Drinking Water and Sanitation Department (DWSD)",
        },
      ],
    });
  } catch (error) {
    console.error("GET /api/challenges error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch challenges" },
      { status: 500 }
    );
  }
}
