# API Documentation - Website Sekolah

Base URL: `http://localhost:3000/api`

## Authentication
(Akan ditambahkan dengan NextAuth.js)

---

## 📰 News API

### Get All News
```
GET /api/news
```

**Query Parameters:**
- `page` (optional): Page number, default: 1
- `limit` (optional): Items per page, default: 10
- `category` (optional): Filter by category (berita, kejuaraan, pengumuman, event)
- `search` (optional): Search in title, excerpt, content
- `published` (optional): Filter published (true/false)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Judul Berita",
      "slug": "judul-berita",
      "excerpt": "Ringkasan berita...",
      "content": "Isi berita lengkap...",
      "featuredImage": "/uploads/news/image.jpg",
      "category": "berita",
      "author": {
        "id": 1,
        "name": "Admin",
        "email": "5"
      },
      "tags": [
        {
          "id": 1,
          "tagName": "prestasi"
        }
      ],
      "views": 150,
      "isPublished": true,
      "publishedAt": "2024-02-14T10:00:00Z",
      "createdAt": "2024-02-14T09:00:00Z"
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

### Get Single News
```
GET /api/news/[id]
```

**Response:**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": 1,
    "title": "Judul Berita",
    "slug": "judul-berita",
    // ... other fields
  }
}
```

### Create News
```
POST /api/news
```

**Request Body:**
```json
{
  "title": "Judul Berita Baru",
  "slug": "judul-berita-baru",
  "excerpt": "Ringkasan singkat",
  "content": "Isi berita lengkap...",
  "featuredImage": "/uploads/news/image.jpg",
  "category": "berita",
  "authorId": 1,
  "isPublished": true,
  "tags": ["prestasi", "siswa"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "News created successfully",
  "data": {
    "id": 1,
    // ... created news data
  }
}
```

### Update News
```
PUT /api/news/[id]
```

**Request Body:** Same as Create (all fields optional)

### Delete News
```
DELETE /api/news/[id]
```

**Response:**
```json
{
  "success": true,
  "message": "News deleted successfully",
  "data": null
}
```

---

## 👨‍🏫 Teachers API

### Get All Teachers
```
GET /api/teachers
```

**Query Parameters:**
- `page` (optional): Page number, default: 1
- `limit` (optional): Items per page, default: 10
- `search` (optional): Search in name, position
- `active` (optional): Filter active teachers (true/false)

### Get Single Teacher
```
GET /api/teachers/[id]
```

### Create Teacher
```
POST /api/teachers
```

**Request Body:**
```json
{
  "name": "Nama Guru",
  "photo": "/uploads/teachers/foto.jpg",
  "position": "Guru Matematika",
  "orderPosition": 1,
  "isActive": true
}
```

### Update Teacher
```
PUT /api/teachers/[id]
```

### Delete Teacher
```
DELETE /api/teachers/[id]
```

---

## 🎓 Majors API (Coming Soon)

```
GET    /api/majors
POST   /api/majors
GET    /api/majors/[id]
PUT    /api/majors/[id]
DELETE /api/majors/[id]
```

---

## 🏢 Facilities API (Coming Soon)

```
GET    /api/facilities
POST   /api/facilities
GET    /api/facilities/[id]
PUT    /api/facilities/[id]
DELETE /api/facilities/[id]
```

---

## 🏆 Achievements API (Coming Soon)

```
GET    /api/achievements
POST   /api/achievements
GET    /api/achievements/[id]
PUT    /api/achievements/[id]
DELETE /api/achievements/[id]
```

---

## 📅 Agendas API (Coming Soon)

```
GET    /api/agendas
POST   /api/agendas
GET    /api/agendas/[id]
PUT    /api/agendas/[id]
DELETE /api/agendas/[id]
```

---

## 👥 Users API (Coming Soon)

```
GET    /api/users
POST   /api/users
GET    /api/users/[id]
PUT    /api/users/[id]
DELETE /api/users/[id]
```

---

## 📮 Contact Messages API (Coming Soon)

```
GET    /api/contact-messages
POST   /api/contact-messages
GET    /api/contact-messages/[id]
PUT    /api/contact-messages/[id]
DELETE /api/contact-messages/[id]
```

---

## Error Responses

**Validation Error (400):**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "title",
      "message": "Title is required"
    }
  ]
}
```

**Not Found (404):**
```json
{
  "success": false,
  "message": "News not found",
  "errors": null
}
```

**Server Error (500):**
```json
{
  "success": false,
  "message": "Internal server error",
  "errors": null
}
```

---

## Testing with cURL

### Create News
```bash
curl -X POST http://localhost:3000/api/news \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test News",
    "slug": "test-news",
    "category": "berita",
    "content": "Test content",
    "isPublished": true
  }'
```

### Get All News
```bash
curl http://localhost:3000/api/news?page=1&limit=10
```

### Get Single News
```bash
curl http://localhost:3000/api/news/1
```

### Update News
```bash
curl -X PUT http://localhost:3000/api/news/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Title"}'
```

### Delete News
```bash
curl -X DELETE http://localhost:3000/api/news/1
```

---

## Next Steps

1. ✅ Setup Prisma ORM
2. ✅ Create API Routes for News & Teachers
3. 🔄 Add Authentication (NextAuth.js)
4. 🔄 Create remaining API endpoints
5. 🔄 File upload handling
6. 🔄 Connect with Admin Panel UI
