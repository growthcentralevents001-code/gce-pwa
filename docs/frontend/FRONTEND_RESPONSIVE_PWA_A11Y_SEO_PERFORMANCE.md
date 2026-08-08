# Frontend Responsive, PWA, Accessibility, SEO, Performance Plans

| Field | Value |
|-------|-------|
| **Status** | Planning companions |
| **Date** | 2026-08-08 |

---

## Responsive / device strategy

| Device | Priority surfaces |
|--------|-------------------|
| Mobile | Customer + member |
| Tablet | Customer + venue check-in |
| Desktop | Partner + finance + ops |

Shells: mobile bottom nav (customer); partner/ops sidebar collapses to Sheet. Tables → card lists under `md`.

---

## PWA audit

| Asset | Status | Plan |
|-------|--------|------|
| `manifest.json` | Present | Align name/theme to MASTER in Batch 10 |
| Icons | Present | Verify sizes |
| `sw.js` | Dirty Workbox | **Do not blind overwrite**; regenerate via next-pwa carefully in Batch 10 |
| Offline route | `/offline` clean | Keep |
| Push | Phase 12 gated OFF | UI prefs only until live flag |

---

## Accessibility implementation checklist (Batch 10 + continuous)

- Semantic landmarks, focus rings, keyboard dialogs  
- Form labels + error association  
- Contrast vs MASTER tokens  
- `prefers-reduced-motion` (MASTER)  
- Skip link  
- Certification → Phase 14B  

---

## SEO / public web

- Metadata + OG on public pages Batch 1  
- Canonical URLs for `/events/[id]` SEO shells  
- Sitemap/robots — no dashboard indexing  
- Structured data for public Events when copy Legal-approved  
- Private routes `noindex`

---

## Performance

- Server Components by default; client islands for interactive widgets  
- Route-level code splitting  
- `next/image` for Event/Venue media  
- Skeletons; avoid N+1 client waterfalls (use BG aggregations when ready)  
- Virtualize only ops mega-tables if needed  

---

## Image / media

| Type | Source | Notes |
|------|--------|-------|
| Event/Venue/Offer | Storage URLs from backend | Aspect ratios documented in Batch 2/5 |
| Profile | Supabase storage | Privacy |
| QR | Server-generated payload | No trust client QR codes alone |
| Unstable stock URLs | Avoid | Placeholders from design system |
