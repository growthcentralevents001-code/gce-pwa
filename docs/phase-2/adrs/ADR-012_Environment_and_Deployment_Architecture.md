# ADR-012 — Environment and Deployment Architecture

| Field | Value |
|-------|-------|
| **ID** | ADR-012 |
| **Title** | Environment and Deployment Architecture |
| **Status** | Accepted |
| **Date** | 2026-08-08 |
| **Classification** | Technical recommendation (not Founder law) |
| **Supersedes** | None |
| **Dependencies** | ADR-004, ADR-006, ADR-010 |

---

## Context

Historical and documented hosting path: Hostinger VPS, PM2, Nginx, GitHub Actions CI/CD, Next.js PWA, Supabase backend (`docs/core/24_Deployment_Architecture.md`). FD-039 states Docker / Edge are **not** mandatory production architecture and remain future/optional.

Pilot city is undecided and must not block technical architecture (FD-039).

---

## Decision

1. **Runtime default:** Deploy the Next.js app on Linux **VPS** with **Nginx** reverse proxy and **PM2** (or equivalent Node process manager) unless a later ADR changes hosting.
2. **CI/CD:** **GitHub Actions** builds/tests and deploys per environment promotion rules.
3. **Data plane:** Supabase-hosted PostgreSQL + Auth for all envs (project-per-env or clearly isolated schemas/projects — ops-owned).
4. **Environments:**
   | Env | Purpose |
   |-----|---------|
   | `local` | Developer machines |
   | `staging` | Integration / QA |
   | `pilot` | Controlled live pilot |
   | `prod` | Production |
5. **Config:** Environment variables and secrets per env; never commit secrets. Service role and PSP webhook secrets server-only.
6. **Docker / Edge:** Allowed as future options; **not mandatory** for Phase 2 go-live (FD-039).
7. **PWA:** `next-pwa` remains part of the delivery model; native iOS/Android apps inactive (FD-039).

**Label:** Technical recommendation — not Founder law.

---

## Consequences

### Positive

- Matches existing ops knowledge and docs.
- Clear promotion path into pilot/prod.
- Avoids blocking on container platform rewrite.

### Negative / trade-offs

- Vertical scaling and host maintenance remain ops concerns.
- Multi-region/Edge latency wins deferred.

---

## Alternatives considered

| Alternative | Why not chosen as mandatory |
|-------------|----------------------------|
| Docker-only production | Explicitly not mandatory (FD-039) |
| Vercel/Edge-only mandatory | Not required; may be evaluated later |
| Single shared env for staging+prod | Unacceptable isolation risk |

---

## Governing FDs

- **FD-034** — Logixia operates the platform (legal context for prod)
- **FD-039** — Docker/Edge not mandatory; pilot city does not block architecture; technical defaults via ADR

---

## Not in scope

- Exact VPS SKU, Nginx snippets, or PM2 ecosystem file contents
- Pilot city launch RACI (blocked on Founder city selection)
- Multi-currency / international hosting (inactive)

---

## Professional validation

Security review of prod secret handling and network exposure before pilot/prod money movement.
