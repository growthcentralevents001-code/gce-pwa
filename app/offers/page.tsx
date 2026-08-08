import { publicMetadata } from "@/lib/frontend/seo/metadata";
import { MarketingHero } from "@/components/marketing/MarketingHero";
import { GlassPanel } from "@/components/marketing/GlassPanel";
import { EmptyState } from "@/components/states/EmptyState";
import { Tag } from "lucide-react";

export const metadata = publicMetadata({
  title: "Offers",
  description:
    "Discover GCE Marketplace offers. Claims continue in the customer experience.",
  path: "/offers",
});

export default function PublicOffersPage() {
  return (
    <>
      <MarketingHero
        eyebrow="Marketplace"
        headline="Offers"
        description="Public offer discovery. Redemption and claim truth remain in Customer CX — not a parallel engine."
        primaryCta={{ label: "Open customer offers", href: "/customer/offers" }}
        compact
      />
      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <GlassPanel className="p-2">
          <EmptyState
            icon={Tag}
            title="Continue in Customer CX"
            description="Offer detail and claim flows are owned by Batch 2. Use this page as the public entrance."
            primaryAction={{
              label: "Browse offers",
              href: "/customer/offers",
            }}
            secondaryAction={{ label: "Marketplace", href: "/marketplace" }}
          />
        </GlassPanel>
      </section>
    </>
  );
}
