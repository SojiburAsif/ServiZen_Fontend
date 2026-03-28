import { Skeleton } from "@/components/ui/skeleton";

const RelatedCardSkeleton = () => (
  <div className="rounded-3xl border border-white/50 bg-white/90 p-6 shadow-sm dark:border-white/10 dark:bg-black/40">
    <div className="flex items-center justify-between">
      <Skeleton className="h-6 w-24 bg-gray-200 dark:bg-slate-700" />
      <Skeleton className="h-4 w-16 bg-green-500/20 dark:bg-green-400/20" />
    </div>
    <div className="mt-4 space-y-2">
      <Skeleton className="h-6 w-2/3 bg-gray-200 dark:bg-slate-700" />
      <Skeleton className="h-4 w-full bg-gray-200 dark:bg-slate-700" />
    </div>
    <div className="mt-6 flex items-center justify-between">
      <Skeleton className="h-8 w-24 bg-gray-200 dark:bg-slate-700" />
      <Skeleton className="h-8 w-16 rounded-full bg-green-600 dark:bg-green-600 shadow-lg" />
    </div>
  </div>
);

export default function ServiceDetailsLoading() {
  return (
    <div className="relative min-h-[calc(100vh-88px)] w-full overflow-hidden bg-gradient-to-br from-[#FAFAFA] via-[#E2F7D8] to-[#80F279] dark:from-[#050505] dark:via-[#0a1f0a] dark:to-[#052e05] text-gray-900 dark:text-white">
      {/* Noise Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      ></div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <Skeleton className="mb-8 h-4 w-32 bg-gray-200 dark:bg-slate-700" />

        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Image Skeleton */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-zinc-900">
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-slate-800">
                <Skeleton className="h-full w-full bg-gray-200 dark:bg-slate-700" />
                <div className="absolute left-4 top-4">
                  <Skeleton className="h-8 w-32 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-lg" />
                </div>
              </div>
            </div>
          </div>

          {/* Details Skeleton */}
          <div className="space-y-6">
            <div className="space-y-4">
              <Skeleton className="h-8 w-40 rounded-full bg-green-500/20 dark:bg-green-400/20" />
              <Skeleton className="h-12 w-3/4 bg-gray-200 dark:bg-slate-700" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full max-w-lg bg-gray-200 dark:bg-slate-700" />
                <Skeleton className="h-4 w-5/6 max-w-lg bg-gray-200 dark:bg-slate-700" />
                <Skeleton className="h-4 w-4/5 max-w-lg bg-gray-200 dark:bg-slate-700" />
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-zinc-900/50">
              <div className="flex items-center gap-3 mb-3">
                <Skeleton className="h-10 w-10 rounded-full bg-gray-200 dark:bg-slate-700" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-24 bg-gray-200 dark:bg-slate-700" />
                  <Skeleton className="h-3 w-32 bg-gray-200 dark:bg-slate-700" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-12 rounded-xl bg-gray-200 dark:bg-slate-700" />
              <Skeleton className="h-12 rounded-xl bg-gray-200 dark:bg-slate-700" />
            </div>

            <div className="flex items-center gap-4 border-t border-gray-200 pt-6 dark:border-gray-800">
              <div>
                <Skeleton className="mb-2 h-3 w-20 bg-gray-200 dark:bg-slate-700" />
                <Skeleton className="h-8 w-32 bg-green-600 dark:bg-green-700" />
              </div>
              <Skeleton className="ml-auto h-12 w-32 rounded-full bg-green-600 dark:bg-green-700" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
