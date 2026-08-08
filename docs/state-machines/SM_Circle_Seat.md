# SM_Circle_Seat — Circle Specialization Seat

## Authority

- **FD-022** Membership Lifecycle (seat reservation, waitlist, grace protection)
- **FD-024** Circle Lifecycle (seat availability, one specialization = one seat)
- **FD-030** Circle Architecture (capacity, specialization, verification before seat activation)
- **FD-036** Membership Attribution, Approval, and Allocation Authority

## Purpose

Model a **business-specialization seat** inside a specific Circle. Membership belongs to the member account; the seat belongs to specialization × Circle (FD-024 §26). **Allocation ≠ membership activation.** Hard maximum: **40** active seats per Circle.

## States

| State | Meaning |
|-------|---------|
| Available | Specialization seat open in Circle |
| Reserved | Temporary hold (approved reservation window: **7 days** per FD-022) |
| Waitlisted | Applicant queued for preferred Circle/category |
| Pending Verification | Seat candidate allocated pending verification outcomes |
| Allocated / Occupied | Formal platform allocation recorded; counts toward capacity when active |
| Protected (Grace) | Seat protected during membership grace where policy applies (FD-022 §25) |
| Transfer Pending | Seat change / Circle transfer in progress |
| Released | Seat freed; history preserved |
| Blocked | Overlap / conflict / compliance block |

Pending, suspended, expired, frozen, and waitlisted users do **not** count as active seats except where an approved seat-protection rule applies (FD-030 §4).

## Allowed transitions

| From → To | Actor | Guards |
|-----------|-------|--------|
| Available → Reserved | System / Connect BDP (assist) / Ops | Capacity &lt; 40; specialization free; member eligible |
| Reserved → Available | System | Reservation expired (7 days) or cancelled |
| Reserved → Pending Verification | Ops / Compliance | Reservation accepted; verification required before seat activation |
| Available / Reserved → Waitlisted | System / Ops | Preferred seat unavailable; alternate routing incomplete (FD-036) |
| Waitlisted → Reserved / Pending Verification | Ops | Seat opens; member next in policy order |
| Pending Verification → Allocated / Occupied | Platform Ops | Verification complete; platform records allocation (Circle, specialization, Tags, attribution link if any) |
| Pending Verification → Released / Waitlisted | Ops | Verification fail or member declines alternate |
| Allocated → Protected (Grace) | System | Membership enters Grace with seat protection |
| Protected → Allocated / Released | System / Ops | Grace cured vs expired per policy |
| Allocated → Transfer Pending | Ops / member process | Transfer approved to start |
| Transfer Pending → Released (old) + Allocated (new) | Platform Ops | New seat confirmed; old released; history preserved |
| Allocated → Released | Ops | Termination, transfer complete, or approved release |
| * → Blocked | Ops / Compliance | Conflict / overlap / compliance |
| Blocked → Available / Waitlisted | Ops | Block cleared |

Connect BDP may recommend allocation but **cannot** create seats beyond 40 or self-finalize allocation (FD-036).

## Side effects

- Decrement/increment active seat count used by SM_Circle constitutional mapping
- Restrict or unlock Circle-specific rights on allocation
- Link membership ↔ Circle ↔ specialization ↔ Tags
- Start/stop reservation timer
- On release: preserve historical seat record; do not silently rewrite history

## Audit events

`seat.reserved`, `seat.reservation_expired`, `seat.waitlisted`, `seat.verification_started`, `seat.allocated`, `seat.protected_grace`, `seat.transfer_started`, `seat.released`, `seat.blocked` — actor, Circle id, specialization, membership id, previous/new state, reason.

## Failure handling

- Capacity full → Waitlisted or alternate Circle; never overfill
- Payment without allocation → membership may be Active; seat remains Available/Waitlisted
- Duplicate specialization in same Circle → Blocked / reject
- Reservation race → optimistic lock / platform confirmation wins

## Terminal states

Released (historical), permanently Blocked (rare; may unblock).

## Not in scope

- Membership commercial lifecycle
- Connect BDP commission
- Tag pricing

## Unresolved

- Exact waitlist priority algorithm — Pending Operational Design (FD-036)
- Exact seat-protection edge cases beyond FD-022 grace principle — Pending if not covered
