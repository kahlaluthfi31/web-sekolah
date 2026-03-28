"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Calendar, ChevronLeft, User, Eye, Share2 } from "lucide-react";
import { useSession } from "next-auth/react";

interface NewsDetailsPageProps {
   onBack?: () => void;
}

type NewsItem = {
   id: number;
   title: string;
   slug?: string | null;
   excerpt: string | null;
   content?: string | null;
   featuredImage: string | null;
   category: string;
   views?: number;
   shares?: number;
   author?: { name?: string | null } | null;
   authorName?: string | null;
   creatorCategory?: string | null;
   publishedAt: string | null;
   createdAt: string;
   updatedAt?: string;
};

   type CommentItem = {
       id: number;
       commentText: string;
       status: string;
       createdAt: string;
       updatedAt?: string;
       user?: { id: number; name?: string | null } | null;
   };

   type TrendingItem = {
      id: number;
      title: string;
      slug?: string | null;
      featuredImage: string | null;
      category: string;
      publishedAt: string | null;
      createdAt: string;
      commentCount: number;
   };

const CATEGORY_LABEL: Record<string, string> = {
   berita: "Berita",
   kejuaraan: "Kejuaraan",
   pengumuman: "Pengumuman",
   event: "Event",
};

const PLACEHOLDER_IMG =
   "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2NzUiIHZpZXdCb3g9IjAgMCAxMjAwIDY3NSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEyMDAiIGhlaWdodD0iNjc1IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9IjQ4MCAyNzBINzIwVjQwNUg0ODBWMjcwWiIgZmlsbD0iI0QxRDVEQiIvPgo8c3ZnIHdpZHRoPSIyNDAiIGhlaWdodD0iMTM1IiB2aWV3Qm94PSIwIDAgMjQwIDEzNSIgZmlsbD0ibm9uZSIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0MCIgaGVpZ2h0PSIxMzUiIGZpbGw9IiNGM0Y0RjYiLz4KPHBhdGggZD0iMTExLjIgNTQuM0gxMjguOFY4MC43SDExMS4yVjU0LjNaIiBmaWxsPSIjRDFENUVCIi8+Cjwvc3ZnPgo8L3N2Zz4K";

const COMMENTS_PER_PAGE = 4;
const COMMENT_PREVIEW_LIMIT = 190;

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

const formatDateTime = (dateStr: string | null) => {
   if (!dateStr) return "-";
   try {
      const formatted = new Date(dateStr).toLocaleString("id-ID", {
         weekday: "long",
         day: "2-digit",
         month: "long",
         year: "numeric",
         hour: "2-digit",
         minute: "2-digit",
      });
      return `${formatted} WIB`;
   } catch {
      return dateStr;
   }
};


const escapeHtml = (value: string) => {
   return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
};

const decodeHtmlEntities = (value: string) => {
   const textarea = document.createElement("textarea");
   textarea.innerHTML = value;
   return textarea.value;
};

const normalizeHtmlSource = (raw: string) => {
   const source = raw.trim();
   if (!source) return "";

   const containsHtml = /<[^>]+>/.test(source);
   const looksEncoded = !containsHtml && /&lt;[^&]+&gt;/.test(source);
   const decodedOnce = looksEncoded && typeof window !== "undefined" ? decodeHtmlEntities(source) : source;
   const decodedTwice =
      !containsHtml && /&lt;[^&]+&gt;/.test(decodedOnce) && typeof window !== "undefined"
         ? decodeHtmlEntities(decodedOnce)
         : decodedOnce;

   return decodedTwice.trim();
};

const sanitizeAndNormalizeNewsContent = (raw: string) => {
   const normalizedSource = normalizeHtmlSource(raw);
   if (!normalizedSource) return "";

   const containsDecodedHtml = /<[^>]+>/.test(normalizedSource);
   const normalizedHtml = containsDecodedHtml
      ? normalizedSource
      : normalizedSource
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

   doc.querySelectorAll("img").forEach((img) => {
      const currentSrc = img.getAttribute("src");
      const savedSrc = img.getAttribute("data-cke-saved-src") || img.getAttribute("data-src");
      if ((!currentSrc || currentSrc.trim() === "") && savedSrc) {
         img.setAttribute("src", savedSrc);
      }
   });

   return doc.body.innerHTML;
};

