"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  DashboardShell,
  DashboardNavItem,
} from "@/components/dashboard/dashboard-shell";
import {
  LayoutDashboard,
  FileText,
  Building2,
  Sparkles,
  GraduationCap,
  Briefcase,
  FolderGit2,
  Rocket,
  BarChart3,
  History,
  Users,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  AlertTriangle,
  TrendingUp,
  MapPin,
  Layers,
  Globe2,
  ExternalLink,
  X,
  ChevronRight,
  Info,
  ShieldAlert,
  Droplets,
  Zap,
  Hammer,
  Radio,
  HeartPulse,
  Award,
  DollarSign,
  ArrowRight,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/lib/i18n/language-context";
import DistrictHeatmap from "@/components/dashboard/district-heatmap";
import type { DistrictMetric } from "@/components/dashboard/district-heatmap-inner";

// ─────────────────────────────────────────────────────────────
// TYPES & DATA CONTRACTS
// ─────────────────────────────────────────────────────────────

interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  role: string;
  organization: string;
  status: "ACTIVE" | "PENDING_VERIFICATION";
  lastActive: string;
}

interface HotspotItem {
  id: string;
  district: string;
  category: string;
  reportsCount: number;
  highPriorityCount: number;
  trend: string;
  clusterId?: string;
  isSpecial?: boolean;
}

interface ClusterItem {
  id: string;
  title: string;
  category: string;
  reportsCount: number;
  villagesCount: number;
  location: string;
  district: string;
  trend: string;
  route: string;
  status: string;
  challengeId?: string;
  challengeTitle?: string;
  explanation: string;
}

interface UniversityRankingItem {
  id: string;
  name: string;
  assignedChallenges: number;
  activeTeams: number;
  proposals: number;
  projects: number;
  leadDomain: string;
}

interface ActivityEvent {
  time: string;
  title: string;
  actor: string;
  role: string;
  type: "verify" | "challenge" | "university" | "industry" | "cluster" | "pilot";
}

interface AuditLogEntry {
  id: string;
  time: string;
  entity: string;
  actorRole: string;
  action: string;
  status: "SUCCESS" | "FLAGGED";
}

// ─────────────────────────────────────────────────────────────
// SEEDED DETERMINISTIC DATA (Demo & Presentation)
// ─────────────────────────────────────────────────────────────

const DISTRICTS_DATA: DistrictMetric[] = [
  {
    name: "Ranchi",
    coords: [23.3441, 85.3096],
    totalReports: 284,
    pending: 41,
    resolved: 213,
    highPriority: 16,
    innovationCandidates: 8,
  },
  {
    name: "Jamshedpur",
    coords: [22.8046, 86.2029],
    totalReports: 248,
    pending: 35,
    resolved: 189,
    highPriority: 14,
    innovationCandidates: 6,
  },
  {
    name: "Chaibasa",
    coords: [22.5532, 85.8078],
    totalReports: 217,
    pending: 48,
    resolved: 142,
    highPriority: 31,
    innovationCandidates: 8,
    hasSpecialCluster: true,
    specialClusterId: "WQ-07",
  },
  {
    name: "Dhanbad",
    coords: [23.7957, 86.4304],
    totalReports: 193,
    pending: 26,
    resolved: 151,
    highPriority: 11,
    innovationCandidates: 4,
  },
  {
    name: "Bokaro",
    coords: [23.6693, 86.1511],
    totalReports: 141,
    pending: 18,
    resolved: 114,
    highPriority: 9,
    innovationCandidates: 3,
  },
  {
    name: "Hazaribagh",
    coords: [23.9925, 85.3637],
    totalReports: 106,
    pending: 16,
    resolved: 82,
    highPriority: 7,
    innovationCandidates: 2,
  },
];

const CATEGORIES_DATA = [
  { name: "Road Infrastructure", count: 248, percentage: 19.9, color: "bg-amber-500", trend: "+4.8%" },
  { name: "Water & Sanitation", count: 217, percentage: 17.4, color: "bg-blue-500", trend: "+12.4%" },
  { name: "Electricity", count: 193, percentage: 15.5, color: "bg-yellow-500", trend: "+2.1%" },
  { name: "Healthcare", count: 141, percentage: 11.3, color: "bg-rose-500", trend: "+6.3%" },
  { name: "Agriculture", count: 106, percentage: 8.5, color: "bg-emerald-500", trend: "+1.9%" },
  { name: "Connectivity", count: 88, percentage: 7.1, color: "bg-indigo-500", trend: "+9.5%" },
  { name: "Education", count: 73, percentage: 5.8, color: "bg-purple-500", trend: "-0.5%" },
  { name: "Other", count: 182, percentage: 14.5, color: "bg-slate-400", trend: "+3.2%" },
];

const CASE_STATUSES = [
  { status: "Submitted", count: 112, percent: 9.0, color: "bg-slate-400" },
  { status: "Verified", count: 72, percent: 5.8, color: "bg-sky-500" },
  { status: "Assigned", count: 148, percent: 11.9, color: "bg-indigo-500" },
  { status: "In Progress", count: 184, percent: 14.7, color: "bg-amber-500" },
  { status: "Resolved", count: 927, percent: 74.3, color: "bg-emerald-600" },
  { status: "Rejected", count: 35, percent: 2.8, color: "bg-rose-400" },
];

const HOTSPOTS_DATA: HotspotItem[] = [
  {
    id: "hs-1",
    district: "Chaibasa",
    category: "Water & Sanitation",
    reportsCount: 31,
    highPriorityCount: 31,
    trend: "+15.2%",
    clusterId: "WQ-07",
    isSpecial: true,
  },
  {
    id: "hs-2",
    district: "Ranchi",
    category: "Water Quality",
    reportsCount: 42,
    highPriorityCount: 18,
    trend: "+8.1%",
  },
  {
    id: "hs-3",
    district: "Jamshedpur",
    category: "Road Infrastructure",
    reportsCount: 38,
    highPriorityCount: 14,
    trend: "+5.4%",
    clusterId: "RD-12",
  },
  {
    id: "hs-4",
    district: "Dhanbad",
    category: "Electricity",
    reportsCount: 29,
    highPriorityCount: 11,
    trend: "+11.7%",
    clusterId: "EL-04",
  },
];

