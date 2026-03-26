import {
  DashboardHeaderSkeleton,
  DashboardStatGridSkeleton,
  DashboardTableSkeleton,
} from "@/components/modules/dashboard/dashboard-loading";
import LoadingBackground from "@/components/shared/static/LoadingBackground";

export default function ProviderManageServicesLoading() {
  return (
    <LoadingBackground>
      <section className="space-y-6 p-6">
        <DashboardHeaderSkeleton descriptionLines={2} />
        <DashboardStatGridSkeleton cards={2} />
        <DashboardTableSkeleton rows={6} columns={5} />
      </section>
    </LoadingBackground>
  );
}
