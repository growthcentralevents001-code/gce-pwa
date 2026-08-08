"use client";

import { usePathname } from "next/navigation";
import { PublicShell } from "@/components/app-shell/PublicShell";

const SHELL_PREFIXES = ["/dashboard", "/customer", "/ops", "/unauthorized"];

/**
 * Root chrome router:
 * - App shells (dashboard/customer/ops) provide their own chrome
 * - Public routes use PublicShell (leaves dirty Header.tsx untouched)
 */
export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  const usesOwnShell = SHELL_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  if (usesOwnShell) {
    return <>{children}</>;
  }

  return <PublicShell>{children}</PublicShell>;
}
