"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Video, Square, Play, FileSignature, Check, Smartphone, Shield } from "lucide-react"

interface SignatureRecordingProps {
  formData: any
  updateFormData: (field: string, value: any) => void
}

export default function SignatureRecording({ formData, updateFormData }: SignatureRecordingProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null)
  const [signatureComplete, setSignatureComplete] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otpCode, setOtpCode] = useState("")
  const [otpVerified, setOtpVerified] = useState(false)
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false)
  const [otpTimer, setOtpTimer] = useState(0)
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

  const sendOtp = async () => {
    const phoneNumber = formData.personalData?.phone || "08123456789"

    // Simulate OTP sending
    setOtpSent(true)
    setOtpTimer(60)

    // Start countdown timer
    const timer = setInterval(() => {
      setOtpTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Simulate API call
    console.log(`[v0] OTP sent to ${phoneNumber}`)
    alert(`Kode OTP telah dikirim ke nomor ${phoneNumber}`)
  }

  const verifyOtp = async () => {
    if (otpCode.length !== 6) {
      alert("Kode OTP harus 6 digit")
      return
    }

    setIsVerifyingOtp(true)

    // Simulate OTP verification (in real app, this would call API)
    setTimeout(() => {
      if (otpCode === "123456") {
        setOtpVerified(true)
        updateFormData("otpVerification", {
          verified: true,
          timestamp: new Date().toISOString(),
          phone: formData.personalData?.phone || "08123456789",
        })
        alert("Verifikasi OTP berhasil!")
      } else {
        alert("Kode OTP salah. Silakan coba lagi.")
      }
      setIsVerifyingOtp(false)
    }, 2000)
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

      {signatureComplete && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Verifikasi OTP (2FA)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Untuk keamanan tambahan, silakan verifikasi identitas Anda dengan kode OTP yang akan dikirim ke nomor
              handphone terdaftar.
            </p>

            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-blue-700">
                <Smartphone className="h-4 w-4" />
                <span className="text-sm">Nomor HP: {formData.personalData?.phone || "08123456789"}</span>
              </div>
            </div>

            {!otpSent ? (
              <Button onClick={sendOtp} className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                Kirim Kode OTP
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otpCode">Masukkan Kode OTP (6 digit)</Label>
                  <Input
                    id="otpCode"
                    type="text"
                    placeholder="123456"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    maxLength={6}
                    className="text-center text-lg tracking-widest"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Button
                    onClick={verifyOtp}
                    disabled={otpCode.length !== 6 || isVerifyingOtp || otpVerified}
                    className="flex items-center gap-2"
                  >
                    <Shield className="h-4 w-4" />
                    {isVerifyingOtp ? "Memverifikasi..." : "Verifikasi OTP"}
                  </Button>

                  {otpTimer > 0 ? (
                    <span className="text-sm text-gray-500">Kirim ulang dalam {otpTimer} detik</span>
                  ) : (
                    <Button variant="outline" onClick={sendOtp} size="sm">
                      Kirim Ulang OTP
                    </Button>
                  )}
                </div>

                {otpVerified && (
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700">
                      <Check className="h-4 w-4" />
                      <span className="text-sm">✓ Verifikasi OTP berhasil! Proses 2FA telah selesai.</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="text-xs text-gray-500 space-y-1">
              <p>• Kode OTP berlaku selama 5 menit</p>
              <p>• Jika tidak menerima SMS, periksa kotak masuk atau coba kirim ulang</p>
              <p>• Verifikasi 2FA diperlukan untuk keamanan transaksi</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
