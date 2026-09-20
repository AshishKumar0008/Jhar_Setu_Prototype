"use client";

import React from "react";
import { Check, FileText, MapPin, Camera, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/lib/i18n/language-context";

export interface ReportProgressProps {
  currentStep: number;
  totalSteps?: number;
  onStepClick?: (step: number) => void;
}

export function ReportProgress({
  currentStep,
  totalSteps = 4,
  onStepClick,
}: ReportProgressProps) {
  const { t } = useLanguage();

  const steps = [
    {
      id: 1,
      title: t("reportWizard.step1Tab") || "Describe Problem",
      subtitle: "What happened",
      icon: FileText,
    },
    {
      id: 2,
      title: t("reportWizard.step2Tab") || "Location",
      subtitle: "Where it happened",
      icon: MapPin,
    },
    {
      id: 3,
      title: t("reportWizard.step3Tab") || "Evidence",
      subtitle: "Photo (optional)",
      icon: Camera,
    },
    {
      id: 4,
      title: t("reportWizard.step4Tab") || "Review & Submit",
      subtitle: "Confirm & send",
      icon: CheckCircle2,
    },
  ];

  const percentComplete = Math.round(((currentStep - 1) / (totalSteps - 1)) * 100);

  return (
    <div className="w-full space-y-4 mb-8">
      {/* Desktop Horizontal Stepper */}
      <nav aria-label="Submission Progress" className="hidden sm:block">
        <ol className="flex items-center justify-between relative">
          {/* Background connector track */}
          <div
            className="absolute left-6 right-6 top-5 h-1 bg-[var(--border-default)] -z-0"
            aria-hidden="true"
          />
          {/* Active progress connector fill */}
          <div
            className="absolute left-6 top-5 h-1 bg-[var(--accent-primary)] transition-all duration-300 -z-0"
            style={{ width: `calc(${percentComplete}% - 48px * ${percentComplete / 100})` }}
            aria-hidden="true"
          />

          {steps.map((step) => {
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;
            const isClickable = onStepClick && step.id <= currentStep;
            const Icon = step.icon;

            return (
              <li key={step.id} className="relative z-10 flex flex-col items-center">
                <button
                  type="button"
                  disabled={!isClickable}
                  onClick={() => isClickable && onStepClick?.(step.id)}
                  className={`group flex flex-col items-center focus:outline-none ${
                    isClickable ? "cursor-pointer" : "cursor-default"
                  }`}
                >
                  {/* Step circle */}
                  <div
                    className={`h-11 w-11 rounded-2xl flex items-center justify-center font-bold text-sm transition-all duration-200 shadow-xs ${
                      isCurrent
                        ? "bg-[var(--accent-primary)] text-white ring-4 ring-[var(--accent-primary)]/20 scale-105"
                        : isCompleted
                        ? "bg-[var(--state-success,#16A34A)] text-white group-hover:scale-105"
                        : "bg-white text-[var(--text-muted)] border-2 border-[var(--border-default)]"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5 stroke-[3]" />
                    ) : (
                      <span>{step.id}</span>
                    )}
                  </div>

                  {/* Step labels */}
                  <div className="text-center mt-2.5 space-y-0.5">
                    <p
                      className={`text-xs sm:text-sm font-bold transition-colors ${
                        isCurrent
                          ? "text-[var(--accent-primary)]"
                          : isCompleted
                          ? "text-[var(--state-success,#16A34A)]"
                          : "text-[var(--text-muted)]"
                      }`}
                    >
                      {step.title}
                    </p>
                    <p className="text-[11px] text-[var(--text-muted)] hidden md:block">
                      {step.subtitle}
                    </p>
                  </div>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Mobile Compact Stepper */}
      <div className="sm:hidden bg-white p-4 rounded-2xl border border-[var(--border-default)] space-y-2.5 shadow-xs">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-[var(--accent-primary)] uppercase tracking-wider">
            Step {currentStep} of {totalSteps}: {steps[currentStep - 1].title}
          </span>
          <span className="text-[var(--text-muted)]">{percentComplete}%</span>
        </div>
        <Progress value={percentComplete} className="h-2 bg-[var(--border-default)]" />
      </div>
    </div>
  );
}

export default ReportProgress;
