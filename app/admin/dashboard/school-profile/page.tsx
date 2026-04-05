"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  BookOpen,
  Target,
  Edit2,
  Trash2,
  Save,
  X,
  Loader2,
  Plus,
  History,
  Globe,
  MoreVertical,
  AlertTriangle,
  Upload,
  List,
  Type,
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
  ImageIcon,
  Search,
  Wifi,
  Monitor,
  Cpu,
  FlaskConical,
  Music,
  Palette,
  Camera,
  Clock,
  Database,
  Code2,
  BookMarked,
  Handshake,
  Globe2,
  Leaf,
  Wrench,
  BarChart2,
  Medal,
  Landmark,
  Brain,
  Microscope,
  Plug,
  Bus,
  Bike,
  TreePine,
  Sun,
  Snowflake,
  Flame,
  Compass,
  Map,
  Flag,
} from "lucide-react";
import Image from "next/image";

// ─── Types ───────────────────────────────────────────────
interface VisiMisiItem {
  id: number;
  section: string;
  title: string | null;
  content: string | null;
  image: string | null;
  orderPosition: number;
}

interface HistoryItem {
  id: number;
  year: string;
  title: string;
  description: string;
  sortOrder: number;
}

interface PageHeaderItem {
  pageKey: string;
  title: string;
  subtitle: string | null;
  isActive: boolean;
}

// ─── Keunggulan Icon Map ──────────────────────────────────
const KEUNGGULAN_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  // Umum
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
  // Teknologi & Sains
  Wifi,
  Monitor,
  Cpu,
  FlaskConical,
  Database,
  Code2,
  Microscope,
  Brain,
  // Pendidikan & Komunitas
  BookMarked,
  Handshake,
  Medal,
  Landmark,
  Globe2,
  Globe,
  Compass,
  Map,
  Flag,
  // Kreatif & Lainnya
  Music,
  Palette,
  Camera,
  Clock,
  Leaf,
  Wrench,
  BarChart2,
  Bus,
  Bike,
  TreePine,
  Sun,
  Snowflake,
  Flame,
  Plug,
};
const KEUNGGULAN_ICON_KEYS = Object.keys(KEUNGGULAN_ICONS);

interface KeunggulanItem {
  id: number;
  section: string;
  title: string | null;
  content: string | null;
  image: string | null; // dipakai untuk nama icon
  orderPosition: number;
}

// ─── Page Key Labels ──────────────────────────────────────
const PAGE_KEY_LABELS: Record<string, string> = {
  about: "Profil Sekolah",
  news: "Berita & Pengumuman",
  contact: "Hubungi Kami",
  admissions: "Penerimaan Siswa Baru",
  alumni: "Alumni",
  campus: "Sarana Prasarana",
  events: "Agenda & Kegiatan",
  students: "Kehidupan Siswa",
  faculty: "Struktur Sekolah",
  majors: "Program Keahlian",
};

const ALL_PAGE_KEYS = Object.keys(PAGE_KEY_LABELS);

//  Tab IDs
type Tab = "sejarah" | "visimisi" | "keunggulan" | "pageheader";

// ─── Callbacks passed down from parent ───────────────────────

