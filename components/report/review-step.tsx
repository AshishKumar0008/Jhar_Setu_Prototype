"use client";

import React from "react";
import {
  CheckCircle2,
  Phone,
  Sparkles,
  Check,
  ShieldCheck,
  MapPin,
  FileText,
  Camera,
} from "lucide-react";
import { PathBadge } from "@/components/patterns/path-badge";
import { AIAnalysisResult } from "@/app/api/analyze-report/route";
import { useLanguage } from "@/lib/i18n/language-context";

export interface ReviewStepProps {
  description: string;
  locationMethod: "gps" | "map" | "village" | null;
  selectedCoords: { lat: number; lng: number } | null;
  photoDataUrl: string | null;
  photoFileName: string;
  mobileNumber: string;
  onChangeMobileNumber: (val: string) => void;
  aiDetection: AIAnalysisResult | null;
  aiAnalysisSource: string;
}

export function ReviewStep({
  description,
  locationMethod,
  selectedCoords,
  photoDataUrl,
  photoFileName,
  mobileNumber,
  onChangeMobileNumber,
  aiDetection,
  aiAnalysisSource,
}: ReviewStepProps) {
  const { t, language } = useLanguage();

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-[var(--accent-primary)]" />
          <span>{t("reportWizard.checkBeforeSubmit")}</span>
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-muted)]">
          Verify your statement, check automated triage suggestions, and provide optional SMS contact details.
        </p>
      </div>

      {/* Mobile Contact Input */}
      <div className="p-5 sm:p-6 rounded-2xl border-2 border-[var(--border-default)] bg-[var(--bg-base)]/40 space-y-3">
        <label
          htmlFor="mobile-input"
          className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2"
        >
          <Phone className="h-4 w-4 text-[var(--accent-primary)]" />
          <span>{t("reportWizard.mobileLabel")}</span>
        </label>
        <div className="flex items-center gap-3 max-w-md">
          <span className="flex items-center px-4 py-3 rounded-xl border-2 border-[var(--border-default)] bg-white text-sm text-[var(--text-muted)] font-semibold shrink-0">
            +91
          </span>
          <input
            id="mobile-input"
            type="tel"
            value={mobileNumber}
            onChange={(e) => onChangeMobileNumber(e.target.value)}
            placeholder="9876543210"
            maxLength={10}
            className="flex-1 rounded-xl border-2 border-[var(--border-default)] bg-white px-4 py-3 text-sm sm:text-base text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent min-h-[44px]"
          />
        </div>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed max-w-xl">
          {t("reportWizard.mobileHint")}
        </p>
      </div>

      {/* Read-Only Summary Card */}
      <div className="rounded-2xl border-2 border-[var(--border-default)] bg-white divide-y divide-[var(--border-default)] shadow-xs">
        {/* Description preview */}
        <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] shrink-0 sm:w-48">
            <FileText className="h-4 w-4 text-[var(--accent-primary)]" />
            <span>{t("reportWizard.problemSummary")}</span>
          </div>
          <p className="text-sm sm:text-base text-[var(--text-primary)] font-medium leading-relaxed max-w-2xl text-left sm:text-right">
            {description}
          </p>
        </div>

        {/* Location preview */}
        <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] shrink-0 sm:w-48">
            <MapPin className="h-4 w-4 text-[var(--accent-primary)]" />
            <span>{t("reportWizard.whereHappened")}</span>
          </div>
          <div className="text-sm font-semibold text-[var(--text-primary)] text-left sm:text-right">
            <span>
              {locationMethod === "gps"
                ? t("reportWizard.useGps")
                : locationMethod === "map"
                ? t("reportWizard.chooseMap")
                : locationMethod === "village"
                ? t("reportWizard.villageOnly")
                : "Not specified"}
            </span>
            {selectedCoords && (
              <span className="ml-2 font-mono text-xs bg-[var(--bg-base)] px-2.5 py-1 rounded border border-[var(--border-default)] text-[var(--accent-primary)]">
                📍 {selectedCoords.lat.toFixed(4)}° N, {selectedCoords.lng.toFixed(4)}° E
              </span>
            )}
          </div>
        </div>

        {/* Evidence preview */}
        <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] shrink-0 sm:w-48">
            <Camera className="h-4 w-4 text-[var(--accent-primary)]" />
            <span>{t("reportWizard.evidenceAttachment")}</span>
          </div>
          {photoDataUrl ? (
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoDataUrl}
                alt="Thumbnail"
                className="h-10 w-16 rounded-lg object-cover border border-[var(--border-default)] shadow-xs"
              />
              <span className="text-xs sm:text-sm font-bold text-[var(--accent-primary)]">
                {photoFileName || "Photo Attached"}
              </span>
            </div>
          ) : (
            <span className="text-sm text-[var(--text-muted)] italic">
              {t("reportWizard.noPhoto")}
            </span>
          )}
        </div>
      </div>

      {/* ── AI DETECTION CARD (STEP 4 ONLY) ── */}
      {aiDetection ? (
        <div className="rounded-3xl border-2 border-[var(--accent-primary)]/30 bg-gradient-to-br from-[var(--accent-primary)]/5 via-white to-white p-6 sm:p-8 space-y-5 shadow-sm animate-in fade-in">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--accent-primary)]/15 pb-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-[var(--accent-primary)] text-white flex items-center justify-center shadow-xs">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[var(--text-primary)]">
                  {t("reportWizard.aiDetectionTitle")}
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  {aiAnalysisSource === "gemini-vision-live"
                    ? "Live Multimodal Analysis"
                    : "Automated Vision Triage Engine"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[var(--state-success)]/15 text-[var(--state-success)]">
                <Check className="h-3.5 w-3.5" />
                {Math.round(aiDetection.aiConfidence * 100)}% Confidence
              </span>
              <PathBadge path={aiDetection.suggestedPath} />
            </div>
          </div>

          {/* Title & Suggested Dept */}
          <div className="space-y-1.5">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--accent-primary)]">
              {t("reportWizard.detectedProblem")}
            </p>
            <p className="text-lg font-bold text-[var(--text-primary)]">
              {aiDetection.title}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs sm:text-sm">
              <span className="text-[var(--text-muted)] font-medium">
                {t("reportWizard.suggestedRouting")}
              </span>
              <span className="font-bold text-[var(--text-primary)] bg-white px-3 py-1 rounded-lg border border-[var(--border-default)] shadow-2xs">
                {aiDetection.suggestedDepartment}
              </span>
            </div>
          </div>

          {/* Detected Visual Features */}
          {aiDetection.visualEvidence && aiDetection.visualEvidence.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                {t("reportWizard.keyVisualFeatures")}
              </p>
              <div className="flex flex-wrap gap-2">
                {aiDetection.visualEvidence.map((feature, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs bg-white border border-[var(--border-default)] text-[var(--text-primary)] font-semibold shadow-2xs"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--action-report)]" />
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Human Governance Reassurance */}
          <div className="flex items-start gap-3 text-xs text-[var(--text-muted)] bg-white/90 p-4 rounded-xl border border-[var(--border-default)]">
            <ShieldCheck className="h-5 w-5 text-[var(--accent-primary)] shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              {language === "en"
                ? "AI suggestions are advisory. An authorized human reviewer verifies every classification and department assignment within 24 hours."
                : "एआई सुझाव केवल मार्गदर्शन हेतु हैं। अधिकृत मानव समीक्षक 24 घंटे के भीतर प्रत्येक शिकायत और विभाग का सत्यापन करते हैं।"}
            </span>
          </div>
        </div>
      ) : (
        /* Text-only intake badge */
        <div className="p-5 rounded-2xl border-2 border-[var(--border-default)] bg-[var(--bg-base)] text-xs sm:text-sm text-[var(--text-muted)] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sparkles className="h-5 w-5 text-[var(--accent-primary)]" />
            <span className="font-medium">Text-Based Intake: Routed as standard civic grievance (Path B)</span>
          </div>
          <PathBadge path="B" />
        </div>
      )}
    </div>
  );
}

export default ReviewStep;
