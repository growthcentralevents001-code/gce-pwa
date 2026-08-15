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
| **Severity** | P1 (was blocking authenticated UAT) |
| **Category** | Test infrastructure |
| **Reproduction** | Attempt authenticated E2E — no E2E env, 0 role_assignments |
| **Expected** | Safe gce-dev fixtures for role matrix |
| **Actual (resolved)** | `npm run e2e:fixtures:setup` + validate; 16 identities; Playwright `.playwright/.auth/*` |
| **Fix** | `scripts/e2e-fixtures/*`, `docs/phase-14/PHASE_14B_DEV_TEST_FIXTURE_SPEC.md` |
| **Status** | **CLOSED** (BG-32 closed) |
| **Pilot impact** | Authenticated shells testable; deep lifecycle still pending |

---

## DEF-14B-004 — Unauthorized Finance overview should hard-deny

| Field | Value |
|-------|-------|
| **Severity** | P2 |
| **Category** | RBAC UX / RSC stability |
| **Route** | `/dashboard/finance` |
| **Reproduction** | Customer (no finance.report.read) opened Finance; entitled BDP path could also hit PartnerShell action icon RSC errors |
| **Expected** | Clear Access Denied / unauthorized without crash |
| **Fix (partial)** | Unauthorized users `redirect(/unauthorized?reason=…)` when lacking finance workspace + finance.report.read |
| **Status** | **PARTIAL** — hard deny for unauthorized; entitled Finance dashboard icon serialization may still error (track separately) |
| **Test** | authenticated-matrix customer denies `/dashboard/finance` |

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
| QR re-display API | BG-11 (backend) — fixtures available; deep probe pending |

---

## Summary

| Severity | Open | Fixed / Closed |
|----------|-----:|---------------:|
| P0 | 0 | 0 |
| P1 | 0 fixture-gate | 2 (legacy venue blue; BG-32) |
| P2 | 1 partial (Finance RSC entitled path) | 1 (unauthorized Finance redirect) |
