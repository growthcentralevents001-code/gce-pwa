"use client";

import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ background: "#1a1a1a", color: "#999", marginTop: "60px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 24px 24px" }}>
        
        {/* Main Footer Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "40px", marginBottom: "40px" }}>
          
          {/* Brand Column */}
          <div>
            <h3 style={{ fontSize: "24px", fontWeight: "700", color: "#f97316", marginBottom: "16px" }}>GCE</h3>
            <p style={{ fontSize: "14px", lineHeight: "1.6", marginBottom: "20px" }}>
              India's first three-vertical event platform connecting members with events, and venues with customers.
            </p>
            <div style={{ display: "flex", gap: "16px" }}>
              <a href="#" style={{ color: "#999", fontSize: "20px" }}>📘</a>
              <a href="#" style={{ color: "#999", fontSize: "20px" }}>🐦</a>
              <a href="#" style={{ color: "#999", fontSize: "20px" }}>📷</a>
              <a href="#" style={{ color: "#999", fontSize: "20px" }}>🔗</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: "16px", fontWeight: "600", color: "white", marginBottom: "20px" }}>Quick Links</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <li style={{ marginBottom: "12px" }}><Link href="/" style={{ color: "#999", textDecoration: "none", fontSize: "14px" }}>Home</Link></li>
              <li style={{ marginBottom: "12px" }}><Link href="/events" style={{ color: "#999", textDecoration: "none", fontSize: "14px" }}>Events</Link></li>
              <li style={{ marginBottom: "12px" }}><Link href="/memberships" style={{ color: "#999", textDecoration: "none", fontSize: "14px" }}>Memberships</Link></li>
              <li style={{ marginBottom: "12px" }}><Link href="/for-partners" style={{ color: "#999", textDecoration: "none", fontSize: "14px" }}>For Partners</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 style={{ fontSize: "16px", fontWeight: "600", color: "white", marginBottom: "20px" }}>Support</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <li style={{ marginBottom: "12px" }}><Link href="/help" style={{ color: "#999", textDecoration: "none", fontSize: "14px" }}>Help Center</Link></li>
              <li style={{ marginBottom: "12px" }}><Link href="/contact" style={{ color: "#999", textDecoration: "none", fontSize: "14px" }}>Contact Us</Link></li>
              <li style={{ marginBottom: "12px" }}><Link href="/terms" style={{ color: "#999", textDecoration: "none", fontSize: "14px" }}>Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 style={{ fontSize: "16px", fontWeight: "600", color: "white", marginBottom: "20px" }}>Get in Touch</h4>
            <div style={{ marginBottom: "16px", display: "flex", gap: "12px", alignItems: "center" }}>
              <span style={{ fontSize: "18px" }}>📍</span>
              <span style={{ fontSize: "14px" }}>Mumbai, India</span>
            </div>
            <div style={{ marginBottom: "16px", display: "flex", gap: "12px", alignItems: "center" }}>
              <span style={{ fontSize: "18px" }}>✉️</span>
              <span style={{ fontSize: "14px" }}>support@gce.com</span>
            </div>
            <div style={{ marginBottom: "16px", display: "flex", gap: "12px", alignItems: "center" }}>
              <span style={{ fontSize: "18px" }}>📞</span>
              <span style={{ fontSize: "14px" }}>+91 98765 43210</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ borderTop: "1px solid #333", paddingTop: "24px", textAlign: "center" }}>
          <p style={{ fontSize: "13px", marginBottom: "8px" }}>
            © {currentYear} Growth Central Events. All rights reserved.
          </p>
          <p style={{ fontSize: "12px", color: "#666" }}>
            GSTIN: 27AAECG1234F1ZP | CIN: U74999MH2023PTC123456
          </p>
        </div>
      </div>
    </footer>
  );
}
