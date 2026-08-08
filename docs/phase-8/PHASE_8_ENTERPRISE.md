# Phase 8 — GCE Enterprise

| Field | Value |
|-------|-------|
| **Phase** | 8 |
| **Status** | **Implemented on gce-dev** — see `PHASE_8_IMPLEMENTATION_NOTES.md` |
| **Classification** | Primarily **Business** (FD-026, FD-038, FD-034, FD-039) |
| **Date** | 2026-08-08 |

---

## 1. Authority

| Source | Owns |
|--------|------|
| **FD-026** | GCE Enterprise business and operating architecture (Franchise Pack, targets, platform commission, Enterprise BDP commission) |
| **FD-038** | Cross-vertical commercial/approval rules; Finance co-sign; vendors; milestones; componentisation; no-double-commission |
| **FD-034** | Logixia/GCE constitution; GCE does not ordinarily become physical executor unless Logixia expressly contracts |
| **FD-039** | Inactive vendor self-serve portal; payment online/offline posture; Phase 2 bounds |
| **FD-029** | Commission Engine interaction (does **not** alter Enterprise finance structure) |
| **FD-037** | Cross-boundary no-double-commission with Marketplace components |
| Constants | `docs/core/36_Commercial_Constants.md` |

**Label key:** **Business** · **Technical** · **PENDING PROFESSIONAL VALIDATION**

---

## 2. Purpose

Define Enterprise Client organisations, Client Representatives, Enterprise BDP packs, attribution, managed vendors (no mandatory login), Platform Expert quotation path, Finance co-sign above ₹5,00,000, projects/components/project-specific milestones, change orders, Marketplace Venue usage, componentised settlement, no double commission, vendor settlement, disputes, dashboards, state machines, and audit.

---

## 3. Scope

1. Enterprise Client organisation
2. Enterprise Client Representative (natural person)
3. Enterprise BDP Franchise Pack and attribution (client-based, not territory-based)
4. Managed vendors **without mandatory vendor login** (architecture allows future Vendor workspaces)
5. Enterprise Platform Expert
6. Requirement → opportunity → quote
7. Finance co-sign threshold **₹5,00,000**
8. Project, component, milestone (project-specific schedules)
9. Change orders
10. Marketplace Venue usage inside Enterprise delivery
11. Componentisation of commercial value
12. No double commission (Enterprise vs Marketplace)
13. Vendor settlement
14. Disputes
15. Dashboards
16. State machines and audit

---

## 4. Not in scope

- Vendor self-serve login portal — **inactive** (FD-039); future workspace allowed in architecture only
- Enterprise Vendor Opportunity Fee exact % — success concept approved but **non-active / unresolved %** — do not invent
- Fixed universal milestone percentages (30/40/30) as mandatory — **superseded**; milestones are project-specific (FD-038)
- Connect membership product — Phase 5
- Marketplace Affiliate — inactive
- Wallet cash-out — inactive
- Exact GST/TDS — PENDING PROFESSIONAL VALIDATION
- Guaranteed income claims

---

## 5. Dependencies

| Dependency | Why |
|------------|-----|
| Phase 4 | Enterprise BDP vs Client Rep split; workspaces; SoD |
| Phase 3 | Payments, jobs, flags |
| Phase 7 (where Venue used) | Marketplace Venue components without double commission |
| FD-020/021 | Settlement eligibility |
| State machines in §10 | Lifecycles |

---

## 6. Entry criteria

- Phase 4 distinguishes Enterprise BDP assignment from Enterprise Client Representative
- Commercial constants for pack fees and commission maths current
- Finance Admin assignment exists for co-sign path
- Feature flag: vendor portal off

## 7. Exit criteria

- Client org ≠ BDP ≠ Client Rep modelled distinctly
- Quotes cannot be issued as binding by Enterprise BDP alone
- Quotes above **₹5,00,000** total proposed project value require Finance co-sign before final issue
- Milestones stored per project (negotiated schedule)
- Componentisation prevents duplicate Enterprise + Marketplace BDP commission on same eligible component unless later FD authorises
- Vendors operable as managed records without login
- Dashboards for Enterprise BDP, Client Rep, Platform Expert, Finance
- Audit on quote issue, co-sign, milestone approve, settlement, dispute

---

## 8. Domain model summary

### 8.1 Parties (**Business**)

| Party | Meaning |
|-------|---------|
| **Enterprise Client** | Organisation-level client entity |
| **Enterprise Client Representative** | Authorised natural person for the client |
| **Enterprise BDP** | BD partner under client-based Franchise Pack attribution |
| **Enterprise Platform Expert** | Prepares quotations; capacity guidance max **10** active standard projects (FD-026) |
| **Managed Vendor** | Fulfilment stakeholder record; **no mandatory login** at launch (FD-038) |
| **Logixia / GCE** | Platform; clients/projects/data remain with GCE; physical fulfilment ordinarily vendor/stakeholder-led (FD-026/034/038) |

