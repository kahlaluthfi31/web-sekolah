
import React, { useState } from 'react';
import { ArrowRight, Clock, MapPin, ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';

const UpcomingEvents: React.FC = () => {
  const [activeDay, setActiveDay] = useState(24);

  const events = [
    {
      month: "Mar", day: "10", year: "2026",
      fullDate: "Selasa, 10 Maret 2026",
      time: "08:00 - 12:00 WIB",
      category: "Akademik",
      tags: ["Siswa", "Wajib", "Terbuka"],
      title: "Ujian Tengah Semester Genap Tahun Ajaran 2025/2026",
      desc: "Pelaksanaan Ujian Tengah Semester untuk seluruh siswa kelas X, XI, dan XII. Siswa diwajibkan hadir tepat waktu dengan membawa kartu ujian.",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=900",
      status: "Akan Datang",
      statusColor: "bg-[#0268ab]",
    },
    {
      month: "Mar", day: "15", year: "2026",
      fullDate: "Minggu, 15 Maret 2026",
      time: "07:30 - 17:00 WIB",
      category: "Olahraga",
      tags: ["OSIS", "Siswa", "Terbuka"],
      title: "Pekan Olahraga dan Seni SMKN 1 Ciamis 2026",
      desc: "Rangkaian kegiatan olahraga dan seni tahunan yang diikuti seluruh siswa. Terdapat berbagai cabang perlombaan antar kelas.",
      image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=900",
      status: "Akan Datang",
      statusColor: "bg-[#0268ab]",
    },
    {
      month: "Mar", day: "22", year: "2026",
      fullDate: "Sabtu, 22 Maret 2026",
      time: "09:00 - 14:00 WIB",
      category: "Pameran",
      tags: ["Umum", "Alumni", "Terbuka"],
      title: "Pameran Karya Siswa dan Expo Program Keahlian",
      desc: "Pameran hasil karya terbaik siswa dari seluruh program keahlian. Terbuka untuk masyarakat umum dan calon siswa baru.",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=900",
      status: "Akan Datang",
      statusColor: "bg-[#0268ab]",
    },
    {
      month: "Feb", day: "10", year: "2026",
      fullDate: "Selasa, 10 Februari 2026",
      time: "13:00 - 16:00 WIB",
      category: "Rapat",
      tags: ["Guru", "Pimpinan", "Internal"],
      title: "Rapat Koordinasi Awal Semester Genap",
      desc: "Rapat koordinasi seluruh dewan guru dan staf untuk persiapan pelaksanaan kegiatan semester genap.",
      image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=900",
      status: "Telah Selesai",
      statusColor: "bg-gray-400",
    },
  ];

  const featured = events[0];
  const listEvents = events.slice(1);

  // Mini calendar data
  const calDays = [
    { label: 'Min', date: 22, isRed: true },
    { label: 'Sen', date: 23 },
    { label: 'Sel', date: 24, isActive: true },
    { label: 'Rab', date: 25 },
    { label: 'Kam', date: 26 },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top label row */}
        <div className="flex items-center justify-between mb-12 border-b border-gray-200 pb-6">
          <span className="text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase">Agenda Sekolah</span>
          <span className="text-xs text-gray-400">03 / 04</span>
        </div>

        {/* Headline */}
        <div className="mb-10">
          <h2 className="text-5xl sm:text-6xl font-light text-gray-900 leading-[1.1] tracking-tight">
            Agenda <em className="not-italic font-bold text-[#0268ab]">Mendatang</em>
          </h2>
        </div>

        {/* Main layout: left content + right sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left: Featured + list */}
          <div className="lg:col-span-8 flex flex-col gap-4">

            {/* Featured event card */}
            <div className="relative rounded-2xl overflow-hidden h-80 group cursor-pointer">
              <img
                src={featured.image}
                alt={featured.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

              {/* Status badge */}
              <div className="absolute top-4 right-4">
                <span className={`${featured.statusColor} text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-white/70 inline-block"></span>
                  {featured.status}
                </span>
              </div>

              {/* Content overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-white/60 text-xs mb-2">{featured.time} &nbsp;|&nbsp; {featured.fullDate}</p>
                <h3 className="text-white text-xl font-bold leading-snug mb-2 line-clamp-2">{featured.title}</h3>
                <p className="text-white/60 text-xs leading-relaxed line-clamp-2 mb-4">{featured.desc}</p>
                <div className="flex items-center flex-wrap gap-2">
                  <span className="bg-[#0268ab] text-white text-xs font-semibold px-3 py-1 rounded-full">{featured.category}</span>
                  {featured.tags.map((tag, i) => (
                    <span key={i} className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">{tag}</span>
                  ))}
                  <button className="ml-auto bg-white text-gray-900 text-xs font-semibold px-4 py-1.5 rounded-full hover:bg-[#0268ab] hover:text-white transition-colors duration-200">
                    Selengkapnya
                  </button>
                </div>
              </div>
            </div>

            {/* List events */}
            <div className="flex flex-col gap-3">
              {listEvents.map((event, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-4 rounded-2xl p-4 cursor-pointer transition-all duration-200 ${event.status === 'Telah Selesai' ? 'bg-gray-50 hover:bg-gray-100' : 'bg-blue-50 hover:bg-blue-100'}`}
                >
                  {/* Thumbnail */}
                  <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400 mb-0.5">{event.time} &nbsp;·&nbsp; {event.fullDate}</p>
                    <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">{event.title}</h4>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-xs text-gray-400">{event.category}</span>
                      <span className="text-gray-300">·</span>
                      {event.tags.slice(0, 2).map((tag, j) => (
                        <span key={j} className="text-xs text-gray-400">{tag}</span>
                      ))}
                    </div>
                  </div>

                  {/* Status button */}
                  <button
                    className={`flex-shrink-0 text-xs font-semibold px-4 py-1.5 rounded-full text-white ${event.statusColor}`}
                  >
                    {event.status}
                  </button>
                </div>
              ))}
            </div>

          </div>

          {/* Right: Calendar sidebar */}
          <div className="lg:col-span-4">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 sticky top-6">
              <h3 className="text-base font-bold text-[#0268ab] mb-1">Agenda Sekolah</h3>
              <p className="text-xs text-gray-400 mb-5">Dapatkan informasi terkait semua kegiatan SMKN 1 Ciamis.</p>

              {/* Mini Calendar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                    <ChevronLeft className="w-4 h-4 text-gray-400" />
                  </button>
                  <span className="text-sm font-semibold text-gray-700">Maret 2026</span>
                  <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-1 text-center">
                  {calDays.map((d) => (
                    <div key={d.date} className="flex flex-col items-center gap-1">
                      <span className={`text-[10px] font-semibold uppercase ${d.isRed ? 'text-red-400' : 'text-gray-400'}`}>{d.label}</span>
                      <button
                        onClick={() => setActiveDay(d.date)}
                        className={`w-9 h-9 rounded-full text-sm font-bold transition-colors duration-200 ${
                          activeDay === d.date
                            ? 'bg-[#0268ab] text-white'
                            : d.isRed
                            ? 'text-red-400 hover:bg-red-50'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {d.date}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* No event state */}
              <div className="flex flex-col items-center py-6 text-center border-t border-gray-100">
                <CalendarDays className="w-10 h-10 text-gray-200 mb-3" />
                <p className="text-sm font-semibold text-[#0268ab] mb-1">Tidak ada agenda</p>
                <p className="text-xs text-gray-400">Belum ada agenda untuk saat ini</p>
              </div>

              {/* See all */}
              <button className="w-full mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-gray-900 hover:text-[#0268ab] transition-colors duration-200 border-t border-gray-100 pt-4">
                Lihat Semua Agenda
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;



