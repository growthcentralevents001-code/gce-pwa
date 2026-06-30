"use client";

import { useState, useEffect } from "react";
import { 
  LayoutDashboard, Users, Building2, Calendar, Tag, CreditCard, 
  Settings, LogOut, Menu, X, User, Bell, DollarSign, Percent, 
  CreditCard as Card, Mail, Shield, Database, Save, Lock, Globe
} from "lucide-react";

export default function AdminSettings() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [saved, setSaved] = useState(false);

  // Profile Settings
  const [profile, setProfile] = useState({
    name: "Super Admin",
    email: "admin@gce.com",
    phone: "+91 98765 43210",
    role: "Super Admin",
  });

  // Commission Settings
  const [commission, setCommission] = useState({
    connect: "20",
    marketplace: "18",
    enterprise: "15",
  });

  // Discount Settings
  const [discount, setDiscount] = useState({
    memberDiscount: "10",
    earlyBird: "15",
    bulkBooking: "20",
  });

  // Payment Settings
  const [payment, setPayment] = useState({
    razorpayKey: "rzp_test_xxxxxxxxxxxxx",
    razorpaySecret: "xxxxxxxxxxxxxxxxxxxx",
    currency: "INR",
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    whatsappAlerts: false,
    newEventAlert: true,
    payoutAlert: true,
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

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "commission", label: "Commission", icon: Percent },
    { id: "discount", label: "Discount", icon: DollarSign },
    { id: "payment", label: "Payment", icon: Card },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "backup", label: "Backup", icon: Database },
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

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
              marginBottom: "4px", borderRadius: "12px", background: item.id === "settings" ? "#f97316" : "transparent",
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
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          {/* Header */}
          <div style={{ marginBottom: "24px" }}>
            <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a", marginBottom: "4px" }}>Settings</h1>
            <p style={{ color: "#64748b" }}>Manage platform configuration and preferences</p>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px", borderBottom: "1px solid #e2e8f0", paddingBottom: "12px" }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px",
                  borderRadius: "40px", border: "none", cursor: "pointer",
                  background: activeTab === tab.id ? "#f97316" : "transparent",
                  color: activeTab === tab.id ? "white" : "#64748b",
                  fontWeight: activeTab === tab.id ? "500" : "normal"
                }}
              >
                <tab.icon size={18} /> {tab.label}
              </button>
            ))}
          </div>

          {/* Profile Settings */}
          {activeTab === "profile" && (
            <div style={{ background: "white", borderRadius: "20px", padding: "32px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "24px" }}>Profile Information</h2>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Full Name</label>
                <input type="text" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} style={{ width: "100%", padding: "12px", border: "1px solid #e2e8f0", borderRadius: "12px" }} />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Email Address</label>
                <input type="email" value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} style={{ width: "100%", padding: "12px", border: "1px solid #e2e8f0", borderRadius: "12px" }} />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Phone Number</label>
                <input type="tel" value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} style={{ width: "100%", padding: "12px", border: "1px solid #e2e8f0", borderRadius: "12px" }} />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Role</label>
                <input type="text" value={profile.role} disabled style={{ width: "100%", padding: "12px", border: "1px solid #e2e8f0", borderRadius: "12px", background: "#f1f5f9" }} />
              </div>
              <button onClick={handleSave} style={{ background: "#f97316", color: "white", border: "none", padding: "12px 24px", borderRadius: "40px", cursor: "pointer" }}>Save Changes</button>
            </div>
          )}

          {/* Commission Settings */}
          {activeTab === "commission" && (
            <div style={{ background: "white", borderRadius: "20px", padding: "32px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "24px" }}>Commission Rates (%)</h2>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>GCE Connect</label>
                <input type="number" value={commission.connect} onChange={(e) => setCommission({...commission, connect: e.target.value})} style={{ width: "100%", padding: "12px", border: "1px solid #e2e8f0", borderRadius: "12px" }} />
                <p style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>GCE gets this % from Connect events</p>
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>GCE Marketplace</label>
                <input type="number" value={commission.marketplace} onChange={(e) => setCommission({...commission, marketplace: e.target.value})} style={{ width: "100%", padding: "12px", border: "1px solid #e2e8f0", borderRadius: "12px" }} />
                <p style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>GCE gets this % from Marketplace events</p>
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>GCE Enterprise</label>
                <input type="number" value={commission.enterprise} onChange={(e) => setCommission({...commission, enterprise: e.target.value})} style={{ width: "100%", padding: "12px", border: "1px solid #e2e8f0", borderRadius: "12px" }} />
                <p style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>GCE gets this % from Enterprise events</p>
              </div>
              <button onClick={handleSave} style={{ background: "#f97316", color: "white", border: "none", padding: "12px 24px", borderRadius: "40px", cursor: "pointer" }}>Save Changes</button>
            </div>
          )}

          {/* Discount Settings */}
          {activeTab === "discount" && (
            <div style={{ background: "white", borderRadius: "20px", padding: "32px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "24px" }}>Discount Settings (%)</h2>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Member Discount (Marketplace)</label>
                <input type="number" value={discount.memberDiscount} onChange={(e) => setDiscount({...discount, memberDiscount: e.target.value})} style={{ width: "100%", padding: "12px", border: "1px solid #e2e8f0", borderRadius: "12px" }} />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Early Bird Discount</label>
                <input type="number" value={discount.earlyBird} onChange={(e) => setDiscount({...discount, earlyBird: e.target.value})} style={{ width: "100%", padding: "12px", border: "1px solid #e2e8f0", borderRadius: "12px" }} />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Bulk Booking Discount</label>
                <input type="number" value={discount.bulkBooking} onChange={(e) => setDiscount({...discount, bulkBooking: e.target.value})} style={{ width: "100%", padding: "12px", border: "1px solid #e2e8f0", borderRadius: "12px" }} />
              </div>
              <button onClick={handleSave} style={{ background: "#f97316", color: "white", border: "none", padding: "12px 24px", borderRadius: "40px", cursor: "pointer" }}>Save Changes</button>
            </div>
          )}

          {/* Payment Settings */}
          {activeTab === "payment" && (
            <div style={{ background: "white", borderRadius: "20px", padding: "32px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "24px" }}>Payment Gateway</h2>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Razorpay Key ID</label>
                <input type="text" value={payment.razorpayKey} onChange={(e) => setPayment({...payment, razorpayKey: e.target.value})} style={{ width: "100%", padding: "12px", border: "1px solid #e2e8f0", borderRadius: "12px" }} />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Razorpay Key Secret</label>
                <input type="password" value={payment.razorpaySecret} onChange={(e) => setPayment({...payment, razorpaySecret: e.target.value})} style={{ width: "100%", padding: "12px", border: "1px solid #e2e8f0", borderRadius: "12px" }} />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Currency</label>
                <select value={payment.currency} onChange={(e) => setPayment({...payment, currency: e.target.value})} style={{ width: "100%", padding: "12px", border: "1px solid #e2e8f0", borderRadius: "12px" }}>
                  <option value="INR">INR (Indian Rupee)</option>
                  <option value="USD">USD (US Dollar)</option>
                  <option value="EUR">EUR (Euro)</option>
                </select>
              </div>
              <button onClick={handleSave} style={{ background: "#f97316", color: "white", border: "none", padding: "12px 24px", borderRadius: "40px", cursor: "pointer" }}>Save Changes</button>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === "notifications" && (
            <div style={{ background: "white", borderRadius: "20px", padding: "32px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "24px" }}>Notification Preferences</h2>
              <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span><strong>Email Alerts</strong><br /><span style={{ fontSize: "12px", color: "#64748b" }}>Receive email notifications</span></span>
                <label style={{ position: "relative", display: "inline-block", width: "50px", height: "24px" }}>
                  <input type="checkbox" checked={notifications.emailAlerts} onChange={(e) => setNotifications({...notifications, emailAlerts: e.target.checked})} style={{ opacity: 0, width: 0, height: 0 }} />
                  <span style={{ position: "absolute", cursor: "pointer", top: 0, left: 0, right: 0, bottom: 0, background: notifications.emailAlerts ? "#f97316" : "#ccc", borderRadius: "24px", transition: "0.3s" }}>
                    <span style={{ position: "absolute", height: "20px", width: "20px", left: notifications.emailAlerts ? "26px" : "4px", bottom: "2px", background: "white", borderRadius: "50%", transition: "0.3s" }}></span>
                  </span>
                </label>
              </div>
              <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span><strong>WhatsApp Alerts</strong><br /><span style={{ fontSize: "12px", color: "#64748b" }}>Receive WhatsApp notifications</span></span>
                <label style={{ position: "relative", display: "inline-block", width: "50px", height: "24px" }}>
                  <input type="checkbox" checked={notifications.whatsappAlerts} onChange={(e) => setNotifications({...notifications, whatsappAlerts: e.target.checked})} style={{ opacity: 0, width: 0, height: 0 }} />
                  <span style={{ position: "absolute", cursor: "pointer", top: 0, left: 0, right: 0, bottom: 0, background: notifications.whatsappAlerts ? "#f97316" : "#ccc", borderRadius: "24px", transition: "0.3s" }}>
                    <span style={{ position: "absolute", height: "20px", width: "20px", left: notifications.whatsappAlerts ? "26px" : "4px", bottom: "2px", background: "white", borderRadius: "50%", transition: "0.3s" }}></span>
                  </span>
                </label>
              </div>
              <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span><strong>New Event Alert</strong><br /><span style={{ fontSize: "12px", color: "#64748b" }}>When new event is created</span></span>
                <label style={{ position: "relative", display: "inline-block", width: "50px", height: "24px" }}>
                  <input type="checkbox" checked={notifications.newEventAlert} onChange={(e) => setNotifications({...notifications, newEventAlert: e.target.checked})} style={{ opacity: 0, width: 0, height: 0 }} />
                  <span style={{ position: "absolute", cursor: "pointer", top: 0, left: 0, right: 0, bottom: 0, background: notifications.newEventAlert ? "#f97316" : "#ccc", borderRadius: "24px", transition: "0.3s" }}>
                    <span style={{ position: "absolute", height: "20px", width: "20px", left: notifications.newEventAlert ? "26px" : "4px", bottom: "2px", background: "white", borderRadius: "50%", transition: "0.3s" }}></span>
                  </span>
                </label>
              </div>
              <button onClick={handleSave} style={{ background: "#f97316", color: "white", border: "none", padding: "12px 24px", borderRadius: "40px", cursor: "pointer" }}>Save Changes</button>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === "security" && (
            <div style={{ background: "white", borderRadius: "20px", padding: "32px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "24px" }}>Security</h2>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Current Password</label>
                <input type="password" placeholder="Enter current password" style={{ width: "100%", padding: "12px", border: "1px solid #e2e8f0", borderRadius: "12px" }} />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>New Password</label>
                <input type="password" placeholder="Enter new password" style={{ width: "100%", padding: "12px", border: "1px solid #e2e8f0", borderRadius: "12px" }} />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Confirm Password</label>
                <input type="password" placeholder="Confirm new password" style={{ width: "100%", padding: "12px", border: "1px solid #e2e8f0", borderRadius: "12px" }} />
              </div>
              <button onClick={handleSave} style={{ background: "#f97316", color: "white", border: "none", padding: "12px 24px", borderRadius: "40px", cursor: "pointer" }}>Change Password</button>
            </div>
          )}

          {/* Backup Settings */}
          {activeTab === "backup" && (
            <div style={{ background: "white", borderRadius: "20px", padding: "32px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "24px" }}>Backup</h2>
              <div style={{ marginBottom: "20px", padding: "16px", background: "#f1f5f9", borderRadius: "12px" }}>
                <p><strong>Last Backup:</strong> 21 May 2025, 08:54 AM</p>
                <p><strong>Backup Size:</strong> 194 MB</p>
                <p><strong>Location:</strong> /root/gce-pwa-dev-backup-20260521-085357.tar.gz</p>
              </div>
              <button style={{ background: "#f97316", color: "white", border: "none", padding: "12px 24px", borderRadius: "40px", cursor: "pointer", marginRight: "12px" }}>Create Backup Now</button>
              <button style={{ background: "#f1f5f9", color: "#64748b", border: "none", padding: "12px 24px", borderRadius: "40px", cursor: "pointer" }}>Download Backup</button>
            </div>
          )}

          {/* Save Success Message */}
          {saved && (
            <div style={{ position: "fixed", bottom: "24px", right: "24px", background: "#22c55e", color: "white", padding: "12px 24px", borderRadius: "40px", zIndex: 1000 }}>
              ✓ Settings saved successfully!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
