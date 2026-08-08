import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { typography } from "@/lib/frontend/typography";
import { cn } from "@/lib/utils";

type AccessDeniedProps = {
  title?: string;
  description?: string;
  reason?: "workspace" | "permission" | "suspended" | "route" | "generic";
  homeHref?: string;
  className?: string;
};

const COPY: Record<
  NonNullable<AccessDeniedProps["reason"]>,
  { title: string; description: string }
> = {
  workspace: {
    title: "Workspace unavailable",
    description:
      "You do not have an active assignment for this workspace. Switch to an available workspace or contact support.",
  },
  permission: {
    title: "Permission required",
    description:
      "Your current role does not include access to this area. Ask an administrator if you believe this is a mistake.",
  },
  suspended: {
    title: "Access suspended",
    description:
      "This assignment or identity is currently suspended. Contact Compliance or Platform Ops for review.",
  },
  route: {
    title: "Page not available",
    description: "This route is not available for your account.",
  },
  generic: {
    title: "Access denied",
    description: "You are not authorized to view this content.",
  },
};

/**
 * Canonical access-denied UI. Server must still block unauthorized access.
 * Do not use this alone as authorization.
 */
export function AccessDenied({
  title,
  description,
  reason = "generic",
  homeHref = "/",
  className,
}: AccessDeniedProps) {
  const copy = COPY[reason];
  return (
    <div
      className={cn(
        "mx-auto flex max-w-lg flex-col items-center px-4 py-16 text-center",
        className
      )}
      role="alert"
    >
      <ShieldAlert className="mb-4 h-12 w-12 text-destructive" aria-hidden />
      <h1 className={typography.pageTitle}>{title ?? copy.title}</h1>
      <p className={cn(typography.helper, "mt-3")}>
        {description ?? copy.description}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href={homeHref}>Go home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/dashboard/personal">Open Personal workspace</Link>
        </Button>
      </div>
    </div>
  );
}
