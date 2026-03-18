"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import type { PannellumConfig } from "@/components/VirtualTourViewer";
import { Building2, Compass, Info, MapPin, Route, Sparkles } from "lucide-react";

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

  const galleryImages = [
    {
      title: "Main Library",
      desc: "Digital resource center with 24/7 access",
      img: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "Science Hub",
      desc: "Advanced laboratories for research",
      img: "https://media.istockphoto.com/id/1413606459/id/foto/penelitian-eksperimen-dan-uji-coba-medis-dilakukan-oleh-seorang-ilmuwan-di-laboratorium.jpg?s=1024x1024&w=is&k=20&c=54q8V24WhqErWTiBzNHLWh8OtYrTVLHYvkHBgLJcU2k=",
    },
    {
      title: "Recreation Center",
      desc: "Modern fitness facilities and wellness programs",
      img: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "Arts Complex",
      desc: "Studios and exhibition spaces for creatives",
      img: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "Student Lounge",
      desc: "Collaborative spaces for social interaction",
      img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=800",
    },
    // Duplicate for infinite scroll
    {
      title: "Main Library",
      desc: "Digital resource center with 24/7 access",
      img: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "Science Hub",
      desc: "Advanced laboratories for research",
      img: "https://media.istockphoto.com/id/1413606459/id/foto/penelitian-eksperimen-dan-uji-coba-medis-dilakukan-oleh-seorang-ilmuwan-di-laboratorium.jpg?s=1024x1024&w=is&k=20&c=54q8V24WhqErWTiBzNHLWh8OtYrTVLHYvkHBgLJcU2k=",
    },
    {
      title: "Recreation Center",
      desc: "Modern fitness facilities and wellness programs",
      img: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=800",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - sama gaya dengan Struktur Sekolah & Profil Sekolah */}
      <section className="pt-24 pb-16 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-linear-to-b from-[#0268ab] via-[#0268ab]/80 to-transparent"></div>

        {/* Dotted pattern overlay */}
        <div className="absolute inset-0 opacity-15">
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3Ccircle cx='10' cy='10' r='1.5'/%3E%3Ccircle cx='50' cy='10' r='1.5'/%3E%3Ccircle cx='10' cy='50' r='1.5'/%3E%3Ccircle cx='50' cy='50' r='1.5'/%3E%3C/g%3E%3C/svg%3E\")",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        {/* Floating elements */}
        <div className="absolute top-10 right-20 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 left-20 w-48 h-48 bg-white opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>

        {/* Campus-related illustrations */}
        <div className="absolute top-16 left-12 text-white/10">
          <Building2 className="w-16 h-16" strokeWidth={1} />
        </div>
        <div className="absolute top-32 right-16 text-white/10">
          <MapPin className="w-12 h-12" strokeWidth={1} />
        </div>
        <div className="absolute bottom-20 left-32 text-white/10">
          <Compass className="w-14 h-14" strokeWidth={1} />
        </div>
        <div className="absolute top-1/3 right-32 text-white/10">
          <Sparkles className="w-10 h-10" strokeWidth={1} />
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
              Sarana Prasarana
            </h1>
            <p className="text-white/90 text-base md:text-lg leading-relaxed max-w-2xl">
              Esse dolorum voluptatum ullam est sint nemo et est ipsa porro placeat quibusdam quia assumenda nunquam molestias.
            </p>
          </div>
        </div>
      </section>

      {/* Sarana Prasarana (dynamic from facilities) */}
      <section className="py-24 bg-gray-50">
        <div className="text-center mb-16">
          <span className="text-[#0092DD] text-[10px] font-bold uppercase tracking-[0.2em] mb-4 block">
            Sarana Prasarana
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Fasilitas Unggulan
          </h2>
          <p className="max-w-2xl mx-auto text-gray-500 leading-relaxed">
            Jelajahi fasilitas kami yang mendukung proses belajar, kreativitas, dan kenyamanan seluruh warga sekolah.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                    className="bg-white rounded-3xl overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={item.image || "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=600"}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 320px, 100vw"
                        unoptimized
                      />
                      <span className="absolute top-3 left-3 inline-flex items-center px-3 py-1 text-xs font-semibold bg-white/90 text-[#0092DD] rounded-full border border-[#0092DD]/30 shadow-sm">
                        {item.category || "Fasilitas"}
                      </span>
                    </div>

                    <div className="p-6 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-lg font-bold text-gray-900">{item.name}</h4>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <p>Kondisi {item.condition?.replace(/_/g, " ") || "-"}</p>
                        <p>
                          {qtyLabel} : <span className="font-semibold text-gray-800">{item.quantity ?? "-"}</span>
                        </p>
                      </div>

                      <p className={`text-sm text-gray-600 leading-relaxed ${isExpanded ? "" : "line-clamp-3"}`}>
                        {item.description || "Belum ada deskripsi untuk fasilitas ini."}
                      </p>
                      {item.description && item.description.length > 0 && (
                        <button
                          type="button"
                          onClick={toggleExpand}
                          className="text-xs font-semibold text-[#0092DD] hover:underline"
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
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-gray-50 rounded-[40px] p-8 md:p-16 flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2">
            {loadingTour ? (
              <div className="h-100 rounded-3xl bg-gray-200 animate-pulse border border-gray-100 shadow-2xl" />
            ) : tourConfig && tourConfig.default?.firstScene && Object.keys(tourConfig.scenes || {}).length > 0 ? (
              <VirtualTourViewer config={tourConfig} height="400px" />
            ) : (
              <div className="h-100 rounded-3xl bg-gray-100 border border-gray-200 shadow-inner flex items-center justify-center text-center px-6 text-gray-500 text-sm">
                {tourError || "Belum ada virtual tour yang tersedia."}
              </div>
            )}
          </div>
          <div className="w-full lg:w-1/2">
            <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
              Virtual Tour 360° SMKN 1 Ciamis
            </h2>
            <p className="text-gray-500 mb-10 text-sm leading-relaxed">
              Jelajahi setiap sudut sekolah secara virtual tanpa harus datang langsung. Temukan ruang kelas, fasilitas, dan arah jalur dengan mudah sehingga kamu bisa mengenal lingkungan SMKN 1 Ciamis dari rumah, atau mempersiapkan kunjungan tanpa takut tersesat di area sekolah.
            </p>
            <div className="space-y-6 mb-12">
              <div className="flex items-start">
                <Compass className="h-5 w-5 text-[#0092DD] mt-0.5 mr-4" />
                <p className="text-sm font-medium">Berkeliling 360° ke seluruh area sekolah</p>
              </div>
              <div className="flex items-start">
                <Info className="h-5 w-5 text-[#0092DD] mt-0.5 mr-4" />
                <p className="text-sm font-medium">Info detail tiap titik tempat</p>
              </div>
              <div className="flex items-start">
                <Route className="h-5 w-5 text-[#0092DD] mt-0.5 mr-4" />
                <p className="text-sm font-medium">Panduan rute sebelum berkunjung supaya tidak tersesat</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Auto-scrolling Gallery */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Campus Life in Pictures
          </h2>
          <p className="text-sm text-gray-400">
            Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a.
            Vestibulum ac diam sit amet quam vehicula elementum.
          </p>
        </div>
        <div
          className="flex overflow-hidden whitespace-nowrap"
          ref={scrollRef}
          style={{ cursor: "grab" }}
        >
          <div className="flex">
            {galleryImages.map((item, i) => (
              <div key={i} className="inline-block px-4 w-100">
                <div className="relative rounded-3xl overflow-hidden h-64 group cursor-pointer shadow-lg">
                  <Image
                    src={item.img}
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={item.title}
                    fill
                    sizes="(min-width: 1024px) 400px, 100vw"
                    unoptimized
                  />
                  {/* Requested hover overlay from image 5 */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                    <h4 className="text-white font-bold text-xl mb-2">
                      {item.title}
                    </h4>
                    <p className="text-white/80 text-xs whitespace-normal">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CampusPage;
