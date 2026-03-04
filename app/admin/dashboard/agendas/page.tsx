"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MoreVertical,
  Edit2,
  Trash2,
  X,
  Calendar,
  AlertTriangle,
  Save,
  ArrowLeft,
  CalendarDays,
  Tag,
  Clock,
  MapPin,
  Users,
  Eye,
  Upload,
} from "lucide-react";
import { useDropdownPosition } from "@/lib/useDropdownPosition";

interface AgendaCategory {
  id: number;
  name: string;
  color: string | null;
  isActive: boolean;
}
interface Agenda {
  id: number;
  title: string;
  description: string | null;
  eventDate: string;
  eventTime: string | null;
  timeEnd: string | null;
  timeEndText: string | null;
  location: string | null;
  organizer: string | null;
  categoryId: number | null;
  status: string;
  isPublished: boolean;
  image: string | null;
  createdAt: string;
  category: AgendaCategory | null;
}
interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const MONTHS = [
  { value: "1", label: "Januari" },
  { value: "2", label: "Februari" },
  { value: "3", label: "Maret" },
  { value: "4", label: "April" },
  { value: "5", label: "Mei" },
  { value: "6", label: "Juni" },
  { value: "7", label: "Juli" },
  { value: "8", label: "Agustus" },
  { value: "9", label: "September" },
  { value: "10", label: "Oktober" },
  { value: "11", label: "November" },
  { value: "12", label: "Desember" },
];
const MONTH_NAMES = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];
const STATUS_OPTIONS = [
  {
    value: "upcoming",
    label: "Akan Datang",
    color: "bg-blue-100 text-blue-700",
  },
  {
    value: "ongoing",
    label: "Berlangsung",
    color: "bg-green-100 text-green-700",
  },
  { value: "completed", label: "Selesai", color: "bg-gray-100 text-gray-700" },
];

function getStatusLabel(status: string): string {
  const found = STATUS_OPTIONS.find((s) => s.value === status);
  return found ? found.label : status;
}
function getStatusColor(status: string): string {
  const found = STATUS_OPTIONS.find((s) => s.value === status);
  return found ? found.color : "bg-gray-100 text-gray-600";
}
function getCurrentTime(): string {
  const now = new Date();
  return (
    String(now.getHours()).padStart(2, "0") +
    ":" +
    String(now.getMinutes()).padStart(2, "0")
  );
}
function getOneHourLater(): string {
  const now = new Date();
  now.setHours(now.getHours() + 1);
  return (
    String(now.getHours()).padStart(2, "0") +
    ":" +
    String(now.getMinutes()).padStart(2, "0")
  );
}

