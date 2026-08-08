# Frontend Legacy Copy Replacement Register

| Field | Value |
|-------|-------|
| **Status** | Audit list — **do not mass-replace** during planning |
| **Date** | 2026-08-08 |
| **Authority** | FD-032/035/039 + role taxonomy `docs/core/35_Role_Taxonomy.md` |

| Priority | File / page | Old copy / concept | Canonical replacement source |
|----------|-------------|--------------------|------------------------------|
| P0 | `app/components/Header.tsx` | Nav maps `affiliate`/`zbp`/`bdm` labels | Assignment workspaces only; FD-039 inactive |
| P0 | `app/apply/role/page.tsx` | “Zonal Business Partner (ZBP)” CTA | **Batch 1 done** — approved intents only; ZBP/Affiliate blocked |
| P0 | `app/affiliate/page.tsx` | “Become an Affiliate” | **Batch 1 done** — redirects to `/for-partners` |
| P0 | `app/admin/affiliates/page.tsx` | Affiliate applications admin | Retire with `/admin` |
| P0 | `app/admin/leads/page.tsx` | “Verify BDM lead submissions” | Opportunity Desk / Lead Assist (FD-031) |
| P0 | `app/dashboard/bdm/page.tsx` / `bdm-dashboard` | “BDM Dashboard” / Regional BDM | **Batch 1:** `/bdm-dashboard` → unauthorized; dashboard BDM later |
| P0 | `app/dashboard/zbp/page.tsx` / `admin/zbp` | ZBP referral tiers Basic/Gold/Platinum fees | Inactive ZBP commercial |
| P0 | `app/admin/dashboard/page.tsx` | Gold/Silver/Bronze/Free membership mixes; invent revenue | Associate membership + server metrics only |
| P0 | `app/for-partners/page.tsx` | Venue “Basic” plan “Commission: 20%” | Marketplace splits server-owned; no invent brochure rates |
| P1 | `app/venues/page.tsx` `/venues/[id]` | `tier \|\| "Basic"` | Venue partner status from marketplace |
| P1 | `app/partner-dashboard/page.tsx` | Mock Gold tier WeWork | Venue workspace |
| P1 | `app/admin/franchisees/page.tsx` | Franchisee approve/add | Connect/Enterprise BDP packs — not franchisee RBAC |
| P1 | `app/admin/ratings/page.tsx` | Stakeholder type BDM | Role taxonomy names |
| P1 | `app/admin/payouts/page.tsx` | Affiliate payout requests | Phase 9 settlement — gated |
| P2 | Signup affiliate track `api/affiliate/track` | Referral affiliate economics | Inactive unless future FD |
| P2 | Any ₹500 / paid Lead Assist copy if present | Paid Lead Assist | Stage 1 unpaid only FD-031/039 |

### Replacement language anchors

- **Connect BDP** not “Franchisee/BDM”  
- **Marketplace BDP** not “Affiliate” (Affiliate inactive)  
- **Associate membership** not Gold/Silver clubs  
- **Opportunity Desk** not “BDM leads admin”  
- **Platform Ops / Support** not mega Super Admin  
