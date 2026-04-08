import { Skeleton } from "@/components/ui/skeleton";

export default function AddNotificationLoading() {
  return (
    <main className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-100">
      <div className="mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Header Section Skeleton */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <Skeleton className="h-12 w-64 bg-zinc-100 dark:bg-zinc-900 rounded-lg" />
            <Skeleton className="h-4 w-96 bg-zinc-100 dark:bg-zinc-900 rounded-lg" />
          </div>
          
          <div className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 w-full md:w-48">
            <Skeleton className="size-10 rounded-full bg-zinc-200 dark:bg-zinc-800" />
            <div className="space-y-2">
              <Skeleton className="h-2 w-16 bg-zinc-200 dark:bg-zinc-800" />
              <Skeleton className="h-5 w-24 bg-zinc-200 dark:bg-zinc-800" />
            </div>
          </div>
        </div>

        {/* Filters Skeleton */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8 bg-zinc-50/50 dark:bg-zinc-900/30 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
          <Skeleton className="h-10 w-full sm:w-48 bg-zinc-100 dark:bg-zinc-900 rounded-xl" />
          <Skeleton className="h-10 w-full sm:w-40 bg-zinc-100 dark:bg-zinc-900 rounded-xl" />
        </div>

        {/* Notifications List Skeleton */}
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 md:p-8 overflow-hidden relative">
              <div className="flex items-start gap-6">
                <Skeleton className="size-12 rounded-2xl bg-zinc-100 dark:bg-zinc-900" />
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-48 bg-zinc-100 dark:bg-zinc-900" />
                      <Skeleton className="h-3 w-32 bg-zinc-100 dark:bg-zinc-900" />
                    </div>
                    <Skeleton className="size-9 rounded-xl bg-zinc-100 dark:bg-zinc-900" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full bg-zinc-100 dark:bg-zinc-900" />
                    <Skeleton className="h-4 w-3/4 bg-zinc-100 dark:bg-zinc-900" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
