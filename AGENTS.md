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

- `.cursor/rules/` (Cursor Rules)
- `docs/` (project documentation)

Do **not** invent business rules, UI patterns, API contracts, or architecture when documentation already exists.

Always treat documentation as the source of truth instead of making assumptions.

---

## Documentation priority (mandatory)

Before generating or modifying code, always follow this order:

1. `.cursor/rules/*.mdc`
2. `docs/core/`
3. `docs/engineering/`
4. `design-system/MASTER.md`
5. `.cursor/skills/`
6. Official Next.js documentation (`node_modules/next/dist/docs/`)

If documents overlap, higher-priority sources win.

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
design-system/       Design system source of truth for UI tokens
.cursor/rules/       Cursor Rules (.mdc)
.cursor/skills/      Cursor Skills (UI UX Pro Max, etc.)
```

Do not break this architecture. Do not create duplicate parallel structures without an explicit request.
