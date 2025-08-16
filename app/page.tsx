"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  FileText,
  PenTool,
  Video,
  BarChart3,
  Bell,
  Search,
  Plus,
  CheckCircle,
  Clock,
  TrendingUp,
  Shield,
  Heart,
  User,
  XCircle,
  Eye,
  BookOpen,
  LogOut,
} from "lucide-react"
import Link from "next/link"

export default function AgentDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [spajData, setSpajData] = useState<any[]>([])
  const [agent, setAgent] = useState<any>(null)

  useEffect(() => {
    const authData = localStorage.getItem("agentAuth")
    if (!authData) {
      router.push("/auth/login")
      return
    }

    try {
      const parsedAuth = JSON.parse(authData)
      if (!parsedAuth.isAuthenticated) {
        router.push("/auth/login")
        return
      }
      setAgent(parsedAuth.agent)
    } catch (error) {
      router.push("/auth/login")
      return
    }

    const savedSPAJs = JSON.parse(localStorage.getItem("spajSubmissions") || "[]")
    setSpajData(savedSPAJs)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("agentAuth")
    router.push("/auth/login")
  }

  if (!agent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Memuat dashboard...</p>
        </div>
      </div>
    )
  }

  const stats = [
    {
      title: "Total SPAJ",
      value: spajData.length.toString(),
      change: "+12%",
      icon: FileText,
      color: "text-primary",
    },
    {
      title: "Pending Review",
      value: spajData.filter((spaj) => spaj.status === "pending").length.toString(),
      change: "+5%",
      icon: Clock,
      color: "text-orange-600",
    },
    {
      title: "Approved",
      value: spajData.filter((spaj) => spaj.status === "approved").length.toString(),
      change: "+8%",
      icon: CheckCircle,
      color: "text-green-600",
    },
    { title: "Premium Bulan Ini", value: "Rp 2.4M", change: "+15%", icon: TrendingUp, color: "text-blue-600" },
  ]

  const recentApplications =
    spajData.length > 0
      ? spajData
          .slice(-4)
          .reverse()
          .map((spaj) => ({
            id: spaj.id || `SPAJ-${Date.now()}`,
            client: spaj.fullName || "Unknown",
            product: spaj.productName || spaj.productType || "Unknown Product",
            status: spaj.status || "pending",
            underwritingResult: spaj.underwritingResult || "pending_review",
            sumInsured: spaj.sumInsured || "0",
            date: spaj.submittedAt
              ? new Date(spaj.submittedAt).toLocaleDateString("id-ID")
              : new Date().toLocaleDateString("id-ID"),
          }))
      : [
          {
            id: "SPAJ001",
            client: "Budi Santoso",
            product: "Unit Link",
            status: "pending",
            underwritingResult: "approved",
            sumInsured: "500000000",
            date: "2024-01-15",
          },
          {
            id: "SPAJ002",
            client: "Sari Dewi",
            product: "Traditional",
            status: "approved",
            underwritingResult: "approved",
            sumInsured: "250000000",
            date: "2024-01-14",
          },
          {
            id: "SPAJ003",
            client: "Ahmad Rahman",
            product: "Health",
            status: "review",
            underwritingResult: "approved_with_conditions",
            sumInsured: "100000000",
            date: "2024-01-13",
          },
          {
            id: "SPAJ004",
            client: "Linda Wijaya",
            product: "Personal Accident",
            status: "approved",
            underwritingResult: "approved",
            sumInsured: "1000000000",
            date: "2024-01-12",
          },
        ]

  const productTypes = [
    { name: "Traditional", icon: Shield, description: "Asuransi jiwa tradisional dengan manfaat tetap" },
    { name: "Unit Link", icon: TrendingUp, description: "Kombinasi asuransi dan investasi" },
    { name: "Personal Accident", icon: User, description: "Perlindungan terhadap kecelakaan diri" },
    { name: "Health", icon: Heart, description: "Asuransi kesehatan komprehensif" },
  ]

  const getStatusBadge = (status: string, underwritingResult?: string) => {
    if (underwritingResult === "approved") {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">UW: Disetujui</Badge>
    } else if (underwritingResult === "approved_with_conditions") {
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">UW: Syarat</Badge>
    } else if (underwritingResult === "declined") {
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">UW: Ditolak</Badge>
    }

    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Disetujui</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Menunggu</Badge>
      case "review":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Review</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Ditolak</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const updateSPAJStatus = (spajId: string, newStatus: string) => {
    const updatedSPAJs = spajData.map((spaj) => (spaj.id === spajId ? { ...spaj, status: newStatus } : spaj))
    setSpajData(updatedSPAJs)
    localStorage.setItem("spajSubmissions", JSON.stringify(updatedSPAJs))
  }

  const formatCurrency = (amount: string) => {
    const num = Number.parseInt(amount, 10)
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <img src="/mastersystem-logo.png" alt="BNI Life" className="w-8 h-8" />
                <div>
                  <h1 className="font-work-sans font-bold text-xl text-foreground">BNI Life</h1>
                  <p className="text-sm text-muted-foreground">Agent Portal</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="text"
                  placeholder="Cari SPAJ, nasabah..."
                  className="pl-10 pr-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 w-64"
                />
              </div>
              <Button variant="outline" size="icon">
                <Bell className="w-4 h-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src="/professional-agent-avatar.png" />
                  <AvatarFallback>
                    {agent.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-foreground">{agent.name}</p>
                  <p className="text-xs text-muted-foreground">{agent.branch}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="font-work-sans font-bold text-2xl text-foreground mb-2">Selamat Datang, {agent.name}</h2>
          <p className="text-muted-foreground">
            Kelola aplikasi asuransi dan tingkatkan produktivitas Anda dengan mudah
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-green-600">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-muted ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="font-work-sans">Aksi Cepat</CardTitle>
                <CardDescription>Fitur utama untuk produktivitas Anda</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/spaj">
                  <Button className="w-full justify-start" size="lg">
                    <Plus className="w-4 h-4 mr-2" />
                    Buat SPAJ Baru
                  </Button>
                </Link>
                <Link href="/illustration">
                  <Button variant="outline" className="w-full justify-start bg-transparent" size="lg">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Ilustrasi Produk
                  </Button>
                </Link>
                <Link href="/education">
                  <Button variant="outline" className="w-full justify-start bg-transparent" size="lg">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Edukasi & Marketing
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start bg-transparent" size="lg">
                  <PenTool className="w-4 h-4 mr-2" />
                  e-Signature
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" size="lg">
                  <Video className="w-4 h-4 mr-2" />
                  Recording Video
                </Button>
              </CardContent>
            </Card>

            {/* Product Types */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="font-work-sans">Jenis Produk</CardTitle>
                <CardDescription>Pilih produk asuransi yang sesuai</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {productTypes.map((product, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-primary/10">
                      <product.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{product.name}</h4>
                      <p className="text-sm text-muted-foreground">{product.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Recent Applications */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="font-work-sans">Aplikasi Terbaru</CardTitle>
                    <CardDescription>SPAJ yang baru disubmit dan statusnya</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    Lihat Semua
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentApplications.map((app, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-10 h-10">
                          <AvatarImage
                            src={`/abstract-geometric-shapes.png?height=40&width=40&query=${app.client} avatar`}
                          />
                          <AvatarFallback>
                            {app.client
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium text-foreground">{app.client}</h4>
                          <p className="text-sm text-muted-foreground">
                            {app.id} • {app.product}
                          </p>
                          <p className="text-xs text-muted-foreground">UP: {formatCurrency(app.sumInsured)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">{app.date}</p>
                          {getStatusBadge(app.status, app.underwritingResult)}
                        </div>
                        <div className="flex space-x-2">
                          {app.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateSPAJStatus(app.id, "approved")}
                                className="text-green-600 hover:text-green-700"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateSPAJStatus(app.id, "rejected")}
                                className="text-red-600 hover:text-red-700"
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          <Link href={`/spaj/${app.id}`}>
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                  {recentApplications.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Belum ada SPAJ yang disubmit</p>
                      <p className="text-sm">Mulai dengan membuat SPAJ baru</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Marketing Materials */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="font-work-sans">Materi Marketing</CardTitle>
                <CardDescription>Flyer dan video promosi terbaru</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10 p-6">
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary">Baru</Badge>
                    </div>
                    <h4 className="font-work-sans font-semibold text-foreground mb-2">Promo Unit Link Q1 2024</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Dapatkan bonus investasi hingga 10% untuk nasabah baru
                    </p>
                    <Link href="/education">
                      <Button size="sm" variant="outline">
                        Download Flyer
                      </Button>
                    </Link>
                  </div>
                  <div className="relative rounded-lg overflow-hidden bg-gradient-to-br from-accent/10 to-primary/10 p-6">
                    <div className="absolute top-4 right-4">
                      <Video className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <h4 className="font-work-sans font-semibold text-foreground mb-2">Video Edukasi Asuransi</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Penjelasan lengkap manfaat asuransi jiwa untuk keluarga
                    </p>
                    <Link href="/education">
                      <Button size="sm" variant="outline">
                        Tonton Video
                      </Button>
                    </Link>
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
