
"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface NewsItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  featuredImage: string | null;
  category: string;
  publishedAt: string | null;
  createdAt: string;
}

const CATEGORY_LABEL: Record<string, string> = {
  berita: "Berita",
  kejuaraan: "Kejuaraan",
  pengumuman: "Pengumuman",
  event: "Event",
};

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=500";

function formatTanggal(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function NewsCard({ item }: { item: NewsItem }) {
  return (
    <div className="w-72 shrink-0 group cursor-pointer bg-white rounded-2xl overflow-hidden transition-all duration-300">
      <div className="aspect-video overflow-hidden relative">
        <Image
          src={item.featuredImage || PLACEHOLDER}
          alt={item.title}
          fill
          unoptimized
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = PLACEHOLDER;
          }}
        />
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-semibold tracking-widest uppercase text-[#0268ab]">
            {CATEGORY_LABEL[item.category] ?? item.category}
          </span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span className="text-[10px] text-gray-400">
            {formatTanggal(item.publishedAt || item.createdAt)}
          </span>
        </div>
        <h4 className="text-sm font-semibold text-gray-900 leading-snug group-hover:text-[#0268ab] transition-colors duration-200 line-clamp-2 mb-2">
          {item.title}
        </h4>
        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
          {item.excerpt ?? ""}
        </p>
      </div>
    </div>
  );
}

const RecentNews: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [translateX, setTranslateX] = useState(0);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const maxScrollRef = useRef(0);
  const currentXRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const targetXRef = useRef(0);

  useEffect(() => {
    fetch("/api/news?published=true&limit=10&page=1")
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data) {
          setNews(json.data.slice(0, 10));
        }
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  // Hitung maxScroll setelah berita di-render
  useEffect(() => {
    const track = trackRef.current;
    const section = sectionRef.current;
    if (!track || !section) return;
    maxScrollRef.current = track.scrollWidth - section.clientWidth;
  }, [news, loading]);

  // Smooth lerp animation loop
  useEffect(() => {
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      const next = lerp(currentXRef.current, targetXRef.current, 0.1);
      if (Math.abs(next - currentXRef.current) > 0.5) {
        currentXRef.current = next;
        setTranslateX(-next);
        rafRef.current = requestAnimationFrame(tick);
      } else {
        currentXRef.current = targetXRef.current;
        setTranslateX(-targetXRef.current);
        rafRef.current = null;
      }
    };

    const onWheel = (e: WheelEvent) => {
      const max = maxScrollRef.current;
      if (max <= 0) return;

      const dirDown = e.deltaY > 0;

      // Lepas scroll vertikal jika sudah di ujung
      if ((dirDown && targetXRef.current >= max) || (!dirDown && targetXRef.current <= 0)) {
        return;
      }

      e.preventDefault();

      const step = e.deltaY * 1.2;
      targetXRef.current = Math.min(max, Math.max(0, targetXRef.current + step));

      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    const section = sectionRef.current;
    if (!section) return;
    section.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      section.removeEventListener("wheel", onWheel);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [news, loading]);

  return (
    <>
      <section className="py-16 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12 border-b border-gray-200 pb-6">
            <span className="text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase">
              Berita Terbaru
            </span>
            <span className="text-xs text-gray-400">05 / 08</span>
          </div>

          {/* CTA row */}
          <div className="flex justify-end mb-6">
            <button className="group inline-flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-[#0268ab] transition-colors duration-200">
              <span className="border-b border-gray-900 group-hover:border-[#0268ab] pb-0.5 transition-colors duration-200">
                Lihat Semua
              </span>
            </button>
          </div>
        </div>

        {/* Slider wrapper */}
        <div
          ref={sectionRef}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="relative overflow-hidden rounded-2xl">
            {/* Fade masks */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-linear-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-linear-to-l from-gray-50 to-transparent z-10 pointer-events-none" />

            {/* Skeleton loading */}
            {loading && (
              <div className="flex gap-5 py-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-72 shrink-0 bg-white rounded-2xl overflow-hidden animate-pulse">
                    <div className="aspect-video bg-gray-200" />
                    <div className="p-4 space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-1/3" />
                      <div className="h-4 bg-gray-200 rounded w-full" />
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-full" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Slider track — digeser dengan transform */}
            {!loading && news.length > 0 && (
              <div
                ref={trackRef}
                className="flex gap-5 py-2 will-change-transform"
                style={{ transform: `translateX(${translateX}px)` }}
              >
                {news.map((item) => (
                  <NewsCard key={item.id} item={item} />
                ))}
              </div>
            )}

            {/* Empty state */}
            {!loading && news.length === 0 && (
              <div className="py-16 text-center text-sm text-gray-400">
                Belum ada berita yang dipublikasikan.
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default RecentNews;



