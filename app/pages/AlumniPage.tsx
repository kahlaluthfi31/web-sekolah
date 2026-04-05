"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Loader2,
  Users,
  Briefcase,
  Award,
  GraduationCap,
  Heart,
  HandshakeIcon,
  Trophy,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { usePageHeader } from "@/lib/usePageHeader";

// Types
interface AgendaCategory {
  id: number;
  name: string;
  color: string | null;
}

interface Agenda {
  id: number;
  title: string;
  description: string | null;
  eventDate: string | null;
  eventTime: string | null;
  timeEnd: string | null;
  timeEndText: string | null;
  location: string | null;
  organizer: string | null;
  image: string | null;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  isPublished: boolean;
  category: AgendaCategory | null;
}

interface Engagement {
  id: number;
  title: string;
  description: string | null;
  icon: string | null;
  orderPosition: number;
  isActive: boolean;
}

interface Testimonial {
  id: number;
  alumniName: string;
  graduationYear?: number | null;
  major?: string | null;
  currentOccupation?: string | null;
  company?: string | null;
  story?: string | null;
  photo?: string | null;
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  upcoming: { label: "Akan Datang", color: "bg-[#0268ab]" },
  ongoing: { label: "Berlangsung", color: "bg-emerald-500" },
  completed: { label: "Telah Selesai", color: "bg-gray-400" },
  cancelled: { label: "Dibatalkan", color: "bg-red-400" },
};

const STATUS_ORDER: Record<string, number> = {
  ongoing: 0,
  upcoming: 1,
  completed: 2,
  cancelled: 3,
};

const CTA_DEFAULTS = {
  title: "Bergabung dengan Portal Alumni",
  subtitle: "Dapatkan akses ke event, networking, dan berbagai program alumni",
  buttonText: "Masuk Portal",
  buttonUrl: "#",
};

const FALLBACK_IMAGE_UNOPTIMIZED =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDgwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNDUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMDAgMTgwSDUwMFYyNzBIMzAwVjE4MFoiIGZpbGw9IiNEMUQ1REIiLz4KPHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjkwIiB2aWV3Qm94PSIwIDAgMjAwIDkwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjkwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik03NSAyNUgxMjVWNDVINzVWMjVaIiBmaWxsPSIjRDFENUVCIi8+Cjwvc3ZnPgo8L3N2Zz4K";

const TESTIMONIAL_AVATAR_FALLBACK =
  "https://media.istockphoto.com/vectors/user-member-vector-icon-for-ui-user-interface-or-profile-face-avatar-vector-id1130884625?k=6&m=1130884625&s=170667a&w=0&h=b4ICEL-2imqnsT-m2tYGxZdxlgD1yKxmoDA-PmPc2-A=";

