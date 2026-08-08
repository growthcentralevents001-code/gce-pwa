# Phase 8 — Enterprise Implementation Notes

| Field | Value |
|-------|-------|
| **Status** | Implemented on **gce-dev** (`hvevqoltcwumcvxetxsf`) |
| **Date** | 2026-08-08 |
| **Migration** | `supabase/migrations/20260808190000_phase8_enterprise.sql` |
| **Commit message** | `feat: implement Phase 8 Enterprise architecture` |
| **Authority** | FD-026 / FD-028 / FD-029 / FD-034 / FD-035 / FD-037 / FD-038 / FD-039 |
| **Production** | **Untouched** (`tzeqeywezmqslovpflqu`) |

---

## Verdict

**PHASE 8 IMPLEMENTATION COMPLETE — NON-BLOCKING POLICY ITEMS REMAIN**

Non-blocking open items: OD-027 reassignment cut-off edge; Enterprise/Vendor legal packs; GST/TDS; contractual executor wording per project (professional validation).

Phase 9 (generic Finance / Commission / Settlement) was **not** started beyond Enterprise entitlement boundaries.

---

## Authority map used

| Topic | Controlling authority | Implemented value |
|-------|----------------------|-------------------|
| Pack pricing | FD-026 / Constants | ₹30,000 direct or ₹36,000 financed (₹5k + ₹31k) |
| Pack capacity | FD-026 | 30 clients/pack; max 2 packs/person (60) |
| Platform commission | FD-026 | Default 20% of eligible event revenue |
| Enterprise BDP commission | FD-026 / FD-029 / FD-038 | **25% of eligible GCE platform commission** (not 25% of project value) |
| Attribution | FD-026 / FD-038 | Client-based (not territory) |
| Finance co-sign | FD-038 | Required when total proposed value **> ₹5,00,000** before issue |
| Quotation issue | FD-038 | Platform Expert / Ops; Enterprise BDP alone may not issue |
| Milestones | FD-038 | Project-specific; no hardcoded 30/40/30 |
| Vendors | FD-038 / FD-039 | Managed records; portal inactive |
| No double commission | FD-037 / FD-038 | `gce_commissioned_revenue_components` claim guard |
| Reassignment | FD-026; OD-027 open | Prospective; historical entitlements preserved |
| Min project | Constants | ₹1,00,000 eligible event revenue |

### Prompt-vs-FD discrepancies

| Prompt | FD / constants | Resolution |
|--------|----------------|------------|
| “≥ ₹5L Finance co-sign” in some roadmap wording | FD-038: **greater than** ₹5,00,000 | Implemented **>** ₹5L (`total_proposed_minor > 50000000`) |
| Any implication EBDP earns 25% of project value | FD: 25% of **platform commission** | FD wins |

---

## What shipped

### Domains / tables (additive)

- `enterprise_bdp_packs`
- `enterprise_client_profiles` (org-linked)
- `enterprise_client_attributions` + handovers
- `enterprise_opportunities`
- `enterprise_requirements` + `enterprise_requirement_versions`
- `enterprise_solution_proposals` (separate from legacy `enterprise_proposals`)
- `enterprise_quotes` + `enterprise_quote_lines`
- `enterprise_projects` + `enterprise_project_components`
- `enterprise_milestones`
- `enterprise_vendors` + `enterprise_vendor_assignments`
- `enterprise_change_orders`
- `enterprise_disputes`
- `enterprise_revenue_entitlements`
- `gce_commissioned_revenue_components`
- `legacy_enterprise_migration_map`

### Application spine

- `lib/architecture/enterprise/*` — constants, operations, reporting, permissions
- `app/api/enterprise/route.ts` — authenticated action API
- Workspace panels on `/dashboard/[workspaceKey]` for `enterprise-bdp`, `enterprise-client`, and expert/finance boundary on `platform-ops` / `finance`

### Guards

- DB trigger: quote issue blocked without Finance co-sign when > ₹5L
- Unique active attribution per client
- One project per accepted quote
- Vendor `login_enabled = false` check
- Pack client capacity 30; person pack cap 2
- Cross-vertical revenue component claim uniqueness

### Money / Phase 9 gates

Feature flags remain **OFF**:

- `enterprise_bdp_pack_payments`
- `enterprise_vendor_portal`
- `settlement_execution`
- `bdp_pack_payments`

---

## Legacy Enterprise

| Object | Status |
|--------|--------|
| `enterprise_requests` (9 rows) | Historical / compatibility |
| `enterprise_proposals` (9 rows) | Historical — superseded by `enterprise_solution_proposals` + `enterprise_quotes` |
| `enterprise_applications` (6 rows) | Historical lead form |
| `enterprise_campaigns` | Historical |
| Legacy `enterprise` role | **Ambiguous — no auto-map** to `enterprise_bdp` |

---

## Verification

- Applied to gce-dev via psql; production untouched
- `supabase_migrations.schema_migrations` includes `20260808190000`
- Types regenerated into `lib/database.types.ts`
- SQL invariants: Finance co-sign, attribution uniqueness, project idempotency, no double commission, vendor no-login → `PHASE8_ENTERPRISE_OK`
- Unit tests: `tests/unit/phase8-enterprise.test.ts`

---

## Remaining non-blocking

1. OD-027 exact reassignment cut-off across in-flight projects
2. Professional validation: GST/TDS/invoice, Enterprise/Vendor agreements
3. Full Phase 9 settlement / payout / clawback engines
4. Formal Vendor Opportunity Fee % remains inactive (OD-026)

Phase 9 may begin after Product confirmation that Enterprise spine is accepted for Finance unification.
