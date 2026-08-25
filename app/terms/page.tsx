import { publicMetadata } from "@/lib/frontend/seo/metadata";
import { MarketingHero } from "@/components/marketing/MarketingHero";

export const metadata = publicMetadata({
  title: "Terms of Service",
  description: "GCE Events terms orientation — legal validation may remain pending.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <MarketingHero
        showBrandMark={false}
        headline="Terms of Service"
        description="This page orients visitors to how GCE operates. It is not a substitute for executed agreements, and it is not AI-generated binding policy."
        compact
      />
      <section className="mx-auto max-w-3xl space-y-5 px-4 pb-16 sm:px-6">
        <p className="text-sm leading-relaxed text-foreground">
          Growth Central Events (“GCE”) is the platform brand. The intended
          legal entity is Logixia Solutions Private Limited. Incorporation and
          statutory identifiers (including CIN, GSTIN, and registered office)
          are pending and are not published here.
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Use of the platform is subject to applicable Founder Decisions,
          membership agreements, marketplace terms, and jurisdiction-specific
          requirements as published or contracted.
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Privileged commercial roles, payments, settlements, and payouts are
          governed by canonical backend rules and may remain inactive until
          Founder activation.
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Professional legal validation may remain pending for some clauses.
          Contact GCE for the latest executed agreement applicable to your
          relationship.
        </p>
      </section>
    </>
  );
}