const RECURRING_CLUSTERS: ClusterItem[] = [
  {
    id: "WQ-07",
    title: "Water contamination & high iron turbidity",
    category: "Water & Sanitation",
    reportsCount: 31,
    villagesCount: 6,
    location: "Chaibasa / West Singhbhum",
    district: "Chaibasa",
    trend: "+15% (Surging)",
    route: "Innovation Candidate",
    status: "Innovation Cell Review",
    challengeId: "CH-2026-001",
    challengeTitle: "Affordable, Off-Grid Water Quality Monitoring and Iron Removal System",
    explanation:
      "Instead of treating these 31 complaints as 31 unrelated records, the platform identifies a recurring community problem that warrants university R&D matching.",
  },
  {
    id: "RD-12",
    title: "Repeated road damage on heavy transit corridor",
    category: "Road Infrastructure",
    reportsCount: 22,
    villagesCount: 3,
    location: "Adityapur Industrial Belt, Jamshedpur",
    district: "Jamshedpur",
    trend: "+6%",
    route: "Department Escalation (PWD)",
    status: "Contractor SLA Audit",
    explanation:
      "Recurrent asphalt rutting reported across 3 industrial localities within 45 days. Correlated with heavy vehicle load bypass.",
  },
  {
    id: "EL-04",
    title: "Low-voltage complaints & transformer overload",
    category: "Electricity",
    reportsCount: 17,
    villagesCount: 2,
    location: "Katras Basti, Dhanbad",
    district: "Dhanbad",
    trend: "+12%",
    route: "JBVNL Grid Balancing",
    status: "Field Feeder Assessment",
    explanation:
      "Evening peak voltage drops to 140V across 17 connected households. AI clustered into feeder step-down requirement.",
  },
  {
    id: "CN-09",
    title: "Poor cellular connectivity & signal blackspots",
    category: "Connectivity",
    reportsCount: 14,
    villagesCount: 4,
    location: "Barkagaon Valley, Hazaribagh",
    district: "Hazaribagh",
    trend: "+4%",
    route: "Innovation Candidate (Mesh)",
    status: "Scoping Low-Power LoRa Relay",
    explanation:
      "Undulating terrain isolates 4 villages from digital civic services. Recommended for community mesh network pilot.",
  },
];

const UNIVERSITIES_DATA: UniversityRankingItem[] = [
  {
    id: "u-1",
    name: "BIT Mesra",
    assignedChallenges: 5,
    activeTeams: 4,
    proposals: 3,
    projects: 3,
    leadDomain: "Water Purification & IoT Sensors",
  },
  {
    id: "u-2",
    name: "IIIT Ranchi",
    assignedChallenges: 4,
    activeTeams: 3,
    proposals: 2,
    projects: 2,
    leadDomain: "Low-Power Edge AI & LoRa Mesh",
  },
  {
    id: "u-3",
    name: "IIT (ISM) Dhanbad",
    assignedChallenges: 3,
    activeTeams: 2,
    proposals: 2,
    projects: 2,
    leadDomain: "Mining Effluent & Subsurface Geo-Mapping",
  },
  {
    id: "u-4",
    name: "NIT Jamshedpur",
    assignedChallenges: 3,
    activeTeams: 2,
    proposals: 1,
    projects: 1,
    leadDomain: "Sustainable Road Materials & Slag Use",
  },
  {
    id: "u-5",
    name: "Kolhan University",
    assignedChallenges: 2,
    activeTeams: 1,
    proposals: 1,
    projects: 1,
    leadDomain: "Tribal Herbology & Rural Cold-Chain",
  },
];

const INITIAL_USERS: AdminUserRecord[] = [
  {
    id: "usr_01",
    name: "Dr. Ananya Verma",
    email: "ananya.verma@demo.jharsetu.org",
    role: "INNOVATION_CELL",
    organization: "Demo State Innovation Cell",
    status: "ACTIVE",
    lastActive: "10 mins ago",
  },
  {
    id: "usr_02",
    name: "Rajesh Murmu (EE)",
    email: "rajesh.murmu@demo.jharsetu.org",
    role: "DEPARTMENT_OFFICER",
    organization: "Road Construction Department / PWD (Sample)",
    status: "ACTIVE",
    lastActive: "25 mins ago",
  },
  {
    id: "usr_03",
    name: "Prof. S. K. Pathak",
    email: "skpathak@bitmesra.ac.in",
    role: "UNIVERSITY",
    organization: "BIT Mesra",
    status: "ACTIVE",
    lastActive: "1 hour ago",
  },
  {
    id: "usr_04",
    name: "Tata Steel CSR Lead",
    email: "csr@tatasteel.com",
    role: "INDUSTRY_CSR",
    organization: "Tata Steel Foundation",
    status: "ACTIVE",
    lastActive: "3 hours ago",
  },
  {
    id: "usr_05",
    name: "NIT Jamshedpur R&D Rep",
    email: "rnd@nitjsr.ac.in",
    role: "UNIVERSITY",
    organization: "NIT Jamshedpur",
    status: "PENDING_VERIFICATION",
    lastActive: "Yesterday",
  },
];

const LIVE_ACTIVITY: ActivityEvent[] = [
  {
    time: "09:20",
    title: "Report JH-2026-7865 verified",
    actor: "Department Officer (Ranchi)",
    role: "DEPARTMENT",
    type: "verify",
  },
  {
    time: "09:18",
    title: "Innovation Challenge CH-2026-001 created",
    actor: "Dr. Ananya Verma",
    role: "INNOVATION_CELL",
    type: "challenge",
  },
  {
    time: "09:14",
    title: "University expressed interest in CH-2026-001",
    actor: "BIT Mesra Research Cell",
    role: "UNIVERSITY",
    type: "university",
  },
  {
    time: "09:10",
    title: "Industry partnership request submitted",
    actor: "Tata Steel CSR Division",
    role: "INDUSTRY_CSR",
    type: "industry",
  },
  {
    time: "09:04",
    title: "New water-quality cluster detected (WQ-07)",
    actor: "AI Cross-Report Engine",
    role: "PLATFORM_AI",
    type: "cluster",
  },
];

const AUDIT_LOG: AuditLogEntry[] = [
  {
    id: "aud-01",
    time: "09:20:15",
    entity: "JH-2026-7865",
    actorRole: "DEPARTMENT_OFFICER",
    action: "OFFICER_VERIFIED_CASE",
    status: "SUCCESS",
  },
  {
    id: "aud-02",
    time: "09:18:42",
    entity: "CH-2026-001",
    actorRole: "INNOVATION_CELL",
    action: "INNOVATION_CHALLENGE_CREATED",
    status: "SUCCESS",
  },
  {
    id: "aud-03",
    time: "09:14:10",
    entity: "CH-2026-001",
    actorRole: "UNIVERSITY_FACULTY",
    action: "EXPRESS_INTEREST_SUBMITTED",
    status: "SUCCESS",
  },
  {
    id: "aud-04",
    time: "09:10:05",
    entity: "CH-2026-001",
    actorRole: "INDUSTRY_CSR",
    action: "PARTNERSHIP_PLEDGE_FILED",
    status: "SUCCESS",
  },
  {
    id: "aud-05",
    time: "09:04:12",
    entity: "WQ-07",
    actorRole: "AI_ANALYSIS_WORKFLOW",
    action: "RECURRING_CLUSTER_DISCOVERED",
    status: "SUCCESS",
  },
  {
    id: "aud-06",
    time: "08:45:00",
    entity: "PL-2026-002",
    actorRole: "FIELD_EVALUATOR",
    action: "PILOT_STAGE_VALIDATED",
    status: "SUCCESS",
  },
];

