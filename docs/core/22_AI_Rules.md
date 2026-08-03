# AI Rules

## Canonical references

- **AI Lead Assist / Lead Intelligence (highest Founder authority):** `docs/founder-decisions/FD-031_GCE_Connect_AI_Lead_Assist_Architecture.md`
- **Living Lead Assist specification:** `39_AI_Lead_Assist_Spec.md`
- **Narrative:** `10_AI_Lead_Assist.md`
- **Commercial constants:** `36_Commercial_Constants.md` (Lead Assist prices Unresolved — do not treat historical ₹500 as active)
- **Membership commercial (separate):** FD-027 / `05_Memberships.md`
- **Circle context:** FD-030 / `38_Circle_Architecture.md`

This file covers the broader GCE AI Engine. For Lead Assist lifecycle, rights, routing, monetisation, and human oversight, follow **FD-031** and `39_AI_Lead_Assist_Spec.md`. Do not restate obsolete Validation Fee / Rainmaker-only / Pass Lead / Deficit Reward rules as active Stage-1 commercial.

---

## Overview

The GCE AI Engine is the intelligence layer of the platform. For opportunities, GCE operates **one central GCE Lead Intelligence Engine** with vertical-specific rules, supported by the **GCE Lead Intelligence and Opportunity Desk**.

AI works **with** human verification — it does not replace human judgment for high-risk, low-confidence, disputed, regulated, privacy-sensitive, or high-value cases.

---

## AI objectives

- Classify and match opportunities intelligently
- Support fair eligibility-based routing
- Improve referral and lead quality
- Detect fraud and duplicate signals
- Support analytics and explainability
- Never guarantee sale, conversion, or revenue

---

## AI modules

- AI Lead Assist / Lead Intelligence (FD-031)
- Business Matching
- Circle Matching
- Tag / Specialization Matching
- Lead Verification Support
- Referral Intelligence
- Recommendation Engine (Future)
- Business Analytics (Future)

Legacy label **Rainmaker Engine** may appear in historical code or docs — treat as legacy naming pending migration; do not implement as the sole Stage-1 architecture.

---

## Lead Assist — binding constraints (FD-031)

1. **Core Lead Rights protected** — do not gate ordinary give/receive/view on premium purchase or mandatory validation fee.
2. **Quality states** — Unverified · Preliminarily Verified · Qualified · Rejected/Invalid.
3. **Parties** — distinguish Lead Source / Giver / Verifier / Receiver / Selected Provider / Closer / Collaborator / Commercial Beneficiary.
4. **Routing** — eligibility-first; Circle-first for ordinary local Connect; paid products must not buy priority or override Specialization / Protected Tag Scope.
5. **Human control** — AI may recommend/classify/match/route/flag; AI may **not** award projects, transfer money, approve refunds/settlement, suspend/terminate membership, permanently alter Trust Rank, grant/deny Core Tier, or decide serious disputes.
6. **Human review mandatory** for low-confidence, high-value, regulated, privacy, fraud, disputed, Enterprise-escalation, and restriction cases.
7. **Preserve** original source, assignment history, AI confidence, rule/model version, and override audit. No hard-delete except approved legal privacy workflow.
8. **No automatic success fee** at Stage 1; Lead Assist commission not automatic (FD-029).
9. **No guarantee** of commercial outcome.

Full workflow, deadlines, monetisation levels, phased launch, and unresolved list: `39_AI_Lead_Assist_Spec.md`.

---

## General AI behaviour (non–Lead Assist)

- Prefer documented business taxonomy (GC Power Sector → Business Specialization → Tags).
- Do not invent scoring weights, exclusivity rules, or Trust Rank penalties.
- Log AI-supported decisions with confidence and version where applicable.
- Stakeholder favouritism and hidden personal commission from selections are prohibited.
- Expert Desk / authorised human override is required for serious Lead Assist interventions — not silent “admin-only” black-box changes without audit.

---

## Cross references

- FD-031 · `39_AI_Lead_Assist_Spec.md` · `10_AI_Lead_Assist.md`
- `14_Business_Rules.md` · `36_Commercial_Constants.md`
- `.cursor/rules/07_AI_Rules.mdc`
