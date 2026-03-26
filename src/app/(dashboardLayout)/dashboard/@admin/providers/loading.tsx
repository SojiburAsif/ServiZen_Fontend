import { DashboardHeaderSkeleton, DashboardTableSkeleton } from "@/components/modules/dashboard/dashboard-loading";

export default function AdminProvidersLoading() {
  return (
    <section className="space-y-6 p-6">
      <DashboardHeaderSkeleton descriptionLines={2} actionCount={1} />
      <DashboardTableSkeleton rows={5} columns={4} />
    </section>
  );
}
