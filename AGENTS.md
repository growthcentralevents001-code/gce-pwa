<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# GCE Events — Agent Instructions (Master)

This repository is the Growth Central Events (GCE) Progressive Web App.

`AGENTS.md` is the master instruction file for Cursor and other coding agents working in this repo.

When framework behavior is uncertain, always consult the **latest official Next.js documentation** under `node_modules/next/dist/docs/` (and/or the published Next.js docs for this installed version). Do not rely on outdated Next.js knowledge from training data.

---

## Source of truth

All project **business logic**, product rules, architecture standards, and coding constraints live in:

- `docs/founder-decisions/` (**highest business authority**)
- `docs/` (project documentation, including `docs/core/`)
- `.cursor/rules/` (Cursor Rules)

Do **not** invent business rules, UI patterns, API contracts, or architecture when documentation already exists.

Always treat documentation as the source of truth instead of making assumptions.

---

## Documentation priority (mandatory)

Before generating or modifying code, always follow this order:

1. `docs/founder-decisions/` (Founder Decisions — highest business authority)
2. Founder Approved Business Specification (if present)
3. `docs/core/` (canonical living **business** documentation)
4. `docs/state-machines/`, `docs/data/`, `docs/security/`, `docs/compliance/` (backend / security truth)
5. `docs/phase-*/` and `docs/phase-2/adrs/` (approved feature architecture; ADRs are not Founder business law)
6. `docs/ui-ux/` (GCE UI/UX Architecture 2.0 — target UX for **existing and future** UI; must never override layers 1–5)
7. `design-system/MASTER.md` plus `lib/frontend/design-language.ts` / `motion.ts` (visual identity)
8. `.cursor/rules/*.mdc` (enforcement, including permanent UI rule `02_UI_Rules.mdc`)
9. `docs/engineering/`
10. `.cursor/skills/` (advisory craft; ui-ux-pro-max does not own IA/shells)
11. Official Next.js documentation (`node_modules/next/dist/docs/`)

If documents overlap, higher-priority sources win. **Never change a Founder Decision to match older documentation.** When a lower-level document conflicts with a higher layer, update the **lower-authority** document.

UI/UX Architecture 2.0 is **permanent, retroactive, and prospective**. Future feature/PDF work must enter through Architecture 2.0 shells and patterns automatically (`.cursor/rules/02_UI_Rules.mdc`). The Founder does not need to repeat UI governance in each prompt.

Anything marked Unresolved, Proposed, Future, Pending Founder Approval, Pending Technical Design, or Pending Legal/Accounting Review must remain unresolved — do not invent final rules. Technical ADRs are implementation defaults, not Founder business law (FD-039).

Program status: `docs/MASTER_IMPLEMENTATION_ROADMAP.md`. Non-routine open items: `docs/OPEN_DECISIONS_AND_VALIDATION_REGISTER.md`. Engineering backlog: `docs/IMPLEMENTATION_BACKLOG.md`.

---

## Project documentation architecture

### `docs/`

Project documentation root and index.

- `docs/README.md` — documentation index
- `docs/Docs_Guide.md` — how agents should read and apply docs
- `docs/Documentation_Manifest.md` — master inventory of the documentation system
- `docs/MASTER_IMPLEMENTATION_ROADMAP.md` — Phase 1–18 program status
- `docs/OPEN_DECISIONS_AND_VALIDATION_REGISTER.md` — Founder/Legal/Tax/Privacy open items
- `docs/IMPLEMENTATION_BACKLOG.md` — engineering backlog (P0–Future)
- `docs/phase-2/` … `docs/phase-18/` — implementation-readiness plans
- `docs/phase-2/adrs/` — technical ADRs
- `docs/state-machines/` · `docs/data/` · `docs/security/` · `docs/compliance/` — architecture support packs
- `docs/ui-ux/` — living UI/UX Architecture 2.0 (target shells, IA, patterns, roadmap)

### `docs/core/`

Core product and platform documentation: business model, stakeholders, workflows, database, APIs, auth, security, payments, dashboards, deployment, and related business rules.

These documents define **what** the platform must do.

#### Founder Decisions (highest business authority)

