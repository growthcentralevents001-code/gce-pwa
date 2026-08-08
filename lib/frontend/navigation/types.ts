import type { LucideIcon } from "lucide-react";

export type NavShell = "public" | "customer" | "workspace" | "ops";

export type NavItem = {
  id: string;
  label: string;
  href: string;
  icon?: LucideIcon;
  /** Optional permission key — filtered client-side for chrome only; server still authorizes. */
  permission?: string;
  /** Workspace keys that may see this item (workspace shell). Empty = all allowed. */
  workspaces?: string[];
  /** Feature flag id — when listed and inactive, hide or gate. */
  featureFlag?: string;
  mobileVisible?: boolean;
  desktopVisible?: boolean;
  section?: string;
  /** Never show in active nav (legacy quarantine). */
  quarantined?: boolean;
  children?: NavItem[];
};

export type NavSection = {
  id: string;
  label?: string;
  items: NavItem[];
};
