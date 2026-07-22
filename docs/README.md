\# GCE Documentation Index

\#\# Purpose

This folder contains the complete documentation for the Growth Central Events (GCE) platform.

It serves as the single source of truth for business logic, software architecture, UI/UX standards, database design, security, performance, and development guidelines.

Before implementing any feature, always consult the relevant documentation.

Never make assumptions if documentation already exists.

\---

\# Documentation Structure

The documentation lives under \`docs/\` with this layout:

\`\`\`
docs/
├── README.md
├── Docs_Guide.md
├── Documentation_Manifest.md
├── core/
└── engineering/
\`\`\`

1\. Core Project Documentation — \`docs/core/\`  
2\. AI Expert Documentation — \`docs/engineering/\`

Cursor Rules live separately in \`.cursor/rules/\`.

\---

\# Core Project Documentation

Location: \`docs/core/\`

| File | Description |  
|------|-------------|  
| 00\_Project\_Architecture.md | Complete project architecture and technology overview |  
| 01\_GCE\_Overview.md | GCE ecosystem, vision, platform introduction |  
| 02\_Business\_Model.md | Complete GCE business model |  
| 03\_Stakeholders.md | Stakeholders and responsibilities |  
| 04\_Revenue\_Model.md | Revenue sources, commissions and earnings |  
| 05\_Memberships.md | Membership plans and benefits |  
| 06\_CBDP.md | Connect Business Development Partner |  
| 07\_MBDP.md | Marketplace Business Development Partner |  
| 08\_Enterprise\_BDP.md | Enterprise Business Development Partner |  
| 09\_Venue\_Partner.md | Venue Partner workflow |  
| 10\_AI\_Lead\_Assist.md | AI Lead Assist workflow |  
| 11\_Database.md | Database schema and relationships |  
| 12\_Dashboards.md | Dashboard specifications |  
| 13\_UI\_Guidelines.md | UI/UX guidelines |  
| 14\_Business\_Rules.md | Complete business rules |  
| 15\_API\_Workflows.md | Backend API workflows |  
| 16\_Authentication.md | Authentication workflow |  
| 17\_Security.md | Platform security documentation |  
| 18\_User\_Flows.md | Complete user journeys |  
| 19\_Permissions\_Roles.md | RBAC roles and permissions |  
| 20\_Notifications.md | Notification system |  
| 21\_Payments.md | Payment workflows |  
| 22\_AI\_Rules.md | AI business rules |  
| 23\_Analytics\_Reports.md | Analytics and reporting |  
| 24\_Deployment\_Architecture.md | Deployment architecture |  
| 25\_Environment\_Configuration.md | Environment configuration |  
| 26\_Error\_Handling.md | Error handling strategy |

\---

\# AI Expert Documentation

Location: \`docs/engineering/\`

| File | Description |  
|------|-------------|  
| 27\_Frontend\_Animations.md | Motion animation standards |  
| 28\_UI\_UX\_Pro\_Max\_Expert.md | UI/UX design expert using UI UX Pro Max |  
| 29\_Full\_Stack\_Architecture\_Expert.md | Software architecture standards |  
| 30\_Database\_Architecture\_Expert.md | Database engineering standards |  
| 31\_Security\_Best\_Practices\_Expert.md | Enterprise security standards |  
| 32\_Performance\_Optimization\_Expert.md | Performance optimization standards |  
| 33\_Cursor\_Coding\_Rules.md | Global Cursor coding rules |  
| 34\_Component\_Library.md | Shared reusable component library |

\---

\# Documentation Priority

Whenever implementing a feature, follow this priority order.

\#\# 1\. Cursor Coding Rules

Always start with:

\`\`\`  
33\_Cursor\_Coding\_Rules.md  
\`\`\`

This document defines how Cursor should think before writing code.

\---

\#\# 2\. Business Documentation

Understand the business requirements.

Read only the files related to the requested feature.

\---

\#\# 3\. Architecture

Always follow:

\`\`\`  
29\_Full\_Stack\_Architecture\_Expert.md  
\`\`\`

\---

\#\# 4\. UI

For any frontend work:

\`\`\`  
28\_UI\_UX\_Pro\_Max\_Expert.md  
\`\`\`

\---

\#\# 5\. Components

Before creating UI:

\`\`\`  
34\_Component\_Library.md  
\`\`\`

Reuse existing components whenever possible.

\---

\#\# 6\. Animations

Whenever animations are needed:

\`\`\`  
27\_Frontend\_Animations.md  
\`\`\`

\---

\#\# 7\. Database

Whenever database changes are required:

\`\`\`  
30\_Database\_Architecture\_Expert.md  
\`\`\`

\---

\#\# 8\. Security

Whenever authentication, APIs, payments or user data are involved:

\`\`\`  
31\_Security\_Best\_Practices\_Expert.md  
\`\`\`

\---

\#\# 9\. Performance

Before completing any feature:

\`\`\`  
32\_Performance\_Optimization\_Expert.md  
\`\`\`

\---

\# Development Workflow

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

\---

\# General Rules

Always:

\- Read the relevant documentation before coding.  
\- Reuse existing code whenever possible.  
\- Reuse existing components.  
\- Follow the established architecture.  
\- Maintain consistent UI.  
\- Follow security best practices.  
\- Optimize performance.  
\- Write production-ready code.

Never:

\- Duplicate components.  
\- Duplicate business logic.  
\- Ignore documentation.  
\- Break existing architecture.  
\- Introduce inconsistent UI.  
\- Ignore TypeScript errors.  
\- Ignore security.  
\- Ignore performance.

\---

\# Source of Truth

If two documents appear to overlap, use the following priority (also defined in \`AGENTS.md\`):

1\. \`.cursor/rules/*.mdc\`  
2\. \`docs/core/\`  
3\. \`docs/engineering/\`  
4\. \`design-system/MASTER.md\`  
5\. \`.cursor/skills/\`  
6\. Official Next.js documentation

Never make assumptions if documentation already exists.

\---

\# Long-Term Goal

The objective of this documentation is to ensure that every feature developed for the GCE platform is:

\- Consistent  
\- Scalable  
\- Secure  
\- Performant  
\- Reusable  
\- Production Ready

Every contributor and every AI coding assistant should follow this documentation before making any changes to the project.  
