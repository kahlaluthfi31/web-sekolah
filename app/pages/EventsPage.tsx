"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
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
  const [agendas, setAgendas] = useState<AgendaApiItem[]>([]);
  const [categories, setCategories] = useState<AgendaCategory[]>([]);
  const [expandedDescriptions, setExpandedDescriptions] = useState<
    Record<number, boolean>
  >({});
  const [registrationInfos, setRegistrationInfos] = useState<
    RegistrationInfo[]
  >(DEFAULT_REGISTRATION_INFO);
  const header = usePageHeader("events");

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
          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-full p-1 mb-16 max-w-2xl">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`flex-1 px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
                activeTab === "upcoming"
                  ? "bg-[#0268ab] text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Acara Mendatang
            </button>
            <button
              onClick={() => setActiveTab("ongoing")}
              className={`flex-1 px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
                activeTab === "ongoing"
                  ? "bg-[#0268ab] text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Sedang Berlangsung
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={`flex-1 px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
                activeTab === "past"
                  ? "bg-[#0268ab] text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Acara Selesai
            </button>
          </div>

          {/* Timeline Layout */}
          <div className="relative">
            {/* Vertical Line */}
            {currentEvents.length > 0 && (
              <div className="absolute left-6 md:left-8 top-0 bottom-0 w-0.5 bg-linear-to-b from-[#0268ab] via-[#0268ab]/50 to-transparent"></div>
            )}

            {/* Timeline Events */}
            <div className="space-y-8">
              {currentEvents.length === 0 ? (
                <div className="text-center text-gray-500 text-sm py-6">
                  {activeTab === "upcoming"
                    ? "Sedang tidak ada agenda mendatang"
                    : activeTab === "ongoing"
                      ? "Sedang tidak ada agenda berlangsung"
                      : "Sedang tidak ada agenda selesai"}
                </div>
              ) : (
                currentEvents.map((event, index) => (
                  <div
                    key={event.id}
                    className="relative flex items-start gap-6 md:gap-8"
                  >
                    {/* Timeline Dot */}
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-linear-to-br from-[#0268ab] to-[#014a8f] flex items-center justify-center shadow-md relative z-10">
                        <Calendar className="w-4 h-4 md:w-5 md:h-5 text-white" />
                      </div>
                      {/* Connecting Line */}
                      {index < currentEvents.length - 1 && (
                        <div className="absolute top-12 md:top-14 left-1/2 transform -translate-x-1/2 w-0.5 h-8 bg-linear-to-b from-[#0268ab]/30 to-transparent"></div>
                      )}
                    </div>

                    {/* Event Card */}
                    <div className="flex-1 min-w-0">
                      <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 overflow-hidden group">
                        {/* Event Header with Date Badge */}
                        <div className="relative bg-linear-to-r from-[#0268ab]/5 to-[#0268ab]/2 p-4 md:p-5">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="bg-[#0268ab] text-white text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full">
                                  {event.category}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {event.year}
                                </span>
                              </div>
                              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 group-hover:text-[#0268ab] transition-colors">
                                {event.title}
                              </h3>
                              {(() => {
                                const isExpanded =
                                  expandedDescriptions[event.id] || false;
                                const isLong = event.description.length > 330;
                                const displayText =
                                  isExpanded || !isLong
                                    ? event.description
                                    : `${event.description.slice(0, 330)}...`;

                                return (
                                  <div className="text-gray-600 text-sm leading-relaxed">
                                    <p className="mb-1">{displayText}</p>
                                    {isLong && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setExpandedDescriptions((prev) => ({
                                            ...prev,
                                            [event.id]: !isExpanded,
                                          }))
                                        }
                                        className="text-[#0268ab] font-semibold text-xs hover:underline"
                                      >
                                        {isExpanded
                                          ? "Sembunyikan"
                                          : "Selengkapnya"}
                                      </button>
                                    )}
                                  </div>
                                );
                              })()}
                            </div>

                            {/* Date Card */}
                            <div className="shrink-0">
                              <div className="bg-white rounded-lg shadow-sm p-3 text-center min-w-20">
                                <div className="text-xs font-bold uppercase tracking-widest text-[#0268ab] mb-0.5">
                                  {event.month}
                                </div>
                                <div className="text-xl md:text-2xl font-black text-gray-900 leading-none">
                                  {event.day}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Event Details */}
                        <div className="p-4 md:p-5">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                            <div className="flex items-center gap-2 text-gray-600">
                              <div className="w-8 h-8 rounded-full bg-[#0268ab]/10 flex items-center justify-center shrink-0">
                                <Clock className="w-4 h-4 text-[#0268ab]" />
                              </div>
                              <div>
                                <div className="text-xs text-gray-500">
                                  Waktu
                                </div>
                                <div className="text-sm font-medium">
                                  {event.time}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <div className="w-8 h-8 rounded-full bg-[#0268ab]/10 flex items-center justify-center shrink-0">
                                <MapPin className="w-4 h-4 text-[#0268ab]" />
                              </div>
                              <div>
                                <div className="text-xs text-gray-500">
                                  Lokasi
                                </div>
                                <div className="text-sm font-medium">
                                  {event.location}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <div className="w-8 h-8 rounded-full bg-[#0268ab]/10 flex items-center justify-center shrink-0">
                                <Users className="w-4 h-4 text-[#0268ab]" />
                              </div>
                              <div>
                                <div className="text-xs text-gray-500">
                                  Peserta
                                </div>
                                <div className="text-sm font-medium">
                                  {event.participants}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Organizer Info */}
                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
                                <Calendar className="w-3.5 h-3.5 text-gray-600" />
                              </div>
                              <div>
                                <div className="text-xs text-gray-500">
                                  Penyelenggara
                                </div>
                                <div className="text-sm font-medium text-gray-900">
                                  {event.organizer}
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                              {activeTab === "past" ? (
                                <button className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-gray-200 transition-all duration-300">
                                  Galeri
                                </button>
                              ) : (
                                <>
                                  {/* <button className="flex items-center gap-1 text-[#0268ab] text-xs font-semibold hover:translate-x-1 transition-transform">
                                    Detail <ChevronRight className="h-3 w-3" />
                                  </button> */}
                                  {event.registrationUrl && (
                                    <a
                                      href={event.registrationUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="bg-[#0268ab] text-white px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-[#014a8f] transition-all duration-300"
                                    >
                                      Daftar
                                    </a>
                                  )}
                                </>
                              )}
                            </div>
                          </div>

                          {/* Past Event Status */}
                          {activeTab === "past" && "attendees" in event && (
                            <div className="mt-4 p-3 bg-green-50 border-l-4 border-green-500 rounded-r">
                              <div className="flex items-center">
                                <span className="text-green-700 font-semibold text-xs mr-2">
                                  ✓{" "}
                                  {
                                    (event as unknown as { status: string })
                                      .status
                                  }
                                </span>
                                <span className="text-gray-600 text-xs">
                                  •{" "}
                                  {
                                    (event as unknown as { attendees: string })
                                      .attendees
                                  }
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Event Categories Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
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
                return (
                  <div
                    key={category.id}
                    className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 relative overflow-hidden"
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
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                        style={{
                          background: `linear-gradient(135deg, ${accent}1a, ${accent}0d)`,
                        }}
                      >
                        {renderIcon(category.icon)}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {registrationInfos.map((info, i) => {
              const IconComp = ICON_MAP[info.icon as IconKey] || Ticket;
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-16 h-16 rounded-full bg-linear-to-br from-[#0268ab]/10 to-[#0268ab]/5 flex items-center justify-center mb-6">
                    <IconComp className="w-8 h-8 text-[#0268ab]" />
                  </div>
                  <h4 className="font-bold text-xl text-gray-900 mb-3">
                    {info.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-6">{info.desc}</p>
                  <div className="space-y-3">
                    {info.steps.map((step, j) => (
                      <div key={j} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#0268ab]/10 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-[#0268ab]">
                            {j + 1}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventsPage;
