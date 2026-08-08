# Phase 13 — Admin Operations & Support

| Field | Value |
|-------|-------|
| **Phase** | 13 |
| **Document** | `PHASE_13_ADMIN_OPERATIONS_SUPPORT.md` |
| **Type** | Phase planning / living architecture summary (documentation only) |
| **Status** | Draft |
| **Date** | 2026-08-08 |

---

## Authority

**Highest business authority:**

| Topic | Authority |
|-------|-----------|
| RBAC, department-scoped administration, no default god mode | **FD-023** |
| Identity, role assignment, workspaces, Opportunity Desk | **FD-035** |
| Marketplace event/offer final approval; payout cannot be self-released by Venue/BDP | **FD-037** |
| Membership approval / attribution / allocation / RM / waitlist | **FD-036** |
| Enterprise quotation / Finance co-sign / vendors | **FD-038** |
| Settlement holds / manual override audit | **FD-021** |
| Commission self-approval forbidden | **FD-029** |
| Lead Assist Desk ethics / disputes | **FD-031** |
| Offline BDP pack Admin workflow; Super Admin not ordinary product role | **FD-039** |
| Circle governance boundaries (GB ≠ independent membership termination) | **FD-030** |

**Technical ADRs:** ADR-002 (RBAC), ADR-003 (workspaces), ADR-010 (audit), ADR-013 (flags).

**Living companions:** `docs/core/12_Dashboards.md`, `35_Role_Taxonomy.md`, `17_Security.md`.

---

## Purpose

Define Phase 13 for **human operating surfaces** that keep GCE safe, fair, and financially controlled:

- Platform / Connect / Marketplace / Enterprise Operations
- Finance, Compliance, Support
- Relationship Manager (RM) and Platform Relationship Manager (PRM) tasking — **without inventing finance authority**
- Approval, exception, dispute, and moderation queues
- Role management, reassignment, manual overrides, financial holds
- Incident handling and customer/partner support
- Ops dashboards and **Operational Recommendation** SLAs (not Founder commercial law)

**Hard rule:** This document must **not** invent Founder commercial rates, tax rates, refund %, commission splits, or MoR implementation details. Ops may execute only approved policy.

---

## Scope

### In scope

- Ops org surfaces by vertical and function
- Approval queues (membership, Circle allocation inputs, Marketplace listings, Enterprise quotations above thresholds, KYC, offline payments)
- Exception queues (finance mismatches, settlement failures, webhook anomalies)
- Dispute handling (attribution, Lead Assist, booking, settlement)
- Moderation (content / abuse / spam)
- Role management & reassignment workflows
- Manual overrides (audited)
- Financial holds
- Incident handling
- Customer & partner support playbooks (high-level)
- Ops dashboards
- SLA defaults labelled **Operational Recommendation**
- Escalation matrix (Operational Recommendation)

### Not in scope

- Inventing Founder commercial rules or changing FD splits
- Granting RM/PRM automatic refund/settlement/commission approval (FD-023 / FD-029 / FD-033)
- Super Admin as ordinary product role (FD-039)
- Connect BDP independently activating Circles or memberships
- Opportunity Desk owning leads or taking hidden commission
- Native apps / international expansion ops programmes (inactive)

---

## Dependencies

| Dependency | Why |
|------------|-----|
| FD-023 / FD-035 | Permissions and workspaces |
| Phases 9–12 | Finance, Lead Assist, Marketplace CX, audit/fraud signals |
| State machines | Legal transitions only |
| ADR-010 | Every override/hold audited |

---

## Entry criteria

- Role taxonomy distinguishes Ops / Finance / Compliance / Support / RM / PRM / Opportunity Desk / Venue Rep
- Approval authorities cited from FD-036 / FD-037 / FD-038
- Audit pipeline available for Admin actions
- Feature flags prevent inactive commercial paths from Ops “enable” without Founder gate

---

## Exit criteria

- Queue catalogue documented with owner role family
- Manual override policy: dual-control where financial; always audited
- SLA table published as Operational Recommendation
- Escalation matrix published as Operational Recommendation
- Support macros do not promise invented refund % or guaranteed income
- UAT scripts for approval and hold paths (Phase 14)

---

## Operating functions

### Platform Ops

Cross-vertical coordination, incident command, feature-flag governance (with change audit), release readiness liaison.

### Connect Ops

Membership verification support, Circle allocation coordination (platform authority), waitlist/transfer exceptions per FD-036, Connect BDP operating reviews — **without** Connect BDP independent Circle activation.

