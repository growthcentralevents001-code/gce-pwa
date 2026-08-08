import {
  Briefcase,
  Building2,
  CalendarDays,
  Home,
  Info,
  LogIn,
  Store,
  Tag,
  Users,
} from "lucide-react";
import type { NavItem } from "./types";

/** Public marketing navigation — Batch 1. */
export const PUBLIC_NAV: NavItem[] = [
  { id: "home", label: "Home", href: "/", icon: Home, mobileVisible: true },
  {
    id: "connect",
    label: "Connect",
    href: "/connect",
    icon: Users,
    mobileVisible: true,
  },
  {
    id: "marketplace",
    label: "Marketplace",
    href: "/marketplace",
    icon: Store,
    mobileVisible: true,
  },
  {
    id: "enterprise",
    label: "Enterprise",
    href: "/enterprise",
    icon: Briefcase,
    mobileVisible: true,
  },
  {
    id: "events",
    label: "Events",
    href: "/events",
    icon: CalendarDays,
    mobileVisible: true,
  },
  {
    id: "offers",
    label: "Offers",
    href: "/offers",
    icon: Tag,
    mobileVisible: false,
  },
  {
    id: "partners",
    label: "For Partners",
    href: "/for-partners",
    icon: Building2,
    mobileVisible: false,
  },
  {
    id: "about",
    label: "About",
    href: "/about",
    icon: Info,
    mobileVisible: false,
  },
];

export const PUBLIC_AUTH_NAV: NavItem[] = [
  {
    id: "login",
    label: "Log in",
    href: "/login",
    icon: LogIn,
    mobileVisible: true,
  },
  {
    id: "signup",
    label: "Join",
    href: "/signup",
    mobileVisible: true,
  },
];
