"use client";

import { useState } from "react";

export default function PartnersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [partners, setPartners] = useState([
    { id: 1, name: "The Leela", location: "Mumbai", type: "Premium", events: 12, revenue: 45000, status: "Active" },
    { id: 2, name: "JW Marriott", location: "Mumbai", type: "Premium", events: 8, revenue: 32000, status: "Active" },
    { id: 3, name: "Taj Lands End", location: "Mumbai", type: "Premium", events: 15, revenue: 68000, status: "Active" },
    { id: 4, name: "WeWork BKC", location: "Mumbai", type: "Standard", events: 5, revenue: 12000, status: "Active" },
    { id: 5, name: "Radisson Blu", location: "Delhi", type: "Standard", events: 3, revenue: 8000, status: "Inactive" },
  ]);

  const filteredPartners = partners.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = typeFilter === "All" || p.type === typeFilter;
    const matchStatus = statusFilter === "All" || p.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const totalEvents = partners.reduce((sum, p) => sum + p.events, 0);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", background: "#f8fafc", minHeight: "100vh", padding: "20px" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <a href="/admin-panel/" style={{ display: "inline-block", marginBottom: "20px", color: "#f97316", textDecoration: "none", fontWeight: "500" }}>← Back to Dashboard</a>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap" as const }}>
          <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a" }}>Partners / Venues Management</h1>
          <button style={{ background: "#f97316", color: "white", border: "none", padding: "10px 24px", borderRadius: "40px", cursor: "pointer", fontWeight: "600" }} onClick={() => alert("Add Partner form will open")}>+ Add New Partner</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "30px" }}>
          <div style={{ background: "white", borderRadius: "20px", padding: "20px", border: "1px solid #eef2ff", textAlign: "center" }}>
            <div style={{ fontSize: "32px", fontWeight: "800", color: "#f97316" }}>{partners.length}</div>
            <div style={{ color: "#64748b", fontSize: "14px", marginTop: "4px" }}>Total Partners</div>
          </div>
          <div style={{ background: "white", borderRadius: "20px", padding: "20px", border: "1px solid #eef2ff", textAlign: "center" }}>
            <div style={{ fontSize: "32px", fontWeight: "800", color: "#f97316" }}>{partners.filter(p => p.status === "Active").length}</div>
            <div style={{ color: "#64748b", fontSize: "14px", marginTop: "4px" }}>Active Partners</div>
          </div>
          <div style={{ background: "white", borderRadius: "20px", padding: "20px", border: "1px solid #eef2ff", textAlign: "center" }}>
            <div style={{ fontSize: "32px", fontWeight: "800", color: "#f97316" }}>{partners.filter(p => p.type === "Premium").length}</div>
            <div style={{ color: "#64748b", fontSize: "14px", marginTop: "4px" }}>Premium Partners</div>
          </div>
          <div style={{ background: "white", borderRadius: "20px", padding: "20px", border: "1px solid #eef2ff", textAlign: "center" }}>
            <div style={{ fontSize: "32px", fontWeight: "800", color: "#f97316" }}>{totalEvents}</div>
            <div style={{ color: "#64748b", fontSize: "14px", marginTop: "4px" }}>Total Events</div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
          <input type="text" placeholder="Search by name, location..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ padding: "10px 20px", border: "1px solid #e2e8f0", borderRadius: "40px", width: "280px", fontSize: "14px" }} />
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} style={{ padding: "10px 16px", border: "1px solid #e2e8f0", borderRadius: "40px", background: "white", fontSize: "14px" }}>
            <option value="All">All Types</option><option value="Premium">Premium</option><option value="Standard">Standard</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: "10px 16px", border: "1px solid #e2e8f0", borderRadius: "40px", background: "white", fontSize: "14px" }}>
            <option value="All">All Status</option><option value="Active">Active</option><option value="Inactive">Inactive</option>
          </select>
        </div>

        <div style={{ background: "white", borderRadius: "20px", padding: "20px", border: "1px solid #eef2ff", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #eef2ff", textAlign: "left" }}>
                <th style={{ padding: "14px 12px", color: "#64748b", fontWeight: "600", fontSize: "13px" }}>Venue Name</th>
                <th style={{ padding: "14px 12px", color: "#64748b", fontWeight: "600", fontSize: "13px" }}>Location</th>
                <th style={{ padding: "14px 12px", color: "#64748b", fontWeight: "600", fontSize: "13px" }}>Type</th>
                <th style={{ padding: "14px 12px", color: "#64748b", fontWeight: "600", fontSize: "13px" }}>Events</th>
                <th style={{ padding: "14px 12px", color: "#64748b", fontWeight: "600", fontSize: "13px" }}>Revenue</th>
                <th style={{ padding: "14px 12px", color: "#64748b", fontWeight: "600", fontSize: "13px" }}>Status</th>
                <th style={{ padding: "14px 12px", color: "#64748b", fontWeight: "600", fontSize: "13px" }}>Actions</th>
               </tr>
            </thead>
            <tbody>
              {filteredPartners.map(p => (
                <tr key={p.id} style={{ borderBottom: "1px solid #eef2ff" }}>
                  <td style={{ padding: "14px 12px" }}><strong>{p.name}</strong></td>
                  <td style={{ padding: "14px 12px" }}>{p.location}</td>
                  <td style={{ padding: "14px 12px" }}><span style={{ background: "#fef3c7", color: "#92400e", padding: "4px 12px", borderRadius: "30px", fontSize: "12px", display: "inline-block" }}>{p.type}</span></td>
                  <td style={{ padding: "14px 12px" }}>{p.events}</td>
                  <td style={{ padding: "14px 12px" }}>₹{p.revenue.toLocaleString()}</td>
                  <td style={{ padding: "14px 12px" }}><span style={{ background: p.status === "Active" ? "#dcfce7" : "#fee2e2", color: p.status === "Active" ? "#166534" : "#dc2626", padding: "4px 12px", borderRadius: "30px", fontSize: "12px", display: "inline-block" }}>{p.status}</span></td>
                  <td style={{ padding: "14px 12px" }}>
                    <button style={{ background: "#3b82f6", color: "white", border: "none", padding: "6px 14px", borderRadius: "30px", cursor: "pointer", fontSize: "12px", marginRight: "6px" }} onClick={() => alert(`Edit ${p.name}`)}>Edit</button>
                    <button style={{ background: "#ef4444", color: "white", border: "none", padding: "6px 14px", borderRadius: "30px", cursor: "pointer", fontSize: "12px" }} onClick={() => alert(`Delete ${p.name}`)}>Delete</button>
                  </td>
                 </tr>
              ))}
            </tbody>
           </table>
        </div>
      </div>
    </div>
  );
}
