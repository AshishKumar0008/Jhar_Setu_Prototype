Read `AGENTS.md` before starting. Read `ui-context.md` and
`00-master-reference.md` before this chapter.

## Root Cause (log this, don't just patch the symptom)

`ui-context.md` already specifies the correct pattern: *"Report
wizard: 4-step linear flow (Describe → Where/When → Evidence →
Review & Submit) with persistent progress indicator."* The Report
Wizard section of `03-public-pages.md` contradicted this — it
described a "Step 1 of 2" progress bar but then listed every field
(voice/text, description, photo, location, category, mobile number,
review) under that single step. The agent built the contradictory
version. **This section of `03-public-pages.md` is now superseded by
this chapter** — update the status note there if your tooling tracks
it.

A second, separate problem in the current page: the "test sample
civic problems" buttons are a developer/demo convenience, not
something a real citizen should see prominently in their flow. Mixing
demo aids into the primary interface is part of why it reads as
cluttered and "AI-generated looking" rather than a real government
form.

## The Correct 4-Step Structure

One step's fields are visible at a time. The left rail (quick nav,
privacy note, platform identity, helplines) and the right info panel
(Grievance Resolution Process) stay visible throughout — they are not
the clutter, the all-at-once main form is. A numbered step indicator
sits above the step content, always visible, showing current step and
percent complete.

### Step 1 — "Tell us what happened"
- Icon: `MessageSquare` or `FileText`
- Voice / Text toggle (two large cards, as already built — this part
  was fine)
- Description textarea, shown once an input mode is picked
- Category chips (Water, Roads, Health, Agriculture, Education,
  Environment, Other, Not sure) — one large icon per chip, not just
  text, so a low-literacy user can recognize the category visually
  before reading the label
- Nothing else on this step — no photo, no location, no mobile number

### Step 2 — "Where did this happen?"
- Icon: `MapPin`
- `Use My Location` / `Choose on Map` (Leaflet, per
  `09-maps-integration.md`) / `Use Village Name Only` — three large
  buttons, same as already built
- Nothing else on this step

### Step 3 — "Add a photo (optional but helpful)"
- Icon: `Camera` or `Image`
- The upload dropzone + Gemini Vision badge — same component already
  built
- A citizen can tap `Skip this step` — evidence is optional, the step
  must not block progress if skipped
- **The "test sample civic problems" quick-fill buttons move here,
  but only render when a `NEXT_PUBLIC_DEMO_MODE=true` env flag is set**
  — never visible to a real citizen in a production build. Style them
  visually distinct (e.g. a dashed-border "Demo" panel) so even in
  demo mode they read as a testing aid, not a real feature.

### Step 4 — "Review & Submit"
- Icon: `CheckCircle`
- Mobile number field (for SMS tracking) lives here — it's the last
  piece of contact info needed before submitting, not earlier
- Summary block: description, category, coarse location, photo
  thumbnail if attached
- **The AI Detection card moves here, and only here** — showing
  Gemini's suggested category/path/confidence as a labeled AI
  suggestion (reuse the AI-suggestion badge), so the citizen sees what
  the system understood before submitting, without it cluttering the
  earlier data-entry steps
- `Submit Report` (solid, primary) and `Save Draft` (outline) buttons

## Stepper Component Requirements

Build (or fix) one shared component, `components/patterns/step-
wizard.tsx`, used by this flow:

- Numbered indicator (1–4), current step visually distinct
  (filled/bold per `ui-context.md`'s "never color alone" rule — pair
  the active-state color with a filled circle or checkmark, not just
  a color change)
- Percent-complete bar under the numbers, consistent with the existing
  progress bar already built
- `Back` / `Next` buttons at the bottom of each step — `Next` is
  disabled until that step's required fields are filled (description
  in Step 1, location in Step 2; Steps 3 and 4 have no hard
  requirement to advance)
- `Save Draft` available from any step, not just the last one
- Large touch targets throughout (44px minimum, per `ui-context.md`)
  — this is a form meant to work for a citizen on a low-end phone,
  one-handed

## What Does NOT Change

- The left rail, right info panel, colors, tokens, and typography are
  already correct — do not redesign those
- The underlying fields, validation, and submit logic stay the same —
  this chapter only changes how they're grouped and revealed, not what
  data is collected
- Voice/text toggle, map picker, photo dropzone components are already
  built correctly — reuse them inside the new step structure, don't
  rebuild them

## Check When Done

- Only one step's fields are visible on screen at any time — no
  scrolling past a wall of unrelated fields
- The AI Detection card never appears before Step 4
- Demo sample-photo buttons are invisible in a production build
  (`NEXT_PUBLIC_DEMO_MODE` unset or false) and visually marked as a
  testing aid when they do appear
- `Back`/`Next` work correctly, data persists across steps (going back
  to Step 1 doesn't lose Step 2's location pick)
- `Save Draft` works from any step
- A person unfamiliar with the product can look at Step 1 alone and
  understand what to do without reading a paragraph of instructions —
  icons carry meaning, not just text
