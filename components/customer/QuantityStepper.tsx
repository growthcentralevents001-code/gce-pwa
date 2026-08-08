"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 10,
  disabled,
  className,
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  className?: string;
}) {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border bg-card p-1",
        className
      )}
      role="group"
      aria-label="Quantity"
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-11 w-11 rounded-full touch-manipulation"
        disabled={disabled || value <= min}
        onClick={dec}
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span
        className="min-w-10 text-center text-base font-semibold tabular-nums"
        aria-live="polite"
      >
        {value}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-11 w-11 rounded-full touch-manipulation"
        disabled={disabled || value >= max}
        onClick={inc}
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
