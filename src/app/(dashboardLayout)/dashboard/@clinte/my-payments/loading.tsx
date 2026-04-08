"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function MyPaymentsLoading() {
  return (
    <main className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-100">
      <div className="mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Header Section Skeleton */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <Skeleton className="h-12 w-64 bg-zinc-100 dark:bg-zinc-900 rounded-lg" />
            <Skeleton className="h-4 w-80 bg-zinc-100 dark:bg-zinc-900 rounded-lg" />
          </div>
          
          <div className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 w-full md:w-48">
            <Skeleton className="size-10 rounded-full bg-zinc-200 dark:bg-zinc-800" />
            <div className="space-y-2">
              <Skeleton className="h-2 w-16 bg-zinc-200 dark:bg-zinc-800" />
              <Skeleton className="h-5 w-24 bg-zinc-200 dark:bg-zinc-800" />
            </div>
          </div>
        </div>

        <div className="w-full">
          <div className="flex items-center justify-between mb-6">
            <div className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1 rounded-xl flex gap-1">
              <Skeleton className="h-9 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
              <Skeleton className="h-9 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
            </div>
            <Skeleton className="h-4 w-32 bg-zinc-100 dark:bg-zinc-900" />
          </div>

          {/* Table View Skeleton */}
          <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-sm">
            <div className="w-full overflow-x-auto">
              <div className="min-w-full">
                <div className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 py-5 px-6 flex justify-between">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-3 w-16 bg-zinc-200 dark:bg-zinc-800" />
                  ))}
                </div>
                <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="py-5 px-6 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1">
                        <Skeleton className="size-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 shrink-0" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32 bg-zinc-100 dark:bg-zinc-900" />
                          <Skeleton className="h-2 w-24 bg-zinc-100 dark:bg-zinc-900" />
                        </div>
                      </div>
                      <Skeleton className="h-4 w-20 bg-zinc-100 dark:bg-zinc-900 hidden md:block" />
                      <Skeleton className="h-6 w-16 bg-zinc-100 dark:bg-zinc-900" />
                      <Skeleton className="h-4 w-24 bg-zinc-100 dark:bg-zinc-900 hidden sm:block" />
                      <Skeleton className="h-6 w-20 rounded-full bg-zinc-100 dark:bg-zinc-900" />
                      <Skeleton className="size-9 rounded-xl bg-zinc-100 dark:bg-zinc-900 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
