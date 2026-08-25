import Link from "next/link";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { id: "all", label: "All verticals" },
  { id: "connect", label: "Connect" },
  { id: "marketplace", label: "Marketplace" },
  { id: "enterprise", label: "Enterprise" },
] as const;

export function FinanceVerticalFilter({
  basePath,
  active,
}: {
  basePath: string;
  active?: string | null;
}) {
  const current = active && active.length > 0 ? active : "all";
  return (
    <nav aria-label="Filter by commercial vertical" className="flex flex-wrap gap-2">
      {OPTIONS.map((v) => {
        const href =
          v.id === "all" ? basePath : `${basePath}?vertical=${v.id}`;
        const isActive = current === v.id;
        return (
          <Link
            key={v.id}
            href={href}
            className={cn(
              "rounded-md border px-3 py-1.5 text-xs font-medium",
              isActive
                ? "border-primary bg-primary/10 text-foreground"
                : "border-border text-muted-foreground hover:bg-muted/60"
            )}
          >
            {v.label}
          </Link>
        );
      })}
    </nav>
  );
}
