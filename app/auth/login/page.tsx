"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Fingerprint, Smartphone, Shield, CheckCircle } from "lucide-react"
import Image from "next/image"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [loginStep, setLoginStep] = useState<"credentials" | "otp" | "biometric">("credentials")
  const [otpCode, setOtpCode] = useState("")
  const [countdown, setCountdown] = useState(0)
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  })

  // Simulate OTP countdown
  const startCountdown = () => {
    setCountdown(60)
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleCredentialLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (credentials.username === "agent001" && credentials.password === "password123") {
      setLoginStep("otp")
      startCountdown()
      // Simulate sending OTP
      console.log("[v0] OTP sent to registered phone number")
    } else {
      setError("Username atau password salah")
    }
    setIsLoading(false)
  }

  const handleOTPVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate OTP verification
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (otpCode === "123456") {
      // Store auth session
      localStorage.setItem(
        "agentAuth",
        JSON.stringify({
          isAuthenticated: true,
          agent: {
            id: "AGT001",
            name: "Ahmad Wijaya",
            email: "ahmad.wijaya@bnilife.co.id",
            phone: "+62812345678",
            branch: "Jakarta Pusat",
            loginTime: new Date().toISOString(),
          },
        }),
      )
      router.push("/")
    } else {
      setError("Kode OTP salah")
    }
    setIsLoading(false)
  }

  const handleBiometricLogin = async () => {
    setIsLoading(true)
    setError("")

    try {
      // Simulate biometric authentication
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In real implementation, use WebAuthn API
      const success = Math.random() > 0.3 // 70% success rate for demo

      if (success) {
        localStorage.setItem(
          "agentAuth",
          JSON.stringify({
            isAuthenticated: true,
            agent: {
              id: "AGT001",
              name: "Ahmad Wijaya",
              email: "ahmad.wijaya@bnilife.co.id",
              phone: "+62812345678",
              branch: "Jakarta Pusat",
              loginTime: new Date().toISOString(),
            },
          }),
        )
        router.push("/")
      } else {
        setError("Autentikasi biometrik gagal. Silakan coba lagi.")
      }
    } catch (err) {
      setError("Biometrik tidak tersedia di perangkat ini")
    }
    setIsLoading(false)
  }

  const resendOTP = () => {
    if (countdown === 0) {
      startCountdown()
      console.log("[v0] OTP resent to registered phone number")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Image
              src="/mastersystem-logo.png"
              alt="BNI Life Logo"
              width={120}
              height={60}
              className="object-contain"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Portal Agen BNI Life</CardTitle>
          <CardDescription>Masuk ke akun agen Anda untuk mengakses dashboard</CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert className="mb-4 border-red-200 bg-red-50">
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="password" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="password" className="text-xs">
                <Shield className="w-4 h-4 mr-1" />
                Password
              </TabsTrigger>
              <TabsTrigger value="biometric" className="text-xs">
                <Fingerprint className="w-4 h-4 mr-1" />
                Biometrik
              </TabsTrigger>
              <TabsTrigger value="demo" className="text-xs">
                <CheckCircle className="w-4 h-4 mr-1" />
                Demo
              </TabsTrigger>
            </TabsList>

            <TabsContent value="password" className="space-y-4">
              {loginStep === "credentials" && (
                <form onSubmit={handleCredentialLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username Agen</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Masukkan username agen"
                      value={credentials.username}
                      onChange={(e) => setCredentials((prev) => ({ ...prev, username: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Masukkan password"
                        value={credentials.password}
                        onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Memverifikasi..." : "Masuk"}
                  </Button>

                  <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                    <strong>Demo Credentials:</strong>
                    <br />
                    Username: agent001
                    <br />
                    Password: password123
                  </div>
                </form>
              )}

              {loginStep === "otp" && (
                <form onSubmit={handleOTPVerification} className="space-y-4">
                  <div className="text-center">
                    <Smartphone className="w-12 h-12 mx-auto text-cyan-600 mb-2" />
                    <h3 className="font-semibold">Verifikasi OTP</h3>
                    <p className="text-sm text-gray-600">Kode OTP telah dikirim ke nomor handphone terdaftar</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="otp">Kode OTP (6 digit)</Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="Masukkan kode OTP"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      maxLength={6}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading || otpCode.length !== 6}>
                    {isLoading ? "Memverifikasi..." : "Verifikasi OTP"}
                  </Button>

                  <div className="text-center">
                    <Button type="button" variant="ghost" size="sm" onClick={resendOTP} disabled={countdown > 0}>
                      {countdown > 0 ? `Kirim ulang dalam ${countdown}s` : "Kirim ulang OTP"}
                    </Button>
                  </div>

                  <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                    <strong>Demo OTP:</strong> 123456
                  </div>
                </form>
              )}
            </TabsContent>

            <TabsContent value="biometric" className="space-y-4">
              <div className="text-center space-y-4">
                <Fingerprint className="w-16 h-16 mx-auto text-cyan-600" />
                <div>
                  <h3 className="font-semibold">Autentikasi Biometrik</h3>
                  <p className="text-sm text-gray-600">Gunakan sidik jari atau Face ID untuk masuk</p>
                </div>

                <Button onClick={handleBiometricLogin} className="w-full" disabled={isLoading}>
                  {isLoading ? "Memverifikasi..." : "Gunakan Biometrik"}
                </Button>

                <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                  <strong>Demo:</strong> Simulasi autentikasi biometrik (70% success rate)
                </div>
              </div>
            </TabsContent>

            <TabsContent value="demo" className="space-y-4">
              <div className="text-center space-y-4">
                <CheckCircle className="w-16 h-16 mx-auto text-green-600" />
                <div>
                  <h3 className="font-semibold">Akses Demo</h3>
                  <p className="text-sm text-gray-600">Langsung masuk ke dashboard untuk demo</p>
                </div>

                <Button
                  onClick={() => {
                    localStorage.setItem(
                      "agentAuth",
                      JSON.stringify({
                        isAuthenticated: true,
                        agent: {
                          id: "AGT001",
                          name: "Ahmad Wijaya",
                          email: "ahmad.wijaya@bnilife.co.id",
                          phone: "+62812345678",
                          branch: "Jakarta Pusat",
                          loginTime: new Date().toISOString(),
                        },
                      }),
                    )
                    router.push("/")
                  }}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Masuk Demo
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center">
            <Button variant="link" size="sm" className="text-cyan-600">
              Lupa password?
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
