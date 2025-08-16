"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Send,
  Bot,
  ArrowLeft,
  Sparkles,
  Calculator,
  Shield,
  Heart,
  TrendingUp,
  FileText,
  Phone,
  Mail,
  Clock,
} from "lucide-react"
import Link from "next/link"

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
  suggestions?: string[]
}

export default function ChatbotPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [agent, setAgent] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const authData = localStorage.getItem("agentAuth")
    if (!authData) {
      router.push("/auth/login")
      return
    }

    let parsedAuth: any
    try {
      parsedAuth = JSON.parse(authData)
      if (!parsedAuth.isAuthenticated) {
        router.push("/auth/login")
        return
      }
      setAgent(parsedAuth.agent)
    } catch (error) {
      router.push("/auth/login")
      return
    }

    // Initial welcome message
    const welcomeMessage: Message = {
      id: "welcome",
      type: "bot",
      content: `Halo ${parsedAuth.agent?.name || "Agen"}! 👋 Saya adalah AI Assistant BNI Life yang siap membantu Anda dengan informasi produk asuransi, simulasi premi, dan pertanyaan seputar asuransi. Apa yang ingin Anda ketahui hari ini?`,
      timestamp: new Date(),
      suggestions: [
        "Jelaskan produk Unit Link",
        "Simulasi premi asuransi jiwa",
        "Perbedaan Traditional vs Unit Link",
        "Cara mengajukan klaim",
        "Manfaat asuransi kesehatan",
      ],
    }
    setMessages([welcomeMessage])
  }, [router])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()

    // Produk asuransi
    if (message.includes("unit link") || message.includes("unitlink")) {
      return `**Unit Link** adalah produk asuransi yang menggabungkan proteksi jiwa dengan investasi. 

**Keunggulan:**
• Proteksi jiwa + investasi dalam satu produk
• Fleksibilitas pembayaran premi
• Potensi return investasi yang menarik
• Dapat melakukan top up dan partial withdrawal

**Cocok untuk:** Nasabah yang ingin proteksi sekaligus investasi jangka panjang

Apakah Anda ingin simulasi premi Unit Link?`
    }

    if (message.includes("traditional") || message.includes("tradisional")) {
      return `**Asuransi Jiwa Traditional** memberikan proteksi jiwa dengan manfaat yang sudah pasti.

**Keunggulan:**
• Manfaat pasti dan terjamin
• Premi tetap selama masa kontrak
• Cocok untuk perencanaan keuangan jangka panjang
• Dapat dikombinasikan dengan rider

**Cocok untuk:** Nasabah yang mengutamakan kepastian manfaat

Butuh ilustrasi produk Traditional?`
    }

    if (message.includes("health") || message.includes("kesehatan")) {
      return `**Asuransi Kesehatan BNI Life** memberikan perlindungan komprehensif untuk biaya pengobatan.

**Manfaat:**
• Rawat inap dan rawat jalan
• Pembedahan dan persalinan
• Medical check-up berkala
• Cashless di rumah sakit rekanan

**Limit:** Hingga Rp 2 miliar per tahun
**Network:** 1000+ rumah sakit di seluruh Indonesia

Ingin tahu lebih detail tentang manfaat kesehatan?`
    }

    if (message.includes("personal accident") || message.includes("kecelakaan")) {
      return `**Personal Accident** melindungi Anda dari risiko kecelakaan 24 jam.

**Manfaat:**
• Santunan meninggal dunia akibat kecelakaan
• Santunan cacat tetap total/sebagian
• Biaya pengobatan akibat kecelakaan
• Santunan harian rawat inap

**Premi:** Mulai dari Rp 100.000/tahun
**Uang Pertanggungan:** Hingga Rp 1 miliar

Butuh simulasi Personal Accident?`
    }

    // Simulasi dan perhitungan
    if (message.includes("simulasi") || message.includes("hitung") || message.includes("premi")) {
      return `**Simulasi Premi Asuransi** 📊

Untuk simulasi yang akurat, saya butuh informasi:
• Usia tertanggung
• Jenis kelamin
• Pekerjaan
• Uang pertanggungan yang diinginkan
• Jenis produk (Traditional/Unit Link/Health/PA)

**Contoh Simulasi Unit Link:**
- Usia: 30 tahun, Pria
- UP: Rp 500 juta
- Premi: Rp 2.5 juta/tahun

Mau simulasi untuk profil tertentu?`
    }

    // Perbedaan produk
    if (message.includes("perbedaan") || message.includes("banding")) {
      return `**Perbandingan Produk Asuransi BNI Life** 📋

**Traditional vs Unit Link:**
• Traditional: Manfaat pasti, premi tetap
• Unit Link: Proteksi + investasi, fleksibel

**Health vs Personal Accident:**
• Health: Semua penyakit & kecelakaan
• PA: Khusus kecelakaan saja

**Rekomendasi berdasarkan profil:**
• Konservatif → Traditional + Health
• Moderat → Unit Link + PA
• Agresif → Unit Link dengan top up

Butuh rekomendasi personal?`
    }

    // Klaim
    if (message.includes("klaim") || message.includes("claim")) {
      return `**Prosedur Klaim BNI Life** 📝

**Dokumen yang diperlukan:**
• Formulir klaim
• Polis asli
• Surat keterangan dokter/rumah sakit
• Fotokopi KTP & KK

**Proses Klaim:**
1. Lapor klaim maksimal 30 hari
2. Submit dokumen lengkap
3. Verifikasi tim underwriting
4. Pembayaran 14 hari kerja

**Contact Center:** 1500-045
**Email:** customer.care@bni-life.co.id

Ada klaim yang perlu diproses?`
    }

    // Underwriting
    if (message.includes("underwriting") || message.includes("persetujuan")) {
      return `**Proses Underwriting BNI Life** 🔍

**Faktor Penilaian:**
• Usia dan jenis kelamin
• Riwayat kesehatan
• Pekerjaan dan penghasilan
• Gaya hidup (merokok, olahraga)
• Uang pertanggungan

**Hasil Underwriting:**
• Approved: Diterima standar
• Approved with conditions: Extra premi/exclusion
• Declined: Ditolak

**Medical Check-up diperlukan jika:**
• UP > Rp 1 miliar
• Usia > 50 tahun
• Riwayat penyakit tertentu

Butuh info lebih detail tentang underwriting?`
    }

    // Rider dan manfaat tambahan
    if (message.includes("rider") || message.includes("tambahan")) {
      return `**Rider/Manfaat Tambahan** ⭐

**Rider Kesehatan:**
• Hospital & Surgical Benefit
• Critical Illness
• Disability Income

**Rider Kecelakaan:**
• Accidental Death & Disability
• Medical Expense Reimbursement

**Rider Investasi:**
• Waiver of Premium
• Family Income Benefit

**Premi Rider:** 10-30% dari premi dasar

Ingin tahu rider yang cocok untuk nasabah?`
    }

    // Tips penjualan
    if (message.includes("tips") || message.includes("jual") || message.includes("closing")) {
      return `**Tips Penjualan Asuransi** 💡

**Approach yang Efektif:**
• Dengarkan kebutuhan nasabah dulu
• Gunakan ilustrasi yang mudah dipahami
• Berikan contoh kasus nyata
• Fokus pada manfaat, bukan fitur

**Handling Objection:**
• "Mahal" → Bandingkan dengan risiko
• "Nanti saja" → Urgency dengan usia
• "Sudah ada" → Gap analysis

**Closing Technique:**
• Alternative close
• Assumptive close
• Urgency close

Butuh script untuk situasi tertentu?`
    }

    // Default response
    return `Terima kasih atas pertanyaan Anda! 😊 

Saya dapat membantu dengan:
• **Informasi Produk** - Traditional, Unit Link, Health, Personal Accident
• **Simulasi Premi** - Perhitungan berdasarkan profil nasabah
• **Proses Klaim** - Prosedur dan dokumen yang diperlukan
• **Tips Penjualan** - Strategi closing dan handling objection
• **Underwriting** - Kriteria penilaian dan persyaratan

Silakan tanyakan hal spesifik yang ingin Anda ketahui!`
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    // Simulate AI thinking time
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: getAIResponse(inputMessage),
        timestamp: new Date(),
        suggestions: [
          "Simulasi premi lainnya",
          "Info produk lain",
          "Tips penjualan",
          "Proses klaim",
          "Hubungi customer service",
        ],
      }

      setMessages((prev) => [...prev, botResponse])
      setIsTyping(false)
    }, 1500)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!agent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Memuat chatbot...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="icon" className="rounded-lg">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <Bot className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="font-work-sans font-bold text-xl text-foreground">AI Assistant</h1>
                  <p className="text-sm text-muted-foreground">BNI Life Insurance Helper</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Online
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat Area */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col border-border bg-background shadow-sm">
              <CardHeader className="border-b border-border">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="/ai-bot-avatar.png" />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      <Bot className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">BNI Life AI Assistant</CardTitle>
                    <p className="text-sm text-muted-foreground">Siap membantu 24/7</p>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        message.type === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground border border-border"
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.type === "bot" && <Bot className="w-4 h-4 mt-1 text-primary flex-shrink-0" />}
                        <div className="flex-1">
                          <div className="whitespace-pre-wrap text-sm leading-relaxed">
                            {message.content.split("**").map((part, index) =>
                              index % 2 === 1 ? (
                                <strong key={index} className="font-semibold">
                                  {part}
                                </strong>
                              ) : (
                                part
                              ),
                            )}
                          </div>
                          <p className="text-xs opacity-70 mt-2">
                            {message.timestamp.toLocaleTimeString("id-ID", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Suggestions */}
                      {message.suggestions && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {message.suggestions.map((suggestion, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="text-xs border-border hover:bg-background/80 bg-background/50"
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-secondary text-secondary-foreground rounded-lg p-4 border border-border">
                      <div className="flex items-center space-x-2">
                        <Bot className="w-4 h-4 text-primary" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-primary rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-primary rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                        <span className="text-sm text-muted-foreground">AI sedang mengetik...</span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </CardContent>

              {/* Input Area */}
              <div className="border-t border-border p-4">
                <div className="flex space-x-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Tanyakan tentang produk asuransi, simulasi, atau tips penjualan..."
                    className="flex-1 border-border focus:ring-primary/20"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Quick Topics */}
            <Card className="border-border bg-background shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-primary" />
                  Topik Populer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { icon: Shield, text: "Produk Traditional", color: "text-blue-600" },
                  { icon: TrendingUp, text: "Unit Link", color: "text-green-600" },
                  { icon: Heart, text: "Asuransi Kesehatan", color: "text-red-600" },
                  { icon: Calculator, text: "Simulasi Premi", color: "text-purple-600" },
                  { icon: FileText, text: "Proses Klaim", color: "text-orange-600" },
                ].map((topic, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start text-left h-auto p-3 hover:bg-secondary/50"
                    onClick={() => handleSuggestionClick(topic.text)}
                  >
                    <topic.icon className={`w-4 h-4 mr-3 ${topic.color}`} />
                    <span className="text-sm">{topic.text}</span>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="border-border bg-background shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Butuh Bantuan Lain?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <Phone className="w-4 h-4 text-primary" />
                  <div>
                    <p className="font-medium">Customer Care</p>
                    <p className="text-muted-foreground">1500-045</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Mail className="w-4 h-4 text-primary" />
                  <div>
                    <p className="font-medium">Email Support</p>
                    <p className="text-muted-foreground text-xs">customer.care@bni-life.co.id</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Clock className="w-4 h-4 text-primary" />
                  <div>
                    <p className="font-medium">Jam Operasional</p>
                    <p className="text-muted-foreground">24/7</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
