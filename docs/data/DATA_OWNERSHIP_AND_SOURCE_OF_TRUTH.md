# DATA_OWNERSHIP_AND_SOURCE_OF_TRUTH

| Field | Value |
|-------|-------|
| **Status** | Living documentation (Phase 2) |
| **Classification** | Ownership + SoT rules (business and technical) |
| **Authority** | FD-034 (corporate/platform constitution); vertical FDs for content/attribution; ADR-004 (schema SoT) |
| **Related** | [`DATA_DOMAIN_MODEL.md`](./DATA_DOMAIN_MODEL.md), [`ENTITY_RELATIONSHIP_BLUEPRINT.md`](./ENTITY_RELATIONSHIP_BLUEPRINT.md) |

---

## Authority

| Layer | Source of truth |
|-------|-----------------|
| **Business rules / commercial meaning** | Founder Decisions (`docs/founder-decisions/`) — highest business authority |
| **Living narrative (non-conflicting)** | `docs/core/` (defers upward on conflict) |
| **Applied database schema** | `supabase/migrations/` — [ADR-004](../phase-2/adrs/ADR-004_Database_Schema_Source_of_Truth.md) |
| **RLS policy SQL (as applied)** | Same migrations; principles in [ADR-005](../phase-2/adrs/ADR-005_RLS_Strategy.md) |
| **Role names** | `docs/core/35_Role_Taxonomy.md` + FD-023 / FD-035 |

This document does **not** invent DDL. Illustrative entity names are logical only.

---

## Purpose

State **who owns or controls what data**, how platform assets relate to Circles / BDPs / Venue Partners / Enterprise Clients, and how soft-delete vs hard-delete and legacy preservation must behave for Phase 2.

---

## Not in scope

- Final privacy retention schedules (Pending Legal / Privacy)
- Exact GDPR/DPDP deletion runbooks SQL
- Inventing MoR beneficial-ownership of funds beyond FD-034 / FD-039 direction
- Treating BDPs as Logixia employees, partners, or brand owners (forbidden by FD-034)

---

## 1. Corporate and platform asset ownership (FD-034)

**Logixia Solutions Private Limited** is the intended legal company that owns, operates, and commercialises the GCE platform (subject to valid corporate documentation).

**Growth Central Events (GCE)** is the platform and master brand / product division — not a separate company by default.

Subject to valid assignment and law, Logixia / GCE platform assets include (conceptual):

- Platform software, schemas, workflows, and operational databases as platform systems
- GCE brand and approved IP under Logixia control
- Platform taxonomy, Circle definitions as platform structures
- Non-personal platform metadata and system audit infrastructure
- Contracting and payment operator posture where Logixia is the contracting entity (FD-034)

Stakeholders (BDPs, members, Venue Partners, vendors, Governing Body) receive **limited, revocable access** — not ownership of the platform, brand, or unrestricted data estate (FD-034).

Logixia does **not** automatically become beneficial owner of all money collected; Venue Partner shares and other stakeholder entitlements remain as commercial rules dictate (FD-034 / FD-029).

---

## 2. Circles are not BDP-owned (FD-025 / FD-030)

| Assertion | Authority |
|-----------|-----------|
| Circle is a **platform-governed** unit | FD-030 |
| GCE owns/controls Circle structure, capacity rules, taxonomy hooks, activation authority | FD-030 |
| Connect BDP **manages/supports** Circles; does **not own** Circles, members, territory permanently, or GCE data | FD-025 / FD-030 |
| Governing Body does **not own** Circles; limited governance support only | FD-030 |
| Members are participants under membership terms — not Circle owners | FD-034 / FD-030 |

Franchise Unit fee / commercial pack purchases grant **conditional operating rights**, not ownership of Circles or data (FD-025 / FD-039).

---

## 3. Marketplace: Venue Partner content vs platform vs BDP (FD-033 / FD-037)

| Concern | Owner / controller | Notes |
|---------|-------------------|-------|
| Venue Partner business identity & listing content (events/offers) | Venue Partner (within platform rules) | Platform may moderate/suspend per compliance |
| Customer/platform relationship records | Platform operator (Logixia/GCE) subject to law | BDP is not legal owner of customer data (FD-033) |
| Venue attribution for commission | Platform-recorded attribution | Marketplace BDP does not permanently own city/venues |
| Marketplace BDP | Commercial partner | Not owner of Venue Partner; not Venue employee by default |

Marketplace BDP must not sell data, privately transfer attribution, or bind Logixia without authority (FD-033 / FD-034).

---

## 4. Enterprise client and project data (FD-026 / FD-038)

