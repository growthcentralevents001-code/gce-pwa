import { cn } from "@/lib/utils";

/** Bounded surface — token-driven for light/dark consistency. */
export function GlassPanel({
  children,
  className,
  as: Comp = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "aside" | "article";
}) {
  return (
    <Comp
      className={cn(
        "rounded-2xl border border-border bg-card/80 shadow-sm shadow-primary/5 backdrop-blur-md",
        "dark:bg-card/90 dark:shadow-none",
        className
      )}
    >
      {children}
    </Comp>
  );
}
