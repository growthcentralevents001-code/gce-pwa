# Phase 4 — Identity, RBAC, and Organisation

| Field | Value |
|-------|-------|
| **Phase** | 4 |
| **Status** | **Implementation Complete on gce-dev** — see `PHASE_4_IMPLEMENTATION_NOTES.md` |
| **Classification** | Primarily **Business** (FD-023, FD-035, FD-034, FD-039); technical enforcement via ADR-001/002/003/005 |
| **Date** | 2026-08-08 |

---

## 1. Authority

| Source | Owns |
|--------|------|
| **FD-035** | Identity, role assignment, workspace architecture (highest for this phase) |
| **FD-023** | RBAC and permissions principles, SoD, department-scoped admins |
| **FD-034** | Logixia / GCE corporate constitution — stakeholders are not automatic employees/partners; platform operated by Logixia |
| **FD-039** | Super Admin **not** ordinary product role; inactive future roles/surfaces |
| **FD-032** | Legacy migration principles; GB term/role supersessions |
| Living | `docs/core/35_Role_Taxonomy.md` |
| Technical | ADR-001 Auth, ADR-002 Role Assignment, ADR-003 Workspace Routing, ADR-005 RLS |
| Matrices (pointers) | `docs/security/RBAC_PERMISSION_MATRIX.md`, `docs/security/RLS_ACCESS_MATRIX.md` |

**Label key:** **Business** · **Technical** · **PENDING PROFESSIONAL VALIDATION**

---

## 2. Purpose

Define the identity and access foundation so every later vertical can assign scoped roles, switch workspaces, enforce separation of duties, and migrate legacy role names without inventing unrestricted superusers.

---

## 3. Scope

**Business**

1. User as permanent base identity
2. Profile attributes (non-authoritative display/KYC linkage)
3. Organisation entities (including Enterprise Client orgs, Venue Partner orgs where modelled as orgs)
4. Organisation membership
5. Role assignments with explicit **scope**
6. Workspace mapping per active assignment
7. Legacy role migration (zbp, bdm, affiliate, franchisee, enterprise dual-meaning)
8. Vertical BDP roles: Connect BDP, Marketplace BDP, Enterprise BDP
9. Enterprise Client Representative vs Enterprise BDP
10. Venue Representative / Venue Manager (venue-side; not Marketplace BDP)
11. Governing Body appointments (Circle governance support — does not own Circles)
12. Relationship Manager (RM) and Platform Relationship Manager (PRM)
13. Platform / Finance / Compliance / Support Admin families (department-scoped)
14. Root emergency capability (restricted; not ordinary product role)
15. Suspension / revocation of assignments and accounts
16. Self-approval prevention and separation of duties
17. Permission matrix summary → full matrix doc
18. RLS summary → access matrix doc
19. Workspace switching UX rules

**Technical**

- Session binding to User; assignment checks in Server Actions/domain services
- RLS deny-by-default keyed to `auth.uid()` + active assignments (ADR-005)
- Workspace switcher persistence (cookie/session claim) without merging data scopes

---

## 4. Not in scope

- Membership commercial pricing / Circle seat allocation — Phase 5
- BDP franchise fees and commission calculation — Phases 6–8 / Commission Engine docs
- Vendor self-serve login portal — **inactive** (FD-039)
- Marketplace Affiliate commercial activation — **inactive**
- Super Admin as a standard workspace — **not required** (FD-035 / FD-039)
- Native mobile apps — inactive
- Inventing new commission layers for RM/PRM (none automatic — FD-032/036)

---

## 5. Dependencies

| Dependency | Role |
|------------|------|
| Phase 3 foundation | Clients, flags, API conventions, logging |
| ADR-001 / ADR-002 / ADR-003 / ADR-005 | Auth, assignments, routing, RLS |
| FD-030 / FD-032 | GB role titles and six-month term |
| FD-038 | Enterprise Client vs BDP separation |
| FD-037 | Venue Representative distinct from Marketplace BDP |
| `SM_Role_Assignment.md`, `SM_KYC_Verification.md` | Lifecycle states |

---

## 6. Entry criteria

- Phase 3 exit criteria met or waived with explicit risk acceptance
- FD-023 / FD-035 / FD-034 / FD-039 read and cited in design
- Auth provider (Supabase Auth) available in staging
- Role taxonomy living doc current

## 7. Exit criteria

- User ↔ Profile ↔ Organisation ↔ Membership ↔ Role Assignment model documented and implementable
- Legacy mapping table implemented or migration jobs scoped (ADR-011)
- Workspace switcher behaviour specified for multi-role users
- Self-approval and SoD rules enforced in privileged workflows
- RBAC and RLS matrices exist (or stubs with explicit “Pending”) under `docs/security/`
- Root emergency path documented as break-glass, audited, not a product workspace
- No ordinary Super Admin product role shipped

---

## 8. Domain model summary

### 8.1 Core entities (**Business**)

