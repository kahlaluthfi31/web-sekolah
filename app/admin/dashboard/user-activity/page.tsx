import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { Search } from "lucide-react";
import AuditTable from "./AuditTable";
import type { AuditRow } from "./shared";

export default async function UserActivityPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = (await searchParams) ?? {};
  const session = await getSession();
  if (!session) redirect("/admin/login");
  if (session.role !== "superadmin") redirect("/admin/dashboard");

  const q = Array.isArray(resolvedParams.q) ? resolvedParams.q[0] : resolvedParams.q;
  const actionFilter = Array.isArray(resolvedParams.action) ? resolvedParams.action[0] : resolvedParams.action;

  const prismaAny = prisma as unknown as { activityLog: { findMany: (args: unknown) => Promise<AuditRow[]> } };
  const logsRaw = await prismaAny.activityLog.findMany({
    where: {
      AND: [
        q ? { OR: [{ adminEmail: { contains: q } }, { targetTable: { contains: q } }] } : {},
        actionFilter ? { action: actionFilter as AuditRow["action"] } : {},
      ],
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  }) as unknown as (AuditRow & { createdAt: Date })[];

  const logs = logsRaw.map(log => ({ ...log, createdAt: log.createdAt.toISOString() }))

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-gray-900">Log Perubahan</h1>
        <p className="text-gray-600 text-sm">Catatan audit tambah/edit/hapus oleh admin & superadmin.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <form className="flex flex-col sm:flex-row gap-3 w-full" action="" method="get">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              name="q"
              defaultValue={q ?? ""}
              placeholder="Cari admin atau tabel target..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            name="action"
            defaultValue={actionFilter ?? ""}
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Semua Aksi</option>
            <option value="CREATE">Tambah</option>
            <option value="EDIT">Edit</option>
            <option value="DELETE">Hapus</option>
          </select>
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200 whitespace-nowrap"
          >
            Terapkan
          </button>
        </form>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-4 py-3">Admin</th>
                <th className="px-4 py-3">Aksi</th>
                <th className="px-4 py-3">Target</th>
                <th className="px-4 py-3">IP</th>
                <th className="px-4 py-3">Lokasi</th>
                <th className="px-4 py-3">Waktu</th>
                <th className="px-4 py-3">Detail</th>
              </tr>
            </thead>
            <AuditTable logs={logs} />
          </table>
        </div>
      </div>
    </div>
  );
}
