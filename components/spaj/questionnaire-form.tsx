"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"

interface QuestionnaireFormProps {
  formData: any
  updateFormData: (field: string, value: any) => void
}

export default function QuestionnaireForm({ formData, updateFormData }: QuestionnaireFormProps) {
  const medicalQuestions = [
    {
      id: "smoking",
      question: "Apakah Anda merokok?",
      type: "radio",
      options: ["Ya", "Tidak", "Pernah (sudah berhenti)"],
    },
    {
      id: "alcohol",
      question: "Apakah Anda mengonsumsi alkohol secara rutin?",
      type: "radio",
      options: ["Ya", "Tidak", "Kadang-kadang"],
    },
    {
      id: "exercise",
      question: "Seberapa sering Anda berolahraga?",
      type: "radio",
      options: ["Setiap hari", "3-4x seminggu", "1-2x seminggu", "Jarang", "Tidak pernah"],
    },
    {
      id: "medicalHistory",
      question: "Apakah Anda pernah mengalami kondisi berikut?",
      type: "checkbox",
      options: ["Diabetes", "Hipertensi", "Jantung", "Stroke", "Kanker", "Tidak ada"],
    },
    {
      id: "familyHistory",
      question: "Apakah ada riwayat penyakit keturunan dalam keluarga?",
      type: "checkbox",
      options: ["Diabetes", "Hipertensi", "Jantung", "Stroke", "Kanker", "Tidak ada"],
    },
    {
      id: "occupation",
      question: "Apakah pekerjaan Anda termasuk kategori berisiko tinggi?",
      type: "radio",
      options: ["Ya", "Tidak"],
    },
  ]

  const handleQuestionChange = (questionId: string, value: any) => {
    updateFormData(`questionnaire.${questionId}`, value)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Kuesioner Kesehatan & Gaya Hidup</h3>
        <p className="text-sm text-gray-600 mb-6">
          Mohon jawab pertanyaan berikut dengan jujur untuk proses underwriting yang akurat.
        </p>
      </div>

      {medicalQuestions.map((question) => (
        <Card key={question.id}>
          <CardContent className="pt-6">
            <Label className="text-base font-medium">{question.question}</Label>

            {question.type === "radio" && (
              <RadioGroup
                value={formData.questionnaire?.[question.id] || ""}
                onValueChange={(value) => handleQuestionChange(question.id, value)}
                className="mt-3"
              >
                {question.options.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`${question.id}-${option}`} />
                    <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {question.type === "checkbox" && (
              <div className="mt-3 space-y-2">
                {question.options.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${question.id}-${option}`}
                      checked={formData.questionnaire?.[question.id]?.includes(option) || false}
                      onCheckedChange={(checked) => {
                        const current = formData.questionnaire?.[question.id] || []
                        if (checked) {
                          handleQuestionChange(question.id, [...current, option])
                        } else {
                          handleQuestionChange(
                            question.id,
                            current.filter((item: string) => item !== option),
                          )
                        }
                      }}
                    />
                    <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardContent className="pt-6">
          <Label className="text-base font-medium">Informasi Tambahan</Label>
          <Textarea
            placeholder="Jelaskan kondisi kesehatan atau informasi lain yang perlu diketahui..."
            value={formData.questionnaire?.additionalInfo || ""}
            onChange={(e) => handleQuestionChange("additionalInfo", e.target.value)}
            className="mt-3"
          />
        </CardContent>
      </Card>
    </div>
  )
}
