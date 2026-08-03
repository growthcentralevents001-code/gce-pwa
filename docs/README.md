# GCE Documentation Index

## Purpose

This folder contains the complete documentation for the Growth Central Events (GCE) platform.

It serves as the single source of truth for business logic, software architecture, UI/UX standards, database design, security, performance, and development guidelines.

Before implementing any feature, always consult the relevant documentation.

Never make assumptions if documentation already exists.

---

# Documentation Structure

The documentation lives under `docs/` with this layout:

```
docs/
├── README.md
├── Docs_Guide.md
├── Documentation_Manifest.md
├── core/
└── engineering/
```

1. Core Project Documentation — `docs/core/`
2. AI Expert Documentation — `docs/engineering/`

Cursor Rules live separately in `.cursor/rules/`.

---

# Core Project Documentation

Location: `docs/core/`

| File | Description |
|------|-------------|
| 00_Project_Architecture.md | Complete project architecture and technology overview |
| 01_GCE_Overview.md | GCE ecosystem, vision, platform introduction |
| 02_Business_Model.md | Complete GCE business model |
| 03_Stakeholders.md | Stakeholders and responsibilities |
| 04_Revenue_Model.md | Revenue recognition / sources (defers to FD-028) |
| 05_Memberships.md | Membership narrative (defers to FD-027; lifecycle also FD-022) |
| 06_CBDP.md | Connect BDP narrative (defers to FD-025; legacy filename CBDP) |
| 07_MBDP.md | Marketplace Business Development Partner |
| 08_Enterprise_BDP.md | Enterprise BDP narrative (defers to FD-026) |
| 09_Venue_Partner.md | Venue Partner workflow |
| 10_AI_Lead_Assist.md | AI Lead Assist workflow |
| 11_Database.md | Database schema and relationships |
| 12_Dashboards.md | Dashboard specifications |
| 13_UI_Guidelines.md | UI/UX guidelines |
| 14_Business_Rules.md | Complete business rules |
| 15_API_Workflows.md | Backend API workflows |
| 16_Authentication.md | Authentication workflow |
| 17_Security.md | Platform security documentation |
| 18_User_Flows.md | Complete user journeys |
| 19_Permissions_Roles.md | RBAC roles and permissions |
| 20_Notifications.md | Notification system |
| 21_Payments.md | Payment workflows |
| 22_AI_Rules.md | AI business rules |
| 23_Analytics_Reports.md | Analytics and reporting |
| 24_Deployment_Architecture.md | Deployment architecture |
| 25_Environment_Configuration.md | Environment configuration |
| 26_Error_Handling.md | Error handling strategy |
| 35_Role_Taxonomy.md | Canonical role taxonomy + legacy↔enum↔dashboard mapping |
| 36_Commercial_Constants.md | Canonical commercial fees, commissions, limits, targets |
| 37_Revenue_Flow.md | Canonical money-flow by vertical |
| 38_Circle_Architecture.md | Canonical GCE Connect circle architecture (FD-024 lifecycle + FD-030 governance) |
| 39_AI_Lead_Assist_Spec.md | Canonical AI Lead Assist / Lead Intelligence specification (FD-031) |

---

# Canonical Business Sources of Truth

## Founder Decisions (highest authority)

| File | Owns |
|------|------|
| `docs/founder-decisions/FD-001_Business_Model.md` | Foundational business model |
| `docs/founder-decisions/FD-020_Financial_and_Wallet_Architecture.md` | Wallet + internal ledgers |
| `docs/founder-decisions/FD-021_Settlement_Engine.md` | Settlement engine |
| `docs/founder-decisions/FD-022_Membership_Lifecycle.md` | Membership lifecycle |
| `docs/founder-decisions/FD-023_RBAC_and_Permissions.md` | RBAC and permissions |
| `docs/founder-decisions/FD-024_GCE_Connect_Circle_Lifecycle.md` | Circle lifecycle |
| `docs/founder-decisions/FD-025_Connect_BDP_Commercial_and_Operating_Architecture.md` | Connect BDP commercial and operating architecture |
| `docs/founder-decisions/FD-026_GCE_Enterprise_Business_and_Operating_Architecture.md` | GCE Enterprise business and operating architecture |
| `docs/founder-decisions/FD-027_Membership_Commercial_and_Operating_Architecture.md` | GCE Connect Circle Membership commercial and operating architecture |
| `docs/founder-decisions/FD-028_Revenue_Recognition_and_Commercial_Architecture.md` | Revenue recognition and commercial architecture |
| `docs/founder-decisions/FD-029_Commission_Engine_and_Stakeholder_Entitlement_Architecture.md` | Commission Engine and stakeholder entitlement architecture |
| `docs/founder-decisions/FD-030_GCE_Connect_Circle_Architecture_and_Governance.md` | GCE Connect Circle internal architecture and governance |
| `docs/founder-decisions/FD-031_GCE_Connect_AI_Lead_Assist_Architecture.md` | GCE Connect AI Lead Assist / Lead Intelligence architecture |

