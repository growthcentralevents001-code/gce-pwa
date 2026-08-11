# Batch 9 — Settings + Notifications + Privacy

| Field | Value |
|-------|-------|
| **Status** | **COMPLETE — Settings Privacy experience ready for review** (non-blocking gaps remain) |
| **Date** | 2026-08-11 |
| **Branch** | `development` |
| **Batch 10** | Not started |
| **Phase 14B** | Not started |

---

## Routes

| ID | Route | Status |
|----|-------|--------|
| — | `/settings` | Overview (account snapshot) |
| SET-01 | `/settings/profile` | Created |
| SET-02 | `/settings/organisation` | Created (links only) |
| SET-03 | `/settings/workspaces` | Created (read-only + WorkspaceSwitcher) |
| SET-04 | `/settings/notifications` | Rebuilt (inbox + prefs via `/api/settings`) |
| SET-05 | `/settings/privacy` | Rebuilt (requests + safe copy) |
| SET-06 | `/settings/security` | Created (password + sessions FeatureGated) |
| — | `/profile` | Redirect → `/settings/profile` |
| — | `/api/settings` | Created (BG-07) |

One canonical Settings IA for all roles. No `/connect/settings` / `/finance/settings` forks.

---

## Governance preserved

- One account / multiple scoped roles
- Role suspension ≠ account suspension
- WorkspaceSwitcher reused — no second switcher
- No self-role assignment / Super Admin
- Live email/SMS/push OFF; preference ≠ delivery
- Marketing separate / optional
- Contact reveal not bypassed
- Privacy requests = reviewed workflow (no client hard-delete)
- No invented 30-day deletion clock
- No “GCE owns all data” wording
- No fake MFA / session list
- No dark-mode productization in Settings
- No accent/theme picker

---

## Shared components

| Component | Notes |
|-----------|-------|
| SettingsShell / SettingsNav | Desktop left nav; mobile chip list |
| SettingsSection / SettingsRow | Shared form language |
| NotificationPrefsForm | Explicit Save + orange Switch |
| NotificationInbox | Server unread; mark read |
| PrivacyRequestForm | Confirm + `/api/settings` |
| ProfileSettingsForm | PATCH `/api/identity/me` |
| PasswordUpdateForm / SignOutButton | Supabase Auth |

---

## 21st.dev (search-only)

| Search | IDs | Adopted | Rejected |
|--------|-----|---------|----------|
| Settings / prefs | 22210, 22225, 22226, 10597 | Grouped rows / preference sections | Glass-heavy account cards, blue toggles, matrix overload |
| Nav / danger | 1627, 9053 | Quiet settings nav structure | Animated glass sidebars, theme pickers |

ui-ux-pro-max: reduced-motion + typed inputs adopted; decorative blue themes rejected.

---

## Backend gaps

| ID | Gap | Class |
|----|-----|-------|
| BG-07 | Settings prefs API | **Closed** via `/api/settings` |
| BG-33 | Auth session list / revoke API | Security/session gap |
| BG-34 | Consent version read-model for Settings | Privacy workflow |
| BG-35 | Avatar upload convention for Settings | UX |
| BG-32 | Auth Playwright smoke identities | Test infra (carry) |

---

## Shell integration

- CustomerShell: Settings + notifications links
- PartnerShell account menu: Profile / Settings / Notifications
- Ops notifications remain under `/ops/notifications` for ops chrome

---

## Tests / gates

- `tests/unit/batch9-settings-presentation.test.ts`
- Authenticated browser smoke deferred (BG-32)
