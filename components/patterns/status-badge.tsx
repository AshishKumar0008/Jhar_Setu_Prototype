"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/i18n/language-context";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  XCircle,
  FileCheck,
  ArrowRightCircle,
  Activity,
  Award,
} from "lucide-react";

/**
 * Unified Status Codes across the JharSetu System Blueprint.
 * One fixed color per state, defined once in this token map, reused everywhere.
 */
export type StatusCode =
  | "PILOT_PENDING"
  | "RESOLVED"
  | "CONFIRMED"
  | "NEEDS_INFORMATION"
  | "SUBMITTED"
  | "AI_PROCESSED"
  | "NEEDS_HUMAN_REVIEW"
  | "PATH_A_REFERRED"
  | "PATH_B_ROUTED"
  | "PATH_C_PROPOSED"
  | "CERTIFICATE_ISSUED"
  | "PASSPORT_PUBLISHED"
  | "PILOT_READY"
  | "PILOT_ACTIVE"
  | "ADOPTED"
  | "REJECTED"
  | "CLOSED";

export interface StatusConfig {
  label: string;
  hindiLabel: string;
  className: string;
  icon: React.ComponentType<{ className?: string }>;
  tokenCategory: "primary" | "innovation" | "success" | "warning" | "error" | "muted";
}

export const STATUS_CONFIG_MAP: Record<StatusCode, StatusConfig> = {
  SUBMITTED: {
    label: "SUBMITTED",
    hindiLabel: "दर्ज किया गया",
    className: "border-[#E2E5EA] bg-[#F7F8FA] text-[#6B7280]",
    icon: Clock,
    tokenCategory: "muted",
  },
  AI_PROCESSED: {
    label: "AI PROCESSED",
    hindiLabel: "एआई संसाधित",
    className: "border-[#D97706]/30 bg-[#D97706]/10 text-[#D97706]",
    icon: Sparkles,
    tokenCategory: "warning",
  },
  NEEDS_HUMAN_REVIEW: {
    label: "NEEDS HUMAN REVIEW",
    hindiLabel: "मानवीय समीक्षा आवश्यक",
    className: "border-[#D97706]/40 bg-[#D97706]/10 text-[#D97706]",
    icon: AlertTriangle,
    tokenCategory: "warning",
  },
  NEEDS_INFORMATION: {
    label: "NEEDS INFORMATION",
    hindiLabel: "अतिरिक्त जानकारी अपेक्षित",
    className: "border-[#D97706]/40 bg-[#D97706]/10 text-[#D97706]",
    icon: AlertCircle,
    tokenCategory: "warning",
  },
  PATH_A_REFERRED: {
    label: "PATH A · REFERRED",
    hindiLabel: "पथ A · योजना प्रेषित",
    className: "border-[#0F62B4]/30 bg-[#0F62B4]/10 text-[#0F62B4]",
    icon: ArrowRightCircle,
    tokenCategory: "primary",
  },
  PATH_B_ROUTED: {
    label: "PATH B · ROUTED",
    hindiLabel: "पथ B · विभाग प्रेषित",
    className: "border-[#D97706]/30 bg-[#D97706]/10 text-[#D97706]",
    icon: ArrowRightCircle,
    tokenCategory: "warning",
  },
  PATH_C_PROPOSED: {
    label: "PATH C · PROPOSED",
    hindiLabel: "पथ C · नवाचार प्रस्तावित",
    className: "border-[#7C3AED]/30 bg-[#7C3AED]/10 text-[#7C3AED]",
    icon: Sparkles,
    tokenCategory: "innovation",
  },
  CERTIFICATE_ISSUED: {
    label: "CERTIFICATE ISSUED",
    hindiLabel: "प्रमाण पत्र निर्गत",
    className: "border-[#7C3AED]/30 bg-[#7C3AED]/10 text-[#7C3AED]",
    icon: Award,
    tokenCategory: "innovation",
  },
  PASSPORT_PUBLISHED: {
    label: "PASSPORT PUBLISHED",
    hindiLabel: "पासपोर्ट प्रकाशित",
    className: "border-[#7C3AED]/30 bg-[#7C3AED]/10 text-[#7C3AED]",
    icon: FileCheck,
    tokenCategory: "innovation",
  },
  PILOT_PENDING: {
    label: "PILOT PENDING",
    hindiLabel: "पायलट प्रतीक्षारत",
    className: "border-[#D97706]/40 bg-[#D97706]/10 text-[#D97706]",
    icon: Clock,
    tokenCategory: "warning",
  },
  PILOT_READY: {
    label: "PILOT READY",
    hindiLabel: "पायलट तत्पर",
    className: "border-[#16A34A]/40 bg-[#16A34A]/10 text-[#16A34A]",
    icon: ShieldCheck,
    tokenCategory: "success",
  },
  PILOT_ACTIVE: {
    label: "PILOT ACTIVE",
    hindiLabel: "पायलट सक्रिय",
    className: "border-[#0F62B4]/30 bg-[#0F62B4]/10 text-[#0F62B4]",
    icon: Activity,
    tokenCategory: "primary",
  },
  CONFIRMED: {
    label: "CONFIRMED",
    hindiLabel: "पुष्टि की गई",
    className: "border-[#16A34A]/40 bg-[#16A34A]/10 text-[#16A34A]",
    icon: CheckCircle2,
    tokenCategory: "success",
  },
  RESOLVED: {
    label: "RESOLVED",
    hindiLabel: "समाधानित",
    className: "border-[#16A34A]/40 bg-[#16A34A]/10 text-[#16A34A]",
    icon: CheckCircle2,
    tokenCategory: "success",
  },
  ADOPTED: {
    label: "ADOPTED",
    hindiLabel: "अंगीकृत",
    className: "border-[#16A34A]/40 bg-[#16A34A]/10 text-[#16A34A]",
    icon: CheckCircle2,
    tokenCategory: "success",
  },
  REJECTED: {
    label: "REJECTED",
    hindiLabel: "अस्वीकृत",
    className: "border-[#DC2626]/30 bg-[#DC2626]/10 text-[#DC2626]",
    icon: XCircle,
    tokenCategory: "error",
  },
  CLOSED: {
    label: "CLOSED",
    hindiLabel: "समाप्त",
    className: "border-[#E2E5EA] bg-[#F7F8FA] text-[#6B7280]",
    icon: CheckCircle2,
    tokenCategory: "muted",
  },
};

