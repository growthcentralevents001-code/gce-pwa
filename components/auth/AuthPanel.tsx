"use client";

import Link from "next/link";
import { typography } from "@/lib/frontend/typography";
import { GlassPanel } from "@/components/marketing/GlassPanel";
import { cn } from "@/lib/utils";

type AuthPanelProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  brandPoints?: string[];
};

/**
 * Split auth layout — glass form panel + brand side (desktop).
 */
export function AuthPanel({
  title,
  description,
  children,
  footer,
  brandPoints = [
    "One base identity per person",
    "Roles assigned through approvals — never self-granted",
    "Connect · Marketplace · Enterprise under GCE",
  ],
}: AuthPanelProps) {
  return (
    <div className="relative mx-auto grid min-h-[calc(100vh-8rem)] max-w-6xl items-center gap-8 px-4 py-10 lg:grid-cols-2 lg:px-6">
      <aside className="relative hidden overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/15 via-background to-info/10 p-10 lg:flex lg:min-h-[32rem] lg:flex-col lg:justify-between">
        <div>
          <p className={typography.brandMark}>GCE Events</p>
          <h2 className="mt-6 font-body text-3xl font-semibold tracking-tight text-foreground">
            Growth Central Events
          </h2>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            The platform layer for curated networking, marketplace experiences,
            and enterprise programmes — operated by Logixia Solutions Private
            Limited.
          </p>
        </div>
        <ul className="space-y-3 text-sm text-foreground">
          {brandPoints.map((point) => (
            <li
              key={point}
              className="flex items-start gap-2 rounded-xl border border-white/40 bg-white/50 px-3 py-2 backdrop-blur-sm"
            >
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              {point}
            </li>
          ))}
        </ul>
      </aside>

      <GlassPanel className={cn("mx-auto w-full max-w-md p-6 sm:p-8")}>
        <div className="mb-6 lg:hidden">
          <Link href="/" className={typography.brandMark}>
            GCE Events
          </Link>
        </div>
        <h1 className="font-body text-2xl font-semibold text-foreground">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        ) : null}
        <div className="mt-6">{children}</div>
        {footer ? (
          <div className="mt-6 border-t border-border pt-4 text-sm text-muted-foreground">
            {footer}
          </div>
        ) : null}
      </GlassPanel>
    </div>
  );
}
