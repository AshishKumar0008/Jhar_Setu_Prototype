"use client";

import React, { useState, useEffect } from "react";
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
  Search,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  PlusCircle,
  Tag,
  Sparkles,
  Award,
  Calendar,
  X,
  ShieldCheck,
  Check,
  Info,
  AlertCircle,
  Building2,
  UserPlus,
  Trash2,
  ArrowRight,
  Layers,
  FlaskConical,
  Microchip,
  Cpu,
  Droplet,
  ExternalLink,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/lib/i18n/language-context";

export interface UniversityChallenge {
  id: string;
  title: string;
  domain: string;
  targetUsers: string;
  problem: string;
  constraints: string[];
  expectedOutcome: string[];
  requiredCapabilities: string[];
  requiredDisciplines: string[];
  technicalCapabilities: string[];
  aiMatchScore: number;
  aiMatchExplanation: string;
  matchReasons: string[];
  assignedUniversity: string;
  status:
    | "ASSIGNED"
    | "INTEREST_EXPRESSED"
    | "TEAM_FORMING"
    | "TEAM_FORMED"
    | "ACCEPTED"
    | "PROPOSAL_DRAFT"
    | "PROPOSAL_SUBMITTED";
  teamMembers?: string[];
  facultyMentor?: string;
  teamName?: string;
  selectedDisciplines?: string[];
  milestones?: { title: string; deadline: string; completed: boolean }[];
  isPrimary?: boolean;
}

export const PRIMARY_WATER_CHALLENGE: UniversityChallenge = {
  id: "CH-2026-001",
  title: "Affordable, Off-Grid Water Quality Monitoring and Iron Removal System",
  domain: "Water Quality / Rural Water",
  targetUsers: "500 rural households",
  problem:
    "Recurring water-quality problems require an affordable solution that can operate in rural communities with minimal electricity and maintenance.",
  constraints: [
    "Low cost",
    "Low maintenance",
    "Works with minimal electricity",
    "Easy for community use",
  ],
  expectedOutcome: [
    "Safe drinking water",
    "Measurable water-quality improvement",
    "Affordable community-level adoption",
  ],
  requiredCapabilities: [
    "Environmental Engineering",
    "Civil Engineering",
    "Chemistry",
    "Electronics / Embedded Systems",
    "Computer Science",
    "Public Health",
    "IoT / Sensors",
    "Water Treatment",
  ],
  requiredDisciplines: [
    "Environmental Engineering",
    "Civil Engineering",
    "Chemistry",
    "Electronics",
    "Computer Science",
    "Public Health",
  ],
  technicalCapabilities: [
    "Water Quality Sensors",
    "IoT",
    "Embedded Systems",
    "Water Treatment",
    "Data Analytics",
    "Low-Power Systems",
  ],
  aiMatchScore: 95,
  aiMatchExplanation:
    "Strong capability match across water treatment, environmental engineering, IoT/sensors, electronics, and data analytics.",
  matchReasons: [
    "Water/environmental expertise",
    "Sensor and IoT capability",
    "Electronics/embedded systems",
    "Faculty research relevance",
    "Multidisciplinary project capacity",
  ],
  assignedUniversity: "Birla Institute of Technology (BIT) Mesra",
  status: "ASSIGNED",
  teamMembers: [],
  facultyMentor: "",
  teamName: "",
  selectedDisciplines: [
    "Environmental Engineering",
    "Chemistry",
    "Electronics",
    "Public Health",
  ],
  milestones: [
    { title: "Lab-scale adsorption & filter optimization", deadline: "Month 1", completed: false },
    { title: "Fabrication of solar-powered IoT telemetry pod", deadline: "Month 2", completed: false },
    { title: "Field validation test across 500 rural households", deadline: "Month 3", completed: false },
  ],
  isPrimary: true,
};

const SECONDARY_COLD_CHALLENGE: UniversityChallenge = {
  id: "CHAL-2026-COLD-02",
  title: "Solar phase-change material (PCM) vaccine cooler",
  domain: "Healthcare Cold-Chain",
  targetUsers: "Khunti district sub-health centres",
  problem:
    "Solar phase-change material (PCM) vaccine cooler maintaining 2-8°C during unannounced 48-hour electrical brownouts in Khunti district sub-health centres.",
  constraints: [
    "Zero hazardous battery disposal",
    "Certified data logger with SMS alert",
    "Works with minimal electricity",
  ],
  expectedOutcome: [
    "Field validated cold box prototype certified by District Medical Officer",
    "Zero vaccine spoilage during power brownouts",
  ],
  requiredCapabilities: [
    "Thermal Energy Storage & PCM",
    "Low-Power Electronics",
    "Healthcare Cold-Chain Standards",
  ],
  requiredDisciplines: [
    "Mechanical Engineering",
    "Electronics",
    "Public Health",
  ],
  technicalCapabilities: [
    "PCM thermal dynamics",
    "Low-power electronics",
    "Remote SMS watchdog",
  ],
  aiMatchScore: 92,
  aiMatchExplanation:
    "Strong mechanical engineering thermal dynamics lab and prior ICMR health-tech pilot experience.",
  matchReasons: [
    "Thermal engineering laboratory facilities",
    "Low-power electronics testing equipment",
    "Healthcare cold-chain project expertise",
  ],
  assignedUniversity: "Birla Institute of Technology (BIT) Mesra",
  status: "ACCEPTED",
  teamMembers: ["Pooja Kumari (B.Tech Mechanical)", "Vivek Sharma (Research Fellow)"],
  facultyMentor: "Prof. Anupam Saxena",
  teamName: "BIT Cryo-Tech Innovators",
  selectedDisciplines: ["Mechanical Engineering", "Electronics"],
  milestones: [
    { title: "PCM thermal simulation", deadline: "Week 3", completed: true },
    { title: "Box insulation construction", deadline: "Week 6", completed: false },
  ],
  isPrimary: false,
};

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

