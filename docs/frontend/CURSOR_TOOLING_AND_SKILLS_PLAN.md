# Cursor Tooling and Skills Plan

| Field | Value |
|-------|-------|
| **Status** | Evidence-based inventory + redevelopment usage |
| **Date** | 2026-08-08 |
| **Invented tools?** | **No** — only inspected env |

---

## A. Cursor built-in capabilities

| Name | Capability | R/W | Redevelopment use | Safety |
|------|------------|-----|-------------------|--------|
| Agent file tools (Read/Edit/Write/Glob/Grep) | Code/docs | Write workspace | All batches (code later) | No prod |
| Shell | Commands, git, build | Write local | typecheck/test/build | No force-push |
| AskQuestion / CreatePlan | Planning UX | — | Planning only | — |
| Task subagents | Parallel explore/review | Read/Write per agent | Audits, later PR split | Scoped |
| SwitchMode | Plan/Agent | — | Process | — |
| GenerateImage | Images | Write | Only if explicit image ask | Not default |
| TodoWrite | Task tracking | Meta | Batch tracking | — |

---

## B–C. Repository Cursor Skills (`.cursor/skills/`) — installed

| Skill | Purpose | Active? | Batches | How used |
|-------|---------|---------|---------|----------|
| ui-ux-pro-max | UX patterns, responsive, dashboards | Yes | 0–10 | Invoke skill markdown before major UX |
| ui-styling | shadcn/Tailwind polish | Yes | 0–10 | Component styling |
| design-system | Tokens / MASTER compliance | Yes | 0–10 | Token application |
| brand | Brand voice/visual | Yes | 0,1,4,6,10 | Marketing + identity |
| design | Broader design deliverables | Yes selective | 1,3,6 | Only when layout/systems help |
| banner-design | Heroes/banners | Yes | 1 | Home/Offer/Event banners |
| slides | HTML decks | **No product UI** | — | Skip unless leadership deck |

**User-global Cursor skills** (from agent_skills list when present): create-rule, create-skill, create-hook, update-cursor-settings, canvas, etc. — use only if task matches (e.g. rules updates), **not** for GCE page building.

---

## D. MCP servers (from live catalog)

| Server | Connected | Tools (representative) | Class | Redevelopment |
|--------|-----------|------------------------|-------|---------------|
| **user-21st** | Yes | `search`, `search_picker`, `search_logo`, (+ generate/get_component **restricted**) | READ search default; generate REQUIRES APPROVAL | Batches 0–8 pattern research **search-only** per rule 08 |
| **user-supabase** | Yes | docs, SQL, migrations, types, advisors | SAFE WRITE gce-dev only with approval; PRODUCTION-RISK otherwise | Backend gaps later — **not** FE batch default |
| **user-github** | Yes | PRs, files, issues | REQUIRES APPROVAL for write | After commits authorized |
| **user-playwright** | Yes | browser_navigate, snapshot, click, fill… | READ/SAFE local browser | Smoke after each batch; E2E prep |
| **user-context7** | Yes | resolve-library-id, query-docs | READ ONLY | Next/shadcn/Radix docs |
| **user-next-devtools** | Yes | nextjs_docs, browser_eval, … | READ / local | Next.js 16 docs before App Router code |

### MCP safety classification

| Class | Servers/tools |
|-------|----------------|
| READ ONLY | context7, 21st `search*`, supabase `search_docs`/`list_*` read, playwright browse |
| SAFE WRITE gce-dev | supabase `apply_migration`/`execute_sql` only when Founder/user approves per phase |
| REQUIRES EXPLICIT APPROVAL | 21st `generate`/`get_component` paid, github writes, broad shell network |
| PRODUCTION-RISK | Any supabase write targeting production project |
| NOT TO BE USED (FE redevelopment default) | 21st auto-install; production supabase; force push |

---

## E. shadcn/UI tooling

