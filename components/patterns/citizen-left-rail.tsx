"use client";

import React from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  MessageCircle,
  Phone,
} from "lucide-react";
import { Logo } from "@/components/branding/logo";

import { useLanguage } from "@/lib/i18n/language-context";

export type ActivePage = "report" | "track" | "help";

export interface CitizenLeftRailProps {
  activePage?: ActivePage;
  lang?: "en" | "hi";
  className?: string;
}

/**
 * Shared left rail for citizen-facing two-column pages.
 * Used by Report Wizard and Track Report to maintain consistent navigation.
 */
export function CitizenLeftRail({
  activePage,
  className = "",
}: CitizenLeftRailProps) {
  const { t } = useLanguage();

  const navItems: {
    id: ActivePage;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    activeColor: string;
    iconColor: string;
  }[] = [
    {
      id: "report",
      href: "/report/new",
      icon: FileText,
      label: t("nav.reportProblem"),
      activeColor: "bg-[var(--action-report,#C1440E)] text-white font-semibold shadow-sm",
      iconColor: "text-[var(--action-report,#C1440E)]",
    },
    {
      id: "track",
      href: "/track",
      icon: Search,
      label: t("nav.trackReport"),
      activeColor: "bg-[var(--action-track,#0F1F3D)] text-white font-semibold shadow-sm",
      iconColor: "text-[var(--action-track,#0F1F3D)]",
    },
    {
      id: "help",
      href: "#",
      icon: MessageCircle,
      label: t("reportWizard.getHelp"),
      activeColor: "bg-[var(--action-help,#1F5C3F)] text-white font-semibold shadow-sm",
      iconColor: "text-[var(--action-help,#1F5C3F)]",
    },
  ];

  return (
    <aside className={`w-full lg:w-72 xl:w-80 shrink-0 space-y-6 ${className}`}>
      {/* Nav action buttons */}
      <nav className="space-y-2" aria-label="Quick actions">
        {navItems.map((item) => {
          const isActive = activePage === item.id;
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${
                isActive
                  ? item.activeColor
                  : "border border-[var(--border-default,#E2E5EA)] bg-white text-[var(--text-primary,#111827)] font-medium hover:bg-[var(--bg-base,#F7F8FA)]"
              }`}
            >
              <Icon
                className={`h-5 w-5 shrink-0 ${isActive ? "" : item.iconColor}`}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Reassurance note */}
      <div className="rounded-xl border border-[var(--state-success,#16A34A)]/30 bg-[var(--state-success,#16A34A)]/5 p-4 text-xs text-[var(--text-muted,#6B7280)] leading-relaxed">
        <p className="font-semibold text-[var(--state-success,#16A34A)] mb-1">
          🔒 {t("reportWizard.privacyReassurance")}
        </p>
        <p>
          {t("reportWizard.anonymousSafe")}
        </p>
      </div>

      {/* Platform identity card with official JharSetu logo */}
      <div className="rounded-xl border border-[var(--border-default,#E2E5EA)] bg-white p-4 space-y-3">
        <Logo variant="full" size="sm" />
        <p className="text-xs text-[var(--text-muted,#6B7280)] leading-relaxed">
          {t("footer.tagline")}
        </p>
      </div>

      {/* Helplines */}
      <div className="rounded-xl border border-[var(--border-default,#E2E5EA)] bg-white p-4 space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted,#6B7280)]">
          {t("common.support")}
        </h4>
        <div className="space-y-1.5 text-xs text-[var(--text-muted,#6B7280)]">
          <div className="flex items-center gap-2">
            <Phone className="h-3.5 w-3.5 shrink-0" />
            <span>
              <strong className="text-[var(--text-primary,#111827)]">181</strong> —{" "}
              {t("common.publicGrievance")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-3.5 w-3.5 shrink-0" />
            <span>
              <strong className="text-[var(--text-primary,#111827)]">1912</strong> —{" "}
              {t("common.electricityComplaint")}
            </span>
          </div>
        </div>
      </div>

      {/* Footer attribution */}
      <p className="text-[10px] text-[var(--text-muted,#6B7280)] text-center lg:text-left">
        {t("footer.sihBadge")}
      </p>
    </aside>
  );
}

export default CitizenLeftRail;
