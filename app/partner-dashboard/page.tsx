'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, Gift, DollarSign, Users, Plus, Edit, Trash2, Eye } from 'lucide-react'

export default function PartnerDashboard() {
  const [activeTab, setActiveTab] = useState('events')
  const [partner, setPartner] = useState({ name: 'WeWork India', email: 'partners@wework.com', joinDate: 'Jan 2025', tier: 'Gold' })

  // Sample hosted events
  const [hostedEvents, setHostedEvents] = useState([
    { id: 1, title: 'Startup Networking Meetup', venue: 'WeWork, BKC', date: '24 May 2025', time: '5:00 PM', bookings: 80, revenue: 24000, status: 'upcoming' },
    { id: 2, title: 'Digital Marketing Masterclass', venue: 'WeWork, BKC', date: '01 Jun 2025', time: '10:00 AM', bookings: 60, revenue: 18500, status: 'upcoming' },
    { id: 3, title: 'AI & Future of Work Summit', venue: 'WeWork, BKC', date: '30 May 2025', time: '9:30 AM', bookings: 120, revenue: 40000, status: 'upcoming' },
  ])

  // Sample offers
  const [offers, setOffers] = useState([
    { id: 1, code: 'WEWORK20', discount: '20% OFF', description: 'on coworking passes', claimed: 45, limit: 100, expiry: '30 Jun 2025' },
    { id: 2, code: 'CONF10', discount: '10% OFF', description: 'on conference rooms', claimed: 28, limit: 50, expiry: '15 Jul 2025' },
  ])

  // Sample bookings
  const [bookings, setBookings] = useState([
    { id: 1, event: 'Startup Networking Meetup', customer: 'Rohan Sharma', date: '24 May 2025', amount: 499, status: 'confirmed' },
    { id: 2, event: 'Digital Marketing Masterclass', customer: 'Neha Kapoor', date: '01 Jun 2025', amount: 699, status: 'pending' },
  ])

  const [showCreateEvent, setShowCreateEvent] = useState(false)
  const [newEvent, setNewEvent] = useState({ title: '', venue: '', date: '', price: 0 })

  const handleCreateEvent = () => {
    if (newEvent.title && newEvent.venue && newEvent.date) {
      const event = {
        id: hostedEvents.length + 1,
        title: newEvent.title,
        venue: newEvent.venue,
        date: newEvent.date,
        time: '10:00 AM',
        bookings: 0,
        revenue: 0,
        status: 'upcoming'
      }
      setHostedEvents([...hostedEvents, event])
      setNewEvent({ title: '', venue: '', date: '', price: 0 })
      setShowCreateEvent(false)
      alert('Event created successfully!')
    } else {
      alert('Please fill all fields')
    }
  }

  const totalRevenue = hostedEvents.reduce((sum, e) => sum + e.revenue, 0)
  const totalBookings = hostedEvents.reduce((sum, e) => sum + e.bookings, 0)

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Partner Welcome Header */}
      <div className="bg-gradient-to-r from-orange-500 to-primary rounded-2xl p-6 mb-8 text-white">
        <div className="flex justify-between items-start">
          <div><h1 className="text-2xl font-bold">Welcome, {partner.name}! 🎉</h1><p className="text-orange-100">{partner.email} · Partner since {partner.joinDate}</p><span className="inline-block mt-1 bg-yellow-400 text-orange-800 text-xs font-bold px-2 py-1 rounded-full">{partner.tier} Partner</span></div>
          <div className="text-right"><p className="text-sm">⭐ 4.6 ★ from 120 reviews</p></div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="card flex items-center gap-4"><div className="bg-orange-100 rounded-full p-3"><DollarSign size={24} className="text-primary" /><div><p className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</p><p className="text-sm text-gray-500">Total Revenue</p></div></div></div>
        <div className="card flex items-center gap-4"><div className="bg-orange-100 rounded-full p-3"><Users size={24} className="text-primary" /></div><div><p className="text-2xl font-bold">{totalBookings}</p><p className="text-sm text-gray-500">Total Bookings</p></div></div>
        <div className="card flex items-center gap-4"><div className="bg-orange-100 rounded-full p-3"><Calendar size={24} className="text-primary" /></div><div><p className="text-2xl font-bold">{hostedEvents.length}</p><p className="text-sm text-gray-500">Active Events</p></div></div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b mb-6">
        <button onClick={() => setActiveTab('events')} className={`pb-2 px-2 ${activeTab === 'events' ? 'border-b-2 border-primary text-primary font-semibold' : 'text-gray-500'}`}>Hosted Events</button>
        <button onClick={() => setActiveTab('offers')} className={`pb-2 px-2 ${activeTab === 'offers' ? 'border-b-2 border-primary text-primary font-semibold' : 'text-gray-500'}`}>Manage Offers</button>
        <button onClick={() => setActiveTab('bookings')} className={`pb-2 px-2 ${activeTab === 'bookings' ? 'border-b-2 border-primary text-primary font-semibold' : 'text-gray-500'}`}>Bookings</button>
        <button onClick={() => setActiveTab('revenue')} className={`pb-2 px-2 ${activeTab === 'revenue' ? 'border-b-2 border-primary text-primary font-semibold' : 'text-gray-500'}`}>Revenue</button>
      </div>

      {/* Hosted Events Tab */}
      {activeTab === 'events' && (
        <div>
          <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold text-gray-800">Your Events</h2><button onClick={() => setShowCreateEvent(!showCreateEvent)} className="btn-primary text-sm px-4 py-1 flex items-center gap-1"><Plus size={16} /> Create Event</button></div>
          
          {showCreateEvent && (
            <div className="card bg-orange-50 mb-4">
              <h3 className="font-bold mb-3">Create New Event</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input type="text" placeholder="Event Title" value={newEvent.title} onChange={(e) => setNewEvent({...newEvent, title: e.target.value})} className="p-2 border rounded-lg" />
                <input type="text" placeholder="Venue" value={newEvent.venue} onChange={(e) => setNewEvent({...newEvent, venue: e.target.value})} className="p-2 border rounded-lg" />
                <input type="date" value={newEvent.date} onChange={(e) => setNewEvent({...newEvent, date: e.target.value})} className="p-2 border rounded-lg" />
                <input type="number" placeholder="Price (₹)" value={newEvent.price} onChange={(e) => setNewEvent({...newEvent, price: parseInt(e.target.value)})} className="p-2 border rounded-lg" />
              </div>
              <div className="flex gap-2 mt-3"><button onClick={handleCreateEvent} className="bg-primary text-white px-4 py-1 rounded-lg">Create</button><button onClick={() => setShowCreateEvent(false)} className="bg-gray-200 px-4 py-1 rounded-lg">Cancel</button></div>
            </div>
          )}

          <div className="space-y-4">
            {hostedEvents.map(event => (
              <div key={event.id} className="card flex flex-wrap justify-between items-center">
                <div><h3 className="font-bold">{event.title}</h3><p className="text-sm text-gray-500">{event.venue} · {event.date} · {event.time}</p><p className="text-sm">{event.bookings} Bookings · ₹{event.revenue.toLocaleString()} Revenue</p></div>
                <div className="flex gap-2"><button className="bg-gray-100 p-2 rounded-lg"><Eye size={18} /></button><button className="bg-gray-100 p-2 rounded-lg"><Edit size={18} /></button><button className="bg-red-100 text-red-600 p-2 rounded-lg"><Trash2 size={18} /></button></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Offers Management Tab */}
      {activeTab === 'offers' && (
        <div>
          <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold text-gray-800">Your Offers</h2><button className="btn-primary text-sm px-4 py-1 flex items-center gap-1"><Plus size={16} /> Create Offer</button></div>
          <div className="space-y-4">
            {offers.map(offer => (
              <div key={offer.id} className="card flex flex-wrap justify-between items-center">
                <div><span className="text-2xl font-bold text-primary">{offer.code}</span><p className="font-semibold">{offer.discount}</p><p className="text-sm text-gray-600">{offer.description}</p><p className="text-xs text-gray-400">Claimed: {offer.claimed}/{offer.limit} · Expires: {offer.expiry}</p></div>
                <div className="flex gap-2"><button className="bg-gray-100 p-2 rounded-lg"><Edit size={18} /></button><button className="bg-red-100 text-red-600 p-2 rounded-lg"><Trash2 size={18} /></button></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          {bookings.map(booking => (
            <div key={booking.id} className="card flex flex-wrap justify-between items-center">
              <div><h3 className="font-bold">{booking.event}</h3><p className="text-sm text-gray-500">Customer: {booking.customer} · {booking.date}</p><p className="text-primary font-bold">₹{booking.amount}</p></div>
              <div><span className={`px-2 py-1 rounded-full text-xs ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{booking.status === 'confirmed' ? 'Confirmed' : 'Pending'}</span><button className={`ml-2 ${booking.status === 'pending' ? 'btn-primary text-sm px-3 py-1' : 'bg-gray-200 text-sm px-3 py-1 rounded-lg'}`}>{booking.status === 'pending' ? 'Confirm' : 'View'}</button></div>
            </div>
          ))}
        </div>
      )}

      {/* Revenue Tab */}
      {activeTab === 'revenue' && (
        <div className="space-y-6">
          <div className="card"><h3 className="font-bold mb-2">Revenue Overview</h3><p className="text-3xl font-bold text-primary">₹{totalRevenue.toLocaleString()}</p><p className="text-sm text-gray-500">↑ 12% vs last month</p><div className="mt-4 h-32 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">Revenue Chart Coming Soon</div></div>
          <div className="card"><h3 className="font-bold mb-2">Commission Breakdown</h3><p className="text-sm">GCE Commission (15%): <span className="font-bold">₹{(totalRevenue * 0.15).toLocaleString()}</span></p><p className="text-sm text-green-600 font-bold">Your Earnings (85%): ₹{(totalRevenue * 0.85).toLocaleString()}</p></div>
        </div>
      )}
    </div>
  )
}
