# Data Breach and Incident Response Plan

| Field | Value |
|-------|-------|
| **Document ID** | P15-IR-001 |
| **Status** | DRAFT — SECURITY/LEGAL/PRIVACY REVIEW REQUIRED |
| **Checked** | 2026-08-15 |

**Do not invent statutory notification periods** beyond what primary sources state.

---

## Sources used

- CERT-In Direction 20(3)/2022-CERT-In (28 Apr 2022): specified incidents to CERT-In within **6 hours** of noticing; 180-day logs (SRC-012).
- DPDP Rules 2025 / PIB: when **commenced**, Data Fiduciaries must inform affected individuals in plain language (nature, consequences, steps, contact). **Substantive DPDP duties are phased (SRC-002/003)** — counsel must confirm whether affected-user intimation is live at the incident date. PIB also describes Data Principal request outer bound of 90 days — that is **not** a breach clock.
- Do **not** copy a GDPR 72-hour rule as Indian law.

---

## 1. Detection

- Sentry, application logs, Supabase logs, host alerts, UptimeRobot (if used), staff report, user report, PSP notice.
- Clocks start when the organisation **notices** or is **brought to notice** (CERT-In wording).

## 2. Triage

Severity (internal):

| Sev | Examples |
|-----|----------|
| SEV1 | Confirmed personal-data exfiltration; payment secret leak; credential-key leak; unauthorised money movement |
| SEV2 | Suspected account takeover at scale; RLS failure; QR token logged in plaintext |
| SEV3 | Isolated account issue; dependency outage without data loss |

## 3. Containment

- Rotate secrets (see production secrets checklist).
- Disable compromised keys / service role.
- Feature-flag money and messaging remain OFF unless already on (they must not be on in Phase 15).
- Do not destroy logs.

## 4. Preserve evidence

- Snapshot logs (180-day duty).
- Record timeline, systems, identities (need-to-know).
- Legal hold on relevant tickets/cases.

## 5. Internal escalation

Proposed (names **MISSING — FOUNDER/PROFESSIONAL INPUT REQUIRED**):

Founder → Security lead → Privacy/Legal → Finance (if money) → Ops/Support.

## 6. Affected systems checklist

Auth, Postgres, storage, payment provider, Sentry, email/SMS, AI provider, VPS, CI, credential encryption, Lead Assist contacts, KYC.

## 7. Legal / privacy review

Counsel decides:

- CERT-In Annexure I match → report within **6 hours** via incident@cert-in.org.in / 1800-11-4949 (SRC-012).
- DPDP affected-user notice **if that duty has commenced**.
- Consumer/PSP/Venue/BDP contract notices.
- Law-enforcement if required.

**Cursor does not decide “must notify” vs “must not”.**

## 8. User communication

Only after legal/privacy decision. Plain language; no admission beyond facts counsel approves.

## 9. Remediation

Patch, rotate, user resets, ticket re-issue if credentials exposed, post-incident review within a Founder-set operational target (not a fake statute).

## 10. Post-incident

Blameless review; update this plan; professional sign-off matrix PS-SEC-005.

---

## QUESTIONS FOR PROFESSIONAL REVIEW

1. Confirm CERT-In Annexure I mapping for typical SaaS incidents.  
2. Confirm DPDP breach-intimation commencement vs Pilot date.  
3. Confirm log location (India copy) for current host.  
4. Appoint incident commander and CERT-In Point of Contact.

## QUESTIONS REQUIRING FOUNDER DECISION

Name the Point of Contact and 24/7 path (FD15-ENT-001 related).