| Document | Owns |
|----------|------|
| `docs/founder-decisions/FD-001_Business_Model.md` | Foundational GCE business model |
| `docs/founder-decisions/FD-020_Financial_and_Wallet_Architecture.md` | Wallet + internal ledger principles |
| `docs/founder-decisions/FD-021_Settlement_Engine.md` | Settlement triggers and operations |
| `docs/founder-decisions/FD-022_Membership_Lifecycle.md` | Membership lifecycle |
| `docs/founder-decisions/FD-023_RBAC_and_Permissions.md` | RBAC, permissions, workspaces |
| `docs/founder-decisions/FD-024_GCE_Connect_Circle_Lifecycle.md` | GCE Connect Circle lifecycle |
| `docs/founder-decisions/FD-025_Connect_BDP_Commercial_and_Operating_Architecture.md` | Connect BDP commercial and operating architecture |
| `docs/founder-decisions/FD-026_GCE_Enterprise_Business_and_Operating_Architecture.md` | GCE Enterprise business and operating architecture |
| `docs/founder-decisions/FD-027_Membership_Commercial_and_Operating_Architecture.md` | GCE Connect Circle Membership commercial and operating architecture |
| `docs/founder-decisions/FD-028_Revenue_Recognition_and_Commercial_Architecture.md` | Revenue recognition and commercial architecture |
| `docs/founder-decisions/FD-029_Commission_Engine_and_Stakeholder_Entitlement_Architecture.md` | Commission Engine and stakeholder entitlement architecture |
| `docs/founder-decisions/FD-030_GCE_Connect_Circle_Architecture_and_Governance.md` | GCE Connect Circle internal architecture and governance |
| `docs/founder-decisions/FD-031_GCE_Connect_AI_Lead_Assist_Architecture.md` | GCE Connect AI Lead Assist / Lead Intelligence architecture |
| `docs/founder-decisions/FD-032_Phase_1_Authority_Status_Mapping_and_Supersession_Clarification.md` | Authority hierarchy, dual Circle status mapping, narrow supersessions, Phase 2 bounds |
| `docs/founder-decisions/FD-033_GCE_Marketplace_BDP_Commercial_and_Operating_Architecture.md` | Marketplace BDP commercial and operating architecture |
| `docs/founder-decisions/FD-034_Logixia_and_GCE_Corporate_Platform_Constitution.md` | Logixia Solutions Private Limited and GCE corporate/platform constitution |
| `docs/founder-decisions/FD-035_GCE_Identity_Role_Assignment_and_Workspace_Architecture.md` | GCE identity, role assignment, and workspace architecture |
| `docs/founder-decisions/FD-036_GCE_Membership_Attribution_Approval_and_Allocation_Authority.md` | Membership approval, activation vs Circle allocation, Connect BDP attribution, RM, waitlist, transfer, geographic routing |
| `docs/founder-decisions/FD-037_GCE_Marketplace_Transaction_Approval_and_Unattributed_Revenue_Rules.md` | Marketplace transaction families, offer/event approval, unattributed revenue (80/0/20), redemption, payout direction, cross-vertical boundaries |
| `docs/founder-decisions/FD-038_GCE_Enterprise_Cross_Vertical_Commercial_and_Approval_Rules.md` | Enterprise Client architecture, quotation/Finance co-sign, vendors, milestones, componentised settlement, no-double-commission |
| `docs/founder-decisions/FD-039_GCE_Phase_2_Commercial_Acceptance_and_Compliance_Direction.md` | Phase 2 commercial acceptance: Marketplace ticket MoR direction, BDP legal packaging, 48h cancellation, BDP pack payments, Aadhaar/KYC, AI legal drafting, Applicable Law Register, Phase 2 scope, pilot city, compliance gates |

#### Canonical core living documents

When roles, commercial numbers, revenue movement, GCE Connect circles, or AI Lead Assist conflict across narrative docs (and no more-specific Founder Decision applies), prefer these:

| Document | Owns |
|----------|------|
| `docs/core/02_Business_Model.md` | Living high-level business model |
| `docs/core/35_Role_Taxonomy.md` | Official role names, families, legacy mapping |
| `docs/core/36_Commercial_Constants.md` | Documented fees, commissions, limits, targets |
| `docs/core/37_Revenue_Flow.md` | Money-flow narrative across verticals |
| `docs/core/38_Circle_Architecture.md` | Living Circle architecture (lifecycle → FD-024; constitution/GB → FD-030; dual status mapping → FD-032) |
| `docs/core/39_AI_Lead_Assist_Spec.md` | AI Lead Assist / Lead Intelligence living summary (defers to FD-031) |

Always use the full vertical names: **GCE Connect**, **GCE Marketplace**, **GCE Enterprise**.

Approved BDP short names: **Connect BDP**, **Marketplace BDP**, **Enterprise BDP**.

