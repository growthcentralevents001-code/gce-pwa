'use client'
import { useState } from 'react'
import Link from 'next/link'

const categories = [
  { name: "GCE Like Minded", icon: "🤝", description: "Seminars, workshops, food events", href: "/events?category=like-minded", color: "bg-orange-50" },
  { name: "GCE Business", icon: "💼", description: "Networking, The Circle meetings", href: "/events?category=business", color: "bg-orange-50" },
  { name: "GCE Booking", icon: "📅", description: "Birthday, kitty, corporate parties", href: "/booking", color: "bg-orange-50" },
  { name: "GCE Offers", icon: "🎁", description: "Exclusive discounts & deals", href: "/offers", color: "bg-orange-50" },
  { name: "GCE The Circle", icon: "🔄", description: "Business networking & leads", href: "/the-circle", color: "bg-orange-50" },
  { name: "GCE Partner Hosting Events", icon: "🏨", description: "Host events & manage offers", href: "/partner-events", color: "bg-orange-50" },
]

const trendingEvents = [
  { id: 1, title: "Startup Networking Meetup", venue: "WeWork, BKC", city: "Mumbai", date: "25 May 2025", time: "5:00 PM", price: 499, capacity: 120, registered: 72, image: "🚀" },
  { id: 2, title: "Digital Marketing Masterclass", venue: "Taj Lands End", city: "Mumbai", date: "01 Jun 2025", time: "10:00 AM", price: 699, capacity: 100, registered: 85, image: "📊" },
  { id: 3, title: "Women Entrepreneurs Networking", venue: "The St. Regis", city: "Mumbai", date: "26 May 2025", time: "6:30 PM", price: 499, capacity: 80, registered: 36, image: "💼" },
  { id: 4, title: "AI & Future of Work Summit", venue: "Jio World Centre", city: "Mumbai", date: "30 May 2025", time: "9:00 AM", price: 799, capacity: 200, registered: 140, image: "🤖" },
]

const offers = [
  { id: 1, code: "GCE20", discount: "20% OFF", description: "on all products", supplier: "FreshMart Pvt Ltd", claimed: 4, limit: 10, expiry: "25 May 2025" },
  { id: 2, code: "TECH15", discount: "15% OFF", description: "on gadgets", supplier: "TechZone", claimed: 4, limit: 10, expiry: "28 May 2025" },
  { id: 3, code: "ORG10", discount: "10% OFF", description: "on organic items", supplier: "Organic Bazaar", claimed: 4, limit: 10, expiry: "31 May 2025" },
]

export default function Home() {
  const getCapacityPercentage = (registered: number, capacity: number) => Math.round((registered / capacity) * 100)

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Hero / Location Banner */}
      <div className="bg-primary text-white rounded-2xl p-6 mb-8 text-center">
      </div>

      {/* Category Cards Grid (6 items) */}
      <div className="mb-12">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Explore GCE Services</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat, idx) => (
            <Link key={idx} href={cat.href}>
              <div className="card hover:shadow-lg transition cursor-pointer">
                <div className="text-4xl mb-2">{cat.icon}</div>
                <h4 className="font-bold text-gray-800">{cat.name}</h4>
                <p className="text-sm text-gray-500">{cat.description}</p>
                <span className="inline-block mt-2 text-primary text-sm font-medium">Explore →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Trending Events Section */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Trending Events</h3>
          <Link href="/events" className="text-primary text-sm hover:underline">View All →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {trendingEvents.map((event) => {
            const percent = getCapacityPercentage(event.registered, event.capacity)
            const isFull = percent >= 100
            return (
              <div key={event.id} className="card hover:scale-[1.02] transition">
                <div className="text-4xl mb-2">{event.image}</div>
                <h4 className="font-bold text-gray-800">{event.title}</h4>
                <p className="text-sm text-gray-500">{event.venue}, {event.city}</p>
                <p className="text-xs text-gray-400 mt-1">{event.date} · {event.time}</p>
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{percent}% Full</span>
                    <span>{event.registered}/{event.capacity} seats</span>
                  </div>
                  <div className="capacity-bar">
                    <div className="capacity-bar-fill" style={{ width: `${percent}%` }}></div>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-primary font-bold">₹{event.price}</span>
                  {isFull ? (
                    <button className="text-xs bg-gray-200 text-gray-600 px-3 py-1 rounded-full cursor-not-allowed">Waitlist</button>
                  ) : (
                    <button className="btn-primary text-sm px-4 py-1">Register</button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Exclusive Offers Section */}
      <div className="mb-10">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Exclusive Offers for You</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {offers.map((offer) => (
            <div key={offer.id} className="card bg-orange-50 border-orange-200">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-2xl font-bold text-primary">{offer.code}</span>
                  <p className="text-lg font-semibold text-gray-800">{offer.discount}</p>
                  <p className="text-sm text-gray-600">{offer.description}</p>
                </div>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{offer.claimed}/{offer.limit} claimed</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Supplier: {offer.supplier}</p>
              <p className="text-xs text-gray-400">Exp: {offer.expiry}</p>
              <button className="btn-primary w-full mt-3 text-sm py-2">Claim & Pay</button>
            </div>
          ))}
        </div>
      </div>

      {/* Gold Member Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-primary rounded-xl p-5 text-white text-center">
        <p className="font-semibold">✨ Gold members get priority booking and exclusive offers</p>
        <button className="mt-2 bg-white text-primary px-6 py-1 rounded-full text-sm font-semibold hover:bg-orange-100 transition">Upgrade Now</button>
      </div>
    </div>
  )
}
