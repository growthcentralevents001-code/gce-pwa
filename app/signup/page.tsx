"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, User, Phone, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    if (!agreeTerms) {
      setError("Please agree to Terms & Conditions");
      setLoading(false);
      return;
    }

    // Mock signup - replace with Supabase later
    setTimeout(() => {
      if (name && email && phone && password) {
        localStorage.setItem("isLoggedIn", "true");
        router.push("/");
      } else {
        setError("Please fill all fields");
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ maxWidth: "500px", width: "100%", background: "white", borderRadius: "32px", padding: "40px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <span style={{ fontSize: "32px", fontWeight: "bold", background: "linear-gradient(135deg, #f97316, #ea580c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>GCE</span>
          <span style={{ fontSize: "24px", fontWeight: "600", marginLeft: "4px" }}>Events</span>
          <h1 style={{ fontSize: "28px", fontWeight: "700", marginTop: "16px", color: "#0f172a" }}>Create account</h1>
          <p style={{ color: "#64748b", marginTop: "8px" }}>Join India's premier event platform</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#0f172a" }}>Full name</label>
            <div style={{ display: "flex", alignItems: "center", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "12px 16px", background: "#f8fafc" }}>
              <User size={18} style={{ color: "#94a3b8", marginRight: "12px" }} />
              <input type="text" placeholder="Rohan Mehta" value={name} onChange={(e) => setName(e.target.value)} required style={{ flex: 1, border: "none", background: "transparent", outline: "none", fontSize: "15px" }} />
            </div>
          </div>

          {/* Email */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#0f172a" }}>Email address</label>
            <div style={{ display: "flex", alignItems: "center", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "12px 16px", background: "#f8fafc" }}>
              <Mail size={18} style={{ color: "#94a3b8", marginRight: "12px" }} />
              <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ flex: 1, border: "none", background: "transparent", outline: "none", fontSize: "15px" }} />
            </div>
          </div>

          {/* Phone */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#0f172a" }}>Phone number</label>
            <div style={{ display: "flex", alignItems: "center", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "12px 16px", background: "#f8fafc" }}>
              <Phone size={18} style={{ color: "#94a3b8", marginRight: "12px" }} />
              <input type="tel" placeholder="+91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} required style={{ flex: 1, border: "none", background: "transparent", outline: "none", fontSize: "15px" }} />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#0f172a" }}>Password</label>
            <div style={{ display: "flex", alignItems: "center", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "12px 16px", background: "#f8fafc" }}>
              <Lock size={18} style={{ color: "#94a3b8", marginRight: "12px" }} />
              <input type={showPassword ? "text" : "password"} placeholder="Create a strong password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ flex: 1, border: "none", background: "transparent", outline: "none", fontSize: "15px" }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                {showPassword ? <EyeOff size={18} style={{ color: "#94a3b8" }} /> : <Eye size={18} style={{ color: "#94a3b8" }} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#0f172a" }}>Confirm password</label>
            <div style={{ display: "flex", alignItems: "center", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "12px 16px", background: "#f8fafc" }}>
              <Lock size={18} style={{ color: "#94a3b8", marginRight: "12px" }} />
              <input type={showPassword ? "text" : "password"} placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required style={{ flex: 1, border: "none", background: "transparent", outline: "none", fontSize: "15px" }} />
            </div>
          </div>

          {/* Terms & Conditions */}
          <div style={{ marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
            <input type="checkbox" id="terms" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} style={{ width: "18px", height: "18px", cursor: "pointer" }} />
            <label htmlFor="terms" style={{ fontSize: "14px", color: "#64748b" }}>I agree to the <a href="/terms" style={{ color: "#f97316", textDecoration: "none" }}>Terms & Conditions</a> and <a href="/privacy" style={{ color: "#f97316", textDecoration: "none" }}>Privacy Policy</a></label>
          </div>

          {error && <div style={{ background: "#fee2e2", color: "#991b1b", padding: "12px", borderRadius: "12px", marginBottom: "20px", fontSize: "14px" }}>{error}</div>}

          <button type="submit" disabled={loading} style={{ width: "100%", background: "#f97316", color: "white", border: "none", padding: "14px", borderRadius: "40px", fontSize: "16px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            {loading ? "Creating account..." : "Sign up"} {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div style={{ marginTop: "24px", textAlign: "center", borderTop: "1px solid #eef2ff", paddingTop: "24px" }}>
          <p style={{ color: "#64748b" }}>Already have an account? <Link href="/login" style={{ color: "#f97316", fontWeight: "500", textDecoration: "none" }}>Login</Link></p>
        </div>
      </div>
    </div>
  );
}
