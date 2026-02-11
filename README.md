# Website Sekolah - Next.js

Website sekolah modern yang dibangun dengan **Next.js 13+**, **React**, **TypeScript**, dan **Tailwind CSS**.

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.2.3-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC?logo=tailwind-css)

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Features](#features)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Sebelum memulai, pastikan Anda sudah menginstall:

- **Node.js** versi 18.x atau lebih baru ([Download](https://nodejs.org/))
- **npm** atau **yarn** atau **pnpm** (package manager)
- **Git** ([Download](https://git-scm.com/))

### Cek Versi yang Terinstall

```bash
node --version   # Harus v18.x atau lebih
npm --version    # Harus v9.x atau lebih
```

---

## Installation

### 1. Clone Repository

```bash
git clone <repository-url>
cd website-sekolah-nextjs
```

### 2. Install Dependencies

```bash
npm install
```

Atau menggunakan yarn:
```bash
yarn install
```

Atau menggunakan pnpm:
```bash
pnpm install
```

### 3. Verifikasi Instalasi

Pastikan semua dependencies berhasil terinstall:

```bash
npm list --depth=0
```

Anda harus melihat:
- `next@16.1.6`
- `react@19.2.3`
- `react-dom@19.2.3`
- `lucide-react` (untuk icons)
- `tailwindcss@4.x`
- `typescript@5.x`

---

## Running the Project

### Development Mode

Jalankan development server dengan hot-reload:

```bash
npm run dev
```

Aplikasi akan berjalan di:
```
http://localhost:3000
```

### Production Build

Build aplikasi untuk production:

```bash
npm run build
```

Jalankan production build:

```bash
npm start
```

### Lint Code

Check kode untuk errors dan warnings:

```bash
npm run lint
```

---

## Project Structure

```
website-sekolah-nextjs/
│
├── app/                          # Next.js 13+ App Router
│   ├── layout.tsx               # Root layout (HTML wrapper)
│   ├── page.tsx                 # Homepage (/)
│   ├── globals.css              # Global styles
│   │
│   ├── about/                   # Route: /about
│   │   └── page.tsx
│   ├── admissions/              # Route: /admissions
│   │   └── page.tsx
│   ├── contact/                 # Route: /contact
│   │   └── page.tsx
│   └── news/                    # Route: /news
│       └── page.tsx
│
├── components/                   # Reusable React Components
│   ├── Navbar.tsx               # Navigation bar
│   ├── Footer.tsx               # Footer
│   ├── Hero.tsx                 # Hero section
│   ├── AboutSection.tsx
│   ├── FeaturedPrograms.tsx
│   ├── QuickStats.tsx
│   ├── RecentNews.tsx
│   ├── StudentLife.tsx
│   ├── Testimonials.tsx
│   └── UpcomingEvents.tsx
│
├── public/                       # Static assets
│   └── images/                  # Images
│
├── App.tsx                       # Main App component
│
├── next.config.ts               # Next.js configuration
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── postcss.config.mjs           # PostCSS configuration
└── package.json                 # Dependencies & scripts
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Menjalankan development server di http://localhost:3000 |
| `npm run build` | Build aplikasi untuk production |
| `npm start` | Menjalankan production server |
| `npm run lint` | Menjalankan ESLint untuk check code quality |

---

## Features

### Homepage
- Hero section dengan call-to-action
- Quick statistics
- About section
- Featured programs
- Student life showcase
- Testimonials
- Recent news
- Upcoming events

### Pages
- **About** - Informasi tentang sekolah, visi, misi, leadership
- **Admissions** - Proses pendaftaran, requirements, key dates
- **Contact** - Form kontak dan informasi kontak
- **News** - Berita dan artikel terbaru

### Design Features
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Modern UI dengan Tailwind CSS
- ✅ Smooth animations dan transitions
- ✅ Client-side routing untuk navigasi cepat
- ✅ SEO optimized

---

## Troubleshooting

### Issue: Module not found

**Error:**
```
Error: Cannot find module 'lucide-react'
```

**Solution:**
```bash
npm install lucide-react
```

---

### Issue: Port sudah digunakan

**Error:**
```
Port 3000 is already in use
```

**Solution:**

**Windows (PowerShell):**
```powershell
# Cari process yang menggunakan port 3000
netstat -ano | findstr :3000

# Kill process (ganti PID dengan nomor yang muncul)
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
# Cari dan kill process
lsof -ti:3000 | xargs kill -9
```

Atau jalankan di port lain:
```bash
npm run dev -- -p 3001
```

---

### Issue: Build error

**Solution:**

1. Hapus folder `.next` dan `node_modules`:
   ```bash
   rm -rf .next node_modules
   npm install
   npm run build
   ```

2. Restart development server

---

### Issue: Styles tidak muncul

**Solution:**

Restart development server:
```bash
# Stop server (Ctrl + C)
npm run dev
```

---

## Documentation Links

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Lucide Icons](https://lucide.dev/icons/)

---

## Additional Documentation

Project ini memiliki dokumentasi tambahan:

-  `MIGRATION_GUIDE.md` - Panduan migrasi struktur project
-  `STRUKTUR_COMPARISON.md` - Perbandingan struktur lama vs baru
-  `NEXT_STEPS.md` - Langkah-langkah development
-  `SETUP_HOMEPAGE.md` - Setup homepage configuration

---

## Quick Start Summary

```bash
# 1. Clone repository
git clone <repository-url>
cd website-sekolah-nextjs

# 2. Install dependencies
npm install

# 3. Run development server
npm run dev

# 4. Open browser
# Navigate to http://localhost:3000
```

**That's it! Selamat coding!**

---

Made with using Next.js, React, and Tailwind CSS
