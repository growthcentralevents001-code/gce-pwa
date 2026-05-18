import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-primary mb-3">Growth Central Events</h3>
            <p className="text-sm">Creating Similar Interest and Business GCE Marketplace Events</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-primary">Home</Link></li>
              <li><Link href="/events" className="hover:text-primary">Events</Link></li>
              <li><Link href="/memberships" className="hover:text-primary">Memberships</Link></li>
              <li><Link href="/the-circle" className="hover:text-primary">The Circle</Link></li>
              <li><Link href="/for-partners" className="hover:text-primary">For Partners</Link></li>
              <li><Link href="/offers" className="hover:text-primary">Offers</Link></li>
              <li><Link href="/booking" className="hover:text-primary">Booking</Link></li>
              <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
              <li><Link href="/about" className="hover:text-primary">About</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-3">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>📍 123 Business Hub, Mumbai</li>
              <li>📞 +91 98765 43210</li>
              <li>✉️ info@growthcentralevents.com</li>
            </ul>
          </div>

          {/* Social & Legal */}
          <div>
            <h4 className="font-semibold text-white mb-3">Follow Us</h4>
            <div className="flex gap-4 mb-4 text-xl">
              <a href="#" className="hover:text-primary">📘</a>
              <a href="#" className="hover:text-primary">📷</a>
              <a href="#" className="hover:text-primary">🔗</a>
            </div>
            <div className="text-xs space-y-1">
              <Link href="/terms" className="block hover:text-primary">Terms & Conditions</Link>
              <Link href="/privacy" className="block hover:text-primary">Privacy Policy</Link>
              <Link href="/refund" className="block hover:text-primary">Refund Policy</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-xs">
          © 2026 Growth Central Events. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
