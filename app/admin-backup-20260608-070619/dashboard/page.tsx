"use client";
import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalPartners: 320,
    totalEvents: 1250,
    totalRevenue: 8250000,
    members: { gold: 3450, silver: 4800, bronze: 2600, free: 1600 }
  });

  const recentMembers = [
    { name: "Rohan Mehta", email: "rohan@gmail.com", type: "Gold", status: "Active", joined: "23 May 2025" },
    { name: "Neha Kapoor", email: "neha@gmail.com", type: "Silver", status: "Active", joined: "22 May 2025" },
    { name: "Vikram Singh", email: "vikram@gmail.com", type: "Gold", status: "Active", joined: "21 May 2025" },
    { name: "Anjali Desai", email: "anjali@gmail.com", type: "Silver", status: "Inactive", joined: "20 May 2025" },
    { name: "Rahul Sharma", email: "rahul@gmail.com", type: "Bronze", status: "Active", joined: "19 May 2025" }
  ];

  const activities = [
    { text: "New member Rohan Mehta joined as Gold Member", time: "2h ago" },
    { text: "New event \"Startup Networking Meetup\" created by Partner WeWork", time: "3h ago" },
    { text: "Payment of ₹24,000 received from Neha Kapoor", time: "4h ago" },
    { text: "New franchise application received from TechNova Solutions", time: "5h ago" }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-orange-600 mb-6">Admin Dashboard</h1>

      {/* Search Bar */}
      <div className="mb-6">
        <input type="text" placeholder="Search members, events, partners..." className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <p className="text-gray-500 text-sm">Total Partners</p>
          <p className="text-3xl font-bold">{stats.totalPartners}</p>
          <p className="text-green-600 text-sm mt-1">↑ 10% vs last month</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <p className="text-gray-500 text-sm">Total Events</p>
          <p className="text-3xl font-bold">{stats.totalEvents}</p>
          <p className="text-green-600 text-sm mt-1">↑ 12% vs last month</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <p className="text-gray-500 text-sm">Total Revenue</p>
          <p className="text-3xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
          <p className="text-green-600 text-sm mt-1">↑ 15% vs last month</p>
        </div>
      </div>

      {/* Two-column layout: Recent Members + Membership Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Members Table */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <h2 className="text-lg font-semibold mb-3">Recent Members</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="border-b">
                <tr className="text-left text-gray-500">
                  <th className="pb-2">Name</th><th>Email</th><th>Type</th><th>Status</th><th>Joined On</th><th></th>
                </tr>
              </thead>
              <tbody>
                {recentMembers.map((m, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="py-2">{m.name}</td><td>{m.email}</td><td>{m.type}</td>
                    <td><span className={`px-2 py-1 rounded-full text-xs ${m.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{m.status}</span></td>
                    <td>{m.joined}</td>
                    <td><button className="text-gray-400">🔒</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Membership Overview */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <h2 className="text-lg font-semibold mb-3">Membership Overview</h2>
          <div className="space-y-2">
            <div><span className="font-medium">Gold:</span> {stats.members.gold} (28%)</div>
            <div><span className="font-medium">Silver:</span> {stats.members.silver} (37%)</div>
            <div><span className="font-medium">Bronze:</span> {stats.members.bronze} (21%)</div>
            <div><span className="font-medium">Free:</span> {stats.members.free} (12%)</div>
          </div>
          <button className="mt-4 text-orange-600 text-sm">View Detailed Report →</button>
        </div>
      </div>

      {/* Revenue Overview + Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <h2 className="text-lg font-semibold mb-2">Revenue Overview (This Month)</h2>
          <p className="text-3xl font-bold text-orange-600">₹{stats.totalRevenue.toLocaleString()}</p>
          <p className="text-green-600 text-sm mb-4">↑ 15% vs last month</p>
          <div className="space-y-2">
            <div><span className="font-medium">Gold:</span> ₹34,50,000 (28%)</div>
            <div><span className="font-medium">Silver:</span> ₹48,00,000 (37%)</div>
            <div><span className="font-medium">Bronze:</span> ₹26,00,000 (21%)</div>
            <div><span className="font-medium">Free:</span> ₹16,00,000 (12%)</div>
          </div>
          <button className="mt-4 text-orange-600 text-sm">View Detailed Report →</button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-4">
          <h2 className="text-lg font-semibold mb-3">Recent Activities</h2>
          <div className="space-y-4">
            {activities.map((act, idx) => (
              <div key={idx} className="border-b pb-2">
                <p className="text-sm">{act.text}</p>
                <p className="text-xs text-gray-400 mt-1">{act.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
