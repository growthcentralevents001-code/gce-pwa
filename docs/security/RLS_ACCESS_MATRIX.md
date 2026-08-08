# RLS_ACCESS_MATRIX — Logical Policy Intent

| Field | Value |
|-------|-------|
| **Status** | Living documentation (Phase 9 — Finance policies applied on gce-dev) |
| **Classification** | Logical RLS **policy intent** — SQL lives in migrations (ADR-004) |
| **Authority** | [ADR-005](../phase-2/adrs/ADR-005_RLS_Strategy.md) (technical); FD-023 / FD-035 (permission rules); ADR-004 (policies live in migrations) |
| **Related** | [`RBAC_PERMISSION_MATRIX.md`](./RBAC_PERMISSION_MATRIX.md), [`../data/DATA_OWNERSHIP_AND_SOURCE_OF_TRUTH.md`](../data/DATA_OWNERSHIP_AND_SOURCE_OF_TRUTH.md), `docs/phase-4/PHASE_4_IMPLEMENTATION_NOTES.md` |

---

## Authority

1. **Deny-by-default RLS** for tenant-, assignment-, person-, and finance-scoped tables accessible via Supabase client keys (ADR-005).
2. **Service role** may bypass RLS and is **server-only** — never browser / PWA / client env (ADR-005).
3. RLS does **not** replace workflow SoD (e.g. self-approval bans) — domain services still enforce FD-023 / FD-035.
4. Exact policy SQL is authored only in `supabase/migrations/` (ADR-004). This file must not invent final `CREATE POLICY` text.

---

## Purpose

Map **resource × role × policy intent** so migrations and API design share one deny-by-default mental model before SQL is written.

---

## Not in scope

- Final `CREATE POLICY` / helper-function SQL
- Performance benchmarks or index prescriptions
- Column-level encryption product choice
- Inventing table names as schema SoT

---

## Policy intent vocabulary

| Intent | Meaning |
|--------|---------|
| **Deny** | No client-key access (default) |
| **Own rows** | `auth.uid()` maps to row subject / owner user id |
| **Assigned scope** | Active RoleAssignment grants access to rows in that assignment’s scope |
| **Org scope** | User is authorised rep of Organisation that owns the row |
| **Circle scope** | Active Circle Member or limited GB appointment for that Circle |
| **Platform admin** | Department-scoped admin assignment explicitly covers the resource class |
| **Finance scoped** | Finance Admin (or narrower finance permission) + optional assignment filter |
| **Server only** | No authenticated client policy; service role / trusted backend only |

All intents assume: **RLS enabled; no policy ⇒ no access** (deny-by-default).

---

## Cross-cutting defaults

| Topic | Intent |
|-------|--------|
| Anon key | Public read only for explicitly published surfaces; else Deny |
| Authenticated with no assignment | Own User profile / own consumer records only |
| Soft-deleted rows | Still Deny to ordinary roles unless admin recovery intent + audit |
| Service role | Server only; bypasses RLS; every use audited operationally (TR) |
| Break-glass | Temporary Platform admin path; must audit; must not disable RLS globally (ADR-005) |

---

## Matrix — Identity & RBAC resources

| Resource (logical) | User | Circle Member | GB (limited) | BDP families | Venue Rep | Ent. Client Rep | Platform Ops | Finance Admin | Compliance Admin | Support Admin | RM / PRM |
|--------------------|------|---------------|--------------|--------------|-----------|-----------------|--------------|---------------|------------------|---------------|----------|
| User profile (own) | Own rows | Own rows | Own rows | Own rows | Own rows | Own rows | Own + Assigned (TR) | Own + case (TR) | Own + case (TR) | Own + case (TR) | Own + Assigned case (TR) |
| User profile (others) | Deny | Deny | Circle limited (TR) | Assigned limited (TR) | Org peers limited (TR) | Org peers limited (TR) | Platform admin | Finance scoped if needed (TR) | Platform admin | Case (TR) | Assigned case (TR) |
| RoleAssignment | Own read | Own read | Own read | Own read | Own read | Own read | Platform admin | Limited read (TR) | Platform admin | Case (TR) | Assigned read (TR) |
| KYC / ID documents | Own rows | Own rows | Deny | Deny (unless Assigned verify TR) | Deny | Deny | Assigned / Platform Ops (TR) | Finance if payout KYC (TR) | Platform admin | Deny full | Assigned limited (TR) |

