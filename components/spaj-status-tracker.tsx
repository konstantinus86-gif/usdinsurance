"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Clock, XCircle, FileText, Eye, Phone, Mail } from "lucide-react"

interface SPAJStatusTrackerProps {
  spajNumber?: string
  className?: string
}

export default function SPAJStatusTracker({ spajNumber, className }: SPAJStatusTrackerProps) {
  const [spajData, setSpajData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedSPAJs = JSON.parse(localStorage.getItem("spajs") || "[]")
    const currentSPAJ = spajNumber
      ? savedSPAJs.find((spaj: any) => spaj.spajNumber === spajNumber)
      : savedSPAJs[savedSPAJs.length - 1] // Get latest if no specific number

    setSpajData(currentSPAJ)
    setLoading(false)
  }, [spajNumber])

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!spajData) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center text-gray-500">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Tidak ada data SPAJ ditemukan</p>
        </CardContent>
      </Card>
    )
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "pending":
        return {
          label: "Menunggu Review",
          color: "bg-yellow-100 text-yellow-800",
          icon: Clock,
          progress: 25,
        }
      case "review":
        return {
          label: "Sedang Direview",
          color: "bg-blue-100 text-blue-800",
          icon: FileText,
          progress: 50,
        }
      case "approved":
        return {
          label: "Disetujui",
          color: "bg-green-100 text-green-800",
          icon: CheckCircle,
          progress: 100,
        }
      case "rejected":
        return {
          label: "Ditolak",
          color: "bg-red-100 text-red-800",
          icon: XCircle,
          progress: 100,
        }
      default:
        return {
          label: "Unknown",
          color: "bg-gray-100 text-gray-800",
          icon: Clock,
          progress: 0,
        }
    }
  }

  const statusInfo = getStatusInfo(spajData.status)
  const StatusIcon = statusInfo.icon

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Status SPAJ</CardTitle>
            <CardDescription>{spajData.spajNumber}</CardDescription>
          </div>
          <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <StatusIcon className="h-5 w-5 text-gray-600" />
          <div className="flex-1">
            <p className="font-medium">{spajData.fullName}</p>
            <p className="text-sm text-gray-600">{spajData.productName}</p>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{statusInfo.progress}%</span>
          </div>
          <Progress value={statusInfo.progress} className="h-2" />
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
            <Eye className="h-4 w-4 mr-2" />
            Detail
          </Button>
          <Button variant="outline" size="sm">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Mail className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
