# Production Credential Migration and Backfill Plan

| Field | Value |
|-------|-------|
| **Document ID** | P15-BFL-001 |
| **Status** | ROLLOUT DECISION — **do not apply production migration in Phase 15** |
| **Checked** | 2026-08-15 |
| **Related** | Phase 14B Option A stored via Option C; BG-11/BG-12 CLOSED |

---

## Migration dependency

Dev migration `supabase/migrations/20260815140000_phase14b_p1_display_credentials.sql` applied to **gce-dev only**. Production (`tzeqeywezmqslovpflqu`) **untouched**.

## Existing record impact

Pre-migration tickets/claims have **no** retrievable encrypted display credential. Check-in still works via hash if the attendee presents the original token. **Owner redisplay APIs cannot reconstruct raw tokens** from hashes.

## Backfill options (not chosen)

| Option | Description | Limit |
|--------|-------------|-------|
| A | Leave historical rows; support explains “open original email/SMS” | SMS/email were OFF — may have no channel |
| B | Regenerate tokens and re-issue (breaks already-printed QR) | Operationally heavy |
| C | If any plaintext still exists in logs/session — **must not**; Phase 14B forbids raw token logs | If found, security incident |
| D | Manual Ops reissue with audit | Support strategy |

Token regeneration is **not** a silent hash rewrite.

## Support strategy

Pilot should **create new tickets/claims after** the migration is on that environment. Historical production rows: document for Phase 17.

## Rollback

Dropping ciphertext table loses redisplay; hashes on parent rows remain for scan. Dual-key encryption rotation is unimplemented.

## Professional / security review

PS-SEC-002 / PS-SEC-009. Distributed in-memory rate limit = P2.

## QUESTIONS FOR PROFESSIONAL REVIEW

Whether any production tickets already exist that customers rely on.

## QUESTIONS REQUIRING FOUNDER DECISION

When (not whether in Phase 15) to migrate production.
