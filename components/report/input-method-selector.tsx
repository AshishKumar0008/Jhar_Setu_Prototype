"use client";

import React from "react";
import { Mic, PenLine } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";

export interface InputMethodSelectorProps {
  inputMode: "voice" | "text" | null;
  onSelectMode: (mode: "voice" | "text") => void;
}

export function InputMethodSelector({
  inputMode,
  onSelectMode,
}: InputMethodSelectorProps) {
  const { t } = useLanguage();

  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)]">
        {t("reportWizard.howToReport")}
      </legend>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Voice Input Card */}
        <button
          type="button"
          onClick={() => onSelectMode("voice")}
          className={`flex flex-col sm:flex-row items-center sm:items-start gap-4 p-5 sm:p-6 rounded-2xl border-2 text-left transition-all min-h-[100px] cursor-pointer ${
            inputMode === "voice"
              ? "border-[var(--accent-primary)] bg-[var(--accent-primary)] text-white shadow-md ring-2 ring-[var(--accent-primary)]/20"
              : "border-[var(--border-default)] bg-white text-[var(--text-primary)] hover:border-[var(--accent-primary)]/50 hover:bg-[var(--bg-base)]/50"
          }`}
        >
          <div
            className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
              inputMode === "voice"
                ? "bg-white/20 text-white"
                : "bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]"
            }`}
          >
            <Mic className="h-6 w-6" />
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <p className="text-base font-bold">
              {t("reportWizard.inputModeVoice")}
            </p>
            <p
              className={`text-xs leading-relaxed ${
                inputMode === "voice" ? "text-white/80" : "text-[var(--text-muted)]"
              }`}
            >
              Speak naturally in Hindi or English. Audio is transcribed automatically.
            </p>
          </div>
        </button>

        {/* Type in Text Card */}
        <button
          type="button"
          onClick={() => onSelectMode("text")}
          className={`flex flex-col sm:flex-row items-center sm:items-start gap-4 p-5 sm:p-6 rounded-2xl border-2 text-left transition-all min-h-[100px] cursor-pointer ${
            inputMode === "text"
              ? "border-[var(--accent-primary)] bg-[var(--accent-primary)] text-white shadow-md ring-2 ring-[var(--accent-primary)]/20"
              : "border-[var(--border-default)] bg-white text-[var(--text-primary)] hover:border-[var(--accent-primary)]/50 hover:bg-[var(--bg-base)]/50"
          }`}
        >
          <div
            className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
              inputMode === "text"
                ? "bg-white/20 text-white"
                : "bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]"
            }`}
          >
            <PenLine className="h-6 w-6" />
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <p className="text-base font-bold">
              {t("reportWizard.inputModeText")}
            </p>
            <p
              className={`text-xs leading-relaxed ${
                inputMode === "text" ? "text-white/80" : "text-[var(--text-muted)]"
              }`}
            >
              Write down details using keyboard or phone keypad in any language.
            </p>
          </div>
        </button>
      </div>
    </fieldset>
  );
}

export default InputMethodSelector;
