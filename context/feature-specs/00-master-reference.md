# JharSetu — Master Project Reference

This file is the single source of truth for what JharSetu is, what has
been decided, what is being built today, and where every other detail
lives. If any instruction to the coding agent conflicts with this
file, **this file wins** — update it first, then act, never the
reverse. No file in this project should change without this file
being updated in the same session.

## 0. Document Map

Read in this order. Do not skip any file before implementing.

| File | Purpose | Status |
| ---- | ------- | ------ |
| `project-overview.md` | What JharSetu is, goals, scope, success criteria | Stable |
| `architecture.md` | Target production system boundaries + invariants | Stable, see §2 for MVP deviation |
| `tech-stack.md` | Target production stack (NestJS + FastAPI + Postgres) | Stable, see §2 for MVP deviation |
| `code-standards.md` | Coding conventions | Stable |
| `ui-context.md` | Design tokens, typography, layout patterns | Stable, extended by feature-specs |
| `ai-workflow-rules.md` | How the coding agent should work | Stable |
| `progress-tracker.md` | What's built, what's next, open questions | Update every session |
| `current-issues.md` | Known bugs/mismatches against spec | Update every session |
| `context/feature-specs/01-design-system.md` | shadcn setup, civic visual language | Implemented |
| `context/feature-specs/02-app-shell.md` | Navbar, role sidebar, badges, tabs, dialog | Implemented |
| `context/feature-specs/03-public-pages.md` | Home page, Report Wizard | Implemented (ISSUE-001 open, see `current-issues.md`) |
| `context/feature-specs/04-track-and-challenges.md` | Track Report, Public Challenges | Implemented |
| `context/feature-specs/05-ai-workflow.md` | Part A/B/C AI pipeline (this document's companion) | **Build next — see §3–5** |
| Workflow + notification plumbing | `lib/workflow.ts`, `lib/notify.ts`, `data/db.json` | Implemented |

## 1. Non-Negotiable Invariants (apply regardless of architecture)

These come from `architecture.md` and hold even under the MVP
fast-path in §2 — they are never scoped away, only the infrastructure
implementing them changes:

1. **AI never decides.** It returns a labeled suggestion with a
   confidence score. A human click is what changes state. No
   exceptions, no confidence threshold that auto-routes.
2. Every human decision carries a reason/rationale, is timestamped,
   and is auditable — even if "audit" today just means an array entry
   with a timestamp instead of a full `audit_events` table.
3. AI-derived claims (scheme match, department suggestion, university
   ranking) are never presented as fact — always with the AI-suggestion
   badge from `01-design-system.md`.
4. Never claim a live government integration, SMS delivery, or
   partner commitment that isn't real. Seeded/demo data is always
   labeled as such.
5. No PII or exact location leaks into any public-facing view
   (Public Challenges, published Passport).

## 2. Architecture Decision: MVP Fast-Path vs. Target Production

**Target production architecture** (documented in `architecture.md`
and `tech-stack.md`): NestJS API + FastAPI AI worker + PostgreSQL +
PostGIS/pgvector + Redis/BullMQ + self-hosted model set
(faster-whisper, Qwen2.5, BGE-M3, Presidio).

**MVP fast-path (what is actually being built today, one-day
timeline):** Next.js API routes only, calling the Gemini API directly
for every AI task. No NestJS, no FastAPI worker, no Postgres unless
already running — seed data lives in JSON files under `/data`, and
report/notification state lives in a simple in-memory or JSON-backed
store for the demo.

This is a deliberate, logged scope-cut, not a silent contradiction.
Reasons:
- Six-developer / multi-service timeline is not achievable in one day.
- Gemini's multimodal + structured-output (`responseSchema`) API
  covers transcription-adjacent text handling, classification,
  extraction, and ranking in a handful of calls, which is sufficient
  to demonstrate the decision pipeline end to end.
- The invariant that matters for the pitch — "AI suggests, humans
  decide" — is fully preserved under this fast-path; only the
  self-hosted model infrastructure is swapped for a hosted API call.

**What does NOT change:** the product behavior, the three-path
decision logic (A/B/C), the badge/token system, the route map from
`03-public-pages.md`/`04-track-and-challenges.md`, and every invariant
in §1.

**What changes for today only:**
- `apps/api` (NestJS) and `apps/ai-worker` (FastAPI) are not built.
  Their responsibilities move into Next.js API routes under `app/api/`.
- PostgreSQL is not required today. If it's already running from
  earlier work, use it; if not, use JSON files under `/data` (seed
  schemes, universities) and a simple JS object/array store for
  reports and notifications, clearly commented as `// MVP fast-path:
  replace with Postgres per architecture.md before production`.
- The self-hosted model set in `tech-stack.md` is replaced by Gemini
  (`gemini-2.0-flash`) for every AI task listed in §3–5.

This decision must be reflected in `progress-tracker.md` under
"Architecture Decisions" — if it isn't there yet, add it before
building anything else today.

## 3. Part A — Known Service Guide

**Problem it solves:** A citizen asks a question that already has a
known answer (scholarship criteria, loan process), not a new problem
report. This is a Q&A lookup, not a classification/routing task — do
not route Part A through the same pipeline as B/C.

- **Data**: `/data/schemes.json` — seeded list of real scheme names,
  eligibility, steps, and official links.
- **Endpoint**: `POST /api/known-service` — Gemini call, grounded
  strictly to `schemes.json` via prompt instruction ("only use the
  data below, never invent a scheme/deadline/link"), returns
  `{ isKnownServiceMatch, matchedSchemeId, answer, steps,
  officialLink, confidence }` via `responseSchema`.
- **UI**: a question box on the citizen entry flow (before or
  alongside "Report a Problem"). If `isKnownServiceMatch` is true,
  show the Path A badge, the answer, numbered steps, and the official
  link. If false, show the honest "not found" message and a button
  that hands off directly into the Report Wizard (`/report/new`) —
  this is the real connective tissue between Part A and Part B/C, do
  not build them as disconnected screens.

## 4. Part B — Grievance Routing

**Problem it solves:** A genuine new problem report that a specific
government department is responsible for (not a new-solution case).

- **Endpoint**: `POST /api/analyze-report` — single Gemini multimodal
  call (text + optional photo), grounded with a short list of recent
  existing reports for duplicate/cluster comparison, returns
  `{ category, summary, severity, suggestedPath, pathReasoning,
  suggestedDepartment, isLikelyDuplicate, duplicateOfReportId,
  confidence }` via `responseSchema`. This one endpoint also produces
  the Part C signal (`suggestedPath: "C"`) — do not build a second
  classification call for Part C, it's the same analysis.
- **Human step**: reviewer screen shows the suggestion with the
  AI-suggestion badge, reviewer clicks Confirm Path B (or overrides to
  A/C) with a reason. This click is what creates the actual authority
  case / notification — never automatic.
- **Notification**: on confirmation, insert a row into the
  notifications store (JSON/array is fine for today) associated with
  the suggested department; render as a simple inbox/badge count on
  that role's dashboard. No real SMS/email today — this matches the
  open question already logged in `progress-tracker.md`.

## 5. Part C — Innovation Cell Workflow

**Problem it solves:** A verified recurring gap that should go to
university + industry, with a human checkpoint at every hand-off.

Sequence (all steps are human-confirmed button clicks; Gemini is only
consulted where marked):

1. Reviewer confirms Path C (from §4's suggestion) → this is the
   Innovation Gap Certificate moment. Skip building the second-reviewer
   evidence-rule check from the blueprint today — log this as a scope
   cut in `progress-tracker.md`, not a silent omission.
2. `POST /api/rank-universities` — Gemini call, grounded to a seeded
   `/data/universities.json` (3–4 fake capability cards: name, domain,
   lab access), returns `{ rankedMatches: [{ universityName,
   matchScore, reasoning }] }`.
3. Reviewer/government selects a university from the ranked list
   (never auto-selected) → notification inserted for that university's
   dashboard.
4. Innovation cell verify step: a simple Approve/Reject screen with a
   reason field — this is a human decision, no Gemini call needed.
5. Industry commitment: a simple form (partner name, resource,
   amount/in-kind, status PENDING→CONFIRMED) — matches the Commitment
   Ledger concept from the original blueprint, simplified to a single
   form for today.
6. "Launch" = a status flip to `PILOT_READY`/`PILOT_ACTIVE` using the
   existing status badge tokens from `01-design-system.md` — no new
   badge colors needed, reuse what's already built.

## 6. Workflow & Notification Layer (MVP Fast-Path)

This is the plumbing that connects §3–5's Gemini suggestions to real
state changes and real dashboard updates. Decide this once, here —
do not let it drift into ad hoc `useState` per screen.

**State/workflow engine**: no state-machine library needed today.
Define states and allowed transitions as a plain TypeScript map in
`lib/workflow.ts`. A single `transition()` function checks the actor's
role, the current state, and whether the target state is an allowed
transition from it; it appends `{ from, to, actor, reason, timestamp }`
to an in-record audit array and rejects anything not explicitly
listed. This satisfies §1's audit/reason-code invariant without
NestJS's guarded-endpoint machinery — the guard just lives in one
function instead of a framework layer.

**Data store**: `lowdb` (JSON-file backed, `npm install lowdb`) writing
to `/data/db.json`. Zero config, survives restarts, and is trivial to
reset between demo run-throughs by deleting the file. This is the
concrete implementation of the "/data JSON files" fast-path already
declared in §2 — reports, notifications, and workflow state all live
here as collections in one file. If PostgreSQL from an earlier phase
is already running, use that via Prisma instead — never run two data
stores at once.

**Notification delivery — Server-Sent Events (SSE), not a third-party
service.** Recommended because:
- Zero new dependencies, no signup, no API key — native to Next.js
  Route Handlers and the browser's `EventSource`.
- Genuinely stronger for the demo than polling: a reviewer confirming
  Path B causes the department dashboard's badge to update live, in
  front of judges, with no page refresh.
- Fallback if SSE causes trouble under time pressure: poll every 5s
  with SWR (`useSWR(key, fetcher, { refreshInterval: 5000 })`) — still
  correct, just not visibly "live."

```ts
// lib/notify.ts — in-memory pub/sub, good enough for one demo session
type Listener = (n: unknown) => void;
const listeners: Record<string, Listener[]> = {};

export function subscribeToNotifications(role: string, cb: Listener) {
  (listeners[role] ??= []).push(cb);
  return () => { listeners[role] = listeners[role].filter(l => l !== cb); };
}
export function notify(role: string, payload: unknown) {
  listeners[role]?.forEach(cb => cb(payload));
  // also persist to lowdb here so a fresh dashboard load shows history
}
```

```ts
// app/api/notifications/stream/route.ts
export async function GET(req: Request) {
  const role = new URL(req.url).searchParams.get("role")!;
  const stream = new ReadableStream({
    start(controller) {
      const send = (data: unknown) =>
        controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
      const unsubscribe = subscribeToNotifications(role, send);
      req.signal.addEventListener("abort", unsubscribe);
    },
  });
  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
  });
}
```

```tsx
// client side, per dashboard
useEffect(() => {
  const es = new EventSource(`/api/notifications/stream?role=${role}`);
  es.onmessage = (e) => setNotifications(prev => [JSON.parse(e.data), ...prev]);
  return () => es.close();
}, [role]);
```

**Caveat, log it, don't hide it**: this in-memory pub/sub only works
within a single Node process — fine for `next dev` / one demo instance,
breaks across multiple server instances. That's an explicit fast-path
tradeoff for today, not an oversight; note it in
`progress-tracker.md`'s Open Questions if it isn't already implied by
§2.

**UI**: reuse the existing `status-badge.tsx` pattern for an unread-
count badge on each role's sidebar entry, and the civic dialog pattern
from `01-design-system.md` for the notification list/dropdown — do not
design a new notification component style.

## 7. Full Route Map (consolidated, current target)

| Route | Chapter | Status |
| ----- | ------- | ------ |
| `/` | 03-public-pages.md | Implemented |
| `/report/new` | 03-public-pages.md | Implemented |
| `/track` | 04-track-and-challenges.md | Implemented |
| `/challenges` | 04-track-and-challenges.md | Implemented |
| `/challenges/[id]` | 04-track-and-challenges.md | Implemented (stub) |
| `/dev/shell-testbench` | 02-app-shell.md | Implemented, dev-only |
| `/api/reports` | §6 workflow | Implemented |
| `/api/reports/[id]/transition` | §6 workflow | Implemented |
| `/api/notifications/stream` | §6 workflow | Implemented |
| `/api/notifications` | §6 workflow | Implemented |
| `/api/known-service` | this file §3 | Build next |
| `/api/analyze-report` | this file §4 | Build next |
| `/api/rank-universities` | this file §5 | Build next |
| Reviewer/department/government/university/industry/admin dashboards | future chapters | Not built — out of scope for today |

## 8. Change Control — Read Before Editing Anything

- Do not invent product behavior, screens, or scope changes not
  written in this file or the chapter files it points to.
- If a requirement is ambiguous, resolve it in this file (or the
  relevant chapter) before implementing — never guess silently.
- Any deviation from the target architecture (§2) must be logged here
  under §2 and mirrored into `progress-tracker.md` — never make an
  architecture change in code alone.
- Any new bug or mismatch goes in `current-issues.md`, following its
  existing ID/format convention — do not track bugs in comments or
  chat only.
- After finishing any unit of work, update `progress-tracker.md`
  ("Completed" / "Next Up") and re-check this file's Document Map
  status column — if a chapter moved from "Pending" to "Implemented,"
  update the table here in the same session.
- `npm run build` must pass before a unit is considered done, per
  `ai-workflow-rules.md`.

## 9. Today's Build Order

1. Confirm/log the §2 architecture decision in `progress-tracker.md`.
2. Fix ISSUE-001 (left rail) if not already done — see
   `current-issues.md`.
3. Build §6's `lib/workflow.ts` and `lib/notify.ts` first — §3–5 all
   depend on this plumbing existing before their "human confirms →
   state changes → dashboard notified" steps can work.
4. Build §3 (Part A known-service guide) — smallest, fully isolated,
   good first win, does not depend on §6's notification layer.
5. Build §4 (Part B grievance routing) — reuse the same
   `/api/analyze-report` endpoint for the Path C signal; wire its
   confirm step through §6's `transition()` and `notify()`.
6. Build §5 (Part C innovation workflow) — depends on §4's suggestion
   output and §6's plumbing.
7. Wire the "not found" handoff in §3 into `/report/new`.
8. Finish `04-track-and-challenges.md` if time remains — it is public-
   facing polish, lower priority than a working A/B/C loop for the
   demo.
9. Update `progress-tracker.md` and this file's Document Map/Route Map
   status columns to reflect what actually got built.
