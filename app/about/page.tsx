import { publicMetadata } from "@/lib/frontend/seo/metadata";
import { MarketingHero } from "@/components/marketing/MarketingHero";
import { AnimatedSection } from "@/components/marketing/AnimatedSection";
import { CtaBand } from "@/components/marketing/CtaBand";

export const metadata = publicMetadata({
  title: "About GCE",
  description:
    "About Growth Central Events — Connect, Marketplace, and Enterprise under one platform.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <MarketingHero
        headline="India’s business-growth event platform"
        description="Growth Central Events (GCE) brings structured networking, marketplace experiences, and enterprise programmes together in one identity. The intended operating company is Logixia Solutions Private Limited; incorporation is pending."
        primaryCta={{ label: "Contact", href: "/contact" }}
        secondaryCta={{ label: "Join GCE", href: "/signup" }}
        compact
        showBrandHierarchy
      />
      <section className="mx-auto max-w-3xl space-y-10 px-4 py-12 sm:px-6">
        <AnimatedSection>
          <h2 className="font-body text-xl font-semibold">How GCE is organised</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            GCE is the platform brand. Under it sit GCE Connect, GCE Marketplace,
            and GCE Enterprise. Sub-products stay inside their parent vertical —
            they are not peer master companies.
          </p>
        </AnimatedSection>
        <AnimatedSection>
          <h2 className="font-body text-xl font-semibold">One identity</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            One natural person ordinarily has one base account. Commercial roles
            arrive through scoped assignments. Signup never creates Super Admin,
            ZBP, or Marketplace Affiliate entitlement.
          </p>
        </AnimatedSection>
      </section>
      <CtaBand
        title="Start where you are"
        description="Explore a vertical, or create a GCE identity and continue through approved flows."
        primary={{ label: "Home", href: "/" }}
        secondary={{ label: "For Partners", href: "/for-partners" }}
      />
    </>
  );
}
