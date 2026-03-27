import { DashboardHeaderSkeleton, DashboardTableSkeleton } from "@/components/modules/dashboard/dashboard-loading";

export default function AdminReviewsLoading() {
  return (
    <section className="space-y-6 p-6">
      <DashboardHeaderSkeleton descriptionLines={1} />
      <DashboardTableSkeleton rows={5} columns={5} />
    </section>
  );
}
