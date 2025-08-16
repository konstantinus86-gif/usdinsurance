import type React from "react"
import type { Metadata } from "next"
import { Inter, Work_Sans } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const workSans = Work_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-work-sans",
})

export const metadata: Metadata = {
  title: "BNI Life - Aplikasi Agen Asuransi",
  description: "Aplikasi submission online untuk agen asuransi - BNI Life",
  generator: "v0.app",
  manifest: "/manifest.json",
  themeColor: "#ea580c",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "BNI Life Agent",
  },
  formatDetection: {
    telephone: false,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className={`${inter.variable} ${workSans.variable} antialiased`}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="BNI Life Agent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#ea580c" />
        <meta name="msapplication-tap-highlight" content="no" />
        <link rel="apple-touch-icon" href="/mastersystem-logo.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/mastersystem-logo.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/mastersystem-logo.png" />
      </head>
      <body className="font-sans touch-manipulation">{children}</body>
    </html>
  )
}
