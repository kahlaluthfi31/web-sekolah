import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import type { LoginActivity, Role } from "@prisma/client";
import { Clock, MapPin, MonitorSmartphone, Search, ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE_DEFAULT = 20;

function buildQuery(params: Record<string, string | number | undefined>) {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === "") return;
    usp.set(key, String(value));
  });
  return usp.toString();
}

type LoginActivityWithUser = LoginActivity & {
  user: { id: number; name: string; email: string; role: Role } | null;
  loginEmail?: string | null;
  chromeEmail?: string | null;
};

async function getLoginActivities({
  page,
  limit,
  role,
  q,
}: {
  page: number;
  limit: number;
  role?: Role;
  q?: string;
}): Promise<{ items: LoginActivityWithUser[]; total: number }> {
  const where = {
    role: role ?? undefined,
    user: q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
  };

  const [items, total] = await Promise.all([
    prisma.loginActivity.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true, role: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.loginActivity.count({ where }),
  ]);

  return { items, total };
}

export default async function LoginActivityPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;

  const session = await getSession();
  if (!session) redirect("/admin/login");
  if (session.role !== "superadmin") redirect("/admin/dashboard");

  const page = Math.max(
    1,
    Number(
      Array.isArray(resolvedParams?.page)
        ? resolvedParams?.page[0]
        : resolvedParams?.page,
    ) || 1,
  );
  const limit = Math.min(
    100,
    Math.max(
      5,
      Number(
        Array.isArray(resolvedParams?.limit)
          ? resolvedParams?.limit[0]
          : resolvedParams?.limit,
      ) || PAGE_SIZE_DEFAULT,
    ),
  );
  const roleFilter = Array.isArray(resolvedParams?.role)
    ? resolvedParams?.role[0]
    : resolvedParams?.role;
  const q = Array.isArray(resolvedParams?.q)
    ? resolvedParams?.q[0]
    : resolvedParams?.q;

  const { items, total } = await getLoginActivities({
    page,
    limit,
    role: roleFilter as Role | undefined,
    q: q?.trim(),
  });
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Aktivitas Login</h1>
          <p className="text-sm text-gray-500">
            Pantau login admin & superadmin beserta detail perangkat.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <form
          className="flex flex-col sm:flex-row gap-3 w-full"
          action=""
          method="get"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              name="q"
              defaultValue={q ?? ""}
              placeholder="Cari nama atau email..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            name="role"
            defaultValue={roleFilter ?? ""}
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Semua Role</option>
            <option value="superadmin">Superadmin</option>
            <option value="admin">Admin</option>
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
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">IP Address</th>
                <th className="px-4 py-3">Perangkat</th>
                <th className="px-4 py-3">Lokasi</th>
                <th className="px-4 py-3">Waktu Login</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-sm text-gray-500"
                  >
                    Belum ada aktivitas login.
                  </td>
                </tr>
              )}
              {items.map((activity) => (
                <tr key={activity.id} className="hover:bg-gray-50/70">
                  <td className="px-4 py-3 text-sm text-gray-900">
                    <div className="font-semibold">
                      {activity.user?.name ?? "Pengguna"}
                    </div>
                    <div className="text-gray-500 text-xs">
                      {activity.user?.email || activity.loginEmail || activity.chromeEmail || 'Email tidak diketahui'}
                    </div>
                    {activity.loginEmail && activity.loginEmail !== activity.user?.email && (
                      <div className="text-[11px] text-blue-700 bg-blue-50 border border-blue-100 rounded-full inline-flex px-2 py-0.5 mt-1">
                        Login email: {activity.loginEmail}
                      </div>
                    )}
                    {activity.chromeEmail && activity.chromeEmail !== activity.loginEmail && (
                      <div className="text-[11px] text-amber-700 bg-amber-50 border border-amber-100 rounded-full inline-flex px-2 py-0.5 mt-1">
                        Google email: {activity.chromeEmail}
                      </div>
                    )}
                    <span className="inline-flex mt-1 px-2 py-0.5 text-[11px] rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {activity.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {activity.ipAddress || "—"}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800">
                    <div className="flex items-start gap-2">
                      <MonitorSmartphone className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div className="space-y-1">
                        <div className="font-medium text-gray-900 text-sm">
                          {activity.device || "Perangkat tidak diketahui"}
                        </div>
                        <div className="text-xs text-gray-500 wrap-break-word max-w-xs">
                          {activity.userAgent || "User agent kosong"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800">
                    {activity.latitude && activity.longitude ? (
                      <div className="text-gray-800 text-sm">
                        {activity.latitude.toFixed(4)},{" "}
                        {activity.longitude.toFixed(4)}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      {new Date(activity.createdAt).toLocaleString("id-ID")}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <div>
          Halaman {page} dari {totalPages} • Total {total} log
        </div>
        <div className="flex items-center gap-2">
          <a
            className={`px-3 py-1.5 rounded-lg border text-sm ${page <= 1 ? "cursor-not-allowed bg-gray-100 text-gray-400 border-gray-200" : "bg-white border-gray-200 hover:bg-gray-50"}`}
            aria-disabled={page <= 1}
            href={
              page <= 1
                ? "#"
                : `?${buildQuery({ page: page - 1, limit, role: roleFilter, q })}`
            }
          >
            <ChevronLeft className="w-4 h-4" />
          </a>
          <a
            className={`px-3 py-1.5 rounded-lg border text-sm ${page >= totalPages ? "cursor-not-allowed bg-gray-100 text-gray-400 border-gray-200" : "bg-white border-gray-200 hover:bg-gray-50"}`}
            aria-disabled={page >= totalPages}
            href={
              page >= totalPages
                ? "#"
                : `?${buildQuery({ page: page + 1, limit, role: roleFilter, q })}`
            }
          >
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
