\# Component Library

\#\# Role

You are responsible for maintaining a single, reusable, scalable, and consistent component library for the GCE (Growth Central Events) platform.

Every UI component should be built once and reused throughout the application.

Never duplicate components.

Always check this library before creating a new component.

\---

\# Purpose

The Component Library ensures:

\- Design Consistency  
\- Code Reusability  
\- Faster Development  
\- Easier Maintenance  
\- Better Performance  
\- Scalable Architecture

\---

\# Design Standards

Every component must follow:

\- UI\_UX\_Pro\_Max\_Expert.md  
\- Frontend\_Animations.md  
\- Full\_Stack\_Architecture\_Expert.md

Every component should:

\- Be Responsive  
\- Be Accessible  
\- Be Reusable  
\- Be Typed  
\- Support Dark Mode (Future Ready)  
\- Use Tailwind CSS  
\- Use Motion where appropriate

\---

\# Component Categories

The component library is divided into the following categories.

\---

\# 1\. Buttons

Reusable Buttons

\- Primary Button  
\- Secondary Button  
\- Outline Button  
\- Ghost Button  
\- Icon Button  
\- Floating Action Button  
\- Danger Button  
\- Success Button  
\- Loading Button

Every button should support:

\- Hover  
\- Active  
\- Focus  
\- Disabled  
\- Loading

\---

\# 2\. Inputs

Reusable Inputs

\- Text Input  
\- Password Input  
\- Email Input  
\- Phone Input  
\- Search Input  
\- Number Input  
\- Currency Input  
\- Date Picker  
\- Time Picker  
\- File Upload  
\- OTP Input  
\- Text Area

Support:

\- Validation  
\- Error State  
\- Helper Text

\---

\# 3\. Select Components

Reusable Selects

\- Dropdown  
\- Multi Select  
\- Searchable Select  
\- Country Selector  
\- City Selector  
\- State Selector

\---

\# 4\. Cards

Reusable Cards

\- Event Card  
\- Venue Card  
\- Offer Card  
\- Membership Card  
\- User Card  
\- Dashboard Card  
\- Analytics Card  
\- Notification Card  
\- Payment Card  
\- Profile Card

Cards should include:

\- Shadow  
\- Rounded Corners  
\- Hover Animation  
\- Responsive Layout

\---

\# 5\. Navigation

Reusable Navigation Components

\- Navbar  
\- Sidebar  
\- Bottom Navigation  
\- Breadcrumb  
\- Tabs  
\- Mega Menu  
\- Mobile Drawer  
\- User Menu

\---

\# 6\. Dashboard Components

Reusable Dashboard Components

\- KPI Card  
\- Statistics Card  
\- Revenue Card  
\- Activity Feed  
\- Dashboard Header  
\- Dashboard Sidebar  
\- Dashboard Widget  
\- Quick Action Card

\---

\# 7\. Tables

Reusable Tables

\- Data Table  
\- User Table  
\- Venue Table  
\- Event Table  
\- Payment Table  
\- Membership Table

Support:

\- Search  
\- Filter  
\- Sort  
\- Pagination  
\- Export

\---

\# 8\. Lists

Reusable Lists

\- Event List  
\- Notification List  
\- Venue List  
\- Offer List  
\- Member List

\---

\# 9\. Dialogs

Reusable Dialogs

\- Confirmation Dialog  
\- Delete Dialog  
\- Success Dialog  
\- Error Dialog  
\- Warning Dialog

Support:

\- Escape Key  
\- Click Outside  
\- Keyboard Navigation

\---

\# 10\. Drawers

Reusable Drawers

\- Left Drawer  
\- Right Drawer  
\- Bottom Sheet

\---

\# 11\. Modals

Reusable Modals

\- Login Modal  
\- Signup Modal  
\- Payment Modal  
\- Event Registration Modal  
\- Membership Modal

Use Glassmorphism where appropriate.

\---

\# 12\. Notifications

Reusable Notifications

\- Toast  
\- Snackbar  
\- Alert Banner  
\- Badge  
\- Notification Item

\---

\# 13\. Loaders

Reusable Loading Components

\- Spinner  
\- Skeleton  
\- Pulse Loader  
\- Progress Bar  
\- Circular Loader

\---

\# 14\. Empty States

Reusable Empty States

\- No Events  
\- No Notifications  
\- No Search Results  
\- No Offers  
\- No Payments  
\- No Members

Include:

\- Illustration  
\- Message  
\- CTA Button

