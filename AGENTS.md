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
3. `docs/core/` (canonical living documentation)
4. `.cursor/rules/*.mdc`
5. `docs/engineering/`
6. `design-system/MASTER.md`
7. `.cursor/skills/`
8. Official Next.js documentation (`node_modules/next/dist/docs/`)

If documents overlap, higher-priority sources win. **Never change a Founder Decision to match older documentation.** When a lower-level document conflicts with a Founder Decision, update the lower-level document.

Anything marked Unresolved, Proposed, Future, Pending Founder Approval, Pending Technical Design, or Pending Legal/Accounting Review must remain unresolved — do not invent final rules.

---

## Project documentation architecture

### `docs/`

Project documentation root and index.

- `docs/README.md` — documentation index
- `docs/Docs_Guide.md` — how agents should read and apply docs
- `docs/Documentation_Manifest.md` — master inventory of the documentation system

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

#### Canonical core living documents

When roles, commercial numbers, revenue movement, GCE Connect circles, or AI Lead Assist conflict across narrative docs (and no more-specific Founder Decision applies), prefer these:

| Document | Owns |
|----------|------|
| `docs/core/02_Business_Model.md` | Living high-level business model |
| `docs/core/35_Role_Taxonomy.md` | Official role names, families, legacy mapping |
| `docs/core/36_Commercial_Constants.md` | Documented fees, commissions, limits, targets |
| `docs/core/37_Revenue_Flow.md` | Money-flow narrative across verticals |
| `docs/core/38_Circle_Architecture.md` | Living Circle architecture (defers to FD-024) |
| `docs/core/39_AI_Lead_Assist_Spec.md` | AI Lead Assist lifecycle and fairness rules |

Always use the full vertical names: **GCE Connect**, **GCE Marketplace**, **GCE Enterprise**.

Approved BDP short names: **Connect BDP**, **Marketplace BDP**, **Enterprise BDP**.

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
   Always follow the **UI UX Pro Max** skill (under `.cursor/skills/`) when creating or modifying any frontend UI. Also follow `docs/engineering/28_UI_UX_Pro_Max_Expert.md`, `docs/core/13_UI_Guidelines.md`, and `design-system/MASTER.md` as applicable.

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
design-system/       Design system source of truth for UI tokens
.cursor/rules/       Cursor Rules (.mdc)
.cursor/skills/      Cursor Skills (UI UX Pro Max, etc.)
```

Do not break this architecture. Do not create duplicate parallel structures without an explicit request.
