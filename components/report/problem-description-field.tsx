"use client";

import React from "react";
import { Mic, Sparkles } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";

export interface ProblemDescriptionFieldProps {
  description: string;
  onChangeDescription: (val: string) => void;
  inputMode: "voice" | "text" | null;
  aiSuggestedNarrative?: string | null;
}

export function ProblemDescriptionField({
  description,
  onChangeDescription,
  inputMode,
  aiSuggestedNarrative,
}: ProblemDescriptionFieldProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-3">
      {/* Voice recording prompt if voice mode selected */}
      {inputMode === "voice" && (
        <div className="flex flex-col sm:flex-row items-center gap-4 p-5 rounded-2xl border-2 border-dashed border-[var(--accent-primary)]/40 bg-[var(--accent-primary)]/5 animate-in fade-in duration-200">
          <div className="h-12 w-12 rounded-full bg-[var(--accent-primary)] text-white flex items-center justify-center shadow-md animate-pulse shrink-0">
            <Mic className="h-6 w-6" />
          </div>
          <div className="space-y-0.5 text-center sm:text-left flex-1">
            <p className="text-sm font-bold text-[var(--accent-primary)]">
              {t("reportWizard.voicePrompt")}
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              {t("reportWizard.voiceAutoTranscribe")}
            </p>
          </div>
        </div>
      )}

      {/* Label and Character Count */}
      <div className="flex items-center justify-between">
        <div>
          <label
            htmlFor="problem-description"
            className="text-base font-bold text-[var(--text-primary)]"
          >
            {t("reportWizard.describeYourProblem")}
          </label>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            {t("reportWizard.describeYourProblemSub")}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {aiSuggestedNarrative && (
            <button
              type="button"
              onClick={() => onChangeDescription(aiSuggestedNarrative)}
              className="text-xs text-[var(--accent-primary)] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="h-3 w-3" />
              <span>Apply AI Summary</span>
            </button>
          )}
          <span className="text-xs font-mono font-medium text-[var(--text-muted)] bg-[var(--bg-base)] px-2 py-0.5 rounded border border-[var(--border-default)]">
            {description.length} chars
          </span>
        </div>
      </div>

      {/* Large Textarea (180–220px min-height on desktop) */}
      <textarea
        id="problem-description"
        rows={7}
        value={description}
        onChange={(e) => onChangeDescription(e.target.value)}
        placeholder={t("reportWizard.whatHappenedPlaceholder")}
        className="w-full min-h-[190px] sm:min-h-[210px] rounded-2xl border-2 border-[var(--border-default)] bg-white px-5 py-4 text-sm sm:text-base text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] resize-y leading-relaxed transition-all shadow-xs"
      />
    </div>
  );
}

export default ProblemDescriptionField;
