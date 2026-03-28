"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Star,
  Award,
  Users,
  TrendingUp,
  Lightbulb,
  CheckCircle,
  Zap,
  Shield,
  Heart,
  Rocket,
  Trophy,
  Briefcase,
  GraduationCap,
  Building2,
  Target,
  BookOpen,
  ImageIcon,
} from "lucide-react";

// ── Icon map (harus sama dengan admin) ──
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Award,
  Star,
  Users,
  TrendingUp,
  Lightbulb,
  CheckCircle,
  Zap,
  Shield,
  Heart,
  Rocket,
  Trophy,
  Briefcase,
  GraduationCap,
  Building2,
  Target,
  BookOpen,
};

// ── Module-level agar useState tidak reset setiap render ──
function NoImagePlaceholder() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 gap-2">
      <ImageIcon className="w-10 h-10 text-gray-300" />
      <span className="text-xs text-gray-400 font-medium tracking-wide">
        No Image
      </span>
    </div>
  );
}

function VisiMisiImage({ src, alt }: { src: string; alt: string }) {
  const [broken, setBroken] = useState(false);
  if (broken) return <NoImagePlaceholder />;
  return (
    <Image
      src={src}
      alt={alt}
      fill
      unoptimized
      className="object-cover"
      onError={() => setBroken(true)}
    />
  );
}

interface HistoryItem {
  id: number;
  year: string;
  title: string;
  description: string;
  sortOrder: number;
}

interface VisiMisiItem {
  id: number;
  section: string;
  title: string | null;
  content: string | null;
  image: string | null;
  orderPosition: number;
}

interface KeunggulanItem {
  id: number;
  section: string;
  title: string | null;
  content: string | null;
  image: string | null; // nama ikon
  orderPosition: number;
}

interface PageHeader {
  title: string;
  subtitle: string | null;
}

