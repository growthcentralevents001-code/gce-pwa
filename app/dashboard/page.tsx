'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, Gift, Star, LogOut } from 'lucide-react'

export default function DashboardPage() {
  const [user, setUser] = useState({ name: 'Guest', email: '', memberSince: '', memberId: '', tier: 'Silver', stats: { eventsAttended: 0, offersClaimed: 0, rewardPoints: 0 } })

  useEffect(() => {
    const storedUser = localStorage.getItem('gce_user')
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUser({
        name: parsedUser.name || 'Guest',
        email: parsedUser.email || '',
        memberSince: parsedUser.memberSince || new Date().toLocaleDateString(),
        memberId: 'GCE' + Math.floor(Math.random() * 1000000),
        tier: parsedUser.tier || 'Silver',
        stats: { eventsAttended: 12, offersClaimed: 8, rewardPoints: 1250 }
      })
    }
  }, [])

  const upcomingEvents = [
    { id: 1, title: 'Startup Networking Meetup', venue: 'WeWork, BKC', date: '24 May 2025', time: '5:00 PM', status: 'confirmed' },
    { id: 2, title: 'AI & Future of Work Summit', venue: 'Jio World Centre', date: '30 May 2025', time: '9:00 AM', status: 'confirmed' }
  ]

  const handleLogout = () => {
    localStorage.removeItem('gce_user')
    window.location.href = '/login'
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="bg-gradient-to-r from-orange-500 to-primary rounded-2xl p-6 mb-8 text-white">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-2xl font-bold">Hello, {user.name}! 🎉</h1>
              <span className="bg-yellow-400 text-orange-800 text-xs font-bold px-2 py-1 rounded-full">{user.tier} Member</span>
            </div>
            <p className="text-orange-100">Member since {user.memberSince} | ID: {user.memberId}</p>
            <p className="text-orange-100 text-sm mt-1">You're enjoying priority benefits</p>
          </div>
          <button onClick={handleLogout} className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition"><LogOut size={20} /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="card flex items-center gap-4"><div className="bg-orange-100 rounded-full p-3"><Calendar size={24} className="text-primary" /></div><div><p className="text-2xl font-bold">{user.stats.eventsAttended}</p><p className="text-sm text-gray-500">Events Attended</p></div></div>
        <div className="card flex items-center gap-4"><div className="bg-orange-100 rounded-full p-3"><Gift size={24} className="text-primary" /></div><div><p className="text-2xl font-bold">{user.stats.offersClaimed}</p><p className="text-sm text-gray-500">Offers Claimed</p></div></div>
        <div className="card flex items-center gap-4"><div className="bg-orange-100 rounded-full p-3"><Star size={24} className="text-primary" /></div><div><p className="text-2xl font-bold">{user.stats.rewardPoints}</p><p className="text-sm text-gray-500">Reward Points</p></div></div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold text-gray-800">My Events</h2><Link href="/dashboard/my-events" className="text-primary text-sm hover:underline">View All →</Link></div>
        <div><h3 className="font-semibold text-gray-700 mb-2">Upcoming Events</h3><div className="space-y-3">{upcomingEvents.map(event => (<div key={event.id} className="card flex justify-between items-center"><div><p className="font-semibold">{event.title}</p><p className="text-sm text-gray-500">{event.venue} · {event.date} · {event.time}</p></div><span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">{event.status}</span></div>))}</div></div>
      </div>

      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-4 text-center text-white">
        <p className="font-semibold">✨ Gold members get priority booking, exclusive offers & special invites. <Link href="/memberships" className="underline">View Benefits</Link></p>
      </div>
    </div>
  )
}
