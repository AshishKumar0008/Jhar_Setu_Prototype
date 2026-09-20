"use client";

import React, { useState, useEffect } from "react";
import {
  DashboardShell,
  DashboardNavItem,
} from "@/components/dashboard/dashboard-shell";
import {
  LayoutDashboard,
  Inbox,
  FileCheck2,
  CheckCircle2,
  BarChart3,
  Bell,
  Search,
  Filter,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  UserCheck,
  RotateCcw,
  Sparkles,
  HelpCircle,
  X,
  FileText,
  MapPin,
  ShieldCheck,
  Users,
  HardHat,
  Play,
  Check,
  Layers,
  Info,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/lib/i18n/language-context";
import { LocationDisplayMap } from "@/components/patterns/location-display-map";

export type CaseStatus =
  | "SUBMITTED"
  | "VERIFIED"
  | "ASSIGNED"
  | "WORK_IN_PROGRESS"
  | "RESOLVED"
  | "REJECTED";

export interface TimelineEvent {
  time: string;
  title: string;
  actor: "CITIZEN" | "AI_SYSTEM" | "OFFICER";
  type: "citizen" | "ai" | "officer";
  note?: string;
}

export interface CaseItem {
  id: string;
  problem: string;
  location: string;
  coordinates?: [number, number];
  category: string;
  affectedGroup: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
  evidence: string;
  evidenceType: string;
  evidenceUrl?: string;
  similarComplaint: string;
  recommendedPath: string;
  suggestedAuthority: string;
  aiConfidence: number;
  aiExplanation: string;
  status: CaseStatus;
  submittedAt: string;
  slaHoursLeft: number;
  assignedTeam?: string;
  assignedOfficer?: string;
  expectedAction?: string;
  timeline: TimelineEvent[];
}

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "info" | "warning" | "success";
  read: boolean;
  caseId?: string;
}

const INITIAL_DEMO_CASE: CaseItem = {
  id: "JH-2026-7865",
  problem:
    "Road near the school is badly damaged. During rain it becomes dangerous for students and local residents.",
  location: "Near Govt High School, Doranda, Ranchi (Demo Location)",
  coordinates: [23.3283, 85.3262],
  category: "Road Infrastructure",
  affectedGroup: "Students and local residents",
  severity: "HIGH",
  evidence: "Image + geo-location available",
  evidenceType: "Citizen Photo (Asphalt erosion >18cm depth) • Verified EXIF",
  similarComplaint: "Possible / No duplicate found",
  recommendedPath: "Government Action Required",
  suggestedAuthority: "Road Construction Department (PWD)",
  aiConfidence: 92,
  aiExplanation:
    "Severe surface cratering and sub-base wash-away identified directly adjacent to active primary school corridor. Heavy student pedestrian traffic during morning rush creates imminent collision and slip hazard.",
  status: "SUBMITTED",
  submittedAt: "Today, 09:12 AM",
  slaHoursLeft: 48,
  timeline: [
    {
      time: "09:12 AM",
      title: "Report submitted",
      actor: "CITIZEN",
      type: "citizen",
      note: "Citizen intake via mobile web wizard with GPS tag",
    },
    {
      time: "09:12 AM",
      title: "AI analysis completed",
      actor: "AI_SYSTEM",
      type: "ai",
      note: "Gemini Vision multi-modal verification (92% Confidence)",
    },
    {
      time: "09:12 AM",
      title: "Government Action recommended",
      actor: "AI_SYSTEM",
      type: "ai",
      note: "Assigned Path B: Routed to Road Construction (PWD)",
    },
  ],
};

