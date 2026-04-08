export default function ProviderDashboardLoading() {
  return (
    <div className="min-h-screen w-full bg-white dark:bg-black p-8">
      <div className="mx-auto w-full space-y-10">
        
        {/* Header Skeleton */}
        <div className="rounded-[2.5rem] border border-zinc-100 bg-zinc-50/50 p-8 dark:border-zinc-800/50 dark:bg-zinc-900/20">
          <div className="h-4 w-32 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
          <div className="mt-4 h-12 w-64 animate-pulse rounded-2xl bg-zinc-300 dark:bg-zinc-700" />
          <div className="mt-4 h-4 w-96 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-[2rem] border border-zinc-100 bg-white dark:border-zinc-800 dark:bg-zinc-950" />
          ))}
        </div>

        {/* Charts/Content Skeleton */}
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="h-80 animate-pulse rounded-[2.5rem] border border-zinc-100 bg-zinc-50/30 dark:border-zinc-800 dark:bg-zinc-900/20" />
          <div className="h-80 animate-pulse rounded-[2.5rem] border border-zinc-100 bg-zinc-50/30 dark:border-zinc-800 dark:bg-zinc-900/20" />
        </div>

        {/* Table Skeleton */}
        <div className="overflow-hidden rounded-[2.5rem] border border-zinc-100 bg-white dark:border-zinc-800 dark:bg-zinc-950">
          <div className="h-16 animate-pulse bg-zinc-50 dark:bg-zinc-900/50" />
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 w-full animate-pulse rounded-xl bg-zinc-50 dark:bg-zinc-900/40" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
