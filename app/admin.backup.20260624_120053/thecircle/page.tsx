'use client'
import { useState } from 'react'
import { Search, Eye, Edit, Filter, Users, Target, AlertCircle, X, Plus } from 'lucide-react'

export default function TheCircleManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [zoneFilter, setZoneFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showSuspendConfirm, setShowSuspendConfirm] = useState<number | null>(null)
  
  const [members, setMembers] = useState([
    { id: 1, name: 'Amit Verma', profession: 'CA', company: 'RK & Co.', zone: 'North', leadsGiven: 12, leadsReceived: 8, meetingsAttended: 6, status: 'active', joined: 'Jan 2025' },
    { id: 2, name: 'Neha Shah', profession: 'Marketing Consultant', company: 'Neha Digital', zone: 'South', leadsGiven: 9, leadsReceived: 11, meetingsAttended: 5, status: 'active', joined: 'Jan 2025' },
    { id: 3, name: 'Riya Malhotra', profession: 'Real Estate', company: 'RM Properties', zone: 'East', leadsGiven: 7, leadsReceived: 6, meetingsAttended: 4, status: 'active', joined: 'Feb 2025' },
    { id: 4, name: 'Pooja Iyer', profession: 'HR Consultant', company: 'Pooja HR Solutions', zone: 'West', leadsGiven: 10, leadsReceived: 9, meetingsAttended: 6, status: 'probation', joined: 'Feb 2025' },
    { id: 5, name: 'Vikram Singh', profession: 'IT Services', company: 'VS Technologies', zone: 'Center', leadsGiven: 11, leadsReceived: 12, meetingsAttended: 5, status: 'active', joined: 'Mar 2025' },
  ])

  const [leads, setLeads] = useState([
    { id: 1, member: 'Amit Verma', business: 'Tech Solutions', contact: 'Rajesh', source: 'Event', date: '23 May 2025', status: 'pending' },
    { id: 2, member: 'Neha Shah', business: 'Digital Marketing Pro', contact: 'Neha', source: 'Referral', date: '22 May 2025', status: 'approved' },
    { id: 3, member: 'Riya Malhotra', business: 'Real Estate Group', contact: 'Rahul', source: 'Website', date: '21 May 2025', status: 'pending' },
  ])

  const handleSuspendMember = (id: number) => {
    setMembers(members.map(m => m.id === id ? { ...m, status: 'suspended' } : m))
    setShowSuspendConfirm(null)
    alert('Member suspended successfully!')
  }

  const [newMember, setNewMember] = useState({ name: '', profession: '', company: '', zone: 'North' })

  const handleAddMember = () => {
    if (!newMember.name || !newMember.profession) { alert('Please fill required fields'); return }
    const newId = Math.max(...members.map(m => m.id), 0) + 1
    const member = { id: newId, ...newMember, leadsGiven: 0, leadsReceived: 0, meetingsAttended: 0, status: 'active', joined: new Date().toLocaleDateString() }
    setMembers([member, ...members])
    setShowAddModal(false)
    setNewMember({ name: '', profession: '', company: '', zone: 'North' })
    alert('Member added successfully!')
  }

  const filteredMembers = members.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter
    const matchesZone = zoneFilter === 'all' || m.zone === zoneFilter
    return matchesSearch && matchesStatus && matchesZone
  })

  const zones = ['North', 'South', 'East', 'West', 'Center']

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">The Circle Management</h1>
        <button onClick={() => setShowAddModal(true)} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2"><Plus size={18} /> Add Member</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-primary"><div className="flex items-center gap-3"><Users size={24} className="text-primary" /><div><p className="text-2xl font-bold">{members.length}</p><p className="text-sm">Total Members</p></div></div></div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-green-500"><div className="flex items-center gap-3"><Users size={24} className="text-green-500" /><div><p className="text-2xl font-bold">{members.filter(m => m.status === 'active').length}</p><p className="text-sm">Active</p></div></div></div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-yellow-500"><div className="flex items-center gap-3"><AlertCircle size={24} className="text-yellow-500" /><div><p className="text-2xl font-bold">{members.filter(m => m.status === 'probation').length}</p><p className="text-sm">On Probation</p></div></div></div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative"><Search size={18} className="absolute left-3 top-2.5 text-gray-400" /><input type="text" placeholder="Search by name or company..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 border rounded-lg" /></div>
          <select value={zoneFilter} onChange={(e) => setZoneFilter(e.target.value)} className="p-2 border rounded-lg"><option value="all">All Zones</option>{zones.map(z => <option key={z} value={z}>{z}</option>)}</select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="p-2 border rounded-lg"><option value="all">All Status</option><option value="active">Active</option><option value="probation">Probation</option><option value="suspended">Suspended</option></select>
          <button onClick={() => { setSearchTerm(''); setZoneFilter('all'); setStatusFilter('all') }} className="bg-gray-100 px-4 py-2 rounded-lg flex items-center gap-2"><Filter size={18} /> Clear</button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr><th className="p-3 text-left">Member</th><th className="p-3 text-left">Profession</th><th className="p-3 text-left">Company</th><th className="p-3 text-left">Zone</th><th className="p-3 text-center">Leads Given</th><th className="p-3 text-center">Leads Received</th><th className="p-3 text-center">Meetings</th><th className="p-3 text-left">Status</th><th className="p-3 text-center">Actions</th></tr>
            </thead>
            <tbody>
              {filteredMembers.map(m => (
                <tr key={m.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{m.name}</td>
                  <td className="p-3">{m.profession}</td>
                  <td className="p-3">{m.company}</td>
                  <td className="p-3">{m.zone}</td>
                  <td className="p-3 text-center">{m.leadsGiven}</td>
                  <td className="p-3 text-center">{m.leadsReceived}</td>
                  <td className="p-3 text-center">{m.meetingsAttended}</td>
                  <td className="p-3"><span className={`px-2 py-1 rounded-full text-xs ${m.status === 'active' ? 'bg-green-100 text-green-700' : m.status === 'probation' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{m.status}</span></td>
                  <td className="p-3 text-center"><div className="flex justify-center gap-2"><button className="text-blue-500"><Eye size={18} /></button><button className="text-orange-500"><Edit size={18} /></button>{m.status !== 'suspended' && <button onClick={() => setShowSuspendConfirm(m.id)} className="text-red-500"><AlertCircle size={18} /></button>}</div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t flex justify-between items-center"><p className="text-sm text-gray-500">Showing {filteredMembers.length} of {members.length} members</p><div className="flex gap-2"><button className="px-3 py-1 border rounded">Previous</button><button className="px-3 py-1 bg-primary text-white rounded">1</button><button className="px-3 py-1 border rounded">Next</button></div></div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold">Add Circle Member</h3><button onClick={() => setShowAddModal(false)}><X size={24} /></button></div>
            <div className="space-y-4">
              <input type="text" placeholder="Full Name *" value={newMember.name} onChange={(e) => setNewMember({...newMember, name: e.target.value})} className="w-full p-2 border rounded" />
              <input type="text" placeholder="Profession *" value={newMember.profession} onChange={(e) => setNewMember({...newMember, profession: e.target.value})} className="w-full p-2 border rounded" />
              <input type="text" placeholder="Company Name" value={newMember.company} onChange={(e) => setNewMember({...newMember, company: e.target.value})} className="w-full p-2 border rounded" />
              <select value={newMember.zone} onChange={(e) => setNewMember({...newMember, zone: e.target.value})} className="w-full p-2 border rounded">{zones.map(z => <option key={z} value={z}>{z}</option>)}</select>
              <button onClick={handleAddMember} className="w-full bg-primary text-white py-2 rounded font-semibold">Add Member</button>
            </div>
          </div>
        </div>
      )}

      {showSuspendConfirm !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center">
            <h3 className="text-xl font-bold mb-2">Suspend Member?</h3>
            <p className="text-gray-500 mb-4">Member will lose access to The Circle.</p>
            <div className="flex gap-3"><button onClick={() => handleSuspendMember(showSuspendConfirm)} className="flex-1 bg-red-500 text-white py-2 rounded">Suspend</button><button onClick={() => setShowSuspendConfirm(null)} className="flex-1 bg-gray-200 py-2 rounded">Cancel</button></div>
          </div>
        </div>
      )}
    </div>
  )
}