// ─────────────────────────────────────────────────────────────
// COMPONENT IMPLEMENTATION
// ─────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const { t } = useLanguage();

  // Navigation State
  const [activeTab, setActiveTab] = useState("overview");

  // Filters State
  const [filterDistrict, setFilterDistrict] = useState("ALL");
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [filterPriority, setFilterPriority] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterRoute, setFilterRoute] = useState("ALL");
  const [filterDateRange, setFilterDateRange] = useState("30d");
  const [searchQuery, setSearchQuery] = useState("");

  // Interactive Modal State (Cluster Inspection)
  const [selectedCluster, setSelectedCluster] = useState<ClusterItem | null>(null);

  // Users Directory State
  const [users, setUsers] = useState<AdminUserRecord[]>(INITIAL_USERS);

  // Sync dynamic challenge count from localStorage if created during demo
  const [liveChallengeCount, setLiveChallengeCount] = useState(67);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("jharsetu_official_challenges_v1");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setLiveChallengeCount(65 + parsed.length);
        }
      }
    } catch {}
  }, []);

  // Filtered recurring clusters
  const filteredClusters = useMemo(() => {
    return RECURRING_CLUSTERS.filter((c) => {
      if (filterDistrict !== "ALL" && c.district !== filterDistrict) return false;
      if (filterCategory !== "ALL" && !c.category.toLowerCase().includes(filterCategory.toLowerCase())) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          c.id.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q) ||
          (c.challengeId && c.challengeId.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [filterDistrict, filterCategory, searchQuery]);

  // Filtered hotspots
  const filteredHotspots = useMemo(() => {
    return HOTSPOTS_DATA.filter((h) => {
      if (filterDistrict !== "ALL" && h.district !== filterDistrict) return false;
      if (filterCategory !== "ALL" && !h.category.toLowerCase().includes(filterCategory.toLowerCase())) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          h.district.toLowerCase().includes(q) ||
          h.category.toLowerCase().includes(q) ||
          (h.clusterId && h.clusterId.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [filterDistrict, filterCategory, searchQuery]);

  // Filtered Users Directory
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = searchQuery.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q) ||
        u.organization.toLowerCase().includes(q)
      );
    });
  }, [users, searchQuery]);

  // Handle Verify User
  const handleVerifyUser = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: "ACTIVE" } : u))
    );
    toast.success("Organization Verified", {
      description: "Access permissions elevated and verified token issued.",
    });
  };

  // Open cluster modal by ID
  const handleOpenClusterById = (clusterId: string) => {
    const cluster = RECURRING_CLUSTERS.find((c) => c.id === clusterId);
    if (cluster) {
      setSelectedCluster(cluster);
    } else {
      setSelectedCluster(RECURRING_CLUSTERS[0]);
    }
  };

  // Nav Items definition
  const navItems: DashboardNavItem[] = [
    { id: "overview", label: t("dashboard.admin.tabs.overview"), icon: LayoutDashboard },
    { id: "submissions", label: t("dashboard.admin.tabs.submissions"), icon: FileText, badge: 1248 },
    { id: "departments", label: t("dashboard.admin.tabs.departments"), icon: Building2 },
    { id: "innovationChallenges", label: t("dashboard.admin.tabs.innovationChallenges"), icon: Sparkles, badge: liveChallengeCount },
    { id: "universities", label: t("dashboard.admin.tabs.universities"), icon: GraduationCap, badge: 24 },
    { id: "industryCsr", label: t("dashboard.admin.tabs.industryCsr"), icon: Briefcase, badge: 18 },
    { id: "projects", label: t("dashboard.admin.tabs.projects"), icon: FolderGit2, badge: 12 },
    { id: "pilots", label: t("dashboard.admin.tabs.pilots"), icon: Rocket, badge: 5 },
    { id: "analytics", label: t("dashboard.admin.tabs.analytics"), icon: BarChart3 },
    { id: "auditLog", label: t("dashboard.admin.tabs.auditLog"), icon: History },
    { id: "users", label: t("dashboard.admin.tabs.users"), icon: Users },
  ];

  return (
    <DashboardShell
      roleName={t("dashboard.admin.roleTitle")}
      roleBadgeText={t("dashboard.admin.roleBadge")}
      roleBadgeColor="slate"
      organizationName={t("dashboard.admin.orgName")}
      navItems={navItems}
      activeNavId={activeTab}
      onNavChange={setActiveTab}
      breadcrumbs={[
        { label: t("nav.dashboard"), href: "/dashboard" },
        { label: t("dashboard.admin.roleTitle"), href: "/dashboard/admin" },
        { label: navItems.find((n) => n.id === activeTab)?.label || t("dashboard.admin.tabs.overview") },
      ]}
    >
      {/* ──────────────────────────────────────────────────────────
          PROTOTYPE DISCLAIMER BANNER (Governance & Invariant Rule)
      ────────────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-sky-200/80 bg-gradient-to-r from-sky-50/90 via-blue-50/70 to-indigo-50/80 p-3.5 text-xs text-sky-950 flex items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-sky-600 text-white font-bold text-[11px]">
            i
          </span>
          <div>
            <span className="font-bold text-sky-900 mr-2">{t("dashboard.admin.roleBadge")}:</span>
            <span className="text-slate-700">{t("dashboard.admin.prototypeNotice")}</span>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 shrink-0 px-2 py-0.5 rounded-full bg-white/80 border border-sky-200 text-[11px] font-semibold text-sky-800">
          <ShieldAlert className="h-3.5 w-3.5 text-sky-600" />
          <span>Human-Governed Decisions</span>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────
          GLOBAL FILTER BAR & SEARCH (Section 15 & 16)
      ────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface)] p-3.5 sm:p-4 space-y-3 shadow-xs">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder={t("dashboard.admin.filters.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-base)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Quick Clear Button */}
          {(filterDistrict !== "ALL" ||
            filterCategory !== "ALL" ||
            filterPriority !== "ALL" ||
            filterStatus !== "ALL" ||
            filterRoute !== "ALL" ||
            searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setFilterDistrict("ALL");
                setFilterCategory("ALL");
                setFilterPriority("ALL");
                setFilterStatus("ALL");
                setFilterRoute("ALL");
                setSearchQuery("");
                toast.info("Filters reset to default");
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 self-start lg:self-auto transition-colors cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
          {/* District Filter */}
          <div>
            <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase mb-1">
              District
            </label>
            <select
              value={filterDistrict}
              onChange={(e) => setFilterDistrict(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-[var(--border-default)] bg-[var(--bg-base)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              <option value="ALL">{t("dashboard.admin.filters.allDistricts")}</option>
              <option value="Ranchi">Ranchi</option>
              <option value="Jamshedpur">Jamshedpur</option>
              <option value="Chaibasa">Chaibasa (West Singhbhum)</option>
              <option value="Dhanbad">Dhanbad</option>
              <option value="Bokaro">Bokaro</option>
              <option value="Hazaribagh">Hazaribagh</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase mb-1">
              Category
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-[var(--border-default)] bg-[var(--bg-base)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              <option value="ALL">{t("dashboard.admin.filters.allCategories")}</option>
              <option value="Road">Road Infrastructure</option>
              <option value="Water">Water & Sanitation</option>
              <option value="Electricity">Electricity</option>
              <option value="Health">Healthcare</option>
              <option value="Agriculture">Agriculture</option>
              <option value="Connectivity">Connectivity</option>
              <option value="Education">Education</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase mb-1">
              Priority
            </label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-[var(--border-default)] bg-[var(--bg-base)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              <option value="ALL">{t("dashboard.admin.filters.allPriorities")}</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="LOW">Low Priority</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase mb-1">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-[var(--border-default)] bg-[var(--bg-base)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              <option value="ALL">{t("dashboard.admin.filters.allStatuses")}</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="VERIFIED">Verified</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>

          {/* Route Filter */}
          <div>
            <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase mb-1">
              Route
            </label>
            <select
              value={filterRoute}
              onChange={(e) => setFilterRoute(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-[var(--border-default)] bg-[var(--bg-base)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              <option value="ALL">{t("dashboard.admin.filters.allRoutes")}</option>
              <option value="PATH_A">Path A (Existing Scheme)</option>
              <option value="PATH_B">Path B (Department Action)</option>
              <option value="PATH_C">Path C (Innovation Challenge)</option>
            </select>
          </div>

          {/* Date Range Filter */}
          <div>
            <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase mb-1">
              Timeline
            </label>
            <select
              value={filterDateRange}
              onChange={(e) => setFilterDateRange(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-[var(--border-default)] bg-[var(--bg-base)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              <option value="7d">{t("dashboard.admin.filters.last7Days")}</option>
              <option value="30d">{t("dashboard.admin.filters.last30Days")}</option>
              <option value="90d">{t("dashboard.admin.filters.last90Days")}</option>
              <option value="all">{t("dashboard.admin.filters.allTime")}</option>
            </select>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────
          TIER 1: TOP PRIMARY KPI CARDS (Section 3)
      ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Total Submissions */}
        <div className="p-4 rounded-2xl border border-[var(--border-default)] bg-[var(--surface)] shadow-xs relative overflow-hidden group hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
              {t("dashboard.admin.stats.totalSubmissions")}
            </span>
            <FileText className="h-4 w-4 text-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[var(--text-primary)]">1,248</div>
          <div className="mt-1 flex items-center text-[10px] font-semibold text-emerald-600">
            <TrendingUp className="h-3 w-3 mr-0.5" /> +12.5% this month
          </div>
        </div>

        {/* Pending */}
        <div className="p-4 rounded-2xl border border-[var(--border-default)] bg-[var(--surface)] shadow-xs relative overflow-hidden group hover:border-amber-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
              {t("dashboard.admin.stats.pending")}
            </span>
            <Clock className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-900">184</div>
          <div className="mt-1 text-[10px] font-medium text-amber-700">14.7% of total load</div>
        </div>

        {/* Resolved */}
        <div className="p-4 rounded-2xl border border-[var(--border-default)] bg-[var(--surface)] shadow-xs relative overflow-hidden group hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
              {t("dashboard.admin.stats.resolved")}
            </span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-900">927</div>
          <div className="mt-1 text-[10px] font-medium text-emerald-700">74.3% resolution rate</div>
        </div>

        {/* Innovation Challenges */}
        <div className="p-4 rounded-2xl border border-[var(--border-default)] bg-[var(--surface)] shadow-xs relative overflow-hidden group hover:border-purple-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">
              {t("dashboard.admin.stats.innovationChallenges")}
            </span>
            <Sparkles className="h-4 w-4 text-purple-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-purple-900">{liveChallengeCount}</div>
          <Link
            href="/dashboard/innovation"
            className="mt-1 flex items-center text-[10px] font-semibold text-purple-700 hover:underline"
          >
            <span>Manage RFP</span> <ArrowUpRight className="h-3 w-3 ml-0.5" />
          </Link>
        </div>

        {/* Active University Teams */}
        <div className="p-4 rounded-2xl border border-[var(--border-default)] bg-[var(--surface)] shadow-xs relative overflow-hidden group hover:border-indigo-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">
              {t("dashboard.admin.stats.universityTeams")}
            </span>
            <GraduationCap className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-indigo-900">24</div>
          <Link
            href="/dashboard/university"
            className="mt-1 flex items-center text-[10px] font-semibold text-indigo-700 hover:underline"
          >
            <span>Across 6 Unis</span> <ArrowUpRight className="h-3 w-3 ml-0.5" />
          </Link>
        </div>

        {/* Industry Partners */}
        <div className="p-4 rounded-2xl border border-[var(--border-default)] bg-[var(--surface)] shadow-xs relative overflow-hidden group hover:border-teal-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">
              {t("dashboard.admin.stats.industryPartners")}
            </span>
            <Briefcase className="h-4 w-4 text-teal-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-teal-900">18</div>
          <Link
            href="/dashboard/industry"
            className="mt-1 flex items-center text-[10px] font-semibold text-teal-700 hover:underline"
          >
            <span>CSR & Tech</span> <ArrowUpRight className="h-3 w-3 ml-0.5" />
          </Link>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────
          SECONDARY PERFORMANCE METRICS (Section 4)
      ────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-base)] p-3 sm:p-4">
        <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2 px-1">
          Operational Benchmarks & Velocity
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 text-xs">
          <div className="p-2.5 rounded-xl border border-[var(--border-default)] bg-[var(--surface)]">
            <span className="text-[10px] text-[var(--text-muted)] font-medium block">
              {t("dashboard.admin.stats.avgResponseTime")}
            </span>
            <span className="text-base font-bold text-[var(--text-primary)]">18.4 hrs</span>
          </div>

          <div className="p-2.5 rounded-xl border border-[var(--border-default)] bg-[var(--surface)]">
            <span className="text-[10px] text-[var(--text-muted)] font-medium block">
              {t("dashboard.admin.stats.resolutionRate")}
            </span>
            <span className="text-base font-bold text-emerald-700">74.3%</span>
          </div>

          <div className="p-2.5 rounded-xl border border-[var(--border-default)] bg-[var(--surface)]">
            <span className="text-[10px] text-[var(--text-muted)] font-medium block">
              {t("dashboard.admin.stats.deptCases")}
            </span>
            <span className="text-base font-bold text-[var(--text-primary)]">43</span>
          </div>

          <div className="p-2.5 rounded-xl border border-[var(--border-default)] bg-[var(--surface)]">
            <span className="text-[10px] text-[var(--text-muted)] font-medium block">
              {t("dashboard.admin.stats.activeInnovationProjects")}
            </span>
            <span className="text-base font-bold text-purple-700">14</span>
          </div>

          <div className="p-2.5 rounded-xl border border-[var(--border-default)] bg-[var(--surface)]">
            <span className="text-[10px] text-[var(--text-muted)] font-medium block">
              {t("dashboard.admin.stats.prototypeProjects")}
            </span>
            <span className="text-base font-bold text-indigo-700">12</span>
          </div>

          <div className="p-2.5 rounded-xl border border-[var(--border-default)] bg-[var(--surface)]">
            <span className="text-[10px] text-[var(--text-muted)] font-medium block">
              {t("dashboard.admin.stats.pilotProjects")}
            </span>
            <span className="text-base font-bold text-teal-700">5</span>
          </div>

          <div className="p-2.5 rounded-xl border border-[var(--border-default)] bg-[var(--surface)]">
            <span className="text-[10px] text-[var(--text-muted)] font-medium block">
              {t("dashboard.admin.stats.communityReach")}
            </span>
            <span className="text-base font-bold text-sky-700">12,500</span>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────
          TIER 2: GEOGRAPHIC HOTSPOTS & CATEGORY TRENDS (Sec 5 & 6)
      ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* District Heatmap (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-[var(--border-default)] bg-[var(--surface)] p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-default)] mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-indigo-600" />
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">
                    {t("dashboard.admin.districtMapTitle")}
                  </h3>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    {t("dashboard.admin.districtMapSub")}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                6 Districts Analyzed
              </span>
            </div>

            {/* Interactive Leaflet Heatmap */}
            <DistrictHeatmap
              districts={DISTRICTS_DATA}
              selectedDistrict={filterDistrict !== "ALL" ? filterDistrict : null}
              onSelectDistrict={(dist) => {
                setFilterDistrict(dist);
                toast.info(`Filtering analytics by ${dist}`);
              }}
              onOpenCluster={handleOpenClusterById}
              tLabels={{
                reports: t("dashboard.admin.districtReports"),
                pending: t("dashboard.admin.districtPending"),
                resolved: t("dashboard.admin.districtResolved"),
                highPriority: t("dashboard.admin.districtHighPriority"),
                innovationCandidates: t("dashboard.admin.districtInnovationCandidates"),
                viewDetails: t("dashboard.admin.viewDetails"),
              }}
            />
          </div>

          {/* Quick summary below map */}
          <div className="mt-3 pt-3 border-t border-[var(--border-default)] flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-[11px] text-[var(--text-muted)]">
              💡 Click any circle or Chaibasa marker to inspect the <strong>WQ-07</strong> water cluster.
            </span>
            <button
              type="button"
              onClick={() => handleOpenClusterById("WQ-07")}
              className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
            >
              <span>Demo Water Cluster (WQ-07)</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Category Breakdown (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-[var(--border-default)] bg-[var(--surface)] p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-default)] mb-3">
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">
                    {t("dashboard.admin.categoryTitle")}
                  </h3>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    {t("dashboard.admin.categorySub")}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                1,248 Total
              </span>
            </div>

            {/* Category Bars List */}
            <div className="space-y-2.5">
              {CATEGORIES_DATA.map((cat) => (
                <div key={cat.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[var(--text-primary)]">{cat.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[var(--text-primary)]">{cat.count}</span>
                      <span className="text-[10px] text-[var(--text-muted)] w-8 text-right">
                        {cat.percentage}%
                      </span>
                      <span className="text-[10px] font-medium text-emerald-600 w-12 text-right">
                        {cat.trend}
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${cat.color}`}
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[var(--border-default)] text-[11px] text-[var(--text-muted)]">
            Dominant domain: <strong>Roads & Water (37.3% combined)</strong> driving municipal escalation.
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────
          TIER 3: CASE STATUS & RECURRING PROBLEM CLUSTERS (Sec 7, 8, 9)
      ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Status Pipeline & Hotspots (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Status Breakdown */}
          <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface)] p-4 shadow-xs">
            <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">
              {t("dashboard.admin.statusTitle")}
            </h3>
            <p className="text-[11px] text-[var(--text-muted)] mb-3">
              {t("dashboard.admin.statusSub")}
            </p>
            <div className="space-y-2 text-xs">
              {CASE_STATUSES.map((st) => (
                <div key={st.status} className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-base)]">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${st.color}`} />
                    <span className="font-medium text-[var(--text-primary)]">{st.status}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[var(--text-primary)]">{st.count}</span>
                    <span className="text-[10px] text-[var(--text-muted)]">({st.percent}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* High-Priority Hotspots List */}
          <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface)] p-4 shadow-xs">
            <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">
              {t("dashboard.admin.hotspotsTitle")}
            </h3>
            <p className="text-[11px] text-[var(--text-muted)] mb-3">
              {t("dashboard.admin.hotspotsSub")}
            </p>
            <div className="space-y-2 text-xs">
              {filteredHotspots.map((hs) => (
                <div
                  key={hs.id}
                  className={`p-2.5 rounded-xl border transition-all ${
                    hs.isSpecial
                      ? "border-red-300 bg-red-50/60 hover:bg-red-50"
                      : "border-[var(--border-default)] bg-[var(--bg-base)] hover:bg-slate-100/60"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[var(--text-primary)]">
                      {hs.district} — {hs.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        hs.isSpecial
                          ? "bg-red-600 text-white"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      Priority: {hs.highPriorityCount}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                    <span>{hs.reportsCount} related reports</span>
                    <button
                      type="button"
                      onClick={() => {
                        if (hs.clusterId) handleOpenClusterById(hs.clusterId);
                        else toast.info(`Viewing details for ${hs.district}`);
                      }}
                      className="text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
                    >
                      {t("dashboard.admin.viewDetails")} →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recurring Community Issues (CRITICAL DEMO REQUIREMENT - 8 cols) */}
        <div className="lg:col-span-8 rounded-2xl border border-[var(--border-default)] bg-[var(--surface)] p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--border-default)] mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">
                    {t("dashboard.admin.clustersTitle")}
                  </h3>
                </div>
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                  {t("dashboard.admin.clustersSub")}
                </p>
              </div>
              <span className="self-start sm:self-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                Pattern Recognition Active
              </span>
            </div>

            {/* Clusters Table / Cards */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[var(--text-primary)]">
                <thead>
                  <tr className="border-b border-[var(--border-default)] text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                    <th className="pb-2.5">{t("dashboard.admin.clusterId")}</th>
                    <th className="pb-2.5">{t("dashboard.admin.clusterProblem")}</th>
                    <th className="pb-2.5">{t("dashboard.admin.clusterReports")}</th>
                    <th className="pb-2.5">{t("dashboard.admin.clusterLocation")}</th>
                    <th className="pb-2.5">{t("dashboard.admin.clusterRoute")}</th>
                    <th className="pb-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-default)]">
                  {filteredClusters.map((cluster) => {
                    const isWaterDemo = cluster.id === "WQ-07";
                    return (
                      <tr
                        key={cluster.id}
                        className={`hover:bg-slate-50/80 transition-colors ${
                          isWaterDemo ? "bg-red-50/30" : ""
                        }`}
                      >
                        <td className="py-3 font-mono font-bold">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] ${
                              isWaterDemo
                                ? "bg-red-100 text-red-800 border border-red-300 font-extrabold"
                                : "bg-slate-100 text-slate-800"
                            }`}
                          >
                            {cluster.id}
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="font-bold text-[var(--text-primary)]">{cluster.title}</div>
                          <div className="text-[10px] text-[var(--text-muted)]">{cluster.villagesCount} villages impacted</div>
                        </td>
                        <td className="py-3 font-bold text-[var(--text-primary)]">
                          {cluster.reportsCount}
                        </td>
                        <td className="py-3 text-[var(--text-muted)] font-medium">
                          {cluster.location}
                        </td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isWaterDemo
                                ? "bg-purple-100 text-purple-800 border border-purple-200"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {cluster.route}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedCluster(cluster)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition-all cursor-pointer ${
                              isWaterDemo
                                ? "bg-red-600 hover:bg-red-700 text-white shadow-xs"
                                : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                            }`}
                          >
                            <span>{t("dashboard.admin.inspectCluster")}</span>
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[var(--border-default)] flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>
              Clusters prevent repetitive individual ticketing by elevating recurring systemic grievances into R&D / Department projects.
            </span>
            <span className="font-semibold text-slate-700">4 Active Clusters</span>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────
          TIER 4: INNOVATION PIPELINE FUNNEL (Section 10)
      ────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface)] p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--border-default)] mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <h3 className="text-sm font-bold text-[var(--text-primary)]">
                {t("dashboard.admin.pipelineTitle")}
              </h3>
            </div>
            <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
              {t("dashboard.admin.pipelineSub")}
            </p>
          </div>
          <Link
            href="/dashboard/innovation"
            className="text-xs font-bold text-purple-700 hover:text-purple-900 inline-flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Open Innovation Cell</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Funnel Pipeline Steps */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {/* Candidates */}
          <div className="p-3 rounded-xl border border-purple-200/60 bg-purple-50/50 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-purple-700 uppercase">
              {t("dashboard.admin.stageCandidates")}
            </span>
            <div className="my-2 text-2xl font-bold text-purple-950">31</div>
            <div className="text-[10px] text-purple-700 font-medium">Cross-report flagged</div>
          </div>

          {/* Validated Challenges */}
          <div className="p-3 rounded-xl border border-indigo-200/60 bg-indigo-50/50 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-indigo-700 uppercase">
              {t("dashboard.admin.stageValidated")}
            </span>
            <div className="my-2 text-2xl font-bold text-indigo-950">18</div>
            <div className="text-[10px] text-indigo-700 font-medium">Official RFPs</div>
          </div>

          {/* University Assigned */}
          <div className="p-3 rounded-xl border border-blue-200/60 bg-blue-50/50 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-blue-700 uppercase">
              {t("dashboard.admin.stageAssigned")}
            </span>
            <div className="my-2 text-2xl font-bold text-blue-950">14</div>
            <div className="text-[10px] text-blue-700 font-medium">Faculty matched</div>
          </div>

          {/* Proposals */}
          <div className="p-3 rounded-xl border border-sky-200/60 bg-sky-50/50 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-sky-700 uppercase">
              {t("dashboard.admin.stageProposals")}
            </span>
            <div className="my-2 text-2xl font-bold text-sky-950">9</div>
            <div className="text-[10px] text-sky-700 font-medium">Technical drafts</div>
          </div>

          {/* Prototype */}
          <div className="p-3 rounded-xl border border-amber-200/60 bg-amber-50/50 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-amber-700 uppercase">
              {t("dashboard.admin.stagePrototype")}
            </span>
            <div className="my-2 text-2xl font-bold text-amber-950">6</div>
            <div className="text-[10px] text-amber-700 font-medium">Hardware / software</div>
          </div>

          {/* Pilot Ready */}
          <div className="p-3 rounded-xl border border-teal-200/60 bg-teal-50/50 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-teal-700 uppercase">
              {t("dashboard.admin.stagePilotReady")}
            </span>
            <div className="my-2 text-2xl font-bold text-teal-950">3</div>
            <div className="text-[10px] text-teal-700 font-medium">Site allocated</div>
          </div>

          {/* Pilot Active */}
          <div className="p-3 rounded-xl border border-emerald-300 bg-emerald-50/80 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-emerald-800 uppercase">
              {t("dashboard.admin.stagePilotActive")}
            </span>
            <div className="my-2 text-2xl font-bold text-emerald-950">2</div>
            <div className="text-[10px] text-emerald-800 font-bold">Field deployed</div>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────
          TIER 5: UNIVERSITIES & INDUSTRY CSR (Section 11 & 12)
      ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* University Participation Ranking (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-[var(--border-default)] bg-[var(--surface)] p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--border-default)] mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-indigo-600" />
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">
                    {t("dashboard.admin.uniTitle")}
                  </h3>
                </div>
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                  {t("dashboard.admin.uniSub")}
                </p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                Participation Only (Not Quality)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[var(--text-primary)]">
                <thead>
                  <tr className="border-b border-[var(--border-default)] text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                    <th className="pb-2.5">{t("dashboard.admin.uniColUniversity")}</th>
                    <th className="pb-2.5 text-center">{t("dashboard.admin.uniColAssigned")}</th>
                    <th className="pb-2.5 text-center">{t("dashboard.admin.uniColTeams")}</th>
                    <th className="pb-2.5 text-center">{t("dashboard.admin.uniColProposals")}</th>
                    <th className="pb-2.5 text-center">{t("dashboard.admin.uniColProjects")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-default)]">
                  {UNIVERSITIES_DATA.map((uni, idx) => (
                    <tr key={uni.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 font-bold text-[var(--text-primary)]">
                        <div className="flex items-center gap-2">
                          <span className="h-5 w-5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-[10px] flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <div>
                            <div>{uni.name}</div>
                            <div className="text-[10px] font-normal text-[var(--text-muted)]">{uni.leadDomain}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 text-center font-semibold text-[var(--text-primary)]">
                        {uni.assignedChallenges}
                      </td>
                      <td className="py-2.5 text-center font-semibold text-indigo-700">
                        {uni.activeTeams}
                      </td>
                      <td className="py-2.5 text-center font-semibold text-[var(--text-primary)]">
                        {uni.proposals}
                      </td>
                      <td className="py-2.5 text-center font-semibold text-emerald-700">
                        {uni.projects}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[var(--border-default)] flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>24 active student engineering teams engaged across state institutions</span>
            <Link href="/dashboard/university" className="text-indigo-600 hover:text-indigo-800 font-semibold">
              University Portal →
            </Link>
          </div>
        </div>

        {/* Industry / CSR Engagement (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-[var(--border-default)] bg-[var(--surface)] p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-default)] mb-4">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-teal-600" />
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">
                    {t("dashboard.admin.industryTitle")}
                  </h3>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    {t("dashboard.admin.industrySub")}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                18 Partners
              </span>
            </div>

            {/* Engagement Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
              <div className="p-3 rounded-xl border border-[var(--border-default)] bg-[var(--bg-base)]">
                <span className="text-[10px] font-bold text-[var(--text-muted)] block uppercase">
                  {t("dashboard.admin.fundingOffers")}
                </span>
                <span className="text-xl font-bold text-teal-900 mt-1 block">9</span>
                <span className="text-[10px] text-teal-700 font-medium">CSR capital grants</span>
              </div>

              <div className="p-3 rounded-xl border border-[var(--border-default)] bg-[var(--bg-base)]">
                <span className="text-[10px] font-bold text-[var(--text-muted)] block uppercase">
                  {t("dashboard.admin.mentorshipOffers")}
                </span>
                <span className="text-xl font-bold text-indigo-900 mt-1 block">12</span>
                <span className="text-[10px] text-indigo-700 font-medium">Industry mentors</span>
              </div>

              <div className="p-3 rounded-xl border border-[var(--border-default)] bg-[var(--bg-base)]">
                <span className="text-[10px] font-bold text-[var(--text-muted)] block uppercase">
                  {t("dashboard.admin.prototypeSupport")}
                </span>
                <span className="text-xl font-bold text-purple-900 mt-1 block">7</span>
                <span className="text-[10px] text-purple-700 font-medium">Labs & fabrication</span>
              </div>

              <div className="p-3 rounded-xl border border-[var(--border-default)] bg-[var(--bg-base)]">
                <span className="text-[10px] font-bold text-[var(--text-muted)] block uppercase">
                  {t("dashboard.admin.pilotSupport")}
                </span>
                <span className="text-xl font-bold text-emerald-900 mt-1 block">4</span>
                <span className="text-[10px] text-emerald-700 font-medium">Sited deployments</span>
              </div>
            </div>

            {/* Partnership Pipeline */}
            <div className="p-3 rounded-xl border border-[var(--border-default)] bg-[var(--bg-base)]">
              <span className="text-[10px] font-bold text-[var(--text-muted)] block uppercase mb-2">
                {t("dashboard.admin.partnershipPipeline")}
              </span>
              <div className="flex items-center justify-between text-xs">
                <div className="text-center">
                  <div className="font-bold text-[var(--text-primary)]">18</div>
                  <div className="text-[10px] text-[var(--text-muted)]">Interest</div>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                <div className="text-center">
                  <div className="font-bold text-amber-700">12</div>
                  <div className="text-[10px] text-[var(--text-muted)]">Reviewed</div>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                <div className="text-center">
                  <div className="font-bold text-blue-700">8</div>
                  <div className="text-[10px] text-[var(--text-muted)]">Accepted</div>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                <div className="text-center">
                  <div className="font-bold text-emerald-700">6</div>
                  <div className="text-[10px] text-[var(--text-muted)]">Active</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[var(--border-default)] flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>Tata Steel Foundation & CCL actively sponsoring prototype fabrication</span>
            <Link href="/dashboard/industry" className="text-teal-700 hover:text-teal-900 font-semibold">
              CSR Portal →
            </Link>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────
          TIER 6: PROJECT LIFECYCLE (Section 13)
      ────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface)] p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-default)] mb-4">
          <div>
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              {t("dashboard.admin.lifecycleTitle")}
            </h3>
            <p className="text-[11px] text-[var(--text-muted)]">
              {t("dashboard.admin.lifecycleSub")}
            </p>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
            8-Stage Milestone Tracker
          </span>
        </div>

        {/* Lifecycle Flow */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-xs">
          {[
            { stage: "Challenge", count: 18, color: "border-purple-200 bg-purple-50 text-purple-900" },
            { stage: "Team Formed", count: 14, color: "border-indigo-200 bg-indigo-50 text-indigo-900" },
            { stage: "Proposal", count: 9, color: "border-blue-200 bg-blue-50 text-blue-900" },
            { stage: "Prototype", count: 6, color: "border-sky-200 bg-sky-50 text-sky-900" },
            { stage: "Testing", count: 5, color: "border-amber-200 bg-amber-50 text-amber-900" },
            { stage: "Pilot Ready", count: 3, color: "border-orange-200 bg-orange-50 text-orange-900" },
            { stage: "Pilot", count: 2, color: "border-emerald-200 bg-emerald-50 text-emerald-900 font-bold" },
            { stage: "Impact", count: 1, color: "border-green-300 bg-green-100 text-green-950 font-extrabold" },
          ].map((item, index) => (
            <div
              key={item.stage}
              className={`p-3 rounded-xl border ${item.color} flex flex-col justify-between text-center relative`}
            >
              <div className="text-[10px] font-bold uppercase tracking-wider">{item.stage}</div>
              <div className="text-xl font-bold my-1">{item.count}</div>
              <div className="text-[9px] text-slate-500">Stage {index + 1}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────
          TIER 7: COMMUNITY IMPACT (Section 14)
      ────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/60 via-teal-50/40 to-slate-50 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-emerald-200/70 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-emerald-700" />
              <h3 className="text-sm font-bold text-emerald-950">
                {t("dashboard.admin.impactTitle")}
              </h3>
            </div>
            <p className="text-[11px] text-emerald-800 mt-0.5">
              {t("dashboard.admin.impactSub")}
            </p>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 self-start sm:self-auto">
            Prototype Demo Metrics
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div className="p-3 rounded-xl border border-emerald-200 bg-white/90 shadow-2xs">
            <span className="text-[10px] font-bold text-emerald-800 block uppercase">
              {t("dashboard.admin.householdsReached")}
            </span>
            <span className="text-2xl font-extrabold text-emerald-950 mt-1 block">12,500</span>
            <span className="text-[10px] text-slate-500">Across 6 districts</span>
          </div>

          <div className="p-3 rounded-xl border border-emerald-200 bg-white/90 shadow-2xs">
            <span className="text-[10px] font-bold text-emerald-800 block uppercase">
              {t("dashboard.admin.problemsResolved")}
            </span>
            <span className="text-2xl font-extrabold text-emerald-950 mt-1 block">927</span>
            <span className="text-[10px] text-slate-500">Verified by citizens</span>
          </div>

          <div className="p-3 rounded-xl border border-emerald-200 bg-white/90 shadow-2xs">
            <span className="text-[10px] font-bold text-emerald-800 block uppercase">
              {t("dashboard.admin.villagesCovered")}
            </span>
            <span className="text-2xl font-extrabold text-emerald-950 mt-1 block">64</span>
            <span className="text-[10px] text-slate-500">Panchayat clusters</span>
          </div>

          <div className="p-3 rounded-xl border border-emerald-200 bg-white/90 shadow-2xs">
            <span className="text-[10px] font-bold text-emerald-800 block uppercase">
              {t("dashboard.admin.districtsCovered")}
            </span>
            <span className="text-2xl font-extrabold text-emerald-950 mt-1 block">6</span>
            <span className="text-[10px] text-slate-500">Active telemetry</span>
          </div>

          <div className="p-3 rounded-xl border border-emerald-200 bg-white/90 shadow-2xs">
            <span className="text-[10px] font-bold text-emerald-800 block uppercase">
              {t("dashboard.admin.activePilots")}
            </span>
            <span className="text-2xl font-extrabold text-emerald-950 mt-1 block">5</span>
            <span className="text-[10px] text-slate-500">Field engineering trials</span>
          </div>

          <div className="p-3 rounded-xl border border-emerald-200 bg-white/90 shadow-2xs">
            <span className="text-[10px] font-bold text-emerald-800 block uppercase">
              {t("dashboard.admin.projectsDeployed")}
            </span>
            <span className="text-2xl font-extrabold text-emerald-950 mt-1 block">9</span>
            <span className="text-[10px] text-slate-500">Operational prototypes</span>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────
          TIER 8: LIVE ACTIVITY FEED & AUDIT LOG (Section 17 & 18)
      ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Live Activity Feed (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-[var(--border-default)] bg-[var(--surface)] p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-default)] mb-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-sm font-bold text-[var(--text-primary)]">
                {t("dashboard.admin.activityTitle")}
              </h3>
            </div>
            <span className="text-[10px] font-bold text-[var(--text-muted)]">Live Telemetry</span>
          </div>

          <div className="space-y-2.5 text-xs">
            {LIVE_ACTIVITY.map((act, i) => (
              <div key={i} className="flex items-start gap-3 p-2 rounded-xl bg-[var(--bg-base)]">
                <span className="font-mono text-[11px] font-bold text-slate-500 mt-0.5 w-10 shrink-0">
                  {act.time}
                </span>
                <div className="flex-1">
                  <div className="font-semibold text-[var(--text-primary)]">{act.title}</div>
                  <div className="text-[10px] text-[var(--text-muted)] flex items-center gap-1.5 mt-0.5">
                    <span>{act.actor}</span>
                    <span>•</span>
                    <span className="font-mono text-indigo-600">{act.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Audit Summary (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-[var(--border-default)] bg-[var(--surface)] p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-default)] mb-3">
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-indigo-600" />
              <div>
                <h3 className="text-sm font-bold text-[var(--text-primary)]">
                  {t("dashboard.admin.auditTitle")}
                </h3>
                <p className="text-[11px] text-[var(--text-muted)]">
                  {t("dashboard.admin.auditSub")}
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              Immutable Log
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            {AUDIT_LOG.map((log) => (
              <div
                key={log.id}
                className="p-2.5 rounded-xl border border-[var(--border-default)] bg-[var(--bg-base)] flex items-center justify-between flex-wrap gap-2"
              >
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">{log.time}</span>
                  <span className="font-bold text-indigo-700">{log.entity}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-800 text-[10px] font-semibold">
                    {log.action}
                  </span>
                  <span className="text-slate-600 text-[10px]">{log.actorRole}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────
          USER DIRECTORY TAB (Preserved and Refined)
      ────────────────────────────────────────────────────────── */}
      {activeTab === "users" && (
        <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface)] p-4 sm:p-6 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-default)]">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-600" />
              <h2 className="text-base font-bold text-[var(--text-primary)]">
                {t("dashboard.admin.userDirectory")}
              </h2>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder={t("dashboard.admin.filters.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-[var(--border-default)] bg-[var(--bg-base)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[var(--text-primary)]">
              <thead>
                <tr className="border-b border-[var(--border-default)] text-[var(--text-muted)] uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-semibold">{t("dashboard.admin.name")}</th>
                  <th className="pb-3 font-semibold">{t("dashboard.admin.role")}</th>
                  <th className="pb-3 font-semibold">{t("dashboard.admin.organization")}</th>
                  <th className="pb-3 font-semibold">{t("dashboard.admin.status")}</th>
                  <th className="pb-3 font-semibold">{t("dashboard.admin.lastActive")}</th>
                  <th className="pb-3 font-semibold text-right">{t("dashboard.common.actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-default)]">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3">
                      <div className="font-bold text-[var(--text-primary)]">{user.name}</div>
                      <div className="text-[11px] text-[var(--text-muted)]">{user.email}</div>
                    </td>
                    <td className="py-3">
                      <span className="font-mono text-[11px] font-semibold text-indigo-700 px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 text-[var(--text-muted)] font-medium">{user.organization}</td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          user.status === "ACTIVE"
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {user.status === "ACTIVE" ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                        {t(`statusMap.${user.status}` as any) || user.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-3 text-[var(--text-muted)]">{user.lastActive}</td>
                    <td className="py-3 text-right">
                      {user.status === "PENDING_VERIFICATION" ? (
                        <button
                          type="button"
                          onClick={() => handleVerifyUser(user.id)}
                          className="px-2.5 py-1 rounded-md bg-green-700 text-white font-semibold text-[11px] hover:bg-green-800 transition-colors cursor-pointer"
                        >
                          {t("dashboard.admin.actions.verifyOrg")}
                        </button>
                      ) : (
                        <span className="text-[var(--text-muted)] text-[11px]">
                          {t("statusMap.CONFIRMED")}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          CRITICAL DEMO MODAL: WATER QUALITY CLUSTER WQ-07 (Sec 19)
      ────────────────────────────────────────────────────────── */}
      {selectedCluster && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-red-100 border border-red-200 flex items-center justify-center text-red-600">
                  <Droplets className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-red-600 text-white font-mono text-xs font-bold">
                      {selectedCluster.id}
                    </span>
                    <h2 className="text-base font-bold text-slate-900">
                      {selectedCluster.title}
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {t("dashboard.admin.clusterModalSub")}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCluster(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Metrics Snapshot */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-red-50/80 border border-red-200">
                <span className="text-[10px] font-bold text-red-700 uppercase block">Related Reports</span>
                <span className="text-2xl font-black text-red-950 mt-1 block">
                  {selectedCluster.reportsCount}
                </span>
                <span className="text-[10px] text-red-700 font-medium">Individual grievances</span>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200">
                <span className="text-[10px] font-bold text-amber-700 uppercase block">
                  {t("dashboard.admin.villagesAffected")}
                </span>
                <span className="text-2xl font-black text-amber-950 mt-1 block">
                  {selectedCluster.villagesCount}
                </span>
                <span className="text-[10px] text-amber-700 font-medium">Chaibasa rural belt</span>
              </div>

              <div className="p-3 rounded-2xl bg-purple-50/80 border border-purple-200">
                <span className="text-[10px] font-bold text-purple-700 uppercase block">Priority Level</span>
                <span className="text-lg font-bold text-purple-950 mt-1 block">High (Critical)</span>
                <span className="text-[10px] text-purple-700 font-medium">Health risk flagged</span>
              </div>

              <div className="p-3 rounded-2xl bg-indigo-50/80 border border-indigo-200">
                <span className="text-[10px] font-bold text-indigo-700 uppercase block">System Route</span>
                <span className="text-sm font-bold text-indigo-950 mt-1 block">
                  {selectedCluster.route}
                </span>
                <span className="text-[10px] text-indigo-700 font-medium">Path C Escalation</span>
              </div>
            </div>

            {/* Crucial Concept Explanatory Callout (Section 20 Demo Script point 10) */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-xs text-blue-950 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-blue-900">
                <Sparkles className="h-4 w-4 text-indigo-600" />
                <span>Pattern Recognition Over Isolated Ticketing</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-700">
                &ldquo;{selectedCluster.explanation}&rdquo;
              </p>
            </div>

            {/* Linked Challenge / RFP Section */}
            {selectedCluster.challengeId && (
              <div className="p-4 rounded-2xl border border-purple-200 bg-purple-50/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
                    {t("dashboard.admin.linkedOfficialChallenge")}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-purple-200 text-purple-900 font-mono text-[10px] font-bold">
                    {selectedCluster.challengeId}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    {selectedCluster.challengeTitle}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Validated by State Innovation Cell and published for University R&D matching with Tata Steel CSR support.
                  </p>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <Link
                    href={`/dashboard/innovation`}
                    className="flex-1 py-2 px-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <span>{t("dashboard.admin.viewChallengeRfp")}</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    href={`/dashboard/university`}
                    className="py-2 px-3 rounded-xl border border-purple-300 bg-white hover:bg-purple-50 text-purple-800 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                  >
                    <span>University Teams</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedCluster(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
