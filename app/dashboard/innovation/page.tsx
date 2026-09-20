"use client";

import React, { useState, useEffect } from "react";
import {
  DashboardShell,
  DashboardNavItem,
} from "@/components/dashboard/dashboard-shell";
import {
  LayoutDashboard,
  Sparkles,
  Award,
  GitMerge,
  FolderKanban,
  Building2,
  CheckCircle,
  History,
  Bell,
  Search,
  ArrowUpRight,
  Send,
  HelpCircle,
  XCircle,
  X,
  MapPin,
  Tag,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Building,
  GraduationCap,
  FileCheck2,
  Users,
  Eye,
  AlertCircle,
  Cpu,
  Clock,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/lib/i18n/language-context";
import { LocationDisplayMap } from "@/components/patterns/location-display-map";

// ─── TYPES ───

interface InnovationCandidate {
  id: string;
  problemStatement: string;
  domain: string;
  location: string;
  coordinates?: [number, number];
  similarReports: number;
  existingSolutionMatch: string;
  innovationScore: number;
  aiExplanation: string;
  requiredCapabilities: string[];
  linkedReports: string[];
  status: "PENDING" | "APPROVED_CHALLENGE" | "SENT_TO_DEPT" | "REJECTED";
  approvedChallengeId?: string;
}

interface InnovationChallenge {
  id: string;
  candidateId: string;
  title: string;
  problemStatement: string;
  targetUsers: string;
  domain: string;
  region: string;
  constraints: string[];
  expectedOutcome: string[];
  requiredCapabilities: string[];
  context: {
    currentSituation: string;
    whyInsufficient: string;
    expectedImpact: string;
    pilotScope: string;
  };
  sourceInfo: {
    candidateId: string;
    linkedReports: string[];
    similarReportCount: number;
    aiInnovationScore: number;
    aiRecommendation: string;
    aiConfidence: number;
  };
  status: "OFFICIAL_INNOVATION_CHALLENGE" | "OPEN_FOR_MATCHING" | "DRAFT";
  createdDate: string;
  matchingPool: string;
}

interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  entityId: string;
  details: string;
  type: "AI_EVENT" | "HUMAN_ACTION";
}

interface UniversityMatch {
  id: string;
  name: string;
  shortName: string;
  matchScore: number;
  facultyMentor: string;
  department: string;
  infrastructure: string[];
  matchedCapabilities: string[];
  rfpSent: boolean;
}

// ─── INITIAL SEEDED DATA ───

const INITIAL_CANDIDATES: InnovationCandidate[] = [
  {
    id: "CAND-JH-2026-001",
    problemStatement:
      "Severe iron, arsenic, and heavy metal contamination in deep groundwater affecting 18 villages in Chaibasa block. Conventional filtration media clog rapidly and lack off-grid telemetry.",
    domain: "Water Quality & Environmental Sensing",
    location: "Chaibasa Block, West Singhbhum",
    coordinates: [22.5532, 85.8078],
    similarReports: 24,
    existingSolutionMatch:
      "No standard departmental PWD/DWS scheme addresses this geological formation. Standard reverse osmosis non-viable due to high rejection rate in dry season.",
    innovationScore: 94,
    aiExplanation:
      "High recurrence frequency across 24 clustered grievance reports. Fails known standard departmental fixes. Strong candidate for University R&D and low-cost sensor pilot.",
    requiredCapabilities: [
      "IoT",
      "Water quality sensors",
      "Iron removal",
      "Environmental engineering",
      "Low-power systems",
      "Data analytics",
    ],
    linkedReports: ["JH-2026-C201", "JH-2026-C204", "JH-2026-C209"],
    status: "PENDING",
  },
  {
    id: "CAND-JH-2026-002",
    problemStatement:
      "Wild elephant corridor tracking and early warning acoustic sensors to prevent crop raiding and human-wildlife conflict along rail corridors.",
    domain: "Forestry & AI Wildlife Telemetry",
    location: "Latehar Forest Division, Latehar",
    coordinates: [23.6345, 84.7891],
    similarReports: 18,
    existingSolutionMatch:
      "Traditional watchtowers lack night-vision infrared detection. Existing electric fences disrupted by terrain.",
    innovationScore: 88,
    aiExplanation:
      "Inter-departmental issue (Forest + Railways). Edge AI audio detection of vocalizations & seismic footfall recommended.",
    requiredCapabilities: [
      "Edge-AI bioacoustic processing",
      "Low-power LoRaWAN nodes",
      "Solar harvesters for dense canopy",
    ],
    linkedReports: ["JH-2026-F104", "JH-2026-F112"],
    status: "PENDING",
  },
  {
    id: "CAND-JH-2026-003",
    problemStatement:
      "Cold-chain failure in remote health sub-centers during 8-hour grid outages, leading to tribal child vaccine wastage.",
    domain: "Healthcare & Renewable Storage",
    location: "Torpa & Rania Blocks, Khunti",
    similarReports: 9,
    existingSolutionMatch:
      "Diesel generators expensive to maintain and fuel supply irregular in monsoon.",
    innovationScore: 91,
    aiExplanation:
      "Phase-change material (PCM) passive solar cooling or modular LFP battery backup would stabilize cold-chain without recurring fuel logistics.",
    requiredCapabilities: [
      "PCM passive cooling tech",
      "Micro-solar hybrid storage",
      "Remote SMS temperature watchdog",
    ],
    linkedReports: ["JH-2026-H045", "JH-2026-H052"],
    status: "APPROVED_CHALLENGE",
    approvedChallengeId: "CHAL-2026-COLD-01",
  },
];

const INITIAL_CHALLENGES: InnovationChallenge[] = [
  {
    id: "CHAL-2026-COLD-01",
    candidateId: "CAND-JH-2026-003",
    title: "Solar Phase-Change Vaccine Cold-Chain Preservation System",
    problemStatement:
      "Cold-chain failure in remote health sub-centers during 8-hour grid outages, leading to tribal child vaccine wastage.",
    targetUsers: "12 remote rural health sub-centres",
    domain: "Healthcare & Renewable Storage",
    region: "Khunti District (Torpa & Rania)",
    constraints: [
      "Zero hazardous battery disposal",
      "Works with minimal electricity",
      "Low maintenance",
    ],
    expectedOutcome: [
      "Maintain 2-8°C for 72h without grid power",
      "Automated SMS temperature alerts",
    ],
    requiredCapabilities: [
      "PCM passive cooling tech",
      "Micro-solar hybrid storage",
      "Low-power electronics",
    ],
    context: {
      currentSituation: "Vaccines spoiled during frequent summer electrical brownouts.",
      whyInsufficient: "Diesel backup generators too costly and difficult to fuel.",
      expectedImpact: "100% vaccine viability for 4,200 tribal infants.",
      pilotScope: "60-day trial across 4 Primary Health Centres.",
    },
    sourceInfo: {
      candidateId: "CAND-JH-2026-003",
      linkedReports: ["JH-2026-H045", "JH-2026-H052"],
      similarReportCount: 9,
      aiInnovationScore: 91,
      aiRecommendation: "Innovation / Research Required",
      aiConfidence: 89,
    },
    status: "OPEN_FOR_MATCHING",
    createdDate: "2026-09-12",
    matchingPool: "BIT Mesra, NIT Jamshedpur",
  },
  {
    id: "CHAL-2026-WTR-01",
    candidateId: "CAND-JH-OLD-00",
    title: "Decentralized Arsenic Sensor Telemetry Unit",
    problemStatement:
      "High fluoride and arsenic contamination across Sahibganj tubewells exceeding WHO limits.",
    targetUsers: "350 rural households",
    domain: "Water Quality",
    region: "Sahibganj District",
    constraints: ["Low cost", "Low maintenance", "Community-friendly"],
    expectedOutcome: ["Water quality improvement below BIS 10500"],
    requiredCapabilities: ["Water treatment", "IoT sensors", "Environmental engineering"],
    context: {
      currentSituation: "Groundwater contains elevated toxic arsenic.",
      whyInsufficient: "Membrane filters clog rapidly.",
      expectedImpact: "Safe drinking water for rural habitations.",
      pilotScope: "90-day multi-habitation test.",
    },
    sourceInfo: {
      candidateId: "CAND-JH-OLD-00",
      linkedReports: ["JH-2026-W001"],
      similarReportCount: 14,
      aiInnovationScore: 90,
      aiRecommendation: "Innovation / Research Required",
      aiConfidence: 88,
    },
    status: "OPEN_FOR_MATCHING",
    createdDate: "2026-09-15",
    matchingPool: "IIT (ISM) Dhanbad",
  },
];

