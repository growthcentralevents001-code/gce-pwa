"use client";

import { cn } from "@/lib/utils";
import { GCE_RADIUS } from "@/lib/frontend/design-language";
import { tagSlotCommercialNote } from "@/lib/frontend/connect/format";

export function TagChip({
  slot,
  label,
  selected,
  onToggle,
  disabled,
  showPricing,
}: {
  slot: number;
  label: string;
  selected?: boolean;
  onToggle?: () => void;
  disabled?: boolean;
  showPricing?: boolean;
}) {
  const Comp = onToggle ? "button" : "span";
  return (
    <Comp
      type={onToggle ? "button" : undefined}
      disabled={disabled}
      onClick={onToggle}
      className={cn(
        GCE_RADIUS.chip,
        "inline-flex min-h-9 flex-col items-start gap-0.5 border px-3 py-1.5 text-left text-xs touch-manipulation transition-colors",
        selected
          ? "border-primary bg-primary/10 text-foreground"
          : "border-border bg-card text-muted-foreground",
        onToggle && !disabled && "hover:border-primary/60",
        disabled && "opacity-60"
      )}
      aria-pressed={onToggle ? Boolean(selected) : undefined}
    >
      <span className="font-medium text-foreground">
        Tag {slot}
        {label ? ` · ${label}` : ""}
      </span>
      {showPricing ? (
        <span className="text-[10px]">{tagSlotCommercialNote(slot)}</span>
      ) : null}
    </Comp>
  );
}
