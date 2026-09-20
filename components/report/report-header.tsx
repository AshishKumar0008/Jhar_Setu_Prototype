"use client";

import React from "react";
import { useLanguage } from "@/lib/i18n/language-context";

export function ReportHeader() {
  const { t } = useLanguage();

  return (
    <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
      <p className="text-xs font-bold uppercase tracking-widest text-[var(--action-report,#C1440E)]">
        {t("reportWizard.eyebrow")}
      </p>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary,#111827)] tracking-tight">
        {t("reportWizard.title")}
      </h1>
      <p className="text-sm sm:text-base text-[var(--text-muted,#6B7280)] leading-relaxed">
        {t("reportWizard.subtitle")}
      </p>
    </div>
  );
}

export default ReportHeader;
