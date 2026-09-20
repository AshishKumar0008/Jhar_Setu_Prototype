"use client";

import React, { useState } from "react";
import {
  DashboardShell,
  DashboardNavItem,
} from "@/components/dashboard/dashboard-shell";
import {
  LayoutDashboard,
  Compass,
  Handshake,
  Coins,
  GraduationCap,
  Wrench,
  ShieldCheck,
  Bell,
  Search,
  CheckCircle2,
  Building2,
  ArrowUpRight,
  ExternalLink,
  Tag,
  Sparkles,
  Award,
  DollarSign,
  Briefcase,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/lib/i18n/language-context";

interface ProjectOpportunity {
  id: string;
  problem: string;
  university: string;
  projectStage: "LAB_PROTOTYPE" | "PILOT_READY" | "FIELD_TESTING";
  supportRequired: string;
  fundingRequirement: string;
  prototypeRequirement: string;
  pilotRequirement: string;
  status: "OPEN_FOR_SUPPORT" | "PARTNERSHIP_SUBMITTED" | "CONFIRMED";
  domain: string;
}

const INITIAL_OPPORTUNITIES: ProjectOpportunity[] = [
  {
    id: "PROJ-2026-WTR-BIT",
    problem:
      "Low-cost arsenic remediation filter with decentralized IoT telemetry for 18 affected habitations in West Singhbhum.",
    university: "Birla Institute of Technology (BIT) Mesra",
    projectStage: "PILOT_READY",
    supportRequired: "CSR Capital Grant & Local Manufacturing / Deployment Logistics",
    fundingRequirement: "₹8,50,000 (Materials, telemetry pod fabrication & lab reagents)",
    prototypeRequirement: "Precision CNC fabrication for filter casing & food-grade resin molding",
    pilotRequirement: "Site access & logistics support across 5 panchayat health centres",
    status: "OPEN_FOR_SUPPORT",
    domain: "Drinking Water & Community Health",
  },
  {
    id: "PROJ-2026-COLD-NIT",
    problem:
      "Passive solar phase-change material vaccine cooler keeping 2-8°C storage during extended 72-hour rural electrical blackouts.",
    university: "NIT Jamshedpur & BIT Mesra Joint Lab",
    projectStage: "LAB_PROTOTYPE",
    supportRequired: "Specialty Material Procurement & Industrial Mentorship",
    fundingRequirement: "₹4,20,000 (PCM compound batches & calibrated temperature dataloggers)",
    prototypeRequirement: "Thermal testing chamber access & custom sheet-metal insulation tooling",
    pilotRequirement: "Deployment in 3 primary health sub-centres in Khunti district",
    status: "OPEN_FOR_SUPPORT",
    domain: "Renewable Energy & Public Health",
  },
  {
    id: "PROJ-2026-LORA-ISM",
    problem:
      "LoRaWAN acoustic seismic elephant warning network preventing human-wildlife conflicts along railway corridors.",
    university: "IIT (ISM) Dhanbad",
    projectStage: "FIELD_TESTING",
    supportRequired: "Solar Node Sponsorship & CSR Engineering Mentorship",
    fundingRequirement: "₹6,00,000 (30 LoRaWAN solar gateway units)",
    prototypeRequirement: "Weatherproof IP68 enclosures & mast mounting hardware",
    pilotRequirement: "10km corridor testing with Forest Dept approval",
    status: "PARTNERSHIP_SUBMITTED",
    domain: "Wildlife Safety & IoT Infrastructure",
  },
];

export default function IndustryDashboardPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("overview");
  const [opportunities, setOpportunities] = useState<ProjectOpportunity[]>(INITIAL_OPPORTUNITIES);
  const [selectedProject, setSelectedProject] = useState<ProjectOpportunity | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const navItems: DashboardNavItem[] = [
    { id: "overview", label: t("dashboard.industry.tabs.overview"), icon: LayoutDashboard },
    {
      id: "opportunities",
      label: t("dashboard.industry.tabs.opportunities"),
      icon: Compass,
      badge: opportunities.filter((o) => o.status === "OPEN_FOR_SUPPORT").length,
    },
    {
      id: "partnerships",
      label: t("dashboard.industry.tabs.partnerships"),
      icon: Handshake,
      badge: opportunities.filter((o) => o.status !== "OPEN_FOR_SUPPORT").length,
    },
    { id: "funding", label: t("dashboard.industry.tabs.funding"), icon: Coins },
    { id: "mentorship", label: t("dashboard.industry.tabs.mentorship"), icon: GraduationCap },
    { id: "prototype-support", label: t("dashboard.industry.tabs.prototypeSupport"), icon: Wrench },
    { id: "pilot-support", label: t("dashboard.industry.tabs.pilotSupport"), icon: ShieldCheck },
    { id: "notifications", label: t("dashboard.common.notifications"), icon: Bell, badge: 1 },
  ];

  // Action handlers
  const handleOfferSupport = (
    proj: ProjectOpportunity,
    supportType: string
  ) => {
    toast.success(`Support Offer Logged: ${supportType}`, {
      description: `Your pledge has been transmitted to ${proj.university} and the State Innovation Cell.`,
    });
  };

  const handleSubmitPartnership = (proj: ProjectOpportunity) => {
    setOpportunities((prev) =>
      prev.map((o) => (o.id === proj.id ? { ...o, status: "PARTNERSHIP_SUBMITTED" } : o))
    );
    setSelectedProject((prev) =>
      prev ? { ...prev, status: "PARTNERSHIP_SUBMITTED" } : null
    );
    toast.success("Partnership Request Submitted", {
      description:
        "Status is PENDING. It will flip to CONFIRMED after your authorized signatory verification.",
    });
  };

  const filteredOpportunities = opportunities.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.problem.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.domain.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "opportunities") return matchesSearch && o.status === "OPEN_FOR_SUPPORT";
    if (activeTab === "partnerships") return matchesSearch && o.status !== "OPEN_FOR_SUPPORT";
    return matchesSearch;
  });

  return (
    <DashboardShell
      roleName={t("dashboard.industry.roleTitle")}
      roleBadgeText={t("dashboard.industry.roleBadge")}
      roleBadgeColor="orange"
      organizationName={t("dashboard.industry.orgName")}
      navItems={navItems}
      activeNavId={activeTab}
      onNavChange={setActiveTab}
      breadcrumbs={[
        { label: t("nav.dashboard"), href: "/dashboard" },
        { label: t("dashboard.industry.roleTitle"), href: "/dashboard/industry" },
        { label: navItems.find((n) => n.id === activeTab)?.label || t("dashboard.industry.tabs.overview") },
      ]}
    >
      {/* ───── METRICS OVERVIEW CARDS ───── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl border border-[#E2E5EA] bg-white shadow-xs">
          <span className="text-xs font-semibold text-[#6B7280]">
            {t("dashboard.industry.stats.openOpportunities")}
          </span>
          <div className="mt-2 text-2xl sm:text-3xl font-bold text-orange-700">
            {opportunities.filter((o) => o.status === "OPEN_FOR_SUPPORT").length}
          </div>
          <p className="text-[11px] text-orange-600 font-medium mt-1">
            Vetted university R&D projects ready for CSR
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl border border-[#E2E5EA] bg-white shadow-xs">
          <span className="text-xs font-semibold text-[#6B7280]">
            {t("dashboard.industry.stats.activePledges")}
          </span>
          <div className="mt-2 text-2xl sm:text-3xl font-bold text-[#0F62B4]">₹14.5L</div>
          <p className="text-[11px] text-[#0F62B4] font-medium mt-1">
            Committed across 2 state pilot projects
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl border border-[#E2E5EA] bg-white shadow-xs">
          <span className="text-xs font-semibold text-[#6B7280]">
            {t("dashboard.industry.stats.committedFunding")}
          </span>
          <div className="mt-2 text-2xl sm:text-3xl font-bold text-purple-700">4</div>
          <p className="text-[11px] text-purple-700 font-medium mt-1">
            Senior industrial engineers advising student teams
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl border border-[#E2E5EA] bg-white shadow-xs">
          <span className="text-xs font-semibold text-[#6B7280]">
            {t("dashboard.industry.stats.pilotsSupported")}
          </span>
          <div className="mt-2 text-base font-bold text-green-700 flex items-center gap-1.5">
            <CheckCircle2 className="h-5 w-5" /> {t("statusMap.CONFIRMED")}
          </div>
          <p className="text-[11px] text-green-700 font-medium mt-1">
            Authorized signatory certified by Govt.
          </p>
        </div>
      </div>

      {/* ───── NOTICE: INDUSTRY SEES APPROVED PROJECTS ONLY ───── */}
      <div className="p-3.5 rounded-xl border border-orange-200 bg-orange-50/60 text-xs text-orange-950 flex items-start gap-2.5">
        <Building2 className="h-4 w-4 text-orange-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Institutional Privacy Standard:</strong> Industry partners only view university
          projects approved by the State Innovation Cell. Raw citizen complaints and personal identity
          data are never exposed to corporate dashboards.
        </p>
      </div>

      {/* ───── SEARCH & FILTER ───── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-xl border border-[#E2E5EA]">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder={t("dashboard.common.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-[#E2E5EA] bg-[#F7F8FA] text-xs sm:text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-orange-600 focus:bg-white"
          />
        </div>
        <div className="text-xs text-[#6B7280]">
          Showing {filteredOpportunities.length} project(s)
        </div>
      </div>

      {/* ───── OPPORTUNITIES LIST & DETAIL SPLIT VIEW ───── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Projects Column */}
        <div
          className={`${
            selectedProject ? "lg:col-span-7" : "lg:col-span-12"
          } space-y-3 transition-all`}
        >
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-sm font-bold text-[#111827] uppercase tracking-wide">
              {navItems.find((n) => n.id === activeTab)?.label} ({filteredOpportunities.length})
            </h2>
            <span className="text-xs text-[#6B7280]">Vetted by State Innovation Cell</span>
          </div>

          {filteredOpportunities.length === 0 ? (
            <div className="p-8 text-center rounded-2xl border border-dashed border-[#E2E5EA] bg-white">
              <Compass className="h-8 w-8 mx-auto text-[#9CA3AF] mb-2" />
              <p className="text-sm font-semibold text-[#111827]">
                {t("dashboard.industry.noOppsTitle")}
              </p>
              <p className="text-xs text-[#6B7280] mt-1">
                {t("dashboard.industry.noOppsDesc")}
              </p>
            </div>
          ) : (
            filteredOpportunities.map((proj) => {
              const isSelected = selectedProject?.id === proj.id;
              return (
                <div
                  key={proj.id}
                  onClick={() => setSelectedProject(proj)}
                  className={`cursor-pointer p-4 sm:p-5 rounded-xl border transition-all bg-white text-left ${
                    isSelected
                      ? "border-orange-600 ring-2 ring-orange-600/20 shadow-sm"
                      : "border-[#E2E5EA] hover:border-orange-300 hover:shadow-xs"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-orange-800">
                        {proj.id}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 text-orange-700 border border-orange-200">
                        {t(`statusMap.${proj.projectStage}` as any) || proj.projectStage.replace(/_/g, " ")}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          proj.status === "CONFIRMED"
                            ? "bg-green-100 text-green-800"
                            : proj.status === "PARTNERSHIP_SUBMITTED"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {t(`statusMap.${proj.status}` as any) || proj.status.replace(/_/g, " ")}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#6B7280] font-medium">
                      {proj.domain}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm font-bold text-[#111827] mt-2">
                    {proj.problem}
                  </p>

                  <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-[#F3F4F6] text-xs text-[#6B7280]">
                    <span className="truncate font-medium text-[#111827]">
                      🏛 {proj.university}
                    </span>
                    <span className="flex items-center gap-1 text-orange-700 font-medium shrink-0">
                      {t("dashboard.industry.viewOpportunityDetails")} <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ───── DETAILED OPPORTUNITY INSPECTOR ───── */}
        {selectedProject && (
          <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E2E5EA] p-5 shadow-md space-y-5 sticky top-24">
            <div className="flex items-start justify-between pb-3 border-b border-[#E2E5EA]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-orange-800">
                    {selectedProject.id}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-orange-50 text-orange-800 font-bold">
                    {t(`statusMap.${selectedProject.projectStage}` as any) || selectedProject.projectStage.replace(/_/g, " ")}
                  </span>
                </div>
                <div className="text-xs text-[#6B7280] mt-0.5">
                  {t("dashboard.admin.organization")}: <strong>{selectedProject.university}</strong>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="p-1 rounded-md text-[#9CA3AF] hover:text-[#111827] hover:bg-[#F3F4F6]"
                aria-label="Close details"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Problem Definition */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                {t("dashboard.common.problem")}
              </label>
              <p className="text-xs sm:text-sm text-[#111827] leading-relaxed bg-[#F7F8FA] p-3 rounded-xl border border-[#E2E5EA]">
                {selectedProject.problem}
              </p>
            </div>

            {/* Support Requirements Breakdown */}
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-lg border border-[#E2E5EA] bg-[#F7F8FA]">
                <span className="font-bold text-[#6B7280] uppercase text-[10px]">
                  {t("dashboard.industry.fundingRequirement")} (CSR)
                </span>
                <p className="text-sm font-bold text-[#111827] mt-0.5">
                  {selectedProject.fundingRequirement}
                </p>
              </div>

              <div className="p-3 rounded-lg border border-[#E2E5EA] bg-[#F7F8FA]">
                <span className="font-bold text-[#6B7280] uppercase text-[10px]">
                  {t("dashboard.industry.prototypeRequirement")}
                </span>
                <p className="text-[#111827] mt-0.5 leading-relaxed">
                  {selectedProject.prototypeRequirement}
                </p>
              </div>

              <div className="p-3 rounded-lg border border-[#E2E5EA] bg-[#F7F8FA]">
                <span className="font-bold text-[#6B7280] uppercase text-[10px]">
                  {t("dashboard.industry.pilotRequirement")}
                </span>
                <p className="text-[#111827] mt-0.5 leading-relaxed">
                  {selectedProject.pilotRequirement}
                </p>
              </div>
            </div>

            {/* Quick Action Pledges */}
            <div className="space-y-2 pt-2 border-t border-[#E2E5EA]">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                {t("dashboard.common.actions")}
              </label>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleOfferSupport(selectedProject, "Funding Grant")}
                  className="px-3 py-2 rounded-lg border border-orange-200 bg-orange-50 hover:bg-orange-100 text-orange-900 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Coins className="h-3.5 w-3.5 text-orange-600" /> {t("dashboard.industry.actions.pledgeFunding")}
                </button>

                <button
                  type="button"
                  onClick={() => handleOfferSupport(selectedProject, "Industry Mentorship")}
                  className="px-3 py-2 rounded-lg border border-[#E2E5EA] bg-white hover:bg-[#F3F4F6] text-[#111827] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <GraduationCap className="h-3.5 w-3.5 text-[#0F62B4]" /> {t("dashboard.industry.tabs.mentorship")}
                </button>

                <button
                  type="button"
                  onClick={() => handleOfferSupport(selectedProject, "Manufacturing Fabrication")}
                  className="px-3 py-2 rounded-lg border border-[#E2E5EA] bg-white hover:bg-[#F3F4F6] text-[#111827] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Wrench className="h-3.5 w-3.5 text-[#4B5563]" /> {t("dashboard.industry.actions.provideEquipment")}
                </button>

                <button
                  type="button"
                  onClick={() => handleOfferSupport(selectedProject, "Field Pilot Logistics")}
                  className="px-3 py-2 rounded-lg border border-[#E2E5EA] bg-white hover:bg-[#F3F4F6] text-[#111827] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-green-700" /> {t("dashboard.industry.actions.sponsorPilot")}
                </button>
              </div>

              {selectedProject.status === "OPEN_FOR_SUPPORT" ? (
                <button
                  type="button"
                  onClick={() => handleSubmitPartnership(selectedProject)}
                  className="w-full mt-2 py-2.5 px-3 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Handshake className="h-4 w-4" /> {t("dashboard.industry.actions.offerPartnership")}
                </button>
              ) : (
                <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-center text-xs font-semibold text-[#0F62B4]">
                  ✓ Partnership Request Transmitted to State Innovation Cell
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
