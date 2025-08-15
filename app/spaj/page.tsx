"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Check, Upload, FileText } from "lucide-react"
import QuestionnaireForm from "@/components/spaj/questionnaire-form"
import UnderwritingEngine from "@/components/spaj/underwriting-engine"
import SignatureRecording from "@/components/spaj/signature-recording"

export default function SPAJForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Product Selection
    productType: "",
    productName: "",
    sumInsured: "",
    premiumPayment: "",

    // Personal Data
    fullName: "",
    birthDate: "",
    gender: "",
    maritalStatus: "",
    idNumber: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    occupation: "",
    income: "",

    // Beneficiary
    beneficiaryName: "",
    beneficiaryRelation: "",
    beneficiaryBirthDate: "",
    beneficiaryPercentage: "100",

    // Questionnaire
    questionnaire: {},

    // Documents
    uploadedDocs: [],

    // Signature & Recording
    eSignature: null,
    recordedVideo: null,
  })

  const updateFormData = (field: string, value: any) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value,
        },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }
  }

  const nextStep = () => {
    if (currentStep < 7) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleSubmit = () => {
    const newSPAJ = {
      id: Date.now().toString(),
      ...formData,
      status: "pending",
      submittedAt: new Date().toISOString(),
      underwritingResult: "pending_review",
    }

    const existing = JSON.parse(localStorage.getItem("spajSubmissions") || "[]")
    existing.push(newSPAJ)
    localStorage.setItem("spajSubmissions", JSON.stringify(existing))

    alert("SPAJ berhasil dikirim! Hasil underwriting otomatis telah disimpan.")
    window.location.href = "/"
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    const file = event.target.files?.[0]
    if (file) {
      const newDoc = {
        type: docType,
        name: file.name,
        size: file.size,
        uploadedAt: new Date().toISOString(),
      }
      updateFormData("uploadedDocs", [...formData.uploadedDocs, newDoc])
    }
  }

  const steps = [
    "Pilih Produk",
    "Data Pribadi",
    "Ahli Waris",
    "Kuesioner",
    "Upload Dokumen",
    "Underwriting",
    "Tanda Tangan",
  ]

  const progress = (currentStep / steps.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
          <h1 className="text-3xl font-bold mt-4 text-cyan-800">Form SPAJ Baru</h1>
          <p className="text-gray-600">Lengkapi semua informasi dengan benar untuk proses yang optimal</p>
        </div>

        {/* Progress Bar */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>
                Langkah {currentStep} dari {steps.length}
              </span>
              <span>{Math.round(progress)}% selesai</span>
            </div>
            <Progress value={progress} className="mb-4" />
            <div className="flex justify-between text-xs">
              {steps.map((step, index) => (
                <span
                  key={step}
                  className={`${index + 1 <= currentStep ? "text-cyan-600 font-medium" : "text-gray-400"}`}
                >
                  {step}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-cyan-800">{steps[currentStep - 1]}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Product Selection */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium">Jenis Produk Asuransi</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    {[
                      {
                        type: "Traditional Life",
                        desc: "Asuransi jiwa tradisional dengan manfaat pasti",
                        color: "bg-blue-50 border-blue-200",
                      },
                      {
                        type: "Unit Link",
                        desc: "Kombinasi asuransi dan investasi",
                        color: "bg-green-50 border-green-200",
                      },
                      {
                        type: "Health Insurance",
                        desc: "Perlindungan kesehatan komprehensif",
                        color: "bg-purple-50 border-purple-200",
                      },
                      {
                        type: "Personal Accident",
                        desc: "Perlindungan dari risiko kecelakaan",
                        color: "bg-orange-50 border-orange-200",
                      },
                    ].map((product) => (
                      <div
                        key={product.type}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                          formData.productType === product.type ? "border-cyan-500 bg-cyan-50 shadow-md" : product.color
                        }`}
                        onClick={() => updateFormData("productType", product.type)}
                      >
                        <h4 className="font-semibold">{product.type}</h4>
                        <p className="text-sm text-gray-600 mt-1">{product.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {formData.productType && (
                  <div className="space-y-4">
                    <div>
                      <Label>Nama Produk</Label>
                      <Select
                        value={formData.productName}
                        onValueChange={(value) => updateFormData("productName", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih produk spesifik" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BNI Life Proteksi">BNI Life Proteksi</SelectItem>
                          <SelectItem value="BNI Life Investasi">BNI Life Investasi</SelectItem>
                          <SelectItem value="BNI Life Sehat">BNI Life Sehat</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Uang Pertanggungan</Label>
                        <Select
                          value={formData.sumInsured}
                          onValueChange={(value) => updateFormData("sumInsured", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih UP" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="100000000">Rp 100.000.000</SelectItem>
                            <SelectItem value="250000000">Rp 250.000.000</SelectItem>
                            <SelectItem value="500000000">Rp 500.000.000</SelectItem>
                            <SelectItem value="1000000000">Rp 1.000.000.000</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Cara Bayar Premi</Label>
                        <Select
                          value={formData.premiumPayment}
                          onValueChange={(value) => updateFormData("premiumPayment", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih cara bayar" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bulanan">Bulanan</SelectItem>
                            <SelectItem value="triwulan">Triwulan</SelectItem>
                            <SelectItem value="semesteran">Semesteran</SelectItem>
                            <SelectItem value="tahunan">Tahunan</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Personal Data */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Nama Lengkap</Label>
                    <Input
                      value={formData.fullName}
                      onChange={(e) => updateFormData("fullName", e.target.value)}
                      placeholder="Sesuai KTP"
                    />
                  </div>
                  <div>
                    <Label>Tanggal Lahir</Label>
                    <Input
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => updateFormData("birthDate", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Jenis Kelamin</Label>
                    <Select value={formData.gender} onValueChange={(value) => updateFormData("gender", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jenis kelamin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pria">Pria</SelectItem>
                        <SelectItem value="wanita">Wanita</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Status Pernikahan</Label>
                    <Select
                      value={formData.maritalStatus}
                      onValueChange={(value) => updateFormData("maritalStatus", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Status pernikahan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="belum_menikah">Belum Menikah</SelectItem>
                        <SelectItem value="menikah">Menikah</SelectItem>
                        <SelectItem value="cerai">Cerai</SelectItem>
                        <SelectItem value="janda_duda">Janda/Duda</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Nomor KTP</Label>
                    <Input
                      value={formData.idNumber}
                      onChange={(e) => updateFormData("idNumber", e.target.value)}
                      placeholder="16 digit nomor KTP"
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <Label>Nomor Telepon</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => updateFormData("phone", e.target.value)}
                    placeholder="08xxxxxxxxxx"
                  />
                </div>

                <div>
                  <Label>Alamat Lengkap</Label>
                  <Textarea
                    value={formData.address}
                    onChange={(e) => updateFormData("address", e.target.value)}
                    placeholder="Alamat sesuai KTP"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Kota</Label>
                    <Input
                      value={formData.city}
                      onChange={(e) => updateFormData("city", e.target.value)}
                      placeholder="Nama kota"
                    />
                  </div>
                  <div>
                    <Label>Kode Pos</Label>
                    <Input
                      value={formData.postalCode}
                      onChange={(e) => updateFormData("postalCode", e.target.value)}
                      placeholder="12345"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Pekerjaan</Label>
                    <Input
                      value={formData.occupation}
                      onChange={(e) => updateFormData("occupation", e.target.value)}
                      placeholder="Jabatan/profesi"
                    />
                  </div>
                  <div>
                    <Label>Penghasilan per Bulan</Label>
                    <Select value={formData.income} onValueChange={(value) => updateFormData("income", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Range penghasilan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lt5jt">&lt; Rp 5.000.000</SelectItem>
                        <SelectItem value="5-10jt">Rp 5.000.000 - 10.000.000</SelectItem>
                        <SelectItem value="10-25jt">Rp 10.000.000 - 25.000.000</SelectItem>
                        <SelectItem value="25-50jt">Rp 25.000.000 - 50.000.000</SelectItem>
                        <SelectItem value="gt50jt">&gt; Rp 50.000.000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Beneficiary */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Nama Ahli Waris</Label>
                    <Input
                      value={formData.beneficiaryName}
                      onChange={(e) => updateFormData("beneficiaryName", e.target.value)}
                      placeholder="Nama lengkap ahli waris"
                    />
                  </div>
                  <div>
                    <Label>Hubungan dengan Tertanggung</Label>
                    <Select
                      value={formData.beneficiaryRelation}
                      onValueChange={(value) => updateFormData("beneficiaryRelation", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih hubungan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="suami">Suami</SelectItem>
                        <SelectItem value="istri">Istri</SelectItem>
                        <SelectItem value="anak">Anak</SelectItem>
                        <SelectItem value="orangtua">Orang Tua</SelectItem>
                        <SelectItem value="saudara">Saudara</SelectItem>
                        <SelectItem value="lainnya">Lainnya</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Tanggal Lahir Ahli Waris</Label>
                    <Input
                      type="date"
                      value={formData.beneficiaryBirthDate}
                      onChange={(e) => updateFormData("beneficiaryBirthDate", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Persentase Manfaat (%)</Label>
                    <Input
                      type="number"
                      value={formData.beneficiaryPercentage}
                      onChange={(e) => updateFormData("beneficiaryPercentage", e.target.value)}
                      placeholder="100"
                      min="1"
                      max="100"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Questionnaire */}
            {currentStep === 4 && <QuestionnaireForm formData={formData} updateFormData={updateFormData} />}

            {/* Step 5: Document Upload */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Upload Dokumen Pendukung</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Upload dokumen yang diperlukan untuk proses verifikasi aplikasi SPAJ Anda.
                  </p>
                </div>

                {[
                  { type: "ktp", label: "KTP", required: true },
                  { type: "kk", label: "Kartu Keluarga", required: true },
                  { type: "npwp", label: "NPWP", required: false },
                  { type: "slip_gaji", label: "Slip Gaji/Surat Keterangan Penghasilan", required: true },
                  { type: "rekening", label: "Buku Tabungan/Rekening Koran", required: true },
                  { type: "medical", label: "Hasil Medical Check-up (jika diperlukan)", required: false },
                ].map((doc) => (
                  <Card key={doc.type}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <Label className="text-base font-medium">{doc.label}</Label>
                          {doc.required && <span className="text-red-500 ml-1">*</span>}
                        </div>
                        <FileText className="h-5 w-5 text-gray-400" />
                      </div>

                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600 mb-2">Klik untuk upload atau drag & drop file</p>
                        <p className="text-xs text-gray-500">Format: PDF, JPG, PNG (Max 5MB)</p>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload(e, doc.type)}
                          className="hidden"
                          id={`upload-${doc.type}`}
                        />
                        <Button
                          variant="outline"
                          className="mt-3 bg-transparent"
                          onClick={() => document.getElementById(`upload-${doc.type}`)?.click()}
                        >
                          Pilih File
                        </Button>
                      </div>

                      {formData.uploadedDocs.some((d: any) => d.type === doc.type) && (
                        <div className="mt-3 p-3 bg-green-50 rounded-lg">
                          <p className="text-sm text-green-700 flex items-center gap-2">
                            <Check className="h-4 w-4" />
                            File berhasil diupload
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Step 6: Underwriting Results */}
            {currentStep === 6 && <UnderwritingEngine formData={formData} />}

            {/* Step 7: Signature & Recording */}
            {currentStep === 7 && <SignatureRecording formData={formData} updateFormData={updateFormData} />}

            <div className="flex justify-between pt-6 border-t">
              <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Sebelumnya
              </Button>

              {currentStep < 7 ? (
                <Button onClick={nextStep}>
                  Selanjutnya
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} className="bg-cyan-600 hover:bg-cyan-700">
                  <Check className="h-4 w-4 mr-2" />
                  Kirim SPAJ
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
