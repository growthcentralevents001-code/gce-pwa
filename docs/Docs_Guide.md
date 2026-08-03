# GCE Documentation Guide

## Purpose

This document explains how Cursor AI should use the documentation contained in the `docs` folder.

Documentation layout:

```
docs/
├── README.md
├── Docs_Guide.md
├── Documentation_Manifest.md
├── core/
└── engineering/
```

- Master inventory: `docs/Documentation_Manifest.md`
- Core / business docs: `docs/core/`
- Engineering / expert docs: `docs/engineering/`
- Cursor Rules: `.cursor/rules/`

The GCE project contains complete business documentation and AI expert documentation.

Before writing any code, always identify the type of task and read the relevant documentation first.

Never make assumptions if documentation already exists.

---

# Founder Decisions and Canonical Documents (Always Prefer)

**Highest business authority:** `docs/founder-decisions/`

```
FD-001_Business_Model.md
FD-020_Financial_and_Wallet_Architecture.md
FD-021_Settlement_Engine.md
FD-022_Membership_Lifecycle.md
FD-023_RBAC_and_Permissions.md
FD-024_GCE_Connect_Circle_Lifecycle.md
FD-025_Connect_BDP_Commercial_and_Operating_Architecture.md
FD-026_GCE_Enterprise_Business_and_Operating_Architecture.md
FD-027_Membership_Commercial_and_Operating_Architecture.md
FD-028_Revenue_Recognition_and_Commercial_Architecture.md
FD-029_Commission_Engine_and_Stakeholder_Entitlement_Architecture.md
```

Then living canonical cores (summaries that defer to Founder Decisions):

```
02_Business_Model.md
35_Role_Taxonomy.md
36_Commercial_Constants.md
37_Revenue_Flow.md
38_Circle_Architecture.md
39_AI_Lead_Assist_Spec.md
```

Always write vertical names as **GCE Connect**, **GCE Marketplace**, and **GCE Enterprise**.
Approved BDP short names: **Connect BDP**, **Marketplace BDP**, **Enterprise BDP**.

For Connect BDP commercial and operating rules (Franchise Unit, fee, territory, Circle targets, commission, performance, expansion, reassignment), **FD-025** is the most specific Founder authority for operating rules. Living summaries: `06_CBDP.md`, `36_Commercial_Constants.md`. **FD-029** supersedes only FD-025’s prior “deferred finance inactive” position and defines the Connect BDP Commission-Recovery Finance Option.

For GCE Enterprise commercial and operating rules (Franchise Pack, client-based allocation, platform commission, Enterprise BDP commission, Platform Expert, fulfilment, multi-city, Vendor Opportunity Fee concept), **FD-026** is the most specific Founder authority. Living summaries: `08_Enterprise_BDP.md`, `36_Commercial_Constants.md`.

For GCE Connect Circle Membership commercial and operating rules (Associate/Core tiers, Tags, seats, Core eligibility, renewal, freeze, transfer, refund, rejoining), **FD-027** is the most specific Founder authority. Living summaries: `05_Memberships.md`, `36_Commercial_Constants.md`. Lifecycle timing concepts also remain in FD-022.

For revenue recognition, commercial classification, Marketplace/Enterprise/Connect revenue treatment, advertising, promotional visibility, sponsorships, franchise fees, refunds/reversals/taxes, reporting, audit, and multi-currency architecture, **FD-028** is the most specific Founder authority. Living summaries: `04_Revenue_Model.md`, `37_Revenue_Flow.md`, `21_Payments.md`, `36_Commercial_Constants.md`.

For commission calculation, stakeholder entitlement, BDP finance recovery, Marketplace revenue sharing (80/10/10), Venue Partner entitlement, attribution, Recoverable Balances, multi-currency commission, dashboards/statements, and audit, **FD-029** is the most specific Founder authority. Living summaries: `36_Commercial_Constants.md`, `37_Revenue_Flow.md`, `04_Revenue_Model.md`, `06_CBDP.md`, `07_MBDP.md`, `21_Payments.md`. FD-029 finalises Marketplace BDP commission and finance that were previously unresolved under FD-028.

Legacy role labels (ZBP, BDM, CBDP, MBDP, Affiliate, Franchisee, etc.) require explicit migration mapping in `35_Role_Taxonomy.md` — do not invent mappings. Under FD-028 / FD-029, **ZBP is removed** from the current commercial model; **Affiliate is future-only** (no active commission).

# Documentation Categories

The documentation is divided into two categories.

## Core Documentation

Contains:

- Business Logic
- Workflows
- Database Design
- Revenue Model
- Stakeholders
- Dashboards
- APIs
- Security
- Deployment

These documents define **what** the platform should do.

---

## AI Expert Documentation

Contains:

- UI Standards
- Software Architecture
- Database Standards
- Security Standards
- Performance Standards
- Component Standards
- Coding Rules

These documents define **how** the platform should be built.

---

# Documentation Reading Order

Always read documentation in the following order.

## Step 1

Read

```
33\_Cursor\_Coding\_Rules.md
```

This defines the global development rules.

---

## Step 2

Read the relevant business documentation.

Example:

Event Booking

↓

Business Rules

↓

Payments

