"use client";

import { useState } from "react";
import { 
  LayoutDashboard, Users, Building2, Calendar, Tag, CreditCard, 
  Settings, LogOut, Menu, X, Search, Eye, Plus, CheckCircle, XCircle, 
  Phone, Mail, MapPin, Award, TrendingUp, UserPlus, Building, Clock
} from "lucide-react";

export default function AdminFranchisees() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [zoneFilter, setZoneFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedFranchisee, setSelectedFranchisee] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [franchisees, setFranchisees] = useState([
    { id: 1, name: "Mumbai West Ventures", owner: "Rajesh Mehta", email: "rajesh@mumbaiwest.com", phone: "+91 98765 43210", zone: "West", status: "Active", venues: 12, revenue: "₹45.2L", commission: "₹4.5L", joined: "Jan 2025", fee: "₹3,000", performance: "Excellent" },
    { id: 2, name: "Delhi North Enterprises", owner: "Neha Singh", email: "neha@delhinorth.com", phone: "+91 98765 43211", zone: "North", status: "Active", venues: 8, revenue: "₹28.6L", commission: "₹2.8L", joined: "Feb 2025", fee: "₹2,000", performance: "Good" },
    { id: 3, name: "Bangalore East Solutions", owner: "Vikram Rao", email: "vikram@blreast.com", phone: "+91 98765 43212", zone: "East", status: "Active", venues: 5, revenue: "₹18.2L", commission: "₹1.8L", joined: "Mar 2025", fee: "₹1,500", performance: "Average" },
    { id: 4, name: "Pune Central", owner: "Priya Patil", email: "priya@punecentral.com", phone: "+91 98765 43213", zone: "Central", status: "Pending", venues: 0, revenue: "₹0", commission: "₹0", joined: "May 2025", fee: "₹1,000", performance: "Pending" },
    { id: 5, name: "Chennai South", owner: "Arun Kumar", email: "arun@chennaisouth.com", phone: "+91 98765 43214", zone: "South", status: "Inactive", venues: 3, revenue: "₹12.4L", commission: "₹1.2L", joined: "Dec 2024", fee: "₹2,000", performance: "Poor" },
  ]);

  const stats = [
    { label: "Total Franchisees", value: franchisees.length },
    { label: "Active", value: franchisees.filter(f => f.status === "Active").length },
    { label: "Total Venues", value: franchisees.reduce((sum, f) => sum + f.venues, 0) },
    { label: "Total Commission", value: "₹10.3L" },
  ];

  const filteredFranchisees = franchisees.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          f.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          f.zone.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesZone = zoneFilter === "all" || f.zone.toLowerCase() === zoneFilter.toLowerCase();
    const matchesStatus = statusFilter === "all" || f.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesZone && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "Active": return { bg: "#dcfce7", color: "#166534", icon: <CheckCircle size={12} /> };
      case "Pending": return { bg: "#fef3c7", color: "#92400e", icon: null };
      case "Inactive": return { bg: "#fee2e2", color: "#991b1b", icon: <XCircle size={12} /> };
      default: return { bg: "#f1f5f9", color: "#475569", icon: null };
    }
  };

  const getPerformanceBadge = (performance: string) => {
    switch(performance) {
      case "Excellent": return { bg: "#dcfce7", color: "#166534" };
      case "Good": return { bg: "#e0e7ff", color: "#3730a3" };
      case "Average": return { bg: "#fef3c7", color: "#92400e" };
      case "Poor": return { bg: "#fee2e2", color: "#991b1b" };
      default: return { bg: "#f1f5f9", color: "#475569" };
    }
  };

  const handleApprove = (id: number) => {
    setFranchisees(franchisees.map(f => f.id === id ? { ...f, status: "Active", performance: "Average" } : f));
    alert("Franchisee approved!");
  };

  const handleReject = (id: number) => {
    setFranchisees(franchisees.map(f => f.id === id ? { ...f, status: "Inactive" } : f));
    alert("Franchisee rejected.");
  };

  const [newFranchisee, setNewFranchisee] = useState({
    name: "", owner: "", email: "", phone: "", zone: "North"
  });

  const handleAddFranchisee = () => {
    if (!newFranchisee.name || !newFranchisee.email) {
      alert("Please fill name and email");
      return;
    }
    const newId = franchisees.length + 1;
    setFranchisees([...franchisees, {
      id: newId, name: newFranchisee.name, owner: newFranchisee.owner || newFranchisee.name,
      email: newFranchisee.email, phone: newFranchisee.phone || "+91 XXXXX XXXXX",
      zone: newFranchisee.zone, status: "Pending", venues: 0, revenue: "₹0",
      commission: "₹0", joined: new Date().toLocaleDateString(), fee: "₹1,000", performance: "Pending"
    }]);
    setShowAddModal(false);
    setNewFranchisee({ name: "", owner: "", email: "", phone: "", zone: "North" });
    alert("Franchisee added! Pending approval.");
  };

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
              marginBottom: "4px", borderRadius: "12px", background: item.id === "franchisees" ? "#f97316" : "transparent",
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

      <div style={{
        marginLeft: sidebarOpen ? "280px" : "80px",
        flex: 1,
        padding: "24px",
        transition: "margin-left 0.3s"
      }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <div>
              <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a" }}>Franchisees Management</h1>
              <p style={{ color: "#64748b" }}>Manage franchisees across zones</p>
            </div>
            <button onClick={() => setShowAddModal(true)} style={{ display: "flex", alignItems: "center", gap: "8px", background: "#f97316", color: "white", border: "none", padding: "10px 20px", borderRadius: "40px", cursor: "pointer" }}>
              <UserPlus size={18} /> Add Franchisee
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
            {stats.map((stat, i) => (
              <div key={i} style={{ background: "white", borderRadius: "16px", padding: "16px" }}>
                <div style={{ fontSize: "28px", fontWeight: "800" }}>{stat.value}</div>
                <div style={{ color: "#64748b" }}>{stat.label}</div>
              </div>
            ))}
          </div>

          <div style={{ background: "white", borderRadius: "20px", padding: "20px", marginBottom: "24px" }}>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <div style={{ flex: 1, display: "flex", alignItems: "center", background: "#f1f5f9", borderRadius: "40px", padding: "10px 16px" }}>
                <Search size={18} style={{ marginRight: "8px" }} />
                <input type="text" placeholder="Search by name, owner or zone..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ background: "transparent", border: "none", outline: "none", flex: 1 }} />
              </div>
              <select value={zoneFilter} onChange={(e) => setZoneFilter(e.target.value)} style={{ padding: "8px 16px", borderRadius: "40px", border: "1px solid #e2e8f0" }}>
                <option value="all">All Zones</option>
                <option value="north">North</option><option value="south">South</option>
                <option value="east">East</option><option value="west">West</option><option value="central">Central</option>
              </select>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: "8px 16px", borderRadius: "40px", border: "1px solid #e2e8f0" }}>
                <option value="all">All Status</option>
                <option value="active">Active</option><option value="pending">Pending</option><option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div style={{ background: "white", borderRadius: "20px", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "1px solid #eef2ff" }}>
                  <th style={{ padding: "16px", textAlign: "left" }}>Franchisee</th>
                  <th style={{ padding: "16px", textAlign: "left" }}>Zone</th>
                  <th style={{ padding: "16px", textAlign: "left" }}>Venues</th>
                  <th style={{ padding: "16px", textAlign: "left" }}>Revenue</th>
                  <th style={{ padding: "16px", textAlign: "left" }}>Commission</th>
                  <th style={{ padding: "16px", textAlign: "left" }}>Fee</th>
                  <th style={{ padding: "16px", textAlign: "left" }}>Performance</th>
                  <th style={{ padding: "16px", textAlign: "left" }}>Status</th>
                  <th style={{ padding: "16px", textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFranchisees.map((f) => {
                  const statusStyle = getStatusBadge(f.status);
                  const perfStyle = getPerformanceBadge(f.performance);
                  return (
                    <tr key={f.id} style={{ borderBottom: "1px solid #eef2ff" }}>
                      <td style={{ padding: "16px" }}>
                        <div style={{ fontWeight: "600" }}>{f.name}</div>
                        <div style={{ fontSize: "12px", color: "#94a3b8" }}>Owner: {f.owner}</div>
                      </td>
                      <td style={{ padding: "16px" }}>{f.zone}</td>
                      <td style={{ padding: "16px" }}>{f.venues} venues</td>
                      <td style={{ padding: "16px", fontWeight: "600", color: "#22c55e" }}>{f.revenue}</td>
                      <td style={{ padding: "16px", fontWeight: "600", color: "#f97316" }}>{f.commission}</td>
                      <td style={{ padding: "16px" }}>{f.fee}</td>
                      <td style={{ padding: "16px" }}>
                        <span style={{ background: perfStyle.bg, color: perfStyle.color, padding: "4px 12px", borderRadius: "20px", fontSize: "12px" }}>{f.performance}</span>
                      </td>
                      <td style={{ padding: "16px" }}>
                        <span style={{ background: statusStyle.bg, color: statusStyle.color, padding: "4px 12px", borderRadius: "20px", fontSize: "12px" }}>{statusStyle.icon} {f.status}</span>
                      </td>
                      <td style={{ padding: "16px", textAlign: "center" }}>
                        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                          <button onClick={() => { setSelectedFranchisee(f); setShowViewModal(true); }} style={{ background: "none", border: "none", cursor: "pointer" }}>
                            <Eye size={18} style={{ color: "#f97316" }} />
                          </button>
                          {f.status === "Pending" && (
                            <>
                              <button onClick={() => handleApprove(f.id)} style={{ background: "#dcfce7", border: "none", padding: "4px 8px", borderRadius: "8px", cursor: "pointer", fontSize: "11px", color: "#166534" }}>Approve</button>
                              <button onClick={() => handleReject(f.id)} style={{ background: "#fee2e2", border: "none", padding: "4px 8px", borderRadius: "8px", cursor: "pointer", fontSize: "11px", color: "#991b1b" }}>Reject</button>
                            </>
                          )}
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

      {/* View Modal */}
      {showViewModal && selectedFranchisee && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "white", borderRadius: "24px", padding: "32px", maxWidth: "450px", width: "90%" }}>
            <h2 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "16px" }}>{selectedFranchisee.name}</h2>
            <p><strong>Owner:</strong> {selectedFranchisee.owner}</p>
            <p><strong>Email:</strong> {selectedFranchisee.email}</p>
            <p><strong>Phone:</strong> {selectedFranchisee.phone}</p>
            <p><strong>Zone:</strong> {selectedFranchisee.zone}</p>
            <p><strong>Venues:</strong> {selectedFranchisee.venues}</p>
            <p><strong>Revenue:</strong> {selectedFranchisee.revenue}</p>
            <p><strong>Commission:</strong> {selectedFranchisee.commission}</p>
            <p><strong>Monthly Fee:</strong> {selectedFranchisee.fee}</p>
            <p><strong>Joined:</strong> {selectedFranchisee.joined}</p>
            <p><strong>Performance:</strong> {selectedFranchisee.performance}</p>
            <button onClick={() => setShowViewModal(false)} style={{ marginTop: "20px", width: "100%", background: "#f97316", color: "white", border: "none", padding: "12px", borderRadius: "40px", cursor: "pointer" }}>Close</button>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "white", borderRadius: "24px", padding: "32px", maxWidth: "450px", width: "90%" }}>
            <h2 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "16px" }}>Add Franchisee</h2>
            <div style={{ marginBottom: "12px" }}>
              <input type="text" placeholder="Company Name" value={newFranchisee.name} onChange={(e) => setNewFranchisee({...newFranchisee, name: e.target.value})} style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0" }} />
            </div>
            <div style={{ marginBottom: "12px" }}>
              <input type="text" placeholder="Owner Name" value={newFranchisee.owner} onChange={(e) => setNewFranchisee({...newFranchisee, owner: e.target.value})} style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0" }} />
            </div>
            <div style={{ marginBottom: "12px" }}>
              <input type="email" placeholder="Email" value={newFranchisee.email} onChange={(e) => setNewFranchisee({...newFranchisee, email: e.target.value})} style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0" }} />
            </div>
            <div style={{ marginBottom: "12px" }}>
              <input type="text" placeholder="Phone" value={newFranchisee.phone} onChange={(e) => setNewFranchisee({...newFranchisee, phone: e.target.value})} style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0" }} />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <select value={newFranchisee.zone} onChange={(e) => setNewFranchisee({...newFranchisee, zone: e.target.value})} style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                <option>North</option><option>South</option><option>East</option><option>West</option><option>Central</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={handleAddFranchisee} style={{ flex: 1, background: "#f97316", color: "white", border: "none", padding: "12px", borderRadius: "40px", cursor: "pointer" }}>Add Franchisee</button>
              <button onClick={() => setShowAddModal(false)} style={{ flex: 1, background: "#f1f5f9", color: "#64748b", border: "none", padding: "12px", borderRadius: "40px", cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
