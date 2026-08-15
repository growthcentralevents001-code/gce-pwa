# Phase 14B — E2E Test Matrix

| Field | Value |
|-------|-------|
| **Date** | 2026-08-15 |
| **Environment** | development / gce-dev |
| **Auth fixtures** | **PRESENT** (BG-32 CLOSED — see PHASE_14B_DEV_TEST_FIXTURE_SPEC.md) |

Legend: PASS · FAIL · BLOCKED · N/A · PENDING

---

## Public

| ID | Area | Role | Route | Action | Expected | Actual | Browser | Viewport | Status | Defect |
|----|------|------|-------|--------|----------|--------|---------|----------|--------|--------|
| P14B-PUB-01 | Public | anon | `/` | Navigate | 200 + brand | 200 | Chromium MCP | desktop | PASS | |
| P14B-PUB-02 | Public | anon | `/about` … `/privacy` | Navigate each | &lt;400 | Suite + MCP sample | Chromium | desktop | PASS | |
| P14B-PUB-03 | Public | anon | `/` | No blue class tokens | None | Asserted | Chromium | desktop | PASS | |
| P14B-PUB-04 | Public | anon | `/events` `/offers` | Load | &lt;400 | PASS | Chromium MCP | 390×844 | PASS | |

## Auth (unauthenticated)

| ID | Area | Role | Route | Action | Expected | Actual | Status | Defect |
|----|------|------|-------|--------|----------|--------|--------|--------|
| P14B-AUTH-01 | Auth | anon | `/login` | Load | Email field | PASS | PASS | |
| P14B-AUTH-02 | Auth | anon | `/signup` | Load | &lt;400 | PASS | PASS | |
| P14B-AUTH-03 | Auth | anon | `/forgot-password` | Load | &lt;400 | PASS | PASS | |
| P14B-AUTH-04 | Auth | anon | `/customer` | Redirect login | login | PASS | PASS | |
| P14B-AUTH-05 | Auth | anon | `/ops` `/settings` `/dashboard/finance` | Redirect login | login | PASS | PASS | |
| P14B-AUTH-06 | Auth | anon | `/login?redirectTo=https://evil.example` | No open redirect | Stay GCE | PASS | PASS | |
| P14B-AUTH-07 | Auth | fixture roles | login + storage state | Session | 15 roles | PASS | |

## Legacy redirects

| ID | Route | Expected | Actual | Status |
|----|-------|----------|--------|--------|
| P14B-LEG-01 | `/admin` | `/ops` or login | PASS | PASS |
| P14B-LEG-02 | `/venue/plans` | `/venue/apply` | 307 | PASS |
| P14B-LEG-03 | `/partner-dashboard` | `/dashboard/venue` | 307 | PASS |
| P14B-LEG-04 | `/bdm-dashboard` | `/for-partners` | 307 | PASS |
| P14B-LEG-05 | `/dashboard/venue/events` | `/venue/events` | 307 (added) | PASS |
| P14B-LEG-06 | `/wishlist` | `/customer/wishlist` | 307 | PASS |

## PWA / SEO / a11y

| ID | Check | Status | Notes |
|----|-------|--------|-------|
| P14B-PWA-01 | Manifest theme/background | PASS | `#EA580C` / `#FFF7ED` |
| P14B-PWA-02 | SW NetworkOnly `/api` | PASS | |
| P14B-PWA-03 | Offline page | PASS | |
| P14B-SEO-01 | Private layouts noindex | PASS | dashboard/ops/settings/finance |
| P14B-A11Y-01 | login email labeling + home landmark | PASS | axe deferred (Playwright type mismatch); baseline manual/MCP |
| P14B-A11Y-02 | Reduced motion CSS | PASS | globals |

## Authenticated matrix