↓

User Flows

---

## Step 3

Read

```
29\_Full\_Stack\_Architecture\_Expert.md
```

Understand the software architecture.

---

## Step 4

Read any required expert documents.

Examples

UI

↓

28\_UI\_UX\_Pro\_Max\_Expert.md

Database

↓

30\_Database\_Architecture\_Expert.md

Security

↓

31\_Security\_Best\_Practices\_Expert.md

Performance

↓

32\_Performance\_Optimization\_Expert.md

Components

↓

34\_Component\_Library.md

Animations

↓

27\_Frontend\_Animations.md

---

# Which Documentation Should Be Read?

## When Creating a New Page

Read:

```
33\_Cursor\_Coding\_Rules.md

29\_Full\_Stack\_Architecture\_Expert.md

28\_UI\_UX\_Pro\_Max\_Expert.md

34\_Component\_Library.md

27\_Frontend\_Animations.md
```

---

## When Creating a New Component

Read:

```
34\_Component\_Library.md

28\_UI\_UX\_Pro\_Max\_Expert.md

27\_Frontend\_Animations.md
```

Search the project first.

Reuse an existing component whenever possible.

---

## When Editing an Existing Component

Read:

```
34\_Component\_Library.md

28\_UI\_UX\_Pro\_Max\_Expert.md
```

Modify the existing component instead of creating another one.

---

## When Creating a Dashboard

Read:

```
12\_Dashboards.md

28\_UI\_UX\_Pro\_Max\_Expert.md

34\_Component\_Library.md

27\_Frontend\_Animations.md
```

---

## When Working on Authentication

Read:

```
16\_Authentication.md

17\_Security.md

31\_Security\_Best\_Practices\_Expert.md
```

---

## When Working on Payments

Read:

```
21\_Payments.md

17\_Security.md

31\_Security\_Best\_Practices\_Expert.md

30\_Database\_Architecture\_Expert.md
```

---

## When Working on APIs

Read:

```
15\_API\_Workflows.md

29\_Full\_Stack\_Architecture\_Expert.md

31\_Security\_Best\_Practices\_Expert.md
```

---

## When Working on the Database

Read:

```
11\_Database.md

30\_Database\_Architecture\_Expert.md
```

---

## When Working on AI Features

Read:

```
10\_AI\_Lead\_Assist.md

22\_AI\_Rules.md

29\_Full\_Stack\_Architecture\_Expert.md
```

---

## When Working on Business Logic

Read:

```
14\_Business\_Rules.md

Relevant Business Documentation
```

Business documentation is always the source of truth.

---

## When Working on Deployment

Read:

```
24\_Deployment\_Architecture.md

25\_Environment\_Configuration.md
```

---

## When Optimizing Performance

Read:

```
32\_Performance\_Optimization\_Expert.md

27\_Frontend\_Animations.md

29\_Full\_Stack\_Architecture\_Expert.md
```

---

## When Fixing Bugs

Read:

```
26\_Error\_Handling.md

33\_Cursor\_Coding\_Rules.md

Relevant Documentation
```

Understand the feature before changing it.

---

# Reusability Rules

Before creating anything new:

Search the existing project.

If a similar implementation exists:

- Reuse it.
- Extend it.
- Improve it.

Avoid duplication.

---

# Documentation Priority

Authority order (matches `AGENTS.md`):

1. Founder Decisions (`docs/founder-decisions/`)
2. Founder Approved Business Specification (if present)
3. Canonical core documentation (`docs/core/`)
4. Cursor Rules (`.cursor/rules/`)
5. Engineering documentation (`docs/engineering/`)
6. Application implementation

When lower-level documentation conflicts with a Founder Decision, update the lower-level document. **Never change a Founder Decision to match older documentation.**

Do not invent Unresolved / Proposed / Future / Pending items.


# Development Workflow

Every feature should follow this workflow.

Understand Requirement

↓

Read Documentation

↓

Inspect Existing Code

↓

Reuse Existing Components

↓

Design Solution

↓

Implement

↓

Test

↓

Performance Review

↓

Security Review

↓

Complete

---

# Before Writing Code

Always ask:

✓ What feature am I building?

✓ Which documentation applies?

✓ Which components already exist?

✓ Which APIs already exist?

✓ Which services already exist?

✓ Can I reuse existing code?

Only then begin coding.

---

# Before Creating New Files

Always check whether:

- Similar file already exists.
- Existing implementation can be extended.
- New file is actually necessary.

Avoid unnecessary files.

---

# Project Philosophy

The GCE platform should evolve as one unified software system.

Every page, component, API, database table, service, and workflow should feel like part of a single, well-designed architecture.

Consistency is more important than speed.

Reusability is more important than duplication.

Scalability is more important than shortcuts.

---

# Cursor AI Final Instructions

Whenever a task is requested:

1\. Determine the feature.
2\. Read the relevant documentation.
3\. Follow the architecture.
4\. Reuse existing code.
5\. Reuse existing components.
6\. Follow business rules.
7\. Follow UI standards.
8\. Follow security standards.
9\. Follow performance standards.
10\. Generate production-ready code.

Never skip documentation.

Documentation is the primary source of truth for the GCE platform.
