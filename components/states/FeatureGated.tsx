import { Construction } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

type FeatureGatedProps = {
  title?: string;
  description?: string;
  /** unavailable | coming_later | disabled_in_environment */
  mode?: "unavailable" | "coming_later" | "disabled_in_environment";
  className?: string;
};

const MODE_COPY = {
  unavailable: {
    title: "Feature unavailable",
    description: "This capability is not available for your account right now.",
  },
  coming_later: {
    title: "Coming later",
    description:
      "This capability is planned but not yet active on the platform.",
  },
  disabled_in_environment: {
    title: "Disabled in this environment",
    description:
      "This capability is turned off for the current environment and will remain inactive until activated by platform policy.",
  },
} as const;

/**
 * Feature-gated UI for inactive flags (payments, live notify, paid Lead Assist, etc.).
 * Avoid leaking internal flag names to end users.
 */
export function FeatureGated({
  title,
  description,
  mode = "disabled_in_environment",
  className,
}: FeatureGatedProps) {
  const copy = MODE_COPY[mode];
  return (
    <Alert variant="warning" className={cn(className)}>
      <Construction className="h-4 w-4" />
      <AlertTitle>{title ?? copy.title}</AlertTitle>
      <AlertDescription>{description ?? copy.description}</AlertDescription>
    </Alert>
  );
}
