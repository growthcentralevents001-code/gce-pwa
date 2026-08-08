import { redirect } from "next/navigation";

/** Legacy bookings list → canonical customer booking history. */
export default function LegacyBookingsRedirect() {
  redirect("/customer/bookings");
}
