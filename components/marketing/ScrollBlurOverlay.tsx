"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { GradualBlur } from "@/components/ui/gradual-blur";
import { useIsMobile } from "@/hooks/use-mobile";

/**
 * Marketing routes only. PublicShell also wraps /admin, /settings, and the auth
 * pages, where a permanent blur band over tables and forms would hurt.
 */
const EXACT_ROUTES = new Set([
  "/",
  "/about",
  "/connect",
  "/marketplace",
  "/enterprise",
  "/events",
  "/offers",
  "/venues",
  "/for-partners",
  "/connect-bdp",
  "/partners",
  "/memberships",
  "/the-circle",
  "/zbp",
  "/contact",
  "/terms",
  "/privacy",
]);

/** Detail pages under these keep the effect; deeper action routes do not. */
const DETAIL_PREFIXES = ["/events/", "/offers/", "/venues/"];

function isMarketingRoute(pathname: string) {
  if (EXACT_ROUTES.has(pathname)) return true;
  return DETAIL_PREFIXES.some(
    (prefix) =>
      pathname.startsWith(prefix) &&
      pathname.slice(prefix.length).split("/").length === 1,
  );
}

/** Fades the overlay out once the footer is on screen, so it stays readable. */
function useFooterClear() {
  const [footerVisible, setFooterVisible] = React.useState(false);

  React.useEffect(() => {
    const footer = document.querySelector("[data-site-footer]");
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return footerVisible;
}

function useReducedTransparency() {
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-transparency: reduce)");
    const onChange = () => setReduced(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

/** Page-level bottom blur for the public marketing routes. */
export function ScrollBlurOverlay() {
  const pathname = usePathname() || "/";
  const isMobile = useIsMobile();
  const footerVisible = useFooterClear();
  const reducedTransparency = useReducedTransparency();

  if (reducedTransparency || !isMarketingRoute(pathname)) return null;

  return (
    <GradualBlur
      target="page"
      position="bottom"
      height={isMobile ? "3rem" : "4.5rem"}
      // Lowered alongside the height: the same peak blur packed into a shorter
      // band reads harsher, not softer.
      strength={1.4}
      // Each layer is a fixed backdrop-filter repainting on scroll; keep the
      // count down on mobile where that cost is felt most.
      divCount={isMobile ? 3 : 5}
      curve="bezier"
      exponential
      animated
      duration="0.25s"
      zIndex={30}
      // Container-level so it rides the opacity transition `animated` sets up.
      style={{ opacity: footerVisible ? 0 : 1 }}
    />
  );
}
