# Phase 10 — AI Lead Assist & Opportunity Management Implementation Notes

| Field | Value |
|-------|-------|
| **Status** | Implemented on **gce-dev** (`hvevqoltcwumcvxetxsf`) |
| **Date** | 2026-08-08 |
| **Authority** | FD-031 / FD-032 / FD-035 / FD-036 / FD-039; SM_Lead_Assist |
| **Migration** | `supabase/migrations/20260808210000_phase10_ai_lead_assist.sql` |
| **Production** | Untouched (`tzeqeywezmqslovpflqu`) |
| **Commercial stage** | **Unpaid Stage 1 only** |

---

## Authority map used

| Topic | Controlling source | Implementation choice |
|-------|--------------------|----------------------|
| Lead Intelligence + Assistive AI | FD-031 | AI recommends; humans / Desk decide commercial outcomes |
| Stage 1 unpaid launch | FD-031 §87 / FD-039 | `lead_assist_stage1` ON; all paid flags OFF |
| ₹500 / escrow / success fee / pay-to-receive | FD-031/032/039 | Quarantined in `legacy_lead_assist_migration_map` + flags OFF |
| Opportunity Desk role | FD-035 | Canonical `opportunity_desk` + workspace `opportunity-desk` |
| Circle-first routing | FD-031 | Deterministic tier: circle_first → cross_circle → wider_network |
| Dual-confirmed closed business | FD-030/031 | `assist_lead_outcomes` + `gce_assist_reconcile_outcome`; **no** Phase 9 revenue post |
| Tag max 4 | FD-027 / Phase 5 | Consumes `membership_tags` only; does not create tags |
| Formal leads in-app | FD-031 / Connect ops | `assist_leads.source` constrained; WhatsApp/paper not SoT |

## Prompt-vs-FD discrepancies recorded

1. Prompt filename `PHASE_10_AI_LEAD_ASSIST_AND_OPPORTUNITY_MANAGEMENT.md` — repo file is `PHASE_10_AI_LEAD_ASSIST.md` (used).
2. Prompt listed many work statuses including `draft`/`contact_revealed`; SM uses quality + working families — both mapped: quality enum + work_status enum aligned to SM terminal names (`closed_dual_confirmed`, `closed_unconverted`).
3. Prompt suggested exact SLA accept timers — **not Founder-approved numbers**; expiry uses configurable `DEFAULT_LEAD_TTL_HOURS=72` (operational, non-contractual).
4. No kilometre radius invented — geography uses city/district/state/locality fields only.

## Domain model (additive)

Canonical SoT tables (legacy `leads` / `circle_leads` / `referrals` / `bdm_leads` remain **historical**):

- `assist_leads`
- `assist_lead_requirement_versions`
- `assist_lead_ai_runs` / `assist_lead_ai_classifications`
- `assist_lead_routing_candidates` (**≠ assignment**)
- `assist_lead_assignments` + `assist_lead_assignment_events` (one active assignment)
- `assist_opportunity_desk_queue`
- `assist_contact_reveal_events`
- `assist_lead_outcomes` + `assist_closed_business_confirmations`
- `assist_lead_duplicate_flags` / `assist_lead_abuse_flags` / `assist_lead_reassignments`
- `assist_domain_events` (analytics + Phase 12 notification hooks)
- `legacy_lead_assist_migration_map`

## AI provider abstraction

- Interface: `LeadAssistAiProvider` in `lib/architecture/lead-assist/ai-provider.ts`
- Stage-1 default: `DeterministicLeadAssistProvider` (`deterministic_fallback` / `rules-v1`)
- Structured output validated with Zod (`AiClassificationOutputSchema`)
- Contact PII redacted before classification (`sanitiseRequirementForAi`)
- Invalid AI output / provider failure → deterministic fallback + desk review
- Low confidence (`< 5500` bps) → Opportunity Desk

## Contact reveal model

- Candidates never receive full lead/contact via RLS (candidates desk-only)
- Reveal requires **active accepted assignment** + `contact_reveal` flag
- `paid_contact_reveal` forced OFF
- Each reveal audited (`assist_contact_reveal_events` + audit events)

## Outcome / dual confirmation

- Either party submits amount → pending
- Matching amounts → `confirmed` + lead `closed_dual_confirmed`
- Mismatch → `disputed` + desk escalation
- `creates_finance_transaction` CHECK + trigger **always false** — no revenue_component / commission / wallet debit

## Feature flags

| Flag | Enabled |
|------|---------|
| `lead_assist_stage1` | ON |
| `ai_lead_classification` | ON |
| `ai_candidate_ranking` | ON |
| `opportunity_desk` | ON |
| `contact_reveal` | ON |
| `paid_lead_assist` / `lead_escrow` / `lead_success_fee` / `pay_to_receive_leads` / `paid_contact_reveal` / `rupee_500_lead_fee` | **OFF** |

## APIs / UI

- API: `GET/POST /api/lead-assist`
- Domain: `lib/architecture/lead-assist/*`
- Workspace panels: Connect/Personal sent+received; Opportunity Desk queue
- Does **not** modify dirty venue/home/hero/UI WIP files beyond adding isolated panels on canonical `[workspaceKey]` dashboard

## Verification (gce-dev)

- Migration applied via session pooler to **gce-dev only**
- SQL harness: `PHASE10_LEAD_ASSIST_OK` (assignment uniqueness, dual confirm, finance block)
- Unit tests: Phase 10 suite green
- `lib/database.types.ts` regenerated from gce-dev
- Money / paid Lead Assist flags remain OFF; Phase 9 `payout_execution` OFF

## Privacy / professional validation (non-blocking)

Open (OD-010): model-training terms, exact retention durations, vendor DPA wording, final consent copy.
Architecture keeps no-train default metadata and configurable retention hooks — no invented Legal conclusions.

## Not started

- Phase 11 Events / Offers / Booking UX
- Full Phase 12 notification delivery engine (hooks only)
- Paid Lead Assist Stage 2+