const SECONDARY_CASES: CaseItem[] = [
  {
    id: "JH-2026-B101",
    problem:
      "Deep crater-like pothole and surface breakdown on Main Road near Bus Stand, causing vehicular hazard.",
    location: "Ward 12, Chaibasa, West Singhbhum",
    coordinates: [22.5532, 85.8078],
    category: "Road Infrastructure",
    affectedGroup: "Commuters & transit buses",
    severity: "HIGH",
    evidence: "2 photos attached (Geo-tagged)",
    evidenceType: "Asphalt cratering inspection",
    similarComplaint: "2 similar complaints nearby",
    recommendedPath: "Government Action Required",
    suggestedAuthority: "Road Construction Department (PWD)",
    aiConfidence: 94,
    aiExplanation: "Severe asphalt erosion (>15cm depth) posing immediate vehicular hazard.",
    status: "SUBMITTED",
    submittedAt: "Today, 08:30 AM",
    slaHoursLeft: 34,
    timeline: [
      { time: "08:30 AM", title: "Report submitted", actor: "CITIZEN", type: "citizen" },
      { time: "08:30 AM", title: "AI analysis completed", actor: "AI_SYSTEM", type: "ai" },
    ],
  },
  {
    id: "JH-2026-B102",
    problem:
      "Damaged stormwater culvert causing road inundation and pavement edge subsidence after rain.",
    location: "Bistupur Market Road, Jamshedpur",
    coordinates: [22.8046, 86.2029],
    category: "Drainage & Culverts",
    affectedGroup: "Local merchants and market visitors",
    severity: "MEDIUM",
    evidence: "1 inspection photo",
    evidenceType: "Culvert blockage documentation",
    similarComplaint: "No duplicate found",
    recommendedPath: "Government Action Required",
    suggestedAuthority: "Road Construction Department (PWD)",
    aiConfidence: 89,
    aiExplanation: "Culvert masonry cracked, water backing onto road surface.",
    status: "VERIFIED",
    submittedAt: "Yesterday, 04:15 PM",
    slaHoursLeft: 56,
    timeline: [
      { time: "04:15 PM", title: "Report submitted", actor: "CITIZEN", type: "citizen" },
      { time: "04:16 PM", title: "AI analysis completed", actor: "AI_SYSTEM", type: "ai" },
      { time: "05:00 PM", title: "Officer verified the issue", actor: "OFFICER", type: "officer" },
    ],
  },
  {
    id: "JH-2026-B103",
    problem:
      "Bridge expansion joint gap widening on Subarnarekha River link bypass road.",
    location: "NH-33 Bypass, Ranchi Rural",
    coordinates: [23.3441, 85.3096],
    category: "Bridges & Structures",
    affectedGroup: "Heavy commercial transport",
    severity: "HIGH",
    evidence: "3 photos & citizen video recording",
    evidenceType: "Structural gap measurement",
    similarComplaint: "Possible duplicate with Case #B094",
    recommendedPath: "Government Action Required",
    suggestedAuthority: "Road Construction Department (PWD)",
    aiConfidence: 96,
    aiExplanation: "Expansion joint rubber seal failure with exposed rebar.",
    status: "ASSIGNED",
    submittedAt: "2 days ago",
    slaHoursLeft: 18,
    assignedTeam: "Structural Bridge Unit 1",
    assignedOfficer: "A. K. Verma (Executive Engineer)",
    expectedAction: "Structural plate reinforcement & sealant replacement",
    timeline: [
      { time: "Day 1 09:00 AM", title: "Report submitted", actor: "CITIZEN", type: "citizen" },
      { time: "Day 1 09:05 AM", title: "AI analysis completed", actor: "AI_SYSTEM", type: "ai" },
      { time: "Day 1 11:30 AM", title: "Officer verified the issue", actor: "OFFICER", type: "officer" },
      { time: "Day 1 02:00 PM", title: "Field team assigned", actor: "OFFICER", type: "officer" },
    ],
  },
  {
    id: "JH-2026-B104",
    problem:
      "Ongoing road resurfacing and cold-mix patch filling on Kanke Road section.",
    location: "Kanke Block, Ranchi",
    coordinates: [23.4124, 85.3219],
    category: "Road Infrastructure",
    affectedGroup: "Rural university commuters",
    severity: "MEDIUM",
    evidence: "Site inspection batch test",
    evidenceType: "Bitumen temperature & depth logs",
    similarComplaint: "Resolved duplicate",
    recommendedPath: "Government Action Required",
    suggestedAuthority: "Road Construction Department (PWD)",
    aiConfidence: 91,
    aiExplanation: "Pothole clusters patched with hot bitumen overlay.",
    status: "WORK_IN_PROGRESS",
    submittedAt: "3 days ago",
    slaHoursLeft: 8,
    assignedTeam: "Road Maintenance Team B",
    assignedOfficer: "Demo Officer",
    expectedAction: "Hot mix roller compaction & edge sealing",
    timeline: [
      { time: "Day 1", title: "Report submitted", actor: "CITIZEN", type: "citizen" },
      { time: "Day 1", title: "AI analysis completed", actor: "AI_SYSTEM", type: "ai" },
      { time: "Day 1", title: "Officer verified issue", actor: "OFFICER", type: "officer" },
      { time: "Day 2", title: "Field team assigned", actor: "OFFICER", type: "officer" },
      { time: "Day 3", title: "Field work started", actor: "OFFICER", type: "officer" },
    ],
  },
  {
    id: "JH-2026-B099",
    problem:
      "Resurfacing and patch repair completed at Doranda Overbridge approach ramp.",
    location: "Doranda Overbridge, Ranchi",
    coordinates: [23.3283, 85.3262],
    category: "Road Infrastructure",
    affectedGroup: "Daily office commuters",
    severity: "LOW",
    evidence: "Before/After completion audit images",
    evidenceType: "Post-repair photographic proof",
    similarComplaint: "No duplicate found",
    recommendedPath: "Government Action Required",
    suggestedAuthority: "Road Construction Department (PWD)",
    aiConfidence: 98,
    aiExplanation: "Verification complete. Material quality certified by zonal JE.",
    status: "RESOLVED",
    submittedAt: "5 days ago",
    slaHoursLeft: 0,
    timeline: [
      { time: "Day 1", title: "Report submitted", actor: "CITIZEN", type: "citizen" },
      { time: "Day 2", title: "Field work completed", actor: "OFFICER", type: "officer" },
      { time: "Day 3", title: "Issue resolved and audited", actor: "OFFICER", type: "officer" },
    ],
  },
];

