"use client";

import React from "react";
import { useLanguage } from "@/lib/i18n/language-context";
import { Globe } from "lucide-react";

export interface LanguageSwitcherProps {
  /**
   * Visual variant:
   * - "navbar": Badge pill style with white active background and blue text (default for AppNavbar)
   * - "utility": Dark theme style for navy UtilityBar
   * - "compact": Small button pair for mobile/drawers
   * - "dashboard": Clean slate style for dashboard headers
   */
  variant?: "navbar" | "utility" | "compact" | "dashboard";
  showIcon?: boolean;
  className?: string;
}

export function LanguageSwitcher({
  variant = "navbar",
  showIcon = false,
  className = "",
}: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();

  if (variant === "utility") {
    return (
      <div
        className={`flex items-center gap-0.5 ${className}`}
        role="group"
        aria-label="Select language / भाषा चुनें"
      >
        {showIcon && <Globe className="h-3.5 w-3.5 text-white/70 mr-1" />}
        <button
          type="button"
          onClick={() => setLanguage("en")}
          className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
            language === "en"
              ? "bg-white/25 text-white font-semibold shadow-xs"
              : "text-white/65 hover:text-white/95"
          }`}
          aria-pressed={language === "en"}
        >
          English
        </button>
        <button
          type="button"
          onClick={() => setLanguage("hi")}
          className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
            language === "hi"
              ? "bg-white/25 text-white font-semibold shadow-xs"
              : "text-white/65 hover:text-white/95"
          }`}
          aria-pressed={language === "hi"}
        >
          हिंदी
        </button>
      </div>
    );
  }

  if (variant === "dashboard") {
    return (
      <div
        className={`flex items-center rounded-lg border border-[#E2E5EA] bg-[#F7F8FA] p-0.5 text-xs ${className}`}
        role="group"
        aria-label="Select language / भाषा चुनें"
      >
        {showIcon && <Globe className="h-3.5 w-3.5 text-[#6B7280] ml-1.5 mr-0.5" />}
        <button
          type="button"
          onClick={() => setLanguage("en")}
          className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F62B4] ${
            language === "en"
              ? "bg-white text-[#0F62B4] font-bold shadow-xs"
              : "text-[#6B7280] hover:text-[#111827]"
          }`}
          aria-pressed={language === "en"}
        >
          English
        </button>
        <button
          type="button"
          onClick={() => setLanguage("hi")}
          className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F62B4] ${
            language === "hi"
              ? "bg-white text-[#0F62B4] font-bold shadow-xs"
              : "text-[#6B7280] hover:text-[#111827]"
          }`}
          aria-pressed={language === "hi"}
        >
          हिंदी
        </button>
      </div>
    );
  }

  // Default "navbar" style
  return (
    <div
      className={`flex items-center rounded-md border border-[#E2E5EA] bg-[#F7F8FA] p-0.5 text-xs ${className}`}
      role="group"
      aria-label="Select language / भाषा चुनें"
    >
      {showIcon && <Globe className="h-3.5 w-3.5 text-[#6B7280] ml-1.5 mr-0.5" />}
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`min-h-[28px] sm:min-h-[30px] px-2 sm:px-2.5 py-0.5 rounded text-[11px] sm:text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F62B4] ${
          language === "en"
            ? "bg-white text-[#0F62B4] shadow-xs font-bold"
            : "text-[#6B7280] hover:text-[#111827]"
        }`}
        aria-pressed={language === "en"}
      >
        English
      </button>
      <button
        type="button"
        onClick={() => setLanguage("hi")}
        className={`min-h-[28px] sm:min-h-[30px] px-2 sm:px-2.5 py-0.5 rounded text-[11px] sm:text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F62B4] ${
          language === "hi"
            ? "bg-white text-[#0F62B4] shadow-xs font-bold"
            : "text-[#6B7280] hover:text-[#111827]"
        }`}
        aria-pressed={language === "hi"}
      >
        हिंदी
      </button>
    </div>
  );
}

export default LanguageSwitcher;
