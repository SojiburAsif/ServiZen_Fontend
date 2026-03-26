import { Skeleton } from "@/components/ui/skeleton";

const repeat = (count: number) => Array.from({ length: count });

type HeaderSkeletonProps = {
  showBadge?: boolean;
  descriptionLines?: number;
  actionCount?: number;
};

export const DashboardHeaderSkeleton = ({ showBadge = false, descriptionLines = 2, actionCount = 0 }: HeaderSkeletonProps) => (
  <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
    <div className="space-y-3">
      {showBadge ? <Skeleton className="h-5 w-36 rounded-full" /> : null}
      <Skeleton className="h-10 w-64" />
      {repeat(descriptionLines).map((_, index) => (
        <Skeleton key={index} className="h-4 w-72 max-w-full" />
      ))}
    </div>
    {actionCount > 0 ? (
      <div className="flex flex-wrap gap-3">
        {repeat(actionCount).map((_, index) => (
          <Skeleton key={index} className="h-12 w-40 rounded-xl" />
        ))}
      </div>
    ) : null}
  </header>
);

type StatGridSkeletonProps = {
  cards?: number;
};

export const DashboardStatGridSkeleton = ({ cards = 3 }: StatGridSkeletonProps) => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {repeat(cards).map((_, index) => (
      <div key={index} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-6 w-32" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

type TableSkeletonProps = {
  rows?: number;
  columns?: number;
};

export const DashboardTableSkeleton = ({ rows = 4, columns = 4 }: TableSkeletonProps) => (
  <div className="rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
    <div className="flex items-center justify-between border-b border-slate-100 p-4 dark:border-zinc-800">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-10 w-32" />
    </div>
    <div className="divide-y divide-slate-100 dark:divide-zinc-800">
      {repeat(rows).map((_, rowIndex) => (
        <div key={rowIndex} className="flex items-center gap-4 px-4 py-3">
          {repeat(columns).map((_, columnIndex) => (
            <Skeleton key={columnIndex} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  </div>
);

type CardListSkeletonProps = {
  cards?: number;
};

export const DashboardCardListSkeleton = ({ cards = 3 }: CardListSkeletonProps) => (
  <div className="grid gap-4 md:grid-cols-2">
    {repeat(cards).map((_, index) => (
      <div key={index} className="rounded-2xl border border-dashed border-slate-200 p-4 dark:border-zinc-800">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="mt-2 h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-5/6" />
      </div>
    ))}
  </div>
);

type ChartSkeletonProps = {
  bars?: number;
};

export const DashboardChartSkeleton = ({ bars = 6 }: ChartSkeletonProps) => (
  <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
    <Skeleton className="h-5 w-36" />
    <div className="mt-6 flex h-40 items-end gap-2">
      {repeat(bars).map((_, index) => (
        <div key={index} className="flex flex-1 flex-col items-center gap-2">
          <Skeleton className="h-5 w-10" />
          <div className="w-full rounded-full bg-slate-100 dark:bg-zinc-800">
            <Skeleton className="mx-auto block h-24 w-3 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const DashboardProfileSkeleton = () => (
  <div className="space-y-8">
    <div className="rounded-[32px] border border-slate-100 bg-white/80 p-8 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-5 py-4 dark:border-emerald-500/30 dark:bg-emerald-500/10">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-5 w-32" />
          </div>
        </div>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {repeat(4).map((_, index) => (
          <Skeleton key={index} className="h-16 rounded-2xl" />
        ))}
      </div>
    </div>
    <div className="grid gap-4 md:grid-cols-2">
      {repeat(2).map((_, index) => (
        <div key={index} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <Skeleton className="h-5 w-32" />
          <div className="mt-4 space-y-3">
            {repeat(3).map((__, innerIndex) => (
              <Skeleton key={innerIndex} className="h-4 w-full" />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const DashboardFormSkeleton = () => (
  <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
    <Skeleton className="h-8 w-60" />
    <div className="mt-6 space-y-4">
      {repeat(5).map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-11 w-full" />
        </div>
      ))}
    </div>
    <div className="mt-8 flex flex-wrap gap-3">
      <Skeleton className="h-10 w-32" />
      <Skeleton className="h-10 w-24" />
    </div>
  </div>
);
