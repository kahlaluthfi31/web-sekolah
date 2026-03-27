"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import type { PannellumConfig } from "@/components/VirtualTourViewer";
import { Compass, Info, Route, ExternalLink } from "lucide-react";
import { usePageHeader } from "@/lib/usePageHeader";

const VirtualTourViewer = dynamic(
  () => import("@/components/VirtualTourViewer"),
  { ssr: false },
);

const CampusPage: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [facilities, setFacilities] = useState<FacilityCard[]>([]);
  const [loadingFacilities, setLoadingFacilities] = useState(true);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [tourConfig, setTourConfig] = useState<PannellumConfig | null>(null);
  const [loadingTour, setLoadingTour] = useState(true);
  const [tourError, setTourError] = useState<string>("");
  const [activeSceneId, setActiveSceneId] = useState<string | null>(null);
  const prevTourConfigRef = useRef<string>("");

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

  // Load virtual tour scenes (same logic as admin preview)
  useEffect(() => {
    const loadTour = async () => {
      try {
        const res = await fetch(`/api/virtual-tour/scenes?t=${Date.now()}`, {
          cache: "no-store",
        });
        const json = await res.json();
        if (
          !json?.success ||
          !Array.isArray(json.data) ||
          json.data.length === 0
        ) {
          setTourError(json?.message || "Virtual tour belum tersedia.");
          return;
        }

        // Build config
        type Scene = {
          id: number;
          sceneKey: string;
          title: string;
          imagePath: string;
          isDefault: boolean;
          hotspots: {
            id: number;
            sceneId: number;
            pitch: number;
            yaw: number;
            text: string;
            targetSceneId: number | null;
          }[];
        };

        const scenes: Scene[] = json.data;
        const defaultScene = scenes.find((s) => s.isDefault) ?? scenes[0];
        const sceneKeyById = new Map(scenes.map((s) => [s.id, s.sceneKey]));
        const scenesMap: Record<string, unknown> = {};

        for (const scene of scenes) {
          scenesMap[scene.sceneKey] = {
            title: scene.title,
            panorama: scene.imagePath,
            hotSpots: scene.hotspots.map((h) =>
              h.targetSceneId
                ? {
                    pitch: h.pitch,
                    yaw: h.yaw,
                    type: "scene" as const,
                    text: h.text,
                    sceneId: sceneKeyById.get(h.targetSceneId) ?? "",
                  }
                : {
                    pitch: h.pitch,
                    yaw: h.yaw,
                    type: "info" as const,
                    text: h.text,
                  },
            ),
          };
        }

        const config: PannellumConfig = {
          default: { firstScene: defaultScene.sceneKey },
          scenes: scenesMap as Record<string, PannellumScene>,
        };

        const configStr = JSON.stringify(config);
        if (prevTourConfigRef.current !== configStr) {
          prevTourConfigRef.current = configStr;
          setTourConfig(config);
          setActiveSceneId(config.default.firstScene);
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

  const galleryPhotos = useMemo(() => {
    if (!facilities || facilities.length === 0) return [] as { title: string; desc: string; img: string }[];
    return facilities.map((item) => ({
      title: item.name || "Fasilitas",
      desc: item.category || "",
      img:
        item.image ||
        `https://picsum.photos/seed/facility-${item.id || Math.random().toString(36).slice(2)}/800/600.jpg`,
    }));
  }, [facilities]);

  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const totalPages = Math.ceil(galleryPhotos.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentImages = galleryPhotos.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [galleryPhotos.length]);

  const openModal = (index = 0) => {
    if (!galleryPhotos.length) return;
    setModalIndex(index);
    setShowGalleryModal(true);
  };

  const closeModal = () => setShowGalleryModal(false);

  const nextModal = () => {
    setModalIndex((prev) => (prev + 1) % galleryPhotos.length);
  };

  const prevModal = () => {
    setModalIndex((prev) => (prev - 1 + galleryPhotos.length) % galleryPhotos.length);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  const defaultHeader = useMemo(
    () => ({
      title: "Sarana Prasarana",
      subtitle:
        "Jelajahi fasilitas belajar, virtual tour 360°, dan dokumentasi lingkungan sekolah yang mendukung pengalaman belajar terbaik.",
    }),
    [],
  );

  const header = usePageHeader("campus", defaultHeader);

  const displayLines = (header.displayTitle || header.title || "").split("\n");

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="pt-24 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-[#0268ab] via-[#0268ab]/80 to-transparent"></div>

        <div className="absolute inset-0 opacity-15">
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3Ccircle cx='10' cy='10' r='1.5'/%3E%3Ccircle cx='50' cy='10' r='1.5'/%3E%3Ccircle cx='10' cy='50' r='1.5'/%3E%3Ccircle cx='50' cy='50' r='1.5'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: "60px 60px",
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
              {displayLines[0] || "Sarana"}
              {displayLines[1] && (
                <span className="block text-5xl md:text-6xl lg:text-7xl font-light mt-2">
                  {displayLines[1]}
                </span>
              )}
            </h1>
            {header.subtitle && (
              <p className="text-white/90 text-base md:text-lg leading-relaxed max-w-2xl">
                {header.subtitle}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Sarana Prasarana (dynamic from facilities) */}
      <section className="py-16 lg:py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12 border-b border-gray-200 pb-6">
            <span className="text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase">
              Sarana Prasarana
            </span>
            <span className="text-xs text-gray-400">01 / 03</span>
          </div>

          {loadingFacilities ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="animate-pulse bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
                >
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
            <div className="text-center text-gray-500">
              Belum ada data fasilitas.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {facilities.map((item) => {
                const qtyLabel =
                  item.quantityType === "kapasitas" ? "Kapasitas" : "Qty";
                const isExpanded = expandedIds.has(item.id);
                const toggleExpand = () => {
                  setExpandedIds((prev) => {
                    const next = new Set(prev);
                    if (next.has(item.id)) next.delete(item.id);
                    else next.add(item.id);
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
                      <Image
                        src="/images/logosmeabnw.svg"
                        alt=""
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                    <div className="aspect-video overflow-hidden relative">
                      <Image
                        src={
                          item.image ||
                          "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=600"
                        }
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
                          {qtyLabel} :{" "}
                          <span className="font-semibold text-gray-800">
                            {item.quantity ?? "-"}
                          </span>
                        </span>
                      </div>
                      <p
                        className={`text-xs text-gray-400 leading-relaxed ${isExpanded ? "" : "line-clamp-2"}`}
                      >
                        {item.description ||
                          "Belum ada deskripsi untuk fasilitas ini."}
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
            <span className="text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase">
              Virtual Tour
            </span>
            <span className="text-xs text-gray-400">02 / 03</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <aside className="lg:col-span-4 xl:col-span-3 bg-white border border-gray-200 rounded-2xl p-5 h-fit shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-sm font-semibold text-gray-900">
                  Cara Penggunaan
                </h3>
              </div>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-start gap-2.5">
                  <Compass className="w-4 h-4 text-[#0268ab] mt-0.5" />
                  <span>Klik dan seret untuk melihat sekeliling panorama.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Route className="w-4 h-4 text-[#0268ab] mt-0.5" />
                  <span>Klik hotspot untuk berpindah ke lokasi lain.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-[#0268ab] mt-0.5" />
                  <span>
                    Gunakan kontrol viewer untuk reset dan fullscreen.
                  </span>
                </div>
              </div>
            </aside>

            <div className="lg:col-span-8 xl:col-span-9 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="relative bg-gray-100" style={{ height: "520px" }}>
                {loadingTour ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-10 h-10 border-2 border-gray-300 border-t-[#0268ab] rounded-full animate-spin mx-auto mb-3" />
                      <p className="text-sm text-gray-600">
                        Memuat Virtual Tour...
                      </p>
                    </div>
                  </div>
                ) : tourConfig &&
                  tourConfig.default?.firstScene &&
                  Object.keys(tourConfig.scenes || {}).length > 0 ? (
                  <div className="h-full flex flex-col">
                    <div className="flex-1">
                      <VirtualTourViewer
                        config={tourConfig}
                        height="520px"
                        showCoords={false}
                        activeSceneId={
                          activeSceneId || tourConfig.default.firstScene
                        }
                        onSceneChange={(id) => setActiveSceneId(id)}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center max-w-md px-6">
                      <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Info className="w-7 h-7 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Virtual Tour Belum Tersedia
                      </h3>
                      <p className="text-sm text-gray-600">
                        {tourError ||
                          "Kami sedang menyiapkan pengalaman virtual tour terbaik untuk Anda."}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dokumentasi Sekolah */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-5">
            <span className="text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase">
              Dokumentasi Sekolah
            </span>
            <span className="text-xs text-gray-400">03 / 03</span>
          </div>

          {galleryPhotos.length === 0 ? (
            <div className="text-center text-gray-500 py-8">Belum ada foto fasilitas.</div>
          ) : (
            <div className="grid grid-cols-4 grid-rows-2 gap-1 w-full mb-8">
              {currentImages.map((item, i) => {
                const gridSizes = [
                  "col-span-2 row-span-2",
                  "col-span-1 row-span-1",
                  "col-span-1 row-span-1",
                  "col-span-1 row-span-2",
                  "col-span-1 row-span-1",
                  "col-span-1 row-span-1",
                  "col-span-1 row-span-1",
                ];

                const currentSize = gridSizes[i] || "col-span-1 row-span-1";
                const globalIndex = startIndex + i;

                return (
                  <button
                    type="button"
                    key={`${item.title}-${i}`}
                    onClick={() => openModal(globalIndex)}
                    className={`relative ${currentSize} group cursor-pointer overflow-hidden rounded-lg text-left`}
                  >
                    <div className="relative w-full h-full min-h-38">
                      <Image
                        src={item.img}
                        className="object-cover group-hover:scale-105 transition-transform duration-500 w-full h-full"
                        alt={item.title}
                        fill
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        unoptimized
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://picsum.photos/seed/fallback-${globalIndex}/400/400.jpg`;
                        }}
                      />

                      <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <div className="flex items-end justify-between">
                            <div>
                              <h4 className="text-white font-semibold text-sm mb-1">{item.title}</h4>
                              <p className="text-white/60 text-xs">{item.desc}</p>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm p-1.5 rounded-lg">
                              <svg
                                className="w-3 h-3 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => openModal(0)}
                className="col-span-1 row-span-1 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
                disabled={galleryPhotos.length === 0}
              >
                <div className="text-center p-4">
                  <div className="w-8 h-8 bg-gray-200 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                  <p className="text-xs text-gray-600">More Photos</p>
                </div>
              </button>
            </div>
          )}

          {/* Minimalist Pagination */}
              {galleryPhotos.length > 0 && totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-gray-100">
              <div className="text-xs text-gray-500">
                {startIndex + 1}-{Math.min(endIndex, galleryPhotos.length)} dari{" "}
                {galleryPhotos.length}
              </div>

              <div className="flex items-center space-x-1">
                {/* Previous Button */}
                <button
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    currentPage === 1
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-600 hover:text-[#0268ab] hover:bg-[#0268ab]/10"
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-all duration-300 ${
                          currentPage === page
                            ? "bg-[#0268ab] text-white"
                            : "text-gray-600 hover:text-[#0268ab] hover:bg-[#0268ab]/10"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}
                </div>

                {/* Next Button */}
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    currentPage === totalPages
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-600 hover:text-[#0268ab] hover:bg-[#0268ab]/10"
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {showGalleryModal && galleryPhotos.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center px-4" onClick={closeModal}>
          <div
            className="relative w-full max-w-5xl bg-white rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
              <button
                onClick={closeModal}
                className="p-2 rounded-full bg-black/70 text-white hover:bg-black/90 transition"
                aria-label="Tutup"
              >
                ✕
              </button>
            </div>

            <div className="relative w-full h-[70vh] min-h-[320px] bg-black">
              <Image
                src={galleryPhotos[modalIndex].img}
                alt={galleryPhotos[modalIndex].title}
                fill
                className="object-contain"
                unoptimized
                sizes="100vw"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://picsum.photos/seed/modal-fallback-${modalIndex}/900/600.jpg`;
                }}
              />
              <button
                onClick={prevModal}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 rounded-full w-10 h-10 flex items-center justify-center shadow"
                aria-label="Foto sebelumnya"
              >
                ‹
              </button>
              <button
                onClick={nextModal}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 rounded-full w-10 h-10 flex items-center justify-center shadow"
                aria-label="Foto selanjutnya"
              >
                ›
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full">
                {modalIndex + 1} / {galleryPhotos.length}
              </div>
            </div>

            <div className="p-4 bg-white border-t border-gray-100">
              <h4 className="text-lg font-semibold text-gray-900 mb-1">{galleryPhotos[modalIndex].title}</h4>
              <p className="text-sm text-gray-600">{galleryPhotos[modalIndex].desc || ""}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampusPage;
