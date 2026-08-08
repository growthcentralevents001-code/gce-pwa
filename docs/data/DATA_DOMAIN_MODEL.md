# DATA_DOMAIN_MODEL — Conceptual Domains

| Field | Value |
|-------|-------|
| **Status** | Living documentation (Phase 2) |
| **Classification** | Conceptual / logical only — **not** executable DDL |
| **Authority** | Founder Decisions (business meaning); ADR-004 (schema SoT = `supabase/migrations/`) |
| **Related** | [`ENTITY_RELATIONSHIP_BLUEPRINT.md`](./ENTITY_RELATIONSHIP_BLUEPRINT.md), [`DATA_OWNERSHIP_AND_SOURCE_OF_TRUTH.md`](./DATA_OWNERSHIP_AND_SOURCE_OF_TRUTH.md) |

---

## Authority

Business meaning of domains and entities is governed by Founder Decisions (highest authority) and living core docs (`docs/core/`).  
**Applied database schema** is governed only by `supabase/migrations/` ([ADR-004](../phase-2/adrs/ADR-004_Database_Schema_Source_of_Truth.md)).

This file must **never** be treated as `CREATE TABLE` authority. Logical names below are documentation labels; physical table/column names may differ in migrations.

---

## Purpose

Define the **conceptual data domains** of the GCE platform so agents and implementers can:

1. Locate which vertical owns a concern.
2. Cite the correct Founder Decision before inventing fields.
3. Cross-link entity relationships and ownership / SoT rules without inventing SQL.

---

## Not in scope

- SQL DDL, indexes, enums as final codes, RLS policy SQL
- Inventing permission codes or final API contracts
- Inventing commercial percentages, MoR legal packaging, or retention periods not Founder-approved
- Equating legacy DB enums with approved role names without taxonomy confirmation (`35_Role_Taxonomy.md`)

---

## How to read each domain

| Column | Meaning |
|--------|---------|
| **Purpose** | Why the domain exists |
| **Key entities (logical)** | Documentation names only |
| **Owning vertical** | Primary product / platform owner of the concern |
| **SoT notes** | Business vs schema source of truth |
| **FD cites** | Primary Founder Decisions |

Cross-links: relationships → [`ENTITY_RELATIONSHIP_BLUEPRINT.md`](./ENTITY_RELATIONSHIP_BLUEPRINT.md); ownership → [`DATA_OWNERSHIP_AND_SOURCE_OF_TRUTH.md`](./DATA_OWNERSHIP_AND_SOURCE_OF_TRUTH.md).

---

## 1. Identity

| | |
|--|--|
| **Purpose** | Permanent natural-person base identity; authentication subject; not a privileged business role |
| **Key entities** | User, AuthSubject (logical), Profile, KYCRecord / VerificationEvidence (logical), ContactPreference |
| **Owning vertical** | Platform (Logixia / GCE) |
| **SoT notes** | Business: FD-035 (User is permanent base identity). Schema: migrations. Aadhaar not mandatory by default (FD-039) |
| **FD cites** | FD-035, FD-023, FD-039, FD-034 |

---

## 2. Organisation

| | |
|--|--|
| **Purpose** | Legal / commercial organisations distinct from natural Users (Venue Partner org, Enterprise Client org, platform departments as needed) |
| **Key entities** | Organisation, OrganisationMembership / OrganisationRepLink (logical), OrganisationType attribute |
| **Owning vertical** | Platform; typed by vertical (Marketplace venue org, Enterprise client org) |
| **SoT notes** | Enterprise Client is organisation-level; Enterprise Client Representative is a natural person (FD-038). Exact org schema → migrations |
| **FD cites** | FD-035, FD-037, FD-038, FD-034 |

---

## 3. RoleAssignment

| | |
|--|--|
| **Purpose** | Scoped, auditable assignment of a role family to a User (or org-linked rep); separate from permissions and from workspaces |
| **Key entities** | RoleAssignment, AssignmentScope, AssignmentStatus, PermissionGrant (logical; codes not Founder-finalised), WorkspaceContext |
| **Owning vertical** | Platform |
| **SoT notes** | Role ≠ account; workspace ≠ account; assignment ≠ automatic full permission set (FD-023 / FD-035). Exact permission codes: **Technical recommendation / Pending Technical Design** |
| **FD cites** | FD-023, FD-035; role names → `docs/core/35_Role_Taxonomy.md` |

---

## 4. Membership

