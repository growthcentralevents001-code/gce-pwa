'use client'
import { useState } from 'react'
import Link from 'next/link'

const eventsData = [
  { id: 1, title: "Startup Networking Meetup", venue: "WeWork, BKC", city: "Mumbai", category: "Networking", date: "25 May 2025", time: "5:00 PM", price: 499, capacity: 100, registered: 60 },
  { id: 2, title: "Digital Marketing Masterclass", venue: "Taj Lands End", city: "Mumbai", category: "Workshop", date: "01 Jun 2025", time: "10:00 AM", price: 699, capacity: 100, registered: 85 },
]

const cities = ["All", "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Pune"]
const categories = ["All Categories", "Networking", "Workshop", "Conference", "Seminar"]

export default function EventsPage() {
  const [selectedCity, setSelectedCity] = useState("All")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMap, setViewMap] = useState(false)

  const filteredEvents = eventsData.filter(event => {
    const matchesCity = selectedCity === "All" || event.city === selectedCity
    const matchesCategory = selectedCategory === "All Categories" || event.category === selectedCategory
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCity && matchesCategory && matchesSearch
  })

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <input type="text" placeholder="Search events, workshops, or speakers..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full p-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary mb-4" />

      <div className="flex flex-wrap gap-2 mb-4">
        {cities.map(city => (
          <button key={city} onClick={() => setSelectedCity(city)} className={`px-4 py-1 rounded-full text-sm ${selectedCity === city ? 'bg-primary text-white' : 'bg-gray-100'}`}>{city}</button>
        ))}
      </div>

      <div className="flex flex-wrap justify-between items-center mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-1 rounded-full text-sm ${selectedCategory === cat ? 'bg-primary text-white' : 'bg-gray-100'}`}>{cat}</button>
          ))}
        </div>
        <button onClick={() => setViewMap(!viewMap)} className="text-primary text-sm">{viewMap ? "📋 List View" : "🗺️ View Map"}</button>
      </div>

      {viewMap ? <div className="bg-gray-100 rounded-xl p-8 text-center">🗺️ Map View Coming Soon</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredEvents.map(event => (
            <Link key={event.id} href={`/events/${event.id}`}>
              <div className="card hover:shadow-lg transition cursor-pointer">
                <h3 className="font-bold text-lg">{event.title}</h3>
                <p className="text-sm text-gray-500">{event.venue}, {event.city}</p>
                <p className="text-xs text-gray-400">{event.date} · {event.time}</p>
                <div className="mt-2"><div className="capacity-bar"><div className="capacity-bar-fill" style={{ width: `${(event.registered/event.capacity)*100}%` }}></div></div></div>
                <div className="flex justify-between items-center mt-3"><span className="text-primary font-bold">₹{event.price}</span><button className="btn-primary text-sm px-4 py-1">View Details</button></div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
