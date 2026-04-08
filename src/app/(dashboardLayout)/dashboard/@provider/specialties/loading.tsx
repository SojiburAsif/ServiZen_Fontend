import {
  DashboardHeaderSkeleton,
  DashboardStatGridSkeleton,
  DashboardTableSkeleton,
} from "@/components/modules/dashboard/dashboard-loading";
import LoadingBackground from "@/components/shared/static/LoadingBackground";

export default function ProviderSpecialtiesLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-10">
        <div className="h-44 animate-pulse rounded-[3rem] bg-zinc-100 dark:bg-zinc-900" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="h-96 animate-pulse rounded-[2.5rem] bg-zinc-50 dark:bg-zinc-900/50" />
          </div>
          <div className="space-y-6">
            <div className="h-48 animate-pulse rounded-[2.5rem] bg-zinc-900/10 dark:bg-zinc-800" />
            <div className="h-48 animate-pulse rounded-[2.5rem] bg-zinc-50 dark:bg-zinc-900/50" />
          </div>
        </div>
        <div className="h-96 animate-pulse rounded-[3rem] bg-zinc-50 dark:bg-zinc-900/50" />
      </div>
    </div>
  );
}
