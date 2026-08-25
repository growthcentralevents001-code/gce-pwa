import {
  AlertTriangle,
  Building2,
  CircleDollarSign,
  Home,
  LayoutDashboard,
  Users,
  Store,
  Briefcase,
  Shield,
  LifeBuoy,
  Lock,
  Target,
  Settings,
  MapPin,
  GitBranch,
  Scale,
  ArrowLeftRight,
  FileCheck,
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
        id: "browse",
        label: "Browse site",
        items: [
          {
            id: "homepage",
            label: "Homepage",
            href: "/",
            icon: Home,
          },
          {
            id: "marketplace",
            label: "Marketplace",
            href: "/marketplace",
            icon: Store,
          },
          {
            id: "connect-public",
            label: "Connect",
            href: "/connect",
            icon: Users,
          },
        ],
      },
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
            id: "specialisation",
            label: "Specialisation",
            href: "/connect/specialisation",
            icon: Briefcase,
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
    "connect-bdp": [
      {
        id: "main",
        label: "Workspace",
        items: [
          {
            id: "overview",
            label: "Overview",
            href: "/dashboard/connect-bdp",
            icon: LayoutDashboard,
            workspaces: ["connect-bdp"],
          },
          {
            id: "apply",
            label: "Application",
            href: "/connect-bdp/apply",
            icon: FileCheck,
          },
        ],
      },
      {
        id: "operations",
        label: "Operations",
        items: [
          {
            id: "unit",
            label: "Unit & package",
            href: "/connect-bdp/unit",
            icon: Building2,
          },
          {
            id: "city",
            label: "City assignment",
            href: "/connect-bdp/city",
            icon: MapPin,
          },
          {
            id: "members",
            label: "Members",
            href: "/connect-bdp/members",
            icon: Users,
          },
          {
            id: "circles",
            label: "Circles",
            href: "/connect-bdp/circles",
            icon: GitBranch,
          },
          {
            id: "targets",
            label: "Targets",
            href: "/connect-bdp/targets",
            icon: Target,
          },
        ],
      },
      {
        id: "commercial",
        label: "Commercial",
        items: [
          {
            id: "entitlements",
            label: "Entitlements",
            href: "/connect-bdp/entitlements",
            icon: CircleDollarSign,
          },
          {
            id: "disputes",
            label: "Disputes",
            href: "/connect-bdp/disputes",
            icon: Scale,
          },
          {
            id: "handover",
            label: "Handover",
            href: "/connect-bdp/handover",
            icon: ArrowLeftRight,
          },
        ],
      },
    ],
    "marketplace-bdp": [
      {
        id: "main",
        label: "Workspace",
        items: [
          {
            id: "overview",
            label: "Overview",
            href: "/dashboard/marketplace-bdp",
            icon: LayoutDashboard,
            workspaces: ["marketplace-bdp"],
          },
          {
            id: "apply",
            label: "Application",
            href: "/marketplace-bdp/apply",
            icon: FileCheck,
          },
        ],
      },
      {
        id: "portfolio",
        label: "Portfolio",
        items: [
          {
            id: "units",
            label: "Units",
            href: "/marketplace-bdp/units",
            icon: Building2,
          },
          {
            id: "venues",
            label: "Venues",
            href: "/marketplace-bdp/venues",
            icon: Store,
          },
          {
            id: "attribution",
            label: "Attribution",
            href: "/marketplace-bdp/attribution",
            icon: Users,
          },
          {
            id: "recommendations",
            label: "Recommendations",
            href: "/marketplace-bdp/recommendations",
            icon: Target,
          },
        ],
      },
      {
        id: "commercial",
        label: "Commercial",
        items: [
          {
            id: "entitlements",
            label: "Entitlements",
            href: "/marketplace-bdp/entitlements",
            icon: CircleDollarSign,
          },
          {
            id: "reassignment",
            label: "Reassignment",
            href: "/marketplace-bdp/reassignment",
            icon: ArrowLeftRight,
          },
        ],
      },
    ],
    venue: [
      {
        id: "main",
        label: "Workspace",
        items: [
          {
            id: "overview",
            label: "Overview",
            href: "/dashboard/venue",
            icon: LayoutDashboard,
            workspaces: ["venue"],
          },
          {
            id: "profile",
            label: "Profile",
            href: "/venue/profile",
            icon: Building2,
          },
        ],
      },
      {
        id: "operations",
        label: "Operations",
        items: [
          {
            id: "events",
            label: "Events",
            href: "/venue/events",
            icon: Target,
          },
          {
            id: "offers",
            label: "Offers",
            href: "/venue/offers",
            icon: Store,
          },
          {
            id: "bookings",
            label: "Bookings",
            href: "/venue/bookings",
            icon: Users,
          },
          {
            id: "check-in",
            label: "Check-in",
            href: "/venue/check-in",
            icon: FileCheck,
          },
          {
            id: "redemptions",
            label: "Redemptions",
            href: "/venue/redemptions",
            icon: Scale,
          },
        ],
      },
      {
        id: "commercial",
        label: "Commercial",
        items: [
          {
            id: "performance",
            label: "Performance",
            href: "/venue/performance",
            icon: Target,
          },
          {
            id: "entitlements",
            label: "Entitlements",
            href: "/venue/entitlements",
            icon: CircleDollarSign,
          },
        ],
      },
    ],
    "enterprise-bdp": [
      {
        id: "main",
        label: "Workspace",
        items: [
          {
            id: "overview",
            label: "Overview",
            href: "/dashboard/enterprise-bdp",
            icon: LayoutDashboard,
            workspaces: ["enterprise-bdp"],
          },
          {
            id: "apply",
            label: "Application",
            href: "/enterprise-bdp/apply",
            icon: FileCheck,
          },
        ],
      },
      {
        id: "portfolio",
        label: "Portfolio",
        items: [
          {
            id: "clients",
            label: "Clients",
            href: "/enterprise-bdp/clients",
            icon: Users,
          },
          {
            id: "pipeline",
            label: "Pipeline",
            href: "/enterprise-bdp/pipeline",
            icon: GitBranch,
          },
        ],
      },
      {
        id: "commercial",
        label: "Commercial",
        items: [
          {
            id: "entitlements",
            label: "Entitlements",
            href: "/enterprise-bdp/entitlements",
            icon: CircleDollarSign,
          },
          {
            id: "handover",
            label: "Handover",
            href: "/enterprise-bdp/handover",
            icon: ArrowLeftRight,
          },
          {
            id: "disputes",
            label: "Disputes",
            href: "/enterprise-bdp/disputes",
            icon: Scale,
          },
        ],
      },
    ],
    "enterprise-client": [
      {
        id: "main",
        label: "Workspace",
        items: [
          {
            id: "overview",
            label: "Overview",
            href: "/dashboard/enterprise-client",
            icon: LayoutDashboard,
            workspaces: ["enterprise-client"],
          },
        ],
      },
      {
        id: "pipeline",
        label: "Pipeline",
        items: [
          {
            id: "opportunities",
            label: "Opportunities",
            href: "/enterprise/opportunities",
            icon: Target,
          },
          {
            id: "requirements",
            label: "Requirements",
            href: "/enterprise/requirements",
            icon: FileCheck,
          },
          {
            id: "proposals",
            label: "Proposals",
            href: "/enterprise/proposals",
            icon: Briefcase,
          },
          {
            id: "quotes",
            label: "Quotes",
            href: "/enterprise/quotes",
            icon: CircleDollarSign,
          },
        ],
      },
      {
        id: "delivery",
        label: "Delivery",
        items: [
          {
            id: "projects",
            label: "Projects",
            href: "/enterprise/projects",
            icon: Building2,
          },
          {
            id: "vendors",
            label: "Vendors",
            href: "/enterprise/vendors",
            icon: Store,
          },
          {
            id: "disputes",
            label: "Disputes",
            href: "/enterprise/disputes",
            icon: Scale,
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
          {
            id: "ops-approvals",
            label: "Approvals",
            href: "/ops/approvals",
            icon: FileCheck,
          },
          {
            id: "ops-connect",
            label: "Connect Ops",
            href: "/ops/connect",
            icon: Building2,
          },
          {
            id: "ops-marketplace",
            label: "Marketplace Ops",
            href: "/ops/marketplace",
            icon: Store,
          },
          {
            id: "ops-enterprise",
            label: "Enterprise Ops",
            href: "/ops/enterprise",
            icon: Briefcase,
          },
        ],
      },
      {
        id: "expert",
        label: "Platform Expert",
        items: [
          {
            id: "expert-home",
            label: "Expert overview",
            href: "/enterprise-expert",
            icon: LayoutDashboard,
          },
          {
            id: "expert-queue",
            label: "Assigned queue",
            href: "/enterprise-expert/queue",
            icon: Target,
          },
          {
            id: "expert-requirements",
            label: "Requirements",
            href: "/enterprise-expert/requirements",
            icon: FileCheck,
          },
          {
            id: "expert-proposals",
            label: "Proposals",
            href: "/enterprise-expert/proposals",
            icon: Briefcase,
          },
          {
            id: "expert-projects",
            label: "Projects",
            href: "/enterprise-expert/projects",
            icon: Building2,
          },
          {
            id: "expert-vendors",
            label: "Vendors",
            href: "/enterprise-expert/vendors",
            icon: Store,
          },
        ],
      },
    ],
    "opportunity-desk": [
      {
        id: "main",
        label: "Desk",
        items: [
          {
            id: "overview",
            label: "Overview",
            href: "/dashboard/opportunity-desk",
            icon: LayoutDashboard,
            workspaces: ["opportunity-desk"],
          },
          {
            id: "queue",
            label: "Queue",
            href: "/desk/queue",
            icon: Target,
          },
        ],
      },
    ],
    finance: [
      {
        id: "main",
        label: "Workspace",
        items: [
          {
            id: "overview",
            label: "Overview",
            href: "/dashboard/finance",
            icon: LayoutDashboard,
            workspaces: ["finance"],
          },
        ],
      },
      {
        id: "money",
        label: "Money",
        items: [
          {
            id: "revenue",
            label: "Revenue",
            href: "/finance/revenue",
            icon: CircleDollarSign,
          },
          {
            id: "entitlements",
            label: "Entitlements",
            href: "/finance/entitlements",
            icon: Users,
          },
          {
            id: "holds",
            label: "Holds",
            href: "/finance/holds",
            icon: Shield,
          },
          {
            id: "recovery",
            label: "Recovery",
            href: "/finance/recovery",
            icon: Scale,
          },
        ],
      },
      {
        id: "settlement",
        label: "Settlement",
        items: [
          {
            id: "settlements",
            label: "Settlement batches",
            href: "/finance/settlements",
            icon: FileCheck,
          },
          {
            id: "payout",
            label: "Payout readiness",
            href: "/finance/payout-readiness",
            icon: Target,
          },
          {
            id: "recon",
            label: "Reconciliation",
            href: "/finance/reconciliation",
            icon: GitBranch,
          },
        ],
      },
      {
        id: "exceptions",
        label: "Exceptions",
        items: [
          {
            id: "refunds",
            label: "Refunds",
            href: "/finance/refunds",
            icon: ArrowLeftRight,
          },
          {
            id: "chargebacks",
            label: "Chargebacks",
            href: "/finance/chargebacks",
            icon: Scale,
          },
          {
            id: "offline",
            label: "Offline payments",
            href: "/finance/offline",
            icon: Building2,
          },
        ],
      },
    ],
    compliance: [
      {
        id: "main",
        label: "Compliance",
        items: [
          {
            id: "overview",
            label: "Overview",
            href: "/dashboard/compliance",
            icon: LayoutDashboard,
            workspaces: ["compliance"],
          },
          {
            id: "holds",
            label: "Holds",
            href: "/compliance/holds",
            icon: Shield,
          },
          {
            id: "ops-compliance",
            label: "Compliance Ops",
            href: "/ops/compliance",
            icon: Lock,
          },
          {
            id: "risk",
            label: "Risk review",
            href: "/ops/security?tab=risk",
            icon: AlertTriangle,
          },
        ],
      },
    ],
    support: [
      {
        id: "main",
        label: "Support",
        items: [
          {
            id: "overview",
            label: "Overview",
            href: "/dashboard/support",
            icon: LayoutDashboard,
            workspaces: ["support"],
          },
          {
            id: "signals",
            label: "Signals",
            href: "/ops/support",
            icon: LifeBuoy,
          },
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
