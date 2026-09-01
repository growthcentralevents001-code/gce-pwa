"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { GlassThemeSwitcher } from "@/components/ui/glass-theme-switcher";

type ThemeToggleProps = {
  className?: string;
  /** Show text label (e.g. mobile drawer) */
  showLabel?: boolean;
};

export function ThemeToggle({ className, showLabel = false }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <GlassThemeSwitcher
      value={isDark ? "dark" : "light"}
      onValueChange={(theme) => setTheme(theme)}
      showLabel={showLabel}
      className={className}
      disabled={!mounted}
    />
  );
}