function ActionDropdown({
  onDetail,
  onEdit,
  onDelete,
}: {
  onDetail?: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { open, dropUp, pos, ref, btnRef, toggle, close } =
    useDropdownPosition(120);
  return (
    <div ref={ref} className="relative inline-block">
      <button
        ref={btnRef}
        onClick={toggle}
        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
      >
        <MoreVertical className="w-4 h-4" />
      </button>
      {open && (
        <div
          style={{
            position: "fixed",
            top: dropUp ? "auto" : pos.top,
            bottom: dropUp ? window.innerHeight - pos.top : "auto",
            right: pos.right,
            zIndex: 9999,
          }}
          className="w-36 bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden"
        >
          {onDetail && (
            <button
              onClick={() => {
                close();
                onDetail();
              }}
              className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50"
            >
              <Eye className="w-3.5 h-3.5" /> Detail
            </button>
          )}
          {onDetail && <div className="border-t border-gray-100" />}
          <button
            onClick={() => {
              close();
              onEdit();
            }}
            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-yellow-600 hover:bg-yellow-50"
          >
            <Edit2 className="w-3.5 h-3.5" /> Edit
          </button>
          <div className="border-t border-gray-100" />
          <button
            onClick={() => {
              close();
              onDelete();
            }}
            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-3.5 h-3.5" /> Hapus
          </button>
        </div>
      )}
    </div>
  );
}

function DeleteModal({
  title,
  name,
  onConfirm,
  onCancel,
  deleting,
}: {
  title: string;
  name: string;
  onConfirm: () => void;
  onCancel: () => void;
  deleting: boolean;
}) {
  return (
    <div className="fixed inset-0 z-60 overflow-hidden">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5">
          <div className="flex justify-center">
            <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center">
              <AlertTriangle className="w-7 h-7 text-red-600" />
            </div>
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">
              Yakin ingin menghapus{" "}
              <span className="font-semibold text-gray-700">{name}</span>?
            </p>
            <p className="text-xs text-gray-400">
              Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={deleting}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 disabled:opacity-50"
            >
              Batal
            </button>
            <button
              onClick={onConfirm}
              disabled={deleting}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 disabled:opacity-50"
            >
              {deleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              {deleting ? "Menghapus..." : "Ya, Hapus"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AgendasPage() {
  const [activeTab, setActiveTab] = useState<"agendas" | "categories">(
    "agendas",
  );
  const [agendas, setAgendas] = useState<Agenda[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [categories, setCategories] = useState<AgendaCategory[]>([]);
  const [catPagination, setCatPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [catLoading, setCatLoading] = useState(true);
  const [catSearch, setCatSearch] = useState("");
  const [categoryList, setCategoryList] = useState<AgendaCategory[]>([]);
  const [showAgendaForm, setShowAgendaForm] = useState(false);
  const [editAgenda, setEditAgenda] = useState<Agenda | null>(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editCategory, setEditCategory] = useState<AgendaCategory | null>(null);
  const [detailAgenda, setDetailAgenda] = useState<Agenda | null>(null);
  const [detailCategory, setDetailCategory] = useState<AgendaCategory | null>(
    null,
  );
  const [deleteAgenda, setDeleteAgenda] = useState<Agenda | null>(null);
  const [deleteCategory, setDeleteCategory] = useState<AgendaCategory | null>(
    null,
  );
  const [deleting, setDeleting] = useState(false);
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);

  useEffect(() => {
    fetch("/api/agenda-categories/list")
      .then((r) => r.json())
      .then((j) => {
        if (j.success) setCategoryList(j.data);
      })
      .catch(() => {});
  }, []);

  const fetchAgendas = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams();
      p.set("page", String(pagination.page));
      if (search) p.set("search", search);
      if (categoryFilter) p.set("categoryId", categoryFilter);
      if (statusFilter) p.set("status", statusFilter);
      if (monthFilter) p.set("month", monthFilter);
      if (yearFilter) p.set("year", yearFilter);
      const res = await fetch("/api/agendas?" + p.toString());
      const json = await res.json();
      if (json.success) {
        setAgendas(json.data);
        setPagination(json.pagination);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [
    pagination.page,
    search,
    categoryFilter,
    statusFilter,
    monthFilter,
    yearFilter,
  ]);

  const fetchCategories = useCallback(async () => {
    setCatLoading(true);
    try {
      const p = new URLSearchParams();
      p.set("page", String(catPagination.page));
      if (catSearch) p.set("search", catSearch);
      const res = await fetch("/api/agenda-categories?" + p.toString());
      const json = await res.json();
      if (json.success) {
        setCategories(json.data);
        setCatPagination(json.pagination);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCatLoading(false);
    }
  }, [catPagination.page, catSearch]);

  useEffect(() => {
    if (activeTab === "agendas") fetchAgendas();
  }, [activeTab, fetchAgendas]);
  useEffect(() => {
    if (activeTab === "categories") fetchCategories();
  }, [activeTab, fetchCategories]);

  const handleDeleteAgenda = async () => {
    if (!deleteAgenda) return;
    setDeleting(true);
    try {
      await fetch("/api/agendas/" + deleteAgenda.id, { method: "DELETE" });
      setDeleteAgenda(null);
      fetchAgendas();
    } catch {
      alert("Gagal menghapus");
    } finally {
      setDeleting(false);
    }
  };
  const handleDeleteCategory = async () => {
    if (!deleteCategory) return;
    setDeleting(true);
    try {
      const res = await fetch("/api/agenda-categories/" + deleteCategory.id, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        setDeleteCategory(null);
        fetchCategories();
        fetch("/api/agenda-categories/list")
          .then((r) => r.json())
          .then((j) => {
            if (j.success) setCategoryList(j.data);
          });
      } else {
        alert(json.message || "Gagal menghapus");
      }
    } catch {
      alert("Gagal menghapus");
    } finally {
      setDeleting(false);
    }
  };

  const openCreateAgenda = () => {
    setEditAgenda(null);
    setShowAgendaForm(true);
  };
  const openEditAgenda = (item: Agenda) => {
    setEditAgenda(item);
    setShowAgendaForm(true);
  };
  const closeAgendaForm = () => {
    setShowAgendaForm(false);
    setEditAgenda(null);
  };
  const onAgendaSaved = () => {
    closeAgendaForm();
    fetchAgendas();
  };
  const openCreateCategory = () => {
    setEditCategory(null);
    setShowCategoryForm(true);
  };
  const openEditCategory = (item: AgendaCategory) => {
    setEditCategory(item);
    setShowCategoryForm(true);
  };
  const closeCategoryForm = () => {
    setShowCategoryForm(false);
    setEditCategory(null);
  };
  const onCategorySaved = () => {
    closeCategoryForm();
    fetchCategories();
    fetch("/api/agenda-categories/list")
      .then((r) => r.json())
      .then((j) => {
        if (j.success) setCategoryList(j.data);
      });
  };

  const formatTime = (time: string | null): string => {
    if (!time) return "";
    try {
      if (time.includes("T")) {
        // ISO datetime dari Prisma @db.Time → ambil bagian jam:menit saja
        const d = new Date(time);
        if (isNaN(d.getTime())) return "";
        return (
          String(d.getUTCHours()).padStart(2, "0") +
          "." +
          String(d.getUTCMinutes()).padStart(2, "0")
        );
      }
      // "HH:mm" atau "HH:mm:ss" — hasil input <input type="time">
      const parts = time.split(":");
      if (parts.length >= 2) {
        return parts[0].padStart(2, "0") + "." + parts[1].padStart(2, "0");
      }
      return "";
    } catch {
      return "";
    }
  };

  const formatDateTime = (item: Agenda): string => {
    if (!item.eventDate) return "-";
    // Parse date-only string ("2024-06-01" atau "2024-06-01T00:00:00.000Z")
    // Gunakan split agar tidak terpengaruh timezone
    const rawDate = item.eventDate.substring(0, 10); // "YYYY-MM-DD"
    const [y, m, day] = rawDate.split("-").map(Number);
    const dateStr = day + " " + MONTH_NAMES[m - 1] + " " + y;
    const start = formatTime(item.eventTime);
    if (!start) return dateStr;
    if (item.timeEndText) {
      return dateStr + ", " + start + " s/d Selesai";
    }
    const end = item.timeEnd ? formatTime(item.timeEnd) : "";
    return dateStr + ", " + start + (end ? " - " + end + " WIB" : " WIB");
  };

  // Hanya format bagian waktu (tanpa tanggal) — dipakai di Detail modal
  const formatTimeOnly = (item: Agenda): string => {
    const start = formatTime(item.eventTime);
    if (!start) return "-";
    if (item.timeEndText) return start + " s/d Selesai";
    const end = item.timeEnd ? formatTime(item.timeEnd) : "";
    return start + (end ? " - " + end + " WIB" : " WIB");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Agenda Kegiatan</h2>
          <p className="text-sm text-gray-500">
            Kelola agenda dan kategori kegiatan sekolah
          </p>
        </div>
      </div>
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab("agendas")}
          className={
            "px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 " +
            (activeTab === "agendas"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900")
          }
        >
          <CalendarDays className="w-4 h-4" /> Daftar Agenda
        </button>
        <button
          onClick={() => setActiveTab("categories")}
          className={
            "px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 " +
            (activeTab === "categories"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900")
          }
        >
          <Tag className="w-4 h-4" /> Kategori
        </button>
      </div>

      {activeTab === "agendas" && (
        <>
          <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
            <div className="relative flex-1 min-w-50">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari agenda..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPagination((p) => ({ ...p, page: 1 }));
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPagination((p) => ({ ...p, page: 1 }));
              }}
              className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Kategori</option>
              {categoryList.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPagination((p) => ({ ...p, page: 1 }));
              }}
              className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Status</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <select
              value={monthFilter}
              onChange={(e) => {
                setMonthFilter(e.target.value);
                setPagination((p) => ({ ...p, page: 1 }));
              }}
              className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Bulan</option>
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
            <select
              value={yearFilter}
              onChange={(e) => {
                setYearFilter(e.target.value);
                setPagination((p) => ({ ...p, page: 1 }));
              }}
              className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Tahun</option>
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <button
              onClick={openCreateAgenda}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-all shadow-sm shrink-0"
            >
              <Plus className="w-4 h-4" /> Tambah Agenda
            </button>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-visible">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              </div>
            ) : agendas.length === 0 ? (
              <div className="text-center py-20">
                <CalendarDays className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                <p className="text-gray-400">Belum ada agenda.</p>
              </div>
            ) : (
              <div className="overflow-x-auto overflow-y-visible">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <th className="px-6 py-4 w-[28%]">Kegiatan</th>
                      <th className="px-6 py-4 w-[28%]">Tanggal & Waktu</th>
                      <th className="px-6 py-4 w-[18%]">Lokasi</th>
                      <th className="px-6 py-4 whitespace-nowrap">Status</th>
                      <th className="px-6 py-4 whitespace-nowrap">Publish</th>
                      <th className="px-3 py-4 text-right w-12">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {agendas.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-900">
                              {item.title}
                            </p>
                            {item.organizer && (
                              <p className="text-xs text-gray-400 flex items-center gap-1">
                                <Users className="w-3 h-3" /> {item.organizer}
                              </p>
                            )}
                            {item.category && (
                              <span
                                className="inline-block text-xs px-2 py-0.5 rounded-full"
                                style={{
                                  backgroundColor: item.category.color
                                    ? item.category.color + "20"
                                    : "#f3f4f6",
                                  color: item.category.color || "#6b7280",
                                }}
                              >
                                {item.category.name}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-sm text-gray-600">
                            <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span>{formatDateTime(item)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-sm text-gray-600">
                            <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span className="truncate max-w-40">
                              {item.location || "-"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={
                              "text-xs px-2.5 py-1 rounded-full whitespace-nowrap " +
                              getStatusColor(item.status)
                            }
                          >
                            {getStatusLabel(item.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={async () => {
                              const next = !item.isPublished;
                              await fetch("/api/agendas/" + item.id, {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ isPublished: next }),
                              });
                              fetchAgendas();
                            }}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${item.isPublished ? "bg-blue-600" : "bg-gray-300"}`}
                            title={item.isPublished ? "Publik" : "Non-publik"}
                          >
                            <span
                              className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${item.isPublished ? "translate-x-4.5" : "translate-x-0.75"}`}
                            />
                          </button>
                        </td>
                        <td className="px-3 py-4">
                          <div className="flex items-center justify-end">
                            <ActionDropdown
                              onDetail={() => setDetailAgenda(item)}
                              onEdit={() => openEditAgenda(item)}
                              onDelete={() => setDeleteAgenda(item)}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  Halaman {pagination.page} dari {pagination.totalPages}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() =>
                      setPagination((p) => ({ ...p, page: p.page - 1 }))
                    }
                    disabled={pagination.page <= 1}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      setPagination((p) => ({ ...p, page: p.page + 1 }))
                    }
                    disabled={pagination.page >= pagination.totalPages}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === "categories" && (
        <>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari kategori..."
                value={catSearch}
                onChange={(e) => {
                  setCatSearch(e.target.value);
                  setCatPagination((p) => ({ ...p, page: 1 }));
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={openCreateCategory}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-all shadow-sm shrink-0"
            >
              <Plus className="w-4 h-4" /> Tambah Kategori
            </button>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-visible">
            {catLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-20">
                <Tag className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                <p className="text-gray-400">Belum ada kategori.</p>
              </div>
            ) : (
              <div className="overflow-x-auto overflow-y-visible">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <th className="px-6 py-4">Nama Kategori</th>
                      <th className="px-6 py-4">Warna</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {categories.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-gray-900">
                            {item.name}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          {item.color ? (
                            <div className="flex items-center gap-2">
                              <div
                                className="w-6 h-6 rounded-full border border-gray-200"
                                style={{ backgroundColor: item.color }}
                              />
                              <span className="text-xs text-gray-500">
                                {item.color}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={
                              "text-xs px-2.5 py-1 rounded-full " +
                              (item.isActive
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-600")
                            }
                          >
                            {item.isActive ? "Aktif" : "Nonaktif"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end">
                            <ActionDropdown
                              onDetail={() => setDetailCategory(item)}
                              onEdit={() => openEditCategory(item)}
                              onDelete={() => setDeleteCategory(item)}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {catPagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  Halaman {catPagination.page} dari {catPagination.totalPages}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() =>
                      setCatPagination((p) => ({ ...p, page: p.page - 1 }))
                    }
                    disabled={catPagination.page <= 1}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      setCatPagination((p) => ({ ...p, page: p.page + 1 }))
                    }
                    disabled={catPagination.page >= catPagination.totalPages}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {showAgendaForm && (
        <AgendaFormModal
          agenda={editAgenda}
          categoryList={categoryList}
          onClose={closeAgendaForm}
          onSaved={onAgendaSaved}
        />
      )}
      {showCategoryForm && (
        <CategoryFormModal
          category={editCategory}
          onClose={closeCategoryForm}
          onSaved={onCategorySaved}
        />
      )}
      {deleteAgenda && (
        <DeleteModal
          title="Hapus Agenda"
          name={deleteAgenda.title}
          onConfirm={handleDeleteAgenda}
          onCancel={() => setDeleteAgenda(null)}
          deleting={deleting}
        />
      )}
      {deleteCategory && (
        <DeleteModal
          title="Hapus Kategori"
          name={deleteCategory.name}
          onConfirm={handleDeleteCategory}
          onCancel={() => setDeleteCategory(null)}
          deleting={deleting}
        />
      )}

      {detailAgenda && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setDetailAgenda(null)}
          />
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-start justify-center p-4 py-10">
              <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900">
                    Detail Agenda
                  </h2>
                  <button
                    onClick={() => setDetailAgenda(null)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="px-6 py-5 space-y-4">
                  {detailAgenda.image && (
                    <div className="w-full aspect-video rounded-xl overflow-hidden bg-gray-100">
                      <Image
                        src={detailAgenda.image}
                        alt={detailAgenda.title}
                        width={500}
                        height={280}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    </div>
                  )}
                  <div className="grid grid-cols-[120px_1fr] gap-y-3 text-sm">
                    <span className="text-gray-500">Kegiatan</span>
                    <span className="font-medium text-gray-900">
                      {detailAgenda.title}
                    </span>
                    {detailAgenda.description && (
                      <>
                        <span className="text-gray-500">Deskripsi</span>
                        <span className="text-gray-700 whitespace-pre-wrap">
                          {detailAgenda.description}
                        </span>
                      </>
                    )}
                    <span className="text-gray-500">Tanggal</span>
                    <span className="text-gray-700">
                      {detailAgenda.eventDate
                        ? (() => {
                            const rawDate = detailAgenda.eventDate.substring(0, 10);
                            const [y, mo, d] = rawDate.split("-").map(Number);
                            // Buat Date dengan komponen lokal agar toLocaleDateString tidak geser hari
                            return new Date(y, mo - 1, d).toLocaleDateString(
                              "id-ID",
                              {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              },
                            );
                          })()
                        : "-"}
                    </span>
                    <span className="text-gray-500">Waktu</span>
                    <span className="text-gray-700">
                      {formatTimeOnly(detailAgenda)}
                    </span>
                    <span className="text-gray-500">Lokasi</span>
                    <span className="text-gray-700">
                      {detailAgenda.location || "-"}
                    </span>
                    <span className="text-gray-500">Penyelenggara</span>
                    <span className="text-gray-700">
                      {detailAgenda.organizer || "-"}
                    </span>
                    <span className="text-gray-500">Kategori</span>
                    <span>
                      {detailAgenda.category ? (
                        <span
                          className="inline-block text-xs px-2.5 py-1 rounded-full"
                          style={{
                            backgroundColor: detailAgenda.category.color
                              ? detailAgenda.category.color + "20"
                              : "#f3f4f6",
                            color: detailAgenda.category.color || "#6b7280",
                          }}
                        >
                          {detailAgenda.category.name}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </span>
                    <span className="text-gray-500">Status</span>
                    <span>
                      <span
                        className={
                          "text-xs px-2.5 py-1 rounded-full " +
                          getStatusColor(detailAgenda.status)
                        }
                      >
                        {getStatusLabel(detailAgenda.status)}
                      </span>
                    </span>
                    <span className="text-gray-500">Publish</span>
                    <span>
                      <span
                        className={
                          "text-xs px-2.5 py-1 rounded-full " +
                          (detailAgenda.isPublished
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500")
                        }
                      >
                        {detailAgenda.isPublished ? "Publik" : "Non-publik"}
                      </span>
                    </span>
                    <span className="text-gray-500">Dibuat</span>
                    <span className="text-gray-700">
                      {new Date(detailAgenda.createdAt).toLocaleDateString(
                        "id-ID",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {detailCategory && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setDetailCategory(null)}
          />
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-start justify-center p-4 py-10">
              <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900">
                    Detail Kategori
                  </h2>
                  <button
                    onClick={() => setDetailCategory(null)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="px-6 py-5 space-y-4">
                  <div className="grid grid-cols-[120px_1fr] gap-y-3 text-sm">
                    <span className="text-gray-500">Nama</span>
                    <span className="font-medium text-gray-900">
                      {detailCategory.name}
                    </span>
                    <span className="text-gray-500">Warna</span>
                    <span>
                      {detailCategory.color ? (
                        <span className="inline-flex items-center gap-2">
                          <span
                            className="w-5 h-5 rounded-full border border-gray-200"
                            style={{ backgroundColor: detailCategory.color }}
                          />
                          <span className="text-gray-700">
                            {detailCategory.color}
                          </span>
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </span>
                    <span className="text-gray-500">Status</span>
                    <span>
                      <span
                        className={
                          "text-xs px-2.5 py-1 rounded-full " +
                          (detailCategory.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600")
                        }
                      >
                        {detailCategory.isActive ? "Aktif" : "Nonaktif"}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AgendaFormModal({
  agenda,
  categoryList,
  onClose,
  onSaved,
}: {
  agenda: Agenda | null;
  categoryList: AgendaCategory[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!agenda;
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const today = new Date().toISOString().split("T")[0];
  const [useTimeEndText, setUseTimeEndText] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    eventDate: today,
    eventTime: getCurrentTime(),
    timeEnd: getOneHourLater(),
    timeEndText: "Selesai",
    location: "",
    organizer: "",
    categoryId: "",
    status: "upcoming",
    isPublished: true,
    image: "",
  });

  // Hitung status otomatis dari tanggal + jam mulai
  // Hitung status otomatis berdasarkan tanggal + jam mulai + jam selesai
  // hasTimeEnd = false berarti jam selesai tidak diketahui → tidak bisa auto-complete
  function computeStatus(date: string, time: string, timeEnd: string, hasTimeEnd: boolean): string {
    if (!date) return "upcoming";
    const [y, m, d] = date.split("-").map(Number);
    const [hh, mm] = time ? time.split(":").map(Number) : [0, 0];
    const eventStartMs = new Date(y, m - 1, d, hh, mm).getTime();
    const nowMs = Date.now();

    // Belum mulai → Akan Datang
    if (nowMs < eventStartMs) return "upcoming";

    // Sudah lewat jam mulai — cek jam selesai
    if (hasTimeEnd && timeEnd) {
      const [ehh, emm] = timeEnd.split(":").map(Number);
      const eventEndMs = new Date(y, m - 1, d, ehh, emm).getTime();
      if (nowMs < eventEndMs) return "ongoing";   // sedang berlangsung
      return "completed";                          // sudah selesai
    }

    // Jam selesai tidak diketahui → minimal "berlangsung" sejak jam mulai
    // Admin harus update manual ke "Selesai"
    return "ongoing";
  }

  // Update status otomatis setiap kali tanggal/jam berubah
  useEffect(() => {
    setForm((f) => ({
      ...f,
      status: computeStatus(f.eventDate, f.eventTime, f.timeEnd, !useTimeEndText),
    }));
  }, [form.eventDate, form.eventTime, form.timeEnd, useTimeEndText]);

  function parseTimeToHHmm(val: string | null): string {
    if (!val) return "";
    try {
      if (val.includes("T")) {
        const d = new Date(val);
        if (isNaN(d.getTime())) return "";
        return (
          String(d.getUTCHours()).padStart(2, "0") +
          ":" +
          String(d.getUTCMinutes()).padStart(2, "0")
        );
      }
      const parts = val.split(":");
      if (parts.length >= 2)
        return parts[0].padStart(2, "0") + ":" + parts[1].padStart(2, "0");
      return "";
    } catch {
      return "";
    }
  }

  useEffect(() => {
    if (agenda) {
      const hasTimeEndText = !!agenda.timeEndText;
      setUseTimeEndText(hasTimeEndText);
      const eDate = agenda.eventDate ? agenda.eventDate.substring(0, 10) : today;
      const eTime = parseTimeToHHmm(agenda.eventTime) || getCurrentTime();
      const eTimeEnd = parseTimeToHHmm(agenda.timeEnd) || getOneHourLater();
      setForm({
        title: agenda.title || "",
        description: agenda.description || "",
        eventDate: eDate,
        eventTime: eTime,
        timeEnd: eTimeEnd,
        timeEndText: "Selesai",
        location: agenda.location || "",
        organizer: agenda.organizer || "",
        categoryId: agenda.categoryId ? String(agenda.categoryId) : "",
        status: computeStatus(eDate, eTime, eTimeEnd, !hasTimeEndText),
        isPublished: agenda.isPublished !== undefined ? agenda.isPublished : true,
        image: agenda.image || "",
      });
      if (agenda.image) setImagePreview(agenda.image);
    }
  }, [agenda, today]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "agendas");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (json.success && json.data?.url) {
        setForm((f) => ({ ...f, image: json.data.url }));
        setImagePreview(json.data.url);
      } else {
        setError(json.message || "Gagal mengupload gambar");
      }
    } catch {
      setError("Gagal mengupload gambar");
    } finally {
      setUploading(false);
      // Reset input agar file yang sama bisa diupload ulang
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Nama kegiatan wajib diisi");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const url = isEdit ? "/api/agendas/" + agenda!.id : "/api/agendas";
      const body = {
        title: form.title,
        description: form.description || null,
        eventDate: form.eventDate || null,
        eventTime: form.eventTime || null,
        timeEnd: useTimeEndText ? null : form.timeEnd || null,
        timeEndText: useTimeEndText ? "Selesai" : null,
        location: form.location || null,
        organizer: form.organizer || null,
        categoryId: form.categoryId ? parseInt(form.categoryId) : null,
        status: form.status,
        isPublished: form.isPublished,
        image: form.image || null,
      };
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (json.success) onSaved();
      else setError(json.message || "Gagal menyimpan");
    } catch {
      setError("Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-start justify-center p-4 py-10">
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {isEdit ? "Edit Agenda" : "Tambah Agenda"}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {isEdit ? "Perbarui data agenda" : "Tambahkan agenda baru"}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {error && (
              <div className="mx-6 mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Gambar Cover */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Gambar Cover
                </label>
                <div
                  onClick={() => !uploading && fileInputRef.current?.click()}
                  className={`relative w-full rounded-xl border-2 border-dashed overflow-hidden cursor-pointer transition-colors bg-gray-50 flex items-center justify-center ${
                    uploading
                      ? "border-blue-300 cursor-wait"
                      : "border-gray-200 hover:border-blue-400"
                  }`}
                  style={{ aspectRatio: "16/7" }}
                >
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt="preview"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="text-center py-6">
                      <Upload className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                      <p className="text-sm text-gray-400">
                        Klik untuk upload gambar
                      </p>
                      <p className="text-xs text-gray-300 mt-1">
                        JPG, PNG, WEBP maks. 2MB
                      </p>
                    </div>
                  )}
                  {uploading && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                {imagePreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setForm((f) => ({ ...f, image: "" }));
                    }}
                    className="mt-2 text-xs text-red-500 hover:text-red-700 transition-colors"
                  >
                    Hapus gambar
                  </button>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nama Kegiatan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: Upacara Bendera"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Deskripsi
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Deskripsi kegiatan"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Tanggal <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      type="date"
                      value={form.eventDate}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, eventDate: e.target.value }))
                      }
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Jam Mulai <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      type="time"
                      value={form.eventTime}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, eventTime: e.target.value }))
                      }
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Jam Selesai
                  </label>
                  <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useTimeEndText}
                      onChange={(e) => setUseTimeEndText(e.target.checked)}
                      className="w-3.5 h-3.5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    Tidak dapat ditentukan
                  </label>
                </div>
                {useTimeEndText ? (
                  <input
                    type="text"
                    value="Selesai"
                    readOnly
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                ) : (
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      type="time"
                      value={form.timeEnd}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, timeEnd: e.target.value }))
                      }
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Lokasi
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      value={form.location}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, location: e.target.value }))
                      }
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Contoh: Lapangan Utama"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Penyelenggara
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      value={form.organizer}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, organizer: e.target.value }))
                      }
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Contoh: OSIS"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Kategori
                  </label>
                  <select
                    value={form.categoryId}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, categoryId: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Pilih Kategori --</option>
                    {categoryList.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Status
                  </label>
                  {useTimeEndText ? (
                    /* Jam selesai tidak diketahui → admin bisa ubah status manual */
                    <div className="space-y-1.5">
                      <select
                        value={form.status}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, status: e.target.value }))
                        }
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="upcoming">Akan Datang</option>
                        <option value="ongoing">Berlangsung</option>
                        <option value="completed">Selesai</option>
                      </select>
                      <p className="text-xs text-amber-600 flex items-center gap-1">
                        Jam selesai tidak diketahui — ubah ke &quot;Selesai&quot; secara manual
                      </p>
                    </div>
                  ) : (
                    /* Jam selesai diketahui → status dihitung otomatis */
                    <div className="w-full px-4 py-2.5 border border-gray-100 rounded-xl text-sm bg-gray-50 flex items-center gap-2">
                      <span
                        className={
                          "inline-block w-2 h-2 rounded-full shrink-0 " +
                          (form.status === "upcoming"
                            ? "bg-blue-500"
                            : form.status === "ongoing"
                              ? "bg-green-500"
                              : "bg-gray-400")
                        }
                      />
                      <span className="text-gray-600">
                        {form.status === "upcoming"
                          ? "Akan Datang"
                          : form.status === "ongoing"
                            ? "Berlangsung"
                            : "Selesai"}
                      </span>
                      <span className="ml-auto text-xs text-gray-400 italic">
                        otomatis
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-end">
                  <div className="flex items-center justify-between py-2.5 px-4 border border-gray-100 rounded-xl bg-gray-50">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Publish</p>
                      <p className="text-xs text-gray-400">Tampilkan ke publik</p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setForm((f) => ({ ...f, isPublished: !f.isPublished }))
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${form.isPublished ? "bg-blue-600" : "bg-gray-200"}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${form.isPublished ? "translate-x-6" : "translate-x-1"}`}
                      />
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {saving ? "Menyimpan..." : isEdit ? "Perbarui" : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryFormModal({
  category,
  onClose,
  onSaved,
}: {
  category: AgendaCategory | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!category;
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    color: "#3b82f6",
    isActive: true,
  });
  const colorOptions = [
    "#ef4444",
    "#f97316",
    "#f59e0b",
    "#eab308",
    "#84cc16",
    "#22c55e",
    "#10b981",
    "#14b8a6",
    "#06b6d4",
    "#0ea5e9",
    "#3b82f6",
    "#6366f1",
    "#8b5cf6",
    "#a855f7",
    "#d946ef",
    "#ec4899",
    "#f43f5e",
  ];

  useEffect(() => {
    if (category)
      setForm({
        name: category.name || "",
        color: category.color || "#3b82f6",
        isActive: category.isActive,
      });
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Nama kategori wajib diisi");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const url = isEdit
        ? "/api/agenda-categories/" + category!.id
        : "/api/agenda-categories";
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (json.success) onSaved();
      else setError(json.message || "Gagal menyimpan");
    } catch {
      setError("Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-start justify-center p-4 py-10">
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {isEdit ? "Edit Kategori" : "Tambah Kategori"}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {isEdit
                      ? "Perbarui data kategori"
                      : "Tambahkan kategori baru"}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {error && (
              <div className="mx-6 mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nama Kategori <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: Akademik, Olahraga"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Warna
                </label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, color }))}
                      className={
                        "w-8 h-8 rounded-full border-2 transition-all " +
                        (form.color === color
                          ? "border-gray-800 scale-110"
                          : "border-transparent hover:scale-105")
                      }
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="color"
                    value={form.color}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, color: e.target.value }))
                    }
                    className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={form.color}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, color: e.target.value }))
                    }
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="#3b82f6"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Kategori Aktif
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setForm((f) => ({ ...f, isActive: !f.isActive }))
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.isActive ? "bg-blue-600" : "bg-gray-200"}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.isActive ? "translate-x-6" : "translate-x-1"}`}
                  />
                </button>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {saving ? "Menyimpan..." : isEdit ? "Perbarui" : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