Allocation is **client-based**, not territory-based — no permanent territorial exclusivity (FD-038).

### 8.2 Franchise Pack constants (**Business**)

| Constant | Value | Source |
|----------|-------|--------|
| Min Enterprise project value | **₹1,00,000** eligible event revenue (ex GST/statutory taxes) | FD-026/028 |
| Direct pack fee | **₹30,000** upfront per pack (non-refundable after training or activation; not a deposit) | FD-026 |
| Financed package | **₹36,000** = ₹5,000 initial + ₹31,000 recoverable | FD-026 |
| Max monthly finance recovery | Up to **₹5,000** from earned approved Enterprise BDP commission only | FD-026 |
| Active clients / pack | **30** | FD-026 |
| Standard packs / person or controlled entity | Max **2** (60 clients); more needs special approval | FD-026 |
| Monthly target / pack | **₹3,00,000** eligible Enterprise event revenue | FD-026 |
| Rolling 3-month target | **₹9,00,000** | FD-026 |
| Standard GCE platform commission | **20%** of eligible Enterprise event revenue | FD-026/028 |
| Reduced platform commission | **15%–19%** strategic (not automatic); **below 15%** needs special Founder/senior approval | FD-026/028 |
| Enterprise BDP commission | Flat **25%** of eligible GCE platform commission actually earned (not 25% of project value) | FD-026/029/038 |

Recoverable balance is **not** event revenue (FD-028).

### 8.3 Finance co-sign (**Business** — FD-038)

Quotations with total proposed project value above **₹5,00,000** require **Finance co-sign** before final issue.

This is an **approval threshold only** — not a commission, tax, minimum-project, or guaranteed-value threshold.

### 8.4 Quotation authority (**Business**)

Enterprise Platform Expert prepares → authorised commercial/platform authority reviews → Finance co-sign where threshold triggered → official quotation issued.

**Enterprise BDP alone may not issue binding quotations** (FD-038).

### 8.5 Milestones and components (**Business**)

- Milestone structure is **project-specific and negotiated** — store approved schedule per project (FD-038).
- Historical illustrative 30/40/30 is **not** a fixed universal rule.
- Projects may be **componentised**; each component carries commercial classification for settlement and commission eligibility.
- **No double commission:** same eligible revenue component must not generate duplicate Enterprise and Marketplace BDP commission unless a later Founder Decision expressly authorises it (FD-037/038).

### 8.6 Marketplace Venue usage (**Business**)

Enterprise projects may use Marketplace Venue capabilities as components. When they do:

- Apply Marketplace settlement rules to Marketplace-classified components.
- Apply Enterprise rules to Enterprise-classified components.
- Prevent double-counting the same rupee across BDP commissions.

---

## 9. Workflows

### 9.1 Pack onboarding (**Business**)

1. Enterprise BDP applies → SoD approval → pay direct ₹30,000 or financed ₹36,000 (online default; offline Admin bank evidence per FD-039).
2. Activate pack; set client capacity 30; record recoverable balance if financed.
3. Attribution is to clients under the pack — not city exclusivity.

### 9.2 Client org and representative (**Business**)

1. Create Enterprise Client organisation.
2. Assign Enterprise Client Representative user(s) with org scope.
3. Keep distinct from Enterprise BDP assignment (FD-035/038).

### 9.3 Requirement → opportunity → quote (**Business**)

1. Capture requirement / opportunity (`SM_Enterprise_Opportunity`).
2. Platform Expert prepares quote (`SM_Enterprise_Quote`).
3. Commercial/platform review.
4. If total proposed value **> ₹5,00,000** → Finance co-sign required.
5. Issue official quotation; Enterprise BDP cannot bind alone.
6. On acceptance → project creation (`SM_Enterprise_Project`).

### 9.4 Project delivery — components, milestones, change orders (**Business**)

1. Define components and negotiated milestone schedule (`SM_Enterprise_Milestone`).
2. Execute via managed vendors / Platform Expert oversight; GCE not ordinary physical executor unless Logixia contracts that role.
3. Change orders: re-approve commercial deltas; re-trigger Finance co-sign if new total exceeds threshold or policy requires.
4. Milestone completion evidence → approval → settlement eligibility per FD-021 (payment ≠ settlement).

### 9.5 Commission and recovery (**Business**)

1. Platform commission on eligible Enterprise event revenue (standard 20% or approved reduced).
2. Enterprise BDP earns **25% of that platform commission** when attributed and eligible.
3. Financed recovery from earned approved Enterprise BDP commission only (≤ ₹5,000/month); unrecovered carries forward; no interest beyond fixed ₹36,000 package.
4. Vendor Opportunity Fee: not active — do not calculate invented %.

### 9.6 Vendor settlement and disputes (**Business**)

