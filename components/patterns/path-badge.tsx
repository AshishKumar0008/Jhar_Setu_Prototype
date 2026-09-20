"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/i18n/language-context";

export type PathType = "A" | "B" | "C";

export interface PathBadgeProps {
  path: PathType;
  showLabel?: boolean;
  customLabel?: string;
  className?: string;
}

export const PATH_CONFIG: Record<
  PathType,
  {
    code: string;
    title: string;
    hindiTitle: string;
    fullText: string;
    description: string;
    className: string;
    borderClass: string;
  }
> = {
  A: {
    code: "Path A",
    title: "Known Service",
    hindiTitle: "ज्ञात सेवा",
    fullText: "Path A · Known Service",
    description: "Referral to existing public scheme or service",
    className: "bg-[#0F62B4]/10 text-[#0F62B4] border-[#0F62B4]/30",
    borderClass: "border-l-4 border-l-[#0F62B4]",
  },
  B: {
    code: "Path B",
    title: "Grievance Routing",
    hindiTitle: "विभाग प्रेषण",
    fullText: "Path B · Grievance Routing",
    description: "Accountable routing to responsible authority/department",
    className: "bg-[#D97706]/10 text-[#D97706] border-[#D97706]/30",
    borderClass: "border-l-4 border-l-[#D97706]",
  },
  C: {
    code: "Path C",
    title: "Innovation Gap",
    hindiTitle: "नवाचार अंतराल",
    fullText: "Path C · Innovation Gap",
    description: "Verified Innovation Gap Certificate for university-industry pilot",
    className: "bg-[#7C3AED]/10 text-[#7C3AED] border-[#7C3AED]/30",
    borderClass: "border-l-4 border-l-[#7C3AED]",
  },
};

export function PathBadge({
  path,
  showLabel = true,
  customLabel,
  className = "",
}: PathBadgeProps) {
  const { language, t } = useLanguage();
  const config = PATH_CONFIG[path];

  const translatedTitle =
    customLabel ||
    (path === "A" ? t("paths.pathAShort") : path === "B" ? t("paths.pathBShort") : t("paths.pathCShort")) ||
    (language === "hi" ? config.hindiTitle : config.title);

  return (
    <Badge
      variant="outline"
      className={`inline-flex items-center gap-1.5 font-semibold text-xs px-2.5 py-0.5 rounded-md ${config.className} ${className}`}
      title={`${config.code}: ${config.title} — ${config.description}`}
    >
      <span className="font-bold">{config.code}</span>
      {showLabel && (
        <>
          <span className="opacity-60">·</span>
          <span className="font-normal">{translatedTitle}</span>
        </>
      )}
    </Badge>
  );
}

export { PATH_CONFIG as pathConfig };
