import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function PageSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-4 p-4", className)} aria-busy aria-label="Loading page">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-72" />
      <Skeleton className="h-40 w-full" />
    </div>
  );
}

export function DashboardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3", className)}
      aria-busy
      aria-label="Loading dashboard"
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-28 w-full" />
      ))}
    </div>
  );
}

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-3 rounded-lg border p-4", className)} aria-busy>
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}

export function ListSkeleton({
  rows = 5,
  className,
}: {
  rows?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)} aria-busy aria-label="Loading list">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}

export function NavSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-2 p-3", className)} aria-busy aria-label="Loading navigation">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-9 w-full" />
      ))}
    </div>
  );
}

export function WorkspaceResolverSkeleton() {
  return (
    <div className="flex items-center gap-2" aria-busy aria-label="Resolving workspace">
      <Skeleton className="h-9 w-44" />
    </div>
  );
}
