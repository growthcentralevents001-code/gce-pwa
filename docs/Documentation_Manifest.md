# GCE Documentation Manifest

## Documentation Overview

This file is the master inventory of the GCE documentation system.

The Growth Central Events (GCE) PWA uses a layered documentation architecture so Cursor and human contributors can find the correct source of truth before writing code:

- **Cursor Rules** (`.cursor/rules/`) enforce mandatory development constraints.
- **Core docs** (`docs/core/`) define product and business behavior (**what** to build).
- **Engineering docs** (`docs/engineering/`) define implementation standards (**how** to build).
- **Design system** (`design-system/`) stores persisted visual tokens for UI consistency.
- **Cursor Skills** (`.cursor/skills/`) provide specialized agent workflows (especially UI UX Pro Max).
- **AGENTS.md** is the repository master instruction file that points agents at this architecture.

Never invent business rules, UI patterns, API contracts, or architecture when documentation already exists.

## Documentation Structure

```text
docs/
├── README.md
├── Docs_Guide.md
├── Documentation_Manifest.md
├── core/
└── engineering/

.cursor/rules/
.cursor/skills/
design-system/
AGENTS.md
```

| Path | Purpose |
|------|---------|
| `docs/` | Documentation root and indexes |
| `docs/core/` | Core product / business documentation |
| `docs/engineering/` | Engineering and AI-expert standards |
| `.cursor/rules/` | Mandatory Cursor Rules (`.mdc`) |
| `.cursor/skills/` | Installed Cursor Skills |
| `design-system/` | Persisted design tokens (`MASTER.md`) |

## Core Documentation Files

Location: `docs/core/`

| File Number | File Name | Purpose |
|-------------|-----------|---------|
| 00 | `00_Project_Architecture.md` | Complete project architecture and technology overview |
| 01 | `01_GCE_Overview.md` | GCE ecosystem, vision, platform introduction |
| 02 | `02_Business_Model.md` | Complete GCE business model |
| 03 | `03_Stakeholders.md` | Stakeholders and responsibilities |
| 04 | `04_Revenue_Model.md` | Revenue sources, commissions and earnings |
| 05 | `05_Memberships.md` | Membership plans and benefits |
| 06 | `06_CBDP.md` | Connect Business Development Partner |
| 07 | `07_MBDP.md` | Marketplace Business Development Partner |
| 08 | `08_Enterprise_BDP.md` | Enterprise Business Development Partner |
| 09 | `09_Venue_Partner.md` | Venue Partner workflow |
| 10 | `10_AI_Lead_Assist.md` | AI Lead Assist workflow |
| 11 | `11_Database.md` | Database schema and relationships |
| 12 | `12_Dashboards.md` | Dashboard specifications |
| 13 | `13_UI_Guidelines.md` | UI/UX guidelines |
| 14 | `14_Business_Rules.md` | Complete business rules |
| 15 | `15_API_Workflows.md` | Backend API workflows |
| 16 | `16_Authentication.md` | Authentication workflow |
| 17 | `17_Security.md` | Platform security documentation |
| 18 | `18_User_Flows.md` | Complete user journeys |
| 19 | `19_Permissions_Roles.md` | RBAC roles and permissions |
| 20 | `20_Notifications.md` | Notification system |
| 21 | `21_Payments.md` | Payment workflows |
| 22 | `22_AI_Rules.md` | AI business rules |
| 23 | `23_Analytics_Reports.md` | Analytics and reporting |
| 24 | `24_Deployment_Architecture.md` | Deployment architecture |
| 25 | `25_Environment_Configuration.md` | Environment configuration |
| 26 | `26_Error_Handling.md` | Error handling strategy |
| 35 | `35_Role_Taxonomy.md` | Canonical role taxonomy + Role Mapping (legacy → current → DB enum → dashboard → permissions) |
| 36 | `36_Commercial_Constants.md` | Canonical commercial constants (fees, commissions, limits, targets) |
| 37 | `37_Revenue_Flow.md` | Canonical revenue flows across GCE Connect / GCE Marketplace / GCE Enterprise |
| 38 | `38_Circle_Architecture.md` | Canonical GCE Connect circle architecture |
| 39 | `39_AI_Lead_Assist_Spec.md` | Canonical AI Lead Assist specification |

