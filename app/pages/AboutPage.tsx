"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Star, Award, Users, TrendingUp, Lightbulb, CheckCircle,
  Zap, Shield, Heart, Rocket, Trophy, Briefcase, GraduationCap, Building2, Target, BookOpen, 
  ImageIcon} from 'lucide-react';

// ── Icon map (harus sama dengan admin) ──
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Award, Star, Users, TrendingUp, Lightbulb, CheckCircle,
  Zap, Shield, Heart, Rocket, Trophy, Briefcase, GraduationCap, Building2, Target, BookOpen,
};

// ── Module-level agar useState tidak reset setiap render ──
function NoImagePlaceholder() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 gap-2">
      <ImageIcon className="w-10 h-10 text-gray-300" />
      <span className="text-xs text-gray-400 font-medium tracking-wide">No Image</span>
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
  image: string | null;   // nama ikon
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
    title: 'Profil Sekolah',
    subtitle: 'Mengenal lebih dekat SMK Negeri 1 Ciamis - Sejarah, Visi Misi, dan Keunggulan kami.',
  });
  const [videoUrl, setVideoUrl] = useState<string>('https://www.youtube.com/embed/jWq8hHCOJkg?si=d1OGiF0YyHodW1PW');

  const normalizeYoutubeUrl = (url: string): string => {
    if (!url) return url;
    try {
      const trimmed = url.trim();
      // youtu.be short link
      const shortMatch = trimmed.match(/^https?:\/\/youtu\.be\/([^?&]+)/i);
      if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;

      // watch?v= links
      const watchMatch = trimmed.match(/[?&]v=([^&]+)/i);
      if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;

      // already embed
      if (/\/embed\//i.test(trimmed)) return trimmed;

      return trimmed;
    } catch {
      return url;
    }
  }

  useEffect(() => {
    // Fetch sejarah
    fetch('/api/school-history')
      .then(r => r.json())
      .then(json => { if (json.success) setHistory(json.data ?? []); })
      .catch(() => {})
      .finally(() => setHistoryLoading(false));

    // Fetch visi misi
    fetch('/api/school-profile?section=visi_misi')
      .then(r => r.json())
      .then(json => {
        if (json.success) {
          const data: VisiMisiItem[] = (json.data ?? [])
            .filter((d: VisiMisiItem) => d.section === 'visi_misi')
            .sort((a: VisiMisiItem, b: VisiMisiItem) => a.orderPosition - b.orderPosition);
          setVisiMisi(data);
        }
      })
      .catch(() => {})
      .finally(() => setVisiMisiLoading(false));

    // Fetch keunggulan
    fetch('/api/school-profile?section=keunggulan')
      .then(r => r.json())
      .then(json => {
        if (json.success) {
          const data: KeunggulanItem[] = (json.data ?? [])
            .filter((d: KeunggulanItem) => d.section === 'keunggulan')
            .sort((a: KeunggulanItem, b: KeunggulanItem) => a.orderPosition - b.orderPosition);
          setKeunggulan(data);
        }
      })
      .catch(() => {})
      .finally(() => setKeunggulanLoading(false));

    // Fetch page header
    fetch('/api/page-headers?key=about')
      .then(r => r.json())
      .then(json => {
        if (json.success && json.data) setPageHeader(json.data);
      })
      .catch(() => {});

    // Fetch video URL setting
    fetch('/api/settings')
      .then(r => r.json())
      .then(json => {
        if (json.success) {
          const settings = (json.data ?? []) as { settingKey: string; settingValue?: string | null }[]
          const setting = settings.find(s => s.settingKey === 'about_video_url')
          if (setting?.settingValue) setVideoUrl(normalizeYoutubeUrl(setting.settingValue))
        }
      })
      .catch(() => {});
  }, []);

  // Parse misi content — bisa JSON array atau plain text
  const parseMisiItems = (content: string | null): string[] => {
    if (!content) return [];
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) return parsed;
    } catch { /* plain text */ }
    return content.split('\n').filter(Boolean);
  };

  return (
    <div className="pt-20">
      {/* Page Header */}
      <section className="bg-[#0092DD] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">{pageHeader.title}</h1>
          {pageHeader.subtitle && (
            <p className="max-w-2xl mx-auto text-white/80 text-sm leading-relaxed">
              {pageHeader.subtitle}
            </p>
          )}
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-gray-100 py-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs font-medium text-gray-500">
          <span className="text-[#0092DD]">Beranda</span> <span className="mx-2">/</span> Profil Sekolah
        </div>
      </div>

      {/* Video Profile Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#0092DD] text-[10px] font-bold uppercase tracking-[0.2em] mb-4 block">Video Profil</span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Mengenal SMK Negeri 1 Ciamis</h2>
            <p className="max-w-2xl mx-auto text-gray-500 leading-relaxed">
              Tonton video profil kami untuk mengetahui lebih dalam tentang fasilitas, program keahlian, dan prestasi yang telah diraih.
            </p>
          </div>
          <div className="max-w-5xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gray-900 aspect-video">
              <iframe
                className="absolute inset-0 w-full h-full"
                src={videoUrl}
                title="Video Profil SMK Negeri 1 Ciamis"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Sejarah Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#0092DD] text-[10px] font-bold uppercase tracking-[0.2em] mb-4 block">Perjalanan Kami</span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Sejarah SMK Negeri 1 Ciamis</h2>
            <p className="max-w-2xl mx-auto text-gray-500 leading-relaxed">
              Perjalanan panjang kami dalam mencetak generasi unggul di bidang vokasi
            </p>
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
                  const isLast = idx === history.length - 1
                  return (
                    <div key={item.id} className="flex gap-6 items-stretch">
                      {/* Kolom kiri: garis kontinyu + lingkaran di tengah */}
                      <div className="w-17 shrink-0 flex flex-col items-center relative z-10">
                        {/* Garis atas (setengah, tersembunyi jika item pertama) */}
                        <div className={`w-0.5 flex-1 ${idx === 0 ? 'bg-transparent' : 'bg-[#0092DD]/25'}`} />
                        {/* Lingkaran tahun */}
                        <div className="w-14 h-14 rounded-full border-2 border-[#0092DD] bg-white flex flex-col items-center justify-center text-[#0092DD] shadow-sm shrink-0 z-10">
                          <span className="text-sm font-bold leading-none">{item.year}</span>
                        </div>
                        {/* Garis bawah (tersembunyi jika item terakhir) */}
                        <div className={`w-0.5 flex-1 ${isLast ? 'bg-transparent' : 'bg-[#0092DD]/25'}`} />
                      </div>
                      {/* Konten kartu */}
                      <div className="flex-1 py-4">
                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                          <h3 className="text-base font-bold text-[#0092DD] mb-2">{item.title}</h3>
                          <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {!historyLoading && history.length === 0 && (
              <div className="text-center py-12 text-gray-400 text-sm">
                Belum ada data sejarah.
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "60+", label: "Tahun Pengalaman" },
              { value: "15,000+", label: "Alumni Sukses" },
              { value: "8", label: "Program Keahlian" },
              { value: "A", label: "Akreditasi" },
            ].map((s) => (
              <div key={s.label} className="bg-white p-6 rounded-xl shadow text-center border border-gray-100">
                <div className="text-4xl font-bold text-gray-900 mb-2">{s.value}</div>
                <div className="text-sm text-gray-500 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visi & Misi Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#0092DD] text-[10px] font-bold uppercase tracking-[0.2em] mb-4 block">Landasan Kami</span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Visi &amp; Misi</h2>
            <p className="max-w-2xl mx-auto text-gray-500 leading-relaxed">
              Komitmen kami dalam mewujudkan pendidikan vokasi yang berkualitas dan berdaya saing global
            </p>
          </div>

          {visiMisiLoading ? (
            <div className="space-y-16">
              {[0, 1].map(i => (
                <div key={i} className={`flex flex-col md:flex-row gap-10 items-center animate-pulse ${i === 1 ? 'md:flex-row-reverse' : ''}`}>
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
                  <h3 className="text-3xl font-bold text-[#0092DD] mb-4">Visi</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Menjadi lembaga pendidikan vokasi yang unggul, terpercaya, dan berdaya saing global dalam mencetak lulusan yang kompeten, berakhlak mulia, dan siap menghadapi tantangan era industri 4.0.
                  </p>
                </div>
                <div className="w-full md:w-80 h-56 bg-gray-100 rounded-2xl shrink-0" />
              </div>
              {/* Misi row */}
              <div className="flex flex-col md:flex-row-reverse gap-10 items-center py-10">
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-[#0092DD] mb-4">Misi</h3>
                  <ul className="space-y-2">
                    {["Menyelenggarakan pendidikan vokasi berkualitas", "Mengembangkan karakter siswa", "Memfasilitasi pembelajaran inovatif"].map((m, i) => (
                      <li key={i} className="flex items-start gap-2 text-[#0092DD] text-sm">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#0092DD] shrink-0" />
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
                const isMisi = item.title?.toLowerCase() === 'misi';
                const items = isMisi ? parseMisiItems(item.content) : [];
                const isReverse = index % 2 !== 0;

                return (
                  <div
                    key={item.id}
                    className={`flex flex-col gap-10 items-center py-12 ${index < visiMisi.length - 1 ? 'border-b border-gray-100' : ''} ${isReverse ? 'md:flex-row-reverse' : 'md:flex-row'}`}
                  >
                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-3xl font-bold text-[#0092DD] mb-5">{item.title}</h3>
                      {isMisi ? (
                        <ul className="space-y-2.5">
                          {items.map((m, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-[#0092DD] text-sm leading-relaxed">
                              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#0092DD] shrink-0" />
                              {m}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-700 leading-relaxed">{item.content}</p>
                      )}
                    </div>

                    {/* Image */}
                    <div className="w-full md:w-96 shrink-0">
                      <div className="relative h-60 rounded-2xl overflow-hidden shadow-md">
                        {item.image ? (
                          <VisiMisiImage src={item.image} alt={item.title ?? 'Visi Misi'} />
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
      <section className="py-24 bg-linear-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#0092DD] text-[10px] font-bold uppercase tracking-[0.2em] mb-4 block">Mengapa Memilih Kami</span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Keunggulan Sekolah</h2>
            <p className="max-w-2xl mx-auto text-gray-500 leading-relaxed">
              Berbagai keunggulan yang menjadikan SMK Negeri 1 Ciamis pilihan terbaik untuk masa depan karir Anda
            </p>
          </div>

          {keunggulanLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg border border-gray-100 animate-pulse space-y-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                  <div className="h-3 bg-gray-100 rounded w-full" />
                  <div className="h-3 bg-gray-100 rounded w-4/5" />
                </div>
              ))}
            </div>
          ) : keunggulan.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {keunggulan.map((item) => {
                const IconComp = ICON_MAP[item.image ?? ''] ?? Award;
                return (
                  <div key={item.id} className="bg-white p-6 rounded-lg shadow border border-gray-100 hover:shadow-md transition-shadow duration-300">
                    <div className="w-12 h-12 bg-[#77C5F0]/30 rounded-lg flex items-center justify-center mb-4">
                      <IconComp className="w-6 h-6 text-[#0092DD]" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">{item.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.content}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            /* fallback static jika belum ada data di DB */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: <Award className="w-6 h-6" />, title: "Akreditasi A", description: "Telah meraih akreditasi A dari BAN-S/M sebagai bukti kualitas pendidikan yang terjamin dan diakui secara nasional." },
                { icon: <Users className="w-6 h-6" />, title: "Tenaga Pengajar Profesional", description: "Didukung oleh guru-guru bersertifikat, berpengalaman, dan kompeten di bidangnya dengan metode pembelajaran yang modern." },
                { icon: <Lightbulb className="w-6 h-6" />, title: "Fasilitas Modern", description: "Dilengkapi laboratorium, workshop, dan peralatan praktikum berstandar industri untuk mendukung pembelajaran berkualitas." },
                { icon: <TrendingUp className="w-6 h-6" />, title: "Kerjasama Industri", description: "Menjalin kemitraan dengan berbagai perusahaan terkemuka untuk program magang, sertifikasi, dan penyerapan lulusan." },
                { icon: <Star className="w-6 h-6" />, title: "Prestasi Gemilang", description: "Siswa kami rutin meraih prestasi di tingkat kabupaten, provinsi, hingga nasional dalam berbagai kompetisi dan kejuaraan." },
                { icon: <CheckCircle className="w-6 h-6" />, title: "Lulusan Terserap Kerja", description: "Tingkat keterserapan lulusan di dunia kerja mencapai 85% dalam 6 bulan pertama setelah kelulusan dengan gaji yang kompetitif." },
              ].map((item, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow border border-gray-100 hover:shadow-md transition-shadow duration-300">
                  <div className="w-12 h-12 bg-[#77C5F0]/30 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-[#0092DD]">{item.icon}</div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-16 text-center">
            <div className="bg-linear-to-r from-[#0092DD] to-[#0077BB] p-12 rounded-3xl shadow-2xl">
              <h3 className="text-3xl font-bold text-white mb-4">Siap Bergabung Bersama Kami?</h3>
              <p className="text-white/90 mb-8 max-w-2xl mx-auto">
                Jadilah bagian dari SMK Negeri 1 Ciamis dan wujudkan impian karirmu di dunia industri dengan pendidikan vokasi berkualitas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-[#0092DD] px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all duration-300 shadow-lg">
                  Daftar Sekarang
                </button>
                <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-[#0092DD] transition-all duration-300">
                  Hubungi Kami
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;