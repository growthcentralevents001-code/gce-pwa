# GCE UI Implementation Roadmap

| Field | Value |
|-------|-------|
| **Status** | Living — audit + ordered adoption of UI/UX 2.0 |
| **Date** | 2026-09-04 |
| **Owns** | KEEP / IMPROVE / REDESIGN / RETIRE for canonical routes; implementation order |
| **Does not own** | Business activation of inactive flags; production deploys |
| **Supersedes for route intent** | `docs/frontend/FRONTEND_ROUTE_MIGRATION_PLAN.md` as living target (that file remains Batch 10 redirect evidence) |

This is **not** a mandate to redesign the whole site in a single future task. Architecture 2.0 **site-wide migration of existing canonical UI** started 2026-09-04 (attention-first homes, Connect timeline, catalogue master–detail, Project Command Center composition).

- New UI follows UI/UX 2.0.
- Materially changed screens adopt 2.0 in the same change.
- Remaining KEEP screens stay until next touch.

Classifications describe **product UX intent**, not “delete the file today”. RETIRE means do not extend; keep redirects; remove from nav.

---

## Legend

| Class | Meaning |
|-------|---------|
| **KEEP** | Matches target metaphor well enough; maintain; no structural UX change required |
| **IMPROVE** | Canonical and useful; composition, nav, or copy should move toward 2.0 when next touched |
| **REDESIGN** | Canonical job, wrong metaphor or layout (KPI wall, landing-as-catalogue, settlement-first, no master–detail plan, etc.) |
| **RETIRE** | Legacy, inactive, duplicate, or redirected — not product UX |

Counts below are **route families** (dynamic `[id]` counted with parent).

| Class | Approx. families |
|-------|------------------|
| KEEP | ~70 |
| IMPROVE | ~45 |
| REDESIGN | ~12 |
| RETIRE | ~50+ (many already redirected) |

---

## Recommended implementation order

Do not activate inactive payments/rank to “complete” UI.

1. **Stop the bleed** — Do not extend RETIRE routes (`/admin/*`, `/dashboard/zbp`, `/dashboard/member`, Affiliate, `/dashboard/venue/events` WIP). Point all new work at canonical trees.
2. **Workspace homes** — Recompose `/dashboard/[workspaceKey]` and dedicated role homes as **attention-first** (reuse `PartnerActionCenter`). Highest leverage; no URL changes.
3. **Connect referral timeline** — Detail + hub as governed timeline (`/connect/leads/*`, `/desk/*`). Still not Kanban.
4. **Customer activity** — `/customer` home + claims in secondary nav; `personal` workspace links in, does not duplicate CX. No Wallet, no rank product.
5. **Venue operations home** — `/dashboard/venue` + `/venue/*` day-of-ops; ignore leftover `/dashboard/venue/*` CRUD.
6. **Enterprise Project Command Center** — Elevate `/enterprise/projects/[id]`; demote settlement on BDP/client homes.
7. **Marketplace catalogue** — When Events/Offers lists are materially rebuilt: desktop master–detail, mobile list→detail. `/marketplace` stays a vertical landing (IMPROVE copy, not a second catalogue).
8. **Ops hub / Finance home** — Queue-first and ledger-first polish (IMPROVE, not new IA).
9. **Public landings** — Progressive composition toward three-vertical story (home already closer). No decorative blue, no bento-everywhere.
10. **Delete dead sources** — Only with explicit Founder/ops approval after redirects remain (Phase 14B style). Not this documentation task.

---

## Public / marketing

