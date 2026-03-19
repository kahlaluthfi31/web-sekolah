"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Calendar, User, TrendingUp, Newspaper, FileText } from 'lucide-react';
import { usePageHeader } from '@/lib/usePageHeader';

type NewsItem = {
  id: number;
  title: string;
  excerpt: string | null;
  content?: string | null;
  featuredImage: string | null;
  category: string;
  author?: { name?: string | null } | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt?: string;
};

type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

const CATEGORY_LABEL: Record<string, string> = {
  berita: 'Berita',
  kejuaraan: 'Kejuaraan',
  pengumuman: 'Pengumuman',
  event: 'Event',
};

const PLACEHOLDER_IMG =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2NzUiIHZpZXdCb3g9IjAgMCAxMjAwIDY3NSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEyMDAiIGhlaWdodD0iNjc1IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9IjQ4MCAyNzBINzIwVjQwNUg0ODBWMjcwWiIgZmlsbD0iI0QxRDVEQiIvPgo8c3ZnIHdpZHRoPSIyNDAiIGhlaWdodD0iMTM1IiB2aWV3Qm94PSIwIDAgMjQwIDEzNSIgZmlsbD0ibm9uZSIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0MCIgaGVpZ2h0PSIxMzUiIGZpbGw9IiNGM0Y0RjYiLz4KPHBhdGggZD0iMTExLjIgNTQuM0gxMjguOFY4MC43SDExMS4yVjU0LjNaIiBmaWxsPSIjRDFENUVCIi8+Cjwvc3ZnPgo8L3N2Zz4K";

