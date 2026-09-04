import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GlassPanel } from "@/components/marketing/GlassPanel";

type MarketingHeroProps = {
  /** Main headline after the optional GCE brand mark */
  headline: string;
  description: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  align?: "left" | "center";
  compact?: boolean;
  showBrandHierarchy?: boolean;
  showBrandMark?: boolean;
  /**
   * When true, omit border + local gradient so a parent PageAtmosphere
   * can paint a continuous wash behind hero + body.
   */
  seamless?: boolean;
};

/**
 * Full-bleed brand hero — Batch 1.
 * Atmosphere via layered gradients (no fake stats).
 * Soft-deprecated on homepage: PUB-01 uses app/components/HeroBanner (animated bars).
 */
export function MarketingHero({
  headline,
  description,
  primaryCta,
  secondaryCta,
  align = "left",
  compact,
  showBrandHierarchy = false,
  showBrandMark = true,
  seamless = false,
}: MarketingHeroProps) {
  return (
    <section
      className={cn(
        "relative isolate overflow-hidden",
        !seamless && "border-b border-border",
        compact ? "py-8 sm:py-10" : "py-12 sm:py-16"
      )}
    >
      {!seamless ? (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-primary/10 via-background to-background dark:from-primary/15 dark:via-background dark:to-background"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 top-10 -z-10 h-72 w-72 rounded-full bg-secondary/15 blur-3xl dark:bg-primary/20"
          />
        </>
      ) : null}

      <div
        className={cn(
          "mx-auto max-w-7xl px-4 sm:px-6",
          align === "center" && "text-center"
        )}
      >
        <h1
          className={cn(
            "max-w-3xl text-balance text-foreground",
            align === "center" && "mx-auto"
          )}
        >
          {showBrandMark ? (
            <span className="font-display text-4xl tracking-wide text-primary md:text-5xl">
              GCE
            </span>
          ) : null}
          <span
            className={cn(
              "block font-body font-semibold tracking-tight",
              showBrandMark
                ? "mt-2 text-3xl md:text-4xl"
                : "text-3xl md:text-4xl"
            )}
          >
            {headline}
          </span>
        </h1>
        <p
          className={cn(
            "mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg",
            align === "center" && "mx-auto"
          )}
        >
          {description}
        </p>
        {(primaryCta || secondaryCta) && (
          <div
            className={cn(
              "mt-5 flex flex-wrap gap-3",
              align === "center" && "justify-center"
            )}
          >
            {primaryCta ? (
              <Button asChild size="lg" className="min-h-11 px-6">
                <Link href={primaryCta.href}>{primaryCta.label}</Link>
              </Button>
            ) : null}
            {secondaryCta ? (
              <Button asChild size="lg" variant="outline" className="min-h-11 px-6">
                <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
              </Button>
            ) : null}
          </div>
        )}

        {showBrandHierarchy ? (
          <GlassPanel
            className={cn(
              "mt-10 inline-flex max-w-xl flex-col gap-1 px-4 py-3 text-left text-sm text-muted-foreground",
              align === "center" && "mx-auto"
            )}
          >
            <span className="font-medium text-foreground">
              Growth Central Events
            </span>
            <span>
              Intended operator: Logixia Solutions Private Limited
              (incorporation pending). Verticals: Connect · Marketplace ·
              Enterprise.
            </span>
          </GlassPanel>
        ) : null}
      </div>
    </section>
  );
}
