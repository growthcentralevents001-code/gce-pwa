import Link from "next/link";

export default function DashboardIndex() {
  return (
    <main className="grid-2">
      <section className="card">
        <p className="eyebrow">Choose a workspace</p>
        <h2>GCE workspaces</h2>
        <p className="muted">
          Legacy role dashboards are retired. Use your assignment-scoped workspace below.
        </p>
      </section>
      <section className="card stack">
        <Link className="btn-primary" href="/dashboard/connect-member">
          GCE Connect member
        </Link>
        <Link className="btn-primary" href="/dashboard/marketplace-bdp">
          Marketplace BDP
        </Link>
        <Link className="btn-primary" href="/venue">
          Venue partner
        </Link>
        <Link className="btn-primary" href="/ops">
          Platform Ops
        </Link>
      </section>
    </main>
  );
}
