"use client";

import React, { useState } from "react";
import { AppNavbar, UserRole } from "@/components/shell/app-navbar";

/**
 * Dev-only role type for the shell testbench role switcher.
 * Matches the 5 authenticated roles from feature-spec 06-auth-and-dashboards.md.
 * Citizen is listed here for UI preview ONLY — not an authenticated role in production.
 */
type DevRole = "ADMIN" | "DEPARTMENT_OFFICER" | "INNOVATION_CELL" | "UNIVERSITY" | "INDUSTRY" | "citizen";
import { RoleSidebar } from "@/components/shell/role-sidebar";
import { PathBadge } from "@/components/patterns/path-badge";
import {
  StatusBadge,
  TrustBadge,
  AISuggestionBadge,
  StatusCode,
} from "@/components/patterns/status-badge";
import { DetailTabs, DetailTabContent } from "@/components/patterns/detail-tabs";
import { ActionDialog } from "@/components/patterns/action-dialog";
import { EmptyState } from "@/components/patterns/empty-state";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { toast } from "sonner";

import {
  FileText,
  PanelLeftOpen,
} from "lucide-react";

export default function ShellTestbenchPage() {
  const [lang, setLang] = useState<"en" | "hi">("en");
  const [selectedRole, setSelectedRole] = useState<DevRole>("INNOVATION_CELL");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState<string>("dashboard");

  // Dialog Pattern state demonstration
  const [dialogOpen, setDialogOpen] = useState(false);
  const [certDialogOpen, setCertDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock user names for demo preview
  const ROLE_NAMES: Record<DevRole, string> = {
    citizen: "Public Citizen",
    ADMIN: "System Administrator",
    DEPARTMENT_OFFICER: "Rajesh Murmu (EE, DW&S)",
    INNOVATION_CELL: "Dr. Ananya Verma",
    UNIVERSITY: "Prof. S. K. Roy (BIT Mesra)",
    INDUSTRY: "Tata Steel CSR Lead",
  };

  const triggerCivicToast = () => {
    toast.success("Acknowledgement Receipt Generated", {
      description: "Case ID #JH-2026-09-0012 has been recorded in audit ledger.",
    });
  };

  const handleConfirmDecision = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setDialogOpen(false);
      toast.success("Reviewer Decision Recorded", {
        description: "Path C proposed with reason code RES-04. Second review required.",
      });
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8FA] text-[#111827]">
      {/* Official Government AppNavbar with 3px Tricolor Accent Line */}
      {/* Simplified navbar — role switcher lives in the testbench controls below, not in the navbar */}
      <AppNavbar
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        currentLang={lang}
        onLanguageChange={setLang}
        pageTitle={`Dev Testbench [${selectedRole}]`}
      />

      {/* Floating Role Sidebar: Slides in from left, floats above page canvas without pushing content */}
      <RoleSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentRole={selectedRole}
        activeItemId={activeNavItem}
        onSelectItem={(item) => {
          setActiveNavItem(item);
          toast.info(`Navigated to: ${item}`);
        }}
      />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
        {/* Role Testbench & Interactive Shell Controller */}
        <section className="rounded-xl border border-[#0F62B4]/30 bg-[#0F62B4]/5 p-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-2 w-2 rounded-full bg-[#0F62B4]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#0F62B4]">
                  Shell Interactive Testbench (Phase 02)
                </span>
              </div>
              <h2 className="text-sm font-semibold text-[#111827]">
                Active Role: <span className="text-[#0F62B4] font-bold capitalize">{selectedRole.replace("_", " ")}</span>
                {selectedRole === "citizen" ? " (Public Page — No Sidebar Toggle)" : " (Internal Role — Has Sidebar Toggle)"}
              </h2>
              <p className="text-xs text-[#6B7280]">
                Select any of the 7 system roles to verify navbar state, sidebar menu tree items, and role-specific views.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {(
                [
                  "citizen",
                  "ADMIN",
                  "DEPARTMENT_OFFICER",
                  "INNOVATION_CELL",
                  "UNIVERSITY",
                  "INDUSTRY",
                ] as DevRole[]
              ).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => {
                    setSelectedRole(role);
                    if (role === "citizen") {
                      setSidebarOpen(false);
                    } else {
                      setSidebarOpen(true);
                    }
                  }}
                  className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                    selectedRole === role
                      ? "bg-[#0F62B4] text-white font-bold shadow-xs"
                      : "bg-white border border-[#E2E5EA] text-[#111827] hover:border-[#0F62B4]/50"
                  }`}
                >
                  {role === "citizen" ? "Citizen (Public)" : role.replace(/_/g, " ")}
                </button>
              ))}

              {selectedRole !== "citizen" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSidebarOpen(true)}
                  className="min-h-[32px] text-xs gap-1.5 border-[#0F62B4]/40 text-[#0F62B4] bg-white hover:bg-[#0F62B4]/10"
                >
                  <PanelLeftOpen className="h-3.5 w-3.5" />
                  <span>Open {selectedRole.replace("_", " ")} Sidebar</span>
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Hero Notice / Civic Introduction */}
        <section
          className="rounded-xl border border-[#E2E5EA] bg-white p-6 sm:p-8"
          aria-labelledby="hero-title"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <TrustBadge type="jharkhand-pilot" />
                <TrustBadge type="verified-institution" />
                <AISuggestionBadge confidence={0.94} />
              </div>
              <h1
                id="hero-title"
                className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111827]"
              >
                {lang === "en"
                  ? "JharSetu — Innovation Gap Exchange for Jharkhand"
                  : "झारसेतु — झारखंड नवाचार अंतर विनिमय मंच"}
              </h1>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                {lang === "en"
                  ? "A privacy-preserving, human-governed platform turning citizen problem reports into accountable civic outcomes: Existing Service Referral (Path A), Grievance Routing (Path B), or an Innovation Gap Certificate for field pilots (Path C)."
                  : "नागरिक समस्याओं को जवाबदेह परिणामों में बदलने वाला मानव-नियंत्रित मंच: सेवा रेफरल (पथ A), शिकायत निवारण (पथ B), अथवा नवाचार अंतर प्रमाण पत्र (पथ C)।"}
              </p>
            </div>

            {/* ONLY ONE Solid-filled Primary Button per view */}
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Button
                variant="default"
                size="lg"
                onClick={triggerCivicToast}
                className="min-h-[44px] bg-[#0F62B4] hover:bg-[#0D5299] text-white font-semibold text-sm px-6 shadow-xs rounded-md"
              >
                <FileText className="h-4 w-4 mr-2" />
                {lang === "en" ? "Report a Problem" : "समस्या दर्ज करें"}
              </Button>
            </div>
          </div>

          <Separator className="my-6 bg-[#E2E5EA]" />

          {/* Tri-path visual routing tokens */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border border-[#E2E5EA] bg-[#F7F8FA]">
              <div className="flex items-center justify-between mb-2">
                <PathBadge path="A" />
                <span className="text-[11px] font-mono text-[#6B7280]">JharSewa</span>
              </div>
              <h2 className="text-sm font-semibold text-[#111827]">
                Existing Service Referral
              </h2>
              <p className="text-xs text-[#6B7280] mt-1">
                Direct hand-off to pre-existing state programs and certified welfare schemes.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-[#E2E5EA] bg-[#F7F8FA]">
              <div className="flex items-center justify-between mb-2">
                <PathBadge path="B" />
                <span className="text-[11px] font-mono text-[#6B7280]">CPGRAMS/Dept</span>
              </div>
              <h2 className="text-sm font-semibold text-[#111827]">
                Accountable Grievance Routing
              </h2>
              <p className="text-xs text-[#6B7280] mt-1">
                Structured SLA routing to responsible field departments with evidence tracking.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-[#E2E5EA] bg-[#F7F8FA]">
              <div className="flex items-center justify-between mb-2">
                <PathBadge path="C" />
                <span className="text-[11px] font-mono text-[#6B7280]">SIH 26043 Core</span>
              </div>
              <h2 className="text-sm font-semibold text-[#111827]">
                Innovation Gap Certificate
              </h2>
              <p className="text-xs text-[#6B7280] mt-1">
                Evidence-verified structural void triggering university pilot and CSR support.
              </p>
            </div>
          </div>
        </section>

        {/* Unified Status & Badge Pattern Gallery */}
        <section
          className="rounded-xl border border-[#E2E5EA] bg-white p-6 sm:p-8 space-y-6"
          aria-labelledby="badge-gallery-title"
        >
          <div className="space-y-1">
            <h2 id="badge-gallery-title" className="text-lg font-bold text-[#111827]">
              Path, Trust & Status Badge System
            </h2>
            <p className="text-xs text-[#6B7280]">
              Centralized color token map per <code>context/ui-context.md</code>. Never renders ad-hoc colors.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#6B7280] mb-2">
                1. Path Badges (Path A / B / C)
              </h3>
              <div className="flex flex-wrap gap-2.5">
                <PathBadge path="A" />
                <PathBadge path="B" />
                <PathBadge path="C" />
              </div>
            </div>

            <Separator className="bg-[#E2E5EA]" />

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#6B7280] mb-2">
                2. Trust Cues & AI Suggestion Distinction
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <TrustBadge type="jharkhand-pilot" />
                <TrustBadge type="verified-institution" />
                <TrustBadge type="official-handoff" />
                <AISuggestionBadge confidence={0.88} />
              </div>
              <p className="text-[11px] text-[#6B7280] mt-1.5">
                Notice: The AI suggestion badge uses an amber warning glow and distinct wording so reviewers never mistake AI output for official verified authority decisions.
              </p>
            </div>

            <Separator className="bg-[#E2E5EA]" />

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#6B7280] mb-2">
                3. Unified Workflow Status Badges (Shared Token Map)
              </h3>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    "SUBMITTED",
                    "AI_PROCESSED",
                    "NEEDS_HUMAN_REVIEW",
                    "NEEDS_INFORMATION",
                    "PATH_A_REFERRED",
                    "PATH_B_ROUTED",
                    "PATH_C_PROPOSED",
                    "CERTIFICATE_ISSUED",
                    "PASSPORT_PUBLISHED",
                    "PILOT_PENDING",
                    "PILOT_READY",
                    "PILOT_ACTIVE",
                    "CONFIRMED",
                    "RESOLVED",
                    "ADOPTED",
                    "REJECTED",
                    "CLOSED",
                  ] as StatusCode[]
                ).map((st) => (
                  <StatusBadge key={st} status={st} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Dialog Pattern Demonstrator */}
        <section
          className="rounded-xl border border-[#E2E5EA] bg-white p-6 sm:p-8 space-y-6"
          aria-labelledby="dialog-pattern-title"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 id="dialog-pattern-title" className="text-lg font-bold text-[#111827]">
                Civic Dialog Pattern
              </h2>
              <p className="text-xs text-[#6B7280]">
                Standardized confirmation shape with title, description, and footer actions (rounded-2xl overlay per <code>ui-context.md</code>).
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDialogOpen(true)}
                className="min-h-[36px] text-xs font-semibold border-[#E2E5EA] text-[#111827] hover:bg-[#F7F8FA]"
              >
                Open Reviewer Decision Dialog
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCertDialogOpen(true)}
                className="min-h-[36px] text-xs font-semibold border-[#7C3AED]/40 text-[#7C3AED] hover:bg-[#7C3AED]/10"
              >
                Open IGC Certificate Dialog
              </Button>
            </div>
          </div>

          {/* Action Dialog 1: Reviewer Decision */}
          <ActionDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            title="Confirm Review Decision — Path C Proposal"
            description="You are proposing an Innovation Gap Certificate for Case #JH-2026-09-0012 (High Arsenic Concentration in Drinking Water, Sahibganj). This requires secondary reviewer verification."
            confirmLabel="Submit Decision & Notify Reviewer 2"
            cancelLabel="Cancel"
            isConfirmLoading={isSubmitting}
            onConfirm={handleConfirmDecision}
            onCancel={() => setDialogOpen(false)}
          >
            <div className="space-y-3 rounded-lg border border-[#E2E5EA] bg-[#F7F8FA] p-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#111827]">Reason Code:</span>
                <span className="font-mono text-[#0F62B4] font-bold">RES-04 (No standard scheme applicable)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#111827]">Assigned Path:</span>
                <PathBadge path="C" />
              </div>
              <p className="text-[#6B7280] text-[11px]">
                Audit invariant: A record will be written to <code>audit_events</code> before state transition.
              </p>
            </div>
          </ActionDialog>

          {/* Action Dialog 2: Certificate Issuance */}
          <ActionDialog
            open={certDialogOpen}
            onOpenChange={setCertDialogOpen}
            title="Issue Innovation Gap Certificate (IGC-JH-2026-004)"
            description="Second human reviewer sign-off. Generating immutable cryptographic certificate for university pilot matching."
            confirmLabel="Authorize & Issue Certificate"
            cancelLabel="Return to Queue"
            onConfirm={() => {
              setCertDialogOpen(false);
              toast.success("Certificate IGC-JH-2026-004 Issued", {
                description: "Challenge Passport now open for University Capability matching.",
              });
            }}
            onCancel={() => setCertDialogOpen(false)}
          >
            <div className="space-y-2 text-xs">
              <p className="font-medium text-[#111827]">Summary of Evidence Verified:</p>
              <ul className="list-disc list-inside text-[#6B7280] space-y-1">
                <li>Lab arsenic test report confirms 0.08 mg/L (standard: &lt;0.01 mg/L)</li>
                <li>Geographical cluster confirms 3 panchayats affected (population &gt;4,200)</li>
                <li>Department of Drinking Water confirms no active pipeline sanction</li>
              </ul>
            </div>
          </ActionDialog>
        </section>

        {/* Blueprint Section 11 Pilot Screen Detail Tabs Pattern */}
        <section
          className="rounded-xl border border-[#E2E5EA] bg-white p-6 sm:p-8 space-y-6"
          aria-labelledby="pilot-tabs-title"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <PathBadge path="C" />
              <TrustBadge type="jharkhand-pilot" />
            </div>
            <h2 id="pilot-tabs-title" className="text-lg font-bold text-[#111827]">
              Section 11 Pilot Detail Tabs Pattern (Generic DetailTabs)
            </h2>
            <p className="text-xs text-[#6B7280]">
              Tabs sit directly under page heading, full width on mobile, left-aligned on desktop (never centered). Accepts dynamic tab configurations.
            </p>
          </div>

          <DetailTabs defaultValue="overview">
            <DetailTabContent value="overview" className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-[#E2E5EA] bg-[#F7F8FA] space-y-1">
                  <span className="text-xs font-semibold text-[#6B7280]">Pilot Designation</span>
                  <p className="text-sm font-bold text-[#111827]">
                    Low-Cost Solar Electrocoagulation Arsenic Remediation
                  </p>
                  <p className="text-xs text-[#6B7280]">
                    Location: Sahibganj District (Udhwa Block) • Target Beneficiaries: 4,200 villagers
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-[#E2E5EA] bg-[#F7F8FA] space-y-1">
                  <span className="text-xs font-semibold text-[#6B7280]">Matched University Team</span>
                  <p className="text-sm font-bold text-[#111827]">
                    Birla Institute of Technology (BIT) Mesra — Environmental Engineering
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <TrustBadge type="verified-institution" />
                    <span className="text-xs text-[#16A34A] font-semibold">Match Score: 92/100</span>
                  </div>
                </div>
              </div>
            </DetailTabContent>

            <DetailTabContent value="timeline" className="pt-6">
              <div className="border border-[#E2E5EA] rounded-lg p-4 bg-[#F7F8FA]">
                <div className="text-xs font-semibold text-[#111827] mb-3">Field Pilot Milestones</div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-xs">
                    <span className="h-2 w-2 rounded-full bg-[#16A34A] mt-1.5" />
                    <div>
                      <div className="font-semibold text-[#111827]">PILOT_READINESS_APPROVED</div>
                      <div className="text-[#6B7280]">Government Secretary signed readiness checklist after site survey.</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-xs">
                    <span className="h-2 w-2 rounded-full bg-[#0F62B4] mt-1.5" />
                    <div>
                      <div className="font-semibold text-[#111827]">COMMITMENT_LOCKED</div>
                      <div className="text-[#6B7280]">Tata Steel CSR locked ₹15,00,000 deployment support in ledger.</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-xs">
                    <span className="h-2 w-2 rounded-full bg-[#7C3AED] mt-1.5" />
                    <div>
                      <div className="font-semibold text-[#111827]">REVIEWER_SIGN_OFF</div>
                      <div className="text-[#6B7280]">Two human reviewers recorded IGC eligibility sign-off with reason code.</div>
                    </div>
                  </div>
                </div>
              </div>
            </DetailTabContent>

            <DetailTabContent value="measurements" className="pt-6">
              <div className="p-4 rounded-lg border border-[#E2E5EA] bg-white">
                <h3 className="text-sm font-semibold text-[#111827] mb-2">Field Sensor Measurements</h3>
                <p className="text-xs text-[#6B7280] mb-4">Baseline: 0.08 mg/L arsenic. Current pilot reading: 0.008 mg/L.</p>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4 bg-[#E2E5EA]" />
                  <Skeleton className="h-4 w-1/2 bg-[#E2E5EA]" />
                </div>
              </div>
            </DetailTabContent>

            <DetailTabContent value="evidence" className="pt-6">
              <ScrollArea className="h-32 rounded-md border border-[#E2E5EA] p-4 bg-white">
                <div className="text-xs space-y-2 text-[#6B7280]">
                  <p className="font-medium text-[#111827]">Uploaded Lab Reports (Signed Object Storage):</p>
                  <p>1. sahibganj_water_test_batch_01.pdf (SHA-256: 7f83b165...)</p>
                  <p>2. field_filter_installation_photo_01.jpg (Exif Geotag: 25.042°N, 87.831°E)</p>
                </div>
              </ScrollArea>
            </DetailTabContent>

            <DetailTabContent value="risks-issues" className="pt-6">
              <Accordion className="w-full bg-white border border-[#E2E5EA] rounded-md px-4">
                <AccordionItem value="item-1" className="border-b-[#E2E5EA]">
                  <AccordionTrigger className="text-xs font-semibold text-[#111827]">
                    Seasonal Monsoon Silt Clogging
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-[#6B7280]">
                    Pre-filtration mesh cleanout protocol scheduled bi-weekly by BIT Mesra pilot team.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </DetailTabContent>

            <DetailTabContent value="commitments" className="pt-6">
              <div className="p-4 rounded-lg border border-[#E2E5EA] bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#111827]">Tata Steel Foundation (CSR)</span>
                  <StatusBadge status="CONFIRMED" label="CONFIRMED: ₹15,00,000" />
                </div>
                <p className="text-xs text-[#6B7280]">
                  Direct commitment ledger entry locked with irrevocable audit token.
                </p>
              </div>
            </DetailTabContent>

            <DetailTabContent value="evaluation" className="pt-6">
              <div className="p-4 rounded-lg border border-[#E2E5EA] bg-white">
                <h3 className="text-xs font-semibold text-[#111827] mb-1">State Evaluation Matrix</h3>
                <p className="text-xs text-[#6B7280]">
                  Target cost: &lt;₹0.15 / liter. Pilot achieved: ₹0.09 / liter with 99.2% uptime.
                </p>
              </div>
            </DetailTabContent>

            <DetailTabContent value="audit" className="pt-6">
              <EmptyState
                title="Immutable Audit Ledger"
                description="All state transitions, AI suggested confidence scores, and reviewer signatures are cryptographically bound."
              />
            </DetailTabContent>
          </DetailTabs>
        </section>
      </main>

      {/* Official Government Footer */}
      <footer className="border-t border-[#E2E5EA] bg-white py-6 mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6B7280]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#111827]">JharSetu</span>
            <span>• Guidelines for Indian Government Websites (GIGW 3.0) Baseline</span>
          </div>
          <p>
            Designed for SIH 26043 Selection Round • Privacy-Preserving Civic & Innovation Exchange
          </p>
        </div>
      </footer>
    </div>
  );
}
