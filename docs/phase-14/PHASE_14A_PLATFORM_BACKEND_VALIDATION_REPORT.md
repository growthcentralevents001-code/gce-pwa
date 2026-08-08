# Phase 14A — Platform / Backend Validation Report

| Field | Value |
|-------|-------|
| **Status** | **PHASE 14A COMPLETE** — backend ready for final frontend redevelopment |
| **Date** | 2026-08-08 |
| **Branch** | `development` |
| **Baseline HEAD (Phase 13)** | `cbb36802536b59521037ce434a57050ee7bab8e2` |
| **Production** | Untouched (`tzeqeywezmqslovpflqu`) |
| **gce-dev** | Validated; no additive schema fix migration required this pass |
| **Scope** | Platform/backend only — **not** full Phase 14; **not** Phase 14B product E2E/UAT |

---

## Explicit non-claims

Phase 14A does **not** certify:

- final visual design
- full responsive UX
- accessibility
- cross-browser UI
- final customer journey UI
- final admin UX
- final PWA polish
- pilot readiness
- production readiness
- website complete / UAT complete

Those belong to **Final Website/PWA redevelopment** and **Phase 14B**.

---

## Authority map (validation matrix summary)

| Domain | Governing FD / ADR | Migrations | Service layer | API | RBAC/RLS | Tests | Status |
|--------|--------------------|------------|---------------|-----|----------|-------|--------|
| Identity / workspaces | FD-023/035; ADR-002/003 | `…150000` | `lib/architecture/identity/*` `workspace/*` | `/api/identity/*` | matrices + SQL | unit + phase4 SQL | PASS |
| Connect | FD-022/024/030/036 | `…160000` | `connect` | `/api/connect/*` | connect policies | phase5 SQL | PASS |
| Connect BDP | FD-025/029/036 | `…170000` | `connect-bdp` | `/api/connect/bdp` | connect BDP policies | phase6 SQL | PASS |
| Marketplace | FD-033/037 | `…180000` | `marketplace` | `/api/marketplace/*` `/api/customer` | marketplace RLS | phase7 SQL | PASS |
| Enterprise | FD-026/038 | `…190000` | enterprise services | `/api/enterprise` | enterprise RLS | phase8 SQL | PASS |
| Finance | FD-020/021/028/029 | `…200000` | `finance` `ledger` | `/api/finance` | finance RLS | phase9 unit+SQL | PASS |
| Lead Assist | FD-031/039 | `…210000` | `lead-assist` | `/api/lead-assist` | assist RLS | phase10 SQL | PASS |
| Customer CX | FD-037/039 | `…220000` | `customer-cx` | `/api/customer` | CX RLS | phase11 SQL | PASS |
| Ops governance | FD-039; ADR-010/014 | `…230000` | `ops-governance` | `/api/ops` | Phase 12 policies | phase12 SQL | PASS |
| Admin/Ops | FD-023/035/039 | `…240000` | `ops-admin` | `/api/ops/admin` | Phase 13 policies | phase13+14a SQL | PASS |

---

## Clean DB rebuild

| Item | Result |
|------|--------|
| Environment | Isolated PostgreSQL 18 (`gce_phase14a_rebuild`, socket `/var/run/gce-phase14a-pg`, port `55433`) |
| Bootstrap | `scripts/phase14a/bootstrap_empty_postgres.sql` (auth.uid stub + `auth.users` + `public.users` + roles) |
| Applied | **13** canonical migrations `20260808130000` → `20260808240000` only |
| Excluded | Sample/test/city WIP June–July migrations (not Phase SoT) |
| Duration | ~2s |
| Outcome | **PHASE14A_CLEAN_REBUILD_OK** — 148 public tables, 211 policies |
| Script | `scripts/phase14a/clean_rebuild.sh` |

Critical exit met: empty DB + bootstrap + repo canonical migrations → functional Phase 13 backend.

---

## Migration-chain audit

| Class | Files |
|-------|-------|
| Canonical schema (apply order) | `20260808130000` … `20260808240000` (13 files) |
| Sample / noop | `20260616125508_sample`, `20260616130329_sample` |
| Test | `20260617113143_test_auto_migration`, `20260617123704_test_final_workflow`, `20260624113130_test_pooler_connection` |
| Legacy WIP | `20260617104731_add_notes_to_saved_events` |
| Unrelated dirty WIP (do not apply) | `20260703110000_normalize_city_values` |

### Idempotency

Full re-apply of all 13 canonical migrations on the rebuilt DB: **PHASE14A_IDEMPOTENCY_OK**.

One-shot nature: table `CREATE IF NOT EXISTS` will not reshape an older table; seeds upsert flags (by design force money OFF).

### Prerequisites for empty Postgres

Documented in bootstrap: `authenticated` / `service_role` / `anon`, `auth.uid()`, `auth.users`, `public.users`. Phase 12–13 FK `auth.users`; earlier phases FK `public.users`.

---

## gce-dev drift

