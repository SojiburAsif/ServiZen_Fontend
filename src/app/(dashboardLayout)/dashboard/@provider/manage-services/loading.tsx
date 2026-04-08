import {
  DashboardHeaderSkeleton,
  DashboardStatGridSkeleton,
  DashboardTableSkeleton,
} from "@/components/modules/dashboard/dashboard-loading";
import LoadingBackground from "@/components/shared/static/LoadingBackground";

export default function ProviderManageServicesLoading() {
  return (
    <section className="mx-auto max-w-7xl space-y-8">
      <DashboardHeaderSkeleton descriptionLines={1} />
      <DashboardStatGridSkeleton cards={2} />
      <DashboardTableSkeleton rows={6} columns={5} />
    </section>
  );
}
