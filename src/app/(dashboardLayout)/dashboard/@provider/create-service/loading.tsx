import { DashboardHeaderSkeleton, DashboardFormSkeleton } from "@/components/modules/dashboard/dashboard-loading";

export default function ProviderCreateServiceLoading() {
  return (
    <section className="mx-auto max-w-7xl space-y-8">
      {/* Header Skeleton */}
      <div className="opacity-70">
        <DashboardHeaderSkeleton showBadge descriptionLines={2} actionCount={1} />
      </div>

      {/* Form Container Skeleton */}
      <div className="rounded-[2.5rem] border border-zinc-100 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="opacity-50 animate-pulse">
          <DashboardFormSkeleton />
        </div>
      </div>
    </section>
  );
}