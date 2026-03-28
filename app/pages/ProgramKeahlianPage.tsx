"use client";

import React, { useState, useEffect } from 'react';
import { usePage } from '@/lib/usePage';
import { ArrowLeft, User, Award, Grid3x3, BookOpen, Calendar, ChevronLeft, Clock, Users, Briefcase } from 'lucide-react';

interface ProgramData {
  nama: string;
  deskripsi: string;
  kepalaProgram: string;
  gambarCover: string;
  logoProgram: string;
  konsentrasiKeahlian: string[];
  gallery: string[];
}

const ProgramKeahlianPage: React.FC = () => {
  const { setPage } = usePage();
  const [programData, setProgramData] = useState<ProgramData | null>(null);
  const [loading, setLoading] = useState(true);
  const [logoError, setLogoError] = useState(false);
  const [coverError, setCoverError] = useState(false);

  useEffect(() => {
    // Simulasi data program - bisa diganti dengan API call
    const mockData: ProgramData = {
      nama: "Rekayasa Perangkat Lunak dan Basis Data",
      deskripsi: "Program Keahlian Rekayasa Perangkat Lunak dan Basis Data dirancang untuk membekali siswa dengan kompetensi lengkap dalam pengembangan software modern. Siswa akan mempelajari seluruh siklus pengembangan software, dari perencanaan hingga deployment, dengan fokus pada teknologi terkini yang digunakan di industri.\n\nKurikulum kami menggabungkan teori fundamental dengan praktik hands-on melalui project-based learning, ensuring graduates siap menghadapi tantangan dunia kerja digital yang dinamis. Siswa akan dibimbing oleh instruktur berpengalaman dan mendapatkan kesempatan untuk bekerja pada proyek-proyek real yang relevan dengan industri.",
      kepalaProgram: "Dr. Ahmad Wijaya, S.Kom., M.Kom",
      gambarCover: "/images/programs/rpl-cover.jpg",
      logoProgram: "/images/programs/rpl-logo.png",
      konsentrasiKeahlian: [
        "Pengembangan Web Application",
        "Pengembangan Mobile Application", 
        "Basis Data dan Administrasi",
        "Software Testing dan Quality Assurance",
        "DevOps dan Cloud Computing",
        "UI/UX Design dan Development"
      ],
      gallery: [
        "/images/programs/rpl-1.jpg",
        "/images/programs/rpl-2.jpg", 
        "/images/programs/rpl-3.jpg",
        "/images/programs/rpl-4.jpg",
        "/images/programs/rpl-5.jpg",
        "/images/programs/rpl-6.jpg"
      ]
    };

    setTimeout(() => {
      setProgramData(mockData);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0268ab] mx-auto mb-3"></div>
          <p className="text-gray-500 text-sm">Memuat data program...</p>
        </div>
      </div>
    );
  }

  if (!programData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Data program tidak ditemukan</p>
          <button
            onClick={() => setPage('home')}
            className="bg-[#0268ab] text-white px-6 py-2 rounded-lg hover:bg-[#014a8f] transition-colors"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  const contentParagraphs = programData.deskripsi.split('\n').filter(Boolean);

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Cover Image */}
      <div className="relative h-80 md:h-96 bg-gray-900">
        {!coverError && (
          <img
            src={programData.gambarCover}
            alt={programData.nama}
            className="w-full h-full object-cover"
            onError={() => setCoverError(true)}
          />
        )}
        {/* Black Overlay 30% */}
        <div className="absolute inset-0 bg-black/30"></div>
        
        {/* Content Overlay - Split Layout */}
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="flex flex-col lg:flex-row items-center justify-between w-full">
              {/* Left Side - Text Content (60%) */}
              <div className="w-full lg:w-3/5 text-white text-left lg:text-left mb-6 lg:mb-0">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
                  {programData.nama}
                </h1>
                <div className="flex items-center text-white/90 text-sm md:text-base">
                  <User className="w-4 h-4 mr-2" />
                  <span>Kepala Program: {programData.kepalaProgram}</span>
                </div>
              </div>
              
              {/* Right Side - Student Image (40%) */}
              <div className="w-full lg:w-2/5 flex items-end justify-center lg:justify-end h-full">
                <img 
                  src="/images/IMG_7944.PNG"
                  alt="Student"
                  className="h-full max-h-80 md:max-h-96 object-contain object-bottom"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Header - News Style */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
            <span className="text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase">Detail Program Keahlian</span>
            
            <button
              onClick={() => setPage('home')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-[#0268ab] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Kembali ke daftar
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Content - No Card Wrapper */}
            <article className="lg:col-span-8">
              <div className="p-6 md:p-8">
                {/* Meta Information - News Style */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="bg-[#0268ab] text-white text-xs font-semibold px-2.5 py-1 rounded-lg">
                    Program Keahlian
                  </span>
                </div>

                {/* Content - News Style */}
                <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                  {contentParagraphs.map((paragraph, idx) => (
                    <p key={`program-${idx}`}>{paragraph}</p>
                  ))}
                </div>

                {/* Kepala Program Section */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="flex items-center mb-6">
                    <User className="w-5 h-5 text-[#0268ab] mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Kepala Program Keahlian</h3>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      {!logoError ? (
                        <img 
                          src={programData.logoProgram}
                          alt="Logo Program"
                          className="w-12 h-12 object-contain"
                          onError={() => setLogoError(true)}
                        />
                      ) : (
                        <User className="w-10 h-10 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-1">
                        {programData.kepalaProgram}
                      </h4>
                      <p className="text-gray-600 text-sm mb-2">Kepala Program Keahlian {programData.nama}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Award className="w-3 h-3 mr-1" />
                        <span>Sertifikat Kompetensi Pendidikan</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Konsentrasi Keahlian Section */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="flex items-center mb-6">
                    <Award className="w-5 h-5 text-[#0268ab] mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Konsentrasi Keahlian</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    {programData.konsentrasiKeahlian.map((konsentrasi, index) => (
                      <div key={index} className="flex items-center py-2 px-3 bg-gray-50 rounded-lg">
                        <div className="w-1.5 h-1.5 bg-[#0268ab] rounded-full mr-3"></div>
                        <span className="text-gray-700 text-sm">{konsentrasi}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>

            {/* Sidebar - News Style */}
            <aside className="lg:col-span-4 space-y-6">
              {/* Program Info - No Card Wrapper */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Profil Program</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600 flex items-center">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Jenjang
                    </span>
                    <span className="text-sm font-medium text-gray-900">SMK</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600 flex items-center">
                      <Award className="w-4 h-4 mr-2" />
                      Akreditasi
                    </span>
                    <span className="text-sm font-medium text-gray-900">A</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600 flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      Alumni
                    </span>
                    <span className="text-sm font-medium text-gray-900">1,200+</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-600 flex items-center">
                      <Briefcase className="w-4 h-4 mr-2" />
                      Industri Partner
                    </span>
                    <span className="text-sm font-medium text-gray-900">50+</span>
                  </div>
                </div>
              </div>

              {/* Related Programs - No Card Wrapper */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Program Lainnya</h3>
                <div className="space-y-3">
                  {[
                    "Multimedia",
                    "Teknik Mesin", 
                    "Teknik Elektronika",
                    "Akuntansi"
                  ].map((program, index) => (
                    <button key={index} className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors group">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 group-hover:text-[#0268ab] transition-colors">{program}</span>
                        <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-[#0268ab] transition-colors rotate-180" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          </div>

          {/* Gallery Section - True Full Width Outside Grid */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center mb-6">
                <Grid3x3 className="w-5 h-5 text-[#0268ab] mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Gallery Program</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
                {programData.gallery.map((image, index) => (
                  <div key={index} className="aspect-square overflow-hidden rounded-lg">
                    <img 
                      src={image}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = `https://picsum.photos/seed/rpl${index}/400/400.jpg`;
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProgramKeahlianPage;
