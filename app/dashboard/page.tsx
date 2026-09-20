import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getDashboardPathSafe, isValidRole } from "@/lib/auth-redirect";
import { SignOutButton } from "@clerk/nextjs";
import { ShieldAlert, Clock, LogOut, ArrowLeft, KeyRound } from "lucide-react";
import { Logo } from "@/components/branding/logo";

/**
 * Role dispatcher — reads metadata from Clerk and redirects to the
 * correct dashboard.
 *
 * In accordance with strict RBAC rules:
 * - The frontend never allows manual role switching.
 * - The role is read exclusively from Clerk user metadata.
 * - If no role is assigned, an informational pending card is displayed.
 */
export default async function DashboardPage() {
  const { sessionClaims } = await auth();
  const user = await currentUser();

  const meta = (sessionClaims?.metadata || user?.publicMetadata) as
    | { role?: string; department?: string }
    | undefined;

  const role = meta?.role;
  const department = meta?.department;

  if (isValidRole(role)) {
    const path = getDashboardPathSafe(role, department);
    if (path) redirect(path);
  }

  // No valid role set in Clerk metadata — show pending assignment screen (strictly NO manual role selection)
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F8FA] p-4 sm:p-6">
      <div className="max-w-md w-full mx-auto p-6 sm:p-8 rounded-2xl border border-[#E2E5EA] bg-white shadow-sm space-y-6">
        <div className="flex justify-center pb-3 border-b border-[#E2E5EA]">
          <Logo variant="full" size="md" />
        </div>

        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-amber-50 border border-amber-200 text-amber-600 mb-2">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <h1 className="text-xl font-bold text-[#111827]">
            Role Assignment Pending
          </h1>
          <p className="text-sm text-[#6B7280] leading-relaxed">
            Signed in as{" "}
            <span className="font-semibold text-[#111827]">
              {user?.emailAddresses?.[0]?.emailAddress || "Officer"}
            </span>
            .
          </p>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-900 space-y-2">
          <div className="flex items-center gap-2 font-semibold text-amber-800">
            <Clock className="h-4 w-4 shrink-0" />
            <span>Administrator Approval Required</span>
          </div>
          <p className="leading-relaxed text-amber-800/90">
            Your account has been authenticated via Clerk, but no departmental or partner role has been attached to your profile yet.
          </p>
          <div className="pt-2 border-t border-amber-200/60 font-mono text-[11px] text-amber-700">
            User ID: {user?.id}
          </div>
        </div>

        <div className="rounded-lg border border-[#E2E5EA] bg-[#F7F8FA] p-3 text-xs text-[#6B7280] space-y-1.5">
          <div className="flex items-center gap-1.5 font-semibold text-[#111827]">
            <KeyRound className="h-3.5 w-3.5 text-[#0F62B4]" />
            <span>Supported Roles in Clerk Metadata:</span>
          </div>
          <p className="font-mono text-[11px] text-[#4B5563]">
            DEPARTMENT_OFFICER · INNOVATION_CELL · UNIVERSITY · INDUSTRY_CSR · ADMIN
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#E2E5EA] text-xs">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-[#0F62B4] hover:underline font-medium"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Citizen Portal
          </Link>
          <SignOutButton>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E2E5EA] bg-white text-[#6B7280] hover:text-[#111827] hover:bg-[#F7F8FA] font-medium transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          </SignOutButton>
        </div>
      </div>
    </div>
  );
}
