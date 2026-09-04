import Link from "next/link";
import { typography } from "@/lib/frontend/typography";

const COLUMNS = [
  {
    title: "GCE",
    links: [
      { href: "/connect", label: "GCE Connect" },
      { href: "/marketplace", label: "GCE Marketplace" },
      { href: "/enterprise", label: "GCE Enterprise" },
    ],
  },
  {
    title: "Discover",
    links: [
      { href: "/events", label: "Events" },
      { href: "/offers", label: "Offers" },
      { href: "/venues", label: "Venues" },
      { href: "/memberships", label: "Memberships" },
      { href: "/how-membership-works", label: "How membership works" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/for-partners", label: "For Partners" },
      { href: "/connect-bdp", label: "Connect BDP" },
      { href: "/contact", label: "Contact" },
      { href: "/terms", label: "Terms" },
      { href: "/privacy", label: "Privacy" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer
      data-site-footer
      className="mt-auto border-t border-border bg-card/40"
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href="/" className={typography.brandMark}>
              GCE Events
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Growth Central Events — Connect. Discover. Collaborate. Grow.
              Structured business networking, curated Marketplace events and
              offers, and Enterprise programmes across India.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <nav
              key={col.title}
              aria-label={col.title}
              className="lg:col-span-2 lg:col-start-auto"
            >
              <p className="text-sm font-semibold text-foreground">{col.title}</p>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-end sm:justify-between">
          <p>© {new Date().getFullYear()} Growth Central Events. All rights reserved.</p>
          <p className="max-w-md sm:text-right">
            Intended operating entity: Logixia Solutions Private Limited.
            Incorporation and statutory identifiers are pending and are not
            published here.
          </p>
        </div>
      </div>
    </footer>
  );
}
