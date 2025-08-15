"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Calculator,
  TrendingUp,
  Shield,
  Heart,
  User,
  Download,
  Share,
  PieChart,
  BarChart3,
  DollarSign,
  Calendar,
} from "lucide-react"
import { cn } from "@/lib/utils"

const productTypes = [
  {
    id: "traditional",
    name: "Traditional Life",
    icon: Shield,
    color: "bg-blue-50 border-blue-200",
    description: "Asuransi jiwa tradisional dengan manfaat tetap",
    features: ["Premi tetap", "Manfaat pasti", "Nilai tunai terjamin"],
  },
  {
    id: "unit-link",
    name: "Unit Link",
    icon: TrendingUp,
    color: "bg-green-50 border-green-200",
    description: "Kombinasi asuransi dan investasi",
    features: ["Investasi fleksibel", "Potensi return tinggi", "Pilihan dana beragam"],
  },
  {
    id: "personal-accident",
    name: "Personal Accident",
    icon: User,
    color: "bg-orange-50 border-orange-200",
    description: "Perlindungan terhadap kecelakaan diri",
    features: ["Santunan kecelakaan", "Biaya pengobatan", "Cacat tetap/sementara"],
  },
  {
    id: "health",
    name: "Health Insurance",
    icon: Heart,
    color: "bg-purple-50 border-purple-200",
    description: "Asuransi kesehatan komprehensif",
    features: ["Rawat inap/jalan", "Bedah", "Maternity"],
  },
]

