"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Video, Square, Play, FileSignature, Check } from "lucide-react"

interface SignatureRecordingProps {
  formData: any
  updateFormData: (field: string, value: any) => void
}

export default function SignatureRecording({ formData, updateFormData }: SignatureRecordingProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null)
  const [signatureComplete, setSignatureComplete] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      const chunks: BlobPart[] = []
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" })
        const videoURL = URL.createObjectURL(blob)
        setRecordedVideo(videoURL)
        updateFormData("recordedVideo", videoURL)

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error("Error accessing camera:", error)
      alert("Tidak dapat mengakses kamera. Pastikan izin kamera telah diberikan.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const handleSignature = () => {
    // Simulate signature process
    setSignatureComplete(true)
    updateFormData("eSignature", {
      signed: true,
      timestamp: new Date().toISOString(),
      method: "digital",
    })
  }

  return (
    <div className="space-y-6">
      {/* Video Recording Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Recording Video Pernyataan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Silakan rekam video pernyataan Anda untuk konfirmasi aplikasi SPAJ ini. Pastikan wajah terlihat jelas dan
            suara terdengar dengan baik.
          </p>

          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
            {!recordedVideo ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                className="w-full h-full object-cover"
                style={{ display: isRecording ? "block" : "none" }}
              />
            ) : (
              <video src={recordedVideo} controls className="w-full h-full object-cover" />
            )}

            {!isRecording && !recordedVideo && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Video className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500">Klik tombol untuk mulai merekam</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {!isRecording && !recordedVideo && (
              <Button onClick={startRecording} className="flex items-center gap-2">
                <Play className="h-4 w-4" />
                Mulai Rekam
              </Button>
            )}

            {isRecording && (
              <Button onClick={stopRecording} variant="destructive" className="flex items-center gap-2">
                <Square className="h-4 w-4" />
                Stop Rekam
              </Button>
            )}

            {recordedVideo && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Check className="h-3 w-3" />
                Video Tersimpan
              </Badge>
            )}
          </div>

          {recordedVideo && (
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-green-700">✓ Video pernyataan berhasil direkam dan tersimpan.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Digital Signature Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSignature className="h-5 w-5" />
            Tanda Tangan Digital
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Dengan menandatangani dokumen ini secara digital, Anda menyatakan bahwa semua informasi yang diberikan
            adalah benar dan akurat.
          </p>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
            <canvas
              ref={canvasRef}
              width={400}
              height={200}
              className="border rounded bg-white w-full"
              style={{ touchAction: "none" }}
            />
          </div>

          <div className="flex gap-2">
            {!signatureComplete ? (
              <Button onClick={handleSignature} className="flex items-center gap-2">
                <FileSignature className="h-4 w-4" />
                Tanda Tangan Digital
              </Button>
            ) : (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Check className="h-3 w-3" />
                Sudah Ditandatangani
              </Badge>
            )}
          </div>

          {signatureComplete && (
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-green-700">
                ✓ Dokumen telah ditandatangani secara digital pada {new Date().toLocaleString("id-ID")}.
              </p>
            </div>
          )}

          <div className="text-xs text-gray-500 space-y-1">
            <p>• Tanda tangan digital memiliki kekuatan hukum yang sama dengan tanda tangan basah</p>
            <p>• Timestamp dan metadata akan disimpan untuk keperluan audit</p>
            <p>• Dokumen yang sudah ditandatangani tidak dapat diubah</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
