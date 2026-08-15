# Phase 14B-F — Development Test Identity + Role Fixture Spec

| Field | Value |
|-------|-------|
| **Status** | Implemented on **gce-dev only** |
| **Date** | 2026-08-15 |
| **Purpose** | Close **BG-32** so Phase 14B authenticated E2E can run |
| **Production** | Untouched — scripts refuse production project ref |

---

## 1. Purpose

Provide a deterministic, synthetic, resettable identity + role matrix for browser Playwright UAT on `gce-dev` (`hvevqoltcwumcvxetxsf`).

This is **test infrastructure**, not a product feature phase.

---

## 2. Production guard

`scripts/e2e-fixtures/env.mjs` / setup / reset / validate:

* Require `NEXT_PUBLIC_SUPABASE_URL` host to contain `hvevqoltcwumcvxetxsf`
* Refuse `tzeqeywezmqslovpflqu` (production)
* Require `SUPABASE_SERVICE_ROLE_KEY` (local only; never committed)
* Refuse `GCE_ALLOW_E2E_FIXTURES=false`
* Refuse `NODE_ENV=production` unless `GCE_ALLOW_E2E_FIXTURES=true`

---

## 3. Commands

```bash
npm run e2e:fixtures:setup      # idempotent upsert
npm run e2e:fixtures:validate   # assert users + role_assignments
npm run e2e:fixtures:reset      # delete ONLY fixture_family=phase14b rows + fixture auth users
npm run test:e2e:auth           # Playwright setup + chromium-auth matrix
```

**Idempotency:** deterministic UUID keys + upsert; role_assignments for a fixture user are replaced per setup run.

**Cleanup safety:** reset filters on `metadata.fixture_family = phase14b` and known fixture emails / deterministic IDs. No broad `TRUNCATE` / `DELETE FROM users`.

---

## 4. Credentials / secrets

* Shared password: `E2E_FIXTURE_PASSWORD` written to **`.env.test.local`** (gitignored)
* Per-role `E2E_*_EMAIL` / `E2E_*_PASSWORD` aliases also written there
* `.env.example` lists **names only**
* Logs/reports must never print passwords or service-role keys
* Playwright storage states under **`.playwright/.auth/`** (gitignored)

Emails use `@gce-fixtures.test` and intentionally avoid the substring `admin` (legacy login hijack risk).

---

## 5. Identity matrix

| Key | Email | Roles | Primary workspace home |
|-----|-------|-------|------------------------|
| e2e_customer_01 | e2e.customer.01@… | platform_user | /customer/profile |
| e2e_customer_02 | e2e.customer.02@… | platform_user | IDOR peer |
| e2e_connect_member_01 | e2e.connect.member.01@… | circle_member | /dashboard/connect-member |
| e2e_connect_bdp_01 | … | connect_bdp | /dashboard/connect-bdp |
| e2e_marketplace_bdp_01 | … | marketplace_bdp | /dashboard/marketplace-bdp |
| e2e_venue_rep_01 | … | venue_representative | /venue |
| e2e_enterprise_client_01 | … | enterprise_client_representative | /dashboard/enterprise-client |
| e2e_enterprise_bdp_01 | … | enterprise_bdp | /dashboard/enterprise-bdp |
| e2e_enterprise_expert_01 | … | enterprise_platform_expert | /enterprise-expert/queue |
| e2e_finance_01 | e2e.finance.officer.01@… | finance_admin | /dashboard/finance |
| e2e_platform_ops_01 | … | platform_admin | /ops |
| e2e_compliance_01 | e2e.compliance.officer.01@… | compliance_admin | /dashboard/compliance |
| e2e_support_01 | e2e.support.officer.01@… | support_admin | /dashboard/support |
| e2e_opportunity_desk_01 | … | opportunity_desk | /dashboard/opportunity-desk |
| e2e_prm_01 | … | platform_relationship_manager (city scope) | /ops |
| e2e_multi_role_01 | … | platform_user + circle_member + connect_bdp | /settings |

**No Super Admin fixture.**

---

## 6. Domain fixtures (minimal)

Tagged `metadata.fixture_family = phase14b` where schema supports metadata:

* Organisations: venue partner + enterprise client
* Venue: `E2E Test Venue Bengaluru`
* Circle: `E2E Bengaluru Test Circle` (capacity 40, active_growth)
* Associate memberships (plan `associate`) for member + multi-role
* Event: `E2E Networking Evening` (future date, published)
* Offer: `E2E-OFFER-01` (active)

Enterprise project row may be skipped if required FKs (`client_id`, etc.) are not yet seeded — expert assignment still uses a deterministic project scope UUID for RBAC shell tests.

---

## 7. Playwright auth states

* Setup: `tests/e2e/auth.setup.ts`
* Helpers: `tests/e2e/auth/helpers.ts`
* Matrix: `tests/e2e/authenticated-matrix.spec.ts`
* Project: `chromium-auth` depends on `setup`

Storage files: `.playwright/.auth/{customer,connect-member,…}.json` — **do not commit**.

---

## 8. Limitations

* Deep lifecycle domain seeds (Lead Assist routing, Marketplace attribution economics, Finance ledger rows, Enterprise quote co-sign thresholds) are **partial** — prefer canonical service helpers in follow-up seeds
* Some partner roles intentionally have `finance.report.read` (BDP/Venue) — negative tests must not treat Finance overview as forbidden for those roles
* Finance overview still has an RSC edge defect when rendering the entitled dashboard with certain action-centre icon payloads (separate defect) — unauthorized customers now hard-redirect to `/unauthorized`

---

## 9. BG-32 closeout

Fixture setup + validation + authenticated role matrix login/home/negative routes executed successfully on gce-dev → **BG-32 CLOSED** for authenticated testability.