| Route | Class | Notes |
|-------|-------|-------|
| `/` | **IMPROVE** | Three-vertical tiles exist; keep metaphor; avoid extra atmosphere on inner pages |
| `/connect` | **IMPROVE** | Vertical landing for Network + Workflow |
| `/marketplace` | **IMPROVE** | Vertical landing, not the catalogue; CTAs to Events/Offers/Venues |
| `/enterprise` | **IMPROVE** | Project + Milestone story; not settlement |
| `/events` | **KEEP** | Desktop master–detail; mobile list → full detail |
| `/events/[id]` | **KEEP** | Full detail; transaction continues in customer after auth |
| `/offers` | **KEEP** | Desktop master–detail; mobile list → full detail |
| `/offers/[id]` | **KEEP** | |
| `/venues` | **KEEP** | Directory |
| `/venues/[id]` | **KEEP** | |
| `/for-partners` | **KEEP** | Partner entry; no ZBP/Affiliate CTAs |
| `/memberships` | **KEEP** | Marketing |
| `/memberships/apply` | **KEEP** | |
| `/how-membership-works` | **KEEP** | |
| `/how-referrals` | **KEEP** | Explainer only — not Lead Assist product |
| `/about` | **KEEP** | |
| `/contact` | **KEEP** | |
| `/terms` | **KEEP** | |
| `/privacy` | **KEEP** | |
| `/offline` | **KEEP** | PWA |
| `/the-circle` | **RETIRE** | Routed alias + `/how-referrals` redirect only; do not nav |
| `/partners` | **RETIRE** | Use `/for-partners` |
| `/venue/plans` | **RETIRE** | Redirect → `/venue/apply` |
| `/zbp`, `/zbp/apply` | **RETIRE** | Redirect → `/for-partners` |
| `/affiliate`, `/affiliate/signup` | **RETIRE** | Inactive |
| `/bdm-dashboard` | **RETIRE** | |
| `/partner-dashboard` | **RETIRE** | Redirect |

---

## Auth / onboarding

| Route | Class | Notes |
|-------|-------|-------|
| `/login` | **KEEP** | |
| `/signup` | **KEEP** | |
| `/forgot-password` | **KEEP** | |
| `/auth/callback` | **KEEP** | |
| `/onboarding/profile` | **KEEP** | |
| `/apply/role` | **IMPROVE** | Approved intents only |
| `/unauthorized` | **KEEP** | Legacy/inactive sink |
| `/venue/apply` | **KEEP** | |
| `/enterprise/signup` | **IMPROVE** | Align naming with apply/role |

---

## Customer activity

| Route | Class | Notes |
|-------|-------|-------|
| `/customer` | **KEEP** | Attention-first activity; Trust Rank not productized |
| `/customer/events` | **KEEP** | Desktop master–detail; mobile list → detail |
| `/customer/events/[id]` | **KEEP** | |
| `/customer/events/[id]/book` | **KEEP** | Payments remain gated |
| `/customer/offers` | **KEEP** | Desktop master–detail; mobile list → detail |
| `/customer/offers/[id]` | **KEEP** | Claim, not purchase |
| `/customer/tickets` | **KEEP** | |
| `/customer/tickets/[id]` | **KEEP** | QR |
| `/customer/bookings` | **KEEP** | |
| `/customer/bookings/[id]` | **KEEP** | |
| `/customer/claims` | **KEEP** | In secondary customer nav |
| `/customer/wishlist` | **KEEP** | Secondary |
| `/customer/profile` | **IMPROVE** | Prefer `/settings/profile` as SoT |
| `/booking/[eventId]`, `/bookings`, `/checkout`, `/wishlist` | **RETIRE** | Redirects to customer |

Do **not** add `/customer/wallet`. Do not productize rank on these pages.

---

## Workspace homes & dashboard

| Route | Class | Notes |
|-------|-------|-------|
| `/dashboard` | **KEEP** | Assignment-scoped picker; not an activity dashboard |
| `/dashboard/[workspaceKey]` | **KEEP** | Attention-first fallback home (dedicated role homes remain canonical) |
| `/dashboard/connect-member` | **KEEP** | Attention-first |
| `/dashboard/connect-bdp` | **KEEP** | Attention-first |
| `/dashboard/marketplace-bdp` | **KEEP** | Attention-first |
| `/dashboard/venue` | **KEEP** | Day-of-ops attention first |
| `/dashboard/enterprise-bdp` | **KEEP** | Pipeline/attention first; commercial secondary |
| `/dashboard/enterprise-client` | **KEEP** | Project attention first |
| `/dashboard/enterprise` | **RETIRE** | Ambiguous; assignment-scoped routes exist |
| `/dashboard/finance` | **KEEP** | Ledger attention first |
| `/dashboard/platform-ops` | **IMPROVE** | Deep-link `/ops` |
| `/dashboard/opportunity-desk` | **IMPROVE** | Queue first |
| `/dashboard/compliance` | **KEEP** | |
| `/dashboard/support` | **KEEP** | |
| `/dashboard/personal` via `[workspaceKey]` | **IMPROVE** | Link to `/customer`; drop trust-rank as UX |
| `/dashboard/member`, `/dashboard/member/tickets` | **RETIRE** | Legacy wallet/credits UI |
| `/dashboard/user` | **RETIRE** | Redirect → `/customer` |
| `/dashboard/zbp`, `/dashboard/affiliate`, `/dashboard/bdm`, `/dashboard/franchisee` | **RETIRE** | Quarantine / unauthorized |
| `/dashboard/venue/events`, `/dashboard/venue/create-event`, `/dashboard/venue/bookings`, `/dashboard/venue/events/edit/[id]` | **RETIRE** | Use `/venue/(partner)/*` |

