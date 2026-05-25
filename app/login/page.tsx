"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const success = await login(email, password);
    if (success) {
      router.push("/");
    } else {
      setError("Invalid email or password");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ maxWidth: "450px", width: "100%", background: "white", borderRadius: "32px", padding: "40px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <span style={{ fontSize: "32px", fontWeight: "bold", background: "linear-gradient(135deg, #f97316, #ea580c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>GCE</span>
          <span style={{ fontSize: "24px", fontWeight: "600", marginLeft: "4px" }}>Events</span>
          <h1 style={{ fontSize: "28px", fontWeight: "700", marginTop: "16px", color: "#0f172a" }}>Welcome back</h1>
          <p style={{ color: "#64748b", marginTop: "8px" }}>Login to discover amazing events</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#0f172a" }}>Email address</label>
            <div style={{ display: "flex", alignItems: "center", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "12px 16px", background: "#f8fafc" }}>
              <Mail size={18} style={{ color: "#94a3b8", marginRight: "12px" }} />
              <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ flex: 1, border: "none", background: "transparent", outline: "none", fontSize: "15px" }} />
            </div>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#0f172a" }}>Password</label>
            <div style={{ display: "flex", alignItems: "center", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "12px 16px", background: "#f8fafc" }}>
              <Lock size={18} style={{ color: "#94a3b8", marginRight: "12px" }} />
              <input type={showPassword ? "text" : "password"} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ flex: 1, border: "none", background: "transparent", outline: "none", fontSize: "15px" }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ background: "none", border: "none", cursor: "pointer" }}>{showPassword ? <EyeOff size={18} style={{ color: "#94a3b8" }} /> : <Eye size={18} style={{ color: "#94a3b8" }} />}</button>
            </div>
          </div>

          {error && <div style={{ background: "#fee2e2", color: "#991b1b", padding: "12px", borderRadius: "12px", marginBottom: "20px", fontSize: "14px" }}>{error}</div>}

          <button type="submit" disabled={loading} style={{ width: "100%", background: "#f97316", color: "white", border: "none", padding: "14px", borderRadius: "40px", fontSize: "16px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            {loading ? "Logging in..." : "Login"} {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div style={{ marginTop: "24px", textAlign: "center", borderTop: "1px solid #eef2ff", paddingTop: "24px" }}>
          <p style={{ color: "#64748b" }}>Don't have an account? <Link href="/signup" style={{ color: "#f97316", fontWeight: "500", textDecoration: "none" }}>Sign up</Link></p>
        </div>
      </div>
    </div>
  );
}
