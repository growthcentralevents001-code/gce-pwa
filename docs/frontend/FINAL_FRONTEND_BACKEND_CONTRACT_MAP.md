# Final Frontend ↔ Backend Contract Map

| Field | Value |
|-------|-------|
| **Status** | Planning — expands Phase 14A map |
| **Rule** | Frontend presents server state; never owns commercial truth |

### Columns

Page group → Role → API/service → Flag notes → State machine → Errors → Audit impact

---

## Identity / workspace

| Page/action | Role | API | Permission | Flags | SM | Errors | Audit |
|-------------|------|-----|------------|-------|-----|--------|-------|
| Me / profile | auth | `GET /api/identity/me` | session | — | — | 401 | soft |
| List workspaces | auth | `GET /api/identity/workspaces` | active assignments | — | — | 403 | — |
| Switch workspace | auth | client nav + server AuthZ on next page | assignment to key | — | — | 404/403 | workspace preference |
| Role assign (admin) | platform | `/api/admin/role-assignments` | privileged | — | SM_Role_Assignment | SoD | assignment events |

---

## Customer CX

| Page/action | Role | API | Permission | Flags | SM | Errors | Audit/events |
|-------------|------|-----|------------|-------|-----|--------|--------------|
| Discover events/offers | user | `GET /api/customer?view=…` | `cx.discover` | — | — | empty | analytics |
| Book | user | `POST /api/customer` book | `cx.book` | `customer_booking`; payments OFF | SM_Payment / Event | capacity | booking events |
| Tickets / QR | user | customer tickets | `cx.ticket.read_own` | — | Redemption | 404 IDOR | — |
| Cancel | user | cancel action | `cx.cancel_own` | 48h policy | Event/Refund | ineligible | domain |
| Refund request | user | refund_request | `cx.refund_request` | `refund_processing` OFF; OD-006 | SM_Refund | manual_review | finance handoff |
| Claim / redeem | user/venue | claim/redeem | cx.* | `offer_claims` | SM_Offer_Claim / Redemption | expired/cap | claim≠revenue |

---

## Connect / Lead Assist

| Page/action | Role | API | Permission | Flags | SM | Notes |
|-------------|------|-----|------------|-------|-----|-------|
| Membership CRUD/status | member/ops | `/api/connect/memberships` | connect | associate purchase gated | SM_Membership | activation≠allocation |
| Circles / seats | member/ops | `/api/connect/circles` | connect | — | SM_Circle / Seat | seat 41 server |
| Connect BDP | connect_bdp | `/api/connect/bdp` | bdp | pack payments OFF | BDP SMs | no commission invent |
| Lead create/route | member | `/api/lead-assist` | lead.* | Stage1 ON; paid OFF | SM_Lead_Assist | no finance post |
| Desk assign | opportunity_desk | lead-assist desk | desk.* | `opportunity_desk` | — | no commission |

---

## Marketplace / Venue / Enterprise / Finance / Ops

| Domain | API | Key flags OFF | Notes |
|--------|-----|---------------|-------|
| Marketplace BDP | `/api/marketplace/bdp` | pack payments; ticket payments | 80/10/10 vs 80/0/20 server |
| Venue manage | marketplace services via API extensions | — | **BACKEND GAP**: dedicated venue staff routes beyond CX venue actions |
| Enterprise | `/api/enterprise` | pack payments; vendor portal | >₹5L co-sign server |
| Finance | `/api/finance` | settlement/payout/recognition live | no ledger mutate |
| Ops governance | `/api/ops` | live notify OFF | prefs, privacy, risk |
| Ops admin | `/api/ops/admin` | — | SoD self-approval |
| Jobs | `/api/jobs/run` | service | retries/idempotency |
| Payments webhook | `/api/webhooks/payments` | money OFF | signature |

---

## Legacy APIs — do not wire final UI

| API | Disposition |
|-----|-------------|
| `/api/affiliate/*` | Retire; inactive FD-039 |
| `/api/wishlist/*` | Replace with canonical CX prefs/wishlist later |
| `/api/public-search`, `/api/cities`, `/api/venues/by-city` | Replace with canonical discovery reads |
| `/api/venue/onboard`, `/api/venue-plans` | Canonicalise or wrap marketplace venue onboard |
| `/api/ticket/qr` | Merge into CX ticket API |

---

## Feature-flag presentation rules

UI may show **gated** states (“Payments coming soon”) when flags OFF — never silent success paths for money/settlement/live SMS.