- Settle vendors per approved milestone/component entitlements and contracts.
- Disputes: hold commission/settlement states; SoD resolution; audit.
- No silent deletion of financial history.

### 9.7 Performance (**Business** — FD-026)

Formal review may trigger on two consecutive missed monthly targets, missed rolling three-month target, or material servicing failure → progressive sixty-day corrective process; **not** automatic cancellation after one/two weak months. Serious misconduct may suspend/terminate immediately.

### 9.8 Dashboards (**Business** + **Technical**)

| Workspace | Focus |
|-----------|-------|
| Enterprise BDP | Pack, clients, opportunities pipeline, attributed commission states, recovery |
| Enterprise Client Rep | Projects, milestones, quotes, approvals as scoped |
| Platform Expert | Active projects (capacity), quotes, vendor coordination |
| Finance Admin | Co-sign queue, settlements, disputes |
| Platform Admin | Pack activation, offline payments, reassignment |

---

## 10. State machines refs

| Machine | Path |
|---------|------|
| Opportunity | `docs/state-machines/SM_Enterprise_Opportunity.md` |
| Quote | `docs/state-machines/SM_Enterprise_Quote.md` |
| Project | `docs/state-machines/SM_Enterprise_Project.md` |
| Milestone | `docs/state-machines/SM_Enterprise_Milestone.md` |
| Payment | `docs/state-machines/SM_Payment.md` |
| Commission | `docs/state-machines/SM_Commission.md` |
| Settlement | `docs/state-machines/SM_Settlement.md` |
| Role assignment | `docs/state-machines/SM_Role_Assignment.md` |

Marketplace machines apply when Venue components are used (Phase 7).

---

## 11. Permissions notes

| Actor | May | Must not |
|-------|-----|----------|
| Enterprise BDP | Originate clients/opportunities; view attributed earnings | Issue binding quotes alone; territory exclusivity claims; double-dip Marketplace commission |
| Enterprise Client Rep | Client-scoped project visibility/approvals | Enterprise BDP commission tools |
| Platform Expert | Prepare quotes; coordinate delivery | Bypass Finance co-sign; unlimited capacity without policy |
| Finance Admin | Co-sign; settlement ops | Self-approve conflicted packs |
| Managed Vendor (record) | Fulfilment via ops-managed process | Mandatory login portal (inactive) |
| Marketplace BDP | Only on Marketplace-classified attributed components | Enterprise pack commission |

Root/Super Admin ordinary role: not applicable (FD-039).

---

## 12. Risks

| Risk | Mitigation |
|------|------------|
| Legacy `enterprise` role dual meaning | Forced split Client Rep vs BDP |
| BDP issuing binding quotes | Authority workflow + RBAC |
| Skipping Finance co-sign | Hard gate on amount > ₹5,00,000 |
| Fixed 30/40/30 milestones | Per-project schedule entity |
| Double commission with Marketplace Venue | Component classification + Commission Engine checks |
| Inventing Vendor Opportunity Fee % | Keep inactive |
| Treating GCE as default physical executor | FD-034/038 operating copy |

---

## 13. Unresolved items

| Item | Status |
|------|--------|
| Vendor Opportunity Fee % and distribution | Unresolved / non-active |
| Weighted major/multi-city Platform Expert capacity | Unresolved |
| Tax/GST/TDS on Enterprise fees and settlements | PENDING PROFESSIONAL VALIDATION |
| Future Vendor workspace UX | Architecture-ready; portal inactive |
| Exact dispute SLA | Pending ops design unless FD-stated |

---

## 14. Implementation notes (Technical)

1. Separate tables/entities: `enterprise_client_org`, `enterprise_client_rep_assignment`, `enterprise_bdp_pack`, `enterprise_project`, `enterprise_component`, `enterprise_milestone_schedule`.
2. Quote service enforces actor ≠ “BDP-only bind” and Finance co-sign when `total_proposed_value > 500000`.
3. Milestone dates/amounts are data, not hardcoded global percentages.
4. Component `commercial_family` enum-like field: `enterprise` | `marketplace` | … for commission routing.
5. Commission Engine guard: reject second BDP entitlement on same `eligible_component_id`.
6. Vendor records without auth users; optional future `vendor_workspace` flag default off.
7. Recovery job mirrors other BDP finance options but uses Enterprise ₹31,000 balance and FD-026 rules.
8. Change order versioning with audit diffs.
9. Dashboards scoped by assignment; Client Rep cannot read other clients.
10. Offline pack payment Admin path with evidence (FD-039).

---

## 15. Cross references

- FD-026, FD-038, FD-034, FD-039, FD-029, FD-037
- `docs/core/36_Commercial_Constants.md` (Enterprise section)
- Phase 4 identity split; Phase 7 for Venue components
- `docs/core/35_Role_Taxonomy.md`
