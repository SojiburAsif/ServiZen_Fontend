export default function AdminBookingsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-10">
        {/* Header Skeleton */}
        <div className="h-44 animate-pulse rounded-[3rem] bg-zinc-100 dark:bg-zinc-900" />
        
        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-[2rem] bg-zinc-100 dark:bg-zinc-900" />
          ))}
        </div>

        {/* Action Bar Skeleton */}
        <div className="h-20 animate-pulse rounded-[2rem] bg-zinc-50 dark:bg-zinc-900/50" />

        {/* Table Skeleton */}
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-[2rem] bg-zinc-50 dark:bg-zinc-900/50" />
          ))}
        </div>
      </div>
    </div>
  );
}
