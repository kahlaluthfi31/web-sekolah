import prisma from '../lib/prisma'
import bcrypt from 'bcryptjs'

async function main() {
  console.log('🌱 Start seeding...')

  // Password yang mudah diingat untuk testing
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  // Create Super Admin
  const admin = await prisma.user.upsert({
    where: { email: 'superadmin@smkn1ciamis.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'superadmin@smkn1ciamis.com',
      password: hashedPassword,
      role: 'superadmin',
      status: 'active',
    },
  })
  console.log('✅ User:', admin.email, '| Password: admin123')

  // Create Admin (guru piket / tim medsos)
  const adminUser = await prisma.user.upsert({
    where: { email: 'medsos@sekolah.com' },
    update: {},
    create: {
      name: 'Tim Medsos',
      email: 'medsos@sekolah.com',
      password: hashedPassword,
      role: 'admin',
      status: 'active',
    },
  })
  console.log('✅ User:', adminUser.email, '| Password: admin123')

  // Create User (pending approval)
  const regularUser = await prisma.user.upsert({
    where: { email: 'budi@gmail.com' },
    update: {},
    create: {
      name: 'Budi Siswa',
      email: 'budi@gmail.com',
      password: hashedPassword,
      role: 'user',
      status: 'inactive',
    },
  })
  console.log('✅ User:', regularUser.email, '| Password: admin123 (Status: pending)')

  // ---- Sample News ----
  const news1 = await prisma.news.upsert({
    where: { slug: 'selamat-datang' },
    update: {},
    create: {
      title: 'Selamat Datang di Website SMK',
      slug: 'selamat-datang',
      excerpt: 'Selamat datang di website resmi SMK kami',
      content: 'Ini adalah berita pertama di website sekolah.',
      category: 'pengumuman',
      authorId: admin.id,
      isPublished: true,
      publishedAt: new Date(),
    },
  })
  console.log('✅ News:', news1.title)

  const news2 = await prisma.news.upsert({
    where: { slug: 'juara-1-lomba-robotika' },
    update: {},
    create: {
      title: 'Juara 1 Lomba Robotika Nasional',
      slug: 'juara-1-lomba-robotika',
      excerpt: 'Siswa SMK meraih juara 1 di lomba robotika tingkat nasional',
      content: 'Tim robotika SMK kami berhasil meraih juara 1.',
      category: 'kejuaraan',
      authorId: admin.id,
      isPublished: true,
      publishedAt: new Date(),
    },
  })
  console.log('✅ News:', news2.title)

  // ---- Sample Positions (Jabatan) ----
  const positionCount = await prisma.position.count()
  if (positionCount === 0) {
    await prisma.position.create({ data: { name: 'Komite', description: 'Komite sekolah', orderPosition: 1 } })
    await prisma.position.create({ data: { name: 'Kepala Sekolah', description: 'Pimpinan tertinggi di sekolah', orderPosition: 2 } })
    await prisma.position.create({ data: { name: 'Wakil Kepala Sekolah', description: 'Wakil pimpinan sekolah', orderPosition: 3 } })
    await prisma.position.create({ data: { name: 'Tata Usaha', description: 'Tenaga administrasi sekolah', orderPosition: 4 } })
    await prisma.position.create({ data: { name: 'Dewan Guru', description: 'Tenaga pendidik / pengajar', orderPosition: 5 } })
    await prisma.position.create({ data: { name: 'Tenaga Honorer', description: 'Tenaga pendidik non-PNS', orderPosition: 6 } })
    await prisma.position.create({ data: { name: 'Penjaga Sekolah', description: 'Tenaga kebersihan & keamanan', orderPosition: 7 } })
    console.log('✅ Created 7 positions')
  }

  // ---- Sample Teachers ----
  const teacherCount = await prisma.teacher.count()
  if (teacherCount === 0) {
    const kepsek = await prisma.teacher.create({ data: { nip: '196801011990011001', name: 'Drs. Ahmad Budiman, M.Pd', position: 'Kepala Sekolah', education: 'S2 Pendidikan', status: 'ACTIVE', joinDate: new Date('1990-01-01'), orderPosition: 1 } })
    const wakasek = await prisma.teacher.create({ data: { nip: '197205151995012002', name: 'Sri Wahyuni, S.Pd', position: 'Wakil Kepala Sekolah', education: 'S1 Pendidikan', status: 'ACTIVE', joinDate: new Date('1995-01-15'), orderPosition: 2 } })
    await prisma.teacher.create({ data: { nip: '198003201998031003', name: 'Bambang Sutrisno, S.Kom', position: 'Dewan Guru', education: 'S1 Teknik Informatika', status: 'ACTIVE', joinDate: new Date('1998-03-20'), orderPosition: 3 } })
    await prisma.teacher.create({ data: { nip: '197506101997021004', name: 'Siti Nurhaliza, S.Kom', position: 'Dewan Guru', education: 'S1 Teknik Informatika', status: 'ACTIVE', joinDate: new Date('1997-02-10'), orderPosition: 4 } })
    await prisma.teacher.create({ data: { nip: '196505051988011005', name: 'Drs. Hendra Wijaya', position: 'Tata Usaha', education: 'S1 Administrasi', status: 'RETIRED', joinDate: new Date('1988-01-05'), orderPosition: 5 } })
    await prisma.teacher.create({ data: { nip: '198507151999032006', name: 'Rina Marlina, S.Pd', position: 'Dewan Guru', education: 'S1 Pendidikan Bahasa', status: 'ACTIVE', joinDate: new Date('1999-03-15'), orderPosition: 6 } })
    await prisma.teacher.create({ data: { name: 'Asep Gunawan', position: 'Tenaga Honorer', education: 'SMA', status: 'ACTIVE', joinDate: new Date('2015-07-01'), orderPosition: 7 } })
    await prisma.teacher.create({ data: { name: 'Dedi Supriatna', position: 'Penjaga Sekolah', education: 'SMA', status: 'ACTIVE', joinDate: new Date('2010-01-01'), orderPosition: 8 } })
    await prisma.teacher.create({ data: { nip: '197008201992011007', name: 'Drs. Tatang Suherman', position: 'Komite', education: 'S1 Ekonomi', status: 'ACTIVE', joinDate: new Date('1992-01-20'), orderPosition: 9 } })
    const exKepsek = await prisma.teacher.create({ data: { nip: '196901011989011008', name: 'Drs. Jajang Permana, M.Pd', position: 'Dewan Guru', education: 'S2 Pendidikan', status: 'TRANSFERRED', joinDate: new Date('1989-01-01'), orderPosition: 10 } })
    await prisma.teacher.create({ data: { nip: '196601011987011009', name: 'Drs. Ujang Suhandi', position: 'Dewan Guru', education: 'S1 Pendidikan', status: 'RESIGNED', joinDate: new Date('1987-01-01'), orderPosition: 11 } })
    console.log('✅ Created 11 sample teachers')

    // Principal History
    await prisma.principalHistory.create({ data: { teacherId: kepsek.id, role: 'KEPALA_SEKOLAH', startYear: 2018, endYear: null, note: 'Kepala Sekolah saat ini' } })
    await prisma.principalHistory.create({ data: { teacherId: wakasek.id, role: 'WAKIL_KEPALA_SEKOLAH', startYear: 2020, endYear: null, note: 'Wakil Kepala Sekolah saat ini' } })
    await prisma.principalHistory.create({ data: { teacherId: exKepsek.id, role: 'KEPALA_SEKOLAH', startYear: 2010, endYear: 2018, note: 'Pindah tugas' } })
    console.log('✅ Created principal histories')
  }

  // ---- Sample Majors ----
  const m1 = await prisma.major.findFirst({ where: { code: 'TKJ' } })
  if (!m1) {
    await prisma.major.create({
      data: {
        name: 'Teknik Komputer dan Jaringan', code: 'TKJ',
        description: 'Program keahlian jaringan komputer',
        headOfMajor: 'Bambang Sutrisno, S.Kom', isActive: true, orderPosition: 1,
      },
    })
    console.log('✅ Major: TKJ')
  }

  const m2 = await prisma.major.findFirst({ where: { code: 'RPL' } })
  if (!m2) {
    await prisma.major.create({
      data: {
        name: 'Rekayasa Perangkat Lunak', code: 'RPL',
        description: 'Program keahlian pengembangan aplikasi',
        headOfMajor: 'Siti Nurhaliza, S.Kom', isActive: true, orderPosition: 2,
      },
    })
    console.log('✅ Major: RPL')
  }

  // ---- Sample Facilities ----
  const f1 = await prisma.facility.findFirst({ where: { name: 'Laboratorium Komputer' } })
  if (!f1) {
    await prisma.facility.create({ data: { category: 'lab', name: 'Laboratorium Komputer', description: 'Lab komputer dengan 40 PC', quantity: 2, condition: 'baik', orderPosition: 1 } })
    console.log('✅ Facility: Laboratorium Komputer')
  }

  const f2 = await prisma.facility.findFirst({ where: { name: 'Perpustakaan' } })
  if (!f2) {
    await prisma.facility.create({ data: { category: 'perpustakaan', name: 'Perpustakaan', description: 'Perpustakaan 5000+ buku', quantity: 1, condition: 'baik', orderPosition: 2 } })
    console.log('✅ Facility: Perpustakaan')
  }

  // ---- Sample Achievement ----
  let achievementId = 1
  const ach = await prisma.studentAchievement.findFirst({ where: { achievementName: 'Juara 1 Lomba Jaringan' } })
  if (!ach) {
    const a = await prisma.studentAchievement.create({
      data: { studentName: 'Budi Santoso', class: 'XII TKJ 1', achievementName: 'Juara 1 Lomba Jaringan', competitionName: 'LKS Tingkat Provinsi', level: 'provinsi', position: 'Juara 1', year: 2024, status: 'approved', verifiedById: admin.id, verifiedAt: new Date() },
    })
    achievementId = a.id
    console.log('✅ Achievement: Juara 1 Lomba Jaringan')
  } else {
    achievementId = ach.id
  }

  // ---- Sample Agenda ----
  const ag = await prisma.agenda.findFirst({ where: { title: 'PPDB Tahun Ajaran 2024/2025' } })
  if (!ag) {
    await prisma.agenda.create({
      data: { title: 'PPDB Tahun Ajaran 2024/2025', description: 'Pendaftaran Peserta Didik Baru', eventDate: new Date('2024-06-01'), eventTime: new Date('1970-01-01T08:00:00'), timeEnd: new Date('1970-01-01T15:00:00'), location: 'GOR SMKN 1', organizer: 'Panitia PPDB', status: 'upcoming' },
    })
    console.log('✅ Agenda: PPDB Tahun Ajaran 2024/2025')
  }

  // ---- Sample Contact Info ----
  const ci1 = await prisma.contactInfo.findFirst({ where: { infoType: 'address' } })
  if (!ci1) await prisma.contactInfo.create({ data: { infoType: 'address', label: 'Alamat', value: 'Jl. Pendidikan No. 123', orderPosition: 1, isActive: true } })
  
  const ci2 = await prisma.contactInfo.findFirst({ where: { infoType: 'phone' } })
  if (!ci2) await prisma.contactInfo.create({ data: { infoType: 'phone', label: 'Telepon', value: '(021) 1234-5678', orderPosition: 2, isActive: true } })
  
  const ci3 = await prisma.contactInfo.findFirst({ where: { infoType: 'email' } })
  if (!ci3) await prisma.contactInfo.create({ data: { infoType: 'email', label: 'Email', value: 'info@smk.sch.id', orderPosition: 3, isActive: true } })
  console.log('✅ Contact Info seeded')

  // ---- Sample Alumni (3 data) - All pending status ----
  const al1 = await prisma.alumniSubmission.findFirst({ where: { alumniName: 'Siti Rahayu' } })
  if (!al1) {
    await prisma.alumniSubmission.create({ data: { alumniName: 'Siti Rahayu', graduationYear: 2020, major: 'Akuntansi', currentOccupation: 'Staff Akuntan', company: 'PT Bank BCA', story: 'Saya langsung diterima bekerja di Bank BCA setelah lulus. Ilmu akuntansi yang saya pelajari sangat bermanfaat.', nisn: '0012345678', status: 'pending' } })
    console.log('✅ Alumni: Siti Rahayu')
  }

  const al2 = await prisma.alumniSubmission.findFirst({ where: { alumniName: 'Rizki Pratama' } })
  if (!al2) {
    await prisma.alumniSubmission.create({ data: { alumniName: 'Rizki Pratama', graduationYear: 2021, major: 'TKJ', currentOccupation: 'Network Engineer', company: 'PT Telkom', story: 'Saya bekerja sebagai Network Engineer di Telkom. Terima kasih SMK!', nisn: '0012345679', status: 'pending' } })
    console.log('✅ Alumni: Rizki Pratama')
  }

  const al3 = await prisma.alumniSubmission.findFirst({ where: { alumniName: 'Dewi Lestari' } })
  if (!al3) {
    await prisma.alumniSubmission.create({ data: { alumniName: 'Dewi Lestari', graduationYear: 2019, major: 'Pemasaran', currentOccupation: 'Digital Marketing Manager', company: 'Tokopedia', story: 'Saya menjadi Digital Marketing Manager. Skill marketing dari SMK sangat membantu karir saya.', nisn: '0012345680', status: 'pending' } })
    console.log('✅ Alumni: Dewi Lestari')
  }

  // ---- Sample Comments (5 data) ----
  const commentCount = await prisma.comment.count()
  if (commentCount === 0) {
    await prisma.comment.createMany({
      data: [
        { contentType: 'news', contentId: news1.id, userId: regularUser.id, commentText: 'Website baru ini sangat keren!', status: 'pending' },
        { contentType: 'news', contentId: news2.id, userId: regularUser.id, commentText: 'Selamat untuk tim robotika!', status: 'approved', approvedById: admin.id, approvedAt: new Date() },
        { contentType: 'news', contentId: news1.id, userId: adminUser.id, commentText: 'Terima kasih atas apresiasinya.', status: 'approved', approvedById: admin.id, approvedAt: new Date() },
        { contentType: 'news', contentId: news2.id, userId: regularUser.id, commentText: 'Kapan ada lomba robotika lagi?', status: 'pending' },
        { contentType: 'achievement', contentId: achievementId, userId: regularUser.id, commentText: 'Keren banget prestasinya!', status: 'rejected' },
      ],
    })
    console.log('✅ Created 5 sample comments')
  }

  // ---- Sample Contact Messages (8 data, berbagai format nomor WA) ----
  const msgCount = await prisma.contactMessage.count()
  if (msgCount === 0) {
    await prisma.contactMessage.createMany({
      data: [
        { name: 'Andi Wijaya', email: 'andi@gmail.com', phone: '+62 852-9401-3457', subject: 'Pertanyaan PPDB 2024', message: 'Halo, saya ingin bertanya mengenai jadwal dan syarat pendaftaran PPDB tahun 2024. Apakah masih ada kuota?', status: 'unread' },
        { name: 'Maya Sari', email: 'maya@yahoo.com', phone: '+62 852-9401-3457', subject: 'Kerjasama Magang', message: 'Selamat siang, perusahaan kami PT Maju Bersama tertarik untuk menjalin kerjasama program magang dengan sekolah. Bagaimana prosedurnya?', status: 'unread' },
        { name: 'Pak Budi Santoso', email: 'budi@gmail.com', phone: '+62 852-9401-3457', subject: 'Jadwal Rapor', message: 'Mohon informasi jadwal pengambilan rapor semester ganjil tahun ajaran 2024/2025. Terima kasih.', status: 'read' },
        { name: 'Sari Dewi', email: 'sari.dewi@gmail.com', phone: '+62 852-9401-3457', subject: 'Ekstrakulikuler', message: 'Anak saya ingin mendaftar ekstrakulikuler. Apa saja pilihan yang tersedia dan bagaimana cara mendaftarnya?', status: 'unread' },
        { name: 'Hendra Kurniawan', email: 'hendra.k@yahoo.com', phone: '+62 852-9401-3457', subject: 'Beasiswa Prestasi', message: 'Apakah sekolah menyediakan program beasiswa untuk siswa berprestasi? Bagaimana cara mengajukan?', status: 'unread' },
        { name: 'Bu Ratna Wulandari', email: 'ratna@gmail.com', phone: '+62 852-9401-3457', subject: 'Kunjungan Industri', message: 'Kami dari DU/DI ingin mengundang siswa untuk kunjungan industri. Siapa yang dapat kami hubungi lebih lanjut?', status: 'replied' },
        { name: 'Doni Setiawan', email: 'doni.s@hotmail.com', phone: null, subject: 'Informasi Jurusan', message: 'Saya orang tua calon siswa. Mohon dikirimkan brosur atau informasi lengkap mengenai jurusan-jurusan yang tersedia di sekolah ini.', status: 'read' },
        { name: 'Fitri Handayani', email: 'fitri.h@gmail.com', phone: '+62 852-9401-3457', subject: 'Pendaftaran Ulang', message: 'Saya ingin menanyakan batas waktu pendaftaran ulang untuk siswa baru tahun ajaran 2025/2026. Terima kasih.', status: 'unread' },
      ],
    })
    console.log('✅ Created 8 sample contact messages')
  }

  console.log('\n🎉 Seeding finished!')
  console.log('\n📝 Login Credentials:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('Super Admin:')
  console.log('  Email: superadmin@smkn1ciamis.com')
  console.log('  Password: admin123')
  console.log('')
  console.log('Admin:')
  console.log('  Email: medsos@sekolah.com')
  console.log('  Password: admin123')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
