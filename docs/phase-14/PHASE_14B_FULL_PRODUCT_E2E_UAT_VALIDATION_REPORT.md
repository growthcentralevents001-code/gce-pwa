# Phase 14B — Full Product E2E / UAT Validation Report

| Field | Value |
|-------|-------|
| **Status** | **PHASE 14B VALIDATION COMPLETE — PILOT-BLOCKING P1 ITEMS REMAIN** |
| **Date** | 2026-08-15 |
| **Branch** | `development` |
| **Phase 14B tip (pre-14B-R)** | `4163287` |
| **Phase 14B-F** | Dev test fixtures + authenticated role matrix resumed |
| **Phase 14B-R** | Authenticated deep lifecycle + security closeout |
| **Production** | Untouched |
| **gce-dev** | Fixtures applied (`role_assignments` with `fixture_family=phase14b`) |
| **BG-32** | **CLOSED** |
| **Phase 15** | **Not started** |
| **Pilot** | **Not started** |

---

## 1. Executive verdict

Unauthenticated / static / redirect / PWA baselines remain accepted from the prior Phase 14B pass. BG-32 remains **CLOSED**.

**Phase 14B-R** executed the remaining authenticated deep lifecycle and security probes on `development` / gce-dev (`hvevqoltcwumcvxetxsf`) using existing fixtures plus lifecycle domain records.

Core booking → ticket → Venue check-in, offer claim → redemption, Marketplace economics copy, Enterprise co-sign threshold, Finance gated lists, live IDOR, and self-approval probes **passed**. Firefox and WebKit authenticated representative matrices **passed**.

**Pilot-blocking P1 remaining:** ticket QR cannot be redisplayed after confirmation (hash-only storage; FeatureGated “QR issued at confirmation”) — **BG-11**, confirmed with a real authenticated booking. Lead Assist receiver accept / dual confirmation / full Circle-first routing stages were only partially exercised (create/submit + Desk queue + contact-hidden JSON).

Final verdict: **PHASE 14B VALIDATION COMPLETE — PILOT-BLOCKING P1 ITEMS REMAIN**. Phase 15 has **not** been started.

---

## 2. BG-32 — CLOSED

See `PHASE_14B_DEV_TEST_FIXTURE_SPEC.md`.

| Check | Result |
|-------|--------|
| Setup | `npm run e2e:fixtures:setup` |
| Validate | `npm run e2e:fixtures:validate` — OK |
| Reset | `npm run e2e:fixtures:reset` (fixture-scoped) |
| Production guard | Refuses `tzeqeywezmqslovpflqu`; requires `hvevqoltcwumcvxetxsf` |
| Secrets | `.env.test.local` only (gitignored) |
| Super Admin | None |
| Auth matrix | 15 roles + multi-role — login + home + negatives |

---

## 3. What passed (reuse + new)

### Prior (unauthenticated) — reused

Public routes, auth boundaries, legacy redirects, PWA, offline, noindex, money flags OFF, decorative-blue Venue sibling retirement.

### New (authenticated) — Phase 14B-F

| Area | Result |
|------|--------|
| Fixture setup / validate | PASS |
| Playwright auth.setup storage states | PASS (15 roles) |
| Role home routes (customer → ops/finance/…) | PASS |
| RBAC negatives (soft EmptyState / `/unauthorized`) | PASS |
| Multi-role `/settings` | PASS |
| Customer → Finance hard unauthorized redirect | PASS (DEF-14B-004) |

---

## 4. Remaining authenticated depth (non-blocking for BG-32)

BG-32 remains closed. Remaining items are product/evidence P1s, not fixture-infrastructure failures.

| Area | Status |
|------|--------|
| Customer booking → ticket | **PASS** (sandbox, payments gated) |
| QR redisplay | **FAIL / BG-11 P1** — hash-only; not redisplayed |
| Venue check-in cross-role | **PASS** (success, duplicate, invalid, venue-scope IDOR) |
| Offer claim → redemption | **PASS** (claim, redeem once, repeat reject, expired reject) |
| Lead Assist create/submit + Desk queue | **PASS** (partial) |
| Lead Assist receiver accept / dual confirmation / full routing | **EVIDENCE GAP** |
| Marketplace attribution economics | **PASS** (80/10/10 and 80/0/20 copy; no pending MBDP 10%) |
| Enterprise co-sign thresholds / milestones | **PASS** (strict `>`; 2 vs 4 milestones; no 30/40/30) |
| Finance deep lists + execution gates | **PASS** |
| IDOR object matrix | **PASS** (customer/venue/connect/enterprise/finance/support) |
| Self-approval live probes | **PASS** |
| Firefox / WebKit authenticated | **PASS** (9/9 each, representative + reduced motion) |
| Authenticated responsive | **PASS** (390 / 768 / 1366) |
| Accessibility authenticated baseline | **PASS** (not WCAG certification; axe not integrated) |

---

## 5. Defects

