'use client'
import { useState } from 'react'
import { Search, Eye, Edit, Trash2, UserPlus, X, Filter } from 'lucide-react'

export default function MembersManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newMember, setNewMember] = useState({ name: '', email: '', phone: '', type: 'Silver', status: 'active' })

  const [members, setMembers] = useState([
    { id: 1, name: 'Rohan Mehta', email: 'rohan@gmail.com', phone: '9876543210', type: 'Gold', status: 'active', joined: '23 May 2025' },
    { id: 2, name: 'Neha Kapoor', email: 'neha@gmail.com', phone: '9876543211', type: 'Silver', status: 'active', joined: '22 May 2025' },
    { id: 3, name: 'Vikram Singh', email: 'vikram@gmail.com', phone: '9876543212', type: 'Business', status: 'active', joined: '21 May 2025' },
  ])

  const handleAddMember = () => {
    if (!newMember.name || !newMember.email) {
      alert('Please fill name and email')
      return
    }
    const newId = Math.max(...members.map(m => m.id), 0) + 1
    const member = {
      id: newId,
      name: newMember.name,
      email: newMember.email,
      phone: newMember.phone || 'Not provided',
      type: newMember.type,
      status: newMember.status,
      joined: new Date().toLocaleDateString()
    }
    setMembers([member, ...members])
    setShowAddModal(false)
    setNewMember({ name: '', email: '', phone: '', type: 'Silver', status: 'active' })
    alert('Member added successfully!')
  }

  const filteredMembers = members.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'all' || m.type === typeFilter
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  const getTypeBadge = (type: string) => {
    const colors = { Gold: 'bg-yellow-100 text-yellow-700', Silver: 'bg-gray-100 text-gray-700', Business: 'bg-orange-100 text-orange-700' }
    return <span className={`px-2 py-1 rounded-full text-xs ${colors[type as keyof typeof colors]}`}>{type}</span>
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Members Management</h1>
        <button onClick={() => setShowAddModal(true)} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2"><UserPlus size={18} /> Add Member</button>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative"><Search size={18} className="absolute left-3 top-2.5 text-gray-400" /><input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 border rounded-lg" /></div>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="p-2 border rounded-lg"><option value="all">All Types</option><option value="Gold">Gold</option><option value="Silver">Silver</option><option value="Business">Business</option></select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="p-2 border rounded-lg"><option value="all">All Status</option><option value="active">Active</option><option value="inactive">Inactive</option></select>
          <button onClick={() => { setSearchTerm(''); setTypeFilter('all'); setStatusFilter('all') }} className="bg-gray-100 px-4 py-2 rounded-lg flex items-center gap-2"><Filter size={18} /> Clear</button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr><th className="p-3 text-left">Name</th><th className="p-3 text-left">Email</th><th className="p-3 text-left">Type</th><th className="p-3 text-left">Status</th><th className="p-3 text-center">Actions</th></tr>
            </thead>
            <tbody>
              {filteredMembers.map(m => (
                <tr key={m.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{m.name}</td>
                  <td className="p-3">{m.email}</td>
                  <td className="p-3">{getTypeBadge(m.type)}</td>
                  <td className="p-3"><span className={`px-2 py-1 rounded-full text-xs ${m.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{m.status}</span></td>
                  <td className="p-3 text-center"><div className="flex justify-center gap-2"><button className="text-blue-500"><Eye size={18} /></button><button className="text-orange-500"><Edit size={18} /></button><button className="text-red-500"><Trash2 size={18} /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold">Add Member</h3><button onClick={() => setShowAddModal(false)}><X size={24} /></button></div>
            <div className="space-y-4">
              <input type="text" placeholder="Name" value={newMember.name} onChange={(e) => setNewMember({...newMember, name: e.target.value})} className="w-full p-2 border rounded" />
              <input type="email" placeholder="Email" value={newMember.email} onChange={(e) => setNewMember({...newMember, email: e.target.value})} className="w-full p-2 border rounded" />
              <input type="tel" placeholder="Phone" value={newMember.phone} onChange={(e) => setNewMember({...newMember, phone: e.target.value})} className="w-full p-2 border rounded" />
              <select value={newMember.type} onChange={(e) => setNewMember({...newMember, type: e.target.value})} className="w-full p-2 border rounded"><option>Silver</option><option>Gold</option><option>Business</option></select>
              <select value={newMember.status} onChange={(e) => setNewMember({...newMember, status: e.target.value})} className="w-full p-2 border rounded"><option value="active">Active</option><option value="inactive">Inactive</option></select>
              <button onClick={handleAddMember} className="w-full bg-primary text-white py-2 rounded">Add Member</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
