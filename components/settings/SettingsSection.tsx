import { GCE_RADIUS, GCE_SURFACE, GCE_SPACING } from "@/lib/frontend/design-language";
import { cn } from "@/lib/utils";

export function SettingsSection({
  title,
  description,
  children,
  className,
  footer,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        GCE_RADIUS.card,
        GCE_SURFACE.card,
        "overflow-hidden",
        className
      )}
    >
      <header className="border-b border-border px-4 py-4 sm:px-5">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </header>
      <div className={cn(GCE_SPACING.cardPad, "sm:p-5")}>{children}</div>
      {footer ? (
        <footer className="border-t border-border px-4 py-3 sm:px-5">
          {footer}
        </footer>
      ) : null}
    </section>
  );
}

export function SettingsRow({
  label,
  description,
  control,
  htmlFor,
}: {
  label: string;
  description?: string;
  control: React.ReactNode;
  htmlFor?: string;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-border py-4 last:border-0 last:pb-0 first:pt-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 space-y-1">
        <label
          htmlFor={htmlFor}
          className="text-sm font-medium text-foreground"
        >
          {label}
        </label>
        {description ? (
          <p className="text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className="shrink-0">{control}</div>
    </div>
  );
}
