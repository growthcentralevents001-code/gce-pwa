# Final GCE Page and Dashboard Inventory

| Field | Value |
|-------|-------|
| **Status** | Planning master list — redevelopment not started |
| **Date** | 2026-08-08 |
| **Design authority** | `design-system/MASTER.md` |
| **Workspaces** | Existing 12 keys only (no new keys without FD) |

### Column key

Status: `create` · `rebuild` · `keep-adapt` · `redirect` · `retire` · `verification`  
P: P0 pilot · P1 launch · P2 ops · P3 polish  
Batch: 0–10  
Skills: condensed codes — `ux`=ui-ux-pro-max · `sty`=ui-styling · `ds`=design-system · `br`=brand · `ban`=banner-design · `des`=design

---

## Roll-up counts (exact)

| Section | Full pages | Modal/flow-only | Dashboards counted in section |
|---------|----------:|----------------:|------------------------------:|
| A. Public Website | 12 | 0 | 0 |
| B. Authentication / Onboarding | 6 | 2 | 0 |
| C. Customer | 12 | 3 | 1 (`personal`) |
| D. Member / GCE Connect | 12 | 4 | 1 (`connect-member`) |
| E. Connect BDP | 10 | 2 | 1 (`connect-bdp`) |
| F. Marketplace BDP | 8 | 2 | 1 (`marketplace-bdp`) |
| G. Venue Partner | 12 | 3 | 1 (`venue`) |
| H. Enterprise Client | 10 | 2 | 1 (`enterprise-client`) |
| I. Enterprise BDP | 7 | 2 | 1 (`enterprise-bdp`) |
| J. Enterprise Platform Expert | 6 | 2 | 0 (uses `platform-ops` + `/ops/enterprise`) |
| K. Finance | 10 | 1 | 1 (`finance`) |
| L. Platform / Vertical Ops | 12 | 2 | 1 (`platform-ops`) + `/ops` shell |
| M. Compliance | 4 | 1 | 1 (`compliance`) |
| N. Support (+ Desk) | 5 | 2 | 1 (`support`) + desk under `opportunity-desk` |
| O. Settings / Profile | 6 | 1 | 0 |
| **TOTAL planned full pages** | **132** | **29** | **12 workspaces** |

| Metric | Count |
|--------|------:|
| Planned full page routes | **132** |
| Modal/flow-only screens | **29** |
| Canonical workspaces | **12** |
| Ops shell (not a 13th workspace key) | **1** (`/ops`) |
| Legacy pages/routes to retire | **40** |
| Redirects/adapters required | **28** |

> Count method: Founder-required surfaces mapped to unique final routes; duplicate legacy paths counted under redirects, not as additional product pages.

---

## A. Public Website (12)

| ID | Name | Route | Roles | Purpose | CTA | Backend | Components / shadcn | Skills/Tools | P | Batch | Status |
|----|------|-------|-------|---------|-----|---------|---------------------|--------------|---|-------|--------|
| PUB-01 | Home | `/` | public | Brand-first marketing | Explore events / Join | Public discovery read (marketplace published) | Hero, CTA Button, Card | ban, br, ux, ds; 21st hero search | P0 | 1 | rebuild |
| PUB-02 | About | `/about` | public | Brand story | Contact | Static/CMS-ready | Typography | br, sty | P1 | 1 | rebuild |
| PUB-03 | Contact | `/contact` | public | Support contact | Submit | Support signal / form API (**GAP** if none) | Form, Input, Textarea | ux, sty; shadcn Form | P1 | 1 | rebuild |
| PUB-04 | Terms | `/terms` | public | Legal | — | Static | Prose | br | P1 | 1 | rebuild |
| PUB-05 | Privacy | `/privacy` | public | Privacy policy | — | Static | Prose | br | P1 | 1 | rebuild |
| PUB-06 | For Partners | `/for-partners` | public | Vertical partner entry | Apply Connect/MBDP/Venue/Ent | Marketing links only | Cards, Tabs | br, ux, ds; 21st partner grids | P0 | 1 | rebuild |
| PUB-07 | Circle marketing | `/the-circle` | public | Explain Circles | Join membership | Static + link membership | Cards | br, ux | P1 | 1 | rebuild |
| PUB-08 | Memberships marketing | `/memberships` | public | Associate plan explainer | Start membership | Read membership_plans | Pricing Card (no invent %) | br, ux | P0 | 1 | rebuild |
| PUB-09 | Public Events SEO | `/events` | public | Indexable discovery | Open event | Same as CX discovery | EventCard | ux, ds; 21st event cards | P1 | 1–2 | rebuild |
| PUB-10 | Public Offers SEO | `/offers` | public | Indexable offers | Claim path | CX offers read | OfferCard | ux, ds | P1 | 1–2 | rebuild |
| PUB-11 | Public Venues | `/venues` | public | Venue browse | Venue detail | Marketplace venues published | VenueCard | ux, sty | P2 | 1–2 | rebuild |
| PUB-12 | Offline | `/offline` | any | PWA offline | Retry | — | EmptyState | sty | P1 | 10 | keep-adapt |

