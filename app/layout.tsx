import type { Metadata } from "next";
import { AuthProvider } from "./context/AuthContext";
import HeaderWrapper from "./components/HeaderWrapper";
import "./globals.css";

export const metadata: Metadata = {
  title: "GCE Events",
  description: "Discover amazing events near you",
  manifest: "/manifest.json",
  themeColor: "#f97316",
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "GCE Events"
  },
  formatDetection: {
    telephone: false
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body>
        <AuthProvider>
          <HeaderWrapper />
          {children}
          <footer style={{ background: "white", borderTop: "1px solid #eef2ff", padding: "32px 24px", marginTop: "48px" }}>
            <div style={{ maxWidth: "1280px", margin: "0 auto", textAlign: "center", color: "#64748b", fontSize: "14px" }}>
              <p>© 2025 GCE Events. All rights reserved.</p>
              <div style={{ display: "flex", justifyContent: "center", gap: "24px", marginTop: "16px" }}>
                <a href="/about" style={{ color: "#64748b", textDecoration: "none" }}>About</a>
                <a href="/terms" style={{ color: "#64748b", textDecoration: "none" }}>Terms</a>
                <a href="/privacy" style={{ color: "#64748b", textDecoration: "none" }}>Privacy</a>
                <a href="/contact" style={{ color: "#64748b", textDecoration: "none" }}>Contact</a>
              </div>
            </div>
          </footer>
        </AuthProvider>
        <script dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw').then(function(reg) {
                  console.log('✅ Service worker registered', reg);
                }).catch(function(err) {
                  console.log('❌ Service worker registration failed', err);
                });
              });
            }
          `
        }} />
      </body>
    </html>
  );
}
