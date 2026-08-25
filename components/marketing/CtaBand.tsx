import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GCE_SURFACE } from "@/lib/frontend/design-language";
import { cn } from "@/lib/utils";

type CtaBandProps = {
  title: string;
  description: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  className?: string;
};

export function CtaBand({
  title,
  description,
  primary,
  secondary,
  className,
}: CtaBandProps) {
  return (
    <section className={cn("mx-auto max-w-7xl px-4 py-12 sm:px-6", className)}>
      <div
        className={cn(
          GCE_SURFACE.warmHero,
          "rounded-2xl border border-border/70 p-8 sm:p-10"
        )}
      >
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <h2 className="font-body text-2xl font-semibold text-foreground">
              {title}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              {description}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="min-h-11">
              <Link href={primary.href}>{primary.label}</Link>
            </Button>
            {secondary ? (
              <Button asChild size="lg" variant="outline" className="min-h-11">
                <Link href={secondary.href}>{secondary.label}</Link>
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