---

## Connect (member + BDP + desk)

| Route | Class | Notes |
|-------|-------|-------|
| `/connect/membership` | **KEEP** | |
| `/connect/circle` | **KEEP** | Network metaphor |
| `/connect/leads` | **IMPROVE** | Hub OK; reinforce timeline, not board |
| `/connect/leads/sent` | **KEEP** | |
| `/connect/leads/received` | **KEEP** | |
| `/connect/leads/[id]` | **KEEP** | Governed timeline + action strip first |
| `/connect/waitlist` | **KEEP** | |
| `/connect/transfer` | **KEEP** | |
| `/connect/specialisation` | **KEEP** | |
| `/connect/tags` | **KEEP** | |
| `/connect/governance` | **KEEP** | Role-gated |
| `/connect/onboarding` | **KEEP** | |
| `/connect-bdp` landing | **IMPROVE** | Prefer `/dashboard/connect-bdp` |
| `/connect-bdp/apply` | **KEEP** | |
| `/connect-bdp/unit` | **KEEP** | |
| `/connect-bdp/city` | **KEEP** | |
| `/connect-bdp/members` | **KEEP** | |
| `/connect-bdp/circles` | **KEEP** | |
| `/connect-bdp/targets` | **KEEP** | Operational, not fake KPIs |
| `/connect-bdp/entitlements` | **KEEP** | Read/dispute |
| `/connect-bdp/disputes` | **KEEP** | |
| `/connect-bdp/handover` | **KEEP** | |
| `/desk/queue` | **KEEP** | Queue metaphor |
| `/desk/leads/[id]` | **IMPROVE** | Same timeline language as member detail |

---

## Marketplace BDP + Venue ops

| Route | Class | Notes |
|-------|-------|-------|
| `/marketplace-bdp` landing | **IMPROVE** | Prefer dashboard |
| `/marketplace-bdp/apply` | **KEEP** | |
| `/marketplace-bdp/units` | **KEEP** | |
| `/marketplace-bdp/venues` | **KEEP** | Portfolio |
| `/marketplace-bdp/venues/[venueId]` | **KEEP** | |
| `/marketplace-bdp/attribution` | **KEEP** | |
| `/marketplace-bdp/recommendations` | **KEEP** | |
| `/marketplace-bdp/entitlements` | **KEEP** | |
| `/marketplace-bdp/reassignment` | **KEEP** | |
| `/venue/profile` | **KEEP** | |
| `/venue/events` | **KEEP** | Canonical ops |
| `/venue/events/new` | **KEEP** | |
| `/venue/events/[id]` | **KEEP** | |
| `/venue/offers` | **KEEP** | |
| `/venue/bookings` | **KEEP** | |
| `/venue/check-in` | **KEEP** | Queue + scan |
| `/venue/redemptions` | **KEEP** | |
| `/venue/performance` | **IMPROVE** | Real operational stats only |
| `/venue/entitlements` | **KEEP** | |

---

## Enterprise

