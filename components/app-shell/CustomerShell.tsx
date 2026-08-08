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
import { cn } from "@/lib/utils";

type CustomerShellProps = {
  children: React.ReactNode;
  locationLabel?: string;
  userLabel?: string;
};

/**
 * Mobile-first customer shell with bottom navigation.
 * Business screens are owned by Batch 2+.
 */
export function CustomerShell({
  children,
  locationLabel,
  userLabel,
}: CustomerShellProps) {
  const bottom = filterNavItems(CUSTOMER_PRIMARY_NAV, { mobile: true });
  const secondary = filterNavItems(CUSTOMER_SECONDARY_NAV);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SkipToContent />
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-lg items-center justify-between gap-3 px-4">
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
            <Button
              variant="ghost"
              size="icon"
              aria-label="Notifications (coming soon)"
              disabled
            >
              <Bell className="h-4 w-4" />
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/customer/profile">{userLabel ?? "Account"}</Link>
            </Button>
          </div>
        </div>
        {secondary.length > 0 ? (
          <div className="mx-auto hidden max-w-lg gap-2 px-4 pb-2 sm:flex">
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
        className={cn("mx-auto w-full max-w-lg flex-1 px-4 py-4", "pb-24")}
      >
        {children}
      </main>

      <MobileBottomNav items={bottom} />
    </div>
  );
}
