import {
  CalendarDays,
  Compass,
  Tag,
  Ticket,
  UserRound,
} from "lucide-react";
import type { NavItem } from "./types";

/**
 * Customer shell navigation — mobile-first.
 * Bottom nav uses the first five primary items.
 */
export const CUSTOMER_PRIMARY_NAV: NavItem[] = [
  {
    id: "discover",
    label: "Discover",
    href: "/customer",
    icon: Compass,
    mobileVisible: true,
  },
  {
    id: "events",
    label: "Events",
    href: "/customer/events",
    icon: CalendarDays,
    mobileVisible: true,
  },
  {
    id: "offers",
    label: "Offers",
    href: "/customer/offers",
    icon: Tag,
    mobileVisible: true,
  },
  {
    id: "tickets",
    label: "Tickets",
    href: "/customer/tickets",
    icon: Ticket,
    mobileVisible: true,
  },
  {
    id: "profile",
    label: "Profile",
    href: "/customer/profile",
    icon: UserRound,
    mobileVisible: true,
  },
];

/** Secondary customer links — not in bottom nav. */
export const CUSTOMER_SECONDARY_NAV: NavItem[] = [
  {
    id: "bookings",
    label: "Bookings",
    href: "/customer/bookings",
    mobileVisible: false,
  },
  {
    id: "wishlist",
    label: "Wishlist",
    href: "/customer/wishlist",
    mobileVisible: false,
  },
];
