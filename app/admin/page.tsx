"use client";

import { useState } from "react";
import { LayoutDashboard, Users, Building2, Calendar, Tag, CreditCard, Settings, LogOut, Menu, X, Search, Eye, TrendingUp, Building, FileText } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const stats = [
    { label: "Total Members", value: "12,450", change: "+10%", icon: Users },
    { label: "Total Partners", value: "320", change: "+12%", icon: Building2 },
    { label: "Total Events", value: "1,250", change: "+8%", icon: Calendar },
    { label: "Total Revenue", value: "₹82.5L", change: "+15%", icon: TrendingUp },
  ];

  const recentMembers = [
    { name: "Rohan Mehta", email: "rohan@gmail.com", type: "Gold", status: "Active", date: "23 May 2025" },
    { name: "Neha Kapoor", email: "neha@gmail.com", type: "Silver", status: "Active", date: "22 May 2025" },
    { name: "Vikram Singh", email: "vikram@gmail.com", type: "Gold", status: "Active", date: "21 May 2025" },
  ];

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
    { id: "members", label: "Members", icon: Users, href: "/admin/members" },
    { id: "partners", label: "Partners", icon: Building2, href: "/admin/partners" },
    { id: "events", label: "Events", icon: Calendar, href: "/admin/events" },
    { id: "offers", label: "Offers", icon: Tag, href: "/admin/offers" },
    { id: "payments", label: "Payments", icon: CreditCard, href: "/admin/payments" },
    { id: "franchisees", label: "Franchisees", icon: Building, href: "/admin/franchisees" },
    { id: "zbp_applications", label: "ZBP Applications", icon: FileText, href: "/admin/zbp-applications" },
    { id: "zbp_partners", label: "ZBP Partners", icon: Users, href: "/admin/zbp-partners" },
    { id: "settings", label: "Settings", icon: Settings, href: "/admin/settings" },
  ];

  return (
    <div style={{ display: "flex", background: "#f1f5f9", minHeight: "100vh" }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? "280px" : "80px",
        background: "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)",
        color: "white",
        transition: "width 0.3s",
        position: "fixed",
        height: "100vh",
        overflowY: "auto",
        zIndex: 50
      }}>
        <div style={{ padding: "20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #334155" }}>
          {sidebarOpen && <span style={{ fontSize: "20px", fontWeight: "bold" }}>GCE Admin</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}>
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        <nav style={{ padding: "16px" }}>
          {navItems.map((item) => (
            <Link key={item.id} href={item.href} style={{
              display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px",
              marginBottom: "4px", borderRadius: "12px", background: item.id === "dashboard" ? "#f97316" : "transparent",
              color: "white", textDecoration: "none", cursor: "pointer"
            }}>
              <item.icon size={20} />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
          <div style={{ marginTop: "20px", borderTop: "1px solid #334155", paddingTop: "16px" }}>
            <a href="#" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "12px", color: "#94a3b8", textDecoration: "none", cursor: "pointer" }}>
              <LogOut size={20} />
              {sidebarOpen && <span>Logout</span>}
            </a>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div style={{
        marginLeft: sidebarOpen ? "280px" : "80px",
        flex: 1,
        padding: "24px",
        transition: "margin-left 0.3s"
      }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <div style={{ marginBottom: "24px" }}>
            <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a", marginBottom: "4px" }}>Dashboard</h1>
            <p style={{ color: "#64748b" }}>Welcome back! Here's what's happening today.</p>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", background: "white", border: "1px solid #e2e8f0", borderRadius: "48px", padding: "12px 20px", maxWidth: "400px" }}>
              <Search size={20} style={{ color: "#94a3b8", marginRight: "12px" }} />
              <input type="text" placeholder="Search members, events, partners..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ flex: 1, border: "none", outline: "none", fontSize: "14px" }} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "32px" }}>
            {stats.map((stat, i) => (
              <div key={i} style={{ background: "white", borderRadius: "20px", padding: "20px", border: "1px solid #eef2ff" }}>
                <div style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", marginBottom: "8px" }}>{stat.value}</div>
                <div style={{ color: "#64748b" }}>{stat.label}</div>
                <div style={{ fontSize: "13px", color: "#22c55e", display: "flex", alignItems: "center", gap: "4px", marginTop: "8px" }}>
                  <TrendingUp size={14} /> {stat.change} vs last month
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: "white", borderRadius: "20px", padding: "20px", border: "1px solid #eef2ff" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "700" }}>Recent Members</h2>
              <Link href="/admin/members" style={{ color: "#f97316", textDecoration: "none", fontSize: "14px" }}>View All →</Link>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #eef2ff", textAlign: "left" }}>
                    <th style={{ padding: "12px 12px 12px 0" }}>Name</th>
                    <th style={{ padding: "12px 12px" }}>Email</th>
                    <th style={{ padding: "12px 12px" }}>Type</th>
                    <th style={{ padding: "12px 12px" }}>Status</th>
                    <th style={{ padding: "12px 12px" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentMembers.map((m, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #eef2ff" }}>
                      <td style={{ padding: "12px 12px 12px 0", fontWeight: "500" }}>{m.name}</td>
                      <td style={{ padding: "12px 12px", color: "#64748b" }}>{m.email}</td>
                      <td style={{ padding: "12px 12px" }}><span style={{ background: "#fef3c7", padding: "4px 10px", borderRadius: "20px", fontSize: "12px" }}>{m.type}</span></td>
                      <td style={{ padding: "12px 12px" }}><span style={{ background: "#dcfce7", padding: "4px 10px", borderRadius: "20px", fontSize: "12px" }}>{m.status}</span></td>
                      <td style={{ padding: "12px 12px" }}><Eye size={18} style={{ color: "#f97316", cursor: "pointer" }} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
