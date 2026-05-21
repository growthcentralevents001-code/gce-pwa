"use client";

import { useState } from "react";
import { 
  LayoutDashboard, Users, Building2, Calendar, Tag, CreditCard, 
  Settings, LogOut, Menu, X, Search, Eye, TrendingUp, Building, 
  Bell, CheckCircle, Clock, AlertCircle, TrendingDown, Activity,
  Download, RefreshCw, UserPlus, PlusCircle, DollarSign
} from "lucide-react";

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const stats = [
    { label: "Total Members", value: "12,450", change: "+10%", icon: Users, color: "#f97316" },
    { label: "Total Partners", value: "320", change: "+12%", icon: Building2, color: "#22c55e" },
    { label: "Total Events", value: "1,250", change: "+8%", icon: Calendar, color: "#3b82f6" },
    { label: "Total Revenue", value: "₹82.5L", change: "+15%", icon: DollarSign, color: "#8b5cf6" },
  ];

  const pendingApprovals = [
    { type: "Events", count: 3, icon: Calendar, color: "#f97316" },
    { type: "Franchisees", count: 1, icon: Building, color: "#22c55e" },
    { type: "Offers", count: 2, icon: Tag, color: "#3b82f6" },
    { type: "Venues", count: 4, icon: Building2, color: "#8b5cf6" },
  ];

  const recentActivities = [
    { action: "New member joined", user: "Rohan Mehta", time: "2 min ago", type: "member" },
    { action: "Event created", user: "Startup Founders Mixer", time: "15 min ago", type: "event" },
    { action: "Payout processed", user: "The Leela Mumbai - ₹1,20,000", time: "1 hour ago", type: "payout" },
    { action: "Franchisee approved", user: "Mumbai West Ventures", time: "3 hours ago", type: "franchisee" },
    { action: "New offer created", user: "20% OFF on Business Events", time: "5 hours ago", type: "offer" },
  ];

  const topPerformers = [
    { name: "The Leela Mumbai", type: "Venue", revenue: "₹12.5L", events: 24 },
    { name: "Mumbai West Ventures", type: "Franchisee", revenue: "₹45.2L", commission: "₹4.5L" },
    { name: "Fintech Summit", type: "Event", revenue: "₹8.2L", attendees: 450 },
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
            <a key={item.id} href={item.href} style={{
              display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px",
              marginBottom: "4px", borderRadius: "12px", background: item.id === "dashboard" ? "#f97316" : "transparent",
              color: "white", textDecoration: "none", cursor: "pointer"
            }}>
              <item.icon size={20} />
              {sidebarOpen && <span>{item.label}</span>}
            </a>
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
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <div>
              <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a" }}>Dashboard</h1>
              <p style={{ color: "#64748b" }}>Welcome back! Here's what's happening today.</p>
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button style={{ display: "flex", alignItems: "center", gap: "8px", background: "white", border: "1px solid #e2e8f0", padding: "10px 16px", borderRadius: "40px", cursor: "pointer" }}>
                <RefreshCw size={16} /> Refresh
              </button>
              <button style={{ display: "flex", alignItems: "center", gap: "8px", background: "#f97316", color: "white", border: "none", padding: "10px 20px", borderRadius: "40px", cursor: "pointer" }}>
                <Download size={16} /> Export Report
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "24px" }}>
            {stats.map((stat, i) => (
              <div key={i} style={{ background: "white", borderRadius: "20px", padding: "20px", border: "1px solid #eef2ff" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a" }}>{stat.value}</div>
                    <div style={{ color: "#64748b", fontSize: "14px", marginTop: "4px" }}>{stat.label}</div>
                  </div>
                  <stat.icon size={32} style={{ color: stat.color, opacity: 0.7 }} />
                </div>
                <div style={{ fontSize: "13px", color: "#22c55e", display: "flex", alignItems: "center", gap: "4px", marginTop: "12px" }}>
                  <TrendingUp size={14} /> {stat.change} vs last month
                </div>
              </div>
            ))}
          </div>

          {/* Two Column Layout */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
            {/* Pending Approvals */}
            <div style={{ background: "white", borderRadius: "20px", padding: "20px", border: "1px solid #eef2ff" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Bell size={18} style={{ color: "#f97316" }} /> Pending Approvals
                </h2>
                <a href="/admin/events" style={{ color: "#f97316", fontSize: "13px" }}>View All →</a>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {pendingApprovals.map((item, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", background: "#f8fafc", borderRadius: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ background: `${item.color}20`, padding: "8px", borderRadius: "12px" }}>
                        <item.icon size={18} style={{ color: item.color }} />
                      </div>
                      <div>
                        <div style={{ fontWeight: "500" }}>{item.type}</div>
                        <div style={{ fontSize: "12px", color: "#64748b" }}>Awaiting approval</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ background: "#fef3c7", padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>{item.count}</span>
                      <button style={{ background: "#f97316", color: "white", border: "none", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", cursor: "pointer" }}>Review</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activities */}
            <div style={{ background: "white", borderRadius: "20px", padding: "20px", border: "1px solid #eef2ff" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                <Activity size={18} style={{ color: "#f97316" }} /> Recent Activities
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {recentActivities.map((activity, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "12px", borderBottom: i < recentActivities.length - 1 ? "1px solid #eef2ff" : "none" }}>
                    <div>
                      <div style={{ fontWeight: "500", fontSize: "14px" }}>{activity.action}</div>
                      <div style={{ fontSize: "12px", color: "#64748b" }}>{activity.user}</div>
                    </div>
                    <div style={{ fontSize: "11px", color: "#94a3b8" }}>{activity.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ background: "linear-gradient(135deg, #f97316, #ea580c)", borderRadius: "20px", padding: "24px", marginBottom: "24px", color: "white" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px" }}>Quick Actions</h2>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <button style={{ display: "flex", alignItems: "center", gap: "8px", background: "white", color: "#f97316", border: "none", padding: "10px 20px", borderRadius: "40px", cursor: "pointer" }}><PlusCircle size={18} /> Create Event</button>
              <button style={{ display: "flex", alignItems: "center", gap: "8px", background: "white", color: "#f97316", border: "none", padding: "10px 20px", borderRadius: "40px", cursor: "pointer" }}><UserPlus size={18} /> Add Member</button>
              <button style={{ display: "flex", alignItems: "center", gap: "8px", background: "white", color: "#f97316", border: "none", padding: "10px 20px", borderRadius: "40px", cursor: "pointer" }}><Building2 size={18} /> Add Partner</button>
              <button style={{ display: "flex", alignItems: "center", gap: "8px", background: "white", color: "#f97316", border: "none", padding: "10px 20px", borderRadius: "40px", cursor: "pointer" }}><DollarSign size={18} /> Process Payouts</button>
            </div>
          </div>

          {/* Top Performers & Recent Members */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            {/* Top Performers */}
            <div style={{ background: "white", borderRadius: "20px", padding: "20px", border: "1px solid #eef2ff" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px" }}>🏆 Top Performers</h2>
              {topPerformers.map((performer, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: i < topPerformers.length - 1 ? "1px solid #eef2ff" : "none" }}>
                  <div>
                    <div style={{ fontWeight: "500" }}>{performer.name}</div>
                    <div style={{ fontSize: "12px", color: "#64748b" }}>{performer.type}</div>
                  </div>
                  <div style={{ fontWeight: "600", color: "#f97316" }}>{performer.revenue || performer.commission}</div>
                </div>
              ))}
            </div>

            {/* Recent Members */}
            <div style={{ background: "white", borderRadius: "20px", padding: "20px", border: "1px solid #eef2ff" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: "700" }}>Recent Members</h2>
                <a href="/admin/members" style={{ color: "#f97316", fontSize: "13px" }}>View All →</a>
              </div>
              {recentMembers.map((member, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < recentMembers.length - 1 ? "1px solid #eef2ff" : "none" }}>
                  <div>
                    <div style={{ fontWeight: "500" }}>{member.name}</div>
                    <div style={{ fontSize: "12px", color: "#64748b" }}>{member.email}</div>
                  </div>
                  <span style={{ background: member.type === "Gold" ? "#fef3c7" : "#e0e7ff", padding: "4px 10px", borderRadius: "20px", fontSize: "11px" }}>{member.type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
