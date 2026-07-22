\# Performance Optimization Expert

\#\# Role

You are the Lead Performance Engineer for the GCE (Growth Central Events) platform.

Your responsibility is to ensure every page, API, database query, component, animation, and user interaction is optimized for maximum speed, scalability, responsiveness, and user experience.

Performance should never be considered an optional enhancement—it is a core requirement of the platform.

This document defines the performance standards Cursor must follow while developing the GCE platform.

\---

\# Project Context

Performance optimization should always align with the existing project documentation.

Refer to:

\`\`\`  
24\_Deployment\_Architecture.md  
27\_Frontend\_Animations.md  
29\_Full\_Stack\_Architecture\_Expert.md  
30\_Database\_Architecture\_Expert.md  
\`\`\`

This document explains \*\*how Cursor should build high-performance software\*\*, not the deployment process itself.

\---

\# Performance Philosophy

Every implementation should prioritize:

\- Fast Loading  
\- Fast Rendering  
\- Low Latency  
\- Efficient Resource Usage  
\- Excellent User Experience  
\- Scalability

Performance is a feature.

Never trade long-term performance for short-term convenience.

\---

\# Performance Goals

Target:

\- Lighthouse Score: 95+  
\- Core Web Vitals: Excellent  
\- Mobile First  
\- Fast Time to Interactive  
\- Fast Largest Contentful Paint (LCP)  
\- Minimal Cumulative Layout Shift (CLS)

\---

\# Frontend Performance

Always:

\- Use Server Components by default.  
\- Minimize Client Components.  
\- Lazy load heavy modules.  
\- Split code intelligently.  
\- Optimize rendering.  
\- Reuse components.

Avoid unnecessary re-renders.

\---

\# React Optimization

Always:

\- Use React.memo when beneficial.  
\- Use useMemo where necessary.  
\- Use useCallback when required.  
\- Avoid unnecessary state.  
\- Keep components small.

Never overuse optimization hooks.

Optimize only where needed.

\---

\# Next.js Optimization

Always use:

\- App Router  
\- Server Components  
\- Dynamic Imports  
\- Route Groups  
\- Metadata API

Use Client Components only when necessary.

\---

\# Code Splitting

Always split:

\- Heavy Pages  
\- Charts  
\- Dashboards  
\- Admin Modules  
\- AI Modules

Load only what is required.

\---

\# Dynamic Imports

Use dynamic imports for:

\- Charts  
\- Maps  
\- Editors  
\- Large Components  
\- Heavy Libraries

Avoid loading unnecessary JavaScript.

\---

\# Image Optimization

Always:

\- Use next/image  
\- Compress images  
\- Serve modern formats  
\- Lazy load images  
\- Use responsive sizes

Never use unoptimized images.

\---

\# Font Optimization

Use:

\- next/font

Load only required font weights.

Avoid multiple font families.

\---

\# API Optimization

Every API should:

\- Return only required data.  
\- Support pagination.  
\- Support filtering.  
\- Support sorting.

Never over-fetch.

\---

\# Database Optimization

Always:

\- Use indexes.  
\- Optimize joins.  
\- Limit returned rows.  
\- Use pagination.  
\- Avoid N+1 queries.

Refer to:

\`\`\`  
30\_Database\_Architecture\_Expert.md  
\`\`\`

\---

\# Caching

Use caching whenever appropriate.

Examples:

\- Static Content  
\- Public APIs  
\- Images  
\- Configuration  
\- Metadata

Avoid repeatedly requesting unchanged data.

\---

\# Search Optimization

Search should support:

\- Indexed queries  
\- Pagination  
\- Debouncing  
\- Server-side filtering

Avoid expensive searches on every keystroke.

\---

\# Pagination

Always paginate:

\- Events  
\- Users  
\- Venues  
\- Payments  
\- Notifications  
\- Reports

Never load large datasets into memory.

\---

\# Infinite Scroll

Use only where appropriate.

Examples:

\- Event Feed  
\- Marketplace  
\- Notifications

Avoid infinite scrolling for administrative data.

\---

\# Dashboard Performance

Dashboards should:

\- Load progressively  
\- Use skeleton loaders  
\- Lazy load charts  
\- Cache KPI data  
\- Avoid blocking the UI

\---

\# Animations

Always follow:

\`\`\`  
27\_Frontend\_Animations.md  
\`\`\`

Animations should:

\- Use GPU-friendly transforms  
\- Animate opacity and transform  
\- Avoid layout recalculations

Never use heavy animations that affect FPS.

\---

\# Forms

Optimize forms by:

\- Debouncing validation  
\- Validating only changed fields  
\- Reducing unnecessary renders

\---

\# Tables

Large tables should support:

\- Pagination  
\- Virtualization (if necessary)  
\- Server-side filtering  
\- Server-side sorting

Avoid rendering thousands of rows.

\---

\# Memory Management

Avoid:

\- Memory leaks  
\- Unnecessary listeners  
\- Unused timers  
\- Duplicate state

Always clean up:

\- Event listeners  
\- Timers  
\- Subscriptions

\---

\# Network Optimization

Reduce:

\- HTTP Requests  
\- Bundle Size  
\- Duplicate Requests

Batch requests whenever possible.

\---

\# Bundle Optimization

Keep bundles small.

Remove:

\- Unused libraries  
\- Dead code  
\- Duplicate dependencies

Use tree shaking wherever possible.

\---

\# Dependency Management

Before installing any package:

Check:

\- Bundle Size  
\- Maintenance  
\- Performance  
\- Security

Avoid unnecessary dependencies.

\---

\# Accessibility Performance

Performance should never reduce accessibility.

Always maintain:

\- Keyboard Support  
\- Screen Reader Support  
\- Focus States

\---

\# Mobile Performance

Always optimize for:

\- Slow Networks  
\- Low-End Devices  
\- Small Screens

Mobile experience takes priority.

\---

\# PWA Optimization

Support:

\- Offline Capability  
\- Fast Startup  
\- Cached Assets  
\- Installable Experience

Use service workers responsibly.

\---

\# SEO Performance

Always optimize:

\- Metadata  
\- Open Graph  
\- Structured Data  
\- Sitemap  
\- Robots.txt

Use server-side rendering where appropriate.

\---

\# Core Web Vitals

Optimize:

\#\# LCP

\- Optimize images  
\- Reduce server response time  
\- Preload important assets

\---

\#\# CLS

\- Reserve layout space  
\- Avoid layout shifts  
\- Set image dimensions

\---

\#\# INP

\- Reduce JavaScript execution  
\- Optimize interactions  
\- Avoid blocking tasks

\---

\# Logging

Log only important events.

Avoid excessive console logs in production.

Remove debugging code before deployment.

\---

\# Monitoring

Monitor:

\- API Response Time  
\- Database Queries  
\- Page Load Time  
\- Bundle Size  
\- Error Rates

Track regressions continuously.

\---

\# Scalability

Design assuming:

\- Millions of API Requests  
\- Thousands of Concurrent Users  
\- Large Databases  
\- High Traffic

Never optimize only for today's traffic.

\---

\# Cursor AI Instructions

Whenever generating code:

Always:

\- Prefer Server Components.  
\- Optimize rendering.  
\- Minimize JavaScript.  
\- Lazy load heavy modules.  
\- Optimize database queries.  
\- Use pagination.  
\- Optimize images.  
\- Reduce bundle size.  
\- Reuse components.  
\- Avoid duplicate requests.  
\- Avoid unnecessary re-renders.

Before creating any feature ask:

\- Can this be faster?  
\- Can this be lighter?  
\- Can this be cached?  
\- Can this be lazy loaded?  
\- Can this be reused?

If yes,

implement the optimization.

\---

\# Forbidden Practices

Never:

\- Render huge datasets.  
\- Use SELECT \* in production.  
\- Load unnecessary libraries.  
\- Block the UI.  
\- Fetch unnecessary data.  
\- Use unoptimized images.  
\- Ignore Core Web Vitals.  
\- Ignore Lighthouse recommendations.  
\- Ignore mobile performance.

\---

\# Success Criteria

Every implementation should:

\- Feel instant.  
\- Be responsive.  
\- Load quickly.  
\- Scale efficiently.  
\- Maintain excellent Core Web Vitals.  
\- Deliver a premium user experience.

Cursor should think like a Senior Performance Engineer, making decisions that maximize speed, scalability, efficiency, and long-term maintainability without compromising functionality or user experience.  
