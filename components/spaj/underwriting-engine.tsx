"use client"

import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertTriangle, XCircle, Heart, DollarSign } from "lucide-react"

interface UnderwritingEngineProps {
  formData: any
}

export default function UnderwritingEngine({ formData }: UnderwritingEngineProps) {
  const calculateDetailedRiskScore = () => {
    let score = 0
    const riskFactors: any[] = []
    const questionnaire = formData.questionnaire || {}
    const personalData = formData.personalData || {}

    // Age-based risk (Indonesian life expectancy considerations)
    const age = personalData.age || 30
    if (age > 65) {
      score += 40
      riskFactors.push({ category: "Usia", factor: "Usia di atas 65 tahun", impact: "Tinggi", points: 40 })
    } else if (age > 55) {
      score += 25
      riskFactors.push({ category: "Usia", factor: "Usia 56-65 tahun", impact: "Sedang", points: 25 })
    } else if (age > 45) {
      score += 15
      riskFactors.push({ category: "Usia", factor: "Usia 46-55 tahun", impact: "Rendah", points: 15 })
    }

    // Occupation risk based on Indonesian insurance classification
    const occupation = personalData.occupation || ""
    const highRiskOccupations = ["pilot", "penambang", "pekerja offshore", "tentara", "polisi", "pemadam kebakaran"]
    const mediumRiskOccupations = ["sopir", "konstruksi", "teknisi listrik", "mekanik", "security"]

    if (highRiskOccupations.some((job) => occupation.toLowerCase().includes(job))) {
      score += 35
      riskFactors.push({ category: "Pekerjaan", factor: "Pekerjaan berisiko tinggi", impact: "Tinggi", points: 35 })
    } else if (mediumRiskOccupations.some((job) => occupation.toLowerCase().includes(job))) {
      score += 20
      riskFactors.push({ category: "Pekerjaan", factor: "Pekerjaan berisiko sedang", impact: "Sedang", points: 20 })
    }

    // Income-based assessment (Indonesian economic standards)
    const income = Number.parseInt(personalData.income || "0")
    if (income < 3000000) {
      // Below UMR
      score += 15
      riskFactors.push({ category: "Finansial", factor: "Penghasilan di bawah UMR", impact: "Sedang", points: 15 })
    } else if (income > 50000000) {
      // High income might indicate stress
      score += 5
      riskFactors.push({
        category: "Finansial",
        factor: "Penghasilan tinggi (potensi stress)",
        impact: "Rendah",
        points: 5,
      })
    }

    // Smoking assessment (Indonesian smoking rates consideration)
    if (questionnaire.smoking === "Ya") {
      score += 30
      riskFactors.push({ category: "Gaya Hidup", factor: "Perokok aktif", impact: "Tinggi", points: 30 })
    } else if (questionnaire.smoking === "Pernah (sudah berhenti)") {
      score += 15
      riskFactors.push({ category: "Gaya Hidup", factor: "Mantan perokok", impact: "Sedang", points: 15 })
    }

    // Alcohol consumption
    if (questionnaire.alcohol === "Ya") {
      score += 20
      riskFactors.push({ category: "Gaya Hidup", factor: "Konsumsi alkohol rutin", impact: "Sedang", points: 20 })
    } else if (questionnaire.alcohol === "Kadang-kadang") {
      score += 10
      riskFactors.push({ category: "Gaya Hidup", factor: "Konsumsi alkohol sesekali", impact: "Rendah", points: 10 })
    }

    // Exercise habits
    if (questionnaire.exercise === "Tidak pernah") {
      score += 25
      riskFactors.push({ category: "Gaya Hidup", factor: "Tidak pernah olahraga", impact: "Sedang", points: 25 })
    } else if (questionnaire.exercise === "Jarang") {
      score += 15
      riskFactors.push({ category: "Gaya Hidup", factor: "Jarang olahraga", impact: "Rendah", points: 15 })
    }

    // Medical history (Indonesian common diseases)
    const medicalConditions = questionnaire.medicalHistory || []
    const medicalRisks = {
      Diabetes: { points: 40, impact: "Tinggi" },
      Hipertensi: { points: 35, impact: "Tinggi" },
      Jantung: { points: 50, impact: "Sangat Tinggi" },
      Stroke: { points: 45, impact: "Sangat Tinggi" },
      Kanker: { points: 60, impact: "Sangat Tinggi" },
      Asma: { points: 25, impact: "Sedang" },
      Hepatitis: { points: 30, impact: "Tinggi" },
      Tuberkulosis: { points: 35, impact: "Tinggi" },
    }

    medicalConditions.forEach((condition: string) => {
      if (medicalRisks[condition as keyof typeof medicalRisks]) {
        const risk = medicalRisks[condition as keyof typeof medicalRisks]
        score += risk.points
        riskFactors.push({ category: "Riwayat Medis", factor: condition, impact: risk.impact, points: risk.points })
      }
    })

    // Family history
    const familyHistory = questionnaire.familyHistory || []
    const familyRisks = {
      Diabetes: { points: 15, impact: "Sedang" },
      Hipertensi: { points: 10, impact: "Rendah" },
      Jantung: { points: 20, impact: "Sedang" },
      Stroke: { points: 15, impact: "Sedang" },
      Kanker: { points: 25, impact: "Tinggi" },
    }

    familyHistory.forEach((condition: string) => {
      if (familyRisks[condition as keyof typeof familyRisks]) {
        const risk = familyRisks[condition as keyof typeof familyRisks]
        score += risk.points
        riskFactors.push({
          category: "Riwayat Keluarga",
          factor: `Keluarga memiliki riwayat ${condition}`,
          impact: risk.impact,
          points: risk.points,
        })
      }
    })

    // BMI calculation
    const height = Number.parseFloat(personalData.height || "170") / 100
    const weight = Number.parseFloat(personalData.weight || "70")
    const bmi = weight / (height * height)

    if (bmi > 30) {
      score += 25
      riskFactors.push({ category: "Fisik", factor: "Obesitas (BMI > 30)", impact: "Tinggi", points: 25 })
    } else if (bmi > 25) {
      score += 15
      riskFactors.push({ category: "Fisik", factor: "Kelebihan berat badan (BMI 25-30)", impact: "Sedang", points: 15 })
    } else if (bmi < 18.5) {
      score += 10
      riskFactors.push({
        category: "Fisik",
        factor: "Kekurangan berat badan (BMI < 18.5)",
        impact: "Rendah",
        points: 10,
      })
    }

    return { score: Math.min(score, 100), riskFactors }
  }

  const getDetailedUnderwritingDecision = (riskScore: number) => {
    if (riskScore <= 20) {
      return {
        decision: "APPROVED",
        status: "Disetujui Penuh",
        color: "green",
        icon: CheckCircle,
        premium: "Standard (100%)",
        coverage: "100%",
        sumInsured: "Sesuai aplikasi",
        conditions: ["Tidak ada syarat khusus"],
        medicalRequirement: "Tidak diperlukan",
        waitingPeriod: "Tidak ada",
      }
    } else if (riskScore <= 35) {
      return {
        decision: "APPROVED_STANDARD_PLUS",
        status: "Disetujui Standard Plus",
        color: "blue",
        icon: CheckCircle,
        premium: "Standard + 10%",
        coverage: "100%",
        sumInsured: "Sesuai aplikasi",
        conditions: ["Medical check-up ringan", "Deklarasi kesehatan tambahan"],
        medicalRequirement: "Medical check-up dasar",
        waitingPeriod: "30 hari untuk kondisi tertentu",
      }
    } else if (riskScore <= 50) {
      return {
        decision: "APPROVED_WITH_CONDITIONS",
        status: "Disetujui dengan Syarat",
        color: "yellow",
        icon: AlertTriangle,
        premium: "Standard + 25%",
        coverage: "90%",
        sumInsured: "Maksimal 1 Miliar",
        conditions: ["Medical check-up lengkap", "Waiting period diperpanjang", "Exclusion kondisi tertentu"],
        medicalRequirement: "Medical check-up komprehensif + Lab",
        waitingPeriod: "6 bulan untuk kondisi pre-existing",
      }
    } else if (riskScore <= 70) {
      return {
        decision: "APPROVED_WITH_LOADING",
        status: "Disetujui dengan Loading",
        color: "orange",
        icon: AlertTriangle,
        premium: "Standard + 50%",
        coverage: "75%",
        sumInsured: "Maksimal 500 Juta",
        conditions: ["Medical check-up spesialis", "Exclusion permanen untuk kondisi tertentu", "Review tahunan"],
        medicalRequirement: "Medical check-up spesialis + EKG + Rontgen",
        waitingPeriod: "12 bulan untuk semua kondisi pre-existing",
      }
    } else {
      return {
        decision: "DECLINED",
        status: "Ditolak",
        color: "red",
        icon: XCircle,
        premium: "N/A",
        coverage: "N/A",
        sumInsured: "N/A",
        conditions: ["Risiko terlalu tinggi untuk coverage standard", "Dapat dipertimbangkan untuk produk khusus"],
        medicalRequirement: "N/A",
        waitingPeriod: "N/A",
      }
    }
  }

  const { score: riskScore, riskFactors } = calculateDetailedRiskScore()
  const decision = getDetailedUnderwritingDecision(riskScore)
  const IconComponent = decision.icon

  return (
    <div className="space-y-6">
      {/* Main Decision Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconComponent className={`h-5 w-5 text-${decision.color}-500`} />
            Hasil Penilaian Underwriting Otomatis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Label className="text-sm font-medium text-gray-600">Skor Risiko</Label>
              <div className="text-3xl font-bold text-gray-800">{riskScore}/100</div>
              <div className="text-sm text-gray-500">
                {riskScore <= 20
                  ? "Risiko Rendah"
                  : riskScore <= 35
                    ? "Risiko Rendah-Sedang"
                    : riskScore <= 50
                      ? "Risiko Sedang"
                      : riskScore <= 70
                        ? "Risiko Tinggi"
                        : "Risiko Sangat Tinggi"}
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Label className="text-sm font-medium text-gray-600">Status Keputusan</Label>
              <Badge
                className="mt-2"
                variant={
                  decision.color === "green" || decision.color === "blue"
                    ? "default"
                    : decision.color === "red"
                      ? "destructive"
                      : "secondary"
                }
              >
                {decision.status}
              </Badge>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Label className="text-sm font-medium text-gray-600">Premi</Label>
              <div className="text-lg font-semibold text-gray-800">{decision.premium}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Assessment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Coverage Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-orange-500" />
              Detail Coverage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Coverage Ratio:</span>
              <span className="font-semibold">{decision.coverage}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Uang Pertanggungan:</span>
              <span className="font-semibold">{decision.sumInsured}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Medical Requirement:</span>
              <span className="font-semibold text-sm">{decision.medicalRequirement}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Waiting Period:</span>
              <span className="font-semibold text-sm">{decision.waitingPeriod}</span>
            </div>
          </CardContent>
        </Card>

        {/* Risk Factors Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Faktor Risiko Teridentifikasi
            </CardTitle>
          </CardHeader>
          <CardContent>
            {riskFactors.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {riskFactors.map((factor, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <div className="text-sm font-medium">{factor.factor}</div>
                      <div className="text-xs text-gray-500">{factor.category}</div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          factor.impact === "Sangat Tinggi" || factor.impact === "Tinggi"
                            ? "destructive"
                            : factor.impact === "Sedang"
                              ? "secondary"
                              : "outline"
                        }
                        className="text-xs"
                      >
                        +{factor.points}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Tidak ada faktor risiko teridentifikasi</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Conditions and Requirements */}
      <Card>
        <CardHeader>
          <CardTitle>Syarat & Ketentuan</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {decision.conditions.map((condition, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <span className="text-orange-500 mt-1">•</span>
                <span>{condition}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Rekomendasi & Langkah Selanjutnya</CardTitle>
        </CardHeader>
        <CardContent>
          {decision.decision === "APPROVED" && (
            <div className="text-green-700 space-y-2">
              <p className="font-semibold">✅ Selamat! Aplikasi Anda disetujui penuh.</p>
              <p>
                Langkah selanjutnya: Verifikasi dokumen → Pembayaran premi pertama → Polis terbit dalam 3-5 hari kerja.
              </p>
            </div>
          )}
          {decision.decision === "APPROVED_STANDARD_PLUS" && (
            <div className="text-blue-700 space-y-2">
              <p className="font-semibold">✅ Aplikasi Anda disetujui dengan premi sedikit lebih tinggi.</p>
              <p>Langkah selanjutnya: Medical check-up dasar → Verifikasi dokumen → Pembayaran premi → Polis terbit.</p>
            </div>
          )}
          {decision.decision === "APPROVED_WITH_CONDITIONS" && (
            <div className="text-yellow-700 space-y-2">
              <p className="font-semibold">⚠️ Aplikasi disetujui dengan syarat tambahan.</p>
              <p>
                Langkah selanjutnya: Medical check-up lengkap → Review hasil → Konfirmasi syarat → Pembayaran premi.
              </p>
            </div>
          )}
          {decision.decision === "APPROVED_WITH_LOADING" && (
            <div className="text-orange-700 space-y-2">
              <p className="font-semibold">⚠️ Aplikasi disetujui dengan loading premi.</p>
              <p>
                Langkah selanjutnya: Medical check-up spesialis → Review komprehensif → Konfirmasi terms → Pembayaran.
              </p>
            </div>
          )}
          {decision.decision === "DECLINED" && (
            <div className="text-red-700 space-y-2">
              <p className="font-semibold">❌ Aplikasi tidak dapat disetujui saat ini.</p>
              <p>
                Alternatif: Konsultasi dengan agen untuk produk khusus atau review ulang setelah perbaikan kondisi
                kesehatan.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
