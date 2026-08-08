# SM_KYC_Verification — KYC / Identity Verification

## Authority

- **FD-039** Phase 2 Commercial Acceptance and Compliance Direction (Aadhaar posture)
- **FD-022** / **FD-036** Membership verification gates
- **FD-030** Business verification minimum conditions (Circle seat)
- **FD-033** Venue verification
- **FD-035** Role activation conditions may require KYC
- Related: FD-020 (no financial movement inventing KYC), FD-034 (corporate constitution context)

## Purpose

Model identity and business **verification cases** used as guards for membership activation, seat activation, BDP/role activation, and venue onboarding. **Aadhaar is not mandatory by default** (FD-039 §21). Prefer data-minimised verification approaches; use Aadhaar only where legally required or explicitly justified.

## States

| State | Meaning |
|-------|---------|
| Not Started | No verification case |
| In Progress | Documents / checks underway |
| Additional Info Required | Gaps requested from subject |
| Under Review | Manual compliance review |
| Conditionally Cleared | Cleared with conditions / time-boxed |
| Cleared | Passed for stated purpose/scope |
| Failed | Failed checks |
| Expired | Clearance validity ended |
| Revoked | Cleared status withdrawn |
| Waived (Exception) | Rare approved exception — audited |

Purpose/scopes are distinct (membership, seat, BDP pack, venue, Enterprise client rep, etc.) — one User may have multiple cases.

## Allowed transitions

| From → To | Actor | Guards |
|-----------|-------|--------|
| Not Started → In Progress | Subject / Ops / System | Purpose declared; minimised field set |
| In Progress → Additional Info Required | Compliance / Ops | Missing evidence |
| Additional Info Required → In Progress | Subject | Info supplied |
| In Progress → Under Review | System | Manual threshold |
| Under Review / In Progress → Cleared / Conditionally Cleared / Failed | Compliance / Ops | Policy outcomes; **Aadhaar not required by default** |
| Conditionally Cleared → Cleared | Compliance | Conditions met |
| Conditionally Cleared / Cleared → Expired | System | Validity elapsed |
| Cleared / Conditionally Cleared → Revoked | Compliance | Cause |
| Failed → In Progress | Subject / Ops | Reattempt allowed |
| * → Waived (Exception) | Authorised Compliance / Ops | Written exception; not for convenience alone |

**Aadhaar guard:** May be requested only where required by law/regulation or explicit approved edge-case workflow (FD-039 §23). No workflow may require Aadhaar merely because it is convenient.

## Side effects

- Unblock or continue blocking SM_Membership activation, SM_Circle_Seat activation, SM_Role_Assignment Active, venue approval
- Store evidence refs with retention per privacy policy (compliance register — FD-039)
- Never treat Cleared as payment success or commission earned

## Audit events

`kyc.started`, `kyc.info_required`, `kyc.under_review`, `kyc.cleared`, `kyc.conditional`, `kyc.failed`, `kyc.expired`, `kyc.revoked`, `kyc.waived` — purpose/scope, actor, lawful basis flags, whether Aadhaar used (yes/no), reason. Minimise PII in event payloads.

## Failure handling

- Provider outage → remain In Progress; do not invent Cleared
- Aadhaar-mandatory misconfiguration in product — treat as defect vs FD-039
- Failed KYC with successful payment → membership stays Pending Verification (SM_Membership); escrow/pending finance rules apply

## Terminal states

Cleared (until Expired/Revoked), Failed (may retry), Waived (exception record), Revoked.

## Not in scope

- Full Applicable Law Register contents (FD-039 requires register; not duplicated here)
- Payment MoR legal opinions
- Storing Aadhaar numbers in analytics events

## Unresolved

- Exact non-Aadhaar preferred document matrix by role — Pending Compliance / Product Design (direction: minimise; prefer alternatives)
- Retention periods — Pending Privacy / Compliance Register output
- Edge-case Aadhaar workflows — Pending Compliance Design (gated before production where required)
