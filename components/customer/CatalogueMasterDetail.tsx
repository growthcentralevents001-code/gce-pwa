import Link from "next/link";
import { EventCard, type EventCardModel } from "@/components/customer/EventCard";
import { OfferCard, type OfferCardModel } from "@/components/customer/OfferCard";
import { GCE_RADIUS, GCE_SURFACE } from "@/lib/frontend/design-language";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function withSelected(basePath: string, selectedId: string, extra?: URLSearchParams) {
  const params = new URLSearchParams(extra);
  params.set("selected", selectedId);
  const q = params.toString();
  return q ? `${basePath}?${q}` : `${basePath}?selected=${selectedId}`;
}

/**
 * Mobile: list → full detail.
 * Desktop (lg+): master–detail preview. Full transaction remains on the detail route.
 */
export function EventCatalogue({
  items,
  selectedId,
  basePath,
  detailHref,
  query,
}: {
  items: EventCardModel[];
  selectedId: string | null;
  basePath: string;
  detailHref: (id: string) => string;
  query?: URLSearchParams;
}) {
  const selected =
    items.find((i) => i.id === selectedId) ?? items[0] ?? null;

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
        {items.map((event) => (
          <EventCard key={event.id} event={event} href={detailHref(event.id)} />
        ))}
      </div>
      <div className="hidden lg:grid lg:grid-cols-5 lg:gap-6">
        <ul className="space-y-2 lg:col-span-2">
          {items.map((event) => {
            const active = selected?.id === event.id;
            return (
              <li key={event.id}>
                <Link
                  href={withSelected(basePath, event.id, query)}
                  className={cn(
                    GCE_RADIUS.card,
                    "block border p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    active
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:bg-muted/40"
                  )}
                >
                  <p className="font-medium">{event.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {event.category ?? "Event"}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className={cn(GCE_RADIUS.card, GCE_SURFACE.card, "p-5 lg:col-span-3")}>
          {selected ? (
            <>
              <EventCard event={selected} href={detailHref(selected.id)} />
              <Button asChild className="mt-4 min-h-11">
                <Link href={detailHref(selected.id)}>Open full detail</Link>
              </Button>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Select an event.</p>
          )}
        </div>
      </div>
    </>
  );
}

export function OfferCatalogue({
  items,
  selectedId,
  basePath,
  detailHref,
  query,
}: {
  items: OfferCardModel[];
  selectedId: string | null;
  basePath: string;
  detailHref: (id: string) => string;
  query?: URLSearchParams;
}) {
  const selected =
    items.find((i) => i.id === selectedId) ?? items[0] ?? null;

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
        {items.map((offer) => (
          <OfferCard key={offer.id} offer={offer} href={detailHref(offer.id)} />
        ))}
      </div>
      <div className="hidden lg:grid lg:grid-cols-5 lg:gap-6">
        <ul className="space-y-2 lg:col-span-2">
          {items.map((offer) => {
            const active = selected?.id === offer.id;
            return (
              <li key={offer.id}>
                <Link
                  href={withSelected(basePath, offer.id, query)}
                  className={cn(
                    GCE_RADIUS.card,
                    "block border p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    active
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:bg-muted/40"
                  )}
                >
                  <p className="font-medium">{offer.title}</p>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className={cn(GCE_RADIUS.card, GCE_SURFACE.card, "p-5 lg:col-span-3")}>
          {selected ? (
            <>
              <OfferCard offer={selected} href={detailHref(selected.id)} />
              <Button asChild className="mt-4 min-h-11">
                <Link href={detailHref(selected.id)}>Open full detail</Link>
              </Button>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Select an offer.</p>
          )}
        </div>
      </div>
    </>
  );
}
