# Website Sekolah - Next.js Full-Stack

Website sekolah modern dengan **Backend API + Admin Panel + Landing Page** dibangun dengan **Next.js 16**, **React 19**, **TypeScript**, **Tailwind CSS**, dan **Prisma ORM**.

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.2.3-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC?logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-7.4.0-2D3748?logo=prisma)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql)

---

## 🚀 Quick Start

**3 Langkah untuk mulai:**

```bash
# 1. Install dependencies
npm install

# 2. Setup database
npm run db:push

# 3. Seed data
npm run db:seed

# 4. Run dev server
npm run dev
```

📖 **Panduan lengkap:** Lihat [QUICK_START.md](./QUICK_START.md)

---

## ✨ Features

### 🎨 Landing Page (Public)
- ✅ Hero Section dengan animasi
- ✅ Profil Sekolah (Sejarah, Visi Misi)
- ✅ Program/Jurusan
- ✅ Berita & Pengumuman
- ✅ Prestasi Siswa
- ✅ Galeri Foto
- ✅ Kontak & Maps
- ✅ Responsive Design

### 🔐 Admin Panel
- ✅ Dashboard Analytics
- ✅ Manajemen Berita
- ✅ Manajemen Guru
- ✅ Manajemen Jurusan
- ✅ Manajemen Fasilitas
- ✅ Manajemen Prestasi
- ✅ Manajemen Alumni
- ✅ User Management
- ✅ Settings

### 🔌 Backend API (RESTful)
- ✅ **25+ Database Tables** (Prisma Schema)
- ✅ **CRUD Endpoints** untuk semua entities
- ✅ **Type-safe** dengan TypeScript
- ✅ **Validation** dengan Zod
- ✅ **Pagination** & Filtering
- ✅ **Error Handling**
- ✅ **API Documentation**

