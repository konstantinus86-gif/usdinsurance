"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Camera, Save, User, Mail, Phone, MapPin, Building, Calendar } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const router = useRouter()
  const [agent, setAgent] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    branch: "",
    joinDate: "",
    bio: "",
    profilePhoto: "/edy-san-profile.jpg",
  })

  useEffect(() => {
    const authData = localStorage.getItem("agentAuth")
    if (!authData) {
      router.push("/auth/login")
      return
    }

    try {
      const parsedAuth = JSON.parse(authData)
      if (!parsedAuth.isAuthenticated) {
        router.push("/auth/login")
        return
      }

      const agentData = parsedAuth.agent
      setAgent(agentData)

      // Load saved profile data or use defaults
      const savedProfile = localStorage.getItem("agentProfile")
      if (savedProfile) {
        const profileData = JSON.parse(savedProfile)
        setFormData(profileData)
      } else {
        setFormData({
          name: agentData.name || "Edy San",
          email: "edy.san@bnilife.co.id",
          phone: "+62 812-3456-7890",
          address: "Jl. Sudirman No. 123, Jakarta Pusat",
          branch: agentData.branch || "Jakarta Pusat",
          joinDate: "2020-01-15",
          bio: "Agen asuransi berpengalaman dengan fokus pada pelayanan terbaik untuk nasabah. Spesialisasi dalam produk Unit Link dan Traditional Life Insurance.",
          profilePhoto: "/edy-san-profile.jpg",
        })
      }
    } catch (error) {
      router.push("/auth/login")
    }
  }, [router])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem("agentProfile", JSON.stringify(formData))

    // Update agent auth data
    const authData = localStorage.getItem("agentAuth")
    if (authData) {
      const parsedAuth = JSON.parse(authData)
      parsedAuth.agent = {
        ...parsedAuth.agent,
        name: formData.name,
        branch: formData.branch,
      }
      localStorage.setItem("agentAuth", JSON.stringify(parsedAuth))
    }

    setAgent((prev) => ({
      ...prev,
      name: formData.name,
      branch: formData.branch,
    }))

    setIsEditing(false)
  }

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setFormData((prev) => ({
          ...prev,
          profilePhoto: result,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  if (!agent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Memuat profil...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <img src="/mastersystem-logo.png" alt="BNI Life" className="w-8 h-8" />
                <div>
                  <h1 className="font-work-sans font-bold text-xl text-foreground">Profil Agen</h1>
                  <p className="text-sm text-muted-foreground">Kelola informasi pribadi Anda</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {isEditing ? (
                <>
                  <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
                    <Save className="w-4 h-4 mr-2" />
                    Simpan
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Batal
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  <User className="w-4 h-4 mr-2" />
                  Edit Profil
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Photo & Basic Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="relative inline-block mb-4">
                  <Avatar className="w-32 h-32 mx-auto">
                    <AvatarImage src={formData.profilePhoto || "/placeholder.svg"} alt={formData.name} />
                    <AvatarFallback className="text-2xl">
                      {formData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90">
                      <Camera className="w-4 h-4" />
                      <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                    </label>
                  )}
                </div>
                <h2 className="font-work-sans font-bold text-xl text-foreground mb-1">{formData.name}</h2>
                <p className="text-muted-foreground mb-2">{formData.branch}</p>
                <p className="text-sm text-muted-foreground">
                  Bergabung sejak{" "}
                  {new Date(formData.joinDate).toLocaleDateString("id-ID", { year: "numeric", month: "long" })}
                </p>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="font-work-sans">Statistik</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total SPAJ</span>
                  <span className="font-semibold">127</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Approval Rate</span>
                  <span className="font-semibold text-green-600">94%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Premium YTD</span>
                  <span className="font-semibold">Rp 2.4M</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="font-work-sans">Informasi Pribadi</CardTitle>
                <CardDescription>
                  {isEditing ? "Edit informasi pribadi Anda" : "Detail informasi pribadi dan kontak"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Nama Lengkap
                    </Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Masukkan nama lengkap"
                      />
                    ) : (
                      <p className="text-foreground font-medium">{formData.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="Masukkan email"
                      />
                    ) : (
                      <p className="text-foreground font-medium">{formData.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Nomor Telepon
                    </Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="Masukkan nomor telepon"
                      />
                    ) : (
                      <p className="text-foreground font-medium">{formData.phone}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="branch" className="flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      Cabang
                    </Label>
                    {isEditing ? (
                      <Select value={formData.branch} onValueChange={(value) => handleInputChange("branch", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih cabang" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Jakarta Pusat">Jakarta Pusat</SelectItem>
                          <SelectItem value="Jakarta Selatan">Jakarta Selatan</SelectItem>
                          <SelectItem value="Jakarta Utara">Jakarta Utara</SelectItem>
                          <SelectItem value="Jakarta Barat">Jakarta Barat</SelectItem>
                          <SelectItem value="Jakarta Timur">Jakarta Timur</SelectItem>
                          <SelectItem value="Surabaya">Surabaya</SelectItem>
                          <SelectItem value="Bandung">Bandung</SelectItem>
                          <SelectItem value="Medan">Medan</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-foreground font-medium">{formData.branch}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="joinDate" className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Tanggal Bergabung
                    </Label>
                    {isEditing ? (
                      <Input
                        id="joinDate"
                        type="date"
                        value={formData.joinDate}
                        onChange={(e) => handleInputChange("joinDate", e.target.value)}
                      />
                    ) : (
                      <p className="text-foreground font-medium">
                        {new Date(formData.joinDate).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Alamat
                  </Label>
                  {isEditing ? (
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      placeholder="Masukkan alamat lengkap"
                      rows={2}
                    />
                  ) : (
                    <p className="text-foreground font-medium">{formData.address}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  {isEditing ? (
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      placeholder="Ceritakan tentang diri Anda dan pengalaman sebagai agen"
                      rows={3}
                    />
                  ) : (
                    <p className="text-foreground font-medium">{formData.bio}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
