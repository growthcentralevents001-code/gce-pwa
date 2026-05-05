'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, Clock, MapPin, CreditCard, CheckCircle, Clock as ClockIcon } from 'lucide-react'

// Sample booking events
const availableEvents = [
  { id: 1, title: "Business Growth Workshop", venue: "The Orchid Hotel, Mumbai", date: "25 Jun 2025", day: "Wednesday", time: "10:00 AM - 1:00 PM", priceRange: "₹2,000 - ₹3,000", image: "💼" },
  { id: 2, title: "Leadership Retreat", venue: "Hilton Garden Inn, Mumbai", date: "22 Jul 2025", day: "Tuesday", time: "9:00 AM - 5:00 PM", priceRange: "₹3,000 - ₹5,000", image: "🏔️" },
  { id: 3, title: "Sales Mastery Bootcamp", venue: "ITC Maratha, Mumbai", date: "05 Aug 2025", day: "Tuesday", time: "10:00 AM - 4:00 PM", priceRange: "₹2,500 - ₹4,000", image: "🎯" },
  { id: 4, title: "Corporate Team Building Event", venue: "The Leela, Goa", date: "28 Jun 2025", day: "Saturday", time: "11:00 AM - 6:00 PM", priceRange: "₹5,000 - ₹8,000", image: "🤝" },
]

export default function BookingPage() {
  const [myBookings, setMyBookings] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('upcoming')
  const [showToast, setShowToast] = useState('')

  useEffect(() => {
    const savedBookings = localStorage.getItem('gce_bookings')
    if (savedBookings) setMyBookings(JSON.parse(savedBookings))
  }, [])

  const saveBooking = (booking: any) => {
    const updatedBookings = [booking, ...myBookings]
    setMyBookings(updatedBookings)
    localStorage.setItem('gce_bookings', JSON.stringify(updatedBookings))
  }

  const handleAdvancePayment = (event: any) => {
    const user = localStorage.getItem('gce_user')
    if (!user) {
      setShowToast('Please login to book events!')
      setTimeout(() => setShowToast(''), 3000)
      return
    }

    const booking = {
      id: 'BK' + Date.now(),
      eventTitle: event.title,
      venue: event.venue,
      date: event.date,
      priceRange: event.priceRange,
      advancePaid: 500,
      advanceDate: new Date().toLocaleDateString(),
      status: 'advance_paid',
      finalBillPaid: false
    }
    saveBooking(booking)
    setShowToast(`✅ ₹500 advance paid for ${event.title}!`)
    setTimeout(() => setShowToast(''), 3000)
  }

  const handleFinalPayment = (bookingId: string) => {
    const updatedBookings = myBookings.map(b => 
      b.id === bookingId ? { ...b, status: 'completed', finalBillPaid: true, completedDate: new Date().toLocaleDateString() } : b
    )
    setMyBookings(updatedBookings)
    localStorage.setItem('gce_bookings', JSON.stringify(updatedBookings))
    setShowToast(`✅ Final bill paid! Event completed.`)
    setTimeout(() => setShowToast(''), 3000)
  }

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'advance_paid': return <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">Advance Paid (₹500)</span>
      case 'completed': return <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Completed</span>
      default: return null
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-center text-primary mb-2">Booking Events</h1>
      <p className="text-center text-gray-500 mb-6">Book your event with just ₹500 advance</p>

      {/* How it works */}
      <div className="bg-orange-50 rounded-xl p-4 mb-8 text-center">
        <p className="text-sm text-gray-600">📌 How it works? Book with ₹500 advance. Pay the remaining amount after the event.</p>
      </div>

      {/* Available Events */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">Book a New Event</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
        {availableEvents.map(event => (
          <div key={event.id} className="card hover:shadow-lg transition">
            <div className="flex gap-4">
              <div className="text-4xl">{event.image}</div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">{event.title}</h3>
                <p className="text-sm text-gray-500 flex items-center gap-1"><MapPin size={14} /> {event.venue}</p>
                <p className="text-sm text-gray-500 flex items-center gap-1"><Calendar size={14} /> {event.date} · {event.day}</p>
                <p className="text-sm text-gray-500 flex items-center gap-1"><Clock size={14} /> {event.time}</p>
                <p className="text-sm text-primary font-semibold mt-1">Estimated: {event.priceRange}</p>
                <button onClick={() => handleAdvancePayment(event)} className="btn-primary w-full mt-3 text-sm py-2">Pay ₹500 Advance</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* My Bookings Section */}
      {myBookings.length > 0 && (
        <div>
          <div className="flex gap-4 border-b mb-4">
            <button onClick={() => setActiveTab('upcoming')} className={`pb-2 px-2 ${activeTab === 'upcoming' ? 'border-b-2 border-primary text-primary font-semibold' : 'text-gray-500'}`}>Upcoming</button>
            <button onClick={() => setActiveTab('completed')} className={`pb-2 px-2 ${activeTab === 'completed' ? 'border-b-2 border-primary text-primary font-semibold' : 'text-gray-500'}`}>Completed</button>
          </div>

          <div className="space-y-4">
            {myBookings.filter(b => activeTab === 'upcoming' ? b.status !== 'completed' : b.status === 'completed').map(booking => (
              <div key={booking.id} className="card bg-white">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <h3 className="font-bold text-gray-800">{booking.eventTitle}</h3>
                    <p className="text-sm text-gray-500">{booking.venue} · {booking.date}</p>
                    <p className="text-sm text-gray-500">Estimated: {booking.priceRange}</p>
                  </div>
                  {getStatusBadge(booking.status)}
                </div>

                <div className="mt-3 border-t pt-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Advance Paid: <span className="text-primary font-bold">₹500</span></p>
                      <p className="text-xs text-gray-500">Paid on: {booking.advanceDate}</p>
                    </div>
                    {booking.status === 'advance_paid' && (
                      <button onClick={() => handleFinalPayment(booking.id)} className="bg-primary text-white px-4 py-1 rounded-full text-sm hover:bg-orange-600">Pay Remaining</button>
                    )}
                    {booking.status === 'completed' && (
                      <span className="text-green-600 text-sm flex items-center gap-1"><CheckCircle size={16} /> Event Completed</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">{showToast}</div>}
    </div>
  )
}
