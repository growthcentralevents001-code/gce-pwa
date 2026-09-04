# Frontend Navigation Architecture

> **Superseded as living navigation architecture.** Use `docs/ui-ux/GCE_INFORMATION_ARCHITECTURE.md` and `docs/ui-ux/GCE_WORKSPACE_PATTERNS.md`. This file is a planning snapshot.

| Field | Value |
|-------|-------|
| **Status** | Historical (superseded by UI/UX 2.0) |
| **Date** | 2026-08-08 |

## Public top nav

Home · Events · Offers · Memberships · For Partners · Login/Signup

Mobile: hamburger / Sheet drawer (shadcn).

## Customer (authenticated)

- **Mobile bottom nav:** Discover · Tickets · Account  
- Secondary: Offers, Claims, Wishlist  
- Skills: ui-ux-pro-max; 21st bottom nav reference `8343`

## Partner workspaces

Desktop **Sidebar** (shadcn Sidebar) + workspace switcher in header.  
Mobile: Sheet nav.

## Ops

Dense left nav: Hub, Approvals, Exceptions, Cases, Incidents, verticals, Compliance, Support.  
Desktop-first tables.

## Workspace switcher

Lists only `workspacesForAssignments` keys — never ZBP/Affiliate/BDM entries.
