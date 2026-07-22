\# GCE Documentation Guide

\#\# Purpose

This document explains how Cursor AI should use the documentation contained in the \`docs\` folder.

Documentation layout:

\`\`\`
docs/
├── README.md
├── Docs_Guide.md
├── Documentation_Manifest.md
├── core/
└── engineering/
\`\`\`

- Master inventory: \`docs/Documentation_Manifest.md\`
- Core / business docs: \`docs/core/\`
- Engineering / expert docs: \`docs/engineering/\`
- Cursor Rules: \`.cursor/rules/\`

The GCE project contains complete business documentation and AI expert documentation.

Before writing any code, always identify the type of task and read the relevant documentation first.

Never make assumptions if documentation already exists.

\---

\# Documentation Categories

The documentation is divided into two categories.

\#\# Core Documentation

Contains:

\- Business Logic  
\- Workflows  
\- Database Design  
\- Revenue Model  
\- Stakeholders  
\- Dashboards  
\- APIs  
\- Security  
\- Deployment

These documents define \*\*what\*\* the platform should do.

\---

\#\# AI Expert Documentation

Contains:

\- UI Standards  
\- Software Architecture  
\- Database Standards  
\- Security Standards  
\- Performance Standards  
\- Component Standards  
\- Coding Rules

These documents define \*\*how\*\* the platform should be built.

\---

\# Documentation Reading Order

Always read documentation in the following order.

\#\# Step 1

Read

\`\`\`  
33\_Cursor\_Coding\_Rules.md  
\`\`\`

This defines the global development rules.

\---

\#\# Step 2

Read the relevant business documentation.

Example:

Event Booking

↓

Business Rules

↓

Payments

↓

User Flows

\---

\#\# Step 3

Read

\`\`\`  
29\_Full\_Stack\_Architecture\_Expert.md  
\`\`\`

Understand the software architecture.

\---

\#\# Step 4

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

\---

\# Which Documentation Should Be Read?

\#\# When Creating a New Page

Read:

\`\`\`  
33\_Cursor\_Coding\_Rules.md

29\_Full\_Stack\_Architecture\_Expert.md

28\_UI\_UX\_Pro\_Max\_Expert.md

34\_Component\_Library.md

27\_Frontend\_Animations.md  
\`\`\`

\---

\#\# When Creating a New Component

Read:

\`\`\`  
34\_Component\_Library.md

28\_UI\_UX\_Pro\_Max\_Expert.md

27\_Frontend\_Animations.md  
\`\`\`

Search the project first.

Reuse an existing component whenever possible.

\---

\#\# When Editing an Existing Component

Read:

\`\`\`  
34\_Component\_Library.md

28\_UI\_UX\_Pro\_Max\_Expert.md  
\`\`\`

Modify the existing component instead of creating another one.

\---

\#\# When Creating a Dashboard

Read:

\`\`\`  
12\_Dashboards.md

28\_UI\_UX\_Pro\_Max\_Expert.md

34\_Component\_Library.md

27\_Frontend\_Animations.md  
\`\`\`

\---

\#\# When Working on Authentication

Read:

\`\`\`  
16\_Authentication.md

17\_Security.md

31\_Security\_Best\_Practices\_Expert.md  
\`\`\`

\---

\#\# When Working on Payments

Read:

\`\`\`  
21\_Payments.md

17\_Security.md

31\_Security\_Best\_Practices\_Expert.md

30\_Database\_Architecture\_Expert.md  
\`\`\`

\---

\#\# When Working on APIs

Read:

\`\`\`  
15\_API\_Workflows.md

29\_Full\_Stack\_Architecture\_Expert.md

31\_Security\_Best\_Practices\_Expert.md  
\`\`\`

\---

\#\# When Working on the Database

Read:

\`\`\`  
11\_Database.md

30\_Database\_Architecture\_Expert.md  
\`\`\`

\---

\#\# When Working on AI Features

Read:

\`\`\`  
10\_AI\_Lead\_Assist.md

22\_AI\_Rules.md

29\_Full\_Stack\_Architecture\_Expert.md  
\`\`\`

\---

\#\# When Working on Business Logic

Read:

\`\`\`  
14\_Business\_Rules.md

Relevant Business Documentation  
\`\`\`

Business documentation is always the source of truth.

\---

\#\# When Working on Deployment

Read:

\`\`\`  
24\_Deployment\_Architecture.md

25\_Environment\_Configuration.md  
\`\`\`

\---

\#\# When Optimizing Performance

Read:

\`\`\`  
32\_Performance\_Optimization\_Expert.md

27\_Frontend\_Animations.md

29\_Full\_Stack\_Architecture\_Expert.md  
\`\`\`

\---

\#\# When Fixing Bugs

Read:

\`\`\`  
26\_Error\_Handling.md

33\_Cursor\_Coding\_Rules.md

Relevant Documentation  
\`\`\`

Understand the feature before changing it.

\---

\# Reusability Rules

Before creating anything new:

Search the existing project.

If a similar implementation exists:

\- Reuse it.  
\- Extend it.  
\- Improve it.

Avoid duplication.

\---

\# Documentation Priority

If multiple documents contain similar information, use this priority.

1\. Business Documentation  
2\. Cursor Coding Rules  
3\. AI Expert Documentation  
4\. Existing Codebase

Business documentation always wins.

\---

\# Development Workflow

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

\---

\# Before Writing Code

Always ask:

✓ What feature am I building?

✓ Which documentation applies?

✓ Which components already exist?

✓ Which APIs already exist?

✓ Which services already exist?

✓ Can I reuse existing code?

Only then begin coding.

\---

\# Before Creating New Files

Always check whether:

\- Similar file already exists.  
\- Existing implementation can be extended.  
\- New file is actually necessary.

Avoid unnecessary files.

\---

\# Project Philosophy

The GCE platform should evolve as one unified software system.

Every page, component, API, database table, service, and workflow should feel like part of a single, well-designed architecture.

Consistency is more important than speed.

Reusability is more important than duplication.

Scalability is more important than shortcuts.

\---

\# Cursor AI Final Instructions

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
