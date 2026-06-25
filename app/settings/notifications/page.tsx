"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, Mail, Smartphone, CheckCircle, ArrowLeft, ToggleLeft, ToggleRight } from "lucide-react";

export default function NotificationsPage() {
  const [settings, setSettings] = useState({
    email: true,
    push: true,
    reminders: true,
    promotions: false,
    updates: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Orange Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <Link href="/settings" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition mb-4">
            <ArrowLeft size={18} /> Back to Settings
          </Link>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Bell className="text-white/90" size={32} />
            Notifications
          </h1>
          <p className="text-orange-100 mt-1 text-sm">Manage how you receive updates and alerts</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 space-y-6">
            {[
              { key: 'email', icon: Mail, label: 'Email Notifications', desc: 'Receive updates via email' },
              { key: 'push', icon: Smartphone, label: 'Push Notifications', desc: 'Get alerts on your device' },
              { key: 'reminders', icon: Bell, label: 'Event Reminders', desc: '24 hours before events' },
              { key: 'promotions', icon: Bell, label: 'Promotions & Offers', desc: 'Special deals and discounts' },
              { key: 'updates', icon: Bell, label: 'Platform Updates', desc: 'New features and improvements' },
            ].map((item) => {
              const isEnabled = settings[item.key as keyof typeof settings];
              return (
                <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <item.icon size={18} className="text-orange-500" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-700">{item.label}</p>
                      <p className="text-sm text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleSetting(item.key as keyof typeof settings)}
                    className="text-slate-400 hover:text-orange-500 transition"
                  >
                    {isEnabled ? (
                      <ToggleRight size={28} className="text-orange-500" />
                    ) : (
                      <ToggleLeft size={28} className="text-slate-300" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 text-sm text-slate-400 text-center">
          Changes saved automatically
        </div>
      </div>
    </div>
  );
}
