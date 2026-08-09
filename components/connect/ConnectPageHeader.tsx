import Link from "next/link";
import { cn } from "@/lib/utils";
import { typography } from "@/lib/frontend/typography";

export function ConnectPageHeader({
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
          className="inline-flex min-h-11 items-center text-sm font-medium text-primary underline-offset-4 hover:underline touch-manipulation"
        >
          ← {backLabel}
        </Link>
      ) : null}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className={cn(typography.pageTitle)}>{title}</h1>
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
