# ADR-003 — Workspace and Routing Model

| Field | Value |
|-------|-------|
| **ID** | ADR-003 |
| **Title** | Workspace and Routing Model |
| **Status** | Accepted |
| **Date** | 2026-08-08 |
| **Classification** | Technical recommendation (not Founder law) |
| **Supersedes** | None |
| **Dependencies** | ADR-001, ADR-002 |

---

## Context

FD-035 defines a **Workspace** as the user-facing operational context under an approved role/scope. A workspace is **not** a legal entity, commercial entitlement, or separate login account.

Users with multiple active workspaces need an explicit selector; single-workspace users may deep-link directly. MVP must not merge sensitive operations into one unrestricted mega-dashboard (FD-035).

FD-039 lists canonical `/dashboard/{workspace}` routing as a technical default to lock via ADR.

---

## Decision

1. **Technical default route shape:** Prefer `/dashboard/{workspaceKey}/...` for authenticated operational UIs.
2. **`workspaceKey`:** Stable, URL-safe identifier for an operational context (e.g. personal, connect-member, connect-bdp, marketplace-bdp, venue, enterprise-bdp, enterprise-client, platform). Exact key catalogue is implementation-owned and must stay aligned with FD-035 workspace examples / taxonomy.
3. **Workspace ≠ account:** Switching workspace changes operational context and permission evaluation; it must not create a second User or re-authenticate unless step-up is required for sensitive actions.
4. **Entry behaviour:**
   - Multi-workspace: show explicit workspace selector (no silent priority pick).
   - Single active workspace: may redirect directly; base profile/account remains reachable.
5. **Scope enforcement:** Route presence is not authorisation. Server-side RBAC + RLS must validate assignment status and scope (ADR-002, ADR-005).
6. **No mega-dashboard MVP:** Aggregated home (notifications/tasks) may exist later; sensitive mutations stay inside the correct workspace.

**Label:** Technical recommendation — not Founder law. Workspace *concept* is Founder law (FD-035).

---

## Consequences

### Positive

- Predictable URLs for QA, deep links, and support.
- Clear mental model: identity → assignments → workspace context.
- Reduces wrong-dashboard financial mistakes.

### Negative / trade-offs

- More routes and layout nesting than a flat `/dashboard`.
- Key renames require redirects; treat keys as semi-stable.

---

## Alternatives considered

| Alternative | Why not chosen |
|-------------|----------------|
| Flat `/dashboard` with role inferred from session | Encourages ambiguous permissions and silent role priority |
| Subdomain-per-workspace | Ops complexity; not required for Phase 2 |
| Separate app per vertical | Fragments identity contrary to FD-035 |

---

## Governing FDs

- **FD-035** — Workspace definition, selector, switching, no mega-dashboard MVP
- **FD-023** — Permissions evaluated in workspace/scope context
- **FD-039** — `/dashboard/{workspace}` as technical default, not Founder law

---

## Not in scope

- Exact marketing site vs app route split beyond authenticated dashboards
- Mobile deep-link scheme for native apps (native apps inactive per FD-039)
- Final navigation IA copy

---

## Professional validation

None required for routing shape.
