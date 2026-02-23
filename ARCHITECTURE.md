# 🏗️ Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        WEBSITE SEKOLAH                          │
│                     Full-Stack Application                      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                          FRONTEND                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ Landing Page │  │ Admin Panel  │  │  Components  │         │
│  │  (Public)    │  │   (Auth)     │  │   (Shared)   │         │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤         │
│  │ • Hero       │  │ • Dashboard  │  │ • Navbar     │         │
│  │ • Profil     │  │ • News CRUD  │  │ • Footer     │         │
│  │ • Jurusan    │  │ • Teacher    │  │ • Cards      │         │
│  │ • Berita     │  │ • Majors     │  │ • Forms      │         │
│  │ • Prestasi   │  │ • Facilities │  │ • Tables     │         │
│  │ • Kontak     │  │ • Settings   │  │ • Modals     │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
│  Technology: Next.js 16 + React 19 + TypeScript + Tailwind     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       API LAYER (Backend)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Next.js API Routes (RESTful)                                   │
│                                                                  │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐     │
│  │  /api/    │ │  /api/    │ │  /api/    │ │  /api/    │     │
│  │  news     │ │ teachers  │ │  majors   │ │ facilities│     │
│  ├───────────┤ ├───────────┤ ├───────────┤ ├───────────┤     │
│  │ GET       │ │ GET       │ │ GET       │ │ GET       │     │
│  │ POST      │ │ POST      │ │ POST      │ │ POST      │     │
│  │ PUT       │ │ PUT       │ │ PUT       │ │ PUT       │     │
│  │ DELETE    │ │ DELETE    │ │ DELETE    │ │ DELETE    │     │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘     │
│                                                                  │
│  ┌────────────────────────────────────────────────────┐        │
│  │  Middleware & Utilities                            │        │
│  ├────────────────────────────────────────────────────┤        │
│  │ • API Response Formatter                           │        │
│  │ • Error Handler                                    │        │
│  │ • Zod Validation                                   │        │
│  │ • Pagination Helper                                │        │
│  │ • Authentication (NextAuth) - Coming Soon         │        │
│  └────────────────────────────────────────────────────┘        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       ORM LAYER (Prisma)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Prisma Client (Type-safe Database Access)                      │
│                                                                  │
│  ┌────────────────────────────────────────────────────┐        │
│  │  Features:                                         │        │
│  │  • Type-safe queries                               │        │
│  │  • Auto-completion                                 │        │
│  │  • Migration management                            │        │
│  │  • Schema validation                               │        │
│  │  • Connection pooling                              │        │
│  └────────────────────────────────────────────────────┘        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE (MySQL)                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  25+ Tables:                                                    │
│                                                                  │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐             │
│  │   Users     │ │    News     │ │  Teachers   │             │
│  ├─────────────┤ ├─────────────┤ ├─────────────┤             │
│  │ • id        │ │ • id        │ │ • id        │             │
│  │ • name      │ │ • title     │ │ • name      │             │
│  │ • email     │ │ • content   │ │ • position  │             │
│  │ • password  │ │ • category  │ │ • photo     │             │
│  │ • role      │ │ • author    │ │ • is_active │             │
│  └─────────────┘ └─────────────┘ └─────────────┘             │
│                                                                  │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐             │
│  │   Majors    │ │ Facilities  │ │Achievements │             │
│  │   Agendas   │ │   Alumni    │ │  Comments   │             │
│  │  Settings   │ │  Contacts   │ │   + more    │             │
│  └─────────────┘ └─────────────┘ └─────────────┘             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### 1. Read Data (GET Request)

```
User Browser
    │
    │ 1. HTTP GET /api/news
    ▼
Next.js API Route (/app/api/news/route.ts)
    │
    │ 2. Call Prisma
    ▼
Prisma Client
    │
    │ 3. SQL Query
    ▼
MySQL Database
    │
    │ 4. Return Data
    ▼
Prisma Client
    │
    │ 5. Format Response
    ▼
API Response Helper
    │
    │ 6. JSON Response
    ▼
User Browser (Display Data)
```

### 2. Create Data (POST Request)

```
User Form (Admin Panel)
    │
    │ 1. Submit Form Data
    ▼
Zod Validation
    │
    │ 2. Validate Schema
    ▼
Next.js API Route (/app/api/news/route.ts)
    │
    │ 3. Create Record
    ▼
Prisma Client
    │
    │ 4. INSERT Query
    ▼
MySQL Database
    │
    │ 5. Return Created Record
    ▼
API Response
    │
    │ 6. Success Message
    ▼
Admin Panel (Show Success & Refresh)
```

