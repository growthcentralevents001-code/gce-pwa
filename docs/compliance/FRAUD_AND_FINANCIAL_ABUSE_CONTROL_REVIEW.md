# Fraud and Financial Abuse Control Review

| Field | Value |
|-------|-------|
| **Document ID** | P15-FRD-001 |
| **Status** | REVIEW-ONLY — GCE is **not** described as a regulated financial institution |
| **Checked** | 2026-08-15 |

Security/fraud monitoring can remain review-only. Money flags OFF reduces live fraud surface.

---

| Threat | Current control (technical) | Gap | Pilot | Production |
|--------|-----------------------------|-----|-------|------------|
| Fake Venue | Ops approval; MBDP recommend ≠ Ops approve | Staffing | Process | Same |
| Fake Event | Event approval states | UGC images | Ops | Moderation |
| Fake booking | Auth + payment intent (payments OFF) | When payments ON | Low | PSP + velocity |
| Duplicate redemption | Hash verify tickets/claims | — | PASS technical | Same |
| Payout fraud | Payout execution OFF | When ON: SoD + KYC | N/A | Blocker if no SoD |
| Commission manipulation | Attribution rules; no retroactive unattributed 10% | Dispute ops | Review | Finance audit |
| Account takeover | Auth provider | MFA policy UNKNOWN | Review | Security |
| Chargeback abuse | Concepts; execution OFF | Policy OD-006 | N/A | Payments counsel |
| Lead Assist abuse | Desk + dual confirm; unpaid | — | Review | Same |
| Self-approval | Forbidden in product | Dual-hatted humans | Staffing | Blocker candidate |

## QUESTIONS FOR PROFESSIONAL REVIEW

Whether any AML statute applies merely because of marketplace collections — **do not assume**. PSP will have its own merchant monitoring.

## QUESTIONS REQUIRING FOUNDER DECISION

Risk appetite for invite-only vs public Pilot.
