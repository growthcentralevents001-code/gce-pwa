"use client";

import { useState } from "react";
import { LayoutDashboard, Users, Building2, Calendar, Tag, CreditCard, Settings, LogOut, Menu, X, Search, Filter, Download, Eye, UserPlus, Mail, Phone, CheckCircle, XCircle } from "lucide-react";

export default function AdminMembers() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [membershipFilter, setMembershipFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [members, setMembers] = useState([
    { id: 1, name: "Rohan Mehta", email: "rohan@gmail.com", phone: "+91 98765 43210", type: "Gold", status: "Active", joined: "23 May 2025", city: "Mumbai", interests: ["Fintech", "Networking"] },
    { id: 2, name: "Neha Kapoor", email: "neha@gmail.com", phone: "+91 98765 43211", type: "Silver", status: "Active", joined: "22 May 2025", city: "Delhi", interests: ["Startups", "Workshops"] },
    { id: 3, name: "Vikram Singh", email: "vikram@gmail.com", phone: "+91 98765 43212", type: "Gold", status: "Active", joined: "21 May 2025", city: "Bangalore", interests: ["SaaS", "D2C"] },
    { id: 4, name: "Anjali Desai", email: "anjali@gmail.com", phone: "+91 98765 43213", type: "Silver", status: "Inactive", joined: "20 May 2025", city: "Mumbai", interests: ["Comedy", "Wellness"] },
    { id: 5, name: "Rahul Sharma", email: "rahul@gmail.com", phone: "+91 98765 43214", type: "Bronze", status: "Active", joined: "19 May 2025", city: "Pune", interests: ["Food", "Wine"] },
  ]);

  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    phone: "",
    type: "Gold",
    city: "Mumbai",
  });

  const filteredMembers = members.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.phone.includes(searchQuery);
    const matchesFilter = membershipFilter === "all" || m.type.toLowerCase() === membershipFilter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const handleAddMember = () => {
    if (!newMember.name || !newMember.email) {
      alert("Please fill name and email");
      return;
    }
    const newId = members.length + 1;
    setMembers([...members, {
      id: newId,
      name: newMember.name,
      email: newMember.email,
      phone: newMember.phone || "+91 XXXXX XXXXX",
      type: newMember.type,
      status: "Active",
      joined: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      city: newMember.city,
      interests: ["New Member"],
    }]);
    setShowAddModal(false);
    setNewMember({ name: "", email: "", phone: "", type: "Gold", city: "Mumbai" });
    alert("Member added successfully!");
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
              marginBottom: "4px", borderRadius: "12px", background: item.id === "members" ? "#f97316" : "transparent",
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a", marginBottom: "4px" }}>Members Management</h1>
              <p style={{ color: "#64748b" }}>Manage all platform members, their memberships, and activity</p>
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              style={{ display: "flex", alignItems: "center", gap: "8px", background: "#f97316", color: "white", border: "none", padding: "10px 20px", borderRadius: "40px", cursor: "pointer" }}
            >
              <UserPlus size={18} /> Add New Member
            </button>
          </div>

          {/* Search & Filters */}
          <div style={{ background: "white", borderRadius: "20px", padding: "20px", border: "1px solid #eef2ff", marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
              <div style={{ display: "flex", gap: "12px", flex: 1, maxWidth: "400px" }}>
                <div style={{ display: "flex", alignItems: "center", background: "#f1f5f9", borderRadius: "40px", padding: "10px 16px", flex: 1 }}>
                  <Search size={18} style={{ color: "#94a3b8", marginRight: "8px" }} />
                  <input 
                    type="text" 
                    placeholder="Search by name, email or phone..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ background: "transparent", border: "none", outline: "none", flex: 1 }}
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} style={{ background: "none", border: "none", cursor: "pointer" }}>✕</button>
                  )}
                </div>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <select 
                  value={membershipFilter}
                  onChange={(e) => setMembershipFilter(e.target.value)}
                  style={{ padding: "8px 16px", border: "1px solid #e2e8f0", borderRadius: "40px", background: "white", cursor: "pointer" }}
                >
                  <option value="all">All Types</option>
                  <option value="gold">Gold</option>
                  <option value="silver">Silver</option>
                  <option value="bronze">Bronze</option>
                  <option value="business">Business</option>
                </select>
                <button style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", border: "1px solid #e2e8f0", borderRadius: "40px", background: "white", cursor: "pointer" }}>
                  <Filter size={16} /> Filter
                </button>
                <button style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", border: "1px solid #e2e8f0", borderRadius: "40px", background: "white", cursor: "pointer" }}>
                  <Download size={16} /> Export CSV
                </button>
              </div>
            </div>
          </div>

          {/* Members Table */}
          <div style={{ background: "white", borderRadius: "20px", border: "1px solid #eef2ff", overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "1px solid #eef2ff" }}>
                    <th style={{ padding: "16px", textAlign: "left", color: "#64748b", fontWeight: "600" }}>Member</th>
                    <th style={{ padding: "16px", textAlign: "left", color: "#64748b", fontWeight: "600" }}>Contact</th>
                    <th style={{ padding: "16px", textAlign: "left", color: "#64748b", fontWeight: "600" }}>Type</th>
                    <th style={{ padding: "16px", textAlign: "left", color: "#64748b", fontWeight: "600" }}>Status</th>
                    <th style={{ padding: "16px", textAlign: "left", color: "#64748b", fontWeight: "600" }}>City</th>
                    <th style={{ padding: "16px", textAlign: "left", color: "#64748b", fontWeight: "600" }}>Joined</th>
                    <th style={{ padding: "16px", textAlign: "center", color: "#64748b", fontWeight: "600" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((member) => (
                    <tr key={member.id} style={{ borderBottom: "1px solid #eef2ff" }}>
                      <td style={{ padding: "16px" }}>
                        <div style={{ fontWeight: "600", color: "#0f172a" }}>{member.name}</div>
                        <div style={{ fontSize: "12px", color: "#94a3b8", display: "flex", gap: "8px", marginTop: "4px" }}>
                          {member.interests.slice(0, 2).map((i, idx) => (
                            <span key={idx} style={{ background: "#f1f5f9", padding: "2px 8px", borderRadius: "12px" }}>{i}</span>
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: "16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "13px" }}><Mail size={12} /> {member.email}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", color: "#64748b", marginTop: "4px" }}><Phone size={12} /> {member.phone}</div>
                      </td>
                      <td style={{ padding: "16px" }}>
                        <span style={{ 
                          background: member.type === "Gold" ? "#fef3c7" : member.type === "Silver" ? "#e0e7ff" : member.type === "Business" ? "#ede9fe" : "#f1f5f9",
                          color: member.type === "Gold" ? "#92400e" : member.type === "Silver" ? "#3730a3" : member.type === "Business" ? "#6b21a5" : "#475569",
                          padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "500"
                        }}>
                          {member.type}
                        </span>
                      </td>
                      <td style={{ padding: "16px" }}>
                        <span style={{ 
                          background: member.status === "Active" ? "#dcfce7" : "#fee2e2",
                          color: member.status === "Active" ? "#166534" : "#991b1b",
                          padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "500"
                        }}>
                          {member.status === "Active" ? <CheckCircle size={12} style={{ display: "inline", marginRight: "4px" }} /> : <XCircle size={12} style={{ display: "inline", marginRight: "4px" }} />}
                          {member.status}
                        </span>
                      </td>
                      <td style={{ padding: "16px", color: "#475569" }}>{member.city}</td>
                      <td style={{ padding: "16px", color: "#475569" }}>{member.joined}</td>
                      <td style={{ padding: "16px", textAlign: "center" }}>
                        <Eye size={18} style={{ color: "#f97316", cursor: "pointer" }} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredMembers.length === 0 && (
                <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>No members found</div>
              )}
            </div>
          </div>

          {/* Pagination */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "24px" }}>
            <div style={{ color: "#64748b", fontSize: "14px" }}>Showing {filteredMembers.length} of {members.length} members</div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button style={{ padding: "8px 12px", border: "1px solid #e2e8f0", borderRadius: "8px", background: "white", cursor: "pointer" }}>Previous</button>
              <button style={{ padding: "8px 12px", background: "#f97316", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>1</button>
              <button style={{ padding: "8px 12px", border: "1px solid #e2e8f0", borderRadius: "8px", background: "white", cursor: "pointer" }}>2</button>
              <button style={{ padding: "8px 12px", border: "1px solid #e2e8f0", borderRadius: "8px", background: "white", cursor: "pointer" }}>Next</button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "white",
            borderRadius: "24px",
            padding: "32px",
            maxWidth: "500px",
            width: "90%",
            maxHeight: "90vh",
            overflowY: "auto"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "24px", fontWeight: "700" }}>Add New Member</h2>
              <button onClick={() => setShowAddModal(false)} style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer" }}>×</button>
            </div>
            
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Full Name *</label>
              <input 
                type="text" 
                value={newMember.name}
                onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                placeholder="Enter full name"
                style={{ width: "100%", padding: "12px", border: "1px solid #e2e8f0", borderRadius: "12px" }}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Email *</label>
              <input 
                type="email" 
                value={newMember.email}
                onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                placeholder="Enter email address"
                style={{ width: "100%", padding: "12px", border: "1px solid #e2e8f0", borderRadius: "12px" }}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Phone</label>
              <input 
                type="tel" 
                value={newMember.phone}
                onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
                placeholder="Enter phone number"
                style={{ width: "100%", padding: "12px", border: "1px solid #e2e8f0", borderRadius: "12px" }}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Membership Type</label>
              <select 
                value={newMember.type}
                onChange={(e) => setNewMember({...newMember, type: e.target.value})}
                style={{ width: "100%", padding: "12px", border: "1px solid #e2e8f0", borderRadius: "12px" }}
              >
                <option value="Gold">Gold</option>
                <option value="Silver">Silver</option>
                <option value="Bronze">Bronze</option>
                <option value="Business">Business</option>
              </select>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>City</label>
              <select 
                value={newMember.city}
                onChange={(e) => setNewMember({...newMember, city: e.target.value})}
                style={{ width: "100%", padding: "12px", border: "1px solid #e2e8f0", borderRadius: "12px" }}
              >
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Pune">Pune</option>
                <option value="Ahmedabad">Ahmedabad</option>
              </select>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button 
                onClick={handleAddMember}
                style={{ flex: 1, background: "#f97316", color: "white", border: "none", padding: "12px", borderRadius: "40px", cursor: "pointer", fontWeight: "500" }}
              >
                Add Member
              </button>
              <button 
                onClick={() => setShowAddModal(false)}
                style={{ flex: 1, background: "#f1f5f9", color: "#64748b", border: "none", padding: "12px", borderRadius: "40px", cursor: "pointer", fontWeight: "500" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
