"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PenTool, FileText, CheckCircle, Clock, ArrowLeft, Download, Eye, Smartphone, Shield } from "lucide-react"
import Link from "next/link"

export default function SignaturePage() {
  const router = useRouter()
  const [signatures, setSignatures] = useState<any[]>([])
  const [showNewSignature, setShowNewSignature] = useState(false)
  const [formData, setFormData] = useState({
    clientName: "",
    documentType: "",
    notes: "",
    signatureData: "",
  })

  useEffect(() => {
    const authData = localStorage.getItem("agentAuth")
    if (!authData) {
      router.push("/auth/login")
      return
    }

    const savedSignatures = JSON.parse(localStorage.getItem("signatures") || "[]")
    setSignatures(savedSignatures)
  }, [router])

  const handleCreateSignature = () => {
    const newSignature = {
      id: `SIG-${Date.now()}`,
      ...formData,
      status: "pending",
      createdAt: new Date().toISOString(),
      signedAt: null,
    }

    const updatedSignatures = [...signatures, newSignature]
    setSignatures(updatedSignatures)
    localStorage.setItem("signatures", JSON.stringify(updatedSignatures))

    setShowNewSignature(false)
    setFormData({ clientName: "", documentType: "", notes: "", signatureData: "" })
  }

  const simulateSignature = (id: string) => {
    const updatedSignatures = signatures.map((sig) =>
      sig.id === id ? { ...sig, status: "signed", signedAt: new Date().toISOString() } : sig,
    )
    setSignatures(updatedSignatures)
    localStorage.setItem("signatures", JSON.stringify(updatedSignatures))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "signed":
        return <Badge className="bg-green-50 text-green-700 border-green-200">Ditandatangani</Badge>
      case "pending":
        return <Badge className="bg-amber-50 text-amber-700 border-amber-200">Menunggu</Badge>
      case "expired":
        return <Badge className="bg-red-50 text-red-700 border-red-200">Kedaluwarsa</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="outline" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">e-Signature</h1>
              <p className="text-muted-foreground">Kelola tanda tangan digital untuk dokumen asuransi</p>
            </div>
          </div>
          <Button onClick={() => setShowNewSignature(true)} className="bg-primary hover:bg-primary/90">
            <PenTool className="w-4 h-4 mr-2" />
            Buat Signature Baru
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Signature</p>
                  <p className="text-2xl font-bold">{signatures.length}</p>
                </div>
                <PenTool className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ditandatangani</p>
                  <p className="text-2xl font-bold">{signatures.filter((s) => s.status === "signed").length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Menunggu</p>
                  <p className="text-2xl font-bold">{signatures.filter((s) => s.status === "pending").length}</p>
                </div>
                <Clock className="w-8 h-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Bulan Ini</p>
                  <p className="text-2xl font-bold">
                    {signatures.filter((s) => new Date(s.createdAt).getMonth() === new Date().getMonth()).length}
                  </p>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* New Signature Form */}
        {showNewSignature && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Buat Signature Baru</CardTitle>
              <CardDescription>Siapkan dokumen untuk ditandatangani secara digital</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clientName">Nama Nasabah</Label>
                  <Input
                    id="clientName"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    placeholder="Masukkan nama nasabah"
                  />
                </div>
                <div>
                  <Label htmlFor="documentType">Jenis Dokumen</Label>
                  <Input
                    id="documentType"
                    value={formData.documentType}
                    onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
                    placeholder="SPAJ, Polis, Klaim, dll"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="notes">Catatan</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Catatan tambahan untuk signature"
                />
              </div>
              <div className="flex space-x-4">
                <Button onClick={handleCreateSignature} className="bg-primary hover:bg-primary/90">
                  <PenTool className="w-4 h-4 mr-2" />
                  Buat Signature
                </Button>
                <Button variant="outline" onClick={() => setShowNewSignature(false)}>
                  Batal
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Signature List */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Signature</CardTitle>
            <CardDescription>Kelola dan pantau status tanda tangan digital</CardDescription>
          </CardHeader>
          <CardContent>
            {signatures.length === 0 ? (
              <div className="text-center py-12">
                <PenTool className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">Belum ada signature</h3>
                <p className="text-muted-foreground mb-4">Mulai dengan membuat signature baru untuk dokumen asuransi</p>
                <Button onClick={() => setShowNewSignature(true)}>
                  <PenTool className="w-4 h-4 mr-2" />
                  Buat Signature Pertama
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {signatures.map((signature) => (
                  <div
                    key={signature.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/30 transition-all"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <PenTool className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{signature.clientName}</h4>
                        <p className="text-sm text-muted-foreground">{signature.documentType}</p>
                        <p className="text-xs text-muted-foreground">
                          {signature.id} • {new Date(signature.createdAt).toLocaleDateString("id-ID")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {getStatusBadge(signature.status)}
                      <div className="flex space-x-2">
                        {signature.status === "pending" && (
                          <Button
                            size="sm"
                            onClick={() => simulateSignature(signature.id)}
                            className="bg-primary hover:bg-primary/90"
                          >
                            <Smartphone className="w-4 h-4 mr-2" />
                            Kirim OTP
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                        {signature.status === "signed" && (
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Info */}
        <Card className="mt-6">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Shield className="w-6 h-6 text-green-600" />
              <div>
                <h4 className="font-medium text-foreground">Keamanan Terjamin</h4>
                <p className="text-sm text-muted-foreground">
                  Semua signature menggunakan enkripsi 256-bit dan verifikasi OTP untuk keamanan maksimal
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
