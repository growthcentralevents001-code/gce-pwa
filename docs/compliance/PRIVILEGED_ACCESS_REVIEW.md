# Privileged Access Review

| Field | Value |
|-------|-------|
| **Document ID** | P15-ACC-001 |
| **Status** | DOCUMENTARY/TECHNICAL REVIEW — names **MISSING** |
| **Checked** | 2026-08-15 |

No ordinary **Super Admin** product role (FD-023/035; Phase 13).

---

| Surface | Intended control | Current evidence | Gap |
|---------|------------------|------------------|-----|
| Root / emergency admin | Break-glass runbook — Pending Technical Design (OD register Phase 4 note) | Not a product role | Named people + logging |
| Platform Admin / Ops | Scoped ops workspaces | Phase 13 ops | Production operator list |
| Finance | Console without ledger mutators while flags OFF | Phase 13 | SoD vs payout later |
| Compliance | Holds / privacy queue | Phase 12/13 | Staffing |
| Support | Scoped cases | Phase 13 | PII access training |
| Opportunity Desk | Lead queue; contact hidden until reveal | Phase 10/14B | Minimum access justification |
| Supabase | Service role = god mode | Dev project used | Production access list; no shared passwords |
| Production VPS | — | Not in Phase 15 | Bastion, MFA |
| CI/CD | GitHub | Unrelated WIP exists — do not grant extra | Branch protection review |
| BDP / RM / PRM | **Cannot bind Logixia** | FD-034 | Contract + product copy |

## Segregation of duties (technical)

| Control | Evidence | Production risk |
|---------|----------|-----------------|
| No self-approval | Phase 13/14B | Dual-hatted humans |
| MBDP recommend ≠ Marketplace Ops approve | FD-033/037; Phase 7 | Same person both roles |
| Enterprise Finance co-sign only if total proposed value **> ₹5,00,000** (strictly greater) | FD-038; Phase 8 | Do not convert to customer clause unless appropriate |
| Payout/settlement execution gated | Flags OFF | Enabling without two-person rule = blocker candidate |

Missing SoD for **production money** should be a blocker candidate when flags are considered.

## Internal access and confidentiality

See also [INTERNAL_ACCESS_AND_CONFIDENTIALITY_CONTROL.md](./INTERNAL_ACCESS_AND_CONFIDENTIALITY_CONTROL.md).

## QUESTIONS FOR PROFESSIONAL REVIEW

Break-glass design; production access recertification.

## QUESTIONS REQUIRING FOUNDER DECISION

Named privileged users (do not invent).
