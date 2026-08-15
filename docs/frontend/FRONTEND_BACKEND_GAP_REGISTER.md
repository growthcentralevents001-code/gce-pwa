# Frontend Backend Gap Register

| Field | Value |
|-------|-------|
| **Status** | **Phase 14B-F** — BG-32 **CLOSED**; authenticated shell matrix PASS |
| **Date** | 2026-08-15 |
| **Rule** | Missing UI ≠ backend gap |

| ID | Gap | Class | Phase 14B class | Notes |
|----|-----|-------|-----------------|-------|
| BG-01 | Workspace home KPI aggregations | UX convenience | PILOT P2 | Non-blocking |
| BG-02 | Paginated partner portfolios | Pagination | P1 | Cursor/limit |
| BG-03 | Venue staff console API | Read-model | P1 | Nightly ops list |
| BG-04 | Public SEO sitemaps | SEO | FUTURE | Static OK |
| BG-05 | Contact → ops_case | UX | P1 | FeatureGated |
| BG-06 | Unified wishlist | Read-model | FUTURE | FeatureGated |
| BG-07 | Notification prefs settings | UX | **CLOSED** | `/api/settings` |
| BG-08 | Opportunity Desk filters | Convenience | PILOT P2 | Query params OK |
| BG-09 | Finance dashboard summary | Aggregation | P1 | Prefer server aggregate |
| BG-10 | Ops search redaction docs | Search | PILOT P2 | Document allowlists |
| BG-11 | Ticket QR re-display | UX read-model | **P1** | Fixtures available; deep re-display probe still pending |
| BG-12 | Claim token re-display | UX read-model | **P1** | Same |
| BG-13 | Circle transfer request | UX / Permission | P1 | FeatureGated |
| BG-14 | Member Tag editor | UX | P1 | Display only |
| BG-15 | Directory display names | UX read-model | P1 | Placeholders |
| BG-16 | Connect BDP sourcing stages | UX read-model | PILOT P2 | Attribution statuses |
| BG-17 | Paginated Connect BDP portfolios | Pagination | P1 | Extends BG-02 |
| BG-18 | BDP reassignment request | Action API | FUTURE | Platform-gated |
| BG-19 | Venue representative console | Action API | P1 | FeatureGated |
| BG-20 | Paginated MBDP/Venue portfolios | Pagination | P1 | |
| BG-21 | Venue feedback aggregate | UX read-model | FUTURE | |
| BG-22 | MBDP reassignment request | Action API | FUTURE | |
| BG-23 | Enterprise Client representatives | Action API | P1 | FeatureGated |
| BG-24 | Enterprise BDP reassignment | Action API | FUTURE | |
| BG-25 | Expert project list DTO | UX read-model | PILOT P2 | |
| BG-26 | Paginated Enterprise portfolios | Pagination | P1 | |
| BG-27 | Paginated Finance lists | Pagination | P1 | Cap 80 |
| BG-28 | Finance recognised ₹ aggregates | Aggregation | P1 | |
| BG-29 | Refund review join DTO | UX read-model | PILOT P2 | |
| BG-30 | Ops queue cursor pagination | Pagination | P1 | Cap 100 |
| BG-31 | Full compliance hold SM | UX read-model | P1 | |
| BG-32 | Authenticated Playwright identities | Test infra | **CLOSED** | gce-dev fixtures + auth.setup + chromium-auth matrix (36 passed) |
| BG-33 | Session list / revoke | Security | P1 | FeatureGated |
| BG-34 | Consent version history | Privacy | P1 | FeatureGated |
| BG-35 | Avatar upload | UX | PILOT P2 | FeatureGated |

### Phase 14B severity note

- No product **P0 security/finance** defects opened in unauthenticated pass.
- **BG-32 CLOSED** after Phase 14B-F fixtures + authenticated shell matrix.
- Deep authenticated lifecycle (booking/QR/check-in/Lead/Finance co-sign) remains open evidence work — not a missing fixture gate.
- Money/execution flags remain OFF (intentional — not Pilot blockers by themselves).
