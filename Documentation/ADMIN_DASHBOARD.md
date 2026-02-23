# Admin Dashboard Setup Guide

## 📋 Overview

Dashboard admin telah dibuat dengan struktur App Router Next.js yang modern, mengintegrasikan API backend yang sudah ada dengan UI yang user-friendly.

## 🎯 Fitur Yang Sudah Dibuat

### 1. **Dashboard Utama** (`/admin`)
- Menu navigasi lengkap untuk semua modul
- Statistics cards (Total Berita, Guru, Prestasi, Alumni)
- Grid menu dengan ikon untuk akses cepat

### 2. **Kelola Berita** (`/admin/news`)
✅ **Fitur:**
- Tampilan tabel dengan data dari API
- Filtering (Kategori, Status)
- Search (Judul, Konten)
- Pagination
- Create, Edit, Delete (CRUD lengkap)
- Menampilkan: Thumbnail, Tags, View Count, Author
- Status badges (Published, Draft, Archived)

**Files:**
- `app/admin/news/page.tsx` - List & filter berita
- `app/admin/news/create/page.tsx` - Form tambah berita
- `app/admin/news/[id]/edit/page.tsx` - Form edit berita

### 3. **Kelola Guru & Staff** (`/admin/teachers`)
✅ **Fitur:**
- Tampilan tabel dengan foto profil
- Filtering berdasarkan status
- Search (Nama, NIP, Mata Pelajaran)
- Pagination
- Create, Edit, Delete (CRUD lengkap)
- Menampilkan: Foto, NIP, Email, Phone, Subjects, Education

**Files:**
- `app/admin/teachers/page.tsx` - List & filter guru

## 🚀 Cara Menjalankan

1. **Start Development Server:**
```bash
npm run dev
```

2. **Akses Admin Dashboard:**
```
http://localhost:3000/admin
```

3. **Akses Masing-masing Modul:**
- Berita: `http://localhost:3000/admin/news`
- Guru: `http://localhost:3000/admin/teachers`

## 📊 API Integration

Dashboard sudah terkoneksi dengan API yang ada:

### News API
- **GET** `/api/news` - List berita dengan pagination & filtering
- **POST** `/api/news` - Tambah berita baru
- **GET** `/api/news/[id]` - Detail berita
- **PUT** `/api/news/[id]` - Update berita
- **DELETE** `/api/news/[id]` - Hapus berita

### Teachers API
- **GET** `/api/teachers` - List guru dengan pagination & filtering
- **POST** `/api/teachers` - Tambah guru baru
- **GET** `/api/teachers/[id]` - Detail guru
- **PUT** `/api/teachers/[id]` - Update guru
- **DELETE** `/api/teachers/[id]` - Hapus guru

## 🎨 Design System

### Colors:
- **Primary (Blue):** Berita, Dashboard
- **Success (Green):** Guru & Staff
- **Warning (Yellow):** Prestasi
- **Purple:** Jurusan
- **Orange:** Fasilitas
- **Red:** Agenda
- **Indigo:** Alumni
- **Pink:** Users
- **Teal:** Pesan Kontak

### Components:
- **Buttons:** Rounded-lg dengan transition
- **Cards:** Shadow-sm dengan border
- **Tables:** Striped rows dengan hover effect
- **Forms:** Focus ring pada input
- **Badges:** Rounded-full untuk status

## 📝 TODO: Modul Yang Perlu Dibuat

Berikut modul yang sudah tersedia di menu tapi belum diimplementasi:

### 1. **Jurusan (Majors)** - `/admin/majors`
- [ ] List jurusan dengan kompetensi
- [ ] CRUD jurusan
- [ ] Kelola kompetensi keahlian per jurusan

### 2. **Fasilitas (Facilities)** - `/admin/facilities`
- [ ] List fasilitas
- [ ] CRUD fasilitas dengan foto
- [ ] Filter berdasarkan tipe fasilitas

### 3. **Prestasi (Achievements)** - `/admin/achievements`
- [ ] List prestasi siswa
- [ ] CRUD prestasi
- [ ] Filter berdasarkan tingkat (Internasional, Nasional, Regional)

