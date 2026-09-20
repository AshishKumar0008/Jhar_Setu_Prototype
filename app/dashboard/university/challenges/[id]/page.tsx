"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  DashboardShell,
  DashboardNavItem,
} from "@/components/dashboard/dashboard-shell";
import {
  LayoutDashboard,
  Compass,
  FolderKanban,
  Users,
  GraduationCap,
  FileText,
  Flag,
  Handshake,
  Bell,
  CheckCircle2,
  Sparkles,
  Award,
  X,
  ShieldCheck,
  Check,
  UserPlus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Building2,
  Layers,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/lib/i18n/language-context";
import {
  PRIMARY_WATER_CHALLENGE,
  UniversityChallenge,
} from "@/app/dashboard/university/page";

const FACULTY_MENTOR_OPTIONS = [
  "Dr. S. K. Pathak (Prof., Environmental Engg)",
  "Dr. R. K. Singh (Dept of Electronics & Embedded Systems)",
  "Prof. Priya Verma (Civil & Water Resources)",
  "Dr. Amitesh Kumar (Chemistry & Materials)",
];

const STUDENT_SUGGESTIONS = [
  "Ananya Sen (M.Tech Env. Engg)",
  "Rahul Roy (Ph.D IoT Systems)",
  "Sunita Murmu (B.Tech Electronics)",
  "Rakesh Mahto (M.Tech Chemical Engg)",
  "Priya Soren (B.Tech Civil Engg)",
];

const STORAGE_KEY = "jharsetu_university_challenge_v1";

export default function UniversityChallengeDetailPage() {
  const { t } = useLanguage();
  const params = useParams();
  const router = useRouter();
  const challengeId = (params?.id as string) || "CH-2026-001";

  const [challenge, setChallenge] = useState<UniversityChallenge>(PRIMARY_WATER_CHALLENGE);

  // Team Modal State
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [teamFormMentor, setTeamFormMentor] = useState(FACULTY_MENTOR_OPTIONS[0]);
  const [teamFormName, setTeamFormName] = useState("BIT Rural Water Innovation Hub");
  const [teamFormStudents, setTeamFormStudents] = useState<string[]>([
    "Ananya Sen (M.Tech Env. Engg)",
    "Rahul Roy (Ph.D IoT Systems)",
  ]);
  const [newStudentInput, setNewStudentInput] = useState("");
  const [teamFormDisciplines, setTeamFormDisciplines] = useState<string[]>([
    "Environmental Engineering",
    "Civil Engineering",
    "Chemistry",
    "Electronics",
    "Public Health",
  ]);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: UniversityChallenge = JSON.parse(saved);
        if (parsed.id === challengeId || challengeId === "CH-2026-001") {
          setChallenge(parsed);
          if (parsed.facultyMentor) setTeamFormMentor(parsed.facultyMentor);
          if (parsed.teamName) setTeamFormName(parsed.teamName);
          if (parsed.teamMembers && parsed.teamMembers.length > 0) {
            setTeamFormStudents(parsed.teamMembers);
          }
          if (parsed.selectedDisciplines && parsed.selectedDisciplines.length > 0) {
            setTeamFormDisciplines(parsed.selectedDisciplines);
          }
        }
      }
    } catch (e) {
      console.error("Error reading localStorage:", e);
    }
  }, [challengeId]);

  const updateChallengeState = (updated: UniversityChallenge) => {
    setChallenge(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Error saving localStorage:", e);
    }
  };

  // Express Interest
  const handleExpressInterest = () => {
    const updated: UniversityChallenge = {
      ...challenge,
      status: "INTEREST_EXPRESSED",
    };
    updateChallengeState(updated);
    toast.success(t("dashboard.university.interestExpressedBanner"), {
      description: "Institutional interest confirmed. Proceed to configure project team.",
    });
  };

  // Add/Remove student
  const handleAddStudent = (name: string) => {
    if (!name.trim()) return;
    if (!teamFormStudents.includes(name.trim())) {
      setTeamFormStudents((prev) => [...prev, name.trim()]);
    }
    setNewStudentInput("");
  };

  const handleRemoveStudent = (name: string) => {
    setTeamFormStudents((prev) => prev.filter((s) => s !== name));
  };

  const handleToggleDiscipline = (disc: string) => {
    setTeamFormDisciplines((prev) =>
      prev.includes(disc) ? prev.filter((d) => d !== disc) : [...prev, disc]
    );
  };

  // Create team submit
  const handleCreateTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamFormName.trim()) {
      toast.error("Please enter a team name");
      return;
    }
    if (teamFormStudents.length === 0) {
      toast.error("Please add at least one student member");
      return;
    }

    const updated: UniversityChallenge = {
      ...challenge,
      status: "TEAM_FORMED",
      facultyMentor: teamFormMentor,
      teamName: teamFormName.trim(),
      teamMembers: teamFormStudents,
      selectedDisciplines: teamFormDisciplines,
    };
    updateChallengeState(updated);
    setIsTeamModalOpen(false);
    toast.success(t("dashboard.university.teamFormedBanner"), {
      description: `Team "${teamFormName}" registered under ${teamFormMentor}.`,
    });
  };

  // Start Proposal
  const handleStartProposal = () => {
    const updated: UniversityChallenge = {
      ...challenge,
      status: "PROPOSAL_DRAFT",
    };
    updateChallengeState(updated);
    toast.info(t("dashboard.university.startProposal"), {
      description: t("dashboard.university.startProposalDesc"),
    });
  };

  // Quick Stage Jumper for demo presentation / re-testing buttons
  const handleJumpToStage = (
    stage: "ASSIGNED" | "INTEREST_EXPRESSED" | "TEAM_FORMED" | "PROPOSAL_DRAFT" | "PROPOSAL_SUBMITTED"
  ) => {
    const updated: UniversityChallenge = {
      ...challenge,
      status: stage,
    };
    updateChallengeState(updated);
    toast.info(`Switched to stage: ${t(`statusMap.${stage}` as any) || stage.replace(/_/g, " ")}`, {
      description: "Action buttons for this stage are active.",
    });
  };

  // Reset challenge back to start so all buttons can be clicked from beginning
  const handleResetChallenge = () => {
    const reset: UniversityChallenge = {
      ...challenge,
      status: "ASSIGNED",
      facultyMentor: "",
      teamName: "",
      teamMembers: [],
    };
    updateChallengeState(reset);
    toast.success("Demo Flow Reset", {
      description: "Challenge reset to initial ASSIGNED state. All buttons ready to click.",
    });
  };

  const isTeamFormed =
    challenge.status === "TEAM_FORMED" ||
    challenge.status === "PROPOSAL_DRAFT" ||
    challenge.status === "PROPOSAL_SUBMITTED";

  const navItems: DashboardNavItem[] = [
    { id: "overview", label: t("dashboard.university.tabs.overview"), icon: LayoutDashboard },
    {
      id: "assigned-challenges",
      label: t("dashboard.university.tabs.challenges"),
      icon: Compass,
      badge: 1,
    },
    {
      id: "my-projects",
      label: t("dashboard.university.tabs.projects"),
      icon: FolderKanban,
      badge: isTeamFormed ? 1 : undefined,
    },
    { id: "teams", label: t("dashboard.university.tabs.teams"), icon: Users },
    { id: "faculty-mentors", label: t("dashboard.university.tabs.mentors"), icon: GraduationCap },
    { id: "proposals", label: t("dashboard.university.tabs.proposals"), icon: FileText },
    { id: "milestones", label: t("dashboard.university.tabs.milestones"), icon: Flag },
    { id: "industry-support", label: t("dashboard.university.tabs.industrySupport"), icon: Handshake },
    { id: "notifications", label: t("dashboard.common.notifications"), icon: Bell, badge: 1 },
  ];

  return (
    <DashboardShell
      roleName={t("dashboard.university.roleTitle")}
      roleBadgeText={t("dashboard.university.roleBadge")}
      roleBadgeColor="green"
      organizationName={t("dashboard.university.orgName")}
      navItems={navItems}
      activeNavId="assigned-challenges"
      onNavChange={(id) => {
        if (id === "overview") router.push("/dashboard/university");
      }}
      breadcrumbs={[
        { label: t("nav.dashboard"), href: "/dashboard" },
        { label: t("dashboard.university.roleTitle"), href: "/dashboard/university" },
        { label: t("dashboard.university.tabs.challenges"), href: "/dashboard/university" },
        { label: challenge.id, href: `/dashboard/university/challenges/${challenge.id}` },
      ]}
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Back Link */}
        <Link
          href="/dashboard/university"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-green-800 hover:text-green-950"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to University Dashboard</span>
        </Link>

        {/* AI Workflow Notice Banner */}
        <div className="rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50/80 via-white to-green-50/60 p-4 shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="h-5 w-5 text-[#0F62B4]" />
            </div>
            <div className="space-y-0.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0F62B4]">
                {t("dashboard.university.aiRecommendation")} · Validated Capability Matching
              </span>
              <p className="text-xs sm:text-sm font-medium text-[#111827] leading-relaxed">
                "{t("dashboard.university.aiRecommendationNotice")}"
              </p>
            </div>
          </div>
        </div>

        {/* Main Challenge Card */}
        <div className="bg-white rounded-2xl border border-[#E2E5EA] p-6 sm:p-8 shadow-sm space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 flex-wrap pb-4 border-b border-[#E2E5EA]">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-base font-extrabold text-green-900 bg-green-100 border border-green-300 px-3 py-1 rounded-lg">
                  {challenge.id}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-900 border border-green-300 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-green-700" />
                  AI Match: {challenge.aiMatchScore}%
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    challenge.status === "ASSIGNED"
                      ? "bg-blue-100 text-blue-800"
                      : challenge.status === "INTEREST_EXPRESSED"
                      ? "bg-amber-100 text-amber-800"
                      : challenge.status === "TEAM_FORMED"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-purple-100 text-purple-800"
                  }`}
                >
                  {t(`statusMap.${challenge.status}` as any) ||
                    challenge.status.replace(/_/g, " ")}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827] leading-tight">
                {challenge.title}
              </h1>
              <div className="text-xs text-[#6B7280]">
                {challenge.domain} · Assigned to {challenge.assignedUniversity}
              </div>
            </div>

            {/* Top Action */}
            <div className="shrink-0 flex items-center gap-2">
              {challenge.status === "ASSIGNED" && (
                <button
                  type="button"
                  onClick={handleExpressInterest}
                  className="px-5 py-2.5 rounded-xl bg-green-700 hover:bg-green-800 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors flex items-center gap-2"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {t("dashboard.university.expressInterest")}
                </button>
              )}
            </div>
          </div>

          {/* Banner Notifications */}
          {challenge.status === "INTEREST_EXPRESSED" && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-xs sm:text-sm text-amber-950 flex items-start gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong>{t("dashboard.university.interestExpressedBanner")}</strong>
                <p className="text-xs text-amber-800 mt-0.5">
                  Your institution has signaled research readiness. Configure faculty mentor and student innovator team to formalize the project.
                </p>
              </div>
            </div>
          )}

          {isTeamFormed && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-xs sm:text-sm text-emerald-950 flex items-start gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong>{t("dashboard.university.teamFormedBanner")}</strong>
                <p className="text-xs text-emerald-800 mt-0.5">
                  Team: <strong>{challenge.teamName}</strong> · Mentor: <strong>{challenge.facultyMentor}</strong>
                </p>
              </div>
            </div>
          )}

          {/* 1. PROBLEM */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
              {t("dashboard.common.problem")}
            </h2>
            <p className="text-sm sm:text-base text-[#111827] leading-relaxed bg-[#F7F8FA] p-4 rounded-xl border border-[#E2E5EA]">
              {challenge.problem}
            </p>
          </div>

          {/* 2. TARGET USERS */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
              {t("dashboard.university.targetUsers")}
            </h2>
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 text-sm font-semibold text-[#0F62B4] flex items-center gap-2.5">
              <Users className="h-5 w-5 text-[#0F62B4]" />
              <span>{challenge.targetUsers}</span>
            </div>
          </div>

          {/* 3. CONSTRAINTS & 4. EXPECTED OUTCOME */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Constraints */}
            <div className="p-4 sm:p-5 rounded-xl border border-[#E2E5EA] bg-[#F7F8FA] space-y-3">
              <span className="font-bold text-[#6B7280] uppercase text-xs tracking-wider block">
                {t("dashboard.university.constraints")}
              </span>
              <ul className="space-y-2 text-xs sm:text-sm text-[#111827]">
                {challenge.constraints.map((c, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-red-500 font-bold shrink-0">•</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Expected Outcome */}
            <div className="p-4 sm:p-5 rounded-xl border border-green-200 bg-green-50/50 space-y-3">
              <span className="font-bold text-green-800 uppercase text-xs tracking-wider block">
                {t("dashboard.university.expectedOutcome")}
              </span>
              <ul className="space-y-2 text-xs sm:text-sm text-[#111827]">
                {challenge.expectedOutcome.map((o, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-700 shrink-0 mt-0.5" />
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 5. REQUIRED DISCIPLINES */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
              {t("dashboard.university.requiredDisciplines")}
            </h2>
            <div className="flex flex-wrap gap-2">
              {challenge.requiredDisciplines.map((d, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-50 text-purple-900 border border-purple-200"
                >
                  {d}
                </span>
              ))}
            </div>
          </div>

          {/* 6. TECHNICAL CAPABILITIES */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
              {t("dashboard.university.technicalCapabilities")}
            </h2>
            <div className="flex flex-wrap gap-2">
              {challenge.technicalCapabilities.map((cap, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#F3F4F6] text-[#1F2937] border border-[#E2E5EA]"
                >
                  {cap}
                </span>
              ))}
            </div>
          </div>

          {/* 7. DEDICATED AI CAPABILITY MATCH CARD */}
          <div className="rounded-2xl border border-green-300 bg-gradient-to-br from-green-50/90 via-white to-emerald-50/60 p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-green-700" />
                <h3 className="font-bold text-sm sm:text-base text-green-950">
                  {t("dashboard.university.aiCapabilityMatch")}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded text-xs font-bold bg-green-200 text-green-900">
                  {t("dashboard.university.aiRecommendation")}
                </span>
                <span className="text-xl font-extrabold text-green-800">
                  {challenge.aiMatchScore}%
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs sm:text-sm">
              <span className="font-semibold text-green-950 block">
                {t("dashboard.university.aiMatchWhy")}
              </span>
              <ul className="space-y-1.5 text-green-950">
                {challenge.matchReasons.map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-600 mt-1.5 shrink-0" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-xs text-green-800 italic pt-2 border-t border-green-200/70">
              Notice: AI recommendations evaluate institutional patent publications, faculty domain expertise, and testbed laboratories. AI does not automatically assign commitments; human institutional authorization is required.
            </p>
          </div>

          {/* 8. ACTIVE PROJECT TEAM & MENTORSHIP DISPLAY (IF FORMED) */}
          {isTeamFormed && (
            <div className="p-4 rounded-xl border border-[#E2E5EA] bg-[#F7F8FA] space-y-3 text-xs sm:text-sm">
              <div className="flex items-center justify-between font-bold text-[#111827]">
                <span className="flex items-center gap-2 text-base">
                  <Users className="h-5 w-5 text-[#0F62B4]" />
                  {challenge.teamName || "Project Team"}
                </span>
                <button
                  type="button"
                  onClick={() => setIsTeamModalOpen(true)}
                  className="text-xs text-[#0F62B4] hover:underline font-semibold"
                >
                  Edit Configuration
                </button>
              </div>
              <div className="text-xs sm:text-sm text-[#4B5563] space-y-1.5">
                <div>
                  <span className="text-[#6B7280] font-medium">Faculty Mentor:</span>{" "}
                  <strong>{challenge.facultyMentor}</strong>
                </div>
                <div>
                  <span className="text-[#6B7280] font-medium">Student Members:</span>{" "}
                  {challenge.teamMembers?.join(", ")}
                </div>
                <div>
                  <span className="text-[#6B7280] font-medium">Active Disciplines:</span>{" "}
                  {challenge.selectedDisciplines?.join(", ")}
                </div>
              </div>
            </div>
          )}

          {/* 9. PROJECT TRANSITION LIFECYCLE (Challenge → Interest → Team Formed → Proposal) */}
          <div className="p-4 rounded-xl border border-[#E2E5EA] bg-white space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs uppercase tracking-wider text-[#6B7280] block">
                {t("dashboard.university.workflowTransitionTitle")}
              </span>
              <button
                type="button"
                onClick={handleResetChallenge}
                className="text-xs font-semibold text-amber-800 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Reset demo back to Assigned state"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset Demo Flow
              </button>
            </div>

            {/* Interactive Stage Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs sm:text-sm font-semibold">
              {/* 1. Challenge */}
              <button
                type="button"
                onClick={() => handleJumpToStage("ASSIGNED")}
                className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 cursor-pointer ${
                  challenge.status === "ASSIGNED"
                    ? "bg-green-50 border-green-600 text-green-900 ring-1 ring-green-600/30"
                    : "bg-[#F7F8FA] border-[#E2E5EA] text-[#4B5563] hover:border-green-400 hover:bg-white"
                }`}
                title="Click to jump to Challenge stage"
              >
                <CheckCircle2
                  className={`h-4 w-4 shrink-0 ${
                    challenge.status === "ASSIGNED" ||
                    challenge.status === "INTEREST_EXPRESSED" ||
                    isTeamFormed
                      ? "text-green-600"
                      : "text-[#9CA3AF]"
                  }`}
                />
                <span className="truncate">{t("dashboard.university.workflowStages.challenge")}</span>
              </button>

              {/* 2. University Interest */}
              <button
                type="button"
                onClick={() => handleJumpToStage("INTEREST_EXPRESSED")}
                className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 cursor-pointer ${
                  challenge.status === "INTEREST_EXPRESSED"
                    ? "bg-amber-50 border-amber-600 text-amber-900 ring-1 ring-amber-600/30"
                    : challenge.status !== "ASSIGNED"
                    ? "bg-green-50/50 border-green-200 text-green-900 hover:bg-white"
                    : "bg-[#F7F8FA] border-[#E2E5EA] text-[#4B5563] hover:border-amber-400 hover:bg-white"
                }`}
                title="Click to jump to Interest Expressed stage"
              >
                {challenge.status !== "ASSIGNED" ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                ) : (
                  <div className="h-4 w-4 rounded-full border border-[#D1D5DB] shrink-0" />
                )}
                <span className="truncate">{t("dashboard.university.workflowStages.interest")}</span>
              </button>

              {/* 3. Team Formed */}
              <button
                type="button"
                onClick={() => handleJumpToStage("TEAM_FORMED")}
                className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 cursor-pointer ${
                  challenge.status === "TEAM_FORMED"
                    ? "bg-emerald-50 border-emerald-600 text-emerald-900 ring-1 ring-emerald-600/30"
                    : isTeamFormed
                    ? "bg-green-50/50 border-green-200 text-green-900 hover:bg-white"
                    : "bg-[#F7F8FA] border-[#E2E5EA] text-[#4B5563] hover:border-emerald-400 hover:bg-white"
                }`}
                title="Click to jump to Team Formed stage"
              >
                {isTeamFormed ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                ) : (
                  <div className="h-4 w-4 rounded-full border border-[#D1D5DB] shrink-0" />
                )}
                <span className="truncate">{t("dashboard.university.workflowStages.team")}</span>
              </button>

              {/* 4. Proposal */}
              <button
                type="button"
                onClick={() => handleJumpToStage("PROPOSAL_DRAFT")}
                className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 cursor-pointer ${
                  challenge.status === "PROPOSAL_DRAFT" ||
                  challenge.status === "PROPOSAL_SUBMITTED"
                    ? "bg-purple-50 border-purple-600 text-purple-900 ring-1 ring-purple-600/30"
                    : "bg-[#F7F8FA] border-[#E2E5EA] text-[#4B5563] hover:border-purple-400 hover:bg-white"
                }`}
                title="Click to jump to Proposal stage"
              >
                {challenge.status === "PROPOSAL_SUBMITTED" ? (
                  <CheckCircle2 className="h-4 w-4 text-purple-600 shrink-0" />
                ) : (
                  <div className="h-4 w-4 rounded-full border border-[#D1D5DB] shrink-0" />
                )}
                <span className="truncate">{t("dashboard.university.workflowStages.proposal")}</span>
              </button>
            </div>
            <p className="text-xs text-[#6B7280] italic">
              Tip: Click any stage above anytime to jump directly or re-test the action buttons.
            </p>
          </div>

          {/* 10. ACTION CONTROLS */}
          <div className="space-y-3 pt-4 border-t border-[#E2E5EA]">
            {/* State A: ASSIGNED */}
            {challenge.status === "ASSIGNED" && (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleExpressInterest}
                  className="flex-1 py-3 px-5 rounded-xl bg-green-700 hover:bg-green-800 text-white text-sm font-bold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="h-5 w-5" />
                  {t("dashboard.university.expressInterest")}
                </button>
                <button
                  type="button"
                  onClick={() => setIsTeamModalOpen(true)}
                  className="flex-1 py-3 px-5 rounded-xl border border-green-600 text-green-800 hover:bg-green-50 text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UserPlus className="h-5 w-5" />
                  {t("dashboard.university.createProjectTeam")}
                </button>
              </div>
            )}

            {/* State B: INTEREST EXPRESSED */}
            {challenge.status === "INTEREST_EXPRESSED" && (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setIsTeamModalOpen(true)}
                  className="w-full py-3 px-5 rounded-xl bg-green-700 hover:bg-green-800 text-white text-sm font-bold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UserPlus className="h-5 w-5" />
                  {t("dashboard.university.createProjectTeam")}
                </button>
                <button
                  type="button"
                  onClick={handleResetChallenge}
                  className="w-full py-2 px-4 rounded-xl border border-slate-200 text-[#6B7280] hover:text-[#111827] hover:bg-slate-50 text-xs font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="h-3 w-3" /> Reset back to Assigned
                </button>
              </div>
            )}

            {/* State C: TEAM FORMED */}
            {challenge.status === "TEAM_FORMED" && (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleStartProposal}
                  className="w-full py-3 px-5 rounded-xl bg-[#0F62B4] hover:bg-[#0C4E90] text-white text-sm font-bold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileText className="h-5 w-5" />
                  {t("dashboard.university.startProposal")}
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsTeamModalOpen(true)}
                    className="flex-1 py-2 px-3 rounded-lg border border-slate-200 text-[#4B5563] hover:bg-slate-50 text-xs font-medium flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <UserPlus className="h-3.5 w-3.5" /> Edit Team
                  </button>
                  <button
                    type="button"
                    onClick={handleResetChallenge}
                    className="py-2 px-4 rounded-lg border border-amber-200 text-amber-800 hover:bg-amber-50 text-xs font-medium flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Reset Flow
                  </button>
                </div>
              </div>
            )}

            {/* State D: PROPOSAL DRAFT */}
            {challenge.status === "PROPOSAL_DRAFT" && (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    const updated: UniversityChallenge = {
                      ...challenge,
                      status: "PROPOSAL_SUBMITTED",
                    };
                    updateChallengeState(updated);
                    toast.success(t("dashboard.university.actions.submitProposal"), {
                      description: "Proposal submitted to State Innovation Cell & Industry CSR matching.",
                    });
                  }}
                  className="w-full py-3 px-5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-sm font-bold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Award className="h-5 w-5" />
                  {t("dashboard.university.actions.submitProposal")}
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleJumpToStage("TEAM_FORMED")}
                    className="flex-1 py-2 px-3 rounded-lg border border-slate-200 text-[#4B5563] hover:bg-slate-50 text-xs font-medium flex items-center justify-center gap-1 cursor-pointer"
                  >
                    Back to Team Formed
                  </button>
                  <button
                    type="button"
                    onClick={handleResetChallenge}
                    className="py-2 px-4 rounded-lg border border-amber-200 text-amber-800 hover:bg-amber-50 text-xs font-medium flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Reset Flow
                  </button>
                </div>
              </div>
            )}

            {/* State E: PROPOSAL SUBMITTED */}
            {challenge.status === "PROPOSAL_SUBMITTED" && (
              <div className="space-y-2">
                <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-center text-sm font-semibold text-purple-900">
                  ✓ Technical Proposal Under State Innovation Cell Review
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={handleResetChallenge}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-green-700 hover:bg-green-800 text-white text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <RotateCcw className="h-4 w-4" /> Re-run Demo Flow (Clickable Again)
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsTeamModalOpen(true)}
                    className="py-2.5 px-4 rounded-xl border border-slate-200 text-[#4B5563] hover:bg-slate-50 text-xs sm:text-sm font-medium flex items-center justify-center gap-1 cursor-pointer"
                  >
                    Edit Team
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ───── CREATE PROJECT TEAM MODAL ───── */}
      {isTeamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-xl border border-[#E2E5EA] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-[#E2E5EA]">
              <div>
                <h3 className="text-base font-bold text-[#111827]">
                  {t("dashboard.university.modal.title")}
                </h3>
                <p className="text-xs text-[#6B7280]">
                  {t("dashboard.university.modal.subtitle")} ({challenge.id})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsTeamModalOpen(false)}
                className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-[#111827] hover:bg-[#F3F4F6]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTeamSubmit} className="space-y-4">
              {/* Team Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#374151]">
                  {t("dashboard.university.modal.teamName")} *
                </label>
                <input
                  type="text"
                  required
                  value={teamFormName}
                  onChange={(e) => setTeamFormName(e.target.value)}
                  placeholder={t("dashboard.university.modal.enterTeamName")}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E5EA] text-xs sm:text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              {/* Faculty Mentor */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#374151]">
                  {t("dashboard.university.modal.facultyMentor")} *
                </label>
                <select
                  value={teamFormMentor}
                  onChange={(e) => setTeamFormMentor(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E5EA] text-xs sm:text-sm text-[#111827] bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
                >
                  {FACULTY_MENTOR_OPTIONS.map((mentor) => (
                    <option key={mentor} value={mentor}>
                      {mentor}
                    </option>
                  ))}
                </select>
              </div>

              {/* Student Members */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#374151]">
                  {t("dashboard.university.modal.studentMembers")} *
                </label>

                {/* Current student list */}
                <div className="space-y-1.5">
                  {teamFormStudents.map((st) => (
                    <div
                      key={st}
                      className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-[#F7F8FA] border border-[#E2E5EA] text-xs"
                    >
                      <span className="font-medium text-[#111827]">{st}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveStudent(st)}
                        className="text-red-500 hover:text-red-700 p-0.5"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add new student input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newStudentInput}
                    onChange={(e) => setNewStudentInput(e.target.value)}
                    placeholder="Enter student name & degree..."
                    className="flex-1 px-3 py-1.5 rounded-lg border border-[#E2E5EA] text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddStudent(newStudentInput)}
                    className="px-3 py-1.5 rounded-lg bg-green-700 hover:bg-green-800 text-white text-xs font-semibold shrink-0"
                  >
                    {t("dashboard.university.modal.addStudent")}
                  </button>
                </div>

                {/* Suggestions chips */}
                <div className="pt-1">
                  <span className="text-[10px] text-[#6B7280] block mb-1">
                    Quick suggestions from BIT Mesra R&D talent pool:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {STUDENT_SUGGESTIONS.filter((s) => !teamFormStudents.includes(s)).map(
                      (st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => handleAddStudent(st)}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-green-50 text-green-800 border border-green-200 hover:bg-green-100"
                        >
                          + {st}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Disciplines */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#374151]">
                  {t("dashboard.university.modal.disciplines")}
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {challenge.requiredDisciplines.map((disc) => {
                    const isChecked = teamFormDisciplines.includes(disc);
                    return (
                      <button
                        key={disc}
                        type="button"
                        onClick={() => handleToggleDiscipline(disc)}
                        className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                          isChecked
                            ? "bg-purple-100 text-purple-900 border-purple-300 font-bold"
                            : "bg-[#F7F8FA] text-[#6B7280] border-[#E2E5EA] hover:bg-[#F3F4F6]"
                        }`}
                      >
                        {isChecked ? "✓ " : "+ "}
                        {disc}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E2E5EA]">
                <button
                  type="button"
                  onClick={() => setIsTeamModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[#E2E5EA] text-xs font-semibold text-[#4B5563] hover:bg-[#F3F4F6]"
                >
                  {t("dashboard.university.modal.cancel")}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-green-700 hover:bg-green-800 text-white text-xs font-bold shadow-xs transition-colors"
                >
                  {t("dashboard.university.modal.createTeam")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
