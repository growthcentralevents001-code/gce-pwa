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
} from "lucide-react";
import type { NavSection } from "./types";

/**
 * Ops navigation — Phase 13 routes preserved under /ops/*.
 * Vertical ops stay here (no connect-ops / marketplace-ops workspace keys).
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
        permission: "ops.approvals",
      },
      {
        id: "exceptions",
        label: "Exceptions",
        href: "/ops/exceptions",
        icon: AlertTriangle,
        permission: "ops.exceptions",
      },
      {
        id: "cases",
        label: "Cases",
        href: "/ops/cases",
        icon: FolderOpen,
        permission: "ops.cases",
      },
      {
        id: "incidents",
        label: "Incidents",
        href: "/ops/incidents",
        icon: Shield,
        permission: "ops.incidents",
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
        permission: "ops.vertical.connect",
      },
      {
        id: "marketplace-ops",
        label: "Marketplace",
        href: "/ops/marketplace",
        icon: Store,
        permission: "ops.vertical.marketplace",
      },
      {
        id: "enterprise-ops",
        label: "Enterprise",
        href: "/ops/enterprise",
        icon: Briefcase,
        permission: "ops.vertical.enterprise",
      },
      {
        id: "finance-ops",
        label: "Finance",
        href: "/ops/finance",
        icon: CircleDollarSign,
        permission: "ops.vertical.finance",
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
        permission: "compliance.hold",
      },
      {
        id: "support",
        label: "Support",
        href: "/ops/support",
        icon: LifeBuoy,
        permission: "ops.support",
      },
      {
        id: "notifications",
        label: "Notifications",
        href: "/ops/notifications",
        icon: Bell,
        permission: "ops.notifications",
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
        permission: "privacy.request",
      },
    ],
  },
];
