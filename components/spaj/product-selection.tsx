"use client"

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, Building2, Car, Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Control } from "react-hook-form"
import type { FormData } from "@/lib/spaj-schemas"

const productTypes = {
  traditional: {
    name: "Traditional",
    icon: Shield,
    color: "bg-blue-500",
    products: ["BNI Life Proteksi", "BNI Life Sejahtera", "BNI Life Berkah"],
  },
  "unit-link": {
    name: "Unit Link",
    icon: Building2,
    color: "bg-green-500",
    products: ["BNI Life Investasi Plus", "BNI Life Optimal", "BNI Life Prestasi"],
  },
  "personal-accident": {
    name: "Personal Accident",
    icon: Car,
    color: "bg-orange-500",
    products: ["BNI Life Kecelakaan Diri", "BNI Life Travel Protection"],
  },
  health: {
    name: "Health",
    icon: Heart,
    color: "bg-red-500",
    products: ["BNI Life Sehat", "BNI Life Medical Plus", "BNI Life Hospital Cash"],
  },
}

interface ProductSelectionProps {
  control: Control<FormData>
  watch: (name: keyof FormData) => any
}

export function ProductSelection({ control, watch }: ProductSelectionProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="productType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Jenis Produk Asuransi</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {Object.entries(productTypes).map(([key, product]) => {
                  const Icon = product.icon
                  return (
                    <div key={key} className="flex items-center space-x-2">
                      <RadioGroupItem value={key} id={key} />
                      <label
                        htmlFor={key}
                        className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 flex-1"
                      >
                        <div className={cn("p-2 rounded-lg", product.color)}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.products.length} produk tersedia</p>
                        </div>
                      </label>
                    </div>
                  )
                })}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {watch("productType") && (
        <FormField
          control={control}
          name="productName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Produk</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih nama produk" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {productTypes[watch("productType") as keyof typeof productTypes]?.products.map((product) => (
                    <SelectItem key={product} value={product}>
                      {product}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <FormField
        control={control}
        name="channel"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Channel Penjualan</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih channel penjualan" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="inbranch">Inbranch</SelectItem>
                <SelectItem value="agency">Agency</SelectItem>
                <SelectItem value="distribution">Distribution</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
