import { Skeleton } from "@/components/ui/skeleton";

export default function AddReviewLoading() {
  return (
    <main className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 flex flex-col items-center justify-center">
      <div className="w-full max-w-lg px-4 py-8">
        
        {/* Header Skeleton */}
        <div className="mb-10 text-center space-y-3">
          <div className="flex justify-center">
             <Skeleton className="h-7 w-40 rounded-full bg-zinc-100 dark:bg-zinc-900" />
          </div>
          <div className="flex justify-center">
            <Skeleton className="h-10 w-64 bg-zinc-100 dark:bg-zinc-900 rounded-lg" />
          </div>
          <div className="flex justify-center">
             <Skeleton className="h-4 w-80 bg-zinc-100 dark:bg-zinc-900 rounded-lg" />
          </div>
        </div>

        {/* Content Area Skeleton */}
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8 md:p-10 shadow-sm">
          <div className="space-y-8">
            {/* Booking Select Skeleton */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-32 bg-zinc-100 dark:bg-zinc-900 rounded" />
              <Skeleton className="h-12 w-full bg-zinc-50 dark:bg-zinc-900/50 rounded-xl" />
            </div>

            {/* Rating Skeleton */}
            <div className="space-y-3 text-center">
              <Skeleton className="h-4 w-24 bg-zinc-100 dark:bg-zinc-900 rounded mx-auto" />
              <div className="flex justify-center gap-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="size-10 rounded-xl bg-zinc-100 dark:bg-zinc-900" />
                ))}
              </div>
            </div>

            {/* Comment Skeleton */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-36 bg-zinc-100 dark:bg-zinc-900 rounded" />
              <Skeleton className="h-32 w-full bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl" />
            </div>

            {/* Button Skeleton */}
            <Skeleton className="h-14 w-full bg-emerald-500/10 rounded-2xl" />
          </div>
        </div>

        {/* Footer Skeleton */}
        <div className="mt-10 flex flex-col items-center gap-4">
          <Skeleton className="h-px w-12 bg-zinc-200 dark:bg-zinc-800" />
          <Skeleton className="h-3 w-40 bg-zinc-100 dark:bg-zinc-900 rounded" />
        </div>
      </div>
    </main>
  );
}
