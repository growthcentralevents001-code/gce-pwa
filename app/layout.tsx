import type { Metadata, Viewport } from "next";
import { AuthProvider } from "./context/AuthContext";
import { RoleProvider } from "@/context/RoleContext";
import { ThemeProvider } from "@/components/theme-provider";
import { AppChrome } from "@/components/app-shell/AppChrome";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "GCE Events",
    template: "%s · GCE Events",
  },
  description:
    "Growth Central Events — GCE Connect Circles, Marketplace events and offers, and Enterprise delivery across India.",
  manifest: "/manifest.json",
  applicationName: "GCE Events",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "GCE",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#EA580C" },
    { media: "(prefers-color-scheme: dark)", color: "#EA580C" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// Make all pages dynamic (no static generation)
export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* MASTER.md typography: Righteous + Poppins (Batch 0). next/font migration deferred. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- intentional global brand fonts */}
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
      <body className="font-body antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <RoleProvider>
              <AppChrome>{children}</AppChrome>
            </RoleProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
