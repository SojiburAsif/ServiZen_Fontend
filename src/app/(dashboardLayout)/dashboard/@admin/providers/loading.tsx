export default function AdminProvidersLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-10">
      {/* Header Skeleton */}
      <div className="h-44 animate-pulse rounded-[3rem] bg-zinc-100 dark:bg-zinc-900" />
      
      {/* Stat Cards Skeleton */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 animate-pulse rounded-[2.5rem] bg-zinc-100 dark:bg-zinc-900" />
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black overflow-hidden">
        <div className="p-8 border-b border-zinc-100 dark:border-zinc-900">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="h-8 w-48 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-900" />
            <div className="h-12 w-[300px] animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-900" />
          </div>
        </div>
        <div className="p-0">
          <div className="space-y-4 p-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-2xl bg-zinc-50 dark:bg-zinc-900/50" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
