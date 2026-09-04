# GCE UI/UX Architecture 2.0

| Field | Value |
|-------|-------|
| **Status** | Living **target** architecture |
| **Date** | 2026-09-04 |
| **Owns** | Target product UX model, shells, navigation systems, vertical UX frameworks, shared component hierarchy |
| **Does not own** | Business rules, commercial numbers, RBAC permissions, ledger semantics, visual token values |

This document is the **target UI/UX architectural framework** for Growth Central Events (GCE). Existing screens are evidence of what can be reused; they are not the ceiling.

It does **not** invent business behavior. Founder Decisions remain highest authority.

---

## Authority

UI/UX documentation must never override business rules.

```text
Founder Decisions / Business Rules
  → Backend + State Machines
  → Approved Feature Architecture (phase plans / ADRs)
  → UI/UX Architecture 2.0          ← this set (target UX)
  → Design System (MASTER + tokens)
  → Page Implementation
```

| Layer | Source of truth | UI may |
|-------|-----------------|--------|
| Business | `docs/founder-decisions/`, canonical `docs/core/` | Reflect, never redefine |
| Identity / workspaces | FD-035, `docs/core/35_Role_Taxonomy.md` | Surface workspaces that assignments actually grant |
| Workflows | State machines + architecture libs | Show governed statuses; not invent boards |
| Inactive commercial | FD-039 + `INACTIVE_FEATURE_FLAGS` | Hide or gate as inactive; never present as live |
| Visual identity | `design-system/MASTER.md`, `lib/frontend/design-language.ts`, `lib/frontend/motion.ts` | Compose tokens; do not fork palettes |
| Current pages | `app/`, `components/` | Reuse when they already match the target; otherwise migrate |

Sibling living documents in this folder:

| File | Owns |
|------|------|
| `GCE_INFORMATION_ARCHITECTURE.md` | Target trees, canonical routes, public vs authenticated IA |
| `GCE_DESIGN_SYSTEM.md` | How UI uses MASTER (does not replace MASTER) |
| `GCE_WORKSPACE_PATTERNS.md` | Shells, attention-first homes, vertical nav patterns |
| `GCE_RESPONSIVE_ACCESSIBILITY.md` | 390 / 768 / 1366, a11y, PWA |
| `GCE_UI_IMPLEMENTATION_ROADMAP.md` | KEEP / IMPROVE / REDESIGN / RETIRE + implementation order |

**Living-document rule:** any later feature that materially changes navigation, roles/workspaces, IA, shared UI patterns, responsive rules, or vertical UX must update the relevant file in this folder in the same task.

**Permanent Cursor enforcement:** `.cursor/rules/02_UI_Rules.mdc` (always on). Architecture 2.0 is retroactive (existing canonical UI is the migration target) and prospective (future features, including remaining PDFs, must enter through these shells and patterns). RETIRE routes are not templates.

---

## Target product model

GCE is **one platform, three verticals**, owned by Logixia Solutions Private Limited (FD-001 / FD-034).

```text
GCE
├── Connect      = Network + Workflow
├── Marketplace  = Discovery + Transaction
└── Enterprise   = Project + Milestone
```

Shared platform underneath (not a fourth vertical):

```text
Identity · role_assignments · workspace switching
notifications · documents · support · audit · analytics
RBAC / RLS · Ops · Finance
```

| Vertical | User-facing name | Target metaphor | Primary jobs |
|----------|------------------|-----------------|--------------|
| GCE Connect | GCE Connect | **Network + Workflow** | Membership, Circles, governed Lead Assist / referrals, Connect BDP operations |
| GCE Marketplace | GCE Marketplace | **Discovery + Transaction** | Catalogue of Events / Offers / Venues; book / claim; Venue operations |
| GCE Enterprise | GCE Enterprise | **Project + Milestone** | Opportunity → quote → **Project Command Center** → milestones |

Approved short names: **Connect BDP**, **Marketplace BDP**, **Enterprise BDP**. Never present sub-brands as equal to Logixia.

