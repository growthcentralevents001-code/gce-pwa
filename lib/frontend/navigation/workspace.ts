import {
  Building2,
  CircleDollarSign,
  LayoutDashboard,
  Users,
  Store,
  Briefcase,
  Shield,
  LifeBuoy,
  Target,
  Settings,
} from "lucide-react";
import type { NavSection } from "./types";
import type { WorkspaceKey } from "@/lib/architecture/types";

/**
 * Partner / workspace shell nav — data-driven by workspace key.
 * Business screens land in later batches; hrefs point at canonical shells.
 */
export function workspaceNavSections(
  workspaceKey: WorkspaceKey
): NavSection[] {
  const base: NavSection = {
    id: "main",
    label: "Workspace",
    items: [
      {
        id: "overview",
        label: "Overview",
        href: `/dashboard/${workspaceKey}`,
        icon: LayoutDashboard,
        workspaces: [workspaceKey],
      },
    ],
  };

  const byWorkspace: Partial<Record<WorkspaceKey, NavSection[]>> = {
    personal: [
      base,
      {
        id: "account",
        label: "Account",
        items: [
          {
            id: "settings",
            label: "Settings",
            href: `/dashboard/${workspaceKey}/settings`,
            icon: Settings,
          },
        ],
      },
    ],
    "connect-member": [
      {
        id: "main",
        label: "Workspace",
        items: [
          {
            id: "overview",
            label: "Overview",
            href: "/dashboard/connect-member",
            icon: LayoutDashboard,
            workspaces: ["connect-member"],
          },
        ],
      },
      {
        id: "connect",
        label: "Connect",
        items: [
          {
            id: "membership",
            label: "Membership",
            href: "/connect/membership",
            icon: CircleDollarSign,
          },
          {
            id: "circle",
            label: "My Circle",
            href: "/connect/circle",
            icon: Users,
          },
          {
            id: "leads",
            label: "Lead Assist",
            href: "/connect/leads",
            icon: Target,
          },
          {
            id: "tags",
            label: "Tags",
            href: "/connect/tags",
            icon: Settings,
          },
          {
            id: "governance",
            label: "Governance",
            href: "/connect/governance",
            icon: Shield,
          },
        ],
      },
    ],
    "connect-bdp": [base],
    "marketplace-bdp": [base],
    venue: [
      base,
      {
        id: "venue",
        label: "Venue",
        items: [
          {
            id: "listings",
            label: "Listings",
            href: `/dashboard/${workspaceKey}/listings`,
            icon: Store,
          },
        ],
      },
    ],
    "enterprise-bdp": [base],
    "enterprise-client": [
      base,
      {
        id: "enterprise",
        label: "Enterprise",
        items: [
          {
            id: "engagements",
            label: "Engagements",
            href: `/dashboard/${workspaceKey}/engagements`,
            icon: Briefcase,
          },
        ],
      },
    ],
    "platform-ops": [
      base,
      {
        id: "ops-link",
        label: "Operations",
        items: [
          {
            id: "ops-hub",
            label: "Ops control plane",
            href: "/ops",
            icon: Shield,
          },
        ],
      },
    ],
    "opportunity-desk": [base],
    finance: [
      base,
      {
        id: "finance",
        label: "Finance",
        items: [
          {
            id: "ledger",
            label: "Ledger",
            href: `/dashboard/${workspaceKey}/ledger`,
            icon: CircleDollarSign,
          },
        ],
      },
    ],
    compliance: [base],
    support: [
      base,
      {
        id: "support",
        label: "Support",
        items: [
          {
            id: "cases",
            label: "Cases",
            href: "/ops/cases",
            icon: LifeBuoy,
          },
        ],
      },
    ],
  };

  return byWorkspace[workspaceKey] ?? [base];
}

/** Quarantined legacy entries — never merged into active nav. */
export const WORKSPACE_LEGACY_QUARANTINE = [
  { id: "zbp", href: "/dashboard/zbp", quarantined: true as const },
  { id: "bdm", href: "/dashboard/bdm", quarantined: true as const },
  { id: "affiliate", href: "/dashboard/affiliate", quarantined: true as const },
  {
    id: "franchisee",
    href: "/dashboard/franchisee",
    quarantined: true as const,
  },
  {
    id: "super-admin",
    href: "/admin",
    quarantined: true as const,
  },
];

export const WORKSPACE_SHELL_META = {
  icon: Building2,
} as const;
