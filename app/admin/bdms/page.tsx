'use client'
import { useState } from 'react'
import { Search, Eye, Edit, Trash2, UserPlus, X, Filter, Target, TrendingUp, DollarSign } from 'lucide-react'

export default function BDMsManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [zoneFilter, setZoneFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newBDM, setNewBDM] = useState({ name: '', email: '', phone: '', zone: 'North', target: 15000000, commission: 12, status: 'active' })

  const [bdms, setBdms] = useState([
    { id: 1, name: 'Amit Verma', email: 'amit@gce.com', phone: '9876543210', zone: 'North', target: 15000000, achieved: 8200000, commission: 12, status: 'active' },
    { id: 2, name: 'Priya Sharma', email: 'priya@gce.com', phone: '9876543211', zone: 'South', target: 15000000, achieved: 9100000, commission: 12, status: 'active' },
  ])

  const handleAddBDM = () => {
    if (!newBDM.name || !newBDM.email) { alert('Please fill name and email'); return }
    const newId = Math.max(...bdms.map(b => b.id), 0) + 1
    const bdm = { id: newId, ...newBDM, achieved: 0 }
    setBdms([bdm, ...bdms])
    setShowAddModal(false)
    setNewBDM({ name: '', email: '', phone: '', zone: 'North', target: 15000000, commission: 12, status: 'active' })
    alert('BDM added successfully!')
  }

  const filteredBDMs = bdms.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesZone = zoneFilter === 'all' || b.zone === zoneFilter
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter
    return matchesSearch && matchesZone && matchesStatus
  })

  const zones = ['North', 'South', 'East', 'West', 'Center']

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6"><h1 className="text-2xl font-bold">BDMs Management</h1><button onClick={() => setShowAddModal(true)} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2"><UserPlus size={18} /> Add BDM</button></div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm"><div className="flex items-center gap-3"><Target size={24} className="text-primary" /><div><p className="text-2xl font-bold">{bdms.length}</p><p className="text-sm">Total BDMs</p></div></div></div>
        <div className="bg-white rounded-xl p-4 shadow-sm"><div className="flex items-center gap-3"><TrendingUp size={24} className="text-green-500" /><div><p className="text-2xl font-bold">{(bdms.filter(b => b.status === 'active').length)}</p><p className="text-sm">Active</p></div></div></div>
        <div className="bg-white rounded-xl p-4 shadow-sm"><div className="flex items-center gap-3"><DollarSign size={24} className="text-purple-500" /><div><p className="text-2xl font-bold">₹{(bdms.reduce((s,b) => s + b.achieved, 0)/100000).toFixed(1)}L</p><p className="text-sm">Total Achieved</p></div></div></div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm mb-6"><div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative"><Search size={18} className="absolute left-3 top-2.5 text-gray-400" /><input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 border rounded" /></div>
        <select value={zoneFilter} onChange={(e) => setZoneFilter(e.target.value)} className="p-2 border rounded"><option value="all">All Zones</option>{zones.map(z => <option key={z} value={z}>{z}</option>)}</select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="p-2 border rounded"><option value="all">All Status</option><option value="active">Active</option><option value="probation">Probation</option></select>
        <button onClick={() => { setSearchTerm(''); setZoneFilter('all'); setStatusFilter('all') }} className="bg-gray-100 px-4 py-2 rounded flex items-center gap-2"><Filter size={18} /> Clear</button>
      </div></div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-gray-50"><tr><th className="p-3">Name</th><th className="p-3">Zone</th><th className="p-3">Target</th><th className="p-3">Achieved</th><th className="p-3">Commission</th><th className="p-3">Status</th><th className="p-3">Actions</th></tr></thead><tbody>{filteredBDMs.map(b => (<tr key={b.id} className="border-b"><td className="p-3"><div><p className="font-medium">{b.name}</p><p className="text-xs text-gray-400">{b.email}</p></div></td><td className="p-3">{b.zone}</td><td className="p-3">₹{(b.target/100000).toFixed(0)}L</td><td className="p-3">₹{(b.achieved/100000).toFixed(1)}L</td><td className="p-3">{b.commission}%</td><td className="p-3"><span className={`px-2 py-1 rounded-full text-xs ${b.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{b.status}</span></td><td className="p-3"><div className="flex gap-2"><button className="text-blue-500"><Eye size={18} /></button><button className="text-orange-500"><Edit size={18} /></button><button className="text-red-500"><Trash2 size={18} /></button></div></td></tr>))}</tbody></table></div></div>

      {showAddModal && (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-2xl max-w-md w-full p-6"><div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold">Add BDM</h3><button onClick={() => setShowAddModal(false)}><X size={24} /></button></div><div className="space-y-4"><input type="text" placeholder="Name" value={newBDM.name} onChange={(e) => setNewBDM({...newBDM, name: e.target.value})} className="w-full p-2 border rounded" /><input type="email" placeholder="Email" value={newBDM.email} onChange={(e) => setNewBDM({...newBDM, email: e.target.value})} className="w-full p-2 border rounded" /><input type="tel" placeholder="Phone" value={newBDM.phone} onChange={(e) => setNewBDM({...newBDM, phone: e.target.value})} className="w-full p-2 border rounded" /><select value={newBDM.zone} onChange={(e) => setNewBDM({...newBDM, zone: e.target.value})} className="w-full p-2 border rounded">{zones.map(z => <option key={z} value={z}>{z}</option>)}</select><input type="number" placeholder="Target (₹)" value={newBDM.target} onChange={(e) => setNewBDM({...newBDM, target: parseInt(e.target.value)})} className="w-full p-2 border rounded" /><input type="number" placeholder="Commission %" value={newBDM.commission} onChange={(e) => setNewBDM({...newBDM, commission: parseInt(e.target.value)})} className="w-full p-2 border rounded" /><select value={newBDM.status} onChange={(e) => setNewBDM({...newBDM, status: e.target.value})} className="w-full p-2 border rounded"><option value="active">Active</option><option value="probation">Probation</option></select><button onClick={handleAddBDM} className="w-full bg-primary text-white py-2 rounded">Add BDM</button></div></div></div>)}
    </div>
  )
}
