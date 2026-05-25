'use client';

export default function AdminDashboard() {
  return (
    <div style={{ fontFamily: 'system-ui', background: '#f5f6fa', minHeight: '100vh', padding: '20px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Admin Dashboard</h1>
        
        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px' }}><div style={{ color: '#6b7280' }}>Total Partners</div><div style={{ fontSize: '32px', fontWeight: 'bold' }}>320</div><div style={{ color: '#10b981' }}>↑ 10% vs last month</div></div>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px' }}><div style={{ color: '#6b7280' }}>Total Events</div><div style={{ fontSize: '32px', fontWeight: 'bold' }}>1,250</div><div style={{ color: '#10b981' }}>↑ 12% vs last month</div></div>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px' }}><div style={{ color: '#6b7280' }}>Total Revenue</div><div style={{ fontSize: '32px', fontWeight: 'bold' }}>₹82,50,000</div><div style={{ color: '#10b981' }}>↑ 8% vs last month</div></div>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', marginBottom: '30px', overflowX: 'auto' }}>
          <h2 style={{ marginBottom: '16px' }}>Recent Members</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ borderBottom: '1px solid #e5e7eb' }}><th style={{ textAlign: 'left', padding: '12px' }}>Name</th><th style={{ textAlign: 'left', padding: '12px' }}>Email</th><th style={{ textAlign: 'left', padding: '12px' }}>Type</th><th style={{ textAlign: 'left', padding: '12px' }}>Status</th><th style={{ textAlign: 'left', padding: '12px' }}>Action</th></tr></thead>
            <tbody>
              <tr><td style={{ padding: '12px' }}>Rohan Mehta</td><td style={{ padding: '12px' }}>rohan@gmail.com</td><td style={{ padding: '12px' }}><span style={{ background: '#fef3c7', padding: '4px 8px', borderRadius: '20px' }}>Gold</span></td><td style={{ padding: '12px' }}><span style={{ background: '#d1fae5', color: '#065f46', padding: '4px 8px', borderRadius: '20px' }}>Active</span></td><td style={{ padding: '12px' }}>🔒</td></tr>
              <tr><td style={{ padding: '12px' }}>Neha Kapoor</td><td style={{ padding: '12px' }}>neha@gmail.com</td><td style={{ padding: '12px' }}><span style={{ background: '#f3f4f6', padding: '4px 8px', borderRadius: '20px' }}>Silver</span></td><td style={{ padding: '12px' }}><span style={{ background: '#d1fae5', color: '#065f46', padding: '4px 8px', borderRadius: '20px' }}>Active</span></td><td style={{ padding: '12px' }}>🔒</td></tr>
              <tr><td style={{ padding: '12px' }}>Vikram Singh</td><td style={{ padding: '12px' }}>vikram@gmail.com</td><td style={{ padding: '12px' }}><span style={{ background: '#fef3c7', padding: '4px 8px', borderRadius: '20px' }}>Gold</span></td><td style={{ padding: '12px' }}><span style={{ background: '#d1fae5', color: '#065f46', padding: '4px 8px', borderRadius: '20px' }}>Active</span></td><td style={{ padding: '12px' }}>🔒</td></tr>
              <tr><td style={{ padding: '12px' }}>Anjali Desai</td><td style={{ padding: '12px' }}>anjali@gmail.com</td><td style={{ padding: '12px' }}><span style={{ background: '#f3f4f6', padding: '4px 8px', borderRadius: '20px' }}>Silver</span></td><td style={{ padding: '12px' }}><span style={{ background: '#fee2e2', color: '#991b1b', padding: '4px 8px', borderRadius: '20px' }}>Inactive</span></td><td style={{ padding: '12px' }}>🔒</td></tr>
            </tbody>
          </table>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '20px' }}>
          <h2>Recent Activities</h2>
          <div style={{ padding: '16px 0', borderBottom: '1px solid #f3f4f6' }}><div>New member Rohan Mehta joined as Gold Member</div><div style={{ color: '#6b7280', fontSize: '13px' }}>23 May 2025, 10:30 AM • 2h ago</div></div>
          <div style={{ padding: '16px 0', borderBottom: '1px solid #f3f4f6' }}><div>New event "Startup Networking Meetup" created</div><div style={{ color: '#6b7280', fontSize: '13px' }}>23 May 2025, 09:15 AM • 3h ago</div></div>
          <div style={{ padding: '16px 0' }}><div>Payment of ₹24,000 received from Neha Kapoor</div><div style={{ color: '#6b7280', fontSize: '13px' }}>23 May 2025, 08:45 AM • 4h ago</div></div>
        </div>
      </div>
    </div>
  );
}
