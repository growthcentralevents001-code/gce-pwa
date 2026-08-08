# Phase 12 — Notifications, Analytics, Audit & Security

| Field | Value |
|-------|-------|
| **Phase** | 12 |
| **Document** | `PHASE_12_NOTIFICATIONS_ANALYTICS_AUDIT_SECURITY.md` |
| **Type** | Phase planning / living architecture summary (documentation only) |
| **Status** | **Implementation Complete on gce-dev** — see `PHASE_12_IMPLEMENTATION_NOTES.md` |
| **Date** | 2026-08-08 |

---

## Authority

**Highest business authority (topic-scoped):**

| Topic | Authority |
|-------|-----------|
| RBAC / least privilege / no universal god mode | **FD-023** |
| Identity / workspaces / privileged Admin | **FD-035** |
| Auditable ledgers & settlements | **FD-020** / **FD-021** |
| Lead Assist consent, privacy, human review, no hard-delete of history | **FD-031** |
| Aadhaar minimisation; KYC retention gate; Sentry as technical default | **FD-039** |
| Notification *events* for membership / Circle / BDP / Lead Assist | **FD-022**, **FD-024**, **FD-025**, **FD-026**, **FD-027**, **FD-030**, **FD-031** |
| Attribution / approval history integrity | **FD-036** / **FD-037** / **FD-038** |

**Technical ADRs:**

- [`ADR-010`](../phase-2/adrs/ADR-010_Audit_and_Observability.md) — immutable audit, Sentry, structured logs (**primary**)
- [`ADR-005`](../phase-2/adrs/ADR-005_RLS_Strategy.md) — deny-by-default RLS
- [`ADR-001`](../phase-2/adrs/ADR-001_Authentication_Architecture.md) — auth
- [`ADR-013`](../phase-2/adrs/ADR-013_Feature_Flags.md) — gated capabilities
- [`ADR-014`](../phase-2/adrs/ADR-014_Background_Jobs_and_Scheduling.md) — async notification delivery

**Living companions:** `docs/core/20_Notifications.md`, `23_Analytics_Reports.md`, `17_Security.md`, `26_Error_Handling.md`, `docs/engineering/31_Security_Best_Practices_Expert.md`.

---

## Purpose

Define Phase 12 for cross-cutting **observability and trust controls**:

1. Multi-channel notifications with preferences and event-driven triggers
2. Analytics domains and high-level KPI families (no invented formulas)
3. Role-appropriate dashboards feeding
4. Immutable audit strategy for security, finance, KYC, and Admin actions
5. Security events, incident logs, monitoring (Sentry), and fraud-review architecture
6. Privacy controls with retention labelled **PENDING PRIVACY VALIDATION** where periods are unset

---

## Scope

### In scope

- Email, SMS/OTP, push (PWA), in-app notifications
- User / role notification preferences
- Event-driven notification catalogue (high-level)
- Analytics domains and KPI definition posture
- Dashboard data contracts (high-level; UI owned elsewhere)
- Audit events (security + business)
- Security events and incident logging
- Immutable audit strategy (ADR-010)
- KYC / identity-document access logging
- Privacy controls (consent, minimisation, Aadhaar posture)
- Retention placeholder (**PENDING PRIVACY VALIDATION**)
- Security monitoring & observability (Sentry + structured logs)
- Fraud-review architecture (signals → queue → human decision)

### Not in scope

- Inventing exact retention day counts as Founder law
- Making Aadhaar mandatory by default (FD-039)
- SIEM vendor selection as Founder Decision
- Full warehouse / BI tool procurement
- WhatsApp as mandatory launch channel (listed future in core notifications narrative)
- Activating advertising analytics that corrupt Trust Rank / organic routing
- Exact Lead Assist matching weights (Phase 10)

---

## Dependencies

| Dependency | Why |
|------------|-----|
| ADR-010 / FD-039 | Audit + Sentry defaults |
| Auth / RLS (ADR-001 / ADR-005) | Secure delivery and access |
| Phase 9–11 domain events | Notification & audit producers |
| Phase 13 Ops queues | Fraud / incident / dispute handling |
| FD-031 / FD-039 privacy posture | Consent, Aadhaar, KYC |

---

## Entry criteria

- ADR-010 Accepted
- Core notification event families indexed from FDs (membership 30-day renewal start, 7-day seat reservation, etc. where Founder-fixed)
- Sentry present or planned per env (verified stack notes `@sentry/nextjs`)
- Deny-by-default RLS strategy documented
- Feature flags for inactive channels/products

