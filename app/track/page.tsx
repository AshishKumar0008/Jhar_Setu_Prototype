"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { UtilityBar } from "@/components/shell/utility-bar";
import { AppNavbar } from "@/components/shell/app-navbar";
import { CitizenLeftRail } from "@/components/patterns/citizen-left-rail";
import { StatusBadge, StatusCode } from "@/components/patterns/status-badge";
import { PathBadge } from "@/components/patterns/path-badge";
import { ActionDialog } from "@/components/patterns/action-dialog";
import { useLanguage } from "@/lib/i18n/language-context";
import { LocationDisplayMap } from "@/components/patterns/location-display-map";
import {
  Search,
  AlertCircle,
  Plus,
  MapPin,
  FileText,
  Camera,
  CheckCircle2,
  Clock,
  Sparkles,
  Building2,
  HardHat,
  ShieldCheck,
  Info,
  ArrowRight,
  RotateCw,
} from "lucide-react";
import { toast } from "sonner";

interface TimelineStep {
  status: string;
  label: string;
  hindiLabel: string;
  description: string;
  hindiDescription: string;
  date: string;
  isActive: boolean;
  isPast: boolean;
}

interface TrackedCaseData {
  id: string;
  problem: string;
  category: string;
  location: string;
  coordinates: [number, number];
  submittedDate: string;
  assignedDepartment: string;
  path: "A" | "B" | "C";
  status: "SUBMITTED" | "VERIFIED" | "ASSIGNED" | "WORK_IN_PROGRESS" | "RESOLVED";
  evidenceText: string;
  assignedTeam?: string;
}

const DEFAULT_ROAD_CASE: TrackedCaseData = {
  id: "JH-2026-7865",
  problem:
    "Road near the school is badly damaged. During rain it becomes dangerous for students and local residents.",
  category: "Road Infrastructure",
  location: "Near Govt High School, Doranda, Ranchi (Demo Location)",
  coordinates: [23.3283, 85.3262],
  submittedDate: "Today, 09:12 AM",
  assignedDepartment: "Road Construction Department (PWD), Ranchi",
  path: "B",
  status: "SUBMITTED",
  evidenceText: "Citizen Photo (Asphalt erosion >18cm depth) • Verified EXIF Geo-tag",
  assignedTeam: "Road Maintenance Team A",
};

