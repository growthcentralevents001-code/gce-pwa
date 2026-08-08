# Frontend Backend Gap Register

| Field | Value |
|-------|-------|
| **Status** | Planning — backend pre-work may precede some batches |
| **Date** | 2026-08-08 |
| **Rule** | Missing UI ≠ backend gap |

| ID | Gap | Class | Needed by | Notes |
|----|-----|-------|-----------|-------|
| BG-01 | Workspace home KPI aggregations (queued counts, upcoming tickets) | UX convenience / Aggregation | Batch 0–2 | May compose client-side from existing list endpoints short-term |
| BG-02 | Paginated partner portfolios (venues, circles, clients) | Pagination | Batch 4–6 | Confirm list endpoints support cursor/limit |
| BG-03 | Venue staff console API (check-in list by event night) | Read-model | Batch 5 | CX has check-in action; nightly ops list may need view |
| BG-04 | Public SEO Event/Offer sitemaps + metadata endpoint | Search/SEO convenience | Batch 1 | Can start statically; automate later |
| BG-05 | Contact form → ops_case / support_signal create from public | UX convenience | Batch 1 | **Confirmed Batch 1:** UI shows FeatureGated; no browser email; awaiting public intake API |
| BG-06 | Unified wishlist under CX | Read-model | Batch 2 | **Batch 2:** `/customer/wishlist` FeatureGated (coming_later); legacy wishlist not CX authority |
| BG-07 | Notification preference upsert under settings (non-ops) | UX | Batch 9 | Phase 12 prefs exist under ops-governance — expose customer path |
| BG-08 | Opportunity Desk dedicated filters API | Convenience | Batch 8 | Desk queue exists — UX filters OK via query params |
| BG-09 | Finance dashboard summary cards | Aggregation | Batch 7 | Prefer server aggregate to avoid heavy client fan-out |
| BG-10 | Global ops search result DTOs redaction contract docs | Search | Batch 8 | Service exists — document field allowlists for UI |
| BG-11 | Ticket QR re-display after confirmation | UX read-model | Batch 2 | Raw QR tokens returned once from `confirm_booking_sandbox`; ticket list never exposes `qr_token_hash`. Optional re-issue endpoint if Founder wants reopenable passes |
| BG-12 | Claim token re-display after claim | UX read-model | Batch 2 | Same one-time token pattern; session stash used for same-session UX only |

### Not gaps

- Commission calculation UI — correctly server-only  
- Refund % — OD-006 unresolved; show manual review  
- Live email/SMS — intentionally OFF  
- Trust Rank formula — unresolved; display foundation / FeatureGated only  

### Severity for redevelopment start

No **P0 backend blocker** prevents Batch 0–2. BG-11/12 are **P1 UX** for ticket/claim reopen. BG-03/05/07 remain **P1** before later batches.
