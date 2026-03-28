"use client";

/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect } from 'react';
import { usePage } from '@/lib/usePage';
import { User, Award, ChevronLeft, Users, Briefcase } from 'lucide-react';

interface ProgramData {
  nama: string;
  kodeProgram: string | null;
  deskripsi: string;
  kepalaProgram: string;
  gambarCover: string;
  logoProgram: string;
  studentImage: string | null;
  headerBgColor: string | null;
  activeStudents: number | null;
  totalAchievements: number;
  alumniCount: number | null;
  industryPartners: number | null;
  konsentrasiKeahlian: Array<{ id: number; name: string; description?: string | null; gallery: string[] }>;
}

const ProgramKeahlianPage: React.FC = () => {
  const { setPage } = usePage();
  const [programData, setProgramData] = useState<ProgramData | null>(null);
  const [relatedPrograms, setRelatedPrograms] = useState<Array<{ id: number; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [logoError, setLogoError] = useState(false);
  const [coverError, setCoverError] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState<Array<{ src: string; compName: string; compId: number }>>([]);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [galleryTitle, setGalleryTitle] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadProgram = async () => {
      setLoading(true);
      try {
        const storedId = sessionStorage.getItem('selected_major_id');
        let majorId = storedId;

        if (!majorId) {
          const listRes = await fetch('/api/majors/list');
          const listJson = await listRes.json();
          const firstMajor = Array.isArray(listJson?.data) ? listJson.data[0] : null;
          majorId = firstMajor?.id ? String(firstMajor.id) : null;
        }

        if (!majorId) {
          if (mounted) setProgramData(null);
          return;
        }

        const [res, achievementsRes, listRes] = await Promise.all([
          fetch(`/api/majors/${majorId}`),
          fetch('/api/achievements?limit=1&page=1'),
          fetch('/api/majors/list'),
        ]);
        const json = await res.json();
        const achievementsJson = await achievementsRes.json();
        const listJson = await listRes.json();
        if (!mounted) return;

        if (json?.success && json.data) {
          const d = json.data;
          const baseComps = Array.isArray(d.competencies)
            ? d.competencies
                .filter((c: { id?: number; name?: string }) => Boolean(c?.name && c?.id))
                .map((c: { id: number; name?: string; description?: string | null }) => ({
                  id: c.id,
                  name: c.name as string,
                  description: c.description || null,
                  gallery: [] as string[],
                }))
            : [];

          const galleries = await Promise.all(
            baseComps.map(async (comp: { id: number; name: string; description?: string | null; gallery: string[] }) => {
              try {
                const gRes = await fetch(`/api/competencies/${comp.id}/gallery`);
                const gJson = await gRes.json();
                const images = Array.isArray(gJson?.data)
                  ? gJson.data.map((g: { imageUrl?: string }) => g.imageUrl).filter(Boolean)
                  : [];
                return { ...comp, gallery: images };
              } catch {
                return { ...comp, gallery: [] };
              }
            })
          );

          setProgramData({
            nama: d.name || '-',
            kodeProgram: d.code ?? null,
            deskripsi: d.description || '',
            kepalaProgram: d.headOfMajor || '-',
            gambarCover: d.image || '',
            logoProgram: d.icon || '',
            studentImage: d.studentImage ?? null,
            headerBgColor: d.headerBgColor ?? null,
            activeStudents: typeof d.activeStudents === 'number' ? d.activeStudents : null,
            totalAchievements: achievementsJson?.pagination?.total ?? 0,
            alumniCount: typeof d.alumniCount === 'number' ? d.alumniCount : null,
            industryPartners: typeof d.industryPartners === 'number' ? d.industryPartners : null,
            konsentrasiKeahlian: galleries,
          });

          const listData = Array.isArray(listJson?.data) ? listJson.data : [];
          const filtered = listData.filter((item: { id?: number }) => item?.id && item.id !== d.id);
          setRelatedPrograms(filtered.map((item: { id: number; name: string }) => ({ id: item.id, name: item.name })));
        } else {
          setProgramData(null);
        }
      } catch {
        if (mounted) setProgramData(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadProgram();

    return () => {
      mounted = false;
    };
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
  const combinedGallery = programData.konsentrasiKeahlian.flatMap((comp) =>
    comp.gallery.map((src) => ({ src, compName: comp.name, compId: comp.id }))
  );

  const openGallery = (
    images: Array<{ src: string; compName: string; compId: number }>,
    startIndex: number,
    title: string
  ) => {
    setGalleryImages(images);
    setGalleryIndex(startIndex);
    setGalleryTitle(title);
    setGalleryOpen(true);
  };

  const closeGallery = () => setGalleryOpen(false);
  const showPrev = () => setGalleryIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  const showNext = () => setGalleryIndex((prev) => (prev + 1) % galleryImages.length);

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Cover Image */}
      <div
        className="relative h-80 md:h-96"
        style={{ backgroundColor: programData.headerBgColor || '#111827' }}
      >
        {!coverError && programData.gambarCover && (
          <img
            src={programData.gambarCover}
            alt={programData.nama}
            className="w-full h-full object-cover"
            onError={() => setCoverError(true)}
          />
        )}
        {/* Black Overlay 30% */}
        <div className="absolute inset-0 bg-black/60"></div>
        
        {/* Content Overlay - Split Layout */}
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="flex flex-col lg:flex-row items-center justify-between w-full">
              {/* Left Side - Text Content (60%) */}
              <div className="w-full lg:w-3/5 text-white text-left lg:text-left mb-6 lg:mb-0">
                {programData.logoProgram && !logoError ? (
                  <img
                    src={programData.logoProgram}
                    alt={`Logo ${programData.nama}`}
                    className="w-18 h-18 object-contain mb-4 rounded-full bg-white/80 border border-white/20"
                    onError={() => setLogoError(true)}
                  />
                ) : null}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                  {programData.nama}
                </h1>
                <div className="flex items-center text-white/90 text-sm md:text-base">
                  <User className="w-4 h-4 mr-2" />
                  <span>Kepala Program : {programData.kepalaProgram}</span>
                </div>
              </div>
              
              {/* Right Side - Student Image (40%) */}
              <div className="w-full lg:w-2/5 flex items-end justify-center lg:justify-end h-full">
                {programData.studentImage ? (
                  <img 
                    src={programData.studentImage}
                    alt="Student"
                    className="h-full max-h-80 md:max-h-96 object-contain object-bottom"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : null}
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
                {/* <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="flex items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Kepala Program Keahlian</h3>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                      {!logoError && programData.logoProgram ? (
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
                      
                    </div>
                  </div>
                </div> */}

                {/* Konsentrasi Keahlian Section */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="flex items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Konsentrasi Keahlian</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    {programData.konsentrasiKeahlian.map((konsentrasi, index) => (
                      <div key={index} className="flex items-start gap-3 py-3 px-4 bg-gray-50 rounded-lg">
                        <div className="w-1.5 h-1 bg-[#0268ab] rounded-full mt-2"></div>
                        <div>
                          <p className="text-gray-800 text-sm font-semibold">{konsentrasi.name}</p>
                          {konsentrasi.description && (
                            <p className="text-gray-600 text-xs mt-1 leading-relaxed">
                              {konsentrasi.description}
                            </p>
                          )}
                        </div>
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
                      <Users className="w-4 h-4 mr-2" />
                      Siswa Aktif
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {programData.activeStudents ?? 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600 flex items-center">
                      <Award className="w-4 h-4 mr-2" />
                      Total Prestasi
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {programData.totalAchievements}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600 flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      Alumni
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {programData.alumniCount ?? 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-600 flex items-center">
                      <Briefcase className="w-4 h-4 mr-2" />
                      Industri Partner
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {programData.industryPartners ?? 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Related Programs - No Card Wrapper */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Program Lainnya</h3>
                {relatedPrograms.length === 0 ? (
                  <p className="text-sm text-gray-500">Tidak ada data program</p>
                ) : (
                  <div className="space-y-3">
                    {relatedPrograms.map((program) => (
                      <button
                        key={program.id}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors group"
                        onClick={() => {
                          sessionStorage.setItem('selected_major_id', String(program.id));
                          window.location.reload();
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700 group-hover:text-[#0268ab] transition-colors">{program.name}</span>
                          <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-[#0268ab] transition-colors rotate-180" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </aside>
          </div>

          {/* Gallery Section - True Full Width Outside Grid */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Galeri Program</h3>
                <span className="text-xs text-gray-400">{combinedGallery.length} foto</span>
              </div>

              {combinedGallery.length === 0 ? (
                <p className="text-sm text-gray-500">Belum ada galeri konsentrasi keahlian.</p>
              ) : (
                <div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-1">
                    {combinedGallery.slice(0, 5).map((image, index) => (
                      <button
                        key={`${image.compId}-${index}`}
                        type="button"
                        className="aspect-square overflow-hidden rounded-lg"
                        onClick={() => openGallery(combinedGallery, index, 'Galeri Program')}
                      >
                        <img
                          src={image.src}
                          alt={`Galeri ${image.compName} ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.currentTarget.src = `https://picsum.photos/seed/${image.compId}-${index}/400/400.jpg`;
                          }}
                        />
                      </button>
                    ))}
                    {combinedGallery.length > 5 && (
                      <button
                        type="button"
                        className="aspect-square rounded-2xl bg-gray-50 border border-gray-200 flex flex-col items-center justify-center gap-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => openGallery(combinedGallery, 0, 'Galeri Program')}
                      >
                        <span className="w-10 h-10 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xl">
                          +
                        </span>
                        <span>More Photos</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {galleryOpen && galleryImages.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute top-4 right-4 text-white text-2xl"
            onClick={closeGallery}
          >
            ×
          </button>
          <div className="max-w-5xl w-full">
            <div className="flex items-center justify-between mb-3 text-white">
              <div>
                <h4 className="text-sm font-semibold">{galleryTitle}</h4>
                <p className="text-xs text-white/70">
                  Konsentrasi : {galleryImages[galleryIndex]?.compName || '-'}
                </p>
              </div>
              <span className="text-xs text-white/70">
                {galleryIndex + 1} / {galleryImages.length}
              </span>
            </div>
            <div className="relative">
              <button
                type="button"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/10 text-white px-3 py-2 rounded-lg"
                onClick={showPrev}
              >
                ‹
              </button>
              <img
                src={galleryImages[galleryIndex]?.src}
                alt={`Galeri ${galleryTitle} ${galleryIndex + 1}`}
                className="w-full max-h-[75vh] object-contain rounded-xl"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/10 text-white px-3 py-2 rounded-lg"
                onClick={showNext}
              >
                ›
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgramKeahlianPage;
