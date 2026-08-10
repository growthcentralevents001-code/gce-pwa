import {
  AlertTriangle,
  Bell,
  CheckSquare,
  FolderOpen,
  LayoutDashboard,
  Lock,
  Shield,
  LifeBuoy,
  Building2,
  Store,
  Briefcase,
  CircleDollarSign,
  Search,
  Eye,
} from "lucide-react";
import type { NavSection } from "./types";

/**
 * Ops navigation — Phase 13 / Batch 8 under /ops/*.
 * Permission keys match ops-admin / ops-governance (pages still gate).
 * No mega-admin / Super Admin entry.
 */
export const OPS_NAV_SECTIONS: NavSection[] = [
  {
    id: "hub",
    label: "Control plane",
    items: [
      {
        id: "ops-home",
        label: "Hub",
        href: "/ops",
        icon: LayoutDashboard,
        permission: "ops.dashboard",
      },
      {
        id: "approvals",
        label: "Approvals",
        href: "/ops/approvals",
        icon: CheckSquare,
        permission: "ops.approvals.review",
      },
      {
        id: "exceptions",
        label: "Exceptions",
        href: "/ops/exceptions",
        icon: AlertTriangle,
        permission: "ops.exceptions.resolve",
      },
      {
        id: "cases",
        label: "Cases",
        href: "/ops/cases",
        icon: FolderOpen,
        permission: "ops.cases.manage",
      },
      {
        id: "incidents",
        label: "Incidents",
        href: "/ops/incidents",
        icon: Shield,
        permission: "ops.incident.manage",
      },
      {
        id: "moderation",
        label: "Moderation",
        href: "/ops/moderation",
        icon: Eye,
        permission: "ops.moderation",
      },
    ],
  },
  {
    id: "verticals",
    label: "Verticals",
    items: [
      {
        id: "connect-ops",
        label: "Connect",
        href: "/ops/connect",
        icon: Building2,
        permission: "ops.connect",
      },
      {
        id: "marketplace-ops",
        label: "Marketplace",
        href: "/ops/marketplace",
        icon: Store,
        permission: "ops.marketplace",
      },
      {
        id: "enterprise-ops",
        label: "Enterprise",
        href: "/ops/enterprise",
        icon: Briefcase,
        permission: "ops.enterprise",
      },
      {
        id: "finance-ops",
        label: "Finance entry",
        href: "/ops/finance",
        icon: CircleDollarSign,
        permission: "ops.finance",
      },
    ],
  },
  {
    id: "governance",
    label: "Governance",
    items: [
      {
        id: "compliance",
        label: "Compliance",
        href: "/ops/compliance",
        icon: Lock,
        permission: "ops.compliance",
      },
      {
        id: "holds",
        label: "Holds",
        href: "/compliance/holds",
        icon: Lock,
        permission: "ops.compliance",
      },
      {
        id: "support",
        label: "Support",
        href: "/ops/support",
        icon: LifeBuoy,
        permission: "ops.support",
      },
      {
        id: "desk",
        label: "Opportunity Desk",
        href: "/desk/queue",
        icon: Search,
        permission: "ops.dashboard",
      },
      {
        id: "notifications",
        label: "Notifications",
        href: "/ops/notifications",
        icon: Bell,
        permission: "ops.support",
      },
      {
        id: "security",
        label: "Security",
        href: "/ops/security",
        icon: Shield,
        permission: "security.read",
      },
      {
        id: "privacy",
        label: "Privacy",
        href: "/ops/privacy",
        icon: Lock,
        permission: "ops.compliance",
      },
    ],
  },
];
