# Frontend Legacy Copy Replacement Register

| Field | Value |
|-------|-------|
| **Status** | **Batch 10 active-route audit closed** — remaining hits are retired/redirected sources |
| **Date** | 2026-08-11 |
| **Authority** | FD-032/035/039 + role taxonomy |

| Priority | File / page | Old copy / concept | Status |
|----------|-------------|--------------------|--------|
| P0 | `app/components/Header.tsx` | affiliate/zbp/bdm maps | Active Header cleaned in Batches 0–1; dirty WIP may remain unstaged |
| P0 | `app/apply/role/page.tsx` | ZBP CTA | **FIXED** Batch 1 |
| P0 | `app/affiliate/*` | Become Affiliate | **FIXED** redirects → `/for-partners` (Batch 10 config) |
| P0 | `app/admin/**` | Mega-admin / BDM / Affiliate | **RETIRED** routes → `/ops` (Batch 10); source LEGACY |
| P0 | `app/dashboard/bdm|zbp|affiliate` | Legacy dashboards | **RETIRED** via LEGACY_DASHBOARD_REDIRECTS |
| P0 | `/bdm-dashboard` `/zbp` | Public legacy | **RETIRED** → `/for-partners` |
| P0 | `/venue/plans` | Invent fees / cyan tiers | **RETIRED** → `/venue/apply` |
| P0 | `/partner-dashboard` | Mock Gold | **RETIRED** → `/dashboard/venue` |
| P1 | Public/for-partners invent rates | Brochure rates | Owned pages Batch 1; no reintroduce |
| P2 | API affiliate track | Referral economics | Inactive flag |

### Replacement language anchors

- **Connect BDP** not “Franchisee/BDM”  
- **Marketplace BDP** not “Affiliate” (Affiliate inactive)  
- **Associate membership** not Gold/Silver clubs  
- **Opportunity Desk** not “BDM leads admin”  
- **Platform Ops / Support** not mega Super Admin  
