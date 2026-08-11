# Frontend Backend Gap Register

| Field | Value |
|-------|-------|
| **Status** | **Batch 10 classified** — Phase 14B readiness (not started) |
| **Date** | 2026-08-11 |
| **Rule** | Missing UI ≠ backend gap |

| ID | Gap | Class | Needed by | Phase 14B class | Notes |
|----|-----|-------|-----------|-----------------|-------|
| BG-01 | Workspace home KPI aggregations | UX convenience | Batch 0–2 | non-blocking | May compose client-side |
| BG-02 | Paginated partner portfolios | Pagination | Batch 4–6 | P1 | Cursor/limit |
| BG-03 | Venue staff console API | Read-model | Batch 5 | P1 | Nightly ops list |
| BG-04 | Public SEO sitemaps | SEO | Batch 1 | P2 / future | Static OK short-term |
| BG-05 | Contact → ops_case | UX | Batch 1 | P1 | FeatureGated |
| BG-06 | Unified wishlist | Read-model | Batch 2 | future | FeatureGated |
| BG-07 | Notification prefs settings | UX | Batch 9 | **closed** | `/api/settings` |
| BG-08 | Opportunity Desk filters | Convenience | Batch 8 | non-blocking | Query params OK |
| BG-09 | Finance dashboard summary | Aggregation | Batch 7 | P1 | Prefer server aggregate |
| BG-10 | Ops search redaction docs | Search | Batch 8 | P2 | Document allowlists |
| BG-11 | Ticket QR re-display | UX read-model | Batch 2 | **P1** | One-time token |
| BG-12 | Claim token re-display | UX read-model | Batch 2 | **P1** | Same pattern |
| BG-13 | Circle transfer request | UX / Permission | Batch 3 | P1 | FeatureGated |
| BG-14 | Member Tag editor | UX | Batch 3 | P1 | Display only |
| BG-15 | Directory display names | UX read-model | Batch 3 | P1 | Placeholders |
| BG-16 | Connect BDP sourcing stages | UX read-model | Batch 4 | non-blocking | Attribution statuses |
| BG-17 | Paginated Connect BDP portfolios | Pagination | Batch 4 | P1 | Extends BG-02 |
| BG-18 | BDP reassignment request | Action API | Batch 4 | future | Platform-gated |
| BG-19 | Venue representative console | Action API | Batch 5 | P1 | FeatureGated |
| BG-20 | Paginated MBDP/Venue portfolios | Pagination | Batch 5 | P1 | |
| BG-21 | Venue feedback aggregate | UX read-model | Batch 5 | future | |
| BG-22 | MBDP reassignment request | Action API | Batch 5 | future | |
| BG-23 | Enterprise Client representatives | Action API | Batch 6 | P1 | FeatureGated |
| BG-24 | Enterprise BDP reassignment | Action API | Batch 6 | future | |
| BG-25 | Expert project list DTO | UX read-model | Batch 6 | non-blocking | |
| BG-26 | Paginated Enterprise portfolios | Pagination | Batch 6 | P1 | |
| BG-27 | Paginated Finance lists | Pagination | Batch 7 | P1 | Cap 80 |
| BG-28 | Finance recognised ₹ aggregates | Aggregation | Batch 7 | P1 | |
| BG-29 | Refund review join DTO | UX read-model | Batch 7 | non-blocking | |
| BG-30 | Ops queue cursor pagination | Pagination | Batch 8 | P1 | Cap 100 |
| BG-31 | Full compliance hold SM | UX read-model | Batch 8 | P1 | |
| BG-32 | Authenticated Playwright identities | Test infra | Batch 8–10 | **blocks deep E2E** | Phase 14B readiness |
| BG-33 | Session list / revoke | Security | Batch 9 | P1 | FeatureGated |
| BG-34 | Consent version history | Privacy | Batch 9 | P1 | FeatureGated |
| BG-35 | Avatar upload | UX | Batch 9 | P2 | FeatureGated |

### Not gaps

- Commission calculation UI — correctly server-only  
- Refund % — OD-006 unresolved; show manual review  
- Live email/SMS — intentionally OFF  
- Trust Rank formula — unresolved; display foundation / FeatureGated only  

### Batch 10 severity note

No **frontend P0** remains for Checkpoint E. BG-32 blocks **authenticated deep E2E** in Phase 14B, not Batch 10 visual closeout.