| Concern | Owner / controller |
|---------|-------------------|
| Enterprise Client organisation record | Client org + platform contractual relationship |
| Quotes / projects / milestones as platform records | Platform systems; commercial rights per agreements |
| Enterprise BDP | Attribution / BD rights — **does not own** clients or projects |
| Vendors | Distinct records; kickbacks forbidden; login model may be deferred |

Cross-vertical componentisation must avoid double commission (FD-038).

---

## 5. Lead Assist / Opportunity Desk (FD-031)

| Concern | Rule |
|---------|------|
| Lead records | Platform-controlled systems; Desk does **not own** leads |
| Assignment history | Must be preserved |
| Personal commission from Desk favouritism | Forbidden |
| Hard-delete | Only via approved legal privacy workflow |

---

## 6. Schema SoT vs business SoT

```text
Founder Decisions  ──►  business meaning, ownership, prohibited collapses
        │
        ▼
docs/core + docs/data  ──►  living explanation (must defer on conflict)
        │
        ▼
supabase/migrations/  ──►  ONLY applied schema / RLS SQL SoT (ADR-004)
```

Rules:

1. Do not invent “final” tables in markdown and treat them as schema.
2. TypeScript DB types follow migrations, not the reverse (ADR-004).
3. When docs and migrations diverge, **fix docs or ship a migration** — do not silently code against prose DDL.

---

## 7. Soft-delete vs hard-delete

### Prefer soft-delete / status transitions

Operational entities (profiles, assignments, listings, leads, orgs) generally move to inactive / revoked / archived states rather than physical erase, so audit and attribution remain reconstructable.

### Financial and commission history — no silent hard-delete

| Record class | Rule | Authority |
|--------------|------|-----------|
| Ledger / payment / recognition | No hard-delete; reverse/adjust | FD-020 / FD-028 |
| Commission entitlements | No hard-delete | FD-029 |
| Settlement history | Preserve; void/reopen via controlled ops | FD-021 / FD-029 |
| Attribution history | Preserve; corrections = new entries + rule version | FD-028 / FD-029 / FD-032 |
| Lead / assignment history | No hard-delete except approved legal privacy workflow | FD-031 |

### Hard-delete exceptions

Only under an **approved legal privacy workflow** (data-principal erasure / regulator order), with:

- Explicit legal basis and recorded approval
- Finance/audit retention overrides documented (may require anonymisation rather than erase where law allows)
- No silent overwrite of commercial truth for convenience

Exact retention periods and anonymisation recipes: **Pending Legal / Privacy / Accounting** — do not invent here.

### Soft-delete must not fake hard-delete for finance

Hiding a row in UI is not erasure. Settlement-eligible and paid commission trails remain queryable to Finance Admin / Compliance under RLS intent ([`../security/RLS_ACCESS_MATRIX.md`](../security/RLS_ACCESS_MATRIX.md)).

---

## 8. Legacy preservation (FD-032)

- Historical Circle statuses, role labels, and commercial decisions remain auditable.
- Legacy role names (ZBP, CBDP, MBDP, Treasurer, etc.) are **mapped**, not silently rewritten (`35_Role_Taxonomy.md`).
- A new Founder rule does **not** automatically recalculate historical transactions unless a Founder Decision expressly requires retrospective application (FD-032).
- Inactive commercial layers (e.g. Marketplace Affiliate as future/inactive) must not be deleted from history merely because they are inactive going forward.

---

## 9. Ownership quick matrix

| Asset / data class | Not owned by | Controlled / owned by (conceptual) |
|--------------------|--------------|-------------------------------------|
| GCE platform & brand | BDPs, members, venues | Logixia / GCE (FD-034) |
| Circle structure | Connect BDP, GB, members | Platform (FD-030) |
| Membership commercial record | BDP as property | Platform + member contractual relationship |
| Venue event/offer content | Marketplace BDP | Venue Partner within rules (FD-033) |
| Customer PII | BDP as owner | Platform operator duties + law (FD-034) |
| Attribution records | Private BDP side-books | Platform systems of record |
| Commission / ledger | Beneficiary as editable property | Platform Finance systems (FD-020 / FD-029) |
| Lead records | Opportunity Desk personally | Platform Lead Assist systems (FD-031) |
| Enterprise projects | Enterprise BDP | Client + platform agreements (FD-038) |

---

## Unresolved

| Item | Status |
|------|--------|
| Exact DPDP/GDPR erasure vs finance retention interaction | Pending Legal / Privacy / Accounting |
| KYC / Aadhaar retention periods | Pending (FD-039) |
| Beneficial ownership of ticket funds under MoR direction | Pending Legal/Tax packaging (FD-039) |
| Third-party subprocessors data ownership schedules | Pending Legal |

Mark any implementation that assumes answers above as **Technical recommendation** until Founder/Legal closes them.
