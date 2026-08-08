# Phase 14 — Testing, Migration & Data Validation

| Field | Value |
|-------|-------|
| **Phase** | 14 |
| **Document** | `PHASE_14_TESTING_MIGRATION_DATA_VALIDATION.md` |
| **Type** | Phase planning / living architecture summary |
| **Status** | Phase 14A **COMPLETE** (backend validation). Phase 14B **DEFERRED** until final frontend redevelopment. Phase 14 overall **NOT COMPLETE**. |
| **Date** | 2026-08-08 |
| **Evidence** | `PHASE_14A_PLATFORM_BACKEND_VALIDATION_REPORT.md`, `PHASE_14A_VALIDATION_CHECKLIST.md` |

---

## Authority

**Highest business authority (constraints on what tests must prove):**

| Topic | Authority |
|-------|-----------|
| Legacy role / history preservation; no automatic entitlement | **FD-035** Part G; **FD-039** inactive list |
| Attribution non-retroactivity; 80/0/20 vs 80/10/10 | **FD-036** / **FD-037** |
| Settlement / commission / payment ≠ eligibility | **FD-020** / **FD-021** / **FD-029** |
| Lead Assist Stage 1 unpaid only | **FD-031** / **FD-032** / **FD-039** |
| MoR / tax / refund compliance gates before prod money | **FD-039** |
| Schema SoT = migrations | **ADR-004** |
| RLS deny-by-default | **ADR-005** |
| Legacy migration strategy | **ADR-011** |
| Feature flags | **ADR-013** |
| State machines | **ADR-008** + `docs/state-machines/*` |

**Living companions:** `docs/core/11_Database.md`, `16_Authentication.md`, `24_Deployment_Architecture.md`.

---

## Purpose

Define Phase 14 quality gates so implementation of Phases 9–13 (and earlier) cannot ship money-moving or entitlement-affecting behaviour without evidence:

- Automated tests (unit → e2e)
- Security tests (RLS, auth, permissions)
- Financial / settlement / commission / state-machine / webhook tests
- Migration, backfill, rollback, reconciliation, historical preservation
- UAT, pilot acceptance, production release gates

**No package.json changes in this documentation phase.** Tooling choices below are labelled **Technical recommendation** if not already installed.

---

## Scope

### In scope

- Test strategy pyramid and ownership
- Unit, integration, e2e
- RLS / auth / permission tests
- Financial, settlement, commission tests
- State-machine transition tests
- Webhook idempotency tests
- Migration / backfill / rollback / reconciliation tests
- Historical preservation & legacy role migration validation
- UAT scripts
- Pilot acceptance criteria
- Production release gates (incl. FD-039 compliance gate)
- Tooling recommendations (Vitest / Playwright)

### Not in scope

- Editing `package.json` or installing packages via this doc
- Inventing tax rates or refund % inside fixtures as Founder-approved truth
- Enabling inactive products in pilot/prod via tests “for convenience”
- Declaring pilot city (Founder undecided — FD-039)
- Treating Razorpay or MoR implementation as fully validated because tests mocked them

---

## Dependencies

| Dependency | Why |
|------------|-----|
| ADR-004 / ADR-005 / ADR-011 | Migrations, RLS, legacy |
| SM_* documents | Expected transitions |
| Phases 9–13 | Behaviours under test |
| FD-039 Part M | Production compliance gate checklist |
| CI (GitHub Actions per ADR-012) | Gate enforcement |

---

## Entry criteria

- Critical state machines documented (Payment, Refund, Commission, Settlement, Lead Assist, Marketplace Event/Offer/Claim/Redemption, Membership, Role Assignment)
- Feature flags exist for MoR ticket capture, cash-out, paid Lead Assist, Affiliate
- Staging / pilot environments distinguishable (ADR-012)
- Test data strategy agrees: no production PII in fixtures; KYC samples synthetic

---

## Exit criteria

- CI runs unit + integration + RLS suites on PR
- E2E smoke for auth, booking (flagged), Lead Assist Stage 1 unpaid path, Admin approval happy path
- Migration dry-run + rollback rehearsal documented for pilot
- Reconciliation report sample for finance UAT
- Production release checklist signed against FD-039 gates (money movement blocked until validated)
- No test asserting ₹500 Lead Assist fee or cash-out success in default flags

---

## Tooling — Technical recommendation

