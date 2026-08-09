# Batch 3 — Member / GCE Connect / Circle / Lead Assist Implementation

| Field | Value |
|-------|-------|
| **Status** | **COMPLETE — Connect Member experience ready for review** (non-blocking gaps remain) |
| **Date** | 2026-08-09 |
| **Branch** | `development` |
| **Batch 4** | Not started |

---

## Design-system supersession (no blue)

- Updated `design-system/MASTER.md`: accent is orange family; `#2563EB` superseded.
- Added `lib/frontend/design-language.ts` — radius, surface, motion, glass, GC Power Sectors.
- Shared P0 blue/sky removals on Batch 2 Event surfaces.
- Register: `docs/frontend/GLOBAL_FRONTEND_VISUAL_CONSISTENCY_REGISTER.md`

## Routes

| ID | Route | Status |
|----|-------|--------|
| MEM-01 | `/dashboard/connect-member` | Created dedicated home |
| MEM-02 | `/connect/membership` | Created |
| MEM-03 | `/connect/onboarding` | Created |
| MEM-04 | `/connect/specialisation` | Created |
| MEM-05 | `/connect/tags` | Created |
| MEM-06 | `/connect/circle` | Created |
| MEM-07 | `/connect/waitlist` | Created |
| MEM-08 | `/connect/transfer` | Created (FeatureGated — API gap) |
| MEM-09 | `/connect/governance` | Created |
| MEM-10 | `/connect/leads` | Created + composer |
| MEM-11 | `/connect/leads/sent` | Created |
| MEM-12 | `/connect/leads/received` | Created |
| — | `/connect/leads/[id]` | Created detail + actions |
| Modals | accept/decline/reveal/outcome | Sheet/inline via `LeadActions` |

Public marketing `/connect` unchanged. Proxy: exact `/connect` public; `/connect/*` requires auth.

## Components

MembershipCard, CircleCard, MemberCard, LeadCard, KpiCard, Timeline, TagChip, PowerSectorGrid, LeadComposer, LeadActions, ConnectPageHeader.

## APIs

- `/api/connect/memberships` (GET)
- `/api/connect/circles` (GET by circleId via privileged reads)
- `/api/lead-assist` (GET sent/received; POST create/submit/accept/decline/reveal/outcome)

## Backend gaps

| ID | Gap | Class |
|----|-----|-------|
| BG-13 | Member-facing Circle transfer request | P1 |
| BG-14 | Member Tag self-serve editor | P2 |
| BG-15 | Directory display names (profile join) | UX read-model |
| BG-11/12 | (from Batch 2) QR re-display | unchanged |

## 21st.dev (search-only)

KPI 6537/15024, Community 8240, Profile 2593/5629, Timeline 9216/8035, Lead/status 2514 — adapted to GCE orange language; rejected neon/glow/rainbow dashboards.

## Skills

ui-ux-pro-max, ui-styling, design-system, brand, design, 21st search-only.

## Security / privacy

- Contact reveal server-authorized only
- No candidate lists in received UI
- Paid Lead Assist flags asserted OFF
- Governance role labels corrected (no Treasurer)

## Testing

- `tests/unit/batch3-connect-frontend.test.ts` (membership/Circle/Tags/waitlist/paid flags/sectors/no-blue surfaces)
- `npm run typecheck` → 0
- `npm test` → 185 passed / 11 skipped
- `npm run build` → 0 (Connect member routes present)
- Scoped ESLint on Batch 3 + shared touched files → 0

## Browser / Playwright smoke (production `next start` :3055)

| Surface | Result |
|---------|--------|
| `/` | 200, no console errors |
| `/connect` | 200 public marketing |
| `/connect/membership` | 307 → `/login?redirectTo=/connect/membership` |
| `/dashboard/connect-member` | 307 → login |
| `/login`, `/events`, `/offers` | 200 (no-blue token safety) |
| Mobile 390×844 / tablet 768×1024 / desktop 1366×768 | Viewports exercised |
| Authenticated Lead Assist deep CX | Deferred — no test identity (Phase 14B) |

Stale `:3000` instance showed static-asset 500s (build/server mismatch); smoke used fresh build on `:3055`.

## Component consistency register

| Component | Family | Radius | Surface | Border | Shadow | Motion | Color role | 21st | shadcn |
|-----------|--------|--------|---------|--------|--------|--------|------------|------|--------|
| MembershipCard | Card | `rounded-2xl` | cream/white | warm border | sm→orange hover | entrance | orange accent | profile/membership | Card, Badge |
| CircleCard | Card | `rounded-2xl` | same | same | same | same | orange + neutrals | community | Card, Progress |
| MemberCard | Interactive Card | `rounded-2xl` | same | same | same | hover lift | orange badges | people cards | Card, Avatar, Badge |
| LeadCard | Interactive Card | `rounded-2xl` | same | same | same | same | status semantic | CRM status 2514 | Card, Badge |
| KpiCard | KPI | `rounded-2xl` | same | same | sm | none/subtle | orange number | KPI 6537 | Card |
| Timeline | Timeline | n/a list | neutral | left rail | none | none | orange markers | 9216/8035 | — |
| TagChip | Filter Chip | `rounded-full` | warm | orange selected | none | press | orange selected | tag chips | Badge |
| PowerSectorGrid | Category | `rounded-2xl` | same | orange tonal | sm | none | orange borders only | category cards | Card |
| LeadComposer | Form | inputs standard | glass elevated panel sparingly | standard | sm | sheet | orange CTA | multi-step forms | Form, Textarea, Select, Sheet |
| ConnectPageHeader | Page Header | — | — | — | — | — | orange CTA | — | Button |

## Component replacement register

| Old | Action | New | Why | Behavior preserved |
|-----|--------|-----|-----|-------------------|
| Placeholder `/dashboard/member` Connect UX (legacy) | Superseded by MEM routes | `/dashboard/connect-member` + `/connect/*` | Inventory authority; PartnerShell | Backend membership/circle/lead reads |
| Ad-hoc lead UI fragments | Replaced | `LeadCard` / `LeadComposer` / `LeadActions` | One GCE language; Stage 1 unpaid | `/api/lead-assist` actions |
| Mixed sky/blue Event accents | Shared P0 fix | orange brand treatments | No-blue Founder rule | Event discover UX |

## Deferred

- Member transfer API (BG-13) — FeatureGated UI
- Tag editor (BG-14)
- Directory display names (BG-15)
- Authenticated Playwright deep flows (requires test identity)
- Admin/legacy blue cleanup (VC-01/VC-02)