## Numbering note

Core documents `35`–`39` are **canonical business sources of truth** added after the original `00`–`26` set. Engineering docs remain `27`–`34`. Prefer the canonical docs when narrative files disagree on roles, numbers, circles, revenue flow, or AI Lead Assist.

## Engineering Documentation Files

Location: `docs/engineering/`

| File Number | File Name | Purpose |
|-------------|-----------|---------|
| 27 | `27_Frontend_Animations.md` | Motion animation standards for frontend UI |
| 28 | `28_UI_UX_Pro_Max_Expert.md` | UI/UX design expert using UI UX Pro Max |
| 29 | `29_Full_Stack_Architecture_Expert.md` | Software architecture standards |
| 30 | `30_Database_Architecture_Expert.md` | Database engineering standards |
| 31 | `31_Security_Best_Practices_Expert.md` | Enterprise security standards |
| 32 | `32_Performance_Optimization_Expert.md` | Performance optimization standards |
| 33 | `33_Cursor_Coding_Rules.md` | Global Cursor coding rules |
| 34 | `34_Component_Library.md` | Shared reusable component library |

## Cursor Rule Files

Location: `.cursor/rules/`

| File Name | Purpose |
|-----------|---------|
| `00_Global_Rules.mdc` | Global development rules for the GCE platform. Always follow these rules before writing, modifying, or deleting any code. |
| `01_Business_Rules.mdc` | Business rules for the GCE platform. Always consult the appropriate business documentation before implementing or modifying any business-related feature. |
| `02_UI_Rules.mdc` | UI and UX development rules. Follow the GCE Design System, Component Library, Motion animations, and UI UX Pro Max standards whenever creating or modifying frontend code. |
| `03_Backend_Rules.mdc` | Backend development rules. Follow backend architecture, API workflows, authentication, database, and business documentation whenever implementing backend logic. |
| `04_Database_Rules.mdc` | Database development rules. Follow documented database architecture, schema, relationships, security, and Supabase best practices. |
| `05_Security_Rules.mdc` | Security rules. Enforce authentication, authorization, data protection, validation, and security best practices across the stack. |
| `06_Performance_Rules.mdc` | Performance optimization rules for frontend, backend, database, APIs, and infrastructure. |
| `07_AI_Rules.mdc` | AI development rules. Follow AI architecture, Lead Assist workflows, business rules, and AI decision logic for AI-powered functionality. |
| `08_21st_Dev_MCP.mdc` | 21st.dev MCP is search-only inspiration; no generate/install without explicit approval. |

## Cursor Skills

Location: `.cursor/skills/`

| Skill | Purpose |
|-------|---------|
| `ui-ux-pro-max` | Primary UI/UX design intelligence skill. Use when creating or modifying frontend UI. |
| `ui-styling` | Tailwind / shadcn / styling references and helpers for UI implementation. |
| `design` | Comprehensive design skill (brand identity, logos, CIP, banners, icons, slides). |
| `design-system` | Design tokens, component specs, and token validation tooling. |
| `brand` | Brand voice, visual identity, messaging, and brand consistency. |
| `banner-design` | Banner sizing and style guidance for promotional surfaces. |
| `slides` | HTML presentation / slide strategies and templates. |

### Motion (animation guidance)

Motion is **not** a Cursor skill folder. Frontend animation guidance comes from:

- npm package: `motion`
- Engineering doc: `docs/engineering/27_Frontend_Animations.md`
- UI Rules: `.cursor/rules/02_UI_Rules.mdc`

Always follow the Motion documentation when implementing frontend animations.

## Documentation Priority

Cursor must always follow this order before generating or modifying code:

1. `docs/founder-decisions/` (Founder Decisions — highest business authority)
2. Founder Approved Business Specification (if present)
3. `docs/core/`
4. `.cursor/rules/`
5. `docs/engineering/`
6. `design-system/MASTER.md`
7. `.cursor/skills/`
8. Official Next.js Documentation (`node_modules/next/dist/docs/`)

If documents overlap, higher-priority sources win. This matches `AGENTS.md`. **Never amend a Founder Decision to match older docs.**

## Founder Decisions

Location: `docs/founder-decisions/`