| Item | Status | Use |
|------|--------|-----|
| `components.json` | Present (new-york) | Batch 0+ |
| `components/ui` | Only Button + interactive-hover | Expand in Batch 0 |
| CLI `npx shadcn@latest add` | Available via npm when authorized | Batch 0 install wave |
| Role | **Primary reusable primitive layer** | Adapt tokens to MASTER |

---

## F. 21st.dev — exact role

- **Planning pass:** metadata `search` used (event cards, KPI, bottom nav).  
- **Redevelopment:** mandatory **search** before major pattern design listed in Batch Plan.  
- **Never** auto-`generate` or paid install without user message override.  
- Results are **references**; implementation via project shadcn + MASTER.

---

## G. Supabase tooling

| Use | Batch |
|-----|-------|
| Verify feature flags / RLS while integrating UI | Optional mid-batch |
| Types regenerate | Only if backend gap migration approved |
| Never production | Always |

---

## H. Browser / devtools

| Tool | Use |
|------|-----|
| user-playwright MCP | Visual smoke, mobile viewport, basic a11y traversal |
| user-next-devtools browser_eval | Next-specific debug |

---

## I. Testing tooling

| Tool | Installed? | When |
|------|------------|------|
| Vitest | Yes | Every batch now |
| ESLint | Yes | Every batch |
| Playwright package | **No** | Install at Batch 10 **or** start of FE implementation with approval |
| Testing Library | **No** | Install with Playwright wave |
| axe | **No** | Batch 10 / Phase 14B |
| Phase 14B | Deferred | Full E2E/UAT after Batch 10 |

---

## J. Git / GitHub

| Tool | Use |
|------|-----|
| git CLI | Status; commits **only when user asks** |
| user-github MCP | PR after authorized pushes |

---

## K. Documentation / search

| Tool | Use |
|------|-----|
| Grep/Glob/Read | Constant |
| context7 | Library docs |
| WebSearch/WebFetch | Rare (prefer context7) |

---

## L. Design tooling summary

MASTER.md + skills (ui-ux-pro-max, ui-styling, design-system, brand, banner-design, design) + 21st search + shadcn.

---

## Batch ↔ tools quick map

See also Mandatory Tooling Strategy in `FINAL_GCE_REDEVELOPMENT_BATCH_PLAN.md`.

| Batch | Skills | MCPs | Other |
|-------|--------|------|-------|
| 0 | ds, ux, sty, br | 21st search, context7, playwright | shadcn add |
| 1 | br, ban, ux, sty, des | 21st, playwright | Auth |
| 2 | ux, sty, ds | 21st, playwright | `/api/customer` |
| 3 | ux, sty, ds, des | 21st, playwright | connect + lead-assist |
| 4–6 | ux, sty, ds, br | 21st, playwright | domain APIs |
| 7 | ux, sty, ds | 21st, playwright | finance + Recharts |
| 8 | ux, sty, ds | 21st, playwright | ops APIs |
| 9 | sty, ds, ux, br | playwright | prefs APIs |
| 10 | ux, sty, ds, br | playwright + axe | PWA careful SW |

---

## Tools that will NOT be used for product UI

| Tool/Skill | Why |
|------------|-----|
| slides skill | Not a product surface |
| 21st generate/install | Policy + paid; need explicit ask |
| Production Supabase MCP writes | Forbidden |
| Automate skill / unrelated global skills | Out of scope |

---

## Cursor rules relevant to FE redevelopment

| Rule | Applies | Needed? |
|------|---------|---------|
| 00_Global_Rules | Always | Yes |
| 01_Business_Rules | Always | Yes — no invent business |
| 02_UI_Rules | Frontend | Yes |
| 03–07 | When touching BE/AI/security/perf | Yes as scoped |
| 08_21st_Dev_MCP | Always | Yes — search-only |

`01_Business_Rules.mdc` is currently dirty in git — do not overwrite during FE docs pass.
