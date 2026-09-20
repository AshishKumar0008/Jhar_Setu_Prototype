"use client";

import React from "react";
import { ArrowLeft, ArrowRight, Check, RotateCw, Bookmark } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";

export interface ReportNavigationProps {
  currentStep: number;
  totalSteps?: number;
  canAdvance: boolean;
  isSubmitting?: boolean;
  onBack: () => void;
  onNext: () => void;
  onSaveDraft: () => void;
  onSkip?: () => void;
  showSkip?: boolean;
}

export function ReportNavigation({
  currentStep,
  totalSteps = 4,
  canAdvance,
  isSubmitting = false,
  onBack,
  onNext,
  onSaveDraft,
  onSkip,
  showSkip = false,
}: ReportNavigationProps) {
  const { t } = useLanguage();
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="pt-8 mt-8 border-t-2 border-[var(--border-default)] flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Left controls: Back & Save Draft */}
      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
        {!isFirstStep ? (
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-[var(--border-default)] bg-white text-sm font-bold text-[var(--text-primary)] hover:bg-[var(--bg-base)] transition-all min-h-[48px] cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{t("actions.back")}</span>
          </button>
        ) : (
          <div className="hidden sm:block" />
        )}

        <button
          type="button"
          onClick={onSaveDraft}
          className="flex items-center gap-2 px-4 py-3 rounded-xl border border-[var(--border-default)] bg-white text-xs sm:text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-base)] transition-all min-h-[48px] cursor-pointer"
        >
          <Bookmark className="h-4 w-4" />
          <span>{t("reportWizard.saveDraft") || "Save Draft"}</span>
        </button>
      </div>

      {/* Right controls: Skip (if optional step) & Continue/Submit */}
      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
        {showSkip && onSkip && (
          <button
            type="button"
            onClick={onSkip}
            className="px-5 py-3 rounded-xl border-2 border-dashed border-[var(--border-default)] text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-base)] transition-colors min-h-[48px] cursor-pointer"
          >
            {t("reportWizard.skipStep") || "Skip this step"}
          </button>
        )}

        <button
          type="button"
          onClick={onNext}
          disabled={!canAdvance || isSubmitting}
          className={`flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm sm:text-base font-bold min-h-[48px] transition-all shadow-sm cursor-pointer w-full sm:w-auto ${
            !canAdvance || isSubmitting
              ? "bg-[var(--border-default)] text-[var(--text-muted)] cursor-not-allowed opacity-60"
              : isLastStep
              ? "bg-[var(--state-success,#16A34A)] text-white hover:bg-[var(--state-success,#16A34A)]/90 shadow-md hover:shadow-lg"
              : "bg-[var(--accent-primary,#0F62B4)] text-white hover:bg-[var(--accent-primary,#0F62B4)]/90 shadow-md hover:shadow-lg"
          }`}
        >
          {isSubmitting ? (
            <>
              <RotateCw className="h-4 w-4 animate-spin" />
              <span>{t("reportWizard.submitting")}</span>
            </>
          ) : isLastStep ? (
            <>
              <Check className="h-4 w-4 stroke-[3]" />
              <span>{t("reportWizard.submitReport") || "Submit Report"}</span>
            </>
          ) : (
            <>
              <span>{t("actions.continue")}</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default ReportNavigation;
