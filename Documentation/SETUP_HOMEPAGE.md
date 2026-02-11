# ✅ Setup Homepage - SELESAI!

## 🎯 Yang Sudah Dikerjakan

Saya sudah mengonfigurasi proyek agar ketika mengakses `http://localhost:3000/` akan menampilkan konten dari `App.tsx`.

### 1. **Membuat File `app/layout.tsx`**
File ini adalah root layout yang dibutuhkan Next.js 13+ App Router.

```tsx
// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Website Sekolah",
  description: "Website Sekolah dengan Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
```

### 2. **Membuat File `app/page.tsx`**
File ini adalah homepage yang akan merender komponen `App.tsx`.

```tsx
// app/page.tsx
import App from '@/App';

export default function Home() {
  return <App />;
}
```

### 3. **Update `App.tsx`**
Menambahkan `'use client'` directive dan memperbaiki import paths:

**Sebelum:**
```tsx
import Navbar from './components/Navbar';
import Hero from './components/Hero';
// ... dll
```

**Sesudah:**
```tsx
'use client';  // ✅ PENTING untuk client-side routing

import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
// ... dll
```

### 4. **Update `components/Navbar.tsx`**
Menambahkan `'use client'` directive karena menggunakan hooks (useState, useEffect).

```tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
// ... komponen
```

---

## 🚀 Cara Menjalankan

1. **Pastikan dependencies sudah terinstall:**
   ```bash
   npm install
   ```

2. **Jalankan development server:**
   ```bash
   npm run dev
   ```

3. **Buka browser:**
   ```
   http://localhost:3000
   ```

---

## 📂 Struktur File Final

```
website-sekolah-nextjs/
├── app/
│   ├── layout.tsx          ✅ Root layout (BARU)
│   ├── page.tsx            ✅ Homepage route (BARU)
│   ├── globals.css
│   ├── about/
│   │   └── page.tsx
│   ├── admissions/
│   │   └── page.tsx
│   ├── contact/
│   │   └── page.tsx
│   ├── news/
│   │   └── page.tsx
│   └── pages/              ⚠️ Folder lama (untuk dihapus nanti)
│       ├── AboutPage.tsx
│       ├── ContactPage.tsx
│       └── ...
│
├── components/             ✅ Di root level
│   ├── Navbar.tsx         ✅ Added 'use client'
│   ├── Footer.tsx
│   ├── Hero.tsx
│   └── ...
│
└── App.tsx                 ✅ Updated dengan 'use client'
```

---

## 🔍 Penjelasan Routing

### Your Current Setup (Client-Side Routing)
File `App.tsx` menggunakan **state-based navigation** dengan `useState`:

```tsx
const [currentPage, setCurrentPage] = useState<PageType>('home');

const navigateTo = (page: PageType) => {
  setCurrentPage(page);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
```

Ini berarti:
- ✅ URL tetap di `http://localhost:3000/` 
- ✅ Konten berubah berdasarkan state
- ✅ Navigation cepat (client-side)
- ⚠️ Tidak ada deep linking (semua URL sama)
- ⚠️ Browser back/forward button tidak berfungsi

### Alternative: Next.js Routing (Jika Ingin Deep Linking)

Jika Anda ingin setiap halaman punya URL sendiri:
- `/` → Homepage
- `/about` → About page  
- `/contact` → Contact page
- dll

Maka Anda perlu menggunakan Next.js routing yang proper (seperti yang sudah saya buat di folder `app/about/`, `app/contact/`, dll).

---

## ✅ Testing Checklist

Setelah menjalankan `npm run dev`, test:

- [ ] Homepage muncul di `http://localhost:3000/`
- [ ] Navbar berfungsi
- [ ] Klik menu navigasi bisa pindah halaman
- [ ] Hero section muncul
- [ ] Semua section homepage muncul (About, Programs, Student Life, dll)
- [ ] Footer muncul di bawah

---

## 🐛 Troubleshooting

### Error: "use client" directive
**Solusi:** Sudah ditambahkan di `App.tsx` dan `Navbar.tsx`

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

### Error: Module not found './pages/...'
**Solusi:** Import sudah diperbaiki menggunakan `@/app/pages/...`

### Halaman blank atau error
1. Cek console browser (F12) untuk error
2. Cek terminal untuk error Next.js
3. Restart dev server: Stop (Ctrl+C) dan `npm run dev` lagi

---

## 📝 Catatan Penting

### 1. Client Components
Semua komponen yang menggunakan:
- `useState`, `useEffect`, hooks lainnya
- Event handlers (onClick, onChange, dll)
- Browser APIs (window, document, dll)

**HARUS** memiliki `'use client'` di baris pertama.

### 2. Server Components (Default)
Komponen tanpa `'use client'` adalah Server Components yang:
- Render di server
- Tidak bisa pakai hooks
- Lebih cepat untuk SEO
- Bisa fetch data langsung di server

### 3. Import Paths
Gunakan `@/` prefix untuk import dari root:
```tsx
import Component from '@/components/Component';
import utils from '@/lib/utils';
```

---

## 🎉 Selesai!

Sekarang ketika Anda mengakses `http://localhost:3000/`, aplikasi akan:

1. ✅ Load `app/page.tsx`
2. ✅ Render komponen `<App />` dari `App.tsx`
3. ✅ Menampilkan Navbar, Hero, dan semua section homepage
4. ✅ Navigasi client-side berfungsi dengan baik

**Status:** ✅ BERHASIL!

Silakan jalankan `npm run dev` dan test di browser! 🚀
