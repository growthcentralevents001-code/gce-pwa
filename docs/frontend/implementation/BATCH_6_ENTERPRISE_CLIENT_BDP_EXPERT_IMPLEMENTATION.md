# Batch 6 — Enterprise Client + Enterprise BDP + Enterprise Platform Expert

| Field | Value |
|-------|-------|
| **Status** | **COMPLETE — Enterprise experience ready for review** (non-blocking gaps remain) |
| **Date** | 2026-08-10 |
| **Branch** | `development` |
| **Batch 7** | Not started |
| **Checkpoint C reuse** | PartnerShell, StatusStrip, ActionCenter, CommercialSummary, DataTable, Pipeline, KpiCard, Timeline, DisputeCard, HandoverSummary |

---

## Commercial authority check

Matched `lib/architecture/enterprise/constants.ts` + FD-026/038 / `36_Commercial_Constants.md`:

| Item | Value |
|------|-------|
| EBDP entitlement | 25% of eligible GCE platform commission (NOT project value) |
| Finance co-sign | Strictly **>** ₹5,00,000 (`FINANCE_COSIGN_THRESHOLD_MINOR = 50_000_000`) |
| Pack | ₹30,000 direct / ₹36,000 finance |
| Client cap | 30 per pack; max 2 packs / 60 clients |
| Milestones | Project-specific — no fixed 30/40/30 |
| Vendors | Managed records; `login_enabled = false` |
| Expert commission | None automatic |
| Attribution | Client-based; no territory ownership |

No prompt/repo discrepancy.

---

## Checkpoint C reuse assessment

| Pattern | Status |
|---------|--------|
| PartnerShell + nav | Extended for `enterprise-client`, `enterprise-bdp`, Expert via `platform-ops` |
| StatusStrip / ActionCenter / CommercialSummary | Direct reuse |
| DataTable / Pipeline / Timeline / KPI | Direct reuse |
| DisputeCard / HandoverSummary | Direct reuse |
| Enterprise cards/forms | Thin semantic wrappers in same visual family |

No separate Enterprise CRM theme.

---

## Routes

### Enterprise Client

| ID | Route | Status |
|----|-------|--------|
| ECL-01 | `/dashboard/enterprise-client` | Created |
| ECL-02 | `/enterprise/signup` | Existing public retained |
| ECL-03–10 | `/enterprise/{opportunities,requirements,proposals,quotes,projects,projects/[id],vendors,disputes}` | Created under `(partner)` |

### Enterprise BDP

| ID | Route | Status |
|----|-------|--------|
| EBDP-01 | `/dashboard/enterprise-bdp` | Created |
| EBDP-02–07 | `/enterprise-bdp/{apply,clients,pipeline,entitlements,handover,disputes}` | Created |

### Enterprise Platform Expert

| ID | Route | Status |
|----|-------|--------|
| EXP-01–06 | `/enterprise-expert`, `/queue`, `/requirements`, `/proposals`, `/projects`, `/vendors` | Created (workspace `platform-ops`) |

---

## 21st.dev (search-only)

| Area | IDs | Adopted | Rejected |
|------|-----|---------|----------|
| Enterprise dashboard | 13985, 8371, 8698 | Dense KPI + status strip structure | Navy/blue corporate palette |
| Opportunity/proposal | 7464, 7491, 8035, 12373 | Card density + approval status | Drag CRM mutation / neon |
| Milestone/change | 8698, 23363, 23569 | Timeline milestone list | Fixed % payment visual |
| Finance/vendor | 23595, 7498 | Co-sign status clarity | Client-side commission widgets |

ui-ux-pro-max suggested navy/blue Trust & Authority — **rejected**; MASTER.md orange/cream retained.

---

## Backend gaps

| ID | Gap | Class |
|----|-----|-------|
| BG-23 | Enterprise Client representative invite/remove console | Action API / UX |
| BG-24 | EBDP self-serve reassignment request | Action API |
| BG-25 | Expert project/quote assignment-scoped list DTO | UX read-model |
| BG-26 | Paginated Enterprise portfolios | Pagination |

---

## Security / privacy / finance

- Auth shells for partner routes; `/enterprise` marketing + `/enterprise/signup` public
- Recommend/propose ≠ Platform activate; Finance co-sign execution not exposed to Client/Expert/BDP
- Client quotes hide partner entitlement
- Settlement/payout gated
- Vendor self-service absent

---

## Tests / gates

- `tests/unit/batch6-enterprise-frontend.test.ts`
- typecheck / test / build / scoped lint required before commit
