# Current Issues & Audit Log

This document tracks all known bugs, audit findings, and verification results across the JharSetu codebase, as mandated by `context/feature-specs/08-audit-and-recovery.md`.

---

## Active Issues

### BUG-002 — Gemini vision classification hardcoded/not functioning
- **Symptom**: The "AI Detection" card shows static Path B / 95% confidence regardless of sample image chosen, or classifications do not reflect distinct images.
- **Root Cause**: Need to audit whether `/api/analyze-report` is executing real Gemini API calls with `responseSchema` or falling back to a static stub, and ensure UI consumes live dynamic API responses for all 4 sample presets and user uploads.
- **Status**: Queued (next after BUG-001).

### BUG-003 — Buttons present but non-functional or produce no visible result
- **Severity**: High (P1)
- **Component**: Sitewide interactive elements
- **Symptom**: Buttons lack handlers, don't trigger feedback, or navigate nowhere.
- **Status**: Audit in progress.

### BUG-004 — No real data sync between citizen submission and dashboards
- **Severity**: High (P1)
- **Component**: `lib/store.ts`, `app/api/reports/route.ts`, `app/dashboard/*`
- **Symptom**: Reports submitted by citizens do not appear in Innovation Cell or Department dashboards; dashboards use static dummy state.
- **Status**: Queued.

### BUG-005 — Auth/login bugs across roles
- **Severity**: High (P1)
- **Component**: Clerk auth, role redirects, dashboard route guards
- **Symptom**: Redirects fail to respect role metadata, unauthorized access to other departments' URLs not blocked server-side.
- **Status**: Queued.

---

## Resolved Issues

### BUG-001 — i18n translation keys rendering literally, sitewide
- **Severity**: Critical (P0)
- **Component**: `lib/i18n/language-context.tsx`, `lib/i18n/translations/en.ts`, `lib/i18n/translations/hi.ts`
- **Resolution**:
  1. Identified 106 distinct translation key paths called across 11 files (`app/report/new/page.tsx`, `app/track/page.tsx`, `app/challenges/page.tsx`, `app/challenges/[id]/page.tsx`, `app/sign-in/[[...sign-in]]/page.tsx`, `components/dashboard/dashboard-shell.tsx`, `components/patterns/citizen-left-rail.tsx`, `components/patterns/path-badge.tsx`, and dashboard pages) that were missing in both `en.ts` and `hi.ts`.
  2. Implemented developer console warning in `lib/i18n/language-context.tsx` (`console.warn("[i18n] Missing translation key...")`) to prevent silent bare key fallbacks.
  3. Added full, high-fidelity English and Hindi translation entries for all 106 keys across `common`, `nav`, `paths`, `categoryMap`, `challengesPage`, `signInPage`, `dashboard`, `trackPage`, and `reportWizard`.
  4. Ran exhaustive programmatic audit across all 386 `t(...)` usages sitewide: confirmed **0 missing keys in EN** and **0 missing keys in HI**.
  5. Verified TypeScript compilation passed with 0 errors (`npx tsc --noEmit`).

### BUG-006 — Report Wizard 2-step clutter and contradictory step specification
- **Severity**: High (P1) / Design Specification Contradiction
- **Component**: `app/report/new/page.tsx`, `components/patterns/step-wizard.tsx`, `context/feature-specs/10-report-wizard-redesign.md`
- **Resolution**:
  1. Superseded the Report Wizard section of `03-public-pages.md` with `10-report-wizard-redesign.md`.
  2. Built shared step-wizard component `components/patterns/step-wizard.tsx` exporting `StepWizardIndicator` and `StepWizardControls` with 1–4 step numbered indicators, percent complete progress bar, filled/checkmark indicators, and $\ge 44$px touch targets.
  3. Rebuilt `app/report/new/page.tsx` with strictly isolated step rendering.
  4. Implemented full data persistence across Back/Next steps and device `localStorage` draft saving (`jharsetu_citizen_report_draft_v1`) accessible from any step with resume/discard banner on reload.
  5. Verified zero missing keys in English & Hindi (527 keys in full parity) and clean TypeScript compilation (`npx tsc --noEmit`).

### FEAT-010 — Desktop Report Page SaaS Redesign & Citizen Category Removal
- **Severity**: Feature Enhancement / UX Modernization
- **Component**: `app/report/new/page.tsx`, `components/report/*`, `components/shell/public-footer.tsx`
- **Resolution**:
  1. Completely removed the left sidebar (`CitizenLeftRail`) and right-side "Grievance Resolution Process" panel from `/report/new`, transforming it into a spacious, centered modern SaaS form (`max-w-6xl` ~1200–1400px).
  2. Removed citizen-facing "Select Category" chips completely, delegating categorization and departmental triage to the AI pipeline and reviewer decisions.
  3. Modularized into clean reusable components: `ReportHeader`, `ReportProgress`, `InputMethodSelector` (side-by-side cards on desktop, stacked on mobile), `ProblemDescriptionField` (large 190–210px textarea), `LocationStep`, `EvidenceStep`, `ReviewStep`, and `ReportNavigation`.
  4. Extracted shared i18n-aware `PublicFooter`.
  5. Preserved full end-to-end functionality: Leaflet map picking, photo dropzone, background Gemini analysis, Step 4 AI card display, receipt tracking with recovery phrases, and 100% bilingual parity across 529 keys.

---

## Site Audit Results

| Route | Status | Notes / Issues |
|---|---|---|
| `/` | Pending | To be audited |
| `/report/new` | Pending | BUG-001, BUG-002 in progress |
| `/track` | Pending | BUG-001 in progress |
| `/challenges` | Pending | BUG-001 in progress |
| `/challenges/[id]` | Pending | BUG-001 in progress |
| `/sign-in` | Pending | BUG-001 in progress |
| `/dashboard/department/[dept]` | Pending | BUG-004, BUG-005 |
| `/dashboard/innovation` | Pending | BUG-004, BUG-005 |
| `/dashboard/university` | Pending | BUG-004, BUG-005 |
| `/dashboard/industry` | Pending | BUG-004, BUG-005 |
| `/dashboard/admin` | Pending | BUG-004, BUG-005 |
| `/dev/shell-testbench` | Pending | Dev-only verification |
