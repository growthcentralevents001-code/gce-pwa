# Internal Access and Confidentiality Control

| Field | Value |
|-------|-------|
| **Document ID** | P15-IAC-001 |
| **Status** | DRAFT — LEGAL/SECURITY REVIEW REQUIRED |
| **Checked** | 2026-08-15 |

Do not expose all information to generic internal users.

---

## Role expectations (product — not employment classification)

Employment vs contractor classification is **Legal** (do not hard-code).

| Role family | May access | Must not | Confidentiality |
|-------------|------------|----------|-----------------|
| Platform Ops | Operational queues in vertical | Other vertical PII beyond need | Platform data is Logixia’s |
| Finance | Ledgers, entitlements, reports | Lead identities (Phase 14B finance report has no lead id) | Commercials |
| Compliance | Holds, privacy requests, KYC metadata | Gratuitous document copies | Highest |
| Support | Assigned cases | Unassigned KYC/Leads | Ticketing hygiene |
| Opportunity Desk | Lead queue, manual review, reveal **per workflow** | Broad dump of all contacts | Lead confidentiality; audit |
| PRM / RM | Relationship work in scope | Binding Logixia; other Circles’ Leads | FD-034 |
| Enterprise Experts | Assigned projects | Other clients | Client data |
| BDP | Own attributed work | Platform-wide PII; authority to bind | Licence draft |

## Opportunity Desk — legal/privacy justification (for counsel)

- Purpose: unpaid Stage 1 matching quality and abuse control (FD-031).  
- Minimum: queue fields without contact; contact after authorised reveal; audit of reveal.  
- No broad access “because internal”.

## QUESTIONS FOR PROFESSIONAL REVIEW

Staff NDAs; Desk SOP; whether employees need separate confidentiality deeds.

## QUESTIONS REQUIRING FOUNDER DECISION

Which humans occupy Desk/Finance/Ops in Pilot.
