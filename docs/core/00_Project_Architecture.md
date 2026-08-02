\# GCE Project Architecture

## Authority

Founder Decisions in `docs/founder-decisions/` are the highest business authority (FD-001, FD-020–FD-028). This architecture overview must not contradict them. Official domain per FD-001: **growthcentralevents.com**. Prefer Connect BDP / Marketplace BDP / Enterprise BDP terminology. Connect BDP commercial rules: FD-025. GCE Enterprise commercial and operating rules: FD-026 (platform/IT workflow — not direct physical execution). Membership commercial: FD-027. Revenue recognition / commercial classification: FD-028 (multi-currency-capable; Marketplace 80/20; Affiliate future-only; ZBP removed).



\#\# Project Name

\*\*Growth Central Events (GCE)\*\*

\---

\# Project Vision

Growth Central Events (GCE) is a unified business growth ecosystem designed to connect people, businesses, venues, enterprises, and professionals through networking, events, AI-powered lead distribution, and marketplace solutions.

The platform combines business networking, event management, marketplace services, enterprise solutions, and AI automation into a single Progressive Web Application (PWA).

\---

\# Project Objectives

The primary objectives of GCE are:

\- Build India's largest business networking ecosystem.
\- Connect businesses with verified opportunities.
\- Create AI-powered lead distribution.
\- Enable event discovery and booking.
\- Build a business marketplace.
\- Support enterprise event procurement and vendor-led fulfilment (FD-026).
\- Generate recurring membership revenue.
\- Create a scalable franchise ecosystem.

\---

\# Platform Architecture

The GCE ecosystem consists of three primary business verticals.

\#\# 1\. GCE Connect

Business networking ecosystem.

Features:

\- Business Circles
\- GC Power Sector / Business Circles (FD-027; do not use Power Circle as current)
\- Referrals
\- AI Lead Assist
\- Business Meetings
\- Membership System

\---

\#\# 2\. GCE Marketplace

**GCE Marketplace** for businesses.

Features:

\- Venue Partners
\- Shops
\- Hotels
\- Restaurants
\- Banquet Halls
\- Event Venues
\- Offers
\- GCE Marketplace Events
\- Customer Bookings

\---

\#\# 3\. GCE Enterprise

Technology-enabled corporate event procurement, matching, coordination, workflow, and financial-control platform (FD-026). GCE does not directly execute physical events.

Features:

\- Enterprise Clients (client-based attribution)
\- Enterprise BDP Franchise Packs
\- Enterprise Platform Expert assignment
\- Event Requirement Briefs / Service Requirements
\- Vendor Search, Shortlist, Quotations, Work Orders
\- Master Project / City Units (multi-city)
\- GCE Enterprise Projects
\- Vendor-Led Physical Execution coordination
\- Commission and settlement controls

\---

\# Technology Stack

Frontend

\- Next.js
\- React
\- Tailwind CSS

Backend

\- Supabase
\- PostgreSQL

Authentication

\- Supabase Auth
\- JWT

Hosting

\- Hostinger VPS

Deployment

\- GitHub Actions
\- CI/CD

Application Type

\- Progressive Web App (PWA)

\---

\# Core Modules

The platform consists of the following modules:

\- Authentication
\- User Management
\- Memberships
\- Business Profiles
\- Business Categories
\- Business Tags
\- Specialization Tags
\- Events
\- Bookings
\- GCE Marketplace
\- GCE Enterprise
\- AI Lead Assist
\- Payments
\- Notifications
\- Reports
\- Dashboards
\- Security

\---

\# Stakeholders

The platform supports multiple stakeholders.

\- User
\- Circle Member
\- Venue Partner
\- Platform Admin
\- Venue Admin
\- GCE Connect Business Development Partner (Connect BDP)
\- GCE Marketplace Business Development Partner (Marketplace BDP)
\- Enterprise Business Development Partner
\- Relationship Manager (RM)
\- Platform Relationship Manager (PRM)
\- Board of Governance

