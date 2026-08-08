import {
  CalendarDays,
  Home,
  Handshake,
  Info,
  LogIn,
  Tag,
  Users,
} from "lucide-react";
import type { NavItem } from "./types";

/** Public marketing / discovery navigation (Batch 1 will flesh pages). */
export const PUBLIC_NAV: NavItem[] = [
  { id: "home", label: "Home", href: "/", icon: Home, mobileVisible: true },
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
    mobileVisible: true,
  },
  {
    id: "memberships",
    label: "Memberships",
    href: "/memberships",
    icon: Users,
    mobileVisible: true,
  },
  {
    id: "partners",
    label: "For Partners",
    href: "/partners",
    icon: Handshake,
    mobileVisible: true,
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
    label: "Sign up",
    href: "/signup",
    mobileVisible: true,
  },
];
