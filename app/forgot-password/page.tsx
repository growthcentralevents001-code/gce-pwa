"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    
    setLoading(true);
    setError("");
    
    // Simulate API call (will connect to Supabase later)
    setTimeout(() => {
      // Mock success - in real app, check if email exists in Supabase
      setSuccess(true);
      setLoading(false);
    }, 1500);
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ maxWidth: "450px", width: "100%", background: "white", borderRadius: "32px", padding: "40px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
        
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          style={{ display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none", color: "#64748b", cursor: "pointer", marginBottom: "24px" }}
        >
          <ArrowLeft size={18} /> Back
        </button>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <span style={{ fontSize: "32px", fontWeight: "bold", background: "linear-gradient(135deg, #f97316, #ea580c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>GCE</span>
          <span style={{ fontSize: "24px", fontWeight: "600", marginLeft: "4px" }}>Events</span>
          <h1 style={{ fontSize: "28px", fontWeight: "700", marginTop: "16px", color: "#0f172a" }}>Forgot Password?</h1>
          <p style={{ color: "#64748b", marginTop: "8px" }}>No worries! Enter your email and we'll send you a reset link.</p>
        </div>

        {success ? (
          // Success State
          <div style={{ textAlign: "center" }}>
            <div style={{ width: "64px", height: "64px", background: "#dcfce7", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
              <CheckCircle size={32} style={{ color: "#22c55e" }} />
            </div>
            <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "8px" }}>Check your email</h2>
            <p style={{ color: "#64748b", marginBottom: "24px" }}>
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <Link 
              href="/login" 
              style={{ display: "inline-block", background: "#f97316", color: "white", border: "none", padding: "12px 24px", borderRadius: "40px", textDecoration: "none", fontWeight: "500" }}
            >
              Back to Login
            </Link>
          </div>
        ) : (
          // Form State
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#0f172a" }}>Email Address</label>
              <div style={{ display: "flex", alignItems: "center", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "12px 16px", background: "#f8fafc" }}>
                <Mail size={18} style={{ color: "#94a3b8", marginRight: "12px" }} />
                <input 
                  type="email" 
                  placeholder="you@example.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  style={{ flex: 1, border: "none", background: "transparent", outline: "none", fontSize: "15px" }}
                />
              </div>
            </div>

            {error && (
              <div style={{ background: "#fee2e2", color: "#991b1b", padding: "12px", borderRadius: "12px", marginBottom: "20px", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading} 
              style={{ width: "100%", background: "#f97316", color: "white", border: "none", padding: "14px", borderRadius: "40px", fontSize: "16px", fontWeight: "600", cursor: "pointer", opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        <div style={{ marginTop: "24px", textAlign: "center" }}>
          <p style={{ color: "#64748b" }}>
            Remember your password?{" "}
            <Link href="/login" style={{ color: "#f97316", fontWeight: "500", textDecoration: "none" }}>
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
