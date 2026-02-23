const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()
const cats = [
  { name: 'Ruang', color: 'bg-blue-50 text-blue-700', sortOrder: 1 },
  { name: 'Fasilitas Belajar', color: 'bg-indigo-50 text-indigo-700', sortOrder: 2 },
  { name: 'Fasilitas Olahraga', color: 'bg-green-50 text-green-700', sortOrder: 3 },
  { name: 'Fasilitas Penunjang', color: 'bg-amber-50 text-amber-700', sortOrder: 4 },
  { name: 'Teknologi', color: 'bg-purple-50 text-purple-700', sortOrder: 5 },
]
Promise.all(cats.map(c => p.facilityCategoryConfig.upsert({ where: { name: c.name }, update: {}, create: c })))
  .then(r => console.log('Seeded', r.length, 'categories'))
  .catch(e => console.error(e))
  .finally(() => p.$disconnect())
