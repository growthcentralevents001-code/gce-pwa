/**
 * Batch 9 — Settings presentation helpers (no policy authority).
 */

import { INACTIVE_FEATURE_FLAGS, OPS_GOVERNANCE_FLAGS } from "@/lib/architecture/types";

export const SETTINGS_COPY = {
  oneAccount:
    "One account. Multiple roles use scoped assignments — workspace switching does not create separate accounts.",
  roleVsAccount:
    "A suspended role does not mean your whole account is suspended.",
  channelPrefVsLive:
    "Preference saved does not mean a channel is currently operational.",
  marketingSeparate:
    "Marketing is optional and separate from essential account and transactional notices.",
  contactReveal:
    "Lead contact reveal remains server-authorized. Settings cannot bypass privacy rules.",
  noDataOwnership:
    "GCE processes account data under applicable policy — this is not unrestricted company ownership of your data.",
  privacyRequest:
    "Request submitted for review. Timing depends on the approved process — no fixed deletion clock is promised here.",
  noHardDelete:
    "Account closure is a reviewed request. This UI does not hard-delete records client-side.",
  noMfa: "Multi-factor authentication is not enabled on this product surface.",
  noSessions:
    "Device/session listing is not exposed by the current auth API.",
  noSelfRole: "You cannot grant yourself roles from Settings.",
} as const;

const LIVE_OFF = new Set<string>([
  ...INACTIVE_FEATURE_FLAGS,
  "notifications_email_live",
  "notifications_sms_live",
  "notifications_push_live",
  "marketing_notifications",
]);

/** Live delivery channels remain OFF per Phase 12 / inactive flags. */
export function channelLiveStatus() {
  return {
    inApp: true, // in-app may be active when notifications_in_app is on
    emailLive: !LIVE_OFF.has("notifications_email_live"),
    smsLive: !LIVE_OFF.has("notifications_sms_live"),
    pushLive: !LIVE_OFF.has("notifications_push_live"),
    marketingLive: !LIVE_OFF.has("marketing_notifications"),
    emailSandbox: OPS_GOVERNANCE_FLAGS.includes("notifications_email_sandbox"),
    smsSandbox: OPS_GOVERNANCE_FLAGS.includes("notifications_sms_sandbox"),
    pushSandbox: OPS_GOVERNANCE_FLAGS.includes("notifications_push_sandbox"),
  };
}

export function channelOperationalHint(channel: "email" | "sms" | "push" | "in_app" | "marketing") {
  const s = channelLiveStatus();
  if (channel === "in_app") {
    return "In-app notifications use the platform inbox when enabled.";
  }
  if (channel === "email") {
    return s.emailLive
      ? "Email delivery is operational."
      : "Preference can be saved. Live email delivery is not currently active.";
  }
  if (channel === "sms") {
    return s.smsLive
      ? "SMS delivery is operational."
      : "Preference can be saved. Live SMS delivery is not currently active.";
  }
  if (channel === "push") {
    return s.pushLive
      ? "Push delivery is operational."
      : "Preference can be saved. Live push delivery is not currently active.";
  }
  return s.marketingLive
    ? "Marketing channel is operational when opted in."
    : "Marketing preference can be saved. Marketing automation is not currently active.";
}

export type SettingsNavItem = {
  id: string;
  label: string;
  href: string;
  description?: string;
};

export const SETTINGS_NAV: SettingsNavItem[] = [
  {
    id: "overview",
    label: "Overview",
    href: "/settings",
    description: "Account snapshot",
  },
  {
    id: "profile",
    label: "Profile",
    href: "/settings/profile",
    description: "Personal profile",
  },
  {
    id: "organisation",
    label: "Organisation",
    href: "/settings/organisation",
    description: "Business profile links",
  },
  {
    id: "workspaces",
    label: "Workspaces & roles",
    href: "/settings/workspaces",
    description: "Assignments",
  },
  {
    id: "notifications",
    label: "Notifications",
    href: "/settings/notifications",
    description: "Inbox & preferences",
  },
  {
    id: "privacy",
    label: "Privacy",
    href: "/settings/privacy",
    description: "Requests & preferences",
  },
  {
    id: "security",
    label: "Security",
    href: "/settings/security",
    description: "Password & sessions",
  },
];
