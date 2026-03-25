"use client"

import { useState } from "react"
import { ActionBadge, JsonDiff, type AuditRow } from "./shared"

function formatDateTime(iso: string) {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}, ${pad(d.getHours())}.${pad(d.getMinutes())}.${pad(d.getSeconds())}`
}

export function AuditTable({ logs }: { logs: AuditRow[] }) {
  const [openId, setOpenId] = useState<number | null>(null)

  if (!logs || logs.length === 0) {
    return (
      <tbody className="divide-y divide-gray-100">
        <tr>
          <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-500">
            Belum ada aktivitas.
          </td>
        </tr>
      </tbody>
    )
  }

  return (
    <tbody className="divide-y divide-gray-100">
      {logs.map((log) => {
        const isOpen = openId === log.id

        if (isOpen) {
          return (
            <tr key={log.id} className="bg-gray-50/70">
              <td colSpan={7} className="px-4 py-4 align-top">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <ActionBadge action={log.action as "CREATE" | "EDIT" | "DELETE"} />
                      <span className="text-sm font-semibold text-gray-900">{log.targetTable}</span>
                    </div>
                    <div className="text-xs text-gray-600 space-x-2">
                      <span>Admin: {log.adminEmail}</span>
                      <span className="text-gray-400">•</span>
                      <span>IP: {log.ipAddress ?? "-"}</span>
                      <span className="text-gray-400">•</span>
                      <span>Lokasi: {log.locationCoords ?? "-"}</span>
                      <span className="text-gray-400">•</span>
                      <span>Waktu: {formatDateTime(log.createdAt)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setOpenId(null)}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                  >
                    Tutup
                  </button>
                </div>

                <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm max-w-5xl w-full overflow-auto">
                  <JsonDiff oldData={log.oldData} newData={log.newData} />
                </div>
              </td>
            </tr>
          )
        }

        return (
          <tr key={log.id} className="hover:bg-gray-50/70">
            <td className="px-4 py-3 text-sm text-gray-900">{log.adminEmail}</td>
            <td className="px-4 py-3 text-sm">
              <ActionBadge action={log.action as "CREATE" | "EDIT" | "DELETE"} />
            </td>
            <td className="px-4 py-3 text-sm text-gray-900">{log.targetTable}</td>
            <td className="px-4 py-3 text-sm text-gray-800">{log.ipAddress ?? "-"}</td>
            <td className="px-4 py-3 text-sm text-gray-800">{log.locationCoords ?? "-"}</td>
            <td className="px-4 py-3 text-sm text-gray-800">{formatDateTime(log.createdAt)}</td>
            <td className="px-4 py-3 text-sm align-top">
              <button
                type="button"
                className="text-blue-600 hover:text-blue-700 font-medium"
                onClick={() => setOpenId(log.id)}
              >
                Lihat Detail
              </button>
            </td>
          </tr>
        )
      })}
    </tbody>
  )
}

export default AuditTable