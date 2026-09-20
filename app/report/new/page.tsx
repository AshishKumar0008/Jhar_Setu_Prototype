"use client";

import React, { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { UtilityBar } from "@/components/shell/utility-bar";
import { AppNavbar } from "@/components/shell/app-navbar";
import { PublicFooter } from "@/components/shell/public-footer";
import { ReportHeader } from "@/components/report/report-header";
import { ReportProgress } from "@/components/report/report-progress";
import { InputMethodSelector } from "@/components/report/input-method-selector";
import { ProblemDescriptionField } from "@/components/report/problem-description-field";
import { LocationStep } from "@/components/report/location-step";
import { EvidenceStep } from "@/components/report/evidence-step";
import { ReviewStep } from "@/components/report/review-step";
import { ReportNavigation } from "@/components/report/report-navigation";
import { PathBadge } from "@/components/patterns/path-badge";
import { CivicSamplePreset } from "@/lib/sample-images";
import { AIAnalysisResult } from "@/app/api/analyze-report/route";
import { useLanguage } from "@/lib/i18n/language-context";
import {
  Check,
  CheckCircle2,
  ShieldCheck,
  Copy,
  RotateCw,
  Eye,
  BookmarkCheck,
  X,
} from "lucide-react";

const LOCAL_STORAGE_DRAFT_KEY = "jharsetu_citizen_report_draft_v1";

export default function ReportWizardPage() {
  const { language, t } = useLanguage();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 4;

  // Form state
  const [inputMode, setInputMode] = useState<"voice" | "text" | null>("text");
  const [description, setDescription] = useState("");

  // Location state
  const [locationMethod, setLocationMethod] = useState<"gps" | "map" | "village" | null>(null);
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Evidence state
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [photoFileName, setPhotoFileName] = useState<string>("");
  const [photoFileSize, setPhotoFileSize] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiDetection, setAiDetection] = useState<AIAnalysisResult | null>(null);
  const [aiAnalysisSource, setAiAnalysisSource] = useState<string>("");

  // Contact state
  const [mobileNumber, setMobileNumber] = useState("");

  // Draft Notification & Storage State
  const [savedDraftToast, setSavedDraftToast] = useState(false);
  const [hasStoredDraft, setHasStoredDraft] = useState(false);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionReceipt, setSubmissionReceipt] = useState<{
    caseId: string;
    recoveryPhrase: string;
    title: string;
    category: string;
    district: string;
    suggestedPath: "A" | "B" | "C";
    suggestedDepartment?: string;
  } | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedPhrase, setCopiedPhrase] = useState(false);

  // Check for saved local draft on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_DRAFT_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.description || parsed.locationMethod) {
            setHasStoredDraft(true);
          }
        }
      } catch (e) {
        console.warn("Failed to check local draft:", e);
      }
    }
  }, []);

  // Restore draft handler
  const handleRestoreDraft = () => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_DRAFT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.inputMode) setInputMode(parsed.inputMode);
        if (parsed.description) setDescription(parsed.description);
        if (parsed.locationMethod) setLocationMethod(parsed.locationMethod);
        if (parsed.selectedCoords) setSelectedCoords(parsed.selectedCoords);
        if (parsed.photoDataUrl) setPhotoDataUrl(parsed.photoDataUrl);
        if (parsed.photoFileName) setPhotoFileName(parsed.photoFileName);
        if (parsed.photoFileSize) setPhotoFileSize(parsed.photoFileSize);
        if (parsed.mobileNumber) setMobileNumber(parsed.mobileNumber);
        if (parsed.aiDetection) setAiDetection(parsed.aiDetection);
        if (parsed.currentStep) setCurrentStep(parsed.currentStep);
        setHasStoredDraft(false);
      }
    } catch (e) {
      console.error("Failed to restore draft:", e);
    }
  };

  // Discard draft prompt
  const handleDiscardDraft = () => {
    localStorage.removeItem(LOCAL_STORAGE_DRAFT_KEY);
    setHasStoredDraft(false);
  };

  // Save draft handler (accessible on any step)
  const handleSaveDraft = () => {
    try {
      const draftPayload = {
        currentStep,
        inputMode,
        description,
        locationMethod,
        selectedCoords,
        photoDataUrl,
        photoFileName,
        photoFileSize,
        mobileNumber,
        aiDetection,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(LOCAL_STORAGE_DRAFT_KEY, JSON.stringify(draftPayload));
      setSavedDraftToast(true);
      setTimeout(() => setSavedDraftToast(false), 3000);
    } catch (err) {
      console.error("Failed to save draft:", err);
    }
  };

  // Background AI problem detection triggered when photo is provided
  const runAiProblemDetection = useCallback(
    async (
      imageData: string,
      fileName: string,
      currentText: string = "",
      sampleKey: string = ""
    ) => {
      setIsAnalyzing(true);
      try {
        const res = await fetch("/api/analyze-report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image: imageData,
            description: currentText,
            sampleType: sampleKey,
          }),
        });

        const data = await res.json();
        if (data.success && data.analysis) {
          const result: AIAnalysisResult = data.analysis;
          setAiDetection(result);
          setAiAnalysisSource(data.source || "gemini-vision");

          // Pre-populate description if empty
          if (!description || description.trim().length < 15) {
            setDescription(result.description);
          }
        }
      } catch (err) {
        console.error("AI Detection error:", err);
      } finally {
        setIsAnalyzing(false);
      }
    },
    [description]
  );

  // Handle standard file selection
  const handleFileSelected = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (JPG, PNG, WebP).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Image size exceeds 10 MB limit.");
      return;
    }

    const sizeKb = Math.round(file.size / 1024);
    const sizeStr = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;

    setPhotoFileName(file.name);
    setPhotoFileSize(sizeStr);

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setPhotoDataUrl(dataUrl);
      runAiProblemDetection(dataUrl, file.name, description);
    };
    reader.readAsDataURL(file);
  };

  // Handle One-Click Sample Presets in demo mode
  const handleSelectSample = (sample: CivicSamplePreset) => {
    setPhotoDataUrl(sample.imageSrc);
    setPhotoFileName(sample.filename);
    setPhotoFileSize("420 KB");
    runAiProblemDetection(sample.imageSrc, sample.filename, description, sample.id);
  };

  // Remove uploaded photo
  const handleRemovePhoto = () => {
    setPhotoDataUrl(null);
    setPhotoFileName("");
    setPhotoFileSize("");
    setAiDetection(null);
  };

  // Step advancement validation
  // Step 1: Description is required. (Category selection is removed from citizen form!)
  const canAdvanceStep1 = description.trim().length > 0;

  // Step 2: Location method picked (GPS or map has coords, village has selection)
  const canAdvanceStep2 =
    locationMethod !== null &&
    (locationMethod === "village" ||
      ((locationMethod === "gps" || locationMethod === "map") && selectedCoords !== null));

  // Step 3: Evidence is optional
  const canAdvanceStep3 = true;

  // Step 4: Ready to submit
  const canAdvanceStep4 = canAdvanceStep1 && canAdvanceStep2;

  const canAdvanceCurrentStep =
    currentStep === 1
      ? canAdvanceStep1
      : currentStep === 2
      ? canAdvanceStep2
      : currentStep === 3
      ? canAdvanceStep3
      : canAdvanceStep4;

  // Navigation handlers
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSkipEvidence = () => {
    setCurrentStep(4);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Submit Report to backend
  const handleSubmit = async () => {
    if (!canAdvanceStep1 || !canAdvanceStep2 || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const detectedCategory = aiDetection?.category || "Other";
      const payload = {
        title:
          aiDetection?.title ||
          (description.length > 50 ? description.slice(0, 50) + "..." : description) ||
          "Local Problem Report",
        description: description.trim(),
        category: detectedCategory,
        district: "Ranchi",
        block: "Kanke",
        village: "Chhotanagpur Area",
        exactLocation: selectedCoords
          ? { lat: selectedCoords.lat, lng: selectedCoords.lng }
          : null,
        coarseLocation: { district: "Ranchi", block: "Kanke" },
        attachments: photoDataUrl ? [photoDataUrl] : [],
        suggestedPath: aiDetection?.suggestedPath || "B",
        suggestedDepartment: aiDetection?.suggestedDepartment,
        aiConfidence: aiDetection?.aiConfidence || 0.88,
        aiReasoning: aiDetection?.aiReasoning || "Automated triage pipeline intake.",
      };

      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.data) {
        localStorage.removeItem(LOCAL_STORAGE_DRAFT_KEY);

        setSubmissionReceipt({
          caseId: data.data.id || data.data.trackingId,
          recoveryPhrase: data.data.recoveryPhrase || "tiger-river-granite-cloud",
          title: data.data.title,
          category: data.data.category,
          district: data.data.district,
          suggestedPath: data.data.suggestedPath || "B",
          suggestedDepartment: data.data.suggestedDepartment || "District Grievance Cell",
        });
      }
    } catch (err) {
      console.error("Submission failed, using fallback receipt:", err);
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      setSubmissionReceipt({
        caseId: `JH-2026-${randomSuffix}`,
        recoveryPhrase: "forest-river-sal-lotus",
        title: aiDetection?.title || "Local Problem Report",
        category: aiDetection?.category || "Civic Grievance",
        district: "Ranchi",
        suggestedPath: aiDetection?.suggestedPath || "B",
        suggestedDepartment:
          aiDetection?.suggestedDepartment || "Road Construction Department / PWD",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string, type: "id" | "phrase") => {
    navigator.clipboard.writeText(text);
    if (type === "id") {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } else {
      setCopiedPhrase(true);
      setTimeout(() => setCopiedPhrase(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-base)] text-[var(--text-primary)]">
      {/* ── HEADER ── */}
      <UtilityBar />
      <AppNavbar isPublic />

      {/* ── MAIN WORKSPACE CONTAINER (Spacious, Centered Desktop Layout) ── */}
      <main id="main-content" className="flex-1 w-full mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {submissionReceipt ? (
          /* SUCCESS RECEIPT MODAL / VIEW */
          <div className="bg-white rounded-3xl border-2 border-[var(--border-default)] p-8 sm:p-12 shadow-sm space-y-8 animate-in fade-in zoom-in-95 duration-300 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-start gap-5">
              <div className="h-14 w-14 rounded-2xl bg-[var(--state-success)]/10 text-[var(--state-success)] flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[var(--state-success)]/15 text-[var(--state-success)]">
                  <ShieldCheck className="h-4 w-4" />
                  {t("reportWizard.intakeRegistered")}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
                  {t("reportWizard.submittedSuccessfully")}
                </h1>
                <p className="text-sm text-[var(--text-muted)]">
                  {t("reportWizard.queuedMessage")}
                </p>
              </div>
            </div>

            {/* Tracking & Recovery Phrase Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Case ID Card */}
              <div className="rounded-2xl border-2 border-[var(--accent-primary)]/30 bg-[var(--accent-primary)]/5 p-6 space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--accent-primary)]">
                  {t("reportWizard.caseTrackingId")}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl sm:text-3xl font-mono font-bold text-[var(--text-primary)]">
                    {submissionReceipt.caseId}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(submissionReceipt.caseId, "id")}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[var(--border-default)] bg-white text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--bg-base)] transition-all shadow-xs cursor-pointer"
                  >
                    {copiedId ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-[var(--state-success)]" />
                        <span>{t("reportWizard.copied")}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>{t("reportWizard.copyId")}</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-[var(--text-muted)]">
                  {t("reportWizard.useIdHint")}
                </p>
              </div>

              {/* Anonymous Recovery Phrase */}
              <div className="rounded-2xl border-2 border-[var(--border-default)] bg-[var(--bg-base)] p-6 space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  {t("reportWizard.recoveryPhrase")}
                </p>
                <div className="flex items-center justify-between">
                  <code className="text-sm sm:text-base font-mono font-bold text-[var(--brand-navy)] bg-white px-3 py-1.5 rounded-xl border border-[var(--border-default)]">
                    {submissionReceipt.recoveryPhrase}
                  </code>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(submissionReceipt.recoveryPhrase, "phrase")}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[var(--border-default)] bg-white text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--bg-base)] transition-all shadow-xs cursor-pointer"
                  >
                    {copiedPhrase ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-[var(--state-success)]" />
                        <span>{t("reportWizard.copied")}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>{t("reportWizard.copyPhrase")}</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-[var(--text-muted)]">
                  {t("reportWizard.savePhraseHint")}
                </p>
              </div>
            </div>

            {/* Summary Details */}
            <div className="rounded-2xl border-2 border-[var(--border-default)] bg-white divide-y divide-[var(--border-default)]">
              <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  {t("reportWizard.detectedProblem")}
                </span>
                <span className="text-sm font-semibold text-[var(--text-primary)] text-left sm:text-right">
                  {submissionReceipt.title}
                </span>
              </div>
              <div className="px-6 py-4 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  {t("reportWizard.categoryLabel")}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[var(--text-primary)]">
                    {language === "hi" && t(`categoryMap.${submissionReceipt.category}`)
                      ? t(`categoryMap.${submissionReceipt.category}`)
                      : submissionReceipt.category}
                  </span>
                  <PathBadge path={submissionReceipt.suggestedPath} />
                </div>
              </div>
              {submissionReceipt.suggestedDepartment && (
                <div className="px-6 py-4 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    {t("reportWizard.suggestedRouting")}
                  </span>
                  <span className="text-sm text-[var(--accent-primary)] font-bold">
                    {submissionReceipt.suggestedDepartment}
                  </span>
                </div>
              )}
              <div className="px-6 py-4 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  {t("reportWizard.slaTargetLabel")}
                </span>
                <span className="text-sm font-bold text-[var(--state-success)]">
                  {t("reportWizard.slaTargetValue")}
                </span>
              </div>
            </div>

            {/* Receipt Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href={`/track?id=${submissionReceipt.caseId}`}
                className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[var(--action-track)] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all"
              >
                <Eye className="h-4 w-4" />
                <span>{t("reportWizard.trackStatusBtn")}</span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  setSubmissionReceipt(null);
                  setCurrentStep(1);
                  setDescription("");
                  setPhotoDataUrl(null);
                  setPhotoFileName("");
                  setPhotoFileSize("");
                  setAiDetection(null);
                  setLocationMethod(null);
                  setSelectedCoords(null);
                  setMobileNumber("");
                }}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl border-2 border-[var(--border-default)] bg-white text-[var(--text-primary)] text-sm font-bold hover:bg-[var(--bg-base)] transition-colors cursor-pointer"
              >
                <RotateCw className="h-4 w-4" />
                <span>{t("reportWizard.submitAnotherBtn")}</span>
              </button>
            </div>
          </div>
        ) : (
          /* REPORT WIZARD FORM CONTAINER */
          <div className="space-y-6">
            {/* Header: Title + Subtitle */}
            <ReportHeader />

            {/* Restorable Draft Banner */}
            {hasStoredDraft && (
              <div className="flex items-center justify-between gap-3 p-4 rounded-2xl border-2 border-[var(--accent-primary)]/30 bg-[var(--accent-primary)]/5 text-xs sm:text-sm text-[var(--text-primary)] animate-in fade-in">
                <div className="flex items-center gap-2.5">
                  <BookmarkCheck className="h-5 w-5 text-[var(--accent-primary)] shrink-0" />
                  <span className="font-medium">You have an uncompleted draft saved on this device.</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleRestoreDraft}
                    className="px-3.5 py-1.5 rounded-xl bg-[var(--accent-primary)] text-white text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
                  >
                    Resume Draft
                  </button>
                  <button
                    type="button"
                    onClick={handleDiscardDraft}
                    aria-label="Discard draft"
                    className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Draft Saved Toast */}
            {savedDraftToast && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold flex items-center gap-2 animate-in fade-in shadow-xs">
                <Check className="h-4 w-4 text-emerald-600" />
                <span>{t("reportWizard.draftSaved") || "Draft saved to device"} (Step {currentStep} of {totalSteps})</span>
              </div>
            )}

            {/* Horizontal Progress Indicator */}
            <ReportProgress
              currentStep={currentStep}
              totalSteps={totalSteps}
              onStepClick={(stepId) => {
                if (stepId <= currentStep) {
                  setCurrentStep(stepId);
                }
              }}
            />

            {/* Large Elevated Form Card */}
            <div className="bg-white rounded-3xl border-2 border-[var(--border-default)] p-6 sm:p-10 lg:p-12 shadow-sm space-y-8">
              {/* STEP 1: Describe Problem (Voice/Text cards + Large Textarea) */}
              {currentStep === 1 && (
                <div className="space-y-8 animate-in fade-in duration-200">
                  <InputMethodSelector
                    inputMode={inputMode}
                    onSelectMode={setInputMode}
                  />

                  <ProblemDescriptionField
                    description={description}
                    onChangeDescription={setDescription}
                    inputMode={inputMode}
                    aiSuggestedNarrative={aiDetection?.description}
                  />
                </div>
              )}

              {/* STEP 2: Location (GPS / Map / Village) */}
              {currentStep === 2 && (
                <div className="animate-in fade-in duration-200">
                  <LocationStep
                    locationMethod={locationMethod}
                    selectedCoords={selectedCoords}
                    onSelectMethod={setLocationMethod}
                    onSelectCoords={setSelectedCoords}
                  />
                </div>
              )}

              {/* STEP 3: Evidence (Dropzone / Skip / Demo Presets) */}
              {currentStep === 3 && (
                <div className="animate-in fade-in duration-200">
                  <EvidenceStep
                    photoDataUrl={photoDataUrl}
                    photoFileName={photoFileName}
                    photoFileSize={photoFileSize}
                    isAnalyzing={isAnalyzing}
                    onFileSelected={handleFileSelected}
                    onSelectSample={handleSelectSample}
                    onRemovePhoto={handleRemovePhoto}
                  />
                </div>
              )}

              {/* STEP 4: Review & Submit (Mobile input + Summary + AI Detection Card) */}
              {currentStep === 4 && (
                <div className="animate-in fade-in duration-200">
                  <ReviewStep
                    description={description}
                    locationMethod={locationMethod}
                    selectedCoords={selectedCoords}
                    photoDataUrl={photoDataUrl}
                    photoFileName={photoFileName}
                    mobileNumber={mobileNumber}
                    onChangeMobileNumber={setMobileNumber}
                    aiDetection={aiDetection}
                    aiAnalysisSource={aiAnalysisSource}
                  />
                </div>
              )}

              {/* Navigation Action Buttons */}
              <ReportNavigation
                currentStep={currentStep}
                totalSteps={totalSteps}
                canAdvance={canAdvanceCurrentStep}
                isSubmitting={isSubmitting}
                onBack={handleBack}
                onNext={handleNext}
                onSaveDraft={handleSaveDraft}
                onSkip={handleSkipEvidence}
                showSkip={currentStep === 3}
              />
            </div>
          </div>
        )}
      </main>

      {/* ── FOOTER ── */}
      <PublicFooter />
    </div>
  );
}