---

## Exit criteria

- Channel matrix + preference model documented
- Audit event minimum catalogue linked to finance / auth / KYC / Lead Assist / Admin offline payment
- Fraud-review queue interface described for Phase 13
- Retention explicitly marked PENDING PRIVACY VALIDATION
- KPI domains listed without invented formulas
- Observability runbook outline (Sentry projects, log correlation ids)

---

## Notification channels

| Channel | Launch posture |
|---------|----------------|
| **In-app** | Primary; role- and workspace-scoped (FD-023 / FD-035) |
| **Email** | Transactional + lifecycle |
| **SMS / OTP** | Auth and high-priority transactional (provider Pending Technical Design) |
| **Push (PWA)** | Supported where browser/PWA permissions allow |
| **WhatsApp** | Future — not mandatory launch |

### Preferences

Users may manage channel preferences for non-mandatory categories. **Security / OTP / legal / payment-critical** notices may be non-optional. Preferences are permission-scoped; do not leak other users’ data via notification payloads.

### Event-driven notifications (catalogue — high level)

Align producers to domain SMs / FDs; exact copy Pending Technical Design:

- Auth: registration, email/mobile verification, OTP
- Membership: purchase/activation, renewal window (**30 days** before expiry), grace, freeze, suspension, transfer, seat reservation (**7 days**)
- Circle: meetings, announcements (without implying GB independent membership termination)
- Lead Assist: offered, deadline, reassigned, human review, accept/decline/clarify, consent warnings (FD-031)
- Marketplace: booking, QR ready, cancel/refund status, offer claim/redeem
- BDP / Franchise: milestone, pack payment (incl. offline pending), commission status — without implying guaranteed income
- Finance: settlement paid / failed / hold (stakeholder-appropriate)
- Security: new login anomalies, permission changes (Admin)

Do not invent additional SLAs beyond Founder-approved timing concepts; Lead Assist operating-hours SLAs remain Unresolved.

---

## Analytics domains

Separate domains — do not merge into one vanity “growth” number:

1. **Acquisition & membership** — activations, renewals, grace, churn signals
2. **Circle health** — attendance concepts (FD-030); Circle Health Score formula **not approved**
3. **Lead Assist Stage 1** — offers, accept/decline, response latency, Desk overrides (non-punitive analytics for genuine members)
4. **Marketplace commerce** — GMV vs Collected vs Eligible vs Platform (Phase 9 concepts); claims vs redemptions
5. **Commission & settlement** — Estimated ≠ Paid; Outstanding; Recoverable Balance
6. **Attribution** — attributed vs organic/unattributed (FD-036 / FD-037)
7. **Customer CX** — feedback, no-purchase reasons, cancel requests
8. **Security / fraud** — flagged events, review outcomes
9. **Enterprise** — pipeline vs collected milestone revenue (proposal value ≠ achieved revenue)

Pending commission must never be reported as guaranteed payable (FD-021).

---

## KPI definitions (high-level posture)

KPIs must:

- Name the financial concept used (Collected vs Eligible vs Platform)
- Cite vertical and attribution rule when commission-related
- Label Unresolved formulas explicitly
- Avoid treating Lead Assist Stage 1 volume as revenue

**Do not invent** advertising prices, Vendor Opportunity Fee %, GST rates, Trust Rank formulas, or Circle Health thresholds here.

---

## Dashboards

Dashboards are **role-based workspaces**, not separate accounts (`docs/core/12_Dashboards.md`, FD-035 / ADR-003).

Phase 12 supplies:

- Metric definitions and access rules
- Audit of who viewed sensitive financial/KYC widgets (where required)
- Near-real-time vs batch freshness expectations (Pending Technical Design)

UI composition remains Phase UI / design-system work.

---

## Audit events & immutable strategy (ADR-010)

### Immutable audit strategy

- Append-only audit events for security- and compliance-relevant actions
- Actor, time, subject, before/after or transition id, correlation ids
- **No silent hard-delete** of financial or attribution history
- Soft-delete/archive may hide from UI; facts remain recoverable
- Corrections via reversal / compensating entries (ADR-007 / FD-020)

### Audit event families (minimum)