| Metric | Clean rebuild | gce-dev | Notes |
|--------|---------------|---------|-------|
| Canonical architecture tables (filtered) | 111 | 118 | +7 legacy-only tables on gce-dev |
| Tables only on gce-dev (filtered) | — | `circle_leads`, `circle_members`, `enterprise_applications`, `enterprise_campaigns`, `enterprise_proposals`, `enterprise_requests`, `marketplace_affiliates` | **historical/compatibility** — not missing from Phase 2–13 SoT |
| Tables only on rebuild | 0 | — | No gap |
| Policy count | 211 | 331 | Extra legacy table policies on gce-dev |
| Feature-flag production-risk keys | OFF | OFF | Matched |

**Verdict:** Repo migrations are authoritative for Phase 2–13 architecture. gce-dev supersets with legacy surfaces (expected). No correction migration applied.

---

## Database types

Regenerated from gce-dev and compared to `lib/database.types.ts`:

- **Identical** (SHA256 prefix `2988685aaa063aef`)
- Includes Phase 13 `ops_*` and `gce_next_ops_case_number`

---

## Legacy schema / data audit

| Area | Classification |
|------|----------------|
| `public.users` / profiles / role_assignments | Canonical |
| `user_roles` + quarantine trigger | Compatibility-only (present gce-dev; absent clean rebuild) |
| ZBP / BDM / Affiliate / Franchisee product paths | Unsafe/deprecated for entitlement; historical |
| Legacy `venues` / `events` / `bookings` / `offers` | Historical-only vs `marketplace_*` SoT |
| Legacy `enterprise_requests` / `enterprise_proposals` / `enterprise_applications` / `enterprise_campaigns` | Historical-only |
| `marketplace_affiliates` | Inactive product surface (flag OFF) |
| Old membership basic/gold/platinum plans | Historical / needs review if still referenced in UI |
| Paid Lead Assist ₹500 / escrow | Inactive (flags OFF) |
| Dirty `app/admin/*` | Legacy / dirty WIP — not Phase 13 SoT |

### Legacy backfill rehearsal

| Result | Count / note |
|--------|----------------|
| Mapped | Deterministic rows via `legacy_role_migration_map` (Phase 4) — no automatic BDM entitlement |
| Ambiguous / quarantined | New inactive role inserts blocked when `user_roles` exists |
| Historical_only | Legacy enterprise/circle/affiliate tables retained on gce-dev |
| Needs_review | Bulk historical assignment migration still ops (documented Phase 4) |
| Production bulk migrate | **Not performed** |

Clean-rebuild Phase 4 SQL skips `user_roles` inserts with notice when table absent (harness fix).

---

## Domain validation results

| Suite | Result |
|-------|--------|
| Phase 2 RLS foundation | PASS |
| Phase 4 RLS identity | PASS (legacy quarantine conditional) |
| Phase 5 Connect concurrency (15/20/40 + seat 41) | PASS |
| Phase 6 Connect BDP concurrency | PASS |
| Phase 7 Marketplace concurrency | PASS |
| Phase 8 Enterprise concurrency | PASS |
| Phase 9 Finance concurrency + invariants | PASS |
| Phase 10 Lead Assist concurrency | PASS |
| Phase 11 Customer CX concurrency | PASS |
| Phase 12 Ops governance | PASS |
| Phase 13 Ops admin | PASS |
| Phase 14A platform harness (flags, tables, capacity, no-double-commission, ops projection) | PASS |
| Vitest (repo) | **146 passed** / 10 skipped |
| Phase 14A vitest file | **8 passed** (when local PG up) |

### Finance invariants highlighted

- Integer minor units / BPS floor arithmetic
- Payment ≠ revenue; claim ≠ revenue
- Connect 20% attributed only
- Marketplace 80/10/10 vs 80/0/20
- Enterprise 25% of platform commission
- Unique `earning_event_key` blocks double commission
- Money execution flags OFF
- No RM/PRM/Desk/Support entitlement creation in finance rules

### Security regression (backend)

| Check | Result |
|-------|--------|
| Self-approval denial (ops) | PASS (unit) |
| Cross-profile / cross-org RLS (phase4) | PASS |
| Emergency grant not writable by authenticated | PASS |
| No force-update ops endpoint | PASS (code audit) |
| QR/claim/booking concurrency harnesses | PASS (phase7/11) |
| P0/P1 unresolved | **None** |

### Performance baseline (EXPLAIN only)

Hot paths on empty rebuild use indexed plans for:

- `marketplace_events` (status/time indexes present)
- `ops_approval_queue` pending index
- `stakeholder_entitlements`

No unbounded full-table scan fix required on empty baseline. Deeper load testing deferred to Phase 14B / ops.

---

## Feature-flag inventory (gce-dev)

Production-risk / inactive (must remain OFF):

| Key | Enabled |
|-----|---------|
| marketplace_ticket_payments | false |
| settlement_execution | false |
| payout_execution | false |
| refund_processing | false |
| notifications_*_live | false |
| marketing_notifications | false |
| retention_enforcement | false |
| paid_lead_assist / lead_escrow / lead_success_fee / rupee_500_lead_fee / paid_contact_reveal | false |
| wallet_cashout | false |
| revenue_recognition_live / commission_posting_live / settlement_batch_generation | false |

