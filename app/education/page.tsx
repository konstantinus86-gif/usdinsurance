"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Play, Download, Search, Star } from "lucide-react"

const educationVideos = [
  {
    id: 1,
    title: "Dasar-Dasar Asuransi Jiwa",
    description: "Memahami konsep dasar asuransi jiwa dan manfaatnya",
    duration: "15:30",
    category: "Dasar",
    rating: 4.8,
    thumbnail: "/insurance-education-thumbnail.png",
    youtubeId: "dQw4w9WgXcQ",
    views: "12.5K",
  },
  {
    id: 2,
    title: "Unit Link vs Traditional - Perbandingan Lengkap",
    description: "Perbedaan dan keunggulan masing-masing produk asuransi",
    duration: "22:15",
    category: "Produk",
    rating: 4.9,
    thumbnail: "/placeholder-7dje3.png",
    youtubeId: "dQw4w9WgXcQ",
    views: "8.3K",
  },
  {
    id: 3,
    title: "Teknik Closing yang Efektif",
    description: "Strategi dan teknik untuk menutup penjualan asuransi",
    duration: "18:45",
    category: "Sales",
    rating: 4.7,
    thumbnail: "/sales-closing-techniques-training.png",
    youtubeId: "dQw4w9WgXcQ",
    views: "15.2K",
  },
  {
    id: 4,
    title: "Underwriting dan Penilaian Risiko",
    description: "Memahami proses underwriting dan faktor-faktor risiko",
    duration: "25:10",
    category: "Underwriting",
    rating: 4.6,
    thumbnail: "/insurance-underwriting-risk.png",
    youtubeId: "dQw4w9WgXcQ",
    views: "6.8K",
  },
  {
    id: 5,
    title: "Menangani Keberatan Nasabah",
    description: "Cara mengatasi keberatan dan meningkatkan konversi",
    duration: "20:30",
    category: "Customer Service",
    rating: 4.8,
    thumbnail: "/handling-insurance-objections.png",
    youtubeId: "dQw4w9WgXcQ",
    views: "11.7K",
  },
  {
    id: 6,
    title: "Regulasi dan Compliance Terbaru",
    description: "Update regulasi OJK dan compliance requirements",
    duration: "30:00",
    category: "Compliance",
    rating: 4.5,
    thumbnail: "/insurance-regulation-ojk.png",
    youtubeId: "dQw4w9WgXcQ",
    views: "4.2K",
  },
]

const marketingMaterials = [
  {
    id: 1,
    title: "Flyer Unit Link Premium",
    description: "Flyer promosi untuk produk Unit Link dengan benefit lengkap",
    type: "PDF",
    size: "2.3 MB",
    category: "Unit Link",
    downloadUrl: "/sample-flyer-unit-link.pdf",
    thumbnail: "/unit-link-insurance-flyer.png",
  },
  {
    id: 2,
    title: "Brosur Asuransi Kesehatan",
    description: "Brosur informatif untuk produk asuransi kesehatan keluarga",
    type: "PDF",
    size: "1.8 MB",
    category: "Health",
    downloadUrl: "/sample-brosur-kesehatan.pdf",
    thumbnail: "/health-insurance-brochure-family.png",
  },
  {
    id: 3,
    title: "Presentasi Produk Traditional",
    description: "Template presentasi untuk produk asuransi traditional",
    type: "PPTX",
    size: "5.2 MB",
    category: "Traditional",
    downloadUrl: "/sample-presentation-traditional.pptx",
    thumbnail: "/traditional-insurance-presentation.png",
  },
  {
    id: 4,
    title: "Infografis Manfaat Asuransi",
    description: "Infografis menarik tentang manfaat memiliki asuransi",
    type: "PNG",
    size: "1.2 MB",
    category: "General",
    downloadUrl: "/sample-infografis-manfaat.png",
    thumbnail: "/insurance-benefits-infographic-colorful.png",
  },
  {
    id: 5,
    title: "Social Media Kit Q1 2024",
    description: "Paket konten social media untuk promosi Q1 2024",
    type: "ZIP",
    size: "12.5 MB",
    category: "Social Media",
    downloadUrl: "/sample-social-media-kit.zip",
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 6,
    title: "Email Template Campaign",
    description: "Template email marketing untuk campaign produk baru",
    type: "HTML",
    size: "0.8 MB",
    category: "Email",
    downloadUrl: "/sample-email-template.html",
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
]

export default function EducationPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null)

  const filteredVideos = educationVideos.filter((video) => {
    const matchesSearch =
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || video.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const filteredMaterials = marketingMaterials.filter((material) => {
    const matchesSearch =
      material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || material.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleDownload = (url: string, filename: string) => {
    // Simulate download
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Pusat Edukasi & Marketing</h1>
              <p className="text-gray-600 mt-1">Video pembelajaran dan materi promosi untuk agen asuransi</p>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Cari video atau materi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="videos" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="videos" className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Video Edukasi
            </TabsTrigger>
            <TabsTrigger value="materials" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Materi Marketing
            </TabsTrigger>
          </TabsList>

          {/* Video Education Tab */}
          <TabsContent value="videos" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video) => (
                <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={video.thumbnail || "/placeholder.svg"}
                      alt={video.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Button
                        onClick={() => setSelectedVideo(video.id)}
                        className="bg-white text-black hover:bg-gray-100"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Tonton
                      </Button>
                    </div>
                    <Badge className="absolute top-2 right-2 bg-black bg-opacity-70">{video.duration}</Badge>
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{video.category}</Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-600">{video.rating}</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{video.title}</CardTitle>
                    <CardDescription>{video.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{video.views} views</span>
                      <Button variant="outline" size="sm" onClick={() => setSelectedVideo(video.id)}>
                        <Play className="h-4 w-4 mr-2" />
                        Tonton
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Marketing Materials Tab */}
          <TabsContent value="materials" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMaterials.map((material) => (
                <Card key={material.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={material.thumbnail || "/placeholder.svg"}
                      alt={material.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Button
                        onClick={() => handleDownload(material.downloadUrl, material.title)}
                        className="bg-white text-black hover:bg-gray-100"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                    <Badge className="absolute top-2 right-2 bg-black bg-opacity-70">{material.type}</Badge>
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{material.category}</Badge>
                      <span className="text-sm text-gray-500">{material.size}</span>
                    </div>
                    <CardTitle className="text-lg">{material.title}</CardTitle>
                    <CardDescription>{material.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" onClick={() => handleDownload(material.downloadUrl, material.title)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download {material.type}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Video Modal */}
        {selectedVideo && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="text-lg font-semibold">{educationVideos.find((v) => v.id === selectedVideo)?.title}</h3>
                <Button variant="outline" onClick={() => setSelectedVideo(null)}>
                  Tutup
                </Button>
              </div>
              <div className="aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${educationVideos.find((v) => v.id === selectedVideo)?.youtubeId}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
