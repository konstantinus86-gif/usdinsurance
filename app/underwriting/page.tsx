"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, Eye, CheckCircle, AlertTriangle, XCircle, FileText } from "lucide-react"
import Link from "next/link"

export default function UnderwritingPage() {
  const [submissions, setSubmissions] = useState<any[]>([])
  const [filteredSubmissions, setFilteredSubmissions] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    // Load SPAJ submissions from localStorage
    const savedSubmissions = localStorage.getItem("spajSubmissions")
    if (savedSubmissions) {
      const data = JSON.parse(savedSubmissions)
      setSubmissions(data)
      setFilteredSubmissions(data)
    }
  }, [])

  useEffect(() => {
    let filtered = submissions

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (sub) =>
          sub.personalData?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sub.personalData?.idNumber?.includes(searchTerm) ||
          sub.id?.includes(searchTerm),
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((sub) => {
        const decision = sub.underwritingResult?.decision || "PENDING"
        return decision === statusFilter
      })
    }

    setFilteredSubmissions(filtered)
  }, [searchTerm, statusFilter, submissions])

  const getStatusBadge = (decision: string) => {
    switch (decision) {
      case "APPROVED":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Disetujui
          </Badge>
        )
      case "APPROVED_STANDARD_PLUS":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Standard Plus
          </Badge>
        )
      case "APPROVED_WITH_CONDITIONS":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Dengan Syarat
          </Badge>
        )
      case "APPROVED_WITH_LOADING":
        return (
          <Badge className="bg-orange-100 text-orange-800">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Dengan Loading
          </Badge>
        )
      case "DECLINED":
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Ditolak
          </Badge>
        )
      default:
        return <Badge variant="outline">Pending</Badge>
    }
  }

  const getRiskLevel = (score: number) => {
    if (score <= 20) return { level: "Rendah", color: "text-green-600" }
    if (score <= 35) return { level: "Rendah-Sedang", color: "text-blue-600" }
    if (score <= 50) return { level: "Sedang", color: "text-yellow-600" }
    if (score <= 70) return { level: "Tinggi", color: "text-orange-600" }
    return { level: "Sangat Tinggi", color: "text-red-600" }
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Underwriting</h1>
              <p className="text-gray-600 mt-2">Monitor dan kelola hasil penilaian underwriting otomatis</p>
            </div>
            <Link href="/">
              <Button variant="outline">Kembali ke Dashboard</Button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Cari Aplikasi</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Cari berdasarkan nama, ID, atau nomor KTP..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="status">Filter Status</Label>
                <select
                  id="status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="all">Semua Status</option>
                  <option value="APPROVED">Disetujui</option>
                  <option value="APPROVED_STANDARD_PLUS">Standard Plus</option>
                  <option value="APPROVED_WITH_CONDITIONS">Dengan Syarat</option>
                  <option value="APPROVED_WITH_LOADING">Dengan Loading</option>
                  <option value="DECLINED">Ditolak</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Aplikasi</p>
                  <p className="text-2xl font-bold text-gray-900">{submissions.length}</p>
                </div>
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Disetujui</p>
                  <p className="text-2xl font-bold text-green-600">
                    {submissions.filter((s) => s.underwritingResult?.decision?.includes("APPROVED")).length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Dengan Syarat</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {
                      submissions.filter(
                        (s) =>
                          s.underwritingResult?.decision === "APPROVED_WITH_CONDITIONS" ||
                          s.underwritingResult?.decision === "APPROVED_WITH_LOADING",
                      ).length
                    }
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ditolak</p>
                  <p className="text-2xl font-bold text-red-600">
                    {submissions.filter((s) => s.underwritingResult?.decision === "DECLINED").length}
                  </p>
                </div>
                <XCircle className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Applications List */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Aplikasi Underwriting</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredSubmissions.length > 0 ? (
              <div className="space-y-4">
                {filteredSubmissions.map((submission) => {
                  const riskScore = submission.underwritingResult?.riskScore || 0
                  const riskLevel = getRiskLevel(riskScore)

                  return (
                    <div key={submission.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-2">
                            <div>
                              <h3 className="font-semibold text-lg">
                                {submission.personalData?.fullName || "Nama tidak tersedia"}
                              </h3>
                              <p className="text-sm text-gray-600">ID: {submission.id}</p>
                            </div>
                            {getStatusBadge(submission.underwritingResult?.decision || "PENDING")}
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Produk:</span>
                              <p className="font-medium">{submission.productSelection?.productName || "N/A"}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Skor Risiko:</span>
                              <p className={`font-medium ${riskLevel.color}`}>
                                {riskScore}/100 ({riskLevel.level})
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-600">Premi:</span>
                              <p className="font-medium">{submission.underwritingResult?.premium || "N/A"}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Tanggal:</span>
                              <p className="font-medium">
                                {new Date(submission.submittedAt).toLocaleDateString("id-ID")}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Link href={`/spaj/${submission.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              Detail
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Tidak ada aplikasi yang ditemukan</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
