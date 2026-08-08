# ADR-011 — Legacy Migration Strategy

| Field | Value |
|-------|-------|
| **ID** | ADR-011 |
| **Title** | Legacy Migration Strategy |
| **Status** | Accepted — implemented; verified on gce-dev |
| **Date** | 2026-08-08 |
| **Classification** | Technical recommendation implementing FD-035 Part G / taxonomy |
| **Supersedes** | None |
| **Dependencies** | ADR-002, ADR-004, ADR-010 |

---

## Context

Legacy GCE operations include labels and histories such as ZBP, BDM, affiliate, franchisee, enterprise legacy roles, and BOG / Circle Board concepts. FD-035 Part G and `docs/core/35_Role_Taxonomy.md` define how these map into current role families. FD-039 keeps several legacy commercial models **inactive** (e.g. Marketplace Affiliate commercial activation, ZBP commercial model).

Migration must preserve history without minting unearned entitlements.

---

## Decision

1. **Preserve history:** Import or retain ZBP / BDM / affiliate / franchisee / enterprise / BOG (and related) historical records needed for audit, support, and continuity. Do not discard attribution or commercial history silently (ADR-010).
2. **Map via taxonomy:** Translate legacy labels to canonical current roles/assignments using FD-035 and `35_Role_Taxonomy`. Document mapping tables in migration runbooks; keep mapping data reviewable.
3. **No automatic entitlement:** Presence of a legacy label or imported row does **not** by itself grant active commercial rights, commissions, Circle seats, or BDP pack activation. Activation follows current Founder rules (FD-036–FD-039 et al.).
4. **Inactive commercial models:** Do not re-enable Marketplace Affiliate commercial activation, ZBP commercial model, or other FD-039 inactive items through migration scripts.
5. **BOG / Circle Board:** Treat per FD-035 legacy guidance; Governing Body is a scoped appointment in the current model — do not invent unlimited powers from legacy titles.
6. **User identity:** Prefer merging to one permanent base User (FD-035) with multiple assignments over duplicate accounts, with explicit conflict resolution when emails/phones collide.

**Label:** Technical migration approach. Canonical role meanings and inactive commercial items are Founder law.

---

## Consequences

### Positive

- Continuity for ops and disputes.
- Cleaner RBAC going forward.
- Avoids accidental revenue leakage from legacy flags.

### Negative / trade-offs

- Manual/exception queues for ambiguous legacy rows.
- Temporary dual-read compatibility may be needed during cutover.

---

## Alternatives considered

| Alternative | Why not chosen |
|-------------|----------------|
| Drop legacy history | Breaks audit and support |
| Auto-activate mapped roles | Violates “no automatic entitlement” |
| Keep legacy enums as live RBAC forever | Conflicts with FD-035 canonical families |

---

## Governing FDs

- **FD-035** — Legacy role migration (ZBP, CBDP, MBDP, BDM, Affiliate, Franchisee, Enterprise, BOG)
- **FD-023** — Permissions after remapping
- **FD-032** — Authority/status supersession clarification where relevant
- **FD-039** — Inactive legacy commercial items

Supporting doc: `docs/core/35_Role_Taxonomy.md`

---

## Not in scope

- City-by-city cutover calendar (depends on pilot city selection — FD-039)
- Exact ETL tooling choice
- Financial restatement accounting entries (Finance-owned)

---

## Professional validation

Finance/Legal review where legacy commercial promises conflict with current Commercial Licence / BDP packaging (FD-039).
