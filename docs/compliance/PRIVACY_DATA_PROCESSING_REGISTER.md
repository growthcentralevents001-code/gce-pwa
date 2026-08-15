# Privacy Data Processing Register

| Field | Value |
|-------|-------|
| **Document ID** | P15-PDR-001 |
| **Status** | DRAFT — PRIVACY/LEGAL REVIEW REQUIRED |
| **Checked** | 2026-08-15 |
| **Intended fiduciary candidate** | Logixia Solutions Private Limited — **OD-008 not confirmed** |
| **Brand** | GCE |

Lawful basis / consent language below is **hypothesis for counsel**, not a conclusion. DPDP substantive notice/consent duties follow **phased commencement** (SRC-002/003).

---

## Processing activities

| ID | Activity | Data principal | Data fields (indicative) | Purpose | Source | User-facing notice | Lawful basis (confirm) | Storage | Recipients / processors | Retention | Deletion | Access | Sensitivity | Review |
|----|----------|----------------|--------------------------|---------|--------|--------------------|------------------------|---------|-------------------------|-----------|----------|--------|-------------|---------|
| PA-01 | Account registration | User | name, email, phone, user id | Create permanent User identity (FD-035) | User | `/privacy` stub — inadequate | Consent / account contract — **confirm** | Supabase Auth + profiles | Hosting, email if enabled | TO BE CONFIRMED BY LEGAL/CA | Privacy request / ops | Auth + scoped RLS | Medium | NOT REVIEWED |
| PA-02 | Profile / business details | Member / BDP / Venue | company, category, specialisation, Tags | Operate Connect / Marketplace / Enterprise | User | Stub | Contractual operation — **confirm** | Postgres | Internal roles | TO BE CONFIRMED | Privacy request | Workspace RBAC | Medium | NOT REVIEWED |
| PA-03 | KYC / verification | BDP, Venue, payout recipient, Enterprise Client | verification records, docs metadata; **Aadhaar not default** | Fit-for-purpose verification (FD-039) | User / Ops | Stub + FD-039 copy | Consent + legal obligation if any — **confirm** | KYC tables; contents must not be logged | Ops/Compliance; processors TBD | TO BE CONFIRMED | Gated; `retention_enforcement` OFF | Sensitive access events | High | NOT REVIEWED |
| PA-04 | Payments / invoices | Customer, Member, BDP | amount, references, invoice fields; **no PAN/CVV** | Collect, reconcile, later settle | User + PSP | None adequate | Contract / legal — **confirm** | Payment intents; PSP | Razorpay candidate; Finance | TO BE CONFIRMED (accounts) | Finance rules | Finance roles | High | NOT REVIEWED |
| PA-05 | Event booking / tickets / QR | Customer | booking, ticket ids, credential ciphertext | Fulfil Event access | User | Stub | Contract — **confirm** | marketplace tickets + `marketplace_display_credentials` | Venue check-in (hash only); owner APIs | TO BE CONFIRMED | Support process | Owner + service role | High (credential) | NOT REVIEWED |
| PA-06 | Offer claim / redemption | Customer | claim ids, credential ciphertext, redemption | Offer fulfilment; claim ≠ revenue | User | Stub | Contract — **confirm** | claims + display credentials | Venue | TO BE CONFIRMED | Support | Owner + service role | High | NOT REVIEWED |
| PA-07 | Connect Circle / membership | Member | membership, Circle allocation, GB roles | Membership operation | User / Ops | Stub | Contract — **confirm** | membership tables | CBDP (limited), PRM | TO BE CONFIRMED | Ops | Connect RBAC | Medium | NOT REVIEWED |
| PA-08 | Lead Assist | Member (seeker/receiver) | lead content, outcomes, **contact on reveal** | Unpaid Stage 1 matching (FD-031) | User | Draft terms | Consent for reveal — **confirm** | `assist_*` | Opportunity Desk; assigned member after reveal | OD-010 open | No train default | Desk + parties | High | NOT REVIEWED |
| PA-09 | Closed-business outcomes | Members | dual-confirm outcomes **without** finance post | Integrity of unpaid assist | Users | Draft | Legitimate operation — **confirm** | assist outcomes | Finance report **without** lead id (Phase 14B) | TO BE CONFIRMED | — | Restricted | Medium | NOT REVIEWED |
| PA-10 | Enterprise client / project | Client org users, vendors | requirements, proposals, commercials | Project delivery | Client / Expert / EBDP | Draft MSA | Contract — **confirm** | enterprise tables | Vendors (managed, no portal) | TO BE CONFIRMED | Project close SOP | Enterprise RBAC | High | NOT REVIEWED |
| PA-11 | Audit / security / support | Any | audit logs, ops cases, incidents | Security, disputes, CERT-In | System / Ops | None | Security / legal — **confirm** | audit + ops_cases | Sentry (errors) | CERT-In 180 days **logs**; other TO BE CONFIRMED | Gated | Privileged | High | NOT REVIEWED |
| PA-12 | Marketing | User | contact + preferences | Marketing — **currently OFF** | — | — | Consent required if enabled | — | — | N/A while OFF | — | — | Medium | NOT APPLICABLE — REASONED (flag OFF) |

