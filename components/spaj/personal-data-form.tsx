"use client"

import type { Control, UseFormWatch } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, MapPin, Phone, Briefcase } from "lucide-react"
import type { FormData } from "@/lib/spaj-schemas"

interface PersonalDataFormProps {
  control: Control<FormData>
  watch: UseFormWatch<FormData>
}

export function PersonalDataForm({ control, watch }: PersonalDataFormProps) {
  return (
    <div className="space-y-6">
      {/* Data Pribadi Tertanggung */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5 text-cyan-600" />
            Data Pribadi Tertanggung
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="personalData.fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Lengkap *</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nama lengkap sesuai KTP" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="personalData.nickname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Panggilan</FormLabel>
                  <FormControl>
                    <Input placeholder="Nama panggilan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={control}
              name="personalData.placeOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tempat Lahir *</FormLabel>
                  <FormControl>
                    <Input placeholder="Kota kelahiran" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="personalData.dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal Lahir *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="personalData.gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jenis Kelamin *</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jenis kelamin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Laki-laki</SelectItem>
                        <SelectItem value="female">Perempuan</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="personalData.idNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor KTP *</FormLabel>
                  <FormControl>
                    <Input placeholder="16 digit nomor KTP" maxLength={16} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="personalData.maritalStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status Pernikahan *</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status pernikahan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Belum Menikah</SelectItem>
                        <SelectItem value="married">Menikah</SelectItem>
                        <SelectItem value="divorced">Cerai</SelectItem>
                        <SelectItem value="widowed">Janda/Duda</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Alamat */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5 text-cyan-600" />
            Alamat Tertanggung
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={control}
            name="personalData.address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alamat Lengkap *</FormLabel>
                <FormControl>
                  <Textarea placeholder="Jalan, RT/RW, Kelurahan, Kecamatan" className="min-h-[80px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={control}
              name="personalData.city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kota *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nama kota" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="personalData.province"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provinsi *</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih provinsi" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="jakarta">DKI Jakarta</SelectItem>
                        <SelectItem value="west-java">Jawa Barat</SelectItem>
                        <SelectItem value="central-java">Jawa Tengah</SelectItem>
                        <SelectItem value="east-java">Jawa Timur</SelectItem>
                        <SelectItem value="banten">Banten</SelectItem>
                        <SelectItem value="yogyakarta">DI Yogyakarta</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="personalData.postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kode Pos *</FormLabel>
                  <FormControl>
                    <Input placeholder="12345" maxLength={5} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Kontak */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Phone className="h-5 w-5 text-cyan-600" />
            Informasi Kontak
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="personalData.phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor Telepon *</FormLabel>
                  <FormControl>
                    <Input placeholder="08xxxxxxxxxx" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="personalData.email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="nama@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Pekerjaan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Briefcase className="h-5 w-5 text-cyan-600" />
            Informasi Pekerjaan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="personalData.occupation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pekerjaan *</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih pekerjaan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="employee">Karyawan</SelectItem>
                        <SelectItem value="entrepreneur">Wiraswasta</SelectItem>
                        <SelectItem value="professional">Profesional</SelectItem>
                        <SelectItem value="civil-servant">PNS</SelectItem>
                        <SelectItem value="student">Pelajar/Mahasiswa</SelectItem>
                        <SelectItem value="housewife">Ibu Rumah Tangga</SelectItem>
                        <SelectItem value="retired">Pensiunan</SelectItem>
                        <SelectItem value="other">Lainnya</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="personalData.monthlyIncome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Penghasilan Bulanan *</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih range penghasilan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="<5jt">&lt; Rp 5.000.000</SelectItem>
                        <SelectItem value="5-10jt">Rp 5.000.000 - Rp 10.000.000</SelectItem>
                        <SelectItem value="10-25jt">Rp 10.000.000 - Rp 25.000.000</SelectItem>
                        <SelectItem value="25-50jt">Rp 25.000.000 - Rp 50.000.000</SelectItem>
                        <SelectItem value=">50jt">&gt; Rp 50.000.000</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={control}
            name="personalData.companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Perusahaan</FormLabel>
                <FormControl>
                  <Input placeholder="Nama tempat bekerja" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="personalData.companyAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alamat Perusahaan</FormLabel>
                <FormControl>
                  <Textarea placeholder="Alamat lengkap tempat bekerja" className="min-h-[60px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Informasi Tambahan */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informasi Tambahan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={control}
            name="personalData.smokingStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status Merokok *</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="non-smoker" id="non-smoker" />
                      <FormLabel htmlFor="non-smoker">Tidak Merokok</FormLabel>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="smoker" id="smoker" />
                      <FormLabel htmlFor="smoker">Merokok</FormLabel>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ex-smoker" id="ex-smoker" />
                      <FormLabel htmlFor="ex-smoker">Mantan Perokok</FormLabel>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center space-x-2">
            <Checkbox id="terms" />
            <FormLabel htmlFor="terms" className="text-sm">
              Saya menyatakan bahwa semua informasi yang diberikan adalah benar dan akurat
            </FormLabel>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
