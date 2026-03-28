"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function AddReviewLoading() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-emerald-50 to-green-50 px-4 py-6 text-slate-900 dark:from-black dark:via-green-950 dark:to-black dark:text-white sm:px-6 sm:py-10">
      <div className="mx-auto max-w-4xl">

        {/* HEADER SKELETON */}
        <div className="relative overflow-hidden rounded-[2rem] border border-emerald-200 bg-white/90 p-6 shadow-2xl backdrop-blur-xl dark:border-green-800 dark:bg-green-900/20 sm:p-8">
          <div className="relative">
            <div className="mb-4 inline-flex items-center gap-2">
              <Skeleton className="h-8 w-40 rounded-full" />
            </div>

            <Skeleton className="h-12 w-64 rounded-xl mb-4" />
            <Skeleton className="h-5 w-96 rounded-lg" />
          </div>
        </div>

        {/* FORM CARD SKELETON */}
        <div className="mt-8 rounded-[2rem] border border-emerald-200 bg-white/90 p-6 shadow-2xl backdrop-blur-xl dark:border-green-800 dark:bg-green-900/20 sm:p-8">
          
          {/* Booking Select */}
          <div className="mb-8">
            <Skeleton className="h-5 w-32 rounded-lg mb-3" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>

          {/* Rating Section */}
          <div className="mb-8">
            <Skeleton className="h-5 w-24 rounded-lg mb-3" />
            <div className="flex gap-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-10 w-10 rounded-lg" />
              ))}
            </div>
          </div>

          {/* Comment Section */}
          <div className="mb-8">
            <Skeleton className="h-5 w-36 rounded-lg mb-3" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>

          {/* Review Details Cards */}
          <div className="mb-8 grid gap-4 md:grid-cols-2">
            {[1, 2].map((i) => (
              <div key={i} className="rounded-2xl border border-emerald-100 dark:border-green-800/50 bg-emerald-50/50 dark:bg-green-900/10 p-4">
                <Skeleton className="h-4 w-24 rounded-lg mb-3" />
                <Skeleton className="h-6 w-32 rounded-lg" />
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4 border-t border-emerald-100 dark:border-green-800/50">
            <Skeleton className="h-12 w-32 rounded-xl" />
            <Skeleton className="h-12 w-32 rounded-xl" />
          </div>
        </div>
      </div>
    </main>
  );
}
