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
      fetch("/api/eskul-activities?limit=4&page=1").then((r) => r.json()),
      fetch("/api/achievements?status=approved&limit=4&page=1").then((r) => r.json()),
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
    <section className="py-12 md:py-16 lg:py-20 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 md:mb-12 border-b border-gray-200 pb-4 md:pb-6">
          <span className="text-[10px] md:text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase">Kehidupan Siswa</span>
          <span className="text-[10px] md:text-xs text-gray-400">06 / 08</span>
        </div>

        {/* Skeleton */}
        {loading && (
          <div className="animate-pulse">
            {/* Desktop skeleton */}
            <div className="hidden lg:grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="h-4 w-32 bg-gray-200 rounded" />
                <div className="grid grid-cols-2 grid-rows-2 gap-4 h-96">
                  <div className="col-span-2 row-span-1 rounded-2xl bg-gray-200" />
                  <div className="col-span-1 row-span-1 rounded-2xl bg-gray-200" />
                  <div className="col-span-1 row-span-1 rounded-2xl bg-gray-200" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-4 w-32 bg-gray-200 rounded" />
                <div className="grid grid-cols-2 grid-rows-2 gap-4 h-96">
                  <div className="col-span-1 row-span-1 rounded-2xl bg-gray-200" />
                  <div className="col-span-1 row-span-1 rounded-2xl bg-gray-200" />
                  <div className="col-span-2 row-span-1 rounded-2xl bg-gray-200" />
                </div>
              </div>
            </div>
            {/* Tablet skeleton */}
            <div className="hidden md:grid lg:hidden gap-4 md:gap-6">
              <div className="grid grid-cols-2 gap-4 md:gap-6">
                <div className="h-3 w-24 bg-gray-200 rounded" />
                <div className="h-3 w-24 bg-gray-200 rounded" />
              </div>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div className="h-64 md:h-80 rounded-2xl bg-gray-200" />
                <div className="h-64 md:h-80 rounded-2xl bg-gray-200" />
                <div className="h-56 md:h-64 rounded-2xl bg-gray-200" />
                <div className="h-56 md:h-64 rounded-2xl bg-gray-200" />
              </div>
            </div>
            {/* Mobile skeleton */}
            <div className="grid md:hidden grid-cols-1 gap-8">
              <div className="space-y-3">
                <div className="h-3 w-24 bg-gray-200 rounded" />
                <div className="space-y-3">
                  <div className="h-64 rounded-2xl bg-gray-200" />
                  <div className="h-52 rounded-2xl bg-gray-200" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-3 w-24 bg-gray-200 rounded" />
                <div className="space-y-3">
                  <div className="h-64 rounded-2xl bg-gray-200" />
                  <div className="h-52 rounded-2xl bg-gray-200" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {!loading && (
          <div className="space-y-8">

            {/* Desktop: 2 columns side by side with headers */}
            <div className="hidden lg:grid grid-cols-2 gap-6">
              
              {/* LEFT: Kegiatan Ekstrakurikuler */}
              <div className="space-y-4">
                {/* Header Ekstrakurikuler */}
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Ekstrakurikuler
                  </span>
                </div>
                {/* Bento Grid */}
                <div className="grid grid-cols-2 grid-rows-2 gap-4 h-96">
                  {/* Activity 1 - Wide 2×1 */}
                  <div className="col-span-2 row-span-1">
                    <ActivityCard act={activities[0]} size="large" />
                  </div>
                  {/* Activity 2 - Small 1×1 */}
                  <div className="col-span-1 row-span-1">
                    <ActivityCard act={activities[1]} size="normal" />
                  </div>
                  {/* Activity 3 - Small 1×1 */}
                  <div className="col-span-1 row-span-1">
                    <ActivityCard act={activities[2]} size="normal" />
                  </div>
                </div>
              </div>

              {/* RIGHT: Prestasi Siswa */}
              <div className="space-y-4">
                {/* Header Prestasi */}
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Prestasi Siswa
                  </span>
                </div>
                {/* Bento Grid */}
                <div className="grid grid-cols-2 grid-rows-2 gap-4 h-96">
                  {/* Achievement 1 - Small 1×1 */}
                  <div className="col-span-1 row-span-1">
                    <AchievementCard item={achievements[0]} size="normal" />
                  </div>
                  {/* Achievement 2 - Small 1×1 */}
                  <div className="col-span-1 row-span-1">
                    <AchievementCard item={achievements[1]} size="normal" />
                  </div>
                  {/* Achievement 3 - Wide 2×1 */}
                  <div className="col-span-2 row-span-1">
                    <AchievementCard item={achievements[2]} size="large" />
                  </div>
                </div>
              </div>

            </div>

            {/* Tablet: 2 columns simplified */}
            <div className="hidden md:grid lg:hidden gap-4 md:gap-6">
              {/* Headers for tablet */}
              <div className="grid grid-cols-2 gap-4 md:gap-6 mb-3">
                <div>
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-400">
                    Ekstrakurikuler
                  </span>
                </div>
                <div>
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-400">
                    Prestasi Siswa
                  </span>
                </div>
              </div>
              {/* Grid */}
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div className="h-64 md:h-80">
                  <ActivityCard act={activities[0]} size="large" />
                </div>
                <div className="h-64 md:h-80">
                  <AchievementCard item={achievements[0]} size="large" />
                </div>
                <div className="h-56 md:h-64">
                  <ActivityCard act={activities[1]} size="normal" />
                </div>
                <div className="h-56 md:h-64">
                  <AchievementCard item={achievements[1]} size="normal" />
                </div>
              </div>
            </div>

            {/* Mobile: Single column */}
            <div className="grid md:hidden grid-cols-1 gap-8">
              {/* Ekstrakurikuler Section */}
              <div className="space-y-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Ekstrakurikuler
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="h-64">
                    <ActivityCard act={activities[0]} size="large" />
                  </div>
                  <div className="h-52">
                    <ActivityCard act={activities[1]} size="normal" />
                  </div>
                </div>
              </div>
              
              {/* Prestasi Section */}
              <div className="space-y-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Prestasi Siswa
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="h-64">
                    <AchievementCard item={achievements[0]} size="large" />
                  </div>
                  <div className="h-52">
                    <AchievementCard item={achievements[1]} size="normal" />
                  </div>
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