//
export default function SchoolProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>("sejarah");
  // lifted state so parent can trigger VisiMisiTab's openCreate
  const [triggerVisiMisiCreate, setTriggerVisiMisiCreate] = useState(0);
  const [visiMisiAllFilled, setVisiMisiAllFilled] = useState(false);

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">Profil Sekolah</h2>
        <p className="text-sm text-gray-500 mt-1">
          Kelola sejarah, visi misi, keunggulan, dan header halaman website.
        </p>
      </div>

      {/* Tabs row — with action button on the right */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
          {(
            [
              { id: "sejarah", label: "Sejarah", icon: History },
              { id: "visimisi", label: "Visi & Misi", icon: Target },
              { id: "keunggulan", label: "Keunggulan", icon: Trophy },
              { id: "pageheader", label: "Header Halaman", icon: Globe },
            ] as {
              id: Tab;
              label: string;
              icon: React.ComponentType<{ className?: string }>;
            }[]
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === t.id
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Contextual action button */}
        {activeTab === "sejarah" && <SejarahAddButton />}
        {activeTab === "visimisi" && (
          <button
            onClick={() => setTriggerVisiMisiCreate((n) => n + 1)}
            disabled={visiMisiAllFilled}
            className="inline-flex items-center gap-2 bg-[#0092DD] text-white px-4 py-2.5 rounded-full text-sm font-semibold hover:bg-[#0077BB] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Tambah Item
          </button>
        )}
        {activeTab === "keunggulan" && <KeunggulanAddButton />}
      </div>

      {/* Tab Content */}
      {activeTab === "sejarah" && <SejarahTab />}
      {activeTab === "visimisi" && (
        <VisiMisiTab
          triggerCreate={triggerVisiMisiCreate}
          onAllFilledChange={setVisiMisiAllFilled}
        />
      )}
      {activeTab === "keunggulan" && <KeunggulanTab />}
      {activeTab === "pageheader" && <PageHeaderTab />}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Tab 1: Sejarah
// ─────────────────────────────────────────────────────────────

// Shared mutable ref for SejarahTab's add button rendered in parent header
const _sejarahRef = { openCreate: null as (() => void) | null };
function SejarahAddButton() {
  return (
    <button
      onClick={() => _sejarahRef.openCreate?.()}
      className="inline-flex items-center gap-2 bg-[#0092DD] text-white px-4 py-2.5 rounded-full text-sm font-semibold hover:bg-[#0077BB] transition-colors shadow-sm"
    >
      <Plus className="w-4 h-4" /> Tambah Sejarah
    </button>
  );
}

function SejarahTab() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    year: "",
    title: "",
    description: "",
    sortOrder: 0,
  });
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<HistoryItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });

  const fetch_ = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/school-history");
      const j = await r.json();
      if (j.success) setItems(j.data ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch_();
  }, [fetch_]);

  // Close dropdown on outside click — check data attribute so ref null tidak masalah
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-sejarah-menu]")) setOpenMenuId(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const nextSortOrder = () => {
    if (items.length === 0) return 1;
    return Math.max(...items.map((i) => i.sortOrder)) + 1;
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({
      year: "",
      title: "",
      description: "",
      sortOrder: nextSortOrder(),
    });
    setError("");
    setShowModal(true);
  };

  // Register openCreate to module-level ref so SejarahAddButton (rendered in parent) can call it
  useEffect(() => {
    _sejarahRef.openCreate = openCreate;
    return () => {
      _sejarahRef.openCreate = null;
    };
  });

  const openEdit = (item: HistoryItem) => {
    setEditingId(item.id);
    setForm({
      year: item.year,
      title: item.title,
      description: item.description,
      sortOrder: item.sortOrder,
    });
    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.year.trim() || !form.title.trim() || !form.description.trim()) {
      setError("Semua field wajib diisi.");
      return;
    }
    if (!Number.isInteger(form.sortOrder) || form.sortOrder < 1) {
      setError("Urutan tampil harus berupa angka minimal 1.");
      return;
    }

    const duplicateSortOrder = items.some(
      (item) => item.sortOrder === form.sortOrder && item.id !== editingId,
    );
    if (duplicateSortOrder) {
      setError("Urutan tampil tidak boleh sama. Gunakan angka lain.");
      return;
    }

    setSaving(true);
    try {
      const url = editingId
        ? `/api/school-history/${editingId}`
        : "/api/school-history";
      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const j = await res.json();
      if (!j.success) {
        setError(j.message || "Gagal menyimpan");
        return;
      }
      closeModal();
      fetch_();
    } catch {
      setError("Terjadi kesalahan.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await fetch(`/api/school-history/${deleteTarget.id}`, {
        method: "DELETE",
      });
      setItems((prev) => prev.filter((i) => i.id !== deleteTarget.id));
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        {loading ? (
          <div className="space-y-0">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 border-b border-gray-50 animate-pulse"
              >
                <div className="w-14 h-7 bg-gray-100 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-1/4" />
                  <div className="h-3 bg-gray-100 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="py-16 text-center">
            <History className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Belum ada data sejarah.</p>
            <button
              onClick={openCreate}
              className="mt-3 text-[#0092DD] text-sm font-semibold hover:underline"
            >
              + Tambah sekarang
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400 font-semibold">
                  <th className="text-center px-4 py-3 w-[8%]">Urutan</th>
                  <th className="text-left px-4 py-3 w-[17%]">Tahun</th>
                  <th className="text-left px-4 py-3">Judul &amp; Deskripsi</th>
                  <th className="text-center px-4 py-3 w-[17%]">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {items
                  .sort((a, b) => a.sortOrder - b.sortOrder)
                  .map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-4 py-4 text-center">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-gray-500 font-mono text-xs font-bold">
                          {item.sortOrder}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-[#0092DD] text-white text-xs font-bold whitespace-nowrap">
                          {item.year}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-semibold text-gray-900 mb-0.5">
                          {item.title}
                        </p>
                        <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div
                          className="relative inline-block"
                          data-sejarah-menu
                        >
                          <button
                            data-sejarah-menu
                            onClick={(e) => {
                              e.stopPropagation();
                              const rect = (
                                e.currentTarget as HTMLElement
                              ).getBoundingClientRect();
                              setMenuPos({
                                top: rect.bottom + 4,
                                right: window.innerWidth - rect.right,
                              });
                              setOpenMenuId(
                                openMenuId === item.id ? null : item.id,
                              );
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          {openMenuId === item.id && (
                            <div
                              data-sejarah-menu
                              className="fixed z-9999 bg-white rounded-xl shadow-xl border border-gray-100 py-1 w-36"
                              style={{
                                top: `${menuPos.top}px`,
                                right: `${menuPos.right}px`,
                              }}
                            >
                              <button
                                onClick={() => {
                                  setOpenMenuId(null);
                                  openEdit(item);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              >
                                <Edit2 className="w-3.5 h-3.5 text-[#0092DD]" />{" "}
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  setOpenMenuId(null);
                                  setDeleteTarget(item);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Hapus
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Modal Tambah / Edit ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeModal}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {editingId ? "Edit Sejarah" : "Tambah Sejarah"}
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Isi detail peristiwa sejarah sekolah secara lengkap dan
                  tentukan urutan tampil yang unik.
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Tahun / Periode <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.year}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, year: e.target.value }))
                  }
                  placeholder="cth: 1964 atau ke-5"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0092DD]/30 focus:border-[#0092DD] transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Judul <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                  placeholder="cth: Berdirinya SMK Negeri 1 Ciamis"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0092DD]/30 focus:border-[#0092DD] transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Deskripsi <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  rows={4}
                  placeholder="Penjelasan singkat tentang peristiwa ini..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0092DD]/30 focus:border-[#0092DD] transition resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Urutan Tampil <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  value={form.sortOrder}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      sortOrder: Number(e.target.value),
                    }))
                  }
                  className="w-28 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0092DD]/30 focus:border-[#0092DD] transition"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Otomatis terisi, bisa diubah manual. Nilai harus unik (tidak
                  boleh sama).
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 border border-gray-200 text-gray-600 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#0092DD] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#0077BB] disabled:opacity-60 transition-colors"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {saving
                    ? "Menyimpan..."
                    : editingId
                      ? "Simpan Perubahan"
                      : "Tambah"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal Konfirmasi Hapus ── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-60 overflow-hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => !deleting && setDeleteTarget(null)}
          />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5">
              <div className="flex justify-center">
                <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center">
                  <AlertTriangle className="w-7 h-7 text-red-600" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-bold text-gray-900">
                  Hapus Data Sejarah
                </h3>
                <p className="text-sm text-gray-500">
                  Yakin ingin menghapus{" "}
                  <span className="font-semibold text-gray-700">
                    &lsquo;{deleteTarget.title}&rsquo;
                  </span>
                  ?
                </p>
                <p className="text-xs text-gray-400">
                  Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  disabled={deleting}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={deleting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-all disabled:opacity-50"
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
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Tab 2: Visi & Misi
// ─────────────────────────────────────────────────────────────

// ── Shared image helpers (module-level agar state tidak reset setiap render) ──
function NoImagePlaceholder() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 gap-1.5">
      <ImageIcon className="w-8 h-8 text-gray-300" />
      <span className="text-[11px] text-gray-400 font-medium tracking-wide">
        No Image
      </span>
    </div>
  );
}