const INITIAL_AUDIT_LOG: AuditEvent[] = [
  {
    id: "aud-001",
    timestamp: "10:04",
    actor: "System (Gemini 2.5 Flash / AI Pipeline)",
    action: "AI identified innovation candidate",
    entityId: "CAND-JH-2026-001",
    details:
      "High recurrence frequency across 24 clustered reports. Anomaly score 94/100. Recommended Path C candidate.",
    type: "AI_EVENT",
  },
  {
    id: "aud-002",
    timestamp: "10:08",
    actor: "Dr. Ananya Verma (Authorized Innovation Cell Admin)",
    action: "Candidate reviewed by authorized user",
    entityId: "CAND-JH-2026-001",
    details:
      "Corroborated 24 recurring citizen grievances in Chaibasa. Verified lack of standard departmental PWD/DWS scheme.",
    type: "HUMAN_ACTION",
  },
];

const INITIAL_UNIVERSITIES: UniversityMatch[] = [
  {
    id: "uni-bit-mesra",
    name: "Birla Institute of Technology (BIT) Mesra",
    shortName: "BIT Mesra",
    matchScore: 96,
    facultyMentor: "Dr. S. K. Pathak (Prof., Environmental Engineering & Water Chemistry)",
    department: "Dept. of Chemical & Environmental Engineering",
    infrastructure: [
      "Water Quality Testing & Chromatography Lab",
      "Indigenous Adsorbent Media Prototyping Facility",
      "Embedded IoT Sensor Systems Research Group",
    ],
    matchedCapabilities: [
      "IoT",
      "Water quality sensors",
      "Iron removal",
      "Environmental engineering",
      "Low-power systems",
    ],
    rfpSent: false,
  },
  {
    id: "uni-nit-jsr",
    name: "National Institute of Technology (NIT) Jamshedpur",
    shortName: "NIT Jamshedpur",
    matchScore: 89,
    facultyMentor: "Dr. Rameshwar Singh (Associate Prof., Civil & Environmental Engg)",
    department: "Environmental Engineering Division",
    infrastructure: [
      "Hydraulics & Filtration Test Bench",
      "Rural Water Purification Pilot Station",
      "Telemetry Analytics Cluster",
    ],
    matchedCapabilities: [
      "Water treatment",
      "Environmental engineering",
      "Data analytics",
    ],
    rfpSent: false,
  },
  {
    id: "uni-iit-dhanbad",
    name: "Indian Institute of Technology (ISM) Dhanbad",
    shortName: "IIT (ISM) Dhanbad",
    matchScore: 87,
    facultyMentor: "Prof. M. K. Jain (Chairperson, Centre for Environmental Studies)",
    department: "Centre for Environmental Science & Engineering",
    infrastructure: [
      "Advanced Geochemistry & Heavy Metal Lab",
      "Remote Sensor Telemetry Group",
      "GIS & Hydro-geological Modeling Unit",
    ],
    matchedCapabilities: [
      "IoT",
      "Sensors",
      "Data analytics",
      "Environmental engineering",
    ],
    rfpSent: false,
  },
];

// ─── MAIN COMPONENT ───

