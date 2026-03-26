import { Skeleton } from "@/components/ui/skeleton";

const RelatedCardSkeleton = () => (
  <div className="rounded-3xl border border-slate-100 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
    <div className="flex items-center justify-between">
      <Skeleton className="h-6 w-24" />
      <Skeleton className="h-4 w-16" />
    </div>
    <div className="mt-4 space-y-2">
      <Skeleton className="h-6 w-2/3" />
      <Skeleton className="h-4 w-full" />
    </div>
    <div className="mt-6 flex items-center justify-between">
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-8 w-16" />
    </div>
  </div>
);

export default function ServiceDetailsLoading() {
  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-10 sm:px-6 lg:px-0">
      <div className="flex items-center gap-3 text-sm text-slate-500">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-32" />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
        <section className="space-y-6">
          <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow-xl">
            <Skeleton className="h-4 w-32 bg-white/30" />
            <div className="mt-6 space-y-4">
              <Skeleton className="h-10 w-3/4 bg-white/40" />
              <Skeleton className="h-4 w-full bg-white/30" />
              <Skeleton className="h-4 w-5/6 bg-white/30" />
            </div>
            <div className="mt-8 flex flex-wrap gap-6">
              <Skeleton className="h-16 w-40 bg-white/30" />
              <Skeleton className="h-10 w-32 bg-white/30" />
            </div>
            <Skeleton className="mt-8 h-64 w-full rounded-2xl bg-white/20" />
          </div>

          <div className="rounded-3xl border-slate-100 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
            <Skeleton className="h-4 w-24" />
            <div className="mt-4 space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-3xl border-slate-100 bg-white/95 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="mt-2 h-8 w-2/3" />
            <div className="mt-6 space-y-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          <div className="rounded-3xl border border-dashed border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="mt-3 h-6 w-3/4" />
            <Skeleton className="mt-2 h-4 w-full" />
            <Skeleton className="mt-2 h-10 w-full" />
          </div>
        </aside>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <RelatedCardSkeleton key={index} />
          ))}
        </div>
      </section>
    </div>
  );
}
