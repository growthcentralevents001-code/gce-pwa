"use client";

import { useState } from "react";
import { 
  LayoutDashboard, Users, Building2, Calendar, Tag, CreditCard, 
  Settings, LogOut, Menu, X, Search, Filter, Download, Eye, 
  UserPlus, Mail, Phone, CheckCircle, XCircle, Star, MapPin 
} from "lucide-react";

export default function AdminPartners() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);

  const [partners, setPartners] = useState([
    { id: 1, name: "The Leela Mumbai", email: "events@theleela.com", phone: "+91 22 1234 5678", type: "Elite", status: "Active", city: "Mumbai", venueType: "5-Star Hotel", totalEvents: 45, totalRevenue: "₹12,50,000", joined: "15 Jan 2025" },
    { id: 2, name: "JW Marriott Pune", email: "sales@jwmarriott.com", phone: "+91 20 9876 5432", type: "Pro", status: "Active", city: "Pune", venueType: "5-Star Hotel", totalEvents: 32, totalRevenue: "₹8,20,000", joined: "10 Feb 2025" },
    { id: 3, name: "Social Offline", email: "partners@social.com", phone: "+91 80 4567 8901", type: "Basic", status: "Active", city: "Bangalore", venueType: "Cafe/Restaurant", totalEvents: 28, totalRevenue: "₹4,50,000", joined: "05 Mar 2025" },
    { id: 4, name: "Taj Lands End", email: "events@taj.com", phone: "+91 22 9876 5432", type: "Elite", status: "Inactive", city: "Mumbai", venueType: "5-Star Hotel", totalEvents: 18, totalRevenue: "₹6,20,000", joined: "20 Dec 2024" },
    { id: 5, name: "The Rooftop Co.", email: "hello@rooftop.com", phone: "+91 99 8888 7777", type: "Basic", status: "Active", city: "Delhi", venueType: "Rooftop Venue", totalEvents: 12, totalRevenue: "₹2,30,000", joined: "01 Apr 2025" },
    { id: 6, name: "St. Regis Goa", email: "bookings@stregis.com", phone: "+91 832 1234 567", type: "Pro", status: "Pending", city: "Goa", venueType: "Resort", totalEvents: 5, totalRevenue: "₹1,80,000", joined: "10 May 2025" },
  ]);

  const [newPartner, setNewPartner] = useState({
    name: "", email: "", phone: "", type: "Basic", city: "Mumbai", venueType: "Restaurant"
  });

  const filteredPartners = partners.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.phone.includes(searchQuery);
    const matchesType = typeFilter === "all" || p.type.toLowerCase() === typeFilter.toLowerCase();
    const matchesStatus = statusFilter === "all" || p.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleAddPartner = () => {
    if (!newPartner.name || !newPartner.email) {
      alert("Please fill name and email");
      return;
    }
    const newId = partners.length + 1;
    setPartners([...partners, {
      id: newId,
      name: newPartner.name,
      email: newPartner.email,
      phone: newPartner.phone || "+91 XXXXX XXXXX",
      type: newPartner.type,
      status: "Pending",
      city: newPartner.city,
      venueType: newPartner.venueType,
      totalEvents: 0,
      totalRevenue: "₹0",
      joined: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    }]);
    setShowAddModal(false);
    setNewPartner({ name: "", email: "", phone: "", type: "Basic", city: "Mumbai", venueType: "Restaurant" });
    alert("Partner added successfully! Waiting for approval.");
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
              marginBottom: "4px", borderRadius: "12px", background: item.id === "partners" ? "#f97316" : "transparent",
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
              <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a", marginBottom: "4px" }}>Partners Management</h1>
              <p style={{ color: "#64748b" }}>Manage venue partners, approve applications, track performance</p>
            </div>
            <button onClick={() => setShowAddModal(true)} style={{ display: "flex", alignItems: "center", gap: "8px", background: "#f97316", color: "white", border: "none", padding: "10px 20px", borderRadius: "40px", cursor: "pointer" }}>
              <UserPlus size={18} /> Add New Partner
            </button>
          </div>

          {/* Stats Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "24px" }}>
            <div style={{ background: "white", borderRadius: "16px", padding: "16px", border: "1px solid #eef2ff" }}>
              <div style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a" }}>{partners.length}</div>
              <div style={{ color: "#64748b", fontSize: "14px" }}>Total Partners</div>
            </div>
            <div style={{ background: "white", borderRadius: "16px", padding: "16px", border: "1px solid #eef2ff" }}>
              <div style={{ fontSize: "24px", fontWeight: "800", color: "#22c55e" }}>{partners.filter(p => p.status === "Active").length}</div>
              <div style={{ color: "#64748b", fontSize: "14px" }}>Active</div>
            </div>
            <div style={{ background: "white", borderRadius: "16px", padding: "16px", border: "1px solid #eef2ff" }}>
              <div style={{ fontSize: "24px", fontWeight: "800", color: "#f97316" }}>{partners.filter(p => p.type === "Elite").length}</div>
              <div style={{ color: "#64748b", fontSize: "14px" }}>Elite Partners</div>
            </div>
            <div style={{ background: "white", borderRadius: "16px", padding: "16px", border: "1px solid #eef2ff" }}>
              <div style={{ fontSize: "24px", fontWeight: "800", color: "#8b5cf6" }}>{partners.reduce((sum, p) => sum + p.totalEvents, 0)}</div>
              <div style={{ color: "#64748b", fontSize: "14px" }}>Total Events</div>
            </div>
          </div>

          {/* Search & Filters */}
          <div style={{ background: "white", borderRadius: "20px", padding: "20px", border: "1px solid #eef2ff", marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
              <div style={{ display: "flex", gap: "12px", flex: 1, maxWidth: "400px" }}>
                <div style={{ display: "flex", alignItems: "center", background: "#f1f5f9", borderRadius: "40px", padding: "10px 16px", flex: 1 }}>
                  <Search size={18} style={{ color: "#94a3b8", marginRight: "8px" }} />
                  <input type="text" placeholder="Search by name, email or phone..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ background: "transparent", border: "none", outline: "none", flex: 1 }} />
                </div>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} style={{ padding: "8px 16px", border: "1px solid #e2e8f0", borderRadius: "40px", background: "white", cursor: "pointer" }}>
                  <option value="all">All Types</option>
                  <option value="basic">Basic</option>
                  <option value="pro">Pro</option>
                  <option value="elite">Elite</option>
                </select>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: "8px 16px", border: "1px solid #e2e8f0", borderRadius: "40px", background: "white", cursor: "pointer" }}>
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="inactive">Inactive</option>
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

          {/* Partners Table */}
          <div style={{ background: "white", borderRadius: "20px", border: "1px solid #eef2ff", overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "1px solid #eef2ff" }}>
                    <th style={{ padding: "16px", textAlign: "left" }}>Partner</th>
                    <th style={{ padding: "16px", textAlign: "left" }}>Contact</th>
                    <th style={{ padding: "16px", textAlign: "left" }}>Type</th>
                    <th style={{ padding: "16px", textAlign: "left" }}>Status</th>
                    <th style={{ padding: "16px", textAlign: "left" }}>City/Venue</th>
                    <th style={{ padding: "16px", textAlign: "left" }}>Events/Revenue</th>
                    <th style={{ padding: "16px", textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPartners.map((partner) => (
                    <tr key={partner.id} style={{ borderBottom: "1px solid #eef2ff" }}>
                      <td style={{ padding: "16px" }}>
                        <div style={{ fontWeight: "600", color: "#0f172a" }}>{partner.name}</div>
                        <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>Joined: {partner.joined}</div>
                      </td>
                      <td style={{ padding: "16px" }}>
                        <div style={{ fontSize: "13px" }}><Mail size={12} style={{ display: "inline", marginRight: "4px" }} /> {partner.email}</div>
                        <div style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}><Phone size={12} style={{ display: "inline", marginRight: "4px" }} /> {partner.phone}</div>
                      </td>
                      <td style={{ padding: "16px" }}>
                        <span style={{ 
                          background: partner.type === "Elite" ? "#fef3c7" : partner.type === "Pro" ? "#e0e7ff" : "#f1f5f9",
                          color: partner.type === "Elite" ? "#92400e" : partner.type === "Pro" ? "#3730a3" : "#475569",
                          padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "500"
                        }}>
                          {partner.type} {partner.type === "Elite" && <Star size={10} style={{ display: "inline", marginLeft: "4px" }} />}
                        </span>
                      </td>
                      <td style={{ padding: "16px" }}>
                        <span style={{ 
                          background: partner.status === "Active" ? "#dcfce7" : partner.status === "Pending" ? "#fef3c7" : "#fee2e2",
                          color: partner.status === "Active" ? "#166534" : partner.status === "Pending" ? "#92400e" : "#991b1b",
                          padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "500"
                        }}>
                          {partner.status === "Active" ? <CheckCircle size={12} style={{ display: "inline", marginRight: "4px" }} /> : null}
                          {partner.status}
                        </span>
                      </td>
                      <td style={{ padding: "16px" }}>
                        <div><MapPin size={12} style={{ display: "inline", marginRight: "4px", color: "#f97316" }} /> {partner.city}</div>
                        <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>{partner.venueType}</div>
                      </td>
                      <td style={{ padding: "16px" }}>
                        <div style={{ fontWeight: "600" }}>{partner.totalEvents} events</div>
                        <div style={{ fontSize: "13px", color: "#f97316" }}>{partner.totalRevenue}</div>
                      </td>
                      <td style={{ padding: "16px", textAlign: "center" }}>
                        <Eye size={18} style={{ color: "#f97316", cursor: "pointer" }} />
                      </td>
                    </tr>
                  ))}
                </tbody>
               </table>
              {filteredPartners.length === 0 && (
                <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>No partners found</div>
              )}
            </div>
          </div>

          {/* Pagination */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "24px" }}>
            <div style={{ color: "#64748b", fontSize: "14px" }}>Showing {filteredPartners.length} of {partners.length} partners</div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button style={{ padding: "8px 12px", border: "1px solid #e2e8f0", borderRadius: "8px", background: "white", cursor: "pointer" }}>Previous</button>
              <button style={{ padding: "8px 12px", background: "#f97316", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>1</button>
              <button style={{ padding: "8px 12px", border: "1px solid #e2e8f0", borderRadius: "8px", background: "white", cursor: "pointer" }}>2</button>
              <button style={{ padding: "8px 12px", border: "1px solid #e2e8f0", borderRadius: "8px", background: "white", cursor: "pointer" }}>Next</button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Partner Modal */}
      {showAddModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
        }}>
          <div style={{ background: "white", borderRadius: "24px", padding: "32px", maxWidth: "500px", width: "90%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "24px", fontWeight: "700" }}>Add New Partner</h2>
              <button onClick={() => setShowAddModal(false)} style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer" }}>×</button>
            </div>
            
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Partner Name *</label>
              <input type="text" value={newPartner.name} onChange={(e) => setNewPartner({...newPartner, name: e.target.value})} placeholder="e.g., The Leela Mumbai" style={{ width: "100%", padding: "12px", border: "1px solid #e2e8f0", borderRadius: "12px" }} />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Email *</label>
              <input type="email" value={newPartner.email} onChange={(e) => setNewPartner({...newPartner, email: e.target.value})} placeholder="events@example.com" style={{ width: "100%", padding: "12px", border: "1px solid #e2e8f0", borderRadius: "12px" }} />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Phone</label>
              <input type="tel" value={newPartner.phone} onChange={(e) => setNewPartner({...newPartner, phone: e.target.value})} placeholder="+91 XXXXX XXXXX" style={{ width: "100%", padding: "12px", border: "1px solid #e2e8f0", borderRadius: "12px" }} />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Partner Type</label>
              <select value={newPartner.type} onChange={(e) => setNewPartner({...newPartner, type: e.target.value})} style={{ width: "100%", padding: "12px", border: "1px solid #e2e8f0", borderRadius: "12px" }}>
                <option value="Basic">Basic</option>
                <option value="Pro">Pro</option>
                <option value="Elite">Elite</option>
              </select>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>City</label>
              <select value={newPartner.city} onChange={(e) => setNewPartner({...newPartner, city: e.target.value})} style={{ width: "100%", padding: "12px", border: "1px solid #e2e8f0", borderRadius: "12px" }}>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Pune">Pune</option>
                <option value="Goa">Goa</option>
              </select>
            </div>
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Venue Type</label>
              <select value={newPartner.venueType} onChange={(e) => setNewPartner({...newPartner, venueType: e.target.value})} style={{ width: "100%", padding: "12px", border: "1px solid #e2e8f0", borderRadius: "12px" }}>
                <option value="Restaurant">Restaurant</option>
                <option value="5-Star Hotel">5-Star Hotel</option>
                <option value="Rooftop Venue">Rooftop Venue</option>
                <option value="Resort">Resort</option>
                <option value="Banquet Hall">Banquet Hall</option>
              </select>
            </div>
            <button onClick={handleAddPartner} style={{ width: "100%", background: "#f97316", color: "white", border: "none", padding: "12px", borderRadius: "40px", cursor: "pointer", fontWeight: "500" }}>Add Partner</button>
          </div>
        </div>
      )}
    </div>
  );
}
