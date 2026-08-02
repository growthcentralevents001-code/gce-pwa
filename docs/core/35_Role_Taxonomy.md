# Role Taxonomy (Canonical)

## Authority

**Highest authority for RBAC / permissions principles:** `docs/founder-decisions/FD-023_RBAC_and_Permissions.md`

**Related:** FD-001 (roles & multi-role platform), FD-024 (Circle ownership boundaries), FD-022 (membership vs seat), FD-025 (Connect BDP commercial — Franchise Unit is a commercial construct, not a separate RBAC role enum unless later designed), FD-026 (GCE Enterprise commercial and operating architecture — Franchise Pack and Enterprise Platform Expert).

This document owns official **role names**, role families, high-level responsibilities, and legacy migration mapping. Detailed permission matrices in `19_Permissions_Roles.md` must defer here for identity and to **FD-023** for access-control principles. Exact permission codes, enums, and RLS policies are **not finalised** in Founder Decisions — do not invent them.

Do **not** redefine commercial fees or Circle capacity here. Commercial: `36_Commercial_Constants.md` / **FD-025** / **FD-026**. Circles: `38_Circle_Architecture.md` / FD-024.

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
| Venue Partner | — | |
| Enterprise Client | — | Distinct from Enterprise BDP |
| Board of Governance / Circle Board | BOG / Circle Board | Does **not** own Circles |
| Relationship Manager | RM | No automatic financial authority |
| Platform Relationship Manager | PRM | No automatic financial authority |
| Platform Taxonomy Team | — | Final taxonomy publishing authority |
| Finance Administrator | — | Permission-controlled; segregation of duties (FD-023) |

**Legacy terms requiring explicit migration mapping (do not silently equate):** ZBP, BDM, Affiliate, Franchisee, CBDP, MBDP, BD Partner, Generic Enterprise role. See Role Mapping below.

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
| 2 | Board of Governance / Circle Board | GCE Connect | Approved internal Circle governance — does not own/create/activate Circles |
| 3 | Relationship Manager (RM) | Ops | Assigned operational support — no automatic finance authority |
| 4 | Platform Relationship Manager (PRM) | Ops / escalations | Escalation & verification duties — no automatic finance authority |
| 5 | Connect BDP | GCE Connect | Initiate/grow Circles & memberships within assigned Franchise Unit scope (FD-025) |
| 6 | Marketplace BDP | GCE Marketplace | Onboard/support Venue Partners within assigned scope |
| 7 | Enterprise BDP | GCE Enterprise | Enterprise Client acquisition & BD under client-based Franchise Pack attribution (FD-026) |
| 8 | Venue Partner | GCE Marketplace | Own events, offers, bookings |
| 9 | Circle Member / GCE Connect Member | GCE Connect | Networking & seats (seat separate from membership) |
| 10 | Registered User / Visitor | Demand | Public/authenticated general access |
| — | Enterprise Client | GCE Enterprise | Client/project functions (not a BDP) |
| — | Enterprise Platform Expert | GCE Enterprise | Internal/controlled specialist for requirement breakdown, vendor matching, and digital project coordination (FD-026) — not a franchisee |
| — | Platform Taxonomy Team | Platform | Taxonomy publish authority |
| — | Finance / Compliance / Support / Security Administrators | Platform | Department-scoped admin families (FD-023) |

### Documented dashboards

Product dashboards remain described in `12_Dashboards.md`. Prefer approved names (Connect BDP Dashboard, Marketplace BDP Dashboard, etc.). Venue Admin console remains platform-ops capability unless a dedicated role is Founder-approved.

### Future / not current by default

Roles listed as future in historical docs (Finance Manager, Marketing Manager, Super Admin, AI Administrator, etc.) remain **Future / Pending Founder Approval** unless a Founder Decision activates them. Do not implement as current unrestricted roles.

---

## Permission summary (pointer)

Full narrative permission text: `19_Permissions_Roles.md` (must align with FD-023). Exact permission matrix/codes: **Pending Technical Design**.

Hard boundaries (Founder-aligned):

| Role | Must not (summary) |
|------|---------------------|
| Circle Board | Own, create, or independently activate Circles; unrestricted platform finance |
| RM / PRM | Automatic settlement, refund, ledger, or payout authority |
| Connect BDP | Activate Circles independently; auto-access other verticals; self-approve commission |
| Marketplace BDP | Act as Venue Partner by default; release settlements/refunds without permission |
| Enterprise BDP | Release payments/settlements without permission; auto-access other verticals; own clients/projects; execute physical events; self-approve commission |
| Enterprise Platform Expert | Physically execute events; unrestricted platform data access; approve refunds/settlements independently; accept vendor kickbacks |
| Venue Partner | Access other Venue Partner private data |
| Circle Member | Administer Circle as platform owner; be Connect BDP for same conflicting Circle |
| Any Admin | Operate with unrestricted universal god mode by default |

---

## Stakeholder hierarchy (conceptual)

