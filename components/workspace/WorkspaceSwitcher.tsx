"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronsUpDown, Check } from "lucide-react";
import type { WorkspaceKey } from "@/lib/architecture/types";
import { WORKSPACE_KEYS } from "@/lib/architecture/types";
import { workspaceLabel } from "@/lib/frontend/workspace/labels";
import { switchWorkspaceAction } from "@/app/dashboard/[workspaceKey]/actions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WorkspaceResolverSkeleton } from "@/components/states/LoadingSkeletons";
import { EmptyState } from "@/components/states/EmptyState";
import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

type WorkspaceSwitcherProps = {
  current: WorkspaceKey | null;
  allowed: WorkspaceKey[];
  roleLabel?: string;
  scopeLabel?: string;
  loading?: boolean;
  className?: string;
  /** Compact trigger for sidebar */
  compact?: boolean;
};

/**
 * Canonical workspace switcher — consumes backend-allowed keys only.
 * Preference persistence via switchWorkspaceAction (ADR-003).
 */
export function WorkspaceSwitcher({
  current,
  allowed,
  roleLabel,
  scopeLabel,
  loading,
  className,
  compact,
}: WorkspaceSwitcherProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  if (loading) return <WorkspaceResolverSkeleton />;

  const safeAllowed = allowed.filter((k) =>
    (WORKSPACE_KEYS as readonly string[]).includes(k)
  );

  if (safeAllowed.length === 0) {
    return (
      <EmptyState
        icon={Building2}
        title="No workspaces available"
        description="Your account has no active workspace assignments yet."
        className="py-6"
      />
    );
  }

  const currentSafe =
    current && safeAllowed.includes(current) ? current : safeAllowed[0];

  function switchTo(next: WorkspaceKey) {
    if (next === currentSafe) return;
    startTransition(async () => {
      const result = await switchWorkspaceAction(next, true);
      if (result.ok) {
        router.push(`/dashboard/${result.workspaceKey}`);
        router.refresh();
      }
    });
  }

  return (
    <div className={cn("w-full", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-between gap-2 font-body",
              compact ? "h-9 px-2" : "h-10"
            )}
            disabled={pending}
            aria-label={`Current workspace: ${workspaceLabel(currentSafe)}`}
          >
            <span className="flex min-w-0 flex-col items-start text-left">
              <span className="truncate text-sm font-medium">
                {workspaceLabel(currentSafe)}
              </span>
              {(roleLabel || scopeLabel) && !compact ? (
                <span className="truncate text-[11px] text-muted-foreground">
                  {[roleLabel, scopeLabel].filter(Boolean).join(" · ")}
                </span>
              ) : null}
            </span>
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-60" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-[14rem]">
          <DropdownMenuLabel>Switch workspace</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {safeAllowed.map((key) => (
            <DropdownMenuItem
              key={key}
              disabled={pending}
              onSelect={() => switchTo(key)}
              className="flex items-center justify-between gap-2"
            >
              <span>{workspaceLabel(key)}</span>
              {key === currentSafe ? (
                <Check className="h-4 w-4 text-primary" aria-label="Current" />
              ) : null}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {pending ? (
        <p className="mt-1 text-xs text-muted-foreground" aria-live="polite">
          Saving preference…
        </p>
      ) : null}
    </div>
  );
}
