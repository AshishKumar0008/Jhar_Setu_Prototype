"use client";

import React from "react";
import { useLanguage } from "@/lib/i18n/language-context";
import { LanguageSwitcher } from "@/components/language-switcher";

export interface UtilityBarProps {
  currentLang?: "en" | "hi";
  onLanguageChange?: (lang: "en" | "hi") => void;
  className?: string;
}

/**
 * GIGW-standard thin utility bar above the main navbar.
 * Dark navy background, platform identity left, skip-link + language toggle right.
 */
export function UtilityBar({
  className = "",
}: UtilityBarProps) {
  const { t } = useLanguage();

  return (
    <div
      className={`w-full bg-[var(--brand-navy)] text-white text-xs ${className}`}
      role="banner"
    >
      <div className="mx-auto flex h-8 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Platform Identity */}
        <span className="font-medium tracking-wide text-[11px] sm:text-xs text-white/90 truncate mr-2">
          {t("common.brandName")}{" "}
          <span className="text-white/60 mx-1">|</span>{" "}
          <span className="font-normal text-white/80">{t("common.brandSubtitle")}</span>
        </span>

        {/* Right: Skip link + Language switcher */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Skip to Main Content — keyboard-focusable, visually hidden until focused */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-4 focus:z-[100] focus:bg-white focus:text-[var(--brand-navy)] focus:px-3 focus:py-1.5 focus:rounded-md focus:text-xs focus:font-semibold focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
          >
            {t("common.skipToMain")}
          </a>

          {/* Reusable Language Switcher */}
          <LanguageSwitcher variant="utility" />
        </div>
      </div>
    </div>
  );
}

export default UtilityBar;
