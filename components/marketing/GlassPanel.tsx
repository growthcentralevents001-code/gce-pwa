import { cn } from "@/lib/utils";

/** Bounded glass surface — MASTER-compatible, contrast-safe. */
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
        "rounded-2xl border border-white/40 bg-white/70 shadow-lg shadow-orange-950/5 backdrop-blur-md",
        "dark:border-white/10 dark:bg-black/50",
        className
      )}
    >
      {children}
    </Comp>
  );
}
