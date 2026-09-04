# GCE Workspace Patterns

| Field | Value |
|-------|-------|
| **Status** | Living **target** patterns |
| **Date** | 2026-09-04 |
| **Owns** | PublicShell vs WorkspaceShell, attention-first homes, per-vertical nav and page patterns |
| **Does not own** | Business state machines, commercial numbers, MASTER tokens |

Read with `GCE_UI_UX_ARCHITECTURE.md` (framework) and `GCE_INFORMATION_ARCHITECTURE.md` (trees).

---

## Shells

### PublicShell

- **Component:** `components/app-shell/PublicShell.tsx`
- **Nav:** public vertical navigation only
- **When signed in:** Log in / Join → `AccountMenu` (does **not** become a workspace switcher)
- **Footer:** marketing `SiteFooter`

### WorkspaceShell (family)

Authenticated work. Specializations share: skip link, account, theme toggle, notifications entry, **workspace switcher** (except CustomerShell, which is activity-scoped).

| Specialization | Component | Nav | Density |
|----------------|-----------|-----|---------|
| Partner / role | `PartnerShell` | `workspaceNavSections(key)` sidebar / Sheet | Operational |
| Customer activity | `CustomerShell` | Bottom nav (5) + secondary | Mobile-first |
| Ops | `OpsShell` | `OPS_NAV_SECTIONS` | Dense queues |
| Finance | `PartnerShell` + finance sections | Ledger nav | Dense tables |
| Settings | `SettingsShell` | Settings sections | Forms |

**Workspace switcher:** `components/workspace/WorkspaceSwitcher.tsx` — singular, assignment-scoped, persists via `switchWorkspaceAction`. Never list quarantined keys (`WORKSPACE_LEGACY_QUARANTINE`).

---

## Attention-first home (all WorkspaceShell homes)

```text
1. Awaiting me          (actions, exceptions, approvals, tickets to use)
2. In flight            (open records in this workspace)
3. Status strip         (real assignment / membership / pack status)
4. Optional triage KPIs (counts of the above only)
5. Escape hatches       (settings, public catalogue, apply flows)
```

`PartnerActionCenter` + `PartnerStatusStrip` are the reference implementation. Extend them rather than inventing a new “dashboard widget grid”.

`/dashboard/[workspaceKey]` already loads the right domain reports. Target composition: **action list first**, reports as supporting detail — not the reverse.

**Do not** put a four-up `KpiCard` grid on every home. Counts that are already in the status strip should not be repeated as hero tiles. Optional triage is one compact row of **real** exception counts only.

**Do not** nest `PartnerShell` inside `app/dashboard/layout.tsx`. Map `/dashboard/{key}` in `workspaceFromPathname` instead.

### Customer desktop

Bottom nav and `max-w-lg` are for **390**. At **1366**, CustomerShell widens so Events/Offers can use master–detail. That is still the Customer activity specialization — not a fourth vertical and not PartnerShell.

---

## Vertical patterns

### Connect — Network + Workflow

**Member nav (target order):** Overview → Membership → My Circle → Lead Assist → Waitlist / Transfer → Specialisation / Tags → Governance (gated).

**Home:** membership/allocation status, Circle seat or waitlist, leads awaiting Accept/Decline/Clarify.

**Referral / Lead Assist pattern:**

- Hub: two lists (Sent / Received), filters, composer — **not** a board.
- Detail: privacy-safe header → **timeline of governed events** → action strip (`LeadActions`).
- Desk: same objects, review actions (`DeskReviewActions`).

Do not add drag-and-drop columns, lead scoring gamification, or paid reveal CTAs.

**Connect BDP home:** members needing allocation, Circle capacity, city/unit blockers. Entitlements are a **read** section, not the hero.

### Marketplace — Discovery + Transaction

**Public / customer catalogue**

| Viewport | Pattern |
|----------|---------|
| 390 | Filter sheet → card list → **full detail** → book/claim |
| 768 | Filters + list; detail as page |
| 1366 | **Master–detail** allowed: list pane + detail pane for Events or Offers |

Same `EventCard` / `OfferCard` on public SEO routes and `/customer/*`. Public detail continues the transaction in customer routes after auth.

**Marketplace BDP:** portfolio of venues, attribution gaps, recommendations. Not a second Venue ops console.

**Venue operations:** day view. Primary nav: Events, Check-in, Bookings, Offers, Redemptions. Performance and entitlements secondary. Check-in and redemption stay **queue + scan**, not analytics.

### Enterprise — Project + Milestone

**Client / expert primary object:** Project.

**Project Command Center pattern** (`/enterprise/projects/[id]`):

```text
Project header (name, client, status)
├── Attention (overdue milestones, pending co-sign, disputes)
├── Milestone / component timeline
├── Vendors in play
├── Quotes / proposals (links, not a second home)
└── Documents / audit on this project
```

Pipeline pages (`opportunities`, `requirements`, `proposals`, `quotes`) are **feeds into** the command center.

**Enterprise BDP:** clients + pipeline. Commercial entitlements read-only. Do not make settlement the first row.

### Customer — Activity

Bottom nav stays five items. Target: Home (attention) · Events · Offers · Tickets · Profile.

Home: upcoming ticket, open claim, next booking. Then a short discover strip.

Claims belong in the activity architecture (home + secondary). Do not add Wallet. Do not productize rank.

### Ops — Queues / review

Hub: oldest / SLA-risk items across approvals, exceptions, cases — not a chart wall.

Queue pages: filter (`OpsQueueFilter`) + `OpsQueueCard` / table on desktop + stacked cards on mobile. Detail: record + `AuditTimeline` + permitted actions.

Vertical ops (`/ops/connect`, `/ops/marketplace`, `/ops/enterprise`) are **scoped queues**, not separate products.

### Finance — Ledger / reconciliation

Home: holds, unmatched recon, chargebacks/refunds needing review.

Then ledger screens as **tables with vertical filter** (`FinanceVerticalFilter`). Payout screens are **readiness**. Copy must not say money has moved if `payout_execution` / `settlement_execution` are off.

---

## Shared platform patterns

| Capability | Pattern |
|------------|---------|
| Notifications | Bell in shell → inbox; prefs in Settings. One inbox model. |
| Support | Customer/partner: entry to case. Ops: `/ops/cases`. |
| Documents | Attach to membership, project, case, or venue — not a global drive. |
| Audit | Timeline on the record; Ops/Finance may have search. |
| Feature flags | `FeatureGated` for inactive money/rank. Filter nav via `filterNavItems` / `INACTIVE_FEATURE_FLAGS`. |
| Access denied | `AccessDenied` / `/unauthorized` — never empty admin. |

---

## Anti-patterns

- Public vertical links duplicated as partner “Overview” replacements
- KPI walls and three-card heroes on workspace homes
- Kanban for Connect referrals
- Settlement-first Enterprise
- Generic Wallet
- Live Affiliate / ZBP / Super Admin / ticket checkout / wallet cash-out
- New shell components under `app/components/` or `components/admin/`

When nav modules or home composition change, update this file in the same task.
