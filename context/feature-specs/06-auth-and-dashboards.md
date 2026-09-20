Read `AGENTS.md` before starting. Read `00-master-reference.md` first
— this chapter changes the role list declared in `02-app-shell.md` and
must be reflected back into `progress-tracker.md` and
`00-master-reference.md` after implementing, per that file's §8 Change
Control.

## Why This Change (logged, not silent)

The original blueprint had 7 roles: Citizen, Assisted operator,
Reviewer, Department officer, Government, University, Industry/CSR,
Admin. For the one-day MVP this collapses to 5 **authenticated**
roles, for two reasons:

1. **Citizens never authenticate.** This is a genuine improvement, not
   just a shortcut — low-friction public intake is the whole point of
   the platform, and building secure citizen auth today wasn't
   feasible anyway.
2. **Reviewer's decision-card duties and Government's approval duties
   merge into INNOVATION_CELL.** A real Jharkhand innovation cell
   plausibly does both triage and final approval as one team. This
   cuts one dashboard from today's build. **Revisit splitting these
   back apart post-MVP** for separation-of-duties reasons — note this
   in `progress-tracker.md`'s Open Questions, don't just lose it.

Assisted-operator submission is also cut for today (it required an
authenticated operator role that no longer exists) — citizens submit
and track entirely on their own.

## Role Set (supersedes the 6-role list in `02-app-shell.md`)

- `ADMIN`
- `DEPARTMENT_OFFICER` (+ `department` attribute: `energy`, `pwd`,
  `water`, `health`, etc. — lowercase slugs)
- `INNOVATION_CELL`
- `UNIVERSITY`
- `INDUSTRY`

Citizen and Assisted Operator are no longer authenticated roles.

---

## Part 1 — Auth Refactor (Clerk)

### Landing Page

