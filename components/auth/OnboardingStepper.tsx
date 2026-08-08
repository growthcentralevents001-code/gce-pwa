"use client";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export type OnboardingStep = {
  id: string;
  label: string;
};

type OnboardingStepperProps = {
  steps: OnboardingStep[];
  currentIndex: number;
  className?: string;
};

export function OnboardingStepper({
  steps,
  currentIndex,
  className,
}: OnboardingStepperProps) {
  const pct =
    steps.length <= 1
      ? 100
      : Math.round((currentIndex / (steps.length - 1)) * 100);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-foreground">
          Step {currentIndex + 1} of {steps.length}
          <span className="text-muted-foreground">
            {" "}
            · {steps[currentIndex]?.label}
          </span>
        </p>
        <span className="text-xs text-muted-foreground">{pct}%</span>
      </div>
      <Progress value={pct} aria-label="Onboarding progress" />
      <ol className="hidden gap-2 sm:flex">
        {steps.map((step, i) => (
          <li
            key={step.id}
            className={cn(
              "rounded-full px-2.5 py-1 text-xs",
              i === currentIndex
                ? "bg-primary/15 font-medium text-primary"
                : i < currentIndex
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground"
            )}
          >
            {step.label}
          </li>
        ))}
      </ol>
    </div>
  );
}
