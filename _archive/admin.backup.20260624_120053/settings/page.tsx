"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { 
  Settings, Save, RefreshCw, 
  Percent, DollarSign, Bell, Database, 
  Shield, User, Mail, Key, Globe,
  Sliders, Clock, Users, Building
} from "lucide-react";
import Link from "next/link";

export default function AdminSettings() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    // General
    site_name: "GCE Events",
    site_tagline: "Discover. Connect. Experience.",
    support_email: "support@growthcentralevents.com",
    
    // Commission
    connect_commission: 20,
    marketplace_commission: 20,
    enterprise_commission: 15,
    
    // Discounts
    default_discount: 10,
    member_discount: 5,
    referral_discount: 5,
    
    // Payment Keys
    razorpay_key_id: "",
    razorpay_key_secret: "",
    
    // Notifications
    enable_email: true,
    enable_push: false,
    enable_sms: false,
    
    // Backup
    backup_enabled: true,
    backup_time: "03:00",
    backup_retention: 14,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      // Fetch from system_settings table if exists
      const { data, error } = await supabase
        .from("system_settings")
        .select("*")
        .single();

      if (error && error.code !== "PGRST116") throw error; // PGRST116 = no rows
      
      if (data) {
        setSettings(prev => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setSettings(prev => ({ ...prev, [name]: checked }));
    } else {
      setSettings(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Upsert settings
      const { error } = await supabase
        .from("system_settings")
        .upsert({
          ...settings,
          updated_at: new Date().toISOString(),
        }, { onConflict: "id" });

      if (error) throw error;
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleBackup = async () => {
    if (!confirm("Run database backup now?")) return;
    try {
      // Trigger backup script
      const response = await fetch("/api/backup", { method: "POST" });
      if (response.ok) {
        alert("Backup completed successfully!");
      } else {
        throw new Error("Backup failed");
      }
    } catch (error) {
      console.error("Backup error:", error);
      alert("Backup failed. Check server logs.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-6 pb-4 border-b-4 border-orange-400">
        <div className="flex items-center gap-3">
          <div className="bg-orange-500 p-2 rounded-xl">
            <Settings size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
            <p className="text-gray-500 text-sm">Manage system settings, commissions, payments, and more</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* General Settings */}
        <div className="bg-white border border-orange-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4 text-orange-600">
            <Globe size={20} />
            <h2 className="text-lg font-semibold text-gray-800">General Settings</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
              <input
                type="text"
                name="site_name"
                value={settings.site_name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
              <input
                type="text"
                name="site_tagline"
                value={settings.site_tagline}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
              <input
                type="email"
                name="support_email"
                value={settings.support_email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>
        </div>

        {/* Commission Settings */}
        <div className="bg-white border border-orange-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4 text-orange-600">
            <Percent size={20} />
            <h2 className="text-lg font-semibold text-gray-800">Commission Rates</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Connect Commission (%)</label>
              <input
                type="number"
                name="connect_commission"
                value={settings.connect_commission}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marketplace Commission (%)</label>
              <input
                type="number"
                name="marketplace_commission"
                value={settings.marketplace_commission}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Enterprise Commission (%)</label>
              <input
                type="number"
                name="enterprise_commission"
                value={settings.enterprise_commission}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>
        </div>

        {/* Discount Settings */}
        <div className="bg-white border border-orange-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4 text-orange-600">
            <Sliders size={20} />
            <h2 className="text-lg font-semibold text-gray-800">Discount Settings</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Default Discount (%)</label>
              <input
                type="number"
                name="default_discount"
                value={settings.default_discount}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Member Discount (%)</label>
              <input
                type="number"
                name="member_discount"
                value={settings.member_discount}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Referral Discount (%)</label>
              <input
                type="number"
                name="referral_discount"
                value={settings.referral_discount}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>
        </div>

        {/* Payment Keys */}
        <div className="bg-white border border-orange-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4 text-orange-600">
            <Key size={20} />
            <h2 className="text-lg font-semibold text-gray-800">Payment Keys</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Razorpay Key ID</label>
              <input
                type="password"
                name="razorpay_key_id"
                value={settings.razorpay_key_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400"
                placeholder="Enter Razorpay Key ID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Razorpay Key Secret</label>
              <input
                type="password"
                name="razorpay_key_secret"
                value={settings.razorpay_key_secret}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400"
                placeholder="Enter Razorpay Key Secret"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white border border-orange-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4 text-orange-600">
            <Bell size={20} />
            <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Enable Email Notifications</label>
              <input
                type="checkbox"
                name="enable_email"
                checked={settings.enable_email}
                onChange={handleChange}
                className="w-4 h-4 text-orange-600 rounded border-orange-300 focus:ring-orange-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Enable Push Notifications</label>
              <input
                type="checkbox"
                name="enable_push"
                checked={settings.enable_push}
                onChange={handleChange}
                className="w-4 h-4 text-orange-600 rounded border-orange-300 focus:ring-orange-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Enable SMS Notifications</label>
              <input
                type="checkbox"
                name="enable_sms"
                checked={settings.enable_sms}
                onChange={handleChange}
                className="w-4 h-4 text-orange-600 rounded border-orange-300 focus:ring-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Backup */}
        <div className="bg-white border border-orange-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4 text-orange-600">
            <Database size={20} />
            <h2 className="text-lg font-semibold text-gray-800">Backup Settings</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Enable Auto Backup</label>
              <input
                type="checkbox"
                name="backup_enabled"
                checked={settings.backup_enabled}
                onChange={handleChange}
                className="w-4 h-4 text-orange-600 rounded border-orange-300 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Backup Time (UTC)</label>
              <input
                type="time"
                name="backup_time"
                value={settings.backup_time}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Retention (days)</label>
              <input
                type="number"
                name="backup_retention"
                value={settings.backup_retention}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <button
              onClick={handleBackup}
              className="w-full py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
            >
              Run Backup Now
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition disabled:bg-gray-400"
        >
          <Save size={18} />
          {saving ? "Saving..." : "Save All Settings"}
        </button>
      </div>
    </div>
  );
}