// Helper functions
function formatDate(dateStr: string | null): string {
  if (!dateStr) return "-";
  const raw = dateStr.substring(0, 10);
  const [y, m, d] = raw.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function parseTime(t: string): string {
  if (t.includes(":")) return t;
  return `${t.substring(0, 2)}:${t.substring(2)}`;
}

function formatTime(
  start: string | null,
  end: string | null,
  endText: string | null,
): string {
  if (!start) return "-";
  const s = parseTime(start);
  if (!end && !endText) return s + " WIB";
  if (endText) return `${s} - ${endText}`;
  return `${s} - ${parseTime(end!)} WIB`;
}

function toTimestamp(agenda: Agenda): number {
  if (!agenda.eventDate) return 0;
  const raw = agenda.eventDate.substring(0, 10);
  const [y, m, d] = raw.split("-").map(Number);
  let hour = 0;
  if (agenda.eventTime) {
    const t = parseTime(agenda.eventTime);
    const [hh] = t.split(":").map(Number);
    hour = hh;
  }
  return new Date(y, m - 1, d, hour).getTime();
}

function sortAgendas(list: Agenda[]): Agenda[] {
  const now = Date.now();
  return [...list].sort((a, b) => {
    const orderA = STATUS_ORDER[a.status] ?? 99;
    const orderB = STATUS_ORDER[b.status] ?? 99;
    if (orderA !== orderB) return orderA - orderB;
    const tsA = toTimestamp(a);
    const tsB = toTimestamp(b);
    if (a.status === "ongoing" || a.status === "upcoming") {
      return Math.abs(tsA - now) - Math.abs(tsB - now);
    }
    return tsB - tsA;
  });
}

function normalizeAlumniPhoto(photo?: string | null): string | null {
  if (!photo) return null;
  const trimmed = photo.trim();
  if (!trimmed) return null;
  if (trimmed === "null" || trimmed === "undefined") return null;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("data:")) {
    return trimmed;
  }

  const withoutPublicPrefix = trimmed.replace(/^\/?public\//, "");
  const normalizedPath = withoutPublicPrefix.replace(/^\.?\/?/, "");
  return normalizedPath ? `/${normalizedPath}` : null;
}

const AlumniPage: React.FC = () => {
  const header = usePageHeader("alumni");
  // Calendar state
  const todayObj = new Date();
  const todayStr = todayObj.toISOString().substring(0, 10);
  const [activeDay, setActiveDay] = useState<string>(todayStr);
  const [calMonth, setCalMonth] = useState<Date>(
    new Date(todayObj.getFullYear(), todayObj.getMonth(), 1),
  );
  const [agendas, setAgendas] = useState<Agenda[]>([]);
  const [loading, setLoading] = useState(true);
  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [engagementLoading, setEngagementLoading] = useState(true);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [testimonialLoading, setTestimonialLoading] = useState(true);
  const [testimonialPage, setTestimonialPage] = useState(1);
  const [testimonialTotalPages, setTestimonialTotalPages] = useState(1);
  const [ctaContent, setCtaContent] = useState(CTA_DEFAULTS);

  const engagementIconMap = useMemo(
    () => ({
      heart: Heart,
      love: Heart,
      handshake: HandshakeIcon,
      award: Award,
      graduation: GraduationCap,
      briefcase: Briefcase,
      users: Users,
      network: Users,
      trophy: Trophy,
    }),
    [],
  );

  useEffect(() => {
    fetch("/api/agendas?limit=50&page=1&isPublished=true")
      .then((r) => r.json())
      .then((j) => {
        if (j.success) {
          const sorted = sortAgendas(j.data as Agenda[]);
          setAgendas(sorted);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch("/api/alumni-engagements?active=true&limit=20")
      .then((r) => r.json())
      .then((j) => {
        if (j.success && Array.isArray(j.data)) {
          setEngagements(j.data as Engagement[]);
        }
      })
      .catch(() => {})
      .finally(() => setEngagementLoading(false));
  }, []);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((j) => {
        if (j.success && Array.isArray(j.data)) {
          const map: Record<string, string> = {};
          for (const item of j.data) {
            if (item.settingKey && typeof item.settingValue === "string") {
              map[item.settingKey] = item.settingValue;
            }
          }
          setCtaContent({
            title: map["alumni_portal_cta_title"] || CTA_DEFAULTS.title,
            subtitle:
              map["alumni_portal_cta_subtitle"] || CTA_DEFAULTS.subtitle,
            buttonText:
              map["alumni_portal_cta_button_text"] || CTA_DEFAULTS.buttonText,
            buttonUrl:
              map["alumni_portal_cta_button_url"] || CTA_DEFAULTS.buttonUrl,
          });
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setTestimonialLoading(true);
    fetch(`/api/alumni?status=approved&page=${testimonialPage}&limit=6`)
      .then((r) => r.json())
      .then((j) => {
        if (j.success && Array.isArray(j.data)) {
          setTestimonials(j.data as Testimonial[]);
          setTestimonialTotalPages(j.pagination?.totalPages || 1);
        }
      })
      .catch(() => {})
      .finally(() => setTestimonialLoading(false));
  }, [testimonialPage]);

  const agendaDates = new Set(
    agendas
      .filter((a) => a.eventDate)
      .map((a) => a.eventDate!.substring(0, 10)),
  );

  const ongoingAgenda = agendas.find((a) => a.status === "ongoing");
  const featured = ongoingAgenda ?? agendas[0] ?? null;
  const listEvents = agendas.filter((a) => a.id !== featured?.id).slice(0, 3);

  const selectedDayAgendas = agendas.filter(
    (a) => a.eventDate && a.eventDate.substring(0, 10) === activeDay,
  );

  const year = calMonth.getFullYear();
  const month = calMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  const calCells: Array<{
    dateStr: string;
    day: number;
    isRed: boolean;
  } | null> = [
    ...Array(firstDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const d = new Date(year, month, day);
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      return { dateStr, day, isRed: d.getDay() === 0 };
    }),
  ];

  const prevMonth = () => setCalMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCalMonth(new Date(year, month + 1, 1));

  const currentMonthLabel = calMonth.toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });

  const selectedDayLabel = (() => {
    const [y, m, d] = activeDay.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  })();

  const renderEngagementItems = () => {
    const listToRender =
      engagements.length > 0
        ? engagements
        : [
            {
              id: 1,
              title: "Mentoring",
              description:
                "Bagikan pengalaman berharga dan bimbing alumni junior untuk meraih kesuksesan karir mereka",
              icon: "heart",
              orderPosition: 1,
              isActive: true,
            },
            {
              id: 2,
              title: "Networking",
              description:
                "Perluas jaringan profesional dan bangun kolaborasi yang bermanfaat dengan sesama alumni",
              icon: "handshake",
              orderPosition: 2,
              isActive: true,
            },
            {
              id: 3,
              title: "Donasi",
              description:
                "Dukung program beasiswa dan pengembangan fasilitas sekolah untuk generasi penerus",
              icon: "award",
              orderPosition: 3,
              isActive: true,
            },
            {
              id: 4,
              title: "Guest Lecture",
              description:
                "Berbagi ilmu dan pengalaman industri langsung kepada siswa untuk persiapan karir mereka",
              icon: "graduation",
              orderPosition: 4,
              isActive: true,
            },
            {
              id: 5,
              title: "Magang",
              description:
                "Buka kesempatan magang berharga untuk alumni junior memulai karir profesional mereka",
              icon: "briefcase",
              orderPosition: 5,
              isActive: true,
            },
            {
              id: 6,
              title: "Event Alumni",
              description:
                "Ikuti dan ramaikan acara reuni serta networking untuk mempererat tali persaudaraan alumni",
              icon: "users",
              orderPosition: 6,
              isActive: true,
            },
          ];

    const sorted = [...listToRender].sort(
      (a, b) => (a.orderPosition ?? 0) - (b.orderPosition ?? 0),
    );

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
        {sorted.map((item) => {
          const IconComp = item.icon
            ? engagementIconMap[item.icon as keyof typeof engagementIconMap] ||
              Sparkles
            : Heart;
          return (
            <div key={item.id} className="flex gap-4 group">
              <div className="shrink-0">
                <div className="w-14 h-14 rounded-full bg-[#0268ab] flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                  <IconComp className="w-7 h-7" strokeWidth={2} />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-[#0268ab] mb-3 leading-tight">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="pt-24 pb-16 relative overflow-hidden">
        {/* Background dengan gradien opacity dari atas ke bawah menggunakan warna primary */}
        <div className="absolute inset-0 bg-linear-to-b from-[#0268ab] via-[#0268ab]/80 to-transparent"></div>

        {/* Dotted pattern overlay */}
        <div className="absolute inset-0 opacity-15">
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3Ccircle cx='10' cy='10' r='1.5'/%3E%3Ccircle cx='50' cy='10' r='1.5'/%3E%3Ccircle cx='10' cy='50' r='1.5'/%3E%3Ccircle cx='50' cy='50' r='1.5'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        {/* School-related floating elements */}
        <div className="absolute top-10 right-20 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 left-20 w-48 h-48 bg-white opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>

        {/* Alumni-related illustrations */}
        <div className="absolute top-20 left-10 text-white/10">
          <GraduationCap className="w-16 h-16" strokeWidth={1} />
        </div>
        <div className="absolute top-32 right-16 text-white/10">
          <Users className="w-12 h-12" strokeWidth={1} />
        </div>
        <div className="absolute bottom-20 left-32 text-white/10">
          <Award className="w-14 h-14" strokeWidth={1} />
        </div>
        <div className="absolute top-1/3 right-32 text-white/10">
          <Trophy className="w-10 h-10" strokeWidth={1} />
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

      {/* Cara Terlibat */}
      <section className="py-16 lg:py-20 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12 border-b border-gray-200 pb-6">
            <span className="text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase">
              Cara Terlibat
            </span>
            <span className="text-xs text-gray-400">01 / 02</span>
          </div>
          {engagementLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, idx) => (
                <div key={idx} className="flex gap-4 animate-pulse">
                  <div className="w-14 h-14 rounded-full bg-blue-100" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-32" />
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            renderEngagementItems()
          )}
        </div>
      </section>

      {/* Event & Kegiatan Alumni */}
      {/* <section className="py-16 lg:py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12 border-b border-gray-200 pb-6">
            <span className="text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase">Event & Kegiatan Alumni</span>
            <span className="text-xs text-gray-400">04 / 04</span>
          </div>
          
          <p className="text-gray-600 text-lg max-w-2xl mb-16">
            Ikuti berbagai acara networking, workshop, dan reuni alumni untuk memperkuat koneksi profesional
          </p>

          Main layout
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            Left: Featured + list
            <div className="lg:col-span-8 flex flex-col gap-4">

              {loading ? (
                <div className="flex items-center justify-center h-80 rounded-2xl bg-gray-50">
                  <Loader2 className="w-6 h-6 animate-spin text-[#0268ab]" />
                </div>
              ) : !featured ? (
                <div className="flex flex-col items-center justify-center h-80 rounded-2xl bg-gray-50 text-center gap-2">
                  <CalendarDays className="w-10 h-10 text-gray-300" />
                  <p className="text-sm text-gray-400">Belum ada agenda yang tersedia.</p>
                </div>
              ) : (
                <>
                  Featured event card
                  <div className="relative rounded-2xl overflow-hidden h-80 group cursor-pointer">
                    <Image
                      src={featured.image || FALLBACK_IMAGE_UNOPTIMIZED}
                      alt={featured.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 66vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                      unoptimized={featured.image ? false : true}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />

                    Status badge
                    <div className="absolute top-4 right-4">
                      <span className={`${STATUS_MAP[featured.status]?.color ?? 'bg-gray-500'} text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-white/70 inline-block" />
                        {STATUS_MAP[featured.status]?.label ?? featured.status}
                      </span>
                    </div>

                    Content overlay
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <p className="text-white/60 text-xs mb-2">
                        {formatTime(featured.eventTime, featured.timeEnd, featured.timeEndText)}
                        &nbsp;|&nbsp;
                        {formatDate(featured.eventDate)}
                      </p>
                      <h3 className="text-white text-xl font-bold leading-snug mb-2 line-clamp-2">
                        {featured.title}
                      </h3>
                      {featured.description && (
                        <p className="text-white/60 text-xs leading-relaxed line-clamp-2 mb-2">
                          {featured.description}
                        </p>
                      )}
                      {(featured.category || featured.organizer) && (
                        <p className="text-white/50 text-xs">
                          {featured.category?.name}
                          {featured.category && featured.organizer && ' · '}
                          {featured.organizer}
                        </p>
                      )}
                    </div>
                  </div>

                  List events
                  {listEvents.length > 0 && (
                    <div className="flex flex-col gap-3">
                      {listEvents.map((event) => {
                        const st = STATUS_MAP[event.status] ?? { label: event.status, color: 'bg-gray-400' }
                        const isCompleted = event.status === 'completed' || event.status === 'cancelled'
                        return (
                          <div
                            key={event.id}
                            className={`flex items-center gap-4 rounded-2xl p-4 cursor-pointer transition-all duration-200 ${
                              isCompleted ? 'bg-gray-50 hover:bg-gray-100' : 'bg-blue-50 hover:bg-blue-100'
                            }`}
                          >
                            Thumbnail
                            <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0">
                              <Image
                                src={event.image || FALLBACK_IMAGE_UNOPTIMIZED}
                                alt={event.title}
                                fill
                                sizes="56px"
                                className="object-cover"
                                loading="lazy"
                                unoptimized={event.image ? false : true}
                              />
                            </div>

                            Info
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-400 mb-0.5">
                                {formatTime(event.eventTime, event.timeEnd, event.timeEndText)}
                                &nbsp;·&nbsp;
                                {formatDate(event.eventDate)}
                              </p>
                              <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">{event.title}</h4>

                              {(event.category || event.organizer || event.location) && (
                                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                  {event.category && (
                                    <span className="text-xs text-gray-400">{event.category.name}</span>
                                  )}
                                  {event.category && event.organizer && (
                                    <span className="text-gray-300">·</span>
                                  )}
                                  {event.organizer && (
                                    <span className="text-xs text-gray-400">{event.organizer}</span>
                                  )}
                                  {event.location && (
                                    <>
                                      <span className="text-gray-300">·</span>
                                      <span className="text-xs text-gray-400 truncate max-w-30">{event.location}</span>
                                    </>
                                  )}
                                </div>
                              )}
                            </div>

                            Status badge
                            <span className={`shrink-0 text-xs font-semibold px-4 py-1.5 rounded-full text-white ${st.color}`}>
                              {st.label}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </>
              )}
            </div>

            Right: Calendar sidebar
            <div className="lg:col-span-4">
              <div className="rounded-2xl border border-gray-100 bg-white p-6 sticky top-6">
                <h3 className="text-base font-bold text-[#0268ab] mb-1">Agenda Alumni</h3>
                <p className="text-xs text-gray-400 mb-5">Dapatkan informasi terkait semua kegiatan alumni SMKN 1 Ciamis.</p>

                Mini Calendar
                <div className="mb-4">
                  Header bulan
                  <div className="flex items-center justify-between mb-3">
                    <button
                      onClick={prevMonth}
                      className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 text-gray-400" />
                    </button>
                    <span className="text-sm font-semibold text-gray-700 capitalize">{currentMonthLabel}</span>
                    <button
                      onClick={nextMonth}
                      className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>

                  Header hari
                  <div className="grid grid-cols-7 gap-0.5 mb-1">
                    {dayNames.map(n => (
                      <div key={n} className={`text-center text-[10px] font-semibold uppercase py-1 ${n === 'Min' ? 'text-red-400' : 'text-gray-400'}`}>
                        {n}
                      </div>
                    ))}
                  </div>

                  Grid hari
                  <div className="grid grid-cols-7 gap-0.5">
                    {calCells.map((cell, idx) => {
                      if (!cell) return <div key={`blank-${idx}`} />
                      const hasAgenda = agendaDates.has(cell.dateStr)
                      const isActive  = activeDay === cell.dateStr
                      const isToday   = cell.dateStr === todayStr
                      return (
                        <button
                          key={cell.dateStr}
                          onClick={() => setActiveDay(cell.dateStr)}
                          className={`relative py-2 text-xs rounded-lg transition-colors ${
                            isActive
                              ? 'bg-[#0268ab] text-white font-bold'
                              : isToday
                              ? 'bg-blue-50 text-[#0268ab] font-semibold'
                              : cell.isRed
                              ? 'text-red-400 hover:bg-gray-50'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {cell.day}
                          {hasAgenda && !isActive && (
                            <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#0268ab]" />
                          )}
                          {hasAgenda && isActive && (
                            <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white/70" />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>

                Agenda list untuk hari yang dipilih
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-xs font-semibold text-gray-500 mb-3 capitalize">{selectedDayLabel}</p>

                  {loading ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="w-4 h-4 animate-spin text-[#0268ab]" />
                    </div>
                  ) : selectedDayAgendas.length === 0 ? (
                    <div className="flex flex-col items-center py-5 text-center">
                      <CalendarDays className="w-8 h-8 text-gray-200 mb-2" />
                      <p className="text-xs font-semibold text-[#0268ab] mb-0.5">Tidak ada agenda</p>
                      <p className="text-xs text-gray-400">Belum ada kegiatan di hari ini</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2.5 max-h-56 overflow-y-auto pr-1">
                      {selectedDayAgendas.map(a => {
                        const st = STATUS_MAP[a.status] ?? { label: a.status, color: 'bg-gray-400' }
                        return (
                          <div key={a.id} className="flex items-start gap-2.5 rounded-xl p-2.5 bg-gray-50 hover:bg-blue-50 transition-colors cursor-pointer">
                            Warna status
                            <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${st.color}`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-gray-800 line-clamp-2 leading-snug">{a.title}</p>
                              <p className="text-[11px] text-gray-400 mt-0.5">
                                {formatTime(a.eventTime, a.timeEnd, a.timeEndText)}
                                {a.location && ` · ${a.location}`}
                              </p>
                            </div>
                            <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full text-white ${st.color}`}>
                              {st.label}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                See all
                <button className="w-full mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-gray-900 hover:text-[#0268ab] transition-colors duration-200 border-t border-gray-100 pt-4">
                  Lihat Semua Agenda
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section> */}

      {/* Testimoni Alumni */}
      <section className="py-16 lg:py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12 border-b border-gray-200 pb-6">
            <span className="text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase">
              Testimoni Alumni
            </span>
            <span className="text-xs text-gray-400">02 / 02</span>
          </div>

          {testimonialLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, idx) => (
                <div key={idx} className="rounded-2xl border border-gray-100 bg-gray-50 p-6 animate-pulse space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-200" />
                    <div className="space-y-2 w-full">
                      <div className="h-3 bg-gray-200 rounded w-28" />
                      <div className="h-3 bg-gray-200 rounded w-20" />
                    </div>
                  </div>
                  <div className="h-16 bg-gray-200 rounded" />
                  <div className="h-3 bg-gray-200 rounded w-24" />
                </div>
              ))}
            </div>
          ) : testimonials.length === 0 ? (
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-10 text-center text-gray-500">
              Belum ada testimoni yang ditampilkan.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map((alumni) => (
                  (() => {
                    const normalizedPhoto = normalizeAlumniPhoto(alumni.photo);
                    const photoSrc = normalizedPhoto || TESTIMONIAL_AVATAR_FALLBACK;

                    return (
                      <div
                        key={alumni.id}
                        className="group bg-white rounded-2xl p-6 flex flex-col items-center text-center border border-transparent hover:border-[#0268ab] transition-all duration-300 ease-in-out shadow-sm hover:shadow-md relative overflow-hidden"
                      >
                        <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-gray-100 mb-4 shrink-0">
                          <Image
                            src={photoSrc}
                            alt={alumni.alumniName}
                            fill
                            sizes="80px"
                            className="object-cover"
                            loading="lazy"
                            unoptimized
                            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                              const target = e.currentTarget;
                              if (target.src === TESTIMONIAL_AVATAR_FALLBACK) return;
                              target.src = TESTIMONIAL_AVATAR_FALLBACK;
                            }}
                          />
                        </div>

                        <h4 className="text-sm font-bold text-gray-900">{alumni.alumniName}</h4>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {alumni.currentOccupation || alumni.major || "Alumni"}
                        </p>
                        {alumni.company && (
                          <p className="text-xs text-gray-400">{alumni.company}</p>
                        )}

                        <span className="text-3xl leading-none text-[#0268ab]/30 font-serif self-start mb-1">
                          &ldquo;
                        </span>

                        {alumni.story && (
                          <p className="text-sm text-gray-600 leading-relaxed flex-1 px-1 line-clamp-5">{alumni.story}</p>
                        )}

                        <span className="text-3xl leading-none text-[#0268ab]/30 font-serif self-end mt-1">
                          &rdquo;
                        </span>

                        {alumni.graduationYear && (
                          <p className="mt-3 text-[11px] text-gray-400">Lulusan {alumni.graduationYear}</p>
                        )}
                      </div>
                    );
                  })()
                ))}
              </div>

              {testimonialTotalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <button
                    onClick={() => setTestimonialPage((p) => Math.max(1, p - 1))}
                    disabled={testimonialPage === 1}
                    className={`p-2 transition-colors ${
                      testimonialPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-[#0268ab]'
                    }`}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  {Array.from({ length: testimonialTotalPages }, (_, i) => i + 1).map((num) => (
                    <button
                      key={num}
                      onClick={() => setTestimonialPage(num)}
                      className={`w-8 h-8 rounded-full text-xs font-bold transition-colors ${
                        num === testimonialPage
                          ? 'bg-[#0268ab] text-white'
                          : 'text-gray-500 hover:bg-gray-100 hover:text-[#0268ab]'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    onClick={() => setTestimonialPage((p) => Math.min(testimonialTotalPages, p + 1))}
                    disabled={testimonialPage === testimonialTotalPages}
                    className={`p-2 transition-colors ${
                      testimonialPage === testimonialTotalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-[#0268ab]'
                    }`}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-linear-to-r from-[#0268ab] to-[#0e3057] rounded-2xl p-8 lg:p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              {ctaContent.title}
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              {ctaContent.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={ctaContent.buttonUrl || "#"}
                className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-[#0268ab] transition-all"
                target={
                  ctaContent.buttonUrl?.startsWith("http") ? "_blank" : "_self"
                }
                rel={
                  ctaContent.buttonUrl?.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
              >
                {ctaContent.buttonText}
              </a>
              <a
                href="/alumni/form"
                className="px-8 py-3 bg-white text-[#0268ab] rounded-lg font-semibold shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all"
              >
                Alumni Berbagi Cerita
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AlumniPage;
