import Link from "next/link";
import { publicMetadata } from "@/lib/frontend/seo/metadata";
import { MarketingHero } from "@/components/marketing/MarketingHero";
import { PageAtmosphere } from "@/components/marketing/PageAtmosphere";
import { AnimatedSection } from "@/components/marketing/AnimatedSection";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { GCE_SURFACE } from "@/lib/frontend/design-language";
import { ASSOCIATE_PRICE_MINOR } from "@/lib/architecture/connect/types";
import { CIRCLE_CAPACITY_MAX } from "@/lib/frontend/connect/format";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { resolveSignedInMembershipCta } from "@/lib/frontend/connect/membershipCta";

/** Core Tier reference price only — not purchasable at launch (FD-027). */
const CORE_REFERENCE_PRICE_MINOR = 900_000;

const APPLY_HREF = "/login?next=/memberships/apply";

export const metadata = publicMetadata({
  title: "How GCE Connect Membership Works",
  description:
    "GCE Connect Circle Membership — governed application, activation, Circle allocation, professional discovery, and app-based referrals.",
  path: "/memberships",
});

function formatInrMinor(minor: number): string {
  const major = minor / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(major);
}

const JOURNEY_STEPS = [
  {
    title: "Apply",
    body: "Submit a GCE Connect Membership application with your business specialisation, optional Tags, and geography preferences. A GCE account is not the same as Membership.",
  },
  {
    title: "Review",
    body: "Operations reviews your application. Payment, when enabled, is separate from approval and does not auto-activate Membership.",
  },
  {
    title: "Activation",
    body: "Approved Membership becomes active through governed verification — you cannot self-activate or assign your own Circle seat.",
  },
  {
    title: "Circle eligibility & allocation",
    body: "Active Membership makes you eligible for Circle seat allocation. Allocation is a separate step — activation does not guarantee an immediate seat.",
  },
  {
    title: "Structured Circle experience",
    body: `Join a capacity-managed Circle (up to ${CIRCLE_CAPACITY_MAX} members) organised across four GC Power Sectors with regular meetings.`,
  },
  {
    title: "Professional discovery",
    body: "Use the in-app Circle directory with GC Power Sector, specialisation, and Tag filters to find relevant professionals inside your Circle.",
  },
  {
    title: "App-based referrals",
    body: "Official referrals are created and tracked through GCE Lead Assist in the app — not via WhatsApp or verbal exchange in meetings.",
  },
] as const;

