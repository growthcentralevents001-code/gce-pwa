# Batch 1 — Public Website + Authentication + Onboarding

| Field | Value |
|-------|-------|
| **Status** | Implemented — Public/Auth product review ready |
| **Date** | 2026-08-09 |
| **Branch** | `development` |
| **Batch 2** | **Not started** |

---

## Routes implemented / rebuilt

| ID | Route | Action |
|----|-------|--------|
| PUB-01 | `/` | REBUILD |
| PUB-02 | `/about` | REBUILD |
| PUB-03 | `/contact` | REBUILD (API gated) |
| PUB-04 | `/terms` | REBUILD |
| PUB-05 | `/privacy` | REBUILD |
| PUB-06 | `/for-partners` | REBUILD |
| PUB-07 | `/the-circle` | REBUILD |
| PUB-08 | `/memberships` | REBUILD (Associate ₹6,000/qtr from constants) |
| PUB-09 | `/events` | REBUILD SEO wrapper → `/customer/events` |
| PUB-10 | `/offers` | REBUILD SEO wrapper → `/customer/offers` |
| PUB-11 | `/venues` | REBUILD SEO wrapper |
| — | `/connect` | CREATE vertical landing |
| — | `/marketplace` | CREATE vertical landing |
| — | `/enterprise` | CREATE vertical landing (signup remains `/enterprise/signup`) |
| AUTH-01 | `/login` | REBUILD |
| AUTH-02 | `/signup` | REBUILD (identity only) |
| AUTH-03 | `/forgot-password` | REBUILD (real Supabase reset) |
| AUTH-04 | `/auth/callback` | REBUILD |
| AUTH-05 | `/apply/role` | REBUILD (no ZBP/Affiliate) |
| AUTH-06 | `/onboarding/profile` | CREATE |

## Redirects

| From | To |
|------|----|
| `/partners` | `/for-partners` |
| `/zbp`, `/zbp/apply` | `/for-partners` |
| `/affiliate`, `/affiliate/signup` | `/for-partners` |
| `/bdm-dashboard` | `/unauthorized` |

## Deferred

- AUTH-M1 OTP modal (P1 — no phone OTP backend wired)
- AUTH-M2 first-workspace modal (switcher already in PartnerShell)
- Full Event/Offer catalogue cards (Batch 2)
- Contact intake API (BG-05)
- Sitemap automation (BG-04)
- next/font migration

---

## Component replacement register

| Old | Action | New | Reason | Preserved |
|-----|--------|-----|--------|-----------|
| Home + HeroBanner composition | REBUILD | `MarketingHero` + vertical cards | Dated CRUD/marketing mix | No booking logic on home |
| Dirty Header on public | KEEP file / REPLACE usage | Batch 0 `PublicShell` (glass header refine) | Shell already owned | Header.tsx WIP untouched on disk |
| Login plain card | REBUILD | `AuthPanel` split + glass | Premium auth | Supabase password login |
| Signup + affiliate ref | REBUILD | Identity-only signup | FD-035 | Removed affiliate track |
| Forgot-password mock | REBUILD | `resetPasswordForEmail` | Was stub | — |
| Apply role → ZBP/Affiliate | REBUILD | Approved intents only | FD-039 quarantine | Venue/enterprise links as applications |
| Contact console.log submit | REBUILD | FeatureGated + disabled submit | No fake API | BG-05 documented |
| Events/Offers full UIs | REBUILD wrappers | SEO entrances | Batch 2 owns CX | Links to `/customer/*` |

---

## Skills used

| Skill | Informed |
|-------|----------|
| ui-ux-pro-max | Forms autofill/types; onboarding skip; marketplace IA → MASTER colors retained over Inter suggestion |
| ui-styling | Glass panels, hover lift, auth split, tabs |
| design-system | MASTER tokens for heroes/CTAs |
| brand | Logixia→GCE→vertical hierarchy; no peer sub-brands |
| design | Section rhythm, hero budget |
| banner-design | Hero atmosphere gradients (no fake stats/social proof) |

## 21st.dev (search-only)

Adopted: split auth (`19050`/`20036` ideas), glass hero atmosphere (`9950` technique without fake metrics), stepper progress (`8864` simplified).  
Rejected: plasma backgrounds, video heroes, testimonial/social-proof inventing, paid installs.

## Animation register

| Surface | Animation | Tech | Reduced motion |
|---------|-----------|------|----------------|
| Sections | Fade/slide in view | `motion` | Static render |
| Vertical cards | Hover scale 1.01 | `motion` | CSS only |
| Glass header | backdrop blur | CSS | N/A |
| Accordion | open/close | Radix + animate | Instant |
| Progress | width transform | CSS | N/A |

## Glassmorphism register

| Surface | Why | Strategy |
|---------|-----|----------|
| Public header | Floating premium nav | `bg-background/70` + blur-md |
| GlassPanel | Cards, auth, CTA | white/70 + blur + border |
| Auth brand chips | Desktop aside | light glass chips |
| **Not used** | Tables, long legal prose body text blocks (contrast) | Solid panels |

## shadcn added

Input, Label, Textarea, Tabs, Accordion, Progress (+ Radix deps).

## Backend

- `PATCH /api/identity/me` — profile update via `updateOwnProfile` (no role grant)
- Contact: **BG-05** gap confirmed
- Membership price from `ASSOCIATE_PRICE_MINOR`

## Security

- `sanitizeAuthRedirect` / `resolveAuthRedirectParam` (`next`|`redirectTo`|`redirect`)
- Signup does not insert privileged roles
- Apply/role blocks zbp/affiliate/bdm intents

## Testing / gates

See commit quality gate output.
