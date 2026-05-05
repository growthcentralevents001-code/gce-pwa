'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Target, Eye, Shield, Users, Star, TrendingUp, Heart, ChevronRight } from 'lucide-react'

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState('mission')

  const stats = [
    { value: "500+", label: "Events Hosted", icon: <Star size={24} /> },
    { value: "10,000+", label: "Happy Members", icon: <Users size={24} /> },
    { value: "50+", label: "Partner Venues", icon: <Heart size={24} /> },
    { value: "15+", label: "Cities Covered", icon: <TrendingUp size={24} /> },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-block bg-orange-100 text-primary px-4 py-1 rounded-full text-sm font-semibold mb-4">About Us</div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Creating Meaningful <span className="text-primary">Connections</span></h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">We believe that growth happens when the right people meet at the right time — not by chance, but through a well‑designed system.</p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {stats.map((stat, idx) => (
          <div key={idx} className="text-center p-6 bg-orange-50 rounded-2xl border border-orange-100 hover:shadow-lg transition">
            <div className="text-primary flex justify-center mb-3">{stat.icon}</div>
            <div className="text-3xl font-bold text-gray-800">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-10 border-b pb-2">
        <button onClick={() => setActiveTab('mission')} className={`px-6 py-2 font-semibold transition ${activeTab === 'mission' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}>Our Mission</button>
        <button onClick={() => setActiveTab('vision')} className={`px-6 py-2 font-semibold transition ${activeTab === 'vision' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}>Our Vision</button>
        <button onClick={() => setActiveTab('approach')} className={`px-6 py-2 font-semibold transition ${activeTab === 'approach' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}>Our Approach</button>
        <button onClick={() => setActiveTab('testimonials')} className={`px-6 py-2 font-semibold transition ${activeTab === 'testimonials' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}>Testimonials</button>
      </div>

      {/* Mission Tab */}
      {activeTab === 'mission' && (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2"><Target className="text-primary" size={28} /> Our Mission</h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-6">To create a world where professionals and families can grow without confusion, comparison, or wasted time. We replace the chaos of endless choices with a <span className="font-semibold text-primary">clear, curated path</span> to meaningful connections.</p>
          <div className="bg-orange-50 rounded-xl p-6 border-l-4 border-primary"><p className="text-gray-700 italic">"We don't show you 50 options and say 'choose wisely.' We study your needs and give you one best recommendation. No comparison. No confusion. Just trusted guidance."</p></div>
        </div>
      )}

      {/* Vision Tab */}
      {activeTab === 'vision' && (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2"><Eye className="text-primary" size={28} /> Our Vision</h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-6">To become the most trusted event membership brand — where customers confidently say:</p>
          <div className="bg-gradient-to-r from-orange-500 to-primary rounded-xl p-8 text-center text-white"><p className="text-2xl font-bold italic">"If it's an event, we get it from Growth Central Events."</p></div>
        </div>
      )}

      {/* Approach Tab */}
      {activeTab === 'approach' && (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2"><Shield className="text-primary" size={28} /> Our Approach</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4"><div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-primary font-bold text-xl mx-auto mb-3">1</div><h3 className="font-bold mb-2">Simple</h3><p className="text-gray-500 text-sm">One membership, one trusted partner</p></div>
            <div className="text-center p-4"><div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-primary font-bold text-xl mx-auto mb-3">2</div><h3 className="font-bold mb-2">Reliable</h3><p className="text-gray-500 text-sm">Consistent quality, predictable experience</p></div>
            <div className="text-center p-4"><div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-primary font-bold text-xl mx-auto mb-3">3</div><h3 className="font-bold mb-2">Growth‑Focused</h3><p className="text-gray-500 text-sm">Every event, every connection designed to move you forward</p></div>
          </div>
        </div>
      )}

      {/* Testimonials Tab */}
      {activeTab === 'testimonials' && (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">What Our Members Say</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-orange-50 rounded-xl p-6"><p className="text-gray-600 italic mb-4">"I don't waste hours comparing venues anymore. GCE just tells me what's best for my needs."</p><div><p className="font-bold">Rohan S.</p><p className="text-sm text-gray-500">Mumbai</p></div></div>
            <div className="bg-orange-50 rounded-xl p-6"><p className="text-gray-600 italic mb-4">"The Circle changed my business. I got 12 leads in 3 months!"</p><div><p className="font-bold">Priya M.</p><p className="text-sm text-gray-500">Delhi</p></div></div>
            <div className="bg-orange-50 rounded-xl p-6"><p className="text-gray-600 italic mb-4">"Finally a platform that understands what professionals actually need. Highly recommended!"</p><div><p className="font-bold">Amit K.</p><p className="text-sm text-gray-500">Bangalore</p></div></div>
            <div className="bg-orange-50 rounded-xl p-6"><p className="text-gray-600 italic mb-4">"The family membership is perfect. My kids love the workshops!"</p><div><p className="font-bold">Neha S.</p><p className="text-sm text-gray-500">Pune</p></div></div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="mt-16 text-center bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-10">
        <h3 className="text-2xl font-bold text-gray-800 mb-3">Ready to Grow Together?</h3>
        <p className="text-gray-600 mb-6">Join Growth Central Events today and start your journey.</p>
        <Link href="/memberships"><button className="btn-primary px-8 py-3 text-lg flex items-center gap-2 mx-auto">Join Now <ChevronRight size={20} /></button></Link>
      </div>
    </div>
  )
}