**KYC fields restricted:** client policies must not expose identity-document payloads broadly. Masked status may be wider than raw document bytes (FD-023 sensitive data; FD-039 Aadhaar minimisation). Exact column split: **Pending Technical Design**.

---

## Matrix — Membership & Circle

| Resource (logical) | User | Circle Member | GB (limited) | Connect BDP | Other BDPs | Platform Ops | Finance Admin | Compliance | RM |
|--------------------|------|---------------|--------------|-------------|------------|--------------|---------------|------------|-----|
| Membership (own) | Own rows | Own rows | — | Assigned | Deny | Platform admin | Finance scoped | Platform admin | Assigned |
| Membership (others) | Deny | Deny | Circle limited (TR) | Assigned | Deny | Platform admin | Finance scoped | Platform admin | Assigned |
| Circle header | Public limited (TR) / Deny private | Circle scope | Circle scope | Assigned | Deny | Platform admin | Read finance fields Finance scoped | Platform admin | Assigned |
| Seat | Deny | Circle / own seat | Circle | Assigned | Deny | Platform admin | Deny mutate | Platform admin | Assigned |
| GB appointments | Deny | Circle read (TR) | Circle scope | Assigned read (TR) | Deny | Platform admin | Deny | Platform admin | Assigned |
| Dual status fields | Read per Circle visibility | Circle scope | Circle scope | Assigned | Deny | Platform admin | Read (TR) | Platform admin | Assigned |

Lifecycle vs constitution status are separate attributes — policies may read both but must not collapse authorization on a single invented enum (FD-032).

---

## Matrix — Connect BDP (Phase 6)

| Resource (logical) | Connect BDP | Platform Ops | Finance Admin | PRM | Other BDPs |
|--------------------|-------------|--------------|---------------|-----|------------|
| Franchise Unit / pack | Own rows | Platform admin | Read finance fields | Deny | Deny |
| City assignment | Own read | Platform admin | Deny | Deny | Deny |
| Member attribution | Own / member-visible; propose insert | Platform admin write | Deny mutate | Deny | Deny |
| Circle portfolio | Own read | Platform admin | Deny | Deny | Deny |
| Target credits | Own read; **no client insert** | Platform admin read | Deny | Deny | Deny |
| Commission entitlements | Own read | Platform admin | Read/write Finance | Deny | Deny |
| Recovery ledger | Own read | Platform admin | Read Finance | Deny | Deny |
| Disputes | Own + PRM assigned | Platform admin | Deny | Assigned | Deny |
| Handovers | Deny (admin) | Platform admin | Deny | Deny | Deny |

Service-role/RPC only for target credit + recovery apply. Pack payment production collection remains feature-flagged OFF.

---

## Matrix — Marketplace

| Resource (logical) | Venue Partner / Rep | Marketplace BDP | Customer User | Platform Ops | Finance Admin | RM |
|--------------------|---------------------|-----------------|---------------|--------------|---------------|-----|
| VenuePartner org | Org scope | Assigned attribution | Public listing only (TR) | Platform admin | Finance scoped | Assigned |
| Event / OfferEvent | Org scope | Assigned support read/write limited (TR) | Published read | Platform admin | Read | Assigned |
| OfferClaim / Booking | Org scope | Assigned read (TR) | Own rows | Platform admin | Finance scoped | Assigned |
| Redemption | Org scope | Assigned read (TR) | Own rows | Platform admin | Finance scoped | Assigned |
| VenueAttribution | Deny mutate | Assigned read; mutate Platform / controlled workflow (TR) | Deny | Platform admin | Read | Assigned read |
| marketplace_bdp_units (Phase 7) | Deny | Own | Deny | Platform admin | Read finance | Deny |
| marketplace_venues (Phase 7) | Org / rep | Attributed portfolio | Published active read | Platform admin | Read | Assigned |
| marketplace_events / offers (Phase 7) | Venue manage draft/submit | Portfolio read / recommend | Published | Platform final approve | Read | Assigned |
| marketplace_bookings / tickets (Phase 7) | Venue read | Attributed read (TR) | Own | Platform admin | Finance scoped | Deny |
| marketplace_offer_claims / redemptions | Venue read/redeem | Portfolio read | Own claims | Platform admin | Read | Deny |
| marketplace_revenue_entitlements | Venue share read | Own MBDP share | Deny | Platform/Finance | Write Finance | Deny |

