Read `AGENTS.md` before starting. Read `00-master-reference.md` in
full, then every file in `context/feature-specs/` (01 through 07), in
order, before touching any code. Do not skip this — every bug below
exists because a previous session built against a partial or
misremembered version of the spec instead of the actual files.

## Root Rule: No Action Without Verification

This overrides normal working speed for this session. Going forward:

- **"Done" means tested, not written.** Do not mark anything fixed
  because the code looks correct on reading — load the actual page in
  a browser, click the actual button, and confirm the actual result
  before calling it fixed.
- **Do not guess at intended behavior.** If a spec file doesn't cover
  something you find broken, stop and log it as an open question in
  `progress-tracker.md` instead of inventing a fix.
- **Every bug gets logged in `current-issues.md` before you fix it**,
  using the existing ID/format convention in that file — not fixed
  silently, not described only in chat. This session's job is to leave
  a paper trail, not just a working app.
- **Every fix gets verified after, by reloading and re-testing**, then
  moved to `current-issues.md`'s Resolved section with what actually
  changed.

## Known Critical Bugs (confirmed by screenshot, start here)

### BUG-001 — i18n translation keys rendering literally, sitewide

**Symptom**: Text across `/report/new` (and likely other pages) shows
raw dictionary keys instead of real copy — `reportWizard.title`,
`reportWizard.subtitle`, `reportWizard.rule1`, `reportWizard.
suggestedRouting`, etc. are visible as literal on-screen text in both
English and Hindi toggle states.

**Do not patch this page by page.** This is a translation-provider
failure, not a per-component typo. Audit in this order:

1. Confirm translation dictionary files actually exist for both `en`
   and `hi` and actually contain a `reportWizard.*` namespace with
   real values — not empty, not a stub.
2. Confirm the i18n provider (whatever library is in use) wraps the
   entire app at the root layout, not just some pages.
3. Confirm every component calling `t("reportWizard.title")` (or
   equivalent) is using the hook/function correctly — a key rendering
   literally almost always means either the provider isn't in context
   at that render point, or the key doesn't exist in the loaded
   dictionary and the library is falling back to printing the key
   itself.
4. Search the whole codebase for every place this same pattern could
   occur (`grep -rn "t(\"" apps/web` or equivalent) and verify each one
   against the dictionary, not just the Report Wizard.
5. Remove any fallback behavior that silently renders a bare key —
   fail loudly in dev (console warning) instead, so this class of bug
   is caught immediately next time, not discovered days later in a
   screenshot.

### BUG-002 — Gemini vision classification hardcoded/not functioning

**Symptom**: The "AI Detection" card always shows `Path B` at a fixed
95% confidence, regardless of which sample photo is used (Broken
Roads, Contaminated Water, Exposed Health hazard, Cracked Education
building all likely produce the same output, or the classification
logic isn't actually being exercised).

**Fix and verify**:
1. Confirm `/api/analyze-report` is actually calling Gemini with
   `responseSchema` as specified in `00-master-reference.md` §4 — not
   returning a stubbed/mocked response left over from early
   development.
2. Test with each of the four sample photos individually and confirm
   the `suggestedPath`, `confidence`, and `detectedProblem` fields
   actually differ per image — if they don't, the call either isn't
   reaching Gemini or the prompt/schema is malformed.
3. Confirm the UI renders whatever the API actually returns, not a
   hardcoded placeholder left in the component from before the API was
   wired up.

### BUG-003 — Buttons present but non-functional or produce no visible result

Audit every clickable element sitewide (not just Report Wizard):
- Does it have a real handler, or is it a leftover placeholder?
- Does the handler call a real endpoint / perform real navigation?
- Is there a loading state, a success state, and an error state — or
  does a click just do nothing visible either way?

Log every dead button found as its own `current-issues.md` entry
(e.g. `BUG-003a`, `BUG-003b`) with the exact page and button label —
don't bundle unrelated dead buttons into one vague issue.

### BUG-004 — No real data sync between citizen submission and dashboards

Per `07-dashboard-pages.md`'s worked example: a citizen's report
should flow through triage into the correct department's dashboard
live. Audit whether this pipe actually exists or whether dashboards
are showing static/seed data disconnected from real submissions.
**Test it directly**: submit a real report through the actual form,
then check whether it appears in Innovation Cell's triage queue, and
whether confirming a path actually notifies the right department —
don't infer this from reading the code, run it.

### BUG-005 — Auth/login bugs across roles

Audit against `06-auth-and-dashboards.md`:
- Does sign-in actually redirect to the correct role/department
  dashboard, or drop everyone into the generic "no role assigned"
  fallback regardless of their actual Clerk metadata?
- Does visiting another department's URL actually get blocked
  server-side, or only hidden client-side (test by editing the URL
  directly, not just clicking through the UI)?
- Is the manual "demo access" picker appearing on routes it shouldn't,
  or missing the server-side auth check entirely?

## Full Site Audit Checklist

For every route below, confirm: loads with no console errors, no raw
i18n keys visible in either language, every visible button produces a
real, visible effect, layout matches the relevant spec chapter, and
any data shown is either real or explicitly labeled as demo/seed data.

**Public**: `/`, `/report/new`, `/track`, `/challenges`,
`/challenges/[id]`, `/sign-in`

**Dashboards** (test both correct-role access and wrong-role/no-role
access for each): `/dashboard/department/[department]`,
`/dashboard/innovation`, `/dashboard/university`,
`/dashboard/industry`, `/dashboard/admin`

**Dev-only**: `/dev/shell-testbench` (confirm it is NOT linked from
any production page, per earlier chapters)

For each route, write the result (pass/fail + issue IDs if failed)
into a new "Site Audit Results" section at the bottom of
`current-issues.md` — this becomes the record of what was actually
checked, not just what was fixed.

## Testing Protocol — How to Verify, Not Assume

1. For every route: navigate to it in a real browser, click every
   interactive element, confirm the expected result, check the
   console for errors.
2. For the core loop specifically: submit one real test report,
   confirm it appears in Innovation Cell's queue, confirm a path,
   confirm it appears on the correct department dashboard — as a full
   live run-through, not a code trace.
3. Test both languages (English/Hindi toggle) on every public page —
   BUG-001 may be language-specific, confirm it isn't.
4. Test both a valid-role user and a no-metadata user against every
   dashboard route.

## Update Discipline

- Every bug found this session → logged in `current-issues.md` first
- Every fix → re-verified by reloading, then moved to Resolved with a
  one-line note on what changed
- `progress-tracker.md` updated honestly at the end — if something is
  still broken, say so in Open Questions, don't mark the phase
  "Completed"

## Final Deliverable for This Session

- `current-issues.md` fully populated with every bug found (not just
  BUG-001 through BUG-005 — anything else discovered during the audit)
- BUG-001 and BUG-002 fixed and verified sitewide, not just on the
  Report Wizard
- The citizen → Innovation Cell → department notification loop from
  `07-dashboard-pages.md` demonstrated working live, in this session
- `progress-tracker.md` reflecting the real, current state — no
  optimistic status
