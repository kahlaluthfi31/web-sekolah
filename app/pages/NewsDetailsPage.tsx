"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useMemo, useState } from "react";
import { ArrowRight, Calendar, ChevronLeft, User } from "lucide-react";

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

const CATEGORY_LABEL: Record<string, string> = {
   berita: "Berita",
   kejuaraan: "Kejuaraan",
   pengumuman: "Pengumuman",
   event: "Event",
};

const PLACEHOLDER_IMG =
   "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2NzUiIHZpZXdCb3g9IjAgMCAxMjAwIDY3NSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEyMDAiIGhlaWdodD0iNjc1IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9IjQ4MCAyNzBINzIwVjQwNUg0ODBWMjcwWiIgZmlsbD0iI0QxRDVEQiIvPgo8c3ZnIHdpZHRoPSIyNDAiIGhlaWdodD0iMTM1IiB2aWV3Qm94PSIwIDAgMjQwIDEzNSIgZmlsbD0ibm9uZSIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0MCIgaGVpZ2h0PSIxMzUiIGZpbGw9IiNGM0Y0RjYiLz4KPHBhdGggZD0iMTExLjIgNTQuM0gxMjguOFY4MC43SDExMS4yVjU0LjNaIiBmaWxsPSIjRDFENUVCIi8+Cjwvc3ZnPgo8L3N2Zz4K";

const formatDate = (dateStr: string | null) => {
   if (!dateStr) return "-";
   try {
      return new Date(dateStr).toLocaleDateString("id-ID", {
         day: "2-digit",
         month: "short",
         year: "numeric",
      });
   } catch {
      return dateStr;
   }
};

const buildNewsTags = (item?: NewsItem | null) => {
   if (!item) return [];
   const words = item.title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 3);

   const unique = Array.from(new Set(words)).slice(0, 5);
   const categoryTag = CATEGORY_LABEL[item.category] || item.category;
   return [categoryTag, ...unique];
};

