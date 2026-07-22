 Database Architecture

 Overview

The GCE platform uses a centralized PostgreSQL database hosted on Supabase.

The database is designed using a modular architecture where every business module operates independently while sharing common entities such as Users, Businesses, Events, Memberships, Payments, and Notifications.

The architecture supports scalability, security, rolebased access, analytics, AI lead distribution, and future expansion.

 Database Objectives

The database is designed to:

 Store business data securely  
 Support rolebased access  
 Enable AI Lead Assist  
 Manage memberships  
 Handle event bookings  
 Support Marketplace operations  
 Manage Enterprise projects  
 Track payments  
 Generate analytics  
 Scale across multiple cities

 Database Modules

The database is divided into logical modules.

 Core Modules

 Authentication  
 User Management  
 Business Profiles  
 Memberships  
 GCE Connect  
 Marketplace  
 Enterprise  
 Events  
 Bookings  
 Payments  
 AI Lead Assist  
 Notifications  
 Dashboards  
 Reports  
 Settings

 Core Database Tables

 Authentication

Stores platform login information.

Tables

 users  
 user\_sessions  
 user\_devices  
 user\_roles

 User Management

Stores user information.

Tables

 user\_profiles  
 addresses  
 contact\_information  
 business\_profiles

 Membership

Stores all membershiprelated information.

Tables

 memberships  
 membership\_plans  
 membership\_payments  
 membership\_history  
 membership\_renewals

 Business Categories

Stores business classifications.

Tables

 business\_categories  
 business\_tags  
 specialization\_tags

 GCE Connect

Stores networking information.

Tables

 circles  
 circle\_members  
 circle\_attendance  
 referrals  
 referral\_history  
 business\_meetings

 Marketplace

Stores Marketplace businesses.

Tables

 venue\_partners  
 marketplace\_businesses  
 marketplace\_offers  
 marketplace\_events  
 offer\_redemptions

 Enterprise

Stores corporate business information.

Tables

 enterprise\_clients  
 enterprise\_projects  
 quotations  
 project\_status  
 corporate\_contacts

 Events

Stores event data.

Tables

 events  
 event\_categories  
 event\_tickets  
 event\_bookings  
 event\_attendees

 Booking System

Stores booking information.

Tables

 bookings  
 booking\_payments  
 booking\_status  
 booking\_history

 Payment Module

Stores financial transactions.

Tables

 payments  
 invoices  
 refunds  
 commissions  
 wallet\_transactions

 AI Lead Assist

Stores AI lead information.

Tables

 leads  
 lead\_requests  
 lead\_validation  
 lead\_assignment  
 lead\_history  
 lead\_status  
 ai\_matching\_scores

 Notifications

Stores platform notifications.

Tables

 notifications  
 notification\_history  
 push\_notifications  
 email\_notifications

 Dashboard

Stores dashboard statistics.

Tables

 dashboard\_metrics  
 dashboard\_widgets  
 activity\_logs

 Reports

Stores reporting information.

Tables

 reports  
 report\_exports  
 analytics  
 audit\_logs

 RoleBased Access Control (RBAC)

Every user is assigned a role.

Supported Roles

 Platform Admin  
 Board of Governance  
 Relationship Manager  
 Platform Relationship Manager  
 Connect Business Development Partner  
 Marketplace Business Development Partner  
 Enterprise Business Development Partner  
 Venue Partner  
 Circle Member  
 User

Each role has specific database permissions.

 Database Relationships

The platform follows relational database architecture.

Example relationships:

User

↓

Membership

↓

Circle

↓

Business Profile

↓

Business Category

↓

Business Tags

↓

Events

↓

Bookings

↓

Payments

↓

Analytics

Venue Partner

↓

Offers

↓

Marketplace Events

↓

Bookings

↓

Revenue

Enterprise Client

↓

Projects

↓

Quotations

↓

Payments

Lead

↓

AI Validation

↓

Assignment

↓

Member

↓

Conversion

 Audit Logs

Every important action is logged.

Examples:

 Login  
 Registration  
 Payment  
 Membership Purchase  
 Event Creation  
 Offer Creation  
 Lead Assignment  
 Revenue Distribution  
 Dashboard Changes

This improves security and transparency.

 Data Security

The platform follows security best practices.

 Supabase Authentication  
 JWT Authentication  
 Row Level Security (RLS)  
 RoleBased Access  
 Encrypted Passwords  
 Secure API Access  
 Audit Logging  
 Backup Strategy

 Backup Strategy

Database backups include:

 Daily Automated Backup  
 Weekly Full Backup  
 Monthly Archive Backup  
 Disaster Recovery Backup

 Scalability

The database is designed for horizontal growth.

Supports:

 MultiCity Operations  
 MultiState Expansion  
 Millions of Users  
 Millions of Events  
 Large Enterprise Projects  
 Marketplace Scaling  
 AI Processing  
 Future Modules

 Future Database Modules

Future tables may include:

 Loyalty System  
 Rewards  
 Coupons  
 Digital Wallet  
 Subscription Credits  
 AI Recommendation Engine  
 Business Ranking  
 CRM  
 Marketing Automation  
 Vendor Marketplace

 LongTerm Vision

The GCE database is designed as the central backbone of the entire Business Growth Ecosystem.

Every module—including Connect, Marketplace, Enterprise, AI Lead Assist, Memberships, Dashboards, and Payments—shares a unified database architecture, ensuring scalability, security, consistency, and seamless integration across the platform.  