---

## Two shells (formal)

All pages belong to one of two chrome families. Do not invent a third marketing/app hybrid chrome.

### PublicShell

**Purpose:** Marketing, SEO discovery, and unauthenticated entry.

**Owns:** Brand mark, **public vertical navigation**, Log in / Join (or AccountMenu when signed in), marketing footer.

**Reuse now:** `components/app-shell/PublicShell.tsx` + `PUBLIC_NAV`.

**Must not:** Switch workspaces, show Ops/Finance/queues, imply live ticket money or BDP pack checkout, mix partner tools into the public header.

### WorkspaceShell

**Purpose:** Authenticated, assignment-scoped work.

**Owns:** Workspace switcher, vertical/workspace nav, notifications entry, account menu, attention-first home.

**Specializations of WorkspaceShell** (same family, different density):

| Specialization | Use | Reuse now |
|----------------|-----|-----------|
| Partner / role | Connect, BDP, Venue, Enterprise Client/BDP/Expert | `PartnerShell` |
| Customer activity | Bookings, tickets, claims | `CustomerShell` (mobile-first bottom nav) |
| Ops queue | Approvals, exceptions, cases | `OpsShell` |
| Finance ledger | Revenue, entitlements, recon | PartnerShell + finance nav |
| Settings | Profile, workspaces, privacy | `SettingsShell` |

**Must not:** Duplicate public vertical links as if they were roles. Public Connect / Marketplace / Enterprise remain PublicShell. Authenticated work uses workspace keys from FD-035.

Customer CX is an **activity specialization of WorkspaceShell**, not a fourth vertical.

---

## Two navigation systems (formal)

Keep these separate. Mixing them is an architecture defect.

| System | Lives in | Audience | Source |
|--------|----------|----------|--------|
| **Public vertical navigation** | PublicShell | Anyone | `lib/frontend/navigation/public.ts` (`PUBLIC_NAV`) |
| **Authenticated workspace switcher** | WorkspaceShell | Assigned roles only | FD-035 + `WORKSPACE_KEYS` + `WorkspaceSwitcher` |

Public vertical nav (target, and current):

Home · **Connect** · **Marketplace** · **Enterprise** · Events · Offers · For Partners · About · Log in / Join

Authenticated workspace keys (target = current `WORKSPACE_KEYS`):

`personal` · `connect-member` · `connect-bdp` · `marketplace-bdp` · `venue` · `enterprise-bdp` · `enterprise-client` · `platform-ops` · `opportunity-desk` · `finance` · `compliance` · `support`

The switcher lists **only** workspaces the user’s `role_assignments` actually grant. Never ZBP, Affiliate, BDM, Franchisee, Super Admin.

Inside a workspace, **vertical-specific navigation** is a sidebar/sheet derived from `workspaceNavSections(workspaceKey)` or Ops/Customer nav modules — not a second public header.

Details: `GCE_INFORMATION_ARCHITECTURE.md`, `GCE_WORKSPACE_PATTERNS.md`.

---

## Attention-first workspace homes (formal)

Every WorkspaceShell home answers:

> **What needs my attention today?**

Then: the next governed action, then in-flight work.

| Required | Forbidden as the page |
|----------|------------------------|
| Action queue / awaiting-me | Generic KPI wall |
| Real records (membership, booking, lead, project, approval) | Fake or vanity metrics |
| One primary next step | Three-card-everywhere |
| Vertical metaphor below | Generic SaaS Overview / Analytics / Reports |

KPI chips are allowed only as **triage counts** of real, permissioned items (e.g. “3 approvals waiting”). They are not the layout.

Current `/dashboard/[workspaceKey]` is a useful **data hook** (identity + domain reports) but is **not** the target composition. Target: `PartnerActionCenter`-style attention list first; reports secondary. See roadmap.

---

## Shared platform (formal)

These capabilities are **one product**, permission-gated, reused across verticals. They are not vertical home pages.

