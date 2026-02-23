# 🔧 Development Setup — Website Sekolah (Next.js)# 🔧 Development Setup & Environment



Panduan lengkap untuk **clone dan menjalankan** project dari awal. Bagikan ke teman yang baru bergabung.Panduan teknis untuk mengatur environment development.



------



## 📋 Prasyarat (Wajib Install Dulu)## 💻 System Requirements



### 1. Node.js (v18 atau lebih baru)### Minimum Requirements

- **OS:** Windows 10/11, macOS 10.15+, atau Linux (Ubuntu 20.04+)

| OS | Cara Install |- **RAM:** 4GB (8GB recommended)

|---|---|- **Storage:** 500MB free space

| **Windows** | Download dari [nodejs.org](https://nodejs.org/) → pilih **LTS** |- **Internet:** Required for initial setup

| **Mac** | `brew install node` atau download dari [nodejs.org](https://nodejs.org/) |

| **Linux** | `sudo apt install nodejs npm` atau pakai [nvm](https://github.com/nvm-sh/nvm) |### Required Software



Verifikasi:#### 1. Node.js & npm

```bash

node --version   # minimal v18.x.x**Recommended Version:** Node.js 18.x LTS atau lebih baru

npm --version    # minimal v9.x.x

```**Download & Install:**

- Windows/Mac: [nodejs.org](https://nodejs.org/)

### 2. MySQL Server- Linux (Ubuntu/Debian):

  ```bash

Project ini menggunakan **MySQL** sebagai database. Pilih salah satu:  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

  sudo apt-get install -y nodejs

| Opsi | Download |  ```

|---|---|

| **XAMPP** (Recommended untuk Windows) | [apachefriends.org](https://www.apachefriends.org/) |**Verify Installation:**

| **Laragon** | [laragon.org](https://laragon.org/) |```bash

| **MySQL Community Server** | [dev.mysql.com](https://dev.mysql.com/downloads/) |node --version   # Should show v18.x.x or higher

| **Docker MySQL** | `docker run -d -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root mysql:8` |npm --version    # Should show v9.x.x or higher

```

> ⚠️ **Pastikan MySQL berjalan** di `localhost:3306` sebelum menjalankan project.

#### 2. Git

### 3. Git

**Download & Install:**

```bash- Windows: [git-scm.com](https://git-scm.com/)

# Verifikasi- Mac: `brew install git`

git --version- Linux: `sudo apt-get install git`

```

**Verify:**

Download: [git-scm.com](https://git-scm.com/)```bash

git --version

### 4. Code Editor```



Rekomendasi: **Visual Studio Code** — [code.visualstudio.com](https://code.visualstudio.com/)#### 3. Code Editor (Recommended: VS Code)



Extension yang disarankan:**Download:** [code.visualstudio.com](https://code.visualstudio.com/)

- ESLint (`dbaeumer.vscode-eslint`)

- Tailwind CSS IntelliSense (`bradlc.vscode-tailwindcss`)**Recommended Extensions:**

- Prisma (`Prisma.prisma`)- ESLint

- Prettier - Code formatter

---- Tailwind CSS IntelliSense

- ES7+ React/Redux/React-Native snippets

## 📦 Tech Stack & Library yang Digunakan- Auto Rename Tag

- Path Intellisense

### Production Dependencies

**Install Extensions (VS Code):**

| Package | Versi | Fungsi |```bash

|---|---|---|code --install-extension dbaeumer.vscode-eslint

| `next` | 16.1.6 | Framework React fullstack (App Router + Turbopack) |code --install-extension esbenp.prettier-vscode

| `react` | 19.2.3 | UI library |code --install-extension bradlc.vscode-tailwindcss

| `react-dom` | 19.2.3 | React DOM renderer |code --install-extension dsznajder.es7-react-js-snippets

| `@prisma/client` | ^5.22.0 | ORM client untuk query database MySQL |```

| `prisma` | ^5.22.0 | ORM toolkit (schema, migration, seeding) |

| `mysql2` | ^3.17.1 | MySQL driver untuk Node.js |---

| `bcryptjs` | ^3.0.3 | Hashing password (untuk auth login) |

| `zod` | ^4.3.6 | Validasi data / schema request body API |## 📥 Project Setup

| `lucide-react` | ^0.563.0 | Icon library (SVG icons) |

| `next-auth` | ^5.0.0-beta.30 | Auth helper (tersedia, belum full digunakan) |### Step 1: Clone Repository



### Dev Dependencies```bash

# HTTPS

| Package | Versi | Fungsi |git clone https://github.com/yourusername/website-sekolah-nextjs.git

|---|---|---|

| `typescript` | ^5 | TypeScript compiler |# SSH (if configured)

| `tailwindcss` | ^4 | CSS utility framework |git clone git@github.com:yourusername/website-sekolah-nextjs.git

| `@tailwindcss/postcss` | ^4 | PostCSS plugin untuk Tailwind |

| `eslint` | ^9 | Linter JavaScript/TypeScript |# Navigate to project

| `eslint-config-next` | 16.1.6 | ESLint rules khusus Next.js |cd website-sekolah-nextjs

| `tsx` | ^4.21.0 | Menjalankan file `.ts` langsung (untuk seeding) |```

| `@types/node` | ^20 | TypeScript types untuk Node.js |

| `@types/react` | ^19 | TypeScript types untuk React |### Step 2: Install Dependencies

| `@types/react-dom` | ^19 | TypeScript types untuk React DOM |

| `@types/bcryptjs` | ^2.4.6 | TypeScript types untuk bcryptjs |```bash

npm install

---```



## 🚀 Langkah-Langkah Setup (Setelah Clone)**What gets installed:**

- Production dependencies (in `dependencies`)

### Step 1: Clone Repository- Development dependencies (in `devDependencies`)

- Type definitions (@types/*)

```bash

git clone https://github.com/kahlaluthfi31/web-sekolah.git**Package Lock:**

cd web-sekolah`package-lock.json` akan dibuat/diupdate untuk lock versi dependencies.

```

### Step 3: Environment Variables (Optional)

### Step 2: Install Dependencies

Jika project menggunakan environment variables:

```bash

npm install**Create `.env.local` file:**

``````bash

# Windows PowerShell

> Ini akan otomatis install **semua** package di atas berdasarkan `package.json`.New-Item .env.local



### Step 3: Buat Database MySQL# Mac/Linux

touch .env.local

Buka **MySQL** (via phpMyAdmin, MySQL Workbench, atau terminal):```



```sql**Add variables:**

CREATE DATABASE sekolah_db;```env

```# Public (accessible in client)

NEXT_PUBLIC_SITE_URL=http://localhost:3000

### Step 4: Konfigurasi EnvironmentNEXT_PUBLIC_API_URL=https://api.example.com



Buat file `.env` di root project:# Private (server-only)

DATABASE_URL=postgresql://localhost:5432/dbname

```envAPI_SECRET_KEY=your_secret_here

# ==================================================```

# DATABASE CONFIGURATION - MySQL

# ==================================================**Important:**

# Sesuaikan dengan setup MySQL kamu:- ✅ `.env.local` is gitignored (not committed)

#- ✅ Use `NEXT_PUBLIC_` prefix for client-side variables

# XAMPP (tanpa password):- ❌ Never commit secrets to Git

# DATABASE_URL="mysql://root:@localhost:3306/sekolah_db"

#---

# XAMPP/MySQL (dengan password):

# DATABASE_URL="mysql://root:passwordkamu@localhost:3306/sekolah_db"## 🚀 Running the Project



DATABASE_URL="mysql://root:@localhost:3306/sekolah_db"### Development Mode



# ==================================================```bash

# APP CONFIGnpm run dev

# ==================================================```

NEXTAUTH_URL="http://localhost:3000"

NEXTAUTH_SECRET="ganti-dengan-random-string-32-karakter"**What happens:**

- Next.js dev server starts on `http://localhost:3000`

# ==================================================- Hot Module Replacement (HMR) enabled

# FILE UPLOAD (Opsional)- Error overlay for debugging

# ==================================================- Fast refresh for instant updates

UPLOAD_DIR="./public/uploads"

MAX_FILE_SIZE=5242880**Options:**

``````bash

# Run on different port

> ⚠️ **PENTING**: Ganti `DATABASE_URL` sesuai user/password MySQL kamu!npm run dev -- -p 3001



### Step 5: Push Schema ke Database# Run on specific host

npm run dev -- -H 0.0.0.0

```bash

npx prisma db push# Turbopack (experimental, faster)

```npm run dev -- --turbo

```

Ini akan membuat semua tabel (28+ tabel) di database `sekolah_db` berdasarkan file `prisma/schema.prisma`.

### Production Mode

### Step 6: Generate Prisma Client

**Build:**

```bash```bash

npx prisma generatenpm run build

``````



### Step 7: Seed Data Awal**What happens:**

- TypeScript compilation

```bash- Code optimization & minification

npx prisma db seed- Static page generation

```- Image optimization

- Bundle analysis

Ini akan membuat:

**Start production server:**

| User | Email | Password | Role |```bash

|---|---|---|---|npm start

| Super Admin | `admin@sekolah.com` | `admin123` | superadmin |```

| Admin Medsos | `medsos@sekolah.com` | `admin123` | admin |

| Budi (user biasa) | `budi@gmail.com` | `admin123` | user |**Access:** `http://localhost:3000`



Plus beberapa data sampel (berita, prestasi, agenda, dll).### Lint & Type Check



### Step 8: Jalankan Dev Server**ESLint:**

```bash

```bashnpm run lint

npx next dev --port 3000```

```

**TypeScript check (if needed):**

Atau pakai npm script:```bash

npx tsc --noEmit

```bash```

npm run dev

```---



> Pertama kali jalan, Turbopack akan compile (~10-20 detik). Setelahnya cepat (~2-3 detik).## 🔧 VS Code Configuration



### Step 9: Buka di Browser### Settings (.vscode/settings.json)



| Halaman | URL |Create `.vscode/settings.json`:

|---|---|

| 🏠 Homepage | [http://localhost:3000](http://localhost:3000) |```json

| 🔐 Login Admin | [http://localhost:3000/admin/login](http://localhost:3000/admin/login) |{

| 📊 Dashboard | [http://localhost:3000/admin/dashboard](http://localhost:3000/admin/dashboard) |  "editor.formatOnSave": true,

  "editor.defaultFormatter": "esbenp.prettier-vscode",

---  "editor.codeActionsOnSave": {

    "source.fixAll.eslint": true

## 📝 NPM Scripts yang Tersedia  },

  "typescript.tsdk": "node_modules/typescript/lib",

```bash  "typescript.enablePromptUseWorkspaceTsdk": true,

npm run dev          # Jalankan dev server (development mode)  "files.associations": {

npm run build        # Build untuk production    "*.css": "tailwindcss"

npm run start        # Jalankan production server (setelah build)  },

npm run lint         # Cek lint errors  "tailwindCSS.experimental.classRegex": [

    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]

# Database commands  ]

npm run db:generate  # Generate Prisma Client}

npm run db:push      # Push schema ke database```

npm run db:migrate   # Buat migration baru

npm run db:seed      # Seed data awal### Launch Configuration (.vscode/launch.json)

npm run db:studio    # Buka Prisma Studio (GUI database)

```For debugging:



---```json

{

## 🔐 Sistem Login & Role  "version": "0.2.0",

  "configurations": [

### Role & Akses    {

      "name": "Next.js: debug server-side",

| Role | Akses |      "type": "node-terminal",

|---|---|      "request": "launch",

| **Superadmin** | Semua fitur + Navigation, Homepage, School Profile, Settings |      "command": "npm run dev"

| **Admin** | Kelola konten: Berita, Prestasi, Ekskul, Agenda, Pesan, Alumni, Fasilitas, Guru, Jurusan |    },

| **User** | Hanya komentar (tidak bisa akses dashboard) |    {

      "name": "Next.js: debug client-side",

### Cara Login      "type": "chrome",

      "request": "launch",

1. Buka `http://localhost:3000/admin/login`      "url": "http://localhost:3000"

2. Masukkan email & password    }

3. Superadmin: `admin@sekolah.com` / `admin123`  ]

4. Admin: `medsos@sekolah.com` / `admin123`}

```

---

---

## 📂 Struktur Folder Penting

## 📦 Package Management

```

website-sekolah-nextjs/### Check Outdated Packages

├── app/

│   ├── page.tsx                    # Homepage publik```bash

│   ├── layout.tsx                  # Root layoutnpm outdated

│   ├── globals.css                 # Global styles (Tailwind)```

│   ├── admin/

│   │   ├── login/page.tsx          # Halaman login### Update Packages

│   │   ├── dashboard/

│   │   │   ├── page.tsx            # Dashboard home (statistik)```bash

│   │   │   ├── layout.tsx          # Dashboard layout + auth guard# Update all to latest (respecting semver)

│   │   │   ├── components/         # AdminShell sidebarnpm update

│   │   │   ├── news/               # CRUD Berita

│   │   │   ├── achievements/       # CRUD Prestasi# Update specific package

│   │   │   ├── extracurriculars/   # CRUD Ekstrakurikulernpm update next

│   │   │   ├── agendas/            # CRUD Agenda

│   │   │   ├── teachers/           # CRUD Guru# Update to latest (breaking changes possible)

│   │   │   ├── facilities/         # CRUD Fasilitasnpm install next@latest

│   │   │   ├── majors/             # CRUD Jurusan```

│   │   │   ├── alumni/             # CRUD Alumni

│   │   │   ├── users/              # Manajemen User### Add New Package

│   │   │   ├── messages/           # Pesan masuk

│   │   │   ├── comments/           # Moderasi komentar```bash

│   │   │   ├── navigation/         # Editor navigasi (superadmin)# Production dependency

│   │   │   ├── homepage/           # Editor hero & sambutan (superadmin)npm install package-name

│   │   │   ├── school-profile/     # Editor profil sekolah (superadmin)

│   │   │   └── settings/           # Pengaturan website (superadmin)# Dev dependency

│   │   └── layout.tsx              # Admin layout wrappernpm install -D package-name

│   ├── api/                        # API Routes (REST)

│   │   ├── auth/                   # Login, Logout, Register, Me# Specific version

│   │   ├── news/                   # CRUD Beritanpm install package-name@1.2.3

│   │   ├── achievements/           # CRUD Prestasi```

│   │   ├── extracurriculars/       # CRUD Ekskul

│   │   ├── agendas/                # CRUD Agenda### Remove Package

│   │   ├── teachers/               # CRUD Guru

│   │   ├── facilities/             # CRUD Fasilitas```bash

│   │   ├── majors/                 # CRUD Jurusannpm uninstall package-name

│   │   ├── alumni/                 # CRUD Alumni```

│   │   ├── users/                  # CRUD User

│   │   ├── messages/               # CRUD Pesan### Audit & Fix Vulnerabilities

│   │   ├── comments/               # CRUD Komentar

│   │   ├── homepage/               # API Hero & Sambutan```bash

│   │   ├── school-profile/         # API Profil Sekolah# Check for vulnerabilities

│   │   ├── navigation/             # API Navigasinpm audit

│   │   └── settings/               # API Settings

│   ├── components/                 # Komponen halaman publik# Fix automatically (if possible)

│   └── pages/                      # Halaman publik (About, News, dll)npm audit fix

├── components/                     # Komponen homepage (Hero, Navbar, Footer, dll)

├── lib/# Force fix (may have breaking changes)

│   ├── prisma.ts                   # Prisma Client singletonnpm audit fix --force

│   ├── auth.ts                     # Auth: login, getSession, requireAuth```

│   ├── rbac.ts                     # Role-Based Access Control (40+ permissions)

│   ├── api-response.ts             # Helper: apiSuccess, apiError, apiPagination---

│   └── validations.ts              # Zod schema validasi

├── prisma/## 🧪 Testing Setup (Optional)

│   ├── schema.prisma               # Database schema (28+ tabel)

│   └── seed.ts                     # Data seederIf adding tests to the project:

├── public/                         # File statis (gambar, SVG)

├── _admin_template/                # Template Materio (referensi, TIDAK dipakai)### Install Jest & Testing Library

├── Documentation/                  # Dokumentasi project

├── .env                            # Environment variables (JANGAN commit!)```bash

├── package.json                    # Dependencies & scriptsnpm install -D jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom

├── tsconfig.json                   # TypeScript config```

├── next.config.ts                  # Next.js config

└── postcss.config.mjs              # PostCSS config (Tailwind)### Configure Jest

```

Create `jest.config.js`:

---

```javascript

## 🛠️ Troubleshootingconst nextJest = require('next/jest')



### ❌ Error: "Can't reach database server"const createJestConfig = nextJest({

  dir: './',

**Penyebab:** MySQL tidak jalan atau credential salah.})



**Solusi:**const customJestConfig = {

1. Pastikan MySQL/XAMPP sudah **START**  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

2. Cek `DATABASE_URL` di file `.env`  testEnvironment: 'jest-environment-jsdom',

3. Test koneksi: `npx prisma db pull --print`}



### ❌ Error: "Port 3000 already in use"module.exports = createJestConfig(customJestConfig)

```

**Solusi:**

```bash### Add Test Script

# Windows - cari & matikan proses di port 3000

netstat -ano | findstr :3000In `package.json`:

taskkill /PID <nomor_PID> /F

```json

# Atau pakai port lain{

npx next dev --port 3001  "scripts": {

```    "test": "jest",

    "test:watch": "jest --watch"

### ❌ Loading lama saat pertama kali  }

}

**Normal!** Turbopack perlu compile saat pertama akses halaman. Setelahnya cepat.```



### ❌ Error: "@prisma/client not generated"---



```bash## 🐳 Docker Setup (Optional)

npx prisma generate

```### Dockerfile



### ❌ Error: "Table doesn't exist"```dockerfile

FROM node:18-alpine AS base

```bash

npx prisma db pushFROM base AS deps

```WORKDIR /app

COPY package*.json ./

### ❌ Prisma Studio (GUI Database)RUN npm ci



Untuk melihat isi database secara visual:FROM base AS builder

```bashWORKDIR /app

npx prisma studioCOPY --from=deps /app/node_modules ./node_modules

```COPY . .

Buka `http://localhost:5555`RUN npm run build



---FROM base AS runner

WORKDIR /app

## 🔄 Perintah Berguna Sehari-hariENV NODE_ENV production

COPY --from=builder /app/public ./public

```bashCOPY --from=builder /app/.next/standalone ./

# Hapus cache Next.js (jika ada masalah aneh)COPY --from=builder /app/.next/static ./.next/static

Remove-Item -Recurse -Force .next     # Windows PowerShell

rm -rf .next                           # Mac/LinuxEXPOSE 3000

ENV PORT 3000

# Reset database (HAPUS semua data!)CMD ["node", "server.js"]

npx prisma db push --force-reset```

npx prisma db seed

### Docker Compose

# Cek TypeScript errors tanpa build

npx tsc --noEmit```yaml

version: '3.8'

# Build production (cek ada error atau tidak)services:

npx next build  web:

```    build: .

    ports:

---      - "3000:3000"

    environment:

## 📌 Quick Start (Ringkasan Singkat)      - NODE_ENV=production

```

Untuk yang sudah paham, ini **7 perintah** dari nol sampai jalan:

**Run:**

```bash```bash

git clone https://github.com/kahlaluthfi31/web-sekolah.gitdocker-compose up

cd web-sekolah```

npm install

# Buat file .env (isi DATABASE_URL sesuai MySQL kamu)---

npx prisma db push

npx prisma db seed## 🔍 Debugging

npm run dev

```### Browser DevTools



Lalu buka: `http://localhost:3000/admin/login`**Chrome/Edge:**

- Press `F12` or `Ctrl+Shift+I`

---- Go to Console tab for errors

- Network tab for API calls

## ✅ Checklist Setelah Setup- React DevTools extension for component inspection



- [ ] Node.js v18+ terinstall### VS Code Debugging

- [ ] MySQL berjalan di localhost:3306

- [ ] `npm install` sukses1. Set breakpoint (click left of line number)

- [ ] File `.env` sudah dibuat dengan `DATABASE_URL` yang benar2. Press `F5` or use Debug panel

- [ ] `npx prisma db push` sukses (tabel terbuat)3. Select "Next.js: debug server-side" or "debug client-side"

- [ ] `npx prisma db seed` sukses (3 user terbuat)

- [ ] `npm run dev` berjalan tanpa error### Console Logging

- [ ] Bisa buka `http://localhost:3000` di browser

- [ ] Bisa login di `http://localhost:3000/admin/login````tsx

- [ ] Dashboard muncul setelah login// Server-side (terminal output)

console.log('Server:', data);

---

// Client-side (browser console)

**Setup selesai! Happy coding! 🚀**console.log('Client:', data);

```

---

## 📊 Performance Monitoring

### Lighthouse

```bash
# Install globally
npm install -g lighthouse

# Run audit
lighthouse http://localhost:3000 --view
```

### Next.js Bundle Analyzer

```bash
npm install -D @next/bundle-analyzer
```

In `next.config.ts`:
```typescript
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);
```

**Run:**
```bash
ANALYZE=true npm run build
```

---

## 🛠️ Useful Commands

```bash
# Clear Next.js cache
rm -rf .next

# Clear all caches
rm -rf .next node_modules package-lock.json
npm install

# Check port usage
netstat -ano | findstr :3000     # Windows
lsof -ti:3000                    # Mac/Linux

# Kill process on port
taskkill /PID <PID> /F           # Windows
kill -9 $(lsof -ti:3000)         # Mac/Linux

# Find large files
npx npkill                        # Find and remove node_modules

# Security check
npm audit
npm audit fix
```

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [VS Code Tips](https://code.visualstudio.com/docs/getstarted/tips-and-tricks)

---

## ✅ Setup Verification Checklist

- [ ] Node.js & npm installed
- [ ] Git installed
- [ ] Repository cloned
- [ ] Dependencies installed (`npm install`)
- [ ] Dev server runs (`npm run dev`)
- [ ] Homepage loads at `http://localhost:3000`
- [ ] VS Code extensions installed
- [ ] No console errors
- [ ] Hot reload works (edit & save file)

---

**Setup complete! Start coding! 🚀**
