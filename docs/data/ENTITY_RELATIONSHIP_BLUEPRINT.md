# ENTITY_RELATIONSHIP_BLUEPRINT — Logical ER

| Field | Value |
|-------|-------|
| **Status** | Living documentation (Phase 2) |
| **Classification** | Logical relationships only — **no SQL DDL** |
| **Authority** | Founder Decisions for cardinality meaning; ADR-004 for applied schema |
| **Related** | [`DATA_DOMAIN_MODEL.md`](./DATA_DOMAIN_MODEL.md), [`DATA_OWNERSHIP_AND_SOURCE_OF_TRUTH.md`](./DATA_OWNERSHIP_AND_SOURCE_OF_TRUTH.md) |

---

## Authority

Cardinality and entity meaning follow Founder Decisions (especially FD-022, FD-023, FD-024, FD-030, FD-032, FD-035–FD-038).  
Physical FKs, nullability, and join tables exist only in `supabase/migrations/` ([ADR-004](../phase-2/adrs/ADR-004_Database_Schema_Source_of_Truth.md)).

---

## Purpose

Provide a **logical entity-relationship blueprint** so implementers can design migrations and APIs without collapsing Founder-distinct concepts (e.g. dual Circle statuses, membership vs seat, User vs RoleAssignment).

---

## Not in scope

- `CREATE TABLE`, indexes, CHECK constraints, enum SQL
- Inventing final column names or “one status enum to rule them all”
- Inventing commission formulas or commercial pack schemas
- Treating this file as migration SoT

---

## Legend

| Symbol | Meaning |
|--------|---------|
| `1 — *` | One to many |
| `1 — 0..1` | One to zero-or-one |
| `* — *` | Many to many (via association entity) |
| `(scoped)` | Relationship is scope-bounded (Circle, venue, client, unit, department) |

Logical names are documentation labels only.

---

## Core identity and access

### User `1 — *` RoleAssignment

- One **User** (permanent base identity) may hold many **RoleAssignment** records over time and concurrently (FD-035).
- Each RoleAssignment has status (e.g. proposed / active / suspended / revoked — exact codes Technical Design) and **scope**.
- Revoking an assignment must not delete the User (FD-023).

### User `1 — *` Organisation link (via OrganisationRep / membership)

- Natural persons act for **Organisation** entities (Venue Partner org, Enterprise Client org) through authorised representative links (FD-037 / FD-038).
- Organisation is not a User; Enterprise Client ≠ Enterprise Client Representative ≠ Enterprise BDP.

### RoleAssignment `(scoped)` → Circle | VenuePartner | EnterpriseClient | FranchiseUnit | Department

- Scope is mandatory for least privilege (FD-023 Part J).
- Same role name in one scope does not grant authority in another (FD-035).

---

## Membership and Circle

### User / Organisation `1 — *` Membership

- Membership is the commercial / lifecycle membership construct (FD-022 / FD-027).
- Membership activation is distinct from Circle seat allocation (FD-036).

### Membership `0..1 — *` Seat (per Circle constraints)

- A **Seat** is Circle-capacity occupancy; membership may exist without a seat (FD-022).
- Circle capacity and Specialization rules constrain seats (FD-030).

### Circle `1 — *` Seat

- Circle holds up to approved active physical member capacity (FD-030).

### Circle dual status (separate fields — do not collapse)

| Logical field family | Authority | Examples (conceptual) |
|----------------------|-----------|------------------------|
| **CircleLifecycleStatus** | FD-024 | Formation → … → Full Capacity (lifecycle axis) |
| **CircleConstitutionStatus** | FD-030 | Provisionally Active / Fully Constituted (constitutional axis) |

Mapping between axes: **FD-032**. Phase 2 must preserve **both** status families (logical: `circle_lifecycle_status` and `circle_constitution_status` as distinct concepts — not a mandate of physical column names).

### Circle `1 — *` GoverningBodyAppointment

- Appointments are scoped Circle governance roles (FD-030 / FD-035).
- Governing Body does **not** own the Circle (FD-030).

### Connect BDP FranchiseUnit (commercial) relationships

- **FranchiseUnit** `1 — *` Circle attribution / capacity slots (commercial operating allocation — FD-025).
- FranchiseUnit is **not** automatic legal franchise and not by itself a separate RBAC enum (FD-039 / FD-025).
- ConnectBDPAssignment `1 — *` FranchiseUnit (scoped).

---

## Marketplace commercial graph

### Organisation (Venue Partner) `1 — *` VenueRepresentative

- Venue-side natural persons; distinct from Marketplace BDP (FD-035 / FD-037).

### MarketplaceBDPAssignment `1 — *` VenueAttribution

- Attribution links BDP to Venue Partner for commission eligibility (FD-033 / FD-029).
- Attribution is evidence-based; not permanent city ownership (FD-033).

### VenuePartner `1 — *` Event

- Venue Partner content/listings under platform rules (FD-033 / FD-037).

### Event `1 — *` OfferEvent (where offers attach to events)

- Exact product shapes Pending Technical Design; keep Event vs OfferEvent distinguishable for FD-037 transaction families.

### OfferEvent `1 — *` OfferClaim

