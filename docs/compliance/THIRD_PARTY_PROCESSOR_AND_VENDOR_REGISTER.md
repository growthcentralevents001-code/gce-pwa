# Third-Party Processor and Vendor Register

| Field | Value |
|-------|-------|
| **Document ID** | P15-VEN-001 |
| **Status** | DRAFT — unknowns marked; **do not guess terms** |
| **Checked** | 2026-08-15 |

DPA/contract status is **unknown** unless a signed artefact is in-repo (none found).

---

| Vendor | Purpose | Data handled | Access | DPA status | Data location | Retention | Security docs | Subprocessors | Production readiness |
|--------|---------|--------------|--------|------------|---------------|-----------|---------------|---------------|----------------------|
| Supabase | Auth, Postgres, storage | Account, app data, KYC metadata, credentials ciphertext | Service role = full DB — **privileged** | UNKNOWN | UNKNOWN — confirm project region | UNKNOWN | UNKNOWN | UNKNOWN | Dev used (`hvevqoltcwumcvxetxsf`); **production project must not be touched in Phase 15** |
| Hosting / VPS | App runtime | Whatever the app processes; logs | SSH/root — privileged | UNKNOWN | UNKNOWN (must support CERT-In India log copy) | UNKNOWN | UNKNOWN | UNKNOWN | Production deploy **not** part of Phase 15 |
| Razorpay (candidate) | Payments | Payment references; **card data on PSP** if hosted checkout | Merchant dashboard | UNKNOWN | Per PSP | Per PSP | PSP docs — not copied here | UNKNOWN | **Not enabled**; FD-039 candidate only |
| Sentry | Errors | Stack traces; risk of PII in events | Project DSN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | Optional; minimise PII |
| UptimeRobot | Uptime | URL/uptime only if configured | Low | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | Confirm if actually used |
| Email provider | Transactional email | Email, name | API | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | **Live email OFF** |
| SMS provider | OTP/notify | Phone | API | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | **Live SMS OFF** |
| AI providers | Lead Assist classification (abstraction + fallback) | Lead text; **must not** train without OD-010 | API | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | Stage 1 unpaid; no-train default |
| GitHub / GitHub Actions | Source + CI | Repo; secrets if misconfigured | Org admins | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | No production secrets in git |
| Analytics pixels | Marketing | — | — | — | — | — | — | — | **None found in app code** |

---

## QUESTIONS FOR PROFESSIONAL REVIEW

Execute DPAs; confirm regions; subprocessors; AI training prohibition in vendor terms.

## QUESTIONS REQUIRING FOUNDER DECISION

Who is commercial owner of each vendor contract.
