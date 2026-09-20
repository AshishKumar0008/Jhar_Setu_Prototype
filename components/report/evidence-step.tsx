"use client";

import React, { useRef, useState } from "react";
import {
  Camera,
  Upload,
  RotateCw,
  Trash2,
  Check,
  Sparkles,
} from "lucide-react";
import { CIVIC_SAMPLES, CivicSamplePreset } from "@/lib/sample-images";
import { useLanguage } from "@/lib/i18n/language-context";

export interface EvidenceStepProps {
  photoDataUrl: string | null;
  photoFileName: string;
  photoFileSize: string;
  isAnalyzing: boolean;
  onFileSelected: (file: File) => void;
  onSelectSample: (sample: CivicSamplePreset) => void;
  onRemovePhoto: () => void;
}

export function EvidenceStep({
  photoDataUrl,
  photoFileName,
  photoFileSize,
  isAnalyzing,
  onFileSelected,
  onSelectSample,
  onRemovePhoto,
}: EvidenceStepProps) {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelected(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Camera className="h-5 w-5 text-[var(--accent-primary)]" />
            <span>{t("reportWizard.photoLabel")}</span>
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-0.5">
            Evidence is optional. You can skip this step or upload a photo to assist automated severity detection.
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5" />
          Gemini Multimodal Vision
        </span>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            onFileSelected(e.target.files[0]);
          }
        }}
      />

      {/* Dropzone or Preview */}
      {!photoDataUrl ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`group relative flex flex-col items-center justify-center gap-4 p-10 sm:p-14 rounded-3xl border-2 border-dashed transition-all cursor-pointer min-h-[220px] ${
            isDragging
              ? "border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 scale-[1.01]"
              : "border-[var(--border-default)] bg-white hover:border-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/5 shadow-xs"
          }`}
        >
          <div className="h-16 w-16 rounded-2xl bg-[var(--bg-base)] group-hover:bg-[var(--accent-primary)]/15 flex items-center justify-center transition-colors">
            <Upload className="h-8 w-8 text-[var(--accent-primary)] group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-base font-bold text-[var(--text-primary)]">
              {t("reportWizard.photoDropPrompt")}
            </p>
            <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
              {t("reportWizard.photoLimits")}
            </p>
          </div>
        </div>
      ) : (
        /* Uploaded Photo Preview Card */
        <div className="rounded-2xl border-2 border-[var(--border-default)] bg-white p-5 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              {/* Thumbnail */}
              <div className="relative h-24 w-32 rounded-xl overflow-hidden border border-[var(--border-default)] bg-slate-900 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoDataUrl}
                  alt="Uploaded civic evidence"
                  className="h-full w-full object-cover"
                />
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-blue-950/60 flex items-center justify-center">
                    <RotateCw className="h-7 w-7 text-white animate-spin" />
                  </div>
                )}
              </div>

              <div>
                <p className="text-base font-bold text-[var(--text-primary)] truncate max-w-xs sm:max-w-md">
                  {photoFileName}
                </p>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  {photoFileSize} • {t("reportWizard.photoAttached")}
                </p>
                {isAnalyzing ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent-primary)] mt-1.5 animate-pulse">
                    <Sparkles className="h-3.5 w-3.5" />
                    AI scanning image features in background...
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--state-success)] mt-1.5">
                    <Check className="h-4 w-4" />
                    {t("reportWizard.photoReady")}
                  </span>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border-default)] bg-white text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-base)] transition-colors min-h-[44px] cursor-pointer"
              >
                <RotateCw className="h-4 w-4" />
                <span>Replace</span>
              </button>
              <button
                type="button"
                onClick={onRemovePhoto}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--state-error)]/30 bg-[var(--state-error)]/5 text-xs font-semibold text-[var(--state-error)] hover:bg-[var(--state-error)]/10 transition-colors min-h-[44px] cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Developer Demo Presets (Gated behind NEXT_PUBLIC_DEMO_MODE=true) */}
      {isDemoMode && (
        <div className="rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/50 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-200 text-amber-900">
                Demo Mode
              </span>
              <span className="text-xs font-bold text-amber-900">
                Testing Aid: Sample Civic Problem Photos
              </span>
            </div>
            <span className="text-[10px] text-amber-700 font-mono">
              (NEXT_PUBLIC_DEMO_MODE=true)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CIVIC_SAMPLES.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => onSelectSample(sample)}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-left text-xs font-medium transition-all min-h-[48px] cursor-pointer ${
                  photoFileName === sample.filename
                    ? "border-amber-600 bg-amber-100 text-amber-950 font-bold shadow-xs"
                    : "border-amber-200 bg-white text-slate-800 hover:border-amber-400 hover:bg-amber-50"
                }`}
              >
                <span className="text-xl shrink-0">{sample.icon}</span>
                <div className="min-w-0">
                  <p className="truncate font-bold">{sample.name}</p>
                  <p className="text-[10px] text-slate-500 truncate">
                    {sample.category}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default EvidenceStep;
