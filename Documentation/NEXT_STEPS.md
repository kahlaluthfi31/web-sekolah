# 🚀 Langkah Selanjutnya - Action Items

## 📋 Yang Harus Dilakukan Sekarang

### 1️⃣ PRIORITAS TINGGI: Install Dependencies

Buka terminal dan jalankan:

```powershell
npm install lucide-react
```

Package ini diperlukan untuk icon components di semua halaman.

---

### 2️⃣ Verifikasi Struktur Baru

Periksa apakah file sudah ada di lokasi yang benar:

**Cek Components (di root):**
```powershell
ls components\
```

Harus menampilkan:
- ✅ Navbar.tsx
- ✅ Footer.tsx
- ✅ Hero.tsx
- ✅ AboutSection.tsx
- ✅ FeaturedPrograms.tsx
- ✅ QuickStats.tsx
- ✅ RecentNews.tsx
- ✅ StudentLife.tsx
- ✅ Testimonials.tsx
- ✅ UpcomingEvents.tsx

**Cek Routes (di app/):**
```powershell
ls app\
```

Harus ada folder:
- ✅ about/
- ✅ admissions/
- ✅ contact/
- ✅ news/

---

### 3️⃣ Hapus Folder Lama (PENTING!)

Setelah yakin semua sudah berjalan dengan baik, hapus folder lama:

```powershell
# Backup dulu (opsional, untuk keamanan)
Rename-Item -Path "app\components" -NewName "components.backup"
Rename-Item -Path "app\pages" -NewName "pages.backup"

# Atau langsung hapus (HATI-HATI!)
Remove-Item -Path "app\components" -Recurse -Force
Remove-Item -Path "app\pages" -Recurse -Force
```

---

### 4️⃣ Update Homepage

Edit file `app/page.tsx` untuk menggunakan komponen yang sudah dipindahkan:

```tsx
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import AboutSection from '@/components/AboutSection';
import FeaturedPrograms from '@/components/FeaturedPrograms';
import QuickStats from '@/components/QuickStats';
import RecentNews from '@/components/RecentNews';
import StudentLife from '@/components/StudentLife';
import Testimonials from '@/components/Testimonials';
import UpcomingEvents from '@/components/UpcomingEvents';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <AboutSection />
      <FeaturedPrograms />
      <QuickStats />
      <RecentNews />
      <StudentLife />
      <Testimonials />
      <UpcomingEvents />
      <Footer />
    </>
  );
}
```

---

### 5️⃣ Buat Routes yang Masih Kurang

Buat file-file page yang masih tersisa dari `app/pages/`:

**Alumni Page:**
```powershell
mkdir app\alumni
# Lalu buat app/alumni/page.tsx
```

**Campus Page:**
```powershell
mkdir app\campus
# Lalu buat app/campus/page.tsx
```

**Faculty Page:**
```powershell
mkdir app\faculty
# Lalu buat app/faculty/page.tsx
```

**Student Life Page:**
```powershell
mkdir app\student-life
# Lalu buat app/student-life/page.tsx
```

**News Detail Page (Dynamic Route):**
```powershell
mkdir "app\news\[id]"
# Lalu buat app/news/[id]/page.tsx
```

---

### 6️⃣ Test Aplikasi

Jalankan development server:

```powershell
npm run dev
```

Lalu test semua route di browser:

- ✅ http://localhost:3000/ (Homepage)
- ✅ http://localhost:3000/about
- ✅ http://localhost:3000/admissions
- ✅ http://localhost:3000/contact
- ✅ http://localhost:3000/news

---

### 7️⃣ Fix Import di Komponen Lain

Jika ada komponen yang masih import dari lokasi lama, update menjadi:

**❌ Sebelum:**
```tsx
import Navbar from '../app/components/Navbar';
import Footer from './app/components/Footer';
```

**✅ Sesudah:**
```tsx
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
```

---

### 8️⃣ Update Layout Global (Optional)

Edit `app/layout.tsx` untuk menambahkan Navbar dan Footer di semua halaman:

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Website Sekolah",
  description: "Website Sekolah dengan Next.js 13+",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
```

---

### 9️⃣ Build & Test Production

Setelah semua berjalan baik di development:

```powershell
# Build untuk production
npm run build

# Test production build
npm start
```

---

### 🔟 Rapikan Admin Section (Optional)

Jika admin section tidak digunakan atau terlalu kompleks, pertimbangkan untuk:

1. **Opsi 1:** Bikin route sederhana `/admin`
   ```powershell
   # Buat app/admin/page.tsx sederhana
   ```

2. **Opsi 2:** Pisahkan sebagai proyek terpisah
   ```powershell
   # Pindahkan app/admin/ ke folder terpisah
   Move-Item -Path "app\admin" -Destination "..\admin-dashboard"
   ```

---

## ✅ Checklist Akhir

Sebelum commit ke Git, pastikan:

- [ ] `npm install lucide-react` sudah dijalankan
- [ ] Semua route baru berfungsi dengan baik
- [ ] Folder lama `app/components/` dan `app/pages/` sudah dihapus
- [ ] Import di semua file sudah menggunakan `@/components/`
- [ ] Navbar dan Footer muncul di semua halaman
- [ ] `npm run build` berhasil tanpa error
- [ ] Responsive design berfungsi dengan baik

---

## 📞 Jika Ada Masalah

### Error: Cannot find module 'lucide-react'
**Solusi:** `npm install lucide-react`

### Error: Cannot find module '@/components/...'
**Solusi:** Pastikan `tsconfig.json` punya:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Error: Page not found
**Solusi:** Pastikan nama folder dan file sesuai:
- Folder route: lowercase, gunakan `-` untuk spasi
- File page: harus bernama `page.tsx`

### Warning tentang `<img>` tag
**Solusi:** Ganti dengan `next/image`:
```tsx
import Image from 'next/image';

<Image 
  src="/path/to/image.jpg" 
  alt="Description"
  width={800}
  height={600}
/>
```

---

## 🎉 Selamat!

Setelah semua langkah di atas selesai, struktur proyek Next.js Anda sudah mengikuti best practices dan siap untuk development lebih lanjut!

**Dokumentasi Lengkap:**
- 📖 `MIGRATION_GUIDE.md` - Panduan lengkap migrasi
- 📊 `STRUKTUR_COMPARISON.md` - Perbandingan struktur lama vs baru
- ✅ `CHECKLIST.md` - Checklist lengkap
- 🚀 `NEXT_STEPS.md` - File ini

**Happy Coding! 🚀**
