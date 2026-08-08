# Phase 12 — Notifications, Analytics, Audit, Security & Compliance Implementation Notes

| Field | Value |
|-------|-------|
| **Status** | Implemented on **gce-dev** (`hvevqoltcwumcvxetxsf`) |
| **Date** | 2026-08-08 |
| **Authority** | FD-020 / FD-023 / FD-031 / FD-034 / FD-035 / FD-039; ADR-010/013/014; OD-008/009/010 |
| **Migration** | `supabase/migrations/20260808230000_phase12_notifications_analytics_security_compliance.sql` |
| **Production** | Untouched (`tzeqeywezmqslovpflqu`) |
| **Live providers** | Email / SMS / Push live flags **OFF**; marketing OFF; retention_enforcement OFF |

---

## Authority map used

| Topic | Controlling source | Implementation choice |
|-------|--------------------|----------------------|
| Notification channels | Phase 12 plan + ADR-014 | In-app primary; email/SMS/push sandbox adapters |
| Consent / preferences | Phase 12 plan | Marketing opt-in; security/transactional non-optional vs marketing opt-out |
| Audit immutability | ADR-010 / FD-020 | Reuse `audit_events`; review API does not expose before/after bags |
| Retention periods | OD-009 / FD-039 | `retention_policies.period_status=pending_validation`; enforcement OFF |
| Fraud actions | FD-031 human review posture | `risk_signals.auto_action_applied=flag_only` only |
| Aadhaar / KYC access | FD-039 | `sensitive_access_events` without copying document contents |
| Money movement | FD-039 / Phase 9 | Ticket/settlement/payout remain OFF |

## Prompt-vs-FD discrepancies recorded

1. Prompt filename `…SECURITY_COMPLIANCE.md` — repo plan is `PHASE_12_NOTIFICATIONS_ANALYTICS_AUDIT_SECURITY.md` (used).
2. Prompt may imply concrete retention day counts — **not Founder-approved**; placeholders only (OD-009).
3. Prompt listed broad fraud automations — high-impact auto-ban / forfeiture **not** implemented; flag-only + human review.

---

## Notification architecture

Flow: domain/API event → `notification_intents` (outbox) → template resolve → preference/consent → channel provider → `notification_deliveries` → retry / `notification_dead_letters`.

- Templates: versioned `notification_templates`
- In-app: `in_app_notifications`
- Preferences: `notification_preferences` + preference audit events
- Push registry: hashed `push_subscriptions` (live push OFF; `public/sw.js` not modified)
- Providers: sandbox adapters in `lib/architecture/ops-governance/providers.ts`

## Analytics / KPIs

- `analytics_events` with idempotency + `minimiseAnalyticsPayload`
- KPI foundation via domain list + counts (`getKpiFoundation`) — no invented Founder targets / Circle Health formula

## Security / compliance

- `security_events` severity: informational→critical
- `risk_signals` review queue; auto action = `flag_only`
- `operational_alerts` + `incident_signals` (candidate foundation)
- `compliance_holds` scoped unique active holds
- `privacy_requests` workflow (erasure does **not** purge ledger/audit)
- `retention_policies` / `retention_reviews`

## Jobs

`/api/jobs/run` dispatches Phase 12 job types:

- `phase12.notification.dispatch` / `.retry`
- `phase12.alerts.evaluate`
- `phase12.retention.review` (non-destructive)
- `phase12.analytics.ingest` (ack)

## UI (isolated)

- `/ops` hub
- `/ops/notifications` center + preferences
- `/ops/security` minimal queues
- `/ops/privacy` request UX

Did **not** overwrite dirty `app/settings/notifications/page.tsx` or `public/sw.js`.

## Feature flags (gce-dev)

| Flag | Enabled |
|------|---------|
| `notifications_in_app` | ON |
| `notifications_*_sandbox` | ON |
| `notifications_*_live` | **OFF** |
| `marketing_notifications` | **OFF** |
| `analytics_pipeline` / `security_monitoring` / `fraud_review` / `compliance_holds` | ON |
| `retention_enforcement` | **OFF** |
| money/settlement/payout | **OFF** |

## Verification

- Migration applied on gce-dev; SQL harness `PHASE12_OPS_GOVERNANCE_OK`
- Types regenerated
- Unit/integration Phase 12 tests green
- Production untouched

## Not started

- Phase 13 Admin / Support / full incident CRM
- Live SMS/DLT / email / push production providers
- Destructive retention purge
- Dirty SW client hookup
