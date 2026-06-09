"use client";

import { useState } from "react";
import { 
  LayoutDashboard, Users, Building2, Calendar, Tag, CreditCard, 
  Settings, LogOut, Menu, X, Search, Eye, Plus, CheckCircle, XCircle, AlertCircle, Percent, Gift
} from "lucide-react";

export default function AdminOffers() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [offers, setOffers] = useState([
    { id: 1, name: "Flat ₹100 OFF", type: "Discount", discount: "₹100", vertical: "Connect", status: "Active", validTill: "30 Jun 2025", redeemed: 45, total: 200, createdBy: "GCE Admin" },
    { id: 2, name: "20% OFF on Business Events", type: "Discount", discount: "20%", vertical: "Enterprise", status: "Active", validTill: "15 Jul 2025", redeemed: 128, total: 500, createdBy: "Fintech Council" },
    { id: 3, name: "Buy 1 Get 1 Free", type: "Free Units", discount: "BOGO", vertical: "Marketplace", status: "Pending", validTill: "10 Jun 2025", redeemed: 0, total: 100, createdBy: "JW Marriott" },
    { id: 4, name: "₹500 Off on First Booking", type: "Discount", discount: "₹500", vertical: "Connect", status: "Expired", validTill: "15 May 2025", redeemed: 67, total: 150, createdBy: "GCE Admin" },
    { id: 5, name: "Free Drink with Ticket", type: "Free Units", discount: "1 Free Drink", vertical: "Marketplace", status: "Rejected", validTill: "25 Jun 2025", redeemed: 0, total: 50, createdBy: "SOHO House" },
  ]);

  const stats = [
    { label: "Total Offers", value: offers.length },
    { label: "Active Offers", value: offers.filter(o => o.status === "Active").length },
    { label: "Pending Approval", value: offers.filter(o => o.status === "Pending").length },
    { label: "Total Redeemed", value: offers.reduce((sum, o) => sum + o.redeemed, 0) },
  ];

  const filteredOffers = offers.filter(o => {
    const matchesSearch = o.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || o.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "Active": return { bg: "#dcfce7", color: "#166534", icon: <CheckCircle size={12} /> };
      case "Pending": return { bg: "#fef3c7", color: "#92400e", icon: <AlertCircle size={12} /> };
      case "Expired": return { bg: "#e2e8f0", color: "#475569", icon: null };
      case "Rejected": return { bg: "#fee2e2", color: "#991b1b", icon: <XCircle size={12} /> };
      default: return { bg: "#f1f5f9", color: "#475569", icon: null };
    }
  };

  const handleApprove = (id: number) => {
    setOffers(offers.map(o => o.id === id ? { ...o, status: "Active" } : o));
    alert("Offer approved!");
  };

  const handleReject = (id: number) => {
    setOffers(offers.map(o => o.id === id ? { ...o, status: "Rejected" } : o));
    alert("Offer rejected.");
  };

  const [newOffer, setNewOffer] = useState({
    name: "", type: "Discount", discount: "", vertical: "Connect", validTill: "", total: 100
  });

  const handleAddOffer = () => {
    if (!newOffer.name || !newOffer.discount) {
      alert("Please fill name and discount");
      return;
    }
    const newId = offers.length + 1;
    setOffers([...offers, {
      id: newId, name: newOffer.name, type: newOffer.type, discount: newOffer.discount,
      vertical: newOffer.vertical, status: "Pending", validTill: newOffer.validTill || "30 Jun 2025",
      redeemed: 0, total: newOffer.total, createdBy: "GCE Admin"
    }]);
    setShowAddModal(false);
    setNewOffer({ name: "", type: "Discount", discount: "", vertical: "Connect", validTill: "", total: 100 });
    alert("Offer created! Pending approval.");
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
              marginBottom: "4px", borderRadius: "12px", background: item.id === "offers" ? "#f97316" : "transparent",
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
              <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a" }}>Offers Management</h1>
              <p style={{ color: "#64748b" }}>Manage discounts, promotions, and enterprise offers</p>
            </div>
            <button onClick={() => setShowAddModal(true)} style={{ display: "flex", alignItems: "center", gap: "8px", background: "#f97316", color: "white", border: "none", padding: "10px 20px", borderRadius: "40px", cursor: "pointer" }}>
              <Plus size={18} /> Create Offer
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
            {stats.map((stat, i) => (
              <div key={i} style={{ background: "white", borderRadius: "16px", padding: "16px" }}>
                <div style={{ fontSize: "28px", fontWeight: "800" }}>{stat.value}</div>
                <div style={{ color: "#64748b" }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Search & Filter */}
          <div style={{ background: "white", borderRadius: "20px", padding: "20px", marginBottom: "24px" }}>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <div style={{ flex: 1, display: "flex", alignItems: "center", background: "#f1f5f9", borderRadius: "40px", padding: "10px 16px" }}>
                <Search size={18} style={{ marginRight: "8px" }} />
                <input type="text" placeholder="Search offers..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ background: "transparent", border: "none", outline: "none", flex: 1 }} />
              </div>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: "8px 16px", borderRadius: "40px", border: "1px solid #e2e8f0" }}>
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="expired">Expired</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Offers Table */}
          <div style={{ background: "white", borderRadius: "20px", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "1px solid #eef2ff" }}>
                  <th style={{ padding: "16px", textAlign: "left" }}>Offer Name</th>
                  <th style={{ padding: "16px", textAlign: "left" }}>Type</th>
                  <th style={{ padding: "16px", textAlign: "left" }}>Discount</th>
                  <th style={{ padding: "16px", textAlign: "left" }}>Vertical</th>
                  <th style={{ padding: "16px", textAlign: "left" }}>Valid Till</th>
                  <th style={{ padding: "16px", textAlign: "left" }}>Redeemed</th>
                  <th style={{ padding: "16px", textAlign: "left" }}>Status</th>
                  <th style={{ padding: "16px", textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOffers.map((offer) => {
                  const statusStyle = getStatusBadge(offer.status);
                  return (
                    <tr key={offer.id} style={{ borderBottom: "1px solid #eef2ff" }}>
                      <td style={{ padding: "16px" }}><div style={{ fontWeight: "600" }}>{offer.name}</div><div style={{ fontSize: "12px", color: "#94a3b8" }}>by {offer.createdBy}</div></td>
                      <td style={{ padding: "16px" }}><span style={{ display: "flex", alignItems: "center", gap: "4px" }}>{offer.type === "Discount" ? <Percent size={14} /> : <Gift size={14} />} {offer.type}</span></td>
                      <td style={{ padding: "16px" }}><span style={{ fontWeight: "600", color: "#f97316" }}>{offer.discount}</span></td>
                      <td style={{ padding: "16px" }}>{offer.vertical}</td>
                      <td style={{ padding: "16px" }}>{offer.validTill}</td>
                      <td style={{ padding: "16px" }}>{offer.redeemed} / {offer.total}</td>
                      <td style={{ padding: "16px" }}><span style={{ background: statusStyle.bg, color: statusStyle.color, padding: "4px 12px", borderRadius: "20px", fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "4px" }}>{statusStyle.icon} {offer.status}</span></td>
                      <td style={{ padding: "16px", textAlign: "center" }}>
                        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                          <button onClick={() => { setSelectedOffer(offer); setShowViewModal(true); }} style={{ background: "none", border: "none", cursor: "pointer" }}><Eye size={18} style={{ color: "#f97316" }} /></button>
                          {offer.status === "Pending" && (
                            <>
                              <button onClick={() => handleApprove(offer.id)} style={{ background: "#dcfce7", border: "none", padding: "4px 8px", borderRadius: "8px", cursor: "pointer", fontSize: "11px", color: "#166534" }}>Approve</button>
                              <button onClick={() => handleReject(offer.id)} style={{ background: "#fee2e2", border: "none", padding: "4px 8px", borderRadius: "8px", cursor: "pointer", fontSize: "11px", color: "#991b1b" }}>Reject</button>
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
      {showViewModal && selectedOffer && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "white", borderRadius: "24px", padding: "32px", maxWidth: "450px", width: "90%" }}>
            <h2 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "16px" }}>{selectedOffer.name}</h2>
            <p><strong>Type:</strong> {selectedOffer.type}</p>
            <p><strong>Discount:</strong> {selectedOffer.discount}</p>
            <p><strong>Vertical:</strong> {selectedOffer.vertical}</p>
            <p><strong>Valid Till:</strong> {selectedOffer.validTill}</p>
            <p><strong>Redeemed:</strong> {selectedOffer.redeemed} / {selectedOffer.total}</p>
            <p><strong>Created By:</strong> {selectedOffer.createdBy}</p>
            <p><strong>Status:</strong> {selectedOffer.status}</p>
            <button onClick={() => setShowViewModal(false)} style={{ marginTop: "20px", width: "100%", background: "#f97316", color: "white", border: "none", padding: "12px", borderRadius: "40px", cursor: "pointer" }}>Close</button>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "white", borderRadius: "24px", padding: "32px", maxWidth: "450px", width: "90%" }}>
            <h2 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "16px" }}>Create Offer</h2>
            <div style={{ marginBottom: "12px" }}><input type="text" placeholder="Offer Name" value={newOffer.name} onChange={(e) => setNewOffer({...newOffer, name: e.target.value})} style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0" }} /></div>
            <div style={{ marginBottom: "12px", display: "flex", gap: "12px" }}>
              <select value={newOffer.type} onChange={(e) => setNewOffer({...newOffer, type: e.target.value})} style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0" }}><option>Discount</option><option>Free Units</option></select>
              <input type="text" placeholder="e.g., ₹100 or 20%" value={newOffer.discount} onChange={(e) => setNewOffer({...newOffer, discount: e.target.value})} style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0" }} />
            </div>
            <div style={{ marginBottom: "12px", display: "flex", gap: "12px" }}>
              <select value={newOffer.vertical} onChange={(e) => setNewOffer({...newOffer, vertical: e.target.value})} style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0" }}><option>Connect</option><option>Marketplace</option><option>Enterprise</option></select>
              <input type="number" placeholder="Total Units" value={newOffer.total} onChange={(e) => setNewOffer({...newOffer, total: parseInt(e.target.value)})} style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0" }} />
            </div>
            <div style={{ marginBottom: "20px" }}><input type="text" placeholder="Valid Till (e.g., 30 Jun 2025)" value={newOffer.validTill} onChange={(e) => setNewOffer({...newOffer, validTill: e.target.value})} style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0" }} /></div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={handleAddOffer} style={{ flex: 1, background: "#f97316", color: "white", border: "none", padding: "12px", borderRadius: "40px", cursor: "pointer" }}>Create</button>
              <button onClick={() => setShowAddModal(false)} style={{ flex: 1, background: "#f1f5f9", color: "#64748b", border: "none", padding: "12px", borderRadius: "40px", cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
