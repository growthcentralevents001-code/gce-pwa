import { GCE_RADIUS, GCE_SURFACE } from "@/lib/frontend/design-language";
import type { OnboardingProgressStep } from "@/lib/architecture/marketplace/onboarding";
import { cn } from "@/lib/utils";

export function VenueOnboardingProgress({
  steps,
  className,
}: {
  steps: OnboardingProgressStep[];
  className?: string;
}) {
  return (
    <ol className={cn("space-y-3", className)}>
      {steps.map((step, index) => (
        <li
          key={step.id}
          className={cn(
            GCE_RADIUS.card,
            GCE_SURFACE.card,
            "flex gap-3 p-4",
            step.state === "blocked" && "border border-destructive/40"
          )}
        >
          <span
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
              step.state === "complete" && "bg-success/15 text-success",
              step.state === "current" && "bg-primary/15 text-primary",
              step.state === "pending" && "bg-muted text-muted-foreground",
              step.state === "blocked" && "bg-destructive/15 text-destructive"
            )}
            aria-hidden
          >
            {step.state === "complete" ? "✓" : index + 1}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium">{step.label}</p>
            {step.detail ? (
              <p className="mt-1 text-xs text-muted-foreground">{step.detail}</p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
