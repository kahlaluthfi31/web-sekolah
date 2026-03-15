
import React from 'react';
import Image from 'next/image';
import { Camera, Users, GraduationCap, Globe, Heart, Music, Trophy, BookOpen, CalendarDays, Award, Palette, Gamepad2, Mic, Dribbble, Target, Sparkles } from 'lucide-react';

const StudentLifePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="pt-24 pb-16 relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0268ab] via-[#0268ab]/80 to-transparent"></div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-15" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 right-20 text-white/10">
          <GraduationCap className="w-16 h-16" />
        </div>
        <div className="absolute top-40 left-40 text-white/8">
          <Users className="w-20 h-20" />
        </div>
        <div className="absolute bottom-20 right-40 text-white/10">
          <Trophy className="w-24 h-24" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Kehidupan 
              <span className="block text-5xl md:text-6xl lg:text-7xl font-light mt-2">Siswa</span>
            </h1>
            <p className="text-white/90 text-base md:text-lg leading-relaxed max-w-2xl">
              Temukan pengalaman belajar yang dinamis di SMKN 1 Ciamis. Dari kegiatan akademik hingga ekstrakurikuler, setiap siswa berkembang dalam lingkungan yang mendukung dan inspiratif.
            </p>
          </div>
        </div>
      </section>

      {/* Prestasi Siswa - Pindah ke Atas */}
      <section className="py-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header - Landing Page Style */}
          <div className="flex items-center justify-between mb-12 border-b border-gray-200 pb-6">
            <span className="text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase">Prestasi Siswa</span>
            <span className="text-xs text-gray-400">01 / 04</span>
          </div>
          
          <p className="text-gray-600 text-lg max-w-2xl mb-16">
            Bangga dengan pencapaian luar biasa siswa di berbagai bidang
          </p>
          
          {/* Achievement Cards dengan Different Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Juara 1 LKS Tingkat Provinsi",
                category: "Kompetisi Akademik",
                desc: "Tim Teknik Komputer berhasil meraih juara 1 dalam LKS Tingkat Provinsi Jawa Barat 2024",
                students: "Tim TKJ",
                year: "2024",
                icon: Trophy,
                level: "provincial"
              },
              {
                title: "Best School Award",
                category: "Prestasi Institusional",
                desc: "SMKN 1 Ciamis meraih penghargaan Best School Award tahun 2024",
                students: "Sekolah",
                year: "2024",
                icon: Award,
                level: "national"
              },
              {
                title: "Juara Umum Olimpiade Sains",
                category: "Kompetisi Akademik",
                desc: "Tim Olimpiade Sains berhasil meraih juara umum tingkat kabupaten 2023",
                students: "Tim Olimpiade",
                year: "2023",
                icon: Target,
                level: "regional"
              }
            ].map((achievement, i) => (
              <div key={i} className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
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
                  
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0268ab]/10 to-[#0268ab]/5 flex items-center justify-center mb-6">
                    <achievement.icon className="w-8 h-8 text-[#0268ab]" />
                  </div>
                  <h4 className="font-bold text-xl text-gray-900 mb-3">{achievement.title}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">{achievement.desc}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#0268ab] font-medium">{achievement.students}</span>
                    <span className="text-gray-500">{achievement.year}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ekstrakurikuler */}
      <section className="py-16 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header - Landing Page Style */}
          <div className="flex items-center justify-between mb-12 border-b border-gray-200 pb-6">
            <span className="text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase">Ekstrakurikuler</span>
            <span className="text-xs text-gray-400">02 / 04</span>
          </div>
          
          <p className="text-gray-600 text-lg max-w-2xl mb-16">
            Berbagai pilihan kegiatan untuk mengembangkan bakat dan minat siswa
          </p>
          
          {/* Programs Grid Style - Sama seperti Section Jurusan */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12">
            {[
              { 
                name: "Pramuka", 
                desc: "Membangun karakter disiplin, kepemimpinan, dan kecintaan pada alam",
                icon: Users
              },
              { 
                name: "PMR", 
                desc: "Belajar pertolongan pertama dan kesiapsiagaan dalam situasi darurat",
                icon: Heart
              },
              { 
                name: "Basket", 
                desc: "Tim basket sekolah yang berkompetisi di tingkat kabupaten dan provinsi",
                icon: Dribbble
              },
              { 
                name: "Futsal", 
                desc: "Olahraga populer yang mengajarkan kerjasama tim dan strategi",
                icon: Trophy
              },
              { 
                name: "Paduan Suara", 
                desc: "Mengembangkan bakat musik dan kerjasama dalam harmoni",
                icon: Mic
              },
              { 
                name: "Seni Tari", 
                desc: "Melestarikan budaya tradisional dan modern melalui tari",
                icon: Music
              }
            ].map((activity, i) => (
              <div key={i} className="flex gap-4 group">

                {/* Logo / Icon - Sama seperti Section Jurusan */}
                <div className="shrink-0">
                  <div className="w-14 h-14 rounded-full bg-[#0268ab] flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                    <activity.icon className="w-7 h-7" strokeWidth={2} />
                  </div>
                </div>

                {/* Content - Sama seperti Section Jurusan */}
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[#0268ab] mb-3 leading-tight">
                    {activity.name}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {activity.desc}
                  </p>
                </div>

              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kegiatan Rutin */}
      <section className="py-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header - Landing Page Style */}
          <div className="flex items-center justify-between mb-12 border-b border-gray-200 pb-6">
            <span className="text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase">Kegiatan Rutin</span>
            <span className="text-xs text-gray-400">03 / 04</span>
          </div>
          
          <p className="text-gray-600 text-lg max-w-2xl mb-16">
            Kegiatan terjadwal yang mendukung pembelajaran dan pengembangan siswa
          </p>
          
          {/* Clean Simple Layout - Tanpa Card */}
          <div className="space-y-6">
            {[
              {
                name: "Senam Pagi",
                time: "06:30 - 07:00",
                days: "Setiap Hari",
                desc: "Memulai hari dengan gerakan sehat untuk meningkatkan konsentrasi dan kesehatan fisik siswa",
                icon: Heart
              },
              {
                name: "Apel Pagi",
                time: "07:00 - 07:30",
                days: "Senin & Kamis",
                desc: "Upacara Bendera dan pengumuman penting untuk membina disiplin dan nasionalisme",
                icon: GraduationCap
              },
              {
                name: "Istirahat & Makan Siang",
                time: "12:00 - 13:00",
                days: "Setiap Hari",
                desc: "Waktu istirahat untuk makan siang dan interaksi sosial antar siswa",
                icon: Users
              },
              {
                name: "Kebersihan Lingkungan",
                time: "13:00 - 14:00",
                days: "Jumat",
                desc: "Gotong royong membersihkan lingkungan sekolah untuk menciptakan environment yang nyaman",
                icon: Sparkles
              }
            ].map((routine, i) => (
              <div key={i} className="flex items-start gap-6 py-6 border-b border-gray-200 last:border-b-0 hover:bg-white/50 transition-colors duration-300 -mx-4 px-4 rounded-lg">
                {/* Icon - Simple & Clean */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0268ab]/10 to-[#0268ab]/5 flex items-center justify-center flex-shrink-0">
                  <routine.icon className="w-6 h-6 text-[#0268ab]" />
                </div>
                
                {/* Content - Clean Layout */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-xl font-semibold text-gray-900 mb-0">{routine.name}</h4>
                    <div className="flex items-center gap-3 ml-4 shrink-0">
                      <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-full">{routine.days}</span>
                      <span className="text-xs text-[#0268ab] font-semibold bg-[#0268ab]/10 px-2 py-1 rounded-full">{routine.time}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-sm">{routine.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Galeri Kegiatan - Balanced Bento Grid */}
      <section className="py-16 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header - Landing Page Style */}
          <div className="flex items-center justify-between mb-12 border-b border-gray-200 pb-6">
            <span className="text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase">Galeri Kegiatan</span>
            <span className="text-xs text-gray-400">04 / 04</span>
          </div>
          
          <p className="text-gray-600 text-lg max-w-2xl mb-16">
            Dokumentasi momen berharga siswa dalam berbagai kegiatan sekolah
          </p>
          
          {/* Balanced Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Featured - Large (2x2) */}
            <div className="relative group bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-gray-200 transition-all duration-300 cursor-pointer md:col-span-2 lg:col-span-2 lg:row-span-2">
              <div className="h-64 md:h-80 lg:h-96 flex items-center justify-center p-8">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Upacara Bendera</h3>
                  <p className="text-sm text-gray-500">Kegiatan Rutin • Setiap Senin</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h4 className="text-white font-semibold text-base mb-1">Upacara Bendera Nasional</h4>
                  <p className="text-white/80 text-xs mb-2">Kegiatan rutin setiap Senin pagi</p>
                  <p className="text-white/90 text-xs leading-relaxed">
                    Upacara Bendera merupakan kegiatan rutin yang menumbuhkan rasa cinta tanah air, disiplin, dan nasionalisme.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Small Cards - Right Column */}
            <div className="relative group bg-white rounded-lg overflow-hidden border border-gray-100 hover:border-gray-200 transition-all duration-300 cursor-pointer">
              <div className="h-40 md:h-44 flex items-center justify-center p-4">
                <div className="text-center">
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Lomba Olahraga</h4>
                  <p className="text-xs text-gray-500">Kompetisi</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white/80 text-xs">Kompetisi</span>
                    <span className="text-white/60 text-xs">Mar 2024</span>
                  </div>
                  <h5 className="text-white font-semibold text-sm mb-1">Lomba Olahraga</h5>
                  <p className="text-white/90 text-xs leading-relaxed">Kompetisi olahraga antar kelas</p>
                </div>
              </div>
            </div>
            
            <div className="relative group bg-white rounded-lg overflow-hidden border border-gray-100 hover:border-gray-200 transition-all duration-300 cursor-pointer">
              <div className="h-40 md:h-44 flex items-center justify-center p-4">
                <div className="text-center">
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Praktikum Lab</h4>
                  <p className="text-xs text-gray-500">Akademik</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white/80 text-xs">Akademik</span>
                    <span className="text-white/60 text-xs">Feb 2024</span>
                  </div>
                  <h5 className="text-white font-semibold text-sm mb-1">Praktikum Lab</h5>
                  <p className="text-white/90 text-xs leading-relaxed">Praktikum di laboratorium</p>
                </div>
              </div>
            </div>
            
            {/* Bottom Row - Medium Cards */}
            <div className="relative group bg-white rounded-lg overflow-hidden border border-gray-100 hover:border-gray-200 transition-all duration-300 cursor-pointer">
              <div className="h-40 md:h-44 flex items-center justify-center p-4">
                <div className="text-center">
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Pentas Seni</h4>
                  <p className="text-xs text-gray-500">Ekstrakurikuler</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white/80 text-xs">Ekstrakurikuler</span>
                    <span className="text-white/60 text-xs">Apr 2024</span>
                  </div>
                  <h5 className="text-white font-semibold text-sm mb-1">Pentas Seni</h5>
                  <p className="text-white/90 text-xs leading-relaxed">Pertunjukan seni dan budaya</p>
                </div>
              </div>
            </div>
            
            <div className="relative group bg-white rounded-lg overflow-hidden border border-gray-100 hover:border-gray-200 transition-all duration-300 cursor-pointer">
              <div className="h-40 md:h-44 flex items-center justify-center p-4">
                <div className="text-center">
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Study Tour</h4>
                  <p className="text-xs text-gray-500">Edukasi</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white/80 text-xs">Edukasi</span>
                    <span className="text-white/60 text-xs">Jan 2024</span>
                  </div>
                  <h5 className="text-white font-semibold text-sm mb-1">Study Tour</h5>
                  <p className="text-white/90 text-xs leading-relaxed">Kunjungan industri</p>
                </div>
              </div>
            </div>
            
            <div className="relative group bg-white rounded-lg overflow-hidden border border-gray-100 hover:border-gray-200 transition-all duration-300 cursor-pointer">
              <div className="h-40 md:h-44 flex items-center justify-center p-4">
                <div className="text-center">
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Workshop</h4>
                  <p className="text-xs text-gray-500">Pengembangan</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white/80 text-xs">Pengembangan</span>
                    <span className="text-white/60 text-xs">Mei 2024</span>
                  </div>
                  <h5 className="text-white font-semibold text-sm mb-1">Workshop</h5>
                  <p className="text-white/90 text-xs leading-relaxed">Workshop keterampilan</p>
                </div>
              </div>
            </div>
            
            <div className="relative group bg-white rounded-lg overflow-hidden border border-gray-100 hover:border-gray-200 transition-all duration-300 cursor-pointer">
              <div className="h-40 md:h-44 flex items-center justify-center p-4">
                <div className="text-center">
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Graduation</h4>
                  <p className="text-xs text-gray-500">Prestasi</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white/80 text-xs">Prestasi</span>
                    <span className="text-white/60 text-xs">Jun 2024</span>
                  </div>
                  <h5 className="text-white font-semibold text-sm mb-1">Graduation</h5>
                  <p className="text-white/90 text-xs leading-relaxed">Wisuda dan kelulusan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StudentLifePage;


