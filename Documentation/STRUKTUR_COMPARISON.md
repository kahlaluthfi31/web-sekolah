# 📊 Perbandingan Struktur: Sebelum vs Sesudah

## ❌ STRUKTUR SEBELUM (SALAH)

```
website-sekolah-nextjs/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   │
│   ├── components/           ❌ SALAH! Komponen di dalam app/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   └── ...
│   │
│   ├── pages/                ❌ SALAH! Bukan route, tapi folder biasa
│   │   ├── AboutPage.tsx     ❌ Harusnya di app/about/page.tsx
│   │   ├── ContactPage.tsx   ❌ Harusnya di app/contact/page.tsx
│   │   └── ...
│   │
│   └── admin/                ❌ Struktur aneh
│       ├── public/           ❌ Public di dalam app?
│       ├── src/              ❌ Src di dalam app?
│       └── styles/
│
└── public/
    └── images/
```

### Masalah:
1. ❌ Komponen ada di `app/components/` → harusnya di root `components/`
2. ❌ Ada folder `app/pages/` → ini bukan Next.js Pages Router!
3. ❌ File `AboutPage.tsx` bukan route → harusnya `app/about/page.tsx`
4. ❌ Struktur admin campur aduk dengan proyek terpisah

---

## ✅ STRUKTUR SESUDAH (BENAR)

```
website-sekolah-nextjs/
├── app/                       ✅ App Router (Next.js 13+)
│   ├── layout.tsx            ✅ Root layout
│   ├── page.tsx              ✅ Homepage route: /
│   ├── globals.css           ✅ Global styles
│   │
│   ├── about/                ✅ Route: /about
│   │   └── page.tsx          ✅ Halaman About
│   │
│   ├── admissions/           ✅ Route: /admissions
│   │   └── page.tsx          ✅ Halaman Admissions
│   │
│   ├── contact/              ✅ Route: /contact
│   │   └── page.tsx          ✅ Halaman Contact
│   │
│   ├── news/                 ✅ Route: /news
│   │   ├── page.tsx          ✅ List news
│   │   └── [id]/             ✅ Dynamic route: /news/123
│   │       └── page.tsx      ✅ Detail news
│   │
│   └── admin/                ✅ Route: /admin
│       └── page.tsx          ✅ Admin dashboard
│
├── components/               ✅ Di ROOT, bukan di app/
│   ├── Navbar.tsx           ✅ Komponen global
│   ├── Footer.tsx           ✅ Komponen global
│   ├── Hero.tsx
│   ├── AboutSection.tsx
│   └── ...
│
├── lib/                      ✅ Optional: utility functions
│   └── utils.ts
│
├── types/                    ✅ Optional: TypeScript types
│   └── index.ts
│
└── public/                   ✅ Static assets
    ├── images/
    ├── fonts/
    └── ...
```

---

## 🔄 Perubahan File

### Pages yang Dikonversi ke Routes:

| ❌ File Lama | ✅ Route Baru | URL |
|-------------|--------------|-----|
| `app/pages/AboutPage.tsx` | `app/about/page.tsx` | `/about` |
| `app/pages/ContactPage.tsx` | `app/contact/page.tsx` | `/contact` |
| `app/pages/AdmissionsPage.tsx` | `app/admissions/page.tsx` | `/admissions` |
| `app/pages/NewsPage.tsx` | `app/news/page.tsx` | `/news` |
| `app/pages/NewsDetailsPage.tsx` | `app/news/[id]/page.tsx` | `/news/123` |
| `app/pages/AlumniPage.tsx` | `app/alumni/page.tsx` | `/alumni` |
| `app/pages/CampusPage.tsx` | `app/campus/page.tsx` | `/campus` |
| `app/pages/FacultyPage.tsx` | `app/faculty/page.tsx` | `/faculty` |
| `app/pages/StudentLifePage.tsx` | `app/student-life/page.tsx` | `/student-life` |

### Components yang Dipindahkan:

| ❌ Lokasi Lama | ✅ Lokasi Baru |
|---------------|---------------|
| `app/components/Navbar.tsx` | `components/Navbar.tsx` |
| `app/components/Footer.tsx` | `components/Footer.tsx` |
| `app/components/Hero.tsx` | `components/Hero.tsx` |
| `app/components/AboutSection.tsx` | `components/AboutSection.tsx` |
| `app/components/*` | `components/*` |

---

## 📝 Cara Import yang Benar

### ❌ Import Lama (SALAH)
```tsx
import Navbar from './app/components/Navbar';
import Footer from '../app/components/Footer';
```

### ✅ Import Baru (BENAR)
```tsx
// Gunakan alias @/ yang otomatis mengarah ke root
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
```

---

## 🎯 Kesimpulan

### Struktur Lama (Masalah):
- ❌ Tidak mengikuti konvensi Next.js 13+ App Router
- ❌ Komponen di tempat yang salah
- ❌ Routing tidak proper (pakai folder `pages/` di dalam `app/`)
- ❌ Susah di-maintain

### Struktur Baru (Solusi):
- ✅ Mengikuti Next.js 13+ App Router best practices
- ✅ Komponen di root level, mudah diakses
- ✅ Routing proper dengan folder structure
- ✅ Mudah di-maintain dan dikembangkan
- ✅ SEO-friendly dengan file-based routing

---

## 📚 Resources

- [Next.js 13+ App Router Docs](https://nextjs.org/docs/app)
- [Project Structure Best Practices](https://nextjs.org/docs/app/building-your-application/routing/defining-routes)
- [Server Components vs Client Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
