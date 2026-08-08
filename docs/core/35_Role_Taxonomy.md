# Role Taxonomy (Canonical)

## Authority

**Highest authority for RBAC / permissions principles:** `docs/founder-decisions/FD-023_RBAC_and_Permissions.md`

**Related:** FD-001 (roles & multi-role platform), FD-024 (Circle lifecycle ownership boundaries), FD-030 (Governing Body roles and Circle governance limits), FD-032 (current GB term/role supersession; legacy role migration principles), FD-022 (membership vs seat), FD-025 (Connect BDP commercial — Franchise Unit is a commercial construct, not a separate RBAC role enum unless later designed), FD-026 (GCE Enterprise commercial and operating architecture — Franchise Pack and Enterprise Platform Expert), FD-027 (Membership commercial — member title **GCE Connect Circle Member**; Associate/Core are tier labels), FD-033 (Marketplace BDP operating — primary Relationship Manager for assigned venues; no settlement/refund authority), FD-034 (stakeholders do not bind Logixia by default; not automatic employees/shareholders/partners), FD-035 (identity, role assignment, workspace architecture — User as permanent base identity), FD-036 (membership attribution / RM assignment — no automatic RM commission), FD-037 (Venue Representative / Venue Manager distinct from Marketplace BDP; one Venue Partner role family), FD-038 (Enterprise Client organisation vs Enterprise Client Representative vs Enterprise BDP), FD-039 (Commercial Licence / Independent Business Partner; Franchise Unit not automatic legal franchise; Super Admin not ordinary Phase 2 role; Aadhaar not mandatory by default), FD-031 (AI Lead Assist — Opportunity Desk, Lead Giver / Lead Receiver functional parties; not a hidden commission layer).

This document owns official **role names**, role families, high-level responsibilities, and legacy migration mapping. Detailed permission matrices in `19_Permissions_Roles.md` must defer here for identity and to **FD-023** for access-control principles. Exact permission codes, enums, and RLS policies are **not finalised** in Founder Decisions — do not invent them.

Do **not** redefine commercial fees or Circle capacity here. Commercial: `36_Commercial_Constants.md` / **FD-025** / **FD-026** / **FD-027** / **FD-029** / **FD-033**. Circles: `38_Circle_Architecture.md` / FD-024 (lifecycle) / FD-030 (internal governance) / FD-032 (dual status mapping).

---

## Product Vertical Naming

| Correct | Incorrect |
|---------|-----------|
| GCE Connect | Connect (alone) |
| GCE Marketplace | Marketplace (alone) |
| GCE Enterprise | Enterprise (alone) |

---

## Approved current role terminology (FD-001 / FD-023)

| Approved name | Short form | Notes |
|---------------|------------|-------|
| GCE Connect Business Development Partner | Connect BDP | Prefer over legacy **CBDP** in canonical/user-facing docs |
| GCE Marketplace Business Development Partner | Marketplace BDP | Prefer over legacy **MBDP** |
| GCE Enterprise Business Development Partner | Enterprise BDP | |
| GCE Connect Member | — | Membership holder; may not yet hold a Circle seat |
| GCE Connect Circle Member / Circle Member | Circle Member | Seat holder in a specific Circle |
| Venue Partner | — | One canonical Venue Partner role family; business types are attributes/categories (FD-037) |
| Venue Representative / Venue Manager | — | Venue-side natural person; distinct from Marketplace BDP (FD-035 / FD-037) |
| Enterprise Client | — | Organisation-level entity; distinct from Enterprise BDP (FD-038) |
| Enterprise Client Representative | — | Authorised natural person for Enterprise Client; distinct from Enterprise BDP (FD-038) |
| Board of Governance / Circle Board / **Governing Body** | BOG / Circle Board / Governing Body | Does **not** own Circles; does not independently activate/terminate membership or change taxonomy/fees (FD-030). Prefer **Governing Body**. BOG/Circle Board = legacy/dual-use (FD-032) |
| Circle Finance Coordinator | Circle finance-support role within Governing Body | Current title under FD-030 / FD-032. Must not collect fees personally, hold Circle funds, or operate unauthorised Circle bank accounts. Supersedes **Treasurer** as current governance title; historical Treasurer records remain auditable |
| Relationship Manager | RM | Platform operations term where approved; Marketplace BDP acts as primary RM for assigned venues (FD-033); Connect RM assignment is operational under Platform Operations (FD-036) — no automatic separate RM commission layer; no automatic financial authority |
| Platform Relationship Manager | PRM | No automatic financial authority; legacy ops mapping toward Opportunity Desk (FD-031) — not Lead Owner; not an automatic commission stakeholder (FD-032) |
| Platform Taxonomy Team | — | Final taxonomy publishing authority |
| Finance Administrator | — | Permission-controlled; segregation of duties (FD-023) |

