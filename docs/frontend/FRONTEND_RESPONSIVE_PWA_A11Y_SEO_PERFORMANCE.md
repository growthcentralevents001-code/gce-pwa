# Frontend Responsive, PWA, Accessibility, SEO, Performance Plans

> **Living target:** `docs/ui-ux/GCE_RESPONSIVE_ACCESSIBILITY.md`. This file remains Batch 10 implementation evidence.

| Field | Value |
|-------|-------|
| **Status** | **Batch 10 baseline complete** — Checkpoint E (historical evidence) |
| **Date** | 2026-08-11 |
| **Evidence** | `docs/frontend/implementation/BATCH_10_PWA_RESPONSIVE_A11Y_GLOBAL_POLISH_IMPLEMENTATION.md` |

---

## Responsive / device strategy

| Device | Priority surfaces | Batch 10 |
|--------|-------------------|----------|
| Mobile 390×844 | Customer + member + public | Safe-area utilities; bottom nav baseline |
| Tablet 768×1024 | Partner + venue | Shell Sheet transitions |
| Desktop 1366×768 | Partner + finance + ops | `max-w-7xl` page token |
| Large desktop | Ops/Finance tables | Wider where justified |

Shells: mobile bottom nav (customer); partner/ops sidebar collapses to Sheet. Tables → card lists under `md`.

---

## PWA audit

| Asset | Status | Batch 10 |
|-------|--------|----------|
| `manifest.json` | Present | theme `#EA580C`, background `#FFF7ED`, scope `/` |
| Icons | Present | `/icons/icon-192` / `512` |
| `sw.js` | Workbox | `/api` **NetworkOnly**; next.config production runtimeCaching NetworkOnly |
| Offline route | `/offline` | Restrained GCE offline card |
| Push | Gated OFF | Unchanged |

Installability: prerequisites present; full Lighthouse claim deferred to Phase 14B device evidence.

---

## Accessibility implementation checklist (Batch 10 + continuous)

- Semantic landmarks, focus rings, keyboard dialogs — baseline  
- Form labels + error association — shared forms  
- Contrast vs MASTER tokens — orange/cream  
- `prefers-reduced-motion` — globals + `lib/frontend/motion.ts`  
- Skip link — existing shell  
- **WCAG certification** — **not claimed** (Phase 14B / professional audit)

---

## SEO

| Surface | Policy |
|---------|--------|
| Public | Indexable metadata (root layout polished) |
| Private (`/dashboard`, `/ops`, `/finance`, `/settings`, `/customer`, …) | `noindex` |
| Structured data | Deferred — no invented Event schema |

---

## Performance

- Prefer RSC; avoid whole-dashboard client trees (existing)  
- Fonts: Google CSS remaining; next/font deferred non-blocking  
- No sensitive API SW cache  
- Phase 14B: authenticated perf budgets + Lighthouse