export default function ProductIllustration() {
  const [selectedProduct, setSelectedProduct] = useState("")
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    sumInsured: "",
    premiumPeriod: "",
    paymentFrequency: "",
    occupation: "",
  })
  const [illustration, setIllustration] = useState<any>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const calculateIllustration = async () => {
    setIsCalculating(true)

    // Simulate calculation
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const baseRate = selectedProduct === "unit-link" ? 0.015 : 0.012
    const ageMultiplier = Number.parseInt(formData.age) > 40 ? 1.5 : 1.2
    const genderMultiplier = formData.gender === "male" ? 1.1 : 1.0

    const monthlyPremium = Math.round(
      (Number.parseInt(formData.sumInsured) * baseRate * ageMultiplier * genderMultiplier) / 12,
    )

    const projections = Array.from({ length: 20 }, (_, i) => {
      const year = i + 1
      const cashValue =
        selectedProduct === "unit-link"
          ? Math.round(monthlyPremium * 12 * year * (1 + 0.08) ** year * 0.7)
          : Math.round(monthlyPremium * 12 * year * 0.6)

      return {
        year,
        premium: monthlyPremium * 12,
        cashValue,
        deathBenefit: Number.parseInt(formData.sumInsured),
        totalPremium: monthlyPremium * 12 * year,
      }
    })

    setIllustration({
      productType: selectedProduct,
      monthlyPremium,
      annualPremium: monthlyPremium * 12,
      totalPremium20Years: monthlyPremium * 12 * 20,
      projections,
      assumptions: {
        investmentReturn: selectedProduct === "unit-link" ? "8%" : "6%",
        mortality: "CSO 2001",
        expenses: "Sesuai ketentuan",
      },
    })

    setIsCalculating(false)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const selectedProductData = productTypes.find((p) => p.id === selectedProduct)

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-cyan-800 mb-1">Ilustrasi Produk</h1>
              <p className="text-gray-600">Simulasi manfaat dan proyeksi investasi asuransi</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Form */}
          <div className="lg:col-span-1 space-y-6">
            {/* Product Selection */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3">
                  <Calculator className="h-6 w-6" />
                  Pilih Produk
                </CardTitle>
                <CardDescription className="text-cyan-100">Pilih jenis produk asuransi untuk ilustrasi</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {productTypes.map((product) => {
                    const Icon = product.icon
                    const isSelected = selectedProduct === product.id
                    return (
                      <div
                        key={product.id}
                        className={cn(
                          "border-2 rounded-lg p-4 cursor-pointer transition-all",
                          product.color,
                          isSelected ? "ring-2 ring-cyan-500 border-cyan-500" : "hover:shadow-md",
                        )}
                        onClick={() => setSelectedProduct(product.id)}
                      >
                        <div className="flex items-start gap-3">
                          <Icon className="h-6 w-6 text-gray-600 mt-1" />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800">{product.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                            <div className="flex flex-wrap gap-1">
                              {product.features.map((feature, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Input Parameters */}
            {selectedProduct && (
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <User className="h-5 w-5" />
                    Data Calon Tertanggung
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="font-semibold">Usia</Label>
                      <Input
                        type="number"
                        placeholder="25"
                        value={formData.age}
                        onChange={(e) => updateFormData("age", e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label className="font-semibold">Jenis Kelamin</Label>
                      <Select value={formData.gender} onValueChange={(value) => updateFormData("gender", value)}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Pilih" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Laki-laki</SelectItem>
                          <SelectItem value="female">Perempuan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label className="font-semibold">Uang Pertanggungan</Label>
                    <Select value={formData.sumInsured} onValueChange={(value) => updateFormData("sumInsured", value)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Pilih jumlah" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="100000000">Rp 100 juta</SelectItem>
                        <SelectItem value="250000000">Rp 250 juta</SelectItem>
                        <SelectItem value="500000000">Rp 500 juta</SelectItem>
                        <SelectItem value="1000000000">Rp 1 miliar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="font-semibold">Masa Pembayaran Premi</Label>
                    <Select
                      value={formData.premiumPeriod}
                      onValueChange={(value) => updateFormData("premiumPeriod", value)}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Pilih periode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10 tahun</SelectItem>
                        <SelectItem value="15">15 tahun</SelectItem>
                        <SelectItem value="20">20 tahun</SelectItem>
                        <SelectItem value="lifetime">Seumur hidup</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="font-semibold">Frekuensi Pembayaran</Label>
                    <Select
                      value={formData.paymentFrequency}
                      onValueChange={(value) => updateFormData("paymentFrequency", value)}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Pilih frekuensi" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Bulanan</SelectItem>
                        <SelectItem value="quarterly">Triwulan</SelectItem>
                        <SelectItem value="semi-annual">Semesteran</SelectItem>
                        <SelectItem value="annual">Tahunan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={calculateIllustration}
                    disabled={!formData.age || !formData.gender || !formData.sumInsured || isCalculating}
                    className="w-full bg-cyan-600 hover:bg-cyan-700"
                  >
                    {isCalculating ? "Menghitung..." : "Hitung Ilustrasi"}
                    <Calculator className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Illustration Results */}
          <div className="lg:col-span-2">
            {illustration ? (
              <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-100 text-sm">Premi Bulanan</p>
                          <p className="text-2xl font-bold">{formatCurrency(illustration.monthlyPremium)}</p>
                        </div>
                        <DollarSign className="h-8 w-8 text-blue-200" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-100 text-sm">Uang Pertanggungan</p>
                          <p className="text-2xl font-bold">{formatCurrency(Number.parseInt(formData.sumInsured))}</p>
                        </div>
                        <Shield className="h-8 w-8 text-green-200" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-orange-100 text-sm">Total Premi 20 Tahun</p>
                          <p className="text-2xl font-bold">{formatCurrency(illustration.totalPremium20Years)}</p>
                        </div>
                        <Calendar className="h-8 w-8 text-orange-200" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Projection Table */}
                <Card className="shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-3">
                          <BarChart3 className="h-6 w-6" />
                          Proyeksi Manfaat
                        </CardTitle>
                        <CardDescription>
                          Ilustrasi nilai tunai dan manfaat asuransi ({selectedProductData?.name})
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share className="h-4 w-4 mr-2" />
                          Bagikan
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b bg-gray-50">
                            <th className="text-left p-3 font-semibold">Tahun</th>
                            <th className="text-right p-3 font-semibold">Premi Tahunan</th>
                            <th className="text-right p-3 font-semibold">Total Premi</th>
                            <th className="text-right p-3 font-semibold">Nilai Tunai</th>
                            <th className="text-right p-3 font-semibold">Manfaat Meninggal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {illustration.projections.slice(0, 10).map((proj: any, idx: number) => (
                            <tr key={idx} className="border-b hover:bg-gray-50">
                              <td className="p-3 font-medium">{proj.year}</td>
                              <td className="p-3 text-right">{formatCurrency(proj.premium)}</td>
                              <td className="p-3 text-right">{formatCurrency(proj.totalPremium)}</td>
                              <td className="p-3 text-right text-green-600 font-medium">
                                {formatCurrency(proj.cashValue)}
                              </td>
                              <td className="p-3 text-right text-blue-600 font-medium">
                                {formatCurrency(proj.deathBenefit)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <Separator className="my-6" />

                    {/* Assumptions */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-3">Asumsi Perhitungan</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Return Investasi</p>
                          <p className="font-medium">{illustration.assumptions.investmentReturn} per tahun</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Tabel Mortalita</p>
                          <p className="font-medium">{illustration.assumptions.mortality}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Biaya</p>
                          <p className="font-medium">{illustration.assumptions.expenses}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <strong>Catatan:</strong> Ilustrasi ini bersifat proyeksi dan tidak mengikat. Hasil investasi
                        aktual dapat berbeda dari ilustrasi. Silakan konsultasikan dengan agen untuk penjelasan lengkap
                        mengenai syarat dan ketentuan polis.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="shadow-lg h-96 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <PieChart className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">Ilustrasi Produk</h3>
                  <p>Pilih produk dan isi data untuk melihat ilustrasi manfaat</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
