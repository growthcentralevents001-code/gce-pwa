import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { AccessDenied } from "@/components/states/AccessDenied";
import { FeatureGated } from "@/components/states/FeatureGated";
import { EmptyState } from "@/components/states/EmptyState";
import { StatusBadge } from "@/components/states/StatusBadge";
import { PageHeader } from "@/components/layout/PageHeader";

describe("Batch 0 state components", () => {
  it("renders AccessDenied without stack traces", () => {
    const html = renderToStaticMarkup(
      <AccessDenied reason="permission" />
    );
    expect(html).toContain("Permission required");
    expect(html).not.toContain("Error:");
    expect(html).not.toContain("at Object");
  });

  it("renders FeatureGated environment copy", () => {
    const html = renderToStaticMarkup(
      <FeatureGated mode="disabled_in_environment" />
    );
    expect(html).toContain("Disabled in this environment");
  });

  it("renders EmptyState with CTA", () => {
    const html = renderToStaticMarkup(
      <EmptyState
        title="No bookings"
        description="Example empty state"
        primaryAction={{ label: "Browse events", href: "/customer/events" }}
      />
    );
    expect(html).toContain("No bookings");
    expect(html).toContain("Browse events");
  });

  it("renders StatusBadge and PageHeader", () => {
    const badge = renderToStaticMarkup(
      <StatusBadge label="Approved" tone="success" />
    );
    expect(badge).toContain("Approved");

    const header = renderToStaticMarkup(
      <PageHeader
        title="Overview"
        description="Workspace overview"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Overview" },
        ]}
        status={{ label: "Active", tone: "success" }}
      />
    );
    expect(header).toContain("Overview");
    expect(header).toContain("Active");
  });
});
