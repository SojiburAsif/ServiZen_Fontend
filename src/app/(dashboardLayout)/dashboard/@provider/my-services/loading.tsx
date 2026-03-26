import { Skeleton } from "@/components/ui/skeleton";

const StatCardSkeleton = () => (
  <div className="rounded-[24px] border border-zinc-100 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
    <div className="flex items-center gap-4">
      <Skeleton className="h-14 w-14 rounded-2xl" />
      <div className="space-y-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-6 w-32" />
      </div>
    </div>
  </div>
);

const ManagerRowSkeleton = () => (
  <div className="rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/70">
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="space-y-2">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Skeleton className="h-10 w-32" />
    </div>
  </div>
);

export default function ProviderMyServicesLoading() {
  return (
    <div className="mx-auto max-w-7xl space-y-10 p-6 md:p-10">
      <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <Skeleton className="h-5 w-40 rounded-full" />
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-80" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-48 rounded-xl" />
          <Skeleton className="h-12 w-40 rounded-xl" />
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      <div className="flex items-center gap-4 border-b border-zinc-100 py-2 dark:border-zinc-800">
        <Skeleton className="h-5 w-24" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-8 w-24 rounded-full" />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <ManagerRowSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
