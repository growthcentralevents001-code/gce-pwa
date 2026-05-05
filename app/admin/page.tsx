'use client'
import { useState } from 'react'
import { 
  LayoutDashboard, Users, Briefcase, Handshake, Calendar, Gift, 
  BookOpen, Target, CircleDollarSign, Star, Settings, Shield, 
  TrendingUp, Eye, Edit, Trash2, Plus, Bell, Search
} from 'lucide-react'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  // Stats Data
  const stats = [
    { title: 'Total Members', value: '1,250', change: '+10%', icon: <Users size={24} />, color: 'bg-blue-100 text-blue-600' },
    { title: 'Total Events', value: '48', change: '+8%', icon: <Calendar size={24} />, color: 'bg-green-100 text-green-600' },
    { title: 'Active Offers', value: '32', change: '+12%', icon: <Gift size={24} />, color: 'bg-orange-100 text-orange-600' },
    { title: 'Total Revenue', value: '₹82.5L', change: '+15%', icon: <CircleDollarSign size={24} />, color: 'bg-purple-100 text-purple-600' },
  ]

  const recentMembers = [
    { name: 'Rohan Mehta', email: 'rohan@gmail.com', type: 'Gold', status: 'active', date: '23 May 2025' },
    { name: 'Neha Kapoor', email: 'neha@gmail.com', type: 'Silver', status: 'active', date: '22 May 2025' },
    { name: 'Vikram Singh', email: 'vikram@gmail.com', type: 'Business', status: 'active', date: '21 May 2025' },
    { name: 'Anjali Desai', email: 'anjali@gmail.com', type: 'Gold', status: 'inactive', date: '20 May 2025' },
  ]

  const activities = [
    { action: 'New member Rohan Mehta joined as Gold Member', time: '2 hours ago', icon: '👤' },
    { action: 'New event "Startup Networking Meetup" created', time: '3 hours ago', icon: '📅' },
    { action: 'Payment of ₹24,000 received from Neha Kapoor', time: '4 hours ago', icon: '💰' },
    { action: 'New offer "GCE20" created by FreshMart', time: '5 hours ago', icon: '🎁' },
  ]

  const membershipData = [
    { tier: 'Gold', count: 3450, percentage: 28, color: 'bg-yellow-500' },
    { tier: 'Silver', count: 4800, percentage: 37, color: 'bg-gray-400' },
    { tier: 'Business', count: 3500, percentage: 35, color: 'bg-orange-500' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 text-white min-h-screen sticky top-0">
          <div className="p-4 border-b border-gray-800"><h2 className="text-xl font-bold text-primary">GCE Admin</h2><p className="text-xs text-gray-400">Growth Central Events</p></div>
          <nav className="p-4 space-y-1">
            {[{ icon: <LayoutDashboard size={18} />, name: 'Dashboard', id: 'overview' }, { icon: <Users size={18} />, name: 'Members', id: 'members' }, { icon: <Briefcase size={18} />, name: 'BDMs', id: 'bdms' }, { icon: <Handshake size={18} />, name: 'Partners', id: 'partners' }, { icon: <Calendar size={18} />, name: 'Events', id: 'events' }, { icon: <Gift size={18} />, name: 'Offers', id: 'offers' }, { icon: <BookOpen size={18} />, name: 'Bookings', id: 'bookings' }, { icon: <Target size={18} />, name: 'The Circle', id: 'thecircle' }, { icon: <TrendingUp size={18} />, name: 'Leads', id: 'leads' }, { icon: <CircleDollarSign size={18} />, name: 'Payments', id: 'payments' }, { icon: <Star size={18} />, name: 'Ratings', id: 'ratings' }, { icon: <TrendingUp size={18} />, name: 'Analytics', id: 'analytics' }, { icon: <Settings size={18} />, name: 'Settings', id: 'settings' }, { icon: <Shield size={18} />, name: 'Logs', id: 'logs' }].map(item => (
              <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${activeTab === item.id ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-800'}`}>{item.icon}{item.name}</button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Top Header */}
          <header className="bg-white shadow-sm px-6 py-3 flex justify-between items-center sticky top-0 z-10"><div className="flex items-center gap-4"><div className="relative"><Search size={18} className="absolute left-3 top-2.5 text-gray-400" /><input type="text" placeholder="Search..." className="pl-9 pr-4 py-2 border rounded-lg w-64" /></div></div><div className="flex items-center gap-4"><Bell size={20} className="text-gray-500" /><div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">A</div></div></header>

          {/* Stats Cards */}
          <div className="p-6"><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">{stats.map((s, i) => (<div key={i} className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-primary"><div className="flex justify-between items-start"><div><p className="text-2xl font-bold">{s.value}</p><p className="text-sm text-gray-500">{s.title}</p></div><div className={`p-2 rounded-lg ${s.color}`}>{s.icon}</div></div><p className="text-xs text-green-600 mt-2">{s.change} vs last month</p></div>))}</div>

            {/* Recent Members & Activities */}
            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-xl p-4 shadow-sm"><h3 className="font-bold mb-3 text-gray-800">Recent Members</h3><div className="space-y-3">{recentMembers.map((m, i) => (<div key={i} className="flex justify-between items-center"><div><p className="font-medium">{m.name}</p><p className="text-xs text-gray-400">{m.email} · {m.type}</p></div><span className={`text-xs px-2 py-1 rounded-full ${m.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{m.status}</span></div>))}</div><button className="mt-3 text-primary text-sm flex items-center gap-1">View All Members <TrendingUp size={14} /></button></div>

              <div className="bg-white rounded-xl p-4 shadow-sm"><h3 className="font-bold mb-3 text-gray-800">Recent Activities</h3><div className="space-y-3">{activities.map((a, i) => (<div key={i} className="flex items-start gap-3"><span className="text-xl">{a.icon}</span><div><p className="text-sm">{a.action}</p><p className="text-xs text-gray-400">{a.time}</p></div></div>))}</div></div>
            </div>

            {/* Revenue & Membership */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-4 shadow-sm"><h3 className="font-bold mb-3 text-gray-800">Revenue Overview</h3><p className="text-3xl font-bold text-primary">₹82.5L</p><p className="text-sm text-green-600">↑ 15% vs last month</p><div className="mt-4 h-40 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">📊 Revenue Chart</div></div>
              <div className="bg-white rounded-xl p-4 shadow-sm"><h3 className="font-bold mb-3 text-gray-800">Membership Overview</h3><div className="space-y-3">{membershipData.map((m, i) => (<div key={i}><div className="flex justify-between text-sm"><span>{m.tier}</span><span>{m.count} ({m.percentage}%)</span></div><div className="h-2 bg-gray-200 rounded-full mt-1"><div className={`h-2 rounded-full ${m.color}`} style={{ width: `${m.percentage}%` }}></div></div></div>))}</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
