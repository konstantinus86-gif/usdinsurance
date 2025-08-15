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
  title: "Mastersystem ICT Solutions - Aplikasi Agen Asuransi",
  description: "Aplikasi submission online untuk agen asuransi - Mastersystem ICT Solutions",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className={`${inter.variable} ${workSans.variable} antialiased`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
