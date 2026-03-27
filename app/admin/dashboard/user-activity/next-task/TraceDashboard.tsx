"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { MapPin, MonitorSmartphone, Wifi, Globe2, Crosshair, Search } from "lucide-react";

const TraceMap = dynamic(() => import("./TraceMap"), { ssr: false });

type TraceRecord = {
  id: number;
  source: "activity" | "login";
  action: string | null;
  userName: string | null;
  userEmail: string | null;
  ipAddress: string | null;
  latitude: number | null;
  longitude: number | null;
  device: string | null;
  userAgent: string | null;
  createdAt: string;
};

type GeoInfo = {
  isp?: string;
  org?: string;
  city?: string;
  country?: string;
};

type Props = {
  initialRecords: TraceRecord[];
};

export default function TraceDashboard({ initialRecords }: Props) {
  const records = initialRecords;
  const [selected, setSelected] = useState<TraceRecord | null>(
    initialRecords[0] ?? null,
  );
  const [geo, setGeo] = useState<GeoInfo | null>(null);
  const [loadingGeo, setLoadingGeo] = useState(false);

  const center = useMemo(() => {
    if (selected?.latitude && selected?.longitude)
      return [selected.latitude, selected.longitude] as [number, number];
    return null;
  }, [selected]);

  const [filterQuery, setFilterQuery] = useState("");
  const [filterSource, setFilterSource] = useState<"all" | "login" | "activity">("all");

  const filteredRecords = useMemo(() => {
    const q = filterQuery.trim().toLowerCase();
    return records.filter((r) => {
      if (filterSource !== "all" && r.source !== filterSource) return false;
      if (!q) return true;
      return [
        r.userName?.toLowerCase(),
        r.userEmail?.toLowerCase(),
        r.ipAddress?.toLowerCase(),
        r.action?.toLowerCase(),
        r.device?.toLowerCase(),
        r.userAgent?.toLowerCase(),
      ]
        .filter(Boolean)
        .some((field) => field!.includes(q));
    });
  }, [records, filterQuery, filterSource]);

  useEffect(() => {
    if (!selected) {
      setSelected(filteredRecords[0] ?? null);
      return;
    }
    const stillVisible = filteredRecords.some(
      (r) => r.id === selected.id && r.source === selected.source,
    );
    if (!stillVisible) {
      setSelected(filteredRecords[0] ?? null);
    }
  }, [filteredRecords, selected]);

  useEffect(() => {
    if (!selected?.ipAddress) {
      setGeo(null);
      return;
    }
    setLoadingGeo(true);
    fetch(`https://ip-api.com/json/${selected.ipAddress}`)
      .then((r) => r.json())
      .then((data) => {
        setGeo({
          isp: data?.isp,
          org: data?.org,
          city: data?.city,
          country: data?.country,
        });
      })
      .catch(() => setGeo(null))
      .finally(() => setLoadingGeo(false));
  }, [selected?.ipAddress]);

  const handleSelect = (rec: TraceRecord) => {
    setSelected(rec);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Trace &amp; Forensic
            </h1>
            <p className="text-sm text-slate-600">
              Lacak lokasi pelaku dari log aktivitas dan login.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-[2fr,1fr] gap-6 items-start">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-700">
                <Crosshair className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-slate-500">Peta Lokasi</div>
                <div className="text-base font-semibold text-slate-900">
                  Marker biru menunjukkan lokasi pelaku
                </div>
              </div>
            </div>

            <div className="bg-white" style={{ height: 520 }}>
              <TraceMap center={center} marker={center} />
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">
                  Detail Log
                </h2>
                {selected ? (
                  <span className="text-xs px-2 py-1 rounded bg-indigo-50 border border-indigo-100 text-indigo-700 font-semibold">
                    {selected.source === "login" ? "Login" : "Aktivitas"}
                  </span>
                ) : null}
              </div>

              {selected ? (
                <div className="space-y-3 text-sm text-slate-800">
                  <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                    <div className="text-xs text-slate-500">Email</div>
                    <div className="font-medium text-slate-900 truncate max-w-55 text-right">
                      {selected.userEmail || "—"}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 text-slate-700 bg-white border border-slate-200 rounded-lg px-3 py-2">
                      <MapPin className="w-4 h-4 text-slate-500" />
                      <div>
                        <div className="text-xs text-slate-500">Koordinat</div>
                        <div className="font-medium">
                          {selected.latitude && selected.longitude
                            ? `${selected.latitude.toFixed(4)}, ${selected.longitude.toFixed(4)}`
                            : "Tidak tersedia"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 bg-white border border-slate-200 rounded-lg px-3 py-2">
                      <Wifi className="w-4 h-4 text-slate-500" />
                      <div>
                        <div className="text-xs text-slate-500">IP Address</div>
                        <div className="font-medium">{selected.ipAddress ?? "Tidak ada"}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 bg-white border border-slate-200 rounded-lg px-3 py-2">
                      <MonitorSmartphone className="w-4 h-4 text-slate-500" />
                      <div>
                        <div className="text-xs text-slate-500">Perangkat / Aksi</div>
                        <div className="font-medium">
                          {selected.action
                            ? selected.action
                            : selected.device || selected.userAgent || "Tidak diketahui"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 bg-white border border-slate-200 rounded-lg px-3 py-2">
                      <Globe2 className="w-4 h-4 text-slate-500" />
                      <div>
                        <div className="text-xs text-slate-500">Waktu</div>
                        <div className="font-medium">
                          {new Date(selected.createdAt).toLocaleString("id-ID")}
                        </div>
                      </div>
                    </div>
                  </div>
                  {(loadingGeo || geo) && (geo?.isp || geo?.org || geo?.city || geo?.country || loadingGeo) ? (
                    <div className="pt-2 border-t border-slate-200 text-slate-700 text-sm space-y-1">
                      <div className="font-semibold text-slate-900">ISP / Network</div>
                      {loadingGeo ? (
                        <div className="text-slate-500 text-sm">Memuat info ISP...</div>
                      ) : (
                        <div className="text-slate-800 text-sm leading-relaxed">
                          <div>{geo?.isp || geo?.org || "ISP tidak diketahui"}</div>
                          <div className="text-slate-500">
                            {[geo?.city, geo?.country].filter(Boolean).join(", ") ||
                              "Lokasi tidak tersedia"}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="text-slate-500 text-sm">
                  Pilih atau cari log untuk melihat detail.
                </div>
              )}
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">
                  Log Activity
                </h2>
                <span className="text-xs text-slate-500">
                  {filteredRecords.length} entri
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 min-w-50">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={filterQuery}
                    onChange={(e) => setFilterQuery(e.target.value)}
                    placeholder="Cari nama, email, IP, aksi..."
                    className="w-full pl-10 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <select
                  value={filterSource}
                  onChange={(e) => setFilterSource(e.target.value as "all" | "login" | "activity")}
                  className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">Semua Jenis</option>
                  <option value="login">Login</option>
                  <option value="activity">Aktivitas</option>
                </select>
              </div>
              <div className="overflow-y-auto" style={{ maxHeight: 360 }}>
                <table className="w-full text-sm text-left">
                  <thead className="sticky top-0 bg-white border-b border-slate-200 text-xs text-slate-500 uppercase">
                    <tr>
                      <th className="py-2 px-2">Jenis</th>
                      <th className="py-2 px-2">Email</th>
                      <th className="py-2 px-2">IP</th>
                      <th className="py-2 px-2">Koordinat</th>
                      <th className="py-2 px-2">Perangkat / Aksi</th>
                      <th className="py-2 px-2">Waktu</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredRecords.map((rec) => {
                      const hasCoord = rec.latitude && rec.longitude;
                      const isSelected = selected?.source === rec.source && selected?.id === rec.id;
                      return (
                        <tr
                          key={`${rec.source}-${rec.id}`}
                          className={`hover:bg-slate-50 cursor-pointer ${isSelected ? "bg-slate-100" : ""}`}
                          onClick={() => handleSelect(rec)}
                        >
                          <td className="py-2 px-2 font-semibold text-slate-900">
                            {rec.source === "login" ? "Login" : "Aktivitas"}
                          </td>
                          <td className="py-2 px-2 text-slate-800">
                            {rec.userEmail || "-"}
                          </td>
                          <td className="py-2 px-2 text-slate-800">{rec.ipAddress ?? "-"}</td>
                          <td className="py-2 px-2 text-slate-800">
                            {hasCoord
                              ? `${rec.latitude?.toFixed(4)}, ${rec.longitude?.toFixed(4)}`
                              : "-"}
                          </td>
                          <td className="py-2 px-2 text-slate-800">
                            {rec.action
                              ? rec.action
                              : rec.device || rec.userAgent || "-"}
                          </td>
                          <td className="py-2 px-2 text-slate-800 whitespace-nowrap">
                            {new Date(rec.createdAt).toLocaleString("id-ID")}
                          </td>
                        </tr>
                      );
                    })}
                    {filteredRecords.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-4 px-2 text-center text-slate-500">
                          Belum ada log.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
