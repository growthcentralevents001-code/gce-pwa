# Production Secret and Key Management Checklist

| Field | Value |
|-------|-------|
| **Document ID** | P15-SEC-001 |
| **Status** | CHECKLIST — **no real secrets in this document** |
| **Checked** | 2026-08-15 |

Never place real secrets in docs or git.

---

| Secret | Where it should live | Access | Rotation | Emergency revocation | Phase 15 |
|--------|----------------------|--------|----------|----------------------|----------|
| Supabase service role | Host env / secret store — **not** client | Break-glass list | On staff change + suspected leak | Dashboard revoke + rotate | Production **not** configured in this phase |
| Supabase anon key | Public OK if RLS holds | — | With project | — | Dev only in this work |
| `GCE_CREDENTIAL_ENCRYPTION_KEY` (fallback `ENCRYPTION_KEY`) | Server env only | Security + Founder | Dual-key plan **MISSING** | Rotate; old ciphertext unreadable without backfill plan | Documented in `docs/core/25_Environment_Configuration.md`; gitignored env |
| Razorpay key/secret/webhook | Server env | Finance + eng | PSP dashboard | Disable key | Flags OFF; candidate only |
| Sentry DSNs | Env | Eng | Project settings | Rotate DSN | |
| Email/SMS API keys | Env | Eng | Provider | Revoke | Live send OFF |
| GitHub Actions secrets | GitHub org | Admins | On leak | Revoke | No production deploy from Phase 15 |
| SSH / VPS | Hardware key / bastion **TBD** | Named admins | On offboarding | Disable user | **MISSING — FOUNDER/PROFESSIONAL INPUT REQUIRED** |
| DB backups encryption | Backup system | Security | — | — | UNKNOWN |

## Production credential key

SHA-256 → 32-byte AES-256-GCM key as implemented in `lib/architecture/credentials/`. Losing the key **without** a documented escrow **destroys** redisplay of stored tokens. Dual-control escrow is a **production** item (P15-C-065).

## Distributed rate limit

In-memory limiter on credential APIs is a **P2** production hardening item — not automatically Pilot-blocking.

## QUESTIONS FOR PROFESSIONAL REVIEW

Key escrow; who can read production env; CI secret scanning.

## QUESTIONS REQUIRING FOUNDER DECISION

Named production secret owners.
