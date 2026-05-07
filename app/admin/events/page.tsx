'use client'
import { useState } from 'react'
import { Search, Eye, Edit, Trash2, Plus, X, Filter, Calendar, Users, DollarSign, MapPin, Clock } from 'lucide-react'

type Event = {
  id: number
  title: string
  venue: string
  city: string
  date: string
  time: string
  price: number
  capacity: number
  registered: number
  category: string
  status: string
}

export default function EventsManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null)

  const [newEvent, setNewEvent] = useState({
    title: '', venue: '', city: 'Mumbai', date: '', time: '', price: 499, capacity: 100, category: 'Business', status: 'upcoming'
  })

  const [events, setEvents] = useState<Event[]>([
    { id: 1, title: 'Startup Networking Meetup', venue: 'WeWork, BKC', city: 'Mumbai', date: '24 May 2025', time: '5:00 PM', price: 499, capacity: 100, registered: 72, category: 'Business', status: 'upcoming' },
    { id: 2, title: 'Digital Marketing Masterclass', venue: 'Taj Lands End', city: 'Mumbai', date: '01 Jun 2025', time: '10:00 AM', price: 699, capacity: 100, registered: 85, category: 'Workshop', status: 'upcoming' },
    { id: 3, title: 'Women Entrepreneurs Networking', venue: 'The St. Regis', city: 'Mumbai', date: '26 May 2025', time: '6:30 PM', price: 499, capacity: 80, registered: 45, category: 'Networking', status: 'upcoming' },
    { id: 4, title: 'AI & Future of Work Summit', venue: 'Jio World Centre', city: 'Mumbai', date: '30 May 2025', time: '9:00 AM', price: 799, capacity: 200, registered: 180, category: 'Conference', status: 'upcoming' },
  ])

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.venue || !newEvent.date) {
      alert('Please fill all required fields')
      return
    }
    const newId = Math.max(...events.map(e => e.id), 0) + 1
    const event: Event = { id: newId, ...newEvent, registered: 0 }
    setEvents([event, ...events])
    setShowAddModal(false)
    setNewEvent({ title: '', venue: '', city: 'Mumbai', date: '', time: '', price: 499, capacity: 100, category: 'Business', status: 'upcoming' })
    alert('Event created successfully!')
  }

  const handleDeleteEvent = (id: number) => {
    setEvents(events.filter(e => e.id !== id))
    setShowDeleteConfirm(null)
    alert('Event deleted successfully!')
  }

  const filteredEvents = events.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase()) || e.venue.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter
    const matchesType = typeFilter === 'all' || e.category === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const categories = ['All', 'Business', 'Workshop', 'Networking', 'Conference', 'Social']
  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune']

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Events Management</h1>
        <button onClick={() => setShowAddModal(true)} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2"><Plus size={18} /> Create Event</button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-primary"><div className="flex items-center gap-3"><Calendar size={24} className="text-primary" /><div><p className="text-2xl font-bold">{events.length}</p><p className="text-sm">Total Events</p></div></div></div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-green-500"><div className="flex items-center gap-3"><Users size={24} className="text-green-500" /><div><p className="text-2xl font-bold">{events.reduce((s,e) => s + e.registered, 0)}</p><p className="text-sm">Total Registrations</p></div></div></div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-purple-500"><div className="flex items-center gap-3"><DollarSign size={24} className="text-purple-500" /><div><p className="text-2xl font-bold">₹{(events.reduce((s,e) => s + (e.price * e.registered), 0)/100000).toFixed(1)}L</p><p className="text-sm">Total Revenue</p></div></div></div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-orange-500"><div className="flex items-center gap-3"><Calendar size={24} className="text-orange-500" /><div><p className="text-2xl font-bold">{events.filter(e => e.status === 'upcoming').length}</p><p className="text-sm">Upcoming Events</p></div></div></div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative"><Search size={18} className="absolute left-3 top-2.5 text-gray-400" /><input type="text" placeholder="Search by title or venue..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 border rounded-lg" /></div>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="p-2 border rounded-lg"><option value="all">All Categories</option>{categories.slice(1).map(c => <option key={c} value={c}>{c}</option>)}</select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="p-2 border rounded-lg"><option value="all">All Status</option><option value="upcoming">Upcoming</option><option value="ongoing">Ongoing</option><option value="completed">Completed</option></select>
          <button onClick={() => { setSearchTerm(''); setTypeFilter('all'); setStatusFilter('all') }} className="bg-gray-100 px-4 py-2 rounded-lg flex items-center gap-2"><Filter size={18} /> Clear</button>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr><th className="p-3 text-left">Event</th><th className="p-3 text-left">Venue</th><th className="p-3 text-left">Date & Time</th><th className="p-3 text-left">Price</th><th className="p-3 text-left">Registrations</th><th className="p-3 text-left">Status</th><th className="p-3 text-center">Actions</th></tr>
            </thead>
            <tbody>
              {filteredEvents.map(e => {
                const percentFull = Math.round((e.registered / e.capacity) * 100)
                return (
                  <tr key={e.id} className="border-b hover:bg-gray-50">
                    <td className="p-3"><div><p className="font-medium">{e.title}</p><p className="text-xs text-gray-400">{e.category}</p></div></td>
                    <td className="p-3"><div className="flex items-center gap-1"><MapPin size={14} className="text-gray-400" />{e.venue}, {e.city}</div></td>
                    <td className="p-3"><div className="flex items-center gap-1"><Calendar size={14} className="text-gray-400" />{e.date}<br /><Clock size={14} className="inline text-gray-400" /> {e.time}</div></td>
                    <td className="p-3 font-medium">₹{e.price}</td>
                    <td className="p-3"><div><span>{e.registered}/{e.capacity}</span><div className="w-24 mt-1"><div className="h-1.5 bg-gray-200 rounded-full"><div className="h-1.5 bg-primary rounded-full" style={{ width: `${percentFull}%` }}></div></div></div></div></td>
                    <td className="p-3"><span className={`px-2 py-1 rounded-full text-xs ${e.status === 'upcoming' ? 'bg-blue-100 text-blue-700' : e.status === 'ongoing' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{e.status}</span></td>
                    <td className="p-3 text-center"><div className="flex justify-center gap-2"><button className="text-blue-500"><Eye size={18} /></button><button className="text-orange-500"><Edit size={18} /></button><button onClick={() => setShowDeleteConfirm(e.id)} className="text-red-500"><Trash2 size={18} /></button></div></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t flex justify-between items-center"><p className="text-sm text-gray-500">Showing {filteredEvents.length} of {events.length} events</p><div className="flex gap-2"><button className="px-3 py-1 border rounded">Previous</button><button className="px-3 py-1 bg-primary text-white rounded">1</button><button className="px-3 py-1 border rounded">Next</button></div></div>
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold">Create New Event</h3><button onClick={() => setShowAddModal(false)}><X size={24} /></button></div>
            <div className="space-y-4">
              <input type="text" placeholder="Event Title *" value={newEvent.title} onChange={(e) => setNewEvent({...newEvent, title: e.target.value})} className="w-full p-2 border rounded" />
              <input type="text" placeholder="Venue *" value={newEvent.venue} onChange={(e) => setNewEvent({...newEvent, venue: e.target.value})} className="w-full p-2 border rounded" />
              <select value={newEvent.city} onChange={(e) => setNewEvent({...newEvent, city: e.target.value})} className="w-full p-2 border rounded">{cities.map(c => <option key={c} value={c}>{c}</option>)}</select>
              <div className="grid grid-cols-2 gap-3"><input type="date" placeholder="Date" value={newEvent.date} onChange={(e) => setNewEvent({...newEvent, date: e.target.value})} className="p-2 border rounded" /><input type="time" placeholder="Time" value={newEvent.time} onChange={(e) => setNewEvent({...newEvent, time: e.target.value})} className="p-2 border rounded" /></div>
              <div className="grid grid-cols-2 gap-3"><input type="number" placeholder="Price (₹)" value={newEvent.price} onChange={(e) => setNewEvent({...newEvent, price: parseInt(e.target.value)})} className="p-2 border rounded" /><input type="number" placeholder="Capacity" value={newEvent.capacity} onChange={(e) => setNewEvent({...newEvent, capacity: parseInt(e.target.value)})} className="p-2 border rounded" /></div>
              <select value={newEvent.category} onChange={(e) => setNewEvent({...newEvent, category: e.target.value})} className="w-full p-2 border rounded"><option value="Business">Business</option><option value="Workshop">Workshop</option><option value="Networking">Networking</option><option value="Conference">Conference</option><option value="Social">Social</option></select>
              <select value={newEvent.status} onChange={(e) => setNewEvent({...newEvent, status: e.target.value})} className="w-full p-2 border rounded"><option value="upcoming">Upcoming</option><option value="ongoing">Ongoing</option><option value="completed">Completed</option></select>
              <button onClick={handleAddEvent} className="w-full bg-primary text-white py-2 rounded font-semibold">Create Event</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {showDeleteConfirm !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center">
            <h3 className="text-xl font-bold mb-2">Delete Event?</h3>
            <p className="text-gray-500 mb-4">This action cannot be undone.</p>
            <div className="flex gap-3"><button onClick={() => handleDeleteEvent(showDeleteConfirm)} className="flex-1 bg-red-500 text-white py-2 rounded">Delete</button><button onClick={() => setShowDeleteConfirm(null)} className="flex-1 bg-gray-200 py-2 rounded">Cancel</button></div>
          </div>
        </div>
      )}
    </div>
  )
}
