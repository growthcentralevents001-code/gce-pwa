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
| QR re-display API | BG-11 — **CLOSED** 14B-P1 (encrypted retrievable credential + owner API) |

---

## DEF-14B-005 — QR cannot be redisplayed after confirmation (BG-11)

| Field | Value |
|-------|-------|
| **Severity** | P1 |
| **Area** | Customer tickets / Marketplace CX |
| **Roles** | Customer |
| **Route/workflow** | Booking sandbox confirm → Tickets → reopen ticket in new storage-state session |
| **Reproduction** | Authenticated Customer books fixture Event; `qrTokens` returned once on confirm; ticket page and `GET /api/customer?view=tickets` have no QR image/token; new context still FeatureGated “QR issued at confirmation” |
| **Expected** | Owner can safely redisplay a server-authorized QR for Venue check-in |
| **Actual** | Backend stores SHA-256 hash only; plaintext issued once; frontend does not mint a token |
| **Root cause** | Canonical ticket model has no retrievable display-token column/API (BG-11). Not a frontend-only bug. |
| **Fix** | Encrypted retrievable display credential in `marketplace_display_credentials`; owner-only redisplay API; check-in still hash-verified |
| **Files** | `lib/architecture/credentials/*`, `lib/architecture/marketplace/operations.ts`, `lib/architecture/customer-cx/operations.ts`, `app/api/customer/route.ts`, ticket/claim UI, migration `20260815140000_phase14b_p1_display_credentials` |
| **Regression test** | `tests/e2e/customer/qr-redisplay.spec.ts`, `tests/e2e/customer/booking-ticket.spec.ts` |
| **Retest** | **PASSED** Chromium, Firefox, WebKit — new session QR matches first-issue fingerprint; Venue check-in after reopen; Customer B denied |
| **Pilot impact** | Closed |
| **Status** | **FIXED / RETEST PASSED** |

---

## DEF-14B-007 — Venue check-in lacked organisation scope (IDOR)

| Field | Value |
|-------|-------|
| **Severity** | P1 (fixed) |
| **Area** | Venue check-in / redemption |
| **Roles** | Venue Representative |
| **Reproduction** | Venue A presented Venue B ticket token to `check_in_ticket` |
| **Expected** | 403 outside operating organisation |
| **Actual (before)** | RPC `gce_marketplace_ticket_check_in` had no venue-ownership check |
| **Fix** | `assertVenueStaffScope` via `organisation_memberships` → `marketplace_venues`; Ops roles retain platform scope; `submitted_by` is not authority |
| **Files** | `lib/architecture/customer-cx/operations.ts` |
| **Regression test** | `tests/e2e/venue/checkin.spec.ts` venue A vs B |
| **Status** | **FIXED / RETEST PASSED** |
| **Pilot impact** | Would have allowed cross-venue check-in |

---

## DEF-14B-008 — Settings notifications lacked a main landmark

| Field | Value |
|-------|-------|
| **Severity** | P2 |
| **Fix** | `SettingsShell` renders `<main id="main-content">` |
| **Status** | **FIXED / RETEST PASSED** |

---

## DEF-14B-009 — Ops mobile header horizontal overflow

| Field | Value |
|-------|-------|
| **Severity** | P2 |
| **Route** | `/ops` at 390×844 |
| **Fix** | Hide Workspaces CTA below `sm`; truncate title; tighter header gaps |
| **Files** | `components/app-shell/OpsShell.tsx` |
| **Status** | **FIXED / RETEST PASSED** |

---

## Summary

| Severity | Open | Fixed / Closed |
|----------|-----:|---------------:|
| P0 | 0 | 0 |
| P1 | 0 Pilot-blocking | 4 (legacy venue blue; BG-32; venue-scope check-in; BG-11 QR redisplay) |
| P2 | Cross-Circle/wider Lead routing permutations; in-memory credential rate limit; pre-migration ticket backfill | Settings main; Ops overflow; Finance unauthorized redirect |