Marketplace BDP must not receive blanket “all venues in city” policies — attribution/assignment scoped (FD-033).
Legacy prototype `venues` RLS enabled in Phase 7 migration; canonical SoT remains `marketplace_*`.

**Phase 11 CX tables (gce-dev / `20260808220000`):** `customer_cx_preferences`, `customer_refund_requests`, `customer_feedback`, `customer_non_purchase_reasons`, `customer_domain_events`, `customer_trust_rank_snapshots`, `venue_performance_rank_snapshots`, `customer_support_signals` — own-row customer select/insert; Venue/MBDP do not gain blanket private customer profile access. Public discovery continues on published marketplace Event/Offer rows only.

**Phase 12 ops tables (gce-dev / `20260808230000`):** `notification_*`, `in_app_notifications`, `push_subscriptions`, `analytics_events`, `security_events`, `risk_signals`, `operational_alerts`, `incident_signals`, `compliance_holds`, `privacy_requests`, `retention_*`, `sensitive_access_events` — deny-by-default; users own notifications/prefs/privacy requests; security/risk/alerts/holds restricted to platform/compliance/support (and finance where scoped). Audit remains append-only `audit_events`.

**Phase 13 ops admin tables (gce-dev / `20260808240000`):** `ops_cases`, `ops_case_events`, `ops_case_notes`, `ops_case_links`, `ops_approval_queue`, `ops_exception_queue`, `ops_overrides`, `ops_moderation_actions`, `ops_incident_actions` — deny-by-default; operators via `gce_is_ops_operator` / vertical helpers; internal notes not customer-visible; security/compliance-typed cases stricter; finance cases Finance/Admin scope. Approval queue is projection (domain services remain SoT).

---

## Matrix — Enterprise

**Implementation note (Phase 8 / gce-dev):** Canonical tables `enterprise_client_profiles`, `enterprise_bdp_packs`, `enterprise_client_attributions`, `enterprise_opportunities`, `enterprise_requirements*`, `enterprise_solution_proposals`, `enterprise_quotes*`, `enterprise_projects*`, `enterprise_milestones`, `enterprise_vendors*`, `enterprise_change_orders`, `enterprise_disputes`, `enterprise_revenue_entitlements`, `gce_commissioned_revenue_components`. Deny-by-default RLS; vendor staff-managed; entitlement rows Finance/admin/own-pack. Legacy `enterprise_requests`/`enterprise_proposals` remain historical. Migration `20260808190000_phase8_enterprise`.

| Resource (logical) | Ent. Client Rep | Enterprise BDP | Platform Expert | Finance Admin | Platform Admin |
|--------------------|-----------------|----------------|-----------------|---------------|----------------|
| EnterpriseClient | Org / primary rep | Active attribution | ✓ | scoped | ✓ |
| Opportunity / Requirement | Org scope | Attributed | ✓ | limited | ✓ |
| Proposal / Quote | Org (client-facing) | Attributed (no issue alone) | ✓ draft/issue | co-sign path | ✓ |
| Project / Component / Milestone | Org scope | Attributed | ✓ | Finance scoped | ✓ |
| VendorRecord | Client-facing limited | Limited | ✓ manage | Finance scoped | ✓ |
| Entitlement boundary | Deny | Own pack | Deny | ✓ | ✓ |
| Commissioned revenue component claim | Deny | Deny | Deny | ✓ read | ✓ |

---

## Matrix — Finance tables (restricted)

**Implementation note (Phase 9):** Also covers `revenue_components`, `stakeholder_entitlements`, `settlement_batches`, `payout_items`, `recovery_applications`, `financial_holds`, `offline_payment_records`, `reconciliation_records` — Finance Admin write; own-entitlement/payout read for stakeholders; deny self-settlement.