### Lead Assist functional parties (FD-031 — not separate login roles by default)

| Functional party | Meaning |
|------------------|---------|
| **GCE Lead Intelligence and Opportunity Desk** | Platform-controlled expert team for verification, matching support, human review, coordination — does **not** own leads; no hidden personal commission |
| **Lead Giver** | Stakeholder who submitted / referred the opportunity |
| **Lead Receiver** | Offered / assigned eligible stakeholder (Accept / Decline / Clarify / Duplicate / Invalid / Collaborate) |
| **Lead Source / Verifier / Selected Provider / Closer / Collaborator / Commercial Beneficiary** | Distinct parties — do not collapse into “Lead Owner” |

Exact desk RBAC enums: **Pending Technical Design**. See `39_AI_Lead_Assist_Spec.md`.

**Legacy terms requiring explicit migration mapping (do not silently equate):** ZBP (obsolete under FD-028), BDM, Affiliate (future-only under FD-028), Franchisee, CBDP, MBDP, BD Partner, Generic Enterprise role. See Role Mapping below.

---

## Platform identity model (FD-001 / FD-023)

- **One GCE account** may hold **multiple compatible roles**.
- A **role is not a separate account**.
- A **workspace is not a separate account**.
- Role assignment and permission assignment are **separate**.
- BDP roles are **vertical-specific**.
- Permissions follow **least privilege**; a role title alone does not grant unrestricted access.
- Administration must be **department-scoped**; no unrestricted administrator god mode by default.
- Financial permissions remain **separate** from operational permissions.
- **RM and PRM** do not automatically have settlement, refund, ledger, or payout authority.
- A **BDP cannot** approve or release their own commissions.
- A **Circle Member cannot** simultaneously be the Connect BDP responsible for the same Circle or a directly conflicting Connect structure.

---

## Canonical documented roles (product)

Aligned with FD role families and existing product documentation:

