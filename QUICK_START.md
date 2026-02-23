# 🚀 QUICK START - Langsung Pakai!

## 3 Langkah Simple untuk Mulai

### 1️⃣ Setup Database (5 menit)

**Buka MySQL dan buat database:**
```sql
CREATE DATABASE sekolah_db;
```

**Edit file `.env`:**
```env
DATABASE_URL="mysql://root:@localhost:3306/sekolah_db"
```
*Ganti `root:` dengan `username:password` MySQL Anda jika ada password*

### 2️⃣ Push Database Schema (2 menit)

```bash
npm run db:push
```

Ini akan membuat semua 25+ table otomatis!

### 3️⃣ Isi Data Sample (1 menit)

```bash
npm run db:seed
```

Akan create:
- ✅ Admin account (admin@sekolah.com / admin123)
- ✅ 2 berita
- ✅ 2 guru
- ✅ 2 jurusan (TKJ, RPL)
- ✅ Fasilitas, prestasi, agenda, dll

---

## 🎉 DONE! Jalankan Server

```bash
npm run dev
```

Buka: `http://localhost:3000`

---

## 🧪 Test API Sekarang!

### Di Browser, buka:

**Lihat semua berita:**
```
http://localhost:3000/api/news
```

**Lihat semua guru:**
```
http://localhost:3000/api/teachers
```

### Atau gunakan PowerShell:

```powershell
# Get news
Invoke-RestMethod http://localhost:3000/api/news | ConvertTo-Json

# Get teachers
Invoke-RestMethod http://localhost:3000/api/teachers | ConvertTo-Json
```

---

## 🎨 Prisma Studio - Database GUI

Mau lihat database secara visual?

```bash
npm run db:studio
```

Buka: `http://localhost:5555`

Di sini bisa:
- ✅ Lihat semua data
- ✅ Edit data langsung
- ✅ Create data baru
- ✅ Delete data
- ✅ Filter & search

---

## 📱 Create News via API

**PowerShell:**
```powershell
$body = @{
    title = "Berita Terbaru"
    slug = "berita-terbaru"
    category = "berita"
    content = "Isi berita lengkap di sini..."
    isPublished = $true
    tags = @("prestasi", "siswa")
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/news" -Method Post -Body $body -ContentType "application/json"
```

**Postman:**
```
POST http://localhost:3000/api/news
Content-Type: application/json

{
  "title": "Berita Terbaru",
  "slug": "berita-terbaru",
  "category": "berita",
  "content": "Isi berita...",
  "isPublished": true,
  "tags": ["prestasi", "siswa"]
}
```

---

## ✅ Available API Endpoints

### News
- `GET /api/news` - List all news
- `GET /api/news/1` - Get news by ID
- `POST /api/news` - Create news
- `PUT /api/news/1` - Update news
- `DELETE /api/news/1` - Delete news

### Teachers
- `GET /api/teachers` - List all teachers
- `GET /api/teachers/1` - Get teacher by ID
- `POST /api/teachers` - Create teacher
- `PUT /api/teachers/1` - Update teacher
- `DELETE /api/teachers/1` - Delete teacher

---

## 📖 Dokumentasi Lengkap

- **API Docs**: Baca `API_DOCUMENTATION.md`
- **Database Setup**: Baca `DATABASE_SETUP.md`
- **Complete Guide**: Baca `SETUP_COMPLETE.md`

---

## 🆘 Troubleshooting

### Error: Can't connect to MySQL
```bash
# Windows - Start MySQL service
net start MySQL80
```

### Error: Database does not exist
```sql
CREATE DATABASE sekolah_db;
```

### Error: Prisma Client not generated
```bash
npm run db:generate
```

---

## 🎯 Mau Lanjut Apa?

### 1. Test API yang Ada
- Coba CRUD News
- Coba CRUD Teachers
- Lihat data di Prisma Studio

### 2. Buat API Endpoint Baru
Copy pattern dari `/app/api/news/route.ts` untuk:
- Majors (Jurusan)
- Facilities (Fasilitas)
- Achievements (Prestasi)
- Agendas (Agenda)
- dsb...

### 3. Connect ke Admin Panel
- Integrate API ke UI admin (`/app/admin`)
- Buat form CRUD
- Display data di table

### 4. Add Authentication
- Setup NextAuth.js
- Protect routes
- Role-based access

---

**Selamat coding! 🎉** 

Kalau ada pertanyaan, tinggal tanya aja!