const NewsDetailsPage: React.FC<NewsDetailsPageProps> = ({ onBack }) => {
   const { status: sessionStatus } = useSession();
   const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
   const [allNews, setAllNews] = useState<NewsItem[]>([]);
   const [loading, setLoading] = useState(true);
   const [displayViews, setDisplayViews] = useState(0);
   const [displayShares, setDisplayShares] = useState(0);
   const [popularTags, setPopularTags] = useState<string[]>([]);
   const [trendingNews, setTrendingNews] = useState<TrendingItem[]>([]);
   const [comments, setComments] = useState<CommentItem[]>([]);
   const [commentsLoading, setCommentsLoading] = useState(false);
   const [commentsPage, setCommentsPage] = useState(1);
   const [commentsTotalPages, setCommentsTotalPages] = useState(1);
   const [expandedComments, setExpandedComments] = useState<Record<number, boolean>>({});
   const [myComment, setMyComment] = useState<CommentItem | null>(null);
   const [commentText, setCommentText] = useState("");
   const [commentSubmitting, setCommentSubmitting] = useState(false);
   const [commentMessage, setCommentMessage] = useState<string | null>(null);
   const lastIncrementedId = useRef<number | null>(null);
   const lastSharedId = useRef<number | null>(null);

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

   const selectedTags = useMemo(() => popularTags, [popularTags]);

   const detailTrendingNews = useMemo(() => {
      if (trendingNews.length <= 7) return trendingNews;
      return trendingNews.filter((item) => item.id !== selectedNews?.id).slice(0, 7);
   }, [trendingNews, selectedNews]);

   const detailRecommendedNews = useMemo(() => {
      if (!selectedNews) return [];

      const sameCategory = allNews.filter(
         (item) => item.id !== selectedNews.id && item.category === selectedNews.category,
      );

      if (sameCategory.length >= 5) return sameCategory.slice(0, 5);

      return sameCategory.slice(0, 5);
   }, [allNews, selectedNews]);

   const handleSelectNews = (item: NewsItem | TrendingItem) => {
      const normalized: NewsItem = {
         id: item.id,
         title: item.title,
         slug: item.slug ?? null,
         excerpt: "" as string | null,
         content: null,
         featuredImage: item.featuredImage,
         category: item.category,
         publishedAt: item.publishedAt,
         createdAt: item.createdAt,
      };
      sessionStorage.setItem("selected_news_item", JSON.stringify(normalized));
      setSelectedNews(normalized);
   };

   const detailContentHtml = useMemo(() => {
      const rawContent = selectedNews?.content || selectedNews?.excerpt || "";
      const normalizedRaw = normalizeHtmlSource(rawContent);
      const sanitized = sanitizeAndNormalizeNewsContent(rawContent);
      const hasRichElements = /<(img|table|figure)\b/i.test(normalizedRaw);
      const sanitizedHasRich = /<(img|table|figure)\b/i.test(sanitized);
      if (hasRichElements && !sanitizedHasRich) {
         return normalizedRaw;
      }
      return sanitized;
   }, [selectedNews]);

   useEffect(() => {
      if (!selectedNews) return;

      let active = true;

      const loadDetail = async () => {
         try {
            const res = await fetch(`/api/news/${selectedNews.id}`);
            const json = await res.json();
            if (!active) return;
            if (json?.success && json.data) {
               setSelectedNews((prev) => {
                  if (!prev || prev.id !== selectedNews.id) return prev;
                  const incoming = json.data as NewsItem;
                  const isSame =
                     incoming.updatedAt === prev.updatedAt &&
                     incoming.content === prev.content &&
                     incoming.excerpt === prev.excerpt &&
                     incoming.featuredImage === prev.featuredImage;
                  if (isSame) return prev;
                  const next = { ...prev, ...incoming } as NewsItem;
                  sessionStorage.setItem("selected_news_item", JSON.stringify(next));
                  return next;
               });
            }
         } catch {
            // ignore fetch issue
         }
      };

      loadDetail();
      return () => {
         active = false;
      };
   }, [selectedNews]);

   useEffect(() => {
      let active = true;
      const loadInsights = async () => {
         try {
            const res = await fetch('/api/news/insights?limit=7');
            const json = await res.json();
            if (!active) return;
            const tags = Array.isArray(json?.data?.popularTags)
               ? json.data.popularTags.map((tag: { name: string }) => tag.name)
               : [];
            setPopularTags(tags);
            setTrendingNews(Array.isArray(json?.data?.trending) ? json.data.trending : []);
         } catch {
            if (active) {
               setPopularTags([]);
               setTrendingNews([]);
            }
         }
      };

      loadInsights();
      return () => {
         active = false;
      };
   }, []);

   useEffect(() => {
      if (!selectedNews?.id) return;

      let active = true;
      const fetchComments = async () => {
         setCommentsLoading(true);
         try {
            const res = await fetch(
               `/api/comments?contentType=news&contentId=${selectedNews.id}&limit=${COMMENTS_PER_PAGE}&page=${commentsPage}`,
            );
            const json = await res.json();
            if (!active) return;
            setComments(Array.isArray(json?.data) ? (json.data as CommentItem[]) : []);
            setCommentsTotalPages(json?.pagination?.totalPages || 1);
         } catch {
            if (active) setComments([]);
         } finally {
            if (active) setCommentsLoading(false);
         }
      };

      fetchComments();
      return () => {
         active = false;
      };
   }, [selectedNews?.id, commentsPage]);

   useEffect(() => {
      if (!selectedNews?.id) return;
      setCommentsPage(1);
      setExpandedComments({});
   }, [selectedNews?.id]);

   useEffect(() => {
      if (!selectedNews?.id || sessionStatus !== "authenticated") {
         setMyComment(null);
         return;
      }

      let active = true;
      const fetchMyComment = async () => {
         try {
            const res = await fetch(
               `/api/comments?contentType=news&contentId=${selectedNews.id}&mine=true&limit=1`,
            );
            const json = await res.json();
            if (!active) return;
            const data = Array.isArray(json?.data) ? (json.data as CommentItem[]) : [];
            setMyComment(data[0] || null);
         } catch {
            if (active) setMyComment(null);
         }
      };

      fetchMyComment();
      return () => {
         active = false;
      };
   }, [selectedNews?.id, sessionStatus]);

   useEffect(() => {
      if (!myComment) {
         setCommentText("");
         return;
      }
      setCommentText(myComment.commentText);
   }, [myComment]);

   const handleSubmitComment = async () => {
      if (!selectedNews?.id || sessionStatus !== "authenticated") return;
      const payload = {
         contentType: "news",
         contentId: selectedNews.id,
         commentText: commentText.trim(),
      };

      if (!payload.commentText) {
         setCommentMessage("Komentar tidak boleh kosong.");
         return;
      }

      setCommentSubmitting(true);
      setCommentMessage(null);
      try {
         const res = await fetch("/api/comments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
         });
         const json = await res.json();
         if (res.ok) {
            setCommentMessage(json?.message || "Komentar terkirim dan menunggu verifikasi.");
            const updated = json?.data as CommentItem | undefined;
            if (updated) setMyComment(updated);
            const resApproved = await fetch(
         `/api/comments?contentType=news&contentId=${selectedNews.id}&limit=${COMMENTS_PER_PAGE}&page=1`,
            );
            const approvedJson = await resApproved.json();
            setComments(Array.isArray(approvedJson?.data) ? approvedJson.data : []);
               setCommentsTotalPages(approvedJson?.pagination?.totalPages || 1);
               setCommentsPage(1);
         } else {
            setCommentMessage(json?.message || "Gagal mengirim komentar.");
         }
      } catch {
         setCommentMessage("Terjadi kesalahan saat mengirim komentar.");
      } finally {
         setCommentSubmitting(false);
      }
   };

   useEffect(() => {
      if (!selectedNews) return;

      // Always start from current value from API/session data
      setDisplayViews(selectedNews.views || 0);
   setDisplayShares(selectedNews.shares || 0);
      if (lastIncrementedId.current === selectedNews.id) return;

      let guestId: string | null = null;
      try {
         const stored = localStorage.getItem("guest_view_id");
         if (stored) {
            guestId = stored;
         } else {
            guestId = crypto.randomUUID();
            localStorage.setItem("guest_view_id", guestId);
         }
      } catch {
         guestId = null;
      }

      const incrementView = async () => {
         try {
            const res = await fetch(`/api/news/${selectedNews.id}?action=increment-view`, {
               method: "PATCH",
               headers: guestId ? { "x-guest-id": guestId } : undefined,
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
         }
      };
      lastIncrementedId.current = selectedNews.id;
      incrementView();
   }, [selectedNews]);

   const toggleCommentExpand = (id: number) => {
      setExpandedComments((prev) => ({
         ...prev,
         [id]: !prev[id],
      }));
   };

   const handleShare = async () => {
      if (!selectedNews) return;

      let slug = selectedNews.slug || null;
      if (!slug) {
         try {
            const res = await fetch(`/api/news/${selectedNews.id}`);
            const json = await res.json();
            if (json?.success && json.data?.slug) {
               slug = json.data.slug as string;
               setSelectedNews((prev) => (prev ? { ...prev, slug } : prev));
            }
         } catch {
            // ignore fetch issue
         }
      }

      const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
      const shareUrl = slug ? `${baseUrl}/berita/${slug}` : window.location.href;
      const shareTitle = selectedNews.title;
      const shareText = selectedNews.excerpt || selectedNews.title;

      try {
         if (navigator.share) {
            await navigator.share({
               title: shareTitle,
               text: shareText,
               url: shareUrl,
            });
         } else {
            await navigator.clipboard.writeText(shareUrl);
         }
      } catch {
         // ignore share cancel
      }

      if (lastSharedId.current === selectedNews.id) return;

      let guestId: string | null = null;
      try {
         const stored = localStorage.getItem("guest_view_id");
         if (stored) {
            guestId = stored;
         } else {
            guestId = crypto.randomUUID();
            localStorage.setItem("guest_view_id", guestId);
         }
      } catch {
         guestId = null;
      }

      lastSharedId.current = selectedNews.id;
      try {
         const res = await fetch(`/api/news/${selectedNews.id}?action=increment-share`, {
            method: "PATCH",
            headers: guestId ? { "x-guest-id": guestId } : undefined,
         });
         const json = await res.json();
         if (json?.success && typeof json?.data?.shares === "number") {
            setDisplayShares(json.data.shares);
         } else {
            setDisplayShares((prev) => prev + 1);
         }
      } catch {
         setDisplayShares((prev) => prev + 1);
      }
   };

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
                        onClick={handleShare}
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
                     <span>{formatDateTime(selectedNews.publishedAt || selectedNews.createdAt)}</span>
                  </div>

                  {/* Author Line */}
                  <div className="flex items-center gap-2 text-white/90 text-sm md:text-base mb-8">
                     <User className="w-4 h-4 text-white/70" />
                     <span>
                        {selectedNews.authorName
                           ? `Oleh ${selectedNews.creatorCategory || selectedNews.author?.name || "Admin"} (${selectedNews.authorName})`
                           : `Oleh ${selectedNews.author?.name || "Admin"}`}
                     </span>
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
                           <div className="text-white font-bold text-lg">{displayShares} kali</div>
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
                           <p className="text-md md:text-md font-semibold text-gray-900 mb-5">
                              {selectedNews.excerpt || "Ringkasan berita belum tersedia."}
                           </p>

                           <div className="text-sm text-gray-600 leading-relaxed">
                              {detailContentHtml ? (
                                 <div
                                    className="[&_a]:text-[#0268ab] [&_a]:underline [&_figure]:my-4 [&_figure]:mx-0 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-gray-900 [&_h1]:mb-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-gray-900 [&_h3]:mb-3 [&_img]:rounded-lg [&_img]:my-4 [&_img]:max-w-full [&_img]:h-auto [&_li]:mb-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_p]:mb-4 [&_p:last-child]:mb-0 [&_strong]:font-semibold [&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_table]:text-sm [&_table]:border [&_table]:border-gray-200 [&_th]:border [&_th]:border-gray-200 [&_th]:bg-gray-50 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_td]:border [&_td]:border-gray-200 [&_td]:px-3 [&_td]:py-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4"
                                    dangerouslySetInnerHTML={{ __html: detailContentHtml }}
                                 />
                              ) : (
                                 <p>Konten berita belum tersedia.</p>
                              )}
                           </div>

                           <section className="mt-10 pt-8 border-t border-gray-200">
                              <h3 className="text-lg font-bold text-gray-900 mb-2">Komentar</h3>
                              <p className="text-sm text-gray-500 mb-5">
                                 Satu akun hanya bisa memberikan satu komentar. Jika ingin mengubah komentar, silakan edit dan kirim ulang untuk verifikasi admin.
                              </p>

                              {sessionStatus !== "authenticated" ? (
                                 <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-sm text-gray-600">
                                    <p className="mb-4">Silakan login atau register untuk memberikan komentar.</p>
                                    <div className="flex flex-wrap gap-3">
                                       <a
                                          href="/login"
                                          className="px-4 py-2 rounded-lg bg-[#0268ab] text-white text-sm font-semibold"
                                       >
                                          Login
                                       </a>
                                       <a
                                          href="/register"
                                          className="px-4 py-2 rounded-lg border border-[#0268ab] text-[#0268ab] text-sm font-semibold"
                                       >
                                          Register
                                       </a>
                                    </div>
                                 </div>
                              ) : (
                                 <div className="bg-white border border-gray-200 rounded-xl p-5">
                                    <div className="flex items-center justify-between mb-3">
                                       <p className="text-sm font-semibold text-gray-900">
                                          {myComment ? "Edit komentar Anda" : "Tulis komentar"}
                                       </p>
                                       {myComment && (
                                          <span
                                             className={`text-xs px-2.5 py-1 rounded-full ${
                                                myComment.status === "approved"
                                                   ? "bg-green-100 text-green-700"
                                                   : myComment.status === "rejected"
                                                   ? "bg-red-100 text-red-700"
                                                   : "bg-yellow-100 text-yellow-700"
                                             }`}
                                          >
                                             {myComment.status === "approved"
                                                ? "Disetujui"
                                                : myComment.status === "rejected"
                                                ? "Ditolak"
                                                : "Menunggu"}
                                          </span>
                                       )}
                                    </div>
                                    <textarea
                                       value={commentText}
                                       onChange={(event) => setCommentText(event.target.value)}
                                       rows={4}
                                       className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0268ab]"
                                       placeholder="Tulis komentar Anda di sini..."
                                    />
                                    {commentMessage && (
                                       <p className="mt-2 text-xs text-gray-600">{commentMessage}</p>
                                    )}
                                    <button
                                       onClick={handleSubmitComment}
                                       disabled={commentSubmitting || !commentText.trim()}
                                       className="mt-4 px-4 py-2 rounded-lg bg-[#0268ab] text-white text-sm font-semibold disabled:opacity-60"
                                    >
                                       {commentSubmitting
                                          ? "Mengirim..."
                                          : myComment
                                          ? "Simpan Perubahan"
                                          : "Kirim Komentar"}
                                    </button>
                                 </div>
                              )}

                              <div className="mt-6 space-y-4">
                                 {commentsLoading ? (
                                    <p className="text-sm text-gray-500">Memuat komentar...</p>
                                 ) : comments.length === 0 ? (
                                    <p className="text-sm text-gray-500">Belum ada komentar.</p>
                                 ) : (
                                    comments.map((comment) => (
                                       <div key={comment.id} className="border border-gray-200 rounded-xl p-4">
                                          <div className="flex items-center justify-between mb-2">
                                             <p className="text-sm font-semibold text-gray-900">
                                                {comment.user?.name || "Pengguna"}
                                             </p>
                                             <span className="text-xs text-gray-400">
                                                {formatDate(comment.createdAt)}
                                             </span>
                                          </div>
                                          <p className="text-sm text-gray-700 leading-relaxed">
                                             {comment.commentText.length > COMMENT_PREVIEW_LIMIT && !expandedComments[comment.id]
                                                ? `${comment.commentText.slice(0, COMMENT_PREVIEW_LIMIT)}...`
                                                : comment.commentText}
                                          </p>
                                          {comment.commentText.length > COMMENT_PREVIEW_LIMIT && (
                                             <button
                                                type="button"
                                                onClick={() => toggleCommentExpand(comment.id)}
                                                className="mt-2 text-xs font-semibold text-[#0268ab]"
                                             >
                                                {expandedComments[comment.id] ? "Sembunyikan" : "Selengkapnya"}
                                             </button>
                                          )}
                                       </div>
                                    ))
                                 )}
                              </div>

                              {commentsTotalPages > 1 && (
                                 <div className="mt-4 flex items-center gap-2 text-xs">
                                    <button
                                       type="button"
                                       disabled={commentsPage === 1}
                                       onClick={() => setCommentsPage((prev) => Math.max(prev - 1, 1))}
                                       className="px-3 py-1 rounded-lg border border-gray-200 disabled:opacity-50"
                                    >
                                       Sebelumnya
                                    </button>
                                    <span className="text-gray-500">
                                       Halaman {commentsPage} dari {commentsTotalPages}
                                    </span>
                                    <button
                                       type="button"
                                       disabled={commentsPage >= commentsTotalPages}
                                       onClick={() => setCommentsPage((prev) => Math.min(prev + 1, commentsTotalPages))}
                                       className="px-3 py-1 rounded-lg border border-gray-200 disabled:opacity-50"
                                    >
                                       Berikutnya
                                    </button>
                                 </div>
                              )}
                           </section>
                        </div>
                     </article>

                     <aside className="lg:col-span-4 space-y-6 lg:border-l lg:border-gray-200 lg:pl-8">
                        <div className="p-5 border-t border-gray-200">
                           <h3 className="text-sm font-bold text-gray-900 mb-4">Tag Populer</h3>
                           <div className="flex flex-wrap gap-2">
                              {selectedTags.length > 0 ? (
                                 selectedTags.map((tag) => (
                                    <span
                                       key={tag}
                                       className="text-xs font-semibold text-[#0268ab] bg-[#0268ab]/10 px-2.5 py-1 rounded-lg"
                                    >
                                       #{tag}
                                    </span>
                                 ))
                              ) : (
                                 <span className="text-xs text-gray-500">Belum ada tag populer.</span>
                              )}
                           </div>
                        </div>

                        <div className="p-5 border-t border-gray-200">
                           <h3 className="text-sm font-bold text-gray-900 mb-4">Trending Saat Ini</h3>
                           <div className="space-y-3">
                              {detailTrendingNews.length > 0 ? (
                                 detailTrendingNews.map((item) => (
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
                                          <p className="text-[11px] text-gray-500 mt-1">
                                             {formatDate(item.publishedAt || item.createdAt)}
                                          </p>
                                       </div>
                                    </button>
                                 ))
                              ) : (
                                 <p className="text-xs text-gray-500">Belum ada berita trending bulan ini.</p>
                              )}
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


