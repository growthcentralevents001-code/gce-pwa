'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, Users, Briefcase, Handshake, Calendar, Gift, 
  BookOpen, Target, CircleDollarSign, Star, Settings, Shield, 
  TrendingUp, Eye, Edit, Trash2, Plus, Bell, Search, LogOut,
  ChevronDown, Menu
} from 'lucide-react'

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const pathname = usePathname()

  const navItems = [
    { id: 'overview', name: 'Dashboard', icon: <LayoutDashboard size={18} />, href: '/admin' },
    { id: 'members', name: 'Members', icon: <Users size={18} />, href: '/admin/members' },
    { id: 'bdms', name: 'BDMs', icon: <Briefcase size={18} />, href: '/admin/bdms' },
    { id: 'partners', name: 'Partners', icon: <Handshake size={18} />, href: '/admin/partners' },
    { id: 'events', name: 'Events', icon: <Calendar size={18} />, href: '/admin/events' },
    { id: 'offers', name: 'Offers', icon: <Gift size={18} />, href: '/admin/offers' },
    { id: 'bookings', name: 'Bookings', icon: <BookOpen size={18} />, href: '/admin/bookings' },
    { id: 'thecircle', name: 'The Circle', icon: <Target size={18} />, href: '/admin/thecircle' },
    { id: 'leads', name: 'Leads', icon: <TrendingUp size={18} />, href: '/admin/leads' },
    { id: 'payments', name: 'Payments', icon: <CircleDollarSign size={18} />, href: '/admin/payments' },
    { id: 'ratings', name: 'Ratings', icon: <Star size={18} />, href: '/admin/ratings' },
    { id: 'analytics', name: 'Analytics', icon: <TrendingUp size={18} />, href: '/admin/analytics' },
    { id: 'settings', name: 'Settings', icon: <Settings size={18} />, href: '/admin/settings' },
    { id: 'logs', name: 'Logs', icon: <Shield size={18} />, href: '/admin/logs' },
  ]

  // Stats data for dashboard overview
  const stats = [
    { title: 'Total Members', value: '1,250', change: '+10%', icon: <Users size={24} />, color: 'bg-blue-100 text-blue-600' },
    { title: 'Total Events', value: '48', change: '+8%', icon: <Calendar size={24} />, color: 'bg-green-100 text-green-600' },
    { title: 'Active Offers', value: '32', change: '+12%', icon: <Gift size={24} />, color: 'bg-orange-100 text-orange-600' },
    { title: 'Total Revenue', value: '₹82.5L', change: '+15%', icon: <CircleDollarSign size={24} />, color: 'bg-purple-100 text-purple-600' },
  ]

  const recentMembers = [
    { name: 'Amit Sharma', email: 'amit.sharma@email.com', type: 'Gold', status: 'active' },
    { name: 'Priya Mehta', email: 'priya.mehta@email.com', type: 'Silver', status: 'active' },
    { name: 'Rahul Verma', email: 'rahul.verma@email.com', type: 'Business', status: 'active' },
    { name: 'Neha Kapoor', email: 'neha.kapoor@email.com', type: 'Gold', status: 'inactive' },
    { name: 'Vikram Reddy', email: 'vikram.reddy@email.com', type: 'Silver', status: 'active' },
  ]

  const membershipData = [
    { tier: 'Gold Members', count: 350, percentage: 28, color: 'bg-yellow-500' },
    { tier: 'Silver Members', count: 463, percentage: 37, color: 'bg-gray-400' },
    { tier: 'Business Members', count: 437, percentage: 35, color: 'bg-orange-500' },
  ]

  // Agar overview page nahi hai to sirf children render karo
  if (pathname !== '/admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-900 text-white min-h-screen sticky top-0 transition-all duration-300`}>
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <div className={sidebarOpen ? 'block' : 'hidden'}><h2 className="text-xl font-bold text-primary">GCE Admin</h2><p className="text-xs text-gray-400">Growth Central Events</p></div>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 rounded hover:bg-gray-800"><Menu size={20} /></button>
          </div>
          <nav className="p-4 space-y-1">
            {navItems.map(item => (
              <Link key={item.id} href={item.href}>
                <div className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition cursor-pointer ${pathname === item.href ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-800'}`}>
                  {item.icon}{sidebarOpen && item.name}
                </div>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          <header className="bg-white shadow-sm px-6 py-3 flex justify-between items-center sticky top-0 z-10">
            <div className="flex items-center gap-4"><div className="relative"><Search size={18} className="absolute left-3 top-2.5 text-gray-400" /><input type="text" placeholder="Search..." className="pl-9 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-primary" /></div></div>
            <div className="flex items-center gap-4"><Bell size={20} className="text-gray-500 cursor-pointer" /><div className="flex items-center gap-2 cursor-pointer"><div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">A</div><ChevronDown size={16} className="text-gray-500" /></div></div>
          </header>

          <div className="p-6 pb-0"><h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1><p className="text-gray-500 text-sm">Welcome back, Super Admin</p></div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {stats.map((s, i) => (<div key={i} className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-primary hover:shadow-md transition"><div className="flex justify-between items-start"><div><p className="text-2xl font-bold">{s.value}</p><p className="text-sm text-gray-500">{s.title}</p></div><div className={`p-2 rounded-lg ${s.color}`}>{s.icon}</div></div><p className="text-xs text-green-600 mt-2">{s.change} vs last month</p></div>))}
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm mb-6"><div className="flex justify-between items-center mb-3"><h3 className="font-bold text-gray-800">Recent Members</h3><Link href="/admin/members"><button className="text-primary text-sm hover:underline">View All</button></Link></div>
              <div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-gray-50"><tr><th className="p-2 text-left">Name</th><th className="p-2 text-left">Email</th><th className="p-2 text-left">Type</th><th className="p-2 text-left">Status</th></tr></thead>
              <tbody>{recentMembers.map((m, i) => (<tr key={i} className="border-b"><td className="p-2 font-medium">{m.name}</td><td className="p-2">{m.email}</td><td className="p-2"><span className={`px-2 py-1 rounded-full text-xs ${m.type === 'Gold' ? 'bg-yellow-100 text-yellow-700' : m.type === 'Silver' ? 'bg-gray-100 text-gray-700' : 'bg-orange-100 text-orange-700'}`}>{m.type}</span></td><td className="p-2"><span className={`px-2 py-1 rounded-full text-xs ${m.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{m.status}</span></td></tr>))}</tbody></table></div></div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-4 shadow-sm"><h3 className="font-bold mb-3 text-gray-800">Revenue Overview</h3><p className="text-3xl font-bold text-primary">₹82.5L</p><p className="text-sm text-green-600">↑ 15% vs last month</p><div className="mt-4 h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 flex-col"><TrendingUp size={32} /><p className="text-sm mt-2">Revenue Chart</p><p className="text-xs">01 May - 31 May</p></div></div>
              <div className="bg-white rounded-xl p-4 shadow-sm"><h3 className="font-bold mb-3 text-gray-800">Membership Overview</h3><div className="space-y-3">{membershipData.map((m, i) => (<div key={i}><div className="flex justify-between text-sm"><span>{m.tier}</span><span>{m.count} ({m.percentage}%)</span></div><div className="h-2 bg-gray-200 rounded-full mt-1"><div className={`h-2 rounded-full ${m.color}`} style={{ width: `${m.percentage}%` }}></div></div></div>))}</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