| Entity | Meaning |
|--------|---------|
| **User** | Permanent base identity (auth subject). Survives role changes. |
| **Profile** | Person-facing attributes linked to User; not a substitute for assignments |
| **Organisation** | Legal/operating org container (e.g. Enterprise Client org; Venue Partner org as designed) |
| **Organisation membership** | User’s membership in an Organisation (statused) |
| **Role assignment** | Granted role + **scope** + status + effective dates; source of AuthZ |
| **Scope** | Bounds of power: platform / Circle / Franchise Unit / Venue / Enterprise Client / etc. |
| **Workspace** | UI/routing context for an active assignment — **not** a legal entity or commercial entitlement (FD-035) |

### 8.2 Role families (canonical names)

Prefer approved names from `35_Role_Taxonomy.md` / FD-035:

| Family | Examples | Notes |
|--------|----------|-------|
| Member | GCE Connect Circle Member | Tier labels Associate/Core are not separate login roles |
| Connect BDP | Connect BDP | Franchise Unit is commercial construct |
| Marketplace BDP | Marketplace BDP | Venue-attribution based |
| Enterprise BDP | Enterprise BDP | Client-based packs |
| Venue side | Venue Representative / Venue Manager | Distinct from Marketplace BDP |
| Enterprise client side | Enterprise Client Representative | Distinct from Enterprise BDP and from org entity |
| Circle governance | Governing Body roles (President, VP, Secretary, Circle Finance Coordinator, Sergeant-at-Arms, etc.) | Does not own Circles (FD-030) |
| Ops | RM, PRM | No automatic settlement/refund/ledger/payout authority |
| Platform admins | Platform / Finance / Compliance / Support Admin | Department-scoped — not universal superuser by default (FD-023) |
| Root | Emergency technical capability | Not ordinary product role (FD-035/039) |

### 8.3 Legacy migration (**Business** + **Technical**)

| Legacy | Treatment |
|--------|-----------|
| **zbp** / ZBP | Commercial model **removed**; no active ZBP role/commission/deposit (FD-028/029/039) |
| **bdm** | Map carefully to current BDP family only with evidence; do not invent powers |
| **affiliate** | No active Affiliate workspace / commercial activation (FD-035/039) |
| **franchisee** | Map to Connect/Marketplace/Enterprise BDP unit/pack constructs as evidence allows |
| **enterprise** (legacy single role) | **Must split** into Enterprise BDP vs Enterprise Client Representative (FD-035/038) |
| CBDP / MBDP abbreviations | May map to Connect BDP / Marketplace BDP where historical equivalence is clear |
| Treasurer | Legacy GB finance title → **Circle Finance Coordinator** for current governance; keep historical records auditable (FD-032) |
| BOG / Circle Board | Prefer **Governing Body** |

Migration strategy principles: ADR-011. Do not create legacy permissions by route redirects alone (FD-035).

---

## 9. Workflows

### 9.1 Registration → User (**Business** + **Technical**)

1. Auth signup creates User.
2. Profile bootstrap; KYC may be requested later — Aadhaar **not mandatory by default** (FD-039).
3. No privileged role implied by signup alone.

### 9.2 Role assignment (**Business**)

1. Authorised Admin/ops initiates assignment with explicit role + scope.
2. Assignment enters lifecycle per `SM_Role_Assignment.md` (pending/active/suspended/revoked as designed).
3. Self-assignment / self-approval of conflicting privileges **forbidden** (FD-035).
4. Conflicts of interest (e.g. approving own commission-bearing outcomes) blocked by SoD rules (FD-023/035).

### 9.3 Workspace entry and switching (**Business**)

1. After auth, if multiple active workspaces → **explicit workspace selector** (FD-035).
2. If single active workspace → may redirect directly.
3. Switching must re-bind UI routes and server context to the selected assignment scope; must **not** silently merge data across workspaces.
4. Sensitive operations must remain inside the correct workspace and scope.

### 9.4 Suspension / revocation (**Business**)

| Level | Use |
|-------|-----|
| Assignment-scoped suspension | Default for role misconduct or operational holds |
| Platform-wide User suspension | Reserved for whole-account risk (FD-035) |
| Revocation | Ends assignment; audit retained |

Serious misconduct may escalate faster than progressive performance processes in vertical FDs.

### 9.5 Governing Body appointments (**Business**)

- Appointed within Circle governance support; term **six months** (FD-030/032).
- GB cannot independently own/create/activate Circles, terminate membership, or change fees/taxonomy (FD-030).
- Circle Finance Coordinator must not collect fees personally, hold Circle funds, or operate unauthorised Circle bank accounts.

### 9.6 RM / PRM (**Business**)

- Operational support / escalation; Marketplace BDP is primary RM for assigned venues (FD-033).
- Connect RM assignment is operational under Platform Operations (FD-036) — **no automatic separate RM commission layer**.
- No automatic financial authority (settlement, refund, ledger, payout).

### 9.7 Root emergency capability (**Business** + **Technical**)

