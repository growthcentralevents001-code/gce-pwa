import Link from "next/link";
import { AlertCircle, FileQuestion, ServerCrash, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { typography } from "@/lib/frontend/typography";
import { cn } from "@/lib/utils";

type ErrorKind =
  | "recoverable"
  | "not_found"
  | "unauthorized"
  | "permission_denied"
  | "feature_unavailable"
  | "maintenance";

type ErrorStateProps = {
  kind?: ErrorKind;
  title?: string;
  description?: string;
  retryHref?: string;
  className?: string;
};

const KIND: Record<
  ErrorKind,
  { title: string; description: string; icon: typeof AlertCircle }
> = {
  recoverable: {
    title: "Something went wrong",
    description: "Please try again. If the problem continues, contact support.",
    icon: AlertCircle,
  },
  not_found: {
    title: "Not found",
    description: "We could not find what you were looking for.",
    icon: FileQuestion,
  },
  unauthorized: {
    title: "Sign in required",
    description: "Please sign in to continue.",
    icon: AlertCircle,
  },
  permission_denied: {
    title: "Permission denied",
    description: "You do not have permission to perform this action.",
    icon: AlertCircle,
  },
  feature_unavailable: {
    title: "Feature unavailable",
    description: "This feature is not available right now.",
    icon: Wrench,
  },
  maintenance: {
    title: "Temporarily unavailable",
    description:
      "A provider or service is temporarily unavailable. Please try again later.",
    icon: ServerCrash,
  },
};

export function ErrorState({
  kind = "recoverable",
  title,
  description,
  retryHref,
  className,
}: ErrorStateProps) {
  const meta = KIND[kind];
  const Icon = meta.icon;
  return (
    <div className={cn("mx-auto max-w-lg px-4 py-12", className)}>
      <Alert variant={kind === "maintenance" ? "warning" : "destructive"}>
        <Icon className="h-4 w-4" />
        <AlertTitle className={typography.cardHeading}>
          {title ?? meta.title}
        </AlertTitle>
        <AlertDescription>{description ?? meta.description}</AlertDescription>
      </Alert>
      {retryHref ? (
        <div className="mt-4">
          <Button asChild variant="outline">
            <Link href={retryHref}>Try again</Link>
          </Button>
        </div>
      ) : null}
    </div>
  );
}