const NewsDetailsPage: React.FC = () => {
   const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
   const [allNews, setAllNews] = useState<NewsItem[]>([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      let mounted = true;

      const loadData = async () => {
         try {
            const raw = sessionStorage.getItem("selected_news_item");
            if (raw) {
               const parsed = JSON.parse(raw) as NewsItem;
               if (mounted) setSelectedNews(parsed);
            }
         } catch {
            // ignore parse issue
         }

         try {
            const res = await fetch(`/api/news?published=true&limit=50&page=1`);
            const json = await res.json();
            
            if (!mounted) return;
            if (json?.success && Array.isArray(json.data)) {
               const sorted = [...(json.data as NewsItem[])].sort((a, b) => {
                  const dateA = new Date(a.publishedAt || a.createdAt).getTime();
                  const dateB = new Date(b.publishedAt || b.createdAt).getTime();
                  return dateB - dateA;
               });
               setAllNews(sorted);
            }
         } catch {
            if (mounted) setAllNews([]);
         } finally {
            if (mounted) setLoading(false);
         }
      };

      loadData();
      return () => {
         mounted = false;
      };
   }, []);

   const selectedTags = useMemo(() => buildNewsTags(selectedNews), [selectedNews]);

   const detailTrendingNews = useMemo(() => {
      return allNews.filter((item) => item.id !== selectedNews?.id).slice(0, 5);
   }, [allNews, selectedNews]);

   const detailRecommendedNews = useMemo(() => {
      if (!selectedNews) return [];

      const sameCategory = allNews.filter(
         (item) => item.id !== selectedNews.id && item.category === selectedNews.category,
      );

      if (sameCategory.length >= 5) return sameCategory.slice(0, 5);

      const fallback = allNews.filter(
         (item) => item.id !== selectedNews.id && item.category !== selectedNews.category,
      );

      return [...sameCategory, ...fallback].slice(0, 5);
   }, [allNews, selectedNews]);

   const handleSelectNews = (item: NewsItem) => {
      sessionStorage.setItem("selected_news_item", JSON.stringify(item));
      setSelectedNews(item);
   };

   const detailContentParagraphs = useMemo(() => {
      const rawContent = selectedNews?.content || selectedNews?.excerpt || "";
      return rawContent
         .split("\n")
         .map((paragraph) => paragraph.trim())
         .filter(Boolean);
   }, [selectedNews]);

   return (
      <div className="min-h-screen bg-gray-50">
         {/* Hero Header Section */}
         {!loading && selectedNews && (
            <section className="pt-24 pb-16 relative overflow-hidden bg-linear-to-b from-[#0268ab] via-[#0268ab] to-[#0268ab]/80">
               <div className="absolute inset-0 opacity-10">
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

               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                  <button
                     onClick={() => {
                        sessionStorage.removeItem("selected_news_item");
                        window.history.back();
                     }}
                     className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors mb-8 text-sm font-semibold group"
                  >
                     <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                     Kembali
                  </button>

                  <div className="max-w-4xl">
                     <div className="mb-6 flex items-center gap-3 flex-wrap">
                        <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full border border-white/30">
                           {CATEGORY_LABEL[selectedNews.category] || selectedNews.category}
                        </span>
                        <div className="flex items-center gap-4 text-white/80 text-xs md:text-sm">
                           <span className="flex items-center gap-1.5">
                              <User className="w-4 h-4" />
                              {selectedNews.author?.name || "Admin"}
                           </span>
                           <span className="w-1 h-1 bg-white/40 rounded-full"></span>
                           <span className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4" />
                              {formatDate(selectedNews.publishedAt || selectedNews.createdAt)}
                           </span>
                        </div>
                     </div>
                     <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                        {selectedNews.title}
                     </h1>
                     {selectedNews.excerpt && (
                        <p className="text-white/85 text-sm md:text-base leading-relaxed max-w-3xl">
                           {selectedNews.excerpt}
                        </p>
                     )}
                  </div>
               </div>
            </section>
         )}

         {/* Loading State Header */}
         {loading && (
            <section className="pt-24 pb-16 bg-linear-to-b from-[#0268ab] via-[#0268ab] to-[#0268ab]/80">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="space-y-4 animate-pulse">
                     <div className="w-24 h-4 bg-white/20 rounded-full"></div>
                     <div className="w-3/4 h-10 bg-white/20 rounded-lg"></div>
                     <div className="w-full h-6 bg-white/15 rounded-lg"></div>
                     <div className="w-2/3 h-5 bg-white/15 rounded-lg"></div>
                  </div>
               </div>
            </section>
         )}

         {/* Content Section */}
         <section className="py-12 lg:py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               {loading && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-pulse">
                     <div className="lg:col-span-8 bg-gray-100 h-96 rounded-xl" />
                     <div className="lg:col-span-4 space-y-4">
                        <div className="bg-gray-100 h-36 rounded-xl" />
                        <div className="bg-gray-100 h-56 rounded-xl" />
                        <div className="bg-gray-100 h-56 rounded-xl" />
                     </div>
                  </div>
               )}

               {!loading && selectedNews && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                     <article className="lg:col-span-8 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="relative w-full h-64 md:h-90 bg-gray-100">
                           <img
                              src={selectedNews.featuredImage || PLACEHOLDER_IMG}
                              alt={selectedNews.title}
                              className="w-full h-full object-cover"
                           />
                        </div>

                        <div className="p-6 md:p-8">
                           <div className="flex flex-wrap items-center gap-3 mb-4">
                              <span className="bg-[#0268ab] text-white text-xs font-semibold px-2.5 py-1 rounded-lg">
                                 {CATEGORY_LABEL[selectedNews.category] || selectedNews.category}
                              </span>
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                 <Calendar className="w-3 h-3" />
                                 {formatDate(selectedNews.publishedAt || selectedNews.createdAt)}
                              </span>
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                 <User className="w-3 h-3" />
                                 {selectedNews.author?.name || "Admin"}
                              </span>
                           </div>

                           <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-5">
                              {selectedNews.title}
                           </h2>

                           <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                              {detailContentParagraphs.length > 0 ? (
                                 detailContentParagraphs.map((paragraph, idx) => (
                                    <p key={`${selectedNews.id}-${idx}`}>{paragraph}</p>
                                 ))
                              ) : (
                                 <p>Konten berita belum tersedia.</p>
                              )}
                           </div>
                        </div>
                     </article>

                     <aside className="lg:col-span-4 space-y-6">
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                           <h3 className="text-sm font-bold text-gray-900 mb-4">Berdasarkan Tags</h3>
                           <div className="flex flex-wrap gap-2">
                              {selectedTags.map((tag) => (
                                 <span
                                    key={tag}
                                    className="text-xs font-semibold text-[#0268ab] bg-[#0268ab]/10 px-2.5 py-1 rounded-lg"
                                 >
                                    #{tag}
                                 </span>
                              ))}
                           </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                           <h3 className="text-sm font-bold text-gray-900 mb-4">Berita Teratas / Trending</h3>
                           <div className="space-y-3">
                              {detailTrendingNews.map((item) => (
                                 <button
                                    key={`trend-${item.id}`}
                                    onClick={() => handleSelectNews(item)}
                                    className="w-full text-left flex items-start gap-3 group"
                                 >
                                    <img
                                       src={item.featuredImage || PLACEHOLDER_IMG}
                                       alt={item.title}
                                       className="w-14 h-14 rounded-lg object-cover border border-gray-100 shrink-0"
                                    />
                                    <div>
                                       <p className="text-xs font-semibold text-gray-900 group-hover:text-[#0268ab] line-clamp-2 transition-colors">
                                          {item.title}
                                       </p>
                                       <p className="text-[11px] text-gray-500 mt-1">{formatDate(item.publishedAt || item.createdAt)}</p>
                                    </div>
                                 </button>
                              ))}
                           </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                           <h3 className="text-sm font-bold text-gray-900 mb-4">Berita Untukmu</h3>
                           <div className="space-y-3">
                              {detailRecommendedNews.map((item) => (
                                 <button
                                    key={`rec-${item.id}`}
                                    onClick={() => handleSelectNews(item)}
                                    className="w-full text-left flex items-start gap-3 group"
                                 >
                                    <img
                                       src={item.featuredImage || PLACEHOLDER_IMG}
                                       alt={item.title}
                                       className="w-14 h-14 rounded-lg object-cover border border-gray-100 shrink-0"
                                    />
                                    <div>
                                       <p className="text-xs font-semibold text-gray-900 group-hover:text-[#0268ab] line-clamp-2 transition-colors">
                                          {item.title}
                                       </p>
                                       <p className="text-[11px] text-gray-500 mt-1">{CATEGORY_LABEL[item.category] || item.category}</p>
                                    </div>
                                 </button>
                              ))}
                           </div>
                        </div>
                     </aside>
                  </div>
               )}
            </div>
         </section>

         {!loading && !selectedNews && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
               <div className="bg-white border border-gray-100 rounded-xl p-8 text-center text-sm text-gray-500">
                  Detail berita tidak ditemukan.
               </div>
            </div>
         )}
      </div>
   );
};

export default NewsDetailsPage;