---

## Technology Stack

```
┌──────────────────────────────────────────────────┐
│              DEVELOPMENT TOOLS                   │
├──────────────────────────────────────────────────┤
│ • VS Code                                        │
│ • Git                                            │
│ • npm/yarn/pnpm                                  │
│ • Prisma Studio (Database GUI)                   │
│ • Postman/Thunder Client (API Testing)           │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│                 FRONTEND                          │
├──────────────────────────────────────────────────┤
│ Framework:  Next.js 16 (App Router)              │
│ UI Library: React 19                             │
│ Language:   TypeScript 5                         │
│ Styling:    Tailwind CSS 4                       │
│ Icons:      Lucide React                         │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│                 BACKEND                           │
├──────────────────────────────────────────────────┤
│ API:        Next.js API Routes                   │
│ ORM:        Prisma 7                             │
│ Validation: Zod 4                                │
│ Auth:       NextAuth.js (Coming Soon)            │
│ Password:   bcryptjs                             │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│                DATABASE                           │
├──────────────────────────────────────────────────┤
│ DBMS:       MySQL 8.0                            │
│ Charset:    utf8mb4                              │
│ Collation:  utf8mb4_unicode_ci                   │
└──────────────────────────────────────────────────┘
```

---

## File Structure Map

```
website-sekolah-nextjs/
│
├── 📁 app/                      # Next.js App Directory
│   ├── 📁 api/                  # Backend API Routes ⭐
│   │   ├── 📁 news/
│   │   │   ├── route.ts         # List & Create
│   │   │   └── 📁 [id]/
│   │   │       └── route.ts     # Get, Update, Delete
│   │   └── 📁 teachers/
│   │       ├── route.ts
│   │       └── 📁 [id]/
│   │           └── route.ts
│   │
│   ├── 📁 admin/                # Admin Panel Template
│   ├── 📁 components/           # Page-specific components
│   ├── 📁 pages/                # Page containers
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Homepage
│   └── globals.css
│
├── 📁 components/               # Shared Components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   └── ...
│
├── 📁 lib/                      # Utilities ⭐
│   ├── prisma.ts               # Prisma Client Instance
│   ├── api-response.ts         # Response Helpers
│   └── validations.ts          # Zod Schemas
│
├── 📁 prisma/                   # Database ⭐
│   ├── schema.prisma           # Schema Definition
│   └── seed.ts                 # Data Seeder
│
├── 📁 public/                   # Static Files
│   └── 📁 images/
│
├── 📁 Documentation/            # Docs
│
├── .env                        # Environment Variables ⚙️
├── .env.example                # Env Template
├── prisma.config.ts            # Prisma Config
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript Config
├── tailwind.config.js          # Tailwind Config
└── next.config.ts              # Next.js Config
```

---

## API Request/Response Flow

### Example: Get All News

```javascript
// Client Request
fetch('http://localhost:3000/api/news?page=1&limit=10&category=berita')

// ↓ Processed by: /app/api/news/route.ts

export async function GET(request: NextRequest) {
  // 1. Parse query params
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const category = searchParams.get('category')
  
  // 2. Query database via Prisma
  const news = await prisma.news.findMany({
    where: { category },
    skip: (page - 1) * limit,
    take: limit,
    include: { author: true, tags: true }
  })
  
  // 3. Return formatted response
  return apiPagination(news, page, limit, total)
}

// ↓ API Response

{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Berita Terbaru",
      "category": "berita",
      "author": {
        "name": "Admin"
      },
      "tags": [...]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

---

## Database Schema Overview

### Core Entities

```
Users ──────┐
            │
            ├──> News (author)
            ├──> Comments
            ├──> Alumni Submissions
            └──> Verifications

Teachers ───> School Structure

Majors ─────> Competencies

News ───────> News Tags

Extracurriculars ───> Extracurricular Members

Virtual Tour Locations ───> Virtual Tour Images

Alumni Submissions ───> Alumni Profiles
```

### Relationships

- **One-to-Many**: User → News, Major → Competencies
- **Many-to-One**: News → User (author)
- **One-to-One**: Alumni Submission ↔ Alumni Profile
- **Self-referencing**: Comments (parent_id)

---

Semua sudah **READY TO USE**! 🚀