> **Label:** Technical recommendation — not Founder law. **Do not change package.json in this documentation task.**

| Layer | Recommendation if not installed | Notes |
|-------|----------------------------------|-------|
| Unit / integration (TS) | **Vitest** | Fast; aligns with modern Vite/Next TS stacks |
| Component tests | Vitest + Testing Library (optional) | Prefer existing repo patterns if present |
| E2E | **Playwright** | PWA booking / Admin flows; mobile viewport projects |
| API / webhook | Vitest or Playwright request fixtures | Signature & idempotency cases |
| RLS | SQL tests against local/CI Supabase or constrained harness | ADR-005 |
| Load | Optional later (k6 etc.) | Not launch-blocking unless Finance requires |

If the repo already standardises on another runner, prefer reuse; document divergence in ADR rather than silently forking.

---

## Unit tests

Focus:

- Pure commission calculators for **documented** splits only (80/10/10, 80/0/20, Enterprise BDP share of platform commission) with attribution flags
- Refund policy **engine** with injectable schedules — default fixtures must not claim Founder-locked %
- State transition guards (illegal jumps rejected)
- Feature flag defaults (inactive products off)
- Money concept helpers (do not collapse GMV → Platform Revenue)

---

## Integration tests

- Server Actions / Route Handlers authz (ADR-009)
- Ledger write + reversal pairs (ADR-007)
- Offline BDP pack: evidence incomplete → no activation
- Lead Assist Stage 1: accept/decline without payment objects
- Membership activation requires payment + activation rules (FD-028) — not payment alone for commission where applicable

Use transactional DB or ephemeral schemas; never point at prod.

---

## End-to-end tests (Playwright — recommendation)

Minimum smoke journeys:

1. Auth register / login / OTP path (as enabled)
2. Workspace switch (multi-role user)
3. Lead Assist: create → offer → accept (unpaid)
4. Marketplace: discover → detail → booking **behind flag** (mock PSP)
5. Cancel request relative to 48h cutoff (assert cutoff behaviour; refund amount asserted only if policy fixture versioned as non-Founder)
6. Admin: Marketplace listing approve
7. Finance: settlement hold → release (non-prod)
8. Negative: cash-out route disabled; Lead Assist ₹500 checkout absent

Mobile-first viewport project required for booking/QR screens (Phase 11).

---

## RLS, auth & permission tests

Per ADR-005 / FD-023 / FD-035:

- Deny-by-default: unauthenticated reads fail
- Venue Rep sees only own venue
- BDP cannot approve own commission
- RM/PRM cannot release settlement or approve refunds
- Opportunity Desk cannot export bulk unrelated KYC
- Finance Admin dual-control paths enforced where specified
- Service role never exposed to browser

Auth tests: session expiry, CSRF/origin assumptions for Server Actions, webhook signature failure → 401/ignore without ledger credit.

---

## Financial, settlement & commission tests

Must prove:

| Assertion | Authority |
|-----------|-----------|
| Payment captured ≠ settlement eligible | FD-021 |
| Estimated commission ≠ payable | FD-029 |
| Attributed Marketplace → 80/10/10 net shares | FD-029 / FD-037 |
| Unattributed Marketplace → 80/0/20; no “unpaid MBDP” debt | FD-037 |
| Later MBDP assignment not retroactive | FD-037 |
| Organic Connect membership → no Connect BDP commission | FD-036 |
| No double commission same component | FD-038 |
| Refund reduces eligible base; paid → Recoverable path | FD-029 / SM_Refund |
| Chargeback signal freezes settlement | FD-021 placeholder |
| Cash-out inactive | FD-039 |
| Offline pack without evidence does not activate | FD-039 |

Tax line assertions: only “pending/validation” placeholders — **do not hard-code invented GST/TDS rates as approved.**

---

## State-machine tests

For each critical SM (`SM_Payment`, `SM_Refund`, `SM_Commission`, `SM_Settlement`, `SM_Lead_Assist`, Marketplace SMs, `SM_Membership`, `SM_Role_Assignment`):

- Allowed transitions succeed with guards
- Disallowed transitions throw / no-op safely
- Side effects emit expected audit event names
- Idempotent re-entry safe

---

## Webhook tests

Per ADR-006:

- Invalid signature rejected
- Duplicate provider event id → idempotent no double credit
- Out-of-order events handled per documented rules
- Chargeback / refund webhooks create holds / SM transitions
- Clock-skew / replay basic cases

