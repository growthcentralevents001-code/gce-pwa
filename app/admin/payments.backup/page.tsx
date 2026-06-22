"use client";

import { useState } from "react";
import { LayoutDashboard, Users, Building2, Calendar, Tag, CreditCard, Settings, LogOut, Menu, X, Search, Eye, CheckCircle, Clock, AlertCircle, Download, Banknote, ArrowUpRight } from "lucide-react";

export default function AdminPayments() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState<any>(null);

  const [payouts, setPayouts] = useState([
    { id: 1, recipient: "The Leela Mumbai", type: "Venue", amount: "₹1,20,000", status: "Completed", date: "21 May 2025", commission: "₹30,000", events: 4, method: "Bank Transfer" },
    { id: 2, recipient: "Priya Sharma", type: "Franchisee", amount: "₹45,000", status: "Pending", date: "21 May 2025", commission: "₹5,000", events: 12, method: "Razorpay" },
    { id: 3, recipient: "JW Marriott Pune", type: "Venue", amount: "₹85,000", status: "Processing", date: "20 May 2025", commission: "₹21,250", events: 3, method: "Bank Transfer" },
    { id: 4, recipient: "Amit Verma", type: "BDM", amount: "₹98,000", status: "Completed", date: "19 May 2025", commission: "₹12,000", events: 8, method: "Razorpay" },
    { id: 5, recipient: "SOHO House", type: "Venue", amount: "₹42,000", status: "Failed", date: "18 May 2025", commission: "₹10,500", events: 2, method: "Bank Transfer" },
    { id: 6, recipient: "Rajesh Kumar", type: "Franchisee", amount: "₹54,000", status: "Pending", date: "18 May 2025", commission: "₹6,000", events: 6, method: "Razorpay" },
  ]);

  const stats = [
    { label: "Total Payouts", value: "₹4.44L", icon: Banknote },
    { label: "Pending", value: "₹99,000", icon: Clock },
    { label: "Completed", value: "₹2.18L", icon: CheckCircle },
    { label: "This Month", value: "₹4.44L", icon: ArrowUpRight },
  ];

  const filteredPayouts = payouts.filter(p => {
    const matchesSearch = p.recipient.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesType = typeFilter === "all" || p.type.toLowerCase() === typeFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "Completed": return { bg: "#dcfce7", color: "#166534", icon: <CheckCircle size={12} /> };
      case "Pending": return { bg: "#fef3c7", color: "#92400e", icon: <Clock size={12} /> };
      case "Processing": return { bg: "#e0e7ff", color: "#3730a3", icon: <AlertCircle size={12} /> };
      case "Failed": return { bg: "#fee2e2", color: "#991b1b", icon: <AlertCircle size={12} /> };
      default: return { bg: "#f1f5f9", color: "#475569", icon: null };
    }
  };

  const handleApprove = (id: number) => {
    setPayouts(payouts.map(p => p.id === id ? { ...p, status: "Processing" } : p));
    alert("Payout approved and processing!");
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
    { id: "members", label: "Members", icon: Users, href: "/admin/members" },
    { id: "partners", label: "Partners", icon: Building2, href: "/admin/partners" },
    { id: "events", label: "Events", icon: Calendar, href: "/admin/events" },
    { id: "offers", label: "Offers", icon: Tag, href: "/admin/offers" },
    { id: "payments", label: "Payments", icon: CreditCard, href: "/admin/payments" },
    { id: "settings", label: "Settings", icon: Settings, href: "/admin/settings" },
  ];

  return (
    <div style={{ display: "flex", background: "#f1f5f9", minHeight: "100vh" }}>
      <div style={{ width: sidebarOpen ? "280px" : "80px", background: "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)", color: "white", transition: "width 0.3s", position: "fixed", height: "100vh", overflowY: "auto", zIndex: 50 }}>
        <div style={{ padding: "20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #334155" }}>
          {sidebarOpen && <span style={{ fontSize: "20px", fontWeight: "bold" }}>GCE Admin</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}>{sidebarOpen ? <X size={20} /> : <Menu size={20} />}</button>
        </div>
        <nav style={{ padding: "16px" }}>
          {navItems.map((item) => (
            <a key={item.id} href={item.href} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", marginBottom: "4px", borderRadius: "12px", background: item.id === "payments" ? "#f97316" : "transparent", color: "white", textDecoration: "none", cursor: "pointer" }}>
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

      <div style={{ marginLeft: sidebarOpen ? "280px" : "80px", flex: 1, padding: "24px", transition: "margin-left 0.3s" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <div style={{ marginBottom: "24px" }}>
            <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a" }}>Payments Management</h1>
            <p style={{ color: "#64748b" }}>Manage payouts to venues, franchisees, and BDMs</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
            {stats.map((stat, i) => (
              <div key={i} style={{ background: "white", borderRadius: "16px", padding: "16px", border: "1px solid #eef2ff" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a" }}>{stat.value}</div>
                  <stat.icon size={24} style={{ color: "#f97316" }} />
                </div>
                <div style={{ color: "#64748b", fontSize: "14px", marginTop: "4px" }}>{stat.label}</div>
              </div>
            ))}
          </div>

          <div style={{ background: "white", borderRadius: "20px", padding: "20px", marginBottom: "24px" }}>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <div style={{ flex: 1, display: "flex", alignItems: "center", background: "#f1f5f9", borderRadius: "40px", padding: "10px 16px" }}>
                <Search size={18} style={{ marginRight: "8px" }} />
                <input type="text" placeholder="Search by recipient..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ background: "transparent", border: "none", outline: "none", flex: 1 }} />
              </div>
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} style={{ padding: "8px 16px", borderRadius: "40px", border: "1px solid #e2e8f0" }}>
                <option value="all">All Types</option>
                <option value="venue">Venue</option>
                <option value="franchisee">Franchisee</option>
                <option value="bdm">BDM</option>
              </select>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: "8px 16px", borderRadius: "40px", border: "1px solid #e2e8f0" }}>
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
              <button style={{ padding: "8px 16px", borderRadius: "40px", border: "1px solid #e2e8f0", background: "white" }}><Download size={16} /> Export</button>
            </div>
          </div>

          <div style={{ background: "white", borderRadius: "20px", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "1px solid #eef2ff" }}>
                  <th style={{ padding: "16px", textAlign: "left" }}>Recipient</th>
                  <th style={{ padding: "16px", textAlign: "left" }}>Type</th>
                  <th style={{ padding: "16px", textAlign: "left" }}>Amount</th>
                  <th style={{ padding: "16px", textAlign: "left" }}>Commission</th>
                  <th style={{ padding: "16px", textAlign: "left" }}>Events</th>
                  <th style={{ padding: "16px", textAlign: "left" }}>Date</th>
                  <th style={{ padding: "16px", textAlign: "left" }}>Status</th>
                  <th style={{ padding: "16px", textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayouts.map((payout) => {
                  const statusStyle = getStatusBadge(payout.status);
                  return (
                    <tr key={payout.id} style={{ borderBottom: "1px solid #eef2ff" }}>
                      <td style={{ padding: "16px" }}><div style={{ fontWeight: "600" }}>{payout.recipient}</div><div style={{ fontSize: "12px", color: "#94a3b8" }}>{payout.method}</div></td>
                      <td style={{ padding: "16px" }}><span style={{ background: "#f1f5f9", padding: "4px 12px", borderRadius: "20px", fontSize: "12px" }}>{payout.type}</span></td>
                      <td style={{ padding: "16px" }}><span style={{ fontWeight: "700", color: "#f97316" }}>{payout.amount}</span></td>
                      <td style={{ padding: "16px", color: "#64748b" }}>{payout.commission}</td>
                      <td style={{ padding: "16px" }}>{payout.events} events</td>
                      <td style={{ padding: "16px" }}>{payout.date}</td>
                      <td style={{ padding: "16px" }}><span style={{ background: statusStyle.bg, color: statusStyle.color, padding: "4px 12px", borderRadius: "20px", fontSize: "12px" }}>{statusStyle.icon} {payout.status}</span></td>
                      <td style={{ padding: "16px", textAlign: "center" }}>
                        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                          <button onClick={() => { setSelectedPayout(payout); setShowViewModal(true); }} style={{ background: "none", border: "none", cursor: "pointer" }}><Eye size={18} style={{ color: "#f97316" }} /></button>
                          {payout.status === "Pending" && <button onClick={() => handleApprove(payout.id)} style={{ background: "#f97316", border: "none", padding: "4px 12px", borderRadius: "8px", cursor: "pointer", fontSize: "11px", color: "white" }}>Pay Now</button>}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showViewModal && selectedPayout && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "white", borderRadius: "24px", padding: "32px", maxWidth: "450px", width: "90%" }}>
            <h2 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "16px" }}>Payout Details</h2>
            <p><strong>Recipient:</strong> {selectedPayout.recipient}</p>
            <p><strong>Type:</strong> {selectedPayout.type}</p>
            <p><strong>Amount:</strong> {selectedPayout.amount}</p>
            <p><strong>Commission:</strong> {selectedPayout.commission}</p>
            <p><strong>Events:</strong> {selectedPayout.events}</p>
            <p><strong>Date:</strong> {selectedPayout.date}</p>
            <p><strong>Method:</strong> {selectedPayout.method}</p>
            <p><strong>Status:</strong> {selectedPayout.status}</p>
            <button onClick={() => setShowViewModal(false)} style={{ marginTop: "20px", width: "100%", background: "#f97316", color: "white", border: "none", padding: "12px", borderRadius: "40px", cursor: "pointer" }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
