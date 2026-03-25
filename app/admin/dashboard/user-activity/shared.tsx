export function ActionBadge({ action }: { action: "CREATE" | "EDIT" | "DELETE" }) {
  const color = action === "DELETE"
    ? "bg-red-100 text-red-700 border-red-200"
    : action === "EDIT"
      ? "bg-amber-100 text-amber-800 border-amber-200"
      : "bg-emerald-100 text-emerald-800 border-emerald-200"

  const label = action === "DELETE" ? "Hapus" : action === "EDIT" ? "Edit" : "Tambah"
  return <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${color}`}>{label}</span>
}

export type AuditRow = {
  id: number
  adminEmail: string
  action: "CREATE" | "EDIT" | "DELETE"
  targetTable: string
  oldData: unknown
  newData: unknown
  ipAddress: string | null
  locationCoords: string | null
  createdAt: string
}

export function JsonDiff({ oldData, newData }: { oldData: unknown; newData: unknown }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
        <p className="text-xs font-semibold text-gray-500 mb-1">Sebelum</p>
        <pre className="text-xs text-gray-800 whitespace-pre-wrap break-all">{JSON.stringify(oldData, null, 2) ?? "-"}</pre>
      </div>
      <div className="border border-gray-200 rounded-lg p-3 bg-white">
        <p className="text-xs font-semibold text-gray-500 mb-1">Sesudah</p>
        <pre className="text-xs text-gray-800 whitespace-pre-wrap break-all">{newData === null ? "-" : JSON.stringify(newData, null, 2)}</pre>
      </div>
    </div>
  )
}