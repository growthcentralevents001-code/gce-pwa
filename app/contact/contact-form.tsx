"use client";

import { useState } from "react";
import { MarketingHero } from "@/components/marketing/MarketingHero";
import { GCE_SURFACE } from "@/lib/frontend/design-language";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type SubmitState = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [enquiryId, setEnquiryId] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitState("submitting");
    setErrorMessage(null);

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        setSubmitState("error");
        setErrorMessage(
          body?.error?.message ??
            "We could not send your message. Please try again shortly."
        );
        return;
      }
      setEnquiryId(body?.enquiryId ? String(body.enquiryId) : null);
      setSubmitState("success");
      form.reset();
    } catch {
      setSubmitState("error");
      setErrorMessage("Network error — please check your connection and try again.");
    }
  }

  return (
    <>
      <MarketingHero
        headline="Talk to the GCE team"
        description="Questions about GCE Connect, GCE Marketplace, or GCE Enterprise? Send us a message — this is general contact and support, not a Marketplace BDP application."
        compact
      />
      <section className="mx-auto max-w-xl px-4 py-12 sm:px-6">
        <div className={`${GCE_SURFACE.card} rounded-2xl p-6`}>
          {submitState === "success" ? (
            <Alert className="mb-4">
              <AlertTitle>Message received</AlertTitle>
              <AlertDescription>
                Your enquiry has been queued for our support team.
                {enquiryId ? (
                  <>
                    {" "}
                    Reference:{" "}
                    <span className="font-mono text-xs">{enquiryId.slice(0, 8)}</span>
                  </>
                ) : null}
              </AlertDescription>
            </Alert>
          ) : null}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                autoComplete="name"
                required
                maxLength={120}
                disabled={submitState === "submitting"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                disabled={submitState === "submitting"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                required
                minLength={10}
                maxLength={4000}
                rows={5}
                disabled={submitState === "submitting"}
              />
            </div>
            <Button
              type="submit"
              className="min-h-11 w-full"
              disabled={submitState === "submitting"}
            >
              {submitState === "submitting" ? "Sending…" : "Send message"}
            </Button>
          </form>

          {submitState === "error" && errorMessage ? (
            <Alert className="mt-4" variant="destructive">
              <AlertTitle>Could not send</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          ) : null}

          <p className="mt-4 text-xs text-muted-foreground">
            Applying to become a Marketplace BDP? Use the{" "}
            <a href="/marketplace-bdp" className="underline underline-offset-2">
              Marketplace BDP opportunity page
            </a>{" "}
            — not this form.
          </p>
        </div>
      </section>
    </>
  );
}
