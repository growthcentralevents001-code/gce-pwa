# Circle Architecture (Canonical)

## Authority

**Highest authority for GCE Connect Circle lifecycle:**
`docs/founder-decisions/FD-024_GCE_Connect_Circle_Lifecycle.md`

**Related Founder Decisions:**

- Membership vs Circle seat, reservation, waitlist, grace: `FD-022_Membership_Lifecycle.md`
- Circle access and role boundaries: `FD-023_RBAC_and_Permissions.md`
- Platform ownership and vertical model: `FD-001_Business_Model.md`

This document is the living **canonical core** summary of Circle architecture. Where this file conflicts with FD-024, **FD-024 wins**. Do not invent Health Score formulas, Annual Circle Certification, Mature-status criteria, or merger/split voting rules.

---

## Purpose

Owns detailed GCE Connect Circle architecture and Circle lifecycle documentation for the repository (formation, activation, capacity, seats, expansion, governance boundaries, archival).

Membership plan benefits: `05_Memberships.md`.
Connect BDP narrative: `06_CBDP.md` (legacy filename; approved term **Connect BDP**).
Commercial partner numbers: `36_Commercial_Constants.md` (subject to later commercial Founder Decisions).
Roles: `35_Role_Taxonomy.md`.

Always use **GCE Connect** (never “Connect” alone).

---

## What a GCE Connect Circle is

A **GCE Connect Circle** is a structured, verified, platform-governed business networking unit inside **GCE Connect** (FD-024).

It is a GCE platform entity with:

- Unique identity
- Geographic association
- Lifecycle status
- Maximum membership capacity
- Protected specialization seats
- Governance roles
- Meeting, referral, performance, compliance, and audit history

It is **not** an informal social group.

---

## Ownership (Founder Approved — FD-024 / FD-001)

| Party | Role |
|-------|------|
| **GCE** | Owns and controls every Circle |
| **Connect BDP** | May initiate, develop, support, and grow — **does not own** the Circle |
| **Board of Governance / Circle Board** | Governs approved internal matters — **does not own** the Circle |
| **Circle Members** | Participate and occupy seats — **do not own** the Circle |

Ownership remains with GCE if a Connect BDP resigns, is suspended, or is terminated; if Board or members change; if territory changes; or if the Circle is merged or archived.

---

## Creation and activation (separate stages)

### Initiation

An approved **Connect BDP** may initiate a Circle creation request within assigned territory / approved operating scope.

- Connect BDP **cannot** independently activate a Circle.
- Circle Board **does not** create Circles.
- Platform validation and approval are **mandatory** before Formation.

Conceptual flow (FD-024):

```text
Identify opportunity
  → Submit creation request
  → Platform validates
  → Approve / Reject / Return / Hold
  → Approved Circles enter Formation
```

### Formation vs activation

| Stage | Meaning |
|-------|---------|
| **Formation** | Platform-approved creation; recruiting and preparation; **not** officially operational |
| **Pending Activation** | Formation substantially complete; final platform approval pending |
| **Active** | Only after **GCE Platform** grants final activation approval |

**Formation and activation are separate.** Provisionally formed ≠ Active.

---

## Capacity stages (Founder Approved — FD-024)

| Active physical members | Stage |
|-------------------------|--------|
| **0–14** | Formation |
| **15–39** | Active Growth (after activation) |
| **40** | Full Capacity |

- A Circle **may activate with 15 founding members**.
- **Maximum capacity is 40** active physical members.
- A Circle must **not** exceed 40.
- Changing the 40-member limit requires another Founder Decision.

---

## Lifecycle statuses (Founder Approved — FD-024)

Every Circle must always have one defined lifecycle status:

`Draft` · `Formation` · `Pending Activation` · `Active` · `Growth` · `Full Capacity` · `Mature` · `Under Review` · `Suspended` · `Merged` · `Archived`

**Unresolved (do not invent):**

- Exact **Mature** measurable criteria
- Exact **Under Review** workflow / SLA
- Exact suspension restriction matrix
- Exact reinstatement workflow

Closure must result in **Suspended**, **Merged**, or **Archived** — **never silent deletion**. Circle history must be preserved.

---

## Seats and specialization exclusivity

### Taxonomy hierarchy (FD-024)

```text
GCE Power Sector
  → Business Specialization
    → Business Tags
```

### Exclusivity rule (Founder Approved)

**One Business Specialization = One Exclusive Seat within one Circle.**

