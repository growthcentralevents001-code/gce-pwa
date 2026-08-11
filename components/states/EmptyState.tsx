import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { typography } from "@/lib/frontend/typography";

type Cta = {
  label: string;
  href?: string;
  onClick?: () => void;
};

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description?: string;
  primaryAction?: Cta;
  secondaryAction?: Cta;
  className?: string;
};

function ActionButton({
  action,
  variant,
}: {
  action: Cta;
  variant: "default" | "outline";
}) {
  if (action.href) {
    return (
      <Button asChild variant={variant}>
        <Link href={action.href}>{action.label}</Link>
      </Button>
    );
  }
  return (
    <Button type="button" variant={variant} onClick={action.onClick}>
      {action.label}
    </Button>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/40 px-6 py-12 text-center",
        className
      )}
      role="status"
    >
      {Icon ? (
        <Icon
          className="mb-3 h-10 w-10 text-muted-foreground"
          aria-hidden
        />
      ) : null}
      <h2 className={cn(typography.cardHeading)}>{title}</h2>
      {description ? (
        <p className={cn(typography.helper, "mt-2 max-w-md")}>{description}</p>
      ) : null}
      {(primaryAction || secondaryAction) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {primaryAction ? (
            <ActionButton action={primaryAction} variant="default" />
          ) : null}
          {secondaryAction ? (
            <ActionButton action={secondaryAction} variant="outline" />
          ) : null}
        </div>
      )}
    </div>
  );
}
