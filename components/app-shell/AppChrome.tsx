"use client";

import { usePathname } from "next/navigation";
import { PublicShell } from "@/components/app-shell/PublicShell";

const SHELL_PREFIXES = ["/dashboard", "/customer", "/ops", "/unauthorized"];

/**
 * Root chrome router:
 * - App shells (dashboard/customer/ops/connect member) provide their own chrome
 * - Exact /connect marketing landing keeps PublicShell
 * - Public routes use PublicShell (leaves dirty Header.tsx untouched)
 */
export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  const isConnectMemberCx =
    pathname.startsWith("/connect/") && pathname !== "/connect";
  const isConnectBdpCx = pathname.startsWith("/connect-bdp/");
  const isMarketplaceBdpCx =
    pathname === "/marketplace-bdp" ||
    pathname.startsWith("/marketplace-bdp/");
  const isVenuePartnerCx =
    pathname.startsWith("/venue/") &&
    pathname !== "/venue/apply" &&
    !pathname.startsWith("/venue/plans");
  const isEnterpriseClientCx =
    pathname.startsWith("/enterprise/") &&
    pathname !== "/enterprise/signup" &&
    !pathname.startsWith("/enterprise/signup/");
  const isEnterpriseBdpCx =
    pathname === "/enterprise-bdp" ||
    pathname.startsWith("/enterprise-bdp/");
  const isEnterpriseExpertCx =
    pathname === "/enterprise-expert" ||
    pathname.startsWith("/enterprise-expert/");
  const isFinanceCx =
    pathname === "/finance" || pathname.startsWith("/finance/");
  const usesOwnShell =
    isConnectMemberCx ||
    isConnectBdpCx ||
    isMarketplaceBdpCx ||
    isVenuePartnerCx ||
    isEnterpriseClientCx ||
    isEnterpriseBdpCx ||
    isEnterpriseExpertCx ||
    isFinanceCx ||
    SHELL_PREFIXES.some(
      (p) => pathname === p || pathname.startsWith(`${p}/`)
    );

  if (usesOwnShell) {
    return <>{children}</>;
  }

  return <PublicShell>{children}</PublicShell>;
}
