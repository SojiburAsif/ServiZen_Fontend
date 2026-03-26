import {
  DashboardHeaderSkeleton,
  DashboardStatGridSkeleton,
  DashboardChartSkeleton,
  DashboardTableSkeleton,
} from "@/components/modules/dashboard/dashboard-loading";

export default function ClientDashboardLoading() {
  return (
    <section className="space-y-8 p-6">
      <DashboardHeaderSkeleton showBadge descriptionLines={2} actionCount={1} />
      <DashboardStatGridSkeleton cards={4} />
      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardChartSkeleton bars={6} />
        <DashboardChartSkeleton bars={4} />
      </div>
      <DashboardTableSkeleton rows={5} columns={4} />
    </section>
  );
}