---

## B. Authentication / Onboarding (6 + 2 modal)

| ID | Name | Route | Roles | Purpose | CTA | Backend | Skills/Tools | P | Batch | Status |
|----|------|-------|-------|---------|-----|---------|--------------|---|-------|--------|
| AUTH-01 | Login | `/login` | public | Sign in | Login | Supabase Auth | ux, sty; shadcn Form | P0 | 1 | rebuild |
| AUTH-02 | Signup | `/signup` | public | Register | Create account | Auth + profile ensure | ux, br | P0 | 1 | rebuild |
| AUTH-03 | Forgot password | `/forgot-password` | public | Reset | Send link | Auth | ux | P0 | 1 | rebuild |
| AUTH-04 | Auth callback | `/auth/callback` | public | OAuth/code | Continue | Auth | — | P0 | 1 | rebuild |
| AUTH-05 | Partner pathway | `/apply/role` | auth | Choose partner track | Continue | Nav only (no ZBP/Affiliate) | ux, br | P0 | 1 | rebuild |
| AUTH-06 | Profile completion | `/onboarding/profile` | auth | Complete profile | Save | `/api/identity/me` | ux, sty | P0 | 1 | create |
| AUTH-M1 | OTP verify (modal) | (modal) | auth | Verify phone/email if used | Verify | Auth | ux | P1 | 1 | create |
| AUTH-M2 | Workspace first pick | (modal) | auth | First workspace | Enter | `/api/identity/workspaces` | ux | P0 | 0–1 | create |

---

## C. Customer (12 + 3 modal)

| ID | Name | Route | Roles | Workspace | Backend | P | Batch | Status |
|----|------|-------|-------|-----------|---------|---|-------|--------|
| CUS-01 | Customer home | `/customer` | user | personal | `/api/customer` | P0 | 2 | rebuild |
| CUS-02 | Events list | `/customer/events` | user | personal | `/api/customer` discover | P0 | 2 | rebuild |
| CUS-03 | Event detail | `/customer/events/[id]` | user | personal | `/api/customer` | P0 | 2 | rebuild |
| CUS-04 | Offers list | `/customer/offers` | user | personal | `/api/customer` | P0 | 2 | rebuild |
| CUS-05 | Offer detail | `/customer/offers/[id]` | user | personal | `/api/customer` | P0 | 2 | rebuild |
| CUS-06 | Book | `/customer/events/[id]/book` | user | personal | `/api/customer` book | P0 | 2 | create |
| CUS-07 | Payment/result | `/customer/bookings/[id]` | user | personal | CX + payment intent (flags OFF) | P0 | 2 | create |
| CUS-08 | Tickets | `/customer/tickets` | user | personal | `/api/customer` | P0 | 2 | rebuild |
| CUS-09 | Ticket QR | `/customer/tickets/[id]` | user | personal | ticket read | P0 | 2 | create |
| CUS-10 | Booking history | `/customer/bookings` | user | personal | CX | P1 | 2 | create |
| CUS-11 | Claims | `/customer/claims` | user | personal | CX claims | P1 | 2 | create |
| CUS-12 | Wishlist | `/customer/wishlist` | user | personal | migrate off legacy wishlist API | P2 | 2 | rebuild |
| CUS-M1 | Cancel booking | modal | user | personal | cancel API | P0 | 2 | create |
| CUS-M2 | Refund request | modal | user | personal | refund_request | P0 | 2 | create |
| CUS-M3 | Non-purchase reason | modal | user | personal | CX | P2 | 2 | create |

