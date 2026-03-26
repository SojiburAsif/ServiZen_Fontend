import { Skeleton } from "@/components/ui/skeleton";

const ServiceCardSkeleton = () => (
  <div className="rounded-3xl border border-slate-100 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
    <div className="flex items-center justify-between">
      <Skeleton className="h-6 w-28 rounded-full" />
      <Skeleton className="h-4 w-24" />
    </div>
    <div className="mt-4 space-y-3">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
    <div className="mt-6 space-y-4">
      <Skeleton className="h-10 w-32" />
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  </div>
);

export default function ServicesLoading() {
  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:px-6 lg:px-0">
      <div className="rounded-[32px] bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 p-8 text-white shadow-xl">
        <Skeleton className="h-4 w-40 bg-white/40" />
        <div className="mt-4 space-y-4">
          <Skeleton className="h-10 w-3/4 bg-white/50" />
          <Skeleton className="h-4 w-full bg-white/30" />
          <Skeleton className="h-4 w-2/3 bg-white/30" />
        </div>
        <div className="mt-6 flex flex-wrap gap-6">
          <Skeleton className="h-16 w-36 bg-white/30" />
          <Skeleton className="h-16 w-24 bg-white/30" />
        </div>
      </div>

      <div className="rounded-3xl border border-slate-100 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <ServiceCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