export default function InnovationCellDashboard() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("overview");
  const [candidates, setCandidates] = useState<InnovationCandidate[]>(INITIAL_CANDIDATES);
  const [challenges, setChallenges] = useState<InnovationChallenge[]>(INITIAL_CHALLENGES);
  const [selectedCandidate, setSelectedCandidate] = useState<InnovationCandidate | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [auditLog, setAuditLog] = useState<AuditEvent[]>(INITIAL_AUDIT_LOG);
  const [universities, setUniversities] = useState<UniversityMatch[]>(INITIAL_UNIVERSITIES);

  // Workflow state machine
  const [isCreatingChallenge, setIsCreatingChallenge] = useState(false);
  const [creationSuccessChallenge, setCreationSuccessChallenge] = useState<InnovationChallenge | null>(null);
  const [activeMatchingChallenge, setActiveMatchingChallenge] = useState<InnovationChallenge | null>(null);

  // Challenge Form State (Prefilled with Demo Data per Section 3)
  const [formTitle, setFormTitle] = useState(
    "Affordable, Off-Grid Water Quality Monitoring and Iron Removal System"
  );
  const [formProblem, setFormProblem] = useState(
    "Severe iron, arsenic, and heavy metal contamination in deep groundwater affecting 18 villages in Chaibasa block. Conventional filtration media clog rapidly and lack off-grid telemetry."
  );
  const [formTargetUsers, setFormTargetUsers] = useState("500 rural households");
  const [formRegion, setFormRegion] = useState("Chaibasa Block, West Singhbhum");
  const [formDomain, setFormDomain] = useState("Water Quality / Rural Water");

  const [formConstraints, setFormConstraints] = useState<string[]>([
    "Low cost",
    "Low maintenance",
    "Works with minimal electricity",
    "Easy for community use",
    "Scalable deployment",
  ]);

  const [formOutcomes, setFormOutcomes] = useState<string[]>([
    "Safe drinking water",
    "Measurable water-quality improvement",
    "Affordable community-level adoption",
  ]);

  const [formCapabilities, setFormCapabilities] = useState<string[]>([
    "IoT",
    "Water quality sensors",
    "Iron removal",
    "Environmental engineering",
    "Low-power systems",
    "Data analytics",
  ]);

  const [formCurrentSituation, setFormCurrentSituation] = useState(
    "Over 18 habitations rely on deep tubewells with severe iron (3.2 mg/L) and arsenic traces exceeding BIS 10500 standards."
  );
  const [formWhyInsufficient, setFormWhyInsufficient] = useState(
    "Grid power suffers 4-6h daily outages; standard reverse osmosis produces high toxic reject water and replacement membranes are unaffordable for gram panchayats."
  );
  const [formExpectedImpact, setFormExpectedImpact] = useState(
    "500 rural households receive clean potable water adhering to BIS 10500 standards with real-time contamination alerts."
  );
  const [formPilotScope, setFormPilotScope] = useState(
    "90-day multi-habitation trial deploying 3 solar IoT monitoring pods and community-managed filtration units."
  );

  // Sync state with localStorage on mount (for persistent demo presentation)
  useEffect(() => {
    try {
      const savedChallenges = localStorage.getItem("jharsetu_official_challenges_v1");
      if (savedChallenges) {
        const parsed = JSON.parse(savedChallenges);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setChallenges(parsed);
        }
      }
      const savedAudits = localStorage.getItem("jharsetu_innovation_audit_v1");
      if (savedAudits) {
        const parsed = JSON.parse(savedAudits);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAuditLog(parsed);
        }
      }
    } catch {
      // fallback to memory
    }
  }, []);

  const navItems: DashboardNavItem[] = [
    { id: "overview", label: t("dashboard.innovation.tabs.overview"), icon: LayoutDashboard },
    {
      id: "candidates",
      label: t("dashboard.innovation.tabs.candidates"),
      icon: Sparkles,
      badge: candidates.filter((c) => c.status === "PENDING").length,
    },
    {
      id: "challenges",
      label: t("dashboard.innovation.tabs.challenges"),
      icon: Award,
      badge: challenges.length,
    },
    { id: "university-matching", label: t("dashboard.innovation.tabs.matching"), icon: GitMerge },
    { id: "projects", label: t("dashboard.innovation.tabs.projects"), icon: FolderKanban },
    { id: "partnerships", label: t("dashboard.innovation.tabs.partnerships"), icon: Building2 },
    { id: "pilot-readiness", label: t("dashboard.innovation.tabs.pilotReadiness"), icon: CheckCircle },
    { id: "audit-timeline", label: t("dashboard.innovation.tabs.auditTimeline"), icon: History },
    { id: "notifications", label: t("dashboard.common.notifications"), icon: Bell, badge: 3 },
  ];

  // ─── ACTION HANDLERS ───

  const handleOpenCreateChallenge = (cand: InnovationCandidate) => {
    setSelectedCandidate(cand);
    setFormProblem(cand.problemStatement);
    setFormRegion(cand.location);
    setIsCreatingChallenge(true);
    setCreationSuccessChallenge(null);
  };

  const handleSaveChallengeDraft = () => {
    toast.info("Draft Saved", {
      description: "Challenge configuration saved as draft.",
    });
  };

  const handleCreateChallengeSubmit = () => {
    if (!formTitle.trim() || !formProblem.trim() || !formTargetUsers.trim()) {
      toast.error("Validation Error", {
        description: "Challenge Title, Problem Statement, and Target Users are required.",
      });
      return;
    }

    const newId = "CH-2026-001";
    const targetCandidateId = selectedCandidate?.id || "CAND-JH-2026-001";

    const newChallenge: InnovationChallenge = {
      id: newId,
      candidateId: targetCandidateId,
      title: formTitle.trim(),
      problemStatement: formProblem.trim(),
      targetUsers: formTargetUsers.trim(),
      domain: formDomain.trim(),
      region: formRegion.trim(),
      constraints: [...formConstraints],
      expectedOutcome: [...formOutcomes],
      requiredCapabilities: [...formCapabilities],
      context: {
        currentSituation: formCurrentSituation.trim(),
        whyInsufficient: formWhyInsufficient.trim(),
        expectedImpact: formExpectedImpact.trim(),
        pilotScope: formPilotScope.trim(),
      },
      sourceInfo: {
        candidateId: targetCandidateId,
        linkedReports: selectedCandidate?.linkedReports || ["JH-2026-C201", "JH-2026-C204", "JH-2026-C209"],
        similarReportCount: selectedCandidate?.similarReports || 24,
        aiInnovationScore: selectedCandidate?.innovationScore || 94,
        aiRecommendation: "Innovation / Research Required",
        aiConfidence: 91,
      },
      status: "OFFICIAL_INNOVATION_CHALLENGE",
      createdDate: new Date().toISOString().split("T")[0],
      matchingPool: "BIT Mesra, NIT Jamshedpur, IIT (ISM) Dhanbad",
    };

    // 1. Update challenges list
    const updatedChallenges = [newChallenge, ...challenges.filter((c) => c.id !== newId)];
    setChallenges(updatedChallenges);
    try {
      localStorage.setItem("jharsetu_official_challenges_v1", JSON.stringify(updatedChallenges));
    } catch {}

    // 2. Update candidate status
    const updatedCandidates = candidates.map((c) =>
      c.id === targetCandidateId
        ? { ...c, status: "APPROVED_CHALLENGE" as const, approvedChallengeId: newId }
        : c
    );
    setCandidates(updatedCandidates);
    if (selectedCandidate) {
      setSelectedCandidate({
        ...selectedCandidate,
        status: "APPROVED_CHALLENGE",
        approvedChallengeId: newId,
      });
    }

    // 3. Append to Audit Event Log
    const nowHours = new Date().getHours().toString().padStart(2, "0");
    const nowMins = new Date().getMinutes().toString().padStart(2, "0");
    const creationAudit: AuditEvent = {
      id: `aud-${Date.now()}`,
      timestamp: `${nowHours}:${nowMins}`,
      actor: "Dr. Ananya Verma (Authorized Innovation Cell Admin)",
      action: `Innovation Challenge ${newId} created`,
      entityId: newId,
      details: `Human Approval Gate passed: Candidate ${targetCandidateId} created and approved as Official Innovation Challenge for ${formTargetUsers}.`,
      type: "HUMAN_ACTION",
    };
    const updatedAudits = [creationAudit, ...auditLog];
    setAuditLog(updatedAudits);
    try {
      localStorage.setItem("jharsetu_innovation_audit_v1", JSON.stringify(updatedAudits));
    } catch {}

    // 4. Set creation success state
    setCreationSuccessChallenge(newChallenge);
    setActiveMatchingChallenge(newChallenge);

    toast.success(`Innovation Challenge ${newId} created successfully.`, {
      description: "Status: Approved / Open for University Matching",
    });
  };

  const handleStartUniversityMatching = (challenge: InnovationChallenge) => {
    setActiveMatchingChallenge(challenge);
    setIsCreatingChallenge(false);
    setCreationSuccessChallenge(null);
    setActiveTab("university-matching");
    toast.info("University Capability Matching Initialized", {
      description: `Evaluating university lab profiles against capabilities for ${challenge.id}.`,
    });
  };

  const handleDispatchRfp = (uniId: string) => {
    setUniversities((prev) =>
      prev.map((u) => (u.id === uniId ? { ...u, rfpSent: true } : u))
    );
    const uni = universities.find((u) => u.id === uniId);
    toast.success("RFP Dispatched", {
      description: `Innovation Challenge RFP for ${activeMatchingChallenge?.id || "CH-2026-001"} sent to Dean of R&D at ${uni?.name || "University"}.`,
    });
  };

  const handleSendToDepartment = (cand: InnovationCandidate) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === cand.id ? { ...c, status: "SENT_TO_DEPT" } : c))
    );
    if (selectedCandidate?.id === cand.id) {
      setSelectedCandidate({ ...selectedCandidate, status: "SENT_TO_DEPT" });
    }
    toast.info("Rerouted to Line Department (Path B)", {
      description: `Candidate ${cand.id} transferred to departmental grievance queue.`,
    });
  };

  const handleRequestInfo = (cand: InnovationCandidate) => {
    toast.info("Information Request Dispatched", {
      description: `Field officer and citizen notified to provide water quality lab reports for ${cand.id}.`,
    });
  };

  const handleReject = (cand: InnovationCandidate) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === cand.id ? { ...c, status: "REJECTED" } : c))
    );
    if (selectedCandidate?.id === cand.id) {
      setSelectedCandidate({ ...selectedCandidate, status: "REJECTED" });
    }
    toast.error("Candidate Rejected", {
      description: `Candidate ${cand.id} marked non-viable for state R&D funding.`,
    });
  };

  const filteredCandidates = candidates.filter((c) => {
    const q = searchQuery.toLowerCase();
    const matches =
      c.id.toLowerCase().includes(q) ||
      c.problemStatement.toLowerCase().includes(q) ||
      c.domain.toLowerCase().includes(q) ||
      c.location.toLowerCase().includes(q);

    if (activeTab === "candidates") return matches && c.status === "PENDING";
    return matches;
  });

  const filteredChallenges = challenges.filter((ch) => {
    const q = searchQuery.toLowerCase();
    return (
      ch.id.toLowerCase().includes(q) ||
      ch.title.toLowerCase().includes(q) ||
      ch.domain.toLowerCase().includes(q) ||
      ch.region.toLowerCase().includes(q)
    );
  });

  return (
    <DashboardShell
      roleName={t("dashboard.innovation.roleTitle")}
      roleBadgeText={t("dashboard.innovation.roleBadge")}
      roleBadgeColor="purple"
      organizationName={t("dashboard.innovation.orgName")}
      navItems={navItems}
      activeNavId={activeTab}
      onNavChange={(tabId) => {
        setActiveTab(tabId);
        setIsCreatingChallenge(false);
        setCreationSuccessChallenge(null);
      }}
      breadcrumbs={[
        { label: t("nav.dashboard"), href: "/dashboard" },
        { label: t("dashboard.innovation.roleTitle"), href: "/dashboard/innovation" },
        { label: navItems.find((n) => n.id === activeTab)?.label || t("dashboard.innovation.tabs.overview") },
      ]}
    >
      {/* ───── SECTION 8: DASHBOARD ANALYTICS KPI CARDS ───── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Innovation Candidates */}
        <div className="p-3 sm:p-4 rounded-2xl border border-[#E2E5EA] bg-white shadow-xs">
          <span className="text-xs font-semibold text-[#6B7280]">
            {t("dashboard.innovation.stats.innovationCandidates")}
          </span>
          <div className="mt-1.5 text-2xl font-bold text-purple-700">
            {candidates.length}
          </div>
          <p className="text-[11px] text-purple-600 font-medium mt-0.5">AI identified</p>
        </div>

        {/* Pending Review */}
        <div className="p-3 sm:p-4 rounded-2xl border border-[#E2E5EA] bg-white shadow-xs">
          <span className="text-xs font-semibold text-[#6B7280]">
            {t("dashboard.innovation.stats.pendingReview")}
          </span>
          <div className="mt-1.5 text-2xl font-bold text-amber-600">
            {candidates.filter((c) => c.status === "PENDING").length}
          </div>
          <p className="text-[11px] text-amber-600 font-medium mt-0.5">Requires review</p>
        </div>

        {/* Active Challenges (Increments +1 upon creation) */}
        <div className="p-3 sm:p-4 rounded-2xl border border-[#E2E5EA] bg-white shadow-xs ring-1 ring-[#0F62B4]/20">
          <span className="text-xs font-semibold text-[#6B7280]">
            {t("dashboard.innovation.stats.activeChallenges")}
          </span>
          <div className="mt-1.5 text-2xl font-bold text-[#0F62B4]">
            {challenges.length}
          </div>
          <p className="text-[11px] text-[#0F62B4] font-medium mt-0.5">Official challenges</p>
        </div>

        {/* University Matching */}
        <div className="p-3 sm:p-4 rounded-2xl border border-[#E2E5EA] bg-white shadow-xs">
          <span className="text-xs font-semibold text-[#6B7280]">
            {t("dashboard.innovation.stats.universityMatching")}
          </span>
          <div className="mt-1.5 text-2xl font-bold text-green-700">4</div>
          <p className="text-[11px] text-green-700 font-medium mt-0.5">R&D matches</p>
        </div>

        {/* Projects */}
        <div className="p-3 sm:p-4 rounded-2xl border border-[#E2E5EA] bg-white shadow-xs">
          <span className="text-xs font-semibold text-[#6B7280]">
            {t("dashboard.innovation.stats.projects")}
          </span>
          <div className="mt-1.5 text-2xl font-bold text-orange-600">3</div>
          <p className="text-[11px] text-orange-600 font-medium mt-0.5">Under development</p>
        </div>

        {/* Pilot Ready */}
        <div className="p-3 sm:p-4 rounded-2xl border border-[#E2E5EA] bg-white shadow-xs">
          <span className="text-xs font-semibold text-[#6B7280]">
            {t("dashboard.innovation.stats.pilotReady")}
          </span>
          <div className="mt-1.5 text-2xl font-bold text-emerald-700">2</div>
          <p className="text-[11px] text-emerald-700 font-medium mt-0.5">Field validated</p>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          CREATE INNOVATION CHALLENGE VIEW (FULL-WIDTH PANEL / PAGE)
          Sections 2, 3, 4, 5, 6
      ───────────────────────────────────────────────────────────── */}
      {isCreatingChallenge ? (
        <div className="space-y-6">
          {/* Header & Back Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-[#E2E5EA] shadow-xs">
            <div>
              <button
                type="button"
                onClick={() => setIsCreatingChallenge(false)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6B7280] hover:text-[#111827] mb-2 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                {t("actions.back")} to Candidate Review
              </button>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-[#111827]">
                  {t("dashboard.innovation.createChallengeTitle")}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                  {t("dashboard.innovation.preview.approvedByCell")}
                </span>
              </div>
              <p className="text-xs text-[#6B7280] mt-1">
                {t("dashboard.innovation.createChallengeSub")}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveChallengeDraft}
                className="px-3.5 py-2 rounded-xl border border-[#E2E5EA] bg-white hover:bg-[#F3F4F6] text-xs font-semibold text-[#374151] transition-colors"
              >
                {t("dashboard.innovation.preview.saveDraft")}
              </button>
              <button
                type="button"
                onClick={handleCreateChallengeSubmit}
                className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Award className="h-4 w-4" />
                {t("dashboard.innovation.preview.submitCreate")}
              </button>
            </div>
          </div>

          {/* SUCCESS MODAL / CALLOUT (Section 5 & 6) */}
          {creationSuccessChallenge && (
            <div className="bg-emerald-50 border-2 border-emerald-500/50 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-xs">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-emerald-950">
                      {t("dashboard.innovation.createdSuccess.title")}
                    </h2>
                    <p className="font-mono text-xs font-bold text-emerald-800 mt-0.5">
                      Challenge ID: {creationSuccessChallenge.id} · Status: OFFICIAL_INNOVATION_CHALLENGE
                    </p>
                    <p className="text-xs text-emerald-700 mt-1">
                      {t("dashboard.innovation.createdSuccess.statusLabel")}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setCreationSuccessChallenge(null)}
                  className="p-1 rounded-md text-emerald-700 hover:text-emerald-900"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Transition Pipeline Banner */}
              <div className="p-3.5 rounded-xl bg-white border border-emerald-200 text-xs">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280] mb-1">
                  Next Step Workflow
                </div>
                <div className="flex items-center gap-2 flex-wrap text-emerald-900 font-semibold">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">Challenge Created</span>
                  <span>→</span>
                  <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800">Required Capabilities</span>
                  <span>→</span>
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800">AI University Matching</span>
                  <span>→</span>
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800">Recommended Universities</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingChallenge(false);
                    setActiveTab("challenges");
                  }}
                  className="px-4 py-2 rounded-lg border border-emerald-300 bg-white hover:bg-emerald-50 text-xs font-semibold text-emerald-900"
                >
                  {t("dashboard.innovation.createdSuccess.viewChallengeList")}
                </button>
                <button
                  type="button"
                  onClick={() => handleStartUniversityMatching(creationSuccessChallenge)}
                  className="px-5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs flex items-center gap-2"
                >
                  <GitMerge className="h-4 w-4" />
                  {t("dashboard.innovation.createdSuccess.matchUniversitiesBtn")} →
                </button>
              </div>
            </div>
          )}

          {/* TWO-COLUMN FORM & PREVIEW (Desktop Split, Mobile Stacked) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: FORM SECTIONS A through F (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* SECTION A: Challenge Overview */}
              <div className="bg-white rounded-2xl border border-[#E2E5EA] p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#E2E5EA]">
                  <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wide">
                    {t("dashboard.innovation.sections.overview")}
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                    {t("dashboard.innovation.preview.approvedByAdmin")}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-[#4B5563] mb-1">
                      {t("dashboard.innovation.fields.challengeTitle")} *
                    </label>
                    <input
                      type="text"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-[#E2E5EA] bg-[#F7F8FA] text-xs sm:text-sm font-semibold text-[#111827] focus:bg-white focus:ring-2 focus:ring-purple-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#4B5563] mb-1">
                      {t("dashboard.innovation.fields.problemStatement")} *
                    </label>
                    <textarea
                      rows={3}
                      value={formProblem}
                      onChange={(e) => setFormProblem(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-[#E2E5EA] bg-[#F7F8FA] text-xs text-[#111827] leading-relaxed focus:bg-white focus:ring-2 focus:ring-purple-600 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#4B5563] mb-1">
                        {t("dashboard.innovation.fields.targetUsers")} *
                      </label>
                      <input
                        type="text"
                        value={formTargetUsers}
                        onChange={(e) => setFormTargetUsers(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-[#E2E5EA] bg-[#F7F8FA] text-xs font-medium text-[#111827] focus:bg-white focus:ring-2 focus:ring-purple-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#4B5563] mb-1">
                        {t("dashboard.innovation.fields.affectedRegion")}
                      </label>
                      <input
                        type="text"
                        value={formRegion}
                        onChange={(e) => setFormRegion(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-[#E2E5EA] bg-[#F7F8FA] text-xs font-medium text-[#111827] focus:bg-white focus:ring-2 focus:ring-purple-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#4B5563] mb-1">
                      {t("dashboard.innovation.fields.domain")}
                    </label>
                    <input
                      type="text"
                      value={formDomain}
                      onChange={(e) => setFormDomain(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-[#E2E5EA] bg-[#F7F8FA] text-xs font-medium text-[#111827] focus:bg-white focus:ring-2 focus:ring-purple-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION B: Constraints */}
              <div className="bg-white rounded-2xl border border-[#E2E5EA] p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#E2E5EA]">
                  <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wide">
                    {t("dashboard.innovation.sections.constraints")}
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                    {t("dashboard.innovation.preview.approvedByAdmin")}
                  </span>
                </div>

                <div className="space-y-2">
                  {[
                    "Low cost",
                    "Low maintenance",
                    "Works with minimal electricity",
                    "Easy for community use",
                    "Scalable deployment",
                  ].map((c) => {
                    const isChecked = formConstraints.includes(c);
                    return (
                      <label
                        key={c}
                        className="flex items-center gap-2.5 text-xs text-[#374151] p-2 rounded-lg hover:bg-[#F7F8FA] cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormConstraints([...formConstraints, c]);
                            } else {
                              setFormConstraints(formConstraints.filter((x) => x !== c));
                            }
                          }}
                          className="rounded border-[#D1D5DB] text-purple-600 focus:ring-purple-500 h-4 w-4"
                        />
                        <span className="font-medium">{c}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* SECTION C: Expected Outcome */}
              <div className="bg-white rounded-2xl border border-[#E2E5EA] p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#E2E5EA]">
                  <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wide">
                    {t("dashboard.innovation.sections.outcomes")}
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                    {t("dashboard.innovation.preview.approvedByAdmin")}
                  </span>
                </div>

                <div className="space-y-2">
                  {[
                    "Safe drinking water",
                    "Measurable water-quality improvement",
                    "Affordable community-level adoption",
                  ].map((outcome) => {
                    const isChecked = formOutcomes.includes(outcome);
                    return (
                      <label
                        key={outcome}
                        className="flex items-center gap-2.5 text-xs text-[#374151] p-2 rounded-lg hover:bg-[#F7F8FA] cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormOutcomes([...formOutcomes, outcome]);
                            } else {
                              setFormOutcomes(formOutcomes.filter((x) => x !== outcome));
                            }
                          }}
                          className="rounded border-[#D1D5DB] text-purple-600 focus:ring-purple-500 h-4 w-4"
                        />
                        <span className="font-medium">{outcome}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* SECTION D: Required Capabilities */}
              <div className="bg-white rounded-2xl border border-[#E2E5EA] p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#E2E5EA]">
                  <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wide">
                    {t("dashboard.innovation.sections.capabilities")}
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                    {t("dashboard.innovation.preview.approvedByAdmin")}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {[
                    "IoT",
                    "Water quality sensors",
                    "Iron removal",
                    "Environmental engineering",
                    "Water treatment",
                    "Low-power systems",
                    "Data analytics",
                  ].map((cap) => {
                    const isSelected = formCapabilities.includes(cap);
                    return (
                      <button
                        type="button"
                        key={cap}
                        onClick={() => {
                          if (isSelected) {
                            setFormCapabilities(formCapabilities.filter((x) => x !== cap));
                          } else {
                            setFormCapabilities([...formCapabilities, cap]);
                          }
                        }}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          isSelected
                            ? "bg-purple-100 text-purple-800 border-purple-300 shadow-xs"
                            : "bg-[#F7F8FA] text-[#4B5563] border-[#E2E5EA] hover:bg-white"
                        }`}
                      >
                        <Tag className="h-3 w-3" />
                        {cap}
                        {isSelected && <span className="text-purple-600 ml-0.5">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION E: Government / Project Context */}
              <div className="bg-white rounded-2xl border border-[#E2E5EA] p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#E2E5EA]">
                  <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wide">
                    {t("dashboard.innovation.sections.context")}
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                    {t("dashboard.innovation.preview.approvedByAdmin")}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-[#4B5563] mb-1">
                      {t("dashboard.innovation.fields.currentSituation")}
                    </label>
                    <textarea
                      rows={2}
                      value={formCurrentSituation}
                      onChange={(e) => setFormCurrentSituation(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-[#E2E5EA] bg-[#F7F8FA] text-xs text-[#111827] focus:bg-white focus:ring-2 focus:ring-purple-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#4B5563] mb-1">
                      {t("dashboard.innovation.fields.whyInsufficient")}
                    </label>
                    <textarea
                      rows={2}
                      value={formWhyInsufficient}
                      onChange={(e) => setFormWhyInsufficient(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-[#E2E5EA] bg-[#F7F8FA] text-xs text-[#111827] focus:bg-white focus:ring-2 focus:ring-purple-600 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#4B5563] mb-1">
                        {t("dashboard.innovation.fields.expectedImpact")}
                      </label>
                      <textarea
                        rows={2}
                        value={formExpectedImpact}
                        onChange={(e) => setFormExpectedImpact(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-[#E2E5EA] bg-[#F7F8FA] text-xs text-[#111827] focus:bg-white focus:ring-2 focus:ring-purple-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#4B5563] mb-1">
                        {t("dashboard.innovation.fields.pilotScope")}
                      </label>
                      <textarea
                        rows={2}
                        value={formPilotScope}
                        onChange={(e) => setFormPilotScope(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-[#E2E5EA] bg-[#F7F8FA] text-xs text-[#111827] focus:bg-white focus:ring-2 focus:ring-purple-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION F: Source Information */}
              <div className="bg-white rounded-2xl border border-[#E2E5EA] p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#E2E5EA]">
                  <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wide">
                    {t("dashboard.innovation.sections.source")}
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                    {t("dashboard.innovation.preview.aiSuggested")}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#F7F8FA] border border-[#E2E5EA]">
                    <span className="text-[10px] font-bold text-[#6B7280] uppercase">
                      {t("dashboard.innovation.fields.sourceCandidateId")}
                    </span>
                    <div className="font-mono text-xs font-bold text-purple-700 mt-0.5">
                      {selectedCandidate?.id || "CAND-JH-2026-001"}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F7F8FA] border border-[#E2E5EA]">
                    <span className="text-[10px] font-bold text-[#6B7280] uppercase">
                      {t("dashboard.innovation.fields.similarReportCount")}
                    </span>
                    <div className="text-xs font-bold text-[#111827] mt-0.5">
                      {selectedCandidate?.similarReports || 24} Corroborated Reports
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F7F8FA] border border-[#E2E5EA]">
                    <span className="text-[10px] font-bold text-[#6B7280] uppercase">
                      {t("dashboard.innovation.fields.aiInnovationScore")}
                    </span>
                    <div className="text-xs font-bold text-purple-700 mt-0.5">
                      {selectedCandidate?.innovationScore || 94}/100 (Confidence: 91%)
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F7F8FA] border border-[#E2E5EA]">
                    <span className="text-[10px] font-bold text-[#6B7280] uppercase">
                      {t("dashboard.innovation.fields.aiRecommendation")}
                    </span>
                    <div className="text-xs font-bold text-emerald-700 mt-0.5">
                      Innovation / Research Required
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-200 text-xs text-[#374151]">
                  <span className="font-bold text-purple-900 block mb-1">
                    {t("dashboard.innovation.fields.linkedReports")}:
                  </span>
                  <span className="font-mono text-xs text-purple-800 font-semibold">
                    {(selectedCandidate?.linkedReports || ["JH-2026-C201", "JH-2026-C204", "JH-2026-C209"]).join(", ")}
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: SECTION 4 STRUCTURED CHALLENGE PREVIEW (5 Cols) */}
            <div className="lg:col-span-5 sticky top-24 space-y-4">
              <div className="bg-white rounded-2xl border-2 border-purple-600/30 p-5 sm:p-6 shadow-md space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E2E5EA]">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-purple-700" />
                    <span className="font-bold text-xs uppercase tracking-wider text-purple-900">
                      {t("dashboard.innovation.preview.header")}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Preview
                  </span>
                </div>

                {/* Challenge ID */}
                <div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#6B7280] font-semibold">
                      {t("dashboard.innovation.preview.challengeId")}
                    </span>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                      {t("dashboard.innovation.preview.aiSuggested")}
                    </span>
                  </div>
                  <div className="font-mono text-xs font-bold text-purple-800 mt-0.5">
                    CH-2026-001 ({t("dashboard.innovation.preview.autoGenerated")})
                  </div>
                </div>

                {/* Title */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#6B7280] font-semibold">{t("dashboard.innovation.fields.challengeTitle")}</span>
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
                      {t("dashboard.innovation.preview.approvedByAdmin")}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-[#111827] leading-snug">
                    {formTitle}
                  </div>
                </div>

                {/* Target Users */}
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#6B7280] font-semibold">{t("dashboard.innovation.fields.targetUsers")}</span>
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
                      {t("dashboard.innovation.preview.approvedByAdmin")}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-[#111827]">
                    {formTargetUsers}
                  </div>
                </div>

                {/* Constraints */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#6B7280] font-semibold">{t("dashboard.innovation.sections.constraints")}</span>
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
                      {t("dashboard.innovation.preview.approvedByAdmin")}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {formConstraints.map((c) => (
                      <span
                        key={c}
                        className="text-[11px] font-medium px-2 py-0.5 rounded bg-[#F3F4F6] text-[#374151] border border-[#E2E5EA]"
                      >
                        • {c}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Expected Outcome */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#6B7280] font-semibold">{t("dashboard.innovation.sections.outcomes")}</span>
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
                      {t("dashboard.innovation.preview.approvedByAdmin")}
                    </span>
                  </div>
                  <div className="space-y-0.5 text-xs text-emerald-900 bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-200">
                    {formOutcomes.map((o) => (
                      <div key={o} className="flex items-center gap-1.5 font-medium">
                        <CheckCircle className="h-3 w-3 text-emerald-600 shrink-0" />
                        <span>{o}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Required Capabilities */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#6B7280] font-semibold">{t("dashboard.innovation.sections.capabilities")}</span>
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
                      {t("dashboard.innovation.preview.approvedByAdmin")}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {formCapabilities.map((cap) => (
                      <span
                        key={cap}
                        className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800"
                      >
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Source & AI Confidence */}
                <div className="pt-3 border-t border-[#E2E5EA] space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#6B7280]">Source:</span>
                    <span className="font-semibold text-purple-700">
                      Innovation Candidate ({selectedCandidate?.id || "CAND-JH-2026-001"})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#6B7280]">AI Recommendation:</span>
                    <span className="font-semibold text-emerald-700 flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-purple-600" />
                      Innovation / Research Required
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#6B7280]">AI Confidence:</span>
                    <span className="font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded">
                      91%
                    </span>
                  </div>
                </div>

                {/* Bottom Action inside preview */}
                <div className="pt-2 border-t border-[#E2E5EA] space-y-2">
                  <button
                    type="button"
                    onClick={handleCreateChallengeSubmit}
                    className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <Award className="h-4 w-4" />
                    {t("dashboard.innovation.preview.submitCreate")}
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveChallengeDraft}
                    className="w-full py-2 rounded-xl border border-[#E2E5EA] bg-white hover:bg-[#F3F4F6] text-xs font-semibold text-[#4B5563] transition-colors"
                  >
                    {t("dashboard.innovation.preview.saveDraft")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === "challenges" ? (
        /* ─────────────────────────────────────────────────────────────
           SECTION 9: CHALLENGE LIST TABLE
        ───────────────────────────────────────────────────────────── */
        <div className="rounded-2xl border border-[#E2E5EA] bg-white p-4 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E5EA]">
            <div>
              <h2 className="text-base font-bold text-[#111827]">
                {t("dashboard.innovation.tabs.challenges")} ({filteredChallenges.length})
              </h2>
              <p className="text-xs text-[#6B7280]">
                Official state innovation challenges approved for university R&D collaboration.
              </p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder={t("dashboard.common.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[#E2E5EA] bg-[#F7F8FA] text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#111827]">
              <thead>
                <tr className="border-b border-[#E2E5EA] text-[#6B7280] uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-semibold">{t("dashboard.innovation.table.challengeId")}</th>
                  <th className="pb-3 font-semibold">{t("dashboard.innovation.table.title")}</th>
                  <th className="pb-3 font-semibold">{t("dashboard.innovation.table.domain")}</th>
                  <th className="pb-3 font-semibold">{t("dashboard.innovation.table.targetUsers")}</th>
                  <th className="pb-3 font-semibold">{t("dashboard.innovation.table.status")}</th>
                  <th className="pb-3 font-semibold">{t("dashboard.innovation.table.createdDate")}</th>
                  <th className="pb-3 font-semibold">{t("dashboard.innovation.table.universityMatching")}</th>
                  <th className="pb-3 font-semibold text-right">{t("dashboard.innovation.table.action")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F4F6]">
                {filteredChallenges.map((ch) => (
                  <tr key={ch.id} className="hover:bg-[#F7F8FA]/80 transition-colors">
                    <td className="py-3.5 font-mono font-bold text-purple-700">{ch.id}</td>
                    <td className="py-3.5 font-semibold text-[#111827] max-w-xs">{ch.title}</td>
                    <td className="py-3.5 text-[#4B5563]">{ch.domain}</td>
                    <td className="py-3.5 text-[#6B7280]">{ch.targetUsers}</td>
                    <td className="py-3.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">
                        <CheckCircle2 className="h-3 w-3" />
                        {t("statusMap.OPEN_FOR_MATCHING")}
                      </span>
                    </td>
                    <td className="py-3.5 text-[#6B7280]">{ch.createdDate}</td>
                    <td className="py-3.5 font-medium text-purple-800">{ch.matchingPool}</td>
                    <td className="py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => handleStartUniversityMatching(ch)}
                        className="px-3 py-1.5 rounded-md bg-purple-700 hover:bg-purple-800 text-white font-semibold text-[11px] transition-colors"
                      >
                        {t("dashboard.innovation.table.view")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === "university-matching" ? (
        /* ─────────────────────────────────────────────────────────────
           SECTION 6: UNIVERSITY CAPABILITY MATCHING WORKFLOW
           Challenge → Required Capabilities → AI University Matching → Recommended Universities
        ───────────────────────────────────────────────────────────── */
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-2xl border border-[#E2E5EA] p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E5EA]">
              <div>
                <div className="flex items-center gap-2">
                  <GitMerge className="h-5 w-5 text-purple-700" />
                  <h2 className="text-base sm:text-lg font-bold text-[#111827]">
                    {t("dashboard.innovation.matching.workflowTitle")}
                  </h2>
                </div>
                <p className="text-xs text-[#6B7280] mt-0.5">
                  {t("dashboard.innovation.matching.subtitle")}
                </p>
              </div>

              <div className="font-mono text-xs font-bold text-purple-800 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-200">
                {activeMatchingChallenge?.id || "CH-2026-001"}
              </div>
            </div>

            {/* 4-Step Transition Breadcrumb Banner */}
            <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-900 block mb-2">
                {t("dashboard.innovation.matching.flowTitle")}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-white border border-purple-200 shadow-xs">
                  <span className="text-[10px] font-bold text-[#6B7280] block">Step 1</span>
                  <div className="font-bold text-[#111827] mt-0.5">Challenge Created</div>
                  <div className="font-mono text-[10px] text-purple-700">{activeMatchingChallenge?.id || "CH-2026-001"}</div>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-purple-200 shadow-xs">
                  <span className="text-[10px] font-bold text-[#6B7280] block">Step 2</span>
                  <div className="font-bold text-[#111827] mt-0.5">Required Capabilities</div>
                  <div className="text-[10px] text-purple-700">6 Key Tech Tags</div>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-purple-200 shadow-xs">
                  <span className="text-[10px] font-bold text-[#6B7280] block">Step 3</span>
                  <div className="font-bold text-[#111827] mt-0.5">AI University Matching</div>
                  <div className="text-[10px] text-emerald-700 font-semibold">BGE-M3 + Lab Index</div>
                </div>
                <div className="p-2.5 rounded-lg bg-purple-700 text-white shadow-xs">
                  <span className="text-[10px] font-bold text-purple-200 block">Step 4</span>
                  <div className="font-bold text-white mt-0.5">Recommended Universities</div>
                  <div className="text-[10px] text-purple-200">3 Verified Matches</div>
                </div>
              </div>
            </div>

            {/* Challenge Summary Banner */}
            <div className="p-4 rounded-xl bg-[#F7F8FA] border border-[#E2E5EA] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#111827] text-sm">
                  {activeMatchingChallenge?.title || "Affordable, Off-Grid Water Quality Monitoring and Iron Removal System"}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-800">
                  Approved / Open for Matching
                </span>
              </div>
              <p className="text-[#4B5563] text-xs leading-relaxed">
                {activeMatchingChallenge?.problemStatement ||
                  "Severe iron, arsenic, and heavy metal contamination in deep groundwater affecting 18 villages in Chaibasa block."}
              </p>
              <div className="flex flex-wrap gap-1 pt-1">
                {(activeMatchingChallenge?.requiredCapabilities || [
                  "IoT",
                  "Water quality sensors",
                  "Iron removal",
                  "Environmental engineering",
                  "Low-power systems",
                  "Data analytics",
                ]).map((cap) => (
                  <span
                    key={cap}
                    className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px] font-bold"
                  >
                    {cap}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Recommended Universities Cards */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#111827]">
              {t("dashboard.innovation.matching.recommendedUniversities")}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {universities.map((uni, idx) => (
                <div
                  key={uni.id}
                  className="bg-white rounded-2xl border border-[#E2E5EA] p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-purple-300 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
                        <GraduationCap className="h-6 w-6" />
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-[#6B7280] uppercase block">
                          Rank #{idx + 1}
                        </span>
                        <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {uni.matchScore}% Match
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-[#111827]">{uni.name}</h4>
                      <p className="text-xs text-[#6B7280] mt-0.5">{uni.department}</p>
                    </div>

                    {/* Faculty Mentor */}
                    <div className="p-2.5 rounded-lg bg-[#F7F8FA] border border-[#E2E5EA] text-xs">
                      <span className="text-[10px] font-bold text-[#6B7280] uppercase block">
                        {t("dashboard.innovation.matching.facultyMentor")}
                      </span>
                      <span className="font-semibold text-[#111827] mt-0.5 block">
                        {uni.facultyMentor}
                      </span>
                    </div>

                    {/* Infrastructure */}
                    <div className="space-y-1 text-xs">
                      <span className="text-[10px] font-bold text-[#6B7280] uppercase block">
                        {t("dashboard.innovation.matching.labCapabilities")}
                      </span>
                      <ul className="space-y-1 text-[11px] text-[#4B5563]">
                        {uni.infrastructure.map((inf) => (
                          <li key={inf} className="flex items-start gap-1">
                            <span className="text-purple-600 font-bold">•</span>
                            <span>{inf}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Matched Capabilities */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {uni.matchedCapabilities.map((cap) => (
                        <span
                          key={cap}
                          className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 text-[10px] font-medium border border-purple-100"
                        >
                          ✓ {cap}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E2E5EA]">
                    {uni.rfpSent ? (
                      <div className="w-full py-2 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 text-center flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        {t("dashboard.innovation.matching.rfpSent")}
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleDispatchRfp(uni.id)}
                        className="w-full py-2.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Send className="h-3.5 w-3.5" />
                        {t("dashboard.innovation.matching.dispatchRfp")}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : activeTab === "audit-timeline" ? (
        /* ─────────────────────────────────────────────────────────────
           SECTION 7: AUDIT TIMELINE
        ───────────────────────────────────────────────────────────── */
        <div className="bg-white rounded-2xl border border-[#E2E5EA] p-5 sm:p-6 shadow-xs space-y-4">
          <div className="pb-3 border-b border-[#E2E5EA]">
            <h2 className="text-base font-bold text-[#111827]">
              {t("dashboard.innovation.audit.title")}
            </h2>
            <p className="text-xs text-[#6B7280] mt-0.5">
              {t("dashboard.innovation.audit.subtitle")}
            </p>
          </div>

          <div className="space-y-3">
            {auditLog.map((aud) => (
              <div
                key={aud.id}
                className="p-3.5 sm:p-4 rounded-xl border border-[#E2E5EA] bg-[#F7F8FA] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#6B7280] bg-white px-2 py-0.5 rounded border border-[#E2E5EA]">
                      {aud.timestamp}
                    </span>
                    <span className="font-bold text-[#111827]">{aud.action}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        aud.type === "AI_EVENT"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {aud.type === "AI_EVENT" ? "AI Pipeline" : "Human Officer"}
                    </span>
                  </div>
                  <p className="text-[#4B5563] text-xs leading-relaxed">{aud.details}</p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-[#E2E5EA]">
                  <span className="font-mono text-[11px] font-bold text-purple-700">
                    {aud.entityId}
                  </span>
                  <span className="text-[11px] text-[#6B7280]">{aud.actor}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* ─────────────────────────────────────────────────────────────
           DEFAULT OVERVIEW / CANDIDATES TRIAGE VIEW (Section 1)
        ───────────────────────────────────────────────────────────── */
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-xl border border-[#E2E5EA]">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder={t("dashboard.common.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-[#E2E5EA] bg-[#F7F8FA] text-xs sm:text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white"
              />
            </div>
            <div className="text-xs text-[#6B7280]">
              Showing {filteredCandidates.length} candidate(s)
            </div>
          </div>

          {/* Split List & Inspector */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Candidate Cards List */}
            <div className={`${selectedCandidate ? "lg:col-span-7" : "lg:col-span-12"} space-y-3 transition-all`}>
              <div className="flex items-center justify-between pb-1">
                <h2 className="text-sm font-bold text-[#111827] uppercase tracking-wide">
                  {t("dashboard.innovation.tabs.candidates")} ({filteredCandidates.length})
                </h2>
                <span className="text-xs text-[#6B7280]">{t("paths.pathC")}</span>
              </div>

              {filteredCandidates.length === 0 ? (
                <div className="p-8 text-center rounded-2xl border border-dashed border-[#E2E5EA] bg-white">
                  <Sparkles className="h-8 w-8 mx-auto text-[#9CA3AF] mb-2" />
                  <p className="text-sm font-semibold text-[#111827]">
                    {t("dashboard.innovation.noCandidatesTitle")}
                  </p>
                  <p className="text-xs text-[#6B7280] mt-1">
                    {t("dashboard.innovation.noCandidatesDesc")}
                  </p>
                </div>
              ) : (
                filteredCandidates.map((cand) => {
                  const isSelected = selectedCandidate?.id === cand.id;
                  return (
                    <div
                      key={cand.id}
                      onClick={() => setSelectedCandidate(cand)}
                      className={`cursor-pointer p-4 sm:p-5 rounded-xl border transition-all bg-white text-left ${
                        isSelected
                          ? "border-purple-600 ring-2 ring-purple-600/20 shadow-sm"
                          : "border-[#E2E5EA] hover:border-purple-200 hover:shadow-xs"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-purple-700">
                            {cand.id}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                            Score: {cand.innovationScore}/100
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              cand.status === "APPROVED_CHALLENGE"
                                ? "bg-green-100 text-green-800"
                                : cand.status === "SENT_TO_DEPT"
                                ? "bg-blue-100 text-blue-800"
                                : cand.status === "REJECTED"
                                ? "bg-red-100 text-red-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {t(`statusMap.${cand.status}` as any) || cand.status.replace(/_/g, " ")}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#6B7280]">
                          {cand.similarReports} {t("dashboard.department.reports")}
                        </div>
                      </div>

                      <h3 className="text-xs sm:text-sm font-bold text-[#111827] mt-2">
                        {cand.domain}
                      </h3>
                      <p className="text-xs text-[#4B5563] mt-1 line-clamp-2 leading-relaxed">
                        {cand.problemStatement}
                      </p>

                      <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-[#F3F4F6] text-xs text-[#6B7280]">
                        <span className="flex items-center gap-1 truncate">
                          <MapPin className="h-3.5 w-3.5 text-[#9CA3AF] shrink-0" />
                          {cand.location}
                        </span>
                        <span className="flex items-center gap-1 text-purple-700 font-medium shrink-0">
                          {t("dashboard.innovation.viewCandidateDetails")} <ArrowUpRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* ─── SECTION 1: INNOVATION CANDIDATE DETAIL INSPECTOR ─── */}
            {selectedCandidate && (
              <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E2E5EA] p-5 shadow-md space-y-5 sticky top-24">
                <div className="flex items-start justify-between pb-3 border-b border-[#E2E5EA]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-purple-700">
                        {selectedCandidate.id}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-purple-50 text-purple-800 font-bold">
                        Score: {selectedCandidate.innovationScore}/100
                      </span>
                    </div>
                    <div className="text-xs text-[#6B7280] mt-0.5">
                      {t("dashboard.innovation.domain")}: {selectedCandidate.domain}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedCandidate(null)}
                    className="p-1 rounded-md text-[#9CA3AF] hover:text-[#111827] hover:bg-[#F3F4F6]"
                    aria-label="Close details"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Problem Statement */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                    {t("dashboard.innovation.candidate.problemStatement")}
                  </label>
                  <p className="text-xs sm:text-sm text-[#111827] leading-relaxed bg-[#F7F8FA] p-3 rounded-xl border border-[#E2E5EA]">
                    {selectedCandidate.problemStatement}
                  </p>
                </div>

                {/* Affected Region & GIS Map */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#6B7280] flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-purple-600" />
                      {t("dashboard.innovation.candidate.affectedRegion")}: {selectedCandidate.location}
                    </span>
                    {selectedCandidate.coordinates && (
                      <span className="font-mono text-[11px] text-purple-700 font-semibold bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                        📍 {selectedCandidate.coordinates[0]}° N, {selectedCandidate.coordinates[1]}° E
                      </span>
                    )}
                  </div>
                  {selectedCandidate.coordinates && (
                    <LocationDisplayMap
                      position={selectedCandidate.coordinates}
                      label={`${selectedCandidate.id}: ${selectedCandidate.location}`}
                      className="h-36 w-full rounded-xl border border-[#E2E5EA] shadow-xs"
                    />
                  )}
                </div>

                {/* Similar Reports & Existing Solution Match */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-[#F7F8FA] border border-[#E2E5EA]">
                    <span className="text-[10px] font-bold text-[#6B7280] uppercase block">
                      {t("dashboard.innovation.candidate.similarReports")}
                    </span>
                    <span className="font-bold text-[#111827] mt-0.5 block">
                      {selectedCandidate.similarReports} Corroborated Reports
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-purple-50/50 border border-purple-200">
                    <span className="text-[10px] font-bold text-purple-800 uppercase block">
                      {t("dashboard.innovation.candidate.innovationScore")}
                    </span>
                    <span className="font-bold text-purple-950 mt-0.5 block">
                      {selectedCandidate.innovationScore}/100 (High Viability)
                    </span>
                  </div>
                </div>

                {/* Existing Solution Match */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                    {t("dashboard.innovation.candidate.existingSolutionMatch")}
                  </label>
                  <p className="text-xs text-[#4B5563] leading-relaxed bg-amber-50/50 p-2.5 rounded-lg border border-amber-200">
                    {selectedCandidate.existingSolutionMatch}
                  </p>
                </div>

                {/* AI Reasoning */}
                <div className="rounded-xl border border-purple-200 bg-purple-50/60 p-3.5 space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-purple-900">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    <span>{t("dashboard.innovation.candidate.aiReasoning")}</span>
                    <span className="ml-auto text-[10px] font-bold text-purple-700 bg-purple-100 px-1.5 py-0.2 rounded">
                      {t("dashboard.innovation.preview.aiSuggested")}
                    </span>
                  </div>
                  <p className="text-purple-950 text-[11px] leading-relaxed">
                    {selectedCandidate.aiExplanation}
                  </p>
                </div>

                {/* Suggested Capabilities */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                    {t("dashboard.innovation.candidate.suggestedCapabilities")}
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCandidate.requiredCapabilities.map((cap) => (
                      <span
                        key={cap}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#F3F4F6] text-[#374151] text-[11px] font-medium border border-[#E2E5EA]"
                      >
                        <Tag className="h-3 w-3 text-[#9CA3AF]" />
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Linked Citizen Reports */}
                <div className="flex items-center justify-between text-xs text-[#6B7280] pt-2 border-t border-[#E2E5EA]">
                  <span>{t("dashboard.innovation.candidate.linkedCitizenReports")}:</span>
                  <span className="font-mono text-xs font-semibold text-[#111827]">
                    {selectedCandidate.linkedReports.join(", ")}
                  </span>
                </div>

                {/* PROMINENT ACTION: [ Create Innovation Challenge ] + SECONDARY ACTIONS */}
                <div className="space-y-2.5 pt-2 border-t border-[#E2E5EA]">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                    {t("dashboard.common.actions")}
                  </label>

                  {/* Primary Prominent Action */}
                  <button
                    type="button"
                    onClick={() => handleOpenCreateChallenge(selectedCandidate)}
                    className="w-full py-3 px-4 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Award className="h-4 w-4" />
                    {t("dashboard.innovation.createChallengeBtn")}
                  </button>

                  {/* Secondary Actions */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleSendToDepartment(selectedCandidate)}
                      className="px-2 py-2 rounded-lg border border-[#E2E5EA] bg-white hover:bg-[#F3F4F6] text-[#111827] text-[11px] font-semibold transition-colors flex items-center justify-center gap-1"
                    >
                      <Send className="h-3 w-3 text-[#0F62B4]" />
                      {t("dashboard.innovation.actions.sendToDept")}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRequestInfo(selectedCandidate)}
                      className="px-2 py-2 rounded-lg border border-[#E2E5EA] bg-white hover:bg-[#F3F4F6] text-[#111827] text-[11px] font-semibold transition-colors flex items-center justify-center gap-1"
                    >
                      <HelpCircle className="h-3 w-3 text-amber-600" />
                      {t("dashboard.innovation.actions.requestMoreInfo")}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleReject(selectedCandidate)}
                      className="px-2 py-2 rounded-lg border border-red-200 bg-white hover:bg-red-50 text-red-700 text-[11px] font-semibold transition-colors flex items-center justify-center gap-1"
                    >
                      <XCircle className="h-3 w-3 text-red-600" />
                      {t("dashboard.innovation.actions.reject")}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