Redirects: `/booking/*` `/bookings` `/checkout` → customer routes.

---

## D. Member / GCE Connect (12 + 4 modal)

| ID | Name | Route | Roles | Workspace | Backend | P | Batch | Status |
|----|------|-------|-------|-----------|---------|---|-------|--------|
| MEM-01 | Connect home | `/dashboard/connect-member` | circle_member(+GB) | connect-member | `/api/connect/*` | P0 | 3 | rebuild |
| MEM-02 | Membership status | `/connect/membership` | member | connect-member | `/api/connect/memberships` | P0 | 3 | create |
| MEM-03 | Onboarding / KYC boundary | `/connect/onboarding` | member | connect-member | memberships | P0 | 3 | create |
| MEM-04 | Specialisation | `/connect/specialisation` | member | connect-member | memberships | P0 | 3 | create |
| MEM-05 | Tags | `/connect/tags` | member | connect-member | memberships | P0 | 3 | create |
| MEM-06 | My Circle | `/connect/circle` | member | connect-member | `/api/connect/circles` | P0 | 3 | create |
| MEM-07 | Waitlist | `/connect/waitlist` | member | connect-member | circles | P1 | 3 | create |
| MEM-08 | Transfer | `/connect/transfer` | member | connect-member | circles | P1 | 3 | create |
| MEM-09 | Governance | `/connect/governance` | GB roles | connect-member | circles appointments | P1 | 3 | create |
| MEM-10 | Lead Assist home | `/connect/leads` | member | connect-member | `/api/lead-assist` | P0 | 3 | create |
| MEM-11 | Sent leads | `/connect/leads/sent` | member | connect-member | lead-assist | P0 | 3 | create |
| MEM-12 | Received leads | `/connect/leads/received` | member | connect-member | lead-assist | P0 | 3 | create |
| MEM-M1 | Create lead | modal/flow | member | connect-member | lead-assist | P0 | 3 | create |
| MEM-M2 | Accept/decline | modal | member | connect-member | lead-assist | P0 | 3 | create |
| MEM-M3 | Contact reveal | modal | member | connect-member | lead-assist | P0 | 3 | create |
| MEM-M4 | Closed business | modal | member | connect-member | lead-assist | P1 | 3 | create |

---

## E. Connect BDP (10 + 2)

| ID | Route | Roles | Backend | P | Batch | Status |
|----|-------|-------|---------|---|-------|--------|
| CBDP-01 | `/dashboard/connect-bdp` | connect_bdp | `/api/connect/bdp` | P0 | 4 | rebuild |
| CBDP-02 | `/connect-bdp/apply` | user→bdp | bdp apply | P0 | 4 | create |
| CBDP-03 | `/connect-bdp/unit` | connect_bdp | units/package | P0 | 4 | create |
| CBDP-04 | `/connect-bdp/city` | connect_bdp | city assignment | P0 | 4 | create |
| CBDP-05 | `/connect-bdp/members` | connect_bdp | attribution | P0 | 4 | create |
| CBDP-06 | `/connect-bdp/circles` | connect_bdp | circle portfolio | P0 | 4 | create |
| CBDP-07 | `/connect-bdp/targets` | connect_bdp | targets/credits | P0 | 4 | create |
| CBDP-08 | `/connect-bdp/entitlements` | connect_bdp | finance read / bdp entitlements | P1 | 4 | create |
| CBDP-09 | `/connect-bdp/disputes` | connect_bdp | disputes | P1 | 4 | create |
| CBDP-10 | `/connect-bdp/handover` | connect_bdp | handover | P2 | 4 | create |
| CBDP-M1 | Attribution correct request | modal | ops/bdp | P1 | 4 | create |
| CBDP-M2 | Offline pack evidence | modal | flagged OFF | P2 | 4 | create |

