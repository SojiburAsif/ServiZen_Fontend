import { getStats, AdminStats } from "@/services/stats.service";
import {
  Users,
  Wrench,
  BookOpen,
  Star,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  UserCheck,
  Activity,
} from "lucide-react";

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  suffix = "",
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
  suffix?: string;
}) {
  return (
    <div className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 dark:border-zinc-800 dark:bg-zinc-900">
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500">{label}</p>
        <p className="mt-0.5 text-2xl font-black text-slate-800 dark:text-zinc-100">
          {typeof value === "number" ? value.toLocaleString() : value}{suffix}
        </p>
      </div>
    </div>
  );
}

function BarChart({ data, maxVal }: { data: { label: string; value: number }[]; maxVal: number }) {
  return (
    <div className="flex items-end gap-1.5 h-40">
      {data.map((d, i) => {
        const pct = maxVal > 0 ? (d.value / maxVal) * 100 : 0;
        return (
          <div key={i} className="group flex flex-1 flex-col items-center gap-1">
            <span className="text-[9px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
              ৳{d.value.toLocaleString()}
            </span>
            <div className="w-full rounded-t-lg bg-emerald-100 dark:bg-emerald-900/30 relative" style={{ height: "120px" }}>
              <div
                className="absolute bottom-0 w-full rounded-t-lg bg-gradient-to-t from-emerald-600 to-emerald-400 transition-all duration-500"
                style={{ height: `${pct}%` }}
              />
            </div>
            <span className="text-[8px] font-semibold text-slate-400 text-center leading-tight">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function BookingStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    ACCEPTED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    WORKING: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    COMPLETED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    CANCELLED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    PAID: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    UNPAID: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide ${map[status] ?? "bg-slate-100 text-slate-600"}`}>
      {status}
    </span>
  );
}

export default async function AdminDashboardPage() {
  const raw = await getStats();

  if (!raw || raw.role !== "ADMIN") {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-slate-400 text-sm">Could not load stats. Please refresh.</p>
      </div>
    );
  }

  const stats = raw as AdminStats;
  const { overview, bookingStatus, recentBookings, monthlyIncome, weeklyIncome } = stats;

  const maxMonthly = Math.max(...(monthlyIncome?.map((m) => m.amount) ?? [1]), 1);
  const maxWeekly = Math.max(...(weeklyIncome?.map((w) => w.amount) ?? [1]), 1);

  const bookingStatusData = [
    { status: "PENDING", count: bookingStatus.PENDING, icon: Clock, color: "bg-amber-500" },
    { status: "ACCEPTED", count: bookingStatus.ACCEPTED, icon: CheckCircle, color: "bg-blue-500" },
    { status: "WORKING", count: bookingStatus.WORKING, icon: Activity, color: "bg-purple-500" },
    { status: "COMPLETED", count: bookingStatus.COMPLETED, icon: CheckCircle, color: "bg-emerald-500" },
    { status: "CANCELLED", count: bookingStatus.CANCELLED, icon: XCircle, color: "bg-red-500" },
  ];

  const totalBookingsForPct = Object.values(bookingStatus).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="space-y-8 p-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
          Platform overview & live statistics
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        <StatCard label="Total Revenue" value={`৳${overview.totalRevenue.toLocaleString()}`} icon={DollarSign} color="bg-emerald-600" />
        <StatCard label="Total Users" value={overview.totalUsers} icon={Users} color="bg-blue-500" />
        <StatCard label="Providers" value={overview.totalProviders} icon={UserCheck} color="bg-violet-500" />
        <StatCard label="Clients" value={overview.totalClients} icon={Users} color="bg-sky-500" />
        <StatCard label="Services" value={overview.totalServices} icon={Wrench} color="bg-orange-500" />
        <StatCard label="Total Bookings" value={overview.totalBookings} icon={BookOpen} color="bg-pink-500" />
        <StatCard label="Total Reviews" value={overview.totalReviews} icon={Star} color="bg-yellow-500" />
        <StatCard label="Unpaid Bookings" value={overview.unpaidBookings} icon={AlertCircle} color="bg-red-500" />
      </div>

      {/* Booking Status */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-5 text-sm font-black uppercase tracking-widest text-slate-500 dark:text-zinc-400">
          Booking Status Breakdown
        </h2>
        <div className="space-y-3">
          {bookingStatusData.map(({ status, count, icon: Icon, color }) => (
            <div key={status} className="flex items-center gap-3">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${color}`}>
                <Icon size={14} className="text-white" />
              </div>
              <div className="flex flex-1 items-center gap-3">
                <span className="w-24 text-xs font-bold text-slate-700 dark:text-zinc-300">{status}</span>
                <div className="relative flex-1 h-2.5 rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${color} transition-all duration-700`}
                    style={{ width: `${(count / totalBookingsForPct) * 100}%` }}
                  />
                </div>
                <span className="w-6 text-right text-xs font-black text-slate-700 dark:text-zinc-300">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Income */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-500 dark:text-zinc-400">
              Monthly Revenue
            </h2>
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 dark:bg-emerald-900/20">
              <TrendingUp size={12} className="text-emerald-600 dark:text-emerald-400" />
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Last 12 Months</span>
            </div>
          </div>
          <BarChart
            data={(monthlyIncome ?? []).map((m) => ({ label: m.month.split(" ")[0], value: m.amount }))}
            maxVal={maxMonthly}
          />
        </div>

        {/* Weekly Income */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-500 dark:text-zinc-400">
              Weekly Revenue
            </h2>
            <div className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 dark:bg-blue-900/20">
              <Activity size={12} className="text-blue-600 dark:text-blue-400" />
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">Last 4 Weeks</span>
            </div>
          </div>
          <BarChart
            data={(weeklyIncome ?? []).map((w) => ({
              label: `W${w.week}`,
              value: w.amount,
            }))}
            maxVal={maxWeekly}
          />
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-zinc-800">
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-500 dark:text-zinc-400">
            Recent Bookings
          </h2>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600 dark:bg-zinc-800 dark:text-zinc-400">
            {recentBookings?.length ?? 0} records
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-50 dark:border-zinc-800/50">
                {["Service", "Client", "Provider", "Amount", "Status", "Payment"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(recentBookings ?? []).map((b) => (
                <tr key={b.id} className="border-b border-slate-50 transition-colors hover:bg-slate-50/50 dark:border-zinc-800/50 dark:hover:bg-zinc-800/30">
                  <td className="px-4 py-3.5 font-semibold text-slate-800 dark:text-zinc-200">{b.service?.name}</td>
                  <td className="px-4 py-3.5 text-slate-600 dark:text-zinc-400">{b.client?.name}</td>
                  <td className="px-4 py-3.5 text-slate-600 dark:text-zinc-400">{b.provider?.name}</td>
                  <td className="px-4 py-3.5 font-bold text-emerald-600 dark:text-emerald-400">৳{b.totalAmount.toLocaleString()}</td>
                  <td className="px-4 py-3.5"><BookingStatusBadge status={b.status} /></td>
                  <td className="px-4 py-3.5"><BookingStatusBadge status={b.paymentStatus} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!recentBookings || recentBookings.length === 0) && (
            <div className="py-12 text-center text-sm text-slate-400">No recent bookings found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
