# Batch 5 — Marketplace BDP + Venue Partner Implementation

| Field | Value |
|-------|-------|
| **Status** | **COMPLETE — Marketplace Partner experience ready for review** (non-blocking gaps remain) |
| **Date** | 2026-08-09 |
| **Branch** | `development` |
| **Batch 6** | Not started |
| **Checkpoint C reuse** | Direct reuse of PartnerShell, StatusStrip, ActionCenter, CommercialSummary, DataTable, Pipeline, KpiCard, Timeline |

---

## Commercial authority check

Matched `lib/architecture/marketplace/constants.ts` + FD-029/033/037 / `36_Commercial_Constants.md`:

| Item | Value |
|------|-------|
| Attributed split | 80 / 10 / 10 |
| Unattributed | 80 / 0 / 20 (missing 10% NOT pending) |
| Unit | 20 venues |
| Max units/person | 2 |
| Max venues/person | 40 |
| Offer min planned value | ₹50,000 (not fee) |
| Campaign max | 15 days |
| Customer cap | 100 |
| Claim validity | 72 hours |
| Marketplace Affiliate | Inactive |

No prompt/repo discrepancy.

---

## Checkpoint C reuse assessment

| Pattern | Status |
|---------|--------|
| PartnerShell + nav | Extended for `marketplace-bdp` + `venue` |
| PartnerStatusStrip / ActionCenter / CommercialSummary | Direct reuse |
| PartnerDataTable / PipelineList | Direct reuse |
| KpiCard / Timeline / PageHeader | Direct reuse |
| MarketplaceUnitCard / VenuePortfolioCard / EventOfferCards / CheckIn / Redemption | New thin semantic wrappers in same visual family |

No separate Marketplace visual system.

---

## Routes

### Marketplace BDP

| ID | Route | Status |
|----|-------|--------|
| MBDP-01 | `/dashboard/marketplace-bdp` | Created |
| MBDP-02 | `/marketplace-bdp/apply` | Created |
| MBDP-03 | `/marketplace-bdp/units` | Created |
| MBDP-04 | `/marketplace-bdp/venues` | Created |
| MBDP-05 | `/marketplace-bdp/attribution` | Created |
| MBDP-06 | `/marketplace-bdp/recommendations` | Created |
| MBDP-07 | `/marketplace-bdp/entitlements` | Created |
| MBDP-08 | `/marketplace-bdp/reassignment` | Created (Platform-gated) |
| MBDP-M1/M2 | Recommend / onboard assist | Inline + FeatureGated Ops approve |

### Venue

| ID | Route | Status |
|----|-------|--------|
| VEN-01 | `/dashboard/venue` | Rebuilt (legacy client dashboard replaced) |
| VEN-02 | `/venue/apply` | Existing public apply retained |
| VEN-03 | `/venue/profile` | Created |
| VEN-04–06 | `/venue/events`, `/new`, `/[id]` | Created |
| VEN-07 | `/venue/offers` | Created + create form |
| VEN-08 | `/venue/bookings` | Created |
| VEN-09 | `/venue/check-in` | Created (server validate) |
| VEN-10 | `/venue/redemptions` | Created |
| VEN-11 | `/venue/performance` | Created (rank FeatureGated) |
| VEN-12 | `/venue/entitlements` | Created |

---

## APIs

- `GET/POST /api/marketplace/bdp`
- `POST /api/customer` (`check_in_ticket`, `redeem_offer`)
- Privileged reads: venues, attributions, events, offers, bookings, claims, entitlements

---

## 21st.dev (search-only)

| Area | IDs | Adopted | Rejected |
|------|-----|---------|----------|
| Merchant/onboarding | 10480, 19097, 7517 | Step/status structure | 3D gallery / neon |
| Check-in/QR | 6492, 6173 | Confirmation clarity | Client-side QR validity |
| Event/Offer cards | 8229, 7960, 7483 | Operational card density | Countdown urgency spam |

---

## Skills

ui-ux-pro-max, ui-styling, design-system, brand, design, 21st search-only.

---

## Backend gaps

| ID | Gap | Class |
|----|-----|-------|
| BG-19 | Venue representative invite/remove console | Action API / UX |
| BG-20 | Paginated MBDP/Venue portfolios | Pagination |
| BG-21 | Venue aggregated non-purchase feedback DTO | UX read-model |
| BG-22 | MBDP self-serve reassignment request | Action API |

---

## Security / privacy / finance

- Auth for `/marketplace-bdp/*` and Venue partner `/venue/*` (except public apply/plans)
- Recommend ≠ approve; Ops FeatureGated
- Check-in/redeem server token validation
- Settlement gated; Affiliate inactive; live pack payment gated
- Minimal booking PII

---

## Testing / smoke

- `tests/unit/batch5-marketplace-venue-frontend.test.ts` (10)
- Full suite: 208 passed / 11 skipped
- typecheck / scoped lint / build → 0
- Playwright/HTTP smoke (`next start` :3070): public `/` `/login` `/events` `/venue/apply` 200; MBDP + Venue partner routes → login
- Authenticated deep CX deferred (no MBDP/Venue test identity)

## Deferred

- Authenticated deep Playwright CX
- Full representative management (BG-19)
- Batch 6 Enterprise
