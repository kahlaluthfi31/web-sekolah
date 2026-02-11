# 🎨 Hero Button - Color Swap Effect

## ✨ Button Hover Effect - Color Swap Animation

Button di Hero section sekarang memiliki efek **smooth color swap** saat hover!

### 🔄 Color Swap Animation

#### Button 1: "Apply Now"

**Normal State:**
```
🔵 Background: Biru Tua (#0092DD)
⚪ Text: Putih (#FFFFFF)
```

**Hover State:**
```
⚪ Background: Putih (#FFFFFF)
🔵 Text: Biru Tua (#0092DD)
```

#### Button 2: "Campus Tour"

**Normal State:**
```
⚪ Background: Putih (#FFFFFF)
🔵 Text: Biru Tua (#0092DD)
```

**Hover State:**
```
🔵 Background: Biru Tua (#0092DD)
⚪ Text: Putih (#FFFFFF)
```

### 💡 Efek Visual

Kedua button **bertukar warna** saat hover:
- Button biru → menjadi putih
- Button putih → menjadi biru
- **Smooth transition 300ms**
- **Scale up 1.05x** untuk efek interaktif

### 🎯 Code Implementation

```tsx
// Button 1 - Primary (Biru → Putih)
<button className="
  bg-[#0092DD] text-white 
  hover:bg-white hover:text-[#0092DD] 
  transition-all duration-300 
  transform hover:scale-105
">
  Apply Now
</button>

// Button 2 - Secondary (Putih → Biru)
<button className="
  bg-white text-[#0092DD] 
  hover:bg-[#0092DD] hover:text-white 
  transition-all duration-300 
  transform hover:scale-105
">
  Campus Tour
</button>
```

### ⚡ Features

- ✅ **Smooth transition** - `duration-300` (300ms)
- ✅ **Color swap** - Background dan text bertukar warna
- ✅ **Scale animation** - Button membesar 5% saat hover
- ✅ **Shadow effect** - `shadow-xl` untuk depth
- ✅ **Responsive** - Full width di mobile, auto di desktop

### 🎬 Animation Details

| Property | Value | Effect |
|----------|-------|--------|
| `transition-all` | All properties | Smooth transition untuk semua perubahan |
| `duration-300` | 300ms | Durasi transisi (smooth & responsive) |
| `hover:scale-105` | 105% | Button membesar sedikit |
| `hover:bg-white` | White bg | Background berubah ke putih |
| `hover:text-[#0092DD]` | Blue text | Text berubah ke biru |

### 🚀 Test

Jalankan development server:

```bash
npm run dev
```

**Hover pada kedua button** di Hero section untuk melihat efek smooth color swap! 

Kedua button akan **bertukar warna** dengan animasi yang indah dan smooth! 🔵⚪✨

---

**Perfect balance:** Button biru dan putih saling melengkapi dengan efek hover yang mirror/cermin! 🎨