| File | Owns |
|------|------|
| `FD-001_Business_Model.md` | Foundational GCE business model |
| `FD-020_Financial_and_Wallet_Architecture.md` | Wallet + internal ledger principles |
| `FD-021_Settlement_Engine.md` | Settlement triggers and operations |
| `FD-022_Membership_Lifecycle.md` | Membership lifecycle |
| `FD-023_RBAC_and_Permissions.md` | RBAC, permissions, workspaces |
| `FD-024_GCE_Connect_Circle_Lifecycle.md` | GCE Connect Circle lifecycle |

## Development Workflow

Before writing code, Cursor should follow this workflow:

```text
Read AGENTS.md
↓
Read applicable Founder Decisions (docs/founder-decisions/)
↓
Read Core Documentation (docs/core/)
↓
Read Cursor Rules (.cursor/rules/)
↓
Read Engineering Documentation (docs/engineering/)
↓
Read Design System (design-system/MASTER.md)
↓
Use Installed Skills (.cursor/skills/ — especially UI UX Pro Max for UI)
↓
Inspect existing architecture and reuse components
↓
Generate Code
```

Additional mandatory behaviors:

- Treat documentation as the source of truth; do not invent missing business logic.
- Reuse existing architecture and components before creating anything new.
- For frontend UI, always follow the UI UX Pro Max skill.
- For animations, always follow Motion documentation (`27_Frontend_Animations.md` + `motion` package).

## Version Information

| Field | Value |
|-------|-------|
| Documentation Version | v1.2.0 |
| Last Updated | 2026-08-01 |
| Total Core Documents | 32 |
| Total Engineering Documents | 8 |
| Total Cursor Rules | 9 |
| Total Founder Decisions | 6 |
| Total Installed Skills | 7 |
| Total Documentation Files (`docs/`) | 49 |

Total documentation files under `docs/` = 32 core + 8 engineering + 6 Founder Decisions + `README.md` + `Docs_Guide.md` + `Documentation_Manifest.md` = 49.

## Changelog

### v1.2.0

- Indexed six Founder Decisions (FD-001, FD-020–FD-024) as highest business authority
- Synchronised core Markdown documentation with Founder Decisions (membership, Circles, RBAC, wallet/settlement, terminology)
- Updated documentation priority order to place Founder Decisions first (aligned with `AGENTS.md`)

### v1.1.0

- Added canonical core docs: `35_Role_Taxonomy.md`, `36_Commercial_Constants.md`, `37_Revenue_Flow.md`, `38_Circle_Architecture.md`, `39_AI_Lead_Assist_Spec.md`
- Deduplicated commercial numbers and AI Lead Assist rules into canonical sources; partner docs now reference them
- Documented Role Mapping (legacy ZBP/BDM/etc. → current → DB enum → dashboard → permissions)
- Standardized vertical naming: GCE Connect, GCE Marketplace, GCE Enterprise
- Listed `08_21st_Dev_MCP.mdc` in Cursor Rules inventory
- Updated indexes (`README.md`, `Docs_Guide.md`, `AGENTS.md`, business/AI Cursor Rules)

### v1.0.0

- Initial Documentation Architecture
- 27 Core Documents
- 8 Engineering Documents
- 8 Cursor Rules
- AGENTS.md integrated
- Documentation_Manifest.md created
- Overview filename normalized to `01_GCE_Overview.md`
- Documentation system finalized

## Maintenance Rules

1. **Add core docs** under `docs/core/` with the next sequential number and update `docs/README.md` plus this Manifest.
2. **Add engineering docs** under `docs/engineering/` with the next sequential number and update indexes + this Manifest.
3. **Add Cursor Rules** as `.mdc` files under `.cursor/rules/` with clear `description` frontmatter; list them here.
4. **Do not** duplicate documents across folders.
5. **Do not** invent parallel documentation roots outside `docs/`, `.cursor/rules/`, `.cursor/skills/`, and `design-system/`.
6. When changing priority or architecture, update `AGENTS.md`, `docs/README.md`, `docs/Docs_Guide.md`, and this Manifest together.
7. Bump **Documentation Version** and append a Changelog entry for every structural documentation change.
8. Keep filenames stable and free of trailing spaces.
