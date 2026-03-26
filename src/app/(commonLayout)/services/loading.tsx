import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, Star, BadgeCheck, Tag, Search, Filter } from "lucide-react";

export default function Loading() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#FAFAFA] via-[#E2F7D8] to-[#80F279] text-gray-900 selection:bg-green-300 dark:from-[#050505] dark:via-[#0a1f0a] dark:to-[#052e05] dark:text-white">
      <div className="pointer-events-none absolute -top-40 right-[-8rem] h-[32rem] w-[32rem] rounded-full bg-emerald-400/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-10rem] left-[-8rem] h-[28rem] w-[28rem] rounded-full bg-lime-400/20 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header Section - Made Bigger */}
        <div className="relative mb-12 overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/60 px-8 py-16 shadow-[0_25px_100px_rgba(16,185,129,0.15)] backdrop-blur-xl dark:border-white/10 dark:bg-black/25 sm:px-12">
          <div className="pointer-events-none absolute -bottom-20 -left-10 select-none text-[200px] font-bold leading-none text-green-800/5 dark:text-green-500/5 md:text-[320px] lg:text-[450px]">
            S Z
          </div>

          <div className="relative text-center">
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-green-600/30 bg-green-500/15 px-6 py-3 text-base font-semibold text-green-700 dark:border-green-400/30 dark:bg-green-500/20 dark:text-green-300">
              <Sparkles className="h-5 w-5 animate-pulse" />
              <Skeleton className="h-5 w-40 bg-green-500/30 dark:bg-green-400/30" />
            </div>

            <Skeleton className="mx-auto mb-6 h-16 w-4/5 bg-gray-300/60 dark:bg-slate-700/60" />
            <div className="space-y-3">
              <Skeleton className="mx-auto h-5 w-full max-w-2xl bg-gray-300/40 dark:bg-slate-700/40" />
              <Skeleton className="mx-auto h-5 w-3/4 max-w-xl bg-gray-300/40 dark:bg-slate-700/40" />
            </div>
          </div>
        </div>

        {/* Services Grid Section - Made Bigger and More Card-Like */}
        <section className="relative overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/30 p-8 shadow-[0_30px_150px_rgba(15,23,42,0.25)] backdrop-blur-2xl dark:border-white/10 dark:bg-black/30 sm:p-10 lg:p-12">
          <div className="pointer-events-none absolute -right-20 top-0 h-80 w-80 rounded-full bg-green-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-lime-400/20 blur-3xl" />

          {/* Stats Cards - Made Bigger */}
          <div className="relative mb-12 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-green-600/30 bg-green-500/15 px-6 py-3 text-base font-semibold text-green-700 dark:border-green-400/30 dark:bg-green-500/20 dark:text-green-300">
                <Sparkles className="h-5 w-5 animate-pulse" />
                <Skeleton className="h-5 w-48 bg-green-500/30 dark:bg-green-400/30" />
              </div>

              <Skeleton className="mb-6 h-14 w-3/4 bg-gray-300/60 dark:bg-slate-700/60" />
              <div className="space-y-4">
                <Skeleton className="h-5 w-full max-w-2xl bg-gray-300/40 dark:bg-slate-700/40" />
                <Skeleton className="h-5 w-4/5 max-w-xl bg-gray-300/40 dark:bg-slate-700/40" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 sm:min-w-[400px]">
              <div className="rounded-3xl border border-white/50 bg-white/30 p-6 text-center shadow-lg backdrop-blur dark:border-white/10 dark:bg-black/40">
                <div className="mb-2 flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
                  <Star className="h-5 w-5 fill-current animate-pulse" />
                  <Skeleton className="h-7 w-10 bg-green-500/30 dark:bg-green-400/30" />
                </div>
                <Skeleton className="mx-auto h-4 w-16 bg-gray-300/30 dark:bg-slate-700/30" />
              </div>

              <div className="rounded-3xl border border-white/50 bg-white/30 p-6 text-center shadow-lg backdrop-blur dark:border-white/10 dark:bg-black/40">
                <div className="mb-2 flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
                  <BadgeCheck className="h-5 w-5 animate-pulse" />
                  <Skeleton className="h-7 w-10 bg-green-500/30 dark:bg-green-400/30" />
                </div>
                <Skeleton className="mx-auto h-4 w-16 bg-gray-300/30 dark:bg-slate-700/30" />
              </div>

              <div className="rounded-3xl border border-white/50 bg-white/30 p-6 text-center shadow-lg backdrop-blur dark:border-white/10 dark:bg-black/40">
                <div className="mb-2 flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
                  <Tag className="h-5 w-5 animate-pulse" />
                  <Skeleton className="h-7 w-10 bg-green-500/30 dark:bg-green-400/30" />
                </div>
                <Skeleton className="mx-auto h-4 w-20 bg-gray-300/30 dark:bg-slate-700/30" />
              </div>
            </div>
          </div>

          {/* Filters Section - Made Bigger */}
          <div className="relative mb-12 grid gap-6 lg:grid-cols-[1.2fr_0.6fr_0.6fr_0.6fr]">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-green-600 dark:text-green-400" />
                <Skeleton className="h-4 w-20 bg-gray-300/30 dark:bg-slate-700/30" />
              </div>
              <Skeleton className="h-16 w-full rounded-3xl bg-white/70 dark:bg-black/40 shadow-inner" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-green-600 dark:text-green-400" />
                <Skeleton className="h-4 w-24 bg-gray-300/30 dark:bg-slate-700/30" />
              </div>
              <Skeleton className="h-16 w-full rounded-3xl bg-white/70 dark:bg-black/40 shadow-inner" />
            </div>

            <div className="space-y-3">
              <Skeleton className="h-4 w-20 bg-gray-300/30 dark:bg-slate-700/30" />
              <Skeleton className="h-16 w-full rounded-3xl bg-white/70 dark:bg-black/40 shadow-inner" />
            </div>

            <div className="space-y-3">
              <Skeleton className="h-4 w-16 bg-gray-300/30 dark:bg-slate-700/30" />
              <Skeleton className="h-16 w-full rounded-3xl bg-white/70 dark:bg-black/40 shadow-inner" />
            </div>
          </div>

          {/* Service Cards Grid - Made Much Bigger and More Card-Like */}
          <div className="relative grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {[...Array(9)].map((_, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/80 shadow-[0_20px_80px_rgba(15,23,42,0.15)] transition-all duration-300 hover:shadow-[0_30px_120px_rgba(15,23,42,0.25)] dark:border-white/15 dark:bg-black/40"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 via-transparent to-green-500/8 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Image Placeholder - Made Bigger */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-slate-800">
                  <Skeleton className="h-full w-full bg-gray-200 dark:bg-slate-700" />

                  {/* Badge - Made Bigger */}
                  <div className="absolute left-6 top-6">
                    <Skeleton className="h-8 w-24 rounded-full bg-white/95 dark:bg-black/90 shadow-lg" />
                  </div>

                  {/* Status Badge - Made Bigger */}
                  <div className="absolute right-6 top-6">
                    <Skeleton className="h-8 w-28 rounded-full bg-green-500/90 dark:bg-green-600/90 shadow-lg" />
                  </div>

                  {/* Bottom Badges - Made Bigger */}
                  <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                    <Skeleton className="h-8 w-36 rounded-full bg-black/40 shadow-lg" />
                    <Skeleton className="h-8 w-32 rounded-full bg-black/40 shadow-lg" />
                  </div>
                </div>

                {/* Content - Made Bigger */}
                <div className="relative flex h-full flex-col p-8">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <Skeleton className="h-7 w-4/5 bg-gray-200 dark:bg-slate-700" />
                    <Skeleton className="h-7 w-20 rounded-full bg-green-500/15 dark:bg-green-400/15" />
                  </div>

                  <div className="space-y-3 mb-6 flex-1">
                    <Skeleton className="h-5 w-full bg-gray-200 dark:bg-slate-700" />
                    <Skeleton className="h-5 w-5/6 bg-gray-200 dark:bg-slate-700" />
                    <Skeleton className="h-5 w-4/6 bg-gray-200 dark:bg-slate-700" />
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-200/50 dark:border-slate-700/50">
                    <Skeleton className="h-4 w-24 bg-gray-200 dark:bg-slate-700" />
                    <Skeleton className="h-12 w-12 rounded-full bg-green-600 dark:bg-green-600 shadow-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
