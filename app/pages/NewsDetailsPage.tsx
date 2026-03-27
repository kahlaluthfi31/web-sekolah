"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useMemo, useState } from "react";
import { Calendar, ChevronLeft, User, Eye, Share2 } from "lucide-react";

interface NewsDetailsPageProps {
   onBack?: () => void;
}

type NewsItem = {
   id: number;
   title: string;
   excerpt: string | null;
   content?: string | null;
   featuredImage: string | null;
   category: string;
   views?: number;
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

const escapeHtml = (value: string) => {
   return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
};

const sanitizeAndNormalizeNewsContent = (raw: string) => {
   const source = raw.trim();
   if (!source) return "";

   const containsHtml = /<[^>]+>/.test(source);
   const normalizedHtml = containsHtml
      ? source
      : source
           .split(/\n\s*\n/)
           .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br />")}</p>`)
           .join("");

   if (typeof window === "undefined") {
      return normalizedHtml;
   }

   const parser = new DOMParser();
   const doc = parser.parseFromString(normalizedHtml, "text/html");

   // Remove dangerous elements from rich text
   doc.querySelectorAll("script,style,iframe,object,embed,link,meta").forEach((node) => node.remove());

   // Remove inline event handlers and javascript: URLs
   doc.querySelectorAll("*").forEach((element) => {
      Array.from(element.attributes).forEach((attribute) => {
         const name = attribute.name.toLowerCase();
         const value = attribute.value.trim().toLowerCase();

         if (name.startsWith("on")) {
            element.removeAttribute(attribute.name);
            return;
         }

         if ((name === "href" || name === "src") && value.startsWith("javascript:")) {
            element.removeAttribute(attribute.name);
         }
      });
   });

   return doc.body.innerHTML;
};

const NewsDetailsPage: React.FC<NewsDetailsPageProps> = ({ onBack }) => {
   const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
   const [allNews, setAllNews] = useState<NewsItem[]>([]);
   const [loading, setLoading] = useState(true);
   const [displayViews, setDisplayViews] = useState(0);

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

   const detailContentHtml = useMemo(() => {
      const rawContent = selectedNews?.content || selectedNews?.excerpt || "";
      return sanitizeAndNormalizeNewsContent(rawContent);
   }, [selectedNews]);

   useEffect(() => {
      if (!selectedNews) return;

      // Always start from current value from API/session data
      setDisplayViews(selectedNews.views || 0);

      const viewedKey = "viewed_news_ids";
      let viewedIds: number[] = [];

      try {
         viewedIds = JSON.parse(sessionStorage.getItem(viewedKey) || "[]");
      } catch {
         viewedIds = [];
      }

      const hasViewed = viewedIds.includes(selectedNews.id);
      if (hasViewed) return;

      const incrementView = async () => {
         try {
            const res = await fetch(`/api/news/${selectedNews.id}?action=increment-view`, {
               method: "PATCH",
            });
            const json = await res.json();
            if (json?.success && typeof json?.data?.views === "number") {
               setDisplayViews(json.data.views);
            } else {
               setDisplayViews((prev) => prev + 1);
            }
         } catch {
            // Fallback for temporary network issues
            setDisplayViews((prev) => prev + 1);
         } finally {
            const nextViewedIds = Array.from(new Set([...viewedIds, selectedNews.id]));
            sessionStorage.setItem(viewedKey, JSON.stringify(nextViewedIds));
         }
      };

      incrementView();
   }, [selectedNews]);

   return (
      <div className="min-h-screen bg-gray-50">
         {/* Hero Header Section */}
         {!loading && selectedNews && (
            <section className="relative overflow-hidden pt-24 pb-12">
               {/* Background Image */}
               <div
                  className="absolute inset-0"
                  style={{
                     backgroundImage: `url("${selectedNews.featuredImage || PLACEHOLDER_IMG}")`,
                     backgroundSize: 'cover',
                     backgroundPosition: 'center',
                  }}
               />
               
               {/* Dark Overlay */}
               <div className="absolute inset-0 bg-linear-to-b from-black/20 via-black/40 to-black/60" />

               {/* Content */}
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                  {/* Header Controls */}
                  <div className="flex items-center justify-between mb-4">
                     {/* Back Button */}
                     <button
                        onClick={() => {
                           sessionStorage.removeItem("selected_news_item");
                           if (onBack) {
                              onBack();
                              return;
                           }

                           if (window.history.length > 1) {
                              window.history.back();
                           } else {
                              window.location.href = "/";
                           }
                        }}
                        className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors text-xs md:text-sm font-semibold group"
                     >
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Kembali
                     </button>

                     {/* Share Button */}
                     <button
                        onClick={() => {
                           if (navigator.share) {
                              navigator.share({
                                 title: selectedNews.title,
                                 text: selectedNews.excerpt || selectedNews.title,
                                 url: window.location.href,
                              }).catch(() => {
                                 // Silently handle cancel
                              });
                           } else {
                              // Fallback: copy to clipboard
                              navigator.clipboard.writeText(window.location.href);
                           }
                        }}
                        className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors text-xs md:text-sm font-semibold group"
                        title="Bagikan berita"
                     >
                        <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span className="hidden sm:inline">Bagikan</span>
                     </button>
                  </div>

                  {/* Title */}
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight max-w-4xl">
                     {selectedNews.title}
                  </h1>

                  {/* Date Line */}
                  <div className="flex items-center gap-2 text-white/90 text-sm md:text-base mb-3">
                     <Calendar className="w-4 h-4" />
                     <span>{formatDate(selectedNews.publishedAt || selectedNews.createdAt)}</span>
                  </div>

                  {/* Author Line */}
                  <div className="flex items-center gap-2 text-white/90 text-sm md:text-base mb-8">
                     <User className="w-4 h-4 text-white/70" />
                     <span>Penulis: {selectedNews.author?.name || "Admin"}</span>
                  </div>

                  {/* Views and Shares Stats */}
                  <div className="flex flex-col sm:flex-row gap-8 max-w-2xl">
                     {/* Views */}
                     <div className="flex items-center gap-3">
                        <div className="inline-flex items-center justify-center w-10 h-10 bg-white/20 rounded-full">
                           <Eye className="w-5 h-5 text-white" />
                        </div>
                        <div>
                           <div className="text-white font-bold text-lg">{displayViews} kali</div>
                           <div className="text-white/80 text-xs">Berita ini dilihat</div>
                        </div>
                     </div>

                     {/* Shares */}
                     <div className="flex items-center gap-3">
                        <div className="inline-flex items-center justify-center w-10 h-10 bg-white/20 rounded-full">
                           <Share2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                           <div className="text-white font-bold text-lg">0 kali</div>
                           <div className="text-white/80 text-xs">Berita ini dibagikan</div>
                        </div>
                     </div>
                  </div>
               </div>
            </section>
         )}

         {/* Loading State Header */}
         {loading && (
            <section className="relative overflow-hidden pt-24 pb-12 bg-linear-to-b from-gray-300 to-gray-400">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative animate-pulse space-y-4">
                  <div className="w-32 h-3 bg-gray-400/60 rounded-full"></div>
                  <div className="w-full max-w-3xl h-12 bg-gray-400/60 rounded-lg"></div>
                  <div className="w-48 h-3 bg-gray-400/50 rounded-full"></div>
                  <div className="w-2/3 h-3 bg-gray-400/50 rounded-full"></div>
                  <div className="flex gap-4 mt-6">
                     <div className="flex-1 h-20 bg-gray-400/50 rounded-lg"></div>
                     <div className="flex-1 h-20 bg-gray-400/50 rounded-lg"></div>
                  </div>
               </div>
            </section>
         )}

         {/* Content Section */}
         <section className="py-12 lg:py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               {loading && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-pulse">
                     <div className="lg:col-span-8 space-y-4">
                        <div className="w-3/4 h-10 bg-gray-200 rounded-lg"></div>
                        <div className="w-full h-6 bg-gray-200 rounded-lg"></div>
                        <div className="w-full h-6 bg-gray-200 rounded-lg"></div>
                        <div className="space-y-3">
                           <div className="h-4 bg-gray-200 rounded-lg"></div>
                           <div className="h-4 bg-gray-200 rounded-lg"></div>
                           <div className="h-4 w-3/4 bg-gray-200 rounded-lg"></div>
                        </div>
                     </div>
                     <div className="lg:col-span-4 space-y-4">
                        <div className="bg-gray-100 h-36 rounded-xl"></div>
                        <div className="bg-gray-100 h-56 rounded-xl"></div>
                        <div className="bg-gray-100 h-56 rounded-xl"></div>
                     </div>
                  </div>
               )}

               {!loading && selectedNews && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                     <article className="lg:col-span-8">
                        <div className="p-6 md:p-8">
                           <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-5">
                              {selectedNews.title}
                           </h2>

                           <div className="text-sm text-gray-600 leading-relaxed">
                              {detailContentHtml ? (
                                 <div
                                    className="[&_a]:text-[#0268ab] [&_a]:underline [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-gray-900 [&_h1]:mb-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-gray-900 [&_h3]:mb-3 [&_img]:rounded-lg [&_img]:my-4 [&_img]:max-w-full [&_img]:h-auto [&_li]:mb-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_p]:mb-4 [&_p:last-child]:mb-0 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4"
                                    dangerouslySetInnerHTML={{ __html: detailContentHtml }}
                                 />
                              ) : (
                                 <p>Konten berita belum tersedia.</p>
                              )}
                           </div>
                        </div>
                     </article>

                     <aside className="lg:col-span-4 space-y-6 lg:border-l lg:border-gray-200 lg:pl-8">
                        <div className="p-5 border-t border-gray-200">
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

                        <div className="p-5 border-t border-gray-200">
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

                        <div className="p-5 border-t border-gray-200">
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





