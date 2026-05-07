'use client'
import { useState } from 'react'
import { Search, Filter, Star, CheckCircle, XCircle, Clock, User, Building, Users, Briefcase, Calendar } from 'lucide-react'

export default function RatingsModeration() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  const [ratings, setRatings] = useState([
    { id: 1, stakeholder: 'WeWork India', type: 'Venue', reviewer: 'Rohan Mehta', rating: 4.8, review: 'Great venue, excellent service!', date: '23 May 2025', status: 'approved' },
    { id: 2, stakeholder: 'Rohan Mehta', type: 'Member', reviewer: 'Admin', rating: 4.5, review: 'Active participant, great networking skills.', date: '22 May 2025', status: 'approved' },
    { id: 3, stakeholder: 'Amit Verma', type: 'BDM', reviewer: 'Neha Kapoor', rating: 4.2, review: 'Very helpful and responsive BDM.', date: '21 May 2025', status: 'pending' },
    { id: 4, stakeholder: 'FreshMart Pvt Ltd', type: 'Partner', reviewer: 'Vikram Singh', rating: 3.5, review: 'Good products but delivery was slow.', date: '20 May 2025', status: 'pending' },
    { id: 5, stakeholder: 'Startup Networking Meetup', type: 'Event', reviewer: 'Anjali Desai', rating: 4.9, review: 'Amazing event, great speakers!', date: '19 May 2025', status: 'approved' },
    { id: 6, stakeholder: 'Priya Sharma', type: 'Member', reviewer: 'Rajesh Kumar', rating: 5.0, review: 'Very professional and collaborative.', date: '18 May 2025', status: 'pending' },
  ])

  const handleApprove = (id: number) => {
    setRatings(ratings.map(r => r.id === id ? { ...r, status: 'approved' } : r))
    alert('Review approved successfully!')
  }

  const handleDelete = (id: number) => {
    setRatings(ratings.filter(r => r.id !== id))
    alert('Review deleted!')
  }

  const filteredRatings = ratings.filter(r => {
    const matchesSearch = r.stakeholder.toLowerCase().includes(searchTerm.toLowerCase()) || r.reviewer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter
    const matchesType = typeFilter === 'all' || r.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const stats = {
    total: ratings.length,
    pending: ratings.filter(r => r.status === 'pending').length,
    approved: ratings.filter(r => r.status === 'approved').length,
    avgRating: (ratings.reduce((s, r) => s + r.rating, 0) / ratings.length).toFixed(1),
  }

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'Venue': return <Building size={14} className="inline mr-1 text-gray-500" />
      case 'Member': return <Users size={14} className="inline mr-1 text-gray-500" />
      case 'BDM': return <Briefcase size={14} className="inline mr-1 text-gray-500" />
      case 'Partner': return <User size={14} className="inline mr-1 text-gray-500" />
      case 'Event': return <Calendar size={14} className="inline mr-1 text-gray-500" />
      default: return null
    }
  }

  const stakeholderTypes = ['All', 'Venue', 'Member', 'BDM', 'Partner', 'Event']

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Ratings Moderation</h1>
        <p className="text-gray-500 text-sm">Manage reviews for all stakeholders (Venues, Members, BDMs, Partners, Events)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-primary"><div className="flex items-center gap-3"><Star size={24} className="text-primary" /><div><p className="text-2xl font-bold">{stats.total}</p><p className="text-sm">Total Reviews</p></div></div></div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-yellow-500"><div className="flex items-center gap-3"><Clock size={24} className="text-yellow-500" /><div><p className="text-2xl font-bold">{stats.pending}</p><p className="text-sm">Pending</p></div></div></div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-green-500"><div className="flex items-center gap-3"><CheckCircle size={24} className="text-green-500" /><div><p className="text-2xl font-bold">{stats.approved}</p><p className="text-sm">Approved</p></div></div></div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-purple-500"><div className="flex items-center gap-3"><Star size={24} className="text-purple-500" /><div><p className="text-2xl font-bold">{stats.avgRating}</p><p className="text-sm">Average Rating</p></div></div></div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative"><Search size={18} className="absolute left-3 top-2.5 text-gray-400" /><input type="text" placeholder="Search by stakeholder or reviewer..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 border rounded-lg" /></div>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="p-2 border rounded-lg">
            <option value="all">All Stakeholders</option>
            <option value="Venue">Venues</option>
            <option value="Member">Members</option>
            <option value="BDM">BDMs</option>
            <option value="Partner">Partners</option>
            <option value="Event">Events</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="p-2 border rounded-lg"><option value="all">All Status</option><option value="pending">Pending</option><option value="approved">Approved</option></select>
          <button onClick={() => { setSearchTerm(''); setTypeFilter('all'); setStatusFilter('all') }} className="bg-gray-100 px-4 py-2 rounded-lg flex items-center gap-2"><Filter size={18} /> Clear</button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr><th className="p-3 text-left">Stakeholder</th><th className="p-3 text-left">Type</th><th className="p-3 text-left">Reviewer</th><th className="p-3 text-left">Rating</th><th className="p-3 text-left">Review</th><th className="p-3 text-left">Date</th><th className="p-3 text-left">Status</th><th className="p-3 text-center">Actions</th></tr>
            </thead>
            <tbody>
              {filteredRatings.map(r => (
                <tr key={r.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{getTypeIcon(r.type)}{r.stakeholder}</td>
                  <td className="p-3"><span className="px-2 py-1 rounded-full text-xs bg-gray-100">{r.type}</span></td>
                  <td className="p-3">{r.reviewer}</td>
                  <td className="p-3"><div className="flex items-center gap-1"><Star size={16} className="text-yellow-400 fill-yellow-400" /> {r.rating}</div></td>
                  <td className="p-3 max-w-xs truncate">{r.review}</td>
                  <td className="p-3">{r.date}</td>
                  <td className="p-3"><span className={`px-2 py-1 rounded-full text-xs ${r.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{r.status}</span></td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center gap-2">
                      {r.status === 'pending' && <button onClick={() => handleApprove(r.id)} className="text-green-500"><CheckCircle size={18} /></button>}
                      <button onClick={() => handleDelete(r.id)} className="text-red-500"><XCircle size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t flex justify-between items-center">
          <p className="text-sm text-gray-500">Showing {filteredRatings.length} of {ratings.length} reviews</p>
          <div className="flex gap-2"><button className="px-3 py-1 border rounded">Previous</button><button className="px-3 py-1 bg-primary text-white rounded">1</button><button className="px-3 py-1 border rounded">Next</button></div>
        </div>
      </div>
    </div>
  )
}
