import { Skeleton } from "@/components/ui/skeleton";

const repeat = (count: number) => Array.from({ length: count });

type HeaderSkeletonProps = {
  showBadge?: boolean;
  descriptionLines?: number;
  actionCount?: number;
};

// --- Dashboard Header Skeleton ---
export const DashboardHeaderSkeleton = ({ showBadge = false, descriptionLines = 2, actionCount = 0 }: HeaderSkeletonProps) => (
  <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
    <div className="space-y-3">
      {showBadge ? <Skeleton className="h-5 w-36 rounded-full bg-slate-200 dark:bg-zinc-800" /> : null}
      <Skeleton className="h-10 w-64 bg-slate-200 dark:bg-zinc-800" />
      {repeat(descriptionLines).map((_, index) => (
        <Skeleton key={index} className="h-4 w-72 max-w-full bg-slate-100 dark:bg-zinc-900" />
      ))}
    </div>
    {actionCount > 0 ? (
      <div className="flex flex-wrap gap-3">
        {repeat(actionCount).map((_, index) => (
          <Skeleton key={index} className="h-12 w-40 rounded-xl bg-slate-200 dark:bg-zinc-800" />
        ))}
      </div>
    ) : null}
  </header>
);

type StatGridSkeletonProps = {
  cards?: number;
};

// --- Stats Grid Skeleton ---
export const DashboardStatGridSkeleton = ({ cards = 3 }: StatGridSkeletonProps) => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {repeat(cards).map((_, index) => (
      <div key={index} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-black">
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-zinc-900" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-24 bg-slate-100 dark:bg-zinc-900" />
            <Skeleton className="h-6 w-32 bg-slate-200 dark:bg-zinc-800" />
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

// --- Table Skeleton ---
export const DashboardTableSkeleton = ({ rows = 4, columns = 4 }: TableSkeletonProps) => (
  <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-black overflow-hidden">
    <div className="flex items-center justify-between border-b border-slate-100 p-4 dark:border-zinc-800">
      <Skeleton className="h-5 w-40 bg-slate-200 dark:bg-zinc-800" />
      <Skeleton className="h-10 w-32 bg-slate-100 dark:bg-zinc-900" />
    </div>
    <div className="divide-y divide-slate-100 dark:divide-zinc-800">
      {repeat(rows).map((_, rowIndex) => (
        <div key={rowIndex} className="flex items-center gap-4 px-4 py-4">
          {repeat(columns).map((_, columnIndex) => (
            <Skeleton key={columnIndex} className="h-4 flex-1 bg-slate-100 dark:bg-zinc-900" />
          ))}
        </div>
      ))}
    </div>
  </div>
);

// --- Profile Skeleton ---
export const DashboardProfileSkeleton = () => (
  <div className="space-y-8">
    <div className="rounded-[32px] border border-slate-200 bg-white p-8 dark:border-zinc-800 dark:bg-black">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <Skeleton className="h-4 w-32 bg-slate-100 dark:bg-zinc-900" />
          <Skeleton className="h-10 w-64 bg-slate-200 dark:bg-zinc-800" />
          <Skeleton className="h-4 w-48 bg-slate-100 dark:bg-zinc-900" />
        </div>
        {/* Removed Emerald Colors here */}
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 dark:border-zinc-800 dark:bg-zinc-900/50">
          <Skeleton className="h-12 w-12 rounded-full bg-slate-200 dark:bg-zinc-800" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-24 bg-slate-200 dark:bg-zinc-800" />
            <Skeleton className="h-5 w-32 bg-slate-300 dark:bg-zinc-700" />
          </div>
        </div>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {repeat(4).map((_, index) => (
          <Skeleton key={index} className="h-16 rounded-2xl bg-slate-100 dark:bg-zinc-900" />
        ))}
      </div>
    </div>
  </div>
);

// --- Form Skeleton ---
export const DashboardFormSkeleton = () => (
  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-black">
    <Skeleton className="h-8 w-60 bg-slate-200 dark:bg-zinc-800" />
    <div className="mt-6 space-y-6">
      {repeat(4).map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="h-3 w-24 bg-slate-200 dark:bg-zinc-800" />
          <Skeleton className="h-12 w-full rounded-xl bg-slate-50 dark:bg-zinc-900/50" />
        </div>
      ))}
    </div>
    <div className="mt-10 flex gap-3">
      <Skeleton className="h-11 w-32 rounded-xl bg-slate-900 dark:bg-white" />
      <Skeleton className="h-11 w-32 rounded-xl bg-slate-200 dark:bg-zinc-800" />
    </div>
  </div>
);
// --- Chart Skeleton ---
export const DashboardChartSkeleton = ({ bars }: { bars?: number } = {}) => {
  // Use a deterministic pseudo-random height based on index to avoid impure React renders
  const getDeterministicHeight = (index: number) => {
    const heights = [40, 75, 30, 90, 50, 85, 60, 25, 65, 45];
    return heights[index % heights.length];
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-black">
      <Skeleton className="h-6 w-40 bg-slate-200 dark:bg-zinc-800 mb-6" />
      <div className="flex h-64 items-end gap-2">
        {repeat(bars || 6).map((_, index) => (
          <Skeleton 
            key={index} 
            className="w-full bg-slate-100 dark:bg-zinc-900 rounded-t-xl" 
            style={{ height: `${getDeterministicHeight(index)}%` }} 
          />
        ))}
      </div>
    </div>
  );
};

// --- Card List Skeleton ---
export const DashboardCardListSkeleton = ({ count = 3 }: { count?: number }) => (
  <div className="space-y-4">
    {repeat(count).map((_, index) => (
      <div key={index} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-black">
        <Skeleton className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-zinc-900 shrink-0" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-1/3 bg-slate-200 dark:bg-zinc-800" />
          <Skeleton className="h-3 w-1/2 bg-slate-100 dark:bg-zinc-900" />
        </div>
      </div>
    ))}
  </div>
);