"use client";

import { useId, type KeyboardEvent } from "react";
import { Moon, Sun } from "lucide-react";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import { GlassSurface } from "@/components/ui/liquid-glass";
import { cn } from "@/lib/utils";

export type ThemeChoice = "light" | "dark";

type GlassThemeSwitcherProps = {
  value: ThemeChoice;
  onValueChange: (theme: ThemeChoice) => void;
  className?: string;
  /** Wider labelled row (e.g. mobile drawer). */
  showLabel?: boolean;
  disabled?: boolean;
};

const OPTIONS: {
  value: ThemeChoice;
  label: string;
  Icon: typeof Sun;
}[] = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
];

/**
 * Two-option liquid-glass theme switcher.
 * Thumb layoutId is scoped with useId so header + sheet instances never collide.
 */
export function GlassThemeSwitcher({
  value,
  onValueChange,
  className,
  showLabel = false,
  disabled = false,
}: GlassThemeSwitcherProps) {
  const id = useId();
  const reduceMotion = useReducedMotion();
  const thumbId = `${id}-thumb`;
  const labelId = `${id}-label`;

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (disabled) return;
    const currentIndex = OPTIONS.findIndex((option) => option.value === value);
    let nextIndex = currentIndex;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (currentIndex + 1) % OPTIONS.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (currentIndex - 1 + OPTIONS.length) % OPTIONS.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = OPTIONS.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    const next = OPTIONS[nextIndex];
    if (next && next.value !== value) {
      onValueChange(next.value);
    }
  }

  return (
    <LayoutGroup id={id}>
      <div
        role="radiogroup"
        aria-labelledby={labelId}
        aria-disabled={disabled || undefined}
        onKeyDown={handleKeyDown}
        className={cn(
          "relative inline-flex items-center rounded-full border border-border/70 bg-muted/40 p-0.5",
          disabled && "pointer-events-none opacity-70",
          className,
        )}
      >
        <span id={labelId} className="sr-only">
          Theme
        </span>

        {OPTIONS.map((option) => {
          const checked = value === option.value;
          const { Icon } = option;

          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={checked}
              aria-label={option.label}
              tabIndex={checked ? 0 : -1}
              disabled={disabled}
              onClick={() => {
                if (!checked) onValueChange(option.value);
              }}
              className={cn(
                "relative inline-flex items-center justify-center rounded-full",
                "text-muted-foreground transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                checked && "text-foreground",
                showLabel ? "h-8 gap-1.5 px-3" : "h-7 w-7",
              )}
            >
              {checked ? (
                <motion.span
                  layoutId={thumbId}
                  className="absolute inset-0 z-0 overflow-hidden rounded-full"
                  initial={false}
                  animate={
                    reduceMotion ? { scaleX: 1 } : { scaleX: [1, 1.14, 1] }
                  }
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : {
                          layout: { type: "spring", stiffness: 500, damping: 36 },
                          scaleX: {
                            duration: 0.28,
                            times: [0, 0.5, 1],
                            ease: "easeInOut",
                          },
                        }
                  }
                >
                  <GlassSurface blur={false} radiusClassName="rounded-full" />
                </motion.span>
              ) : null}

              <Icon className="relative z-10 h-4 w-4" aria-hidden />
              {showLabel ? (
                <span className="relative z-10 text-sm font-medium">
                  {option.label}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </LayoutGroup>
  );
}
