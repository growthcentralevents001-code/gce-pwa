"use client";

import Link from "next/link";
import { 
  Shield, 
  Eye, 
  Lock, 
  Users, 
  Cookie, 
  Mail,
  CheckCircle,
  AlertCircle,
  Database,
  Trash2
} from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 flex items-center gap-3">
            <Shield className="text-orange-500" size={32} />
            Privacy Policy
          </h1>
          <p className="text-slate-500 mt-1 text-sm md:text-base">
            Last updated: June 25, 2026
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 space-y-8">
            {/* 1. Introduction */}
            <section>
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2 mb-3">
                <AlertCircle className="text-orange-500" size={20} />
                1. Introduction
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                At Growth Central Events (GCE), we take your privacy seriously. This Privacy Policy explains 
                how we collect, use, disclose, and safeguard your information when you use our platform.
              </p>
            </section>

            {/* 2. Information We Collect */}
            <section>
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2 mb-3">
                <Eye className="text-orange-500" size={20} />
                2. Information We Collect
              </h2>
              <ul className="space-y-2">
                {[
                  "Personal identification information (name, email, phone number)",
                  "Payment information (processed securely through third-party)",
                  "Event preferences and booking history",
                  "Device and browser information (IP address, location)",
                  "Cookies and similar tracking technologies"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-slate-600">
                    <CheckCircle size={16} className="text-orange-500 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 3. How We Use Your Information */}
            <section>
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2 mb-3">
                <Lock className="text-orange-500" size={20} />
                3. How We Use Your Information
              </h2>
              <ul className="space-y-2">
                {[
                  "To process and confirm event bookings",
                  "To send event reminders and updates",
                  "To personalize your experience on our platform",
                  "To improve our services and develop new features",
                  "To send promotional communications (you can opt-out)"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-slate-600">
                    <CheckCircle size={16} className="text-orange-500 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 4. Data Sharing */}
            <section>
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2 mb-3">
                <Users className="text-orange-500" size={20} />
                4. Data Sharing
              </h2>
              <ul className="space-y-2">
                {[
                  "We do not sell your personal information to third parties",
                  "We share data with venue partners to fulfill bookings",
                  "We use trusted payment processors (Razorpay)",
                  "We may share data with analytics providers (Google Analytics)",
                  "We comply with legal requirements and court orders"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-slate-600">
                    <CheckCircle size={16} className="text-orange-500 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 5. Cookies */}
            <section>
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2 mb-3">
                <Cookie className="text-orange-500" size={20} />
                5. Cookies
              </h2>
              <ul className="space-y-2">
                {[
                  "We use cookies to enhance your experience",
                  "Essential cookies for platform functionality",
                  "Analytics cookies to improve our services",
                  "You can manage cookie preferences in your browser",
                  "Third-party cookies from payment processors"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-slate-600">
                    <CheckCircle size={16} className="text-orange-500 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 6. Data Security */}
            <section>
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2 mb-3">
                <Lock className="text-orange-500" size={20} />
                6. Data Security
              </h2>
              <ul className="space-y-2">
                {[
                  "We use industry-standard encryption (SSL/TLS)",
                  "Data stored in secure Supabase databases",
                  "Regular security audits and updates",
                  "Access limited to authorized personnel only",
                  "Payment data processed through secure gateways"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-slate-600">
                    <CheckCircle size={16} className="text-orange-500 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 7. Your Rights */}
            <section>
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2 mb-3">
                <Shield className="text-orange-500" size={20} />
                7. Your Rights
              </h2>
              <ul className="space-y-2">
                {[
                  "Access and review your personal data",
                  "Request corrections to inaccurate data",
                  "Request deletion of your account and data",
                  "Opt-out of marketing communications",
                  "Data portability in machine-readable format"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-slate-600">
                    <CheckCircle size={16} className="text-orange-500 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 8. Contact */}
            <section className="bg-orange-50 rounded-xl p-6 border border-orange-200">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2 mb-3">
                <Mail className="text-orange-500" size={20} />
                8. Contact Us
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at:<br />
                <span className="font-medium text-orange-600">support@growthentralevents.com</span>
              </p>
            </section>

            {/* Footer Links */}
            <div className="flex flex-wrap justify-center gap-6 pt-6 border-t border-slate-200 text-sm">
              <Link href="/terms" className="text-slate-500 hover:text-orange-600 transition">
                Terms of Service
              </Link>
              <Link href="/refund" className="text-slate-500 hover:text-orange-600 transition">
                Refund Policy
              </Link>
              <Link href="/contact" className="text-slate-500 hover:text-orange-600 transition">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
