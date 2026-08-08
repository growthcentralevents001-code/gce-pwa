import { publicMetadata } from "@/lib/frontend/seo/metadata";
import { MarketingHero } from "@/components/marketing/MarketingHero";
import { GlassPanel } from "@/components/marketing/GlassPanel";

export const metadata = publicMetadata({
  title: "Terms of Service",
  description: "GCE Events terms presentation — legal validation may remain pending.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <MarketingHero
        eyebrow="Legal"
        headline="Terms of Service"
        description="This page presents existing platform terms orientation. AI-generated legal text is not treated as approved binding policy."
        compact
      />
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <GlassPanel className="prose prose-sm max-w-none space-y-4 p-6 text-muted-foreground sm:p-8">
          <p className="text-foreground">
            Growth Central Events (“GCE”) is operated by Logixia Solutions
            Private Limited.
          </p>
          <p>
            Use of the platform is subject to applicable Founder Decisions,
            membership agreements, marketplace terms, and jurisdiction-specific
            requirements as published or contracted.
          </p>
          <p>
            Privileged commercial roles, payments, settlements, and payouts are
            governed by canonical backend rules and may remain inactive until
            Founder activation.
          </p>
          <p>
            Professional legal validation status may remain pending for some
            clauses. Contact the platform for the latest executed agreements
            applicable to your relationship.
          </p>
        </GlassPanel>
      </section>
    </>
  );
}
