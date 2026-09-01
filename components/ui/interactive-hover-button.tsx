"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface InteractiveHoverButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "href"> {
  text?: string;
  href?: string;
  variant?: "primary" | "outline";
}

const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(
  (
    {
      text = "Button",
      className,
      variant = "primary",
      href,
      type = "button",
      ...props
    },
    ref,
  ) => {
    const classes = cn(
      "group relative inline-flex min-w-[13.5rem] w-auto cursor-pointer items-center justify-center overflow-hidden rounded-full border px-7 py-2.5 text-center text-[15px] font-semibold no-underline outline-offset-2 transition-colors",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "font-[family-name:var(--font-body,Poppins,sans-serif)]",
      variant === "primary" &&
        "border-primary bg-primary text-primary-foreground",
      variant === "outline" &&
        "border-primary bg-background/80 text-primary dark:bg-transparent dark:text-secondary",
      className,
    );

    const content = (
      <>
        <span
          className={cn(
            "relative z-20 inline-block whitespace-nowrap transition-all duration-300",
            "group-hover:translate-x-12 group-hover:opacity-0",
            "motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:opacity-100",
          )}
        >
          {text}
        </span>
        <div
          className={cn(
            "absolute inset-0 z-20 flex items-center justify-center gap-2 whitespace-nowrap text-primary-foreground opacity-0 transition-all duration-300",
            "translate-x-8 group-hover:translate-x-0 group-hover:opacity-100",
            "motion-reduce:hidden",
          )}
          aria-hidden
        >
          <span>{text}</span>
          <ArrowRight size={16} />
        </div>
        <div
          className={cn(
            "pointer-events-none absolute left-[20%] top-[40%] z-10 h-2 w-2 scale-[1] rounded-lg opacity-0 transition-all duration-300",
            "group-hover:left-[0%] group-hover:top-[0%] group-hover:h-full group-hover:w-full group-hover:scale-[1.8] group-hover:opacity-100",
            "motion-reduce:hidden",
            // Primary: rest primary, hover wash to secondary for a clear color shift
            variant === "primary" &&
              "bg-secondary group-hover:bg-secondary",
            // Outline: cream → solid brand primary
            variant === "outline" &&
              "bg-primary group-hover:bg-primary",
          )}
          aria-hidden
        />
      </>
    );

    if (href) {
      return (
        <Link href={href} className={classes} aria-label={text}>
          {content}
        </Link>
      );
    }

    return (
      <button ref={ref} type={type} className={classes} aria-label={text} {...props}>
        {content}
      </button>
    );
  },
);

InteractiveHoverButton.displayName = "InteractiveHoverButton";

export { InteractiveHoverButton };
