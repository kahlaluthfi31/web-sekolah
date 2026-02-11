# ⚡ Quick Start Guide

Panduan singkat untuk setup dan menjalankan project dalam **5 menit**!

---

## 📋 Prerequisites Checklist

Pastikan sudah terinstall:
- [ ] Node.js v18+ ([Download](https://nodejs.org/))
- [ ] npm v9+ (included with Node.js)
- [ ] Git ([Download](https://git-scm.com/))

**Cek versi:**
```bash
node --version && npm --version
```

---

## 🚀 Setup (3 Langkah)

### 1️⃣ Clone & Navigate

```bash
git clone <repository-url>
cd website-sekolah-nextjs
```

### 2️⃣ Install Dependencies

```bash
npm install
```

⏱️ Tunggu ~1-2 menit untuk install semua packages.

### 3️⃣ Run Development Server

```bash
npm run dev
```

🎉 **Done!** Buka browser di `http://localhost:3000`

---

## 📦 What's Installed?

Setelah `npm install`, Anda akan punya:

```
✅ Next.js 16.1.6       (Framework)
✅ React 19.2.3         (UI Library)
✅ TypeScript 5.x       (Type Safety)
✅ Tailwind CSS 4.x     (Styling)
✅ lucide-react         (Icons)
```

---

## 🎯 Testing Installation

Setelah `npm run dev` berhasil, test ini:

1. **Homepage** → `http://localhost:3000/` 
   - ✅ Navbar muncul
   - ✅ Hero section muncul
   - ✅ Footer muncul

2. **Navigation** → Klik menu:
   - ✅ About, Admissions, Contact, News

3. **Responsive** → Resize browser:
   - ✅ Mobile view (< 768px)
   - ✅ Tablet view (768px - 1024px)
   - ✅ Desktop view (> 1024px)

---

## 🐛 Common Issues

### ❌ "Port 3000 already in use"

**Windows:**
```powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
lsof -ti:3000 | xargs kill -9
```

### ❌ "Module not found: lucide-react"

```bash
npm install lucide-react
```

### ❌ "npm command not found"

Install Node.js dari [nodejs.org](https://nodejs.org/)

---

## 📁 Project Structure (Simple)

```
website-sekolah-nextjs/
├── app/              # Pages & routing
│   ├── page.tsx     # Homepage
│   └── about/       # About page
├── components/       # UI components
│   ├── Navbar.tsx
│   └── Footer.tsx
├── public/          # Static files
└── App.tsx          # Main app
```

---

## 📜 Commands Cheat Sheet

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm start            # Run production server

# Code Quality
npm run lint         # Check for errors

# Cleanup
rm -rf .next node_modules
npm install          # Fresh install
```

---

## 🎓 Next Steps

Setelah berhasil setup:

1. 📖 Baca [README.md](README.md) untuk dokumentasi lengkap
2. 📊 Lihat [STRUKTUR_COMPARISON.md](STRUKTUR_COMPARISON.md) untuk struktur project
3. 🏠 Cek [SETUP_HOMEPAGE.md](SETUP_HOMEPAGE.md) untuk konfigurasi homepage
4. 🚀 Mulai coding!

---

## ⚡ Super Quick Setup (One-Liner)

```bash
git clone <url> && cd website-sekolah-nextjs && npm install && npm run dev
```

Kemudian buka `http://localhost:3000` 🎉

---

**Time to code: ~5 minutes** ⏱️

Need help? Check [README.md](README.md) untuk troubleshooting lengkap!