Each stakeholder has dedicated permissions, dashboards, APIs, and workflows.

\---

\# Revenue Sources

The GCE platform generates revenue through:

\- Membership Fees
\- GCE Marketplace Commission
\- GCE Enterprise Projects
\- Validation Fees
\- Franchise Fees
\- Training Fees
\- Event Revenue
\- Offer Campaigns

\---

\# AI Lead Assist

AI Lead Assist is the intelligence engine of GCE.

Workflow:

User Requirement

↓

Identity Verification

↓

PRM Verification

↓

Validation Fee

↓

AI Matching

↓

Rainmaker Distribution

↓

Ground Verification

↓

Business Conversion

\---

\# Dashboard Architecture

Each stakeholder receives a dedicated dashboard.

Dashboards include:

\- Platform Admin Dashboard
\- Venue Partner Dashboard
\- Venue Admin Dashboard
\- Connect BDP Dashboard
\- Marketplace BDP Dashboard
\- GCE Enterprise Dashboard
\- Circle Member Dashboard
\- User Dashboard
\- RM Dashboard
\- PRM Dashboard
\- Board of Governance Dashboard

\---

\# Security Architecture

Security includes:

\- JWT Authentication
\- Role-Based Access Control (RBAC)
\- Row Level Security (RLS)
\- API Security
\- Payment Security
\- Audit Logs
\- Fraud Prevention
\- Secure Database
\- Secure Infrastructure

\---

\# Database Architecture

The platform uses a centralized PostgreSQL database.

Major database modules include:

\- Authentication
\- Users
\- Memberships
\- Business Profiles
\- GCE Marketplace
\- GCE Enterprise
\- Events
\- Bookings
\- Payments
\- AI Lead Assist
\- Notifications
\- Reports

\---

\# API Architecture

The platform follows a modular REST API architecture.

Major API groups:

\- Authentication APIs
\- User APIs
\- Membership APIs
\- Event APIs
\- Booking APIs
\- GCE Marketplace APIs
\- GCE Enterprise APIs
\- AI Lead Assist APIs
\- Dashboard APIs
\- Payment APIs
\- Notification APIs

\---

\# Project Documentation Structure

The complete project documentation is organized as follows:

\`\`\`
00\_Project\_Architecture.md
01\_GCE\_Overview.md
02\_Business\_Model.md
03\_Stakeholders.md
04\_Revenue\_Model.md
05\_Memberships.md
06\_CBDP.md
07\_MBDP.md
08\_Enterprise\_BDP.md
09\_Venue\_Partner.md
10\_AI\_Lead\_Assist.md
11\_Database.md
12\_Dashboards.md
13\_UI\_Guidelines.md
14\_Business\_Rules.md
15\_API\_Workflows.md
16\_Authentication.md
17\_Security.md
\`\`\`

\---

\# Development Principles

The project follows these principles:

\- Mobile First
\- Responsive Design
\- Modular Architecture
\- Role-Based System
\- API First Development
\- Secure by Design
\- AI Powered Automation
\- Scalable Infrastructure
\- Reusable Components
\- Clean Code Standards

\---

\# Cursor AI Development Guidelines

Cursor AI should always follow these rules:

\- Use this document as the primary project reference.
\- Read all linked documentation before generating code.
\- Follow the defined business rules.
\- Respect stakeholder permissions.
\- Use the approved database structure.
\- Follow API standards.
\- Follow UI Guidelines.
\- Follow Security Guidelines.
\- Build reusable and scalable components.
\- Never introduce business logic that conflicts with the documentation.

\---

\# Long-Term Vision

Growth Central Events (GCE) is designed as a complete Business Growth Ecosystem rather than a traditional event platform.

The long-term vision is to create a unified platform where networking, marketplace services, enterprise solutions, AI-powered lead distribution, memberships, business analytics, and franchise operations work together seamlessly through a single, secure, scalable, and intelligent Progressive Web Application.
