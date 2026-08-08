"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { Filter, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export type DiscoveryFilterValues = {
  q?: string;
  city?: string;
  category?: string;
};

/**
 * Discovery search + mobile filter sheet.
 * Inspired by 21st.dev filter chips / magnetic drawer (22213, 6602, 19360).
 */
export function DiscoveryFilters({
  basePath,
  showCategory = true,
  className,
}: {
  basePath: string;
  showCategory?: boolean;
  className?: string;
}) {
  const router = useRouter();
  const sp = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const q = sp.get("q") ?? "";
  const city = sp.get("city") ?? "";
  const category = sp.get("category") ?? "";

  const apply = useCallback(
    (next: DiscoveryFilterValues) => {
      const params = new URLSearchParams();
      if (next.q?.trim()) params.set("q", next.q.trim());
      if (next.city?.trim()) params.set("city", next.city.trim());
      if (showCategory && next.category?.trim()) {
        params.set("category", next.category.trim());
      }
      const qs = params.toString();
      startTransition(() => {
        router.push(qs ? `${basePath}?${qs}` : basePath);
        setOpen(false);
      });
    },
    [basePath, router, showCategory]
  );

  const clear = () => apply({});

  const activeCount = [q, city, showCategory ? category : ""].filter(Boolean)
    .length;

  return (
    <div className={cn("space-y-3", className)}>
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          apply({
            q: String(fd.get("q") ?? ""),
            city,
            category,
          });
        }}
      >
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            name="q"
            defaultValue={q}
            placeholder="Search"
            className="h-11 pl-9 touch-manipulation"
            enterKeyHint="search"
            aria-label="Search"
          />
        </div>
        <Button
          type="submit"
          className="h-11 min-w-11 touch-manipulation"
          disabled={pending}
        >
          Go
        </Button>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="h-11 min-w-11 touch-manipulation md:hidden"
              aria-label="Open filters"
            >
              <Filter className="h-4 w-4" />
              {activeCount > 0 ? (
                <span className="ml-1 text-xs">{activeCount}</span>
              ) : null}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-2xl pb-8">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <FilterFields
              showCategory={showCategory}
              defaults={{ q, city, category }}
              onApply={apply}
              onClear={clear}
            />
            <SheetClose asChild>
              <Button variant="ghost" className="mt-2 w-full min-h-11">
                Close
              </Button>
            </SheetClose>
          </SheetContent>
        </Sheet>
      </form>

      <div className="hidden gap-2 md:grid md:grid-cols-3">
        <FilterFields
          showCategory={showCategory}
          defaults={{ q, city, category }}
          onApply={apply}
          onClear={clear}
          inline
        />
      </div>

      {activeCount > 0 ? (
        <div className="flex flex-wrap items-center gap-2">
          {q ? <Chip label={`“${q}”`} onClear={() => apply({ city, category })} /> : null}
          {city ? (
            <Chip label={city} onClear={() => apply({ q, category })} />
          ) : null}
          {showCategory && category ? (
            <Chip label={category} onClear={() => apply({ q, city })} />
          ) : null}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 touch-manipulation"
            onClick={clear}
          >
            Clear all
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function Chip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <button
      type="button"
      onClick={onClear}
      className="inline-flex min-h-9 items-center gap-1 rounded-full border border-border bg-muted/60 px-3 text-xs font-medium touch-manipulation"
    >
      {label}
      <X className="h-3 w-3" aria-hidden />
      <span className="sr-only">Remove {label}</span>
    </button>
  );
}

function FilterFields({
  showCategory,
  defaults,
  onApply,
  onClear,
  inline,
}: {
  showCategory: boolean;
  defaults: DiscoveryFilterValues;
  onApply: (v: DiscoveryFilterValues) => void;
  onClear: () => void;
  inline?: boolean;
}) {
  return (
    <form
      className={cn("mt-4 space-y-3", inline && "mt-0 contents")}
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        onApply({
          q: String(fd.get("q") ?? defaults.q ?? ""),
          city: String(fd.get("city") ?? ""),
          category: String(fd.get("category") ?? ""),
        });
      }}
    >
      {!inline ? (
        <div>
          <Label htmlFor="filter-q">Search</Label>
          <Input
            id="filter-q"
            name="q"
            defaultValue={defaults.q}
            className="mt-1 h-11"
          />
        </div>
      ) : null}
      <div className={inline ? undefined : undefined}>
        <Label htmlFor="filter-city" className={inline ? "sr-only" : undefined}>
          City
        </Label>
        <Input
          id="filter-city"
          name="city"
          defaultValue={defaults.city}
          placeholder="City"
          className="mt-1 h-11"
        />
      </div>
      {showCategory ? (
        <div>
          <Label
            htmlFor="filter-category"
            className={inline ? "sr-only" : undefined}
          >
            Category
          </Label>
          <Input
            id="filter-category"
            name="category"
            defaultValue={defaults.category}
            placeholder="Category"
            className="mt-1 h-11"
          />
        </div>
      ) : null}
      <div className={cn("flex gap-2", inline && "col-span-3")}>
        <Button type="submit" className="min-h-11 flex-1 touch-manipulation">
          Apply
        </Button>
        <Button
          type="button"
          variant="outline"
          className="min-h-11 touch-manipulation"
          onClick={onClear}
        >
          Reset
        </Button>
      </div>
    </form>
  );
}
