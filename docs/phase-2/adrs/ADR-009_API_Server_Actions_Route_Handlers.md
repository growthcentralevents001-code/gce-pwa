# ADR-009 — API, Server Actions, and Route Handlers

| Field | Value |
|-------|-------|
| **ID** | ADR-009 |
| **Title** | API, Server Actions, and Route Handlers |
| **Status** | Accepted |
| **Date** | 2026-08-08 |
| **Classification** | Technical recommendation (not Founder law) |
| **Supersedes** | None |
| **Dependencies** | ADR-001, ADR-005, ADR-006 |

---

## Context

Next.js 16 App Router supports Server Actions and Route Handlers. GCE needs authenticated in-app mutations, public payment webhooks, and occasional external callbacks. FD-039 lists Server Actions / Route Handlers usage as a technical default.

---

## Decision

1. **Prefer Server Actions** for authenticated mutations initiated from the App Router UI (forms, workspace operations), colocated with the app and session-aware via `@supabase/ssr`.
2. **Prefer Route Handlers** for:
   - Payment provider webhooks
   - Public/unauthenticated callbacks
   - Machine-to-machine or external integrations that are not App Router form posts
3. **Both must validate:** AuthN/AuthZ (or signature verification), input schema validation, CSRF considerations where cookies apply, and domain state-machine rules (ADR-008).
4. **No business logic in the client as authority:** Client may call actions/handlers; enforcement is server-side (+ RLS).
5. **Idempotency:** Required for payment and other money-adjacent endpoints (ADR-006, ADR-007).
6. **API surface:** Additional REST/JSON Route Handlers for first-party mobile/PWA may exist, but should reuse the same domain services as Server Actions.

**Label:** Technical recommendation — not Founder law.

---

## Consequences

### Positive

- Matches Next.js App Router strengths.
- Clear split: UI mutations vs external ingress.
- Encourages shared domain services behind both entrypoints.

### Negative / trade-offs

- Two entry styles to document and test.
- Server Actions misuse (over-broad exports) needs lint/review discipline.

---

## Alternatives considered

| Alternative | Why not chosen |
|-------------|----------------|
| Route Handlers for all mutations | More boilerplate for in-app forms; weaker colocated DX |
| Server Actions for webhooks | Awkward for raw body/signature verification and non-UI callers |
| Separate Nest/Express API mandatory | Extra deploy surface; not required for Phase 2 default |

---

## Governing FDs

- **FD-023 / FD-035** — AuthZ on every privileged mutation
- **FD-039** — Server Actions / Route Handlers as technical defaults
- **FD-020 / FD-021** — Financial mutations must be server-authoritative

---

## Not in scope

- Public OpenAPI catalogue completeness
- GraphQL adoption
- Partner lead-ingest API programme (inactive per FD-039)

---

## Professional validation

None specific beyond security review of webhook and privileged action surfaces.
