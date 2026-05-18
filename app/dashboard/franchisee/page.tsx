const metrics = [
  { label: 'Tier', value: 'Gold Partner' },
  { label: 'Commission', value: '18%' },
  { label: 'Venues Onboarded', value: '24' },
  { label: 'Leaderboard Rank', value: '#3' },
];
const onboarding = ['Verify venue profile', 'Upload licensing documents', 'Approve branding pack', 'Activate payout setup'];
const leaderboard = ['North District Events', 'Prime Venue Group', 'You', 'City Lights Partners'];

export default function FranchiseeDashboard() {
  return (
    <main className="stack">
      <section className="grid-4">
        {metrics.map((item) => (
          <div key={item.label} className="card metric-card">
            <p className="eyebrow">{item.label}</p>
            <h3>{item.value}</h3>
          </div>
        ))}
      </section>
      <section className="grid-2">
        <div className="card stack">
          <h2>Venue onboarding</h2>
          {onboarding.map((step, idx) => <div key={step} className="list-row"><span className="badge">{idx + 1}</span><span>{step}</span></div>)}
        </div>
        <div className="card stack">
          <h2>Leaderboard</h2>
          {leaderboard.map((row, idx) => <div key={row} className="list-row"><span>{idx + 1}. {row}</span><strong>{100 - idx * 4}</strong></div>)}
        </div>
      </section>
    </main>
  );
}
