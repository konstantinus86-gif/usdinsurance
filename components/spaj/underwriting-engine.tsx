"use client"

import { Label } from "@/components/ui/label"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react"

interface UnderwritingEngineProps {
  formData: any
}

export default function UnderwritingEngine({ formData }: UnderwritingEngineProps) {
  const calculateRiskScore = () => {
    let score = 0
    const questionnaire = formData.questionnaire || {}

    // Smoking assessment
    if (questionnaire.smoking === "Ya") score += 30
    else if (questionnaire.smoking === "Pernah (sudah berhenti)") score += 15

    // Alcohol assessment
    if (questionnaire.alcohol === "Ya") score += 20
    else if (questionnaire.alcohol === "Kadang-kadang") score += 10

    // Exercise assessment
    if (questionnaire.exercise === "Tidak pernah") score += 25
    else if (questionnaire.exercise === "Jarang") score += 15
    else if (questionnaire.exercise === "1-2x seminggu") score += 5

    // Medical history
    const medicalConditions = questionnaire.medicalHistory || []
    if (medicalConditions.includes("Diabetes")) score += 40
    if (medicalConditions.includes("Hipertensi")) score += 35
    if (medicalConditions.includes("Jantung")) score += 50
    if (medicalConditions.includes("Stroke")) score += 45
    if (medicalConditions.includes("Kanker")) score += 60

    // Family history
    const familyHistory = questionnaire.familyHistory || []
    if (familyHistory.includes("Diabetes")) score += 15
    if (familyHistory.includes("Hipertensi")) score += 10
    if (familyHistory.includes("Jantung")) score += 20
    if (familyHistory.includes("Stroke")) score += 15
    if (familyHistory.includes("Kanker")) score += 25

    // High-risk occupation
    if (questionnaire.occupation === "Ya") score += 30

    // Age factor (assuming age from birth date)
    const age = formData.age || 30
    if (age > 50) score += 20
    else if (age > 40) score += 10

    return Math.min(score, 100)
  }

  const getUnderwritingDecision = (riskScore: number) => {
    if (riskScore <= 25) {
      return {
        decision: "APPROVED",
        status: "Disetujui",
        color: "green",
        icon: CheckCircle,
        premium: "Standard",
        coverage: "100%",
        conditions: [],
      }
    } else if (riskScore <= 50) {
      return {
        decision: "APPROVED_WITH_CONDITIONS",
        status: "Disetujui dengan Syarat",
        color: "yellow",
        icon: AlertTriangle,
        premium: "Standard + 25%",
        coverage: "90%",
        conditions: ["Medical check-up diperlukan", "Waiting period 6 bulan untuk kondisi tertentu"],
      }
    } else if (riskScore <= 75) {
      return {
        decision: "APPROVED_WITH_LOADING",
        status: "Disetujui dengan Loading",
        color: "orange",
        icon: AlertTriangle,
        premium: "Standard + 50%",
        coverage: "80%",
        conditions: ["Medical check-up wajib", "Waiting period 12 bulan", "Exclusion untuk kondisi pre-existing"],
      }
    } else {
      return {
        decision: "DECLINED",
        status: "Ditolak",
        color: "red",
        icon: XCircle,
        premium: "N/A",
        coverage: "N/A",
        conditions: ["Risiko terlalu tinggi untuk coverage standard"],
      }
    }
  }

  const riskScore = calculateRiskScore()
  const decision = getUnderwritingDecision(riskScore)
  const IconComponent = decision.icon

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconComponent className={`h-5 w-5 text-${decision.color}-500`} />
            Hasil Penilaian Underwriting Otomatis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">Skor Risiko</Label>
              <div className="text-2xl font-bold">{riskScore}/100</div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Status</Label>
              <Badge
                variant={
                  decision.color === "green" ? "default" : decision.color === "red" ? "destructive" : "secondary"
                }
              >
                {decision.status}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">Premi</Label>
              <div className="font-semibold">{decision.premium}</div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Coverage</Label>
              <div className="font-semibold">{decision.coverage}</div>
            </div>
          </div>

          {decision.conditions.length > 0 && (
            <div>
              <Label className="text-sm font-medium text-gray-600">Syarat & Ketentuan</Label>
              <ul className="mt-2 space-y-1">
                {decision.conditions.map((condition, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-gray-400">•</span>
                    {condition}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rekomendasi</CardTitle>
        </CardHeader>
        <CardContent>
          {decision.decision === "APPROVED" && (
            <p className="text-green-700">
              Selamat! Aplikasi Anda memenuhi syarat untuk coverage penuh dengan premi standard. Proses selanjutnya
              adalah verifikasi dokumen dan pembayaran premi pertama.
            </p>
          )}
          {decision.decision === "APPROVED_WITH_CONDITIONS" && (
            <p className="text-yellow-700">
              Aplikasi Anda dapat disetujui dengan beberapa syarat tambahan. Silakan lakukan medical check-up untuk
              melanjutkan proses.
            </p>
          )}
          {decision.decision === "APPROVED_WITH_LOADING" && (
            <p className="text-orange-700">
              Aplikasi Anda memerlukan loading premi karena profil risiko yang lebih tinggi. Medical check-up
              komprehensif diperlukan.
            </p>
          )}
          {decision.decision === "DECLINED" && (
            <p className="text-red-700">
              Maaf, aplikasi Anda tidak dapat disetujui saat ini. Silakan konsultasi dengan agen untuk alternatif produk
              yang sesuai.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
