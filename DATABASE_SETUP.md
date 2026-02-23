# 🚀 Setup Database & API - Quick Start

## Prerequisites

- Node.js 18+
- MySQL 8.0+ / MariaDB
- npm atau yarn

---

## 📋 Step 1: Install Dependencies

Sudah terinstall:
- ✅ Prisma ORM
- ✅ NextAuth.js
- ✅ Zod (validation)
- ✅ bcryptjs (password hashing)

---

## 📋 Step 2: Setup Database

### 2.1 Buat Database MySQL

```sql
CREATE DATABASE sekolah_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2.2 Configure Environment Variables

Edit file `.env` dan sesuaikan dengan database Anda:

```env
# Database Connection
DATABASE_URL="mysql://root:password@localhost:3306/sekolah_db"

# Contoh lain:
# DATABASE_URL="mysql://username:password@localhost:3306/sekolah_db"
# DATABASE_URL="mysql://user:pass@127.0.0.1:3306/db_name"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-command-below"

# File Upload
UPLOAD_DIR="./public/uploads"
MAX_FILE_SIZE=5242880
```

### 2.3 Generate NextAuth Secret

**Windows PowerShell:**
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Windows (Alternative):**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

Copy hasilnya dan paste ke `NEXTAUTH_SECRET` di file `.env`

---

## 📋 Step 3: Generate Prisma Client & Migrate Database

### 3.1 Generate Prisma Client

```bash
npx prisma generate
```

### 3.2 Push Schema ke Database (Development)

**Option 1: Prisma DB Push (Quick - untuk development)**
```bash
npx prisma db push
```

**Option 2: Prisma Migrate (Recommended - untuk production)**
```bash
npx prisma migrate dev --name init
```

### 3.3 Verify Database

```bash
npx prisma studio
```

Browser akan terbuka di `http://localhost:5555` dengan GUI untuk manage database.

---

## 📋 Step 4: Seed Database (Optional)

Buat file `prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Start seeding...')

  // Create Super Admin
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.create({
    data: {
      name: 'Super Admin',
      email: 'admin@sekolah.com',
      password: hashedPassword,
      role: 'superadmin',
      status: 'active',
    },
  })
  console.log('✅ Created user:', admin.email)

  // Create Sample News
  const news = await prisma.news.create({
    data: {
      title: 'Selamat Datang di Website SMK',
      slug: 'selamat-datang',
      excerpt: 'Selamat datang di website resmi SMK kami',
      content: 'Ini adalah berita pertama di website sekolah...',
      category: 'pengumuman',
      authorId: admin.id,
      isPublished: true,
      publishedAt: new Date(),
    },
  })
  console.log('✅ Created news:', news.title)

  // Create Sample Teacher
  const teacher = await prisma.teacher.create({
    data: {
      name: 'Budi Santoso, S.Pd',
      position: 'Kepala Sekolah',
      isActive: true,
      orderPosition: 1,
    },
  })
  console.log('✅ Created teacher:', teacher.name)

  console.log('🎉 Seeding finished!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

Tambahkan script di `package.json`:

```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

Install ts-node:
```bash
npm install -D ts-node
```

Run seed:
```bash
npx prisma db seed
```

---

## 📋 Step 5: Run Development Server

```bash
npm run dev
```

Server akan berjalan di `http://localhost:3000`

---

## 🧪 Testing API

### Test dengan Browser / Postman

**Get All News:**
```
GET http://localhost:3000/api/news
```

**Get Single News:**
```
GET http://localhost:3000/api/news/1
```

**Create News (POST with JSON body):**
```
POST http://localhost:3000/api/news
Content-Type: application/json

{
  "title": "Berita Baru",
  "slug": "berita-baru",
  "category": "berita",
  "content": "Isi berita...",
  "isPublished": true
}
```

### Test dengan PowerShell (cURL Alternative)

**Get News:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/news" -Method Get
```

**Create News:**
```powershell
$body = @{
    title = "Test News"
    slug = "test-news"
    category = "berita"
    content = "Test content"
    isPublished = $true
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/news" -Method Post -Body $body -ContentType "application/json"
```

---

## 📂 Project Structure

```
website-sekolah-nextjs/
├── app/
│   ├── api/                    # API Routes
│   │   ├── news/
│   │   │   ├── route.ts       # GET, POST /api/news
│   │   │   └── [id]/
│   │   │       └── route.ts   # GET, PUT, DELETE /api/news/[id]
│   │   ├── teachers/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   └── ... (more endpoints)
│   ├── admin/                  # Admin Panel
│   └── page.tsx                # Landing Page
├── lib/
│   ├── prisma.ts              # Prisma Client
│   ├── api-response.ts        # API Response Helpers
│   └── validations.ts         # Zod Schemas
├── prisma/
│   ├── schema.prisma          # Database Schema
│   └── seed.ts                # Database Seeder
├── .env                       # Environment Variables
└── package.json
```

---

## 🎯 Available API Endpoints

### ✅ Ready to Use

- **News**: `/api/news` (GET, POST, PUT, DELETE)
- **Teachers**: `/api/teachers` (GET, POST, PUT, DELETE)

### 🔄 Coming Soon (Same Pattern)

- Majors
- Facilities
- Achievements
- Agendas
- Users
- Alumni
- Contact Messages
- Settings

---

## 🔧 Useful Prisma Commands

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database (development)
npx prisma db push

# Create migration (production)
npx prisma migrate dev --name migration_name

# Open Prisma Studio (Database GUI)
npx prisma studio

# Seed database
npx prisma db seed

# Reset database (DANGER!)
npx prisma migrate reset

# Validate schema
npx prisma validate

# Format schema
npx prisma format
```

---

## 🐛 Troubleshooting

### Error: Can't reach database server

- Pastikan MySQL sudah running
- Cek kredensial di `.env`
- Cek port MySQL (default: 3306)

```bash
# Check MySQL status (Windows)
net start MySQL80

# atau lihat di Services
services.msc
```

### Error: Prisma Client not found

```bash
npx prisma generate
```

### Error: Database does not exist

```sql
CREATE DATABASE sekolah_db;
```

### Clear Prisma Client Cache

```bash
rm -rf node_modules/.prisma
npx prisma generate
```

---

## 📚 Next Steps

1. ✅ Database setup complete
2. ✅ API Routes for News & Teachers
3. 🔄 Add Authentication (NextAuth.js)
4. 🔄 Create remaining API endpoints
5. 🔄 Connect API to Admin Panel UI
6. 🔄 File upload handling
7. 🔄 Deploy to production

---

## 📖 Documentation

- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Zod Validation](https://zod.dev)
- [API Documentation](./API_DOCUMENTATION.md)

---

Selamat mencoba! 🚀