Reconciling this instruction with the existing homepage design from
`03-public-pages.md`: the navbar's existing `Sign in / प्रवेश` button
(already spec'd in `02-app-shell.md`) becomes the "Officer Sign In"
action, pointing to `/sign-in`. The homepage's three hero action cards
reduce from three to two — drop "Get Help Submitting" (it assumed an
assisted-operator flow that no longer exists) and keep only:

1. **Report a Problem** → `/report` (public) — note: this may already
   exist as `/report/new`, keep that path, don't rename mid-project
2. **Track My Report** → `/track` (public, Report ID + phone lookup —
   this replaces the earlier case-ID + recovery-phrase model for
   simplicity; phone was already collected in the wizard for SMS
   tracking, so this reuses existing data)

"Officer Sign In" lives in the navbar, not as a third hero card — this
keeps the citizen-facing hero focused on citizens, while still
satisfying "three primary actions total on the page."

### Clerk Setup

```bash
npm install @clerk/nextjs
```

Set `role` and (for `DEPARTMENT_OFFICER` only) `department` in each
user's Clerk `publicMetadata`. Role/department are set only via
Clerk's own dashboard by an admin, out of band — **no frontend control
anywhere sets or changes these fields.**

```ts
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
```

```ts
// lib/auth-redirect.ts
type Role = "ADMIN" | "DEPARTMENT_OFFICER" | "INNOVATION_CELL" | "UNIVERSITY" | "INDUSTRY";

export function getDashboardPath(role: Role, department?: string): string {
  switch (role) {
    case "ADMIN": return "/dashboard/admin";
    case "INNOVATION_CELL": return "/dashboard/innovation";
    case "UNIVERSITY": return "/dashboard/university";
    case "INDUSTRY": return "/dashboard/industry";
    case "DEPARTMENT_OFFICER":
      if (!department) throw new Error("DEPARTMENT_OFFICER missing department in publicMetadata");
      return `/dashboard/department/${department.toLowerCase()}`;
  }
}
```

```tsx
// app/sign-in/[[...sign-in]]/page.tsx — after Clerk sign-in completes,
// a server component/layout reads sessionClaims.publicMetadata and
// redirects using getDashboardPath(). Use Clerk's afterSignInUrl flow
// or a dedicated /dashboard/route.ts that reads auth() and redirects.
```

### Route Protection

- `/dashboard/department/[department]/**` — requires
  `role === "DEPARTMENT_OFFICER"` **and** the URL's `department` param
  must match the signed-in user's own `department`. Mismatch →
  redirect to their correct department path, not just hide UI —
  enforce this server-side (layout or route handler), matching
  `architecture.md`'s "API is the real enforcement point" rule.
- `/dashboard/admin/**` — `ADMIN` only
- `/dashboard/innovation/**` — `INNOVATION_CELL` only
- `/dashboard/university/**` — `UNIVERSITY` only
- `/dashboard/industry/**` — `INDUSTRY` only

### Remove

- All citizen OTP/anonymous-session auth code
- The manual role-switch buttons on any production page (the
  `/dev/shell-testbench` can keep a role switcher for component
  testing, but update its role list to the 5 roles above — drop
  Citizen, Reviewer, Government from it)
- Assisted-operator authenticated role and its left-rail entry point

---

## Part 2 — Dashboard Feature Specs

What each stakeholder actually needs day to day, not a generic CRUD
list. Every dashboard reuses the navbar/sidebar/badge/tab components
from `01-design-system.md`/`02-app-shell.md` — no new one-off styles.

### DEPARTMENT_OFFICER — `/dashboard/department/[department]`

Purpose: manage only their department's Path B cases.

- **Action-needed queue**: count of new + overdue cases, SLA countdown
- **Case list**: Case ID, redacted summary, category, coarse location,
  submitted date, SLA status (on-time/overdue badge)
- **Case detail**: redacted evidence + photo + coarse map pin, AI
  extraction shown with the AI-suggestion badge (never presented as
  fact), actions: `Acknowledge`, `Assign to field staff`, `Post
  update` (text + photo), `Mark Resolved` (requires resolution note +
  evidence — no resolving without proof, per your existing pattern)
- **SLA/Overdue tab**: same list, filtered and sorted by urgency
- Cannot see other departments' cases or any Path C data. Small trust
  note on every case: "Routed by JharSetu, confirmed by Innovation
  Cell" — so the officer understands a human already checked this.

### INNOVATION_CELL — `/dashboard/innovation`

Purpose: the busiest dashboard — combines the old Reviewer decision
card and Government approval role into one workspace, as tabs:

1. **Intake Triage** — this *is* the decision card built earlier
   (reuse it, don't rebuild): AI suggestion + confidence badge, buttons
   `Confirm Path A` / `Confirm Path B (pick department)` / `Propose
   Path C (reason required)`
2. **Path C Pipeline** — status-tab view using existing badge tokens:
   Candidate → Evidence Verified → IGC Issued → Passport Published →
   Matching → University Proposals → Commitments → Pilot Ready →
   Pilot Active → Evaluation → Adopted
3. **University Proposals** — review concept notes, `Approve` /
   `Request Revision` / `Reject`, reason required
4. **Commitments** — read-only oversight of industry commitments
   (industry submits their own, this is just visibility)
5. **Pilot Validation** — the Pilot Readiness checklist screen (per
   the blueprint's Section 11), `Approve pilot readiness` / `Request
   revision`
6. **Adoption** — final `Approve adoption` / `Iterate` / `Stop`,
   generates a simple Adoption Dossier summary (a read view/export is
   enough for the MVP, no PDF generation required today)

### UNIVERSITY — `/dashboard/university`

- **Capability Card editor** (their own profile: domain, lab, mentor
  availability) — prompt to fill this out on first login, since
  matching depends on it existing
- **Challenge marketplace**: Path C challenges matched to them
  (public-safe Passport view only), with match score + Gemini
  reasoning shown
- **Express Interest / Submit Concept Note**: approach, team,
  milestone plan, required support
- **My Proposals**: status per submission (submitted / revision
  requested / approved)
- **Notifications**: new match, revision requested, partner commitment
  confirmed (via the SSE layer from `00-master-reference.md` §6)

### INDUSTRY — `/dashboard/industry`

- **Organization profile**: verification status, authorized signatory
- **Challenge marketplace**: same public-safe Passport view, filtered
  to challenges seeking industry/CSR support
- **Record Commitment**: type (mentor hours / equipment / funding),
  amount or in-kind description; status starts `PENDING`, flips to
  `CONFIRMED` only after their own org approver confirms — a logo
  alone is never a commitment
- **Commitment Ledger**: their own commitments + status, `Withdraw`
  (requires reason, notifies the government/innovation-cell owner)
- **Impact reports**: read-only view of pilots they're supporting

### ADMIN — `/dashboard/admin`

Purpose: platform oversight, not casework.

- **User/org list**: Clerk users with role + department, org
  verification status for university/industry accounts. This is a
  **read-only view with a link into Clerk's own dashboard** for
  role/department edits — don't build a role-editing UI today, Clerk
  already has one.
- **System health**: report counts by path and by status
- **Audit search**: filterable view over `lib/workflow.ts`'s audit
  array (actor, action, before/after state, reason)
- **Seed data reset**: dev convenience button to regenerate demo data
  between rehearsal run-throughs (wraps a reset of the `lowdb` file
  from `00-master-reference.md` §6)

---

## Data Model Additions

- Reports need an `assignedDepartment` field (lowercase slug) for
  `DEPARTMENT_OFFICER` filtering — set when Innovation Cell confirms
  Path B.
- Users are identified by Clerk `userId`; role/department are read
  from `publicMetadata` at request time, not duplicated into your own
  store unless you need to join against it for display — if you do
  cache it, treat Clerk as the source of truth and refresh on login.

## Check When Done

- Landing page shows exactly: Report a Problem, Track My Report
  (hero cards) + Officer Sign In (navbar) — nothing else
- A citizen completes Report + Track without ever touching Clerk
- Officer sign-in redirects correctly per role, and per department
  slug for `DEPARTMENT_OFFICER`
- Visiting another department's dashboard URL redirects/blocks
  server-side — not just hidden via client UI
- No manual role-switch control exists on any production route (only
  on `/dev/shell-testbench`, and its role list matches the 5 roles
  above)
- Innovation Cell's Intake Triage tab reuses the existing decision-card
  component built for "Reviewer" — confirm it wasn't rebuilt from
  scratch
- All 5 dashboards use the shared navbar/sidebar/badge/tab components

## After Implementing

- Update `progress-tracker.md`: log the role-consolidation decision
  under Architecture Decisions, and add "revisit Reviewer/Government
  split post-MVP" to Open Questions
- Update `00-master-reference.md`: role list, route map, and Document
  Map status for this chapter