export default async function MembershipsPage() {
  const associatePrice = formatInrMinor(ASSOCIATE_PRICE_MINOR);
  const coreReferencePrice = formatInrMinor(CORE_REFERENCE_PRICE_MINOR);
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const signedInCta = user
    ? await resolveSignedInMembershipCta(user.id)
    : null;

  const applyHref = signedInCta?.href ?? APPLY_HREF;
  const applyLabel = signedInCta?.heroLabel ?? "Apply for membership";

  return (
    <div className="relative isolate">
      <PageAtmosphere />

      <MarketingHero
        headline="How GCE Connect Membership Works"
        description="Membership is a governed business Circle experience — not merely an account or subscription. Apply, get reviewed, activate, receive Circle allocation, then discover professionals and manage referrals in the GCE app."
        primaryCta={{ label: applyLabel, href: applyHref }}
        secondaryCta={{ label: "How Circles work", href: "/the-circle" }}
        compact
        seamless
      />

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <AnimatedSection>
          <h2 className="font-body text-xl font-semibold text-foreground">
            The governed journey
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Account ≠ Membership application. Application ≠ approval. Payment ≠
            activation. Activation ≠ Circle allocation. Circle allocation ≠
            referral guarantee.
          </p>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {JOURNEY_STEPS.map((step, i) => (
              <li
                key={step.title}
                className={`${GCE_SURFACE.card} rounded-xl p-5`}
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  Step {i + 1}
                </p>
                <h3 className="mt-1 font-body text-base font-semibold">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </AnimatedSection>

        <AnimatedSection className="mt-16">
          <h2 className="font-body text-xl font-semibold text-foreground">
            Membership plans
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Launch product is Associate Tier. Core Tier is documented for future
            eligibility — it is not directly purchasable today.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className={`${GCE_SURFACE.card} rounded-2xl p-6 sm:p-8`}>
              <p className="text-sm font-semibold text-primary">
                Associate — current launch Membership
              </p>
              <p className="mt-2 font-body text-3xl font-semibold tabular-nums">
                {associatePrice}
                <span className="text-base font-normal text-muted-foreground">
                  {" "}
                  / quarter
                </span>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Plus applicable taxes (FD-027). Tag surcharges apply when
                selected.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
                <li>Structured Circle networking under Connect architecture</li>
                <li>Business specialisation + up to four Tags</li>
                <li>In-app Lead Assist referral workflows</li>
                <li>Circle directory discovery with taxonomy filters</li>
              </ul>
              <Button asChild className="mt-8 min-h-11 w-full">
                <Link href={applyHref}>
                  {signedInCta?.cardLabel ?? "Apply for membership"}
                </Link>
              </Button>
              <p className="mt-3 text-xs text-muted-foreground">
                Online Associate purchase is not live yet. Application and
                review are available through the governed apply flow.
              </p>
            </div>

            <div
              className={`${GCE_SURFACE.card} rounded-2xl border-dashed p-6 opacity-90 sm:p-8`}
            >
              <p className="text-sm font-semibold text-muted-foreground">
                Core — not available for direct purchase
              </p>
              <p className="mt-2 font-body text-3xl font-semibold tabular-nums text-muted-foreground">
                {coreReferencePrice}
                <span className="text-base font-normal">
                  {" "}
                  / quarter (reference)
                </span>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Future / eligibility-based tier. Not selectable in the application
                wizard at launch (FD-027).
              </p>
              <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
                <li>Documented for comparison only</li>
                <li>No Buy Now or instant upgrade path</li>
                <li>Activation rules pending Founder commercial gates</li>
              </ul>
              <Button
                variant="outline"
                className="mt-8 min-h-11 w-full"
                disabled
                aria-disabled
              >
                Not available for direct purchase
              </Button>
              <p className="mt-3 text-xs text-muted-foreground">
                Core will not appear as a freely selectable plan until canonical
                authority enables it.
              </p>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection className="mt-16">
          <h2 className="font-body text-xl font-semibold text-foreground">
            GC Power Sector, specialisation &amp; Tags
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Marketing materials may refer to &ldquo;Category&rdquo; — in the
            product this maps to{" "}
            <strong className="font-medium text-foreground">
              GC Power Sector
            </strong>{" "}
            placement within your Circle, plus your{" "}
            <strong className="font-medium text-foreground">
              business specialisation
            </strong>{" "}
            and optional{" "}
            <strong className="font-medium text-foreground">Tags</strong>.
            Together they power Circle directory search and relevant professional
            discovery — without guaranteeing matches, referrals, or nationwide
            access.
          </p>
          <Button asChild variant="link" className="mt-4 h-auto p-0">
            <Link href="/the-circle#taxonomy">Read about Circle taxonomy</Link>
          </Button>
        </AnimatedSection>

        <AnimatedSection className="mt-16">
          <h2 className="font-body text-xl font-semibold text-foreground">
            Referrals through the GCE app
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            After Circle allocation, members create and manage business referrals
            through GCE Lead Assist — Sent, Received, and status tracking in the
            app. Referrals are not guaranteed; verbal or WhatsApp exchange is not
            the official workflow.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button asChild variant="outline" size="sm">
              <Link href="/the-circle#referrals">How referrals work</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/login?next=/connect/leads">Lead Assist (members)</Link>
            </Button>
          </div>
        </AnimatedSection>

        <AnimatedSection className="mt-16">
          <h2 className="font-body text-xl font-semibold text-foreground">
            Frequently asked
          </h2>
          <Accordion type="single" collapsible className="mt-4 max-w-2xl">
            <AccordionItem value="account">
              <AccordionTrigger>
                Is a GCE account the same as Membership?
              </AccordionTrigger>
              <AccordionContent>
                No. Signup creates identity only. Membership requires a separate
                application, review, and governed activation (FD-036).
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="core">
              <AccordionTrigger>Can I buy Core Membership now?</AccordionTrigger>
              <AccordionContent>
                No. Core Tier is future/inactive at launch and is not directly
                purchasable. Only Associate Tier applications are available.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="circle">
              <AccordionTrigger>
                Does active Membership mean I have a Circle seat?
              </AccordionTrigger>
              <AccordionContent>
                No. Circle allocation is a separate governed step after
                activation. Waitlist and geography rules may apply.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="referrals">
              <AccordionTrigger>Are referrals guaranteed?</AccordionTrigger>
              <AccordionContent>
                No. Lead Assist helps members structure and track referrals in
                the app. It does not guarantee business outcomes or unrestricted
                nationwide introductions.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </AnimatedSection>

        <AnimatedSection className="mt-16 pb-12">
          <div
            className={`${GCE_SURFACE.card} flex flex-col gap-6 rounded-2xl p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8`}
          >
            <div className="max-w-xl">
              <h2 className="font-body text-2xl font-semibold text-foreground">
                Join GCE Connect
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Start your Membership application through the governed apply
                wizard. Existing members can view status in Connect.
              </p>
            </div>
            <Button asChild size="lg" className="min-h-11 shrink-0">
              <Link href={applyHref}>{applyLabel}</Link>
            </Button>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}