### Marketplace Ops

**Final-approves** Marketplace Events and Offer Events (FD-037). Venue onboarding quality, listing moderation, QR/redemption exception support. Does not let Venue/MBDP release settlement.

### Enterprise Ops

Project workflow support, Platform Expert assignment coordination, vendor coordination (managed vendors without mandatory self-serve login — FD-039 inactive portal). Quotations above **₹5,00,000** require Finance co-sign before final issue (FD-038) — threshold is approval control, not a fee.

### Finance Ops / Finance Admin

Settlement batches, holds, offline BDP pack evidence, reconciliation exceptions, refund authorisation within approved policy, Recoverable Balance monitoring (Phase 9). Beneficiary ≠ approver.

### Compliance

KYC review, Aadhaar edge cases (minimisation), policy version control, Applicable Law & Compliance Register liaison (FD-039), privacy request handling with Legal.

### Support

Customer and partner tier-1 handling; escalate to vertical Ops / Finance / Compliance per matrix. No settlement release authority by default.

### RM / PRM

Relationship and coordination tasks only. **No automatic financial authority** (FD-023). PRM must not be treated as Lead Owner or hidden commission recipient (FD-031).

### Opportunity Desk

Lead verification / matching / dispute support (Phase 10) — Desk ethics constraints apply.

---

## Approval queues

| Queue | Typical final authority (cite FD) |
|-------|-----------------------------------|
| Membership approval / activation gates | Platform per FD-036 (not Connect BDP alone) |
| Circle seat allocation | Platform allocation authority (FD-036) |
| Marketplace Event / Offer Event publish | Platform Marketplace Operations (FD-037) |
| Venue Partner activation | Platform final approval; MBDP ordinarily onboards (FD-033 / FD-037) |
| Enterprise quotation ≥ ₹5,00,000 | Finance co-sign required (FD-038) |
| KYC verification decision | Compliance / authorised Ops |
| Offline BDP pack payment confirm | Finance / authorised Admin dual control (FD-039) |
| Settlement batch approve | Finance (FD-021); dual control where required |
| Refund approve | Finance / authorised Ops within **approved** refund policy (not invented %) |
| Role assignment privileged grants | Authorised Admin per FD-035 / FD-023 |

Each queue item stores: subject, requester, evidence, policy version, decision, actor, timestamp → audit.

---

## Exception queues

- Payment webhook / reconciliation mismatch
- Settlement payout bank failure retries exhausted
- Commission calculation rule-version anomalies
- Double-commission prevention hits (FD-038)
- Attribution conflicts (Connect / Marketplace)
- Offline payment evidence incomplete
- MoR / tax validation blockers (do not bypass for prod money)

---

## Dispute handling

Domains:

1. Marketplace booking / cancel / refund disputes
2. Offer claim / redemption disputes
3. Lead Assist routing / attribution / duplicate / privacy disputes (FD-031)
4. Membership / Circle seat / waitlist disputes (FD-036)
5. Commission / settlement disputes (Finance-owned outcome)
6. Content / conduct moderation disputes

Process posture: intake → triage severity → freeze finance if money at risk → investigate with audit trail → decision → notify → optional appeal path (exact appeal SLA Operational Recommendation).

AI may assist triage; humans decide (FD-031 principle).

---

## Moderation

- Listing content, spam, abuse, misleading offers
- Lead Assist abuse patterns (without automatic invented Trust Rank penalties)
- Enforce “Sponsored” labelling if ads ever activate — ads inactive at launch (FD-039)

Moderation cannot silently alter financial ledgers.

---

## Role management & reassignment

- User ≠ role; assignments are records (FD-035 / ADR-002)
- Reassignment of RM / MBDP venue attribution / Enterprise Expert must respect effective-date and non-retroactive entitlement rules (FD-037 / FD-036 / FD-038)
- Temporary inactivity ≠ automatic attribution termination; prolonged inactivity review required for Marketplace venues (FD-037)
- Super Admin not an ordinary product role (FD-039)

---

## Manual overrides & financial holds

### Manual overrides

Allowed only when:

- Policy permits
- Actor authorised
- Reason coded
- Dual control for financial entitlement changes where required
- Fully audited (FD-021 §34 — never silent)

Overrides cannot invent new commercial percentages.

### Financial holds

Place holds for: dispute, chargeback, fraud review, refund window, missing evidence, compliance investigation (FD-021).

Hold blocks settlement eligibility progression until cleared.

---

## Incident handling

Align with Phase 12 security events:

