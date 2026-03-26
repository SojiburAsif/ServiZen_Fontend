import { DashboardHeaderSkeleton, DashboardTableSkeleton } from "@/components/modules/dashboard/dashboard-loading";

export default function AdminPaymentsLoading() {
  return (
    <section className="space-y-6 p-6">
      <DashboardHeaderSkeleton descriptionLines={1} />
      <DashboardTableSkeleton rows={6} columns={5} />
    </section>
  );
}
