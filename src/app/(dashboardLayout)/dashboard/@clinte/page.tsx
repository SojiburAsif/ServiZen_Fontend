import { getStats, ClientStats } from "@/services/stats.service";
import {
  BookOpen,
  CheckCircle,
  Clock,
  XCircle,
  Activity,
  CreditCard,
  CalendarCheck,
  Star,
  TrendingUp,
} from "lucide-react";

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 dark:border-zinc-800 dark:bg-zinc-900">
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500">{label}</p>
        <p className="mt-0.5 text-2xl font-black text-slate-800 dark:text-zinc-100">{value}</p>
      </div>
    </div>
  );
}

function BarChart({
  data,
  maxVal,
  color = "from-blue-600 to-blue-400",
}: {
  data: { label: string; value: number }[];
  maxVal: number;
  color?: string;
}) {
  return (
    <div className="flex items-end gap-1.5 h-40">
      {data.map((d, i) => {
        const pct = maxVal > 0 ? (d.value / maxVal) * 100 : 0;
        return (
          <div key={i} className="group flex flex-1 flex-col items-center gap-1">
            <span className="text-[9px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
              ৳{d.value.toLocaleString()}
            </span>
            <div className="w-full rounded-t-lg bg-slate-100 dark:bg-zinc-800 relative" style={{ height: "120px" }}>
              <div
                className={`absolute bottom-0 w-full rounded-t-lg bg-gradient-to-t ${color} transition-all duration-500`}
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
    <span
      className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide ${
        map[status] ?? "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}

export default async function ClientDashboardPage() {
  const raw = await getStats();

  if (!raw || raw.role !== "USER") {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-slate-400 text-sm">Could not load your stats. Please refresh.</p>
      </div>
    );
  }

  const stats = raw as ClientStats;
  const { overview, bookingStatus, recentBookings, monthlyIncome, weeklyIncome } = stats;

  const maxMonthly = Math.max(...(monthlyIncome?.map((m) => m.amount) ?? [1]), 1);
  const maxWeekly = Math.max(...(weeklyIncome?.map((w) => w.amount) ?? [1]), 1);

  const totalBookingsForPct = bookingStatus
    ? Object.values(bookingStatus).reduce((a, b) => a + b, 0) || 1
    : 1;

  const bookingStatuses = bookingStatus
    ? Object.entries(bookingStatus).map(([status, count]) => ({ status, count }))
    : [];

  const statusColors: Record<string, string> = {
    PENDING: "bg-amber-500",
    ACCEPTED: "bg-blue-500",
    WORKING: "bg-purple-500",
    COMPLETED: "bg-emerald-500",
    CANCELLED: "bg-red-500",
  };
  const statusIcons: Record<string, React.ElementType> = {
    PENDING: Clock,
    ACCEPTED: CheckCircle,
    WORKING: Activity,
    COMPLETED: CheckCircle,
    CANCELLED: XCircle,
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          My Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
          Track your bookings, spending & activity
        </p>
      </div>

      {/* Total Spent Banner */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-6 text-white shadow-lg shadow-blue-500/20">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-100">Total Spent</p>
          <p className="mt-2 text-4xl font-black">
            ৳{(overview.totalSpent ?? 0).toLocaleString()}
          </p>
          <p className="mt-1 text-sm text-blue-200">
            Across {overview.totalBookings ?? 0} bookings
          </p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 p-6 text-white shadow-lg shadow-violet-500/20">
          <p className="text-xs font-bold uppercase tracking-widest text-violet-100">Upcoming Bookings</p>
          <p className="mt-2 text-4xl font-black">
            {overview.upcomingBookings ?? 0}
          </p>
          <p className="mt-1 text-sm text-violet-200">Scheduled services</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard
          label="Total Bookings"
          value={overview.totalBookings ?? 0}
          icon={BookOpen}
          color="bg-blue-500"
        />
        <StatCard
          label="Completed"
          value={overview.completedBookings ?? 0}
          icon={CheckCircle}
          color="bg-emerald-500"
        />
        <StatCard
          label="Cancelled"
          value={overview.cancelledBookings ?? 0}
          icon={XCircle}
          color="bg-red-500"
        />
        <StatCard
          label="Reviews Given"
          value={overview.totalReviews ?? 0}
          icon={Star}
          color="bg-yellow-500"
        />
      </div>

      {/* My Quick Actions */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-900/30 dark:bg-blue-900/10">
          <CalendarCheck size={20} className="text-blue-600 dark:text-blue-400" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Upcoming</p>
            <p className="text-xl font-black text-blue-700 dark:text-blue-300">
              {overview.upcomingBookings ?? 0}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 dark:border-emerald-900/30 dark:bg-emerald-900/10">
          <CreditCard size={20} className="text-emerald-600 dark:text-emerald-400" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Total Paid</p>
            <p className="text-xl font-black text-emerald-700 dark:text-emerald-300">
              ৳{(overview.totalSpent ?? 0).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-yellow-100 bg-yellow-50 p-4 dark:border-yellow-900/30 dark:bg-yellow-900/10">
          <Star size={20} className="text-yellow-600 dark:text-yellow-400" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-yellow-500">Reviews</p>
            <p className="text-xl font-black text-yellow-700 dark:text-yellow-300">
              {overview.totalReviews ?? 0}
            </p>
          </div>
        </div>
      </div>

      {/* Booking Status Breakdown */}
      {bookingStatuses.length > 0 && (
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-5 text-sm font-black uppercase tracking-widest text-slate-500 dark:text-zinc-400">
            My Booking Status
          </h2>
          <div className="space-y-3">
            {bookingStatuses.map(({ status, count }) => {
              const Icon = statusIcons[status] ?? Activity;
              const color = statusColors[status] ?? "bg-slate-500";
              return (
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
              );
            })}
          </div>
        </div>
      )}

      {/* Spending Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {monthlyIncome && monthlyIncome.length > 0 && (
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-500 dark:text-zinc-400">
                Monthly Spending
              </h2>
              <div className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 dark:bg-blue-900/20">
                <TrendingUp size={12} className="text-blue-600" />
                <span className="text-[10px] font-bold text-blue-600">Last 12 Months</span>
              </div>
            </div>
            <BarChart
              data={monthlyIncome.map((m) => ({
                label: m.month.split(" ")[0],
                value: m.amount,
              }))}
              maxVal={maxMonthly}
              color="from-blue-600 to-blue-400"
            />
          </div>
        )}
        {weeklyIncome && weeklyIncome.length > 0 && (
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-500 dark:text-zinc-400">
                Weekly Spending
              </h2>
              <div className="flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1 dark:bg-violet-900/20">
                <Activity size={12} className="text-violet-600" />
                <span className="text-[10px] font-bold text-violet-600">Last 4 Weeks</span>
              </div>
            </div>
            <BarChart
              data={weeklyIncome.map((w) => ({ label: `W${w.week}`, value: w.amount }))}
              maxVal={maxWeekly}
              color="from-violet-600 to-violet-400"
            />
          </div>
        )}
      </div>

      {/* Recent Bookings */}
      {recentBookings && recentBookings.length > 0 && (
        <div className="rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-zinc-800">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-500 dark:text-zinc-400">
              My Recent Bookings
            </h2>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600 dark:bg-zinc-800 dark:text-zinc-400">
              {recentBookings.length} records
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-50 dark:border-zinc-800/50">
                  {["Service", "Provider", "Date", "Amount", "Status"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b) => (
                  <tr
                    key={b.id}
                    className="border-b border-slate-50 hover:bg-slate-50/50 dark:border-zinc-800/50 dark:hover:bg-zinc-800/30"
                  >
                    <td className="px-4 py-3.5 font-semibold text-slate-800 dark:text-zinc-200">
                      {b.service?.name}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 dark:text-zinc-400">
                      {b.provider?.name}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-500 dark:text-zinc-500">
                      {new Date(b.bookingDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-blue-600 dark:text-blue-400">
                      ৳{b.totalAmount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5">
                      <BookingStatusBadge status={b.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
