
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

const PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjI4MCIgdmlld0JveD0iMCAwIDUwMCAyODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI1MDAiIGhlaWdodD0iMjgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9IjIwMCAxMTBIMzAwVjE3MEgyMDBWMTEwWiIgZmlsbD0iI0QxRDVEQiIvPgo8c3ZnIHdpZHRoPSIxMDAiIGhlaWdodD0iNTYiIHZpZXdCb3g9IjAgMCAxMDAgNTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iNTYiIGZpbGw9IiNGM0Y0RjYiLz4KPHBhdGggZD0iTTQ2LjUgMjFINjEuNVYzNS41SDQ2LjVWMjFaIiBmaWxsPSIjRDFENUVCIi8+Cjwvc3ZnPgo8L3N2Zz4K';

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
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [translateX, setTranslateX] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const maxScrollRef = useRef(0);
  const currentXRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const targetXRef = useRef(0);

  // Detect touch device
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

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
    if (!track || !section || news.length === 0) return;
    
    const maxScroll = track.scrollWidth - section.clientWidth;
    maxScrollRef.current = Math.max(0, maxScroll);
    
    console.log('Max scroll:', maxScrollRef.current, 'News length:', news.length);
  }, [news, loading]);

  // Smooth lerp animation loop (only for non-touch devices)
  useEffect(() => {
    if (isTouchDevice) return; // Skip for touch devices

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

      // Pause auto-scroll when user interacts
      setIsAutoScrolling(false);

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

      // Resume auto-scroll after 5 seconds of inactivity
      setTimeout(() => {
        setIsAutoScrolling(true);
      }, 5000);
    };

    const section = sectionRef.current;
    if (!section) return;
    section.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      section.removeEventListener("wheel", onWheel);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [news, loading, isTouchDevice]);

  // Auto-scroll functionality
  useEffect(() => {
    if (isTouchDevice || !isAutoScrolling || isHovered) {
      console.log('Auto-scroll paused:', { isTouchDevice, isAutoScrolling, isHovered });
      return;
    }

    console.log('Auto-scroll started');

    const autoScrollInterval = setInterval(() => {
      const max = maxScrollRef.current;
      if (max <= 0) {
        console.log('No scroll available, max:', max);
        return;
      }

      // If reached the end, reset to start
      if (targetXRef.current >= max) {
        targetXRef.current = 0;
        console.log('Reset to start');
      } else {
        // Scroll by one card width (approximately 300px including gap)
        targetXRef.current = Math.min(max, targetXRef.current + 300);
        console.log('Scrolling to:', targetXRef.current);
      }

      // Direct update for auto-scroll (no animation loop needed)
      currentXRef.current = targetXRef.current;
      setTranslateX(-targetXRef.current);
    }, 3000); // Auto-scroll every 3 seconds

    return () => {
      clearInterval(autoScrollInterval);
      console.log('Auto-scroll cleaned up');
    };
  }, [isAutoScrolling, isHovered, isTouchDevice]);

  // Resume auto-scroll when hover ends
  useEffect(() => {
    if (!isHovered) {
      const timeout = setTimeout(() => {
        setIsAutoScrolling(true);
      }, 1000); // Resume 1 second after hover ends
      return () => clearTimeout(timeout);
    }
  }, [isHovered]);

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
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className={`relative rounded-2xl ${isTouchDevice ? '' : 'overflow-hidden'}`}>
            {/* Fade masks - only show on non-touch devices */}
            {!isTouchDevice && (
              <>
                <div className="absolute left-0 top-0 bottom-0 w-16 bg-linear-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-16 bg-linear-to-l from-gray-50 to-transparent z-10 pointer-events-none" />
              </>
            )}

            {/* Skeleton loading */}
            {loading && (
              <div className={`flex gap-5 py-2 ${isTouchDevice ? 'overflow-x-auto scrollbar-hide' : ''}`}>
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

            {/* Slider track */}
            {!loading && news.length > 0 && (
              <div
                ref={trackRef}
                className={`flex gap-5 py-2 ${
                  isTouchDevice 
                    ? 'overflow-x-auto scrollbar-hide snap-x snap-mandatory touch-pan-x' 
                    : 'will-change-transform'
                }`}
                style={!isTouchDevice ? { 
  transform: `translateX(${translateX}px)`,
  transition: 'transform 0.5s ease-in-out'
} : undefined}
              >
                {news.map((item) => (
                  <div key={item.id} className={isTouchDevice ? 'snap-start' : ''}>
                    <NewsCard item={item} />
                  </div>
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



