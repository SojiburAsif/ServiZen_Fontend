export default function ProviderProfileLoading() {
  return (
    <div className="min-h-screen w-full bg-white dark:bg-black p-12">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Header Skeleton */}
        <div className="mb-12 h-64 w-full animate-pulse rounded-[3rem] bg-zinc-100 dark:bg-zinc-900/50" />
        
        {/* Stats Grid Skeleton */}
        <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-[2rem] bg-zinc-50 dark:bg-zinc-900/40" />
          ))}
        </div>

        {/* Details Grid Skeleton */}
        <div className="grid gap-8 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 animate-pulse rounded-[2.5rem] bg-zinc-50 dark:bg-zinc-900/40" />
          ))}
        </div>

        {/* Expertise Skeleton */}
        <div className="mt-12 h-80 w-full animate-pulse rounded-[3rem] bg-zinc-50 dark:bg-zinc-900/40" />
      </div>
    </div>
  );
}