- Specialization exclusivity does **not** automatically apply across an entire city.
- The same specialization may exist in different Circles.
- A Tag is **not** a substitute for a Specialization seat.

### Membership vs Circle seat (FD-022 / FD-024)

| Concept | Belongs to |
|---------|------------|
| **Membership** | Approved member account |
| **Circle seat** | Specific Business Specialization inside a specific Circle |

- Active membership does **not** automatically guarantee immediate Circle placement.
- Seat reservation period: **7 days** (FD-022).
- Waitlist support is **required** when seats/Circles are unavailable (waitlist priority: **Unresolved**).

Older “One Profession, One Seat” wording in narrative docs means this specialization-exclusivity rule and must not be read as city-wide exclusivity.

---

## Naming and multi-Circle territories

- Official Circle names are **platform controlled**.
- Recommended pattern: `[Geography] + Circle + [Sequence Number]` (example: Delhi South Circle 01).
- Members, Connect BDPs, or Boards must not invent unrestricted informal names as the primary system name.
- **Multiple Circles may exist in the same territory.**
- A new Circle may begin formation when an existing Circle reaches approximately **80% occupancy** ≈ **32 active members** (for a 40-member Circle).
- Every additional Circle is a **separate platform entity** (own ID, seats, governance, history, Health Score).

---

## Connect BDP and Circle operations

Connect BDP circle-related authority (summary):

- May initiate creation requests and support formation/growth for assigned Circles
- May support onboarding, verification, and member success within assigned scope
- Must **not** independently activate Circles
- Must **not** bypass platform validation
- Must **not** access unassigned Circles by default (FD-023)
- Must **not** simultaneously be a Circle Member of the same Circle or a directly conflicting Connect structure (FD-023)

### Partner capacity packs

Historical commercial documentation records a maximum number of Circles per Connect BDP franchise pack in `36_Commercial_Constants.md`. That commercial pack limit is **not redefined by FD-024**. Exact Connect BDP capacity-pack commercial terms remain subject to a dedicated Connect BDP commercial Founder Decision when issued. Until then, treat historical pack numbers as **commercial documentation pending dedicated Founder commercial decision**, and treat Circle **lifecycle** rules in this file / FD-024 as authoritative for Circle entities themselves.

Partner narrative: `06_CBDP.md`.

---

## Governance boundaries (summary)

Board of Governance / Circle Board:

- Governs approved **internal** Circle matters
- Does **not** own, create, or independently activate Circles
- Does **not** override platform decisions
- Does **not** change official taxonomy directly
- Does **not** move platform funds without explicit authority
- Does **not** delete Circle history
- Must **not** exceed the 40-member capacity

Detailed Board eligibility, tenure, election, and no-confidence rules: **FD-024** (do not restate full election math here unless implementing; cite FD-024).

---

## Circle Health Score and certification

| Item | Status |
|------|--------|
| Circle Health Score **as a concept** | Founder Approved (FD-024) |
| Exact formula, weightage, thresholds | **Not approved** — Pending Founder Approval |
| Annual Circle Certification | **Not approved** — Future / Pending Founder Approval |

Do not present invented Health Score math or Annual Certification as final rules.

---

## Merger, split, suspension, archival

Permitted through **controlled platform processes** (FD-024).

- History of all Circles involved must be preserved.
- Members are not transferred blindly without validation.
- Exact merger/split voting, notice periods, and consent rules: **Unresolved**.

---

## Power Sector vs legacy “Power Circles”

FD-024 uses **GCE Power Sector** as the top taxonomy layer above Business Specialization.

Older overview docs named **Power Circles** without a definition. Until a Founder Decision defines Power Circles (if distinct), treat them as **Unresolved / legacy naming** and do not invent Power Circle behavior. Prefer **GCE Power Sector → Business Specialization → Business Tags**.

---

## AI Lead Assist and Circles

AI matching may consider Circle membership, seat/specialization availability, and activity (see `39_AI_Lead_Assist_Spec.md`). Rainmaker Pass Lead is to suitable **non-competing** members within the Circle context.

Membership eligibility and seat rules remain governed by FD-022 / FD-024.

---

## Cross references

- FD-024 Circle lifecycle (highest authority)
- FD-022 Membership lifecycle
- FD-023 RBAC
- FD-001 Business model
- `05_Memberships.md`
- `06_CBDP.md` (Connect BDP narrative; legacy filename)
- `35_Role_Taxonomy.md`
- `36_Commercial_Constants.md`
- `39_AI_Lead_Assist_Spec.md`