export default function UniversityDashboardPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("overview");
  const [challenges, setChallenges] = useState<UniversityChallenge[]>([
    PRIMARY_WATER_CHALLENGE,
    SECONDARY_COLD_CHALLENGE,
  ]);
  const [selectedChallenge, setSelectedChallenge] = useState<UniversityChallenge | null>(
    PRIMARY_WATER_CHALLENGE
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Team modal state
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

  // Load from localStorage or sync with innovation cell challenge on mount
  useEffect(() => {
    try {
      // 1. Check for dedicated university challenge state
      const savedUniState = localStorage.getItem(STORAGE_KEY);
      if (savedUniState) {
        const parsed: UniversityChallenge = JSON.parse(savedUniState);
        setChallenges((prev) =>
          prev.map((c) => (c.id === parsed.id ? { ...c, ...parsed } : c))
        );
        if (selectedChallenge?.id === parsed.id) {
          setSelectedChallenge(parsed);
        }
      } else {
        // 2. Fallback check for official innovation challenges created in admin panel
        const officialChallengesStr = localStorage.getItem("jharsetu_official_challenges_v1");
        if (officialChallengesStr) {
          const officialChallenges = JSON.parse(officialChallengesStr);
          const foundWater = officialChallenges.find(
            (c: any) => c.id === "CH-2026-001" || c.candidateId === "CAND-JH-2026-001"
          );
          if (foundWater) {
            setChallenges((prev) =>
              prev.map((c) =>
                c.id === "CH-2026-001"
                  ? {
                      ...c,
                      title: foundWater.title || c.title,
                      targetUsers: foundWater.targetUsers || c.targetUsers,
                      constraints: foundWater.constraints || c.constraints,
                      expectedOutcome: foundWater.expectedOutcome || c.expectedOutcome,
                    }
                  : c
              )
            );
          }
        }
      }
    } catch (e) {
      console.error("Error reading localStorage:", e);
    }
  }, []);

  // Synchronize challenge updates to localStorage
  const updateChallengeState = (updated: UniversityChallenge) => {
    setChallenges((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
    setSelectedChallenge(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Error saving to localStorage:", e);
    }
  };

  // 1. Express Interest
  const handleExpressInterest = (ch: UniversityChallenge) => {
    const updated: UniversityChallenge = {
      ...ch,
      status: "INTEREST_EXPRESSED",
    };
    updateChallengeState(updated);
    toast.success(t("dashboard.university.interestExpressedBanner"), {
      description: "Institutional capability acknowledged. Next: Create Project Team.",
    });
  };

  // 2. Open Team Creation Modal
  const handleOpenTeamModal = (ch: UniversityChallenge) => {
    setSelectedChallenge(ch);
    setTeamFormMentor(ch.facultyMentor || FACULTY_MENTOR_OPTIONS[0]);
    setTeamFormName(ch.teamName || "BIT Rural Water Innovation Hub");
    if (ch.teamMembers && ch.teamMembers.length > 0) {
      setTeamFormStudents(ch.teamMembers);
    } else {
      setTeamFormStudents([
        "Ananya Sen (M.Tech Env. Engg)",
        "Rahul Roy (Ph.D IoT Systems)",
      ]);
    }
    if (ch.selectedDisciplines && ch.selectedDisciplines.length > 0) {
      setTeamFormDisciplines(ch.selectedDisciplines);
    }
    setIsTeamModalOpen(true);
  };

  // Add student
  const handleAddStudent = (name: string) => {
    if (!name.trim()) return;
    if (!teamFormStudents.includes(name.trim())) {
      setTeamFormStudents((prev) => [...prev, name.trim()]);
    }
    setNewStudentInput("");
  };

  // Remove student
  const handleRemoveStudent = (name: string) => {
    setTeamFormStudents((prev) => prev.filter((s) => s !== name));
  };

  // Toggle discipline
  const handleToggleDiscipline = (disc: string) => {
    setTeamFormDisciplines((prev) =>
      prev.includes(disc) ? prev.filter((d) => d !== disc) : [...prev, disc]
    );
  };

  // 3. Submit Team Creation
  const handleCreateTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChallenge) return;
    if (!teamFormName.trim()) {
      toast.error("Please enter a team name");
      return;
    }
    if (teamFormStudents.length === 0) {
      toast.error("Please add at least one student member");
      return;
    }

    const updated: UniversityChallenge = {
      ...selectedChallenge,
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

  // 4. Start Proposal
  const handleStartProposal = (ch: UniversityChallenge) => {
    const updated: UniversityChallenge = {
      ...ch,
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
    if (!selectedChallenge) return;
    const updated: UniversityChallenge = {
      ...selectedChallenge,
      status: stage,
    };
    updateChallengeState(updated);
    toast.info(`Switched to stage: ${t(`statusMap.${stage}` as any) || stage.replace(/_/g, " ")}`, {
      description: "Action buttons for this stage are active.",
    });
  };

  // Reset challenge back to start so all buttons can be clicked from beginning
  const handleResetChallenge = () => {
    if (!selectedChallenge) return;
    const reset: UniversityChallenge = {
      ...selectedChallenge,
      status: "ASSIGNED",
      facultyMentor: "",
      teamName: "",
      teamMembers: [],
    };
    updateChallengeState(reset);
    toast.success("Demo Flow Reset", {
      description: "Challenge is now in initial ASSIGNED state. All buttons ready to click.",
    });
  };

  // Primary water challenge active state check
  const waterChallenge = challenges.find((c) => c.id === "CH-2026-001") || challenges[0];
  const isTeamFormed =
    waterChallenge.status === "TEAM_FORMED" ||
    waterChallenge.status === "PROPOSAL_DRAFT" ||
    waterChallenge.status === "PROPOSAL_SUBMITTED";

  // KPIs
  const assignedCount = 1;
  const activeProjectsCount = isTeamFormed ? 1 : 0;
  const proposalsSubmittedCount = waterChallenge.status === "PROPOSAL_SUBMITTED" ? 1 : 0;
  const industryBackingCount = 0;

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
      badge: activeProjectsCount > 0 ? activeProjectsCount : undefined,
    },
    { id: "teams", label: t("dashboard.university.tabs.teams"), icon: Users },
    { id: "faculty-mentors", label: t("dashboard.university.tabs.mentors"), icon: GraduationCap },
    { id: "proposals", label: t("dashboard.university.tabs.proposals"), icon: FileText },
    { id: "milestones", label: t("dashboard.university.tabs.milestones"), icon: Flag },
    { id: "industry-support", label: t("dashboard.university.tabs.industrySupport"), icon: Handshake },
    { id: "notifications", label: t("dashboard.common.notifications"), icon: Bell, badge: 1 },
  ];

  const filteredChallenges = challenges.filter((ch) => {
    const matchesSearch =
      ch.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.problem.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "assigned-challenges") return matchesSearch;
    if (activeTab === "my-projects") return matchesSearch && isTeamFormed && ch.id === "CH-2026-001";
    return matchesSearch;
  });

  return (
    <DashboardShell
      roleName={t("dashboard.university.roleTitle")}
      roleBadgeText={t("dashboard.university.roleBadge")}
      roleBadgeColor="green"
      organizationName={t("dashboard.university.orgName")}
      navItems={navItems}
      activeNavId={activeTab}
      onNavChange={setActiveTab}
      breadcrumbs={[
        { label: t("nav.dashboard"), href: "/dashboard" },
        { label: t("dashboard.university.roleTitle"), href: "/dashboard/university" },
        { label: navItems.find((n) => n.id === activeTab)?.label || t("dashboard.university.tabs.overview") },
      ]}
    >
      {/* ───── METRIC STATS ───── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Assigned Challenges */}
        <div className="p-4 sm:p-5 rounded-2xl border border-[#E2E5EA] bg-white shadow-xs">
          <span className="text-xs font-semibold text-[#6B7280]">
            {t("dashboard.university.stats.assignedChallenges")}
          </span>
          <div className="mt-2 text-2xl sm:text-3xl font-bold text-green-800">
            {assignedCount}
          </div>
          <p className="text-[11px] text-green-700 font-medium mt-1">
            {t("dashboard.university.assignedSub")}
          </p>
        </div>

        {/* Active Projects */}
        <div className="p-4 sm:p-5 rounded-2xl border border-[#E2E5EA] bg-white shadow-xs">
          <span className="text-xs font-semibold text-[#6B7280]">
            {t("dashboard.university.stats.activeProjects")}
          </span>
          <div className="mt-2 text-2xl sm:text-3xl font-bold text-[#0F62B4]">
            {activeProjectsCount}
          </div>
          <p className="text-[11px] text-[#0F62B4] font-medium mt-1">
            {activeProjectsCount > 0
              ? t("dashboard.university.activeProjectsSub")
              : t("dashboard.university.noActiveProjectsSub")}
          </p>
        </div>

        {/* Proposals Submitted */}
        <div className="p-4 sm:p-5 rounded-2xl border border-[#E2E5EA] bg-white shadow-xs">
          <span className="text-xs font-semibold text-[#6B7280]">
            {t("dashboard.university.stats.proposalsSubmitted")}
          </span>
          <div className="mt-2 text-2xl sm:text-3xl font-bold text-purple-700">
            {proposalsSubmittedCount}
          </div>
          <p className="text-[11px] text-purple-700 font-medium mt-1">
            {t("dashboard.university.proposalsSub")}
          </p>
        </div>

        {/* Industry Backing */}
        <div className="p-4 sm:p-5 rounded-2xl border border-[#E2E5EA] bg-white shadow-xs">
          <span className="text-xs font-semibold text-[#6B7280]">
            {t("dashboard.university.stats.industryBacking")}
          </span>
          <div className="mt-2 text-2xl sm:text-3xl font-bold text-amber-600">
            {industryBackingCount}
          </div>
          <p className="text-[11px] text-amber-700 font-medium mt-1">
            {t("dashboard.university.industrySub")}
          </p>
        </div>
      </div>

      {/* ───── AI WORKFLOW NOTICE BANNER (B-ROLL SCRIPT ALIGNED) ───── */}
      <div className="rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50/80 via-white to-green-50/60 p-4 shadow-2xs">
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
            <ShieldCheck className="h-5 w-5 text-[#0F62B4]" />
          </div>
          <div className="space-y-0.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F62B4]">
              {t("dashboard.university.aiRecommendation")} · Verified Innovation Pipeline
            </span>
            <p className="text-xs sm:text-sm font-medium text-[#111827] leading-relaxed">
              "{t("dashboard.university.aiRecommendationNotice")}"
            </p>
          </div>
        </div>
      </div>

      {/* ───── SEARCH & FILTER ───── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-xl border border-[#E2E5EA]">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Search assigned challenges, requirements, or capabilities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-[#E2E5EA] bg-[#F7F8FA] text-xs sm:text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-green-600 focus:bg-white"
          />
        </div>
        <div className="text-xs text-[#6B7280]">
          Showing {filteredChallenges.length} matched challenge(s) for BIT Mesra
        </div>
      </div>

      {/* ───── CHALLENGES LIST & DETAIL SPLIT VIEW ───── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Challenge Cards */}
        <div
          className={`${
            selectedChallenge ? "lg:col-span-6 xl:col-span-6" : "lg:col-span-12"
          } space-y-4 transition-all`}
        >
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-sm font-bold text-[#111827] uppercase tracking-wide">
              {navItems.find((n) => n.id === activeTab)?.label} ({filteredChallenges.length})
            </h2>
            <span className="text-xs text-[#6B7280]">
              Exclusive to Birla Institute of Technology (BIT) Mesra
            </span>
          </div>

          {filteredChallenges.length === 0 ? (
            <div className="p-8 text-center rounded-2xl border border-dashed border-[#E2E5EA] bg-white">
              <Compass className="h-8 w-8 mx-auto text-[#9CA3AF] mb-2" />
              <p className="text-sm font-semibold text-[#111827]">
                {t("dashboard.university.noChallengesTitle")}
              </p>
              <p className="text-xs text-[#6B7280] mt-1">
                {t("dashboard.university.noChallengesDesc")}
              </p>
            </div>
          ) : (
            filteredChallenges.map((ch) => {
              const isSelected = selectedChallenge?.id === ch.id;
              const isWater = ch.id === "CH-2026-001";

              return (
                <div
                  key={ch.id}
                  onClick={() => setSelectedChallenge(ch)}
                  className={`cursor-pointer rounded-2xl border transition-all text-left overflow-hidden ${
                    isWater
                      ? "ring-1 ring-green-600/30 shadow-sm bg-gradient-to-br from-white via-white to-green-50/20"
                      : "bg-white opacity-85"
                  } ${
                    isSelected
                      ? "border-green-600 ring-2 ring-green-600/40 shadow-md"
                      : "border-[#E2E5EA] hover:border-green-400 hover:shadow-xs"
                  }`}
                >
                  {/* Primary Demo Header Ribbon */}
                  {isWater && (
                    <div className="bg-gradient-to-r from-green-700 via-green-800 to-emerald-900 text-white px-4 py-1.5 flex items-center justify-between text-[11px] font-semibold">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                        PRIMARY DEMO CHALLENGE · STATE INNOVATION CELL
                      </span>
                      <span className="bg-white/20 text-white px-2 py-0.5 rounded font-mono text-[10px]">
                        AI MATCH: 95%
                      </span>
                    </div>
                  )}

                  <div className="p-4 sm:p-5 space-y-3">
                    {/* Top Row: ID, Match, Status */}
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-green-900 bg-green-100/70 border border-green-300 px-2 py-0.5 rounded">
                          {ch.id}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-800 border border-green-200 flex items-center gap-1">
                          <Sparkles className="h-3 w-3 text-green-600" />
                          AI Match: {ch.aiMatchScore}%
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            ch.status === "ASSIGNED"
                              ? "bg-blue-100 text-blue-800 border border-blue-200"
                              : ch.status === "INTEREST_EXPRESSED"
                              ? "bg-amber-100 text-amber-800 border border-amber-200"
                              : ch.status === "TEAM_FORMED"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                              : ch.status === "PROPOSAL_DRAFT"
                              ? "bg-purple-100 text-purple-800 border border-purple-200"
                              : "bg-green-100 text-green-800 border border-green-200"
                          }`}
                        >
                          {t(`statusMap.${ch.status}` as any) || ch.status.replace(/_/g, " ")}
                        </span>
                      </div>

                      {ch.facultyMentor ? (
                        <div className="text-[11px] text-[#4B5563] font-medium">
                          {t("dashboard.university.facultyMentor")}: <strong>{ch.facultyMentor.split("(")[0]}</strong>
                        </div>
                      ) : (
                        <div className="text-[11px] text-amber-700 font-medium">
                          Mentorship pending assignment
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-[#111827] leading-snug">
                        {ch.title}
                      </h3>
                      <p className="text-xs text-[#4B5563] mt-1 line-clamp-2 leading-relaxed">
                        {ch.problem}
                      </p>
                    </div>

                    {/* Target Users */}
                    <div className="flex items-center gap-2 text-xs text-[#374151] bg-[#F7F8FA] px-3 py-1.5 rounded-lg border border-[#E2E5EA]">
                      <Users className="h-3.5 w-3.5 text-[#0F62B4]" />
                      <span>
                        <strong>{t("dashboard.university.target")}:</strong> {ch.targetUsers}
                      </span>
                    </div>

                    {/* Required Capabilities Pills */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                        {t("dashboard.university.requiredCapabilities")}:
                      </span>
                      <p className="text-xs text-[#1F2937] font-medium leading-relaxed">
                        {ch.requiredCapabilities.slice(0, 6).join(" · ")}
                        {ch.requiredCapabilities.length > 6 ? "..." : ""}
                      </p>
                    </div>

                    {/* Bottom CTA Row */}
                    <div className="flex items-center justify-between gap-2 pt-3 border-t border-[#F3F4F6] text-xs">
                      <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
                        <Building2 className="h-3.5 w-3.5 text-[#9CA3AF]" />
                        <span className="truncate">{ch.assignedUniversity}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/university/challenges/${ch.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-[11px] text-[#6B7280] hover:text-[#111827] p-1 flex items-center gap-1"
                          title="Open dedicated URL"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Link>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedChallenge(ch);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-green-700 hover:bg-green-800 text-white font-medium text-xs flex items-center gap-1 shadow-2xs transition-colors"
                        >
                          {t("dashboard.university.viewChallengeDetails")}
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Challenge Detail Inspector Workspace */}
        {selectedChallenge && (
          <div className="lg:col-span-6 xl:col-span-6 bg-white rounded-2xl border border-[#E2E5EA] p-5 sm:p-6 shadow-sm space-y-5 sticky top-20">
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-[#E2E5EA]">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-sm font-bold text-green-900 bg-green-100 border border-green-300 px-2 py-0.5 rounded">
                    {selectedChallenge.id}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-green-100 text-green-900 font-bold border border-green-300 flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-green-700" />
                    {selectedChallenge.aiMatchScore}% Match
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      selectedChallenge.status === "ASSIGNED"
                        ? "bg-blue-100 text-blue-800"
                        : selectedChallenge.status === "INTEREST_EXPRESSED"
                        ? "bg-amber-100 text-amber-800"
                        : selectedChallenge.status === "TEAM_FORMED"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {t(`statusMap.${selectedChallenge.status}` as any) ||
                      selectedChallenge.status.replace(/_/g, " ")}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#111827] leading-snug">
                  {selectedChallenge.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedChallenge(null)}
                className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-[#111827] hover:bg-[#F3F4F6] shrink-0"
                aria-label="Close details"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Interest Expressed Banner */}
            {selectedChallenge.status === "INTEREST_EXPRESSED" && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong>{t("dashboard.university.interestExpressedBanner")}</strong>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    Authorized lead: Proceed to assemble your faculty mentor and student innovator team below.
                  </p>
                </div>
              </div>
            )}

            {/* Team Formed Banner */}
            {(selectedChallenge.status === "TEAM_FORMED" ||
              selectedChallenge.status === "PROPOSAL_DRAFT") && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-950 flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <strong>{t("dashboard.university.teamFormedBanner")}</strong>
                  <p className="text-[11px] text-emerald-800 mt-0.5">
                    Team: <strong>{selectedChallenge.teamName}</strong> · Mentor: <strong>{selectedChallenge.facultyMentor}</strong>
                  </p>
                </div>
              </div>
            )}

            {/* 1. PROBLEM */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                {t("dashboard.common.problem")}
              </label>
              <p className="text-xs sm:text-sm text-[#111827] leading-relaxed bg-[#F7F8FA] p-3 rounded-xl border border-[#E2E5EA]">
                {selectedChallenge.problem}
              </p>
            </div>

            {/* 2. TARGET USERS */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                {t("dashboard.university.targetUsers")}
              </label>
              <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-200 text-xs sm:text-sm font-semibold text-[#0F62B4] flex items-center gap-2">
                <Users className="h-4 w-4 text-[#0F62B4]" />
                <span>{selectedChallenge.targetUsers}</span>
              </div>
            </div>

            {/* 3. CONSTRAINTS & 4. EXPECTED OUTCOME */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Constraints */}
              <div className="p-3 rounded-xl border border-[#E2E5EA] bg-[#F7F8FA] space-y-2">
                <span className="font-bold text-[#6B7280] uppercase text-[10px] tracking-wider block">
                  {t("dashboard.university.constraints")}
                </span>
                <ul className="space-y-1 text-[#111827]">
                  {selectedChallenge.constraints.map((c, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-red-500 font-bold shrink-0">•</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Expected Outcome */}
              <div className="p-3 rounded-xl border border-green-200 bg-green-50/50 space-y-2">
                <span className="font-bold text-green-800 uppercase text-[10px] tracking-wider block">
                  {t("dashboard.university.expectedOutcome")}
                </span>
                <ul className="space-y-1 text-[#111827]">
                  {selectedChallenge.expectedOutcome.map((o, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <Check className="h-3.5 w-3.5 text-green-700 shrink-0 mt-0.5" />
                      <span>{o}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 5. REQUIRED DISCIPLINES */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                {t("dashboard.university.requiredDisciplines")}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {selectedChallenge.requiredDisciplines.map((d, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-50 text-purple-900 border border-purple-200"
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>

            {/* 6. TECHNICAL CAPABILITIES */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                {t("dashboard.university.technicalCapabilities")}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {selectedChallenge.technicalCapabilities.map((cap, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#F3F4F6] text-[#1F2937] border border-[#E2E5EA]"
                  >
                    {cap}
                  </span>
                ))}
              </div>
            </div>

            {/* 7. DEDICATED AI CAPABILITY MATCH CARD */}
            <div className="rounded-xl border border-green-300 bg-gradient-to-br from-green-50/90 via-white to-emerald-50/60 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-green-700" />
                  <span className="font-bold text-xs sm:text-sm text-green-950">
                    {t("dashboard.university.aiCapabilityMatch")}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-200 text-green-900">
                    {t("dashboard.university.aiRecommendation")}
                  </span>
                  <span className="text-base font-extrabold text-green-800">
                    {selectedChallenge.aiMatchScore}%
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <span className="font-semibold text-green-900 block">
                  {t("dashboard.university.aiMatchWhy")}
                </span>
                <ul className="space-y-1 text-green-950">
                  {selectedChallenge.matchReasons.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-600 mt-1.5 shrink-0" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-[11px] text-green-800 italic pt-1 border-t border-green-200/70">
                Notice: AI recommendations guide capability discovery. Final participation requires institutional approval and project team formation.
              </p>
            </div>

            {/* 8. ACTIVE PROJECT TEAM & MENTORSHIP DISPLAY (IF FORMED) */}
            {isTeamFormed && (
              <div className="p-3.5 rounded-xl border border-[#E2E5EA] bg-[#F7F8FA] space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-[#111827]">
                  <span className="flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-[#0F62B4]" />
                    {selectedChallenge.teamName || "Project Team"}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleOpenTeamModal(selectedChallenge)}
                    className="text-[11px] text-[#0F62B4] hover:underline font-medium"
                  >
                    Edit Team
                  </button>
                </div>
                <div className="text-[11px] text-[#4B5563] space-y-1">
                  <div>
                    <span className="text-[#6B7280] font-medium">Faculty Mentor:</span>{" "}
                    <strong>{selectedChallenge.facultyMentor}</strong>
                  </div>
                  <div>
                    <span className="text-[#6B7280] font-medium">Student Members:</span>{" "}
                    {selectedChallenge.teamMembers?.join(", ")}
                  </div>
                  <div>
                    <span className="text-[#6B7280] font-medium">Active Disciplines:</span>{" "}
                    {selectedChallenge.selectedDisciplines?.join(", ")}
                  </div>
                </div>
              </div>
            )}

            {/* 9. PROJECT TRANSITION LIFECYCLE (Challenge → Interest → Team Formed → Proposal) */}
            <div className="p-3.5 rounded-xl border border-[#E2E5EA] bg-white space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[10px] uppercase tracking-wider text-[#6B7280]">
                  {t("dashboard.university.workflowTransitionTitle")}
                </span>
                <button
                  type="button"
                  onClick={handleResetChallenge}
                  className="text-[11px] font-semibold text-amber-800 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1 transition-colors cursor-pointer"
                  title="Reset demo back to Assigned state"
                >
                  <RotateCcw className="h-3 w-3" /> Reset Demo
                </button>
              </div>

              {/* Interactive Stage Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[11px] font-semibold">
                {/* 1. Challenge */}
                <button
                  type="button"
                  onClick={() => handleJumpToStage("ASSIGNED")}
                  className={`p-2 rounded-lg border text-left transition-all flex items-center gap-1.5 cursor-pointer ${
                    selectedChallenge.status === "ASSIGNED"
                      ? "bg-green-50 border-green-600 text-green-900 ring-1 ring-green-600/30"
                      : "bg-[#F7F8FA] border-[#E2E5EA] text-[#4B5563] hover:border-green-400 hover:bg-white"
                  }`}
                  title="Click to jump to Challenge stage"
                >
                  <CheckCircle2
                    className={`h-3.5 w-3.5 shrink-0 ${
                      selectedChallenge.status === "ASSIGNED" ||
                      selectedChallenge.status === "INTEREST_EXPRESSED" ||
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
                  className={`p-2 rounded-lg border text-left transition-all flex items-center gap-1.5 cursor-pointer ${
                    selectedChallenge.status === "INTEREST_EXPRESSED"
                      ? "bg-amber-50 border-amber-600 text-amber-900 ring-1 ring-amber-600/30"
                      : selectedChallenge.status !== "ASSIGNED"
                      ? "bg-green-50/50 border-green-200 text-green-900 hover:bg-white"
                      : "bg-[#F7F8FA] border-[#E2E5EA] text-[#4B5563] hover:border-amber-400 hover:bg-white"
                  }`}
                  title="Click to jump to Interest Expressed stage"
                >
                  {selectedChallenge.status !== "ASSIGNED" ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-600 shrink-0" />
                  ) : (
                    <div className="h-3.5 w-3.5 rounded-full border border-[#D1D5DB] shrink-0" />
                  )}
                  <span className="truncate">{t("dashboard.university.workflowStages.interest")}</span>
                </button>

                {/* 3. Team Formed */}
                <button
                  type="button"
                  onClick={() => handleJumpToStage("TEAM_FORMED")}
                  className={`p-2 rounded-lg border text-left transition-all flex items-center gap-1.5 cursor-pointer ${
                    selectedChallenge.status === "TEAM_FORMED"
                      ? "bg-emerald-50 border-emerald-600 text-emerald-900 ring-1 ring-emerald-600/30"
                      : isTeamFormed
                      ? "bg-green-50/50 border-green-200 text-green-900 hover:bg-white"
                      : "bg-[#F7F8FA] border-[#E2E5EA] text-[#4B5563] hover:border-emerald-400 hover:bg-white"
                  }`}
                  title="Click to jump to Team Formed stage"
                >
                  {isTeamFormed ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-600 shrink-0" />
                  ) : (
                    <div className="h-3.5 w-3.5 rounded-full border border-[#D1D5DB] shrink-0" />
                  )}
                  <span className="truncate">{t("dashboard.university.workflowStages.team")}</span>
                </button>

                {/* 4. Proposal */}
                <button
                  type="button"
                  onClick={() => handleJumpToStage("PROPOSAL_DRAFT")}
                  className={`p-2 rounded-lg border text-left transition-all flex items-center gap-1.5 cursor-pointer ${
                    selectedChallenge.status === "PROPOSAL_DRAFT" ||
                    selectedChallenge.status === "PROPOSAL_SUBMITTED"
                      ? "bg-purple-50 border-purple-600 text-purple-900 ring-1 ring-purple-600/30"
                      : "bg-[#F7F8FA] border-[#E2E5EA] text-[#4B5563] hover:border-purple-400 hover:bg-white"
                  }`}
                  title="Click to jump to Proposal stage"
                >
                  {selectedChallenge.status === "PROPOSAL_SUBMITTED" ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-purple-600 shrink-0" />
                  ) : (
                    <div className="h-3.5 w-3.5 rounded-full border border-[#D1D5DB] shrink-0" />
                  )}
                  <span className="truncate">{t("dashboard.university.workflowStages.proposal")}</span>
                </button>
              </div>
              <p className="text-[10px] text-[#6B7280] italic">
                Tip: Click any stage above anytime to jump directly or re-test the action buttons.
              </p>
            </div>

            {/* 10. UNIVERSITY ACTION CONTROLS */}
            <div className="space-y-2.5 pt-2 border-t border-[#E2E5EA]">
              {/* State A: ASSIGNED (Initial state) */}
              {selectedChallenge.status === "ASSIGNED" && (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => handleExpressInterest(selectedChallenge)}
                    className="w-full py-2.5 px-4 rounded-xl bg-green-700 hover:bg-green-800 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {t("dashboard.university.expressInterest")}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenTeamModal(selectedChallenge)}
                    className="w-full py-2 px-3 rounded-xl border border-green-600 text-green-800 hover:bg-green-50 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    {t("dashboard.university.createProjectTeam")}
                  </button>
                </div>
              )}

              {/* State B: INTEREST EXPRESSED */}
              {selectedChallenge.status === "INTEREST_EXPRESSED" && (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => handleOpenTeamModal(selectedChallenge)}
                    className="w-full py-2.5 px-4 rounded-xl bg-green-700 hover:bg-green-800 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <UserPlus className="h-4 w-4" />
                    {t("dashboard.university.createProjectTeam")}
                  </button>

                  <button
                    type="button"
                    onClick={handleResetChallenge}
                    className="w-full py-1.5 px-3 rounded-xl border border-slate-200 text-[#6B7280] hover:text-[#111827] hover:bg-slate-50 text-xs font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="h-3 w-3" /> Reset back to Assigned
                  </button>
                </div>
              )}

              {/* State C: TEAM FORMED */}
              {selectedChallenge.status === "TEAM_FORMED" && (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => handleStartProposal(selectedChallenge)}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#0F62B4] hover:bg-[#0C4E90] text-white text-xs sm:text-sm font-bold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <FileText className="h-4 w-4" />
                    {t("dashboard.university.startProposal")}
                  </button>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenTeamModal(selectedChallenge)}
                      className="flex-1 py-1.5 px-2 rounded-lg border border-slate-200 text-[#4B5563] hover:bg-slate-50 text-xs font-medium flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <UserPlus className="h-3 w-3" /> Edit Team
                    </button>
                    <button
                      type="button"
                      onClick={handleResetChallenge}
                      className="py-1.5 px-3 rounded-lg border border-amber-200 text-amber-800 hover:bg-amber-50 text-xs font-medium flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="h-3 w-3" /> Reset Flow
                    </button>
                  </div>
                </div>
              )}

              {/* State D: PROPOSAL DRAFT */}
              {selectedChallenge.status === "PROPOSAL_DRAFT" && (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      const updated: UniversityChallenge = {
                        ...selectedChallenge,
                        status: "PROPOSAL_SUBMITTED",
                      };
                      updateChallengeState(updated);
                      toast.success(t("dashboard.university.actions.submitProposal"), {
                        description: "Proposal submitted to State Innovation Cell & Industry CSR matching.",
                      });
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Award className="h-4 w-4" />
                    {t("dashboard.university.actions.submitProposal")}
                  </button>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleJumpToStage("TEAM_FORMED")}
                      className="flex-1 py-1.5 px-2 rounded-lg border border-slate-200 text-[#4B5563] hover:bg-slate-50 text-xs font-medium flex items-center justify-center gap-1 cursor-pointer"
                    >
                      Back to Team Formed
                    </button>
                    <button
                      type="button"
                      onClick={handleResetChallenge}
                      className="py-1.5 px-3 rounded-lg border border-amber-200 text-amber-800 hover:bg-amber-50 text-xs font-medium flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="h-3 w-3" /> Reset Flow
                    </button>
                  </div>
                </div>
              )}

              {/* State E: PROPOSAL SUBMITTED */}
              {selectedChallenge.status === "PROPOSAL_SUBMITTED" && (
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-center text-xs font-semibold text-purple-900">
                    ✓ Technical Proposal Under State Innovation Cell Review
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      type="button"
                      onClick={handleResetChallenge}
                      className="flex-1 py-2 px-3 rounded-xl bg-green-700 hover:bg-green-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <RotateCcw className="h-3.5 w-3.5" /> Re-run Demo Flow (Clickable Again)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenTeamModal(selectedChallenge)}
                      className="py-2 px-3 rounded-xl border border-slate-200 text-[#4B5563] hover:bg-slate-50 text-xs font-medium flex items-center justify-center gap-1 cursor-pointer"
                    >
                      Edit Team
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ───── CREATE PROJECT TEAM MODAL ───── */}
      {isTeamModalOpen && selectedChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-xl border border-[#E2E5EA] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-[#E2E5EA]">
              <div>
                <h3 className="text-base font-bold text-[#111827]">
                  {t("dashboard.university.modal.title")}
                </h3>
                <p className="text-xs text-[#6B7280]">
                  {t("dashboard.university.modal.subtitle")} ({selectedChallenge.id})
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
                  {selectedChallenge.requiredDisciplines.map((disc) => {
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