See `PHASE_14B_DEFECT_REGISTER.md`.

| Severity | Notes |
|----------|-------|
| P0 | 0 open |
| P1 | **DEF-14B-005 / BG-11** QR redisplay backend gap (open). DEF-14B-002 CLOSED. Venue-scope check-in IDOR **fixed** (DEF-14B-007). |
| P2 | Mobile Ops header overflow **fixed**; Settings `<main>` landmark **fixed**. DEF-14B-004 unauthorized Finance redirect remains accepted. |

---

## 6. Quality gates

- `npm run typecheck` — PASS
- `npm test` — **271 passed** / 43 files
- `npm run build` — PASS (`next build --webpack`)
- scoped eslint on 14B-R files — PASS
- Chromium shell (prior 14B-F): **36 passed**
- Chromium deep (`chromium-deep`): **47 passed**
- Firefox authenticated representative: **9 passed**
- WebKit authenticated representative: **9 passed**
- Mobile 390×844 / tablet 768×1024 / desktop 1366×768: **9 passed each**
- Authenticated a11y baseline: **9 passed**
- Playwright base URL used: `http://127.0.0.1:3000` (3010 is a stale host)

---

## 7. Phase boundary

- Phase 14B validation: **complete — Pilot-blocking P1 items remain**
- Phase 15 **not started**
- Pilot **not started**
- Production **untouched**

---

## 8. Phase 15 readiness

**Not READY FOR FOUNDER APPROVAL TO START PHASE 15** until BG-11 QR redisplay is resolved (schema/token policy) and Lead Assist receiver/dual-confirmation is evidenced or explicitly deferred by Founder.

---

## Phase 14B-R — Authenticated Deep Lifecycle & Security Closeout

Environment: `development` / gce-dev only. No Super Admin fixture. Money execution flags remain OFF.

### Deep flows

| Flow | Result |
|------|--------|
| Customer sandbox booking → confirmation → Tickets | PASS |
| Duplicate booking idempotency | PASS (backend-owned) |
| Ticket generation / owner list | PASS |
| QR redisplay after new session | **FAIL — BG-11** (hash stored; UI FeatureGated; no client-side mint) |
| Venue check-in of valid token | PASS |
| Duplicate / invalid check-in | PASS (rejected) |
| Venue A vs Venue B ticket scope | PASS (403 after `assertVenueStaffScope`) |
| Offer claim → redeem once → repeat reject | PASS |
| Expired claim reject; claim ≠ revenue | PASS |
| Lead create/submit API + composer gated copy | PASS |
| Opportunity Desk queue (not primary router; paid OFF) | PASS (boundary) |
| Marketplace 80/10/10 and 80/0/20 + missing 10% | PASS (Finance/MBDP views) |
| EBDP 25% of platform commission, not project value | PASS |
| MBDP 20 venues / max 2 units | PASS |
| Co-sign below / exact ₹5,00,000 — not required | PASS |
| Co-sign one minor above — required; Finance only | PASS |
| Dynamic milestones 2 vs 4; no 30/40/30 | PASS |
| Finance 11 routes; no Execute Settlement/Payout/Process Refund | PASS |
| Payment ≠ revenue; revenue ≠ entitlement copy | PASS |
| Gross immutability (no edit controls) | PASS |

### Security

| Probe | Result |
|-------|--------|
| Customer B vs Customer A ticket URL/API | PASS |
| Customer cannot check-in/redeem | PASS |
| Customer cannot open Finance / Enterprise project | PASS |
| Support cannot open Compliance/Finance | PASS |
| Lead sent payload has no phone/email | PASS |
| MBDP/Venue/EBDP/Client self-approval | PASS (backend deny) |

### Browsers / responsive / a11y

| Matrix | Result |
|--------|--------|
| Chromium deep (lifecycle/action) | 47 passed |
| Chromium shell (prior) | 36 passed (not merged into deep count) |
| Firefox authenticated representative | 9 passed (includes reduced motion) |
| WebKit authenticated representative | 9 passed (includes reduced motion) |
| Mobile 390×844 | 9 passed (Ops header overflow fixed) |
| Tablet 768×1024 | 9 passed |
| Desktop 1366×768 | 9 passed |
| Authenticated a11y baseline | 9 passed; axe **not** run (not integrated) |

### Blockers

1. **P1 BG-11** — QR cannot be reopened for normal ticket use (no retrievable display token).
2. **Evidence gap** — Lead Assist receiver accept, contact reveal-after-accept, dual confirmation, and Circle-first → cross-Circle → Desk routing stages were not fully live-probed.
3. **BG-12** — claim token redisplay after a new session was not separately proven (token issued once at claim, same pattern as tickets).
4. Booking inventory concurrency and near-simultaneous check-in races were not executed (fixture capacity not safely dual-customer contended).

### Final 14B-R verdict

**PHASE 14B VALIDATION COMPLETE — PILOT-BLOCKING P1 ITEMS REMAIN**

