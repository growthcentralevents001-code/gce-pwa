# ADR-001 — Authentication Architecture

| Field | Value |
|-------|-------|
| **ID** | ADR-001 |
| **Title** | Authentication Architecture |
| **Status** | Accepted — implemented; verified on gce-dev |
| **Date** | 2026-08-08 |
| **Classification** | Technical recommendation (not Founder law) |
| **Supersedes** | None |
| **Dependencies** | ADR-002, ADR-003, ADR-005 |

---

## Context

GCE requires a single permanent base identity per person (FD-035), with JWT-backed sessions suitable for Next.js App Router (SSR + client), PWA clients, and role/workspace switching without multiple login accounts.

Verified stack: Next.js 16 App Router, React 19, `@supabase/supabase-js`, `@supabase/ssr`, PostgreSQL via Supabase.

FD-039 lists Supabase Auth as an allowed technical default that must be locked by ADR, not treated as immutable Founder law.

---

## Decision

1. **Preferred IdP:** Supabase Auth for Phase 2 authentication.
2. **Session model:** Cookie/JWT sessions managed via `@supabase/ssr` for App Router (server components, Server Actions, Route Handlers, middleware where used).
3. **Sign-in methods:** Email/OTP and other Supabase-supported methods as product allows; exact MFA/step-up UX is product-owned and may require step-up for sensitive workspace actions (FD-035).
4. **Identity binding:** Auth subject maps 1:1 to the platform User (permanent base identity). Roles and workspaces are not login identities.
5. **Client libraries:** Prefer `@supabase/ssr` + `@supabase/supabase-js`. Legacy `@supabase/auth-helpers-nextjs` may remain transitional only; new auth code should not deepen that dependency.
6. **Secrets:** Service-role and webhook secrets stay server-only (see ADR-005, ADR-006).

**Label:** Technical recommendation — not Founder law.

---

## Consequences

### Positive

- Aligns with existing stack and FD-035 one-account model.
- SSR-safe session refresh and cookie handling.
- Clear separation: auth identity ≠ RBAC assignment ≠ workspace.

### Negative / trade-offs

- Vendor coupling to Supabase Auth for Phase 2.
- OTP deliverability and rate limits require operational monitoring.
- Migrating away later would need an identity-bridge plan (out of Phase 2 mandatory scope).

---

## Alternatives considered

| Alternative | Why not chosen |
|-------------|----------------|
| NextAuth / Auth.js as primary IdP | Extra integration surface; stack already standardised on Supabase |
| Custom JWT issuer | Higher security/ops burden; no Founder requirement |
| Separate login per role | Contradicts FD-035 one base account |

---

## Governing FDs

- **FD-035** — Permanent base identity; one person, one base account; step-up for sensitive actions
- **FD-023** — RBAC consumes authenticated identity; does not replace auth
- **FD-034** — Logixia legal company; GCE brand (auth UX branding ≠ legal entity)
- **FD-039** — Supabase Auth is a technical default, not Founder law; Super Admin not ordinary product role

---

## Not in scope

- Exact MFA product matrix and OTP vendor SLAs
- Social/OAuth provider enablement list
- Password policy copy and support playbooks
- Enterprise SSO / SAML (future unless separately approved)

---

## Professional validation

Privacy/legal review of auth data retention, OTP messaging, and account-recovery flows remains required before production reliance where PII or regulated messaging applies. Auth architecture choice itself is technical.