export default function TrackReportPage() {
  const { language, t } = useLanguage();
  const [caseId, setCaseId] = useState("JH-2026-7865");
  const [recoveryPhrase, setRecoveryPhrase] = useState("");
  const [lookupDone, setLookupDone] = useState(true);
  const [lookupError, setLookupError] = useState(false);
  const [addInfoOpen, setAddInfoOpen] = useState(false);
  const [additionalText, setAdditionalText] = useState("");
  const [syncedStatus, setSyncedStatus] = useState<string>("SUBMITTED");

  // Read synced status from department dashboard actions in localStorage if present
  useEffect(() => {
    const readStatus = () => {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("jharsetu_demo_case_7865_status");
        if (stored) {
          setSyncedStatus(stored);
        }
      }
    };

    readStatus();
    window.addEventListener("storage", readStatus);
    return () => window.removeEventListener("storage", readStatus);
  }, []);

  const activeCase: TrackedCaseData = {
    ...DEFAULT_ROAD_CASE,
    id: caseId.trim().toUpperCase() || DEFAULT_ROAD_CASE.id,
    status: (syncedStatus as any) || DEFAULT_ROAD_CASE.status,
  };

  const handleLookup = () => {
    const query = caseId.trim().toUpperCase();
    if (query.startsWith("JH") || query.length > 0) {
      setLookupDone(true);
      setLookupError(false);
      toast.success("Case Record Loaded", {
        description: `Displaying live tracking details for ${query}.`,
      });
    } else {
      setLookupDone(false);
      setLookupError(true);
    }
  };

  const handleAddInfoSubmit = () => {
    setAddInfoOpen(false);
    toast.success("Information Submitted", {
      description: "Additional details appended to case file. Officer notified.",
    });
    setAdditionalText("");
  };

  // Generate dynamic timeline steps according to the live status
  const currentStatus = activeCase.status;

  const isVerified =
    currentStatus === "VERIFIED" ||
    currentStatus === "ASSIGNED" ||
    currentStatus === "WORK_IN_PROGRESS" ||
    currentStatus === "RESOLVED";

  const isAssigned =
    currentStatus === "ASSIGNED" ||
    currentStatus === "WORK_IN_PROGRESS" ||
    currentStatus === "RESOLVED";

  const isInProgress =
    currentStatus === "WORK_IN_PROGRESS" || currentStatus === "RESOLVED";

  const isResolved = currentStatus === "RESOLVED";

  const timelineSteps: TimelineStep[] = [
    {
      status: "SUBMITTED",
      label: "Received & Registered",
      hindiLabel: "प्राप्त व पंजीकृत",
      description:
        "Your road complaint was registered in the system with verified GPS coordinates.",
      hindiDescription:
        "आपकी सड़क शिकायत सत्यापित जीपीएस निर्देशांक के साथ प्रणाली में दर्ज की गई।",
      date: "Today, 09:12 AM",
      isPast: true,
      isActive: currentStatus === "SUBMITTED",
    },
    {
      status: "AI_PROCESSED",
      label: "AI Multi-modal Analysis Completed",
      hindiLabel: "एआई बहु-मॉडल विश्लेषण पूर्ण",
      description:
        "Gemini Vision verified asphalt cratering (>18cm depth). Recommended Path B (Government Action).",
      hindiDescription:
        "एआई ने सड़क पर गहरे गड्ढे (>18 सेमी) की पुष्टि की और सरकारी कार्रवाई (पाथ बी) की अनुशंसा की।",
      date: "Today, 09:12 AM",
      isPast: isVerified || isAssigned || isInProgress || isResolved,
      isActive: currentStatus === "SUBMITTED",
    },
    {
      status: "NEEDS_HUMAN_REVIEW",
      label: "Department Officer Verified",
      hindiLabel: "विभागीय अधिकारी द्वारा सत्यापित",
      description: isVerified
        ? "Officer reviewed physical hazard and confirmed PWD municipal jurisdiction."
        : "Awaiting Zonal Officer review on Department Dashboard.",
      hindiDescription: isVerified
        ? "अधिकारी ने भौतिक खतरे की समीक्षा की और पीडब्ल्यूडी अधिकार क्षेत्र की पुष्टि की।"
        : "विभागीय डैशबोर्ड पर जोनल अधिकारी समीक्षा की प्रतीक्षा है।",
      date: isVerified ? "Today, 09:15 AM" : "Pending",
      isPast: isAssigned || isInProgress || isResolved,
      isActive: currentStatus === "VERIFIED",
    },
    {
      status: "ASSIGNED",
      label: "Field Team Dispatched",
      hindiLabel: "फील्ड टीम आवंटित",
      description: isAssigned
        ? "Road Maintenance Team A assigned for on-site inspection and patch repair."
        : "Field team scheduling pending officer approval.",
      hindiDescription: isAssigned
        ? "सड़क मरम्मत दल ए को ऑन-साइट निरीक्षण और पैच मरम्मत के लिए सौंपा गया।"
        : "अधिकारी की मंजूरी के बाद फील्ड टीम आवंटन किया जाएगा।",
      date: isAssigned ? "Today, 09:16 AM" : "Pending",
      isPast: isInProgress || isResolved,
      isActive: currentStatus === "ASSIGNED",
    },
    {
      status: "IN_PROGRESS",
      label: isResolved ? "Work Completed & Resolved" : "Field Work in Progress",
      hindiLabel: isResolved ? "कार्य पूर्ण व समाधान" : "फील्ड कार्य प्रगति पर",
      description: isResolved
        ? "Surface repaving and safety audit certified by Executive Engineer."
        : isInProgress
        ? "On-site asphalt patch compaction actively underway on Doranda school road."
        : "Field work will begin following team deployment.",
      hindiDescription: isResolved
        ? "कार्यकारी अभियंता द्वारा सड़क मरम्मत और सुरक्षा प्रमाणीकरण पूर्ण।"
        : isInProgress
        ? "डोरंडा स्कूल मार्ग पर डामर पैच मरम्मत का कार्य तेजी से प्रगति पर है।"
        : "दल तैनाती के बाद फील्ड कार्य शुरू होगा।",
      date: isResolved
        ? "Today, 09:45 AM"
        : isInProgress
        ? "Today, 09:20 AM"
        : "Scheduled",
      isPast: isResolved,
      isActive: isInProgress,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-base)] text-[var(--text-primary)]">
      {/* Utility Bar + Navbar */}
      <UtilityBar />
      <AppNavbar isPublic />

      {/* ───── Two-Column Layout ───── */}
      <div className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* ── LEFT RAIL (shared component) ── */}
          <CitizenLeftRail activePage="track" />

          {/* ── MAIN CONTENT ── */}
          <main id="main-content" className="flex-1 min-w-0 space-y-6">
            {/* Eyebrow + Heading */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--action-track)] mb-1">
                {t("trackPage.eyebrow")}
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] leading-tight">
                {t("trackPage.title")}
              </h1>
              <p className="text-xs text-[#6B7280] mt-1">
                Real-time tracking of civic grievances connected directly with Department Officer action.
              </p>
            </div>

            {/* ── Lookup Form ── */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[var(--border-default)] shadow-xs space-y-3">
              <div className="space-y-1.5">
                <label
                  htmlFor="case-id"
                  className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider"
                >
                  {t("trackPage.caseIdLabel")}
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      id="case-id"
                      type="text"
                      value={caseId}
                      onChange={(e) => {
                        setCaseId(e.target.value);
                        setLookupError(false);
                      }}
                      placeholder="e.g. JH-2026-7865"
                      className="w-full rounded-xl border border-[var(--border-default)] bg-[#F7F8FA] px-4 py-2.5 text-sm font-mono font-semibold text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[#0F62B4] focus:bg-white"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleLookup}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-[var(--action-track)] hover:bg-[#0c1a33] text-white shadow-xs transition-all cursor-pointer"
                  >
                    <Search className="h-4 w-4" />
                    {t("trackPage.lookUpBtn")}
                  </button>
                </div>
              </div>

              {/* Demo Case Quick-Select Pill */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#F3F4F6] text-xs">
                <div className="flex items-center gap-1.5 text-[#6B7280]">
                  <Sparkles className="h-3.5 w-3.5 text-[#0F62B4]" />
                  <span>Demo Active Case:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setCaseId("JH-2026-7865");
                      setLookupDone(true);
                      setLookupError(false);
                    }}
                    className="font-mono font-bold text-[#0F62B4] hover:underline bg-blue-50 px-2 py-0.5 rounded border border-blue-200"
                  >
                    JH-2026-7865
                  </button>
                </div>
                <Link
                  href="/dashboard/department"
                  className="text-[#0F62B4] hover:underline font-semibold flex items-center gap-1 text-[11px]"
                >
                  <span>Officer Dashboard</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* ── Error State ── */}
            {lookupError && (
              <div className="rounded-xl border border-[var(--state-error)]/30 bg-[var(--state-error)]/5 p-5 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-[var(--state-error)] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-[var(--state-error)]">
                    {t("trackPage.notFoundError")}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    {t("trackPage.notFoundHelp")}
                  </p>
                </div>
              </div>
            )}

            {/* ── Lookup Result: Problem Statement + Address + Timeline + Summary ── */}
            {lookupDone && (
              <div className="space-y-6">
                {/* ── 1. CITIZEN PROBLEM & ROAD ADDRESS CARD ── */}
                <div className="rounded-2xl border border-[var(--border-default)] bg-white p-5 sm:p-6 space-y-5 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E2E5EA] flex-wrap gap-2">
                    <div>
                      <h2 className="text-sm sm:text-base font-bold text-[#111827] flex items-center gap-2">
                        <FileText className="h-4 w-4 text-[#0F62B4]" />
                        <span>{t("trackPage.problemStatement")}</span>
                      </h2>
                      <p className="text-xs text-[#6B7280] mt-0.5">
                        Recorded on {activeCase.submittedDate} · Public Civic Grievance
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[#0F62B4] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                        {activeCase.id}
                      </span>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-bold border ${
                          isInProgress
                            ? "bg-purple-50 text-purple-800 border-purple-200"
                            : isAssigned
                            ? "bg-amber-50 text-amber-800 border-amber-200"
                            : isVerified
                            ? "bg-indigo-50 text-indigo-800 border-indigo-200"
                            : "bg-blue-50 text-blue-800 border-blue-200"
                        }`}
                      >
                        {activeCase.status.replace(/_/g, " ")}
                      </span>
                    </div>
                  </div>

                  {/* Citizen's Problem Description Text */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                      Citizen Reported Issue
                    </label>
                    <div className="p-4 rounded-xl bg-[#F7F8FA] border border-[#E2E5EA] text-sm text-[#111827] leading-relaxed font-semibold">
                      "{activeCase.problem}"
                    </div>
                  </div>

                  {/* Road Address & Evidence 2-Column Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Road Address Box */}
                    <div className="p-4 rounded-xl border border-[#E2E5EA] bg-[#F7F8FA] space-y-2 flex flex-col justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                          <MapPin className="h-4 w-4 text-[#0F62B4]" />
                          <span>{t("trackPage.roadAddress")}</span>
                        </div>
                        <p className="text-xs sm:text-sm font-bold text-[#111827] leading-snug">
                          {activeCase.location}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[#E2E5EA]/70 flex items-center justify-between text-xs">
                        <span className="font-mono text-[11px] font-semibold text-[#0F62B4] bg-white px-2 py-0.5 rounded border border-blue-200">
                          📍 {activeCase.coordinates[0]}° N, {activeCase.coordinates[1]}° E
                        </span>
                        <span className="text-[#6B7280] text-[11px]">
                          Doranda Zonal PWD
                        </span>
                      </div>
                    </div>

                    {/* Evidence & Photo Box */}
                    <div className="p-4 rounded-xl border border-[#E2E5EA] bg-[#F7F8FA] space-y-2 flex flex-col justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                          <Camera className="h-4 w-4 text-[#0F62B4]" />
                          <span>{t("trackPage.photoProof")}</span>
                        </div>
                        <div className="text-xs text-[#111827] font-semibold flex items-center gap-2">
                          <div className="h-10 w-12 rounded-lg bg-slate-200 border border-slate-300 flex flex-col items-center justify-center text-[9px] text-slate-700 font-bold shrink-0">
                            <span>📷 ROAD</span>
                            <span className="text-[8px] font-normal">&gt;18cm</span>
                          </div>
                          <span className="line-clamp-2 text-xs">
                            Citizen Photograph: Asphalt cratering &amp; sub-base erosion
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#E2E5EA]/70 flex items-center justify-between text-xs">
                        <span className="text-[10px] text-green-700 font-bold bg-green-50 px-2 py-0.5 rounded border border-green-200">
                          ✓ {t("trackPage.verifiedExif")}
                        </span>
                        <span className="text-[#6B7280] text-[11px]">2.4 MB EXIF</span>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Leaflet Map for Incident Pin */}
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between text-xs text-[#6B7280]">
                      <span className="font-semibold flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-[#0F62B4]" />
                        Exact Road Incident Pin (Citizen GPS Co-ordinates)
                      </span>
                      <span className="text-[11px] text-[#0F62B4] font-medium">
                        Interactive Map
                      </span>
                    </div>
                    <LocationDisplayMap
                      position={activeCase.coordinates}
                      label={`${activeCase.id}: ${activeCase.location}`}
                      className="h-44 w-full rounded-xl border border-[#E2E5EA] shadow-2xs"
                    />
                  </div>
                </div>

                {/* ── 2. GRIEVANCE STATUS & ACTION TIMELINE ── */}
                <div className="rounded-2xl border border-[var(--border-default)] bg-white p-5 sm:p-6 shadow-xs">
                  <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#E2E5EA]">
                    <div>
                      <h2 className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
                        {t("trackPage.reportStatusTitle")}
                      </h2>
                      <p className="text-xs text-[#6B7280]">
                        Step-by-step progress audit synchronized with Department Officer actions.
                      </p>
                    </div>
                    {isInProgress && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
                        <span className="h-2 w-2 rounded-full bg-purple-600 animate-ping" />
                        ACTIVE WORK
                      </span>
                    )}
                  </div>

                  <div className="relative space-y-0">
                    {timelineSteps.map((step, i) => (
                      <div
                        key={step.label}
                        className="flex gap-4 items-start relative"
                      >
                        {/* Vertical line connector */}
                        <div className="flex flex-col items-center shrink-0">
                          <div
                            className={`h-3.5 w-3.5 rounded-full border-2 shrink-0 ${
                              step.isPast
                                ? "bg-[var(--state-success)] border-[var(--state-success)]"
                                : step.isActive
                                ? "bg-[#0F62B4] border-[#0F62B4] ring-4 ring-blue-100"
                                : "bg-[var(--border-default)] border-[var(--border-default)]"
                            }`}
                          />
                          {i < timelineSteps.length - 1 && (
                            <div
                              className={`w-0.5 h-14 ${
                                step.isPast
                                  ? "bg-[var(--state-success)]"
                                  : "bg-[var(--border-default)]"
                              }`}
                            />
                          )}
                        </div>

                        {/* Step content */}
                        <div className="pb-6 min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`text-sm font-bold ${
                                step.isActive
                                  ? "text-[#0F62B4]"
                                  : step.isPast
                                  ? "text-[var(--text-primary)]"
                                  : "text-[var(--text-muted)]"
                              }`}
                            >
                              {language === "hi" ? step.hindiLabel : step.label}
                            </span>
                            {(step.isPast || step.isActive) && (
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                                  step.isPast
                                    ? "bg-green-100 text-green-800"
                                    : "bg-blue-100 text-blue-800 font-bold"
                                }`}
                              >
                                {step.isPast ? "COMPLETED" : "CURRENT STAGE"}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#4B5563] mt-1 leading-relaxed">
                            {language === "hi" ? step.hindiDescription : step.description}
                          </p>
                          <p className="text-[11px] text-[#9CA3AF] mt-1 font-mono">
                            {step.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── 3. REDACTED SUMMARY TABLE ── */}
                <div className="rounded-2xl border border-[var(--border-default)] bg-white divide-y divide-[var(--border-default)] overflow-hidden shadow-xs">
                  <div className="px-5 py-3.5 flex items-center justify-between">
                    <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                      {t("trackPage.caseId")}
                    </span>
                    <span className="text-sm font-mono font-bold text-[var(--accent-primary)]">
                      {activeCase.id}
                    </span>
                  </div>

                  <div className="px-5 py-3.5 flex items-center justify-between">
                    <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                      {t("trackPage.category")}
                    </span>
                    <span className="text-sm text-[var(--text-primary)] font-semibold">
                      {activeCase.category}
                    </span>
                  </div>

                  <div className="px-5 py-3.5 flex items-center justify-between">
                    <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                      {t("trackPage.roadAddress")}
                    </span>
                    <span className="text-sm text-[var(--text-primary)] font-medium text-right max-w-sm">
                      {activeCase.location}
                    </span>
                  </div>

                  <div className="px-5 py-3.5 flex items-center justify-between">
                    <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                      {t("trackPage.assignedDepartment")}
                    </span>
                    <span className="text-sm text-[var(--text-primary)] font-semibold flex items-center gap-1.5">
                      <Building2 className="h-4 w-4 text-[#0F62B4]" />
                      <span>{activeCase.assignedDepartment}</span>
                    </span>
                  </div>

                  <div className="px-5 py-3.5 flex items-center justify-between">
                    <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                      {t("trackPage.submittedDate")}
                    </span>
                    <span className="text-sm text-[var(--text-primary)]">
                      {activeCase.submittedDate}
                    </span>
                  </div>

                  <div className="px-5 py-3.5 flex items-center justify-between">
                    <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                      {t("trackPage.currentPath")}
                    </span>
                    <PathBadge path="B" />
                  </div>
                </div>

                {/* ── 4. ADD INFORMATION BUTTON ── */}
                <button
                  type="button"
                  onClick={() => setAddInfoOpen(true)}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl border border-[var(--border-default)] bg-white text-[var(--text-primary)] text-sm font-semibold hover:bg-[var(--bg-base)] transition-colors cursor-pointer shadow-xs"
                >
                  <Plus className="h-4 w-4 text-[var(--accent-primary)]" />
                  {t("trackPage.addInfoBtn")}
                </button>

                {/* Add Information Dialog */}
                <ActionDialog
                  open={addInfoOpen}
                  onOpenChange={setAddInfoOpen}
                  title={t("trackPage.addInfoTitle")}
                  description={t("trackPage.addInfoDesc")}
                  confirmLabel={t("trackPage.submitInfoBtn")}
                  cancelLabel={t("common.cancel")}
                  onConfirm={handleAddInfoSubmit}
                  onCancel={() => setAddInfoOpen(false)}
                >
                  <div className="space-y-3">
                    <textarea
                      rows={3}
                      value={additionalText}
                      onChange={(e) => setAdditionalText(e.target.value)}
                      placeholder={t("trackPage.addInfoPlaceholder")}
                      className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-base)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent resize-none"
                    />
                    <p className="text-[11px] text-[var(--text-muted)] italic">
                      {t("trackPage.uiDemoNotice")}
                    </p>
                  </div>
                </ActionDialog>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Prototype Demo Disclaimer Footer */}
      <footer className="w-full bg-[var(--brand-navy)] text-white mt-auto py-8 px-4">
        <div className="mx-auto max-w-7xl text-center space-y-2 text-xs text-white/60">
          <p className="font-semibold text-white/90">
            JharSetu — {t("footer.portalName")}
          </p>
          <p className="text-amber-300/90 font-medium">
            {t("footer.disclaimer")}
          </p>
          <p className="text-[11px] text-white/40">
            {t("footer.sihBadge")}
          </p>
        </div>
      </footer>
    </div>
  );
}
