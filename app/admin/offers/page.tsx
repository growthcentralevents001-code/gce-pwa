'use client'
import { useState } from 'react'
import { Search, Eye, Edit, Trash2, Plus, X, Filter, Gift, Tag, Calendar, DollarSign } from 'lucide-react'

export default function OffersManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null)
  
  const [newOffer, setNewOffer] = useState({ 
    code: '', discount: '', description: '', supplier: '', claimed: 0, limit: 10, expiry: '', category: 'Dining', status: 'active'
  })

  const [offers, setOffers] = useState([
    { id: 1, code: 'GCE20', discount: '20% OFF', description: 'on all products', supplier: 'FreshMart Pvt Ltd', claimed: 4, limit: 10, expiry: '25 May 2025', category: 'Dining', status: 'active' },
    { id: 2, code: 'TECH15', discount: '15% OFF', description: 'on gadgets', supplier: 'TechZone', claimed: 4, limit: 10, expiry: '28 May 2025', category: 'Electronics', status: 'active' },
    { id: 3, code: 'ORG10', discount: '10% OFF', description: 'on organic items', supplier: 'Organic Bazaar', claimed: 4, limit: 10, expiry: '31 May 2025', category: 'Grocery', status: 'active' },
    { id: 4, code: 'FIT20', discount: '20% OFF', description: 'on fitness gear', supplier: 'FitLife Supplies', claimed: 4, limit: 10, expiry: '29 May 2025', category: 'Fitness', status: 'expired' },
  ])

  const handleAddOffer = () => {
    if (!newOffer.code || !newOffer.discount || !newOffer.supplier) { alert('Please fill required fields'); return }
    const newId = Math.max(...offers.map(o => o.id), 0) + 1
    const offer = { id: newId, ...newOffer, claimed: 0 }
    setOffers([offer, ...offers])
    setShowAddModal(false)
    setNewOffer({ code: '', discount: '', description: '', supplier: '', claimed: 0, limit: 10, expiry: '', category: 'Dining', status: 'active' })
    alert('Offer created successfully!')
  }

  const handleDeleteOffer = (id: number) => {
    setOffers(offers.filter(o => o.id !== id))
    setShowDeleteConfirm(null)
    alert('Offer deleted successfully!')
  }

  const filteredOffers = offers.filter(o => {
    const matchesSearch = o.code.toLowerCase().includes(searchTerm.toLowerCase()) || o.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const categories = ['Dining', 'Electronics', 'Grocery', 'Fitness', 'Travel', 'Wellness']

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Offers Management (Dropshipping)</h1>
        <button onClick={() => setShowAddModal(true)} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2"><Plus size={18} /> Create Offer</button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-primary"><div className="flex items-center gap-3"><Gift size={24} className="text-primary" /><div><p className="text-2xl font-bold">{offers.length}</p><p className="text-sm">Total Offers</p></div></div></div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-green-500"><div className="flex items-center gap-3"><Tag size={24} className="text-green-500" /><div><p className="text-2xl font-bold">{offers.filter(o => o.status === 'active').length}</p><p className="text-sm">Active Offers</p></div></div></div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-red-500"><div className="flex items-center gap-3"><Calendar size={24} className="text-red-500" /><div><p className="text-2xl font-bold">{offers.filter(o => o.status === 'expired').length}</p><p className="text-sm">Expired</p></div></div></div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-purple-500"><div className="flex items-center gap-3"><DollarSign size={24} className="text-purple-500" /><div><p className="text-2xl font-bold">{offers.reduce((s,o) => s + o.claimed, 0)}</p><p className="text-sm">Total Claims</p></div></div></div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative"><Search size={18} className="absolute left-3 top-2.5 text-gray-400" /><input type="text" placeholder="Search by code or supplier..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 border rounded-lg" /></div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="p-2 border rounded-lg"><option value="all">All Status</option><option value="active">Active</option><option value="expired">Expired</option></select>
          <button onClick={() => { setSearchTerm(''); setStatusFilter('all') }} className="bg-gray-100 px-4 py-2 rounded-lg flex items-center gap-2"><Filter size={18} /> Clear</button>
        </div>
      </div>

      {/* Offers Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr><th className="p-3 text-left">Code</th><th className="p-3 text-left">Discount</th><th className="p-3 text-left">Supplier</th><th className="p-3 text-left">Claimed</th><th className="p-3 text-left">Expiry</th><th className="p-3 text-left">Category</th><th className="p-3 text-left">Status</th><th className="p-3 text-center">Actions</th></tr>
            </thead>
            <tbody>
              {filteredOffers.map(o => (
                <tr key={o.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-bold text-primary">{o.code}</td>
                  <td className="p-3">{o.discount}<br /><span className="text-xs text-gray-400">{o.description}</span></td>
                  <td className="p-3">{o.supplier}</td>
                  <td className="p-3">{o.claimed}/{o.limit} <div className="w-16 mt-1"><div className="h-1.5 bg-gray-200 rounded-full"><div className="h-1.5 bg-primary rounded-full" style={{ width: `${(o.claimed/o.limit)*100}%` }}></div></div></div></td>
                  <td className="p-3">{o.expiry}</td>
                  <td className="p-3"><span className="px-2 py-1 rounded-full text-xs bg-gray-100">{o.category}</span></td>
                  <td className="p-3"><span className={`px-2 py-1 rounded-full text-xs ${o.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{o.status}</span></td>
                  <td className="p-3 text-center"><div className="flex justify-center gap-2"><button className="text-blue-500"><Eye size={18} /></button><button className="text-orange-500"><Edit size={18} /></button><button onClick={() => setShowDeleteConfirm(o.id)} className="text-red-500"><Trash2 size={18} /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t flex justify-between items-center"><p className="text-sm text-gray-500">Showing {filteredOffers.length} of {offers.length} offers</p><div className="flex gap-2"><button className="px-3 py-1 border rounded">Previous</button><button className="px-3 py-1 bg-primary text-white rounded">1</button><button className="px-3 py-1 border rounded">Next</button></div></div>
      </div>

      {/* Add Offer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold">Create New Offer</h3><button onClick={() => setShowAddModal(false)}><X size={24} /></button></div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3"><input type="text" placeholder="Offer Code (e.g., GCE30) *" value={newOffer.code} onChange={(e) => setNewOffer({...newOffer, code: e.target.value.toUpperCase()})} className="p-2 border rounded" /><input type="text" placeholder="Discount (e.g., 20% OFF) *" value={newOffer.discount} onChange={(e) => setNewOffer({...newOffer, discount: e.target.value})} className="p-2 border rounded" /></div>
              <input type="text" placeholder="Description" value={newOffer.description} onChange={(e) => setNewOffer({...newOffer, description: e.target.value})} className="w-full p-2 border rounded" />
              <input type="text" placeholder="Supplier Name *" value={newOffer.supplier} onChange={(e) => setNewOffer({...newOffer, supplier: e.target.value})} className="w-full p-2 border rounded" />
              <div className="grid grid-cols-2 gap-3"><input type="number" placeholder="Claim Limit" value={newOffer.limit} onChange={(e) => setNewOffer({...newOffer, limit: parseInt(e.target.value)})} className="p-2 border rounded" /><input type="date" placeholder="Expiry Date" value={newOffer.expiry} onChange={(e) => setNewOffer({...newOffer, expiry: e.target.value})} className="p-2 border rounded" /></div>
              <select value={newOffer.category} onChange={(e) => setNewOffer({...newOffer, category: e.target.value})} className="w-full p-2 border rounded">{categories.map(c => <option key={c} value={c}>{c}</option>)}</select>
              <select value={newOffer.status} onChange={(e) => setNewOffer({...newOffer, status: e.target.value})} className="w-full p-2 border rounded"><option value="active">Active</option><option value="expired">Expired</option></select>
              <button onClick={handleAddOffer} className="w-full bg-primary text-white py-2 rounded font-semibold">Create Offer</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {showDeleteConfirm !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center">
            <h3 className="text-xl font-bold mb-2">Delete Offer?</h3>
            <p className="text-gray-500 mb-4">This action cannot be undone.</p>
            <div className="flex gap-3"><button onClick={() => handleDeleteOffer(showDeleteConfirm)} className="flex-1 bg-red-500 text-white py-2 rounded">Delete</button><button onClick={() => setShowDeleteConfirm(null)} className="flex-1 bg-gray-200 py-2 rounded">Cancel</button></div>
          </div>
        </div>
      )}
    </div>
  )
}