export default function DepartmentDashboardPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [cases, setCases] = useState<CaseItem[]>([INITIAL_DEMO_CASE, ...SECONDARY_CASES]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>("JH-2026-7865");
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  // Assignment Modal State
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedFieldTeam, setSelectedFieldTeam] = useState("Road Maintenance Team A");
  const [officerName, setOfficerName] = useState("Demo Officer");
  const [expectedAction, setExpectedAction] = useState(
    "Road inspection and repair assessment"
  );

  // Dynamic notifications state
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "notif-1",
      title: "New High Priority Complaint",
      description: "New high-priority road complaint: JH-2026-7865 requires review.",
      time: "10m ago",
      type: "warning",
      read: false,
      caseId: "JH-2026-7865",
    },
    {
      id: "notif-2",
      title: "SLA Alert",
      description: "Road repair notice near NH-33 bypass has 18 hours remaining.",
      time: "1h ago",
      type: "info",
      read: false,
      caseId: "JH-2026-B103",
    },
  ]);

  const selectedCase = cases.find((c) => c.id === selectedCaseId) || cases[0];

  // Dynamic KPI Counts
  const demoStatus = cases.find((c) => c.id === "JH-2026-7865")?.status || "SUBMITTED";

  const kpis = {
    newRequests: demoStatus === "SUBMITTED" ? 12 : 11,
    verified: demoStatus === "VERIFIED" ? 8 : demoStatus === "SUBMITTED" ? 7 : 8,
    assigned: demoStatus === "ASSIGNED" ? 6 : 5,
    workInProgress: demoStatus === "WORK_IN_PROGRESS" ? 8 : 7,
    resolved: demoStatus === "RESOLVED" ? 35 : 34,
    highPriority: demoStatus === "RESOLVED" ? 3 : 4,
  };

  const navItems: DashboardNavItem[] = [
    {
      id: "overview",
      label: t("dashboard.department.tabs.overview"),
      icon: LayoutDashboard,
    },
    {
      id: "new-requests",
      label: t("dashboard.department.tabs.newRequests"),
      icon: Inbox,
      badge: kpis.newRequests,
    },
    {
      id: "active-cases",
      label: t("dashboard.department.tabs.activeCases"),
      icon: Layers,
    },
    {
      id: "verified",
      label: t("dashboard.department.tabs.verified"),
      icon: FileCheck2,
      badge: kpis.verified,
    },
    {
      id: "in-progress",
      label: t("dashboard.department.tabs.inProgress"),
      icon: HardHat,
      badge: kpis.workInProgress,
    },
    {
      id: "resolved",
      label: t("dashboard.department.tabs.resolved"),
      icon: CheckCircle2,
      badge: kpis.resolved,
    },
    {
      id: "analytics",
      label: t("dashboard.department.tabs.analytics"),
      icon: BarChart3,
    },
    {
      id: "notifications",
      label: t("dashboard.department.tabs.notifications"),
      icon: Bell,
      badge: notifications.filter((n) => !n.read).length,
    },
  ];

  // Read initial synced status from localStorage if present
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("jharsetu_demo_case_7865_status") as CaseStatus | null;
      if (stored && ["SUBMITTED", "VERIFIED", "ASSIGNED", "WORK_IN_PROGRESS", "RESOLVED"].includes(stored)) {
        setCases((prev) =>
          prev.map((c) =>
            c.id === "JH-2026-7865" ? { ...c, status: stored } : c
          )
        );
      }
    }
  }, []);

  // ───── STATE TRANSITIONS FOR DEMO FLOW ─────

  // 1. Verify Issue (Submitted -> Verified)
  const handleVerifyIssue = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("jharsetu_demo_case_7865_status", "VERIFIED");
    }

    const updatedTimeline: TimelineEvent = {
      time: "09:15 AM",
      title: "Officer verified the issue",
      actor: "OFFICER",
      type: "officer",
      note: "Confirmed physical hazard & alignment with municipal PWD jurisdiction",
    };

    setCases((prev) =>
      prev.map((c) =>
        c.id === selectedCase.id
          ? {
              ...c,
              status: "VERIFIED",
              timeline: [...c.timeline, updatedTimeline],
            }
          : c
      )
    );

    // Push notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: "Issue Verified",
      description: `Issue ${selectedCase.id} verified successfully.`,
      time: "Just now",
      type: "success",
      read: false,
      caseId: selectedCase.id,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    toast.success("Officer Verified Issue", {
      description: `Status updated: Submitted → Verified. Audit event logged.`,
    });
  };

  // 2. Open Field Team Modal
  const handleOpenAssignModal = () => {
    setIsAssignModalOpen(true);
  };

  // 3. Confirm Field Team Assignment (Verified -> Assigned)
  const handleConfirmAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAssignModalOpen(false);

    const updatedTimeline: TimelineEvent = {
      time: "09:16 AM",
      title: `Field team assigned (${selectedFieldTeam})`,
      actor: "OFFICER",
      type: "officer",
      note: `Assigned by ${officerName}. Action: ${expectedAction}`,
    };

    if (typeof window !== "undefined") {
      localStorage.setItem("jharsetu_demo_case_7865_status", "ASSIGNED");
    }

    setCases((prev) =>
      prev.map((c) =>
        c.id === selectedCase.id
          ? {
              ...c,
              status: "ASSIGNED",
              assignedTeam: selectedFieldTeam,
              assignedOfficer: officerName,
              expectedAction: expectedAction,
              timeline: [...c.timeline, updatedTimeline],
            }
          : c
      )
    );

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: "Field Team Assigned",
      description: `Field Team assigned to ${selectedCase.id}.`,
      time: "Just now",
      type: "info",
      read: false,
      caseId: selectedCase.id,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    toast.success("Field Team Assigned", {
      description: `Status updated: Verified → Assigned. Team: ${selectedFieldTeam}`,
    });
  };

  // 4. Start Work (Assigned -> Work in Progress)
  const handleStartWork = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("jharsetu_demo_case_7865_status", "WORK_IN_PROGRESS");
    }

    const updatedTimeline: TimelineEvent = {
      time: "09:20 AM",
      title: "Field work started",
      actor: "OFFICER",
      type: "officer",
      note: "Inspection team and hot-mix patch unit deployed to school road",
    };

    setCases((prev) =>
      prev.map((c) =>
        c.id === selectedCase.id
          ? {
              ...c,
              status: "WORK_IN_PROGRESS",
              timeline: [...c.timeline, updatedTimeline],
            }
          : c
      )
    );

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: "Work in Progress",
      description: `Work has started on ${selectedCase.id}.`,
      time: "Just now",
      type: "success",
      read: false,
      caseId: selectedCase.id,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    toast.success("Field Work Started", {
      description: `Status updated: Assigned → Work in Progress.`,
    });
  };

  // 5. Optional: Mark Resolved
  const handleMarkResolved = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("jharsetu_demo_case_7865_status", "RESOLVED");
    }

    const updatedTimeline: TimelineEvent = {
      time: "09:45 AM",
      title: "Issue resolved and audited",
      actor: "OFFICER",
      type: "officer",
      note: "Surface repaved and safety clearance certified by Executive Engineer",
    };

    setCases((prev) =>
      prev.map((c) =>
        c.id === selectedCase.id
          ? {
              ...c,
              status: "RESOLVED",
              timeline: [...c.timeline, updatedTimeline],
            }
          : c
      )
    );

    toast.success("Case Resolved", {
      description: `Case ${selectedCase.id} marked as resolved. Citizen will be notified.`,
    });
  };

  // Reset demo case back to initial state
  const handleResetDemo = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("jharsetu_demo_case_7865_status", "SUBMITTED");
    }
    setCases([INITIAL_DEMO_CASE, ...SECONDARY_CASES]);
    setSelectedCaseId("JH-2026-7865");
    toast.info("Demo State Reset", {
      description: "Case JH-2026-7865 reset to initial Submitted status.",
    });
  };

  // Filter cases based on search and filters
  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.problem.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority =
      priorityFilter === "ALL" || c.severity === priorityFilter;
    const matchesStatus =
      statusFilter === "ALL" || c.status === statusFilter;
    const matchesCategory =
      categoryFilter === "ALL" || c.category === categoryFilter;

    if (activeTab === "new-requests") {
      return matchesSearch && matchesPriority && c.status === "SUBMITTED";
    }
    if (activeTab === "active-cases") {
      return (
        matchesSearch &&
        matchesPriority &&
        (c.status === "VERIFIED" ||
          c.status === "ASSIGNED" ||
          c.status === "WORK_IN_PROGRESS")
      );
    }
    if (activeTab === "verified") {
      return matchesSearch && matchesPriority && c.status === "VERIFIED";
    }
    if (activeTab === "in-progress") {
      return matchesSearch && matchesPriority && c.status === "WORK_IN_PROGRESS";
    }
    if (activeTab === "resolved") {
      return matchesSearch && matchesPriority && c.status === "RESOLVED";
    }

    return matchesSearch && matchesPriority && matchesStatus && matchesCategory;
  });

  return (
    <DashboardShell
      roleName={t("dashboard.department.roleTitle")}
      roleBadgeText="Department Officer Dashboard"
      roleBadgeColor="blue"
      organizationName="Road Construction Department (PWD), Ranchi (Demo Workspace)"
      navItems={navItems}
      activeNavId={activeTab}
      onNavChange={setActiveTab}
      notifications={notifications}
      breadcrumbs={[
        { label: t("nav.dashboard") || "Dashboard", href: "/dashboard" },
        {
          label: "Department Officer Dashboard",
          href: "/dashboard/department",
        },
        {
          label:
            navItems.find((n) => n.id === activeTab)?.label ||
            t("dashboard.department.tabs.overview"),
        },
      ]}
    >
      {/* ───── TOP PROTOTYPE DEMO BANNER ───── */}
      <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50/80 px-4 py-2.5 flex items-center justify-between gap-3 text-xs text-blue-900">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-[#0F62B4] shrink-0" />
          <span>
            <strong>Demo Environment:</strong> Demonstrating AI-recommended intake & officer verification workflow. Officer maintains final decision authority.
          </span>
        </div>
        <button
          type="button"
          onClick={handleResetDemo}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0F62B4] hover:text-[#0C4E90] hover:underline shrink-0"
        >
          <RefreshCw className="h-3 w-3" />
          Reset Demo Case
        </button>
      </div>

      {/* ───── MAIN TAB ROUTER ───── */}
      {activeTab === "analytics" ? (
        /* ───── ANALYTICS VIEW ───── */
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E2E5EA] shadow-xs">
            <h2 className="text-base font-bold text-[#111827] mb-1">
              {t("dashboard.department.analyticsView.intakeTrend")}
            </h2>
            <p className="text-xs text-[#6B7280] mb-6">
              Complaints received and routed by AI classifier over the last 7 days.
            </p>

            {/* Simple Clean Bar Chart */}
            <div className="h-48 flex items-end justify-between gap-2 sm:gap-4 pt-4 border-b border-[#E2E5EA] pb-2">
              {[
                { day: "Mon", count: 8, height: "40%" },
                { day: "Tue", count: 14, height: "65%" },
                { day: "Wed", count: 11, height: "50%" },
                { day: "Thu", count: 19, height: "85%" },
                { day: "Fri", count: 16, height: "70%" },
                { day: "Sat", count: 12, height: "55%" },
                { day: "Today", count: 22, height: "95%", current: true },
              ].map((bar) => (
                <div key={bar.day} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-[11px] font-bold text-[#111827]">
                    {bar.count}
                  </span>
                  <div
                    style={{ height: bar.height }}
                    className={`w-full max-w-[48px] rounded-t-lg transition-all ${
                      bar.current ? "bg-[#0F62B4]" : "bg-blue-100 hover:bg-blue-200"
                    }`}
                  />
                  <span className="text-[11px] text-[#6B7280] font-medium">
                    {bar.day}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Reports by Category */}
            <div className="bg-white p-5 rounded-2xl border border-[#E2E5EA] shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-[#111827]">
                {t("dashboard.department.analyticsView.reportsByCategory")}
              </h3>
              <div className="space-y-2.5 text-xs">
                {[
                  { label: "Road Infrastructure", count: 42, pct: "64%", color: "bg-[#0F62B4]" },
                  { label: "Drainage & Culverts", count: 14, pct: "21%", color: "bg-amber-500" },
                  { label: "Bridges & Flyovers", count: 6, pct: "9%", color: "bg-purple-600" },
                  { label: "Signage & Safety", count: 4, pct: "6%", color: "bg-emerald-600" },
                ].map((item) => (
                  <div key={item.label} className="space-y-1">
                    <div className="flex justify-between font-medium">
                      <span>{item.label}</span>
                      <span className="text-[#6B7280]">{item.count} ({item.pct})</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full`}
                        style={{ width: item.pct }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Priority Distribution */}
            <div className="bg-white p-5 rounded-2xl border border-[#E2E5EA] shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-[#111827]">
                {t("dashboard.department.analyticsView.priorityDistribution")}
              </h3>
              <div className="space-y-2.5 text-xs">
                {[
                  { label: "High Priority (Safety Hazard)", count: 18, pct: "27%", color: "bg-red-500" },
                  { label: "Medium Priority (Functional Defect)", count: 36, pct: "55%", color: "bg-amber-500" },
                  { label: "Low Priority (Minor Maintenance)", count: 12, pct: "18%", color: "bg-slate-400" },
                ].map((item) => (
                  <div key={item.label} className="space-y-1">
                    <div className="flex justify-between font-medium">
                      <span>{item.label}</span>
                      <span className="text-[#6B7280]">{item.count}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full`}
                        style={{ width: item.pct }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Case Status Distribution */}
            <div className="bg-white p-5 rounded-2xl border border-[#E2E5EA] shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-[#111827]">
                {t("dashboard.department.analyticsView.caseStatusDistribution")}
              </h3>
              <div className="space-y-2.5 text-xs">
                {[
                  { label: "Submitted (Awaiting Triage)", count: kpis.newRequests, color: "bg-blue-500" },
                  { label: "Verified by Officer", count: kpis.verified, color: "bg-indigo-500" },
                  { label: "Assigned to Field Staff", count: kpis.assigned, color: "bg-amber-500" },
                  { label: "Work in Progress", count: kpis.workInProgress, color: "bg-purple-600" },
                  { label: "Resolved", count: kpis.resolved, color: "bg-green-600" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-1 border-b border-[#F3F4F6] last:border-0">
                    <span className="flex items-center gap-2 font-medium">
                      <span className={`h-2 w-2 rounded-full ${item.color}`} />
                      {item.label}
                    </span>
                    <span className="font-bold text-[#111827]">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === "notifications" ? (
        /* ───── NOTIFICATIONS VIEW ───── */
        <div className="bg-white rounded-2xl border border-[#E2E5EA] p-6 shadow-xs space-y-4 max-w-3xl">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E5EA]">
            <div>
              <h2 className="text-base font-bold text-[#111827]">
                Department Notifications
              </h2>
              <p className="text-xs text-[#6B7280]">
                Real-time incident updates, verification alerts, and SLA deadlines.
              </p>
            </div>
            <span className="text-xs font-semibold text-[#0F62B4] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
              {notifications.length} Total
            </span>
          </div>

          <div className="space-y-2.5">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  if (n.caseId) {
                    setSelectedCaseId(n.caseId);
                    setActiveTab("overview");
                  }
                }}
                className={`p-4 rounded-xl border text-xs cursor-pointer transition-all ${
                  n.type === "warning"
                    ? "border-amber-200 bg-amber-50/50 hover:bg-amber-50"
                    : n.type === "success"
                    ? "border-green-200 bg-green-50/50 hover:bg-green-50"
                    : "border-[#E2E5EA] bg-[#F7F8FA] hover:bg-white"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {n.type === "warning" ? (
                      <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                    ) : n.type === "success" ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                    ) : (
                      <Bell className="h-4 w-4 text-[#0F62B4] shrink-0" />
                    )}
                    <span className="font-bold text-sm text-[#111827]">
                      {n.title}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#9CA3AF] shrink-0">
                    {n.time}
                  </span>
                </div>
                <p className="text-xs text-[#4B5563] mt-1.5 pl-6 leading-relaxed">
                  {n.description}
                </p>
                {n.caseId && (
                  <div className="mt-2 pl-6 flex items-center gap-1 text-[11px] font-semibold text-[#0F62B4]">
                    View Case {n.caseId} <ChevronRight className="h-3 w-3" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* ───── OVERVIEW / QUEUE VIEW ───── */
        <div className="space-y-6">
          {/* ───── 1. EXACT KPI STATS CARDS (6 Metrics) ───── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {/* New Requests */}
            <div className="p-4 rounded-xl border border-[#E2E5EA] bg-white shadow-xs">
              <div className="flex items-center justify-between text-[#6B7280]">
                <span className="text-xs font-semibold">New Requests</span>
                <span className="p-1 rounded-md bg-blue-50 text-[#0F62B4]">
                  <Inbox className="h-3.5 w-3.5" />
                </span>
              </div>
              <div className="mt-2 text-2xl font-bold text-[#111827]">
                {kpis.newRequests}
              </div>
              <p className="text-[10px] text-[#0F62B4] font-medium mt-0.5">
                Awaiting triage
              </p>
            </div>

            {/* Verified */}
            <div className="p-4 rounded-xl border border-[#E2E5EA] bg-white shadow-xs">
              <div className="flex items-center justify-between text-[#6B7280]">
                <span className="text-xs font-semibold">Verified</span>
                <span className="p-1 rounded-md bg-indigo-50 text-indigo-600">
                  <FileCheck2 className="h-3.5 w-3.5" />
                </span>
              </div>
              <div className="mt-2 text-2xl font-bold text-[#111827]">
                {kpis.verified}
              </div>
              <p className="text-[10px] text-indigo-600 font-medium mt-0.5">
                Officer verified
              </p>
            </div>

            {/* Assigned */}
            <div className="p-4 rounded-xl border border-[#E2E5EA] bg-white shadow-xs">
              <div className="flex items-center justify-between text-[#6B7280]">
                <span className="text-xs font-semibold">Assigned</span>
                <span className="p-1 rounded-md bg-amber-50 text-amber-600">
                  <Users className="h-3.5 w-3.5" />
                </span>
              </div>
              <div className="mt-2 text-2xl font-bold text-[#111827]">
                {kpis.assigned}
              </div>
              <p className="text-[10px] text-amber-600 font-medium mt-0.5">
                Teams in field
              </p>
            </div>

            {/* Work in Progress */}
            <div className="p-4 rounded-xl border border-[#E2E5EA] bg-white shadow-xs">
              <div className="flex items-center justify-between text-[#6B7280]">
                <span className="text-xs font-semibold">Work in Progress</span>
                <span className="p-1 rounded-md bg-purple-50 text-purple-600">
                  <HardHat className="h-3.5 w-3.5" />
                </span>
              </div>
              <div className="mt-2 text-2xl font-bold text-[#111827]">
                {kpis.workInProgress}
              </div>
              <p className="text-[10px] text-purple-600 font-medium mt-0.5">
                Repairs active
              </p>
            </div>

            {/* Resolved */}
            <div className="p-4 rounded-xl border border-[#E2E5EA] bg-white shadow-xs">
              <div className="flex items-center justify-between text-[#6B7280]">
                <span className="text-xs font-semibold">Resolved</span>
                <span className="p-1 rounded-md bg-green-50 text-green-700">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </span>
              </div>
              <div className="mt-2 text-2xl font-bold text-[#111827]">
                {kpis.resolved}
              </div>
              <p className="text-[10px] text-green-700 font-medium mt-0.5">
                Citizen certified
              </p>
            </div>

            {/* High Priority */}
            <div className="p-4 rounded-xl border border-red-200 bg-red-50/50 shadow-xs">
              <div className="flex items-center justify-between text-red-700">
                <span className="text-xs font-semibold">High Priority</span>
                <span className="p-1 rounded-md bg-red-100 text-red-700">
                  <AlertTriangle className="h-3.5 w-3.5" />
                </span>
              </div>
              <div className="mt-2 text-2xl font-bold text-red-700">
                {kpis.highPriority}
              </div>
              <p className="text-[10px] text-red-600 font-medium mt-0.5">
                Immediate hazard
              </p>
            </div>
          </div>

          {/* ───── 2. SEARCH & FILTERS BAR ───── */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-xl border border-[#E2E5EA]">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder={t("dashboard.department.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-[#E2E5EA] bg-[#F7F8FA] text-xs sm:text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0F62B4] focus:bg-white"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
                <Filter className="h-3.5 w-3.5" />
              </div>
              {/* Priority filter */}
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="rounded-lg border border-[#E2E5EA] bg-[#F7F8FA] px-2.5 py-1.5 text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0F62B4]"
              >
                <option value="ALL">{t("dashboard.department.allPriorities")}</option>
                <option value="HIGH">{t("dashboard.department.highPriorityOnly")}</option>
                <option value="MEDIUM">{t("dashboard.department.mediumPriority")}</option>
                <option value="LOW">{t("dashboard.department.lowPriority")}</option>
              </select>

              {/* Status filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-[#E2E5EA] bg-[#F7F8FA] px-2.5 py-1.5 text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0F62B4]"
              >
                <option value="ALL">{t("dashboard.department.allStatuses")}</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="VERIFIED">Verified</option>
                <option value="ASSIGNED">Assigned</option>
                <option value="WORK_IN_PROGRESS">Work in Progress</option>
                <option value="RESOLVED">Resolved</option>
              </select>

              {/* Category filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="rounded-lg border border-[#E2E5EA] bg-[#F7F8FA] px-2.5 py-1.5 text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0F62B4]"
              >
                <option value="ALL">{t("dashboard.department.allCategories")}</option>
                <option value="Road Infrastructure">Road Infrastructure</option>
                <option value="Drainage & Culverts">Drainage & Culverts</option>
                <option value="Bridges & Structures">Bridges & Structures</option>
              </select>
            </div>
          </div>

          {/* ───── 3. SPLIT VIEW: CASE QUEUE TABLE & CASE DETAIL DRAWER ───── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Cases Column */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between pb-1">
                <h2 className="text-xs sm:text-sm font-bold text-[#111827] uppercase tracking-wide flex items-center gap-2">
                  <span>
                    {navItems.find((n) => n.id === activeTab)?.label} Queue ({filteredCases.length})
                  </span>
                  {selectedCase.id === "JH-2026-7865" && (
                    <span className="text-[10px] bg-blue-100 text-[#0F62B4] font-bold px-2 py-0.5 rounded-full border border-blue-200">
                      ★ Active Demo Case
                    </span>
                  )}
                </h2>
                <span className="text-xs text-[#6B7280]">
                  PWD Division Ranchi
                </span>
              </div>

              {/* Desktop Table Format */}
              <div className="hidden md:block overflow-hidden rounded-xl border border-[#E2E5EA] bg-white shadow-xs">
                <table className="w-full text-left text-xs text-[#111827]">
                  <thead className="bg-[#F7F8FA] border-b border-[#E2E5EA] text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                    <tr>
                      <th className="py-3 px-3.5">{t("dashboard.department.table.trackingId")}</th>
                      <th className="py-3 px-3">{t("dashboard.department.table.problem")}</th>
                      <th className="py-3 px-3">{t("dashboard.department.table.category")}</th>
                      <th className="py-3 px-3">{t("dashboard.department.table.priority")}</th>
                      <th className="py-3 px-3">{t("dashboard.department.table.aiConfidence")}</th>
                      <th className="py-3 px-3">{t("dashboard.department.table.status")}</th>
                      <th className="py-3 px-3.5 text-right">{t("dashboard.department.table.action")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E5EA]">
                    {filteredCases.map((c) => {
                      const isSelected = selectedCase.id === c.id;
                      const isDemoTarget = c.id === "JH-2026-7865";
                      return (
                        <tr
                          key={c.id}
                          onClick={() => setSelectedCaseId(c.id)}
                          className={`cursor-pointer transition-colors ${
                            isSelected
                              ? "bg-blue-50/70 font-medium"
                              : "hover:bg-[#F9FAFB]"
                          }`}
                        >
                          <td className="py-3 px-3.5 font-mono font-bold text-[#0F62B4]">
                            <div className="flex items-center gap-1.5">
                              {isDemoTarget && (
                                <span className="h-1.5 w-1.5 rounded-full bg-[#0F62B4] animate-ping" />
                              )}
                              <span>{c.id}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3 max-w-[180px] truncate" title={c.problem}>
                            {c.problem}
                          </td>
                          <td className="py-3 px-3 text-[#4B5563]">
                            {c.category}
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                                c.severity === "HIGH"
                                  ? "bg-red-50 text-red-700 border border-red-200"
                                  : "bg-amber-50 text-amber-700 border border-amber-200"
                              }`}
                            >
                              {c.severity}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-purple-700">
                            {c.aiConfidence}%
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                                c.status === "RESOLVED"
                                  ? "bg-green-100 text-green-800"
                                  : c.status === "WORK_IN_PROGRESS"
                                  ? "bg-purple-100 text-purple-800"
                                  : c.status === "ASSIGNED"
                                  ? "bg-amber-100 text-amber-800"
                                  : c.status === "VERIFIED"
                                  ? "bg-indigo-100 text-indigo-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {c.status.replace(/_/g, " ")}
                            </span>
                          </td>
                          <td className="py-3 px-3.5 text-right">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCaseId(c.id);
                              }}
                              className="px-2.5 py-1 rounded-md bg-white border border-[#E2E5EA] text-[#0F62B4] hover:bg-[#F3F4F6] text-[11px] font-semibold transition-colors"
                            >
                              {t("dashboard.department.table.view")}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Stacked Card List (<md screens) */}
              <div className="md:hidden space-y-3">
                {filteredCases.map((c) => {
                  const isSelected = selectedCase.id === c.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => setSelectedCaseId(c.id)}
                      className={`p-4 rounded-xl border bg-white cursor-pointer transition-all space-y-2 ${
                        isSelected
                          ? "border-[#0F62B4] ring-2 ring-[#0F62B4]/20 shadow-xs"
                          : "border-[#E2E5EA] hover:border-blue-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-[#0F62B4]">
                          {c.id}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              c.severity === "HIGH"
                                ? "bg-red-50 text-red-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {c.severity}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">
                            {c.status.replace(/_/g, " ")}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-[#111827] font-semibold line-clamp-2">
                        {c.problem}
                      </p>
                      <div className="flex items-center justify-between text-[11px] text-[#6B7280] pt-2 border-t border-[#F3F4F6]">
                        <span>AI: {c.aiConfidence}%</span>
                        <span className="text-[#0F62B4] font-medium flex items-center gap-1">
                          Inspect <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ───── 4. CASE DETAIL INSPECTOR (Drawer / Sticky Panel) ───── */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E2E5EA] p-5 shadow-sm space-y-5 sticky top-20">
              {/* Header */}
              <div className="flex items-start justify-between pb-3 border-b border-[#E2E5EA]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-bold text-[#0F62B4]">
                      {selectedCase.id}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold tracking-wide ${
                        selectedCase.status === "WORK_IN_PROGRESS"
                          ? "bg-purple-100 text-purple-800 border border-purple-200"
                          : selectedCase.status === "ASSIGNED"
                          ? "bg-amber-100 text-amber-800 border border-amber-200"
                          : selectedCase.status === "VERIFIED"
                          ? "bg-indigo-100 text-indigo-800 border border-indigo-200"
                          : selectedCase.status === "RESOLVED"
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : "bg-blue-100 text-blue-800 border border-blue-200"
                      }`}
                    >
                      {selectedCase.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  <p className="text-xs text-[#6B7280] mt-0.5">
                    {selectedCase.submittedAt} · SLA: {selectedCase.slaHoursLeft}h left
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-semibold">
                    Mock / Demo Case
                  </span>
                </div>
              </div>

              {/* CITIZEN REPORT */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                  {t("dashboard.department.citizenReport")}
                </label>
                <div className="text-xs sm:text-sm text-[#111827] leading-relaxed bg-[#F7F8FA] p-3.5 rounded-xl border border-[#E2E5EA]">
                  "{selectedCase.problem}"
                </div>
              </div>

              {/* EVIDENCE SECTION */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                  {t("dashboard.department.evidence")}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {/* Photo Placeholder Card */}
                  <div className="rounded-xl border border-[#E2E5EA] bg-[#F7F8FA] p-3 space-y-1.5 flex flex-col justify-between">
                    <div className="flex items-center gap-1.5 font-semibold text-[#111827]">
                      <FileText className="h-4 w-4 text-[#0F62B4]" />
                      <span>Citizen Photograph</span>
                    </div>
                    <div className="h-20 w-full rounded-lg bg-slate-200 flex flex-col items-center justify-center border border-dashed border-slate-300 text-[#6B7280]">
                      <span className="text-[11px] font-medium">📷 Road Crater Photo</span>
                      <span className="text-[9px] text-[#9CA3AF]">Depth &gt; 18cm</span>
                    </div>
                    <span className="text-[10px] text-green-700 font-semibold bg-green-50 px-1.5 py-0.5 rounded border border-green-200 text-center">
                      ✓ Verified EXIF Geo-tag
                    </span>
                  </div>

                  {/* Location Card */}
                  <div className="rounded-xl border border-[#E2E5EA] bg-[#F7F8FA] p-3 space-y-1.5 flex flex-col justify-between">
                    <div className="flex items-center gap-1.5 font-semibold text-[#111827]">
                      <MapPin className="h-4 w-4 text-[#0F62B4]" />
                      <span>{t("dashboard.department.location")}</span>
                    </div>
                    <div className="text-[11px] text-[#4B5563] leading-snug">
                      {selectedCase.location}
                    </div>
                    {selectedCase.coordinates && (
                      <span className="text-[10px] font-mono text-[#0F62B4] bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                        📍 {selectedCase.coordinates[0]}° N, {selectedCase.coordinates[1]}° E
                      </span>
                    )}
                  </div>
                </div>

                {/* Map Display */}
                {selectedCase.coordinates && (
                  <div className="pt-1">
                    <LocationDisplayMap
                      position={selectedCase.coordinates}
                      label={`${selectedCase.id}: ${selectedCase.location}`}
                      className="h-32 w-full rounded-xl border border-[#E2E5EA] shadow-2xs"
                    />
                  </div>
                )}
              </div>

              {/* AI ANALYSIS SECTION */}
              <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-4 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-purple-900">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    <span>{t("dashboard.department.aiAnalysis")}</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-purple-800 bg-white px-2.5 py-0.5 rounded-full border border-purple-200 shadow-2xs">
                    {selectedCase.aiConfidence}% {t("dashboard.department.aiConfidence")}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-purple-200/60">
                  <div>
                    <span className="text-purple-700 font-semibold block">{t("dashboard.department.category")}:</span>
                    <span className="font-medium text-purple-950">{selectedCase.category}</span>
                  </div>
                  <div>
                    <span className="text-purple-700 font-semibold block">{t("dashboard.department.affectedGroup")}:</span>
                    <span className="font-medium text-purple-950">{selectedCase.affectedGroup}</span>
                  </div>
                  <div>
                    <span className="text-purple-700 font-semibold block">{t("dashboard.department.severity")}:</span>
                    <span className="font-bold text-red-700">{selectedCase.severity}</span>
                  </div>
                  <div>
                    <span className="text-purple-700 font-semibold block">{t("dashboard.department.similarComplaint")}:</span>
                    <span className="font-medium text-purple-950">{selectedCase.similarComplaint}</span>
                  </div>
                  <div>
                    <span className="text-purple-700 font-semibold block">{t("dashboard.department.recommendedPath")}:</span>
                    <span className="font-bold text-[#0F62B4]">{selectedCase.recommendedPath}</span>
                  </div>
                  <div>
                    <span className="text-purple-700 font-semibold block">{t("dashboard.department.suggestedAuthority")}:</span>
                    <span className="font-medium text-purple-950">{selectedCase.suggestedAuthority}</span>
                  </div>
                </div>

                <p className="text-[11px] text-purple-900/90 leading-relaxed pt-1.5 border-t border-purple-200/60">
                  {selectedCase.aiExplanation}
                </p>
              </div>

              {/* MODEL TRANSPARENCY CARD */}
              <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-2.5 flex items-start gap-2 text-xs text-amber-900">
                <ShieldAlert className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
                <span className="leading-snug">
                  <strong>{t("dashboard.department.modelAnalysisInfo")}:</strong> {t("dashboard.department.modelTransparency")}
                </span>
              </div>

              {/* ───── 5. OFFICER ACTIONS SECTION (State Machine) ───── */}
              <div className="pt-2 border-t border-[#E2E5EA] space-y-2.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                  {t("dashboard.department.officerActions")}
                </label>

                {selectedCase.status === "SUBMITTED" && (
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={handleVerifyIssue}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#0F62B4] hover:bg-[#0C4E90] text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Check className="h-4 w-4" />
                      {t("dashboard.department.actions.verifyIssue")}
                    </button>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => toast.info("Reassign Action Triggered")}
                        className="py-1.5 px-2 rounded-lg border border-[#E2E5EA] bg-white hover:bg-[#F3F4F6] text-[#4B5563] text-[11px] font-medium transition-colors"
                      >
                        {t("dashboard.department.actions.reassign")}
                      </button>
                      <button
                        type="button"
                        onClick={() => toast.warning("Complaint marked as rejected")}
                        className="py-1.5 px-2 rounded-lg border border-[#E2E5EA] bg-white hover:bg-red-50 hover:text-red-700 text-[#4B5563] text-[11px] font-medium transition-colors"
                      >
                        {t("dashboard.department.actions.reject")}
                      </button>
                      <button
                        type="button"
                        onClick={() => toast.info("SMS info request sent to citizen")}
                        className="py-1.5 px-2 rounded-lg border border-[#E2E5EA] bg-white hover:bg-[#F3F4F6] text-[#4B5563] text-[11px] font-medium transition-colors"
                      >
                        {t("dashboard.department.actions.requestInfo")}
                      </button>
                    </div>
                  </div>
                )}

                {selectedCase.status === "VERIFIED" && (
                  <div className="space-y-2">
                    <div className="p-2.5 rounded-lg bg-indigo-50 border border-indigo-200 text-xs text-indigo-900 font-medium">
                      ✓ Issue verified by officer. Ready for field team dispatch.
                    </div>
                    <button
                      type="button"
                      onClick={handleOpenAssignModal}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#0F62B4] hover:bg-[#0C4E90] text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Users className="h-4 w-4" />
                      {t("dashboard.department.actions.assignFieldTeam")}
                    </button>
                  </div>
                )}

                {selectedCase.status === "ASSIGNED" && (
                  <div className="space-y-2">
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
                      <div className="font-bold flex items-center gap-1.5">
                        <HardHat className="h-3.5 w-3.5 text-amber-700" />
                        <span>Team Assigned: {selectedCase.assignedTeam}</span>
                      </div>
                      <p className="text-[11px] text-amber-800">
                        Officer: {selectedCase.assignedOfficer} · Action: {selectedCase.expectedAction}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleStartWork}
                      className="w-full py-2.5 px-4 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Play className="h-4 w-4 fill-white" />
                      {t("dashboard.department.actions.startWork")}
                    </button>
                  </div>
                )}

                {selectedCase.status === "WORK_IN_PROGRESS" && (
                  <div className="space-y-2">
                    <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-950 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-purple-600 animate-ping" />
                        <span className="font-bold uppercase tracking-wider">
                          WORK IN PROGRESS
                        </span>
                      </div>
                      <span className="text-[11px] text-purple-700 font-semibold">
                        {selectedCase.assignedTeam}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleMarkResolved}
                      className="w-full py-2.5 px-4 rounded-xl bg-green-700 hover:bg-green-800 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      {t("dashboard.department.actions.markResolved")}
                    </button>
                  </div>
                )}

                {selectedCase.status === "RESOLVED" && (
                  <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-xs text-green-900 font-medium flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-700 shrink-0" />
                    <span>Case resolved and certified by Executive Engineer.</span>
                  </div>
                )}
              </div>

              {/* ───── 6. CASE AUDIT TIMELINE ───── */}
              <div className="pt-2 border-t border-[#E2E5EA] space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                  {t("dashboard.department.caseTimeline")}
                </label>
                <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {selectedCase.timeline.map((event, idx) => (
                    <div key={idx} className="flex items-start gap-3 relative text-xs">
                      <div
                        className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 z-10 text-[10px] font-bold ${
                          event.actor === "OFFICER"
                            ? "bg-[#0F62B4] text-white"
                            : event.actor === "AI_SYSTEM"
                            ? "bg-purple-600 text-white"
                            : "bg-slate-300 text-[#111827]"
                        }`}
                      >
                        {event.actor === "OFFICER" ? "O" : event.actor === "AI_SYSTEM" ? "AI" : "C"}
                      </div>
                      <div className="flex-1 space-y-0.5">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-[#111827]">
                            {event.title}
                          </span>
                          <span className="text-[10px] text-[#9CA3AF]">
                            {event.time}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[9px] uppercase px-1.5 py-0.2 rounded font-bold ${
                              event.actor === "OFFICER"
                                ? "bg-blue-50 text-[#0F62B4]"
                                : event.actor === "AI_SYSTEM"
                                ? "bg-purple-50 text-purple-700"
                                : "bg-slate-100 text-[#4B5563]"
                            }`}
                          >
                            {event.actor === "OFFICER"
                              ? t("dashboard.department.timelineOfficerAction")
                              : event.actor === "AI_SYSTEM"
                              ? t("dashboard.department.timelineAiEvent")
                              : "Citizen Intake"}
                          </span>
                        </div>
                        {event.note && (
                          <p className="text-[11px] text-[#6B7280]">
                            {event.note}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───── ASSIGN FIELD TEAM MODAL DIALOG ───── */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl border border-[#E2E5EA] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E5EA]">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[#0F62B4]" />
                <h3 className="text-sm font-bold text-[#111827]">
                  {t("dashboard.department.assignModalTitle")}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAssignModalOpen(false)}
                className="p-1 rounded-md text-[#9CA3AF] hover:text-[#111827] hover:bg-[#F3F4F6]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmAssignment} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#374151] mb-1">
                  {t("dashboard.department.fieldTeamLabel")}
                </label>
                <select
                  value={selectedFieldTeam}
                  onChange={(e) => setSelectedFieldTeam(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E5EA] bg-[#F7F8FA] text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0F62B4]"
                >
                  <option value="Road Maintenance Team A">Road Maintenance Team A (Zonal Doranda)</option>
                  <option value="Rapid Pothole Response Unit 2">Rapid Pothole Response Unit 2</option>
                  <option value="Zonal Heavy Equipment Crew">Zonal Heavy Equipment Crew</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#374151] mb-1">
                  {t("dashboard.department.officerLabel")}
                </label>
                <input
                  type="text"
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E5EA] bg-[#F7F8FA] text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0F62B4]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#374151] mb-1">
                  {t("dashboard.department.expectedActionLabel")}
                </label>
                <textarea
                  rows={2}
                  value={expectedAction}
                  onChange={(e) => setExpectedAction(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E5EA] bg-[#F7F8FA] text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0F62B4]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E2E5EA]">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-3.5 py-2 rounded-lg border border-[#E2E5EA] text-[#4B5563] hover:bg-[#F3F4F6] font-medium"
                >
                  {t("dashboard.department.cancelBtn")}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#0F62B4] hover:bg-[#0C4E90] text-white font-bold shadow-xs cursor-pointer"
                >
                  {t("dashboard.department.assignConfirmBtn")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
