# Batch 2 — Customer Events, Offers, Booking & Tickets Implementation

| Field | Value |
|-------|-------|
| **Status** | **COMPLETE — Customer Mobile Checkpoint B ready for review** |
| **Date** | 2026-08-09 |
| **Branch** | `development` |
| **Commit message** | `feat: implement Batch 2 customer events offers booking and tickets` |
| **Batch 3** | Not started |
| **Phase 14B / production** | Not started / untouched |

---

## Routes created / rebuilt

| Inventory | Route | Action |
|-----------|-------|--------|
| CUS-01 | `/customer` | Rebuilt premium dashboard |
| CUS-02 | `/customer/events` | Rebuilt discovery + filters + pagination |
| CUS-03 | `/customer/events/[id]` | Rebuilt detail + sticky booking CTA |
| CUS-06 | `/customer/events/[id]/book` | **Created** booking flow |
| CUS-04 | `/customer/offers` | Rebuilt discovery |
| CUS-05 | `/customer/offers/[id]` | Rebuilt detail + claim |
| CUS-07 | `/customer/bookings/[id]` | **Created** confirmation / manage |
| CUS-10 | `/customer/bookings` | **Created** history |
| CUS-08 | `/customer/tickets` | Rebuilt list |
| CUS-09 | `/customer/tickets/[id]` | **Created** detail |
| CUS-11 | `/customer/claims` | **Created** claims + feedback |
| CUS-12 | `/customer/wishlist` | **Created** FeatureGated (P2) |
| — | `/customer/profile` | **Created** links to Batch 1 onboarding |

### Redirects / adapters

| Legacy | Behaviour |
|--------|-----------|
| `/booking/[eventId]` | Redirect → `/customer/events/[eventId]/book` |
| `/bookings` | Redirect → `/customer/bookings` |
| `/checkout` | Redirect → `/customer/events` |
| `/events/[id]` | SEO wrapper → customer detail/book CTAs (canonical APIs) |
| `/events`, `/offers` | Batch 1 public wrappers (unchanged entry) |

---

## Components

### New (`components/customer/`)

- `EventCard`, `OfferCard`, `TicketPassCard`, `ActiveClaimCard`
- `DiscoveryFilters` (search + mobile Sheet filters + chips)
- `StickyBookingBar`, `QuantityStepper`, `BookingFlow`
- `ClaimOfferFlow`, `ClaimTokenReveal`, `NonPurchaseFeedback`
- `BookingActions` (cancel + refund-request sheets)
- `BookingQrReveal`, `QrDisplay`, `ExpiryCountdown`
- `CxPageHeader`

### shadcn added

- `components/ui/checkbox.tsx` (Radix already present)

### Replaced / retired

| Old | Decision | New |
|-----|----------|-----|
| Phase 11 plain customer list pages | REPLACE | Premium CX pages |
| `book-form.tsx` | RETIRE | `BookingFlow` + `/book` route |
| `claim-form.tsx` | RETIRE | `ClaimOfferFlow` |
| Legacy `/booking/*`, `/bookings`, `/checkout` | RETIRE → redirect | Customer CX |
| Dirty `/events/[id]` client booking UI | REPLACE | Public SEO adapter |

---

## APIs integrated

All via `/api/customer` + privileged server reads of Phase 11 services:

- GET views: `dashboard`, `events`, `event`, `offers`, `offer`, `bookings`, `tickets`, `claims`, `trust_rank`
- POST: `create_booking`, `confirm_booking_sandbox`, `cancel_booking`, `request_refund`, `evaluate_cancel`, `claim_offer`, `non_purchase_reason`

Money flags remain OFF (asserted by backend). Payments not enabled.

---

## Backend gaps (recorded)

- **BG-06** wishlist — gated
- **BG-11** ticket QR re-display — one-time tokens only
- **BG-12** claim token re-display — one-time + session stash

---

## 21st.dev register (search-only)

