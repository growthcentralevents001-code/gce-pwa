# GCE Information Architecture

| Field | Value |
|-------|-------|
| **Status** | Living **target** IA |
| **Date** | 2026-09-04 |
| **Owns** | Public vs authenticated trees, canonical route families, workspace IA |
| **Does not own** | Business rules, permission codes, visual tokens |
| **Supersedes for IA** | `docs/frontend/FINAL_GCE_INFORMATION_ARCHITECTURE.md`, `docs/frontend/FRONTEND_NAVIGATION_ARCHITECTURE.md` (those remain historical batch records) |

Target product tree (from `GCE_UI_UX_ARCHITECTURE.md`):

```text
GCE
├── Connect      = Network + Workflow
├── Marketplace  = Discovery + Transaction
└── Enterprise   = Project + Milestone
        + shared platform (identity, role_assignments, workspace switcher,
          notifications, documents, support, audit, analytics, RBAC/RLS, Ops, Finance)
```

Public **vertical navigation** and authenticated **workspace switching** are separate systems. Do not merge them.

---

## Public information architecture (PublicShell)

Canonical source: `lib/frontend/navigation/public.ts`.

```text
Public site
├── /                         Home (three verticals, one platform)
├── /connect                  GCE Connect (network + workflow story)
├── /marketplace              GCE Marketplace (discovery + transaction story)
├── /enterprise               GCE Enterprise (project + milestone story)
├── Catalogue (Marketplace objects)
│   ├── /events, /events/[id]
│   ├── /offers, /offers/[id]
│   └── /venues, /venues/[id]
├── /for-partners             Partner entry (Connect BDP / Marketplace BDP / Venue / Enterprise)
├── /memberships              Membership marketing
│   └── /memberships/apply
├── /how-membership-works
├── /how-referrals            Marketing explainer (not the Lead Assist product)
├── /about · /contact
├── /terms · /privacy
└── Auth
    ├── /login · /signup · /forgot-password
    ├── /onboarding/profile
    └── /apply/role           Approved role intents only
```

Rules:

- Public nav sells **verticals**, then catalogue objects (Events / Offers / Venues).
- `/marketplace` is the vertical landing. Catalogue work is Events / Offers / Venues.
- `/connect` and `/enterprise` are vertical landings, not workspaces.
- `/the-circle` and `/partners` are legacy aliases if still routed — do not add them to PUBLIC_NAV.
- Inactive partner programs (ZBP, Affiliate, BDM) must not appear. Existing `/zbp`, `/affiliate`, `/bdm-dashboard` redirect to `/for-partners`.

---

## Authenticated information architecture (WorkspaceShell)

One User. Many `role_assignments`. Switcher lists only granted `WORKSPACE_KEYS`.

```text
WorkspaceShell
├── Workspace switcher          (assignment-scoped)
├── Vertical / role nav         (sidebar or customer bottom nav)
├── Attention-first home
├── Shared: notifications, settings, support entry
└── Role work (below)
```

### Customer activity (`CustomerShell` specialization)

Canonical: `/customer/*`. Nav: `lib/frontend/navigation/customer.ts`.

```text
/customer                     Attention: tickets, bookings, claims
├── /customer/events          Discover Events (list → detail → book)
│   └── /customer/events/[id]
│       └── /customer/events/[id]/book
├── /customer/offers          Discover Offers (list → detail → claim)
│   └── /customer/offers/[id]
├── /customer/tickets         Passes / QR
│   └── /customer/tickets/[id]
├── /customer/bookings        Booking records
│   └── /customer/bookings/[id]
├── /customer/claims          Offer claims (target: visible from home + secondary nav)
├── /customer/wishlist
└── /customer/profile         Account shortcut → settings
```

`personal` workspace home should **deep-link into this tree**, not duplicate a second customer product.

### Connect — Network + Workflow

```text
connect-member
├── /dashboard/connect-member     Attention home
├── /connect/membership
├── /connect/circle
├── /connect/leads                Lead Assist hub (timeline, not Kanban)
│   ├── /connect/leads/sent
│   ├── /connect/leads/received
│   └── /connect/leads/[id]       Timeline + governed actions
├── /connect/waitlist
├── /connect/transfer
├── /connect/specialisation
├── /connect/tags
├── /connect/governance           Role-gated
└── /connect/onboarding
```

```text
connect-bdp
├── /dashboard/connect-bdp
├── /connect-bdp/apply
├── /connect-bdp/unit
├── /connect-bdp/city
├── /connect-bdp/members
├── /connect-bdp/circles
├── /connect-bdp/targets
├── /connect-bdp/entitlements     Read / dispute — not payout
├── /connect-bdp/disputes
└── /connect-bdp/handover
```

Opportunity Desk (shared platform, Connect workflow):

```text
opportunity-desk
├── /dashboard/opportunity-desk
├── /desk/queue
└── /desk/leads/[id]
```

### Marketplace — Discovery + Transaction (partner side)

