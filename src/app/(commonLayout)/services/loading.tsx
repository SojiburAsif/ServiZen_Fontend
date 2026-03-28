import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, Star, BadgeCheck, Tag, Search, Filter } from "lucide-react";

export default function Loading() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#FAFAFA] via-[#E2F7D8] to-[#80F279] dark:from-[#050505] dark:via-[#0a1f0a] dark:to-[#052e05] text-gray-900 dark:text-white">
      {/* Noise Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      ></div>

      {/* Decorative Background Text */}
      <div className="pointer-events-none absolute -bottom-20 -left-10 select-none text-[300px] md:text-[400px] font-bold text-green-800/5 dark:text-green-500/5 leading-none">
        S Z
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="relative mb-12 px-6 py-8">
          <div className="relative">
            <Skeleton className="mb-4 h-10 w-48 bg-gray-200 dark:bg-slate-700" />
            <Skeleton className="mb-6 h-8 w-64 bg-gray-200 dark:bg-slate-700" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full max-w-xl bg-gray-200 dark:bg-slate-700" />
              <Skeleton className="h-4 w-5/6 max-w-lg bg-gray-200 dark:bg-slate-700" />
            </div>
          </div>
        </div>

        {/* Services Grid Section */}
        <section className="relative">


          {/* Service Cards Grid - Made Much Bigger and More Card-Like */}
          <div className="relative grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {[...Array(9)].map((_, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 dark:border-gray-800 dark:bg-zinc-900"
              >
                {/* Image Placeholder */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-slate-800">
                  <Skeleton className="h-full w-full bg-gray-200 dark:bg-slate-700" />

                  {/* Badge */}
                  <div className="absolute left-4 top-4">
                    <Skeleton className="h-7 w-20 rounded-full bg-white/90 dark:bg-gray-800/90" />
                  </div>

                  {/* Price Badge */}
                  <div className="absolute right-4 top-4">
                    <Skeleton className="h-7 w-24 rounded-full bg-green-600/90 dark:bg-green-700/90" />
                  </div>
                </div>

                {/* Content */}
                <div className="relative flex h-full flex-col p-6">
                  <Skeleton className="mb-3 h-6 w-4/5 bg-gray-200 dark:bg-slate-700" />

                  <div className="mb-4 space-y-2 flex-1">
                    <Skeleton className="h-4 w-full bg-gray-200 dark:bg-slate-700" />
                    <Skeleton className="h-4 w-5/6 bg-gray-200 dark:bg-slate-700" />
                    <Skeleton className="h-4 w-4/6 bg-gray-200 dark:bg-slate-700" />
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-800">
                    <Skeleton className="h-4 w-20 bg-gray-200 dark:bg-slate-700" />
                    <Skeleton className="h-10 w-10 rounded-full bg-green-600 dark:bg-green-700" />
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
