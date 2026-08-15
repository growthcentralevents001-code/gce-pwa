# Phase 14B — E2E Test Matrix

| Field | Value |
|-------|-------|
| **Date** | 2026-08-15 |
| **Environment** | development / gce-dev (read-only for auth) |
| **Auth fixtures** | **ABSENT** (BG-32) |

Legend: PASS · FAIL · BLOCKED · N/A

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
| P14B-AUTH-07 | Auth | customer+ | signup/login/logout deep | Full auth cycle | — | — | **BLOCKED** | BG-32 |

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

## Authenticated matrix (all BLOCKED)

| ID | Role | Status | Defect |
|----|------|--------|--------|
| P14B-ROLE-01…14 | Customer → PRM | **BLOCKED** | BG-32 |
| P14B-XR-01…13 | Cross-role lifecycles | **BLOCKED** | BG-32 |
| P14B-SEC-IDOR-* | Object IDOR | **BLOCKED** | BG-32 |
| P14B-SEC-SELF-* | Self-approval | **BLOCKED** | BG-32 |

## Feature flags

| ID | Flag | Expected | Status |
|----|------|----------|--------|
| P14B-FF-01 | marketplace_ticket_payments | OFF | PASS |
| P14B-FF-02 | settlement_execution | OFF | PASS |
| P14B-FF-03 | payout_execution | OFF | PASS |
| P14B-FF-04 | wallet_cashout | OFF | PASS |
| P14B-FF-05 | paid_lead_assist | OFF | PASS |

## Browser matrix (public only)

| Browser | Public smoke | Auth deep | Status |
|---------|--------------|-----------|--------|
| Chromium | MCP + Playwright project | BLOCKED | Partial PASS |
| Firefox | Playwright project (host deps permitting) | BLOCKED | Partial / host-deps |
| WebKit | Playwright project (host deps permitting) | BLOCKED | Partial / host-deps |

Do not treat unexecuted authenticated browsers as PASS.