const PAGE_SIZE = 8;

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return '-';
  try {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

const formatTitlePrimary = (title?: string | null) => {
  if (!title) return '';
  const limit = 45;
  if (title.length <= limit) return title;
  return `${title.slice(0, limit - 3)}...`;
};

const formatExcerptPrimary = (excerpt?: string | null) => {
  if (!excerpt) return '';
  const limit = 108;
  if (excerpt.length <= limit) return excerpt;
  return `${excerpt.slice(0, limit - 3)}...`;
};

const formatTitleGrid = (title?: string | null) => {
  if (!title) return '';
  const limit = 50;
  if (title.length <= limit) return title;
  return `${title.slice(0, limit - 3)}...`;
};

const formatExcerptGrid = (excerpt?: string | null) => {
  if (!excerpt) return '';
  const limit = 69;
  if (excerpt.length <= limit) return excerpt;
  return `${excerpt.slice(0, limit - 3)}...`;
};

const NewsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Berita Teratas' | 'Berita Terbaru'>('Berita Terbaru');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 1,
  });
  const header = usePageHeader('news');
  const newsCategories: Array<'Berita Teratas' | 'Berita Terbaru'> = ['Berita Teratas', 'Berita Terbaru'];

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch(`/api/news?published=true&limit=${PAGE_SIZE}&page=${currentPage}`)
      .then((res) => res.json())
      .then((json) => {
        if (!mounted) return;
        if (json?.success && Array.isArray(json.data)) {
          setNews(json.data as NewsItem[]);
          if (json.pagination) {
            setPagination(json.pagination as PaginationMeta);
          } else {
            setPagination({ page: currentPage, limit: PAGE_SIZE, total: json.data.length, totalPages: 1 });
          }
        } else {
          setNews([]);
          setPagination({ page: currentPage, limit: PAGE_SIZE, total: 0, totalPages: 1 });
        }
      })
      .catch(() => {
        setNews([]);
        setPagination({ page: currentPage, limit: PAGE_SIZE, total: 0, totalPages: 1 });
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [currentPage]);

  const sortedNews = useMemo(() => {
    return [...news].sort((a, b) => {
      const dateA = new Date(a.publishedAt || a.createdAt).getTime();
      const dateB = new Date(b.publishedAt || b.createdAt).getTime();
      return dateB - dateA;
    });
  }, [news]);

  const pageNumbers = useMemo(() => {
    const total = Math.max(pagination.totalPages, 1);
    const pages: Array<number | '...'> = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i += 1) pages.push(i);
      return pages;
    }

    if (currentPage <= 4) {
      pages.push(1, 2, 3, 4, 5, '...', total);
      return pages;
    }

    if (currentPage >= total - 3) {
      pages.push(1, '...', total - 4, total - 3, total - 2, total - 1, total);
      return pages;
    }

    pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', total);
    return pages;
  }, [currentPage, pagination.totalPages]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > pagination.totalPages || page === currentPage) return;
    setCurrentPage(page);
  };

  const featuredNews = sortedNews[0];
  const latestNews = sortedNews; // tampilkan semua data pada tab Latest News
  const allNews = sortedNews;
  const trendingNews: NewsItem[] = [];
  const sidebarNews = activeTab === 'Berita Teratas' ? trendingNews : latestNews;

  const isEdited = (item: NewsItem) => {
    if (!item.updatedAt) return false;
    return new Date(item.updatedAt).getTime() - new Date(item.createdAt).getTime() > 1000; // allow small diff
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Contact Page Style */}
      <section className="pt-24 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-[#0268ab] via-[#0268ab]/80 to-transparent"></div>

        <div className="absolute inset-0 opacity-15">
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3Ccircle cx='10' cy='10' r='1.5'/%3E%3Ccircle cx='50' cy='10' r='1.5'/%3E%3Ccircle cx='10' cy='50' r='1.5'/%3E%3Ccircle cx='50' cy='50' r='1.5'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <div className="absolute top-10 right-20 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 left-20 w-48 h-48 bg-white opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>

        <div className="absolute top-20 left-10 text-white/10">
          <Newspaper className="w-16 h-16" strokeWidth={1} />
        </div>
        <div className="absolute top-32 right-16 text-white/10">
          <FileText className="w-12 h-12" strokeWidth={1} />
        </div>
        <div className="absolute bottom-20 left-32 text-white/10">
          <TrendingUp className="w-14 h-14" strokeWidth={1} />
        </div>
        <div className="absolute top-1/3 right-32 text-white/10">
          <Calendar className="w-10 h-10" strokeWidth={1} />
        </div>

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

      {/* Featured News Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-12 border-b border-gray-200 pb-6">
            <span className="text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase">Berita Utama</span>
            <span className="text-xs text-gray-400">01 / 02</span>
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* Featured Main */}
            <div className="lg:w-2/3">
              <div className="relative group cursor-pointer">
                <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                  <img
                    src={featuredNews?.featuredImage || PLACEHOLDER_IMG}
                    alt={featuredNews?.title || 'Featured News'}
                    className="w-full h-96 lg:h-125 object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-[#0268ab] text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                        {featuredNews ? CATEGORY_LABEL[featuredNews.category] || featuredNews.category : 'Kategori'}
                      </span>
                      <span className="text-white/80 text-sm flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {featuredNews ? formatDate(featuredNews.publishedAt || featuredNews.createdAt) : '-'}
                      </span>
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4 leading-tight">
                      {featuredNews ? formatTitlePrimary(featuredNews.title) : 'Belum ada berita'}
                    </h2>
                    <p className="text-white/90 text-sm mb-4 leading-relaxed">{featuredNews ? formatExcerptPrimary(featuredNews.excerpt) : ''}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-white/80 text-sm">
                        <User className="w-4 h-4" />
                        {featuredNews?.author?.name || 'Admin'}
                      </div>
                      <button className="flex items-center gap-2 text-white bg-[#0268ab] px-4 py-2 rounded-lg hover:bg-[#014a8f] transition-colors text-sm font-medium">
                        Baca Selengkapnya
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:w-1/3">
              {/* Category Tabs */}
              <div className="flex gap-4 mb-10 border-b border-gray-100 pb-2">
                {newsCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveTab(cat);
                      setCurrentPage(1);
                    }}
                    className={`text-xs font-bold uppercase tracking-widest pb-2 transition-all ${
                      activeTab === cat
                        ? 'text-[#0268ab] border-b-2 border-[#0268ab]'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Sidebar News List */}
              <div className="space-y-6">
                {loading && <p className="text-sm text-gray-500">Memuat data...</p>}
                {!loading && sidebarNews.length === 0 && <p className="text-sm text-gray-500">Belum ada data untuk tab ini.</p>}
                {!loading &&
                  sidebarNews.map((item) => (
                    <div key={item.id} className="group cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="shrink-0">
                          <img
                            src={item.featuredImage || PLACEHOLDER_IMG}
                            alt={item.title}
                            className="w-14 h-14 rounded-lg object-cover border border-gray-100 mt-2"
                          />
                        </div>
                        <div className="flex-1">
                          <span className="bg-[#0268ab]/10 text-[#0268ab] text-[7px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full inline-block">
                            {CATEGORY_LABEL[item.category] || item.category}
                          </span>
                          <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#0268ab] transition-colors mb-1 leading-tight">
                            {formatTitlePrimary(item.title)}
                          </h4>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {item.author?.name || 'Admin'}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(item.publishedAt || item.createdAt)}
                              {isEdited(item) && <span className="text-gray-500"> (Diedit)</span>}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All News Grid Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-12 border-b border-gray-200 pb-6">
            <span className="text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase">Semua Berita</span>
            <span className="text-xs text-gray-400">02 / 02</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {allNews.map((item) => (
              <div key={item.id} className="group cursor-pointer">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                  {/* Logo SMKN 1 Ciamis - Pojok Bawah Kanan BNW - Half Visible - Larger & More Visible */}
                  <div className="absolute -bottom-12 -right-12 w-40 h-40 opacity-15">
                    <div className="w-full h-full flex items-center justify-center">
                      <img src="/images/logosmeabnw.svg" alt="SMKN 1 Ciamis Logo" className="w-full h-full object-contain" />
                    </div>
                  </div>

                    <div className="relative z-10">
                    <div className="mb-4 rounded-xl overflow-hidden border border-gray-100">
                      <div className="relative w-full h-40 bg-gray-50">
                        <img
                          src={item.featuredImage || PLACEHOLDER_IMG}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 left-2 bg-[#0268ab] text-white text-[11px] font-semibold px-3 py-1 rounded-full shadow-sm">
                          {CATEGORY_LABEL[item.category] || item.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-start gap-1 text-xs text-gray-500 mb-3">
                      <span>
                        {formatDate(item.publishedAt || item.createdAt)}
                        {isEdited(item) && <span className="text-[10px] font-semibold text-gray-500 uppercase"> (Diedit)</span>}
                      </span>
                    </div>
                    <h4 className="font-bold text-gray-900 group-hover:text-[#0268ab] transition-colors mb-3 leading-tight">{formatTitleGrid(item.title)}</h4>
                    <p className="text-xs text-gray-500 mb-2">by {item.author?.name || 'Admin'}</p>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">{formatExcerptGrid(item.excerpt)}</p>
                    <button className="flex items-center gap-2 text-[#0268ab] text-xs font-bold uppercase tracking-widest hover:translate-x-1 transition-transform">
                      Baca Selengkapnya
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 transition-colors ${
                currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-[#0268ab]'
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {pageNumbers.map((p, idx) => {
              if (p === '...') {
                return (
                  <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">
                    ...
                  </span>
                );
              }

              const isActive = p === currentPage;
              return (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`w-8 h-8 rounded-full text-xs font-bold transition-colors ${
                    isActive
                      ? 'bg-[#0268ab] text-white'
                      : 'text-gray-500 hover:bg-gray-100 hover:text-[#0268ab]'
                  }`}
                >
                  {p}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.totalPages || pagination.totalPages === 0}
              className={`p-2 transition-colors ${
                currentPage === pagination.totalPages || pagination.totalPages === 0
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-400 hover:text-[#0268ab]'
              }`}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewsPage;


