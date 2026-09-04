# Final GCE Information Architecture

> **Superseded as living IA.** Use `docs/ui-ux/GCE_INFORMATION_ARCHITECTURE.md` and `docs/ui-ux/GCE_UI_UX_ARCHITECTURE.md`. This file is a Batch 14A planning snapshot (2026-08-08).

| Field | Value |
|-------|-------|
| **Status** | Historical (superseded by UI/UX 2.0) |
| **Date** | 2026-08-08 |
| **Authority** | FD-001 / FD-034 / FD-035 / vertical FDs; Phase 14A |

---

## Corporate / product hierarchy

```text
Logixia Solutions Private Limited
└── Growth Central Events (GCE)
    ├── GCE Connect          (membership, Circles, Connect BDP, Lead Assist Stage 1)
    ├── GCE Marketplace      (Venues, Events, Offers, Marketplace BDP, customer CX)
    └── GCE Enterprise       (Clients, Enterprise BDP, Platform Expert, projects)
```

Sub-brands never float as equal to Logixia. Inactive: Affiliate, ZBP commercial, paid Lead Assist, wallet cash-out, vendor self-serve portal.

---

## Public information architecture

```text
Public site
├── Home (brand hero)
├── Discover → Events | Offers | Venues
├── Memberships / Circles (marketing)
├── For Partners → Connect BDP | Marketplace BDP | Venue | Enterprise
├── About | Contact
└── Legal → Terms | Privacy
```

Customer authenticated IA continues under `/customer/*` (same Event/Offer truth as public SEO shells).

---

## User-facing trees

### Customer / personal

```text
personal workspace
├── Discover Events/Offers
├── Bookings & Tickets (QR)
├── Claims
├── Wishlist (optional)
└── Settings
```

### Member (GCE Connect)

```text
connect-member
├── Membership status / Tags
├── My Circle / Waitlist / Transfer
├── Governance (role-gated)
├── Lead Assist (send/receive/outcomes)
└── Settings
```

### Connect BDP

```text
connect-bdp
├── Unit & city
├── Members & attribution
├── Circles portfolio & targets
├── Entitlements (read) / disputes / handover
```

### Marketplace BDP / Venue

```text
marketplace-bdp → venues portfolio, attribution, recommendations, entitlements
venue → profile, events, offers, bookings, check-in, redemptions, entitlements
```

### Enterprise

```text
enterprise-client → opportunities → requirements → quotes → projects → milestones
enterprise-bdp → clients, pipeline, entitlements
enterprise-expert (via platform-ops) → structure, propose, vendors, oversight
```

### Finance / Ops / Support

```text
finance → entitlements, holds, settlements, recon, refunds (no ledger edit)
platform-ops → overview → deep link /ops/*
compliance → holds, privacy, risk
support → cases
opportunity-desk → Assist Desk queue
/ops → vertical consoles, approvals, exceptions, cases, incidents
```

---

## Navigation architecture (conceptual)

| Shell | Pattern | Audience |
|-------|---------|----------|
| Public | Top nav + mobile drawer | Anonymous |
| Customer | Top + **mobile bottom nav** (Discover / Tickets / Account) | Mobile-first |
| Partner workspaces | Desktop **sidebar** + mobile drawer | Tablet/desktop |
| Ops | Desktop sidebar dense + table-first | Desktop-dominant |
| Workspace switcher | Header control; lists assignment-derived workspaces only | All authenticated |

Breadcrumbs: desktop partner/ops only. No mega-nav mixing inactive ZBP/Affiliate/BDM.

---

## Brand visual hierarchy

Per MASTER.md: Righteous brand mark → Poppins headlines/body → Primary orange CTA → Blue accent sparingly → Avoid purple glow and newspaper AI clichés.
