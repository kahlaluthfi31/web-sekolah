"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import type { PannellumConfig } from "@/components/VirtualTourViewer";
import { Compass, Info, Route, ExternalLink } from "lucide-react";

const VirtualTourViewer = dynamic(() => import("@/components/VirtualTourViewer"), { ssr: false });

const CampusPage: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [facilities, setFacilities] = useState<FacilityCard[]>([]);
  const [loadingFacilities, setLoadingFacilities] = useState(true);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [tourConfig, setTourConfig] = useState<PannellumConfig | null>(null);
  const [loadingTour, setLoadingTour] = useState(true);
  const [tourError, setTourError] = useState<string>("");

  type FacilityCard = {
    id: number;
    name: string;
    description: string | null;
    category: string;
    image: string | null;
    quantity: number;
    quantityType?: "jumlah" | "kapasitas";
    condition: string;
  };

  // Auto-scrolling logic for the gallery
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationFrameId: number;
    const scrollSpeed = 0.5;

    const scroll = () => {
      if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
        scrollContainer.scrollLeft = 0;
      } else {
        scrollContainer.scrollLeft += scrollSpeed;
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Load facilities data
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/facilities?limit=12");
        const json = await res.json();
        if (json?.success && Array.isArray(json.data)) {
          setFacilities(json.data);
        }
      } catch (err) {
        console.error("Failed to load facilities", err);
      } finally {
        setLoadingFacilities(false);
      }
    };
    load();
  }, []);

  // Load virtual tour configuration
  useEffect(() => {
    const loadTour = async () => {
      try {
        const res = await fetch("/api/virtual-tour/config");
        const json = await res.json();
        if (json?.success && json.data) {
          setTourConfig(json.data as PannellumConfig);
        } else {
          setTourError(json?.message || "Gagal memuat virtual tour.");
        }
      } catch (err) {
        console.error("Failed to load virtual tour config", err);
        setTourError("Gagal memuat virtual tour.");
      } finally {
        setLoadingTour(false);
      }
    };
    loadTour();
  }, []);

  const [galleryImages] = useState([
    {
      title: "Gedung Utama",
      desc: "Fasilitas utama sekolah dengan arsitektur modern",
      img: "https://picsum.photos/seed/smk-building-main/800/600.jpg"
    },
    {
      title: "Laboratorium Komputer",
      desc: "Fasilitas pembelajaran teknologi informasi",
      img: "https://picsum.photos/seed/smk-computer-lab/600/400.jpg"
    },
    {
      title: "Ruang Kelas",
      desc: "Lingkungan belajar yang nyaman dan modern",
      img: "https://picsum.photos/seed/smk-classroom/600/400.jpg"
    },
    {
      title: "Perpustakaan Digital",
      desc: "Sumber belajar modern dengan koleksi lengkap",
      img: "https://picsum.photos/seed/smk-library/400/800.jpg"
    },
    {
      title: "Laboratorium IPA",
      desc: "Fasilitas praktikum sains yang lengkap",
      img: "https://picsum.photos/seed/smk-science-lab/800/400.jpg"
    },
    {
      title: "Gedung Olahraga",
      desc: "Fasilitas olahraga untuk kegiatan ekstrakurikuler",
      img: "https://picsum.photos/seed/smk-sports-hall/400/400.jpg"
    },
    {
      title: "Kantin Sekolah",
      desc: "Area bersantai untuk siswa dan guru",
      img: "https://picsum.photos/seed/smk-canteen/400/400.jpg"
    }
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const totalPages = Math.ceil(galleryImages.length / itemsPerPage);
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentImages = galleryImages.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="pt-24 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-[#0268ab] via-[#0268ab]/80 to-transparent"></div>

        <div className="absolute inset-0 opacity-15">
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3Ccircle cx='10' cy='10' r='1.5'/%3E%3Ccircle cx='50' cy='10' r='1.5'/%3E%3Ccircle cx='10' cy='50' r='1.5'/%3E%3Ccircle cx='50' cy='50' r='1.5'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <div className="absolute top-10 right-20 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 left-20 w-48 h-48 bg-white opacity-5 rounded-full blur-3xl"></div>

        <div className="absolute top-20 left-10 text-white/10">
          <Compass className="w-16 h-16" strokeWidth={1} />
        </div>
        <div className="absolute top-32 right-16 text-white/10">
          <Route className="w-12 h-12" strokeWidth={1} />
        </div>
        <div className="absolute bottom-20 left-32 text-white/10">
          <Info className="w-14 h-14" strokeWidth={1} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Sarana
              <span className="block text-5xl md:text-6xl lg:text-7xl font-light mt-2">Prasarana</span>
            </h1>
            <p className="text-white/90 text-base md:text-lg leading-relaxed max-w-2xl">
              Jelajahi fasilitas belajar, virtual tour 360°, dan dokumentasi lingkungan sekolah yang mendukung pengalaman belajar terbaik.
            </p>
          </div>
        </div>
      </section>

      {/* Sarana Prasarana (dynamic from facilities) */}
      <section className="py-16 lg:py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12 border-b border-gray-200 pb-6">
            <span className="text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase">Sarana Prasarana</span>
            <span className="text-xs text-gray-400">01 / 03</span>
          </div>

          <p className="text-gray-600 text-base md:text-lg max-w-2xl mb-12">
            Fasilitas unggulan yang mendukung proses belajar, kreativitas, dan kenyamanan seluruh warga sekolah.
          </p>

          {loadingFacilities ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="animate-pulse bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="h-56 bg-gray-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 w-24 bg-gray-200 rounded-full" />
                    <div className="h-5 w-40 bg-gray-200 rounded-full" />
                    <div className="h-3 w-full bg-gray-200 rounded-full" />
                    <div className="h-3 w-5/6 bg-gray-200 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : facilities.length === 0 ? (
            <div className="text-center text-gray-500">Belum ada data fasilitas.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {facilities.map((item) => {
                const qtyLabel = item.quantityType === "kapasitas" ? "Kapasitas" : "Qty";
                const isExpanded = expandedIds.has(item.id);
                const toggleExpand = () => {
                  setExpandedIds(prev => {
                    const next = new Set(prev);
                    if (next.has(item.id)) next.delete(item.id); else next.add(item.id);
                    return next;
                  });
                };
                return (
                  <div
                    key={item.id}
                    className="w-full shrink-0 group cursor-pointer bg-white rounded-2xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md relative"
                  >
                    {/* SMK Logo Watermark - same as achievement cards */}
                    <div className="absolute -bottom-12 -right-12 w-40 h-40 opacity-15 pointer-events-none">
                      <img src="/images/logosmeabnw.svg" alt="" className="w-full h-full object-contain" />
                    </div>
                    <div className="aspect-video overflow-hidden relative">
                      <Image
                        src={item.image || "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=600"}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(min-width: 1024px) 320px, 100vw"
                        unoptimized
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-semibold tracking-widest uppercase text-[#0268ab]">
                          {item.category || "Fasilitas"}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span className="text-[10px] text-gray-400">
                          Kondisi {item.condition?.replace(/_/g, " ") || "-"}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-gray-900 leading-snug group-hover:text-[#0268ab] transition-colors duration-200 line-clamp-2 mb-2">
                        {item.name}
                      </h4>
                      <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                        <span>
                          {qtyLabel} : <span className="font-semibold text-gray-800">{item.quantity ?? "-"}</span>
                        </span>
                      </div>
                      <p className={`text-xs text-gray-400 line-clamp-2 leading-relaxed`}>
                        {item.description || "Belum ada deskripsi untuk fasilitas ini."}
                      </p>
                      {item.description && item.description.length > 0 && (
                        <button
                          type="button"
                          onClick={toggleExpand}
                          className="text-xs font-semibold text-[#0268ab] hover:underline mt-2"
                        >
                          {isExpanded ? "Sembunyikan" : "Selengkapnya"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Experience Campus Virtual Tour */}
      <section className="py-16 lg:py-20 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-5">
            <span className="text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase">Virtual Tour</span>
            <span className="text-xs text-gray-400">02 / 03</span>
          </div>

          <p className="text-gray-600 text-base md:text-lg max-w-2xl mb-10">
            Jelajahi fasilitas sekolah secara virtual dengan pengalaman 360° yang interaktif dan mendalam.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <aside className="lg:col-span-4 xl:col-span-3 bg-white border border-gray-200 rounded-2xl p-5 h-fit">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Lokasi Tersedia</h3>
              <div className="space-y-2 mb-6">
                {[
                  { name: "Gedung Utama", active: true },
                  { name: "Laboratorium IPA", active: false },
                  { name: "Perpustakaan", active: false },
                  { name: "Laboratorium Komputer", active: false },
                  { name: "Gedung Olahraga", active: false }
                ].map((location, idx) => (
                  <button
                    key={idx}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-colors ${
                      location.active
                        ? "bg-[#0268ab]/10 text-[#0268ab]"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium">{location.name}</span>
                      {location.active && <span className="w-1.5 h-1.5 rounded-full bg-[#0268ab]" />}
                    </div>
                  </button>
                ))}
              </div>

              <div className="pt-5 border-t border-gray-100 space-y-3">
                <h4 className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Cara Menggunakan</h4>
                <div className="flex items-start gap-2.5 text-sm text-gray-600">
                  <Compass className="w-4 h-4 text-[#0268ab] mt-0.5" />
                  <span>Klik dan seret untuk melihat sekeliling panorama.</span>
                </div>
                <div className="flex items-start gap-2.5 text-sm text-gray-600">
                  <Route className="w-4 h-4 text-[#0268ab] mt-0.5" />
                  <span>Klik hotspot untuk berpindah ke lokasi lain.</span>
                </div>
                <div className="flex items-start gap-2.5 text-sm text-gray-600">
                  <Info className="w-4 h-4 text-[#0268ab] mt-0.5" />
                  <span>Gunakan kontrol viewer untuk reset dan fullscreen.</span>
                </div>
              </div>
            </aside>

            <div className="lg:col-span-8 xl:col-span-9 bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-base md:text-lg font-semibold text-gray-900">Virtual Tour 360°</h3>
                <span className="text-xs font-medium text-gray-500">Interaktif</span>
              </div>

              <div className="relative h-115 md:h-130 bg-gray-100">
                {loadingTour ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-10 h-10 border-2 border-gray-300 border-t-[#0268ab] rounded-full animate-spin mx-auto mb-3" />
                      <p className="text-sm text-gray-600">Memuat Virtual Tour...</p>
                    </div>
                  </div>
                ) : tourConfig && tourConfig.default?.firstScene && Object.keys(tourConfig.scenes || {}).length > 0 ? (
                  <div className="h-full">
                    <VirtualTourViewer config={tourConfig} height="100%" />
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center max-w-md px-6">
                      <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Info className="w-7 h-7 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Virtual Tour Belum Tersedia</h3>
                      <p className="text-sm text-gray-600">
                        {tourError || "Kami sedang menyiapkan pengalaman virtual tour terbaik untuk Anda."}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="px-5 py-3 border-t border-gray-100 bg-white text-xs sm:text-sm text-gray-600">
                Gunakan mouse untuk menggeser panorama dan klik hotspot untuk navigasi antar lokasi.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Galeri Sekolah */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header with Left/Right Layout */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-8">
            {/* Left - Header */}
            <div className="mb-6 lg:mb-0 lg:w-1/3">
              <div className="flex items-center space-x-4 mb-4">
                <div className="h-px bg-gray-300 flex-1"></div>
                <span className="text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase whitespace-nowrap">Galeri Sekolah</span>
                <div className="h-px bg-gray-300 flex-1"></div>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                Dokumentasi
                <span className="block text-[#0268ab]">Sekolah</span>
              </h2>
            </div>

            {/* Right - Description */}
            <div className="lg:w-1/2 lg:pl-12">
              <p className="text-gray-600 text-base leading-relaxed mb-4">
                Dokumentasi suasana belajar, fasilitas, dan aktivitas siswa dalam keseharian di lingkungan sekolah SMKN 1 Ciamis.
              </p>
              <button className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#0268ab] text-white font-medium rounded-xl hover:bg-[#015a8f] transition-all duration-300 shadow-sm hover:shadow-md">
                <span>Lihat Semua Foto</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bento Grid Gallery - 7 Items Layout (No Empty Space) */}
          <div className="grid grid-cols-4 grid-rows-2 gap-1 w-full mb-8">
            {currentImages.map((item, i) => {
              // Define bento grid sizes for 7 items (filling all space)
              const gridSizes = [
                'col-span-2 row-span-2', // 0: Large featured image (Gedung Utama)
                'col-span-1 row-span-1', // 1: Small square (Lab Komputer)
                'col-span-1 row-span-1', // 2: Small square (Ruang Kelas)
                'col-span-1 row-span-2', // 3: Tall vertical (Perpustakaan)
                'col-span-1 row-span-1', // 4: Small square (Lab IPA)
                'col-span-1 row-span-1', // 5: Small square (Gedung Olahraga)
                'col-span-1 row-span-1', // 6: Small square (Kantin)
              ];
              
              const currentSize = gridSizes[i] || 'col-span-1 row-span-1';
              
              return (
                <div key={i} className={`relative ${currentSize} group cursor-pointer overflow-hidden rounded-lg`}>
                  <div className="relative w-full h-full min-h-[150px]">
                    <Image
                      src={item.img}
                      className="object-cover group-hover:scale-105 transition-transform duration-500 w-full h-full"
                      alt={item.title}
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      unoptimized
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://picsum.photos/seed/fallback-${i}/400/400.jpg`;
                      }}
                    />
                    
                    {/* Clean Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <div className="flex items-end justify-between">
                          <div>
                            <h4 className="text-white font-semibold text-sm mb-1">
                              {item.title}
                            </h4>
                            <p className="text-white/60 text-xs">
                              {item.desc}
                            </p>
                          </div>
                          <div className="bg-white/20 backdrop-blur-sm p-1.5 rounded-lg">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Fill the remaining space with a placeholder to maintain grid structure */}
            <div className="col-span-1 row-span-1 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center p-4">
                <div className="w-8 h-8 bg-gray-200 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <p className="text-xs text-gray-400">More Photos</p>
              </div>
            </div>
          </div>

          {/* Minimalist Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-gray-100">
              <div className="text-xs text-gray-500">
                {startIndex + 1}-{Math.min(endIndex, galleryImages.length)} dari {galleryImages.length}
              </div>
              
              <div className="flex items-center space-x-1">
                {/* Previous Button */}
                <button
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    currentPage === 1
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-600 hover:text-[#0268ab] hover:bg-[#0268ab]/10'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-all duration-300 ${
                        currentPage === page
                          ? 'bg-[#0268ab] text-white'
                          : 'text-gray-600 hover:text-[#0268ab] hover:bg-[#0268ab]/10'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                {/* Next Button */}
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    currentPage === totalPages
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-600 hover:text-[#0268ab] hover:bg-[#0268ab]/10'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CampusPage;
