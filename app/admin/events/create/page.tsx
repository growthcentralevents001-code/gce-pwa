"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, Users, Building2, Calendar, Tag, CreditCard, 
  Settings, LogOut, Menu, X, ArrowLeft
} from "lucide-react";

export default function CreateEvent() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    vertical: "Connect",
    date: "",
    time: "",
    venue: "",
    price: "",
    capacity: "",
    description: "",
    organizer: "GCE Admin",
  });

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
    { id: "members", label: "Members", icon: Users, href: "/admin/members" },
    { id: "partners", label: "Partners", icon: Building2, href: "/admin/partners" },
    { id: "events", label: "Events", icon: Calendar, href: "/admin/events" },
    { id: "offers", label: "Offers", icon: Tag, href: "/admin/offers" },
    { id: "payments", label: "Payments", icon: CreditCard, href: "/admin/payments" },
    { id: "settings", label: "Settings", icon: Settings, href: "/admin/settings" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const existingEvents = JSON.parse(localStorage.getItem("gce_events") || "[]");
    
    const newEvent = {
      id: Date.now(),
      ...formData,
      attendees: 0,
      status: "Live",
      created: new Date().toLocaleDateString(),
    };
    
    existingEvents.push(newEvent);
    localStorage.setItem("gce_events", JSON.stringify(existingEvents));
    
    alert("Event created successfully!");
    router.push("/admin/events");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <button 
            onClick={() => router.back()}
            style={{ display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none", color: "#f97316", cursor: "pointer", marginBottom: "16px" }}
          >
            <ArrowLeft size={18} /> Back
          </button>
          
          <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a", marginBottom: "4px" }}>Create New Event</h1>
          <p style={{ color: "#64748b", marginBottom: "24px" }}>Add a new event to the platform</p>

          <form onSubmit={handleSubmit} style={{ background: "white", borderRadius: "20px", padding: "32px" }}>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Event Name *</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="e.g., Startup Founders Mixer" style={{ width: "100%", padding: "12px", border: "1px solid #e2e8f0", borderRadius: "12px" }} />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Vertical *</label>
              <select name="vertical" value={formData.vertical} onChange={handleChange} style={{ width: "100%", padding: "12px", border: "1px solid #e2e8f0", borderRadius: "12px" }}>
                <option value="Connect">Connect</option>
                <option value="Marketplace">Marketplace</option>
                <option value="Enterprise">Enterprise</option>
              </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Date *</label>
                <input type="date" name="date" required value={formData.date} onChange={handleChange} style={{ width: "100%", padding: "12px", border: "1px solid #e2e8f0", borderRadius: "12px" }} />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Time *</label>
                <input type="time" name="time" required value={formData.time} onChange={handleChange} style={{ width: "100%", padding: "12px", border: "1px solid #e2e8f0", borderRadius: "12px" }} />
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Venue *</label>
              <input type="text" name="venue" required value={formData.venue} onChange={handleChange} placeholder="e.g., The Leela, Mumbai" style={{ width: "100%", padding: "12px", border: "1px solid #e2e8f0", borderRadius: "12px" }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Price (₹) *</label>
                <input type="text" name="price" required value={formData.price} onChange={handleChange} placeholder="e.g., 1500" style={{ width: "100%", padding: "12px", border: "1px solid #e2e8f0", borderRadius: "12px" }} />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Capacity *</label>
                <input type="number" name="capacity" required value={formData.capacity} onChange={handleChange} placeholder="e.g., 200" style={{ width: "100%", padding: "12px", border: "1px solid #e2e8f0", borderRadius: "12px" }} />
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Description</label>
              <textarea name="description" rows={4} value={formData.description} onChange={handleChange} placeholder="Event description..." style={{ width: "100%", padding: "12px", border: "1px solid #e2e8f0", borderRadius: "12px" }} />
            </div>

            <div style={{ display: "flex", gap: "16px", marginTop: "24px" }}>
              <button type="submit" style={{ flex: 1, background: "#f97316", color: "white", border: "none", padding: "14px", borderRadius: "40px", cursor: "pointer", fontWeight: "500" }}>Create Event</button>
              <button type="button" onClick={() => router.back()} style={{ flex: 1, background: "#f1f5f9", color: "#64748b", border: "none", padding: "14px", borderRadius: "40px", cursor: "pointer", fontWeight: "500" }}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
