import Link from 'next/link';
import type { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="dashboard-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Growth Centralevents</p>
          <h1>Phase 2 Dashboards</h1>
        </div>
        <nav className="nav-pills">
          <Link href="/">Home</Link>
          <Link href="/dashboard/franchisee">Franchisee</Link>
          <Link href="/dashboard/enterprise">Enterprise</Link>
          <Link href="/admin/dashboard">Admin</Link>
        </nav>
      </header>
      {children}
    </div>
  );
}