| | |
|--|--|
| **Purpose** | GCE Connect membership commercial lifecycle vs Circle seat allocation |
| **Key entities** | Membership, MembershipTierLabel (Associate/Core — labels, not separate role enums), MembershipStatus, MembershipPayment, WaitlistEntry, TransferRequest (logical), AttributionRecord (membership) |
| **Owning vertical** | GCE Connect |
| **SoT notes** | Activation vs Circle allocation are distinct (FD-036). Member title vs Circle Member seat (FD-022 / FD-027). Attribution / RM assignment: no automatic separate RM commission (FD-036) |
| **FD cites** | FD-022, FD-027, FD-036, FD-025 |

---

## 5. Circle

| | |
|--|--|
| **Purpose** | Platform-governed local networking unit; dual status families; governance appointments |
| **Key entities** | Circle, CircleLifecycleStatus, CircleConstitutionStatus, Seat, SpecializationSlot, GoverningBodyAppointment, CircleMeeting / ReferralRecord (logical ops) |
| **Owning vertical** | GCE Connect (platform-owned Circles — not BDP-owned, not member-owned) |
| **SoT notes** | Dual status fields remain separate (FD-032): lifecycle (FD-024) vs constitutional (FD-030). Connect BDP supports Circles but does not own them (FD-025 / FD-030) |
| **FD cites** | FD-024, FD-030, FD-032, FD-025; living → `38_Circle_Architecture.md` |

---

## 6. ConnectBDP

| | |
|--|--|
| **Purpose** | Connect BDP commercial operating construct and attribution to Circles / membership growth |
| **Key entities** | ConnectBDPAssignment, FranchiseUnit (commercial construct), TerritoryAllocation (logical), CircleAttribution, PerformanceTarget |
| **Owning vertical** | GCE Connect (commercial partner layer) |
| **SoT notes** | Franchise Unit is commercial, not automatic legal franchise / separate RBAC enum by default (FD-025 / FD-039). BDP does not own Circles, members, territory permanently, or GCE data (FD-025 / FD-034) |
| **FD cites** | FD-025, FD-029, FD-036, FD-039, FD-034 |

---

## 7. Marketplace

| | |
|--|--|
| **Purpose** | Venue Partners, Marketplace BDP attribution, events/offers commercial participation |
| **Key entities** | VenuePartner, VenueRepresentative, MarketplaceBDPAssignment, MarketplaceFranchiseUnit (commercial), VenueAttribution, Event, OfferEvent, OfferClaim, Booking, Redemption |
| **Owning vertical** | GCE Marketplace |
| **SoT notes** | Venue-attribution based, not permanently territory-owned (FD-033). Venue Partner owns event/offer **content** within platform rules; Marketplace BDP does not own the Venue Partner (FD-033 / FD-037). Unattributed revenue rules → FD-037 |
| **FD cites** | FD-033, FD-037, FD-029, FD-039 |

---

## 8. Enterprise

| | |
|--|--|
| **Purpose** | Enterprise Client acquisition, quotation, projects, milestones, vendors, cross-vertical commercial boundaries |
| **Key entities** | EnterpriseClient, EnterpriseClientRepresentative, EnterpriseBDPAssignment, FranchisePack (commercial), Quote, Project, Milestone, VendorRecord, ComponentisedSettlementLink (logical) |
| **Owning vertical** | GCE Enterprise |
| **SoT notes** | Enterprise BDP does not own clients/projects (FD-026 / FD-038). Quotation / Finance co-sign and no-double-commission → FD-038. Exact vendor login model may be deferred (FD-038 open items) |
| **FD cites** | FD-026, FD-038, FD-029, FD-039 |

---

## 9. Finance / Ledger

| | |
|--|--|
| **Purpose** | Internal wallet/ledger principles, payments, recognition states, recoverable balances, tax-sensitive records |
| **Key entities** | Payment, Wallet, LedgerEntry, RevenueRecognitionState (logical), Refund, Chargeback, TaxDocumentLink (logical) |
| **Owning vertical** | Platform Finance (Logixia contracting / platform operator context — FD-034) |
| **SoT notes** | Business: FD-020 / FD-028. No silent hard-delete of financial records; corrections via reversal/adjustment (FD-028 / FD-020). Schema: migrations only |
| **FD cites** | FD-020, FD-028, FD-034, FD-039 |

---

## 10. Commission

| | |
|--|--|
| **Purpose** | Stakeholder entitlement calculation, holds, recovery, SoD against self-approval |
| **Key entities** | CommissionEntitlement, CommissionState, AttributionBasis, RecoveryBalance, RuleVersionLink |
| **Owning vertical** | Platform Finance + Commission Engine |
| **SoT notes** | FD-029 is Commission Engine authority. No hard-delete of commission records. Beneficiary ≠ approver; BDP cannot self-approve own commission (FD-023 / FD-029 / FD-035) |
| **FD cites** | FD-029, FD-028, FD-023, FD-035 |

