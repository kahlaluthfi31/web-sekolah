"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  Mail,
  Phone,
  MessageCircle,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Trash2,
  AlertTriangle,
} from "lucide-react";

interface Setting {
  settingKey: string;
  settingValue: string | null;
  settingType: "text" | "image" | "url" | "boolean";
}

type ToastState = {
  visible: boolean;
  type: "success" | "error";
  message: string;
};

const urlKeys = [
  "social_instagram",
  "social_facebook",
  "social_youtube",
  "social_tiktok",
  "social_linkedin",
];
const booleanKeys = [
  "contact_show_address",
  "contact_show_phone",
  "contact_show_whatsapp",
  "contact_show_email",
  "contact_show_social",
  "contact_show_hours",
];
const textKeys = [
  "contact_address",
  "contact_hours_weekday",
  "contact_hours_friday",
  "contact_hours_saturday",
  "contact_hours_sunday",
  "contact_info_title",
  "contact_info_subtitle",
];

const contactFields = {
  kontak: [
    {
      key: "contact_email_main",
      label: "Email Utama",
      icon: <Mail className="w-4 h-4" />,
    },
    {
      key: "contact_email_alt",
      label: "Email Alternatif",
      icon: <Mail className="w-4 h-4" />,
    },
    {
      key: "contact_phone_main",
      label: "Telepon Utama",
      icon: <Phone className="w-4 h-4" />,
    },
    {
      key: "contact_phone_alt",
      label: "Telepon Alternatif",
      icon: <Phone className="w-4 h-4" />,
    },
    {
      key: "contact_whatsapp_main",
      label: "WhatsApp Utama",
      icon: <MessageCircle className="w-4 h-4" />,
    },
    {
      key: "contact_whatsapp_alt",
      label: "WhatsApp Alternatif",
      icon: <MessageCircle className="w-4 h-4" />,
    },
  ],
  jam: [
    { key: "contact_hours_weekday", label: "Senin - Kamis" },
    { key: "contact_hours_friday", label: "Jumat" },
    { key: "contact_hours_saturday", label: "Sabtu" },
    { key: "contact_hours_sunday", label: "Minggu & Libur Nasional" },
  ],
  sosial: [
    { key: "social_instagram", label: "Instagram" },
    { key: "social_facebook", label: "Facebook" },
    { key: "social_youtube", label: "YouTube" },
    { key: "social_tiktok", label: "TikTok" },
    { key: "social_linkedin", label: "LinkedIn" },
  ],
};