### `docs/ui-ux/`

Living UI/UX Architecture 2.0 — **target** product UX for **existing and future** UI (shells, IA, workspace patterns, responsive rules, route audit). Must never override Founder Decisions, business rules, or backend/security truth. Enforced by `.cursor/rules/02_UI_Rules.mdc` (always on). Visual identity remains `design-system/MASTER.md`.

| Document | Owns |
|----------|------|
| `docs/ui-ux/GCE_UI_UX_ARCHITECTURE.md` | One platform, three verticals, PublicShell vs WorkspaceShell |
| `docs/ui-ux/GCE_INFORMATION_ARCHITECTURE.md` | Public vs authenticated trees |
| `docs/ui-ux/GCE_DESIGN_SYSTEM.md` | Composition against MASTER |
| `docs/ui-ux/GCE_WORKSPACE_PATTERNS.md` | Attention-first homes, vertical patterns |
| `docs/ui-ux/GCE_RESPONSIVE_ACCESSIBILITY.md` | 390 / 768 / 1366, a11y, PWA |
| `docs/ui-ux/GCE_UI_IMPLEMENTATION_ROADMAP.md` | KEEP / IMPROVE / REDESIGN / RETIRE |

### `docs/engineering/`

Engineering and AI-expert standards: frontend animations, UI/UX Pro Max usage, architecture, database engineering, security/performance practices, Cursor coding rules, and the component library.

These documents define **how** the platform must be built.

### `design-system/`

Persisted visual design tokens and system notes for this project (for example `design-system/MASTER.md`).

Use this when implementing or refining UI that must match the established GCE design system.

### `.cursor/rules/`

Always-on / scoped Cursor Rules (`.mdc`). These are mandatory development constraints for business, UI, backend, database, security, performance, and AI behavior.

### `.cursor/skills/`

Installed Cursor skills (including UI UX Pro Max and related design skills). Use these skill workflows and tools when the task matches their purpose. Do not relocate or rewrite skill packages unless explicitly asked.

---

## Mandatory engineering behaviors

1. **Reuse first**
   Inspect existing architecture, routes, components, hooks, libs, and patterns. Reuse and extend before creating anything new.

2. **Frontend UI**
   GCE UI/UX Architecture 2.0 (`docs/ui-ux/` + `.cursor/rules/02_UI_Rules.mdc`) is permanent governance for **existing canonical UI and all future UI**. Visual identity remains `design-system/MASTER.md`.
   Internally: understand the governed feature → correct vertical/workspace/shell → reuse Architecture 2.0 pattern → implement → check responsive/a11y, nav/routes, and inactive flags. Do not use RETIRE routes as templates. Do not recreate KPI-wall, Kanban-referral, settlement-first Enterprise, or generic Wallet patterns.
   ui-ux-pro-max / `docs/engineering/28_UI_UX_Pro_Max_Expert.md` are advisory craft under Architecture 2.0. `docs/core/13_UI_Guidelines.md` is historical only.
   If a feature materially changes navigation, workspaces, IA, shared UI patterns, responsive rules, or vertical UX, update the relevant `docs/ui-ux/` document in the same task. If architecture did not change, do not create documentation churn.

3. **Animations**
   Always follow Motion / animation documentation for frontend animations (`docs/engineering/27_Frontend_Animations.md` and related Cursor Rules). Prefer the project’s installed `motion` package patterns.

4. **Business logic**
   Implement only what is specified in documentation and Cursor Rules. If a requirement is missing, stop and ask rather than inventing behavior.

5. **Next.js**
   When App Router, rendering, routing, caching, or other framework details are unclear, read the official docs for the installed Next.js version before coding.

---

## High-level repository map

```text
app/                 Next.js App Router pages, layouts, API routes, app components
components/          Shared React components
context/             React context providers
lib/                 Shared libraries and clients
types/               TypeScript types
public/              Static assets and PWA files
scripts/             Deploy and ops scripts
supabase/            Database migrations and Supabase config
docs/                Project documentation (core + engineering)
docs/founder-decisions/ Founder Decisions (highest business authority)
docs/ui-ux/          Living UI/UX Architecture 2.0 (target UX)
design-system/       Design system source of truth for UI tokens
.cursor/rules/       Cursor Rules (.mdc)
.cursor/skills/      Cursor Skills (UI UX Pro Max, etc.)
```

Do not break this architecture. Do not create duplicate parallel structures without an explicit request.
