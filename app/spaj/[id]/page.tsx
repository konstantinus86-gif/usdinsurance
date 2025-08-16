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

    const pdfContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Laporan SPAJ - ${spajData.id}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; color: #333; line-height: 1.6; }
        .header { text-align: center; border-bottom: 3px solid #f97316; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { font-size: 24px; font-weight: bold; color: #f97316; margin-bottom: 5px; }
        .subtitle { color: #666; font-size: 14px; }
        .section { margin-bottom: 25px; page-break-inside: avoid; }
        .section-title { font-size: 18px; font-weight: bold; color: #f97316; margin-bottom: 15px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .info-item { margin-bottom: 10px; }
        .label { font-weight: bold; color: #374151; }
        .value { color: #6b7280; margin-left: 10px; }
        .premium-box { background: #fef3c7; border: 2px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 15px 0; }
        .premium-highlight { background: #f97316; color: white; padding: 10px; border-radius: 5px; text-align: center; font-size: 18px; font-weight: bold; margin: 10px 0; }
        .status-approved { background: #dcfce7; color: #166534; padding: 5px 10px; border-radius: 5px; display: inline-block; }
        .status-pending { background: #fef3c7; color: #92400e; padding: 5px 10px; border-radius: 5px; display: inline-block; }
        .status-rejected { background: #fee2e2; color: #991b1b; padding: 5px 10px; border-radius: 5px; display: inline-block; }
        .underwriting-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; margin: 15px 0; }
        .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 20px; }
        .payment-schedule { background: #f0f9ff; border: 1px solid #0ea5e9; padding: 15px; border-radius: 8px; margin: 10px 0; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        th, td { border: 1px solid #e5e7eb; padding: 8px; text-align: left; }
        th { background: #f9fafb; font-weight: bold; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">BNI Life</div>
        <div class="subtitle">Laporan Detail SPAJ & Informasi Premi</div>
    </div>

    <div class="section">
        <div class="section-title">Informasi SPAJ</div>
        <div class="info-grid">
            <div class="info-item">
                <span class="label">Nomor SPAJ:</span>
                <span class="value">${spajData.id}</span>
            </div>
            <div class="info-item">
                <span class="label">Tanggal Submit:</span>
                <span class="value">${new Date(spajData.submittedAt || Date.now()).toLocaleDateString("id-ID")}</span>
            </div>
            <div class="info-item">
                <span class="label">Status:</span>
                <span class="status-${spajData.status}">${spajData.status === "approved" ? "Disetujui" : spajData.status === "pending" ? "Menunggu" : "Ditolak"}</span>
            </div>
            <div class="info-item">
                <span class="label">Jenis Produk:</span>
                <span class="value">${spajData.productType}</span>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Data Tertanggung</div>
        <div class="info-grid">
            <div class="info-item">
                <span class="label">Nama Lengkap:</span>
                <span class="value">${spajData.fullName}</span>
            </div>
            <div class="info-item">
                <span class="label">Tanggal Lahir:</span>
                <span class="value">${spajData.birthDate}</span>
            </div>
            <div class="info-item">
                <span class="label">Jenis Kelamin:</span>
                <span class="value">${spajData.gender}</span>
            </div>
            <div class="info-item">
                <span class="label">No. KTP:</span>
                <span class="value">${spajData.idNumber}</span>
            </div>
            <div class="info-item">
                <span class="label">Email:</span>
                <span class="value">${spajData.email}</span>
            </div>
            <div class="info-item">
                <span class="label">No. Telepon:</span>
                <span class="value">${spajData.phone}</span>
            </div>
            <div class="info-item">
                <span class="label">Alamat:</span>
                <span class="value">${spajData.address}</span>
            </div>
            <div class="info-item">
                <span class="label">Pekerjaan:</span>
                <span class="value">${spajData.occupation}</span>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Detail Produk & Premi</div>
        <div class="info-grid">
            <div class="info-item">
                <span class="label">Nama Produk:</span>
                <span class="value">${spajData.productName}</span>
            </div>
            <div class="info-item">
                <span class="label">Uang Pertanggungan:</span>
                <span class="value">${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(Number(spajData.sumInsured || 0))}</span>
            </div>
            <div class="info-item">
                <span class="label">Cara Bayar:</span>
                <span class="value">${spajData.paymentMethod}</span>
            </div>
            <div class="info-item">
                <span class="label">Rate Premi:</span>
                <span class="value">${premiumDetails?.premiumRate}% dari UP</span>
            </div>
        </div>
        
        ${
          premiumDetails
            ? `
        <div class="premium-box">
            <h3 style="margin-top: 0; color: #f59e0b;">Rincian Premi ${premiumDetails.frequency}</h3>
            <table>
                <tr>
                    <td><strong>Premi Dasar ${premiumDetails.frequency}</strong></td>
                    <td style="text-align: right;"><strong>${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(premiumDetails.basePremium)}</strong></td>
                </tr>
                <tr>
                    <td>Biaya Administrasi (5%)</td>
                    <td style="text-align: right;">${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(premiumDetails.adminFee)}</td>
                </tr>
                <tr style="background: #fef3c7;">
                    <td><strong>Total Premi ${premiumDetails.frequency}</strong></td>
                    <td style="text-align: right;"><strong>${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(premiumDetails.totalPremium)}</strong></td>
                </tr>
                <tr>
                    <td><strong>Premi Tahunan</strong></td>
                    <td style="text-align: right;"><strong>${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(premiumDetails.annualPremium)}</strong></td>
                </tr>
            </table>
            
            <div class="payment-schedule">
                <h4 style="margin-top: 0;">Jadwal Pembayaran</h4>
                <p><strong>Frekuensi:</strong> ${premiumDetails.frequency} (${premiumDetails.periodsPerYear}x per tahun)</p>
                <p><strong>Jumlah per periode:</strong> ${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(premiumDetails.totalPremium)}</p>
                <p><strong>Tanggal jatuh tempo pertama:</strong> ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("id-ID")}</p>
            </div>
        </div>
        `
            : ""
        }
    </div>

    ${
      spajData.underwritingResult
        ? `
    <div class="section">
        <div class="section-title">Hasil Underwriting</div>
        <div class="underwriting-box">
            <div class="info-item">
                <span class="label">Keputusan:</span>
                <span class="value">${spajData.underwritingResult === "approved" ? "Disetujui" : spajData.underwritingResult === "approved_with_conditions" ? "Disetujui dengan Syarat" : "Ditolak"}</span>
            </div>
            <div class="info-item">
                <span class="label">Skor Risiko:</span>
                <span class="value">${spajData.riskScore || "N/A"}</span>
            </div>
            ${
              spajData.adjustedPremium
                ? `
            <div class="info-item">
                <span class="label">Premi Disesuaikan:</span>
                <span class="value">${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(Number(spajData.adjustedPremium))}</span>
            </div>
            `
                : ""
            }
            ${
              spajData.underwritingNotes
                ? `
            <div class="info-item">
                <span class="label">Catatan:</span>
                <span class="value">${spajData.underwritingNotes}</span>
            </div>
            `
                : ""
            }
        </div>
    </div>
    `
        : ""
    }

    <div class="footer">
        <p>Dokumen ini digenerate secara otomatis oleh sistem BNI Life</p>
        <p>Tanggal cetak: ${new Date().toLocaleDateString("id-ID")} ${new Date().toLocaleTimeString("id-ID")}</p>
        <p><em>Premi dan kondisi dapat berubah sesuai hasil underwriting final</em></p>
    </div>
</body>
</html>
    `

    // Create and download PDF
    const blob = new Blob([pdfContent], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `SPAJ_${spajData.id}_Report.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
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