| Route | Class | Notes |
|-------|-------|-------|
| `/enterprise/opportunities` | **IMPROVE** | Feed into projects |
| `/enterprise/requirements` | **KEEP** | |
| `/enterprise/proposals` | **KEEP** | |
| `/enterprise/quotes` | **KEEP** | Finance co-sign remains business rule |
| `/enterprise/projects` | **IMPROVE** | Portfolio into command center |
| `/enterprise/projects/[id]` | **KEEP** | Project Command Center composition |
| `/enterprise/vendors` | **KEEP** | |
| `/enterprise/disputes` | **KEEP** | |
| `/enterprise-bdp/apply` | **KEEP** | |
| `/enterprise-bdp/clients` | **KEEP** | |
| `/enterprise-bdp/pipeline` | **IMPROVE** | |
| `/enterprise-bdp/entitlements` | **KEEP** | Read-only |
| `/enterprise-bdp/handover` | **KEEP** | |
| `/enterprise-bdp/disputes` | **KEEP** | |
| `/enterprise-expert` | **IMPROVE** | Queue/attention |
| `/enterprise-expert/queue` | **KEEP** | |
| `/enterprise-expert/requirements` | **KEEP** | |
| `/enterprise-expert/proposals` | **KEEP** | |
| `/enterprise-expert/projects` | **IMPROVE** | Link to command center |
| `/enterprise-expert/vendors` | **KEEP** | |

---

## Ops / Finance / Settings

| Route | Class | Notes |
|-------|-------|-------|
| `/ops` | **KEEP** | Hub = awaiting review first |
| `/ops/approvals` | **KEEP** | |
| `/ops/exceptions` | **KEEP** | |
| `/ops/cases`, `/ops/cases/[id]` | **KEEP** | |
| `/ops/incidents` | **KEEP** | |
| `/ops/moderation` | **KEEP** | |
| `/ops/connect` (+ circles, meetings) | **KEEP** | |
| `/ops/marketplace` (+ venue/offer/unit) | **KEEP** | |
| `/ops/enterprise` | **KEEP** | |
| `/ops/finance` | **KEEP** | Entry only |
| `/ops/compliance` | **KEEP** | |
| `/ops/support` | **KEEP** | |
| `/ops/notifications` | **KEEP** | |
| `/ops/security` | **KEEP** | |
| `/ops/privacy` | **KEEP** | |
| `/compliance/holds` | **KEEP** | |
| `/finance/revenue` | **KEEP** | Recognition posture; no fake live posting |
| `/finance/entitlements` | **KEEP** | |
| `/finance/holds` | **KEEP** | |
| `/finance/recovery` | **KEEP** | |
| `/finance/settlements` | **KEEP** | Batches; execution gated |
| `/finance/payout-readiness` | **KEEP** | Readiness not payout |
| `/finance/reconciliation` | **KEEP** | |
| `/finance/refunds` | **KEEP** | |
| `/finance/chargebacks` | **KEEP** | |
| `/finance/offline` | **KEEP** | Evidence |
| `/settings` and children | **KEEP** | No theme store |
| `/admin`, `/admin/*`, `/admin-events`, `/admin-partners` | **RETIRE** | Redirect → `/ops` |

---

## Major UI inconsistencies (post 2026-09-04 migration)

Addressed in this migration: attention-first homes, Connect lead timeline, desktop catalogue master–detail, Project Command Center composition, claims in customer secondary nav, Trust Rank not productized on customer/personal homes, `/dashboard` picker (no fake KPIs), `/the-circle` removed from public/footer nav.

Remaining:

1. **PublicShell vs WorkspaceShell stay separate** — correct. Do not put the switcher in PublicShell.
2. **Two Venue consoles** — canonical `/venue/(partner)/*` vs leftover `/dashboard/venue/*` CRUD (**RETIRE**, do not extend).
3. **Personal vs customer** — personal workspace now deep-links to `/customer`; legacy `/dashboard/member` remains RETIRE.
4. **`/marketplace` is a landing**, not the catalogue — keep copy distinct from Events/Offers/Venues.
5. **Legacy admin/ZBP/Affiliate sources** remain redirected — do not restyle them.
6. **`docs/core/13_UI_Guidelines.md`** remains historical (stale palette).
7. **Marketing 3D/glass** must not leak into Ops/Finance/check-in.
8. **No generic Wallet** — do not add one.
9. **`/the-circle` still routed** as a RETIRE alias (`/how-referrals` redirects there). Do not add it back to PUBLIC_NAV or footers.

P1 polish still open: denser Venue “today” queue from live check-in data, Opportunity Desk detail as the same timeline language, remaining marketing landings, full E2E a11y on every workspace.

---

## Living rule

When a feature changes navigation, workspace keys, IA, shared patterns, responsive rules, or vertical UX, update this roadmap’s row for the affected routes **in the same task**.
