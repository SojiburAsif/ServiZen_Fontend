"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function MyPaymentsLoading() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-emerald-50 to-green-50 dark:from-black dark:via-green-950 dark:to-black text-zinc-900 dark:text-zinc-100 p-4 sm:p-8">
      <div className="mx-auto max-w-7xl">
        
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <Skeleton className="h-12 w-72 rounded-xl mb-4" />
            <Skeleton className="h-5 w-96 rounded-lg" />
          </div>
          
          <div className="flex items-center gap-4 bg-white/90 dark:bg-green-900/20 p-4 rounded-2xl border border-emerald-200 dark:border-green-800">
            <Skeleton className="size-10 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-3 w-16 rounded-lg mb-2" />
              <Skeleton className="h-6 w-32 rounded-lg" />
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2 bg-white/90 dark:bg-green-900/20 border border-emerald-200 dark:border-green-800 p-1 rounded-xl">
            <Skeleton className="h-10 w-24 rounded-lg" />
            <Skeleton className="h-10 w-24 rounded-lg" />
          </div>
          
          <Skeleton className="h-4 w-40 rounded-lg" />
        </div>

        {/* Table Skeleton */}
        <div className="rounded-2xl border border-emerald-200 dark:border-green-800 bg-white/90 dark:bg-green-900/20 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-emerald-50/50 dark:bg-green-900/10">
                <tr>
                  <th className="text-left py-5 px-6">
                    <Skeleton className="h-4 w-24 rounded-lg" />
                  </th>
                  <th className="text-left py-5 px-6">
                    <Skeleton className="h-4 w-20 rounded-lg" />
                  </th>
                  <th className="text-left py-5 px-6">
                    <Skeleton className="h-4 w-16 rounded-lg" />
                  </th>
                  <th className="text-left py-5 px-6">
                    <Skeleton className="h-4 w-20 rounded-lg" />
                  </th>
                  <th className="text-center py-5 px-6">
                    <Skeleton className="h-4 w-16 rounded-lg mx-auto" />
                  </th>
                  <th className="text-right py-5 px-6">
                    <Skeleton className="h-4 w-12 rounded-lg ml-auto" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5, 6].map((index) => (
                  <tr key={index} className="border-t border-emerald-100 dark:border-green-800/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="size-8 rounded-lg" />
                        <div className="flex-1">
                          <Skeleton className="h-4 w-32 rounded-lg mb-2" />
                          <Skeleton className="h-3 w-24 rounded-lg" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Skeleton className="size-3 rounded" />
                        <Skeleton className="h-4 w-28 rounded-lg" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-5 w-20 rounded-lg" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-24 rounded-lg" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Skeleton className="h-6 w-16 rounded-full mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Skeleton className="h-8 w-8 rounded-full ml-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
