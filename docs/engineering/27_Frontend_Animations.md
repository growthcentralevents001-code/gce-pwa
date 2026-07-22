Yes. Since you've **already installed Motion**, your `.md` file should assume it is part of the project and **never tell Cursor to install it again**.

Here's the rewritten version:

\# Frontend Animations (Motion for React)

\#\# Overview

The GCE platform uses \*\*Motion\*\* (formerly Framer Motion) as its official animation library.

Motion is already installed and configured in this project.

All frontend animations should use Motion to create smooth, modern, high-performance, and production-ready user experiences.

Do not replace Motion with any other animation library.

\---

\# Motion Library

Package:

\`\`\`  
motion  
\`\`\`

Status:

\- Installed  
\- Configured  
\- Ready to Use

When animations are required, import Motion using:

\`\`\`tsx  
"use client";

import { motion } from "motion/react";  
\`\`\`

Do not install Motion again.

Always use the existing project dependency.

\---

\# Purpose

Motion is used to:

\- Improve User Experience  
\- Create Smooth Page Transitions  
\- Add Interactive Feedback  
\- Make the application feel premium  
\- Improve perceived performance  
\- Enhance the overall GCE brand experience

\---

\# Animation Principles

Every animation should be:

\- Fast  
\- Smooth  
\- Minimal  
\- Professional  
\- Consistent  
\- Purposeful  
\- Non-distracting

Animations should improve usability rather than exist for decoration.

Default animation duration:

\- 200ms–500ms

\---

\# Motion Usage Standards

Motion should be used throughout the application wherever it enhances user experience.

\#\# Landing Page

Use Motion for:

\- Hero fade-in  
\- Section reveal  
\- Statistics counter animation  
\- CTA button hover  
\- Scroll reveal animations

\---

\#\# Navigation

Animate:

\- Mobile menu  
\- Sidebar  
\- Active navigation indicator  
\- Dropdown menus  
\- Search panel

\---

\#\# Event Cards

Animate:

\- Hover scale  
\- Tap interaction  
\- Fade-in on scroll  
\- Card elevation  
\- Image transitions

\---

\#\# Marketplace

Animate:

\- Offer cards  
\- Product cards  
\- Category selection  
\- Filter transitions  
\- Search results

\---

\#\# Enterprise

Animate:

\- Dashboard widgets  
\- Project cards  
\- Progress indicators  
\- Status updates

\---

\#\# Dashboards

Use Motion for:

\- KPI cards  
\- Widget loading  
\- Charts  
\- Activity feed  
\- Statistics  
\- Card transitions

\---

\#\# Forms

Animate:

\- Multi-step forms  
\- Validation feedback  
\- Success messages  
\- Error states  
\- Field appearance

\---

\#\# AI Lead Assist

Animate:

\- Lead processing  
\- AI status  
\- Progress indicators  
\- Success confirmation  
\- Lead assignment

\---

\#\# Notifications

Animate:

\- Toasts  
\- Alerts  
\- Badges  
\- Notification drawer  
\- Status changes

\---

\#\# Buttons

Buttons should support:

\- Hover  
\- Tap  
\- Focus  
\- Loading  
\- Disabled state

Common Motion properties:

\- whileHover  
\- whileTap

Keep interactions subtle and responsive.

\---

\#\# Modals

Animate:

\- Fade In  
\- Fade Out  
\- Scale In  
\- Scale Out  
\- Backdrop Blur

\---

\#\# Drawers

Animate:

\- Slide In  
\- Slide Out

Support:

\- Left Drawer  
\- Right Drawer  
\- Bottom Sheet (Mobile)

\---

\#\# Page Transitions

Every page should include:

\- Smooth Enter  
\- Smooth Exit  
\- Fade  
\- Slide

Navigation should feel seamless.

\---

\#\# Lists

Use stagger animations for:

\- Events  
\- Offers  
\- Notifications  
\- Dashboard Cards  
\- Tables  
\- Search Results

\---

\#\# Loading States

Use Motion for:

\- Skeleton Loading  
\- Pulse  
\- Spinner  
\- Progress Bar  
\- Placeholder Cards

Never leave static loading screens.

\---

\# Performance Rules

Always:

\- Animate only necessary elements.  
\- Prefer transform and opacity animations.  
\- Avoid layout thrashing.  
\- Lazy load heavy animated sections.  
\- Minimize re-renders.  
\- Keep animations lightweight.

Never sacrifice performance for visual effects.

\---

\# Accessibility

Respect user accessibility preferences.

If reduced motion is enabled:

\- Disable complex animations.  
\- Keep transitions minimal.  
\- Preserve usability.

Follow WCAG accessibility guidelines.

\---

\# Reusable Animations

Prefer reusable animation wrappers instead of repeating animation code.

Examples:

\- FadeIn  
\- SlideUp  
\- ScaleIn  
\- StaggerContainer  
\- HoverCard  
\- AnimatedButton

Avoid duplicating animation logic.

\---

\# Future Enhancements

Future Motion implementations may include:

\- Shared Layout Animations  
\- Drag & Drop  
\- Gesture Support  
\- AI Visual Feedback  
\- Lottie Integration  
\- 3D Motion Effects  
\- Interactive Dashboards

\---

\# Cursor AI Instructions

Cursor must always:

\- Use Motion as the official animation library.  
\- Assume Motion is already installed.  
\- Never suggest installing Motion again.  
\- Never replace Motion with another animation library.  
\- Import Motion using:

\`\`\`tsx  
import { motion } from "motion/react";  
\`\`\`

\- Keep animations subtle and professional.  
\- Prioritize smooth user experience.  
\- Maintain excellent performance.  
\- Follow the GCE Design System.  
\- Follow the UI\_UX\_Pro\_Max guidelines.  
\- Reuse existing animation components whenever possible.

Before creating a new animation, check whether a reusable animation component already exists.

\---

\# Long-Term Vision

Every animation in GCE should feel intentional, smooth, and premium.

The platform should provide an app-like experience comparable to modern SaaS products such as Stripe, Linear, Notion, Airbnb, and Apple.

Motion is the official animation framework for all frontend interactions across the GCE platform.

This version treats Motion as a **project standard**, not a dependency to install. It tells Cursor to **use** Motion, **never reinstall it**, and **reuse existing animation components** whenever possible. This is the approach I'd recommend for a long-lived project.

