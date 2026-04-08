export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-10">
        
        {/* Header Skeleton */}
        <div className="h-44 animate-pulse rounded-[2.5rem] bg-zinc-100 dark:bg-zinc-900" />

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-[2rem] bg-zinc-100 dark:bg-zinc-900 shadow-sm" />
          ))}
        </div>

        {/* Filter Bar Skeleton */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
            <div className="h-14 flex-1 animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-900" />
            <div className="flex gap-3">
                <div className="h-14 w-40 animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-900" />
                <div className="h-14 w-28 animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-900" />
            </div>
        </div>

        {/* List Skeleton */}
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 animate-pulse rounded-[2.5rem] bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800" />
          ))}
        </div>
        
      </div>
    </div>
  );
}
