
"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

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
    <article className="w-72 shrink-0 group cursor-pointer bg-white rounded-2xl overflow-hidden transition-all duration-300">
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
    </article>
  );
}

const RecentNews: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const dragStartXRef = useRef(0);
  const dragStartScrollLeftRef = useRef(0);

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

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice || !trackRef.current) return;
    e.preventDefault();
    setIsDragging(true);
    dragStartXRef.current = e.clientX;
    dragStartScrollLeftRef.current = trackRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || isTouchDevice || !trackRef.current) return;
    if (e.buttons === 0) {
      setIsDragging(false);
      return;
    }
    e.preventDefault();
    const deltaX = e.clientX - dragStartXRef.current;
    trackRef.current.scrollLeft = dragStartScrollLeftRef.current - deltaX;
  };

  const stopDragging = () => {
    if (!isDragging) return;
    setIsDragging(false);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleRelease = () => {
      setIsDragging(false);
    };

    window.addEventListener("mouseup", handleRelease);
    window.addEventListener("blur", handleRelease);

    return () => {
      window.removeEventListener("mouseup", handleRelease);
      window.removeEventListener("blur", handleRelease);
    };
  }, [isDragging]);

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
            <Link
              href="/berita"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-[#0268ab] transition-colors duration-200"
            >
              <span className="border-b border-gray-900 group-hover:border-[#0268ab] pb-0.5 transition-colors duration-200">
                Lihat Semua
              </span>
            </Link>
          </div>
        </div>

        {/* Slider wrapper */}
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="relative rounded-2xl overflow-hidden">
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
                    : `overflow-x-auto scrollbar-hide ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`
                }`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={stopDragging}
                onMouseLeave={stopDragging}
              >
                {news.map((item) => (
                  <Link
                    key={item.id}
                    href={`/berita/${item.slug}`}
                    className={isTouchDevice ? 'snap-start' : ''}
                    draggable={false}
                    onClick={(e) => {
                      if (isDragging) e.preventDefault();
                    }}
                  >
                    <NewsCard item={item} />
                  </Link>
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