- May exist for emergency technical administration.
- Tightly restricted, audited, not an ordinary workspace, not “Super Admin” product marketing (FD-035/039).
- Exact break-glass process: **Pending Technical Design** / security runbook; production use **PENDING PROFESSIONAL VALIDATION** (security review).

---

## 10. State machines refs

| Machine | Path |
|---------|------|
| Role assignment | `docs/state-machines/SM_Role_Assignment.md` |
| KYC verification | `docs/state-machines/SM_KYC_Verification.md` |

Related vertical machines consume assignment status but are owned by later phases.

---

## 11. Permission matrix summary

Full detail: **`docs/security/RBAC_PERMISSION_MATRIX.md`** (authoritative matrix document; keep aligned with FD-023/035).

**Summary principles (Business)**

| Principle | Rule |
|-----------|------|
| Deny by default | No permission without active assignment + scope |
| Scope binds power | Platform-wide only for appropriate Admin families |
| SoD | Sensitive approvals require distinct actors |
| No self-approval | Actor cannot approve own entitlement/activation where conflict exists |
| RM/PRM | No automatic money movement authority |
| GB | Governance support only — not Circle ownership or fee-setting |
| BDP roles | Operate within unit/pack/venue/client attribution rules of their vertical FDs |
| Venue Rep | Venue-side actions only; not Marketplace BDP commission authority |
| Enterprise Client Rep | Client org authority; not Enterprise BDP commission authority |
| Root | Break-glass only |

Department-scoped Platform / Finance / Compliance / Support Admins receive **assigned admin domains only** — not universal superuser by default (FD-023).

---

## 12. RLS notes

Full detail: **`docs/security/RLS_ACCESS_MATRIX.md`**.

**Technical (ADR-005)**

1. RLS mandatory on tenant/person/finance-scoped tables exposed to client keys.
2. Deny-by-default; policies keyed to User + active assignments/scopes.
3. Service role bypasses RLS — server/trusted workers only.
4. RLS does not replace workflow SoD (e.g. self-approval bans).

Exact policy SQL remains implementation work; do not invent policies that grant Affiliate/ZBP powers.

---

## 13. Permissions notes (implementation checklist)

- Every Server Action / privileged Route Handler checks assignment + scope (**Technical** enforcing **Business**).
- UI hiding is not AuthZ.
- Workspace claim must match assignment id used for AuthZ.
- Audit actor, role, scope, before/after on grant/suspend/revoke (ADR-010).
- Feature flags must not expose inactive Affiliate/Vendor portal workspaces (FD-039).

---

## 14. Risks

| Risk | Mitigation |
|------|------------|
| Legacy `enterprise` dual meaning | Forced split to BDP vs Client Rep |
| Accidental Super Admin workspace | Do not ship; root is break-glass only |
| Silent workspace priority | Explicit switcher (FD-035) |
| RLS gaps | Matrices + deny-by-default + tests |
| RM treated as finance admin | Hard deny settlement/refund permissions |
| Self-approval loops | SoD checks in domain services |

---

## 15. Unresolved items

| Item | Status |
|------|--------|
| Exact workspace UI chrome | Pending Technical Design (FD-035) |
| Exact emergency root-access process | Pending Technical Design + security validation |
| Storage shape distinguishing Enterprise Client org vs Rep vs BDP | Design pending; rule locked by FD-038 |
| How GB/RM/PRM appear in DB enums | Open mapping in role taxonomy — do not guess |
| Aadhaar edge-case workflows | PENDING PROFESSIONAL VALIDATION / Legal (FD-039) |
| Formal Super Admin business role | Not required; only via later FD |

---

## 16. Implementation notes (Technical)

1. Model **assignments** as first-class rows; avoid stuffing multiple roles into a single user enum as the sole AuthZ source.
2. Persist `current_workspace_assignment_id` in session; validate on every privileged call.
3. Migration jobs: map legacy roles with audit trail; never auto-grant finance powers.
4. Align route groups under workspace-oriented paths (Member, Connect BDP, Marketplace BDP, Venue, Enterprise BDP, Enterprise Client, Platform Ops) per FD-035 direction.
5. Integrate KYC state machine without blocking all onboarding on Aadhaar.
6. Keep permission matrix and RLS matrix docs updated when new scopes are added — Phase 4 owns the discipline.
7. Tests: multi-role user cannot read other workspace’s scoped rows; self-approval paths fail closed.
8. Sentry contexts: user id + assignment id + workspace type (no secrets).
9. Admin department scopes should be data-driven lists, not hardcoded “isAdmin ⇒ all.”
10. Document break-glass credentials in ops vault only; rotate after use.

---

## 17. Cross references

- FD-023, FD-034, FD-035, FD-039, FD-032, FD-030, FD-038, FD-037
- `docs/core/35_Role_Taxonomy.md`
- ADRs 001, 002, 003, 005, 011
- `docs/security/RBAC_PERMISSION_MATRIX.md`
- `docs/security/RLS_ACCESS_MATRIX.md`
