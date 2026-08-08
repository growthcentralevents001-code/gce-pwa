import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GlassPanel } from "@/components/marketing/GlassPanel";

type MarketingHeroProps = {
  eyebrow?: string;
  /** Main headline after the GCE brand mark */
  headline: string;
  description: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  align?: "left" | "center";
  compact?: boolean;
  showBrandHierarchy?: boolean;
};

/**
 * Full-bleed brand hero — Batch 1.
 * Atmosphere via layered gradients (no fake stats).
 */
export function MarketingHero({
  eyebrow,
  headline,
  description,
  primaryCta,
  secondaryCta,
  align = "left",
  compact,
  showBrandHierarchy = false,
}: MarketingHeroProps) {
  return (
    <section
      className={cn(
        "relative isolate overflow-hidden border-b border-border",
        compact ? "py-14 sm:py-16" : "py-16 sm:py-24"
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 10% 0%, hsl(21 90% 48% / 0.18), transparent 55%), radial-gradient(ellipse 60% 50% at 90% 20%, hsl(217 91% 60% / 0.12), transparent 50%), linear-gradient(180deg, hsl(33 100% 97%), hsl(33 100% 94%))",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 top-10 -z-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
      />

      <div
        className={cn(
          "mx-auto max-w-7xl px-4 sm:px-6",
          align === "center" && "text-center"
        )}
      >
        {eyebrow ? (
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            {eyebrow}
          </p>
        ) : null}
        <h1
          className={cn(
            "max-w-3xl text-foreground",
            align === "center" && "mx-auto"
          )}
        >
          <span className="font-display text-4xl tracking-wide text-primary md:text-5xl">
            GCE
          </span>
          <span className="mt-2 block font-body text-3xl font-semibold tracking-tight md:text-4xl">
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
              "mt-8 flex flex-wrap gap-3",
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
              Logixia Solutions Private Limited → GCE
            </span>
            <span>
              Three verticals: Connect · Marketplace · Enterprise
            </span>
          </GlassPanel>
        ) : null}
      </div>
    </section>
  );
}
