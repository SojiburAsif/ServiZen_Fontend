import {
  DashboardHeaderSkeleton,
  DashboardStatGridSkeleton,
  DashboardChartSkeleton,
  DashboardCardListSkeleton,
  DashboardTableSkeleton,
} from "@/components/modules/dashboard/dashboard-loading";

export default function DashboardLoading() {
  return (
    <div className="space-y-8 p-6">
      <DashboardHeaderSkeleton descriptionLines={1} actionCount={1} />
      <DashboardStatGridSkeleton cards={3} />
      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardChartSkeleton bars={6} />
        <DashboardCardListSkeleton cards={3} />
      </div>
      <DashboardTableSkeleton rows={4} columns={4} />
    </div>
  );
}
