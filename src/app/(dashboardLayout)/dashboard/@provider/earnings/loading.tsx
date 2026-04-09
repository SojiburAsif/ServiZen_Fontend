export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-10">
        <div className="h-44 animate-pulse rounded-[3rem] bg-zinc-100 dark:bg-zinc-900" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-[2rem] bg-zinc-100 dark:bg-zinc-900" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="h-64 animate-pulse rounded-[2.5rem] bg-zinc-50 dark:bg-zinc-900/50" />
          <div className="lg:col-span-2">
            <div className="h-64 animate-pulse rounded-[2.5rem] bg-zinc-50 dark:bg-zinc-900/50" />
          </div>
        </div>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 animate-pulse rounded-[2.5rem] bg-zinc-50 dark:bg-zinc-900/50" />
          ))}
        </div>
      </div>
    </div>
  );
}
