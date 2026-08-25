"use client";

import { useState } from "react";
import { MarketingHero } from "@/components/marketing/MarketingHero";
import { GCE_SURFACE } from "@/lib/frontend/design-language";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FeatureGated } from "@/components/states/FeatureGated";

/**
 * PUB-03 Contact — Batch 1.
 * Backend GAP: no canonical contact API — form does not fake-submit.
 */
export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      <MarketingHero
        headline="Talk to the GCE team"
        description="Questions about Connect, Marketplace, or Enterprise? Live contact intake is not wired yet — this form does not send a message."
        compact
      />
      <section className="mx-auto max-w-xl px-4 py-12 sm:px-6">
        <FeatureGated
          mode="coming_later"
          title="Contact intake coming soon"
          description="A canonical support/contact API is not available yet. Your message is not sent from this browser form."
          className="mb-6"
        />
        <div className={`${GCE_SURFACE.card} rounded-2xl p-6`}>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" autoComplete="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" name="message" required />
            </div>
            <Button type="submit" className="min-h-11 w-full" disabled>
              Submit (unavailable)
            </Button>
          </form>
          {submitted ? (
            <Alert className="mt-4" variant="warning">
              <AlertTitle>Not sent</AlertTitle>
              <AlertDescription>
                Contact API is a documented backend gap. Please use an approved
                support channel when available.
              </AlertDescription>
            </Alert>
          ) : null}
        </div>
      </section>
    </>
  );
}