---

## F. Marketplace BDP (8 + 2)

| ID | Route | Roles | Backend | P | Batch | Status |
|----|-------|-------|---------|---|-------|--------|
| MBDP-01 | `/dashboard/marketplace-bdp` | marketplace_bdp | `/api/marketplace/bdp` | P0 | 5 | rebuild |
| MBDP-02 | `/marketplace-bdp/apply` | user | mbdp apply | P0 | 5 | create |
| MBDP-03 | `/marketplace-bdp/units` | mbdp | units | P0 | 5 | create |
| MBDP-04 | `/marketplace-bdp/venues` | mbdp | portfolio | P0 | 5 | create |
| MBDP-05 | `/marketplace-bdp/attribution` | mbdp | attribution | P0 | 5 | create |
| MBDP-06 | `/marketplace-bdp/recommendations` | mbdp | event/offer recommend | P1 | 5 | create |
| MBDP-07 | `/marketplace-bdp/entitlements` | mbdp | finance read | P1 | 5 | create |
| MBDP-08 | `/marketplace-bdp/reassignment` | mbdp | handover | P2 | 5 | create |
| MBDP-M1 | Recommend event/offer | modal | marketplace | P1 | 5 | create |
| MBDP-M2 | Venue onboard assist | modal | marketplace | P1 | 5 | create |

---

## G. Venue Partner (12 + 3)

| ID | Route | Roles | Backend | P | Batch | Status |
|----|-------|-------|---------|---|-------|--------|
| VEN-01 | `/dashboard/venue` | venue_representative | marketplace + CX venue | P0 | 5 | rebuild |
| VEN-02 | `/venue/apply` | user | venue onboard (canonicalise API) | P0 | 5 | rebuild |
| VEN-03 | `/venue/profile` | venue | venue profile | P0 | 5 | create |
| VEN-04 | `/venue/events` | venue | marketplace events | P0 | 5 | rebuild |
| VEN-05 | `/venue/events/new` | venue | create event | P0 | 5 | rebuild |
| VEN-06 | `/venue/events/[id]` | venue | edit/submit | P0 | 5 | rebuild |
| VEN-07 | `/venue/offers` | venue | offer events | P0 | 5 | create |
| VEN-08 | `/venue/bookings` | venue | bookings | P0 | 5 | rebuild |
| VEN-09 | `/venue/check-in` | venue | CX check-in | P0 | 5 | create |
| VEN-10 | `/venue/redemptions` | venue | redeem | P0 | 5 | create |
| VEN-11 | `/venue/performance` | venue | rank snapshots display | P2 | 5 | create |
| VEN-12 | `/venue/entitlements` | venue | finance read | P1 | 5 | create |
| VEN-M1 | Create offer | modal/page | marketplace | P0 | 5 | create |
| VEN-M2 | Staff check-in scan | modal | CX | P0 | 5 | create |
| VEN-M3 | Reject/capacity | modal | marketplace | P1 | 5 | create |

Retire: `/partner-dashboard`, `/venue/plans` invent pricing.

---

## H–J. Enterprise (10 + 7 + 6)

### H. Client (10)

| ID | Route | Roles | P | Batch |
|----|-------|-------|---|-------|
| ECL-01 | `/dashboard/enterprise-client` | enterprise_client_representative | P0 | 6 |
| ECL-02 | `/enterprise/signup` | user | P0 | 6 |
| ECL-03 | `/enterprise/opportunities` | client | P0 | 6 |
| ECL-04 | `/enterprise/requirements` | client | P0 | 6 |
| ECL-05 | `/enterprise/proposals` | client | P0 | 6 |
| ECL-06 | `/enterprise/quotes` | client | P0 | 6 |
| ECL-07 | `/enterprise/projects` | client | P0 | 6 |
| ECL-08 | `/enterprise/projects/[id]` | client | P0 | 6 |
| ECL-09 | `/enterprise/vendors` | client (limited) | P1 | 6 |
| ECL-10 | `/enterprise/disputes` | client | P1 | 6 |

