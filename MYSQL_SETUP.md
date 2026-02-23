# 🗄️ Setup Database MySQL - Manual Steps

## Problem: Access Denied

Error ini terjadi karena MySQL membutuhkan password.

---

## ✅ Solution - 3 Cara

### **Cara 1: Buat Database via phpMyAdmin** (PALING MUDAH)

1. **Pastikan XAMPP MySQL sudah running**
   - Buka XAMPP Control Panel
   - Start **MySQL** (jika belum)

2. **Buka phpMyAdmin**
   - Browser: `http://localhost/phpmyadmin`
   - Atau klik **Admin** di XAMPP Control Panel (MySQL row)

3. **Buat Database Baru**
   - Klik tab **"Databases"** atau **"SQL"**
   - Jalankan query ini:
   
   ```sql
   CREATE DATABASE IF NOT EXISTS sekolah_db 
   CHARACTER SET utf8mb4 
   COLLATE utf8mb4_unicode_ci;
   ```
   
   - Klik **Go** atau **Execute**

4. **Verify**
   - Lihat di sidebar kiri, seharusnya ada database **sekolah_db**

---

### **Cara 2: Via MySQL Command Line (dengan password)**

```powershell
# Jika tahu password MySQL root
C:\xampp_baru\mysql\bin\mysql.exe -u root -p

# Nanti akan diminta password, ketik password MySQL Anda
# Lalu jalankan:
CREATE DATABASE sekolah_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

---

### **Cara 3: Update .env dengan Password**

Jika MySQL Anda ada password, update file `.env`:

```env
# Tambahkan password setelah root:
DATABASE_URL="mysql://root:PASSWORD_ANDA@localhost:3306/sekolah_db"

# Contoh jika password adalah "admin123":
# DATABASE_URL="mysql://root:admin123@localhost:3306/sekolah_db"
```

---

## 📋 After Database Created

Setelah database **sekolah_db** sudah ada, jalankan:

```bash
# 1. Push schema ke database (buat semua table)
npm run db:push

# 2. (Optional) Isi data sample
npm run db:seed

# 3. Run dev server
npm run dev
```

---

## 🔍 Check Database Connection

Test apakah bisa connect:

```bash
# Generate Prisma Client
npm run db:generate

# Test connection
npx prisma db pull
```

Jika sukses, berarti connection sudah OK!

---

## ❓ Still Got Error?

### Error: Access Denied
- Cek password MySQL
- Update DATABASE_URL di `.env` dengan password yang benar

### Error: Can't connect to MySQL server
- Pastikan XAMPP MySQL running
- Cek di Services apakah MySQL service active

### Error: Database doesn't exist
- Buat database via phpMyAdmin (Cara 1)

---

## 🎯 Recommended: Cara 1 (phpMyAdmin)

Paling mudah dan pasti berhasil! 😊
