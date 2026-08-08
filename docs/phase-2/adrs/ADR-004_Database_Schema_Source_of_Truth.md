# ADR-004 — Database Schema Source of Truth

| Field | Value |
|-------|-------|
| **ID** | ADR-004 |
| **Title** | Database Schema Source of Truth |
| **Status** | Accepted |
| **Date** | 2026-08-08 |
| **Classification** | Technical recommendation (not Founder law) |
| **Supersedes** | None |
| **Dependencies** | ADR-005, ADR-007 |

---

## Context

GCE uses PostgreSQL via Supabase. Narrative docs (`docs/core/`, Founder Decisions) describe the **logical** business model. Phase 2 must avoid inventing “final” SQL in ADRs or prose docs that diverge from applied migrations.

FD-039 lists Supabase migrations as the schema SoT technical default.

---

## Decision

1. **Schema SoT:** `supabase/migrations/` is the authoritative source of truth for applied database schema (tables, constraints, indexes, RLS policies as migrated, functions, triggers).
2. **Documentation role:** Founder Decisions and `docs/core/` describe business meaning, entities, and rules. They may include illustrative ER notes but **must not** be treated as executable DDL.
3. **Change process:** Schema changes land as ordered migration files; environments apply the same migration history (see ADR-012).
4. **Types:** Generated or hand-maintained TypeScript DB types must follow migrations, not the reverse.
5. **This ADR:** Does **not** invent final SQL for ledgers, assignments, wallets, or MoR tables.

**Label:** Technical recommendation — not Founder law.

---

## Consequences

### Positive

- One apply path; reduces doc/SQL drift.
- Reviewable, reversible history via migration PRs.
- Clear ownership for agents and humans.

### Negative / trade-offs

- Docs can lag migrations; require discipline to update living docs after material schema change.
- Hotfixes outside migrations are forbidden practice.

---

## Alternatives considered

| Alternative | Why not chosen |
|-------------|----------------|
| Prisma / Drizzle as schema SoT | Stack is Supabase SQL migrations; dual SoT risks drift |
| Docs-first DDL as authority | Non-executable; historically drifts |
| Dashboard-only schema edits | Unreproducible across envs |

---

## Governing FDs

- **FD-020** — Financial architecture principles (logical ledgers; not table DDL)
- **FD-021** — Settlement principles (logical)
- **FD-023 / FD-035** — Identity/RBAC logical model
- **FD-039** — Migrations as technical SoT default

---

## Not in scope

- Naming conventions catalogue (may live in engineering docs)
- Exact partition/sharding strategy
- Inventing Phase 2 final CREATE TABLE statements in this ADR

---

## Professional validation

Tax/GST/TDS column design and MoR invoicing fields require Finance/Tax/Legal validation when introduced — not decided here.
