import type { ReactNode } from 'react';
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div className="dashboard-shell">{children}</div>;
}