### 🗄️ Database
- ✅ MySQL dengan Prisma ORM
- ✅ Type-safe queries
- ✅ Auto-migration
- ✅ Seeder untuk sample data
- ✅ Prisma Studio (Database GUI)

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Running the Project](#running-the-project)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Available Scripts](#available-scripts)
- [Documentation](#documentation)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Sebelum memulai, pastikan sudah install:

- **Node.js** v18.x atau lebih baru ([Download](https://nodejs.org/))
- **MySQL** 8.0+ atau MariaDB ([Download](https://dev.mysql.com/downloads/))
- **npm** atau **yarn** atau **pnpm**
- **Git** ([Download](https://git-scm.com/))

### Cek Versi

```bash
node --version   # v18.x atau lebih
npm --version    # v9.x atau lebih
mysql --version  # v8.0 atau lebih
```

---

## Installation

### 1. Clone Repository

```bash
git clone https://github.com/kahlaluthfi31/web-sekolah.git
cd website-sekolah-nextjs
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Copy `.env.example` ke `.env`:

```bash
copy .env.example .env
```

Edit `.env` dan sesuaikan:

```env
DATABASE_URL="mysql://root:password@localhost:3306/sekolah_db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"
```

---

## Database Setup

### 1. Create Database

Buka MySQL dan buat database:

```sql
CREATE DATABASE sekolah_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Push Schema

```bash
npm run db:push
```

Ini akan membuat **25+ tables** otomatis:
- ✅ users
- ✅ news
- ✅ teachers
- ✅ majors
- ✅ facilities
- ✅ achievements
- ✅ agendas
- ✅ alumni
- ✅ contact_messages
- ✅ dan 15+ table lainnya

### 3. Seed Sample Data

```bash
npm run db:seed
```

Akan create:
- Super Admin (admin@sekolah.com / admin123)
- 2 sample news
- 2 sample teachers
- 2 majors (TKJ, RPL)
- Facilities, achievements, agenda, contact info

### 4. Open Prisma Studio (Optional)

Lihat database dengan GUI:

```bash
npm run db:studio
```

Browser akan terbuka di `http://localhost:5555`

**Dokumentasi lengkap:** [DATABASE_SETUP.md](./DATABASE_SETUP.md)

---

## Running the Project

### Development Mode

```bash
npm run dev
```

Buka browser: `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

---

## Project Structure

```
website-sekolah-nextjs/
├── app/
│   ├── api/                      # 🔌 Backend API Routes
│   │   ├── news/                 # News CRUD endpoints
│   │   │   ├── route.ts          # GET, POST /api/news
│   │   │   └── [id]/route.ts     # GET, PUT, DELETE /api/news/[id]
│   │   ├── teachers/             # Teachers CRUD endpoints
│   │   └── ... (more endpoints)
│   │
│   ├── admin/                    # 🔐 Admin Panel (Template)
│   │   ├── public/               # Admin assets
│   │   └── src/                  # Admin source code
│   │
│   ├── components/               # Page-specific components
│   ├── pages/                    # Page containers
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Homepage
│   └── globals.css               # Global styles
│
├── components/                   # 🎨 Reusable Components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   └── ... (more components)
│
├── lib/                          # 🛠️ Utilities & Helpers
│   ├── prisma.ts                 # Prisma Client
│   ├── api-response.ts           # API Response helpers
│   └── validations.ts            # Zod validation schemas
│
├── prisma/                       # 🗄️ Database
│   ├── schema.prisma             # Database schema (25+ tables)
│   └── seed.ts                   # Database seeder
│
├── public/                       # Static files
│   └── images/
│
├── Documentation/                # 📚 Documentation files
├── .env                          # Environment variables
├── .env.example                  # Example env file
├── prisma.config.ts              # Prisma configuration
├── tsconfig.json                 # TypeScript config
├── tailwind.config.js            # Tailwind config
├── next.config.ts                # Next.js config
└── package.json                  # Dependencies & scripts
```

---

## API Endpoints

### ✅ Available Now

#### News API
```
GET    /api/news           # Get all news (with pagination, filters)
GET    /api/news/[id]      # Get single news
POST   /api/news           # Create news
PUT    /api/news/[id]      # Update news
DELETE /api/news/[id]      # Delete news
```

#### Teachers API
```
GET    /api/teachers       # Get all teachers
GET    /api/teachers/[id]  # Get single teacher
POST   /api/teachers       # Create teacher
PUT    /api/teachers/[id]  # Update teacher
DELETE /api/teachers/[id]  # Delete teacher
```

### 🔄 Coming Soon (Same Pattern)
- Majors API
- Facilities API
- Achievements API
- Agendas API
- Users API
- Alumni API
- Contact Messages API

**Full API Documentation:** [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

---

## Available Scripts

### Development
```bash
npm run dev              # Run dev server
npm run build            # Build production
npm run start            # Start production server
npm run lint             # Run ESLint
```

### Database
```bash
npm run db:generate      # Generate Prisma Client
npm run db:push          # Push schema to database
npm run db:migrate       # Create migration
npm run db:seed          # Seed database
npm run db:studio        # Open Prisma Studio GUI
```

---

## Documentation

Dokumentasi lengkap tersedia di folder root:

- 📖 **[QUICK_START.md](./QUICK_START.md)** - Panduan cepat 3 langkah
- 📖 **[DATABASE_SETUP.md](./DATABASE_SETUP.md)** - Setup database detail
- 📖 **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - API reference lengkap
- 📖 **[SETUP_COMPLETE.md](./SETUP_COMPLETE.md)** - Overview setup yang sudah dikerjakan

---

## Tech Stack

### Frontend
- **Next.js 16** - React framework dengan App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **Lucide React** - Icons

### Backend
- **Next.js API Routes** - RESTful API
- **Prisma 7** - ORM (Object-Relational Mapping)
- **MySQL 8** - Database
- **Zod** - Schema validation
- **bcryptjs** - Password hashing

### Development Tools
- **ESLint** - Code linting
- **Prisma Studio** - Database GUI
- **tsx** - TypeScript execution

---

## Troubleshooting

### Error: Can't connect to MySQL

**Solution:**
```bash
# Windows - Start MySQL service
net start MySQL80

# Atau buka Services dan start MySQL service
services.msc
```

### Error: Database does not exist

**Solution:**
```sql
CREATE DATABASE sekolah_db;
```

### Error: Prisma Client not found

**Solution:**
```bash
npm run db:generate
```

### Error: Port 3000 already in use

**Solution:**
```bash
# Gunakan port lain
PORT=3001 npm run dev
```

### Clear Prisma Client Cache

```bash
rm -rf node_modules/.prisma
npm run db:generate
```

**More troubleshooting:** [DATABASE_SETUP.md](./DATABASE_SETUP.md#-troubleshooting)

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
