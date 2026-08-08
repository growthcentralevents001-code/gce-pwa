# ADR-002 — Role Assignment and RBAC Model

| Field | Value |
|-------|-------|
| **ID** | ADR-002 |
| **Title** | Role Assignment and RBAC Model |
| **Status** | Accepted — implemented; verified on gce-dev |
| **Date** | 2026-08-08 |
| **Classification** | Technical recommendation implementing FD-023 / FD-035 |
| **Supersedes** | None |
| **Dependencies** | ADR-001, ADR-003, ADR-005 |

---

## Context

FD-035 establishes that **User ≠ role** and that multiple roles are separate **assignments** with lifecycle statuses. FD-023 owns RBAC and permissions. Legacy labels (ZBP, BDM, affiliate, franchisee, etc.) must map through `docs/core/35_Role_Taxonomy.md` without inventing entitlements.

FD-039 keeps **Super Admin as an ordinary product role** inactive.

---

## Decision

1. **Conceptual model:** Permissions derive from **role assignments**, not from a single enum on the User row.
2. **Assignments pattern (conceptual):** A User may have zero or more assignments, each with:
   - Role / role family (canonical names per FD-035 / taxonomy)
   - Scope (e.g. platform, circle, venue, enterprise client)
   - Status (pending, active, suspended, expired, revoked — per FD-035)
   - Validity window and audit metadata as required by FD-023/FD-035
3. **User row:** Holds permanent base identity and profile; does **not** encode “the” permission level.
4. **Legacy enums:** Map via `35_Role_Taxonomy` and FD-035 Part G. Mapping is historical/interpretive; **no automatic commercial entitlement** from legacy labels (see ADR-011).
5. **Super Admin / root emergency capability:** Not an ordinary product workspace role. Break-glass capability, if any, is narrowly controlled, audited, and outside normal RBAC product surfaces (FD-035, FD-039).
6. **Self-approval / SoD:** Enforcement belongs in domain services + RBAC checks (FD-035 Parts C); schema alone is insufficient.

**Label:** Technical schema/pattern recommendation. Role *families* and SoD rules are Founder law (FD-023, FD-035); exact SQL table names are not Founder law.

---

## Consequences

### Positive

- Supports multi-role users and workspace switching without duplicate accounts.
- Clear audit trail for grant/revoke/suspend.
- Aligns admin tooling with assignment lifecycle.

### Negative / trade-offs

- More joins and permission evaluation complexity than a single `users.role` column.
- Requires disciplined taxonomy updates when roles evolve.

---

## Alternatives considered

| Alternative | Why not chosen |
|-------------|----------------|
| Single `role` enum on User | Violates FD-035 multi-role / assignment model |
| Hard-coded frontend role strings only | Insecure; bypasses server RBAC |
| Super Admin as default admin workspace | Explicitly inactive / non-ordinary (FD-039, FD-035) |

---

## Governing FDs

- **FD-023** — RBAC and permissions
- **FD-035** — Identity, assignments, workspaces, admin families, Super Admin terminology
- **FD-036** — Membership approval/attribution authorities (consume RBAC)
- **FD-039** — Super Admin not ordinary product role

Supporting doc: `docs/core/35_Role_Taxonomy.md`

---

## Not in scope

- Final SQL DDL for assignment tables (ADR-004 owns SoT location)
- Exhaustive permission matrix UI
- Exact break-glass credential storage vendor choice

---

## Professional validation

None specific beyond normal security review of privileged assignment workflows.
