"use client";

import React from "react";
import Link from "next/link";
import { UtilityBar } from "@/components/shell/utility-bar";
import { AppNavbar } from "@/components/shell/app-navbar";
import { useLanguage } from "@/lib/i18n/language-context";
import {
  FileText,
  Search,
  ArrowRight,
  Phone,
  Sparkles,
} from "lucide-react";

export default function HomePage() {
  const { language, t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-base)] text-[var(--text-primary)]">
      {/* Utility Bar (GIGW pattern) */}
      <UtilityBar />

      {/* Public Navbar */}
      <AppNavbar isPublic />

      {/* ───── HERO SECTION ───── */}
      <section
        className="w-full bg-[var(--bg-cream)]"
        aria-labelledby="hero-heading"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24">
          {/* Eyebrow */}
          <p className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-[var(--accent-primary)] mb-4">
            {t("hero.eyebrow")}
          </p>

          {/* Main Heading */}
          <h1
            id="hero-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--text-primary)] leading-tight max-w-3xl"
          >
            {language === "en" ? (
              <>
                Report a local problem.
                <br />
                Find the right next step.
              </>
            ) : (
              <>
                स्थानीय समस्या दर्ज करें।
                <br />
                सही अगला कदम पाएं।
              </>
            )}
          </h1>
          <p className="mt-2 text-lg sm:text-xl text-[var(--accent-primary)] font-medium max-w-2xl">
            {t("hero.subtitle")}
          </p>

          {/* Subtext */}
          <p className="mt-4 text-sm sm:text-base text-[var(--text-muted)] max-w-xl">
            {t("hero.description")}
          </p>
        </div>
      </section>

      {/* ───── MAIN CONTENT ───── */}
      <main id="main-content" className="flex-1">
        {/* ── Two Action Cards ── */}
        <section className="w-full -mt-2" aria-label="Quick Actions">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 max-w-2xl">
              {/* Report a Problem */}
              <div className="rounded-xl p-6 sm:p-7 flex flex-col justify-between min-h-[200px] bg-[var(--action-report)] text-white shadow-md hover:shadow-lg transition-shadow">
                <div>
                  <span className="inline-block text-[10px] font-bold uppercase tracking-widest bg-white/20 px-2.5 py-1 rounded-md mb-4">
                    {t("actions.stepOne")}
                  </span>
                  <FileText className="h-8 w-8 mb-3 opacity-90" />
                  <h2 className="text-xl font-bold leading-snug">
                    {t("actions.reportProblemTitle")}
                  </h2>
                  <p className="text-sm text-white/80 mt-1.5 leading-relaxed">
                    {t("actions.reportProblemDesc")}
                  </p>
                </div>
                <Link
                  href="/report/new"
                  className="mt-5 inline-flex w-fit items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 sm:px-5 text-sm font-semibold text-[#0F1F3D] shadow-sm transition-all duration-150 hover:bg-slate-100 hover:-translate-y-[1px] active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--action-report)] cursor-pointer min-h-[44px] group"
                >
                  <span>{t("actions.reportNow")}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>

              {/* Track My Report */}
              <div className="rounded-xl p-6 sm:p-7 flex flex-col justify-between min-h-[200px] bg-[var(--action-track)] text-white shadow-md hover:shadow-lg transition-shadow">
                <div>
                  <span className="inline-block text-[10px] font-bold uppercase tracking-widest bg-white/20 px-2.5 py-1 rounded-md mb-4">
                    {t("actions.statusBadge")}
                  </span>
                  <Search className="h-8 w-8 mb-3 opacity-90" />
                  <h2 className="text-xl font-bold leading-snug">
                    {t("actions.trackReportTitle")}
                  </h2>
                  <p className="text-sm text-white/80 mt-1.5 leading-relaxed">
                    {t("actions.trackReportDesc")}
                  </p>
                </div>
                <Link
                  href="/track"
                  className="mt-5 inline-flex w-fit items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 sm:px-5 text-sm font-semibold text-[#0F1F3D] shadow-sm transition-all duration-150 hover:bg-slate-100 hover:-translate-y-[1px] active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--action-track)] cursor-pointer min-h-[44px] group"
                >
                  <span>{t("actions.checkStatus")}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── How JharSetu Works ── */}
        <section
          className="w-full py-16 sm:py-20"
          aria-labelledby="how-it-works-heading"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2
              id="how-it-works-heading"
              className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] text-center mb-12"
            >
              {t("howItWorks.title")}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
              {/* Step 01 */}
              <div className="text-center md:text-left">
                <span className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] text-lg font-bold mb-4">
                  01
                </span>
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
                  {t("howItWorks.step1Title")}
                </h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-3">
                  {t("howItWorks.step1Desc")}
                </p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <span className="inline-block text-[10px] font-semibold uppercase tracking-wider bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] px-2.5 py-1 rounded-md">
                    {t("howItWorks.existingServiceBadge")}
                  </span>
                  <span className="inline-block text-[10px] font-semibold uppercase tracking-wider bg-[var(--state-warning)]/10 text-[var(--state-warning)] px-2.5 py-1 rounded-md">
                    {t("howItWorks.authorityActionBadge")}
                  </span>
                  <span className="inline-block text-[10px] font-semibold uppercase tracking-wider bg-[var(--accent-innovation)]/10 text-[var(--accent-innovation)] px-2.5 py-1 rounded-md">
                    {t("howItWorks.innovationChallengeBadge")}
                  </span>
                </div>
              </div>

              {/* Step 02 */}
              <div className="text-center md:text-left">
                <span className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] text-lg font-bold mb-4">
                  02
                </span>
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
                  {t("howItWorks.step2Title")}
                </h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-3">
                  {t("howItWorks.step2Desc")}
                </p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <span className="inline-block text-[10px] font-semibold uppercase tracking-wider bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] px-2.5 py-1 rounded-md">
                    {t("howItWorks.existingServiceBadge")}
                  </span>
                  <span className="inline-block text-[10px] font-semibold uppercase tracking-wider bg-[var(--state-warning)]/10 text-[var(--state-warning)] px-2.5 py-1 rounded-md">
                    {t("howItWorks.authorityActionBadge")}
                  </span>
                  <span className="inline-block text-[10px] font-semibold uppercase tracking-wider bg-[var(--accent-innovation)]/10 text-[var(--accent-innovation)] px-2.5 py-1 rounded-md">
                    {t("howItWorks.innovationChallengeBadge")}
                  </span>
                </div>
              </div>

              {/* Step 03 */}
              <div className="text-center md:text-left">
                <span className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] text-lg font-bold mb-4">
                  03
                </span>
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
                  {t("howItWorks.step3Title")}
                </h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-3">
                  {t("howItWorks.step3Desc")}
                </p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <span className="inline-block text-[10px] font-semibold uppercase tracking-wider bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] px-2.5 py-1 rounded-md">
                    {t("howItWorks.existingServiceBadge")}
                  </span>
                  <span className="inline-block text-[10px] font-semibold uppercase tracking-wider bg-[var(--state-warning)]/10 text-[var(--state-warning)] px-2.5 py-1 rounded-md">
                    {t("howItWorks.authorityActionBadge")}
                  </span>
                  <span className="inline-block text-[10px] font-semibold uppercase tracking-wider bg-[var(--accent-innovation)]/10 text-[var(--accent-innovation)] px-2.5 py-1 rounded-md">
                    {t("howItWorks.innovationChallengeBadge")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Innovation Callout ── */}
        <section className="w-full py-14 sm:py-16 bg-[var(--accent-innovation)]/5 border-y border-[var(--border-default)]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <Sparkles className="h-8 w-8 text-[var(--accent-innovation)] mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-3">
              {t("innovation.calloutTitle")}
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-muted)] max-w-xl mx-auto mb-6 leading-relaxed">
              {t("innovation.calloutDesc")}
            </p>
            <Link
              href="/challenges"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent-innovation)] hover:underline underline-offset-4 group"
            >
              {t("innovation.viewChallengesBtn")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </section>

        {/* ── Stats Row ── */}
        <section
          className="w-full py-14 sm:py-16"
          aria-label="Platform Statistics"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center">
              <div className="p-6 rounded-xl border border-[var(--border-default)] bg-white">
                <p className="text-3xl sm:text-4xl font-bold text-[var(--accent-primary)]">
                  1,247
                </p>
                <p className="text-sm text-[var(--text-muted)] mt-1.5 font-medium">
                  {t("stats.complaintsReceived")}
                </p>
                <p className="text-[10px] text-[var(--text-muted)] mt-1 italic">
                  {t("stats.demoDataNote")}
                </p>
              </div>
              <div className="p-6 rounded-xl border border-[var(--border-default)] bg-white">
                <p className="text-3xl sm:text-4xl font-bold text-[var(--state-success)]">
                  934
                </p>
                <p className="text-sm text-[var(--text-muted)] mt-1.5 font-medium">
                  {t("stats.resolvedGracefully")}
                </p>
                <p className="text-[10px] text-[var(--text-muted)] mt-1 italic">
                  {t("stats.demoDataNote")}
                </p>
              </div>
              <div className="p-6 rounded-xl border border-[var(--border-default)] bg-white">
                <p className="text-3xl sm:text-4xl font-bold text-[var(--state-warning)]">
                  {t("stats.avgTimeValue")}
                </p>
                <p className="text-sm text-[var(--text-muted)] mt-1.5 font-medium">
                  {t("stats.avgResolutionTime")}
                </p>
                <p className="text-[10px] text-[var(--text-muted)] mt-1 italic">
                  {t("stats.demoDataNote")}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ───── FOOTER ───── */}
      <footer className="w-full bg-[var(--brand-navy)] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Platform Identity */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold">
                JharSetu <span className="font-normal text-white/70">| झारसेतु</span>
              </h3>
              <p className="text-xs font-medium text-white/80 uppercase tracking-wider">
                {t("footer.portalName")}
              </p>
              <p className="text-sm text-white/70 leading-relaxed">
                {t("footer.tagline")}
              </p>
            </div>

            {/* Helplines */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white/80">
                {t("common.support")}
              </h4>
              <div className="space-y-2 text-sm text-white/70">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-white/50 shrink-0" />
                  <span>
                    <strong className="text-white">181</strong> — {t("common.publicGrievance")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-white/50 shrink-0" />
                  <span>
                    <strong className="text-white">1912</strong> — {t("common.electricityComplaint")}
                  </span>
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white/80">
                {t("footer.quickLinks")}
              </h4>
              <div className="flex flex-col gap-1.5 text-sm text-white/70">
                <Link
                  href="/report/new"
                  className="hover:text-white transition-colors"
                >
                  {t("nav.reportProblem")}
                </Link>
                <Link
                  href="/track"
                  className="hover:text-white transition-colors"
                >
                  {t("nav.trackReport")}
                </Link>
                <Link
                  href="/sign-in"
                  className="hover:text-white transition-colors"
                >
                  {t("nav.officerSignIn")}
                </Link>
              </div>
            </div>
          </div>

          {/* Prototype Disclaimer & Attribution */}
          <div className="mt-8 pt-6 border-t border-white/20 text-center text-xs text-white/60 space-y-1">
            <p className="font-medium text-amber-300/90">
              {t("footer.disclaimer")}
            </p>
            <p className="text-white/40 text-[11px]">
              {t("footer.sihBadge")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
