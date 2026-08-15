import { redirect } from "next/navigation";

/** Phase 14B — retire legacy Venue dashboard sibling; canonical is /venue/events. */
export default function LegacyVenueEventsRedirect() {
  redirect("/venue/events");
}
