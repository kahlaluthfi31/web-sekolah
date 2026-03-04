"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Trophy, Medal, Sparkles, Star, CalendarDays, Users, ImageIcon } from "lucide-react";

/*  Types  */

interface EskulActivity {
  id: number;
  activityTitle: string;
  description: string | null;
  activityDate: string;
  image: string | null;
  eskul: {
    id: number;
    name: string;
    coachName: string | null;
    image: string | null;
  };
}

interface Achievement {
  id: number;
  studentName: string;
  class: string | null;
  achievementName: string;
  competitionName: string | null;
  level: string;
  position: string | null;
  year: number | null;
  photo: string | null;
}

/* ─────────────────────────── Constants ─────────────────────── */

const LEVEL_LABEL: Record<string, string> = {
  sekolah: "Tingkat Sekolah",
  kecamatan: "Tingkat Kecamatan",
  kabupaten: "Tingkat Kabupaten",
  provinsi: "Tingkat Provinsi",
  nasional: "Tingkat Nasional",
  internasional: "Internasional",
};

const LEVEL_COLOR: Record<string, string> = {
  sekolah: "bg-slate-100 text-slate-600",
  kecamatan: "bg-blue-100 text-blue-700",
  kabupaten: "bg-cyan-100 text-cyan-700",
  provinsi: "bg-violet-100 text-violet-700",
  nasional: "bg-amber-100 text-amber-700",
  internasional: "bg-emerald-100 text-emerald-700",
};

const LEVEL_ICON_COLOR: Record<string, string> = {
  sekolah: "text-slate-500",
  kecamatan: "text-blue-500",
  kabupaten: "text-cyan-500",
  provinsi: "text-violet-500",
  nasional: "text-amber-500",
  internasional: "text-emerald-500",
};

const MEDAL_BG: Record<string, string> = {
  sekolah: "from-slate-800 to-slate-900",
  kecamatan: "from-blue-900 to-slate-900",
  kabupaten: "from-cyan-900 to-slate-900",
  provinsi: "from-violet-900 to-slate-900",
  nasional: "from-amber-900 to-slate-900",
  internasional: "from-emerald-900 to-slate-900",
};

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

/*  Activity Card  */

