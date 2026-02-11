# Restrukturisasi Proyek - Checklist

## ✅ Yang Sudah Dikerjakan

### 1. Struktur Folder
- [x] Membuat folder `components/` di root level
- [x] Memindahkan komponen dari `app/components/` ke `components/`
- [x] Membuat folder route untuk setiap halaman

### 2. Route Pages yang Sudah Dibuat
- [x] `/about` - `app/about/page.tsx`
- [x] `/contact` - `app/contact/page.tsx`  
- [x] `/admissions` - `app/admissions/page.tsx`
- [x] `/news` - `app/news/page.tsx`

### 3. Komponen yang Sudah Dipindahkan
- [x] Navbar.tsx → `components/Navbar.tsx`
- [x] Footer.tsx → `components/Footer.tsx`
- [x] Hero.tsx → `components/Hero.tsx`
- [x] AboutSection.tsx → `components/AboutSection.tsx`
- [x] FeaturedPrograms.tsx → `components/FeaturedPrograms.tsx`
- [x] QuickStats.tsx → `components/QuickStats.tsx`
- [x] RecentNews.tsx → `components/RecentNews.tsx`
- [x] StudentLife.tsx → `components/StudentLife.tsx`
- [x] Testimonials.tsx → `components/Testimonials.tsx`
- [x] UpcomingEvents.tsx → `components/UpcomingEvents.tsx`

## ⏳ Yang Perlu Dilanjutkan

### 1. Install Dependencies
```bash
npm install lucide-react
```

### 2. Buat Route Tambahan
Dari folder `app/pages/`, buat route untuk:
- [ ] `/alumni` - `app/alumni/page.tsx`
- [ ] `/campus` - `app/campus/page.tsx`
- [ ] `/faculty` - `app/faculty/page.tsx`
- [ ] `/student-life` - `app/student-life/page.tsx`
- [ ] `/news/[id]` - `app/news/[id]/page.tsx` (dynamic route untuk detail news)

### 3. Perbaiki Homepage
- [ ] Update `app/page.tsx` untuk menggunakan komponen dari `components/`
- [ ] Tambahkan import yang benar:
  ```tsx
  import Navbar from '@/components/Navbar';
  import Hero from '@/components/Hero';
  import Footer from '@/components/Footer';
  ```

### 4. Bersihkan Folder Lama
**PENTING:** Hapus folder ini setelah semua migrasi selesai:
- [ ] Hapus `app/components/` (sudah dipindah ke root)
- [ ] Hapus `app/pages/` (sudah dikonversi ke routes)

### 5. Rapikan Folder Admin
Folder `app/admin/` masih berisi struktur yang aneh:
- [ ] Pindahkan `app/admin/public/` ke root `public/admin/`
- [ ] Rapikan struktur `app/admin/src/`
- [ ] Atau buat route sederhana `/admin` jika tidak diperlukan struktur kompleks

### 6. Update Layout & Metadata
- [ ] Update `app/layout.tsx` - tambahkan Navbar dan Footer global
- [ ] Update metadata untuk SEO
- [ ] Tambahkan Google Fonts jika perlu

### 7. Testing
- [ ] Test semua route: `/`, `/about`, `/contact`, `/admissions`, `/news`
- [ ] Test responsive design
- [ ] Test link navigasi
- [ ] Test build: `npm run build`

## 📋 Commands untuk Cleanup Manual

Setelah migrasi selesai, jalankan di PowerShell:

```powershell
# Hapus folder lama (HATI-HATI!)
Remove-Item -Path "d:\PROJEK PROJEK\website-sekolah-nextjs\app\components" -Recurse -Force
Remove-Item -Path "d:\PROJEK PROJEK\website-sekolah-nextjs\app\pages" -Recurse -Force

# Atau rename dulu untuk backup
Rename-Item -Path "d:\PROJEK PROJEK\website-sekolah-nextjs\app\components" -NewName "components.old"
Rename-Item -Path "d:\PROJEK PROJEK\website-sekolah-nextjs\app\pages" -NewName "pages.old"
```

## 🎯 Prioritas

1. **URGENT** - Install `lucide-react`
2. **HIGH** - Update homepage `app/page.tsx`
3. **MEDIUM** - Buat route untuk halaman lainnya
4. **LOW** - Cleanup folder lama
5. **OPTIONAL** - Rapikan admin section
