"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, Users, Building2, Calendar, Tag, CreditCard, 
  Settings, LogOut, Menu, X, Search, Download, Eye, Plus
} from "lucide-react";

interface Event {
  id: number;
  name: string;
  vertical: string;
  status: string;
  date: string;
  time: string;
  venue: string;
  price: string;
  attendees: number;
  capacity: number;
  organizer: string;
}

export default function AdminEvents() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [verticalFilter, setVerticalFilter] = useState("all");
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const [events, setEvents] = useState<Event[]>([
    { id: 1, name: "Startup Founders Mixer", vertical: "Connect", status: "Live", date: "24 May 2025", time: "6:30 PM", venue: "The Leela, Mumbai", price: "₹1,500", attendees: 124, capacity: 200, organizer: "GCE Admin" },
    { id: 2, name: "Sunday Brunch Buffet", vertical: "Marketplace", status: "Live", date: "28 May 2025", time: "11:00 AM", venue: "JW Marriott, Pune", price: "₹2,500", attendees: 45, capacity: 100, organizer: "JW Marriott" },
    { id: 3, name: "Fintech Leadership Summit", vertical: "Enterprise", status: "Live", date: "30 May 2025", time: "10:00 AM", venue: "Taj Lands End, Mumbai", price: "₹5,000", attendees: 180, capacity: 250, organizer: "Fintech Council" },
    { id: 4, name: "Wine Tasting Evening", vertical: "Marketplace", status: "Rejected", date: "01 Jun 2025", time: "7:00 PM", venue: "SOHO House, Mumbai", price: "₹3,000", attendees: 0, capacity: 50, organizer: "SOHO House" },
    { id: 5, name: "Yoga & Wellness Retreat", vertical: "Connect", status: "Draft", date: "05 Jun 2025", time: "8:00 AM", venue: "St. Regis, Goa", price: "₹4,000", attendees: 0, capacity: 80, organizer: "GCE Admin" },
    { id: 6, name: "AI & Future of Work", vertical: "Enterprise", status: "Pending", date: "10 Jun 2025", time: "9:30 AM", venue: "WeWork, BKC", price: "₹3,500", attendees: 95, capacity: 150, organizer: "Tech Corp" },
  ]);

  const filteredEvents = events.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          e.venue.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || e.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesVertical = verticalFilter === "all" || e.vertical.toLowerCase() === verticalFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesVertical;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Live": return { bg: "#dcfce7", color: "#166534" };
      case "Pending": return { bg: "#fef3c7", color: "#92400e" };
      case "Rejected": return { bg: "#fee2e2", color: "#991b1b" };
      default: return { bg: "#f1f5f9", color: "#475569" };
    }
  };

  const getVerticalColor = (vertical: string) => {
    switch(vertical) {
      case "Connect": return { bg: "#fef3c7", color: "#92400e" };
      case "Marketplace": return { bg: "#e0e7ff", color: "#3730a3" };
      case "Enterprise": return { bg: "#dcfce7", color: "#166534" };
      default: return { bg: "#f1f5f9", color: "#475569" };
    }
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
              marginBottom: "4px", borderRadius: "12px", background: item.id === "events" ? "#f97316" : "transparent",
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
              <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a" }}>Events Management</h1>
              <p style={{ color: "#64748b" }}>Manage all events across Connect, Marketplace, and Enterprise</p>
            </div>
            <button 
              onClick={() => router.push("/admin/events/create")}
              style={{ display: "flex", alignItems: "center", gap: "8px", background: "#f97316", color: "white", border: "none", padding: "10px 20px", borderRadius: "40px", cursor: "pointer" }}
            >
              <Plus size={18} /> Create Event
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
            <div style={{ background: "white", borderRadius: "16px", padding: "16px" }}><div style={{ fontSize: "28px", fontWeight: "800" }}>{events.length}</div><div style={{ color: "#64748b" }}>Total Events</div></div>
            <div style={{ background: "white", borderRadius: "16px", padding: "16px" }}><div style={{ fontSize: "28px", fontWeight: "800" }}>{events.filter(e => e.status === "Live").length}</div><div style={{ color: "#64748b" }}>Live Events</div></div>
            <div style={{ background: "white", borderRadius: "16px", padding: "16px" }}><div style={{ fontSize: "28px", fontWeight: "800" }}>{events.filter(e => e.status === "Pending").length}</div><div style={{ color: "#64748b" }}>Pending</div></div>
            <div style={{ background: "white", borderRadius: "16px", padding: "16px" }}><div style={{ fontSize: "28px", fontWeight: "800" }}>{events.reduce((s, e) => s + e.attendees, 0)}</div><div style={{ color: "#64748b" }}>Attendees</div></div>
          </div>

          <div style={{ background: "white", borderRadius: "20px", padding: "20px", marginBottom: "24px" }}>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <div style={{ flex: 1, display: "flex", alignItems: "center", background: "#f1f5f9", borderRadius: "40px", padding: "10px 16px" }}>
                <Search size={18} style={{ marginRight: "8px" }} />
                <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ background: "transparent", border: "none", outline: "none", flex: 1 }} />
              </div>
              <select value={verticalFilter} onChange={(e) => setVerticalFilter(e.target.value)} style={{ padding: "8px 16px", borderRadius: "40px", border: "1px solid #e2e8f0" }}>
                <option value="all">All Verticals</option>
                <option value="connect">Connect</option>
                <option value="marketplace">Marketplace</option>
                <option value="enterprise">Enterprise</option>
              </select>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: "8px 16px", borderRadius: "40px", border: "1px solid #e2e8f0" }}>
                <option value="all">All Status</option>
                <option value="live">Live</option>
                <option value="pending">Pending</option>
              </select>
              <button style={{ padding: "8px 16px", borderRadius: "40px", border: "1px solid #e2e8f0", background: "white" }}><Download size={16} /> Export</button>
            </div>
          </div>

          <div style={{ background: "white", borderRadius: "20px", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "1px solid #eef2ff" }}>
                  <th style={{ padding: "16px", textAlign: "left" }}>Event Name</th>
                  <th style={{ padding: "16px", textAlign: "left" }}>Vertical</th>
                  <th style={{ padding: "16px", textAlign: "left" }}>Date</th>
                  <th style={{ padding: "16px", textAlign: "left" }}>Venue</th>
                  <th style={{ padding: "16px", textAlign: "left" }}>Price</th>
                  <th style={{ padding: "16px", textAlign: "left" }}>Status</th>
                  <th style={{ padding: "16px", textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event) => {
                  const statusStyle = getStatusColor(event.status);
                  const verticalStyle = getVerticalColor(event.vertical);
                  return (
                    <tr key={event.id} style={{ borderBottom: "1px solid #eef2ff" }}>
                      <td style={{ padding: "16px" }}><div style={{ fontWeight: "600" }}>{event.name}</div><div style={{ fontSize: "12px", color: "#94a3b8" }}>by {event.organizer}</div></td>
                      <td style={{ padding: "16px" }}><span style={{ background: verticalStyle.bg, color: verticalStyle.color, padding: "4px 12px", borderRadius: "20px", fontSize: "12px" }}>{event.vertical}</span></td>
                      <td style={{ padding: "16px" }}>{event.date}</td>
                      <td style={{ padding: "16px" }}>{event.venue}</td>
                      <td style={{ padding: "16px" }}>{event.price}</td>
                      <td style={{ padding: "16px" }}><span style={{ background: statusStyle.bg, color: statusStyle.color, padding: "4px 12px", borderRadius: "20px", fontSize: "12px" }}>{event.status}</span></td>
                      <td style={{ padding: "16px", textAlign: "center" }}>
                        <button onClick={() => { setSelectedEvent(event); setShowViewModal(true); }} style={{ background: "none", border: "none", cursor: "pointer" }}>
                          <Eye size={18} style={{ color: "#f97316" }} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showViewModal && selectedEvent && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "white", borderRadius: "24px", padding: "32px", maxWidth: "500px", width: "90%" }}>
            <h2 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "16px" }}>{selectedEvent.name}</h2>
            <p><strong>Date:</strong> {selectedEvent.date} at {selectedEvent.time}</p>
            <p><strong>Venue:</strong> {selectedEvent.venue}</p>
            <p><strong>Price:</strong> {selectedEvent.price}</p>
            <p><strong>Attendees:</strong> {selectedEvent.attendees}/{selectedEvent.capacity}</p>
            <p><strong>Organizer:</strong> {selectedEvent.organizer}</p>
            <p><strong>Status:</strong> {selectedEvent.status}</p>
            <button onClick={() => setShowViewModal(false)} style={{ marginTop: "20px", width: "100%", background: "#f97316", color: "white", border: "none", padding: "12px", borderRadius: "40px", cursor: "pointer" }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
