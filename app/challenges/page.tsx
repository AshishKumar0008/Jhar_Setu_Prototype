"use client";

import React, { useState } from "react";
import Link from "next/link";
import { UtilityBar } from "@/components/shell/utility-bar";
import { AppNavbar } from "@/components/shell/app-navbar";
import { PathBadge } from "@/components/patterns/path-badge";
import {
  StatusBadge,
  type StatusCode,
} from "@/components/patterns/status-badge";
import { TrustBadge } from "@/components/patterns/status-badge";
import { useLanguage } from "@/lib/i18n/language-context";
import { ArrowRight, Filter } from "lucide-react";

/** Public-safe challenge card data — no PII, no exact coordinates, no internal notes */
interface PublicChallenge {
  id: string;
  title: string;
  problemStatement: string;
  district: string;
  block: string;
  category: string;
  status: StatusCode;
  isGovernmentOwned: boolean;
}

const DEMO_CHALLENGES: PublicChallenge[] = [
  {
    id: "IGC-JH-2026-001",
    title: "Low-Cost Continuous Water-Quality Monitoring",
    problemStatement:
      "Multiple panchayats in this district report recurring elevated arsenic levels in tubewell water, exceeding WHO and BIS safety standards. Existing government filtration infrastructure is either absent or non-functional in affected blocks.",
    district: "Sahibganj",
    block: "Udhwa",
    category: "Water",
    status: "PILOT_ACTIVE",
    isGovernmentOwned: true,
  },
  {
    id: "IGC-JH-2026-002",
    title: "Solar-Powered Last-Mile Cold Chain for Immunisation",
    problemStatement:
      "Remote health sub-centres in this district lack reliable cold-chain coverage. Vaccine wastage rates exceed 15% in summer months due to power outages, affecting routine immunisation for children under 5.",
    district: "Dumka",
    block: "Masalia",
    category: "Health",
    status: "PASSPORT_PUBLISHED",
    isGovernmentOwned: true,
  },
  {
    id: "IGC-JH-2026-003",
    title: "AI-Assisted Crop Disease Early Warning System",
    problemStatement:
      "Smallholder farmers in this district face recurring crop losses from late blight and stem borers. Current advisory reach is limited to block-level offices, with no real-time field-level detection or alert mechanism.",
    district: "Palamu",
    block: "Daltonganj",
    category: "Agriculture",
    status: "PILOT_PENDING",
    isGovernmentOwned: false,
  },
  {
    id: "IGC-JH-2026-004",
    title: "Low-Cost Solar Electrocoagulation Arsenic Remediation",
    problemStatement:
      "Cluster of villages in this district confirmed high arsenic concentration in groundwater. No active departmental pipeline sanction covers the affected area, and the existing bore-well replacement programme has a multi-year backlog.",
    district: "Sahibganj",
    block: "Udhwa",
    category: "Water",
    status: "ADOPTED",
    isGovernmentOwned: true,
  },
];

const DISTRICTS = ["All Districts", "Sahibganj", "Dumka", "Palamu", "Ranchi"];
const CATEGORIES = [
  "All Categories",
  "Water",
  "Roads",
  "Health",
  "Agriculture",
  "Education",
  "Environment",
];

export default function PublicChallengesPage() {
  const { language, t } = useLanguage();
  const [districtFilter, setDistrictFilter] = useState("All Districts");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");

  const filteredChallenges = DEMO_CHALLENGES.filter((c) => {
    if (districtFilter !== "All Districts" && c.district !== districtFilter)
      return false;
    if (categoryFilter !== "All Categories" && c.category !== categoryFilter)
      return false;
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-base)] text-[var(--text-primary)]">
      {/* Utility Bar + Navbar */}
      <UtilityBar />
      <AppNavbar isPublic />

      {/* ───── Main Content ───── */}
      <main
        id="main-content"
        className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8"
      >
        {/* Eyebrow + Heading */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent-innovation)] mb-2">
            {t("challengesPage.eyebrow")}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] leading-tight">
            {t("challengesPage.title")}
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-2 max-w-2xl leading-relaxed">
            {t("challengesPage.description")}
          </p>
        </div>

        {/* Filter Row */}
        <div className="flex flex-wrap items-center gap-3">
          <Filter className="h-4 w-4 text-[var(--text-muted)] shrink-0" />
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="rounded-xl border border-[var(--border-default)] bg-white px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent"
            aria-label="Filter by district"
          >
            {DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d === "All Districts" ? t("challengesPage.filterAllDistricts") : d}
              </option>
            ))}
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-[var(--border-default)] bg-white px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent"
            aria-label="Filter by category"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c === "All Categories"
                  ? t("challengesPage.filterAllCategories")
                  : language === "hi" && t(`categoryMap.${c}`)
                  ? t(`categoryMap.${c}`)
                  : c}
              </option>
            ))}
          </select>
        </div>

        {/* ── Challenge Passport Cards Grid ── */}
        {filteredChallenges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredChallenges.map((challenge) => (
              <article
                key={challenge.id}
                className="rounded-xl border border-[var(--border-default)] bg-white p-5 sm:p-6 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div className="space-y-3">
                  {/* Badges row */}
                  <div className="flex flex-wrap items-center gap-2">
                    <PathBadge path="C" />
                    {challenge.isGovernmentOwned && (
                      <TrustBadge type="jharkhand-pilot" />
                    )}
                    <StatusBadge status={challenge.status} />
                  </div>

                  {/* Title */}
                  <h2 className="text-base font-bold text-[var(--text-primary)] leading-snug">
                    {challenge.title}
                  </h2>

                  {/* Redacted problem statement */}
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed line-clamp-3">
                    {challenge.problemStatement}
                  </p>

                  {/* Coarsened location (district/block only — never exact village or coordinates) */}
                  <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                    <span className="font-semibold text-[var(--text-primary)]">
                      {challenge.district}
                    </span>
                    <span className="text-[var(--border-default)]">•</span>
                    <span>{challenge.block} Block</span>
                    <span className="text-[var(--border-default)]">•</span>
                    <span>
                      {language === "hi" && t(`categoryMap.${challenge.category}`)
                        ? t(`categoryMap.${challenge.category}`)
                        : challenge.category}
                    </span>
                  </div>
                </div>

                {/* Footer link */}
                <Link
                  href={`/challenges/${challenge.id}`}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent-innovation)] hover:underline underline-offset-4 group"
                >
                  {t("challengesPage.viewFullPassport")}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </article>
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="rounded-xl border border-[var(--border-default)] bg-white p-10 text-center">
            <p className="text-sm font-semibold text-[var(--text-primary)] mb-1">
              {t("challengesPage.noChallenges")}
            </p>
            <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto leading-relaxed">
              {t("challengesPage.noChallengesSub")}
            </p>
          </div>
        )}
      </main>

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