```text
marketplace-bdp
├── /dashboard/marketplace-bdp
├── /marketplace-bdp/apply
├── /marketplace-bdp/units
├── /marketplace-bdp/venues
│   └── /marketplace-bdp/venues/[venueId]
├── /marketplace-bdp/attribution
├── /marketplace-bdp/recommendations
├── /marketplace-bdp/entitlements
└── /marketplace-bdp/reassignment
```

```text
venue
├── /dashboard/venue              Attention: today + check-in
├── /venue/apply                  Public/apply entry
├── /venue/profile
├── /venue/events
│   ├── /venue/events/new
│   └── /venue/events/[id]
├── /venue/offers
├── /venue/bookings
├── /venue/check-in
├── /venue/redemptions
├── /venue/performance
└── /venue/entitlements
```

Canonical Venue product is `/venue/(partner)/*`. `/dashboard/venue/events` and `/dashboard/venue/create-event` are leftovers.

### Enterprise — Project + Milestone

```text
enterprise-client
├── /dashboard/enterprise-client
├── /enterprise/opportunities
├── /enterprise/requirements
├── /enterprise/proposals
├── /enterprise/quotes
├── /enterprise/projects              Portfolio
│   └── /enterprise/projects/[id]     Project Command Center (target primary)
├── /enterprise/vendors
└── /enterprise/disputes
```

```text
enterprise-bdp
├── /dashboard/enterprise-bdp
├── /enterprise-bdp/apply
├── /enterprise-bdp/clients
├── /enterprise-bdp/pipeline
├── /enterprise-bdp/entitlements
├── /enterprise-bdp/handover
└── /enterprise-bdp/disputes
```

```text
enterprise-expert (via platform-ops assignment)
├── /enterprise-expert
├── /enterprise-expert/queue
├── /enterprise-expert/requirements
├── /enterprise-expert/proposals
├── /enterprise-expert/projects
└── /enterprise-expert/vendors
```

### Ops — Queues / review

Canonical: `/ops/*`. Nav: `lib/frontend/navigation/ops.ts`.

```text
platform-ops
├── /ops                          Hub (attention)
├── /ops/approvals
├── /ops/exceptions
├── /ops/cases · /ops/cases/[id]
├── /ops/incidents
├── /ops/moderation
├── /ops/connect · /ops/connect/circles · /ops/connect/meetings
├── /ops/marketplace · venues / offers / units
├── /ops/enterprise
├── /ops/finance                  Entry to Finance (not a second ledger)
├── /ops/compliance
├── /ops/support
├── /ops/notifications
├── /ops/security
└── /ops/privacy
```

`/admin`, `/admin/*`, `/admin-events`, `/admin-partners` → `/ops` (redirect). Not IA.

### Finance — Ledger / reconciliation

```text
finance
├── /dashboard/finance            Attention: holds / unmatched
├── /finance/revenue
├── /finance/entitlements
├── /finance/holds
├── /finance/recovery
├── /finance/settlements
├── /finance/payout-readiness     Readiness only; execution gated
├── /finance/reconciliation
├── /finance/refunds
├── /finance/chargebacks
└── /finance/offline
```

### Compliance / support / settings

```text
compliance     /dashboard/compliance · /compliance/holds
support        /dashboard/support · /ops/support · /ops/cases
settings       /settings · /settings/profile · /settings/workspaces
               /settings/notifications · /settings/privacy
               /settings/security · /settings/organisation
```

`/profile` redirects to `/settings/profile`. `/unauthorized` is the legacy/inactive landing.

---

## Redirects and aliases (not IA)

Implemented in `next.config.ts` and `proxy.ts`. Treat as compatibility, not navigation:

| From | To |
|------|-----|
| `/admin`, `/admin/*`, `/admin-events`, `/admin-partners` | `/ops` |
| `/booking/*`, `/checkout` | `/customer/events` |
| `/bookings` | `/customer/bookings` |
| `/wishlist` | `/customer/wishlist` |
| `/profile` | `/settings/profile` |
| `/venue/plans` | `/venue/apply` |
| `/zbp`, `/affiliate`, `/bdm-dashboard` | `/for-partners` |
| `/dashboard/user` | `/customer` |
| `/dashboard/franchisee`, `/dashboard/bdm` | `/for-partners` |
| `/partner-dashboard` | venue events (compat) |

Do not add these to any nav module.

---

## Mapping notes (target vs current)

| Target | Current reuse | IA change |
|--------|---------------|-----------|
| Public verticals first | `PUBLIC_NAV` already Connect / Marketplace / Enterprise | Keep |
| Catalogue = Events / Offers / Venues | Routes exist; desktop master–detail does not | Pattern, not new URLs |
| Customer claims in activity tree | Route exists; missing from primary/secondary nav | Add to secondary nav when that screen is touched |
| Project Command Center | `/enterprise/projects/[id]` exists | Make it the primary Enterprise object |
| No Wallet nav | No customer Wallet route (good) | Do not add. Legacy `/dashboard/member` still reads `user_wallets` — retire |
| Dual customer homes | `/customer` vs `/dashboard/personal` vs `/dashboard/[workspaceKey]` | Personal home should be a switcher + links into `/customer`, not a second CX |

When routes are added, renamed, or retired, update this file in the same task.