Backend: `/api/enterprise`. Finance co-sign is **status visibility** only for client.

### I. Enterprise BDP (7)

| ID | Route | P | Batch |
|----|-------|---|-------|
| EBDP-01 | `/dashboard/enterprise-bdp` | P0 | 6 |
| EBDP-02 | `/enterprise-bdp/apply` | P0 | 6 |
| EBDP-03 | `/enterprise-bdp/clients` | P0 | 6 |
| EBDP-04 | `/enterprise-bdp/pipeline` | P0 | 6 |
| EBDP-05 | `/enterprise-bdp/entitlements` | P1 | 6 |
| EBDP-06 | `/enterprise-bdp/handover` | P2 | 6 |
| EBDP-07 | `/enterprise-bdp/disputes` | P1 | 6 |

### J. Platform Expert (6)

Uses workspace `platform-ops` + `/ops/enterprise` + expert tools:

| ID | Route | P | Batch |
|----|-------|---|-------|
| EXP-01 | `/enterprise-expert` | P0 | 6 |
| EXP-02 | `/enterprise-expert/queue` | P0 | 6 |
| EXP-03 | `/enterprise-expert/requirements` | P0 | 6 |
| EXP-04 | `/enterprise-expert/proposals` | P0 | 6 |
| EXP-05 | `/enterprise-expert/projects` | P0 | 6 |
| EXP-06 | `/enterprise-expert/vendors` | P1 | 6 |

---

## K. Finance (10)

Workspace `finance` + deep links `/finance/*` and `/ops/finance`.

| ID | Route | P | Batch |
|----|-------|---|-------|
| FIN-01 | `/dashboard/finance` | P0 | 7 |
| FIN-02 | `/finance/revenue` | P0 | 7 |
| FIN-03 | `/finance/entitlements` | P0 | 7 |
| FIN-04 | `/finance/holds` | P0 | 7 |
| FIN-05 | `/finance/recovery` | P1 | 7 |
| FIN-06 | `/finance/settlements` | P0 | 7 |
| FIN-07 | `/finance/payout-readiness` | P1 | 7 |
| FIN-08 | `/finance/reconciliation` | P0 | 7 |
| FIN-09 | `/finance/refunds` | P0 | 7 |
| FIN-10 | `/finance/chargebacks` + offline | P1 | 7 |

All via `/api/finance` — **no ledger edit UI**. Execution flags OFF.

---

## L. Platform / Vertical Ops (12)

| ID | Route | Roles | P | Batch | Status |
|----|-------|-------|---|-------|--------|
| OPS-01 | `/ops` | ops roles | P0 | 8 | keep-adapt |
| OPS-02 | `/ops/approvals` | platform/finance/compliance/expert | P0 | 8 | keep-adapt |
| OPS-03 | `/ops/exceptions` | ops | P0 | 8 | keep-adapt |
| OPS-04 | `/ops/cases` | support/ops | P0 | 8 | keep-adapt |
| OPS-05 | `/ops/cases/[id]` | scoped | P0 | 8 | keep-adapt |
| OPS-06 | `/ops/connect` | connect ops scope | P0 | 8 | keep-adapt |
| OPS-07 | `/ops/marketplace` | marketplace ops | P0 | 8 | keep-adapt |
| OPS-08 | `/ops/enterprise` | enterprise ops | P0 | 8 | keep-adapt |
| OPS-09 | `/ops/finance` | finance/platform | P0 | 8 | keep-adapt |
| OPS-10 | `/ops/incidents` | platform/compliance | P0 | 8 | keep-adapt |
| OPS-11 | `/ops/security` | compliance/platform | P0 | 8 | keep-adapt |
| OPS-12 | `/dashboard/platform-ops` | platform_admin (+RM/PRM/Expert) | P0 | 8 | rebuild |

---

## M. Compliance (4)

| ID | Route | P | Batch |
|----|-------|---|-------|
| CMP-01 | `/dashboard/compliance` | P0 | 8 |
| CMP-02 | `/ops/compliance` | P0 | 8 |
| CMP-03 | `/ops/privacy` | P0 | 8 |
| CMP-04 | `/compliance/holds` | P1 | 8 |

