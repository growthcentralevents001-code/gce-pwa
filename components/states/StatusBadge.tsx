import { Badge } from "@/components/ui/badge";
import {
  statusToneClasses,
  toneFromStatusKeyword,
  type StatusTone,
} from "@/lib/frontend/status";
import { cn } from "@/lib/utils";

type StatusBadgeProps = {
  label: string;
  tone?: StatusTone;
  className?: string;
};

export function StatusBadge({ label, tone, className }: StatusBadgeProps) {
  const resolved = tone ?? toneFromStatusKeyword(label);
  return (
    <Badge
      variant="outline"
      className={cn(statusToneClasses[resolved].badge, className)}
    >
      <span
        className={cn(
          "mr-1.5 inline-block h-1.5 w-1.5 rounded-full",
          statusToneClasses[resolved].dot
        )}
        aria-hidden
      />
      {label}
    </Badge>
  );
}
