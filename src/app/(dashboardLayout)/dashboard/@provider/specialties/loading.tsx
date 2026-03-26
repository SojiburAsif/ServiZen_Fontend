import {
  DashboardHeaderSkeleton,
  DashboardStatGridSkeleton,
  DashboardTableSkeleton,
} from "@/components/modules/dashboard/dashboard-loading";

export default function ProviderSpecialtiesLoading() {
  return (
    <section className="space-y-6 p-6">
      <DashboardHeaderSkeleton showBadge descriptionLines={2} actionCount={2} />
      <DashboardStatGridSkeleton cards={2} />
      <DashboardTableSkeleton rows={6} columns={4} />
    </section>
  );
}
