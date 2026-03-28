"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Map,
  Ticket,
  Star,
  Megaphone,
  Trophy,
  Medal,
  BookOpen,
  GraduationCap,
  School,
  Handshake,
  Palette,
  Mic,
  Activity,
  AlarmClock,
  Atom,
  Award,
  ClipboardList,
  ClipboardCheck,
  Briefcase,
  Building2,
  BusFront,
  Camera,
  Clapperboard,
  Video,
  Church,
  Code,
  CookingPot,
  Dumbbell,
  Film,
  Flag,
  Gamepad2,
  HeartHandshake,
  Library,
  Lightbulb,
  Music,
  Music2,
  PartyPopper,
  Paintbrush,
  PenTool,
  ShieldCheck,
  Stethoscope,
  HeartPulse,
  FlaskConical,
  TestTube,
  Microscope,
  Theater,
  Trees,
  Leaf,
  Mountain,
  Umbrella,
  Droplets,
  Recycle,
  Volleyball,
  Compass,
  Globe2,
  Cpu,
  Server,
  Smartphone,
  TabletSmartphone,
  Monitor,
  Bot,
  Rocket,
  Wifi,
  Sparkles,
  Laptop,
} from "lucide-react";
import { usePageHeader } from "@/lib/usePageHeader";

const EVENTS_HEADER_FALLBACK = {
  title: "Agenda Sekolah",
  subtitle:
    "Temukan jadwal kegiatan terbaru, informasi pendaftaran, dan agenda penting sekolah kami.",
};

const EVENTS_PER_PAGE = 3;

type AgendaStatus = "upcoming" | "ongoing" | "completed" | "cancelled";

type AgendaCategory = {
  id: number;
  name: string;
  color: string | null;
  description: string | null;
  icon: string | null;
  isActive: boolean;
  showInCategorySection: boolean;
};

type AgendaApiItem = {
  id: number;
  title: string;
  description: string | null;
  eventDate: string | null;
  eventTime: string | null;
  timeEnd: string | null;
  timeEndText: string | null;
  location: string | null;
  organizer: string | null;
  participants: string | null;
  status: AgendaStatus;
  isPublished: boolean;
  category: { id: number; name: string; color: string | null } | null;
  hasRegistration?: boolean;
  registrationUrl?: string | null;
};

type UiEvent = {
  id: number;
  month: string;
  day: string;
  year: string;
  category: string;
  title: string;
  description: string;
  time: string;
  location: string;
  organizer: string;
  participants: string;
  color: string;
  registrationUrl?: string | null;
  status: AgendaStatus;
};

type RegistrationInfo = {
  icon: string;
  title: string;
  desc: string;
  steps: string[];
};

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const DEFAULT_REGISTRATION_INFO: RegistrationInfo[] = [
  {
    icon: "ticket",
    title: "Pendaftaran Online",
    desc: "Daftar secara online melalui website sekolah",
    steps: [
      "Isi formulir pendaftaran",
      "Upload dokumen yang diperlukan",
      "Konfirmasi pembayaran",
    ],
  },
  {
    icon: "calendar",
    title: "Pendaftaran Offline",
    desc: "Datang langsung ke sekolah untuk mendaftar",
    steps: [
      "Kunjungi ruang administrasi",
      "Bawa dokumen asli",
      "Selesaikan pendaftaran di tempat",
    ],
  },
  {
    icon: "users",
    title: "Syarat & Ketentuan",
    desc: "Persyaratan yang harus dipenuhi peserta",
    steps: [
      "Siswa aktif SMKN 1 Ciamis",
      "Melampirkan izin orang tua",
      "Mematuhi peraturan acara",
    ],
  },
];

