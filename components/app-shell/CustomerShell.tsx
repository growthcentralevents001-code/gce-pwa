"use client";

import Link from "next/link";
import { Bell, MapPin } from "lucide-react";
import {
  CUSTOMER_PRIMARY_NAV,
  CUSTOMER_SECONDARY_NAV,
} from "@/lib/frontend/navigation/customer";
import { filterNavItems } from "@/lib/frontend/navigation/filter";
import { MobileBottomNav } from "@/components/navigation/MobileBottomNav";
import { SkipToContent } from "@/components/layout/ContentContainer";
import { Button } from "@/components/ui/button";
import { typography } from "@/lib/frontend/typography";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

type CustomerShellProps = {
  children: React.ReactNode;
  locationLabel?: string;
  userLabel?: string;
};

function isActive(pathname: string, href: string): boolean {
  if (href === "/customer") return pathname === "/customer";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Customer activity shell.
 * Phone: max-w-lg + bottom nav. Desktop: widens so catalogue master–detail works.
 */
export function CustomerShell({
  children,
  locationLabel,
  userLabel,
}: CustomerShellProps) {
  const pathname = usePathname() || "";
  const bottom = filterNavItems(CUSTOMER_PRIMARY_NAV, { mobile: true });
  const secondary = filterNavItems(CUSTOMER_SECONDARY_NAV);
  const desktopPrimary = filterNavItems(CUSTOMER_PRIMARY_NAV);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SkipToContent />
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-3 px-4">
          <div className="min-w-0">
            <Link href="/customer" className={typography.brandMark}>
              GCE
            </Link>
            {locationLabel ? (
              <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 shrink-0" aria-hidden />
                <span>{locationLabel}</span>
              </p>
            ) : (
              <p className="truncate text-xs text-muted-foreground">
                Discover nearby
              </p>
            )}
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Button asChild variant="ghost" size="icon" aria-label="Notifications">
              <Link href="/settings/notifications">
                <Bell className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/settings">{userLabel ?? "Settings"}</Link>
            </Button>
          </div>
        </div>
        <div className="mx-auto hidden w-full max-w-6xl items-center gap-4 px-4 pb-2 lg:flex">
          {desktopPrimary.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              aria-current={isActive(pathname, item.href) ? "page" : undefined}
              className={cn(
                "text-sm font-medium",
                isActive(pathname, item.href)
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
          <span className="text-border">|</span>
          {secondary.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </div>
        {secondary.length > 0 ? (
          <div className="mx-auto flex w-full max-w-lg flex-wrap gap-x-3 gap-y-1 px-4 pb-2 lg:hidden">
            {secondary.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </div>
        ) : null}
      </header>

      <main
        id="main-content"
        className="mx-auto w-full max-w-lg flex-1 px-4 py-4 pb-24 lg:max-w-6xl lg:pb-8"
      >
        {children}
      </main>

      <MobileBottomNav items={bottom} className="lg:hidden" />
    </div>
  );
}