### 4. **Agenda** - `/admin/agendas`
- [ ] List agenda & kegiatan
- [ ] CRUD agenda
- [ ] Calendar view
- [ ] Filter berdasarkan bulan

### 5. **Alumni** - `/admin/alumni`
- [ ] List alumni
- [ ] CRUD alumni
- [ ] Filter berdasarkan angkatan & jurusan

### 6. **Users** - `/admin/users`
- [ ] List users sistem
- [ ] CRUD users
- [ ] Role management (Admin, Editor, Viewer)

### 7. **Pesan Kontak** - `/admin/messages`
- [ ] List pesan dari form kontak
- [ ] Mark as read/unread
- [ ] Reply via email

### 8. **Pengaturan** - `/admin/settings`
- [ ] Contact info sekolah
- [ ] Social media links
- [ ] Site settings

### 9. **Ekstrakurikuler** - `/admin/extracurriculars`
- [ ] List ekstrakurikuler
- [ ] CRUD ekstrakurikuler

## 🔨 Cara Membuat Modul Baru

Ikuti pattern yang sudah ada untuk consistency:

### 1. List Page (`/admin/[module]/page.tsx`)
```tsx
'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Plus, Edit, Trash2, Search, ArrowLeft } from 'lucide-react'

export default function ModulePage() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchData = useCallback(async () => {
    // Fetch from API
  }, [searchTerm, currentPage])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleDelete = async (id: number) => {
    // Delete logic
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header dengan tombol back & create */}
      {/* Filters section */}
      {/* Table dengan data */}
      {/* Pagination */}
    </div>
  )
}
```

### 2. Create Page (`/admin/[module]/create/page.tsx`)
```tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'

export default function CreateModulePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    // fields
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // POST to API
    router.push('/admin/[module]')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Form dengan validasi */}
    </div>
  )
}
```

### 3. Edit Page (`/admin/[module]/[id]/edit/page.tsx`)
```tsx
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Loader } from 'lucide-react'

export default function EditModulePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({})

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchData = async () => {
    // GET from API
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // PUT to API
    router.push('/admin/[module]')
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Form dengan data existing */}
    </div>
  )
}
```

## 🎯 Best Practices

### 1. **Naming Convention:**
- File: `kebab-case` (e.g., `news-management.tsx`)
- Component: `PascalCase` (e.g., `NewsManagementPage`)
- Function: `camelCase` (e.g., `fetchNews`)

### 2. **API Calls:**
- Gunakan `useCallback` untuk fetch functions
- Handle loading & error states
- Show user-friendly messages

### 3. **Styling:**
- Gunakan Tailwind CSS classes
- Follow design system yang ada
- Responsive: mobile-first approach

### 4. **User Experience:**
- Confirmation dialog untuk delete
- Success/error notifications
- Loading indicators
- Disable buttons saat loading

## 🔐 Authentication (TODO)

Saat ini dashboard belum ada authentication. Untuk production:

1. **Setup NextAuth:**
```bash
npm install next-auth
```

2. **Protect Routes:**
```tsx
// middleware.ts
export { default } from "next-auth/middleware"

export const config = {
  matcher: ["/admin/:path*"]
}
```

3. **Login Page:**
- Create `/app/admin/login/page.tsx`
- Redirect unauthenticated users

## 📦 Dependencies Used

```json
{
  "lucide-react": "Icons",
  "next": "^15",
  "react": "^19",
  "tailwindcss": "^4"
}
```

## 🐛 Troubleshooting

### Issue: API not responding
**Solution:** Pastikan dev server berjalan dan database terkoneksi

### Issue: Data tidak muncul
**Solution:** Check console untuk error, verify API endpoint

### Issue: Tailwind classes tidak apply
**Solution:** Restart dev server

## 📞 Support

Jika ada pertanyaan atau butuh bantuan:
1. Check dokumentasi API: `Documentation/API_DOCUMENTATION.md`
2. Check database setup: `Documentation/DATABASE_SETUP.md`
3. Check quick start: `Documentation/QUICK_START.md`

---

**Status:** ✅ Dashboard core & 2 modules sudah siap
**Next Step:** Implementasi modul-modul lainnya sesuai TODO list
