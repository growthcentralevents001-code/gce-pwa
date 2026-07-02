"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";

export default function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || searchParams.get("redirect") || "/";
  const { login, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      // Force redirect to admin if email contains admin
      if (user.email?.includes("admin")) {
        window.location.href = "/admin";
      } else {
        window.location.href = redirectTo;
      }
    }
  }, [user, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const success = await login(email, password);
    
    if (!success) {
      setError("Invalid email or password");
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "facebook") => {
    alert(`${provider} login coming soon!`);
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

        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
          <button onClick={() => handleSocialLogin("google")} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", width: "100%", padding: "12px", background: "white", border: "1px solid #e2e8f0", borderRadius: "40px", cursor: "pointer", fontWeight: "500" }}>
            <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#ea4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3-3C17.5 2.3 14.9 1 12 1 7.5 1 3.7 3.8 1.9 7.6l3.5 2.7C6.4 7.3 9 5 12 5z"/><path fill="#fbbc04" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.2 2.8-2.4 3.6l3.5 2.8c2-1.8 3.4-4.5 3.9-7.6z"/><path fill="#34a853" d="M5.4 14.3c-.4-1.1-.6-2.3-.6-3.5s.2-2.4.6-3.5L1.9 4.6C.7 6.2 0 8.1 0 10c0 1.9.7 3.8 1.9 5.4l3.5-2.7z"/><path fill="#4c8bf5" d="M12 23c2.9 0 5.4-1 7.3-2.6l-3.5-2.8c-1 .7-2.3 1.1-3.8 1.1-3 0-5.6-2.1-6.5-5l-3.5 2.7C3.7 20.2 7.5 23 12 23z"/></svg>
            Continue with Google
          </button>
          <button onClick={() => handleSocialLogin("facebook")} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", width: "100%", padding: "12px", background: "#1877f2", border: "none", borderRadius: "40px", cursor: "pointer", fontWeight: "500", color: "white" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M22 12c0-5.5-4.5-10-10-10S2 6.5 2 12c0 5 3.7 9.1 8.4 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7C18.3 21.1 22 17 22 12z"/></svg>
            Continue with Facebook
          </button>
        </div>

        <div style={{ textAlign: "center", marginBottom: "24px", position: "relative" }}>
          <span style={{ background: "white", padding: "0 12px", color: "#94a3b8", fontSize: "14px" }}>or login with email</span>
          <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: "1px", background: "#e2e8f0", zIndex: -1 }}></div>
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
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <label style={{ fontWeight: "500", color: "#0f172a" }}>Password</label>
              <Link href="/forgot-password" style={{ fontSize: "13px", color: "#f97316", textDecoration: "none" }}>Forgot password?</Link>
            </div>
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

        <div style={{ marginTop: "24px", textAlign: "center" }}>
          <p style={{ color: "#64748b" }}>Don't have an account? <Link href="/signup" style={{ color: "#f97316", fontWeight: "500", textDecoration: "none" }}>Sign up</Link></p>
        </div>
      </div>
    </div>
  );
}
