import { Bell, Activity } from "lucide-react";

export default function NotificationsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-10">
        
        {/* Header Skeleton */}
        <div className="relative overflow-hidden rounded-[2.5rem] border border-zinc-100 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950 sm:p-8">
          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex h-8 w-40 animate-pulse items-center gap-2 rounded-full bg-zinc-100 dark:bg-zinc-900" />
              <div className="space-y-2">
                <div className="h-10 w-64 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-900" />
                <div className="h-4 w-96 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-900" />
              </div>
            </div>
            <div className="flex items-center gap-3">
               <div className="h-10 w-24 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-900" />
               <div className="hidden h-12 w-12 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-900 md:flex" />
            </div>
          </div>
        </div>

        {/* Command Bar Skeleton */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
           <div className="h-14 w-full animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-900 lg:w-64" />
           <div className="h-14 w-full animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-900 lg:w-48" />
        </div>

        {/* Notification Matrix Skeleton */}
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex flex-col gap-4 rounded-3xl border border-zinc-100 bg-white/50 p-6 dark:border-zinc-800 dark:bg-zinc-950/50"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="h-10 w-10 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-900" />
                  <div className="flex-1 space-y-3">
                    <div className="h-6 w-1/3 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-900" />
                    <div className="h-4 w-full animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-900" />
                    <div className="flex gap-4">
                      <div className="h-3 w-20 animate-pulse rounded-md bg-zinc-100 dark:bg-zinc-900" />
                      <div className="h-3 w-20 animate-pulse rounded-md bg-zinc-100 dark:bg-zinc-900" />
                    </div>
                  </div>
                </div>
                <div className="h-10 w-10 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-900" />
              </div>
            </div>
          ))}
        </div>

        {/* Footer Skeleton */}
        <div className="flex justify-center">
           <div className="h-14 w-64 animate-pulse rounded-full bg-zinc-100 dark:bg-zinc-900" />
        </div>
      </div>
    </div>
  );
}
