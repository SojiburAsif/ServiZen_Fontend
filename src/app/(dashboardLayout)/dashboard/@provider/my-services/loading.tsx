import { Skeleton } from "@/components/ui/skeleton";
import LoadingBackground from "@/components/shared/static/LoadingBackground";

const StatCardSkeleton = () => (
  <div className="rounded-[2rem] border border-zinc-100 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
    <div className="flex items-center gap-5">
      <Skeleton className="h-12 w-12 rounded-xl bg-zinc-100 dark:bg-zinc-800" />
      <div className="space-y-2">
        <Skeleton className="h-3 w-20 bg-zinc-100 dark:bg-zinc-800" />
        <Skeleton className="h-5 w-28 bg-zinc-200 dark:bg-zinc-800" />
      </div>
    </div>
  </div>
);

const ManagerRowSkeleton = () => (
  <div className="rounded-3xl border border-zinc-100 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="space-y-2">
        <Skeleton className="h-5 w-48 bg-zinc-100 dark:bg-zinc-800" />
        <Skeleton className="h-4 w-64 bg-zinc-50 dark:bg-zinc-900" />
      </div>
      <Skeleton className="h-10 w-32 rounded-xl bg-zinc-100 dark:bg-zinc-800" />
    </div>
  </div>
);

export default function ProviderMyServicesLoading() {
  return (
    <div className="mx-auto max-w-7xl space-y-12 p-6 md:p-12 bg-white dark:bg-zinc-950 min-h-screen">
        <header className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between border-b border-zinc-100 dark:border-zinc-800 pb-10">
          <div className="space-y-4">
            <Skeleton className="h-6 w-32 rounded-full bg-zinc-100 dark:bg-zinc-900" />
            <Skeleton className="h-12 w-64 bg-zinc-200 dark:bg-zinc-900" />
            <Skeleton className="h-4 w-96 bg-zinc-50 dark:bg-zinc-900/50" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-40 rounded-2xl bg-zinc-100 dark:bg-zinc-900" />
            <Skeleton className="h-12 w-40 rounded-2xl bg-zinc-100 dark:bg-zinc-900" />
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>

        <div className="p-2 flex flex-col gap-4">
          <Skeleton className="h-4 w-24 bg-zinc-100 dark:bg-zinc-900" />
          <div className="flex flex-wrap gap-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-9 w-28 rounded-xl bg-zinc-50 dark:bg-zinc-900" />
            ))}
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-50 dark:border-zinc-900">
          <div className="mb-8">
             <Skeleton className="h-8 w-48 bg-zinc-100 dark:bg-zinc-900" />
             <Skeleton className="h-4 w-72 bg-zinc-50 dark:bg-zinc-900/50 mt-2" />
          </div>
          <div className="bg-zinc-50/50 rounded-[3rem] p-4 dark:bg-zinc-900/10">
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <ManagerRowSkeleton key={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
  );
}
