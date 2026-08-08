"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/lib/frontend/navigation/types";
import { cn } from "@/lib/utils";

type MobileBottomNavProps = {
  items: NavItem[];
  className?: string;
};

function isActive(pathname: string, href: string): boolean {
  if (href === "/customer") return pathname === "/customer";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Mobile bottom navigation — touch-friendly, safe-area aware, route-aware.
 * Do not place partner/ops routes here.
 */
export function MobileBottomNav({ items, className }: MobileBottomNavProps) {
  const pathname = usePathname();
  const visible = items.filter((i) => i.mobileVisible !== false).slice(0, 5);

  return (
    <nav
      aria-label="Primary"
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80",
        "pb-[env(safe-area-inset-bottom)]",
        className
      )}
    >
      <ul className="mx-auto flex h-16 max-w-lg items-stretch justify-around px-1">
        {visible.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <li key={item.id} className="flex-1">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-full min-h-[2.75rem] flex-col items-center justify-center gap-0.5 px-1 text-[11px] font-medium transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {Icon ? (
                  <Icon
                    className={cn("h-5 w-5", active && "stroke-[2.25]")}
                    aria-hidden
                  />
                ) : null}
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