```text
GCE Platform (owns Circles, platform IP)
        │
        ├──────── Platform Administration (department-scoped)
        ├──────── Platform Operations (RM, PRM, Taxonomy, …)
        ├──────── Circle Board (governance — does not own Circles)
        ├──────── Connect BDP / Marketplace BDP / Enterprise BDP
        ├──────── Venue Partners / Enterprise Clients
        ├──────── GCE Connect Members / Circle Members
        └──────── Registered Users / Visitors
```

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

- **Legacy Role** = names found in application routes, enums, or older labels (including ZBP, BDM, Affiliate, Franchisee).
- **Current Role** = canonical documented product role.
- **Database Enum** = value in `user_role` enum as reflected by generated database types (implementation inventory).
- **Dashboard** = documented product dashboard and/or observed application route (where different, both are listed).
- **Permissions** = pointer to `19_Permissions_Roles.md`.

**Rule:** Legacy names are **not** deleted. They remain mapped here until business formally retires them.

### Mapping table

| Legacy Role | Current Role | Database Enum | Dashboard | Permissions |
|-------------|--------------|---------------|-----------|-------------|
| Platform Admin / admin | Platform Admin | `admin` | Documented: Platform Admin Dashboard. App route (inventory): `/admin/**` | `19_Permissions_Roles.md` → Platform Admin |
| User | User | *(no dedicated `user` enum value documented in generated types; general users may lack partner roles)* | Documented: User Dashboard. App route (inventory): `/dashboard/user` | `19_Permissions_Roles.md` → User |
| Circle Member / member | Circle Member | `member` | Documented: Circle Member Dashboard. App route (inventory): `/dashboard/member` | `19_Permissions_Roles.md` → Circle Member |
| Venue Partner / venue / partner | Venue Partner | `venue` | Documented: Venue Partner Dashboard. App routes (inventory): `/dashboard/venue/**`, legacy `/partner-dashboard` | `19_Permissions_Roles.md` → Venue Partner |
| Enterprise / enterprise_client (type labels) | Enterprise BDP *(when acting as partner)* / Enterprise client *(when buyer)* | `enterprise` | Documented: Enterprise BDP Dashboard. App route (inventory): `/dashboard/enterprise` | `19_Permissions_Roles.md` → Enterprise BDP *(partner)*; client flows in `08` / `18` |
| CBDP (legacy label) | **Connect BDP** (approved) | **Pending explicit DB enum migration mapping** | Documented: Connect BDP / CBDP Dashboard | `19_Permissions_Roles.md` / FD-023 |
| MBDP (legacy label) | **Marketplace BDP** (approved) | **Pending explicit DB enum migration mapping** | Documented: Marketplace BDP / MBDP Dashboard | `19_Permissions_Roles.md` / FD-023 |
| ZBP | **Pending business confirmation** (legacy/code label) | `zbp` | App routes (inventory): `/dashboard/zbp`, `/zbp`, `/zbp/apply`; admin `/admin/zbp*` | Pending — do not invent |
| BDM | **Pending business confirmation** (legacy/code label) | `bdm` | App routes (inventory): `/dashboard/bdm`, legacy `/bdm-dashboard` | Pending — do not invent |
| Affiliate | **Pending business confirmation** (legacy/code label) | `affiliate` | App routes (inventory): `/dashboard/affiliate`, `/affiliate/**` | Pending — do not invent |
| Franchisee | **Pending business confirmation** (legacy/code label) | `franchisee` | App route (inventory): `/dashboard/franchisee` | Pending — do not invent |
| Board of Governance | Board of Governance | **Not present** in generated `user_role` enum inventory | Documented: Board of Governance Dashboard | `19_Permissions_Roles.md` → BOG |
| RM | Relationship Manager (RM) | **Not present** in generated `user_role` enum inventory | Documented: RM Dashboard | `19_Permissions_Roles.md` → RM |
| PRM | Platform Relationship Manager (PRM) | **Not present** in generated `user_role` enum inventory | Documented: PRM Dashboard | `19_Permissions_Roles.md` → PRM |
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
6. How is **Enterprise Client** distinguished from **Enterprise BDP** in `enterprise` (or related) storage?

Exact database role enums remain **Pending Technical Design / Pending Founder Confirmation**. Until confirmed, engineers must not silently equate legacy labels with approved roles in business logic without an approved mapping update here.

Cross references: FD-023, FD-001, `19_Permissions_Roles.md`, `12_Dashboards.md`, `38_Circle_Architecture.md`.

---

## Cross References

- Stakeholders narrative: `03_Stakeholders.md`
- Permissions detail: `19_Permissions_Roles.md`
- Dashboards: `12_Dashboards.md`
- Commercial limits/fees: `36_Commercial_Constants.md`
- GCE Connect circles: `38_Circle_Architecture.md`
- Partner docs (legacy filenames): `06_CBDP.md` (Connect BDP), `07_MBDP.md` (Marketplace BDP), `08_Enterprise_BDP.md`, `09_Venue_Partner.md`
- Founder Decisions: FD-001, FD-023, FD-024, FD-025, FD-026
