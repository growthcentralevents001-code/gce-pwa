'use client'
import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Contact Form:', formData)
    setSubmitted(true)
    setFormData({ name: '', email: '', subject: '', message: '' })
    setTimeout(() => setSubmitted(false), 5000)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center text-primary mb-2">Contact Us</h1>
      <p className="text-center text-gray-500 mb-10">We'd love to hear from you</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Get in Touch</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3"><MapPin className="text-primary mt-0.5" size={20} /><div><p className="font-semibold">Address</p><p className="text-gray-600">123 Business Hub, Mumbai - 400001, India</p></div></div>
              <div className="flex items-start gap-3"><Phone className="text-primary mt-0.5" size={20} /><div><p className="font-semibold">Phone</p><p className="text-gray-600">+91 98765 43210</p><p className="text-gray-600">+91 12345 67890</p></div></div>
              <div className="flex items-start gap-3"><Mail className="text-primary mt-0.5" size={20} /><div><p className="font-semibold">Email</p><p className="text-gray-600">info@growthcentralevents.com</p><p className="text-gray-600">care@growthcentralevents.com</p></div></div>
              <div className="flex items-start gap-3"><Clock className="text-primary mt-0.5" size={20} /><div><p className="font-semibold">Business Hours</p><p className="text-gray-600">Mon-Sat: 9am – 9pm</p><p className="text-gray-600">Sunday: 10am – 6pm</p></div></div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h2 className="text-2xl font-bold text-orange-700 mb-4">Send us a Message</h2>
            {submitted && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4">✅ Thank you! We'll get back to you soon.</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-gray-700 font-medium mb-1">Your Name *</label><input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" /></div>
                <div><label className="block text-gray-700 font-medium mb-1">Email Address *</label><input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" /></div>
              </div>
              <div><label className="block text-gray-700 font-medium mb-1">Subject</label><input type="text" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" /></div>
              <div><label className="block text-gray-700 font-medium mb-1">Message *</label><textarea rows={5} required value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"></textarea></div>
              <button type="submit" className="flex items-center gap-2 btn-primary px-6 py-2"><Send size={18} /> Send Message</button>
            </form>
          </div>
        </div>
      </div>

      {/* Google Map Placeholder */}
      <div className="mt-10 bg-gray-200 rounded-xl h-64 flex items-center justify-center text-gray-500">📍 Google Map will be added here</div>
    </div>
  )
}
