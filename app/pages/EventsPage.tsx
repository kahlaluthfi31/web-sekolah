import React, { useState } from 'react';
import { Calendar, Clock, MapPin, ChevronRight, Users, CalendarDays, Map, Ticket, Star } from 'lucide-react';
import { usePageHeader } from '@/lib/usePageHeader';

const EventsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const header = usePageHeader('events');

  const upcomingEvents = [
    {
      id: 1,
      month: "Feb",
      day: "15",
      year: "2024",
      category: "Akademik",
      title: "Science Fair Exhibition SMKN 1 Ciamis",
      description: "Pameran sains tahunan yang menampilkan inovasi dan proyek penelitian siswa dari semua jurusan.",
      time: "09:00 - 15:00",
      location: "Auditorium Utama",
      organizer: "Jurusan IPA",
      participants: "120+ Siswa",
      color: "bg-blue-500",
    },
    {
      id: 2,
      month: "Mar",
      day: "10",
      year: "2024",
      category: "Olahraga",
      title: "Hari Olahraga Tahunan",
      description: "Kompetisi olahraga sekolah yang menampilkan atletik, olahraga tim, dan permainan tradisional.",
      time: "08:30 - 17:00",
      location: "Lapangan Olahraga",
      organizer: "Jurusan Penjaskes",
      participants: "Semua Siswa",
      color: "bg-green-500",
    },
    {
      id: 3,
      month: "Apr",
      day: "22",
      year: "2024",
      category: "Seni",
      title: "Konser Musik Musim Semi",
      description: "Pertunjukan malam oleh orkestra dan paduan suara sekolah yang menampilkan musik klasik dan modern.",
      time: "18:30 - 20:30",
      location: "Pusat Seni Pertunjukan",
      organizer: "Jurusan Seni Musik",
      participants: "50+ Penampil",
      color: "bg-pink-500",
    },
    {
      id: 4,
      month: "May",
      day: "08",
      year: "2024",
      category: "Komunitas",
      title: "Konferensi Orang Tua-Guru",
      description: "Pertemuan triwulanan untuk membahas kemajuan siswa, prestasi akademik, dan rencana pengembangan.",
      time: "13:00 - 19:00",
      location: "Berbagai Ruang Kelas",
      organizer: "Administrasi",
      participants: "Orang Tua & Guru",
      color: "bg-orange-500",
    }
  ];

  const pastEvents = [
    {
      id: 5,
      month: "Jan",
      day: "20",
      year: "2024",
      category: "Akademik",
      title: "Orientasi Akademik Tahun Baru",
      description: "Upacara pembukaan dan orientasi untuk semester musim semi dengan pidato kunci.",
      time: "10:00 - 12:00",
      location: "Aula Utama",
      organizer: "Administrasi",
      participants: "Semua Siswa",
      color: "bg-purple-500",
      attendees: "850+ Peserta",
      status: "Selesai"
    },
    {
      id: 6,
      month: "Jan",
      day: "15",
      year: "2024",
      category: "Kompetisi",
      title: "Kejuaraan Debat Antar Sekolah",
      description: "Kompetisi debat regional dengan tim dari 10 sekolah berbeda yang berkompetisi.",
      time: "09:00 - 16:00",
      location: "Ruang Konferensi",
      organizer: "Jurusan Bahasa",
      participants: "40 Debatir",
      color: "bg-indigo-500",
      attendees: "200+ Penonton",
      status: "Selesai"
    }
  ];

  const currentEvents = activeTab === 'upcoming' ? upcomingEvents : pastEvents;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Contact Page Style */}
      <section className="pt-24 pb-16 relative overflow-hidden">
        {/* Background dengan gradien opacity dari atas ke bawah menggunakan warna primary */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0268ab] via-[#0268ab]/80 to-transparent"></div>
        
        {/* Dotted pattern overlay */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-0 left-0 w-full h-full" 
               style={{
                 backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3Ccircle cx='10' cy='10' r='1.5'/%3E%3Ccircle cx='50' cy='10' r='1.5'/%3E%3Ccircle cx='10' cy='50' r='1.5'/%3E%3Ccircle cx='50' cy='50' r='1.5'/%3E%3C/g%3E%3C/svg%3E")`,
                 backgroundSize: '60px 60px'
               }} />
        </div>
        
        {/* School-related floating elements */}
        <div className="absolute top-10 right-20 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 left-20 w-48 h-48 bg-white opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
        
        {/* Event-related illustrations */}
        <div className="absolute top-20 left-10 text-white/10">
          <Calendar className="w-16 h-16" strokeWidth={1} />
        </div>
        <div className="absolute top-32 right-16 text-white/10">
          <CalendarDays className="w-12 h-12" strokeWidth={1} />
        </div>
        <div className="absolute bottom-20 left-32 text-white/10">
          <MapPin className="w-14 h-14" strokeWidth={1} />
        </div>
        <div className="absolute top-1/3 right-32 text-white/10">
          <Clock className="w-10 h-10" strokeWidth={1} />
        </div>
        
        {/* School elements */}
        <div className="absolute bottom-32 right-20 text-white/8">
          <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3L1 9L12 15L23 9L12 3Z" />
            <path d="M12 15L12 21" />
            <path d="M8 17L8 21" />
            <path d="M16 17L16 21" />
            <path d="M1 9L1 21L23 21L23 9" />
          </svg>
        </div>
        <div className="absolute top-40 left-40 text-white/8">
          <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3H5C3.89 3 3 3.89 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.89 20.1 3 19 3ZM19 5V19H5V5H19Z" />
            <path d="M12 7C13.66 7 15 8.34 15 10C15 11.66 13.66 13 12 13C10.34 13 9 11.66 9 10C9 8.34 10.34 7 12 7ZM12 15C14.67 15 17 16.17 17 17.5V19H7V17.5C7 16.17 9.33 15 12 15Z" />
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight whitespace-pre-line">
              {header.displayTitle || header.title}
            </h1>
            {header.subtitle && (
              <p className="text-white/90 text-base md:text-lg leading-relaxed max-w-2xl">
                {header.subtitle}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Upcoming Events Section - Timeline Style */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-12 border-b border-gray-200 pb-6">
            <span className="text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase">Acara Mendatang</span>
            <span className="text-xs text-gray-400">01 / 03</span>
          </div>
          
          <p className="text-gray-600 text-lg max-w-2xl mb-16">
            Acara-acara penting yang akan datang di SMKN 1 Ciamis
          </p>
          
          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-full p-1 mb-16 max-w-md">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`flex-1 px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
                activeTab === 'upcoming'
                  ? 'bg-[#0268ab] text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Acara Mendatang
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`flex-1 px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
                activeTab === 'past'
                  ? 'bg-[#0268ab] text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Acara Selesai
            </button>
          </div>

          {/* Timeline Layout */}
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-6 md:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#0268ab] via-[#0268ab]/50 to-transparent"></div>
            
            {/* Timeline Events */}
            <div className="space-y-8">
              {currentEvents.map((event, index) => (
                <div key={event.id} className="relative flex items-start gap-6 md:gap-8">
                  {/* Timeline Dot */}
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-[#0268ab] to-[#014a8f] flex items-center justify-center shadow-md relative z-10">
                      <Calendar className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                    {/* Connecting Line */}
                    {index < currentEvents.length - 1 && (
                      <div className="absolute top-12 md:top-14 left-1/2 transform -translate-x-1/2 w-0.5 h-8 bg-gradient-to-b from-[#0268ab]/30 to-transparent"></div>
                    )}
                  </div>

                  {/* Event Card */}
                  <div className="flex-1 min-w-0">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 overflow-hidden group">
                      {/* Event Header with Date Badge */}
                      <div className="relative bg-gradient-to-r from-[#0268ab]/5 to-[#0268ab]/2 p-4 md:p-5">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="bg-[#0268ab] text-white text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full">
                                {event.category}
                              </span>
                              <span className="text-xs text-gray-500">{event.year}</span>
                            </div>
                            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 group-hover:text-[#0268ab] transition-colors">
                              {event.title}
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                              {event.description}
                            </p>
                          </div>
                          
                          {/* Date Card */}
                          <div className="flex-shrink-0">
                            <div className="bg-white rounded-lg shadow-sm p-3 text-center min-w-[80px]">
                              <div className="text-xs font-bold uppercase tracking-widest text-[#0268ab] mb-0.5">
                                {event.month}
                              </div>
                              <div className="text-xl md:text-2xl font-black text-gray-900 leading-none">
                                {event.day}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Event Details */}
                      <div className="p-4 md:p-5">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <div className="w-8 h-8 rounded-full bg-[#0268ab]/10 flex items-center justify-center flex-shrink-0">
                              <Clock className="w-4 h-4 text-[#0268ab]" />
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">Waktu</div>
                              <div className="text-sm font-medium">{event.time}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <div className="w-8 h-8 rounded-full bg-[#0268ab]/10 flex items-center justify-center flex-shrink-0">
                              <MapPin className="w-4 h-4 text-[#0268ab]" />
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">Lokasi</div>
                              <div className="text-sm font-medium">{event.location}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <div className="w-8 h-8 rounded-full bg-[#0268ab]/10 flex items-center justify-center flex-shrink-0">
                              <Users className="w-4 h-4 text-[#0268ab]" />
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">Peserta</div>
                              <div className="text-sm font-medium">{event.participants}</div>
                            </div>
                          </div>
                        </div>

                        {/* Organizer Info */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
                              <Calendar className="w-3.5 h-3.5 text-gray-600" />
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">Penyelenggara</div>
                              <div className="text-sm font-medium text-gray-900">{event.organizer}</div>
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            {activeTab === 'upcoming' ? (
                              <>
                                <button className="flex items-center gap-1 text-[#0268ab] text-xs font-semibold hover:translate-x-1 transition-transform">
                                  Detail <ChevronRight className="h-3 w-3" />
                                </button>
                                <button className="bg-[#0268ab] text-white px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-[#014a8f] transition-all duration-300">
                                  Daftar
                                </button>
                              </>
                            ) : (
                              <>
                                <button className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-gray-200 transition-all duration-300">
                                  Galeri
                                </button>
                                <button className="flex items-center gap-1 text-[#0268ab] text-xs font-semibold hover:translate-x-1 transition-transform">
                                  Ringkasan <ChevronRight className="h-3 w-3" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Past Event Status */}
                        {activeTab === 'past' && 'attendees' in event && (
                          <div className="mt-4 p-3 bg-green-50 border-l-4 border-green-500 rounded-r">
                            <div className="flex items-center">
                              <span className="text-green-700 font-semibold text-xs mr-2">✓ {(event as unknown as { status: string }).status}</span>
                              <span className="text-gray-600 text-xs">• {(event as unknown as { attendees: string }).attendees}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Event Categories Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-12 border-b border-gray-200 pb-6">
            <span className="text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase">Kategori Acara</span>
            <span className="text-xs text-gray-400">02 / 03</span>
          </div>
          
          <p className="text-gray-600 text-lg max-w-2xl mb-16">
            Berbagai jenis acara yang diselenggarakan di SMKN 1 Ciamis
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Calendar,
                title: "Academik",
                desc: "Olimpiade, kompetisi sains, dan kegiatan akademik lainnya",
                color: "from-blue-500 to-blue-600"
              },
              {
                icon: Star,
                title: "Seni & Budaya",
                desc: "Festival seni, konser musik, dan pertunjukan budaya",
                color: "from-purple-500 to-purple-600"
              },
              {
                icon: Users,
                title: "Olahraga",
                desc: "Kompetisi olahraga, hari olahraga, dan kegiatan fisik",
                color: "from-green-500 to-green-600"
              },
              {
                icon: Map,
                title: "Komunitas",
                desc: "Konferensi orang tua, workshop, dan kegiatan sosial",
                color: "from-orange-500 to-orange-600"
              }
            ].map((category, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                {/* Logo SMKN 1 Ciamis - Pojok Bawah Kanan BNW - Half Visible - Larger & More Visible */}
                <div className="absolute -bottom-12 -right-12 w-40 h-40 opacity-15">
                  <div className="w-full h-full flex items-center justify-center">
                    <img 
                      src="/images/logosmeabnw.svg" 
                      alt="SMKN 1 Ciamis Logo" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0268ab]/10 to-[#0268ab]/5 flex items-center justify-center mb-6">
                    <category.icon className="w-8 h-8 text-[#0268ab]" />
                  </div>
                  <h4 className="font-bold text-xl text-gray-900 mb-3">{category.title}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{category.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Event Registration Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-12 border-b border-gray-200 pb-6">
            <span className="text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase">Informasi Pendaftaran</span>
            <span className="text-xs text-gray-400">03 / 03</span>
          </div>
          
          <p className="text-gray-600 text-lg max-w-2xl mb-16">
            Cara mendaftar dan berpartisipasi dalam acara sekolah
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Ticket,
                title: "Pendaftaran Online",
                desc: "Daftar secara online melalui website sekolah",
                steps: ["Isi formulir pendaftaran", "Upload dokumen yang diperlukan", "Konfirmasi pembayaran"]
              },
              {
                icon: Calendar,
                title: "Pendaftaran Offline",
                desc: "Datang langsung ke sekolah untuk mendaftar",
                steps: ["Kunjungi ruang administrasi", "Bawa dokumen asli", "Selesaikan pendaftaran di tempat"]
              },
              {
                icon: Users,
                title: "Syarat & Ketentuan",
                desc: "Persyaratan yang harus dipenuhi peserta",
                steps: ["Siswa aktif SMKN 1 Ciamis", "Melampirkan izin orang tua", "Mematuhi peraturan acara"]
              }
            ].map((info, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0268ab]/10 to-[#0268ab]/5 flex items-center justify-center mb-6">
                  <info.icon className="w-8 h-8 text-[#0268ab]" />
                </div>
                <h4 className="font-bold text-xl text-gray-900 mb-3">{info.title}</h4>
                <p className="text-sm text-gray-600 mb-6">{info.desc}</p>
                <div className="space-y-3">
                  {info.steps.map((step, j) => (
                    <div key={j} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#0268ab]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-[#0268ab]">{j + 1}</span>
                      </div>
                      <span className="text-sm text-gray-600">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventsPage;
