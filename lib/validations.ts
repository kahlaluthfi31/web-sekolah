import { z } from 'zod'

// News Validation Schema
export const newsCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  slug: z.string().min(1, 'Slug is required').max(255),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  featuredImage: z.string().optional(),
  category: z.enum(['berita', 'kejuaraan', 'pengumuman', 'event']),
  authorId: z.number().optional(),
  creatorName: z.string().max(255).optional(),
  creatorCategory: z.string().max(100).optional(),
  isPublished: z.boolean().default(false),
  tags: z.array(z.string()).optional(),
})

export const newsUpdateSchema = newsCreateSchema.partial()

// User Validation Schema
export const userCreateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  email: z.string().email('Invalid email').max(255),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['superadmin', 'admin', 'user']).default('user'),
  status: z.enum(['active', 'inactive', 'pending']).default('pending'),
  avatar: z.string().optional(),
})

export const userUpdateSchema = userCreateSchema.partial().omit({ password: true })

// Teacher Validation Schema
export const teacherCreateSchema = z.object({
  nip: z.string().max(50).optional().nullable(),
  name: z.string().min(1, 'Nama wajib diisi').max(255),
  email: z.string().email('Email tidak valid').max(255).optional().nullable(),
  phone: z.string().max(20).optional().nullable(),
  photo: z.string().optional().nullable(),
  position: z.string().min(1, 'Jabatan wajib diisi'),
  education: z.string().max(255).optional().nullable(),
  status: z.enum(['ACTIVE', 'RETIRED', 'RESIGNED', 'TRANSFERRED']).default('ACTIVE'),
  joinDate: z.string().or(z.date()).optional().nullable(),
  orderPosition: z.number().default(0),
  isActive: z.boolean().default(true),
})

export const teacherUpdateSchema = teacherCreateSchema.partial()

// Major Validation Schema  
export const majorCreateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  code: z.string().max(50).optional().nullable(),
  description: z.string().optional().nullable(),
  headOfMajor: z.string().max(255).optional().nullable(),
  image: z.string().max(500).optional().nullable(),
  icon: z.string().max(500).optional().nullable(),
  detailType: z.enum(['PAGE', 'EXTERNAL']).default('PAGE'),
  externalUrl: z.string().max(500).optional().nullable(),
  orderPosition: z.number().default(0),
  isActive: z.boolean().default(true),
  competencies: z.array(z.object({
    id: z.number().optional(),
    name: z.string().min(1, 'Competency name is required'),
    description: z.string().optional().nullable(),
    detailType: z.enum(['PAGE', 'EXTERNAL']).default('PAGE'),
    externalUrl: z.string().max(500).optional().nullable(),
    isActive: z.boolean().default(true),
  })).optional(),
})

export const majorUpdateSchema = majorCreateSchema.partial()

// Facility Validation Schema
export const facilityCreateSchema = z.object({
  category: z.string().min(1, 'Category is required').max(100),
  name: z.string().min(1, 'Name is required').max(255),
  description: z.string().optional(),
  image: z.string().optional(),
  quantity: z.number().default(1),
  condition: z.enum(['baik', 'rusak', 'perlu_perbaikan']).default('baik'),
  orderPosition: z.number().default(0),
})

export const facilityUpdateSchema = facilityCreateSchema.partial()

// Achievement Validation Schema
export const achievementCreateSchema = z.object({
  studentName: z.string().min(1, 'Student name is required').max(255),
  class: z.string().optional(),
  achievementName: z.string().min(1, 'Achievement name is required').max(255),
  competitionName: z.string().optional(),
  level: z.enum(['sekolah', 'kecamatan', 'kabupaten', 'provinsi', 'nasional', 'internasional']),
  position: z.string().optional(),
  year: z.number().optional(),
  certificateImage: z.string().optional(),
  status: z.enum(['pending', 'approved', 'rejected']).default('pending'),
})

export const achievementUpdateSchema = achievementCreateSchema.partial()

// Agenda Validation Schema
export const agendaCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().optional(),
  eventDate: z.string().optional(), // Will be converted to Date
  eventTime: z.string().optional(), // Will be converted to Time
  location: z.string().optional(),
  organizer: z.string().optional(),
  image: z.string().optional(),
  status: z.enum(['upcoming', 'ongoing', 'completed', 'cancelled']).default('upcoming'),
})

export const agendaUpdateSchema = agendaCreateSchema.partial()

// Alumni Submission Validation Schema
export const alumniSubmissionCreateSchema = z.object({
  alumniName: z.string().min(1, 'Alumni name is required').max(255),
  graduationYear: z.number().optional(),
  major: z.string().optional(),
  currentOccupation: z.string().optional(),
  company: z.string().optional(),
  story: z.string().optional(),
  photo: z.string().optional(),
  nisn: z.string().optional(),
  diplomaPhoto: z.string().optional(),
  submittedById: z.number().optional(),
  status: z.enum(['pending', 'approved', 'rejected']).default('pending'),
})

export const alumniSubmissionUpdateSchema = alumniSubmissionCreateSchema.partial()

// Contact Message Validation Schema
export const contactMessageCreateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  email: z.string().email('Invalid email').max(255),
  subject: z.string().optional(),
  message: z.string().min(1, 'Message is required'),
  status: z.enum(['unread', 'read', 'replied']).default('unread'),
})

export const contactMessageUpdateSchema = contactMessageCreateSchema.partial()
