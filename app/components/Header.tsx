'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Search, MapPin, Menu, X } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [location, setLocation] = useState("Mumbai")
  const [searchQuery, setSearchQuery] = useState("")

  const navLinks = [
    { name: "Events", href: "/events" },
    { name: "Memberships", href: "/memberships" },
    { name: "The Circle", href: "/the-circle" },
    { name: "For Partners", href: "/for-partners" },
    { name: "Offers", href: "/offers" },
    { name: "Booking", href: "/booking" },
    { name: "Contact", href: "/contact" },
    { name: "About", href: "/about" },
  ]

  return (
    <header className="bg-white border-b border-orange-100 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        {/* Top row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary">GCE</Link>

          {/* Location Selector */}
          <div className="flex items-center gap-1 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
            <MapPin size={16} className="text-primary" />
            <select 
              value={location} 
              onChange={(e) => setLocation(e.target.value)}
              className="bg-transparent text-sm focus:outline-none cursor-pointer text-gray-700"
            >
              <option>Mumbai</option>
              <option>Delhi</option>
              <option>Bangalore</option>
              <option>Chennai</option>
              <option>Kolkata</option>
              <option>Pune</option>
              <option>Hyderabad</option>
            </select>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search events, offers or partners..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-5">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} className="text-gray-700 hover:text-primary transition text-sm font-medium">
                {link.name}
              </Link>
            ))}
            <Link href="/login" className="text-gray-700 hover:text-primary text-sm font-medium">Login</Link>
            <Link href="/signup" className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-orange-600 transition">Sign Up</Link>
          </nav>

          {/* Mobile menu button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-gray-700">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-3 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search events, offers or partners..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-orange-100 py-4 px-4 space-y-3 shadow-lg">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} className="block text-gray-700 hover:text-primary" onClick={() => setIsMenuOpen(false)}>
              {link.name}
            </Link>
          ))}
          <Link href="/login" className="block text-gray-700 hover:text-primary" onClick={() => setIsMenuOpen(false)}>Login</Link>
          <Link href="/signup" className="block bg-primary text-white text-center px-4 py-2 rounded-full hover:bg-orange-600" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
        </div>
      )}
    </header>
  )
}
