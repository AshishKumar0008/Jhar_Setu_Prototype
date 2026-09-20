"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { UtilityBar } from "@/components/shell/utility-bar";
import { AppNavbar } from "@/components/shell/app-navbar";
import { PathBadge } from "@/components/patterns/path-badge";
import { useLanguage } from "@/lib/i18n/language-context";
import { ArrowLeft, Construction } from "lucide-react";

export default function ChallengeDetailPage() {
  const { t } = useLanguage();
  const params = useParams();
  const challengeId = params.id as string;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-base)] text-[var(--text-primary)]">
      {/* Utility Bar + Navbar */}
      <UtilityBar />
      <AppNavbar isPublic />

      <main
        id="main-content"
        className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
      >
        {/* Back link */}
        <Link
          href="/challenges"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent-innovation)] hover:underline underline-offset-4 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("challengesPage.backToChallenges")}
        </Link>

        {/* Coming Soon */}
        <div className="rounded-xl border border-[var(--border-default)] bg-white p-10 sm:p-14 text-center space-y-4">
          <Construction className="h-10 w-10 text-[var(--accent-innovation)] mx-auto" />
          <div className="flex items-center justify-center gap-2">
            <PathBadge path="C" />
            <span className="text-sm font-mono text-[var(--text-muted)]">
              {challengeId}
            </span>
          </div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">
            {t("challengesPage.passportDetailTitle")}
          </h1>
          <p className="text-sm text-[var(--text-muted)] max-w-md mx-auto leading-relaxed">
            {t("challengesPage.passportDetailConstruction")}
          </p>
        </div>
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
