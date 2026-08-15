import { redirect } from "next/navigation";

/** Phase 14B — retire legacy create-event path. */
export default function LegacyVenueCreateEventRedirect() {
  redirect("/venue/events/new");
}
