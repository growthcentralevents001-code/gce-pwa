# ADR-014 — Background Jobs and Scheduling

| Field | Value |
|-------|-------|
| **ID** | ADR-014 |
| **Title** | Background Jobs and Scheduling |
| **Status** | Accepted — jobs foundation live on gce-dev |
| **Date** | 2026-08-08 |
| **Classification** | Technical recommendation (not Founder law) |
| **Supersedes** | None |
| **Dependencies** | ADR-007, ADR-008, ADR-010, ADR-012 |

---

## Context

Settlement holds, reconciliation, webhook retries, notifications, and migration backfills need asynchronous work. The Phase 2 host default is VPS/PM2 (ADR-012), not a mandatory Edge/queue cloud. Jobs must remain idempotent where they touch money or attribution.

---

## Decision

1. **Job categories:** Support at least:
   - Payment webhook retry / outbox drain
   - Settlement eligibility sweeps and hold releases (FD-021 principles)
   - Reconciliation helpers for offline Admin bank recordings (FD-039)
   - Notification delivery
   - Non-urgent backfills/migrations
2. **Execution default:** Run workers/schedulers on the same VPS estate (PM2 cron/worker processes) or Supabase scheduled functions where appropriate. **Managed queue/Edge workers are optional**, not mandatory.
3. **Idempotency & locking:** Money-adjacent jobs must be idempotent and concurrency-safe (unique provider event ids, lease/lock rows, or equivalent).
4. **Authority:** Jobs use server-side credentials (service role only in trusted workers — ADR-005); never expose job admin to anonymous clients.
5. **Observability:** Failures go to structured logs + Sentry; critical job failures alert ops (ADR-010).
6. **No silent financial deletes** from cleanup jobs (ADR-007, ADR-010).

**Label:** Technical recommendation — not Founder law.

---

## Consequences

### Positive

- Decouples web request latency from settlement/notification work.
- Fits current VPS deployment model.
- Encourages idempotent money handling.

### Negative / trade-offs

- Ops must supervise worker processes on VPS.
- Scaling workers is manual until a queue platform is adopted.

---

## Alternatives considered

| Alternative | Why not chosen as mandatory |
|-------------|----------------------------|
| Only inline request processing | Too fragile for webhooks/settlement |
| Mandatory Kafka/SQS day one | Ops overhead; defer until needed |
| Edge cron as sole runner | Not mandatory per FD-039 hosting posture |

---

## Governing FDs

- **FD-021** — Settlement timing/holds (job-driven sweeps allowed)
- **FD-020** — Ledger integrity under async posting
- **FD-039** — Offline reconciliation; Docker/Edge not mandatory

---

## Not in scope

- Exact cron expressions and SLA minutes
- Vendor choice for future managed queues
- AI Lead Assist paid job economics (inactive)

---

## Professional validation

Finance review of settlement sweep behaviour before production release of automated releases/payouts.
