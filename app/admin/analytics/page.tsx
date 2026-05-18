'use client'
import { useState } from 'react'
import { TrendingUp, Users, Calendar, DollarSign, Download, Filter, ChevronDown, BarChart3, PieChart } from 'lucide-react'

export default function AnalyticsReports() {
  const [dateRange, setDateRange] = useState('30days')

  const stats = {
    totalMembers: 1250,
    newMembers: 142,
    totalEvents: 48,
    totalRevenue: 8250000,
    avgEventRating: 4.6,
    offerRedemption: 67,
  }

  const monthlyData = [
    { month: 'Jan', members: 980, revenue: 5200000, events: 32 },
    { month: 'Feb', members: 1050, revenue: 6100000, events: 38 },
    { month: 'Mar', members: 1120, revenue: 6800000, events: 42 },
    { month: 'Apr', members: 1180, revenue: 7400000, events: 45 },
    { month: 'May', members: 1250, revenue: 8250000, events: 48 },
  ]

  const topEvents = [
    { id: 1, title: 'Startup GCE Marketplace Meetup', registrations: 120, revenue: 59880 },
    { id: 2, title: 'Digital Marketing Masterclass', registrations: 85, revenue: 59415 },
    { id: 3, title: 'AI & Future of Work Summit', registrations: 180, revenue: 143820 },
  ]

  const zoneData = [
    { zone: 'North', percentage: 34, revenue: 2800000 },
    { zone: 'South', percentage: 27, revenue: 2200000 },
    { zone: 'West', percentage: 23, revenue: 1900000 },
    { zone: 'East', percentage: 16, revenue: 1350000 },
  ]

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div><h1 className="text-2xl font-bold text-gray-800">Analytics & Reports</h1><p className="text-gray-500 text-sm">Platform insights and performance metrics</p></div>
        <div className="flex gap-3">
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="border rounded-lg px-3 py-2 text-sm"><option value="7days">Last 7 days</option><option value="30days">Last 30 days</option><option value="90days">Last 90 days</option><option value="12months">Last 12 months</option></select>
          <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm"><Download size={16} /> Export Report</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-primary"><div className="flex items-center gap-3"><Users size={24} className="text-primary" /><div><p className="text-2xl font-bold">{stats.totalMembers}</p><p className="text-sm text-gray-500">Total Members</p><p className="text-xs text-green-600">↑ +{stats.newMembers} this month</p></div></div></div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-green-500"><div className="flex items-center gap-3"><Calendar size={24} className="text-green-500" /><div><p className="text-2xl font-bold">{stats.totalEvents}</p><p className="text-sm text-gray-500">Total Events</p><p className="text-xs text-green-600">↑ +16 vs last month</p></div></div></div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-purple-500"><div className="flex items-center gap-3"><DollarSign size={24} className="text-purple-500" /><div><p className="text-2xl font-bold">₹{(stats.totalRevenue/100000).toFixed(1)}L</p><p className="text-sm text-gray-500">Total Revenue</p><p className="text-xs text-green-600">↑ 15% vs last month</p></div></div></div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-orange-500"><div className="flex items-center gap-3"><TrendingUp size={24} className="text-orange-500" /><div><p className="text-2xl font-bold">{stats.avgEventRating}</p><p className="text-sm text-gray-500">Avg Event Rating</p><p className="text-xs text-green-600">⭐ from 1,250 reviews</p></div></div></div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm"><h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><TrendingUp size={18} className="text-primary" /> Member Growth</h3><div className="space-y-3">{monthlyData.map((d, i) => (<div key={i}><div className="flex justify-between text-sm"><span>{d.month}</span><span>{d.members} members</span></div><div className="h-2 bg-gray-200 rounded-full mt-1"><div className="h-2 bg-primary rounded-full" style={{ width: `${(d.members/1300)*100}%` }}></div></div></div>))}</div></div>
        <div className="bg-white rounded-xl p-4 shadow-sm"><h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><DollarSign size={18} className="text-primary" /> Revenue Trend</h3><div className="space-y-3">{monthlyData.map((d, i) => (<div key={i}><div className="flex justify-between text-sm"><span>{d.month}</span><span>₹{(d.revenue/100000).toFixed(1)}L</span></div><div className="h-2 bg-gray-200 rounded-full mt-1"><div className="h-2 bg-green-500 rounded-full" style={{ width: `${(d.revenue/9000000)*100}%` }}></div></div></div>))}</div></div>
      </div>

      {/* Revenue by Zone & Top Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm"><h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><PieChart size={18} className="text-primary" /> Revenue by Zone</h3><div className="space-y-3">{zoneData.map(z => (<div key={z.zone}><div className="flex justify-between text-sm"><span>{z.zone} Zone</span><span>₹{(z.revenue/100000).toFixed(1)}L ({z.percentage}%)</span></div><div className="h-2 bg-gray-200 rounded-full mt-1"><div className="h-2 bg-primary rounded-full" style={{ width: `${z.percentage}%` }}></div></div></div>))}</div></div>
        <div className="bg-white rounded-xl p-4 shadow-sm"><h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><BarChart3 size={18} className="text-primary" /> Top Performing Events</h3><div className="space-y-3">{topEvents.map(e => (<div key={e.id} className="flex justify-between items-center"><div><p className="font-medium">{e.title}</p><p className="text-xs text-gray-500">{e.registrations} registrations</p></div><p className="font-bold text-primary">₹{(e.revenue/1000).toFixed(0)}K</p></div>))}</div></div>
      </div>

      {/* Offer Redemption */}
      <div className="bg-white rounded-xl p-4 shadow-sm"><h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><TrendingUp size={18} className="text-primary" /> Offer Redemption Rate</h3><div className="flex items-center gap-4"><div className="flex-1"><div className="h-3 bg-gray-200 rounded-full"><div className="h-3 bg-orange-500 rounded-full" style={{ width: `${stats.offerRedemption}%` }}></div></div></div><p className="text-2xl font-bold text-primary">{stats.offerRedemption}%</p><p className="text-sm text-gray-500">32 offers claimed out of 48 total</p></div></div>
    </div>
  )
}
