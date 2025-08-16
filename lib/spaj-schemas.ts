import * as z from "zod"

export const productSelectionSchema = z.object({
  productType: z.enum(["traditional", "unit-link", "personal-accident", "health"], {
    required_error: "Pilih jenis produk asuransi",
  }),
  productName: z.string().min(1, "Pilih nama produk"),
  channel: z.enum(["inbranch", "agency", "distribution"], {
    required_error: "Pilih channel penjualan",
  }),
})

export const personalDataSchema = z.object({
  fullName: z.string().min(2, "Nama lengkap minimal 2 karakter"),
  idNumber: z.string().min(16, "NIK harus 16 digit").max(16, "NIK harus 16 digit"),
  birthPlace: z.string().min(1, "Tempat lahir wajib diisi"),
  birthDate: z.date({
    required_error: "Tanggal lahir wajib diisi",
  }),
  gender: z.enum(["male", "female"], {
    required_error: "Pilih jenis kelamin",
  }),
  maritalStatus: z.enum(["single", "married", "divorced", "widowed"], {
    required_error: "Pilih status pernikahan",
  }),
  nationality: z.string().min(1, "Kewarganegaraan wajib diisi"),
  religion: z.enum(["islam", "kristen", "katolik", "hindu", "buddha", "konghucu"], {
    required_error: "Pilih agama",
  }),
  education: z.enum(["sd", "smp", "sma", "d3", "s1", "s2", "s3"], {
    required_error: "Pilih pendidikan terakhir",
  }),
  occupation: z.string().min(1, "Pekerjaan wajib diisi"),
  monthlyIncome: z.string().min(1, "Penghasilan bulanan wajib diisi"),
  address: z.string().min(10, "Alamat minimal 10 karakter"),
  city: z.string().min(1, "Kota wajib diisi"),
  province: z.string().min(1, "Provinsi wajib diisi"),
  postalCode: z.string().min(5, "Kode pos minimal 5 digit"),
  phoneNumber: z.string().min(10, "Nomor telepon minimal 10 digit"),
  email: z.string().email("Format email tidak valid"),
  isDifferentPolicyholder: z.boolean().default(false),
  policyholderName: z.string().optional(),
  policyholderRelation: z.string().optional(),
})

export const beneficiarySchema = z.object({
  beneficiaries: z
    .array(
      z.object({
        name: z.string().min(2, "Nama ahli waris minimal 2 karakter"),
        relation: z.string().min(1, "Hubungan dengan tertanggung wajib diisi"),
        percentage: z.number().min(1).max(100),
        birthDate: z.date({
          required_error: "Tanggal lahir ahli waris wajib diisi",
        }),
        idNumber: z.string().min(16, "NIK ahli waris harus 16 digit").max(16, "NIK harus 16 digit"),
      }),
    )
    .min(1, "Minimal satu ahli waris"),
})

export const medicalQuestionnaireSchema = z.object({
  hasHealthIssues: z.boolean(),
  healthIssuesDetail: z.string().optional(),
  takingMedication: z.boolean(),
  medicationDetail: z.string().optional(),
  hasHospitalization: z.boolean(),
  hospitalizationDetail: z.string().optional(),
  hasFamilyHistory: z.boolean(),
  familyHistoryDetail: z.string().optional(),
  smoker: z.boolean(),
  alcoholConsumption: z.boolean(),
  dangerousActivities: z.boolean(),
  dangerousActivitiesDetail: z.string().optional(),
})

export const documentsSchema = z.object({
  idCard: z.boolean().default(false),
  familyCard: z.boolean().default(false),
  birthCertificate: z.boolean().default(false),
  incomeProof: z.boolean().default(false),
  medicalReport: z.boolean().default(false),
  additionalDocuments: z.array(z.string()).default([]),
})

export type FormData = z.infer<typeof productSelectionSchema> &
  z.infer<typeof personalDataSchema> &
  z.infer<typeof beneficiarySchema> &
  z.infer<typeof medicalQuestionnaireSchema> &
  z.infer<typeof documentsSchema>