const humanizeSocialLabel = (key: string) => {
  const name = key
    .replace(/^social_/, "")
    .replace(/_/g, " ")
    .trim();
  if (!name) return "Media Sosial";
  return name
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

const buildSocialFields = (map: Record<string, string>) => {
  const entries = Object.keys(map).filter((k) => k.startsWith("social_"));
  if (entries.length === 0) {
    return contactFields.sosial;
  }
  return entries.map((key) => ({ key, label: humanizeSocialLabel(key) }));
};

const visibilityFields = [
  {
    key: "contact_show_address",
    label: "Tampilkan Alamat",
    description: "Alamat sekolah akan tampil di kartu Informasi Kontak",
  },
  {
    key: "contact_show_phone",
    label: "Tampilkan Telepon",
    description: "Nomor telepon utama & alternatif tampil di website",
  },
  {
    key: "contact_show_whatsapp",
    label: "Tampilkan WhatsApp",
    description: "Nomor WhatsApp utama & alternatif tampil di website",
  },
  {
    key: "contact_show_email",
    label: "Tampilkan Email",
    description: "Email utama & alternatif tampil di website",
  },
  {
    key: "contact_show_social",
    label: "Tampilkan Media Sosial",
    description: "Link media sosial ditampilkan jika tersedia",
  },
  {
    key: "contact_show_hours",
    label: "Tampilkan Jam Pelayanan",
    description: "Jam operasional harian tampil di website",
  },
];

export default function ContactInfoPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [socialFields, setSocialFields] = useState<
    { key: string; label: string }[]
  >([]);
  const [newSocialName, setNewSocialName] = useState("");
  const [newSocialUrl, setNewSocialUrl] = useState("");
  const [removedSocialKeys, setRemovedSocialKeys] = useState<string[]>([]);
  const [confirmDeleteKey, setConfirmDeleteKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    type: "success",
    message: "",
  });
  const toastTimer = useRef<NodeJS.Timeout | null>(null);

  const triggerToast = (type: "success" | "error", message: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ visible: true, type, message });
    toastTimer.current = setTimeout(
      () => setToast((t) => ({ ...t, visible: false })),
      2500,
    );
  };

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/settings", { cache: "no-store" });
      const json = await res.json();
      if (json.success) {
        const map = (json.data as Setting[]).reduce<Record<string, string>>(
          (acc, cur) => {
            acc[cur.settingKey] = cur.settingValue ?? "";
            return acc;
          },
          {},
        );
        setValues(map);
        setSocialFields(buildSocialFields(map));
        setRemovedSocialKeys([]);
      }
    } catch (err) {
      console.error(err);
      triggerToast("error", "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, [fetchSettings]);

  const slugify = (text: string) => {
    const slug = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
    return slug || "platform";
  };

  const getTypeForKey = (key: string): Setting["settingType"] => {
    if (urlKeys.includes(key)) return "url";
    if (key.startsWith("social_")) return "url";
    if (booleanKeys.includes(key)) return "boolean";
    if (textKeys.includes(key)) return "text";
    return "text";
  };

  const saveKeys = async (
    keys: string[],
    overrideValues?: Record<string, string>,
  ) => {
    if (!keys.length) return;
    const sourceValues = overrideValues ?? values;
    setSavingKey(keys[0]);
    try {
      const allKeys = Array.from(new Set([...keys, ...removedSocialKeys]));
      await Promise.all(
        allKeys.map(async (key) => {
          const res = await fetch("/api/settings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              settingKey: key,
              settingValue: sourceValues[key] ?? "",
              settingType: getTypeForKey(key),
            }),
          });
          const json = await res.json();
          if (!res.ok || !json?.success) {
            throw new Error(json?.message || "Gagal menyimpan");
          }
        }),
      );
      triggerToast("success", "Berhasil disimpan");
      fetchSettings();
    } catch (err) {
      console.error(err);
      triggerToast("error", "Gagal menyimpan. Coba lagi.");
    } finally {
      setSavingKey(null);
    }
  };

  const handleSaveSocials = async () => {
    let nextSocialFields = [...socialFields];
    let nextValues = { ...values };

    const platform = newSocialName.trim();
    const url = newSocialUrl.trim();

    if (platform || url) {
      if (!platform || !url) {
        triggerToast("error", "Nama platform dan URL wajib diisi");
        return;
      }

      const baseKey = `social_${slugify(platform)}`;
      let key = baseKey;
      let i = 2;
      while (nextValues[key] !== undefined) {
        key = `${baseKey}_${i}`;
        i += 1;
      }

      nextSocialFields = [...nextSocialFields, { key, label: platform }];
      nextValues = { ...nextValues, [key]: url };
    }

    setSocialFields(nextSocialFields);
    setValues(nextValues);
    setNewSocialName("");
    setNewSocialUrl("");

    await saveKeys(
      [...nextSocialFields.map((f) => f.key), ...removedSocialKeys],
      nextValues,
    );
  };

  const currentDeleteLabel =
    confirmDeleteKey &&
    socialFields.find((f) => f.key === confirmDeleteKey)?.label;

  const removeSocialField = (key: string) => {
    setSocialFields((fields) => fields.filter((f) => f.key !== key));
    setRemovedSocialKeys((prev) => [...prev, key]);
    setValues((v) => {
      const clone = { ...v };
      clone[key] = "";
      return clone;
    });
  };

  const confirmDelete = () => {
    if (!confirmDeleteKey) return;
    removeSocialField(confirmDeleteKey);
    setConfirmDeleteKey(null);
  };

  return (
    <>
      <div className="p-6">
        {/* Toast */}
        {toast.visible && (
          <div className="fixed top-4 right-4 z-50">
            <div
              className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow text-sm border ${toast.type === "success" ? "bg-green-50 text-green-800 border-green-200" : "bg-red-50 text-red-800 border-red-200"}`}
            >
              {toast.type === "success" ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              {toast.message}
            </div>
          </div>
        )}

        <div className="max-w-5xl mx-auto space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Kontak utama */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
              <div className="flex items-center gap-2 text-gray-900 font-semibold">
                <span>Kontak Utama</span>
              </div>
              <div className="space-y-3">
                {contactFields.kontak.map((field) => (
                  <div key={field.key}>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      {field.label}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={values[field.key] ?? ""}
                        onChange={(e) =>
                          setValues((v) => ({
                            ...v,
                            [field.key]: e.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-gray-200 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0268ab]"
                        placeholder={field.label}
                        disabled={loading}
                      />
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {field.icon}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-right">
                <button
                  onClick={() =>
                    saveKeys(contactFields.kontak.map((f) => f.key))
                  }
                  disabled={loading || savingKey !== null}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#0268ab] text-white text-sm font-semibold rounded-lg hover:bg-[#014a8f] disabled:opacity-60"
                >
                  {savingKey ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Simpan Kontak
                </button>
              </div>
            </div>

            {/* Alamat & Jam */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
              <div className="flex items-center gap-2 text-gray-900 font-semibold">
                <span>Alamat & Jam Layanan</span>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Alamat
                  </label>
                  <textarea
                    rows={3}
                    value={values["contact_address"] ?? ""}
                    onChange={(e) =>
                      setValues((v) => ({
                        ...v,
                        contact_address: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0268ab]"
                    placeholder="Nama Jalan, Kecamatan, Kota, Provinsi"
                    disabled={loading}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {contactFields.jam.map((field) => (
                    <div key={field.key}>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        {field.label}
                      </label>
                      <input
                        type="text"
                        value={values[field.key] ?? ""}
                        onChange={(e) =>
                          setValues((v) => ({
                            ...v,
                            [field.key]: e.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0268ab]"
                        placeholder="07.00 - 15.00"
                        disabled={loading}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <button
                  onClick={() =>
                    saveKeys([
                      "contact_address",
                      ...contactFields.jam.map((f) => f.key),
                    ])
                  }
                  disabled={loading || savingKey !== null}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#0268ab] text-white text-sm font-semibold rounded-lg hover:bg-[#014a8f] disabled:opacity-60"
                >
                  {savingKey ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Simpan Alamat & Jam
                </button>
              </div>
            </div>
          </div>

          {/* Sosial */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between text-gray-900 font-semibold">
              <span>Media Sosial</span>
            </div>

            <div className="space-y-3">
              <div className="hidden md:grid md:grid-cols-[1fr_1.4fr_auto] md:items-center md:gap-3 text-xs font-semibold text-gray-700">
                <span>Platform</span>
                <span>URL</span>
                <span className="text-right">Hapus</span>
              </div>

              {socialFields.map((field) => (
                <div
                  key={field.key}
                  className="grid gap-3 md:grid-cols-[1fr_1.4fr_auto] md:items-center"
                >
                  <div>
                    <label className="block md:hidden text-xs font-semibold text-gray-700 mb-1">
                      Platform
                    </label>
                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) => {
                        const label = e.target.value;
                        setSocialFields((fields) =>
                          fields.map((f) =>
                            f.key === field.key ? { ...f, label } : f,
                          ),
                        );
                      }}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0268ab]"
                      placeholder="Nama platform"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block md:hidden text-xs font-semibold text-gray-700 mb-1">
                      URL
                    </label>
                    <input
                      type="url"
                      value={values[field.key] ?? ""}
                      onChange={(e) =>
                        setValues((v) => ({
                          ...v,
                          [field.key]: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0268ab]"
                      placeholder="https://"
                      disabled={loading}
                    />
                  </div>

                  <div className="flex justify-end items-center">
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteKey(field.key)}
                      className="text-red-500 hover:text-red-600 p-2 disabled:opacity-60"
                      disabled={loading}
                      aria-label={`Hapus ${field.label}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-4 border-t border-gray-100 pt-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Platform
                </label>
                <input
                  type="text"
                  value={newSocialName}
                  onChange={(e) => setNewSocialName(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0268ab]"
                  placeholder="Mis. Twitter / Telegram"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  URL
                </label>
                <input
                  type="url"
                  value={newSocialUrl}
                  onChange={(e) => setNewSocialUrl(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0268ab]"
                  placeholder="https://..."
                  disabled={loading}
                />
              </div>
            </div>

            <div className="text-right">
              <button
                onClick={handleSaveSocials}
                disabled={loading || savingKey !== null}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#0268ab] text-white text-sm font-semibold rounded-lg hover:bg-[#014a8f] disabled:opacity-60"
              >
                {savingKey ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Simpan Sosial
              </button>
            </div>
          </div>

          {/* Izin Tampil di Website */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between text-gray-900 font-semibold">
              <span>Izin Tampilkan di halaman Kontak</span>
              <span className="text-xs font-normal text-gray-500">
                Kartu Informasi Kontak
              </span>
            </div>
            <div className="divide-y divide-gray-100">
              {visibilityFields.map((field) => {
                const enabled = (values[field.key] ?? "true") !== "false";
                return (
                  <div
                    key={field.key}
                    className="py-3 flex items-start justify-between gap-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {field.label}
                      </p>
                      <p className="text-xs text-gray-500">
                        {field.description}
                      </p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={enabled}
                      onClick={() =>
                        setValues((v) => ({
                          ...v,
                          [field.key]: enabled ? "false" : "true",
                        }))
                      }
                      disabled={loading}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        enabled ? "bg-[#0268ab]" : "bg-gray-200"
                      } ${loading ? "opacity-60" : ""}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          enabled ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="text-right">
              <button
                onClick={() => saveKeys(visibilityFields.map((f) => f.key))}
                disabled={loading || savingKey !== null}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#0268ab] text-white text-sm font-semibold rounded-lg hover:bg-[#014a8f] disabled:opacity-60"
              >
                {savingKey ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Simpan Izin
              </button>
            </div>
          </div>
        </div>
      </div>

      {confirmDeleteKey && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setConfirmDeleteKey(null)}
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
                  Hapus Platform
                </h3>
                <p className="text-sm text-gray-500">
                  {currentDeleteLabel
                    ? `Yakin ingin menghapus platform "${currentDeleteLabel}" dari daftar media sosial?`
                    : "Yakin ingin menghapus platform ini dari daftar media sosial?"}
                </p>
                <p className="text-xs text-gray-400">
                  Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmDeleteKey(null)}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  Ya, Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
