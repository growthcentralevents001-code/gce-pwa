'use client'
import { useState } from 'react'
import { Search, Filter, Download, Clock, User, Shield, Activity, Eye, ChevronDown } from 'lucide-react'

export default function SystemLogs() {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [dateRange, setDateRange] = useState('7days')

  const [logs, setLogs] = useState([
    { id: 1, timestamp: '2026-05-07 10:30:25', user: 'admin@gce.com', action: 'Created new event "Startup Networking Meetup"', type: 'admin_action', ip: '103.58.32.11', status: 'success' },
    { id: 2, timestamp: '2026-05-07 09:15:42', user: 'rohan@gmail.com', action: 'Logged in successfully', type: 'user_login', ip: '106.219.67.103', status: 'success' },
    { id: 3, timestamp: '2026-05-06 18:45:10', user: 'neha@gmail.com', action: 'Failed login attempt', type: 'security', ip: '45.112.68.91', status: 'failed' },
    { id: 4, timestamp: '2026-05-06 14:20:33', user: 'admin@gce.com', action: 'Updated membership plan prices', type: 'admin_action', ip: '103.58.32.11', status: 'success' },
    { id: 5, timestamp: '2026-05-05 22:10:15', user: 'System', action: 'Database backup completed', type: 'system', ip: 'localhost', status: 'success' },
    { id: 6, timestamp: '2026-05-05 16:30:22', user: 'vikram@gmail.com', action: 'Registered for event AI Summit', type: 'user_action', ip: '59.89.45.67', status: 'success' },
    { id: 7, timestamp: '2026-05-04 11:05:08', user: 'admin@gce.com', action: 'Approved partner "FreshMart Pvt Ltd"', type: 'admin_action', ip: '103.58.32.11', status: 'success' },
    { id: 8, timestamp: '2026-05-04 08:45:30', user: 'priya@gmail.com', action: 'Password changed successfully', type: 'security', ip: '122.162.34.78', status: 'success' },
  ])

  const filteredLogs = logs.filter(l => {
    const matchesSearch = l.user.toLowerCase().includes(searchTerm.toLowerCase()) || l.action.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'all' || l.type === typeFilter
    return matchesSearch && matchesType
  })

  const stats = {
    total: logs.length,
    adminActions: logs.filter(l => l.type === 'admin_action').length,
    userLogins: logs.filter(l => l.type === 'user_login').length,
    security: logs.filter(l => l.type === 'security').length,
  }

  const getTypeBadge = (type: string) => {
    const colors = { admin_action: 'bg-purple-100 text-purple-700', user_login: 'bg-blue-100 text-blue-700', user_action: 'bg-green-100 text-green-700', security: 'bg-red-100 text-red-700', system: 'bg-gray-100 text-gray-700' }
    const labels = { admin_action: 'Admin', user_login: 'Login', user_action: 'User', security: 'Security', system: 'System' }
    return <span className={`px-2 py-1 rounded-full text-xs ${colors[type as keyof typeof colors]}`}>{labels[type as keyof typeof labels]}</span>
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div><h1 className="text-2xl font-bold text-gray-800">System Logs</h1><p className="text-gray-500 text-sm">Track all platform activities and security events</p></div>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm"><Download size={16} /> Export Logs</button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-primary"><div className="flex items-center gap-3"><Activity size={24} className="text-primary" /><div><p className="text-2xl font-bold">{stats.total}</p><p className="text-sm">Total Events</p></div></div></div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-purple-500"><div className="flex items-center gap-3"><Shield size={24} className="text-purple-500" /><div><p className="text-2xl font-bold">{stats.adminActions}</p><p className="text-sm">Admin Actions</p></div></div></div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-blue-500"><div className="flex items-center gap-3"><User size={24} className="text-blue-500" /><div><p className="text-2xl font-bold">{stats.userLogins}</p><p className="text-sm">User Logins</p></div></div></div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-red-500"><div className="flex items-center gap-3"><Eye size={24} className="text-red-500" /><div><p className="text-2xl font-bold">{stats.security}</p><p className="text-sm">Security Events</p></div></div></div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative"><Search size={18} className="absolute left-3 top-2.5 text-gray-400" /><input type="text" placeholder="Search by user or action..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 border rounded-lg" /></div>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="p-2 border rounded-lg"><option value="all">All Types</option><option value="admin_action">Admin Actions</option><option value="user_login">User Logins</option><option value="user_action">User Actions</option><option value="security">Security</option><option value="system">System</option></select>
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="p-2 border rounded-lg"><option value="7days">Last 7 days</option><option value="30days">Last 30 days</option><option value="90days">Last 90 days</option></select>
          <button onClick={() => { setSearchTerm(''); setTypeFilter('all') }} className="bg-gray-100 px-4 py-2 rounded-lg flex items-center gap-2"><Filter size={18} /> Clear</button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr><th className="p-3 text-left">Timestamp</th><th className="p-3 text-left">User</th><th className="p-3 text-left">Action</th><th className="p-3 text-left">Type</th><th className="p-3 text-left">IP Address</th><th className="p-3 text-left">Status</th></tr>
            </thead>
            <tbody>
              {filteredLogs.map(l => (
                <tr key={l.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-mono text-xs">{l.timestamp}</td>
                  <td className="p-3"><div className="flex items-center gap-2">{l.user}</div></td>
                  <td className="p-3">{l.action}</td>
                  <td className="p-3">{getTypeBadge(l.type)}</td>
                  <td className="p-3 font-mono text-xs">{l.ip}</td>
                  <td className="p-3"><span className={`px-2 py-1 rounded-full text-xs ${l.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{l.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t flex justify-between items-center">
          <p className="text-sm text-gray-500">Showing {filteredLogs.length} of {logs.length} logs</p>
          <div className="flex gap-2"><button className="px-3 py-1 border rounded">Previous</button><button className="px-3 py-1 bg-primary text-white rounded">1</button><button className="px-3 py-1 border rounded">Next</button></div>
        </div>
      </div>

      {/* Export Modal Suggestion */}
      <div className="mt-4 text-center text-xs text-gray-400">📋 Logs are automatically rotated every 30 days</div>
    </div>
  )
}
