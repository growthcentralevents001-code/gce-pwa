const offers = [
  { title: 'Venue Bundle', detail: '3 premium venues + staffing' },
  { title: 'Signature Event', detail: 'Planning, logistics, and AV' },
  { title: 'Seasonal Campaign', detail: 'Multi-date promotion package' },
];

export default function EnterpriseDashboard() {
  return (
    <main className="grid-2">
      <section className="card stack">
        <h2>Request event</h2>
        <div className="form-grid">
          <input className="input" placeholder="Event name" />
          <input className="input" placeholder="Date / venue needs" />
          <textarea className="input" placeholder="Event brief" rows={5} />
        </div>
        <button className="btn-primary" type="button">Submit request</button>
      </section>
      <section className="card stack">
        <h2>Proposal builder</h2>
        <p className="muted">Build branded proposals with pricing, venue options, and logistics notes.</p>
        {offers.map((offer) => (
          <div key={offer.title} className="list-row">
            <div>
              <strong>{offer.title}</strong>
              <div className="muted">{offer.detail}</div>
            </div>
            <button className="btn-secondary" type="button">Add</button>
          </div>
        ))}
        <div>
          <h2>Offers</h2>
          <p className="muted">Bundled recommendations and pricing blocks.</p>
        </div>
      </section>
    </main>
  );
}
