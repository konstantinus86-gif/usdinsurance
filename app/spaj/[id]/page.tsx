"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Download,
  FileText,
  User,
  Shield,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  CreditCard,
  Calendar,
} from "lucide-react"
import { jsPDF } from "jspdf"

export default function SPAJDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [spajData, setSpajData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedSPAJs = JSON.parse(localStorage.getItem("spajSubmissions") || "[]")
    const spaj = savedSPAJs.find((s: any) => s.id === params.id)
    setSpajData(spaj)
    setLoading(false)
  }, [params.id])

  const calculatePremiumDetails = (spajData: any) => {
    if (!spajData) return null

    const basePremium = Number(spajData.premium || 0)
    const sumInsured = Number(spajData.sumInsured || 0)
    const paymentMethod = spajData.paymentMethod || "Bulanan"

    // Calculate premium based on payment frequency
    let premiumPerPeriod = basePremium
    let frequency = "Bulanan"
    let periodsPerYear = 12

    switch (paymentMethod.toLowerCase()) {
      case "tahunan":
        premiumPerPeriod = basePremium
        frequency = "Tahunan"
        periodsPerYear = 1
        break
      case "semesteran":
        premiumPerPeriod = basePremium / 2
        frequency = "Semesteran"
        periodsPerYear = 2
        break
      case "kuartalan":
        premiumPerPeriod = basePremium / 4
        frequency = "Kuartalan"
        periodsPerYear = 4
        break
      case "bulanan":
      default:
        premiumPerPeriod = basePremium / 12
        frequency = "Bulanan"
        periodsPerYear = 12
        break
    }

    // Calculate additional fees
    const adminFee = premiumPerPeriod * 0.05 // 5% admin fee
    const totalPremium = premiumPerPeriod + adminFee

    return {
      basePremium: premiumPerPeriod,
      adminFee,
      totalPremium,
      frequency,
      periodsPerYear,
      annualPremium: basePremium,
      premiumRate: ((basePremium / sumInsured) * 100).toFixed(2),
    }
  }

  const generatePDF = () => {
    if (!spajData) return

    const premiumDetails = calculatePremiumDetails(spajData)

    const doc = new jsPDF()

    doc.text(`Laporan SPAJ - ${spajData.id}`, 10, 10)
    doc.text(`Nomor SPAJ: ${spajData.id}`, 10, 20)
    doc.text(`Tanggal Submit: ${new Date(spajData.submittedAt || Date.now()).toLocaleDateString("id-ID")}`, 10, 30)
    doc.text(
      `Status: ${spajData.status === "approved" ? "Disetujui" : spajData.status === "pending" ? "Menunggu" : "Ditolak"}`,
      10,
      40,
    )
    doc.text(`Jenis Produk: ${spajData.productType}`, 10, 50)

    doc.text(`Data Tertanggung`, 10, 60)
    doc.text(`Nama Lengkap: ${spajData.fullName}`, 10, 70)
    doc.text(`Tanggal Lahir: ${spajData.birthDate}`, 10, 80)
    doc.text(`Jenis Kelamin: ${spajData.gender}`, 10, 90)
    doc.text(`No. KTP: ${spajData.idNumber}`, 10, 100)
    doc.text(`Email: ${spajData.email}`, 10, 110)
    doc.text(`No. Telepon: ${spajData.phone}`, 10, 120)
    doc.text(`Alamat: ${spajData.address}`, 10, 130)
    doc.text(`Pekerjaan: ${spajData.occupation}`, 10, 140)

    if (premiumDetails) {
      doc.text(`Detail Produk & Premi`, 10, 150)
      doc.text(`Rincian Premi ${premiumDetails.frequency}`, 10, 160)
      doc.text(
        `Premi Dasar ${premiumDetails.frequency}: ${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(premiumDetails.basePremium)}`,
        10,
        170,
      )
      doc.text(
        `Biaya Administrasi (5%): ${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(premiumDetails.adminFee)}`,
        10,
        180,
      )
      doc.text(
        `Total Premi ${premiumDetails.frequency}: ${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(premiumDetails.totalPremium)}`,
        10,
        190,
      )
      doc.text(
        `Premi Tahunan: ${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(premiumDetails.annualPremium)}`,
        10,
        200,
      )
    }

    if (spajData.underwritingResult) {
      doc.text(`Hasil Underwriting`, 10, 210)
      doc.text(
        `Keputusan: ${spajData.underwritingResult === "approved" ? "Disetujui" : spajData.underwritingResult === "approved_with_conditions" ? "Disetujui dengan Syarat" : "Ditolak"}`,
        10,
        220,
      )
      doc.text(`Skor Risiko: ${spajData.riskScore || "N/A"}`, 10, 230)
      if (spajData.adjustedPremium) {
        doc.text(
          `Premi Disesuaikan: ${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(Number(spajData.adjustedPremium))}`,
          10,
          240,
        )
      }
      if (spajData.underwritingNotes) {
        doc.text(`Catatan: ${spajData.underwritingNotes}`, 10, 250)
      }
    }

    doc.text(`Dokumen ini digenerate secara otomatis oleh sistem BNI Life`, 10, 260)
    doc.text(
      `Tanggal cetak: ${new Date().toLocaleDateString("id-ID")} ${new Date().toLocaleTimeString("id-ID")}`,
      10,
      270,
    )

    doc.save(`SPAJ_${spajData.id}_Report.pdf`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Clock className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p>Memuat detail SPAJ...</p>
        </div>
      </div>
    )
  }

  if (!spajData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-semibold mb-2">SPAJ Tidak Ditemukan</h2>
          <p className="text-muted-foreground mb-4">SPAJ dengan ID tersebut tidak ditemukan</p>
          <Button onClick={() => router.push("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Dashboard
          </Button>
        </div>
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-600" />
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-600" />
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Disetujui</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Ditolak</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Menunggu</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getUnderwritingBadge = (result: string) => {
    switch (result) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">UW: Disetujui</Badge>
      case "approved_with_conditions":
        return <Badge className="bg-yellow-100 text-yellow-800">UW: Disetujui dengan Syarat</Badge>
      case "declined":
        return <Badge className="bg-red-100 text-red-800">UW: Ditolak</Badge>
      default:
        return <Badge variant="secondary">UW: Pending Review</Badge>
    }
  }

  const premiumDetails = calculatePremiumDetails(spajData)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => router.push("/")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali
              </Button>
              <div>
                <h1 className="font-work-sans font-bold text-xl">Detail SPAJ</h1>
                <p className="text-sm text-muted-foreground">{spajData.id}</p>
              </div>
            </div>
            <Button onClick={generatePDF} className="bg-primary hover:bg-primary/90">
              <Download className="w-4 h-4 mr-2" />
              Download Laporan PDF
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status Overview */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {getStatusIcon(spajData.status)}
                  <span>Status SPAJ</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Status Aplikasi:</span>
                  {getStatusBadge(spajData.status)}
                </div>
                {spajData.underwritingResult && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Hasil Underwriting:</span>
                    {getUnderwritingBadge(spajData.underwritingResult)}
                  </div>
                )}
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Tanggal Submit:</span>
                    <span className="text-sm font-medium">
                      {new Date(spajData.submittedAt || Date.now()).toLocaleDateString("id-ID")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Jenis Produk:</span>
                    <span className="text-sm font-medium">{spajData.productType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Uang Pertanggungan:</span>
                    <span className="text-sm font-medium">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(Number(spajData.sumInsured || 0))}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {premiumDetails && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="w-5 h-5" />
                    <span>Informasi Premi</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
                    <div className="text-center mb-3">
                      <p className="text-sm text-muted-foreground">Premi {premiumDetails.frequency}</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(premiumDetails.totalPremium)}
                      </p>
                    </div>
                    <Separator className="my-3" />
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Premi Dasar:</span>
                        <span className="font-medium">
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(premiumDetails.basePremium)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Biaya Admin (5%):</span>
                        <span className="font-medium">
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(premiumDetails.adminFee)}
                        </span>
                      </div>
                      <div className="flex justify-between text-orange-600 font-semibold">
                        <span>Total per {premiumDetails.frequency}:</span>
                        <span>
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(premiumDetails.totalPremium)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Premi Tahunan:</span>
                      <span className="font-medium">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(premiumDetails.annualPremium)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rate Premi:</span>
                      <span className="font-medium">{premiumDetails.premiumRate}% dari UP</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Frekuensi Bayar:</span>
                      <span className="font-medium">{premiumDetails.periodsPerYear}x per tahun</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Jadwal Pembayaran</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Jatuh Tempo Pertama:</span>
                      <span className="font-medium">
                        {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("id-ID")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Metode Pembayaran:</span>
                      <span className="font-medium">{spajData.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status Pembayaran:</span>
                      <Badge variant="outline" className="text-xs">
                        Menunggu Aktivasi
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Underwriting Results */}
            {spajData.underwritingResult && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-5 h-5" />
                    <span>Hasil Underwriting</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Skor Risiko:</span>
                      <span className="text-lg font-bold text-primary">{spajData.riskScore || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Keputusan:</span>
                      <span className="text-sm">
                        {spajData.underwritingResult === "approved"
                          ? "Disetujui"
                          : spajData.underwritingResult === "approved_with_conditions"
                            ? "Disetujui dengan Syarat"
                            : "Ditolak"}
                      </span>
                    </div>
                    {spajData.adjustedPremium && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Premi Disesuaikan:</span>
                        <span className="text-sm font-bold text-green-600">
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(Number(spajData.adjustedPremium))}
                        </span>
                      </div>
                    )}
                  </div>
                  {spajData.underwritingNotes && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Catatan Underwriting:</h4>
                      <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded">
                        {spajData.underwritingNotes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Detailed Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Data Tertanggung</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Nama Lengkap</label>
                      <p className="text-sm font-medium">{spajData.fullName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Tanggal Lahir</label>
                      <p className="text-sm font-medium">{spajData.birthDate}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Jenis Kelamin</label>
                      <p className="text-sm font-medium">{spajData.gender}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">No. KTP</label>
                      <p className="text-sm font-medium">{spajData.idNumber}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      <p className="text-sm font-medium flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                        {spajData.email}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">No. Telepon</label>
                      <p className="text-sm font-medium flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                        {spajData.phone}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Alamat</label>
                      <p className="text-sm font-medium flex items-start">
                        <MapPin className="w-4 h-4 mr-2 mt-0.5 text-muted-foreground" />
                        {spajData.address}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Pekerjaan</label>
                      <p className="text-sm font-medium flex items-center">
                        <Briefcase className="w-4 h-4 mr-2 text-muted-foreground" />
                        {spajData.occupation}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Detail Produk</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Jenis Produk</label>
                      <p className="text-sm font-medium">{spajData.productType}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Nama Produk</label>
                      <p className="text-sm font-medium">{spajData.productName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Uang Pertanggungan</label>
                      <p className="text-lg font-bold text-primary">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(Number(spajData.sumInsured || 0))}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Premi</label>
                      <p className="text-lg font-bold text-green-600">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(Number(spajData.premium || 0))}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Cara Bayar</label>
                      <p className="text-sm font-medium">{spajData.paymentMethod}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Masa Asuransi</label>
                      <p className="text-sm font-medium">{spajData.coveragePeriod || "Seumur Hidup"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Documents */}
            {spajData.uploadedDocuments && spajData.uploadedDocuments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>Dokumen Pendukung</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {spajData.uploadedDocuments.map((doc: any, index: number) => (
                      <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <FileText className="w-8 h-8 text-primary" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">{doc.type}</p>
                        </div>
                        <Badge variant="outline">Uploaded</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
