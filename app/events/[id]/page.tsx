'use client'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { Calendar, Bell, CreditCard } from 'lucide-react'

const eventsData = {
  '1': {
    id: '1',
    title: 'Startup Networking Meetup',
    venue: 'WeWork, BKC, Bandra Kurla Complex',
    city: 'Mumbai',
    date: '2025-05-25',
    displayDate: '25 May 2025',
    day: 'Sunday',
    startTime: '17:00',
    endTime: '20:00',
    duration: '3 Hours',
    interested: 120,
    capacity: 100,
    registered: 60,
    description: 'Join entrepreneurs, founders, and professionals for an evening of meaningful connections, idea sharing, and collaboration opportunities.',
    image: '🚀',
    benefits: ['Networking Opportunities', 'Industry Insights', 'Refreshments Included', 'Business Connections'],
    ticketTiers: [
      { name: 'Member', price: 499, validTill: '20 May 2025', description: 'Access for members' },
      { name: 'Early Bird', price: 399, validTill: '20 May 2025', description: 'Limited seats' },
      { name: 'VIP', price: 999, validTill: '20 May 2025', description: 'Front row seating + Networking pass' }
    ]
  },
  '2': {
    id: '2',
    title: 'Digital Marketing Masterclass',
    venue: 'Taj Lands End, Bandra',
    city: 'Mumbai',
    date: '2025-06-01',
    displayDate: '01 Jun 2025',
    day: 'Sunday',
    startTime: '10:00',
    endTime: '13:00',
    duration: '3 Hours',
    interested: 85,
    capacity: 100,
    registered: 85,
    description: 'Learn digital marketing strategies from industry experts. Master SEO, social media, and content marketing.',
    image: '📊',
    benefits: ['SEO Mastery', 'Social Media Strategies', 'Content Marketing', 'Certificate of Participation'],
    ticketTiers: [
      { name: 'Member', price: 699, validTill: '25 May 2025', description: 'Access for members' },
      { name: 'Early Bird', price: 549, validTill: '25 May 2025', description: 'Limited seats' },
      { name: 'VIP', price: 1299, validTill: '25 May 2025', description: 'Front row + Lunch + Certificate' }
    ]
  }
}

export default function EventDetailPage() {
  const params = useParams()
  const eventId = params.id as string
  const event = eventsData[eventId as keyof typeof eventsData]
  const [selectedTier, setSelectedTier] = useState(event?.ticketTiers[0]?.name || 'Member')
  const [reminderMsg, setReminderMsg] = useState('')

  if (!event) {
    return <div className="max-w-6xl mx-auto px-4 py-12 text-center">Event not found</div>
  }

  const percentFull = (event.registered / event.capacity) * 100
  const selectedPrice = event.ticketTiers.find(t => t.name === selectedTier)?.price || event.ticketTiers[0]?.price

  // Generate .ics file for calendar
  const addToCalendar = () => {
    const startDateTime = `${event.date}T${event.startTime}:00`
    const endDateTime = `${event.date}T${event.endTime}:00`
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//GCE//Event Calendar//EN
BEGIN:VEVENT
UID:${event.id}@growthcentralevents.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${startDateTime.replace(/-/g, '').replace(/:/g, '')}
DTEND:${endDateTime.replace(/-/g, '').replace(/:/g, '')}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.venue}, ${event.city}
END:VEVENT
END:VCALENDAR`
    
    const blob = new Blob([icsContent], { type: 'text/calendar' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${event.title.replace(/\s/g, '_')}.ics`
    link.click()
    URL.revokeObjectURL(link.href)
  }

  const remindMe = () => {
    // Store in localStorage or send to backend
    const reminders = JSON.parse(localStorage.getItem('gce_reminders') || '[]')
    if (!reminders.includes(event.id)) {
      reminders.push(event.id)
      localStorage.setItem('gce_reminders', JSON.stringify(reminders))
      setReminderMsg('✅ Reminder set! We will notify you before the event.')
      setTimeout(() => setReminderMsg(''), 3000)
    } else {
      setReminderMsg('⚠️ Reminder already set for this event.')
      setTimeout(() => setReminderMsg(''), 3000)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <Link href="/events" className="hover:text-primary">Events</Link> / <span className="text-primary">{event.title}</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">{event.title}</h1>
            <div className="flex flex-wrap gap-4 mt-2 text-gray-600 text-sm">
              <span>📍 {event.venue}, {event.city}</span>
              <span>📅 {event.displayDate} · {event.day}</span>
              <span>🕒 {event.startTime}:00 – {event.endTime}:00 ({event.duration})</span>
            </div>
          </div>

          <div className="bg-orange-50 rounded-xl p-4 mb-6">
            <div className="flex justify-between text-sm mb-1">
              <span>🎉 {event.interested}+ interested</span>
              <span>{Math.round(percentFull)}% Full · {event.registered}/{event.capacity} seats</span>
            </div>
            <div className="capacity-bar"><div className="capacity-bar-fill" style={{ width: `${percentFull}%` }}></div></div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold mb-3">Select Ticket Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {event.ticketTiers.map((tier) => (
                <div key={tier.name} onClick={() => setSelectedTier(tier.name)} className={`card cursor-pointer text-center transition ${selectedTier === tier.name ? 'border-primary ring-2 ring-primary' : ''}`}>
                  <h3 className="font-bold text-lg">{tier.name}</h3>
                  <p className="text-2xl font-bold text-primary">₹{tier.price}</p>
                  <p className="text-xs text-gray-500">{tier.description}</p>
                  <p className="text-xs text-gray-400 mt-1">Valid till {tier.validTill}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">✅ Free cancellation up to 24 hours before the event</p>
          </div>

          <div className="flex flex-wrap gap-4 mb-8">
            <button className="btn-primary flex items-center gap-2 px-8 py-3 text-lg"><CreditCard size={20} /> Pay Now (Full Amount) ₹{selectedPrice}</button>
            <button onClick={addToCalendar} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full flex items-center gap-2 hover:bg-gray-200"><Calendar size={18} /> Add to Calendar</button>
            <button onClick={remindMe} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full flex items-center gap-2 hover:bg-gray-200"><Bell size={18} /> Remind Me</button>
          </div>
          {reminderMsg && <div className="mb-4 text-sm text-green-600">{reminderMsg}</div>}

          <div className="mb-6"><h2 className="text-xl font-bold mb-3">Description</h2><p className="text-gray-600">{event.description}</p></div>
          <div><h2 className="text-xl font-bold mb-3">Event Benefits</h2><ul className="grid grid-cols-1 md:grid-cols-2 gap-2">{event.benefits.map((benefit, idx) => (<li key={idx} className="flex items-center gap-2 text-gray-600">✓ {benefit}</li>))}</ul></div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <div className="bg-gray-100 rounded-xl p-4 text-center mb-4"><p className="text-gray-500">📸 Event Gallery</p><div className="text-6xl my-4">{event.image}</div><p className="text-sm text-gray-500">1/8 · View Gallery</p></div>
            <div className="bg-orange-50 rounded-xl p-4 text-center"><p className="font-semibold">⭐ Best Value</p><p className="text-sm">Get the VIP pass for premium experience</p></div>
          </div>
        </div>
      </div>
    </div>
  )
}
