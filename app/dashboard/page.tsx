import Link from 'next/link';

export default function DashboardIndex() {
  return (
    <main className="grid-2">
      <section className="card">
        <p className="eyebrow">Choose a workspace</p>
        <h2>Phase 2 dashboard suite</h2>
        <p className="muted">Orange and white UI for each role.</p>
      </section>
      <section className="card stack">
        <Link className="btn-primary" href="/dashboard/franchisee">Open Franchisee Dashboard</Link>
        <Link className="btn-primary" href="/dashboard/enterprise">Open Enterprise Dashboard</Link>
        <Link className="btn-primary" href="/admin/dashboard">Open Admin Panel</Link>
      </section>
    </main>
  );
}
