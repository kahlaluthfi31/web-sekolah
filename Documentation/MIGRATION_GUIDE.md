# 🎓 Website Sekolah - Next.js 13+ (App Router)

## 📋 Struktur Proyek yang Benar

Proyek ini telah direstrukturisasi mengikuti **Next.js 13+ App Router** best practices.

### ✅ Struktur Baru (Sudah Diperbaiki)

```
website-sekolah-nextjs/
├── app/                           # App Router (Next.js 13+)
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Homepage (/)
│   ├── globals.css               # Global styles
│   ├── about/                    # Route: /about
│   │   └── page.tsx
│   ├── admissions/               # Route: /admissions
│   │   └── page.tsx
│   ├── contact/                  # Route: /contact
│   │   └── page.tsx
│   ├── news/                     # Route: /news
│   │   └── page.tsx
│   └── admin/                    # Route: /admin (belum dimigrasi)
│       └── ...
├── components/                    # ✅ Komponen reusable (ROOT LEVEL)
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── AboutSection.tsx
│   └── ...
├── public/                        # Static assets
│   ├── images/
│   └── ...
├── next.config.ts                # Next.js config
├── tsconfig.json                 # TypeScript config
└── package.json                  # Dependencies
```

### ❌ Masalah yang Sudah Diperbaiki

1. **Folder `app/components/`** → Dipindahkan ke **`components/`** (root level)
2. **Folder `app/pages/`** → Dikonversi ke proper routes:
   - `app/pages/AboutPage.tsx` → `app/about/page.tsx`
   - `app/pages/ContactPage.tsx` → `app/contact/page.tsx`
   - `app/pages/AdmissionsPage.tsx` → `app/admissions/page.tsx`
   - `app/pages/NewsPage.tsx` → `app/news/page.tsx`

### 📦 Dependencies yang Perlu Diinstall

Jalankan command ini untuk install dependencies yang diperlukan:

\`\`\`bash
npm install lucide-react
\`\`\`

### 🚀 Cara Menjalankan Proyek

1. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Jalankan development server:**
   \`\`\`bash
   npm run dev
   \`\`\`

3. **Buka browser:**
   \`\`\`
   http://localhost:3000
   \`\`\`

### 🔗 Routes yang Tersedia

| URL | File | Deskripsi |
|-----|------|-----------|
| `/` | `app/page.tsx` | Homepage |
| `/about` | `app/about/page.tsx` | Halaman About |
| `/admissions` | `app/admissions/page.tsx` | Halaman Admissions |
| `/contact` | `app/contact/page.tsx` | Halaman Contact |
| `/news` | `app/news/page.tsx` | Halaman News |

### 📝 Catatan Penting

#### 1. Server Components vs Client Components
- **Default**: Semua komponen di App Router adalah **Server Components**
- **Client Components**: Gunakan `'use client'` di awal file jika butuh:
  - Event handlers (onClick, onChange, dll)
  - React Hooks (useState, useEffect, dll)
  - Browser APIs

#### 2. Import Components
Setelah restrukturisasi, import components dari root:
\`\`\`tsx
// ✅ Benar
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// ❌ Salah
import Navbar from '@/app/components/Navbar';
\`\`\`

#### 3. Image Optimization
Gunakan `next/image` untuk optimasi gambar:
\`\`\`tsx
import Image from 'next/image';

<Image 
  src="/images/hero.jpg" 
  alt="Hero" 
  width={800} 
  height={600}
/>
\`\`\`

### 🗂️ Folder yang Perlu Dihapus (Manual)

Setelah migrasi selesai, hapus folder berikut:
- ❌ `app/components/` (sudah dipindah ke `components/`)
- ❌ `app/pages/` (sudah dikonversi ke routes)

### 📚 Dokumentasi Next.js

- [App Router Documentation](https://nextjs.org/docs/app)
- [Routing](https://nextjs.org/docs/app/building-your-application/routing)
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)

### 🔧 Troubleshooting

#### Error: Cannot find module 'lucide-react'
\`\`\`bash
npm install lucide-react
\`\`\`

#### Error: Module not found
Pastikan path import menggunakan `@/`:
\`\`\`tsx
import Component from '@/components/Component';
\`\`\`

---

**Status Migrasi:** ✅ Struktur sudah diperbaiki  
**TODO:** Install dependencies dan hapus folder lama secara manual
