"use client";

import React from "react";
import { Check, LucideIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export interface StepItem {
  id: number;
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
}

export interface StepWizardIndicatorProps {
  steps: StepItem[];
  currentStep: number;
  onStepClick?: (stepId: number) => void;
  className?: string;
}

export function StepWizardIndicator({
  steps,
  currentStep,
  onStepClick,
  className = "",
}: StepWizardIndicatorProps) {
  const percentComplete = Math.round(((currentStep - 1) / (steps.length - 1)) * 100);

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Stepper items row */}
      <nav aria-label="Progress" className="w-full">
        <ol className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {steps.map((step) => {
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;
            const isClickable = onStepClick && step.id <= currentStep;
            const Icon = step.icon;

            return (
              <li key={step.id} className="relative">
                <button
                  type="button"
                  disabled={!isClickable}
                  onClick={() => isClickable && onStepClick?.(step.id)}
                  aria-current={isCurrent ? "step" : undefined}
                  className={`w-full flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl border text-left transition-all min-h-[44px] ${
                    isCurrent
                      ? "border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] font-bold shadow-xs"
                      : isCompleted
                      ? "border-[var(--state-success,#16A34A)]/40 bg-[var(--state-success,#16A34A)]/5 text-[var(--state-success,#16A34A)] hover:bg-[var(--state-success,#16A34A)]/10 cursor-pointer"
                      : "border-[var(--border-default)] bg-white text-[var(--text-muted)] cursor-not-allowed opacity-75"
                  }`}
                >
                  {/* Step Number Circle (Pair color with shape/icon per ui-context.md) */}
                  <span
                    className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-colors ${
                      isCurrent
                        ? "bg-[var(--accent-primary)] text-white ring-2 ring-[var(--accent-primary)]/20"
                        : isCompleted
                        ? "bg-[var(--state-success,#16A34A)] text-white"
                        : "bg-[var(--bg-base,#F7F8FA)] text-[var(--text-muted)] border border-[var(--border-default)]"
                    }`}
                  >
                    {isCompleted ? <Check className="h-4 w-4 stroke-[3]" /> : step.id}
                  </span>

                  {/* Title & optional icon */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      {Icon && (
                        <Icon
                          className={`h-3.5 w-3.5 shrink-0 ${
                            isCurrent
                              ? "text-[var(--accent-primary)]"
                              : isCompleted
                              ? "text-[var(--state-success,#16A34A)]"
                              : "text-[var(--text-muted)]"
                          }`}
                        />
                      )}
                      <p className="text-xs truncate font-semibold">
                        {step.title}
                      </p>
                    </div>
                    {step.subtitle && (
                      <p className="text-[10px] text-[var(--text-muted)] truncate hidden sm:block">
                        {step.subtitle}
                      </p>
                    )}
                  </div>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Visual progress bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] font-medium">
          <span>Step {currentStep} of {steps.length}</span>
          <span>{percentComplete}% Complete</span>
        </div>
        <Progress value={percentComplete} className="h-1.5 bg-[var(--border-default)]" />
      </div>
    </div>
  );
}

export interface StepWizardControlsProps {
  currentStep: number;
  totalSteps: number;
  canAdvance: boolean;
  isSubmitting?: boolean;
  onBack: () => void;
  onNext: () => void;
  onSaveDraft?: () => void;
  onSkip?: () => void;
  backLabel?: string;
  nextLabel?: string;
  submitLabel?: string;
  saveDraftLabel?: string;
  skipLabel?: string;
  showSkip?: boolean;
}

export function StepWizardControls({
  currentStep,
  totalSteps,
  canAdvance,
  isSubmitting = false,
  onBack,
  onNext,
  onSaveDraft,
  onSkip,
  backLabel = "Back",
  nextLabel = "Continue →",
  submitLabel = "Submit Report",
  saveDraftLabel = "Save Draft",
  skipLabel = "Skip this step",
  showSkip = false,
}: StepWizardControlsProps) {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="pt-6 border-t border-[var(--border-default)] flex flex-wrap items-center justify-between gap-3">
      {/* Left controls: Back & Save Draft */}
      <div className="flex items-center gap-2">
        {!isFirstStep && (
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2.5 rounded-xl border border-[var(--border-default)] bg-white text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-base)] transition-colors min-h-[44px] flex items-center justify-center cursor-pointer"
          >
            ← {backLabel}
          </button>
        )}

        {onSaveDraft && (
          <button
            type="button"
            onClick={onSaveDraft}
            className="px-4 py-2.5 rounded-xl border border-[var(--border-default)] bg-white text-xs sm:text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-base)] transition-colors min-h-[44px] flex items-center justify-center cursor-pointer"
          >
            💾 {saveDraftLabel}
          </button>
        )}
      </div>

      {/* Right controls: Skip (if optional step) & Next/Submit */}
      <div className="flex items-center gap-2">
        {showSkip && onSkip && (
          <button
            type="button"
            onClick={onSkip}
            className="px-4 py-2.5 rounded-xl border border-dashed border-[var(--border-default)] text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-base)] transition-colors min-h-[44px] cursor-pointer"
          >
            {skipLabel}
          </button>
        )}

        <button
          type="button"
          onClick={onNext}
          disabled={!canAdvance || isSubmitting}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold min-h-[44px] flex items-center gap-2 transition-all shadow-xs cursor-pointer ${
            !canAdvance || isSubmitting
              ? "bg-[var(--border-default)] text-[var(--text-muted)] cursor-not-allowed opacity-60"
              : isLastStep
              ? "bg-[var(--state-success,#16A34A)] text-white hover:bg-[var(--state-success,#16A34A)]/90"
              : "bg-[var(--accent-primary,#0F62B4)] text-white hover:bg-[var(--accent-primary,#0F62B4)]/90"
          }`}
        >
          {isSubmitting ? (
            <span>Submitting...</span>
          ) : isLastStep ? (
            <span>{submitLabel}</span>
          ) : (
            <span>{nextLabel}</span>
          )}
        </button>
      </div>
    </div>
  );
}

export default StepWizardIndicator;
