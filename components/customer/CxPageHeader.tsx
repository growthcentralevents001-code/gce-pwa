import Link from "next/link";
import { cn } from "@/lib/utils";

export function CxPageHeader({
  title,
  description,
  backHref,
  backLabel = "Back",
  actions,
  className,
}: {
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("mb-6 space-y-2", className)}>
      {backHref ? (
        <Link
          href={backHref}
          className="inline-flex min-h-11 items-center text-sm font-medium text-primary touch-manipulation"
        >
          ← {backLabel}
        </Link>
      ) : null}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-foreground sm:text-3xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        {actions}
      </div>
    </header>
  );
}
