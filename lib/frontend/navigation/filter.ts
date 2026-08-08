import type { NavItem, NavSection } from "./types";
import {
  FUTURE_INACTIVE_NAV_IDS,
  LEGACY_NAV_IDS,
  isLegacyNavHref,
} from "./legacy-quarantine";

export type FilterNavOptions = {
  /** Active permission keys the actor holds (presentation filter only). */
  permissions?: string[];
  /** Allowed workspace keys from backend entitlements. */
  allowedWorkspaces?: string[];
  /** Current workspace key. */
  currentWorkspace?: string;
  /** Feature flags that are currently OFF / inactive. */
  inactiveFeatureFlags?: string[];
  /** Viewport hint */
  mobile?: boolean;
};

function isQuarantined(item: NavItem): boolean {
  if (item.quarantined) return true;
  if ((LEGACY_NAV_IDS as readonly string[]).includes(item.id)) return true;
  if ((FUTURE_INACTIVE_NAV_IDS as readonly string[]).includes(item.id))
    return true;
  if (isLegacyNavHref(item.href)) return true;
  return false;
}

export function filterNavItems(
  items: NavItem[],
  options: FilterNavOptions = {}
): NavItem[] {
  const {
    permissions,
    allowedWorkspaces,
    currentWorkspace,
    inactiveFeatureFlags = [],
    mobile,
  } = options;

  return items
    .filter((item) => {
      if (isQuarantined(item)) return false;
      if (mobile === true && item.mobileVisible === false) return false;
      if (mobile === false && item.desktopVisible === false) return false;
      if (
        item.featureFlag &&
        inactiveFeatureFlags.includes(item.featureFlag)
      ) {
        return false;
      }
      if (item.permission && permissions) {
        if (!permissions.includes(item.permission)) return false;
      }
      if (item.workspaces && item.workspaces.length > 0) {
        if (currentWorkspace && !item.workspaces.includes(currentWorkspace)) {
          return false;
        }
        if (
          allowedWorkspaces &&
          !item.workspaces.some((w) => allowedWorkspaces.includes(w))
        ) {
          return false;
        }
      }
      return true;
    })
    .map((item) => ({
      ...item,
      children: item.children
        ? filterNavItems(item.children, options)
        : undefined,
    }));
}

export function filterNavSections(
  sections: NavSection[],
  options: FilterNavOptions = {}
): NavSection[] {
  return sections
    .map((section) => ({
      ...section,
      items: filterNavItems(section.items, options),
    }))
    .filter((section) => section.items.length > 0);
}