| Resource (logical) | BDP / Member / Venue / Client | RM / PRM / Support | Platform Ops | Finance Admin | Compliance Admin | Service role |
|--------------------|-------------------------------|--------------------|--------------|---------------|------------------|--------------|
| Payment | Own / Org related read (TR) | Case limited read (TR) | Limited read (TR) | **Finance scoped** | Read audit (TR) | Server only jobs |
| LedgerEntry | Own summary read (TR); Deny raw mutate | Deny mutate; limited read (TR) | Deny mutate | **Finance scoped** | Read | Server only |
| CommissionEntitlement | Own rows read; Deny approve | Deny | Deny approve | **Finance scoped** (+ SoD checks in app) | Read | Server only |
| SettlementBatch | Own payout status read (TR) | Deny release | Deny release | **Finance scoped** | Read | Server only |
| Wallet / Recoverable Balance | Own read | Deny | Deny | **Finance scoped** | Read | Server only |
| Tax / bank payout details | Deny / Own masked (TR) | Deny | Deny | **Finance scoped** | Need-to-know (TR) | Server only |

**Finance tables → Finance Admin + scoped** (ADR-005 / FD-020 / FD-023). Operational roles do not get broad `SELECT` on ledger/commission tables by default.

Application layer still blocks self-approval even if a buggy policy were too wide — defence in depth (ADR-005).

---

## Matrix — Lead Assist, notification, audit

| Resource (logical) | Lead parties | Desk / Platform Ops (TR) | Circle Member receiver | PRM | Compliance | Finance |
|--------------------|--------------|--------------------------|------------------------|-----|------------|---------|
| Lead | Own / Assigned party | Desk scope | Assigned receive | Escalation Assigned | Platform admin | Deny unless commercial link (TR) |
| AssignmentHistory | Read own chain (TR) | Desk scope | Limited (TR) | Assigned | Platform admin | Deny |
| OpportunityDeskItem | Deny (unless party) | Desk scope | Deny | Assigned | Platform admin | Deny |
| Notification | Own rows | Platform admin | Own rows | Own / case (TR) | Platform admin | Own |
| AuditEvent | Deny | Limited (TR) | Deny | Limited (TR) | **Platform admin** | Finance-related read |

Lead history: prefer soft status; hard-delete only legal workflow — policies should not offer casual DELETE to clients (FD-031).

**Phase 10 physical tables (gce-dev):** `assist_leads`, `assist_lead_requirement_versions`,
`assist_lead_routing_candidates` (desk-only; candidates ≠ assignment), `assist_lead_assignments`,
`assist_opportunity_desk_queue`, `assist_contact_reveal_events`, `assist_lead_outcomes`,
`assist_closed_business_confirmations`, `assist_lead_*_flags`, `assist_domain_events`.
Deny-by-default RLS; candidate ranking never grants contact access.

---

## Service role (server-only)

| Allowed | Forbidden |
|---------|-----------|
| Route Handlers, trusted jobs, controlled admin backends | Browser, PWA bundle, `NEXT_PUBLIC_*`, mobile client embeds |
| Migrations / privileged maintenance with audit | Using service role to “skip” SoD in product UX |
| Webhook ingestion after signature verify (TR) | Broad ad-hoc scripts without access control |

Compromise of service role is a critical incident class (ADR-005).

---

## Mapping from RBAC to RLS

| RBAC concept (FD-023 / FD-035) | RLS intent |
|--------------------------------|------------|
| Own record | Own rows |
| Assigned Circle / venue / client / territory / department | Assigned scope |
| Organisation representative | Org scope |
| Platform-wide only where explicitly approved | Platform admin (narrow resource class) |
| Financial permission separate | Finance scoped tables |
| No role ⇒ no access | Deny-by-default |

Permission matrices may allow an action that RLS still denies if assignment status is inactive — both layers must agree.

---

## Unresolved

| Item | Status |
|------|--------|
| Final policy SQL per table | Pending Technical Design — migrations only |
| Helper functions (`auth.uid()` → assignment cache) | Pending Technical Design |
| Column-level KYC restrictions vs separate tables | Pending Technical Design / Privacy |
| Exact public listing surfaces for Event | Pending Product / Security review |
| Performance of multi-scope OR policies | Pending engineering validation |

Do **not** copy this matrix into SQL verbatim as “final law.” Label implementation PRs as implementing ADR-005 intents under FD-023 / FD-035.
