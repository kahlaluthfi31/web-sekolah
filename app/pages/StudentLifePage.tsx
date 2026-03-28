"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useMemo, useState } from "react";
import {
  Users,
  GraduationCap,
  Heart,
  Trophy,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Calendar,
  CalendarDays,
  Clock3,
  X,
  ArrowRight,
} from "lucide-react";
import { usePageHeader } from "@/lib/usePageHeader";

const STUDENT_LIFE_HEADER_FALLBACK = {
  title: "Kehidupan Siswa",
  subtitle:
    "Lihat aktivitas harian, prestasi, dan pengembangan karakter siswa di lingkungan sekolah.",
};

type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

type Achievement = {
  id: number;
  studentName: string;
  class?: string | null;
  achievementName: string;
  competitionName?: string | null;
  level?: string | null;
  position?: string | null;
  year?: number | null;
  competitionDate?: string | null;
  photo?: string | null;
  certificateImage?: string | null;
  status?: string | null;
};

type Extracurricular = {
  id: number;
  name: string;
  description?: string | null;
  coachName?: string | null;
  image?: string | null;
  isActive?: boolean | null;
  activityCount?: number;
};

type RoutineActivity = {
  id: number;
  name: string;
  days?: string | null;
  time?: string | null;
  description?: string | null;
  icon?: string | null;
  orderPosition?: number | null;
  isActive?: boolean | null;
};

type EskulActivity = {
  id: number;
  eskulId: number;
  activityTitle: string;
  description?: string | null;
  activityDate?: string | null;
  image?: string | null;
  eskul?: {
    id: number;
    name: string;
    coachName?: string | null;
  };
};

const ACHIEVEMENT_PLACEHOLDER =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2NzUiIHZpZXdCb3g9IjAgMCAxMjAwIDY3NSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEyMDAiIGhlaWdodD0iNjc1IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9IjQ4MCAyNzBINzIwVjQwNUg0ODBWMjcwWiIgZmlsbD0iI0QxRDVEQiIvPgo8c3ZnIHdpZHRoPSIyNDAiIGhlaWdodD0iMTM1IiB2aWV3Qm94PSIwIDAgMjQwIDEzNSIgZmlsbD0ibm9uZSIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0MCIgaGVpZ2h0PSIxMzUiIGZpbGw9IiNGM0Y0RjYiLz4KPHBhdGggZD0iMTExLjIgNTQuM0gxMjguOFY4MC43SDExMS4yVjU0LjNaIiBmaWxsPSIjRDFENUVCIi8+Cjwvc3ZnPgo8L3N2Zz4K";

const ACHIEVEMENT_PAGE_SIZE = 3;

const levelLabel: Record<string, string> = {
  sekolah: "Sekolah",
  kecamatan: "Kecamatan",
  kabupaten: "Kabupaten",
  provinsi: "Provinsi",
  nasional: "Nasional",
  internasional: "Internasional",
};

const formatLevel = (level?: string | null) => {
  if (!level) return "Prestasi";
  return levelLabel[level] ?? level;
};

const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return null;
  try {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

const routineIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  heart: Heart,
  graduationcap: GraduationCap,
  users: Users,
  sparkles: Sparkles,
  calendardays: CalendarDays,
  clock3: Clock3,
};

const getRoutineIcon = (icon?: string | null) => {
  if (!icon) return CalendarDays;
  const key = icon.toLowerCase();
  return routineIconMap[key] || CalendarDays;
};

