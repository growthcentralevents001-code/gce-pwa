'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Users, Target, Clock, Table, Award, TrendingUp, Calendar, CheckCircle } from 'lucide-react'

// Sample member directory data
const membersList = [
  { id: 1, name: "Amit Verma", profession: "CA", company: "RK & Co.", city: "Mumbai", leadsGiven: 12, leadsReceived: 8, status: "active" },
  { id: 2, name: "Neha Shah", profession: "Marketing Consultant", company: "Neha Digital", city: "Mumbai", leadsGiven: 9, leadsReceived: 11, status: "active" },
  { id: 3, name: "Riya Malhotra", profession: "Real Estate", company: "RM Properties", city: "Mumbai", leadsGiven: 7, leadsReceived: 6, status: "active" },
  { id: 4, name: "Pooja Iyer", profession: "HR Consultant", company: "Pooja HR Solutions", city: "Mumbai", leadsGiven: 10, leadsReceived: 9, status: "active" },
  { id: 5, name: "Vikram Singh", profession: "IT Services", company: "VS Technologies", city: "Mumbai", leadsGiven: 11, leadsReceived: 12, status: "probation" },
]

export default function TheCirclePage() {
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    const storedUser = localStorage.getItem('gce_user')
    if (storedUser) setUser(JSON.parse(storedUser))
  }, [])

  const upcomingMeetings = [
    { date: "24 May 2025", day: "Saturday", time: "10:00 AM – 11:30 AM", venue: "WeWork, BKC, Mumbai" },
    { date: "07 Jun 2025", day: "Saturday", time: "10:00 AM – 11:30 AM", venue: "WeWork, BKC, Mumbai" },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-center text-primary mb-2">The Circle</h1>
      <p className="text-center text-gray-500 mb-8">Exclusive Business Networking for Non‑Competitive Professionals</p>

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card text-center"><Users className="mx-auto text-primary mb-2" size={32} /><p className="text-2xl font-bold">30+</p><p className="text-sm text-gray-500">Members per Circle</p></div>
        <div className="card text-center"><Target className="mx-auto text-primary mb-2" size={32} /><p className="text-2xl font-bold">1 Lead</p><p className="text-sm text-gray-500">Per Month Mandate</p></div>
        <div className="card text-center"><Clock className="mx-auto text-primary mb-2" size={32} /><p className="text-2xl font-bold">90 min</p><p className="text-sm text-gray-500">Twice a Month</p></div>
        <div className="card text-center"><Award className="mx-auto text-primary mb-2" size={32} /><p className="text-2xl font-bold">10+</p><p className="text-sm text-gray-500">Industries</p></div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b mb-6">
        <button onClick={() => setActiveTab('overview')} className={`pb-2 px-2 ${activeTab === 'overview' ? 'border-b-2 border-primary text-primary font-semibold' : 'text-gray-500'}`}>Overview</button>
        <button onClick={() => setActiveTab('directory')} className={`pb-2 px-2 ${activeTab === 'directory' ? 'border-b-2 border-primary text-primary font-semibold' : 'text-gray-500'}`}>Member Directory</button>
        <button onClick={() => setActiveTab('meetings')} className={`pb-2 px-2 ${activeTab === 'meetings' ? 'border-b-2 border-primary text-primary font-semibold' : 'text-gray-500'}`}>Meetings</button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
            <h2 className="text-xl font-bold text-primary mb-3 flex items-center gap-2"><Target size={20} /> Lead Mandate</h2>
            <p className="text-gray-700 mb-2">Each member must provide <strong>1 qualified business lead per month</strong>.</p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-2">
              <li>Qualified lead = genuine business opportunity resulting in a conversation</li>
              <li>Track leads via member dashboard with proof (screenshot/email)</li>
              <li>Lead verification by Circle Host at each meeting</li>
              <li className="text-red-600 font-semibold">2 consecutive months of missing leads = membership suspended</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold text-primary mb-3 flex items-center gap-2"><Clock size={20} /> Meeting Agenda (90 minutes, twice a month)</h2>
            <div className="space-y-2 text-sm">
              <p><strong>5 min</strong> – Opening & Welcome (Circle Host)</p>
              <p><strong>15 min</strong> – Educational Segment (referral marketing training)</p>
              <p><strong>20 min</strong> – 60‑Second Introductions (each member presents business)</p>
              <p className="text-primary font-semibold"><strong>15 min</strong> – Lead Submission Review (members present 1 lead for the month)</p>
              <p><strong>10 min</strong> – Feature Presentation (one member in‑depth, rotating)</p>
              <p><strong>15 min</strong> – Referral Sharing (announce referrals given/received)</p>
              <p><strong>10 min</strong> – Announcements & Close (upcoming events, testimonials)</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-100 to-orange-50 rounded-xl p-6 text-center">
            <h3 className="text-xl font-bold text-orange-700">Ready to grow your business network?</h3>
            <p className="text-gray-600 mb-3">Join The Circle today – ₹500/month</p>
            <Link href="/memberships"><button className="btn-primary px-8 py-2">Join Now</button></Link>
          </div>
        </div>
      )}

      {/* Member Directory Tab */}
      {activeTab === 'directory' && (
        <div>
          <div className="bg-orange-50 rounded-xl p-4 mb-4">
            <p className="text-sm text-gray-600">🔒 Full directory accessible to logged‑in Business members only</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-gray-100">
                <tr><th className="p-2 text-left">Name</th><th className="p-2 text-left">Profession</th><th className="p-2 text-left">Company</th><th className="p-2 text-left">City</th><th className="p-2 text-center">Leads Given</th><th className="p-2 text-center">Leads Received</th><th className="p-2 text-center">Status</th></tr>
              </thead>
              <tbody>
                {membersList.map(member => (
                  <tr key={member.id} className="border-b border-gray-100">
                    <td className="p-2 font-medium">{member.name}</td>
                    <td className="p-2">{member.profession}</td>
                    <td className="p-2">{member.company}</td>
                    <td className="p-2">{member.city}</td>
                    <td className="p-2 text-center">{member.leadsGiven}</td>
                    <td className="p-2 text-center">{member.leadsReceived}</td>
                    <td className="p-2 text-center"><span className={`px-2 py-0.5 rounded-full text-xs ${member.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{member.status === 'active' ? 'Active' : 'On Probation'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Meetings Tab */}
      {activeTab === 'meetings' && (
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2"><Calendar size={20} /> Upcoming Meetings</h2>
          <div className="space-y-4">
            {upcomingMeetings.map((meeting, idx) => (
              <div key={idx} className="card flex flex-wrap justify-between items-center">
                <div><p className="font-bold">{meeting.date} · {meeting.day}</p><p className="text-sm text-gray-500">{meeting.time}</p><p className="text-sm text-gray-500">{meeting.venue}</p></div>
                <button className="btn-primary text-sm px-4 py-1">RSVP Now</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