function CardImage({ src, alt }: { src: string; alt: string }) {
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

// Compress + convert image to WebP on the client side
async function compressToWebP(
  file: File,
  quality = 0.75,
  maxDim = 1200,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = document.createElement("img");
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        if (width >= height) {
          height = Math.round((height / width) * maxDim);
          width = maxDim;
        } else {
          width = Math.round((width / height) * maxDim);
          height = maxDim;
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Canvas toBlob failed"));
        },
        "image/webp",
        quality,
      );
    };
    img.onerror = reject;
    img.src = url;
  });
}

function VisiMisiTab({
  triggerCreate,
  onAllFilledChange,
}: {
  triggerCreate: number;
  onAllFilledChange: (v: boolean) => void;
}) {
  const [items, setItems] = useState<VisiMisiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<VisiMisiItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Form state
  const [cardType, setCardType] = useState<"Visi" | "Misi">("Visi");
  const [contentMode, setContentMode] = useState<"deskripsi" | "poin">(
    "deskripsi",
  );
  const [descText, setDescText] = useState("");
  const [points, setPoints] = useState<string[]>([""]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [imgError, setImgError] = useState(false);

  // Image upload state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/school-profile?section=visi_misi");
      const j = await r.json();
      if (j.success) {
        const filtered = (j.data ?? []).filter(
          (d: VisiMisiItem) => d.section === "visi_misi",
        );
        setItems(filtered);
        onAllFilledChange(filtered.length >= 2);
      }
    } finally {
      setLoading(false);
    }
  }, [onAllFilledChange]);

  useEffect(() => {
    fetch_();
  }, [fetch_]);

  // Parent triggers openCreate via triggerCreate counter
  useEffect(() => {
    if (triggerCreate > 0) openCreate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerCreate]);

  // Close menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setOpenMenuId(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Derived: which card types already exist
  const existingTypes = items.map((i) => i.title);

  const resetForm = () => {
    setCardType("Visi");
    setContentMode("deskripsi");
    setDescText("");
    setPoints([""]);
    setImageFile(null);
    setImagePreview(null);
    setExistingImageUrl(null);
    setImgError(false);
    setError("");
  };

  const openCreate = () => {
    resetForm();
    setEditingId(null);
    // Auto-select the type that doesn't exist yet
    if (existingTypes.includes("Visi") && !existingTypes.includes("Misi"))
      setCardType("Misi");
    else setCardType("Visi");
    setShowModal(true);
  };

  const openEdit = (item: VisiMisiItem) => {
    setEditingId(item.id);
    setCardType((item.title === "Misi" ? "Misi" : "Visi") as "Visi" | "Misi");
    let mode: "deskripsi" | "poin" = "deskripsi";
    let pts: string[] = [""];
    let desc = "";
    if (item.content) {
      try {
        const parsed = JSON.parse(item.content);
        if (Array.isArray(parsed)) {
          mode = "poin";
          pts = parsed;
        } else {
          desc = item.content;
        }
      } catch {
        desc = item.content;
      }
    }
    setContentMode(mode);
    setDescText(desc);
    setPoints(pts);
    setExistingImageUrl(item.image ?? null);
    setImagePreview(item.image ?? null);
    setImgError(false);
    setImageFile(null);
    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    resetForm();
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
    setImageFile(file);
    setImgError(false);
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return existingImageUrl;
    setUploading(true);
    try {
      const compressed = await compressToWebP(imageFile);
      const formData = new FormData();
      formData.append(
        "file",
        new File([compressed], `visimisi-${Date.now()}.webp`, {
          type: "image/webp",
        }),
      );
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const j = await res.json();
      if (j.success) return j.data.url;
      setError("Gagal upload gambar: " + (j.message ?? ""));
      return null;
    } catch {
      setError("Gagal memproses gambar.");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalContent =
      contentMode === "poin"
        ? JSON.stringify(points.filter((p) => p.trim()))
        : descText.trim();
    if (!finalContent) {
      setError("Konten wajib diisi.");
      return;
    }
    // Gambar wajib
    if (!imagePreview && !existingImageUrl) {
      setError("Gambar wajib diunggah.");
      return;
    }

    setSaving(true);
    try {
      const imageUrl = await uploadImage();
      if (!imageUrl) {
        setSaving(false);
        return;
      }

      const url = editingId
        ? `/api/school-profile/${editingId}`
        : "/api/school-profile";
      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "visi_misi",
          title: cardType,
          content: finalContent,
          image: imageUrl,
          orderPosition:
            existingTypes.includes("Visi") && existingTypes.includes("Misi")
              ? 0
              : existingTypes.length,
        }),
      });
      const j = await res.json();
      if (!j.success) {
        setError(j.message || "Gagal menyimpan");
        return;
      }
      closeModal();
      fetch_();
    } catch {
      setError("Terjadi kesalahan.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await fetch(`/api/school-profile/${deleteTarget.id}`, {
        method: "DELETE",
      });
      const next = items.filter((i) => i.id !== deleteTarget.id);
      setItems(next);
      onAllFilledChange(next.length >= 2);
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  const parseContent = (
    content: string | null,
  ): { mode: "deskripsi" | "poin"; desc: string; pts: string[] } => {
    if (!content) return { mode: "deskripsi", desc: "", pts: [] };
    try {
      const p = JSON.parse(content);
      if (Array.isArray(p)) return { mode: "poin", desc: "", pts: p };
    } catch {
      /* */
    }
    return { mode: "deskripsi", desc: content, pts: [] };
  };

  return (
    <div className="space-y-4">
      {/* Cards preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          [...Array(2)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 animate-pulse"
            >
              <div className="h-44 bg-gray-100 rounded-t-2xl" />
              <div className="p-4 space-y-2">
                <div className="h-3 bg-gray-100 rounded w-full" />
                <div className="h-3 bg-gray-100 rounded w-3/4" />
              </div>
            </div>
          ))
        ) : items.length === 0 ? (
          <div className="col-span-2 py-16 text-center bg-white rounded-2xl border border-gray-100">
            <BookOpen className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Belum ada data visi misi.</p>
          </div>
        ) : (
          items
            .sort((a, b) => a.orderPosition - b.orderPosition)
            .map((item) => {
              const { mode, desc, pts } = parseContent(item.content);
              const isMisi = item.title === "Misi";
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-shadow overflow-hidden"
                >
                  {/* Gambar */}
                  <div className="relative h-44 bg-gray-100">
                    {/* Badge pojok kiri atas */}
                    <div className="absolute top-3 left-3 z-10">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm ${isMisi ? "bg-[#F97316]" : "bg-[#0092DD]"}`}
                      >
                        {isMisi ? (
                          <List className="w-3 h-3" />
                        ) : (
                          <Target className="w-3 h-3" />
                        )}
                        {item.title}
                      </span>
                    </div>

                    {item.image ? (
                      <CardImage src={item.image} alt={item.title ?? ""} />
                    ) : (
                      <NoImagePlaceholder />
                    )}

                    {/* 3-dot menu */}
                    <div
                      className="absolute top-2 right-2 z-10"
                      ref={openMenuId === item.id ? menuRef : null}
                    >
                      <button
                        onClick={() =>
                          setOpenMenuId(openMenuId === item.id ? null : item.id)
                        }
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white transition-colors shadow-sm"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      {openMenuId === item.id && (
                        <div className="absolute right-0 top-9 bg-white rounded-xl shadow-lg border border-gray-100 py-1 w-36 z-20">
                          <button
                            onClick={() => {
                              setOpenMenuId(null);
                              openEdit(item);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-[#0092DD]" />{" "}
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setOpenMenuId(null);
                              setDeleteTarget(item);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Hapus
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Konten preview */}
                  <div className="p-4">
                    {mode === "deskripsi" ? (
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
                        {desc}
                      </p>
                    ) : (
                      <ul className="space-y-1.5">
                        {pts.slice(0, 4).map((pt, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-xs text-gray-600"
                          >
                            <span
                              className={`mt-0.5 w-4 h-4 rounded-full shrink-0 flex items-center justify-center text-white text-[9px] font-bold ${isMisi ? "bg-[#F97316]" : "bg-[#0092DD]"}`}
                            >
                              {i + 1}
                            </span>
                            <span className="line-clamp-2">{pt}</span>
                          </li>
                        ))}
                        {pts.length > 4 && (
                          <li className="text-xs text-gray-400 pl-6">
                            +{pts.length - 4} poin lainnya…
                          </li>
                        )}
                      </ul>
                    )}
                  </div>
                </div>
              );
            })
        )}
      </div>

      {/* ── Modal Tambah / Edit ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeModal}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                {editingId ? "Edit Item" : "Tambah Item"}
              </h2>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="overflow-y-auto px-6 py-5 space-y-5"
            >
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              {/* Tipe Card */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">
                  Tipe Card <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(["Visi", "Misi"] as const).map((type) => {
                    const alreadyExists =
                      !editingId && existingTypes.includes(type);
                    const isSelected = cardType === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() =>
                          !alreadyExists && !editingId && setCardType(type)
                        }
                        disabled={alreadyExists || !!editingId}
                        className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all
                          ${
                            alreadyExists || editingId
                              ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed"
                              : isSelected
                                ? type === "Misi"
                                  ? "border-[#F97316] bg-[#F97316]/10 text-[#F97316]"
                                  : "border-[#0092DD] bg-[#0092DD]/10 text-[#0092DD]"
                                : "border-gray-200 text-gray-400 hover:border-gray-300"
                          }`}
                      >
                        {type === "Misi" ? (
                          <List className="w-4 h-4" />
                        ) : (
                          <Target className="w-4 h-4" />
                        )}
                        {type}
                        {alreadyExists && (
                          <span className="text-[10px] ml-1">(sudah ada)</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Toggle format konten */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">
                  Format Konten <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-1 w-fit">
                  <button
                    type="button"
                    onClick={() => setContentMode("deskripsi")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${contentMode === "deskripsi" ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
                  >
                    <Type className="w-3.5 h-3.5" /> Deskripsi
                  </button>
                  <button
                    type="button"
                    onClick={() => setContentMode("poin")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${contentMode === "poin" ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
                  >
                    <List className="w-3.5 h-3.5" /> Poin-poin
                  </button>
                </div>
              </div>

              {/* Konten */}
              {contentMode === "deskripsi" ? (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Deskripsi <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={descText}
                    onChange={(e) => setDescText(e.target.value)}
                    rows={5}
                    placeholder="Tulis deskripsi visi/misi di sini..."
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0092DD]/30 focus:border-[#0092DD] transition resize-none"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-gray-600">
                      Poin-poin <span className="text-red-500">*</span>{" "}
                      <span className="text-gray-400 font-normal">
                        ({points.length} item)
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setPoints((p) => [...p, ""])}
                      className="inline-flex items-center gap-1 text-xs text-[#0092DD] font-semibold hover:underline"
                    >
                      <Plus className="w-3.5 h-3.5" /> Tambah poin
                    </button>
                  </div>
                  <div className="space-y-2">
                    {points.map((pt, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-400 text-[10px] font-bold flex items-center justify-center shrink-0">
                          {i + 1}
                        </span>
                        <input
                          type="text"
                          value={pt}
                          onChange={(e) =>
                            setPoints((p) =>
                              p.map((v, idx) =>
                                idx === i ? e.target.value : v,
                              ),
                            )
                          }
                          placeholder={`Poin ${i + 1}...`}
                          className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0092DD]/30 focus:border-[#0092DD] transition"
                        />
                        {points.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              setPoints((p) => p.filter((_, idx) => idx !== i))
                            }
                            className="p-1.5 text-gray-300 hover:text-red-400 transition-colors rounded-lg hover:bg-red-50"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Gambar — WAJIB */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">
                  Gambar <span className="text-red-500">*</span>
                  <span className="text-gray-400 font-normal ml-1">
                    (dikompresi ke WebP otomatis)
                  </span>
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageSelect}
                />

                {imagePreview && !imgError ? (
                  <div className="relative rounded-xl overflow-hidden bg-gray-100 h-36 group">
                    <Image
                      src={imagePreview}
                      alt="preview"
                      fill
                      unoptimized
                      className="object-cover"
                      onError={() => setImgError(true)}
                    />
                    {imgError && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 gap-1">
                        <ImageIcon className="w-7 h-7 text-gray-300" />
                        <span className="text-[10px] text-gray-400 font-medium">
                          No Image
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-white text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-lg shadow hover:bg-gray-50 transition"
                      >
                        Ganti
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                          setExistingImageUrl(null);
                          setImgError(false);
                        }}
                        className="bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow hover:bg-red-600 transition"
                      >
                        Hapus
                      </button>
                    </div>
                    {imageFile && (
                      <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full">
                        Akan dikompresi ke WebP
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-gray-200 rounded-xl py-7 flex flex-col items-center gap-2 text-gray-400 hover:border-[#0092DD] hover:text-[#0092DD] transition-colors group"
                  >
                    <Upload className="w-7 h-7 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-medium">
                      Klik untuk pilih gambar
                    </span>
                    <span className="text-[10px] text-gray-300">
                      JPG, PNG, WEBP — dikonversi ke WebP
                    </span>
                  </button>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1 pb-1">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 border border-gray-200 text-gray-600 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#0092DD] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#0077BB] disabled:opacity-60 transition-colors"
                >
                  {saving || uploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {uploading
                    ? "Mengompresi..."
                    : saving
                      ? "Menyimpan..."
                      : editingId
                        ? "Simpan Perubahan"
                        : "Tambah"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal Konfirmasi Hapus ── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-60 overflow-hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => !deleting && setDeleteTarget(null)}
          />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5">
              <div className="flex justify-center">
                <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center">
                  <AlertTriangle className="w-7 h-7 text-red-600" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-bold text-gray-900">Hapus Item</h3>
                <p className="text-sm text-gray-500">
                  Yakin ingin menghapus item{" "}
                  <span className="font-semibold text-gray-700">
                    &lsquo;{deleteTarget.title}&rsquo;
                  </span>
                  ?
                </p>
                <p className="text-xs text-gray-400">
                  Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  disabled={deleting}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={deleting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-all disabled:opacity-50"
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
      )}
    </div>
  );
}

//
// Tab 3: Header Halaman
//
function PageHeaderTab() {
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [deletingKey, setDeletingKey] = useState<string | null>(null);
  const [forms, setForms] = useState<
    Record<string, { title: string; subtitle: string }>
  >({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [availableKey, setAvailableKey] = useState<string>("");
  const [newTitle, setNewTitle] = useState("");
  const [newSubtitle, setNewSubtitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoSaving, setVideoSaving] = useState(false);

  const normalizeYoutubeUrl = (url: string): string => {
    if (!url) return url;
    try {
      const trimmed = url.trim();
      const short = trimmed.match(/^https?:\/\/youtu\.be\/([^?&]+)/i);
      if (short) return `https://www.youtube.com/embed/${short[1]}`;
      const watch = trimmed.match(/[?&]v=([^&]+)/i);
      if (watch) return `https://www.youtube.com/embed/${watch[1]}`;
      if (/\/embed\//i.test(trimmed)) return trimmed;
      return trimmed;
    } catch {
      return url;
    }
  };

  const fetchHeaders = useCallback(() => {
    setLoading(true);
    Promise.all([
      fetch("/api/page-headers").then((r) => r.json()),
      fetch("/api/settings").then((r) => r.json()),
    ])
      .then(([headersRes, settingsRes]) => {
        const data: PageHeaderItem[] = headersRes.success
          ? (headersRes.data ?? [])
          : [];
        const init: Record<string, { title: string; subtitle: string }> = {};
        data.forEach((d) => {
          init[d.pageKey] = { title: d.title, subtitle: d.subtitle ?? "" };
        });
        setForms(init);

        const usedKeys = data.map((d) => d.pageKey);
        const firstAvailable =
          ALL_PAGE_KEYS.find((k) => !usedKeys.includes(k)) ?? "";
        setAvailableKey(firstAvailable);

        if (settingsRes.success) {
          const settings = (settingsRes.data ?? []) as {
            settingKey: string;
            settingValue?: string | null;
          }[];
          const videoSetting = settings.find(
            (s) => s.settingKey === "about_video_url",
          );
          if (videoSetting?.settingValue)
            setVideoUrl(videoSetting.settingValue);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchHeaders();
  }, [fetchHeaders]);

  const handleSave = async (pageKey: string) => {
    const f = forms[pageKey];
    if (!f?.title.trim()) return;
    setSavingKey(pageKey);
    try {
      const res = await fetch("/api/page-headers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageKey, title: f.title, subtitle: f.subtitle }),
      });
      const j = await res.json();
      if (j.success) {
        setSaved((s) => ({ ...s, [pageKey]: true }));
        setTimeout(() => setSaved((s) => ({ ...s, [pageKey]: false })), 2000);
      }
    } finally {
      setSavingKey(null);
    }
  };

  const handleDelete = async (pageKey: string) => {
    if (!confirm("Hapus header untuk halaman ini?")) return;
    setDeletingKey(pageKey);
    try {
      await fetch(`/api/page-headers?key=${encodeURIComponent(pageKey)}`, {
        method: "DELETE",
      });
      setForms((prev) => {
        const copy = { ...prev };
        delete copy[pageKey];
        return copy;
      });
      const used = Object.keys(forms).filter((k) => k !== pageKey);
      const firstAvailable = ALL_PAGE_KEYS.find((k) => !used.includes(k)) ?? "";
      setAvailableKey(firstAvailable);
    } finally {
      setDeletingKey(null);
    }
  };

  const handleCreate = async () => {
    if (!availableKey || !newTitle.trim()) return;
    setSavingKey("create");
    try {
      const res = await fetch("/api/page-headers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageKey: availableKey,
          title: newTitle,
          subtitle: newSubtitle,
        }),
      });
      const j = await res.json();
      if (j.success) {
        setForms((prev) => ({
          ...prev,
          [availableKey]: { title: newTitle, subtitle: newSubtitle },
        }));
        setNewTitle("");
        setNewSubtitle("");
        const used = [...Object.keys(forms), availableKey];
        const next = ALL_PAGE_KEYS.find((k) => !used.includes(k)) ?? "";
        setAvailableKey(next);
        setSaved((s) => ({ ...s, [availableKey]: true }));
        setTimeout(
          () => setSaved((s) => ({ ...s, [availableKey]: false })),
          2000,
        );
      }
    } finally {
      setSavingKey(null);
    }
  };

  const handleSaveVideo = async () => {
    setVideoSaving(true);
    try {
      const normalized = normalizeYoutubeUrl(videoUrl);
      setVideoUrl(normalized);
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settingKey: "about_video_url",
          settingValue: normalized,
          settingType: "url",
        }),
      });
    } finally {
      setVideoSaving(false);
    }
  };

  const usedKeys = Object.keys(forms);
  const availableKeys = ALL_PAGE_KEYS.filter((k) => !usedKeys.includes(k));

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-5 border border-gray-100 animate-pulse space-y-3"
          >
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-9 bg-gray-100 rounded-xl" />
            <div className="h-20 bg-gray-100 rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">
        Atur judul dan subjudul yang tampil di banner atas setiap halaman
        website.
      </p>

      {/* Add new header */}
      <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-sm font-bold text-gray-900">
            Tambah Header Halaman (Ini fitur sementara, untuk developer saja)
          </h3>
        </div>
        {availableKeys.length === 0 ? (
          <p className="text-sm text-gray-500">
            Semua halaman sudah memiliki header.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                Halaman
              </label>
              <select
                value={availableKey}
                onChange={(e) => setAvailableKey(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0092DD]/30 focus:border-[#0092DD] transition"
              >
                {availableKeys.map((k) => (
                  <option key={k} value={k}>
                    {PAGE_KEY_LABELS[k] ?? k}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                Judul <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0092DD]/30 focus:border-[#0092DD] transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                Subjudul
              </label>
              <textarea
                value={newSubtitle}
                onChange={(e) => setNewSubtitle(e.target.value)}
                rows={2}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0092DD]/30 focus:border-[#0092DD] transition resize-none"
              />
            </div>
          </div>
        )}
        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={handleCreate}
            disabled={
              !availableKey || !newTitle.trim() || savingKey === "create"
            }
            className="inline-flex items-center gap-2 bg-[#0092DD] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#0077BB] transition-colors disabled:opacity-50"
          >
            {savingKey === "create" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}{" "}
            Simpan Header
          </button>
        </div>
      </div>

      {/* Video Profil URL */}
      <div className="bg-white rounded-2xl px-6 py-5 border border-gray-100 hover:shadow-sm transition-shadow">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-sm font-bold text-gray-900">
            URL Video Profil (halaman Profil Sekolah)
          </h3>
          <span className="ml-auto text-[10px] font-mono text-gray-300 bg-gray-50 px-2 py-0.5 rounded-md">
            about_video_url
          </span>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">
              Link video YouTube
            </label>
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=... atau youtu.be/..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0092DD]/30 focus:border-[#0092DD] transition"
            />
            <p className="text-[11px] text-gray-400 mt-1">Otomatis dikonversi ke URL embed saat disimpan.</p>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-gray-500">Tampilkan di section &quot;Video Profil&quot; landing Profil Sekolah.</span>
            <button
              type="button"
              onClick={handleSaveVideo}
              disabled={videoSaving}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 bg-[#0092DD] text-white hover:bg-[#0077BB]"
            >
              {videoSaving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              {videoSaving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </div>
      </div>

      {/* Existing headers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {usedKeys.map((key) => {
          const f = forms[key];
          const isSaving = savingKey === key;
          const isSaved = saved[key];
          return (
            <div
              key={key}
              className="bg-white rounded-2xl px-6 py-5 border border-gray-100 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-sm font-bold text-gray-900">
                  {PAGE_KEY_LABELS[key] ?? key}
                </h3>
                <span className="ml-auto text-[10px] font-mono text-gray-300 bg-gray-50 px-2 py-0.5 rounded-md">
                  {key}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                    Judul <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={f?.title ?? ""}
                    onChange={(e) =>
                      setForms((prev) => ({
                        ...prev,
                        [key]: { ...f, title: e.target.value },
                      }))
                    }
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0092DD]/30 focus:border-[#0092DD] transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                    Subjudul
                  </label>
                  <textarea
                    value={f?.subtitle ?? ""}
                    onChange={(e) =>
                      setForms((prev) => ({
                        ...prev,
                        [key]: { ...f, subtitle: e.target.value },
                      }))
                    }
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0092DD]/30 focus:border-[#0092DD] transition resize-none"
                  />
                </div>
                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => handleDelete(key)}
                    disabled={deletingKey === key}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    {deletingKey === key ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}{" "}
                    Hapus
                  </button>
                  <button
                    onClick={() => handleSave(key)}
                    disabled={isSaving || !f?.title?.trim()}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 ${
                      isSaved
                        ? "bg-green-500 text-white"
                        : "bg-[#0092DD] text-white hover:bg-[#0077BB]"
                    }`}
                  >
                    {isSaving ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Save className="w-3.5 h-3.5" />
                    )}
                    {isSaved
                      ? "Tersimpan ✓"
                      : isSaving
                        ? "Menyimpan..."
                        : "Simpan"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Tab 4: Keunggulan Sekolah
// ─────────────────────────────────────────────────────────────

const _keunggulanRef = { openCreate: null as (() => void) | null };

function KeunggulanAddButton() {
  return (
    <button
      onClick={() => _keunggulanRef.openCreate?.()}
      className="inline-flex items-center gap-2 bg-[#0092DD] text-white px-4 py-2.5 rounded-full text-sm font-semibold hover:bg-[#0077BB] transition-colors shadow-sm"
    >
      <Plus className="w-4 h-4" /> Tambah Keunggulan
    </button>
  );
}

function KeunggulanTab() {
  const [items, setItems] = useState<KeunggulanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<KeunggulanItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formIcon, setFormIcon] = useState("Award");
  const [iconSearch, setIconSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetch_ = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/school-profile?section=keunggulan");
      const j = await r.json();
      if (j.success) {
        const filtered = (j.data ?? []).filter(
          (d: KeunggulanItem) => d.section === "keunggulan",
        );
        setItems(
          filtered.sort(
            (a: KeunggulanItem, b: KeunggulanItem) =>
              a.orderPosition - b.orderPosition,
          ),
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch_();
  }, [fetch_]);

  useEffect(() => {
    _keunggulanRef.openCreate = openCreate;
    return () => {
      _keunggulanRef.openCreate = null;
    };
  });

  // Close menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setOpenMenuId(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const nextOrder = () =>
    items.length === 0 ? 1 : Math.max(...items.map((i) => i.orderPosition)) + 1;

  function openCreate() {
    setEditingId(null);
    setFormTitle("");
    setFormDesc("");
    setFormIcon("Award");
    setIconSearch("");
    setError("");
    setShowModal(true);
  }

  function openEdit(item: KeunggulanItem) {
    setEditingId(item.id);
    setFormTitle(item.title ?? "");
    setFormDesc(item.content ?? "");
    setFormIcon(item.image ?? "Award");
    setIconSearch("");
    setError("");
    setOpenMenuId(null);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingId(null);
    setIconSearch("");
    setError("");
  }

  async function handleSave() {
    if (!formTitle.trim()) {
      setError("Judul tidak boleh kosong");
      return;
    }
    if (!formDesc.trim()) {
      setError("Deskripsi tidak boleh kosong");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const url = editingId
        ? `/api/school-profile/${editingId}`
        : "/api/school-profile";
      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "keunggulan",
          title: formTitle.trim(),
          content: formDesc.trim(),
          image: formIcon,
          orderPosition: editingId
            ? (items.find((i) => i.id === editingId)?.orderPosition ??
              nextOrder())
            : nextOrder(),
        }),
      });
      const j = await res.json();
      if (!j.success) {
        setError(j.message || "Gagal menyimpan");
        return;
      }
      closeModal();
      fetch_();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await fetch(`/api/school-profile/${deleteTarget.id}`, {
        method: "DELETE",
      });
      setDeleteTarget(null);
      fetch_();
    } finally {
      setDeleting(false);
    }
  }

  const IconComp = ({
    name,
    className,
  }: {
    name: string;
    className?: string;
  }) => {
    const Ic = KEUNGGULAN_ICONS[name] ?? Award;
    return <Ic className={className} />;
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Kelola daftar keunggulan sekolah yang ditampilkan di halaman Profil
        Sekolah.
      </p>

      {/* Grid cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse space-y-3"
            >
              <div className="w-10 h-10 bg-gray-100 rounded-xl" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
              <div className="h-3 bg-gray-100 rounded w-full" />
              <div className="h-3 bg-gray-100 rounded w-4/5" />
            </div>
          ))
        ) : items.length === 0 ? (
          <div className="col-span-3 py-16 text-center bg-white rounded-2xl border border-gray-100">
            <Trophy className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">
              Belum ada keunggulan. Klik &ldquo;Tambah Keunggulan&rdquo; untuk
              mulai.
            </p>
          </div>
        ) : (
          items.map((item) => {
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-shadow p-5 relative group"
              >
                {/* 3-dot menu */}
                <div
                  className="absolute top-3 right-3"
                  ref={openMenuId === item.id ? menuRef : null}
                >
                  <button
                    onClick={() =>
                      setOpenMenuId(openMenuId === item.id ? null : item.id)
                    }
                    className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 transition-colors"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  {openMenuId === item.id && (
                    <div className="absolute right-0 top-9 bg-white rounded-xl shadow-lg border border-gray-100 py-1 w-36 z-20">
                      <button
                        onClick={() => openEdit(item)}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-gray-400" /> Edit
                      </button>
                      <button
                        onClick={() => {
                          setDeleteTarget(item);
                          setOpenMenuId(null);
                        }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Hapus
                      </button>
                    </div>
                  )}
                </div>

                {/* Icon */}
                <div className="w-11 h-11 bg-[#77C5F0]/25 rounded-xl flex items-center justify-center mb-4">
                  <IconComp
                    name={item.image ?? "Award"}
                    className="w-5 h-5 text-[#0092DD]"
                  />
                </div>

                {/* Urutan badge */}
                <span className="absolute top-3 left-4 text-[10px] font-bold text-gray-300">
                  #{item.orderPosition}
                </span>

                <h3 className="text-sm font-bold text-gray-900 mb-1.5 pr-8">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                  {item.content}
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* ── Modal Tambah/Edit ── */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  {editingId ? "Edit Keunggulan" : "Tambah Keunggulan"}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Lengkapi judul, deskripsi, dan pilih ikon yang paling sesuai
                  untuk menampilkan keunggulan sekolah.
                </p>
              </div>
              <button
                onClick={closeModal}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl px-3 py-2.5">
                  {error}
                </div>
              )}

              {/* Judul */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Judul <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="cth: Akreditasi A, Fasilitas Modern..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0092DD]/30 focus:border-[#0092DD] transition"
                />
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Deskripsi <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  rows={4}
                  placeholder="Jelaskan keunggulan ini secara singkat..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0092DD]/30 focus:border-[#0092DD] transition resize-none"
                />
              </div>

              {/* Pilih Ikon */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">
                  Ikon <span className="text-red-500">*</span>
                </label>

                {/* Search box */}
                <div className="relative mb-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    value={iconSearch}
                    onChange={(e) => setIconSearch(e.target.value)}
                    placeholder="Cari ikon... (cth: star, award, heart)"
                    className="w-full border border-gray-200 rounded-xl pl-8 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#0092DD]/30 focus:border-[#0092DD] transition"
                  />
                  {iconSearch && (
                    <button
                      type="button"
                      onClick={() => setIconSearch("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Icon grid — filtered */}
                {(() => {
                  const filtered = KEUNGGULAN_ICON_KEYS.filter((k) =>
                    k.toLowerCase().includes(iconSearch.toLowerCase()),
                  );
                  return filtered.length === 0 ? (
                    <div className="py-6 text-center text-xs text-gray-400">
                      Tidak ada ikon &ldquo;{iconSearch}&rdquo;. Coba kata lain.
                    </div>
                  ) : (
                    <div className="grid grid-cols-8 gap-1.5 max-h-48 overflow-y-auto pr-0.5">
                      {filtered.map((key) => {
                        const Ic = KEUNGGULAN_ICONS[key];
                        const selected = formIcon === key;
                        return (
                          <button
                            key={key}
                            type="button"
                            title={key}
                            onClick={() => setFormIcon(key)}
                            className={`w-full aspect-square flex items-center justify-center rounded-xl border-2 transition-all ${
                              selected
                                ? "border-[#0092DD] bg-[#0092DD]/10 text-[#0092DD]"
                                : "border-gray-100 text-gray-400 hover:border-gray-300 hover:text-gray-600"
                            }`}
                          >
                            <Ic className="w-4 h-4" />
                          </button>
                        );
                      })}
                    </div>
                  );
                })()}

                {/* Selected preview */}
                <div className="flex items-center gap-2 mt-2 px-3 py-2 bg-gray-50 rounded-xl">
                  {(() => {
                    const Ic = KEUNGGULAN_ICONS[formIcon] ?? Award;
                    return <Ic className="w-4 h-4 text-[#0092DD] shrink-0" />;
                  })()}
                  <span className="text-[11px] text-gray-500">
                    Terpilih:{" "}
                    <span className="font-semibold text-gray-700">
                      {formIcon}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100">
              <button
                onClick={closeModal}
                disabled={saving}
                className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-all"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0092DD] text-white text-sm font-semibold hover:bg-[#0077BB] disabled:opacity-50 transition-all"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {saving
                  ? "Menyimpan..."
                  : editingId
                    ? "Simpan Perubahan"
                    : "Tambah"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Hapus ── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm z-10 p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">
              Hapus Keunggulan?
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              <span className="font-semibold text-gray-700">
                &ldquo;{deleteTarget.title}&rdquo;
              </span>{" "}
              akan dihapus permanen.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-all inline-flex items-center justify-center gap-2"
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
      )}
    </div>
  );
}