| Capability | Target UX | Canonical surface | Do not |
|------------|-----------|-------------------|--------|
| Identity | One User, many assignments | `/settings/profile`, onboarding | Separate logins per role |
| `role_assignments` | Switcher + settings workspaces | `WorkspaceSwitcher`, `/settings/workspaces` | Infer role from URL alone |
| Workspace switching | Header control, assignment-scoped | `WorkspaceSwitcher` | Public nav as switcher |
| Notifications | Inbox + prefs | Settings notifications, Ops notifications | Per-vertical duplicate inboxes as architecture |
| Documents | Attach to the record that owns them | Project / case / membership as applicable | A floating “Docs” SaaS module unless a screen actually has files |
| Support | Cases / signals | `/ops/support`, `/ops/cases`, support workspace | Mega-admin ticket dump |
| Audit | Timeline on the record + Ops audit | `AuditTimeline`, Finance/Ops | Decorative activity feeds |
| Analytics | Operational, permissioned | Venue performance, Connect BDP targets, Finance reports | Fake KPI dashboards |
| RBAC / RLS | Hide what cannot be done; server still authorizes | Shells filter nav; pages gate | UI-only security |
| Ops | Queues / review | `/ops/*` | Legacy `/admin/*` |
| Finance | Ledger / reconciliation | `/finance/*` | Settlement-first Enterprise home |

**No generic consumer Wallet** as a product surface. FD-020 is internal ledger architecture. `wallet_cashout` is inactive. Do not add Wallet to customer or partner nav unless a later Founder Decision productizes it.

---

## Vertical UX frameworks (target)

### 1. Connect — Network + Workflow

**Mental model:** People in Circles, membership lifecycle, and **governed** referral / Lead Assist flow.

**Not:** Trello, Kanban, CRM pipeline, “lead owner” board.

#### Connect referral / Lead Assist timeline (formal)

Target architecture for `/connect/leads`, `/connect/leads/[id]`, `/desk/queue`:

```text
Compose / submit
  → privacy-safe card in Sent or Received
  → governed actions: Accept | Decline | Clarify | Duplicate | Invalid | Collaborate
  → Opportunity Desk review (unpaid Stage 1)
  → outcome on a timeline
```

UI pattern: **status timeline + action strip**, not columns.

Reuse: `LeadComposer`, `LeadCard`, `LeadActions`, `FilteredLeadList`, `DeskReviewActions`, `presentLeadPrivacySafe`.

Must remain gated: paid Lead Assist, escrow, success fee, pay-to-receive, wallet monetization, contact-reveal paywalls (`INACTIVE_FEATURE_FLAGS` / Stage-1 unpaid flags).

Member network surfaces: membership, Circle, waitlist, transfer, specialisation, tags, governance (role-gated). Connect BDP: unit, city, members, circles, targets, entitlements (read), disputes, handover.

### 2. Marketplace — Discovery + Transaction

**Mental model:** Catalogue of **Events**, **Offers**, and **Venues**; then a transaction (book or claim) with Venue operations behind it.

#### Events / Offers / Venues architecture (formal)

| Object | Public discovery | Authenticated transaction | Partner operations |
|--------|------------------|---------------------------|--------------------|
| Event | `/events`, `/events/[id]` | `/customer/events/.../book`, tickets | `/venue/events` |
| Offer | `/offers`, `/offers/[id]` | `/customer/offers/[id]`, claims | `/venue/offers`, redemptions |
| Venue | `/venues`, `/venues/[id]` | Follows into events/offers | `/venue/profile`, Marketplace BDP portfolio |

**Desktop (1366):** catalogue may use **master–detail** (list + persistent detail).

**Mobile (390):** **list → full detail**. Do not squeeze a split pane.

`/marketplace` is the **vertical landing** (why Marketplace exists). Catalogue work happens on Events / Offers / Venues. Customer home is activity, not a second catalogue IA.

