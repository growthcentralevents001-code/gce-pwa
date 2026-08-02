# GCE Connect Business Development Partner (Connect BDP)

## Authority

**Highest authority for Connect BDP commercial and operating rules:**
`docs/founder-decisions/FD-025_Connect_BDP_Commercial_and_Operating_Architecture.md`

**Related:** FD-001 (business model) · FD-020 / FD-021 (wallet / settlement) · FD-022 (memberships) · FD-023 (RBAC) · FD-024 (Circle lifecycle) · FD-027 (Membership commercial — Connect BDP may assist onboarding but cannot manually activate membership or collect payment personally) · Commercial number summary: `36_Commercial_Constants.md`

Approved role name: **GCE Connect Business Development Partner**. Approved short name: **Connect BDP**.

Legacy filename/label **CBDP** is retained for compatibility only; use **Connect BDP** in current documentation. Legacy routes such as `/api/cbdp/**` and historical enum values may remain temporarily for technical compatibility and must be treated as legacy pending migration mapping (do not invent final enums).

This living document summarises Connect BDP operations. On conflict, **FD-025 wins**. Do not invent unresolved FD-025 items (exact performance score, retention/attendance/complaint thresholds, banking-day payout adjustment, GST/TDS, legal franchise classification, deferred-finance package, exact DB/API/RLS designs).

---

## Commercial status

A Connect BDP is an independent GCE business partner authorised to operate an approved **Connect BDP Franchise Unit** within a platform-assigned territory.

A Connect BDP is **not** automatically a GCE employee and does **not** own GCE, territory, Circles, members, data, or platform assets.

---

## Connect BDP Franchise Unit

The commercial operating unit is the **Connect BDP Franchise Unit**.

Each Franchise Unit is separate and has its own territory, fee, Circle capacity, target period, commission attribution, performance record, and compliance record.

One Franchise Unit does **not** provide unlimited Circle or territory rights. Every additional Franchise Unit requires separate approval, territory, activation, fee, capacity, target, performance review, and commission attribution (FD-025).

Numeric constants: `36_Commercial_Constants.md` (defers to FD-025).

---

## Franchise Activation Fee

Approved fee: **₹50,000 per Franchise Unit** (FD-025).

The fee is one-time, non-refundable after activation, not a security deposit, and does not purchase permanent territory or ownership of Circles or members. Every additional Franchise Unit requires a separate ₹50,000 fee.

**Deferred finance is not active under FD-025.** Any future deferred package requires separate Founder approval plus legal/accounting review.

Package inclusions (summary): Business Partner certification, platform licence, Connect BDP dashboard access, Connect operations / community-building / business-development training, Circle-formation tools, initial operational support, and ongoing platform support under GCE policy. Full list: FD-025.

---

## Territory

Territory is assigned by GCE. Approved terminology: **Performance-Protected Assigned Territory**.

Territory is not permanently owned. GCE may restructure boundaries based on demand, performance, compliance, growth, operational requirements, and platform strategy (FD-025).

### City-tier allocation maxima (not guaranteed appointments)

| City tier | Structure | Maximum Franchise Units |
|-----------|-----------|-------------------------|
| Tier 1 | Five platform-defined zones; up to two Franchise Units per zone | **10** |
| Tier 2 | Five platform-defined zones; up to one Franchise Unit per zone | **5** |
| Tier 3 | Approximately five planning zones; two platform-defined operating territories | **2** |

Where two Connect BDPs operate in one Tier 1 zone, they must receive separate clusters or clearly defined scopes. Tier 3 “2.5 zones” is a planning reference only, not an undefined operating boundary.

Marketplace and Enterprise territory rights remain separate.

---

## Circle capacity and development target

Each Franchise Unit may develop **up to five** GCE Connect Circles.

Approved target: **five platform-activated Circles within ten months**.

Average pace: approximately **one activated Circle every two months**. It must **not** be written as one Circle per month.

Only **platform-activated** Circles count toward the completed target. Draft, Formation, or Pending Activation Circles do not count as completed.

Each activated Circle must comply with FD-024 (minimum activation remains 15 founding members; maximum Circle capacity remains 40 members). Connect BDP may initiate and support Circle development but **cannot independently activate**, change lifecycle status, suspend, merge, archive, or delete Circle history.

### Milestone reviews (cumulative activated Circles)

- Month 2: 1
- Month 4: 2
- Month 6: 3
- Month 8: 4
- Month 10: 5

Missing milestones does **not** automatically cause immediate cancellation (FD-025).

**Historical note:** older narratives referenced a ₹5,00,000 monthly sales target. That figure is **not** the Founder-approved Franchise Unit target under FD-025.

---

## Commission model

Connect BDP earns **20%** of eligible GCE Connect subscription revenue attributed to the relevant Franchise Unit (FD-025).

Commission applies only to eligible revenue that is successfully collected, linked to an eligible membership, activated, eligible for settlement, correctly attributed, and not under material dispute or hold.

Eligible commissionable items may include Associate Tier subscription/renewal, Core upgrade/renewal when applicable, and Tag 3 / Tag 4 subscriptions (FD-027). Not automatically commissionable: GST/taxes, refunds/reversals/chargebacks, transfer fees, penalties, Lead Assist fees, complimentary/promotional credits, uncollected amounts.

Exclusions from commission base include GST and other statutory taxes, refunds, reversals, chargebacks, failed payments, complimentary memberships, free trials, promotional credits, unauthorised collections, amounts not received, fraudulent / suspended / invalidly attributed transactions (full list: FD-025).