---

## 11. Settlement

| | |
|--|--|
| **Purpose** | Settlement eligibility, batches, payouts, operational release controls |
| **Key entities** | SettlementBatch, SettlementItem, PayoutInstruction, SettlementHold |
| **Owning vertical** | Platform Finance |
| **SoT notes** | FD-021 settlement principles. RM/PRM/BDP do not automatically release settlement (FD-023 / FD-033). Exact batch schema → migrations |
| **FD cites** | FD-021, FD-029, FD-020, FD-023 |

---

## 12. LeadAssist

| | |
|--|--|
| **Purpose** | Lead Intelligence / Opportunity Desk; quality, consent, assignment history; not a hidden commission layer |
| **Key entities** | Lead, LeadQualityState, ConsentRecord, AssignmentHistory, OpportunityDeskItem, LeadGiver / LeadReceiver (functional parties), HumanOverride |
| **Owning vertical** | Platform (GCE Connect AI Lead Assist) — Desk does **not** own leads |
| **SoT notes** | FD-031. Preserve assignment history; no hard-delete except approved legal privacy workflow. Opportunity Desk must not secretly favour members or own leads |
| **FD cites** | FD-031; living → `39_AI_Lead_Assist_Spec.md` |

---

## 13. Event / Offer / Booking

| | |
|--|--|
| **Purpose** | Marketplace (and related) commercial event surfaces, offers, claims, bookings, redemptions |
| **Key entities** | Event, OfferEvent, OfferClaim, Booking, Ticket (logical), Redemption, CancellationRecord |
| **Owning vertical** | GCE Marketplace (primary); Enterprise may reference componentised delivery separately (FD-038) |
| **SoT notes** | Approval / unattributed families → FD-037. Ticket MoR **direction** → FD-039 (implementation Pending Legal/Tax where marked). 48h cancellation direction → FD-039 |
| **FD cites** | FD-037, FD-033, FD-039 |

---

## 14. Notification

| | |
|--|--|
| **Purpose** | User-facing and operational notices tied to workflows (membership, Circle, finance status, Lead Assist, compliance) |
| **Key entities** | Notification, NotificationPreference, DeliveryAttempt (logical), TemplateRef |
| **Owning vertical** | Platform |
| **SoT notes** | Business narrative in `20_Notifications.md`; must not invent delivery SLAs here. Schema → migrations |
| **FD cites** | Supporting: FD-023 (access), FD-031 (Lead Assist notices), FD-030 (Circle notices) |

---

## 15. Audit

| | |
|--|--|
| **Purpose** | Immutable-enough operational and security evidence for assignments, approvals, finance corrections, attribution changes |
| **Key entities** | AuditEvent, ActorRef, BeforeAfterSnapshot (logical), CorrelationId |
| **Owning vertical** | Platform (Compliance / Security admin families) |
| **SoT notes** | Historical statuses and legacy role labels preserved for audit (FD-032). Soft-delete vs hard-delete rules → [`DATA_OWNERSHIP_AND_SOURCE_OF_TRUTH.md`](./DATA_OWNERSHIP_AND_SOURCE_OF_TRUTH.md) |
| **FD cites** | FD-023, FD-032, FD-034, FD-029 |

---

## Domain map (conceptual)

```text
Identity ── RoleAssignment ── Organisation
    │              │
    ├─ Membership ─ Circle ─ Seat ─ GoverningBodyAppointment
    ├─ ConnectBDP / FranchiseUnit (commercial)
    ├─ Marketplace ─ VenuePartner ─ Event/Offer/Booking
    ├─ Enterprise ─ Quote/Project/Milestone
    ├─ LeadAssist ─ OpportunityDeskItem
    └─ Finance/Ledger ─ Commission ─ Settlement
Notification and Audit cut across all domains
```

---

## Unresolved

| Item | Status |
|------|--------|
| Exact physical table names / enums | Pending migrations (ADR-004) |
| Exact permission-code catalogue | Pending Technical Design (FD-023) |
| Exact KYC retention / Aadhaar edge workflows | Pending Legal / Privacy (FD-039) |
| Vendor workspace at launch | Pending (FD-038) |
| MoR invoicing field design | Pending Finance/Tax/Legal (FD-039) |

Do not invent final answers in this document.