---

## Cookie / tracking (actual)

Application code search (2026-08-15) found **no** Google Analytics, GTM, Meta Pixel, Hotjar, Clarity, or similar marketing pixels in first-party app sources.

Session cookies for auth are expected (Supabase). **No advertising cookies identified.**

If later added: map notice/consent before enablement.

---

## Consent & notice UX audit (recommendations — do not auto-add checkboxes)

| Surface | Privacy notice | Terms acceptance | Consent | Marketing choice | Contextual notice | Recommendation |
|---------|----------------|------------------|---------|------------------|-------------------|----------------|
| Registration | Yes | Yes | Account | Separate, default off | What is stored | Add links to **approved** policies; record version (P15-GAP-001) |
| Profile | Link | — | — | — | Sensitive fields | Contextual |
| KYC | Yes | — | Explicit for docs | No | Why this doc | Never require Aadhaar by default |
| Booking | Yes | Checkout terms | Payment | No | Cancellation/refund **once decided** | Do not hide fees |
| Offer claim | Yes | Offer terms | — | No | 72h claim ≠ redemption | |
| Membership | Yes | Membership terms | — | Separate | No guaranteed business | |
| Venue / BDP / Enterprise onboarding | Yes | Signed/clickwrap per publication plan | KYC | No | Independence / no bind Logixia | |
| Notifications | — | — | Channel | Marketing separate | — | Keep live channels OFF |

---

## Consent record requirements vs backend

Desired evidence: user ID, policy version, timestamp, purpose, source/surface, withdrawal, metadata.

Current: partial `terms_accepted_at` / `policy_version` on some records (Phase 6/11/13). **Not** a complete purpose-level ledger.

**PROFESSIONAL-VALIDATION-GATED BACKEND GAP** = P15-GAP-001. **No schema migration in Phase 15.**

---

## Data Principal request (manual Pilot process)

1. Request via settings form / email placeholder `[PROFESSIONAL INPUT REQUIRED]`  
2. Identity verification (Ops — method TBD by privacy counsel)  
3. Queue: `privacy_requests` / ops case type `privacy`  
4. Scope: which principal, which systems  
5. Action: access / correction / update / erasure **where applicable** / withdrawal  
6. Audit: existing ops/audit tables  
7. Response: PIB/Rules describe max **90 days** when those duties commence — **do not treat as already live without counsel**; do not invent a shorter statutory SLA  

Erasure may be limited by accounting/tax/security retention — CA/legal to confirm.

---

## QUESTIONS FOR PROFESSIONAL REVIEW

1. Is Logixia the Data Fiduciary for all GCE surfaces?  
2. Which DPDP duties apply at the actual Pilot date vs 13 May 2027?  
3. Is account creation “consent” vs other DPDP ground?  
4. Cross-border: confirm Supabase/Sentry/AI regions.  
5. Opportunity Desk minimum access.

## QUESTIONS REQUIRING FOUNDER DECISION

FD15-AGE-001; FD15-RET-001; FD15-MKT-001.
