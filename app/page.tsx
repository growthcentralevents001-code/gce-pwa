'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Calendar, MapPin, Clock, Gift, ChevronRight, Sparkles } from 'lucide-react'

// Sample data for partner hosted events
const partnerEvents = [
  { id: 1, title: 'Sunset Networking Dinner', venue: 'Skyline Lounge, Indore', date: '24 May 2025', time: '7:00 PM', price: 1499, image: '🌅' },
  { id: 2, title: 'Startup Founders Meet', venue: 'WeWork, BKC', date: '28 May 2025', time: '6:00 PM', price: 999, image: '🚀' },
]

// Sample sponsor offers (horizontal scroll)
const sponsorOffers = [
  { id: 1, sponsor: 'Café Coffee Day', discount: 'Up to ₹200 off', code: 'CCD20', bg: 'bg-green-100' },
  { id: 2, sponsor: "Domino's", discount: '20% OFF', code: 'DOMINO20', bg: 'bg-blue-100' },
  { id: 3, sponsor: 'Marriott Indore', discount: '25% OFF up to ₹1000', code: 'MARRIOTT25', bg: 'bg-orange-100' },
  { id: 4, sponsor: 'Zomato Gold', discount: 'Exclusive deals', code: 'GCEZOM20', bg: 'bg-red-100' },
]

// Sample trending events (keep original)
const trendingEvents = [
  { id: 1, title: 'Leadership Summit 2025', venue: 'Brilliant Convention Centre', date: '18 May 2025', price: 999, image: '🏆' },
  { id: 2, title: 'Entrepreneurs Networking Night', venue: 'The French Club, Indore', date: '22 May 2025', price: 799, image: '🤝' },
  { id: 3, title: 'Wellness & You Workshop', venue: 'Soul Space, Indore', date: '25 May 2025', price: 499, image: '🧘' },
]

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* GCE Hosted Events Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-gray-800">GCE Hosted Events</h2>
          <Link href="/events" className="text-primary text-sm flex items-center gap-1">View All <ChevronRight size={16} /></Link>
        </div>
        <p className="text-sm text-gray-500 mb-4">Events organized by GCE curated for you</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="card bg-orange-50 hover:shadow-md transition">
            <div className="text-3xl mb-2">🎤</div>
            <h3 className="font-bold text-gray-800">Like Minded Events</h3>
            <p className="text-sm text-gray-500">Seminars, workshops, food events</p>
            <Link href="/events?category=like-minded" className="inline-block mt-2 text-primary text-sm font-medium">Explore →</Link>
          </div>
          <div className="card bg-orange-50 hover:shadow-md transition">
            <div className="text-3xl mb-2">💼</div>
            <h3 className="font-bold text-gray-800">Business Events</h3>
            <p className="text-sm text-gray-500">Networking, The Circle meetings</p>
            <Link href="/events?category=business" className="inline-block mt-2 text-primary text-sm font-medium">Explore →</Link>
          </div>
        </div>
      </div>

      {/* Member Customized GCE Events */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-orange-100 to-orange-50 rounded-xl p-5 border border-orange-200">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles size={28} className="text-primary" />
            <h2 className="text-xl font-bold text-gray-800">Member Customized GCE Events</h2>
          </div>
          <p className="text-gray-600 mb-3">Request your own event (kitty, birthday, marriage)</p>
          <Link href="/booking/custom">
            <button className="bg-primary text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-orange-600 transition flex items-center gap-2">
              Request Custom Event <ChevronRight size={16} />
            </button>
          </Link>
        </div>
      </div>

      {/* GCE Partner Hosted Events */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold text-gray-800">GCE Partner Hosted Events</h2>
          <Link href="/partner-events" className="text-primary text-sm flex items-center gap-1">View All <ChevronRight size={16} /></Link>
        </div>
        <p className="text-sm text-gray-500 mb-4">Partners host events & offer deals</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {partnerEvents.map(event => (
            <div key={event.id} className="card hover:shadow-lg transition">
              <div className="text-4xl mb-2">{event.image}</div>
              <h3 className="font-bold text-gray-800">{event.title}</h3>
              <p className="text-sm text-gray-500 flex items-center gap-1"><MapPin size={14} /> {event.venue}</p>
              <p className="text-sm text-gray-500 flex items-center gap-1"><Calendar size={14} /> {event.date} · {event.time}</p>
              <p className="text-primary font-bold mt-2">₹{event.price}<span className="text-xs text-gray-400"> /person</span></p>
              <button className="btn-primary w-full mt-3 text-sm py-2">Book Now</button>
            </div>
          ))}
        </div>
      </div>

      {/* The Circle (unchanged) */}
      <div className="mb-10">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-5 border border-primary/20">
          <div className="flex items-center gap-3">
            <div className="text-4xl">🔄</div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">GCE The Circle</h2>
              <p className="text-gray-600">Connect. Collaborate. Celebrate Together.</p>
            </div>
          </div>
          <Link href="/the-circle">
            <button className="mt-3 bg-primary text-white px-4 py-1 rounded-full text-sm hover:bg-orange-600">Join The Circle →</button>
          </Link>
        </div>
      </div>

      {/* Trending Events (keep original) */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Trending Events</h2>
          <Link href="/events" className="text-primary text-sm hover:underline">View All →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {trendingEvents.map(event => (
            <div key={event.id} className="card hover:shadow-lg transition">
              <div className="text-4xl mb-2">{event.image}</div>
              <h3 className="font-bold text-gray-800">{event.title}</h3>
              <p className="text-sm text-gray-500 flex items-center gap-1"><MapPin size={14} /> {event.venue}</p>
              <p className="text-sm text-gray-500 flex items-center gap-1"><Calendar size={14} /> {event.date}</p>
              <div className="flex justify-between items-center mt-3">
                <span className="text-primary font-bold">₹{event.price}</span>
                <button className="btn-primary text-sm px-4 py-1">Book Now</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sponsor Offers (horizontal scroll – Blinkit style) */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold text-gray-800">Sponsor Offers</h2>
          <Link href="/offers" className="text-primary text-sm hover:underline">View All →</Link>
        </div>
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-4 w-max">
            {sponsorOffers.map(offer => (
              <div key={offer.id} className={`${offer.bg} rounded-xl p-4 w-64 flex-shrink-0 shadow-sm`}>
                <p className="font-bold text-gray-800">{offer.sponsor}</p>
                <p className="text-sm text-gray-600 mt-1">{offer.discount}</p>
                <p className="text-xs font-mono text-gray-500 mt-1">Code: {offer.code}</p>
                <button className="mt-3 bg-primary text-white px-3 py-1 rounded-full text-xs w-full">Claim</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
