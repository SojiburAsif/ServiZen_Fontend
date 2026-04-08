"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function MyBookingsLoading() {
  return (
    <main className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-100">
      <div className="mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="mb-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20 p-6 shadow-sm backdrop-blur-xl sm:p-8">
          <Skeleton className="h-12 w-48 rounded-xl" />
          <Skeleton className="mt-3 h-5 w-64 rounded-lg" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
          {[1, 2, 3, 4].map((index) => (
            <div
              key={index}
              className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-6 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-2xl" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-24 rounded-lg" />
                  <Skeleton className="mt-2 h-8 w-16 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Table Skeleton */}
        <div className="overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-[1200px] w-full">
              <thead className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th className="px-6 py-5 text-left text-[11px] font-bold uppercase text-zinc-500">#</th>
                  <th className="px-6 py-5 text-left text-[11px] font-bold uppercase text-zinc-500">Service</th>
                  <th className="px-6 py-5 text-left text-[11px] font-bold uppercase text-zinc-500">Date & Time</th>
                  <th className="px-6 py-5 text-left text-[11px] font-bold uppercase text-zinc-500">Location</th>
                  <th className="px-6 py-5 text-left text-[11px] font-bold uppercase text-zinc-500">Amount</th>
                  <th className="px-6 py-5 text-left text-[11px] font-bold uppercase text-zinc-500">Status</th>
                  <th className="px-6 py-5 text-left text-[11px] font-bold uppercase text-zinc-500">Payment</th>
                  <th className="px-6 py-5 text-left text-[11px] font-bold uppercase text-zinc-500">Actions</th>
                </tr>
              </thead>

              <tbody>
                {[1, 2, 3, 4, 5, 6].map((index) => (
                  <tr
                    key={index}
                    className="border-t border-zinc-200 dark:border-zinc-800"
                  >
                    {/* Index */}
                    <td className="px-6 py-5 align-top">
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </td>

                    {/* Service */}
                    <td className="px-6 py-5 align-top">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-11 w-11 rounded-2xl" />
                        <div className="flex-1">
                          <Skeleton className="h-5 w-32 rounded-lg" />
                          <Skeleton className="mt-2 h-4 w-24 rounded-lg" />
                        </div>
                      </div>
                    </td>

                    {/* Date & Time */}
                    <td className="px-6 py-5 align-top">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-xl" />
                        <div className="flex-1">
                          <Skeleton className="h-5 w-28 rounded-lg" />
                          <Skeleton className="mt-2 h-4 w-20 rounded-lg" />
                        </div>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-6 py-5 align-top">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-xl" />
                        <div className="flex-1">
                          <Skeleton className="h-5 w-24 rounded-lg" />
                          <Skeleton className="mt-2 h-4 w-40 rounded-lg" />
                        </div>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-5 align-top">
                      <Skeleton className="h-7 w-20 rounded-lg" />
                    </td>

                    {/* Status */}
                    <td className="px-6 py-5 align-top">
                      <div className="flex flex-col gap-2">
                        <Skeleton className="h-8 w-28 rounded-full" />
                        <Skeleton className="h-8 w-24 rounded-full" />
                      </div>
                    </td>

                    {/* Payment */}
                    <td className="px-6 py-5 align-top">
                      <div className="flex flex-col gap-2">
                        <Skeleton className="h-8 w-20 rounded-full" />
                        <Skeleton className="h-8 w-20 rounded-full" />
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-5 align-top">
                      <div className="flex flex-col gap-2">
                        <Skeleton className="h-10 w-28 rounded-xl" />
                        <Skeleton className="h-6 w-32 rounded-full" />
                      </div>
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
