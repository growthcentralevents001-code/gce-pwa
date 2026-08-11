"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SETTINGS_NAV } from "@/lib/frontend/settings/format";
import { cn } from "@/lib/utils";
import { GCE_RADIUS, GCE_SURFACE } from "@/lib/frontend/design-language";

/**
 * Settings left nav — desktop sticky; mobile horizontal scroll chips.
 * Active state uses orange (no decorative blue).
 */
export function SettingsNav({ className }: { className?: string }) {
  const pathname = usePathname() || "/settings";

  return (
    <nav
      aria-label="Settings"
      className={cn("w-full", className)}
    >
      <ul
        className={cn(
          "flex gap-1 overflow-x-auto pb-1 md:flex-col md:overflow-visible md:pb-0",
          GCE_RADIUS.card,
          GCE_SURFACE.card,
          "p-2 md:p-3"
        )}
      >
        {SETTINGS_NAV.map((item) => {
          const active =
            item.href === "/settings"
              ? pathname === "/settings"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <li key={item.id} className="shrink-0 md:shrink">
              <Link
                href={item.href}
                className={cn(
                  "block rounded-xl px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                aria-current={active ? "page" : undefined}
              >
                <span className="block">{item.label}</span>
                {item.description ? (
                  <span className="mt-0.5 hidden text-xs font-normal text-muted-foreground md:block">
                    {item.description}
                  </span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