- Claims / redemptions path for offer participation.

### OfferClaim / Booking `1 — 0..1` Redemption

- Redemption closes the commercial participation loop (FD-037).

### Booking / Ticket purchase `1 — *` Payment

- Payment is Finance-domain; booking remains Marketplace operational record.

---

## Finance, commission, settlement

### Payment `1 — *` LedgerEntry

- Ledger is append-oriented; corrections are new reversing/adjusting entries (FD-020 / FD-028).

### Payment / RevenueEvent (logical) `1 — *` CommissionEntitlement

- Entitlement requires valid attribution basis (FD-029).
- States distinguish estimated / provisional / earned / hold / settlement-eligible / paid / reversed (conceptual — exact enum Pending Technical Design).

### CommissionEntitlement `* — 1` SettlementBatch (when batched)

- SettlementBatch groups settlement-eligible items (FD-021).
- Items may be held or excluded without deleting entitlement history.

### AttributionRecord (cross-cutting)

Logical association used by:

- Membership → Connect BDP / RM operational assignment (FD-036 — RM assignment ≠ automatic commission)
- VenuePartner → Marketplace BDP (FD-033)
- EnterpriseClient → Enterprise BDP / Franchise Pack (FD-026 / FD-038)
- Lead → Lead Giver / commercial beneficiary parties (FD-031 — not collapsed into “Lead Owner”)

Attribution corrections: **new correction entries** with rule-version linkage; do not silently overwrite history (FD-028 / FD-029 / FD-032).

---

## Enterprise graph

### EnterpriseClient (Organisation) `1 — *` Quote

- Quotes may require Finance co-sign where FD-038 requires.

### Quote `1 — 0..1` Project (on acceptance)

### Project `1 — *` Milestone

### Project / Milestone `*` — Vendors / component links

- Componentised settlement; no-double-commission boundaries (FD-038).
- Enterprise BDP attribution does not transfer legal ownership of client or project to the BDP.

---

## Lead Assist

### Lead `1 — *` AssignmentHistory

- Preserve reassignment history (FD-031).

### Lead `1 — *` OpportunityDeskItem

- Desk coordinates; does not own the lead; no hidden personal commission (FD-031).

### Lead functional parties (logical links)

Lead Giver, Lead Receiver, Verifier, Selected Provider, Closer, Collaborator, Commercial Beneficiary — keep distinct (FD-031 / `35_Role_Taxonomy.md`).

---

## Audit

### Almost any mutable business entity `1 — *` AuditEvent

- Actor, action, scope, before/after or reference ids, correlation (logical).
- Audit must survive soft-deletes of parent operational rows where finance/attribution history requires retention.

---

## Cardinality notes (summary table)

| From | To | Cardinality | Notes |
|------|----|-------------|-------|
| User | RoleAssignment | 1 — * | Multi-role; scoped |
| User | Membership | 1 — * | Over time / products |
| Membership | Seat | 0..1 — * | Seat optional until allocated |
| Circle | Seat | 1 — * | Capacity-constrained |
| Circle | LifecycleStatus | 1 — 1 | Separate from constitution |
| Circle | ConstitutionStatus | 1 — 1 | Separate from lifecycle |
| FranchiseUnit | Circle (attrib.) | 1 — * | Commercial capacity (Connect) |
| VenuePartner | Event | 1 — * | Content ownership vs platform |
| MarketplaceBDP | VenueAttribution | 1 — * | Not permanent territory |
| Event | OfferEvent | 1 — * | Keep families distinct |
| OfferEvent | OfferClaim | 1 — * | |
| OfferClaim/Booking | Redemption | 1 — 0..1 | |
| Payment | LedgerEntry | 1 — * | Append / reverse |
| Revenue basis | CommissionEntitlement | 1 — * | Attribution required |
| CommissionEntitlement | SettlementBatch | * — 0..1 | When included |
| EnterpriseClient | Quote | 1 — * | |
| Quote | Project | 1 — 0..1 | |
| Project | Milestone | 1 — * | |
| Lead | OpportunityDeskItem | 1 — * | Desk ≠ owner |
| Entity | AuditEvent | 1 — * | Retention-sensitive |

---

## Explicit non-relationships (anti-collapse)

| Do not treat as the same | Why |
|--------------------------|-----|
| User ≡ Role | FD-035 |
| Membership ≡ Seat | FD-022 / FD-036 |
| Lifecycle status ≡ Constitution status | FD-032 |
| Franchise Unit ≡ legal franchise / RBAC role | FD-039 / FD-025 |
| Marketplace BDP ≡ Venue Partner / Venue Rep | FD-033 / FD-037 |
| Enterprise BDP ≡ Enterprise Client / Client Rep | FD-038 |
| Opportunity Desk ≡ Lead Owner / commission stakeholder | FD-031 |
| RM assignment ≡ automatic RM commission | FD-036 |

---

## Unresolved

| Item | Status |
|------|--------|
| Physical association table shapes | Pending Technical Design / migrations |
| Exact status enums | Pending Technical Design |
| Ticket / MoR entity split | Pending Legal/Tax alignment (FD-039) |
| Managed vendor without login | Pending (FD-038) |

No SQL DDL in this document by design.
