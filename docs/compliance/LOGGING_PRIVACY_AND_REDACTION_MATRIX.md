# Logging, Privacy and Redaction Matrix

| Field | Value |
|-------|-------|
| **Document ID** | P15-LOG-001 |
| **Status** | DRAFT — SECURITY/PRIVACY REVIEW REQUIRED |
| **Checked** | 2026-08-15 |

Sensitive information must not be logged unnecessarily. Phase 12 notes: secrets, full card data, unnecessary Aadhaar/KYC payloads must not appear in logs.

---

| Data | May log? | Redaction | Systems | Notes |
|------|----------|-----------|---------|-------|
| User UUID | Yes (operational) | — | App, audit | Prefer UUID over email |
| Email / phone | Avoid in info logs | Mask | Auth errors only if required | Sentry scrubbing **UNKNOWN** |
| Password / refresh tokens | **Never** | Drop | — | |
| Full PAN / CVV | **Never** | — | — | Not stored |
| QR / claim raw token | **Never** | — | Credential APIs | Phase 14B: hash verify; ciphertext not on parent rows |
| `qr_token_hash` | Limited | — | Check-in | Not equivalent to raw token |
| KYC document images / Aadhaar number | **Never** in logs | `[REDACTED]` | `sensitive_access_events` without copying contents | Unit test redacts `aadhaar` |
| Lead contact before reveal | **Never** to unauthorised | Hide in JSON | Lead Assist | Phase 14B evidenced |
| Enterprise commercials | Need-to-know | — | Finance/Enterprise | |
| Payment references | Yes (ids, amounts) | No card | Ledgers | |
| PSP webhook payloads | Hash/store per Phase 9 | No raw secrets | | |
| Support tickets | Minimise paste of KYC | | ops_cases | |

Sentry: confirm `sendDefaultPii` off; scrub lists. **UNKNOWN — do not guess.**

Audit log retention: **TO BE CONFIRMED BY LEGAL/CA/SECURITY**. CERT-In ICT logs 180 days rolling is a floor for **those** logs, not a complete schedule.

## QUESTIONS FOR PROFESSIONAL REVIEW

Prove Sentry/host redaction; 180-day India retention evidence.

## QUESTIONS REQUIRING FOUNDER DECISION

None beyond staffing who may view logs.