Reuse: `EventCard`, `OfferCard`, `DiscoveryFilters`, `TicketPassCard`, `CheckInPanel`, `RedemptionPanel`, `ClaimTimeline`.

Must remain gated: `marketplace_ticket_payments`, premium listings, Affiliate.

### 3. Enterprise — Project + Milestone

**Mental model:** **Project Command Center**, not a settlement dashboard.

#### Project Command Center (formal)

Target primary object: the **project**.

```text
Opportunity → requirement → proposal → quote (Finance co-sign where FD-038 requires)
  → Project Command Center
       ├── Milestones / components
       ├── Vendors (when in play)
       ├── Blockers / disputes
       └── Documents on the project
```

Settlement, recognition, and payout are **Finance** (`/finance/*`). Enterprise pages may show a read-only commercial summary; they must not lead with settlement batches.

Reuse: `OpportunityProjectCards`, `ProjectOpsCards`, `ProposalQuoteCards`, `/enterprise/projects/[id]`.

Target: make `/enterprise/projects/[id]` the command center; pipeline lists feed it. Enterprise BDP home is pipeline + clients, not Finance.

### 4. Customer — Activity / bookings / claims

**Mental model:** “My activity” — upcoming events, tickets, bookings, claims.

Target home (`/customer`): awaiting-me first (open claims, upcoming tickets), then discover.

Nav: Home · Events · Offers · Tickets · Profile; secondary Bookings, Wishlist, Claims.

Reuse: `CustomerShell`, `ActiveClaimCard`, `TicketPassCard`, `CxPageHeader`.

Do not: Wallet, live rank ladders, trust-rank as a gamified product if rank commercialisation is inactive. `trustRank` on personal dashboard is a **data leftover** — do not promote it as UX.

### 5. Venue — Operational workspace

**Mental model:** Today’s floor: events, check-in, bookings, redemptions, offer status.

Target home: today’s events + check-in queue + exceptions (failed scans, pending redemptions). Profile and entitlements are secondary.

Reuse: `/venue/(partner)/*`, `CheckInPanel`, `RedemptionPanel`, `PartnerActionCenter`.

Retire as product UX: `/dashboard/venue/events`, `/dashboard/venue/create-event`, `/venue/plans` (already redirected).

### 6. Ops — Queues / review

**Mental model:** Work items in queues. Hub = what needs review, not charts.

```text
Hub (attention)
  → Approvals | Exceptions | Cases | Incidents | Moderation
  → Vertical ops (Connect / Marketplace / Enterprise)
  → Compliance / Support / Desk / Security
```

Reuse: `OpsShell`, `ApprovalQueue`, `ExceptionQueue`, `OpsQueueCard`, `AuditTimeline`.

Retire: `/admin/*`, `/admin-events`, `/admin-partners` (redirects already in place).

### 7. Finance — Ledger / reconciliation

**Mental model:** Books, holds, entitlements, recon — not a founder KPI wall.

```text
Attention (holds, exceptions, unmatched recon)
  → Revenue (recognition posture; live posting remains flagged)
  → Entitlements / recovery
  → Settlement batches / payout readiness (execution gated)
  → Refunds / chargebacks / offline evidence
```

Reuse: `/finance/(workspace)/*`, `FinanceCards`, `FinanceVerticalFilter`.

Do not activate `settlement_execution`, `payout_execution`, `commission_posting_live`, or `wallet_cashout` in UI.

---

## Shared component hierarchy (target)

Compose downward. Do not add a parallel primitive set.

```text
design-system/MASTER.md
  └── lib/frontend/design-language.ts + motion.ts + typography.ts
        └── components/ui/*                    (shadcn primitives)
              └── components/states/*          (Empty, Error, FeatureGated, StatusBadge)
                    └── shells                 (PublicShell, PartnerShell, CustomerShell, OpsShell, SettingsShell)
                          └── domain cards / queues / timelines
                                └── page
```