## Canonical core living documents

These living docs summarise and point to Founder Decisions. Narrative partner docs must reference them — and must defer to Founder Decisions on conflict:

| File | Owns |
|------|------|
| `02_Business_Model.md` | Living high-level business model |
| `35_Role_Taxonomy.md` | Official role names + legacy migration mapping |
| `36_Commercial_Constants.md` | Documented commercial numbers |
| `37_Revenue_Flow.md` | Money-flow narrative |
| `38_Circle_Architecture.md` | Living Circle architecture (lifecycle → FD-024; internal structure/governance → FD-030) |
| `39_AI_Lead_Assist_Spec.md` | AI Lead Assist / Lead Intelligence (defers to FD-031) |

Vertical naming: always **GCE Connect**, **GCE Marketplace**, **GCE Enterprise**.
Approved BDP short names: **Connect BDP**, **Marketplace BDP**, **Enterprise BDP**.

# AI Expert Documentation

Location: `docs/engineering/`

| File | Description |
|------|-------------|
| 27_Frontend_Animations.md | Motion animation standards |
| 28_UI_UX_Pro_Max_Expert.md | UI/UX design expert using UI UX Pro Max |
| 29_Full_Stack_Architecture_Expert.md | Software architecture standards |
| 30_Database_Architecture_Expert.md | Database engineering standards |
| 31_Security_Best_Practices_Expert.md | Enterprise security standards |
| 32_Performance_Optimization_Expert.md | Performance optimization standards |
| 33_Cursor_Coding_Rules.md | Global Cursor coding rules |
| 34_Component_Library.md | Shared reusable component library |

---

# Documentation Priority

Whenever implementing a feature, follow this priority order.

## 1. Cursor Coding Rules

Always start with:

```
33_Cursor_Coding_Rules.md
```

This document defines how Cursor should think before writing code.

---

## 2. Business Documentation

Understand the business requirements.

Read only the files related to the requested feature.

---

## 3. Architecture

Always follow:

```
29_Full_Stack_Architecture_Expert.md
```

---

## 4. UI

For any frontend work:

```
28_UI_UX_Pro_Max_Expert.md
```

---

## 5. Components

Before creating UI:

```
34_Component_Library.md
```

Reuse existing components whenever possible.

---

## 6. Animations

Whenever animations are needed:

```
27_Frontend_Animations.md
```

---

## 7. Database

Whenever database changes are required:

```
30_Database_Architecture_Expert.md
```

---

## 8. Security

Whenever authentication, APIs, payments or user data are involved:

```
31_Security_Best_Practices_Expert.md
```

---

## 9. Performance

Before completing any feature:

```
32_Performance_Optimization_Expert.md
```

---

# Development Workflow

Every feature should follow this workflow.

Business Requirement

↓

Business Documentation

↓

Architecture

↓

Database

↓

API

↓

Frontend

↓

Animations

↓

Testing

↓

Performance Review

↓

Security Review

↓

Deployment

---

# General Rules

Always:

- Read the relevant documentation before coding.
- Reuse existing code whenever possible.
- Reuse existing components.
- Follow the established architecture.
- Maintain consistent UI.
- Follow security best practices.
- Optimize performance.
- Write production-ready code.

Never:

- Duplicate components.
- Duplicate business logic.
- Ignore documentation.
- Break existing architecture.
- Introduce inconsistent UI.
- Ignore TypeScript errors.
- Ignore security.
- Ignore performance.

---

# Source of Truth

If two documents appear to overlap, use the following priority (also defined in `AGENTS.md`):

1. `docs/founder-decisions/` (Founder Decisions — highest business authority)
2. Founder Approved Business Specification (if present)
3. `docs/core/`
4. `.cursor/rules/*.mdc`
5. `docs/engineering/`
6. `design-system/MASTER.md`
7. `.cursor/skills/`
8. Official Next.js documentation

Never make assumptions if documentation already exists. Never invent Unresolved / Pending Founder Approval rules. Never change a Founder Decision to match older documentation.


# Long-Term Goal

The objective of this documentation is to ensure that every feature developed for the GCE platform is:

- Consistent
- Scalable
- Secure
- Performant
- Reusable
- Production Ready

Every contributor and every AI coding assistant should follow this documentation before making any changes to the project.
