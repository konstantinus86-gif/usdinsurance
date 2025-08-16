"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Video, Play, Square, ArrowLeft, Download, Eye, Mic, Camera, Upload } from "lucide-react"
import Link from "next/link"

export default function RecordingPage() {
  const router = useRouter()
  const [recordings, setRecordings] = useState<any[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [showNewRecording, setShowNewRecording] = useState(false)
  const [formData, setFormData] = useState({
    clientName: "",
    recordingType: "",
    notes: "",
    duration: 0,
  })
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

  useEffect(() => {
    const authData = localStorage.getItem("agentAuth")
    if (!authData) {
      router.push("/auth/login")
      return
    }

    const savedRecordings = JSON.parse(localStorage.getItem("recordings") || "[]")
    setRecordings(savedRecordings)
  }, [router])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.start()
      setIsRecording(true)

      // Simulate recording duration
      const startTime = Date.now()
      const interval = setInterval(() => {
        if (!isRecording) {
          clearInterval(interval)
          return
        }
        const duration = Math.floor((Date.now() - startTime) / 1000)
        setFormData((prev) => ({ ...prev, duration }))
      }, 1000)
    } catch (error) {
      console.error("Error accessing camera:", error)
      alert("Tidak dapat mengakses kamera. Pastikan izin kamera telah diberikan.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      // Stop all tracks
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }

  const saveRecording = () => {
    const newRecording = {
      id: `REC-${Date.now()}`,
      ...formData,
      status: "completed",
      createdAt: new Date().toISOString(),
      fileSize: "2.5 MB", // Simulated
    }

    const updatedRecordings = [...recordings, newRecording]
    setRecordings(updatedRecordings)
    localStorage.setItem("recordings", JSON.stringify(updatedRecordings))

    setShowNewRecording(false)
    setFormData({ clientName: "", recordingType: "", notes: "", duration: 0 })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-50 text-green-700 border-green-200">Selesai</Badge>
      case "processing":
        return <Badge className="bg-blue-50 text-blue-700 border-blue-200">Memproses</Badge>
      case "failed":
        return <Badge className="bg-red-50 text-red-700 border-red-200">Gagal</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
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
              <h1 className="text-3xl font-bold text-foreground">Recording Video</h1>
              <p className="text-muted-foreground">Rekam video untuk dokumentasi dan verifikasi nasabah</p>
            </div>
          </div>
          <Button onClick={() => setShowNewRecording(true)} className="bg-primary hover:bg-primary/90">
            <Video className="w-4 h-4 mr-2" />
            Mulai Recording
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Recording</p>
                  <p className="text-2xl font-bold">{recordings.length}</p>
                </div>
                <Video className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Selesai</p>
                  <p className="text-2xl font-bold">{recordings.filter((r) => r.status === "completed").length}</p>
                </div>
                <Play className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Durasi</p>
                  <p className="text-2xl font-bold">
                    {formatDuration(recordings.reduce((acc, r) => acc + r.duration, 0))}
                  </p>
                </div>
                <Mic className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Bulan Ini</p>
                  <p className="text-2xl font-bold">
                    {recordings.filter((r) => new Date(r.createdAt).getMonth() === new Date().getMonth()).length}
                  </p>
                </div>
                <Camera className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* New Recording Form */}
        {showNewRecording && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Mulai Recording Baru</CardTitle>
              <CardDescription>Siapkan recording video untuk dokumentasi nasabah</CardDescription>
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
                  <Label htmlFor="recordingType">Jenis Recording</Label>
                  <Input
                    id="recordingType"
                    value={formData.recordingType}
                    onChange={(e) => setFormData({ ...formData, recordingType: e.target.value })}
                    placeholder="Verifikasi, Penjelasan Produk, dll"
                  />
                </div>
              </div>

              {/* Video Preview */}
              <div className="bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="w-full h-64 object-cover"
                  style={{ display: showNewRecording ? "block" : "none" }}
                />
                {!isRecording && (
                  <div className="h-64 flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <Camera className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-600">Klik "Mulai Recording" untuk memulai</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Recording Controls */}
              <div className="flex items-center justify-center space-x-4">
                {!isRecording ? (
                  <Button onClick={startRecording} className="bg-red-600 hover:bg-red-700">
                    <Video className="w-4 h-4 mr-2" />
                    Mulai Recording
                  </Button>
                ) : (
                  <>
                    <Button onClick={stopRecording} variant="outline">
                      <Square className="w-4 h-4 mr-2" />
                      Stop Recording
                    </Button>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">Recording: {formatDuration(formData.duration)}</span>
                    </div>
                  </>
                )}
              </div>

              <div>
                <Label htmlFor="notes">Catatan</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Catatan tambahan untuk recording"
                />
              </div>

              <div className="flex space-x-4">
                <Button onClick={saveRecording} disabled={formData.duration === 0}>
                  <Upload className="w-4 h-4 mr-2" />
                  Simpan Recording
                </Button>
                <Button variant="outline" onClick={() => setShowNewRecording(false)}>
                  Batal
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recording List */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Recording</CardTitle>
            <CardDescription>Kelola dan pantau video recording nasabah</CardDescription>
          </CardHeader>
          <CardContent>
            {recordings.length === 0 ? (
              <div className="text-center py-12">
                <Video className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">Belum ada recording</h3>
                <p className="text-muted-foreground mb-4">
                  Mulai dengan membuat recording baru untuk dokumentasi nasabah
                </p>
                <Button onClick={() => setShowNewRecording(true)}>
                  <Video className="w-4 h-4 mr-2" />
                  Mulai Recording Pertama
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recordings.map((recording) => (
                  <div
                    key={recording.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/30 transition-all"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <Video className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{recording.clientName}</h4>
                        <p className="text-sm text-muted-foreground">{recording.recordingType}</p>
                        <p className="text-xs text-muted-foreground">
                          {recording.id} • {formatDuration(recording.duration)} • {recording.fileSize}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(recording.createdAt).toLocaleDateString("id-ID")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {getStatusBadge(recording.status)}
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Play className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
