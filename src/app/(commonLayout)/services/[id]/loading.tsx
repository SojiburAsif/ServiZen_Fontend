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
    <div className="relative min-h-[calc(100vh-88px)] w-full overflow-hidden bg-gradient-to-br from-[#FAFAFA] via-[#E2F7D8] to-[#80F279] text-gray-900 selection:bg-green-300 dark:from-[#050505] dark:via-[#0a1f0a] dark:to-[#052e05] dark:text-white">
      <div className="pointer-events-none absolute -top-40 right-[-8rem] h-[32rem] w-[32rem] rounded-full bg-green-400/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-10rem] left-[-8rem] h-[28rem] w-[28rem] rounded-full bg-lime-400/20 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/50 bg-white/70 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm backdrop-blur dark:border-white/10 dark:bg-black/20 dark:text-slate-200">
          <Skeleton className="h-4 w-4 rounded-full bg-gray-300 dark:bg-slate-700" />
          <Skeleton className="h-4 w-32 bg-gray-300 dark:bg-slate-700" />
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative">
            <div className="absolute -right-4 -top-4 h-28 w-28 rounded-3xl bg-green-500 sm:-right-6 sm:-top-6 sm:h-36 sm:w-36 lg:h-44 lg:w-44" />
            <div className="absolute -left-4 -bottom-4 h-28 w-28 rounded-3xl border border-white/60 bg-white/60 backdrop-blur sm:-left-6 sm:-bottom-6 sm:h-36 sm:w-36 lg:h-44 lg:w-44" />

            <div className="relative z-10 overflow-hidden rounded-[2rem] border border-white/50 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-black/40">
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-slate-800">
                <Skeleton className="h-full w-full bg-gray-200 dark:bg-slate-700" />

                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

                <div className="absolute left-5 top-5">
                  <Skeleton className="h-10 w-32 rounded-full bg-white/95 dark:bg-black/90 shadow-lg" />
                </div>

                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
                  <Skeleton className="h-8 w-40 rounded-full bg-black/30 shadow-lg" />
                  <Skeleton className="h-8 w-36 rounded-full bg-green-500/90 shadow-lg" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <Skeleton className="h-10 w-40 rounded-full bg-green-500/20 dark:bg-green-400/20" />

              <Skeleton className="h-16 w-3/4 bg-gray-200 dark:bg-slate-700" />

              <div className="space-y-2">
                <Skeleton className="h-5 w-full max-w-2xl bg-gray-200 dark:bg-slate-700" />
                <Skeleton className="h-5 w-5/6 max-w-2xl bg-gray-200 dark:bg-slate-700" />
                <Skeleton className="h-5 w-4/6 max-w-2xl bg-gray-200 dark:bg-slate-700" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Skeleton className="h-16 w-full rounded-2xl bg-white/70 dark:bg-black/40" />
              <Skeleton className="h-16 w-full rounded-2xl bg-white/70 dark:bg-black/40" />
              <Skeleton className="h-16 w-full rounded-2xl bg-white/70 dark:bg-black/40" />
              <Skeleton className="h-16 w-full rounded-2xl bg-white/70 dark:bg-black/40" />
            </div>

            <div className="rounded-[1.75rem] border border-white/50 bg-white/70 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-black/40 sm:p-6">
              <Skeleton className="h-5 w-32 mb-4 bg-gray-200 dark:bg-slate-700" />
              <div className="grid gap-3 sm:grid-cols-2">
                <Skeleton className="h-4 w-full bg-gray-200 dark:bg-slate-700" />
                <Skeleton className="h-4 w-full bg-gray-200 dark:bg-slate-700" />
                <Skeleton className="h-4 w-full bg-gray-200 dark:bg-slate-700" />
                <Skeleton className="h-4 w-full bg-gray-200 dark:bg-slate-700" />
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Skeleton className="h-14 w-full rounded-full bg-green-600 shadow-lg dark:bg-green-600" />
              <Skeleton className="h-14 w-full rounded-full border border-white/60 bg-white/70 dark:border-white/10 dark:bg-black/40" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