Formula:

```text
Eligible GCE Connect Subscription Revenue × 20% = Connect BDP Commission
```

### Illustrative full-capacity example (not guaranteed)

- 40 members × ₹2,000 monthly equivalent = ₹80,000 monthly subscription revenue per Circle
- ₹80,000 × 5 Circles = ₹4,00,000 monthly subscription revenue
- ₹4,00,000 × 20% = ₹80,000 monthly Connect BDP commission

This is an illustrative full-capacity example only. It must **not** be described as guaranteed income.

### Renewal commission

The Connect BDP continues earning **20%** on eligible renewals while the Franchise Unit remains active, the Connect BDP remains responsible for the Circle, required retention and operating responsibilities continue, and revenue remains eligible.

### Attribution and payout

Commission records should remain linked to member, membership, Circle, Franchise Unit, Connect BDP, subscription period, payment, activation, settlement status, refund/reversal, and commission amount. Historical attribution must remain preserved after reassignment.

Commission is calculated monthly and normally processed on the first day of the following month, subject to reconciliation, activation, settlement eligibility, refunds, chargebacks, fraud review, compliance holds, and attribution validation. Exact banking-day adjustment remains Pending Technical Design.

Numeric summary: `36_Commercial_Constants.md`. Settlement principles: FD-020 / FD-021.

---

## Responsibilities (summary)

Connect BDP responsibilities include prospect identification, membership consultation, business verification support, KYC coordination, category / specialization / tag guidance, seat-availability checks, founding-member recruitment, Circle creation requests, activation preparation, Circle growth, member retention, renewal support, governance guidance, meeting-quality oversight, complaint escalation, compliance support, performance reporting, and coordination with platform roles.

Full responsibility list: FD-025.

---

## Authority limits

Connect BDP may initiate and support Circle development and may assist membership onboarding.

Connect BDP may **not** independently:

- Activate a Circle
- Change Circle lifecycle status
- Suspend, merge, or archive a Circle
- Delete Circle history
- Activate membership manually or collect membership payment into a personal account (FD-027)
- Issue unofficial membership, change pricing, promise a seat without platform confirmation, add unapproved Tags, bypass KYC, override seat exclusivity, or guarantee Core eligibility / referrals / revenue (FD-027)
- Approve personal commission
- Move platform funds
- Change official taxonomy

---

## Performance management

Missing **two consecutive milestone review periods** triggers a formal performance review. It does **not** automatically trigger immediate cancellation.

Approved corrective process (FD-025):

1. Performance review
2. Written corrective plan
3. Sixty-day improvement period
4. Additional training or supervision
5. Temporary restrictions where required
6. Territory or Circle reassignment where necessary
7. Cancellation after continued failure

Exact performance score, retention threshold, attendance threshold, complaint threshold, and Circle Health Score formula remain unresolved / Pending Founder Approval or Pending Technical Design — do not invent them.

---

## Serious misconduct

Immediate suspension or termination may apply for fraud, unauthorised money collection, false KYC, fake members, commission manipulation, data theft, brand misuse, member harassment, serious conflict of interest, repeated compliance violations, criminal or regulatory risk, deliberate false reporting, and platform-security abuse (FD-025).

---

## Expansion

A Connect BDP may apply for another Franchise Unit after successfully developing five Circles and meeting performance and compliance conditions. Expansion is **not** automatic.

GCE may reserve an additional Franchise Unit opportunity for up to **five months**. Every additional unit requires a separate **₹50,000** fee and receives a separate target: five additional activated Circles within ten months.

Standard limit: maximum **two** active Franchise Units per individual or controlled business entity. A higher number requires special platform approval.

---

## Exit and reassignment

When a Connect BDP exits or is terminated:

- Circles, members, and territory remain with / return to GCE
- Member access should continue
- Historical attribution remains preserved
- Earned and approved commission remains payable subject to valid deductions
- Pending commission remains subject to review
- Future revenue follows the approved reassignment date
- Historical earned commission must not be transferred silently

Exact reassignment treatment for subscriptions spanning the effective date remains Pending Technical Design.

---

## Dashboard access

Each Connect BDP receives dedicated dashboard access (included in the Franchise Activation Fee package) covering membership sales, revenue, Circle management, member management, Franchise Unit performance, commission, analytics, notifications, training resources, and support — subject to FD-023 workspace and permission boundaries. Exact dashboard workflows remain Pending Technical Design.

---

## Business workflow (summary)

```text
Prospect identification
  ↓
Membership consultation / verification / KYC coordination
  ↓
Membership registration and eligible subscription purchase
  ↓
Circle creation request / founding-member recruitment
  ↓
Platform validation and activation (FD-024; Connect BDP cannot self-activate)
  ↓
Circle growth, retention, renewal support
  ↓
Commission attribution to Franchise Unit (FD-025)
```

---

## Key performance indicators

Platform monitoring may include activated Circles vs milestone reviews, eligible subscription revenue attributed to the Franchise Unit, retention and renewal support activity, meeting quality / complaint escalation signals, compliance status, and expansion eligibility.

Exact KPI formulas and thresholds beyond FD-025 milestone structure remain unresolved where not Founder-approved.

---

## Long-term vision

The Connect BDP program creates a nationwide network of independent business partners who develop GCE Connect Circles under Franchise Units, expand local business communities, and earn eligible subscription-revenue commission — without ownership of Circles, members, territory, or platform assets.
