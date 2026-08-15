import { redirect } from "next/navigation";

/** Phase 14B — retire legacy Venue bookings sibling. */
export default function LegacyVenueBookingsRedirect() {
  redirect("/venue/bookings");
}
