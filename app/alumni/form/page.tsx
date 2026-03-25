"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { CheckCircle2, Loader2, ArrowLeft, UploadCloud } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

type FormState = {
  alumniName: string;
  graduationYear: string;
  major: string;
  currentOccupation: string;
  company: string;
  story: string;
  photo: string;
  nisn: string;
  diplomaPhoto: string;
};

const initialState: FormState = {
  alumniName: "",
  graduationYear: "",
  major: "",
  currentOccupation: "",
  company: "",
  story: "",
  photo: "",
  nisn: "",
  diplomaPhoto: "",
};

export default function AlumniFormPage() {
  const router = useRouter();
  const { status } = useSession();
  const [form, setForm] = useState<FormState>(initialState);
  const [fileNames, setFileNames] = useState<{ photo: string; diplomaPhoto: string }>({ photo: "", diplomaPhoto: "" });
  const [uploading, setUploading] = useState<{ photo: boolean; diplomaPhoto: boolean }>({ photo: false, diplomaPhoto: false });
  const [submitting, setSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [checkingSubmission, setCheckingSubmission] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: "success" | "error" }>({
    visible: false,
    message: "",
    type: "success",
  });
  const toastTimer = useRef<NodeJS.Timeout | null>(null);

  const handleChange =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const handleFileChange = (key: "photo" | "diplomaPhoto") =>
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploading((u) => ({ ...u, [key]: true }));

      const reader = new FileReader();
      reader.onloadend = async () => {
        const dataUrl = typeof reader.result === "string" ? reader.result : "";
        try {
          const res = await fetch("/api/uploads/alumni", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ file: dataUrl, fileName: file.name }),
          });
          const json = await res.json();
          if (json.success && json.data?.url) {
            setForm((prev) => ({ ...prev, [key]: json.data.url }));
            setFileNames((prev) => ({ ...prev, [key]: file.name }));
          } else {
            setError(json.message || "Gagal mengunggah file.");
          }
        } catch (err) {
          console.error(err);
          setError("Gagal mengunggah file.");
        } finally {
          setUploading((u) => ({ ...u, [key]: false }));
        }
      };
      reader.readAsDataURL(file);
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setToast((t) => ({ ...t, visible: false }));

    if (status !== "authenticated") {
      setError("Silakan login terlebih dahulu untuk mengirim testimoni.");
      setSubmitting(false);
      return;
    }

    if (hasSubmitted) {
      setError("Anda sudah mengirim testimoni. Terima kasih!");
      setSubmitting(false);
      return;
    }

    if (uploading.photo || uploading.diplomaPhoto) {
      setError("Tunggu hingga proses unggah selesai.");
      setSubmitting(false);
      return;
    }

    const requiredChecks: Array<[string, string]> = [
      [form.alumniName.trim(), "Nama alumni wajib diisi."],
      [form.graduationYear.trim(), "Tahun lulus wajib diisi."],
      [form.major.trim(), "Program keahlian wajib diisi."],
      [form.currentOccupation.trim(), "Pekerjaan wajib diisi."],
      [form.company.trim(), "Perusahaan wajib diisi."],
      [form.nisn.trim(), "NISN wajib diisi."],
      [form.photo.trim(), "Foto profil wajib diunggah."],
      [form.diplomaPhoto.trim(), "Foto ijazah wajib diunggah."],
      [form.story.trim(), "Cerita / testimoni wajib diisi."],
    ];

    const missing = requiredChecks.find(([value]) => !value);
    if (missing) {
      setError(missing[1]);
      setSubmitting(false);
      return;
    }

    const payload = {
      ...form,
      graduationYear: form.graduationYear
        ? parseInt(form.graduationYear, 10)
        : undefined,
      status: "pending" as const,
    };

    try {
      const res = await fetch("/api/alumni-submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (res.status === 401) {
        setError("Sesi Anda berakhir. Silakan login kembali.");
      } else if (res.status === 409) {
        setHasSubmitted(true);
        setError("Anda sudah mengirim testimoni. Terima kasih!");
      } else if (json.success) {
        triggerToast(
          "success",
          "Data berhasil dikirim. Tim akan memverifikasi sebelum ditampilkan.",
        );
        setHasSubmitted(true);
        setForm(initialState);
        setFileNames({ photo: "", diplomaPhoto: "" });
      } else {
        setError(json.message || "Gagal mengirim data. Coba lagi nanti.");
      }
    } catch {
      setError("Terjadi kesalahan. Coba lagi nanti.");
    } finally {
      setSubmitting(false);
    }
  };

  const triggerToast = (type: "success" | "error", message: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ visible: true, message, type });
    toastTimer.current = setTimeout(() => {
      setToast((t) => ({ ...t, visible: false }));
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const fetchSubmissionStatus = useCallback(async () => {
    try {
      setCheckingSubmission(true);
      setError(null);
      const res = await fetch("/api/alumni-submissions");
      if (res.status === 401) {
        setHasSubmitted(false);
        setError("Silakan login untuk mengisi testimoni.");
        return;
      }
      const json = await res.json();
      if (json.success && json.data?.hasSubmitted) {
        setHasSubmitted(true);
      } else {
        setHasSubmitted(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCheckingSubmission(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      fetchSubmissionStatus();
    } else if (status === "unauthenticated") {
      setCheckingSubmission(false);
    }
  }, [status, fetchSubmissionStatus]);

  const showLoading = status === "loading" || checkingSubmission;
  const showLoginPrompt = status === "unauthenticated";
  const showAlreadySubmitted = status === "authenticated" && hasSubmitted;

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {toast.visible && (
        <div className="fixed top-4 right-4 z-50 transition-all duration-300">
          <div
            className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium border ${
              toast.type === "success"
                ? "bg-green-50 text-green-800 border-green-200"
                : "bg-red-50 text-red-800 border-red-200"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            {toast.message}
          </div>
        </div>
      )}
      {/* Hero */}
      <div className="bg-linear-to-r from-[#0268ab] to-[#0e3057] text-white py-16 px-4">
        <div className="max-w-5xl mx-auto flex flex-col gap-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </button>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">
            Form Verifikasi Data Alumni
          </h1>
          <p className="text-white/80 max-w-3xl">
            Lengkapi data berikut untuk memverifikasi identitas sebelum cerita
            atau testimoni Anda ditampilkan pada halaman Alumni.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-8 px-4">
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          {showLoading && (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
              <Loader2 className="w-6 h-6 animate-spin text-[#0268ab]" />
              <p className="text-sm text-gray-500">Memuat status formulir...</p>
            </div>
          )}

          {showLoginPrompt && !showLoading && (
            <div className="flex flex-col items-center text-center gap-4 py-8">
              <p className="text-sm text-gray-600 max-w-md">
                Anda perlu login untuk mengisi testimoni alumni. Silakan login terlebih dahulu lalu kembali ke halaman ini.
              </p>
              <button
                type="button"
                onClick={() => signIn(undefined, { callbackUrl: "/alumni/form" })}
                className="inline-flex items-center gap-2 rounded-lg bg-[#0268ab] px-5 py-2.5 text-white text-sm font-semibold shadow hover:bg-[#025a92] transition"
              >
                Login untuk melanjutkan
              </button>
            </div>
          )}

          {showAlreadySubmitted && !showLoading && (
            <div className="flex flex-col items-center text-center gap-3 py-8">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
              <p className="text-sm text-gray-700 font-semibold">Anda sudah mengirim testimoni.</p>
              <p className="text-sm text-gray-500 max-w-md">
                Terima kasih atas partisipasi Anda. Satu akun hanya dapat mengirimkan satu testimoni.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="rounded-sm bg-[#0268ab] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-[#025a92]"
                >
                  Kembali ke Halaman Alumni
                </button>
              </div>
            </div>
          )}

          {!showLoading && !showLoginPrompt && !showAlreadySubmitted && (
            <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800">
                  Nama Alumni <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.alumniName}
                  onChange={handleChange("alumniName")}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-[#0268ab] focus:ring-2 focus:ring-[#0268ab]/20"
                  placeholder="Contoh: Budi Santoso"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800">
                  Tahun Lulus <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1950"
                  max="2100"
                  required
                  value={form.graduationYear}
                  onChange={handleChange("graduationYear")}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-[#0268ab] focus:ring-2 focus:ring-[#0268ab]/20"
                  placeholder="mis. 2020"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800">
                  Program Keahlian / Jurusan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.major}
                  onChange={handleChange("major")}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-[#0268ab] focus:ring-2 focus:ring-[#0268ab]/20"
                  placeholder="mis. Rekayasa Perangkat Lunak"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800">
                  Pekerjaan Saat Ini <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.currentOccupation}
                  onChange={handleChange("currentOccupation")}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-[#0268ab] focus:ring-2 focus:ring-[#0268ab]/20"
                  placeholder="mis. Software Engineer"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800">
                  Perusahaan / Institusi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.company}
                  onChange={handleChange("company")}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-[#0268ab] focus:ring-2 focus:ring-[#0268ab]/20"
                  placeholder="mis. PT Maju Sejahtera"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800">
                  NISN <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.nisn}
                  onChange={handleChange("nisn")}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-[#0268ab] focus:ring-2 focus:ring-[#0268ab]/20"
                  placeholder="Masukkan NISN"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800">
                  Foto Profil <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={handleFileChange("photo")}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-[#0268ab] focus:ring-2 focus:ring-[#0268ab]/20 pr-10 file:mr-3 file:rounded-md file:border-0 file:bg-[#0268ab] file:text-white file:px-3 file:py-2 file:text-sm file:cursor-pointer"
                  />
                  <UploadCloud className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                {uploading.photo && (
                  <p className="text-xs text-blue-600">Mengunggah foto...</p>
                )}
                {fileNames.photo && !uploading.photo && (
                  <p className="text-xs text-gray-500">File terpilih: {fileNames.photo}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800">
                  Foto Ijazah <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={handleFileChange("diplomaPhoto")}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-[#0268ab] focus:ring-2 focus:ring-[#0268ab]/20 pr-10 file:mr-3 file:rounded-md file:border-0 file:bg-[#0268ab] file:text-white file:px-3 file:py-2 file:text-sm file:cursor-pointer"
                  />
                  <UploadCloud className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                {uploading.diplomaPhoto && (
                  <p className="text-xs text-blue-600">Mengunggah foto ijazah...</p>
                )}
                {fileNames.diplomaPhoto && !uploading.diplomaPhoto && (
                  <p className="text-xs text-gray-500">File terpilih: {fileNames.diplomaPhoto}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-800">
                Cerita / Testimoni <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={5}
                required
                value={form.story}
                onChange={handleChange("story")}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-[#0268ab] focus:ring-2 focus:ring-[#0268ab]/20"
                placeholder="Bagikan perjalanan, pengalaman, atau kesan Anda sebagai alumni."
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-xs text-gray-500">
                Kiriman Anda akan ditinjau oleh admin sebelum ditampilkan.
              </p>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0268ab] px-6 py-3 text-white text-sm font-semibold shadow-md hover:bg-[#025a92] transition disabled:opacity-70"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {submitting ? "Mengirim..." : "Kirim Data"}
              </button>
            </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
