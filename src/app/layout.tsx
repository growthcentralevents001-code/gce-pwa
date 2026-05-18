import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GCE - Growth Central Events",
  description: "Discover events, connect with people, grow your network",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>{children}</main>
      </body>
    </html>
  );
}
