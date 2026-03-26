import { DashboardHeaderSkeleton, DashboardFormSkeleton } from "@/components/modules/dashboard/dashboard-loading";

export default function ProviderCreateServiceLoading() {
  return (
    <section className="space-y-8 p-6">
      <DashboardHeaderSkeleton showBadge descriptionLines={2} actionCount={1} />
      <DashboardFormSkeleton />
    </section>
  );
}