| Component | References | Pattern adopted | Rejected |
|-----------|------------|-----------------|----------|
| EventCard | 1816, 2830, 2522 | Hover lift + image scale; mobile works without hover | Cursor-follow reveal (a11y/perf) |
| OfferCard | 7960, 7941, 8442 | Promo gradient + claim chips | Fake commerce GMV |
| TicketPassCard | 22433, 6492, 13570 | Stub/perforation aesthetic | Client QR invent |
| Filters | 22213, 6602, 19360 | Chips + bottom sheet | Magnetic physics drawer |
| Claim | 5247, 7767 | Success reveal + redeem present | Customer self-sale complete |

---

## Skills used

- **ui-ux-pro-max**: sticky CTA padding, mobile-first, touch targets, filter sheet
- **ui-styling**: card polish, glass, badges, QR contrast
- **design-system / MASTER.md**: orange/blue tokens, Poppins/Righteous
- **brand**: GCE Marketplace still reads as GCE
- **design**: discovery hero gradients (no fake galleries)
- **21st.dev**: search-only inspiration as above

---

## Animation register

| Surface | Behaviour | Impl | Reduced motion |
|---------|-----------|------|----------------|
| Event/Offer cards | Lift on hover | `motion` spring | Static |
| Booking confirm | Scale-in celebrate | `BookingConfirmMotion` | Skip |
| Claim success | Scale/fade | `ClaimOfferFlow` | Skip |
| Filters sheet | Slide | shadcn Sheet | OS/reduced via CSS |
| Dashboard sections | Entrance | `AnimatedSection` | Static |

---

## Glass register

| Surface | Why | QR/contrast |
|---------|-----|-------------|
| Event detail overlay | Hierarchy on hero | Text only |
| Sticky booking card (desktop) | Floating CTA depth | N/A |
| Ticket pass panel | Premium pass feel | QR separate high-contrast white |
| Claim panels | Soft emphasis | QR on white board |

---

## Checkpoint B — Customer mobile UX

Reviewed pattern coherence for ~390×844:

- Bottom nav: Home / Events / Offers / Tickets / Profile
- Sticky booking CTA above bottom nav
- Filter bottom sheet on discovery
- Ticket pass + claim countdown readable
- Touch targets ≥44px on steppers/CTAs

**Ready for Founder/Product mobile review.** Do not start Batch 3 until Checkpoint B approved.

---

## Security / privacy / SEO

- Private CX routes: `robots: noindex`
- Auth redirect via `sanitizeAuthRedirect`
- No client inventory / refund % / commission / rank formula
- QR from server tokens only; hashes never exposed
- Venue redemption / check-in not in customer UI

---

## Testing & gates

- Vitest: `tests/unit/batch2-customer-cx-frontend.test.ts`, `batch2-customer-cards.test.ts` + full suite green (177 passed)
- `npm run typecheck` pass
- `npm run build` pass (includes new CX routes)
- Scoped eslint on Batch 2 paths — 0 errors (minor react-hooks warnings cleared on QR/session helpers)

### Playwright / browser smoke (port 3042)

| Viewport | Route | Result |
|----------|-------|--------|
| 390×844 | `/events` | OK — public SEO wrapper, CTA to CX, 0 console errors |
| 1366×768 | `/offers` | OK — public offers entry |
| — | `/customer/events` | Auth redirect to `/login?redirectTo=/customer/events` (expected) |
| — | `/booking/*`, `/checkout` | Proxy auth gate then server redirects to CX after login |

Authenticated deep CX flows (book/claim/ticket QR) require a signed-in session — not exercised here; backend contracts covered by Phase 11 tests + Batch 2 unit helpers. Full E2E deferred to Phase 14B.

## Deferred / non-blocking

- Refund economics (OD-006)
- Trust Rank formula (display foundation / gated)
- Venue rank public display
- Production payments
- Wishlist write API
- Ticket/claim QR re-issue endpoints (BG-11/12)
- Full Playwright E2E (Phase 14B)

## Confirmation

Batch 3 has **not** been started. Production flags unchanged. No schema migrations in this batch.
