import { cn } from "@/lib/utils";

type ContentContainerProps = {
  children: React.ReactNode;
  variant?: "page" | "dashboard" | "narrow";
  className?: string;
};

const WIDTH = {
  page: "max-w-6xl",
  dashboard: "max-w-7xl",
  narrow: "max-w-3xl",
} as const;

export function ContentContainer({
  children,
  variant = "page",
  className,
}: ContentContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 py-6 sm:px-6",
        WIDTH[variant],
        className
      )}
    >
      {children}
    </div>
  );
}

export function SkipToContent({
  targetId = "main-content",
}: {
  targetId?: string;
}) {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
    >
      Skip to content
    </a>
  );
}