const AboutPage: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [visiMisi, setVisiMisi] = useState<VisiMisiItem[]>([]);
  const [visiMisiLoading, setVisiMisiLoading] = useState(true);
  const [keunggulan, setKeunggulan] = useState<KeunggulanItem[]>([]);
  const [keunggulanLoading, setKeunggulanLoading] = useState(true);
  const [pageHeader, setPageHeader] = useState<PageHeader>({
    title: "Profil Sekolah",
    subtitle:
      "Mengenal lebih dekat SMK Negeri 1 Ciamis - Sejarah, Visi Misi, dan Keunggulan kami.",
  });

  useEffect(() => {
    // Fetch sejarah
    fetch("/api/school-history")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setHistory(json.data ?? []);
      })
      .catch(() => {})
      .finally(() => setHistoryLoading(false));

    // Fetch visi misi
    fetch("/api/school-profile?section=visi_misi")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          const data: VisiMisiItem[] = (json.data ?? [])
            .filter((d: VisiMisiItem) => d.section === "visi_misi")
            .sort(
              (a: VisiMisiItem, b: VisiMisiItem) =>
                a.orderPosition - b.orderPosition,
            );
          setVisiMisi(data);
        }
      })
      .catch(() => {})
      .finally(() => setVisiMisiLoading(false));

    // Fetch keunggulan
    fetch("/api/school-profile?section=keunggulan")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          const data: KeunggulanItem[] = (json.data ?? [])
            .filter((d: KeunggulanItem) => d.section === "keunggulan")
            .sort(
              (a: KeunggulanItem, b: KeunggulanItem) =>
                a.orderPosition - b.orderPosition,
            );
          setKeunggulan(data);
        }
      })
      .catch(() => {})
      .finally(() => setKeunggulanLoading(false));

    // Fetch page header
    fetch("/api/page-headers?key=about")
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data) setPageHeader(json.data);
      })
      .catch(() => {});
  }, []);

  // Parse misi content — bisa JSON array atau plain text
  const parseMisiItems = (content: string | null): string[] => {
    if (!content) return [];
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      /* plain text */
    }
    return content.split("\n").filter(Boolean);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Section */}
      <section className="pt-24 pb-16 relative overflow-hidden order-1">
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
          <BookOpen className="w-16 h-16" strokeWidth={1} />
        </div>
        <div className="absolute top-32 right-16 text-white/10">
          <GraduationCap className="w-12 h-12" strokeWidth={1} />
        </div>
        <div className="absolute bottom-20 left-32 text-white/10">
          <Award className="w-14 h-14" strokeWidth={1} />
        </div>
        <div className="absolute top-1/3 right-32 text-white/10">
          <Users className="w-10 h-10" strokeWidth={1} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {pageHeader.title}
              <span className="block text-5xl md:text-6xl lg:text-7xl font-light mt-2">
                SMKN 1 Ciamis
              </span>
            </h1>
            {pageHeader.subtitle && (
              <p className="text-white/90 text-base md:text-lg leading-relaxed max-w-2xl">
                {pageHeader.subtitle}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Video Profile Section */}
      <section className="py-16 lg:py-20 bg-white overflow-hidden order-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12 border-b border-gray-200 pb-6">
            <span className="text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase">
              Video Profil
            </span>
            <span className="text-xs text-gray-400">01 / 04</span>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gray-900 aspect-video">
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/7YK4Mkgd47Y?si=Z0aNt1w-E_xvMYR4"
                title="Video Profil SMK Negeri 1 Ciamis"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Sejarah Section */}
      <section className="py-16 lg:py-20 bg-gray-50 overflow-hidden order-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12 border-b border-gray-200 pb-6">
            <span className="text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase">
              Perjalanan Kami
            </span>
            <span className="text-xs text-gray-400">02 / 04</span>
          </div>

          {/* Timeline */}
          <div className="relative">
            {historyLoading && (
              <div className="space-y-8">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex gap-6 animate-pulse">
                    <div className="w-17 shrink-0 flex flex-col items-center gap-2 pt-1">
                      <div className="w-13 h-13 rounded-full bg-gray-200" />
                    </div>
                    <div className="flex-1 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                      <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
                      <div className="h-3 bg-gray-200 rounded w-full mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-4/5" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!historyLoading && history.length > 0 && (
              <div>
                {history.map((item, idx) => {
                  const isLast = idx === history.length - 1;
                  return (
                    <div key={item.id} className="flex gap-6 items-stretch">
                      {/* Kolom kiri: garis kontinyu + lingkaran di tengah */}
                      <div className="w-17 shrink-0 flex flex-col items-center relative z-10">
                        {/* Garis atas (setengah, tersembunyi jika item pertama) */}
                        <div
                          className={`w-0.5 flex-1 ${idx === 0 ? "bg-transparent" : "bg-[#0268ab]/25"}`}
                        />
                        {/* Lingkaran tahun */}
                        <div className="w-14 h-14 rounded-full border-2 border-[#0268ab] bg-white flex flex-col items-center justify-center text-[#0268ab] shadow-sm shrink-0 z-10">
                          <span className="text-sm font-bold leading-none">
                            {item.year}
                          </span>
                        </div>
                        {/* Garis bawah (tersembunyi jika item terakhir) */}
                        <div
                          className={`w-0.5 flex-1 ${isLast ? "bg-transparent" : "bg-[#0268ab]/25"}`}
                        />
                      </div>
                      {/* Konten kartu */}
                      <div className="flex-1 py-4">
                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                          <h3 className="text-base font-bold text-[#0268ab] mb-2">
                            {item.title}
                          </h3>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {!historyLoading && history.length === 0 && (
              <div className="text-center py-12 text-gray-400 text-sm">
                Belum ada data sejarah.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Visi & Misi Section */}
      <section className="py-16 lg:py-20 bg-white overflow-hidden order-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12 border-b border-gray-200 pb-6">
            <span className="text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase">
              Landasan Kami
            </span>
            <span className="text-xs text-gray-400">03 / 04</span>
          </div>

          {visiMisiLoading ? (
            <div className="space-y-16">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className={`flex flex-col md:flex-row gap-10 items-center animate-pulse ${i === 1 ? "md:flex-row-reverse" : ""}`}
                >
                  <div className="flex-1 space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-24" />
                    <div className="h-4 bg-gray-100 rounded w-full" />
                    <div className="h-4 bg-gray-100 rounded w-5/6" />
                    <div className="h-4 bg-gray-100 rounded w-4/6" />
                  </div>
                  <div className="w-full md:w-80 h-56 bg-gray-200 rounded-2xl shrink-0" />
                </div>
              ))}
            </div>
          ) : visiMisi.length === 0 ? (
            /* fallback static jika belum ada data di DB */
            <div className="space-y-0">
              {/* Visi row */}
              <div className="flex flex-col md:flex-row gap-10 items-center py-10 border-b border-gray-100">
                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl font-bold text-[#0268ab] mb-4">
                    Visi
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Menjadi lembaga pendidikan vokasi yang unggul, terpercaya,
                    dan berdaya saing global dalam mencetak lulusan yang
                    kompeten, berakhlak mulia, dan siap menghadapi tantangan era
                    industri 4.0.
                  </p>
                </div>
                <div className="w-full md:w-80 h-56 bg-gray-100 rounded-2xl shrink-0" />
              </div>
              {/* Misi row */}
              <div className="flex flex-col md:flex-row-reverse gap-10 items-center py-10">
                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl font-bold text-[#0268ab] mb-4">
                    Misi
                  </h3>
                  <ul className="space-y-2">
                    {[
                      "Menyelenggarakan pendidikan vokasi berkualitas",
                      "Mengembangkan karakter siswa",
                      "Memfasilitasi pembelajaran inovatif",
                    ].map((m, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-[#0268ab] text-sm"
                      >
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#0268ab] shrink-0" />
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="w-full md:w-80 h-56 bg-gray-100 rounded-2xl shrink-0" />
              </div>
            </div>
          ) : (
            <div className="space-y-0">
              {visiMisi.map((item, index) => {
                const isMisi = item.title?.toLowerCase() === "misi";
                const items = isMisi ? parseMisiItems(item.content) : [];
                const isReverse = index % 2 !== 0;

                return (
                  <div
                    key={item.id}
                    className={`flex flex-col gap-10 items-center py-12 ${index < visiMisi.length - 1 ? "border-b border-gray-100" : ""} ${isReverse ? "md:flex-row-reverse" : "md:flex-row"}`}
                  >
                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-2xl md:text-3xl font-bold text-[#0268ab] mb-5">
                        {item.title}
                      </h3>
                      {isMisi ? (
                        <ul className="space-y-2.5">
                          {items.map((m, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2.5 text-[#0268ab] text-sm leading-relaxed"
                            >
                              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#0268ab] shrink-0" />
                              {m}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-700 leading-relaxed">
                          {item.content}
                        </p>
                      )}
                    </div>

                    {/* Image */}
                    <div className="w-full md:w-96 shrink-0">
                      <div className="relative h-60 rounded-2xl overflow-hidden shadow-md">
                        {item.image ? (
                          <VisiMisiImage
                            src={item.image}
                            alt={item.title ?? "Visi Misi"}
                          />
                        ) : (
                          <NoImagePlaceholder />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Keunggulan Section */}
      <section className="pt-16 pb-24 lg:pt-20 lg:pb-28 bg-linear-to-br from-gray-50 to-white overflow-hidden order-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12 border-b border-gray-200 pb-6">
            <span className="text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase">
              Keunggulan Sekolah
            </span>
            <span className="text-xs text-gray-400">04 / 04</span>
          </div>

          {keunggulanLoading && (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-[#0268ab] border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!keunggulanLoading && keunggulan.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12">
              {keunggulan.map((item) => {
                const IconComp = ICON_MAP[item.image ?? ""] ?? Award;
                return (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="shrink-0">
                      <div className="w-14 h-14 rounded-full bg-[#0268ab] flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                        <IconComp className="w-7 h-7" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-[#0268ab] mb-3 leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {item.content}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!keunggulanLoading && keunggulan.length === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12">
              {[
                {
                  icon: <Award className="w-7 h-7" />,
                  title: "Akreditasi A",
                  description:
                    "Telah meraih akreditasi A dari BAN-S/M sebagai bukti kualitas pendidikan yang terjamin dan diakui secara nasional.",
                },
                {
                  icon: <Users className="w-7 h-7" />,
                  title: "Tenaga Pengajar Profesional",
                  description:
                    "Didukung oleh guru-guru bersertifikat, berpengalaman, dan kompeten di bidangnya dengan metode pembelajaran yang modern.",
                },
                {
                  icon: <Lightbulb className="w-7 h-7" />,
                  title: "Fasilitas Modern",
                  description:
                    "Dilengkapi laboratorium, workshop, dan peralatan praktikum berstandar industri untuk mendukung pembelajaran berkualitas.",
                },
                {
                  icon: <TrendingUp className="w-7 h-7" />,
                  title: "Kerjasama Industri",
                  description:
                    "Menjalin kemitraan dengan berbagai perusahaan terkemuka untuk program magang, sertifikasi, dan penyerapan lulusan.",
                },
                {
                  icon: <Star className="w-7 h-7" />,
                  title: "Prestasi Gemilang",
                  description:
                    "Siswa kami rutin meraih prestasi di tingkat kabupaten, provinsi, hingga nasional dalam berbagai kompetisi dan kejuaraan.",
                },
                {
                  icon: <CheckCircle className="w-7 h-7" />,
                  title: "Lulusan Terserap Kerja",
                  description:
                    "Tingkat keterserapan lulusan di dunia kerja mencapai 85% dalam 6 bulan pertama setelah kelulusan dengan gaji yang kompetitif.",
                },
              ].map((item, index) => (
                <div key={index} className="flex gap-4 group">
                  <div className="shrink-0">
                    <div className="w-14 h-14 rounded-full bg-[#0268ab] flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-[#0268ab] mb-3 leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
