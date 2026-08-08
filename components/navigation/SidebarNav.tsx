"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem, NavSection } from "@/lib/frontend/navigation/types";
import { cn } from "@/lib/utils";

type SidebarNavProps = {
  sections: NavSection[];
  collapsed?: boolean;
  className?: string;
  dense?: boolean;
};

function itemActive(pathname: string, href: string): boolean {
  if (href === "/ops") return pathname === "/ops";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({
  item,
  collapsed,
  dense,
}: {
  item: NavItem;
  collapsed?: boolean;
  dense?: boolean;
}) {
  const pathname = usePathname();
  const active = itemActive(pathname, item.href);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      title={collapsed ? item.label : undefined}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-2 rounded-md text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        dense ? "px-2 py-1.5" : "px-3 py-2",
        collapsed && "justify-center px-2",
        active
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {Icon ? <Icon className="h-4 w-4 shrink-0" aria-hidden /> : null}
      {!collapsed ? <span className="truncate">{item.label}</span> : null}
    </Link>
  );
}

export function SidebarNav({
  sections,
  collapsed,
  className,
  dense,
}: SidebarNavProps) {
  return (
    <nav aria-label="Sidebar" className={cn("space-y-4", className)}>
      {sections.map((section) => (
        <div key={section.id}>
          {section.label && !collapsed ? (
            <p className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              {section.label}
            </p>
          ) : null}
          <ul className="space-y-0.5">
            {section.items.map((item) => (
              <li key={item.id}>
                <NavLink item={item} collapsed={collapsed} dense={dense} />
                {item.children && !collapsed
                  ? item.children.map((child) => (
                      <div key={child.id} className="ml-4 mt-0.5">
                        <NavLink item={child} dense={dense} />
                      </div>
                    ))
                  : null}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