| Layer | Examples | Rule |
|-------|----------|------|
| Tokens | `GCE_SURFACE`, `GCE_RADIUS`, `GCE_MOTION`, `GCE_BRAND` | No per-page hex / easing |
| Primitives | Button, Dialog, Sheet, Table, Tabs | Reuse before creating |
| States | `EmptyState`, `FeatureGated`, `StatusBadge` | Required for empty / inactive / status |
| Shells | Public vs Workspace specializations | One chrome family per page |
| Shared chrome | `WorkspaceSwitcher`, `AccountMenu`, `SkipToContent` | Singular switcher |
| Domain | `LeadCard`, `EventCard`, `OpsQueueCard`, `ProjectOpsCards` | Vertical metaphor; no rainbow |
| Avoid as architecture | `components/admin/*`, duplicate headers in `app/components/` | Legacy / marketing leftovers — do not extend |

Glass (`glassLight` / `glassElevated`) is a **highlight recipe**, not a page background. KPI cards are triage, not a family to spread.

---

## Responsive architecture (summary)

Mobile-first: **390 / 768 / 1366**. Full rules: `GCE_RESPONSIVE_ACCESSIBILITY.md`.

| Breakpoint | Shell | Catalogue | Tables |
|------------|-------|-----------|--------|
| 390 | Customer bottom nav; partner/ops Sheet | List → full detail | Stacked cards |
| 768 | Sheet or collapsible sidebar | List + optional preview | Cards or compact table |
| 1366 | Persistent sidebar | Marketplace **master–detail** allowed | Tables OK |

Motion stays tokenised and `prefers-reduced-motion` aware.

---

## Visual posture (summary)

Canonical values: MASTER. UI/UX 2.0 does not fork them.

- Primary `#EA580C` · secondary `#F97316`
- Foreground / text `#0F172A` (**not** dark-mode chrome)
- Warm cream `#FFF7ED`; dark **surface** true black `#000000` (FD-039 Layer A)
- UI type: **Poppins**. Brand mark only: **Righteous**
- Motion: fast 180ms, normal 300ms, entrance 350ms, hover `y: -3`, easeOut

Avoid: decorative blue; generic AI SaaS; bento everywhere; excessive glass; random gradients; fake KPIs; three-card-everywhere; meaningless animation.

---

## Reuse vs target (how to read the current product)

| Target piece | Reuse | Gap |
|--------------|-------|-----|
| PublicShell + vertical nav | Exists and matches | Keep; polish marketing composition |
| Workspace switcher | Exists, assignment-scoped | Keep |
| Workspace nav modules | Exist per key | Improve labels/order toward metaphors |
| Attention-first homes | `PartnerActionCenter` exists; customer home is closer | Generic `/dashboard/[workspaceKey]` still report-first — IMPROVE/REDESIGN |
| Connect Lead Assist | Cards + actions exist | Timeline-first detail; never Kanban |
| Marketplace catalogue | Cards + filters exist | Desktop master–detail not implemented; `/marketplace` is landing-only |
| Enterprise project | `/enterprise/projects/[id]` + milestone cards | Not yet a Command Center; BDP home can read commercial-first |
| Customer activity | `/customer/*` | Claims not in primary nav; personal dashboard duplicates CX |
| Venue ops | `/venue/(partner)/*` | Dual `/dashboard/venue/*` leftovers |
| Ops queues | `/ops/*` | Keep; hub IMPROVE toward attention |
| Finance ledger | `/finance/*` | Keep; do not live-activate payouts |
| Inactive / legacy | Redirects + quarantine lists | RETIRE remaining sources from product UX |

Classification of every canonical route: `GCE_UI_IMPLEMENTATION_ROADMAP.md`.

---

## Adoption (no big-bang redesign)

- **New UI** follows this target architecture.
- **Materially changed screens** adopt it in the same change.
- **Existing functional screens** may remain until their roadmap step.

Do not expose inactive payment, rank, Affiliate, ZBP, or wallet-cashout functionality as live.
