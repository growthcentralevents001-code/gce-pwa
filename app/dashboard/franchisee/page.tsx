"use client";

import { useState } from "react";
import { 
  Building2, Calendar, TrendingUp, CreditCard, Plus, 
  Eye, Edit, Trophy, CheckCircle, AlertCircle, X
} from "lucide-react";

export default function FranchiseeDashboard() {
  const [activeTab, setActiveTab] = useState("venues");
  const [showVenueModal, setShowVenueModal] = useState(false);
  const [editingVenue, setEditingVenue] = useState<any>(null);
  
  const [venues, setVenues] = useState([
    { id: 1, name: "The Leela Mumbai", address: "Mumbai", type: "5-Star Hotel", status: "Active", events: 12, revenue: "₹8,45,000", rating: 4.8, contact: "+91 22 1234 5678" },
    { id: 2, name: "JW Marriott Pune", address: "Pune", type: "5-Star Hotel", status: "Active", events: 8, revenue: "₹5,20,000", rating: 4.7, contact: "+91 20 9876 5432" },
    { id: 3, name: "SOHO House Mumbai", address: "Mumbai", type: "Club", status: "Pending", events: 0, revenue: "₹0", rating: 0, contact: "+91 22 4567 8901" },
    { id: 4, name: "St. Regis Goa", address: "Goa", type: "Resort", status: "Active", events: 5, revenue: "₹3,80,000", rating: 4.9, contact: "+91 832 1234 567" },
  ]);

  const [newVenue, setNewVenue] = useState({ name: "", address: "", type: "5-Star Hotel", contact: "" });

  const commissionHistory = [
    { id: 1, month: "May 2025", amount: "₹45,000", status: "Paid", date: "15 May 2025" },
    { id: 2, month: "Apr 2025", amount: "₹52,000", status: "Paid", date: "15 Apr 2025" },
    { id: 3, month: "Mar 2025", amount: "₹38,000", status: "Paid", date: "15 Mar 2025" },
  ];

  const leaderboard = [
    { rank: 1, name: "Mumbai West Ventures", revenue: "₹12,50,000", commission: "₹1,25,000", growth: "+15%" },
    { rank: 2, name: "Delhi North Enterprises", revenue: "₹9,80,000", commission: "₹98,000", growth: "+12%" },
    { rank: 3, name: "Bangalore East Solutions", revenue: "₹7,20,000", commission: "₹72,000", growth: "+8%" },
  ];

  const [activities] = useState([
    { id: 1, action: "New venue onboarded", name: "SOHO House Mumbai", time: "2 hours ago" },
    { id: 2, action: "Commission credited", name: "₹45,000 for May 2025", time: "1 day ago" },
  ]);

  const stats = [
    { label: "Venues Onboarded", value: venues.length.toString(), icon: Building2, color: "#f97316" },
    { label: "Total Events", value: venues.reduce((acc, v) => acc + v.events, 0).toString(), icon: Calendar, color: "#22c55e" },
    { label: "Commission Earned", value: "₹2,45,000", icon: TrendingUp, color: "#3b82f6" },
    { label: "This Month", value: "₹45,000", icon: CreditCard, color: "#8b5cf6" },
  ];

  const getStatusBadge = (status: string) => {
    if (status === "Active") return { bg: "#dcfce7", color: "#166534", icon: <CheckCircle size={12} /> };
    return { bg: "#fef3c7", color: "#92400e", icon: <AlertCircle size={12} /> };
  };

  const handleAddVenue = () => {
    if (!newVenue.name || !newVenue.address) return alert("Fill required fields");
    const newId = venues.length + 1;
    setVenues([...venues, {
      id: newId, name: newVenue.name, address: newVenue.address, type: newVenue.type,
      status: "Pending", events: 0, revenue: "₹0", rating: 0, contact: newVenue.contact || "N/A"
    }]);
    setShowVenueModal(false);
    setNewVenue({ name: "", address: "", type: "5-Star Hotel", contact: "" });
    alert("Venue onboarded successfully!");
  };

  const currentTier = "Silver";
  const nextTier = "Gold";
  const tierProgress = 65;
  const revenueSplit = "40:60";

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "24px", background: "#f8fafc", minHeight: "100vh" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a" }}>Franchisee Dashboard</h1>
      <p style={{ color: "#64748b", marginBottom: "32px" }}>Manage onboarded venues, track commission, and monitor performance</p>

      {/* Tier Progress */}
      <div style={{ background: "white", borderRadius: "20px", padding: "24px", border: "1px solid #eef2ff", marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <Trophy size={20} style={{ color: "#f97316" }} />
              <span>Current Tier: <strong style={{ color: "#f97316" }}>{currentTier}</strong></span>
            </div>
            <div style={{ fontSize: "14px", color: "#64748b" }}>Next Tier: {nextTier} · Split: {revenueSplit} (GCE:Franchisee)</div>
          </div>
          <div style={{ width: "60%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
              <span>Progress to {nextTier}</span>
              <span>{tierProgress}%</span>
            </div>
            <div style={{ background: "#e2e8f0", borderRadius: "10px", height: "8px" }}>
              <div style={{ width: `${tierProgress}%`, background: "#f97316", height: "8px", borderRadius: "10px" }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "32px" }}>
        {stats.map((stat, i) => (
          <div key={i} style={{ background: "white", borderRadius: "20px", padding: "20px", border: "1px solid #eef2ff" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a" }}>{stat.value}</div>
                <div style={{ color: "#64748b", fontSize: "14px" }}>{stat.label}</div>
              </div>
              <stat.icon size={28} style={{ color: stat.color, opacity: 0.7 }} />
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "12px", borderBottom: "1px solid #e2e8f0", marginBottom: "24px", overflowX: "auto" }}>
        {["venues", "commission", "leaderboard", "activities"].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: "10px 20px", border: "none", background: "none",
            borderBottom: activeTab === tab ? "2px solid #f97316" : "none",
            color: activeTab === tab ? "#f97316" : "#64748b", fontWeight: "500", cursor: "pointer"
          }}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
        <button onClick={() => setShowVenueModal(true)} style={{ marginLeft: "auto", background: "#f97316", color: "white", border: "none", padding: "8px 20px", borderRadius: "40px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
          <Plus size={16} /> Onboard Venue
        </button>
      </div>

      {/* Venues Tab */}
      {activeTab === "venues" && (
        <div style={{ background: "white", borderRadius: "20px", overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1px solid #eef2ff" }}>
                <th style={{ padding: "16px", textAlign: "left" }}>Venue Name</th>
                <th style={{ padding: "16px", textAlign: "left" }}>Address</th>
                <th style={{ padding: "16px", textAlign: "left" }}>Type</th>
                <th style={{ padding: "16px", textAlign: "left" }}>Events</th>
                <th style={{ padding: "16px", textAlign: "left" }}>Revenue</th>
                <th style={{ padding: "16px", textAlign: "left" }}>Status</th>
                <th style={{ padding: "16px", textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {venues.map(venue => {
                const statusStyle = getStatusBadge(venue.status);
                return (
                  <tr key={venue.id} style={{ borderBottom: "1px solid #eef2ff" }}>
                    <td style={{ padding: "16px" }}><div style={{ fontWeight: "600" }}>{venue.name}</div><div style={{ fontSize: "12px", color: "#64748b" }}>⭐ {venue.rating} · {venue.contact}</div></td>
                    <td style={{ padding: "16px" }}>{venue.address}</td>
                    <td style={{ padding: "16px" }}>{venue.type}</td>
                    <td style={{ padding: "16px" }}>{venue.events}</td>
                    <td style={{ padding: "16px", fontWeight: "600", color: "#22c55e" }}>{venue.revenue}</td>
                    <td style={{ padding: "16px" }}><span style={{ background: statusStyle.bg, color: statusStyle.color, padding: "4px 12px", borderRadius: "20px", fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "4px" }}>{statusStyle.icon} {venue.status}</span></td>
                    <td style={{ padding: "16px", textAlign: "center" }}>
                      <button onClick={() => alert(`Details:\n${venue.name}\nAddress: ${venue.address}\nContact: ${venue.contact}\nRating: ${venue.rating}⭐`)} style={{ background: "none", border: "none", cursor: "pointer" }}><Eye size={18} style={{ color: "#f97316" }} /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Commission Tab */}
      {activeTab === "commission" && (
        <div style={{ background: "white", borderRadius: "20px", overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "500px" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1px solid #eef2ff" }}>
                <th style={{ padding: "16px", textAlign: "left" }}>Month</th>
                <th style={{ padding: "16px", textAlign: "left" }}>Amount</th>
                <th style={{ padding: "16px", textAlign: "left" }}>Status</th>
                <th style={{ padding: "16px", textAlign: "left" }}>Payment Date</th>
              </tr>
            </thead>
            <tbody>
              {commissionHistory.map(comm => (
                <tr key={comm.id} style={{ borderBottom: "1px solid #eef2ff" }}>
                  <td style={{ padding: "16px" }}>{comm.month}</td>
                  <td style={{ padding: "16px", fontWeight: "600", color: "#22c55e" }}>{comm.amount}</td>
                  <td style={{ padding: "16px" }}><span style={{ background: "#dcfce7", color: "#166534", padding: "4px 12px", borderRadius: "20px", fontSize: "12px" }}>{comm.status}</span></td>
                  <td style={{ padding: "16px" }}>{comm.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Leaderboard Tab */}
      {activeTab === "leaderboard" && (
        <div style={{ background: "white", borderRadius: "20px", overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "500px" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1px solid #eef2ff" }}>
                <th style={{ padding: "16px", textAlign: "left" }}>Rank</th>
                <th style={{ padding: "16px", textAlign: "left" }}>Franchisee</th>
                <th style={{ padding: "16px", textAlign: "left" }}>Revenue</th>
                <th style={{ padding: "16px", textAlign: "left" }}>Commission</th>
                <th style={{ padding: "16px", textAlign: "left" }}>Growth</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map(item => (
                <tr key={item.rank} style={{ borderBottom: "1px solid #eef2ff" }}>
                  <td style={{ padding: "16px" }}>{item.rank === 1 ? "🏆" : item.rank === 2 ? "🥈" : item.rank === 3 ? "🥉" : `#${item.rank}`}</td>
                  <td style={{ padding: "16px", fontWeight: "500" }}>{item.name}</td>
                  <td style={{ padding: "16px" }}>{item.revenue}</td>
                  <td style={{ padding: "16px", fontWeight: "600", color: "#f97316" }}>{item.commission}</td>
                  <td style={{ padding: "16px", color: "#22c55e" }}>{item.growth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Activities Tab */}
      {activeTab === "activities" && (
        <div style={{ background: "white", borderRadius: "20px", padding: "24px" }}>
          {activities.map(activity => (
            <div key={activity.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #eef2ff" }}>
              <div><div style={{ fontWeight: "500" }}>{activity.action}</div><div style={{ fontSize: "14px", color: "#64748b" }}>{activity.name}</div></div>
              <div style={{ fontSize: "12px", color: "#94a3b8" }}>{activity.time}</div>
            </div>
          ))}
        </div>
      )}

      {/* Venue Modal */}
      {showVenueModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "white", borderRadius: "24px", padding: "32px", maxWidth: "500px", width: "90%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "22px", fontWeight: "700" }}>Onboard New Venue</h2>
              <button onClick={() => setShowVenueModal(false)} style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer" }}><X size={24} /></button>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <input type="text" placeholder="Venue Name *" value={newVenue.name} onChange={(e) => setNewVenue({...newVenue, name: e.target.value})} style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0" }} />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <input type="text" placeholder="Address *" value={newVenue.address} onChange={(e) => setNewVenue({...newVenue, address: e.target.value})} style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0" }} />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <select value={newVenue.type} onChange={(e) => setNewVenue({...newVenue, type: e.target.value})} style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                <option>5-Star Hotel</option><option>Club</option><option>Resort</option>
              </select>
            </div>
            <div style={{ marginBottom: "24px" }}>
              <input type="text" placeholder="Contact Number" value={newVenue.contact} onChange={(e) => setNewVenue({...newVenue, contact: e.target.value})} style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0" }} />
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={handleAddVenue} style={{ flex: 1, background: "#f97316", color: "white", border: "none", padding: "12px", borderRadius: "40px", cursor: "pointer" }}>Add Venue</button>
              <button onClick={() => setShowVenueModal(false)} style={{ flex: 1, background: "#f1f5f9", color: "#64748b", border: "none", padding: "12px", borderRadius: "40px", cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
