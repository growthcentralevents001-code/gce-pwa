'use client'
import { useState } from 'react'
import { Search, Eye, Edit, Trash2, UserPlus, X, Filter, Building, CheckCircle, XCircle } from 'lucide-react'

export default function PartnersManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [tierFilter, setTierFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showApproveModal, setShowApproveModal] = useState<number | null>(null)
  const [newPartner, setNewPartner] = useState({ name: '', email: '', phone: '', type: 'Venue', tier: 'Basic', status: 'pending' })

  const [partners, setPartners] = useState([
    { id: 1, name: 'WeWork India', email: 'contact@wework.com', phone: '9876543210', type: 'Venue', tier: 'Gold', status: 'approved', revenue: 125000, joined: '01 Jan 2025' },
    { id: 2, name: 'Taj Hotels', email: 'events@taj.com', phone: '9876543211', type: 'Venue', tier: 'Silver', status: 'approved', revenue: 89000, joined: '15 Jan 2025' },
    { id: 3, name: 'FreshMart Pvt Ltd', email: 'info@freshmart.com', phone: '9876543212', type: 'Supplier', tier: 'Basic', status: 'pending', revenue: 0, joined: '01 Feb 2025' },
    { id: 4, name: 'TechZone', email: 'sales@techzone.com', phone: '9876543213', type: 'Supplier', tier: 'Silver', status: 'approved', revenue: 45000, joined: '10 Feb 2025' },
    { id: 5, name: 'Organic Bazaar', email: 'hello@organicbazaar.com', phone: '9876543214', type: 'Supplier', tier: 'Basic', status: 'pending', revenue: 0, joined: '20 Mar 2025' },
  ])

  const handleAddPartner = () => {
    if (!newPartner.name || !newPartner.email) { alert('Please fill name and email'); return }
    const newId = Math.max(...partners.map(p => p.id), 0) + 1
    const partner = { id: newId, ...newPartner, revenue: 0, joined: new Date().toLocaleDateString() }
    setPartners([partner, ...partners])
    setShowAddModal(false)
    setNewPartner({ name: '', email: '', phone: '', type: 'Venue', tier: 'Basic', status: 'pending' })
    alert('Partner added successfully!')
  }

  const handleApprovePartner = (id: number) => {
    setPartners(partners.map(p => p.id === id ? { ...p, status: 'approved' } : p))
    setShowApproveModal(null)
    alert('Partner approved successfully!')
  }

  const handleDeletePartner = (id: number) => {
    if (confirm('Are you sure you want to delete this partner?')) {
      setPartners(partners.filter(p => p.id !== id))
      alert('Partner deleted successfully!')
    }
  }

  const filteredPartners = partners.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTier = tierFilter === 'all' || p.tier === tierFilter
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter
    return matchesSearch && matchesTier && matchesStatus
  })

  const getTierBadge = (tier: string) => {
    const colors = { Gold: 'bg-yellow-100 text-yellow-700', Silver: 'bg-gray-100 text-gray-700', Basic: 'bg-orange-100 text-orange-700' }
    return <span className={`px-2 py-1 rounded-full text-xs ${colors[tier as keyof typeof colors]}`}>{tier}</span>
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Partners Management</h1>
        <button onClick={() => setShowAddModal(true)} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2"><UserPlus size={18} /> Add Partner</button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm"><div className="flex items-center gap-3"><Building size={24} className="text-primary" /><div><p className="text-2xl font-bold">{partners.length}</p><p className="text-sm">Total Partners</p></div></div></div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-green-500"><div className="flex items-center gap-3"><CheckCircle size={24} className="text-green-500" /><div><p className="text-2xl font-bold">{partners.filter(p => p.status === 'approved').length}</p><p className="text-sm">Approved</p></div></div></div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-yellow-500"><div className="flex items-center gap-3"><XCircle size={24} className="text-yellow-500" /><div><p className="text-2xl font-bold">{partners.filter(p => p.status === 'pending').length}</p><p className="text-sm">Pending</p></div></div></div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-purple-500"><div className="flex items-center gap-3"><Building size={24} className="text-purple-500" /><div><p className="text-2xl font-bold">₹{(partners.reduce((s,p) => s + p.revenue, 0)/100000).toFixed(1)}L</p><p className="text-sm">Total Revenue</p></div></div></div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative"><Search size={18} className="absolute left-3 top-2.5 text-gray-400" /><input type="text" placeholder="Search by name or email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 border rounded-lg" /></div>
          <select value={tierFilter} onChange={(e) => setTierFilter(e.target.value)} className="p-2 border rounded-lg"><option value="all">All Tiers</option><option value="Gold">Gold</option><option value="Silver">Silver</option><option value="Basic">Basic</option></select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="p-2 border rounded-lg"><option value="all">All Status</option><option value="approved">Approved</option><option value="pending">Pending</option></select>
          <button onClick={() => { setSearchTerm(''); setTierFilter('all'); setStatusFilter('all') }} className="bg-gray-100 px-4 py-2 rounded-lg flex items-center gap-2"><Filter size={18} /> Clear</button>
        </div>
      </div>

      {/* Partners Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr><th className="p-3 text-left">Name</th><th className="p-3 text-left">Type</th><th className="p-3 text-left">Tier</th><th className="p-3 text-left">Status</th><th className="p-3 text-left">Revenue</th><th className="p-3 text-left">Joined</th><th className="p-3 text-center">Actions</th></tr>
            </thead>
            <tbody>
              {filteredPartners.map(p => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="p-3"><div><p className="font-medium">{p.name}</p><p className="text-xs text-gray-400">{p.email}</p></div></td>
                  <td className="p-3">{p.type}</td>
                  <td className="p-3">{getTierBadge(p.tier)}</td>
                  <td className="p-3"><span className={`px-2 py-1 rounded-full text-xs ${p.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{p.status}</span></td>
                  <td className="p-3">₹{(p.revenue/1000).toFixed(0)}K</td>
                  <td className="p-3">{p.joined}</td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button className="text-blue-500"><Eye size={18} /></button>
                      <button className="text-orange-500"><Edit size={18} /></button>
                      {p.status === 'pending' && <button onClick={() => setShowApproveModal(p.id)} className="text-green-500"><CheckCircle size={18} /></button>}
                      <button onClick={() => handleDeletePartner(p.id)} className="text-red-500"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t flex justify-between items-center"><p className="text-sm text-gray-500">Showing {filteredPartners.length} of {partners.length} partners</p><div className="flex gap-2"><button className="px-3 py-1 border rounded">Previous</button><button className="px-3 py-1 bg-primary text-white rounded">1</button><button className="px-3 py-1 border rounded">Next</button></div></div>
      </div>

      {/* Add Partner Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold">Add New Partner</h3><button onClick={() => setShowAddModal(false)}><X size={24} /></button></div>
            <div className="space-y-4">
              <input type="text" placeholder="Partner Name *" value={newPartner.name} onChange={(e) => setNewPartner({...newPartner, name: e.target.value})} className="w-full p-2 border rounded" />
              <input type="email" placeholder="Email *" value={newPartner.email} onChange={(e) => setNewPartner({...newPartner, email: e.target.value})} className="w-full p-2 border rounded" />
              <input type="tel" placeholder="Phone" value={newPartner.phone} onChange={(e) => setNewPartner({...newPartner, phone: e.target.value})} className="w-full p-2 border rounded" />
              <select value={newPartner.type} onChange={(e) => setNewPartner({...newPartner, type: e.target.value})} className="w-full p-2 border rounded"><option value="Venue">Venue / Hotel</option><option value="Supplier">Supplier / Vendor</option></select>
              <select value={newPartner.tier} onChange={(e) => setNewPartner({...newPartner, tier: e.target.value})} className="w-full p-2 border rounded"><option value="Basic">Basic</option><option value="Silver">Silver</option><option value="Gold">Gold</option></select>
              <button onClick={handleAddPartner} className="w-full bg-primary text-white py-2 rounded">Add Partner</button>
            </div>
          </div>
        </div>
      )}

      {/* Approve Confirm Modal */}
      {showApproveModal !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center">
            <div className="mb-4"><CheckCircle size={48} className="text-green-500 mx-auto" /></div>
            <h3 className="text-xl font-bold mb-2">Approve Partner?</h3>
            <p className="text-gray-500 mb-4">This partner will get access to partner dashboard.</p>
            <div className="flex gap-3"><button onClick={() => handleApprovePartner(showApproveModal)} className="flex-1 bg-green-500 text-white py-2 rounded">Approve</button><button onClick={() => setShowApproveModal(null)} className="flex-1 bg-gray-200 py-2 rounded">Cancel</button></div>
          </div>
        </div>
      )}
    </div>
  )
}
