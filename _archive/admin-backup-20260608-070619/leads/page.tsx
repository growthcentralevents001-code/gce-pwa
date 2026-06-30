'use client'
import { useState } from 'react'
import { Search, Eye, Filter, CheckCircle, XCircle, Clock, Target } from 'lucide-react'

export default function LeadsManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [zoneFilter, setZoneFilter] = useState('all')

  const [leads, setLeads] = useState([
    { id: 1, business: 'Tech Solutions', contact: 'Rajesh Kumar', bdm: 'Amit Verma', zone: 'North', source: 'Event', date: '23 May 2025', proof: 'Screenshot attached', status: 'pending' },
    { id: 2, business: 'Digital Marketing Pro', contact: 'Neha Sharma', bdm: 'Neha Shah', zone: 'South', source: 'Referral', date: '22 May 2025', proof: 'Email confirmation', status: 'pending' },
    { id: 3, business: 'Real Estate Group', contact: 'Rahul Mehta', bdm: 'Riya Malhotra', zone: 'East', source: 'Website', date: '21 May 2025', proof: 'Meeting link', status: 'approved' },
    { id: 4, business: 'HR Solutions India', contact: 'Pooja Iyer', bdm: 'Pooja Iyer', zone: 'West', source: 'LinkedIn', date: '20 May 2025', proof: 'Screenshot', status: 'rejected' },
    { id: 5, business: 'IT Services Inc', contact: 'Vikram Singh', bdm: 'Vikram Singh', zone: 'Center', source: 'Conference', date: '19 May 2025', proof: 'Email thread', status: 'pending' },
  ])

  const handleApprove = (id: number) => {
    setLeads(leads.map(l => l.id === id ? { ...l, status: 'approved' } : l))
    alert('Lead approved successfully!')
  }

  const handleReject = (id: number) => {
    setLeads(leads.map(l => l.id === id ? { ...l, status: 'rejected' } : l))
    alert('Lead rejected!')
  }

  const filteredLeads = leads.filter(l => {
    const matchesSearch = l.business.toLowerCase().includes(searchTerm.toLowerCase()) || l.bdm.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || l.status === statusFilter
    const matchesZone = zoneFilter === 'all' || l.zone === zoneFilter
    return matchesSearch && matchesStatus && matchesZone
  })

  const zones = ['North', 'South', 'East', 'West', 'Center']
  const stats = {
    total: leads.length,
    pending: leads.filter(l => l.status === 'pending').length,
    approved: leads.filter(l => l.status === 'approved').length,
    rejected: leads.filter(l => l.status === 'rejected').length,
  }

  return (
    <div className="p-6">
      <div className="mb-6"><h1 className="text-2xl font-bold text-gray-800">Leads Management</h1><p className="text-gray-500 text-sm">Verify BDM lead submissions</p></div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-primary"><div className="flex items-center gap-3"><Target size={24} className="text-primary" /><div><p className="text-2xl font-bold">{stats.total}</p><p className="text-sm">Total Leads</p></div></div></div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-yellow-500"><div className="flex items-center gap-3"><Clock size={24} className="text-yellow-500" /><div><p className="text-2xl font-bold">{stats.pending}</p><p className="text-sm">Pending</p></div></div></div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-green-500"><div className="flex items-center gap-3"><CheckCircle size={24} className="text-green-500" /><div><p className="text-2xl font-bold">{stats.approved}</p><p className="text-sm">Approved</p></div></div></div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-red-500"><div className="flex items-center gap-3"><XCircle size={24} className="text-red-500" /><div><p className="text-2xl font-bold">{stats.rejected}</p><p className="text-sm">Rejected</p></div></div></div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative"><Search size={18} className="absolute left-3 top-2.5 text-gray-400" /><input type="text" placeholder="Search by business or BDM..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 border rounded-lg" /></div>
          <select value={zoneFilter} onChange={(e) => setZoneFilter(e.target.value)} className="p-2 border rounded-lg"><option value="all">All Zones</option>{zones.map(z => <option key={z} value={z}>{z}</option>)}</select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="p-2 border rounded-lg"><option value="all">All Status</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option></select>
          <button onClick={() => { setSearchTerm(''); setZoneFilter('all'); setStatusFilter('all') }} className="bg-gray-100 px-4 py-2 rounded-lg flex items-center gap-2"><Filter size={18} /> Clear</button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr><th className="p-3 text-left">Business</th><th className="p-3 text-left">BDM</th><th className="p-3 text-left">Zone</th><th className="p-3 text-left">Source</th><th className="p-3 text-left">Date</th><th className="p-3 text-left">Status</th><th className="p-3 text-center">Actions</th></tr>
            </thead>
            <tbody>
              {filteredLeads.map(l => (
                <tr key={l.id} className="border-b hover:bg-gray-50">
                  <td className="p-3"><div><p className="font-medium">{l.business}</p><p className="text-xs text-gray-400">Contact: {l.contact}</p></div></td>
                  <td className="p-3">{l.bdm}</td>
                  <td className="p-3">{l.zone}</td>
                  <td className="p-3">{l.source}</td>
                  <td className="p-3">{l.date}</td>
                  <td className="p-3"><span className={`px-2 py-1 rounded-full text-xs ${l.status === 'approved' ? 'bg-green-100 text-green-700' : l.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{l.status}</span></td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button className="text-blue-500"><Eye size={18} /></button>
                      {l.status === 'pending' && (
                        <>
                          <button onClick={() => handleApprove(l.id)} className="text-green-500"><CheckCircle size={18} /></button>
                          <button onClick={() => handleReject(l.id)} className="text-red-500"><XCircle size={18} /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t flex justify-between items-center">
          <p className="text-sm text-gray-500">Showing {filteredLeads.length} of {leads.length} leads</p>
          <div className="flex gap-2"><button className="px-3 py-1 border rounded">Previous</button><button className="px-3 py-1 bg-primary text-white rounded">1</button><button className="px-3 py-1 border rounded">Next</button></div>
        </div>
      </div>
    </div>
  )
}