| # | Canonical Role (approved wording) | Vertical focus | Primary responsibility (summary) |
|---|-----------------------------------|----------------|----------------------------------|
| 1 | Platform Administrator (department-scoped) | Platform-wide | Assigned admin domains only — not universal superuser by default (FD-023) |
| 2 | Board of Governance / Circle Board / Governing Body | GCE Connect | Approved internal Circle governance support — does not own/create/activate Circles; cannot independently terminate members or change fees/taxonomy (FD-030). Core roles: President, Vice President, Secretary, Circle Finance Coordinator, Sergeant at Arms, Membership and Growth Coordinator, Referral and Performance Coordinator. Term: **six months** (FD-030 / FD-032; earlier one-year references superseded for current tenure only) |
| 3 | Relationship Manager (RM) | Ops / Marketplace | Assigned operational support — no automatic finance authority; Marketplace BDP is primary RM for assigned venues (FD-033) |
| 4 | Platform Relationship Manager (PRM) | Ops / escalations | Escalation & verification duties — no automatic finance authority; may map toward Opportunity Desk ops (FD-031) without owning leads |
| 5 | Connect BDP | GCE Connect | Initiate/grow Circles & memberships within assigned Franchise Unit scope (FD-025); does not bind Logixia by default (FD-034) |
| 6 | Marketplace BDP | GCE Marketplace | Onboard/support Venue Partners within attributed scope; max 2 units / 40 venues; venue-attribution model (FD-033) |
| 7 | Enterprise BDP | GCE Enterprise | Enterprise Client acquisition & BD under client-based Franchise Pack attribution (FD-026 / FD-038) |
| 8 | Venue Partner | GCE Marketplace | Own events, offers, bookings — one role family (FD-037) |
| 9 | GCE Connect Circle Member | GCE Connect | Active Circle Membership holder (Associate/Core are tier labels — FD-027); Circle seat is separate |
| 10 | Registered User / Visitor | Demand | Public/authenticated general access |
| — | Venue Representative / Venue Manager | GCE Marketplace | Venue-side users; not Marketplace BDP (FD-035 / FD-037) |
| — | Enterprise Client | GCE Enterprise | Organisation / client-project functions (not a BDP) |
| — | Enterprise Client Representative | GCE Enterprise | Authorised natural person for the client org (FD-038) |
| — | Enterprise Platform Expert | GCE Enterprise | Internal/controlled specialist for requirement breakdown, vendor matching, and digital project coordination (FD-026) — not a franchisee |
| — | Platform Taxonomy Team | Platform | Taxonomy publish authority |
| — | Finance / Compliance / Support / Security Administrators | Platform | Department-scoped admin families (FD-023) |

### Documented dashboards

Product dashboards remain described in `12_Dashboards.md`. Prefer approved names (Connect BDP Dashboard, Marketplace BDP Dashboard, etc.). **Venue Admin** console in `12_Dashboards.md` is a **platform-ops** capability for managing venues — do not conflate with Venue Representative / Venue Manager (venue-side) unless a dedicated role is Founder-approved (FD-037).

### Future / not current by default

Roles listed as future in historical docs (Finance Manager, Marketing Manager, Super Admin, AI Administrator, etc.) remain **Future / Pending Founder Approval** unless a Founder Decision activates them. Do not implement as current unrestricted roles.

---

## Permission summary (pointer)

Full narrative permission text: `19_Permissions_Roles.md` (must align with FD-023). Exact permission matrix/codes: **Pending Technical Design**.

Hard boundaries (Founder-aligned):

| Role | Must not (summary) |
|------|---------------------|
| Circle Board / Governing Body | Own, create, or independently activate Circles; independently approve/activate or terminate membership; change fees/taxonomy; approve final Specializations/Tags; hold Circle funds; open unauthorised Circle bank accounts; unrestricted platform finance; decide regulated decisions by Circle vote alone (FD-030) |
| RM / PRM / Opportunity Desk | Automatic settlement, refund, ledger, or payout authority; own leads; hidden personal commission from selected members (FD-031) |
| Connect BDP | Activate Circles independently; auto-access other verticals; self-approve commission |
| Marketplace BDP | Act as Venue Partner by default; release settlements/refunds without permission; permanently own city/venues; sell data; bind Logixia; privately transfer attribution (FD-033 / FD-034) |
| Enterprise BDP | Release payments/settlements without permission; auto-access other verticals; own clients/projects; execute physical events; self-approve commission |
| Enterprise Platform Expert | Physically execute events; unrestricted platform data access; approve refunds/settlements independently; accept vendor kickbacks |
| Venue Partner | Access other Venue Partner private data |
| Circle Member | Administer Circle as platform owner; be Connect BDP for same conflicting Circle |
| Any Admin | Operate with unrestricted universal god mode by default |

---

## Stakeholder hierarchy (conceptual)

```text
Logixia Solutions Private Limited
└── Growth Central Events (GCE — platform & master brand; not a separate company)
        │
        ├──────── Platform Administration (department-scoped)
        ├──────── Platform Operations (RM, PRM, Taxonomy, Opportunity Desk …)
        ├──────── Governing Body (legacy BOG / Circle Board — does not own Circles)
        ├──────── Connect BDP / Marketplace BDP / Enterprise BDP
        ├──────── Venue Partners / Enterprise Clients / Vendors
        ├──────── GCE Connect Members / Circle Members
        └──────── Registered Users / Visitors
```