function ActivityCard({
  act,
  size = "normal",
}: {
  act: EskulActivity | undefined;
  size?: "large" | "normal" | "small";
}) {
  const heightClass =
    size === "large" ? "h-full" : size === "small" ? "h-full" : "h-full";

  return (
    <div className={`relative rounded-2xl overflow-hidden group cursor-pointer bg-gray-100 ${heightClass}`}>
      {act?.image ? (
        <Image
          src={act.image}
          alt={act.activityTitle || "Kegiatan"}
          fill
          unoptimized
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gray-100">
          <ImageIcon className="w-8 h-8 text-gray-400" />
          <span className="text-[11px] font-medium text-gray-500">No Image</span>
        </div>
      )}

      {/* icon eskul pojok kiri atas  selalu tampil */}
      {act?.eskul && (
        <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-white/20 backdrop-blur-sm relative shrink-0">
            {act.eskul.image ? (
              <Image
                src={act.eskul.image}
                alt={act.eskul.name}
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="w-4.5 h-4.5 text-white" />
              </div>
            )}
          </div>
          {size === "large" && (
            <span className="text-white text-[10px] font-bold uppercase tracking-widest bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/10">
              {act.eskul.name}
            </span>
          )}
        </div>
      )}

      {/* hover overlay  slide up dari bawah */}
      <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-10">
        <div className="bg-linear-to-t from-black/60 via-black/30 to-transparent pt-10 pb-4 px-4">
          {act?.eskul && size !== "large" && (
            <p className="text-white/55 text-[9px] font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
              {act.eskul.name}
            </p>
          )}
          <p
            className={`text-white font-bold leading-snug line-clamp-2 ${size === "large" ? "text-base mb-2" : size === "small" ? "text-xs" : "text-sm"
              }`}
          >
            {act?.activityTitle || "Kegiatan"}
          </p>
          {size === "large" && act?.description && (
            <p className="text-white/60 text-xs line-clamp-2 mt-1">
              {act.description}
            </p>
          )}
          {act?.activityDate && (
            <p className="text-white/45 text-[10px] mt-1.5 flex items-center gap-1">
              <CalendarDays className="w-2.5 h-2.5" />
              {formatDate(act.activityDate)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/*  Achievement Card — desain sama dengan ActivityCard  */

function AchievementCard({
  item,
  size = "normal",
}: {
  item: Achievement | undefined;
  size?: "large" | "normal";
}) {
  const bg = MEDAL_BG[item?.level ?? ""] ?? "from-slate-800 to-slate-900";
  const levelColor = LEVEL_COLOR[item?.level ?? ""] ?? "bg-slate-100 text-slate-600";
  const iconColor = LEVEL_ICON_COLOR[item?.level ?? ""] ?? "text-slate-400";

  return (
    <div className="relative rounded-2xl overflow-hidden group cursor-pointer bg-gray-900 h-full">
      {/* foto background */}
      {item?.photo ? (
        <Image
          src={item.photo}
          alt={item.studentName}
          fill
          unoptimized
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-gray-100">
          <ImageIcon className="w-7 h-7 text-gray-400" />
          <span className="text-[10px] font-medium text-gray-500">No Image</span>
        </div>
      )}
      {/* fallback warna gelap bergradient — hanya muncul kalau tidak ada foto */}
      <div className={`absolute inset-0 bg-linear-to-br ${bg} ${item?.photo ? "opacity-0" : "opacity-0"}`} />

      {/* pojok kiri atas: level label  selalu tampil */}
      {item && size === "large" && (
        <div className="absolute top-3 left-3 z-20">
          <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${levelColor}`}>
            {LEVEL_LABEL[item.level] ?? item.level}
          </span>
        </div>
      )}

      {/* hover overlay — slide up dari bawah */}
      <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-10">
        <div className="bg-linear-to-t from-black/60 via-black/30 to-transparent pt-10 pb-4 px-4">
          {item?.position && (
            <p className="text-yellow-400/90 text-[10px] font-bold flex items-center gap-1 mb-1">
              {/* <Medal className="w-3 h-3" /> */}
              {item.position}
            </p>
          )}
          {item && size !== "large" && (
            <p className="text-white/55 text-[9px] font-bold uppercase tracking-widest mb-1">
              {LEVEL_LABEL[item.level] ?? item.level}
            </p>
          )}
          <p
            className={`text-white font-bold leading-snug line-clamp-2 ${size === "large" ? "text-base mb-2" : "text-sm"
              }`}
          >
            {item?.achievementName || "Prestasi"}
          </p>
          {size === "large" && item?.competitionName && (
            <p className="text-white/60 text-xs line-clamp-1 mt-1">
              {item.competitionName}
            </p>
          )}
          {item && (
            <p className="text-white/45 text-[10px] mt-1.5 flex items-center gap-1">
              <Users className="w-2.5 h-2.5" />
              {item.studentName}{item.class ? ` · ${item.class}` : ""}
              {item.year ? ` · ${item.year}` : ""}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/*  Main Component  */

const StudentLife: React.FC = () => {
  const [activities, setActivities] = useState<EskulActivity[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [totalAchievement, setTotalAchievement] = useState(0);
  const [totalActivity, setTotalActivity] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/eskul-activities?limit=5&page=1").then((r) => r.json()),
      fetch("/api/achievements?status=approved&limit=6&page=1").then((r) => r.json()),
    ])
      .then(([actJson, achieveJson]) => {
        if (actJson.success) {
          setActivities(actJson.data || []);
          setTotalActivity(actJson.pagination?.total || 0);
        }
        if (achieveJson.success) {
          setAchievements(achieveJson.data || []);
          setTotalAchievement(achieveJson.pagination?.total || 0);
        }
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-20 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top label row */}
        <div className="flex items-center justify-between mb-12 border-b border-gray-200 pb-6">
          <span className="text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase">Kehidupan Siswa</span>
          <span className="text-xs text-gray-400">06 / 08</span>
        </div>

        {/*  Skeleton  */}
        {loading && (
          <div className="animate-pulse grid grid-cols-2 gap-6">
            {[0, 1].map((col) => (
              <div key={col} className="flex flex-col gap-3">
                <div className="rounded-2xl bg-gray-200" style={{ height: 300 }} />
                <div className="grid grid-cols-2 gap-3" style={{ height: 180 }}>
                  <div className="rounded-2xl bg-gray-200" />
                  <div className="rounded-2xl bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && (
          <div className="space-y-0">

            {/* ── Label baris ── */}
            <div className="grid grid-cols-2 gap-6 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                  Ekstrakurikuler
                </span>
                {totalActivity > 0 && (
                  <span className="ml-auto text-[10px] font-semibold text-[#0268ab] bg-blue-50 px-2 py-0.5 rounded-full">
                    {totalActivity} kegiatan
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                  Prestasi Siswa
                </span>
                {totalAchievement > 0 && (
                  <span className="ml-auto text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                    {totalAchievement}+ prestasi
                  </span>
                )}
              </div>
            </div>

            {/* ── 2 kolom berdampingan — grid identik ── */}
            <div className="grid grid-cols-2 gap-6">

              {/* ═══ KOLOM KIRI: Kegiatan ═══ */}
              <div className="flex flex-col gap-3">
                {/* Baris 1: card besar */}
                <div style={{ height: 300 }}>
                  <ActivityCard act={activities[0]} size="large" />
                </div>
                {/* Baris 2: 2 card kecil berdampingan */}
                <div className="grid grid-cols-2 gap-3" style={{ height: 180 }}>
                  <ActivityCard act={activities[1]} size="normal" />
                  <ActivityCard act={activities[2]} size="normal" />
                </div>
              </div>

              {/* ═══ KOLOM KANAN: Prestasi ═══ */}
              <div className="flex flex-col gap-3">
                {/* Baris 1: card besar */}
                <div style={{ height: 300 }}>
                  <AchievementCard item={achievements[0]} size="large" />
                </div>
                {/* Baris 2: 2 card kecil berdampingan */}
                <div className="grid grid-cols-2 gap-3" style={{ height: 180 }}>
                  <AchievementCard item={achievements[1]} size="normal" />
                  <AchievementCard item={achievements[2]} size="normal" />
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </section>
  );
};

export default StudentLife;