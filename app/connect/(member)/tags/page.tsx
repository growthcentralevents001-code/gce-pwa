import { redirect } from "next/navigation";
import { ConnectPageHeader } from "@/components/connect/ConnectPageHeader";
import { TagChip } from "@/components/connect/TagChip";
import { EmptyState } from "@/components/states/EmptyState";
import { FeatureGated } from "@/components/states/FeatureGated";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { listMembershipsForUser } from "@/lib/architecture/connect/memberships";
import { listMembershipTags } from "@/lib/architecture/connect/tags";
import {
  ASSOCIATE_PRICE_MINOR,
  MAX_TAGS,
  tagSlotCommercialNote,
} from "@/lib/frontend/connect/format";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Tags · GCE Connect",
};

export default async function ConnectTagsPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/connect/tags");

  const memberships = await listMembershipsForUser(supabase, user.id).catch(
    () => []
  );
  const primary = memberships[0];
  const tags = primary
    ? await listMembershipTags(supabase, primary.id).catch(() => [])
    : [];

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 pb-16">
      <ConnectPageHeader
        title="Business Tags"
        description={`Max ${MAX_TAGS} Tags. Slots 1–2 included; 3 and 4 each +25% of Associate base (not +50% for Tag 4).`}
        backHref="/dashboard/connect-member"
      />

      {!primary ? (
        <EmptyState
          title="No membership"
          primaryAction={{ label: "Membership", href: "/connect/membership" }}
        />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4].map((slot) => {
              const existing = tags.find((t) => Number(t.tag_slot) === slot);
              return (
                <TagChip
                  key={slot}
                  slot={slot}
                  label={existing?.tag_label ? String(existing.tag_label) : ""}
                  selected={Boolean(existing)}
                  showPricing
                />
              );
            })}
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 text-sm shadow-sm">
            <h2 className="font-semibold">Commercial note</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
              <li>Base Associate: ₹{(ASSOCIATE_PRICE_MINOR / 100).toLocaleString("en-IN")} / quarter</li>
              <li>{tagSlotCommercialNote(3)}</li>
              <li>{tagSlotCommercialNote(4)}</li>
              <li>
                Surcharge amounts shown are from canonical rules; billing truth
                remains server-side.
              </li>
            </ul>
          </div>

          {tags.length > 0 ? (
            <ul className="space-y-2 text-sm">
              {tags.map((t) => (
                <li
                  key={t.id}
                  className="rounded-xl border border-border px-3 py-2"
                >
                  Slot {t.tag_slot}: {t.tag_label}{" "}
                  <span className="text-xs text-muted-foreground">
                    ({t.is_included ? "included" : `+₹${Number(t.surcharge_minor) / 100}`})
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No active Tags yet.</p>
          )}

          <FeatureGated
            mode="coming_later"
            title="Tag editor"
            description="Self-serve Tag changes may require platform/GB review. Use support if you need updates before the editor ships."
          />
        </div>
      )}
    </main>
  );
}
