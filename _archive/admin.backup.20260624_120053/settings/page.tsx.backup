"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { 
  User, Percent, DollarSign, CreditCard, Bell, Shield, Database, 
  Save, RefreshCw, Eye, EyeOff 
} from "lucide-react";

export default function AdminSettings() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  
  // Profile state
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
  });
  
  // Commission state
  const [commission, setCommission] = useState({
    connect: 20,
    marketplace: 18,
    enterprise: 15,
    franchisee: 50
  });
  
  // Discount state
  const [discount, setDiscount] = useState({
    member_discount: 15,
    early_bird: 10,
    group_booking: 5
  });
  
  // Payment state
  const [payment, setPayment] = useState({
    razorpay_key: "",
    razorpay_secret: "",
    mode: "test"
  });
  
  // Notification state
  const [notifications, setNotifications] = useState({
    email: true,
    whatsapp: true,
    push: false
  });
  
  // Password state
  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      
      // Load profile
      const { data: userData } = await supabase.from("users").select("full_name, email, phone").eq("id", user.id).single();
      if (userData) setProfile({ full_name: userData.full_name || "Admin", email: userData.email, phone: userData.phone || "" });
      
      // Load settings from platform_settings table
      const { data: settings } = await supabase.from("platform_settings").select("*").single();
      if (settings) {
        if (settings.commission) setCommission(settings.commission);
        if (settings.discount) setDiscount(settings.discount);
        if (settings.payment) setPayment(settings.payment);
        if (settings.notifications) setNotifications(settings.notifications);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const saveSettings = async (type: string, data: any) => {
    setSaving(true);
    // Get existing settings or create new
    const { data: existing } = await supabase.from("platform_settings").select("*").single();
    const updateData = { ...existing, [type]: data, updated_at: new Date() };
    if (existing) {
      await supabase.from("platform_settings").update(updateData).eq("id", existing.id);
    } else {
      await supabase.from("platform_settings").insert([{ id: 1, [type]: data }]);
    }
    alert(`${type} settings saved!`);
    setSaving(false);
  };

  const updatePassword = async () => {
    if (password.new !== password.confirm) { alert("Passwords don't match"); return; }
    if (password.new.length < 6) { alert("Password must be at least 6 characters"); return; }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: password.new });
    if (!error) {
      alert("Password updated!");
      setPassword({ current: "", new: "", confirm: "" });
    } else alert("Error: " + error.message);
    setSaving(false);
  };

  if (loading) return <div className="p-8 text-center">Loading settings...</div>;

  const tabs = [
    { id: "profile", name: "Profile", icon: User },
    { id: "commission", name: "Commission", icon: Percent },
    { id: "discount", name: "Discount", icon: DollarSign },
    { id: "payment", name: "Payment", icon: CreditCard },
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "security", name: "Security", icon: Shield },
    { id: "backup", name: "Backup", icon: Database },
  ];

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Settings</h1><p className="text-gray-500">Manage platform configuration</p></div>
      <div className="flex gap-6">
        <div className="w-64 bg-white rounded-xl shadow-sm p-4 space-y-1">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm ${activeTab === tab.id ? "bg-orange-50 text-orange-600" : "hover:bg-gray-50"}`}>
              <tab.icon size={18} /> {tab.name}
            </button>
          ))}
        </div>

        <div className="flex-1 bg-white rounded-xl shadow-sm p-6">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div><h2 className="text-lg font-bold mb-4">Profile Information</h2>
              <div className="space-y-4">
                <div><label className="block text-sm">Full Name</label><input type="text" value={profile.full_name} onChange={e => setProfile({...profile, full_name: e.target.value})} className="w-full border rounded-lg p-2" /></div>
                <div><label className="block text-sm">Email</label><input type="email" value={profile.email} disabled className="w-full border rounded-lg p-2 bg-gray-50" /></div>
                <div><label className="block text-sm">Phone</label><input type="tel" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} className="w-full border rounded-lg p-2" /></div>
                <button onClick={() => saveSettings("profile", profile)} disabled={saving} className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">{saving ? "Saving..." : "Save Profile"}</button>
              </div>
            </div>
          )}

          {/* Commission Tab */}
          {activeTab === "commission" && (
            <div><h2 className="text-lg font-bold mb-4">Commission Settings</h2>
              <div className="space-y-4">
                <div><label>GCE Connect (%)</label><input type="number" value={commission.connect} onChange={e => setCommission({...commission, connect: parseInt(e.target.value)})} className="w-full border rounded-lg p-2" /></div>
                <div><label>Marketplace (%)</label><input type="number" value={commission.marketplace} onChange={e => setCommission({...commission, marketplace: parseInt(e.target.value)})} className="w-full border rounded-lg p-2" /></div>
                <div><label>Enterprise (%)</label><input type="number" value={commission.enterprise} onChange={e => setCommission({...commission, enterprise: parseInt(e.target.value)})} className="w-full border rounded-lg p-2" /></div>
                <div><label>Franchisee Share (%)</label><input type="number" value={commission.franchisee} onChange={e => setCommission({...commission, franchisee: parseInt(e.target.value)})} className="w-full border rounded-lg p-2" /></div>
                <button onClick={() => saveSettings("commission", commission)} className="bg-orange-600 text-white px-4 py-2 rounded-lg">Save Commission</button>
              </div>
            </div>
          )}

          {/* Discount Tab */}
          {activeTab === "discount" && (
            <div><h2 className="text-lg font-bold mb-4">Discount Settings</h2>
              <div className="space-y-4">
                <div><label>Member Discount on Food Bill (%)</label><input type="number" value={discount.member_discount} onChange={e => setDiscount({...discount, member_discount: parseInt(e.target.value)})} className="w-full border rounded-lg p-2" /></div>
                <div><label>Early Bird Discount (%)</label><input type="number" value={discount.early_bird} onChange={e => setDiscount({...discount, early_bird: parseInt(e.target.value)})} className="w-full border rounded-lg p-2" /></div>
                <div><label>Group Booking Discount (%)</label><input type="number" value={discount.group_booking} onChange={e => setDiscount({...discount, group_booking: parseInt(e.target.value)})} className="w-full border rounded-lg p-2" /></div>
                <button onClick={() => saveSettings("discount", discount)} className="bg-orange-600 text-white px-4 py-2 rounded-lg">Save Discounts</button>
              </div>
            </div>
          )}

          {/* Payment Tab */}
          {activeTab === "payment" && (
            <div><h2 className="text-lg font-bold mb-4">Payment Gateway</h2>
              <div className="space-y-4">
                <div><label>Razorpay Key ID</label><input type="text" value={payment.razorpay_key} onChange={e => setPayment({...payment, razorpay_key: e.target.value})} placeholder="rzp_test_xxx" className="w-full border rounded-lg p-2" /></div>
                <div><label>Razorpay Secret</label><input type="password" value={payment.razorpay_secret} onChange={e => setPayment({...payment, razorpay_secret: e.target.value})} className="w-full border rounded-lg p-2" /></div>
                <div><label>Mode</label><select value={payment.mode} onChange={e => setPayment({...payment, mode: e.target.value})} className="w-full border rounded-lg p-2"><option value="test">Test Mode</option><option value="live">Live Mode</option></select></div>
                <button onClick={() => saveSettings("payment", payment)} className="bg-orange-600 text-white px-4 py-2 rounded-lg">Save Payment Settings</button>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div><h2 className="text-lg font-bold mb-4">Notification Preferences</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center"><span>Email Notifications</span><button onClick={() => setNotifications({...notifications, email: !notifications.email})} className={`px-3 py-1 rounded-full text-sm ${notifications.email ? "bg-green-100 text-green-700" : "bg-gray-200"}`}>{notifications.email ? "ON" : "OFF"}</button></div>
                <div className="flex justify-between items-center"><span>WhatsApp Notifications</span><button onClick={() => setNotifications({...notifications, whatsapp: !notifications.whatsapp})} className={`px-3 py-1 rounded-full text-sm ${notifications.whatsapp ? "bg-green-100 text-green-700" : "bg-gray-200"}`}>{notifications.whatsapp ? "ON" : "OFF"}</button></div>
                <div className="flex justify-between items-center"><span>Push Notifications</span><button onClick={() => setNotifications({...notifications, push: !notifications.push})} className={`px-3 py-1 rounded-full text-sm ${notifications.push ? "bg-green-100 text-green-700" : "bg-gray-200"}`}>{notifications.push ? "ON" : "OFF"}</button></div>
                <button onClick={() => saveSettings("notifications", notifications)} className="mt-4 bg-orange-600 text-white px-4 py-2 rounded-lg">Save Notifications</button>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div><h2 className="text-lg font-bold mb-4">Change Password</h2>
              <div className="space-y-4">
                <div><label>New Password</label><input type={showPassword ? "text" : "password"} value={password.new} onChange={e => setPassword({...password, new: e.target.value})} className="w-full border rounded-lg p-2" /></div>
                <div><label>Confirm Password</label><input type={showPassword ? "text" : "password"} value={password.confirm} onChange={e => setPassword({...password, confirm: e.target.value})} className="w-full border rounded-lg p-2" /></div>
                <div className="flex gap-2"><button onClick={() => setShowPassword(!showPassword)} className="border px-3 py-1 rounded">{showPassword ? "Hide" : "Show"}</button><button onClick={updatePassword} disabled={saving} className="bg-orange-600 text-white px-4 py-2 rounded-lg">Update Password</button></div>
              </div>
            </div>
          )}

          {/* Backup Tab */}
          {activeTab === "backup" && (
            <div><h2 className="text-lg font-bold mb-4">Database Backup</h2>
              <p className="text-gray-500 mb-4">Manual and automated backup options</p>
              <div className="space-y-3">
                <button className="bg-orange-600 text-white px-4 py-2 rounded-lg w-full">Run Manual Backup</button>
                <button className="border px-4 py-2 rounded-lg w-full">Download Latest Backup</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
