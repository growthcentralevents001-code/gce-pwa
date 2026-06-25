"use client";

import Link from "next/link";
import { 
  FileText, 
  Shield, 
  Clock, 
  Users, 
  CreditCard, 
  AlertCircle,
  CheckCircle,
  Building2,
  Calendar,
  Mail
} from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 flex items-center gap-3">
            <FileText className="text-orange-500" size={32} />
            Terms of Service
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
                Welcome to Growth Central Events (GCE). By using our platform, you agree to comply with 
                and be bound by the following terms and conditions. Please read them carefully.
              </p>
            </section>

            {/* 2. Definitions */}
            <section>
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2 mb-3">
                <Shield className="text-orange-500" size={20} />
                2. Definitions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { icon: Building2, label: "Platform", desc: "GCE website and mobile application" },
                  { icon: Users, label: "User", desc: "Any person who registers on our platform" },
                  { icon: Building2, label: "Venue Partner", desc: "A venue that lists events on our platform" },
                  { icon: Calendar, label: "Event", desc: "Any gathering, workshop, or activity listed on GCE" },
                  { icon: CheckCircle, label: "Booking", desc: "Confirmed reservation for an event" }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl hover:bg-orange-50 transition">
                    <item.icon size={18} className="text-orange-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-slate-700">{item.label}:</span>
                      <span className="text-slate-600 ml-1">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 3. User Accounts */}
            <section>
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2 mb-3">
                <Users className="text-orange-500" size={20} />
                3. User Accounts
              </h2>
              <ul className="space-y-2">
                {[
                  "You must be 18+ to create an account",
                  "Provide accurate and complete information",
                  "Keep your login credentials secure",
                  "Notify us immediately of any unauthorized access",
                  "You are responsible for all activities under your account"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-slate-600">
                    <CheckCircle size={16} className="text-orange-500 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 4. Events & Bookings */}
            <section>
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2 mb-3">
                <Clock className="text-orange-500" size={20} />
                4. Events & Bookings
              </h2>
              <ul className="space-y-2">
                {[
                  "Event details are provided by venue partners",
                  "GCE does not guarantee event accuracy or quality",
                  "Bookings are confirmed upon payment completion",
                  "Cancellation policies vary by venue",
                  "Refunds are subject to venue's cancellation policy"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-slate-600">
                    <CheckCircle size={16} className="text-orange-500 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 5. Payments */}
            <section>
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2 mb-3">
                <CreditCard className="text-orange-500" size={20} />
                5. Payments
              </h2>
              <ul className="space-y-2">
                {[
                  "All payments are processed through secure gateways",
                  "Prices are in Indian Rupees (₹) including taxes",
                  "GCE charges a service fee on bookings",
                  "Refunds are processed within 5-7 business days",
                  "Chargebacks may result in account suspension"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-slate-600">
                    <CheckCircle size={16} className="text-orange-500 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 6. User Conduct */}
            <section>
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2 mb-3">
                <Shield className="text-orange-500" size={20} />
                6. User Conduct
              </h2>
              <ul className="space-y-2">
                {[
                  "Do not misuse or disrupt the platform",
                  "Do not post fraudulent or misleading content",
                  "Respect other users and venue partners",
                  "Do not spam or send unsolicited messages",
                  "Do not attempt to bypass security measures"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-slate-600">
                    <CheckCircle size={16} className="text-orange-500 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 7. Intellectual Property */}
            <section>
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2 mb-3">
                <FileText className="text-orange-500" size={20} />
                7. Intellectual Property
              </h2>
              <ul className="space-y-2">
                {[
                  "GCE owns all platform content and design",
                  "You may not copy or reproduce GCE materials",
                  "User-generated content remains the user's property",
                  "By posting, you grant GCE a license to use it"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-slate-600">
                    <CheckCircle size={16} className="text-orange-500 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 8. Termination */}
            <section>
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2 mb-3">
                <AlertCircle className="text-orange-500" size={20} />
                8. Termination
              </h2>
              <ul className="space-y-2">
                {[
                  "GCE may suspend or terminate accounts at any time",
                  "Violation of terms may result in immediate termination",
                  "Users may delete their account at any time",
                  "Termination does not waive outstanding obligations"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-slate-600">
                    <CheckCircle size={16} className="text-orange-500 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 9. Disclaimer */}
            <section>
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2 mb-3">
                <Shield className="text-orange-500" size={20} />
                9. Disclaimer
              </h2>
              <ul className="space-y-2">
                {[
                  "Platform is provided 'as is' without warranties",
                  "GCE is not liable for event-related issues",
                  "Users assume all risks associated with events",
                  "GCE does not endorse any venue or event"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-slate-600">
                    <CheckCircle size={16} className="text-orange-500 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 10. Contact */}
            <section className="bg-orange-50 rounded-xl p-6 border border-orange-200">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2 mb-3">
                <Mail className="text-orange-500" size={20} />
                10. Contact Us
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                If you have any questions about these terms, please contact us at:<br />
                <span className="font-medium text-orange-600">support@growthentralevents.com</span>
              </p>
            </section>

            {/* Footer Links */}
            <div className="flex flex-wrap justify-center gap-6 pt-6 border-t border-slate-200 text-sm">
              <Link href="/privacy" className="text-slate-500 hover:text-orange-600 transition">
                Privacy Policy
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
