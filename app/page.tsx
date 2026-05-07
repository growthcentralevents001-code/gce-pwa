'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MapPin, Search, Menu, X, ChevronRight, Clock, Star, Sparkles, Calendar, MapPin as MapPinIcon, Users, Briefcase } from 'lucide-react'
import InstallButton from './components/InstallButton'

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [location, setLocation] = useState("Mumbai")
  const [searchQuery, setSearchQuery] = useState("")
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 15, seconds: 0 })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.minutes === 0 && prev.hours === 0 && prev.seconds === 0) return prev
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 }
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        return prev
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const navLinks = [
    { name: "Events", href: "/events" },
    { name: "Memberships", href: "/memberships" },
    { name: "For Partners", href: "/for-partners" },
  ]

  const miscLinks = [
    { name: "The Circle", href: "/the-circle" },
    { name: "Offers", href: "/offers" },
    { name: "Booking", href: "/booking" },
    { name: "Contact", href: "/contact" },
    { name: "About", href: "/about" },
    { name: "Terms & Conditions", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Refund Policy", href: "/refund" },
  ]

  const quickActions = [
    { icon: "🎤", label: "GCE Category Events", desc: "Seminars, workshops, networking", href: "/events?category=hosted", color: "bg-orange-50" },
    { icon: "🤝", label: "GCE Partner Hosted Events", desc: "Restaurant dinners, brand pop-ups", href: "/partner-events", color: "bg-orange-50" },
    { icon: "✨", label: "GCE Member Customised Events", desc: "Kitty, birthday, marriage", href: "/booking/custom", color: "bg-orange-50" },
  ]

  const trendingDeals = [
    { id: 1, title: "Startup Networking Meetup", venue: "WeWork, BKC", price: 699, originalPrice: 999, discount: "30% OFF", image: "🚀", date: "24 May 2025" },
    { id: 2, title: "Digital Marketing Masterclass", venue: "Taj Lands End", price: 499, originalPrice: 899, discount: "44% OFF", image: "📊", date: "01 Jun 2025" },
    { id: 3, title: "AI & Future Summit", venue: "Jio World Centre", price: 799, originalPrice: 1299, discount: "38% OFF", image: "🤖", date: "30 May 2025" },
  ]

  const hostedEvents = [
    { id: 1, title: "Like Minded Events", venue: "Multiple Venues", date: "Weekly", price: 499, image: "🎤", category: "Seminars, workshops" },
    { id: 2, title: "Business Events", venue: "The Circle Network", date: "Twice a month", price: 599, image: "💼", category: "Networking" },
  ]

  const partnerEvents = [
    { id: 1, title: "Sunset Networking Dinner", partner: "Skyline Lounge", venue: "Indore", date: "24 May 2025", price: 1499, rating: 4.8, image: "🌅" },
    { id: 2, title: "Startup Founders Meet", partner: "WeWork", venue: "BKC, Mumbai", date: "28 May 2025", price: 999, rating: 4.6, image: "🚀" },
  ]

  const filterChips = ["🎤 Workshops", "🤝 Networking", "🎉 Parties", "✨ Custom"]

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <Link href="/" className="text-2xl font-bold text-primary">GCE</Link>
            <div className="hidden md:flex items-center gap-2 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
              <MapPin size={16} className="text-primary" />
              <select value={location} onChange={(e) => setLocation(e.target.value)} className="bg-transparent text-sm focus:outline-none cursor-pointer"><option>Mumbai</option><option>Delhi</option><option>Bangalore</option><option>Chennai</option></select>
            </div>
            <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search for events, offers or services..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              {navLinks.map(link => (<Link key={link.href} href={link.href} className="text-gray-700 hover:text-primary text-sm font-medium">{link.name}</Link>))}
              <Link href="/login" className="text-gray-700 hover:text-primary text-sm font-medium">Login</Link>
              <Link href="/signup" className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-orange-600">Sign Up</Link>
              <InstallButton />
            </nav>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-gray-700">{isMenuOpen ? <X size={24} /> : <Menu size={24} />}</button>
          </div>
          <div className="mt-3 md:hidden relative"><Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /><input type="text" placeholder="Search events..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200" /></div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t py-4 px-4 space-y-4 shadow-lg max-h-[80vh] overflow-y-auto">
            {navLinks.map(link => (<Link key={link.href} href={link.href} className="block text-gray-700 py-2" onClick={() => setIsMenuOpen(false)}>{link.name}</Link>))}
            <Link href="/login" className="block text-gray-700 py-2">Login</Link>
            <Link href="/signup" className="block bg-primary text-white text-center px-4 py-2 rounded-full">Sign Up</Link>
            <InstallButton />
            <div className="border-t pt-3"><p className="font-semibold text-gray-800 mb-2">More</p>{miscLinks.map(link => (<Link key={link.href} href={link.href} className="block text-gray-500 text-sm py-1 hover:text-primary" onClick={() => setIsMenuOpen(false)}>{link.name}</Link>))}</div>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 py-4">
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-6 mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Discover, host, or request events</h1>
          <p className="text-gray-600 mb-4">One platform for all your event needs – from networking parties to custom celebrations</p>
          <div className="flex gap-3 justify-center"><button className="bg-primary text-white px-5 py-2 rounded-full font-semibold">Explore Events</button><button className="border border-primary text-primary px-5 py-2 rounded-full font-semibold">Become a Partner</button></div>
        </div>

        <div className="flex justify-center gap-6 mb-8 text-sm text-gray-500"><span className="flex items-center gap-1"><Users size={16} className="text-primary" /> Trusted by 10,000+ members</span><span className="flex items-center gap-1"><Briefcase size={16} className="text-primary" /> 100+ partners</span><span className="flex items-center gap-1"><Calendar size={16} className="text-primary" /> 50+ events monthly</span></div>

        <div className="flex gap-2 overflow-x-auto pb-3 mb-6 -mx-4 px-4">{filterChips.map((chip, i) => (<button key={i} className="px-4 py-1.5 bg-gray-100 rounded-full text-sm whitespace-nowrap hover:bg-primary hover:text-white transition">{chip}</button>))}</div>

        <div className="mb-10"><div className="grid grid-cols-1 md:grid-cols-3 gap-5">{quickActions.map((action, i) => (<Link key={i} href={action.href}><div className={`${action.color} rounded-xl p-4 text-center hover:shadow-md transition h-full`}><div className="text-4xl mb-2">{action.icon}</div><p className="font-semibold text-gray-800">{action.label}</p><p className="text-xs text-gray-500 mt-1">{action.desc}</p><span className="inline-block mt-3 text-primary text-sm font-medium">Explore →</span></div></Link>))}</div></div>

        <div className="mb-10"><div className="flex justify-between items-center mb-4"><h2 className="text-lg font-bold flex items-center gap-2"><Clock size={18} className="text-primary" /> Limited‑time deals – end in {timeLeft.hours}h {timeLeft.minutes}m</h2><Link href="/events" className="text-primary text-sm">View All →</Link></div><div className="overflow-x-auto pb-4"><div className="flex gap-4 w-max">{trendingDeals.map(deal => (<div key={deal.id} className="bg-white rounded-xl p-4 w-72 shadow-sm border border-gray-100 flex-shrink-0"><div className="text-4xl mb-2">{deal.image}</div><h3 className="font-bold">{deal.title}</h3><p className="text-sm text-gray-500">{deal.venue}</p><p className="text-xs text-gray-400">{deal.date}</p><div className="mt-2"><span className="text-primary font-bold text-lg">₹{deal.price}</span> <span className="text-gray-400 line-through text-sm">₹{deal.originalPrice}</span><span className="ml-2 text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">{deal.discount}</span></div><button className="btn-primary w-full mt-3 text-sm py-1.5">Book Now</button></div>))}</div></div></div>

        <div className="mb-10"><div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold text-gray-800">GCE Category Events</h2><Link href="/events" className="text-primary text-sm">View All →</Link></div><div className="grid grid-cols-1 md:grid-cols-2 gap-5">{hostedEvents.map(event => (<div key={event.id} className="card bg-orange-50 hover:shadow-md transition"><div className="text-4xl mb-2">{event.image}</div><h3 className="font-bold text-gray-800">{event.title}</h3><p className="text-sm text-gray-500">{event.category}</p><p className="text-sm text-gray-500 flex items-center gap-1"><Calendar size={14} /> {event.date}</p><div className="flex justify-between items-center mt-3"><span className="text-primary font-bold">₹{event.price}</span><button className="text-primary text-sm font-medium">Explore →</button></div></div>))}</div></div>

        <div className="mb-10"><div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold text-gray-800">GCE Partner Hosted Events</h2><Link href="/partner-events" className="text-primary text-sm">View All →</Link></div><div className="grid grid-cols-1 md:grid-cols-2 gap-5">{partnerEvents.map(event => (<div key={event.id} className="card hover:shadow-lg transition"><div className="flex justify-between"><div className="text-4xl">{event.image}</div><div className="flex items-center gap-1 text-sm"><Star size={14} className="text-yellow-400 fill-yellow-400" /> {event.rating}</div></div><h3 className="font-bold text-gray-800 mt-2">{event.title}</h3><p className="text-sm text-gray-500">By {event.partner}</p><p className="text-sm text-gray-500 flex items-center gap-1"><MapPinIcon size={14} /> {event.venue}</p><p className="text-sm text-gray-500 flex items-center gap-1"><Calendar size={14} /> {event.date}</p><div className="flex justify-between items-center mt-3"><span className="text-primary font-bold text-lg">₹{event.price}</span><button className="btn-primary text-sm px-4 py-1">Book Now</button></div></div>))}</div></div>

        <div className="mb-10"><div className="bg-gradient-to-r from-orange-500 to-primary rounded-xl p-6 text-white"><div className="flex flex-col md:flex-row justify-between items-center"><div><div className="flex items-center gap-2 mb-2"><Sparkles size={28} className="text-white" /><h2 className="text-xl font-bold">GCE Member Customised Events</h2></div><p className="text-orange-100 mb-2">Birthday, kitty party, or wedding – we make it happen</p></div><Link href="/booking/custom"><button className="bg-white text-primary px-6 py-2 rounded-full font-semibold hover:bg-orange-100 transition flex items-center gap-2">Request Custom Event →</button></Link></div></div></div>

        <div className="mt-8 mb-10"><div className="grid grid-cols-1 md:grid-cols-3 gap-5">{quickActions.map((action, i) => (<Link key={i} href={action.href}><div className="bg-gradient-to-r from-orange-100 to-orange-200 rounded-xl p-5 text-center hover:shadow-lg transition cursor-pointer"><div className="text-5xl mb-3">{action.icon}</div><h3 className="font-bold text-gray-800 text-lg">{action.label}</h3><p className="text-sm text-gray-600 mt-1">Click to explore →</p></div></Link>))}</div></div>
      </main>
    </div>
  )
}