1. Detect / report
2. Acknowledge per SLA (below)
3. Contain (flags, forced logout, hold settlement, disable webhook consumer, etc.)
4. Eradicate / recover
5. Communicate (internal + customer as lawful)
6. Post-incident review with audit artefacts

---

## Customer & partner support

Support covers customers, members, Venue Partners, BDPs, Enterprise client representatives.

Playbook rules:

- Do not promise guaranteed referrals, income, or nationwide access
- Do not quote invented refund %
- Do not enable cash-out or paid Lead Assist
- Escalate money movement issues to Finance
- Escalate KYC/privacy to Compliance

---

## Ops dashboards

High-level widgets (definitions from Phases 9–12):

- Open approval / exception / dispute / fraud counts by severity
- Settlement batch status
- Offline payment pending evidence
- Lead Assist Desk backlog
- Incident board
- SLA breach indicators

No single unqualified “Revenue” tile.

---

## SLA defaults — Operational Recommendation

> **Label:** Operational Recommendation — **not** a Founder Decision and **not** commercial law. Adjust via Ops policy without rewriting FDs.

| Severity | Definition (ops) | Acknowledge | Update cadence | Target resolution intent |
|----------|------------------|-------------|----------------|--------------------------|
| **P1** | Production down, widespread payment failure, suspected active breach, settlement mass mis-pay | **1 hour** | Every 1 hour | Continuous until mitigated |
| **P2** | Major feature impaired (booking, Lead Assist routing, Admin approvals blocked) for many users | **4 hours** | Every 4 hours / 2× daily | Same business day if possible |
| **P3** | Limited impact defect, single-tenant finance exception, ordinary support | **1 business day** | Every 2 business days | Within 5 business days unless queued behind P1/P2 |
| **P4** | Cosmetic / backlog enhancement | **3 business days** | Weekly | Backlog prioritisation |

**Queue acknowledgements (Operational Recommendation):**

- Marketplace listing approval: acknowledge **1 business day**; decision target **3 business days** (volume-dependent)
- Offline BDP pack evidence review: acknowledge **4 hours**; decision target **2 business days**
- Fraud review with settlement freeze: acknowledge **4 hours**; Finance join within **1 business day**
- Lead Assist human-review high-value/privacy: acknowledge **4 hours** during Desk operating hours (exact hours Unresolved)

Business day = India operating calendar as defined by Ops policy (timezone IST recommended).

---

## Escalation matrix — Operational Recommendation

> **Label:** Operational Recommendation — not Founder commercial law.

| Situation | L1 | L2 | L3 |
|-----------|----|----|-----|
| Customer booking / ticket | Support | Marketplace Ops | Platform Ops + Finance (if money) |
| Refund request | Support | Finance Ops | Finance Admin + Compliance (disputed) |
| Settlement unpaid / failed | Finance Ops | Finance Admin | Platform Ops + Founder escalate if systemic |
| Lead Assist dispute | Opportunity Desk | Connect Ops | Compliance / Platform Ops |
| Attribution dispute | Vertical Ops | Finance (if entitlement) | Platform Ops |
| KYC / privacy | Support | Compliance | Legal liaison |
| Security incident | On-call / Platform Ops | Compliance + Tech lead | Founder / external counsel as needed |
| Enterprise quote ≥ ₹5L | Enterprise Ops | Finance co-sign | Platform Ops |
| Offline pack activation | Finance Ops | Dual-control Finance Admin | Platform Ops |

RM/PRM appear as **coordinators**, not L2 finance approvers.

---

## Risks

| Risk | Mitigation |
|------|------------|
| Ops inventing commercial exceptions | Dual control + FD citation required on override |
| RM/PRM finance creep | FD-023 explicit denial + UI permission gaps |
| Silent overrides | ADR-010 mandatory |
| SLA treated as Founder law | Operational Recommendation labelling |
| Bypass MoR gate via Admin | Flags + Compliance checklist |

---

## Unresolved

- Exact Desk and Support operating hours
- Final appeal process timelines beyond Operational Recommendation
- Staffing model / RACI for pilot city (city undecided — FD-039)
- Exact macro library copy
- Whether any future Super Admin break-glass exists (not ordinary role)

---

## Related documents

- FD-023, FD-035, FD-036, FD-037, FD-038, FD-021, FD-029, FD-031, FD-039, FD-030
- Phases 9–12; Phase 14 for ops UAT and release gates
- `35_Role_Taxonomy.md`, ADR-002, ADR-010