---

## N. Support + Opportunity Desk (5)

| ID | Route | Workspace | P | Batch |
|----|-------|-----------|---|-------|
| SUP-01 | `/dashboard/support` | support | P0 | 8 |
| SUP-02 | `/ops/support` | support/platform | P0 | 8 |
| DESK-01 | `/dashboard/opportunity-desk` | opportunity-desk | P0 | 8 |
| DESK-02 | `/desk/queue` | opportunity-desk | P0 | 8 |
| DESK-03 | `/desk/leads/[id]` | opportunity-desk | P0 | 8 |

---

## O. Settings (6)

| ID | Route | P | Batch |
|----|-------|---|-------|
| SET-01 | `/settings/profile` | P0 | 9 |
| SET-02 | `/settings/organisation` | P1 | 9 |
| SET-03 | `/settings/workspaces` | P0 | 9 |
| SET-04 | `/settings/notifications` | P0 | 9 |
| SET-05 | `/settings/privacy` | P0 | 9 |
| SET-06 | `/settings/security` | P1 | 9 |

Also `/ops/notifications` for in-app ops center (Phase 12).

---

## Dashboards / workspaces (exact 12)

| Workspace key | Role unlock | Route | Nav focus | Widgets | Actions | API | Current | Requirement |
|---------------|-------------|-------|-----------|---------|---------|-----|---------|-------------|
| personal | platform_user | `/dashboard/personal` | Discover, tickets | Upcoming tickets, offers | Book, claim | customer | minimal | rebuild Batch 0/2 |
| connect-member | circle_member (+GB) | `/dashboard/connect-member` | Circle, leads | Seat, Tags, leads | Manage Tags, leads | connect, lead-assist | minimal | rebuild 0/3 |
| connect-bdp | connect_bdp | `/dashboard/connect-bdp` | Unit, circles | Targets, capacity | Attribute, handoff | connect/bdp | minimal | rebuild 0/4 |
| marketplace-bdp | marketplace_bdp | `/dashboard/marketplace-bdp` | Venues | Portfolio, entitlements | Recommend | marketplace/bdp | minimal | rebuild 0/5 |
| venue | venue_representative | `/dashboard/venue` | Events, check-in | Bookings today | Publish, check-in | marketplace + customer | partial legacy | rebuild 0/5 |
| enterprise-client | enterprise_client_representative | `/dashboard/enterprise-client` | Opp/projects | Pipeline | Accept quote | enterprise | missing | create 0/6 |
| enterprise-bdp | enterprise_bdp | `/dashboard/enterprise-bdp` | Clients | Pipeline | Attribute | enterprise | missing | create 0/6 |
| platform-ops | platform_admin (+RM/PRM/Expert) | `/dashboard/platform-ops` | Ops overview | Queues | Escalate to `/ops` | ops admin | minimal | rebuild 0/8 |
| opportunity-desk | opportunity_desk | `/dashboard/opportunity-desk` | Desk queue | Low-confidence | Assign | lead-assist | minimal | rebuild 0/8 |
| finance | finance_admin | `/dashboard/finance` | Money queues | Holds, recon | Review only | finance | minimal | rebuild 0/7 |
| compliance | compliance_admin | `/dashboard/compliance` | Holds/privacy | Risk | Hold/release | ops-governance | minimal | rebuild 0/8 |
| support | support_admin | `/dashboard/support` | Cases | Open/SLA | Create case | ops admin | minimal | rebuild 0/8 |

Plus **ops shell** `/ops` (role-aware) — not a workspace key.

---

## P0 / P1 / P2 / P3 summary

| Priority | Approx full pages | Intent |
|----------|------------------:|--------|
| P0 | ~78 | Pilot vertical spines + CX + core ops |
| P1 | ~36 | Launch completeness |
| P2 | ~14 | Operational polish |
| P3 | ~4 | Nice-to-have |

Inactive products (Affiliate/ZBP/paid Lead Assist/etc.) = **not** in P0–P1 product pages.