const StudentLifePage: React.FC = () => {
  const header = usePageHeader("students", STUDENT_LIFE_HEADER_FALLBACK);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [achievementsLoading, setAchievementsLoading] = useState<boolean>(true);
  const [achievementsPage, setAchievementsPage] = useState<number>(1);
  const [achievementsPagination, setAchievementsPagination] = useState<PaginationMeta>({
    page: 1,
    limit: ACHIEVEMENT_PAGE_SIZE,
    total: 0,
    totalPages: 1,
  });
  const [eskulItems, setEskulItems] = useState<Extracurricular[]>([]);
  const [eskulLoading, setEskulLoading] = useState<boolean>(true);
  const [expandedEskul, setExpandedEskul] = useState<Set<number>>(new Set());
  const [routineItems, setRoutineItems] = useState<RoutineActivity[]>([]);
  const [routineLoading, setRoutineLoading] = useState<boolean>(true);
  const [eskulActivities, setEskulActivities] = useState<EskulActivity[]>([]);
  const [eskulActivitiesLoading, setEskulActivitiesLoading] = useState<boolean>(true);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const galleryItems = useMemo(() => eskulActivities.filter((a) => a.image), [eskulActivities]);

  const achievementsPageNumbers = useMemo(() => {
    const total = Math.max(achievementsPagination.totalPages, 1);
    const pages: Array<number | "..."> = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i += 1) pages.push(i);
      return pages;
    }

    if (achievementsPage <= 4) {
      pages.push(1, 2, 3, 4, 5, "...", total);
      return pages;
    }

    if (achievementsPage >= total - 3) {
      pages.push(1, "...", total - 4, total - 3, total - 2, total - 1, total);
      return pages;
    }

    pages.push(
      1,
      "...",
      achievementsPage - 1,
      achievementsPage,
      achievementsPage + 1,
      "...",
      total
    );
    return pages;
  }, [achievementsPage, achievementsPagination.totalPages]);

  useEffect(() => {
    let mounted = true;
    setAchievementsLoading(true);
    fetch(`/api/achievements?status=approved&limit=${ACHIEVEMENT_PAGE_SIZE}&page=${achievementsPage}`)
      .then((res) => res.json())
      .then((json) => {
        if (!mounted) return;
        if (json?.success && Array.isArray(json.data)) {
          setAchievements(json.data as Achievement[]);
          if (json.pagination) {
            setAchievementsPagination(json.pagination as PaginationMeta);
          } else {
            setAchievementsPagination({
              page: achievementsPage,
              limit: ACHIEVEMENT_PAGE_SIZE,
              total: json.data.length,
              totalPages: 1,
            });
          }
        } else {
          setAchievements([]);
          setAchievementsPagination({
            page: achievementsPage,
            limit: ACHIEVEMENT_PAGE_SIZE,
            total: 0,
            totalPages: 1,
          });
        }
      })
      .catch(() => setAchievements([]))
      .finally(() => mounted && setAchievementsLoading(false));

    return () => {
      mounted = false;
    };
  }, [achievementsPage]);

  useEffect(() => {
    let mounted = true;
    setEskulLoading(true);
    fetch(`/api/eskuls?limit=6&status=active`, { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => {
        if (!mounted) return;
        if (json?.success && Array.isArray(json.data)) {
          setEskulItems(json.data as Extracurricular[]);
        } else {
          setEskulItems([]);
        }
      })
      .catch(() => setEskulItems([]))
      .finally(() => mounted && setEskulLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    setRoutineLoading(true);
    fetch(`/api/routine-activities?active=true&limit=12`)
      .then((res) => res.json())
      .then((json) => {
        if (!mounted) return;
        if (json?.success && Array.isArray(json.data)) {
          setRoutineItems(json.data as RoutineActivity[]);
        } else {
          setRoutineItems([]);
        }
      })
      .catch(() => setRoutineItems([]))
      .finally(() => mounted && setRoutineLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    setEskulActivitiesLoading(true);
    fetch(`/api/eskul-activities?limit=30`)
      .then((res) => res.json())
      .then((json) => {
        if (!mounted) return;
        if (json?.success && Array.isArray(json.data)) {
          setEskulActivities(json.data as EskulActivity[]);
        } else {
          setEskulActivities([]);
        }
      })
      .catch(() => setEskulActivities([]))
      .finally(() => mounted && setEskulActivitiesLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!galleryItems.length) {
      setGalleryOpen(false);
      setGalleryIndex(0);
      return;
    }
    if (galleryIndex >= galleryItems.length) {
      setGalleryIndex(0);
    }
  }, [galleryItems, galleryIndex]);

  const openGalleryAt = (id?: number) => {
    if (!galleryItems.length) return;
    if (id) {
      const idx = galleryItems.findIndex((a) => a.id === id);
      setGalleryIndex(idx >= 0 ? idx : 0);
    } else {
      setGalleryIndex(0);
    }
    setGalleryOpen(true);
  };

  const closeGallery = () => setGalleryOpen(false);

  const goNext = () => {
    if (!galleryItems.length) return;
    setGalleryIndex((i) => (i + 1) % galleryItems.length);
  };

  const goPrev = () => {
    if (!galleryItems.length) return;
    setGalleryIndex((i) => (i - 1 + galleryItems.length) % galleryItems.length);
  };

  const handleAchievementsPageChange = (page: number) => {
    if (page < 1 || page > achievementsPagination.totalPages || page === achievementsPage) return;
    setAchievementsPage(page);
  };

  const toggleEskulDescription = (id: number) => {
    setExpandedEskul((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="pt-24 pb-16 relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-linear-to-b from-[#0268ab] via-[#0268ab]/80 to-transparent"></div>

        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>

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

      {/* Prestasi Siswa - Pindah ke Atas */}
      <section className="py-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header - Landing Page Style */}
          <div className="flex items-center justify-between mb-12 border-b border-gray-200 pb-6">
            <span className="text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase">
              Prestasi Siswa
            </span>
            <span className="text-xs text-gray-400">01 / 04</span>
          </div>

          {/* Achievement Cards dinamis */}
          {achievementsLoading && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {Array.from({ length: ACHIEVEMENT_PAGE_SIZE }).map((_, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 relative overflow-hidden animate-pulse">
                  <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-gray-200 opacity-15" />
                  <div className="space-y-4 relative z-10">
                    <div className="w-full h-48 bg-gray-200 rounded-xl" />
                    <div className="h-5 w-3/4 bg-gray-200 rounded-full" />
                    <div className="h-4 w-full bg-gray-200 rounded-full" />
                    <div className="h-4 w-1/2 bg-gray-200 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!achievementsLoading && achievements.length === 0 && (
            <p className="text-sm text-gray-500">Belum ada data prestasi.</p>
          )}

          {!achievementsLoading && achievements.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {achievements.slice(0, ACHIEVEMENT_PAGE_SIZE).map((achievement) => {
                const photoSrc =
                  achievement.photo ||
                  achievement.certificateImage ||
                  ACHIEVEMENT_PLACEHOLDER;
                const dateLabel = formatDate(achievement.competitionDate);
                return (
                  <div key={achievement.id} className="group cursor-pointer">
                    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 relative">
                      {/* Logo SMKN 1 Ciamis - same as news cards */}
                      <div className="absolute -bottom-12 -right-12 w-40 h-40 opacity-15 pointer-events-none">
                        <img
                          src="/images/logosmeabnw.svg"
                          alt="SMKN 1 Ciamis Logo"
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <div className="relative w-full h-40 bg-gray-100 overflow-hidden">
                        <img
                          src={photoSrc}
                          alt={achievement.achievementName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-2 left-2 bg-[#0268ab] text-white text-xs font-semibold px-2.5 py-1 rounded-lg">
                          {formatLevel(achievement.level)}
                        </span>
                        {achievement.position && (
                          <span className="absolute top-2 right-2 bg-amber-400 text-white text-xs font-semibold px-2.5 py-1 rounded-lg">
                            {achievement.position}
                          </span>
                        )}
                      </div>

                      <div className="p-4 relative z-10 flex flex-col h-40">
                        <div className="flex items-center gap-2 mb-2.5 text-xs text-gray-500">
                          {dateLabel && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {dateLabel}
                            </span>
                          )}
                        </div>
                        <h4 className="font-semibold text-gray-900 group-hover:text-[#0268ab] transition-colors mb-2 leading-snug line-clamp-2">
                          {achievement.achievementName}
                        </h4>
                        <p className="text-xs text-gray-500 mb-3 line-clamp-2 grow">
                          {achievement.competitionName || "Kompetisi / instansi belum diisi."}
                        </p>
                        <div className="flex items-center justify-between mt-auto">
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            {achievement.studentName}
                            {achievement.class ? ` • ${achievement.class}` : ""}
                          </span>
                          <button className="text-[#0268ab] text-xs font-semibold hover:text-[#014a8f] transition-colors">
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!achievementsLoading && achievementsPagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10">
              <button
                onClick={() => handleAchievementsPageChange(achievementsPage - 1)}
                disabled={achievementsPage === 1}
                className={`p-2 transition-colors ${
                  achievementsPage === 1
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-400 hover:text-[#0268ab]"
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {achievementsPageNumbers.map((p, idx) => {
                if (p === "...") {
                  return (
                    <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">
                      ...
                    </span>
                  );
                }

                const isActive = p === achievementsPage;
                return (
                  <button
                    key={p}
                    onClick={() => handleAchievementsPageChange(p)}
                    className={`w-8 h-8 rounded-full text-xs font-bold transition-colors ${
                      isActive
                        ? "bg-[#0268ab] text-white"
                        : "text-gray-500 hover:bg-gray-100 hover:text-[#0268ab]"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}

              <button
                onClick={() => handleAchievementsPageChange(achievementsPage + 1)}
                disabled={
                  achievementsPage === achievementsPagination.totalPages || achievementsPagination.totalPages === 0
                }
                className={`p-2 transition-colors ${
                  achievementsPage === achievementsPagination.totalPages || achievementsPagination.totalPages === 0
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-400 hover:text-[#0268ab]"
                }`}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Ekstrakurikuler */}
      <section className="py-16 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header - Landing Page Style */}
          <div className="flex items-center justify-between mb-12 border-b border-gray-200 pb-6">
            <span className="text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase">
              Ekstrakurikuler
            </span>
            <span className="text-xs text-gray-400">02 / 04</span>
          </div>

          {/* Programs Grid Style - Sama seperti Section Jurusan */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12">
            {eskulLoading &&
              Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="flex gap-4 animate-pulse">
                  <div className="shrink-0">
                    <div className="w-14 h-14 rounded-full bg-gray-200" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 bg-gray-200 rounded-full" />
                    <div className="h-3 w-full bg-gray-200 rounded-full" />
                    <div className="h-3 w-2/3 bg-gray-200 rounded-full" />
                  </div>
                </div>
              ))}

            {!eskulLoading && eskulItems.length === 0 && (
              <p className="text-sm text-gray-500">Belum ada data ekstrakurikuler.</p>
            )}

            {!eskulLoading &&
              eskulItems.map((activity) => (
                <div key={activity.id} className="flex gap-4 group">
                  <div className="shrink-0">
                    <div className="w-14 h-14 rounded-full bg-[#0268ab]/10 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 overflow-hidden border border-[#0268ab]/20">
                      {activity.image ? (
                        <img
                          src={activity.image}
                          alt={activity.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Users className="w-7 h-7 text-[#0268ab]" strokeWidth={2} />
                      )}
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-[#0268ab] leading-tight">
                      {activity.name}
                    </h3>
                    {(() => {
                      const desc = activity.description || "Deskripsi belum tersedia.";
                      const isExpanded = expandedEskul.has(activity.id);
                      const shouldTruncate = desc.length > 44;
                      const displayDesc = !shouldTruncate || isExpanded ? desc : `${desc.slice(0, 44)}...`;
                      return (
                        <div className="text-sm text-gray-600 leading-relaxed">
                          <p>{displayDesc}
                            {shouldTruncate && (
                            <button
                              type="button"
                              onClick={() => toggleEskulDescription(activity.id)}
                              className="text-[#0268ab] text-xs font-semibold hover:underline"
                            >
                              {isExpanded ? "Sembunyikan" : "Selengkapnya"}
                            </button>
                          )}
                          </p>
                        </div>
                      );
                    })()}
                    <div className="text-xs text-gray-500 space-y-1">
                      {activity.coachName && <div>Pelatih : {activity.coachName}</div>}
                      {typeof activity.activityCount === "number" && (
                        <div>{activity.activityCount} kegiatan</div>
                      )}
                      {activity.isActive === false && (
                        <div className="text-red-500 font-medium">Tidak aktif</div>
                      )}
                    </div>
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
            <span className="text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase">
              Kegiatan Rutin
            </span>
            <span className="text-xs text-gray-400">03 / 04</span>
          </div>

          {/* Clean Simple Layout - Dynamic */}
          <div className="space-y-6">
            {routineLoading && (
              <div className="text-sm text-gray-500">Memuat kegiatan rutin...</div>
            )}

            {!routineLoading && routineItems.length === 0 && (
              <p className="text-sm text-gray-500">Belum ada data kegiatan rutin.</p>
            )}

            {!routineLoading &&
              routineItems.map((routine) => {
                const Icon = getRoutineIcon(routine.icon);
                return (
                  <div
                    key={routine.id}
                    className="flex items-start gap-6 py-6 border-b border-gray-200 last:border-b-0 hover:bg-white/50 transition-colors duration-300 -mx-4 px-4 rounded-lg"
                  >
                    {/* Icon - Simple & Clean */}
                    <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#0268ab]/10 to-[#0268ab]/5 flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6 text-[#0268ab]" />
                    </div>

                    {/* Content - Clean Layout */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-xl font-semibold text-gray-900 mb-0">
                          {routine.name}
                        </h4>
                        <div className="flex items-center gap-3 ml-4 shrink-0">
                          {routine.days && (
                            <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-full">
                              {routine.days}
                            </span>
                          )}
                          {routine.time && (
                            <span className="text-xs text-[#0268ab] font-semibold bg-[#0268ab]/10 px-2 py-1 rounded-full">
                              {routine.time}
                            </span>
                          )}
                        </div>
                      </div>
                      {routine.description && (
                        <p className="text-gray-600 leading-relaxed text-sm">
                          {routine.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </section>

      {/* Galeri Kegiatan - Balanced Bento Grid */}
      <section className="py-16 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header - Landing Page Style */}
          <div className="flex items-center justify-between mb-12 border-b border-gray-200 pb-6">
            <span className="text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase">
              Galeri Kegiatan
            </span>
            <span className="text-xs text-gray-400">04 / 04</span>
          </div>
          {eskulActivitiesLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="h-44 md:h-48 bg-white rounded-xl border border-gray-100 animate-pulse" />
              ))}
            </div>
          )}

          {!eskulActivitiesLoading && eskulActivities.length === 0 && (
            <p className="text-sm text-gray-500">Belum ada data kegiatan eskul.</p>
          )}

          {!eskulActivitiesLoading && eskulActivities.length > 0 && (
            <>
              <GalleryGrid activities={eskulActivities.slice(0, 6)} onOpen={openGalleryAt} />
              {eskulActivities.length > 6 && (
                <div className="mt-8 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gray-900">Kegiatan lainnya</h4>
                  </div>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {eskulActivities.slice(6).map((act) => (
                      <MiniActivityCard key={act.id} activity={act} onOpen={openGalleryAt} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {galleryOpen && galleryItems.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={closeGallery} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden">
            <button
              onClick={closeGallery}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 text-gray-600 hover:bg-white shadow"
              aria-label="Tutup galeri"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-4">
              <button
                onClick={goPrev}
                className="p-3 text-white hover:text-gray-200"
                aria-label="Sebelumnya"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex-1">
                <div className="relative aspect-video bg-black/5">
                  <img
                    src={galleryItems[galleryIndex].image as string}
                    alt={galleryItems[galleryIndex].activityTitle}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 via-black/40 to-transparent p-4 text-white space-y-1">
                    <div className="flex items-center justify-between text-xs text-white/80">
                      <span>{galleryItems[galleryIndex].eskul?.name || 'Ekstrakurikuler'}</span>
                      {formatActivityDate(galleryItems[galleryIndex].activityDate) && (
                        <span>{formatActivityDate(galleryItems[galleryIndex].activityDate)}</span>
                      )}
                    </div>
                    <h4 className="text-lg font-semibold">{galleryItems[galleryIndex].activityTitle}</h4>
                    {galleryItems[galleryIndex].description && (
                      <p className="text-sm text-white/90 line-clamp-3">{galleryItems[galleryIndex].description}</p>
                    )}
                  </div>
                </div>

                {galleryItems.length > 1 && (
                  <div className="flex items-center justify-center gap-2 py-3 bg-white">
                    {galleryItems.map((item, idx) => (
                      <button
                        key={item.id}
                        onClick={() => setGalleryIndex(idx)}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${idx === galleryIndex ? 'bg-[#0268ab]' : 'bg-gray-300 hover:bg-gray-400'}`}
                        aria-label={`Pilih slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={goNext}
                className="p-3 text-white hover:text-gray-200"
                aria-label="Berikutnya"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function formatActivityDate(dateStr?: string | null) {
  if (!dateStr) return null;
  try {
    return new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

function GalleryGrid({ activities, onOpen }: { activities: EskulActivity[]; onOpen: (id?: number) => void }) {
  if (activities.length === 0) return null;
  const [first, ...rest] = activities;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <FeaturedActivityCard activity={first} onOpen={onOpen} />
      {rest.map((act) => (
        <SmallActivityCard key={act.id} activity={act} onOpen={onOpen} />
      ))}
    </div>
  );
}

function FeaturedActivityCard({ activity, onOpen }: { activity: EskulActivity; onOpen: (id?: number) => void }) {
  const dateLabel = formatActivityDate(activity.activityDate);
  return (
    <div
      className="relative group bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-gray-200 transition-all duration-300 cursor-pointer md:col-span-2 lg:col-span-2 lg:row-span-2"
      onClick={() => onOpen(activity.id)}
    >
      <div className="h-64 md:h-80 lg:h-96 flex items-center justify-center p-0">
        {activity.image ? (
          <img src={activity.image} alt={activity.activityTitle} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-[#0268ab]/10 to-[#0268ab]/5 flex items-center justify-center p-8">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{activity.activityTitle}</h3>
              <p className="text-sm text-gray-500">{activity.eskul?.name || 'Ekstrakurikuler'}</p>
            </div>
          </div>
        )}
      </div>
      <div className="absolute inset-0 bg-linear-to-t from-[#0268ab]/65 via-[#0268ab]/30 to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2">
          <div className="flex items-center justify-between text-xs text-white/85">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/90 text-[#0268ab] font-semibold uppercase tracking-wide text-[10px]">
              {activity.eskul?.name || 'Ekstrakurikuler'}
            </span>
            {dateLabel && <span className="font-semibold text-white/90">{dateLabel}</span>}
          </div>
          <h4 className="text-white font-semibold text-base">{activity.activityTitle}</h4>
          {activity.description && <p className="text-white/90 text-xs leading-relaxed line-clamp-3">{activity.description}</p>}
        </div>
      </div>
    </div>
  );
}

function SmallActivityCard({ activity, onOpen }: { activity: EskulActivity; onOpen: (id?: number) => void }) {
  const dateLabel = formatActivityDate(activity.activityDate);
  return (
    <div
      className="relative group bg-white rounded-lg overflow-hidden border border-gray-100 hover:border-gray-200 transition-all duration-300 cursor-pointer"
      onClick={() => onOpen(activity.id)}
    >
      <div className="h-40 md:h-44 flex items-center justify-center p-0">
        {activity.image ? (
          <img src={activity.image} alt={activity.activityTitle} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-gray-100 to-white flex items-center justify-center p-4">
            <div className="text-center">
              <h4 className="text-sm font-semibold text-gray-900 mb-1">{activity.activityTitle}</h4>
              <p className="text-xs text-gray-500">{activity.eskul?.name || 'Kegiatan Eskul'}</p>
            </div>
          </div>
        )}
      </div>
      <div className="absolute inset-0 bg-linear-to-t from-[#0268ab]/65 via-[#0268ab]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 p-3 flex flex-col justify-end gap-1">
          <div className="flex items-center justify-between text-xs text-white/85">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/90 text-[#0268ab] font-semibold uppercase tracking-wide text-[10px]">
              {activity.eskul?.name || 'Ekstrakurikuler'}
            </span>
            {dateLabel && <span className="font-semibold text-white/90">{dateLabel}</span>}
          </div>
          <h5 className="text-white font-semibold text-sm">{activity.activityTitle}</h5>
          {activity.description && <p className="text-white/90 text-xs leading-relaxed line-clamp-2">{activity.description}</p>}
        </div>
      </div>
    </div>
  );
}

function MiniActivityCard({ activity, onOpen }: { activity: EskulActivity; onOpen: (id?: number) => void }) {
  const dateLabel = formatActivityDate(activity.activityDate);
  return (
    <div
  className="min-w-60 bg-white rounded-xl border border-gray-100 shadow-sm p-3 flex gap-3 items-start cursor-pointer hover:border-[#0268ab]/50"
      onClick={() => onOpen(activity.image ? activity.id : undefined)}
    >
      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
        {activity.image ? (
          <img src={activity.image} alt={activity.activityTitle} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">No Image</div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 mb-0.5">{activity.eskul?.name || 'Ekstrakurikuler'}</p>
        <h5 className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2">{activity.activityTitle}</h5>
        {dateLabel && <p className="text-xs text-gray-500">{dateLabel}</p>}
      </div>
    </div>
  );
}

export default StudentLifePage;