export interface StatusBadgeProps {
  status: StatusCode;
  label?: string;
  showIcon?: boolean;
  className?: string;
}

/**
 * Standard Status Badge pulling exclusively from the unified status token map.
 */
export function StatusBadge({
  status,
  label,
  showIcon = true,
  className = "",
}: StatusBadgeProps) {
  const { language, t } = useLanguage();
  const config = STATUS_CONFIG_MAP[status] || STATUS_CONFIG_MAP.SUBMITTED;
  const Icon = config.icon;

  const displayLabel =
    label ||
    t(`statusMap.${status}`) ||
    (language === "hi" ? config.hindiLabel : config.label);

  return (
    <Badge
      variant="outline"
      className={`inline-flex items-center gap-1.5 font-semibold text-xs px-2.5 py-0.5 rounded-md ${config.className} ${className}`}
    >
      {showIcon && <Icon className="h-3 w-3 shrink-0" />}
      <span>{displayLabel}</span>
    </Badge>
  );
}

/**
 * Trust Badges: Prototype pilot / Verified institution.
 * Uses neutral/success tint, only rendered where actually true.
 */
export type TrustBadgeType = "jharkhand-pilot" | "verified-institution" | "official-handoff";

export interface TrustBadgeProps {
  type: TrustBadgeType;
  label?: string;
  className?: string;
}

export function TrustBadge({ type, label, className = "" }: TrustBadgeProps) {
  switch (type) {
    case "jharkhand-pilot":
      return (
        <Badge
          variant="outline"
          className={`inline-flex items-center gap-1.5 border-[#0F62B4]/30 bg-[#0F62B4]/5 text-[#0F62B4] font-medium text-xs px-2.5 py-0.5 rounded-md ${className}`}
        >
          <ShieldCheck className="h-3.5 w-3.5 text-[#0F62B4]" />
          <span>{label || "Prototype Pilot"}</span>
        </Badge>
      );
    case "verified-institution":
      return (
        <Badge
          variant="outline"
          className={`inline-flex items-center gap-1.5 border-[#16A34A]/30 bg-[#16A34A]/5 text-[#16A34A] font-medium text-xs px-2.5 py-0.5 rounded-md ${className}`}
        >
          <CheckCircle2 className="h-3.5 w-3.5 text-[#16A34A]" />
          <span>{label || "Verified institution"}</span>
        </Badge>
      );
    case "official-handoff":
      return (
        <Badge
          variant="outline"
          className={`inline-flex items-center gap-1.5 border-[#E2E5EA] bg-[#F7F8FA] text-[#111827] font-medium text-xs px-2.5 py-0.5 rounded-md ${className}`}
        >
          <ShieldCheck className="h-3.5 w-3.5 text-[#6B7280]" />
          <span>{label || "Official hand-off"}</span>
        </Badge>
      );
    default:
      return null;
  }
}

export interface AISuggestionBadgeProps {
  label?: string;
  confidence?: number;
  className?: string;
}

/**
 * AI-Suggestion Badge: Visually distinct from Verified/Trust badge.
 * Always renders with warning/neutral tint, never success.
 * Prominently signals: "AI suggestion (Requires human verification)".
 */
export function AISuggestionBadge({
  label = "AI suggestion (Requires human verification)",
  confidence,
  className = "",
}: AISuggestionBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={`inline-flex items-center gap-1.5 border-[#D97706]/40 bg-[#FFFBEB] text-[#92400E] font-medium text-xs px-2.5 py-0.5 rounded-md shadow-2xs ${className}`}
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D97706] opacity-60"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D97706]"></span>
      </span>
      <span>{label}</span>
      {confidence !== undefined && (
        <span className="font-mono text-[10px] bg-[#D97706]/20 px-1 py-0.2 rounded text-[#92400E]">
          {Math.round(confidence * 100)}% conf
        </span>
      )}
    </Badge>
  );
}
