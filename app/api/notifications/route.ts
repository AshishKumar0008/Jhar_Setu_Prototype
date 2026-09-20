import { NextRequest, NextResponse } from "next/server";
import { getNotifications } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role") || undefined;

    const list = await getNotifications(role);

    return NextResponse.json({
      success: true,
      count: list.length,
      data: list,
    });
  } catch (error) {
    console.error("GET /api/notifications error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}