---

## Migration, historical preservation, legacy roles

Per ADR-011 / FD-035:

- Preserve ZBP / BDM / affiliate / franchisee / enterprise / BOG (and similar) **history**
- Map via taxonomy; **no automatic commercial entitlement** from legacy labels alone
- Inactive commercial models remain inactive after migration (Affiliate, ZBP commercial, paid Lead Assist, cash-out)
- Backfill jobs are idempotent and audited
- Dry-run mode produces counts/diffs before apply

### Rollback

- Migration rollback rehearsal on staging backup
- Forward-fix preferred for prod; destructive down migrations gated
- Financial rows: compensate, do not delete (ADR-007 / ADR-010)

### Reconciliation tests

- Gateway fixture file ↔ payment captures
- Commission payable totals ↔ settlement batch lines
- Offline bank evidence ↔ activations
- Failures open exception queue records (Phase 13)

---

## UAT

UAT scripts (human) must include:

- Finance: batch approve with dual control; reject self-approval
- Marketplace Ops: approve/reject listing
- Customer: book (staging), cancel before 48h, attempt after 48h
- Lead Assist Desk: human review low-confidence lead; contact reveal audited
- Compliance: KYC view logged
- Support: cannot release settlement
- Explicit checks that ₹500 fee / escrow / cash-out / Affiliate payout UIs are absent or flagged off

Sign-off roles: Product, Finance, Compliance, Tech lead.

---

## Pilot acceptance

Pilot city remains **Founder-undecided** (FD-039) and does not block architecture — but pilot **go-live planning** requires city selection.

Pilot acceptance (Operational + Founder as needed):

- Flags: MoR ticket money movement only if compliance gate items cleared for pilot scope
- Stage 1 Lead Assist unpaid only
- Settlement cadence configurable; start with documented monthly Marketplace direction
- Incident & Support SLAs from Phase 13 Operational Recommendations staffed
- Reconciliation daily during pilot
- No production Aadhaar-mandatory workflows

---

## Production release gates

### Engineering gates

- CI green: unit, integration, RLS, lint/typecheck as repo requires
- E2E smoke on staging
- Migration applied on staging; rollback plan linked
- Sentry project configured; alert routing tested
- Feature flags default-safe for prod

### FD-039 compliance gate (money movement)

Before production reliance on Marketplace ticket money movement / related finance, validate (non-exhaustive; see FD-039 Part M):

1. GST treatment (tickets, memberships, BDP packs, Enterprise invoices)
2. Invoice structure identities
3. Payment-gateway configuration
4. Refund accounting
5. TDS / withholding
6. Settlement compliance
7. Final BDP legal agreements
8. Applicable Law & Compliance Register completeness
9. Privacy / KYC retention (**PENDING PRIVACY VALIDATION** until set)
10. Aadhaar edge-case workflows
11. Consumer cancellation/refund disclosures
12. Venue / Enterprise / Vendor agreements
13. Offline Admin payment controls

Architecture and tests may proceed while go-live remains blocked.

### Explicit non-gates

- Pilot city not chosen → blocks city rollout plan, **not** test harness existence
- Exact refund % unresolved → block customer-facing hard-coded %; allow placeholder policy versioning

---

## Risks

| Risk | Mitigation |
|------|------------|
| Fixtures invent Founder commercial numbers | Code review + constants sourced from `36_Commercial_Constants.md` / FDs only |
| RLS untested | Mandatory CI suite |
| Migration loses legacy history | ADR-011 preservation tests |
| Webhook double-pay | Idempotency tests |
| Flags on in prod by mistake | Default-off tests + Phase 13 change audit |
| UAT promises refund % | Script language review |

---

## Unresolved

- Final choice of Vitest/Playwright vs existing runners (confirm at install time — **no package.json change here**)
- Load/performance budgets
- Exact privacy retention days for test-data scrubbing policies
- Chargeback outcome matrix detail for advanced cases
- Pilot city and local staffing RACI

---

## Related documents

- ADR-004, ADR-005, ADR-006, ADR-007, ADR-008, ADR-010, ADR-011, ADR-012, ADR-013
- FD-020, FD-021, FD-029, FD-031, FD-032, FD-035, FD-036, FD-037, FD-038, FD-039
- All `docs/state-machines/*` exercised by this phase
- Phases 9–13 behaviours under test
