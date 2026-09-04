"use client";

import Link from "next/link";
import { AnimatedSection } from "@/components/marketing/AnimatedSection";

const VERTICALS = [
  {
    kicker: "Network + Workflow",
    title: "GCE Connect",
    description:
      "Capacity-managed Circles, in-app referrals, and Lead Assist. Networking is governed — not a feed, not WhatsApp.",
    href: "/connect",
    action: "How Connect works",
  },
  {
    kicker: "Discovery + Transaction",
    title: "GCE Marketplace",
    description:
      "Published Events, Offers, and verified venues. Booking and claims continue in the customer journey after you sign in.",
    href: "/marketplace",
    action: "Browse Events",
    extra: [
      { href: "/events", label: "Events" },
      { href: "/offers", label: "Offers" },
      { href: "/venues", label: "Venues" },
    ],
  },
  {
    kicker: "Project + Milestone",
    title: "GCE Enterprise",
    description:
      "A Project Command Center for programmes — quotations, milestones, and componentised commercial rules. Settlement lives in Finance.",
    href: "/enterprise",
    action: "Enterprise programmes",
  },
] as const;

/** Homepage vertical stories — editorial, not three identical glass cards. */
export function Vertical3dSection() {
  return (
    <section className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16">
      <AnimatedSection>
        <h2 className="font-body text-2xl font-semibold text-foreground sm:text-3xl">
          Three verticals. One GCE.
        </h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Sub-brands stay inside their parent vertical — never peer master
          companies.
        </p>
      </AnimatedSection>

      <ol className="mt-10 space-y-10">
        {VERTICALS.map((item, index) => (
          <li key={item.href} className="border-t border-border pt-8">
            <AnimatedSection variant="rise" delay={0.04 * index}>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                {item.kicker}
              </p>
              <h3 className="mt-2 font-body text-xl font-semibold">{item.title}</h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
              <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                <Link
                  href={item.href}
                  className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  {item.action}
                </Link>
                {"extra" in item && item.extra
                  ? item.extra.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    ))
                  : null}
              </p>
            </AnimatedSection>
          </li>
        ))}
      </ol>
    </section>
  );
}
