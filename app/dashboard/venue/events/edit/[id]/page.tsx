import { redirect } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

/** Phase 14B — retire legacy event edit sibling. */
export default async function LegacyVenueEventEditRedirect({ params }: Props) {
  const { id } = await params;
  redirect(`/venue/events/${id}`);
}
