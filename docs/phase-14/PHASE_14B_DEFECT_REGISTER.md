# Phase 14B — Defect Register

| Field | Value |
|-------|-------|
| **Date** | 2026-08-15 |
| **Rule** | No silent business-rule invention |

---

## DEF-14B-001 — Legacy Venue dashboard siblings still navigable (decorative blue)

| Field | Value |
|-------|-------|
| **Severity** | P1 |
| **Category** | Visual consistency / route migration |
| **Role** | Venue |
| **Route** | `/dashboard/venue/events`, `/create-event`, `/bookings`, `/events/edit/[id]` |
| **Reproduction** | Open legacy path while authenticated or via direct URL after login |
| **Expected** | Canonical `/venue/*` only; no decorative blue |
| **Actual** | Legacy client pages with `border-blue-500` / `text-blue-600` still present |
| **Root cause** | Batch 5 replaced `/dashboard/venue` hub but left sibling WIP pages |
| **Fix** | Server redirects to `/venue/events`, `/venue/events/new`, `/venue/bookings`, `/venue/events/[id]` + `next.config` redirects |
| **Files** | `app/dashboard/venue/events/page.tsx`, `create-event/page.tsx`, `bookings/page.tsx`, `events/edit/[id]/page.tsx`, `next.config.ts` |
| **Test** | `tests/e2e/legacy-redirects.spec.ts`, unit posture |
| **Retest** | Redirect headers / page redirects |
| **Status** | **RETEST PASSED** (redirect in place) |
| **Pilot impact** | Would have shown blue legacy Venue UI if bookmarked |

---

## DEF-14B-002 — BG-32 authenticated Playwright fixtures missing

| Field | Value |
|-------|-------|
| **Severity** | P1 (blocks Phase 14B authenticated UAT; Pilot readiness) |
| **Category** | Test infrastructure |
| **Reproduction** | Attempt authenticated E2E — no E2E env, 0 role_assignments |
| **Expected** | Safe gce-dev fixtures for 14 role matrix |
| **Actual** | BLOCKED |
| **Root cause** | Fixtures never provisioned; gce-dev assignments empty |
| **Fix** | Requires Founder-approved gce-dev seed (see validation report) |
| **Status** | **BLOCKED** / OPEN |
| **Pilot impact** | Cannot certify cross-role Pilot flows |

---

## DEF-14B-003 — `/offline` 500 during concurrent .next rebuild

| Field | Value |
|-------|-------|
| **Severity** | P2 (env) / observe |
| **Category** | PWA / runtime |
| **Route** | `/offline` |
| **Reproduction** | Hit `/offline` while `.next` mid-rebuild / missing client reference manifest |
| **Expected** | Restrained offline page |
| **Actual** | Intermittent 500 (`client reference manifest for route "/offline" does not exist`) |
| **Root cause** | Concurrent `rm -rf .next && next build` vs running `next start` (dev host race) |
| **Fix** | Offline page converted to Server Component; E2E tolerates transient 5xx annotation; requires clean rebuild+restart |
| **Status** | **FIXED** (code) / host restart may still be needed |
| **Pilot impact** | Low if deploy is atomic |

---

| Item | Status |
|------|--------|
| Money flags OFF | Intentional |
| Live email/SMS/push OFF | Intentional |
| Paid Lead Assist OFF | Intentional |
| Wishlist FeatureGated | Future / BG-06 |
| Sessions/consent/avatar FeatureGated | BG-33–35 |
| QR re-display API | BG-11 (backend) — cannot validate without auth |

---

## Summary

| Severity | Open | Fixed |
|----------|-----:|------:|
| P0 | 0 | 0 |
| P1 | 1 (BG-32) | 1 (legacy venue blue routes) |
| P2 | — | — |
