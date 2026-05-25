"use client";

import { useState } from "react";
import { 
  Calendar, Users, CreditCard, TrendingUp, Plus, 
  Eye, Edit, Trash2, Clock, MapPin, DollarSign,
  CheckCircle, XCircle, AlertCircle, BarChart3
} from "lucide-react";

export default function VenueDashboard() {
  const [activeTab, setActiveTab] = useState("events");
  
  // Mock data for venue
  const stats = [
    { label: "Total Events", value: "12", icon: Calendar, color: "#f97316" },
    { label: "Total Bookings", value: "245", icon: Users, color: "#22c55e" },
    { label: "Total Revenue", value: "₹8,45,000", icon: CreditCard, color: "#3b82f6" },
    { label: "Pending Payout", value: "₹1,20,000", icon: TrendingUp, color: "#8b5cf6" },
  ];

  const [events, setEvents] = useState([
    { id: 1, name: "Startup Founders Mixer", date: "24 May 2025", time: "6:30 PM", venue: "The Leela, Mumbai", price: "₹1,500", bookings: 45, capacity: 100, status: "Live" },
    { id: 2, name: "Sunday Brunch Buffet", date: "28 May 2025", time: "11:00 AM", venue: "JW Marriott, Pune", price: "₹2,500", bookings: 32, capacity: 80, status: "Live" },
    { id: 3, name: "Wine Tasting Evening", date: "1 Jun 2025", time: "7:00 PM", venue: "SOHO House, Mumbai", price: "₹3,000", bookings: 18, capacity: 50, status: "Draft" },
  ]);

  const bookings = [
    { id: 101, event: "Startup Founders Mixer", customer: "Rohan Mehta", tickets: 2, amount: "₹3,000", status: "Confirmed", date: "20 May 2025" },
    { id: 102, event: "Startup Founders Mixer", customer: "Neha Kapoor", tickets: 1, amount: "₹1,500", status: "Confirmed", date: "21 May 2025" },
    { id: 103, event: "Sunday Brunch Buffet", customer: "Vikram Singh", tickets: 4, amount: "₹10,000", status: "Pending", date: "22 May 2025" },
  ];

  const payouts = [
    { id: 201, event: "Startup Founders Mixer", amount: "₹45,000", status: "Completed", date: "15 May 2025" },
    { id: 202, event: "Sunday Brunch Buffet", amount: "₹32,000", status: "Processing", date: "22 May 2025" },
  ];

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "Live": return { bg: "#dcfce7", color: "#166534", icon: <CheckCircle size={12} /> };
      case "Draft": return { bg: "#f1f5f9", color: "#475569", icon: null };
      case "Pending": return { bg: "#fef3c7", color: "#92400e", icon: <AlertCircle size={12} /> };
      case "Completed": return { bg: "#dcfce7", color: "#166534", icon: <CheckCircle size={12} /> };
      case "Processing": return { bg: "#e0e7ff", color: "#3730a3", icon: <AlertCircle size={12} /> };
      default: return { bg: "#f1f5f9", color: "#475569", icon: null };
    }
  };

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "24px", background: "#f8fafc", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a" }}>Venue Dashboard</h1>
        <p style={{ color: "#64748b" }}>Manage your events, track bookings, and view payouts</p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "32px" }}>
        {stats.map((stat, i) => (
          <div key={i} style={{ background: "white", borderRadius: "20px", padding: "20px", border: "1px solid #eef2ff" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a" }}>{stat.value}</div>
                <div style={{ color: "#64748b", fontSize: "14px", marginTop: "4px" }}>{stat.label}</div>
              </div>
              <stat.icon size={28} style={{ color: stat.color, opacity: 0.7 }} />
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "12px", borderBottom: "1px solid #e2e8f0", marginBottom: "24px" }}>
        {["events", "bookings", "payouts", "analytics"].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: "10px 20px",
            border: "none",
            background: "none",
            borderBottom: activeTab === tab ? "2px solid #f97316" : "none",
            color: activeTab === tab ? "#f97316" : "#64748b",
            fontWeight: "500",
            cursor: "pointer"
          }}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
        <button style={{ marginLeft: "auto", background: "#f97316", color: "white", border: "none", padding: "8px 20px", borderRadius: "40px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
          <Plus size={16} /> Create Event
        </button>
      </div>

      {/* Events Tab */}
      {activeTab === "events" && (
        <div style={{ background: "white", borderRadius: "20px", overflow: "hidden", border: "1px solid #eef2ff" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1px solid #eef2ff" }}>
                <th style={{ padding: "16px", textAlign: "left" }}>Event Name</th>
                <th style={{ padding: "16px", textAlign: "left" }}>Date & Time</th>
                <th style={{ padding: "16px", textAlign: "left" }}>Price</th>
                <th style={{ padding: "16px", textAlign: "left" }}>Bookings</th>
                <th style={{ padding: "16px", textAlign: "left" }}>Status</th>
                <th style={{ padding: "16px", textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map(event => {
                const statusStyle = getStatusBadge(event.status);
                return (
                  <tr key={event.id} style={{ borderBottom: "1px solid #eef2ff" }}>
                    <td style={{ padding: "16px" }}><div style={{ fontWeight: "600" }}>{event.name}</div></td>
                    <td style={{ padding: "16px" }}><div><Calendar size={12} style={{ display: "inline", marginRight: "4px" }} /> {event.date} at {event.time}</div></td>
                    <td style={{ padding: "16px" }}>{event.price}</td>
                    <td style={{ padding: "16px" }}>{event.bookings} / {event.capacity}</td>
                    <td style={{ padding: "16px" }}><span style={{ background: statusStyle.bg, color: statusStyle.color, padding: "4px 12px", borderRadius: "20px", fontSize: "12px" }}>{statusStyle.icon} {event.status}</span></td>
                    <td style={{ padding: "16px", textAlign: "center" }}>
                      <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                        <button style={{ background: "none", border: "none", cursor: "pointer" }}><Eye size={18} style={{ color: "#f97316" }} /></button>
                        <button style={{ background: "none", border: "none", cursor: "pointer" }}><Edit size={18} style={{ color: "#3b82f6" }} /></button>
                        <button style={{ background: "none", border: "none", cursor: "pointer" }}><Trash2 size={18} style={{ color: "#ef4444" }} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Bookings Tab */}
      {activeTab === "bookings" && (
        <div style={{ background: "white", borderRadius: "20px", overflow: "hidden", border: "1px solid #eef2ff" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1px solid #eef2ff" }}>
                <th style={{ padding: "16px", textAlign: "left" }}>Event</th>
                <th style={{ padding: "16px", textAlign: "left" }}>Customer</th>
                <th style={{ padding: "16px", textAlign: "left" }}>Tickets</th>
                <th style={{ padding: "16px", textAlign: "left" }}>Amount</th>
                <th style={{ padding: "16px", textAlign: "left" }}>Status</th>
                <th style={{ padding: "16px", textAlign: "left" }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => {
                const statusStyle = getStatusBadge(booking.status);
                return (
                  <tr key={booking.id} style={{ borderBottom: "1px solid #eef2ff" }}>
                    <td style={{ padding: "16px" }}>{booking.event}</td>
                    <td style={{ padding: "16px" }}>{booking.customer}</td>
                    <td style={{ padding: "16px" }}>{booking.tickets}</td>
                    <td style={{ padding: "16px" }}>{booking.amount}</td>
                    <td style={{ padding: "16px" }}><span style={{ background: statusStyle.bg, color: statusStyle.color, padding: "4px 12px", borderRadius: "20px", fontSize: "12px" }}>{statusStyle.icon} {booking.status}</span></td>
                    <td style={{ padding: "16px" }}>{booking.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Payouts Tab */}
      {activeTab === "payouts" && (
        <div style={{ background: "white", borderRadius: "20px", overflow: "hidden", border: "1px solid #eef2ff" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1px solid #eef2ff" }}>
                <th style={{ padding: "16px", textAlign: "left" }}>Event</th>
                <th style={{ padding: "16px", textAlign: "left" }}>Amount</th>
                <th style={{ padding: "16px", textAlign: "left" }}>Status</th>
                <th style={{ padding: "16px", textAlign: "left" }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map(payout => {
                const statusStyle = getStatusBadge(payout.status);
                return (
                  <tr key={payout.id} style={{ borderBottom: "1px solid #eef2ff" }}>
                    <td style={{ padding: "16px" }}>{payout.event}</td>
                    <td style={{ padding: "16px" }}>{payout.amount}</td>
                    <td style={{ padding: "16px" }}><span style={{ background: statusStyle.bg, color: statusStyle.color, padding: "4px 12px", borderRadius: "20px", fontSize: "12px" }}>{statusStyle.icon} {payout.status}</span></td>
                    <td style={{ padding: "16px" }}>{payout.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === "analytics" && (
        <div style={{ background: "white", borderRadius: "20px", padding: "24px", border: "1px solid #eef2ff", textAlign: "center" }}>
          <BarChart3 size={48} style={{ color: "#94a3b8", marginBottom: "16px" }} />
          <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>Analytics Dashboard</h3>
          <p style={{ color: "#64748b" }}>Revenue trends, booking patterns, and performance metrics will appear here soon.</p>
        </div>
      )}
    </div>
  );
}