\---

\# 15\. Charts

Reusable Charts

\- Line Chart  
\- Bar Chart  
\- Pie Chart  
\- Area Chart  
\- KPI Chart  
\- Revenue Chart

Charts should be responsive.

\---

\# 16\. Filters

Reusable Filters

\- Search Filter  
\- Date Filter  
\- Status Filter  
\- Category Filter  
\- City Filter  
\- Price Filter

\---

\# 17\. Profile Components

Reusable Profile Components

\- Avatar  
\- User Info Card  
\- Profile Header  
\- Statistics  
\- Social Links

\---

\# 18\. AI Components

Reusable AI Components

\- AI Status Card  
\- AI Processing Indicator  
\- AI Suggestion Card  
\- AI Recommendation Card

\---

\# 19\. Payment Components

Reusable Payment Components

\- Payment Summary  
\- Payment Card  
\- Invoice Card  
\- Transaction Timeline  
\- Billing Summary

\---

\# 20\. Membership Components

Reusable Membership Components

\- Membership Card  
\- Membership Benefits  
\- Membership Comparison  
\- Upgrade Card

\---

\# 21\. Venue Components

Reusable Venue Components

\- Venue Card  
\- Venue Gallery  
\- Venue Information  
\- Venue Amenities  
\- Venue Availability

\---

\# 22\. Event Components

Reusable Event Components

\- Event Card  
\- Event Timeline  
\- Event Schedule  
\- Speaker Card  
\- Event Gallery  
\- Event Registration

\---

\# 23\. Marketplace Components

Reusable Marketplace Components

\- Product Card  
\- Offer Card  
\- Cashback Card  
\- Coupon Card  
\- Deal Card

\---

\# 24\. Enterprise Components

Reusable Enterprise Components

\- Project Card  
\- Client Card  
\- Meeting Card  
\- Proposal Card  
\- Contract Card

\---

\# Animation Standards

Every interactive component should use Motion.

Examples:

Buttons

\- Hover  
\- Tap

Cards

\- Hover Elevation  
\- Scale

Modals

\- Fade  
\- Scale

Drawers

\- Slide

Pages

\- Fade  
\- Slide

Refer to:

27\_Frontend\_Animations.md

\---

\# Responsive Standards

Every component must support:

\- Mobile  
\- Tablet  
\- Desktop

Never create desktop-only components.

\---

\# Accessibility Standards

Every component should support:

\- Keyboard Navigation  
\- Screen Readers  
\- Focus State  
\- ARIA Labels

\---

\# Reusability Rules

Before creating a component ask:

1\. Does it already exist?  
2\. Can an existing component be extended?  
3\. Can props solve the requirement?

If yes,

Reuse the component.

Never duplicate components.

\---

\# Component Naming

Use PascalCase.

Examples

\`\`\`  
EventCard.tsx

VenueCard.tsx

DashboardWidget.tsx

PaymentSummary.tsx  
\`\`\`

\---

\# Folder Structure

\`\`\`  
components/

buttons/

cards/

charts/

dashboard/

dialogs/

drawers/

forms/

inputs/

layout/

lists/

modals/

navigation/

notifications/

payments/

profile/

tables/

widgets/  
\`\`\`

Keep related components together.

\---

\# Props Standards

Every reusable component should:

\- Be configurable  
\- Accept props  
\- Avoid hardcoded values  
\- Support variants

\---

\# Cursor AI Instructions

Whenever creating UI:

1\. Search this Component Library first.  
2\. Reuse an existing component whenever possible.  
3\. Extend existing components instead of creating duplicates.  
4\. Follow the UI UX Pro Max Expert.  
5\. Follow Frontend Animation rules.  
6\. Keep components modular.  
7\. Keep components responsive.  
8\. Keep components accessible.  
9\. Keep components reusable.

Never create duplicate UI components.

\---

\# Forbidden Practices

Never:

\- Duplicate Components  
\- Hardcode Styles  
\- Ignore Responsiveness  
\- Ignore Accessibility  
\- Ignore Animations  
\- Ignore Existing Components  
\- Create One-Off Components without justification

\---

\# Success Criteria

Every component should:

\- Be reusable.  
\- Be responsive.  
\- Be accessible.  
\- Be modular.  
\- Be typed.  
\- Be performant.  
\- Be consistent with the GCE Design System.

Cursor should always think in terms of building and extending a shared component library rather than creating isolated, one-time UI elements.  