Stakeholders do not automatically become Logixia employees, shareholders, directors, legal partners, vertical owners, or signatories (FD-034).

---

## Role Mapping (Legacy → Current → Database → Dashboard → Permissions)

### Mapping chain (required reading order)

```text
Legacy Role
    ↓
Current Role
    ↓
Database Enum
    ↓
Dashboard
    ↓
Permissions
```

### How to read this section

- **Legacy Role** = names found in application routes, enums, or older labels (including ZBP, BDM, Affiliate, Franchisee, Treasurer, CBDP, MBDP, Rainmaker).
- **Current Role** = canonical documented product role.
- **Database Enum** = value in `user_role` enum as reflected by generated database types (implementation inventory).
- **Dashboard** = documented product dashboard and/or observed application route (where different, both are listed).
- **Permissions** = pointer to `19_Permissions_Roles.md`.

**Rule:** Legacy names are **not** deleted. They remain mapped here until business formally retires them. Do not silently rewrite historical records (FD-032). Do not invent enum mappings (FD-032 open items).

### Mapping table

| Legacy Role | Current Role | Database Enum | Dashboard | Permissions |
|-------------|--------------|---------------|-----------|-------------|
| Platform Admin / admin | Platform Admin | `admin` | Documented: Platform Admin Dashboard. App route (inventory): `/admin/**` | `19_Permissions_Roles.md` → Platform Admin |
| User | User | *(no dedicated `user` enum value documented in generated types; general users may lack partner roles)* | Documented: User Dashboard. App route (inventory): `/dashboard/user` | `19_Permissions_Roles.md` → User |
| Circle Member / member | Circle Member | `member` | Documented: Circle Member Dashboard. App route (inventory): `/dashboard/member` | `19_Permissions_Roles.md` → Circle Member |
| Venue Partner / venue / partner | Venue Partner | `venue` | Documented: Venue Partner Dashboard. App routes (inventory): `/dashboard/venue/**`, legacy `/partner-dashboard` | `19_Permissions_Roles.md` → Venue Partner |
| Enterprise / enterprise_client (type labels) | Enterprise BDP *(when acting as partner)* / Enterprise client *(when buyer)* | `enterprise` | Documented: Enterprise BDP Dashboard. App route (inventory): `/dashboard/enterprise` | `19_Permissions_Roles.md` → Enterprise BDP *(partner)*; client flows in `08` / `18` |
| CBDP (legacy label) | **Connect BDP** (approved) where historically equivalent | **Pending explicit DB enum migration mapping** | Documented: Connect BDP / CBDP Dashboard | `19_Permissions_Roles.md` / FD-023 / FD-032 |
| MBDP (legacy label) | **Marketplace BDP** (approved) where historically equivalent | **Pending explicit DB enum migration mapping** | Documented: Marketplace BDP / MBDP Dashboard | `19_Permissions_Roles.md` / FD-023 / FD-033 |
| ZBP | **Inactive / removed** from current commercial model (FD-028 / FD-029 / FD-032) — legacy/code label only | `zbp` | App routes (inventory): `/dashboard/zbp`, `/zbp`, `/zbp/apply`; admin `/admin/zbp*` | Do not invent current ZBP commission or deposit rules |
| BDM | **Ambiguous / legacy** — do not auto-map without context (FD-032) | `bdm` | App routes (inventory): `/dashboard/bdm`, legacy `/bdm-dashboard` | Pending — do not invent |
| Affiliate | **Future / inactive** under FD-028 / FD-029 / FD-032 / FD-033 (no active Marketplace Affiliate commission); legacy/code label | `affiliate` | App routes (inventory): `/dashboard/affiliate`, `/affiliate/**` | Do not invent active Affiliate rate/settlement |
| Franchisee | **Not an automatic product RBAC role** — legacy/code label. Franchise Unit / Franchise Pack are **commercial constructs** under Commercial Licence / Independent Business Partner packaging (FD-039 / FD-025 / FD-026 / FD-033). Do not treat `franchisee` enum as automatic legal franchise, employment, partnership, or agency | `franchisee` | App route (inventory): `/dashboard/franchisee` | Prefer BDP assignment keys + commercial unit records (FD-035 / FD-039) |
| Treasurer | **Legacy** Circle finance-support title → map to **Circle Finance Coordinator** for current governance (FD-032) | N/A as separate enum | N/A | Historical records remain auditable |
| Board of Governance / Circle Board | Prefer **Governing Body** (legacy/dual-use — FD-032) | **Not present** in generated `user_role` enum inventory | Documented: Board of Governance / Governing Body Dashboard | `19_Permissions_Roles.md` → BOG |
| Rainmaker / Pass Lead | **Legacy Lead Assist terminology** (not current Stage-1 product names — FD-031 / FD-032) | N/A | N/A | See `39_AI_Lead_Assist_Spec.md` |
| RM | Relationship Manager (RM) — platform ops; Marketplace BDP is primary RM for assigned venues (FD-033) | **Not present** in generated `user_role` enum inventory | Documented: RM Dashboard | `19_Permissions_Roles.md` → RM |
| PRM | Platform Relationship Manager (PRM) — ops term, not automatic commission stakeholder (FD-032) | **Not present** in generated `user_role` enum inventory | Documented: PRM Dashboard | `19_Permissions_Roles.md` → PRM |
| Super Admin | Future role only (`19_Permissions_Roles.md`) | **Not present** | N/A (future) | Future |
| Venue Admin | Platform-side Venue Admin console (`12_Dashboards.md`); not a separate current RBAC role in `19` | N/A as separate enum | Documented: Venue Admin Dashboard (platform ops) | Treat under Platform Admin until documented otherwise |

