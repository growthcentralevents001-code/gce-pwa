# SM_Enterprise_Quote — Enterprise Quotation

## Authority

- **FD-038** Enterprise Cross-Vertical Commercial and Approval Rules (primary; Finance co-sign)
- **FD-026** GCE Enterprise Business and Operating Architecture
- Related: FD-029, FD-028

## Purpose

Model Enterprise **quotation** preparation, internal review, **Finance co-sign when threshold triggered**, issuance, and client acceptance. Launch Finance co-sign threshold: **₹5,00,000** (FD-038 §18).

## States

| State | Meaning |
|-------|---------|
| Draft | Expert/commercial preparing |
| Internal Review | Platform/commercial authority review |
| Finance Co-Sign Required | Threshold triggered; awaiting Finance |
| Finance Co-Signed | Finance signed |
| Issued | Official quotation issued to client |
| Client Review | With client |
| Negotiation | Changes in progress |
| Accepted | Client accepted |
| Rejected by Client | Client declined |
| Superseded | Replaced by newer quote version |
| Withdrawn | Withdrawn by platform |
| Expired | Validity elapsed without acceptance |

## Allowed transitions

| From → To | Actor | Guards |
|-----------|-------|--------|
| Draft → Internal Review | Enterprise Platform Expert / commercial | Linked opportunity/client; componentised lines sketched |
| Internal Review → Finance Co-Sign Required | Commercial / System | Quote value **≥ ₹5,00,000** (threshold interpretation per FD-038 §19) |
| Internal Review → Issued | Authorised commercial/platform | Value **&lt; ₹5,00,000** and review passed |
| Finance Co-Sign Required → Finance Co-Signed | Finance | Co-sign recorded; beneficiary separation |
| Finance Co-Signed → Issued | System / commercial | Co-sign present |
| Internal Review / Finance Co-Sign Required → Draft | Reviewer | Changes required |
| Issued → Client Review | System | Delivered to client |
| Client Review → Negotiation | Client / Expert | Change requests |
| Negotiation → Internal Review / Finance Co-Sign Required | Expert | Material change; re-threshold check |
| Client Review → Accepted | Client Representative | Acceptance authority |
| Client Review → Rejected by Client | Client | Decline |
| Issued / Client Review → Withdrawn | Ops / commercial | Withdraw |
| Issued / Client Review → Expired | System | Validity date passed |
| Accepted → Superseded | System | New quote version replaces (if re-quote) |
| Any pre-accept → Superseded | System | New version issued |

**Flow lock (FD-038 §17):** Expert prepares → authorised commercial/platform reviews → Finance co-sign if threshold → official issue.

## Side effects

- Versioned quote artifacts; component lines (venue, vendors, fees)
- Flag cross-vertical components for no-double-commission design
- On Accepted: may open SM_Enterprise_Project + milestone schedule (project-specific)
- No automatic commission earned on issue alone

## Audit events

`ent_quote.drafted`, `ent_quote.internal_review`, `ent_quote.finance_required`, `ent_quote.finance_cosigned`, `ent_quote.issued`, `ent_quote.negotiation`, `ent_quote.accepted`, `ent_quote.rejected`, `ent_quote.withdrawn`, `ent_quote.expired`, `ent_quote.superseded` — value, threshold evaluation, actors, version.

## Failure handling

- Issue ≥ ₹5,00,000 without Finance co-sign → invalid
- BDP self-approves quote commercially beyond authority → reject
- Material negotiation bypassing re-review/re-threshold → non-compliant

## Terminal states

Accepted, Rejected by Client, Withdrawn, Expired, Superseded.

## Not in scope

- Payment capture (SM_Payment)
- Fixed 30/40/30 milestone template (forbidden as universal — FD-038)

## Unresolved

- Exact threshold basis (pre-tax vs total) detail beyond FD-038 §19 — follow FD text; further edge cases Pending Finance Design if needed
- Quote validity default duration — Pending Commercial / Ops Design
