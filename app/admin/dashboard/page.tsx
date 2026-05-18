const queues = [
  { label: 'New franchisee applications', count: 12 },
  { label: 'Venue onboarding review', count: 8 },
  { label: 'Payout exceptions', count: 3 },
];

export default function AdminDashboard() {
  return (
    <main className="stack">
      <section className="grid-2">
        <div className="card stack">
          <h2>Approval queues</h2>
          {queues.map((q) => <div key={q.label} className="list-row"><span>{q.label}</span><strong>{q.count}</strong></div>)}
        </div>
        <div className="card stack">
          <h2>Template manager</h2>
          <div className="muted">Event templates, proposal blocks, and branded emails.</div>
          <button className="btn-primary" type="button">Manage templates</button>
        </div>
      </section>
      <section className="grid-2">
        <div className="card stack"><h2>Audit logs</h2><div className="muted">All approvals, edits, and payouts are tracked here.</div></div>
        <div className="card stack"><h2>Payouts</h2><div className="muted">Review pending commissions and export payout batches.</div></div>
      </section>
    </main>
  );
}