| ID | Role | Status | Defect |
|----|------|--------|--------|
| P14B-ROLE-01…15 | Customer → multi-role (homes + negatives) | **PASS** (Chromium) | BG-32 CLOSED |
| P14B-XR-01 | Customer booking sandbox → ticket | Customer | `/customer/events/{id}/book` | fixture Event | PASS | Chromium | |
| P14B-XR-02 | Duplicate booking | Customer | `create_booking` idempotencyKey | PASS | Chromium | |
| P14B-XR-03 | Ticket list/detail; QR not redisplayed | Customer | `/customer/tickets/{id}` | **FAIL evidence / BG-11** | Chromium | DEF-14B-005 |
| P14B-XR-04 | QR new session | Customer | storageState reopen | **FAIL / BG-11** | Chromium | DEF-14B-005 |
| P14B-XR-05 | Venue check-in success + duplicate | Customer→Venue | `/venue/check-in` | PASS | Chromium | |
| P14B-XR-06 | Invalid token / customer role deny | Venue / Customer | API | PASS | Chromium | |
| P14B-XR-07 | Venue A vs Venue B ticket | Venue | API | PASS | Chromium | DEF-14B-007 fixed |
| P14B-XR-08 | Offer claim → redeem → repeat | Customer B→Venue | `/customer/offers` `/venue/redemptions` | PASS | Chromium | |
| P14B-XR-09 | Expired claim | Venue | fixture expired claim | PASS | Chromium | |
| P14B-XR-10 | Lead create/submit + paid OFF | Connect Member | `/connect/leads` API | PASS | Chromium | |
| P14B-XR-11 | Opportunity Desk queue | Opportunity Desk | `/desk/queue` | PASS (boundary) | Chromium | routing stages not fully exercised |
| P14B-XR-12 | Marketplace 80/10/10 and 80/0/20 | MBDP / Finance | entitlements/revenue | PASS | Chromium | |
| P14B-XR-13 | EBDP 25% of platform commission | EBDP | entitlements | PASS | Chromium | |
| P14B-XR-14 | Co-sign &gt; ₹5L only; Finance authority | Expert / Finance / EBDP | quotes | PASS | Chromium | |
| P14B-XR-15 | Milestones 2 vs 4; no 30/40/30 | Enterprise Client | projects | PASS | Chromium | |
| P14B-XR-16 | Finance 11 routes + execution gated | Finance | `/dashboard/finance` `/finance/*` | PASS | Chromium | |
| P14B-SEC-IDOR-01 | Customer B vs A ticket | Customer | URL+API | PASS | Chromium | |
| P14B-SEC-IDOR-02 | Customer Finance / Enterprise / check-in | Customer | | PASS | Chromium | |
| P14B-SEC-IDOR-03 | Support Compliance/Finance | Support | | PASS | Chromium | |
| P14B-SEC-IDOR-04 | Lead contact JSON | Connect Member | API | PASS | Chromium | |
| P14B-SEC-SELF-01 | MBDP/Venue/EBDP/Client cannot approve/cosign | mixed | API | PASS | Chromium | |
| P14B-FF-AUTH | Firefox representative + reduced motion | 8 roles + ops/settings | | **PASS 9/9** | Firefox | |
| P14B-WK-AUTH | WebKit representative + reduced motion | 8 roles + ops/settings | | **PASS 9/9** | WebKit | |
| P14B-VP-MOB | Authenticated 390×844 | representative | | **PASS 9/9** | Chromium | DEF-14B-009 fixed |
| P14B-VP-TAB | Authenticated 768×1024 | representative | | **PASS 9/9** | Chromium | |
| P14B-VP-DESK | Authenticated 1366×768 | representative | | **PASS 9/9** | Chromium | |
| P14B-A11Y-AUTH | Authenticated landmarks/labels | 8 pages + check-in fields | | **PASS 9/9** | Chromium | DEF-14B-008 fixed; axe not run |

## Feature flags

| ID | Flag | Expected | Status |
|----|------|----------|--------|
| P14B-FF-01 | marketplace_ticket_payments | OFF | PASS |
| P14B-FF-02 | settlement_execution | OFF | PASS |
| P14B-FF-03 | payout_execution | OFF | PASS |
| P14B-FF-04 | wallet_cashout | OFF | PASS |
| P14B-FF-05 | paid_lead_assist | OFF | PASS |

## Browser matrix

| Browser | Public smoke | Auth shell matrix | Status |
|---------|--------------|-------------------|--------|
| Chromium | PASS | **PASS** (36 shell + 47 deep) | Shell PASS; deep PASS except QR evidence FAIL classified BG-11 |
| Firefox | Playwright project | **PASS 9/9** representative | PASS |
| WebKit | Playwright project | **PASS 9/9** representative | PASS |

Do not treat unexecuted authenticated browsers as PASS.
