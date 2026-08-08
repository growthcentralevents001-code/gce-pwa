import { publicMetadata } from "@/lib/frontend/seo/metadata";
import { MarketingHero } from "@/components/marketing/MarketingHero";
import { GlassPanel } from "@/components/marketing/GlassPanel";
import { EmptyState } from "@/components/states/EmptyState";
import { Building2 } from "lucide-react";

export const metadata = publicMetadata({
  title: "Venues",
  description: "Browse GCE Marketplace venues.",
  path: "/venues",
});

export default function PublicVenuesPage() {
  return (
    <>
      <MarketingHero
        eyebrow="Marketplace"
        headline="Venues"
        description="Published venue discovery. Partner onboarding remains application-based."
        primaryCta={{ label: "Become a venue partner", href: "/apply/role?intent=venue" }}
        secondaryCta={{ label: "Events", href: "/events" }}
        compact
      />
      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <GlassPanel className="p-2">
          <EmptyState
            icon={Building2}
            title="Venue catalogue expands with marketplace data"
            description="Detailed venue cards and maps deepen in later marketplace batches. Partner applications start under For Partners."
            primaryAction={{ label: "For Partners", href: "/for-partners" }}
          />
        </GlassPanel>
      </section>
    </>
  );
}
