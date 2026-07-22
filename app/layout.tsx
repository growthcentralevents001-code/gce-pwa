import type { Metadata, Viewport } from "next";
import { AuthProvider } from "./context/AuthContext";
import { RoleProvider } from "@/context/RoleContext";
import Header from "./components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "GCE Events",
  description: "Discover amazing events near you",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#f97316",
};

// Make all pages dynamic (no static generation)
export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Righteous&display=swap"
          rel="stylesheet"
        />
        <style>{`
          :root {
            --font-display: "Righteous", cursive;
            --font-body: "Poppins", sans-serif;
          }
        `}</style>
      </head>
      <body>
        <AuthProvider><RoleProvider>
          <Header />
          {children}
          <footer style={{ background: "white", borderTop: "1px solid #eef2ff", padding: "32px 24px", marginTop: "48px" }}>
            <div style={{ maxWidth: "1280px", margin: "0 auto", textAlign: "center", color: "#64748b", fontSize: "14px" }}>
              <p>© 2026 GCE Events. All rights reserved.</p>
              <div style={{ display: "flex", justifyContent: "center", gap: "24px", marginTop: "16px" }}>
                <a href="/about" style={{ color: "#64748b", textDecoration: "none" }}>About</a>
                <a href="/terms" style={{ color: "#64748b", textDecoration: "none" }}>Terms</a>
                <a href="/privacy" style={{ color: "#64748b", textDecoration: "none" }}>Privacy</a>
                <a href="/contact" style={{ color: "#64748b", textDecoration: "none" }}>Contact</a>
              </div>
            </div>
          </footer>
        </RoleProvider></AuthProvider>
      </body>
    </html>
  );
}