### Generated database enum inventory (implementation)

As reflected in generated types (`lib/database.types.ts` constants), current `user_role` values are:

```text
admin | member | venue | franchisee | enterprise | zbp | affiliate | bdm
```

This inventory is factual for implementation alignment. It does **not** by itself redefine product roles. Product roles remain the ten canonical roles above until business updates this taxonomy.

### Open mapping items (must not be guessed)

The following alignments are **not** defined in business documentation and require explicit business confirmation before treating as equal:

1. Is `zbp` the database enum for **Connect BDP** (legacy CBDP)?
2. Is `bdm` the database enum for **Marketplace BDP** (legacy MBDP), or a different role?
3. What documented role maps to `affiliate`?
4. What documented role maps to `franchisee`?
5. How will Board of Governance, RM, PRM, Platform Taxonomy Team, and department-scoped administrators be represented?
6. How is **Enterprise Client** (organisation) distinguished from **Enterprise Client Representative** and **Enterprise BDP** in storage (FD-038)?
7. How are managed vendor records without login represented at launch while allowing future Vendor workspaces (FD-038)?

Exact database role enums remain **Pending Technical Design / Pending Founder Confirmation**. Until confirmed, engineers must not silently equate legacy labels with approved roles in business logic without an approved mapping update here.

---

## Cross References

- Stakeholders narrative: `03_Stakeholders.md`
- Permissions detail: `19_Permissions_Roles.md`
- Dashboards: `12_Dashboards.md`
- Commercial limits/fees: `36_Commercial_Constants.md`
- GCE Connect circles: `38_Circle_Architecture.md` / FD-024 / FD-030 / FD-032
- AI Lead Assist: `39_AI_Lead_Assist_Spec.md` / FD-031
- Marketplace BDP: `07_MBDP.md` / FD-033
- Corporate constitution: FD-034
- Partner docs (legacy filenames): `06_CBDP.md` (Connect BDP), `07_MBDP.md` (Marketplace BDP), `08_Enterprise_BDP.md`, `09_Venue_Partner.md`
- Founder Decisions: FD-001, FD-023, FD-024, FD-025, FD-026, FD-027, FD-030, FD-031, FD-032, FD-033, FD-034
