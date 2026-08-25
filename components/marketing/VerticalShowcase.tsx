import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AnimatedSection } from "@/components/marketing/AnimatedSection";
import { GCE_SURFACE } from "@/lib/frontend/design-language";
import { cn } from "@/lib/utils";

const CONNECT = {
  href: "/connect",
  name: "GCE Connect",
  title: "Meet the right people, on purpose.",
  body: "Structured Circles, specialisation, and in-app referrals — business networking with capacity, governance, and a clear membership lifecycle.",
  cta: "Explore Connect",
} as const;

const MARKETPLACE = {
  href: "/marketplace",
  name: "GCE Marketplace",
  title: "Events and Offer Events, in one catalogue.",
  body: "Discover published Marketplace Events and Offer Events, then continue into booking or claims in the customer journey.",
  cta: "Explore Marketplace",
} as const;

const ENTERPRISE = {
  href: "/enterprise",
  name: "GCE Enterprise",
  title: "Larger programmes, with commercial clarity.",
  body: "Organisational growth engagements through quotations, milestones, and componentised settlement — not a blank execution promise.",
  cta: "Explore Enterprise",
} as const;

export function VerticalShowcase() {
  return (
    <section className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
      <AnimatedSection>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 className="max-w-xl text-balance font-body text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            One GCE. Three ways businesses actually grow.
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground md:text-right">
            Connect, Marketplace, and Enterprise sit under Growth Central
            Events — not as three separate companies.
          </p>
        </div>
      </AnimatedSection>

      <div className="mt-12 grid gap-5 lg:grid-cols-12 lg:gap-6">
        <AnimatedSection className="lg:col-span-7" variant="rise">
          <VerticalPanel
            item={CONNECT}
            className={cn(
              GCE_SURFACE.warmHero,
              "min-h-[22rem] justify-end border border-border/70 p-6 sm:p-8 md:min-h-[26rem] md:p-10",
            )}
            featured
          />
        </AnimatedSection>

        <div className="flex flex-col gap-5 lg:col-span-5">
          <AnimatedSection delay={0.06} variant="rise">
            <VerticalPanel
              item={MARKETPLACE}
              className={cn(GCE_SURFACE.card, "p-6 sm:p-7")}
            />
          </AnimatedSection>
          <AnimatedSection delay={0.1} variant="rise">
            <VerticalPanel
              item={ENTERPRISE}
              className={cn(GCE_SURFACE.card, "p-6 sm:p-7")}
            />
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

function VerticalPanel({
  item,
  className,
  featured,
}: {
  item: typeof CONNECT | typeof MARKETPLACE | typeof ENTERPRISE;
  className?: string;
  featured?: boolean;
}) {
  return (
    <Link
      href={item.href}
      className={cn(
        "group flex h-full flex-col rounded-2xl transition-[box-shadow,transform] duration-300",
        "hover:shadow-lg hover:shadow-orange-950/10 active:scale-[0.99] touch-manipulation",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <p className="text-sm font-semibold text-primary">{item.name}</p>
      <h3
        className={cn(
          "mt-3 text-balance font-body font-semibold tracking-tight text-foreground",
          featured ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl",
        )}
      >
        {item.title}
      </h3>
      <p
        className={cn(
          "mt-3 max-w-prose text-sm leading-relaxed text-muted-foreground",
          featured && "sm:text-base",
        )}
      >
        {item.body}
      </p>
      <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-foreground">
        {item.cta}
        <ArrowRight
          className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
          aria-hidden
        />
      </span>
    </Link>
  );
}
