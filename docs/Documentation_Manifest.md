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
├── founder-decisions/
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
| `docs/founder-decisions/` | Founder Decisions (highest business authority) |
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
| 04 | `04_Revenue_Model.md` | Revenue sources / recognition (defers to FD-028) |
| 05 | `05_Memberships.md` | Membership narrative (defers to FD-027; lifecycle also FD-022) |
| 06 | `06_CBDP.md` | Connect BDP narrative (defers to FD-025; legacy filename CBDP) |
| 07 | `07_MBDP.md` | Marketplace Business Development Partner |
| 08 | `08_Enterprise_BDP.md` | Enterprise BDP narrative (defers to FD-026) |
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
| 38 | `38_Circle_Architecture.md` | Canonical GCE Connect circle architecture (FD-024 lifecycle + FD-030 governance + FD-032 dual status mapping) |
| 39 | `39_AI_Lead_Assist_Spec.md` | Canonical AI Lead Assist / Lead Intelligence specification (FD-031) |

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
| `FD-025_Connect_BDP_Commercial_and_Operating_Architecture.md` | Connect BDP commercial and operating architecture |
| `FD-026_GCE_Enterprise_Business_and_Operating_Architecture.md` | GCE Enterprise business and operating architecture |
| `FD-027_Membership_Commercial_and_Operating_Architecture.md` | GCE Connect Circle Membership commercial and operating architecture |
| `FD-028_Revenue_Recognition_and_Commercial_Architecture.md` | Revenue recognition and commercial architecture |
| `FD-029_Commission_Engine_and_Stakeholder_Entitlement_Architecture.md` | Commission Engine and stakeholder entitlement architecture |
| `FD-030_GCE_Connect_Circle_Architecture_and_Governance.md` | GCE Connect Circle internal architecture and governance |
| `FD-031_GCE_Connect_AI_Lead_Assist_Architecture.md` | GCE Connect AI Lead Assist / Lead Intelligence architecture |
| `FD-032_Phase_1_Authority_Status_Mapping_and_Supersession_Clarification.md` | Authority hierarchy, dual Circle status mapping, narrow supersessions, Phase 2 bounds |
| `FD-033_GCE_Marketplace_BDP_Commercial_and_Operating_Architecture.md` | Marketplace BDP commercial and operating architecture |
| `FD-034_Logixia_and_GCE_Corporate_Platform_Constitution.md` | Logixia Solutions Private Limited and GCE corporate/platform constitution |
| `FD-035_GCE_Identity_Role_Assignment_and_Workspace_Architecture.md` | GCE identity, role assignment, and workspace architecture |
| `FD-036_GCE_Membership_Attribution_Approval_and_Allocation_Authority.md` | Membership approval, activation vs Circle allocation, Connect BDP attribution, RM, waitlist, transfer, geographic routing |
| `FD-037_GCE_Marketplace_Transaction_Approval_and_Unattributed_Revenue_Rules.md` | Marketplace transaction families, offer/event approval, unattributed revenue (80/0/20), redemption, payout direction, cross-vertical boundaries |
| `FD-038_GCE_Enterprise_Cross_Vertical_Commercial_and_Approval_Rules.md` | Enterprise Client architecture, quotation/Finance co-sign, vendors, milestones, componentised settlement, no-double-commission |
| `FD-039_GCE_Phase_2_Commercial_Acceptance_and_Compliance_Direction.md` | Phase 2 commercial acceptance: Marketplace ticket MoR direction, BDP legal packaging, 48h cancellation, BDP pack payments, Aadhaar/KYC, AI legal drafting, Applicable Law Register, Phase 2 scope, pilot city, compliance gates |

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
| Documentation Version | v1.12.0 |
| Last Updated | 2026-08-08 |
| Total Core Documents | 32 |
| Total Engineering Documents | 8 |
| Total Cursor Rules | 9 |
| Total Founder Decisions | 21 |
| Total Installed Skills | 7 |
| Total Documentation Files (`docs/`) | 64 |

Total documentation files under `docs/` = 32 core + 8 engineering + 21 Founder Decisions + `README.md` + `Docs_Guide.md` + `Documentation_Manifest.md` = 64.

