import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
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
  const pageParam = Array.isArray(resolvedParams.page) ? resolvedParams.page[0] : resolvedParams.page;
  const pageSize = 50;
  const parsedPage = Number(pageParam ?? "1");
  const currentPage = Number.isFinite(parsedPage) && parsedPage > 0 ? Math.floor(parsedPage) : 1;

  const whereClause = {
    AND: [
      q ? { OR: [{ adminEmail: { contains: q } }, { targetTable: { contains: q } }] } : {},
      actionFilter ? { action: actionFilter as AuditRow["action"] } : {},
    ],
  };

  const prismaAny = prisma as unknown as {
    activityLog: {
      findMany: (args: unknown) => Promise<AuditRow[]>;
      count: (args: unknown) => Promise<number>;
    };
  };

  const totalLogs = await prismaAny.activityLog.count({ where: whereClause });
  const totalPages = Math.max(1, Math.ceil(totalLogs / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const logsRaw = await prismaAny.activityLog.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    take: pageSize,
    skip: (safePage - 1) * pageSize,
  }) as unknown as (AuditRow & { createdAt: Date })[];

  const logs = logsRaw.map(log => ({ ...log, createdAt: log.createdAt.toISOString() }));

  const hasPrevPage = safePage > 1;
  const hasNextPage = safePage < totalPages;
  const rangeStart = totalLogs === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const rangeEnd = totalLogs === 0 ? 0 : Math.min(safePage * pageSize, totalLogs);

  const buildPageHref = (page: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (actionFilter) params.set("action", actionFilter);
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    return qs ? `?${qs}` : "?";
  };

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
        <div className="px-4 py-3 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm">
          <p className="text-gray-600">
            Menampilkan <span className="font-semibold">{rangeStart}</span> - <span className="font-semibold">{rangeEnd}</span> dari <span className="font-semibold">{totalLogs}</span> data
          </p>
          <div className="flex items-center gap-2">
            {hasPrevPage ? (
              <Link
                href={buildPageHref(safePage - 1)}
                aria-label="Halaman sebelumnya"
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </Link>
            ) : (
              <span
                aria-label="Halaman sebelumnya"
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-400 cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </span>
            )}

            <span className="text-gray-500 px-1">
              Halaman {safePage} / {totalPages}
            </span>

            {hasNextPage ? (
              <Link
                href={buildPageHref(safePage + 1)}
                aria-label="Halaman berikutnya"
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </Link>
            ) : (
              <span
                aria-label="Halaman berikutnya"
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-400 cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