| Domain | Examples |
|--------|----------|
| Auth / RBAC | login, logout, role assignment change, permission grant/revoke |
| Finance | payment.*, refund.*, commission.*, settlement.*, offline bank recording |
| Marketplace | event/offer approval, booking, QR validate, claim, redeem |
| Lead Assist | lead.* per SM_Lead_Assist; contact reveal; human override |
| KYC | document upload, view, download, verification decision |
| Security | MFA change, anomaly flag, forced logout, impersonation if ever permitted |
| Admin / Ops | manual override, financial hold, dispute decision, moderation action |
| Feature flags | material pilot/prod flag changes |

---

## Security events & incident logs

Security events feed monitoring and Phase 13 incident handling:

- Authentication failures / brute-force signals
- RLS / authorisation denials at abnormal volume
- Webhook signature failures (ADR-006)
- Privilege escalation attempts
- KYC bulk export attempts
- Suspected fraud markers from payments / Lead Assist / offers

**Incident logs** capture: severity, detector, timeline, affected tenants/users, containment actions, communications, post-mortem link. Severity defaults for Ops SLAs → Phase 13 (Operational Recommendation).

---

## KYC access logging

Per FD-039 data-minimisation:

- Aadhaar **not mandatory by default**
- Prefer fit-for-purpose documents (PAN, DL, Passport, business/GST records, etc.)
- Every access to KYC artefacts logged (who, why, subject, timestamp)
- Avoid logging full KYC payloads into application logs (ADR-010)

Retention of KYC artefacts: **PENDING PRIVACY VALIDATION** (also FD-039 compliance gate item).

---

## Privacy controls

- Consent before sharing Lead Assist customer contacts (FD-031)
- Purpose limitation and least privilege
- Workspace isolation (FD-035)
- Export / delete requests follow approved legal privacy workflow — not ad-hoc hard-delete of financial truth
- Dark-pattern avoidance for cancel/consent (FD-039 compliance register direction)

### Retention placeholder

> Exact privacy / KYC / audit / notification log retention periods: **PENDING PRIVACY VALIDATION**

Architecture must support configurable retention without inventing day counts as Founder law.

---

## Security monitoring & observability

| Layer | Default |
|-------|---------|
| Errors / exceptions | **Sentry** (FD-039 technical default; ADR-010) |
| Logs | Structured JSON with request/action correlation ids |
| Uptime | Basic health checks on VPS path (ADR-012) |
| Deep APM | Optional later |

Secrets, full card data, and unnecessary Aadhaar/KYC payloads must not appear in logs.

---

## Fraud-review architecture

```text
Signal sources (payments, chargebacks, Lead Assist, offers, device/auth)
    → Fraud signal record (coded reason, severity, subjects, evidence refs)
    → Feature-flagged auto-holds on finance/lead where policy allows
    → Fraud Review Queue (Phase 13 Ops / Compliance / Finance)
    → Human decision: Clear / Restrict / Escalate / Freeze settlement
    → Immutable audit + notifications to affected parties as lawful
```

AI may **flag**; AI may **not** independently suspend membership, release/hold settlement permanently, or determine legal liability (FD-031 human-control principle extended to fraud ops).

Exact score thresholds Unresolved — do not invent.

---

## Risks

| Risk | Mitigation |
|------|------------|
| PII in plain logs | ADR-010 redaction rules |
| Soft-delete mistaken for hard-delete | Immutable audit + finance retention |
| Notification spam / dark patterns | Preference model + mandatory-only critical |
| Vanity KPIs hiding unpaid commission | Concept separation from Phase 9 |
| Aadhaar over-collection | FD-039 minimisation |
| Unvalidated retention claims | PENDING PRIVACY VALIDATION label |

---

## Unresolved

- Exact retention periods (privacy / KYC / audit) — **PENDING PRIVACY VALIDATION**
- SMS/Email/Push provider final selection and templates
- Exact fraud score thresholds and auto-hold matrix
- SIEM / long-term log archive vendor
- Full product analytics warehouse design
- WhatsApp channel activation criteria
- Operating-hours SLAs for Lead Assist notifications

---

## Related documents

- ADR-010 (primary), ADR-001, ADR-005, ADR-013, ADR-014
- FD-023, FD-031, FD-035, FD-039, FD-020, FD-021
- `20_Notifications.md`, `17_Security.md`, `23_Analytics_Reports.md`
- Phase 9–11 producers; Phase 13 consumers (queues); Phase 14 security/RLS tests

---

## Implementation status

Implemented on **gce-dev** (`20260808230000_phase12_notifications_analytics_security_compliance`). Shared notification outbox, analytics minimisation, audit search, security/risk (flag_only), compliance holds, privacy/retention hooks. Live providers + marketing + retention_enforcement OFF. Phase 13 not started.