const ICON_MAP = {
  calendar: Calendar,
  calendarClock: CalendarDays,
  calendarCheck: CalendarDays,
  megaphone: Megaphone,
  trophy: Trophy,
  medal: Medal,
  book: BookOpen,
  graduation: GraduationCap,
  school: School,
  handshake: Handshake,
  palette: Palette,
  mic: Mic,
  star: Star,
  activity: Activity,
  alarm: AlarmClock,
  atom: Atom,
  award: Award,
  clipboardList: ClipboardList,
  clipboardCheck: ClipboardCheck,
  briefcase: Briefcase,
  building: Building2,
  bus: BusFront,
  map: Map,
  mapPinned: MapPin,
  camera: Camera,
  clapperboard: Clapperboard,
  video: Video,
  church: Church,
  code: Code,
  cooking: CookingPot,
  fitness: Dumbbell,
  film: Film,
  gift: Award,
  flag: Flag,
  ticket: Ticket,
  game: Gamepad2,
  heartHandshake: HeartHandshake,
  library: Library,
  lightbulb: Lightbulb,
  music: Music,
  music2: Music2,
  partyPopper: PartyPopper,
  paintbrush: Paintbrush,
  pen: PenTool,
  shield: ShieldCheck,
  stethoscope: Stethoscope,
  heartPulse: HeartPulse,
  flask: FlaskConical,
  testTube: TestTube,
  microscope: Microscope,
  theater: Theater,
  trees: Trees,
  leaf: Leaf,
  mountain: Mountain,
  umbrella: Umbrella,
  droplets: Droplets,
  recycle: Recycle,
  volleyball: Volleyball,
  compass: Compass,
  globe: Globe2,
  cpu: Cpu,
  server: Server,
  smartphone: Smartphone,
  tablet: TabletSmartphone,
  monitor: Monitor,
  bot: Bot,
  rocket: Rocket,
  wifi: Wifi,
  sparkles: Sparkles,
  laptop: Laptop,
} as const;

type IconKey = keyof typeof ICON_MAP;

const colorFallbacks = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-orange-500",
  "bg-indigo-500",
];

function formatDateParts(dateStr: string | null): {
  month: string;
  day: string;
  year: string;
} {
  if (!dateStr) return { month: "-", day: "-", year: "-" };
  const [y, m, d] = dateStr
    .substring(0, 10)
    .split("-")
    .map((v) => parseInt(v, 10));
  const month = Number.isFinite(m) ? MONTHS[(m - 1 + 12) % 12] : "-";
  return {
    month,
    day: Number.isFinite(d) ? String(d).padStart(2, "0") : "-",
    year: Number.isFinite(y) ? String(y) : "-",
  };
}

function renderIcon(
  icon: string | null | undefined,
  className = "w-8 h-8 text-[#0268ab]",
) {
  if (!icon) return <Calendar className={className} />;
  const IconComp = ICON_MAP[icon as IconKey];
  if (IconComp) return <IconComp className={className} />;
  return <span className="text-sm text-gray-500">{icon}</span>;
}

function formatTimeRange(item: AgendaApiItem): string {
  const toTime = (val: string | null) => {
    if (!val) return "";
    try {
      if (val.includes("T")) {
        const d = new Date(val);
        if (isNaN(d.getTime())) return "";
        return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
      }
      const [hh = "", mm = ""] = val.split(":");
      if (hh === "" || mm === "") return "";
      return `${hh.padStart(2, "0")}:${mm.padStart(2, "0")}`;
    } catch {
      return "";
    }
  };

  const start = toTime(item.eventTime);
  const end = item.timeEndText ? "Selesai" : toTime(item.timeEnd);
  if (!start && !end) return "-";
  if (start && !end) return start;
  if (start && end) return `${start} - ${end}`;
  return "-";
}

function toUiEvent(item: AgendaApiItem, idx: number): UiEvent {
  const dateParts = formatDateParts(item.eventDate);
  const color = item.category?.color
    ? ""
    : colorFallbacks[idx % colorFallbacks.length];
  return {
    id: item.id,
    month: dateParts.month,
    day: dateParts.day,
    year: dateParts.year,
    category: item.category?.name || "Umum",
    title: item.title,
    description: item.description || "-",
    time: formatTimeRange(item),
    location: item.location || "-",
    organizer: item.organizer || "-",
    participants: item.participants || "-",
    color: color || "bg-blue-500",
    registrationUrl: item.hasRegistration ? item.registrationUrl || null : null,
    status: item.status,
  };
}

const EventsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"upcoming" | "ongoing" | "past">(
    "upcoming",
  );
  const [timelinePage, setTimelinePage] = useState(1);
  const [agendas, setAgendas] = useState<AgendaApiItem[]>([]);
  const [categories, setCategories] = useState<AgendaCategory[]>([]);
  const [expandedDescriptions, setExpandedDescriptions] = useState<
    Record<number, boolean>
  >({});
  const [registrationInfos, setRegistrationInfos] = useState<
    RegistrationInfo[]
  >(DEFAULT_REGISTRATION_INFO);
  const header = usePageHeader("events", EVENTS_HEADER_FALLBACK);

  useEffect(() => {
    let mounted = true;
    fetch("/api/agendas?isPublished=true&limit=200")
      .then((r) => r.json())
      .then((json) => {
        if (!mounted) return;
        if (json?.success && Array.isArray(json.data)) {
          setAgendas(json.data as AgendaApiItem[]);
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    fetch("/api/agenda-categories/list")
      .then((r) => r.json())
      .then((json) => {
        if (!mounted) return;
        if (json?.success && Array.isArray(json.data)) {
          setCategories(json.data as AgendaCategory[]);
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    fetch("/api/settings")
      .then((r) => r.json())
      .then((json) => {
        if (!mounted) return;
        if (json?.success && Array.isArray(json.data)) {
          const raw = (
            json.data as { settingKey: string; settingValue: string | null }[]
          ).find(
            (s) => s.settingKey === "events_registration_info",
          )?.settingValue;
          if (raw) {
            try {
              const parsed = JSON.parse(raw);
              if (Array.isArray(parsed)) {
                const sanitized = parsed.map((item) => {
                  const steps =
                    Array.isArray(item?.steps) && item.steps.length > 0
                      ? item.steps.map((s: unknown) => String(s || ""))
                      : [""];
                  return {
                    icon: String(item?.icon || "ticket"),
                    title: String(item?.title || ""),
                    desc: String(item?.desc || ""),
                    steps,
                  } as RegistrationInfo;
                });
                if (sanitized.length > 0) {
                  setRegistrationInfos(sanitized);
                }
              }
            } catch {
              // ignore parse errors, keep default
            }
          }
        }
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, []);

  const upcomingEvents = useMemo(() => {
    const toMs = (item: AgendaApiItem) => {
      if (!item.eventDate) return Number.MAX_SAFE_INTEGER;
      return new Date(item.eventDate.substring(0, 10)).getTime();
    };
    return agendas
      .filter((a) => a.status === "upcoming")
      .sort((a, b) => toMs(a) - toMs(b))
      .map(toUiEvent);
  }, [agendas]);

  const ongoingEvents = useMemo(() => {
    const toMs = (item: AgendaApiItem) => {
      if (!item.eventDate) return Number.MAX_SAFE_INTEGER;
      return new Date(item.eventDate.substring(0, 10)).getTime();
    };
    return agendas
      .filter((a) => a.status === "ongoing")
      .sort((a, b) => toMs(a) - toMs(b))
      .map(toUiEvent);
  }, [agendas]);

  const pastEvents = useMemo(() => {
    const toMs = (item: AgendaApiItem) => {
      if (!item.eventDate) return 0;
      return new Date(item.eventDate.substring(0, 10)).getTime();
    };
    return agendas
      .filter((a) => a.status === "completed" || a.status === "cancelled")
      .sort((a, b) => toMs(b) - toMs(a))
      .map(toUiEvent);
  }, [agendas]);

  const currentEvents =
    activeTab === "upcoming"
      ? upcomingEvents
      : activeTab === "ongoing"
        ? ongoingEvents
        : pastEvents;

  const timelineTotalPages = Math.max(
    1,
    Math.ceil(currentEvents.length / EVENTS_PER_PAGE),
  );

  const paginatedCurrentEvents = useMemo(() => {
    const start = (timelinePage - 1) * EVENTS_PER_PAGE;
    return currentEvents.slice(start, start + EVENTS_PER_PAGE);
  }, [currentEvents, timelinePage]);

  const timelinePageNumbers = useMemo(() => {
    const total = Math.max(timelineTotalPages, 1);
    const pages: Array<number | "..."> = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i += 1) pages.push(i);
      return pages;
    }

    if (timelinePage <= 4) {
      pages.push(1, 2, 3, 4, 5, "...", total);
      return pages;
    }

    if (timelinePage >= total - 3) {
      pages.push(1, "...", total - 4, total - 3, total - 2, total - 1, total);
      return pages;
    }

    pages.push(1, "...", timelinePage - 1, timelinePage, timelinePage + 1, "...", total);
    return pages;
  }, [timelinePage, timelineTotalPages]);

  useEffect(() => {
    setTimelinePage(1);
  }, [activeTab]);

  useEffect(() => {
    if (timelinePage > timelineTotalPages) {
      setTimelinePage(timelineTotalPages);
    }
  }, [timelinePage, timelineTotalPages]);

  const agendaTabs: Array<{
    key: "upcoming" | "ongoing" | "past";
    label: string;
    hint: string;
    count: number;
  }> = [
    {
      key: "upcoming",
      label: "Mendatang",
      hint: "Acara berikutnya",
      count: upcomingEvents.length,
    },
    {
      key: "ongoing",
      label: "Berlangsung",
      hint: "Sedang berjalan",
      count: ongoingEvents.length,
    },
    {
      key: "past",
      label: "Selesai",
      hint: "Arsip kegiatan",
      count: pastEvents.length,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Contact Page Style */}
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
            <span className="text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase">
              Agenda Acara
            </span>
            <span className="text-xs text-gray-400">01 / 03</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Filter Agenda */}
            <aside className="lg:col-span-4 xl:col-span-3">
              <div className="lg:sticky lg:top-24">
                <div className="mb-3 text-[11px] font-semibold tracking-[0.2em] text-gray-400 uppercase">
                  Filter Agenda
                </div>
                <div className="space-y-1.5 border-l border-gray-200 pl-3">
                  {agendaTabs.map((tab) => {
                    const isActive = activeTab === tab.key;
                    return (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`w-full flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left transition-all ${
                          isActive
                            ? "bg-[#0268ab]/8 text-[#0268ab]"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                        title={tab.hint}
                      >
                        <div>
                          <div className="text-sm font-semibold leading-none">{tab.label}</div>
                          <div className="text-[11px] text-gray-500 mt-1">{tab.hint}</div>
                        </div>
                        <span
                          className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-semibold ${
                            isActive
                              ? "bg-[#0268ab] text-white"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {tab.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </aside>

            {/* Timeline Content */}
            <div className="lg:col-span-8 xl:col-span-9">
              {currentEvents.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-5 py-10 text-center text-sm text-gray-500">
                  {activeTab === "upcoming"
                    ? "Sedang tidak ada agenda mendatang"
                    : activeTab === "ongoing"
                      ? "Sedang tidak ada agenda berlangsung"
                      : "Sedang tidak ada agenda selesai"}
                </div>
              ) : (
                <div className="relative sm:pl-2">
                  <div className="hidden sm:block absolute left-8 top-2 bottom-2 w-px bg-gray-200"></div>

                  <div className="space-y-4">
                    {paginatedCurrentEvents.map((event) => {
                      const isExpanded = expandedDescriptions[event.id] || false;
                      const isLong = event.description.length > 220;
                      const displayText =
                        isExpanded || !isLong
                          ? event.description
                          : `${event.description.slice(0, 220)}...`;

                      return (
                        <article key={event.id} className="relative sm:pl-20">
                          <div className="hidden sm:flex absolute left-0 top-0.5 h-16 w-16 flex-col items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0268ab] leading-none">
                              {event.month}
                            </span>
                            <span className="text-xl font-black text-gray-900 leading-none mt-1">
                              {event.day}
                            </span>
                          </div>

                          <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 hover:border-[#0268ab]/25 hover:shadow-sm transition-all">
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="rounded-full bg-[#0268ab]/10 px-2 py-0.5 text-[10px] font-semibold text-[#0268ab]">
                                  {event.category}
                                </span>
                                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600 capitalize">
                                  {event.status}
                                </span>
                              </div>
                              <span className="sm:hidden text-[11px] text-gray-500 font-semibold">
                                {event.day} {event.month} {event.year}
                              </span>
                            </div>

                            <h3 className="text-sm sm:text-base font-bold text-gray-900 leading-snug mb-2">
                              {event.title}
                            </h3>

                            <div className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-3">
                              <p>{displayText}</p>
                              {isLong && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setExpandedDescriptions((prev) => ({
                                      ...prev,
                                      [event.id]: !isExpanded,
                                    }))
                                  }
                                  className="mt-1 text-xs font-semibold text-[#0268ab] hover:underline"
                                >
                                  {isExpanded ? "Sembunyikan" : "Selengkapnya"}
                                </button>
                              )}
                            </div>

                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs sm:text-sm text-gray-600">
                              <span className="inline-flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-[#0268ab]" />
                                {event.time}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-[#0268ab]" />
                                {event.location}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <Users className="w-3.5 h-3.5 text-[#0268ab]" />
                                {event.participants}
                              </span>
                            </div>

                            <div className="mt-2 text-xs sm:text-sm text-gray-600">
                              <span className="inline-flex items-center gap-1.5">
                                <CalendarDays className="w-3.5 h-3.5 text-[#0268ab]" />
                                Penyelenggara: <span className="font-semibold text-gray-800">{event.organizer}</span>
                              </span>
                            </div>

                            {event.registrationUrl && activeTab !== "past" && (
                              <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end">
                                <a
                                  href={event.registrationUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1.5 rounded-full bg-[#0268ab] px-3.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#014a8f] transition-colors"
                                >
                                  Daftar
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            )}
                          </div>
                        </article>
                      );
                    })}
                  </div>

                  {timelineTotalPages > 1 && (
                    <div className="mt-6 flex justify-center items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setTimelinePage((prev) => Math.max(prev - 1, 1))}
                        disabled={timelinePage === 1}
                        className={`p-2 transition-colors ${
                          timelinePage === 1
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-gray-400 hover:text-[#0268ab]"
                        }`}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>

                      {timelinePageNumbers.map((p, idx) => {
                        if (p === "...") {
                          return (
                            <span key={`timeline-ellipsis-${idx}`} className="px-2 text-gray-400">
                              ...
                            </span>
                          );
                        }

                        const isActive = p === timelinePage;
                        return (
                          <button
                            key={`timeline-page-${p}`}
                            type="button"
                            onClick={() => setTimelinePage(p)}
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
                        type="button"
                        onClick={() =>
                          setTimelinePage((prev) => Math.min(prev + 1, timelineTotalPages))
                        }
                        disabled={timelinePage === timelineTotalPages}
                        className={`p-2 transition-colors ${
                          timelinePage === timelineTotalPages
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-gray-400 hover:text-[#0268ab]"
                        }`}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Event Categories Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-12 border-b border-gray-200 pb-6">
            <span className="text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase">
              Kategori Acara
            </span>
            <span className="text-xs text-gray-400">02 / 03</span>
          </div>

          {/* <p className="text-gray-600 text-lg max-w-2xl mb-16">
            Berbagai jenis acara yang diselenggarakan di SMKN 1 Ciamis
          </p> */}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories
              .filter((c) => c.showInCategorySection && c.isActive)
              .map((category) => {
                const accent = category.color || "#0268ab";
                const categoryAgendaCount = agendas.filter(
                  (agenda) => agenda.category?.id === category.id,
                ).length;
                return (
                  <div
                    key={category.id}
                    className="bg-white rounded-2xl p-8 shadow-none border border-gray-100 hover:shadow-[0_1px_2px_rgba(15,23,42,0.06)] transition-all duration-300 relative overflow-hidden"
                  >
                    <div className="absolute -bottom-12 -right-12 w-40 h-40 opacity-15">
                      <div className="w-full h-full flex items-center justify-center">
                        <Image
                          src="/images/logosmeabnw.svg"
                          alt="SMKN 1 Ciamis Logo"
                          width={160}
                          height={160}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>

                    <div className="relative z-10">
                      <div className="mb-5 flex items-center justify-between gap-3">
                        <span
                          className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold"
                          style={{
                            color: accent,
                            background: `${accent}14`,
                          }}
                        >
                          Kategori Acara
                        </span>
                        <span className="text-xs font-semibold text-gray-500">
                          {categoryAgendaCount} agenda
                        </span>
                      </div>
                      <h4 className="font-bold text-xl text-gray-900 mb-3">
                        {category.name}
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {category.description || "Tidak ada deskripsi"}
                      </p>
                    </div>
                  </div>
                );
              })}
            {categories.filter((c) => c.showInCategorySection && c.isActive)
              .length === 0 && (
              <div className="col-span-full text-center text-gray-500 text-sm">
                Belum ada kategori yang ditampilkan.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Event Registration Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-12 border-b border-gray-200 pb-6">
            <span className="text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase">
              Informasi Pendaftaran
            </span>
            <span className="text-xs text-gray-400">03 / 03</span>
          </div>

          <div className="rounded-3xl border border-[#0268ab]/15 bg-linear-to-br from-[#0268ab]/8 via-white to-white p-6 sm:p-8 mb-6">
            <p className="text-[11px] font-semibold tracking-[0.22em] text-[#0268ab] uppercase mb-2">
              Panduan Singkat
            </p>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug mb-2">
              Alur Pendaftaran Acara
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed max-w-3xl">
              Setiap metode memiliki langkah berbeda. Pilih opsi yang paling sesuai,
              lalu ikuti tahapan di bawah ini agar proses registrasi berjalan cepat
              dan tanpa kendala.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {registrationInfos.map((info, i) => {
              const IconComp = ICON_MAP[info.icon as IconKey] || Ticket;
              return (
                <article
                  key={i}
                  className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5"
                >
                  <span className="absolute -top-2 -right-1 text-6xl font-black text-[#0268ab]/7 pointer-events-none">
                    {i + 1}
                  </span>

                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-[#0268ab]/10 flex items-center justify-center shrink-0">
                      <IconComp className="w-5 h-5 text-[#0268ab]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-gray-900 leading-tight">
                        {info.title}
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Opsi {String(i + 1).padStart(2, "0")}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">{info.desc}</p>

                  <ul className="border-t border-gray-100 pt-3 space-y-2.5">
                    {info.steps.map((step, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-sm text-gray-700">
                        <span className="mt-1.5 inline-block w-1.5 h-1.5 rounded-full bg-[#0268ab] shrink-0" />
                        <span className="leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventsPage;