## Changelog

### v1.12.0

- Indexed FD-039 (Phase 2 Commercial Acceptance and Compliance Direction)
- Synchronised living Markdown and Cursor business rules with Logixia intended Marketplace ticket MoR (implementation validation-gated), Commercial Licence / Independent Business Partner BDP packaging, 48-hour event cancellation default, online-default + controlled offline BDP pack payments, Aadhaar minimisation, AI first-draft legal + Applicable Law & Compliance Register, Phase 2 commercial spine (not Connect-only), pilot city undecided (does not block architecture), and future/inactive product boundaries

### v1.11.0

- Indexed FD-035 (Identity, Role Assignment, and Workspace Architecture), FD-036 (Membership Attribution, Approval, and Allocation Authority), FD-037 (Marketplace Transaction, Approval, and Unattributed Revenue Rules), and FD-038 (Enterprise Cross-Vertical Commercial and Approval Rules)
- Synchronised living Markdown and Cursor business rules with membership activation vs Circle allocation, organic/unattributed Connect membership, Marketplace 80/0/20 unattributed split, offer/event approval, Enterprise Client Representative separation, ₹5,00,000 Finance co-sign, project-specific milestones, managed vendors without mandatory login, and no-double-commission componentisation

### v1.10.0

- Indexed FD-032 (Phase 1 Authority, Status Mapping, and Supersession Clarification), FD-033 (Marketplace BDP Commercial and Operating Architecture), and FD-034 (Logixia and GCE Corporate Platform Constitution)
- Synchronised living Markdown and Cursor business rules with dual Circle status mapping, Marketplace BDP operating constitution, and Logixia–GCE corporate constitution
- Corrected stale Connect BDP deferred-finance-inactive wording in payments narrative

### v1.9.0

- Indexed FD-031 (GCE Connect AI Lead Assist Architecture) as highest authority for Lead Intelligence Engine, Opportunity Desk, Core Lead Rights, routing, monetisation principles, and phased launch
- Synchronised living Markdown with FD-031 (retired active ₹500/Rainmaker-only Stage-1 narrative; quality states; Circle-first; no pay-to-win; human control)

### v1.8.0

- Indexed FD-030 (GCE Connect Circle Architecture and Governance) as highest authority for Circle internal structure, Governing Body, verification, meetings, attendance, referrals, workshops, and seat ops
- Synchronised living Markdown with FD-030 (40-member capacity; 20 Provisional / 40 Fully Constituted; four GC Power Sectors; flexible seats; Circle Finance Coordinator; Phygital meetings; no automatic workshop commission)

### v1.7.0

- Indexed FD-029 (Commission Engine and Stakeholder Entitlement Architecture) as highest authority for commission, entitlement, BDP finance recovery, and Marketplace 80/10/10 sharing
- Synchronised living Markdown with FD-029 (Connect BDP financed package active; Marketplace BDP 10% + fee/finance finalised; Month 0 recovery; commission states)

### v1.6.0

- Indexed FD-028 (Revenue Recognition and Commercial Architecture) as highest authority for revenue recognition and commercial classification
- Synchronised living Markdown documentation with FD-028 (five financial concepts, Marketplace 80/20, Affiliate future-only, ZBP removed, advertising/sponsorship/promotional visibility, multi-currency, refunds/GST/attribution)

### v1.5.0

- Indexed FD-027 (Membership Commercial and Operating Architecture) as highest authority for GCE Connect Circle Membership commercial and operating rules
- Synchronised living Markdown documentation with FD-027 (Associate Tier launch, Tags, Core architecture, seat/renewal/freeze/transfer/refund rules)

### v1.4.0

- Indexed FD-026 (GCE Enterprise Business and Operating Architecture) as highest authority for GCE Enterprise
- Synchronised living Markdown documentation with FD-026 (Franchise Pack, client-based allocation, platform/BDP commission, Platform Expert, fulfilment, multi-city)

### v1.3.0

- Indexed FD-025 (Connect BDP Commercial and Operating Architecture) as highest authority for Connect BDP commercial and operating rules
- Synchronised living Markdown documentation with FD-025 (Franchise Unit, fee, commission, targets, territory, performance, expansion)

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