Review-oriented ON: `security_monitoring`, `fraud_review`, ops consoles, Stage-1 Lead Assist, CX booking/claims (non-money), sandbox notification providers.

---

## Defect classification

| ID | Class | Item | Disposition |
|----|-------|------|-------------|
| — | P0 | None | — |
| — | P1 | None | — |
| P14A-P2-1 | P2 | Clean rebuild requires bootstrap (auth/users) not in numbered migrations | Documented; scripted |
| P14A-P2-2 | P2 | Non-canonical June/July migrations break `db reset` if applied blindly | Document exclusion |
| P14A-P3-1 | P3 | Legacy table policies inflate gce-dev policy count | Accept |
| — | UI-REDESIGN | Entire public/customer/admin shell | Deferred |
| — | PRO-VALIDATION | GST/TDS/MoR/DPDP/retention/SMS-DLT/refund % | OD register |
| — | FOUNDER-DECISION | OD-006/007/009/010/018/021–023/027 etc. | Open; architecture supports |

---

## Frontend gap inventory (audit only)

| Surface | Classification |
|---------|----------------|
| Home `/` | dirty WIP / requires redesign |
| Events/Offers public listing | dirty WIP / legacy prototype |
| `/customer/*` | verification-only / backend ready |
| Booking `/booking/*`, checkout | legacy / dirty WIP |
| Tickets customer | verification-only |
| Auth login/signup/profile | current and usable (needs redesign polish) |
| Memberships / the-circle | mock/static + legacy mix |
| Connect member workspace | backend ready; UI incomplete |
| Connect BDP UI | backend ready; UI missing/incomplete |
| MBDP / Venue dashboards | partial legacy dashboards |
| Enterprise client/BDP/expert | backend ready; UI incomplete |
| `/ops/*` | verification-only ops console (Phase 12–13) |
| `/dashboard/[workspaceKey]` | canonical workspace shell (minimal) |
| Dirty `/app/admin/*` | legacy / unsafe for new RBAC |
| Settings notifications/privacy | dirty WIP vs `/ops/notifications` |
| ZBP / Affiliate / BDM routes | deprecated product surfaces |

---

## Frontend ↔ backend contract map (summary)

| UI surface | Canonical service/API | Permission | Entity | Frontend status |
|------------|----------------------|------------|--------|-----------------|
| Workspace switcher | `/api/identity/workspaces` + AuthZ | active assignment | workspaces | usable minimal |
| Membership ops | `/api/connect/memberships` | connect perms | connect_memberships | UI incomplete |
| Circles | `/api/connect/circles` | connect perms | connect_circles | UI incomplete |
| Connect BDP | `/api/connect/bdp` | connect BDP | connect_bdp_* | UI missing |
| Marketplace BDP | `/api/marketplace/bdp` | marketplace | marketplace_bdp_* | UI incomplete |
| Customer CX | `/api/customer` | cx.* | marketplace_* + CX tables | verification routes |
| Lead Assist | `/api/lead-assist` | lead.* | assist_* | Desk UI incomplete |
| Enterprise | `/api/enterprise` | enterprise.* | enterprise_* | UI incomplete |
| Finance | `/api/finance` | finance | entitlements/settlement | ops/finance verification |
| Ops governance | `/api/ops` | security/privacy/notif | Phase 12 | `/ops/*` verification |
| Ops Admin | `/api/ops/admin` | ops.* | ops_* | `/ops/*` verification |
| Jobs | `/api/jobs/run` | service | background_jobs | backend only |
| Payments webhook | `/api/webhooks/payments` | signature | payment_* | gated OFF |

Full product redesign must wire UI only through these contracts — not legacy `/admin` APIs.

---

## Deferred

### Final Website/PWA redevelopment

- Full public marketing + discovery IA
- Redesign of Home/Events/Offers/Venue
- Replace dirty admin with `/ops` + `/dashboard/[workspaceKey]`
- Design-system consistency pass
- PWA polish / SW client (respect dirty `sw.js`)

### Phase 14B

- Browser E2E (Playwright)
- Visual regression / responsive QA
- Accessibility certification
- Full UAT scripts + pilot acceptance
- Cross-browser matrix
- Production-like data volume performance

---

## Quality gates

| Gate | Result |
|------|--------|
| typecheck | PASS (run at close) |
| vitest | PASS (146+; Phase 14A DB suites when PG up) |
| lint | Pre-existing UI debt remains; Phase 14A paths clean |
| build | PASS (run at close) |

---

## Migrations / fixes applied to gce-dev

**None** this pass (no schema drift requiring DDL).

Production untouched.

---

## Recommendation (next step)

1. Begin **Final GCE Website/PWA redevelopment** against the contract map above.
2. Keep Phase 14A evidence as the backend gate.
3. Start **Phase 14B** only after (or late in) frontend redevelopment — not before.
4. Do **not** mark Phase 14 overall complete until 14B finishes.
