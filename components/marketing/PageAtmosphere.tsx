import { cn } from "@/lib/utils";

type PageAtmosphereProps = {
  className?: string;
  /** How tall the wash extends before dissolving into the page background. */
  heightClassName?: string;
};

/**
 * Zoom-style continuous page wash — soft brand orbs that dissolve into background.
 * Place once as a sibling behind page content (parent must be relative).
 */
export function PageAtmosphere({
  className,
  heightClassName = "h-[120vh]",
}: PageAtmosphereProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-0 top-0 -z-10 overflow-hidden",
        heightClassName,
        className,
      )}
    >
      {/* Base dissolve: warm primary tint → page background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.14] via-background/80 to-background dark:from-primary/20 dark:via-background/90 dark:to-background" />

      {/* Soft secondary lift near top */}
      <div className="absolute inset-x-0 top-0 h-[55%] bg-gradient-to-b from-secondary/10 to-transparent dark:from-secondary/15" />

      {/* Large blurred orbs — brand orange only */}
      <div className="absolute -left-24 -top-16 h-[28rem] w-[28rem] rounded-full bg-primary/25 blur-3xl dark:bg-primary/30" />
      <div className="absolute -right-20 top-24 h-[24rem] w-[24rem] rounded-full bg-secondary/20 blur-3xl dark:bg-secondary/25" />
      <div className="absolute left-1/3 top-[38%] h-[18rem] w-[18rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl dark:bg-primary/15" />

      {/* Final soft fade so mid-page has no hard band edge */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
